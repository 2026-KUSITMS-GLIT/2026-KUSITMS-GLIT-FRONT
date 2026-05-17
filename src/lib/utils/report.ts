import type { CompetencyStat } from "@/data/report";

export const sumCompetencyCount = (topCategories: CompetencyStat[]): number =>
  topCategories.reduce((sum, item) => sum + item.count, 0);

export const formatReportDate = (createdAt: string): string => createdAt.replace(/-/g, ".");
