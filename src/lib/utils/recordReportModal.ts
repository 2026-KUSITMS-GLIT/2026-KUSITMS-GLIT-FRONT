import type { ReportModalType } from "@/types/record/record";

const PENDING_REPORT_MODAL_KEY = "pending-report-modal";

const isReportModalType = (value: string | null): value is ReportModalType =>
  value === "MINI" || value === "FULL";

export const savePendingReportModal = (type: ReportModalType) => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(PENDING_REPORT_MODAL_KEY, type);
};

export const consumePendingReportModal = (): ReportModalType | null => {
  if (typeof window === "undefined") return null;

  const value = window.sessionStorage.getItem(PENDING_REPORT_MODAL_KEY);
  window.sessionStorage.removeItem(PENDING_REPORT_MODAL_KEY);

  return isReportModalType(value) ? value : null;
};
