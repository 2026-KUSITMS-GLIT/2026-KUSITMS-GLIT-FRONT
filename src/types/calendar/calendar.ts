export type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

// 월별 캘린더 데이터 조회
export interface CalendarDayInfo {
  date?: string;
  hasScrums?: boolean;
  hasStar?: boolean;
  primaryCategory?: Competency | null;
  starCount?: number;
}

export interface CalendarMonthlyResponse {
  month?: string;
  days?: CalendarDayInfo[];
}

// 날짜 프리뷰 조회
export interface CalendarTitlePreview {
  titleId?: number;
  projectName?: string;
  freeText?: string;
  primaryCategories?: Competency[];
  scrumCount?: number;
  hasStarAny?: boolean;
}

export interface CalendarDailyPreviewResponse {
  date?: string;
  titles?: CalendarTitlePreview[];
}
