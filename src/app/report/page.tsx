import { PlusIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import CareerReportSection from "@/components/report/CareerReportSection";
import GaugeBar from "@/components/report/GaugeBar";

const page = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <Header title="리포트" leftIcon={null} />
        <div className="px-5 pb-7.5">
          <p className="text-offwhite-800 body-4">다음 리포트까지 남은 단계</p>
          <div className="flex justify-between pt-1 pb-2.25">
            <span className="head-3 text-gray-100">심화 기록</span>
            <span className="body-2 text-offwhite-800 flex items-end">2/10</span>
          </div>
          <GaugeBar />
        </div>
        <CareerReportSection />
        <div className="px-5">
          <CTA variant="default" leftIcon={<PlusIcon />}>
            기록하기
          </CTA>
        </div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default page;
