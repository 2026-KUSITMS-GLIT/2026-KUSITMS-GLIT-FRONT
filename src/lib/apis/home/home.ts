import { api } from "@/api/client";
import type { ActivityStatsResponse, MonthlyGrassData } from "@/types/home/home";

// 역량 레이더 차트 조회
export const getRadar = () => api.get<ActivityStatsResponse>("/api/home/radar");

// 월별 역량 잔디 조회
export const getCompetencyStats = (month: string) =>
  api.get<MonthlyGrassData>("/api/home/competency-stats", { month });
