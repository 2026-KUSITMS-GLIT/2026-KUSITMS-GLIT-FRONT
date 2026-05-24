import { api } from "@/api/client";
import type {
  DailySelectableRecords,
  ReportCreateRequest,
  ReportCreateResponse,
} from "@/types/report/report";

// 날짜별 심화 기록 모달 조회
export const getSelectableRecords = (date: string) =>
  api.get<DailySelectableRecords>(`/api/reports/selectable-records/${date}`);

// 리포트 생성 요청
export const createReport = (body: ReportCreateRequest) =>
  api.post<ReportCreateResponse>("/api/reports", body);
