import { api } from "@/api/client";
import type { AlarmData } from "@/types/user/notification";

export const getAlarmSettings = () => api.get<AlarmData>("/api/users/me/notification-settings");

export const patchAlarmSettings = (body: AlarmData) =>
  api.patch("/api/users/me/notification-settings", body);
