import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg";

const ReportCard = () => {
  return (
    <div className="border-linear-100 rounded-8 px-6 py-4 text-white">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-3">
            <p className="body-3 text-white">미니 리포트</p>
            <p className="body-4 text-gray-800">2026.04.12</p>
          </div>
          <ChevronRightIcon className="size-6 text-gray-100" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="body-2 text-gray-300">
            000님은 문제를 구조화하고, 데이터로 해결하는 기획자입니다.
          </span>
          <span className="body-4 line-clamp-2 text-gray-700">
            &rdquo;꾸준함이 만든 변화&rdquo;가 가장 크게 보인 시기였어요. 기록을 통해 스스로를
            돌아보는 빈도가 늘어나면서, 작은 행동이 큰 결실을 맺을 수 있다고 생각합니다.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
