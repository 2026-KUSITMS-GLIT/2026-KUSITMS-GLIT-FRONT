"use client";

import { useParams, useRouter } from "next/navigation";

import ScrumInfoCard from "@/components/calendar/ScrumInfoCard";
import Header from "@/components/common/Header";
import { mockStarRecordDetail } from "@/data/calendar";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const data = mockStarRecordDetail;

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title={data.projectName} onLeftClick={() => router.push(`/calendar/${params.id}`)} />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-4">
        <ScrumInfoCard
          freeText={data.freeText}
          primaryCategory={data.primaryCategory}
          detailTags={data.detailTags}
          images={data.images}
        />
      </div>
    </div>
  );
};

export default Page;
