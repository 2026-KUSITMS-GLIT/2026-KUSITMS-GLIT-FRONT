"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import ActivitySummarySection from "@/components/report/ActivitySummarySection";
import CompetencyStatsSection from "@/components/report/CompetencyStatsSection";
import MoreStep from "@/components/report/MoreStep";
import MostRecordSection from "@/components/report/MostRecordSection";
import NextFocusPointSection from "@/components/report/NextFocusPointSection";
import TopDetailTagsSection from "@/components/report/TopDetailTagsSection";
import { mockReportDetail } from "@/data/report";

const Page = () => {
  const router = useRouter();

  return (
    <div className="w-full">
      <Header title="미니 리포트" onLeftClick={() => router.push("/report")} />
      <div className="px-5 pt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="body-5 pb-0.5 text-gray-600">2026.04.16</p>
                  <p className="head-4 pb-2 text-gray-100">다솔님의 미니 리포트가 나왔어요</p>
                  <p className="body-5 text-sea-blue-500">벌써 10개의 심화기록이 쌓였어요!</p>
                  <p className="body-5 text-gray-300">얼마나 열심히 기록했는지 확인해볼까요?</p>
                </div>
                <CompetencyStatsSection
                  topCategories={mockReportDetail.content.competencyStats.topCategories}
                />
              </div>
              <TopDetailTagsSection
                topDetailTags={mockReportDetail.content.competencyStats.topDetailTags}
              />
            </div>
            <MoreStep />
            <MostRecordSection
              topCategories={mockReportDetail.content.competencyStats.topCategories}
              topDetailTags={mockReportDetail.content.competencyStats.topDetailTags}
            />
          </div>
          <div className="flex flex-col gap-4">
            <ActivitySummarySection />
            <NextFocusPointSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
