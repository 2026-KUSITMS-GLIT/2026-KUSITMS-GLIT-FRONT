"use client";

import { useParams, useRouter } from "next/navigation";

import ScrumInfoCard from "@/components/calendar/ScrumInfoCard";
import Header from "@/components/common/Header";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="flex h-screen w-full flex-col">
      <Header title="밋업 프로젝트" onLeftClick={() => router.push(`/calendar/${params.id}`)} />
      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-4">
        <ScrumInfoCard />
      </div>
    </div>
  );
};

export default Page;
