export type ReportType = "MINI" | "CAREER";
export type ReportStatus = "GENERATING" | "SUCCESS" | "FAILED";

// API: GET /api/reports
export interface Report {
  reportId: number;
  reportType: ReportType;
  status: ReportStatus;
  createdAt: string;
  title: string | null;
  previewText: string;
  competencyStatSummary: string | null;
}

export interface ReportsData {
  reports: Report[];
}

// API: GET /api/reports/selectable-info
export interface SelectableInfo {
  reportType: ReportType;
  totalStarCount: number;
  autoSelectedStarRecordIds: number[];
  starRecordDates: string[]; // "YYYY-MM-DD"[]
}

// API: GET /api/reports/selectable-records/{date}
export interface DailySelectableRecord {
  starRecordId: number;
  projectName: string;
  scrumContent: string;
}

export interface DailySelectableRecords {
  date: string; // "YYYY-MM-DD"
  starRecords: DailySelectableRecord[];
}

// API: GET /api/reports/gauge
export interface ReportGauge {
  currentCount: number;
  nextThreshold: number;
  progressRate: number;
  isGeneratable: boolean;
}

// API: GET /api/reports/{reportId}/status
export interface ReportStatusResponse {
  reportId: number;
  status: ReportStatus;
  retryAvailable: boolean | null;
}

// API: POST /api/reports
export interface ReportCreateRequest {
  reportType: ReportType;
  starRecordIds: number[];
}

export interface ReportCreateResponse {
  reportId: number;
}
