"use client";

import { useEffect, useState } from "react";

import HomeRadarSkeleton from "@/components/common/skeleton/HomeRadarSkeleton";
import RadarChart from "@/components/home/RadarChart";
import { getRadar } from "@/lib/apis/home/home";
import { useMe } from "@/lib/hooks/user/userClient";
import type { ActivityStatsData } from "@/types/home/home";

const RadarChartSection = () => {
  const { data: me } = useMe();
  const [data, setData] = useState<ActivityStatsData | null>(null);

  useEffect(() => {
    getRadar().then(res => {
      if (res) setData(res);
    });
  }, []);

  if (!data) {
    return <HomeRadarSkeleton />;
  }

  return (
    <div className="bg-card rounded-12 flex w-full flex-col p-4">
      <p className="body-3 text-white">
        <span suppressHydrationWarning>{me?.nickname ?? ""}</span>님의 역량 기록 분포
      </p>
      <div className="flex items-center justify-center">
        <RadarChart data={data} />
      </div>
    </div>
  );
};

export default RadarChartSection;
