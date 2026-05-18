import type { AlarmData } from "@/types/user/notification";

export const mockAlarmData: AlarmData = {
  isActive: true,
  settings: [
    { dayOfWeek: "TUE", notifyTime: "19:00" },
    { dayOfWeek: "THU", notifyTime: "19:00" },
    { dayOfWeek: "SAT", notifyTime: "19:00" },
  ],
};
