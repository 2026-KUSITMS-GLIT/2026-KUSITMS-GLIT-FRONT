export const loginWithSocial = (provider: string) => {
  const env = process.env.NODE_ENV === "development" ? "local" : "production";
  window.location.assign(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/${provider}?env=${env}`,
  );
};
