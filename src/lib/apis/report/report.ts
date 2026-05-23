import { api } from "@/api/client";
import type { DailySelectableRecords } from "@/types/report/report";

// 날짜별 심화 기록 모달 조회
export const getSelectableRecords = (date: string) =>
  api.get<DailySelectableRecords>(`/api/reports/selectable-records/${date}`);
