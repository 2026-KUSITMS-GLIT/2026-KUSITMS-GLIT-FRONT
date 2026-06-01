import { api } from "@/api/client";
import type { DailyCalendarData } from "@/types/record/calendar";

// 일자별 스크럼 조회
export const getDailyCalendar = (date: string) =>
  api.get<DailyCalendarData>("/api/calendar/daily", { date });
