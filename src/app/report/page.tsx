import Header from "@/components/common/Header";
import CareerReportSection from "@/components/report/CareerReportSection";

const page = () => {
  return (
    <div>
      <Header title="리포트" leftIcon={null} />
      <div className="px-5 pb-7.5">
        <p className="text-offwhite-800 body-4">다음 리포트까지 남은 단계</p>
        <div className="flex justify-between pt-1">
          <span className="head-3 text-gray-100">심화 기록</span>
          <span className="body-2 text-offwhite-800 flex items-end">2/10</span>
        </div>
        {/* 진행률 바 위치 */}
      </div>
      <CareerReportSection />
    </div>
  );
};

export default page;
