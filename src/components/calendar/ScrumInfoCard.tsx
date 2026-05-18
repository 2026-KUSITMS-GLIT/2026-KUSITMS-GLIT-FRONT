import Tag from "@/components/common/Tag";

const ScrumInfoCard = () => {
  return (
    <div className="bg-scrum-card rounded-12 border-offwhite-800 border-[0.3px] p-4 text-white">
      <div className="flex flex-col gap-3">
        <div>
          <p className="body-5 text-gray-300">기획 작업</p>
          <p className="body-3 text-gray-100">유저 리서치 문항 설계</p>
        </div>
        <div className="flex flex-row gap-1">
          <Tag>기획/실행</Tag>
          <Tag variant="gray"># UX 설계</Tag>
          <Tag variant="gray"># 품질 관리</Tag>
          <Tag variant="gray"># 데이터 분석</Tag>
        </div>
        <div className="flex flex-row gap-3">
          <div className="rounded-8 size-23.5 bg-gray-200" />
          <div className="rounded-8 size-23.5 bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ScrumInfoCard;
