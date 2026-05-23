import { api } from "@/api/client";

// 회원 탈퇴
export const deleteMe = () => api.delete("/api/users/me");
