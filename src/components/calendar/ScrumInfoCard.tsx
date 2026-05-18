import Tag from "@/components/common/Tag";

const CATEGORY_LABEL: Record<string, string> = {
  PLANNING_EXECUTION: "기획/실행",
};

interface ScrumInfoCardProps {
  freeText: string;
  primaryCategory: string;
  detailTags: string[];
  images: { imageId: number; imageUrl: string; sortOrder: number }[];
}

const ScrumInfoCard = ({ freeText, primaryCategory, detailTags, images }: ScrumInfoCardProps) => {
  return (
    <div className="bg-scrum-card rounded-12 border-offwhite-800 border-[0.3px] p-4 text-white">
      <div className="flex flex-col gap-3">
        <p className="body-5 text-gray-300">{freeText}</p>
        <div className="flex flex-row gap-1">
          <Tag>{CATEGORY_LABEL[primaryCategory] ?? primaryCategory}</Tag>
          {detailTags.map(tag => (
            <Tag key={tag} variant="gray">
              # {tag}
            </Tag>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          {images.map(img => (
            <div key={img.imageId} className="rounded-8 size-23.5 bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrumInfoCard;
