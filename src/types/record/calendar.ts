// GET /api/calendar/daily
export interface DailyCalendarItem {
  scrumId?: number;
  content?: string;
  hasStar?: boolean;
  isEditable?: boolean;
}

export interface DailyCalendarGroup {
  titleId?: number;
  projectTag?: string;
  freeText?: string;
  primaryCategories?: string[];
  isEditable?: boolean;
  items?: DailyCalendarItem[];
}

export interface DailyCalendarData {
  detailTags?: string[];
  groups?: DailyCalendarGroup[];
}
