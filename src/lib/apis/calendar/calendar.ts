import { api } from "@/api/client";
import type {
  CalendarDailyPreviewResponse,
  CalendarDayInfo,
  CalendarMonthlyResponse,
  CalendarTitlePreview,
} from "@/types/calendar/calendar";

export type {
  CalendarDailyPreviewResponse,
  CalendarDayInfo,
  CalendarMonthlyResponse,
  CalendarTitlePreview,
};

// 월별 캘린더 데이터 조회
export const getMonthlyCalendar = (month: string) =>
  api.get<CalendarMonthlyResponse>("/api/calendar/monthly", { month });

// 날짜 프리뷰 조회
export const getDailyCalendarPreview = (date: string) =>
  api.get<CalendarDailyPreviewResponse>("/api/calendar/daily-preview", { date });
