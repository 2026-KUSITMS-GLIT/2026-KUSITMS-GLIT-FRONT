import CollaborationStone from "@/assets/images/report/collaboration_stone.svg";
import DiscoveryAnalysisStone from "@/assets/images/report/discovery_analysis_stone.svg";
import PlanningExecutionStone from "@/assets/images/report/planning_execution_stone.svg";
import ProblemSolvingStone from "@/assets/images/report/problem_solving_stone.svg";
import ReflectionGrowthStone from "@/assets/images/report/reflection_growth_stone.svg";

const CompetencyStatsSection = () => {
  return (
    <div className="bg-gray-850 rounded-12 flex flex-row p-4">
      <div className="flex flex-1 flex-col items-center">
        <DiscoveryAnalysisStone className="size-9" />
        <p className="body-5 pt-0.75 text-gray-400">발견/분석</p>
        <p className="body-3 text-gray-100">3회</p>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <PlanningExecutionStone className="size-9" />
        <p className="body-5 pt-0.75 text-gray-400">기획/실행</p>
        <p className="body-3 text-gray-100">3회</p>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <ProblemSolvingStone className="size-9" />
        <p className="body-5 pt-0.75 text-gray-400">문제해결/개선</p>
        <p className="body-3 text-gray-100">3회</p>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <CollaborationStone className="size-9" />
        <p className="body-5 pt-0.75 text-gray-400">협업/조율</p>
        <p className="body-3 text-gray-100">10회</p>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <ReflectionGrowthStone className="size-9" />
        <p className="body-5 pt-0.75 text-gray-400">성찰/성장</p>
        <p className="body-3 text-gray-100">10회</p>
      </div>
    </div>
  );
};

export default CompetencyStatsSection;
