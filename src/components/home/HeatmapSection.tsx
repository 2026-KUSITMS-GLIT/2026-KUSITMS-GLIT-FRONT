import Heatmap from "@/components/home/Heatmap";
import HeatmapIndicator from "@/components/home/HeatmapIndicator";
import { mockHeatmapData, mockHeatmapDataList } from "@/data/heatmap";

const HeatmapSection = () => {
  const month = Number(mockHeatmapData.month.split("-")[1]);
  const total = mockHeatmapDataList.length;
  const current = mockHeatmapDataList.findIndex(d => d.month === mockHeatmapData.month);

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-card rounded-12 flex w-full flex-col gap-4 p-4">
        <p className="body-3 text-white">{month}월 기록 출석부</p>
        <Heatmap data={mockHeatmapData} />
      </div>
      <HeatmapIndicator total={total} current={current} />
    </div>
  );
};

export default HeatmapSection;
