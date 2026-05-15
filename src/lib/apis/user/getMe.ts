import { api } from "@/api/api";
import type { UserProfile } from "@/types/user/user";

export const getMe = () => api.get<UserProfile>("/api/users/me");
