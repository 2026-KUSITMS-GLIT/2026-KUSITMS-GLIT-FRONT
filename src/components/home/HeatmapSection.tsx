"use client";

import "swiper/css";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Heatmap from "@/components/home/Heatmap";
import HeatmapIndicator from "@/components/home/HeatmapIndicator";
import { mockHeatmapDataList } from "@/data/heatmap";

const HeatmapSection = () => {
  const [activeIndex, setActiveIndex] = useState(mockHeatmapDataList.length - 1);

  return (
    <div className="flex flex-col gap-2">
      <Swiper
        className="w-full"
        initialSlide={mockHeatmapDataList.length - 1}
        onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}>
        {mockHeatmapDataList.map(data => {
          const month = Number(data.month.split("-")[1]);
          return (
            <SwiperSlide key={data.month} className="h-auto!">
              <div className="bg-card rounded-12 flex w-full flex-col gap-4 p-4">
                <p className="body-3 text-white">{month}월 기록 출석부</p>
                <Heatmap data={data} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <HeatmapIndicator total={mockHeatmapDataList.length} current={activeIndex} />
    </div>
  );
};

export default HeatmapSection;
