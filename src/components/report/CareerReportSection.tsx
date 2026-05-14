import ReportCard from "@/components/report/ReportCard";
import { mockReports, Report } from "@/data/report";

interface CareerReportSectionProps {
  reports?: Report[];
}

const CareerReportSection = ({ reports = mockReports }: CareerReportSectionProps) => {
  return (
    <div className="rounded-20 border-t-gray-850 border-b-gray-850 flex flex-col gap-4 border-t border-b px-5 py-7.5 text-white">
      <p className="head-5 pl-1 text-gray-100">내 커리어 리포트</p>
      <div className="scrollbar-hide flex h-80 flex-col gap-4 overflow-y-scroll">
        {reports.map(report => (
          <ReportCard key={report.reportId} report={report} />
        ))}
      </div>
    </div>
  );
};

export default CareerReportSection;
