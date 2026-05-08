import Heatmap from "@/components/home/Heatmap";
import { mockHeatmapData } from "@/data/heatmap";

const HeatmapSection = () => {
  const month = Number(mockHeatmapData.month.split("-")[1]);

  return (
    <div className="bg-card rounded-12 flex w-full flex-col gap-4 p-4">
      <p className="body-3 text-white">{month}월 기록 출석부</p>
      <Heatmap data={mockHeatmapData} />
    </div>
  );
};

export default HeatmapSection;
