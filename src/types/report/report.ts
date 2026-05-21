// API: GET /api/reports
export type ReportType = "MINI" | "CAREER";
export type ReportStatus = "GENERATING" | "SUCCESS" | "FAILED";

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
