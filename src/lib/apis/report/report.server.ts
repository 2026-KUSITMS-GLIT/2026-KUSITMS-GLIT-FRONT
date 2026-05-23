import { serverApi } from "@/api/server";
import type { ReportsData, SelectableInfo } from "@/types/report/report";

// 리포트 목록 조회
export const getReports = () => serverApi.get<ReportsData>("/api/reports");

// 리포트 생성용 사전 정보 조회
export const getSelectableInfo = () =>
  serverApi.get<SelectableInfo>("/api/reports/selectable-info");
