export type ReportType = "MINI" | "CAREER";
export type ReportStatus = "GENERATING" | "SUCCESS" | "FAILED";
export type CompetencyCategory =
  | "DISCOVERY_ANALYSIS"
  | "PLANNING_EXECUTION"
  | "PROBLEM_SOLVING"
  | "COLLABORATION"
  | "REFLECTION_GROWTH";

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

// API: POST /api/reports, POST /api/reports/{reportId}/retry
export interface ReportCreateResponse {
  reportId: number;
}

// API: GET /api/reports/{reportId}
// 면접관이 파고들 포인트 + 강점 심화 기록
export interface EvidenceRecord {
  id: number;
  scrumTitle: string;
  createdAt: string;
  projectName: string;
}

// 강점
export interface Strength {
  title: string;
  description: string;
  evidences: EvidenceRecord[];
}

// 도출 근거 태크 + 개수
export interface TopTag {
  tag: string;
  count: number;
}

// 면접관이 파고들 포인트
export interface InterviewQuestion {
  question: string;
  evidences: EvidenceRecord[];
}

// 커리어 리포트 content
export interface CareerReportContent {
  strengths: Strength[];
  brandingStatement: string;
  brandingPattern: string;
  topDetailTags: TopTag[];
  narrativeSummary: string;
  interviewQuestions: InterviewQuestion[];
  experienceHighlights: string[];
}

// 미니 리포트 5대 역량 + 개수
export interface CompetencyStat {
  category: CompetencyCategory;
  count: number;
}

export interface CompetencyStats {
  topCategories: CompetencyStat[];
  topDetailTags: string[];
}

// 미니 리포트 content
export interface MiniReportContent {
  nextFocusPoint: string;
  activitySummary: string;
  competencyStats: CompetencyStats;
}

export interface MiniReportDetail {
  reportId: number;
  reportType: "MINI";
  createdAt: string;
  selectedStarCount: number;
  content: MiniReportContent;
}

export interface CareerReportDetail {
  reportId: number;
  reportType: "CAREER";
  createdAt: string;
  selectedStarCount: number;
  content: CareerReportContent;
}

export type ReportDetailResponse = MiniReportDetail | CareerReportDetail;
