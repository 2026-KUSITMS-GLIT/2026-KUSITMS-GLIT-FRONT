import { api } from "@/api/client";
import type { ActivityStatsResponse, MonthlyGrassResponse } from "@/types/home/home";

// 역량 레이더 차트 조회
export const getRadar = () => api.get<ActivityStatsResponse>("/api/home/radar");

// 월별 역량 잔디 조회
export const getCompetencyStats = () => api.get<MonthlyGrassResponse>("/api/home/competency-stats");
