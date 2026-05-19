import { NextRequest, NextResponse } from "next/server";

// 인증 없이 접근 가능한 경로 목록
const PUBLIC_PATHS = ["/auth", "/auth/callback"];
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// accessToken이 없을 때 refreshToken으로 /api/auth/reissue를 직접 호출
async function tryReissue(request: NextRequest): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (!refreshToken) return null;

  try {
    const isDev = process.env.NODE_ENV === "development";
    const cookieHeader = `refreshToken=${refreshToken}`;

    const response = await fetch(`${BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      ...(isDev ? { body: JSON.stringify({ refreshToken }) } : {}),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || !data.data) return null;

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    const res = NextResponse.next();
    const secure = process.env.NODE_ENV === "production";

    res.cookies.set("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure,
    });
    if (newRefreshToken) {
      res.cookies.set("refreshToken", newRefreshToken, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure,
      });
    }
    return res;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const accessToken = request.cookies.get("accessToken")?.value;
  if (accessToken) return NextResponse.next();

  const reissued = await tryReissue(request);
  if (reissued) return reissued;

  return NextResponse.redirect(new URL("/auth", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
