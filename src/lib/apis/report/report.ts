import { serverApi } from "@/api/server";
import type { ReportsData } from "@/types/report/report";

// 리포트 목록 조회
export const getReports = () => serverApi.get<ReportsData>("/api/reports");
