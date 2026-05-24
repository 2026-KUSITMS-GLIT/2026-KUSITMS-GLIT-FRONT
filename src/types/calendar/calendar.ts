export type Competency =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "COLLABORATION"
  | "PROBLEM_SOLVING"
  | "REFLECTION_GROWTH";

// GET /api/calendar/monthly
export type CalendarDay = {
  date: string;
  hasScrums: boolean;
  hasStar: boolean;
  primaryCategory: Competency | null;
  starCount: number;
};

export type CalendarMonthlyData = {
  month: string;
  days: CalendarDay[];
};
// ---

// CalendarDailyPreviewResponse
export type CalendarDailyScrum = {
  scrumId: number;
  projectName: string;
  freeText: string;
  content: string;
  primaryCategory: string | null;
  detailTags: string[] | null;
  hasStar: boolean;
};

export type CalendarDailyPreviewData = {
  date: string;
  scrums: CalendarDailyScrum[];
};

// CalendarDailyResponse
export type CalendarDailyScrumItem = {
  scrumId: number;
  content: string;
  hasStar: boolean;
  isEditable: boolean;
  primaryCategory: string | null; // 임시
};

export type CalendarDailyGroup = {
  titleId: number;
  projectTag: string;
  freeText: string;
  isEditable: boolean;
  items: CalendarDailyScrumItem[];
};

export type CalendarDailyData = {
  receivedTags: string[]; // 임시
  groups: CalendarDailyGroup[];
};

// API response types
export interface CalendarDayInfo {
  date?: string;
  hasScrums?: boolean;
  hasStar?: boolean;
  primaryCategory?: Competency | null;
  starCount?: number;
}

export interface CalendarTitlePreview {
  titleId?: number;
  projectName?: string;
  freeText?: string;
  primaryCategories?: Competency[];
  scrumCount?: number;
  hasStarAny?: boolean;
}
