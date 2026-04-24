import EyeOpenIcon from "@/assets/icons/icon_eye_open.svg";
import EyeCloseIcon from "@/assets/icons/icon_eye_closed.svg";
import ChevronLeftIcon from "@/assets/icons/icon_chevron_left.svg";
import ProgressBar from "@/components/common/ProgressBar";
import Tag from "@/components/common/Tag";

const page = () => {
  return (
    <div>
      <EyeOpenIcon className="text-sea-blue-600 size-8" />
      <EyeCloseIcon className="text-tag-100 size-5" />
      <ChevronLeftIcon className="text-tag-300 size-6" />
      <p className="head-1 text-sea-blue-600">글릿</p>
      <div className="flex w-100 flex-col gap-4">
        <ProgressBar step={1} />
        <ProgressBar step={2} />
        <ProgressBar step={3} />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Tag variant="tag300">로그인하기</Tag>
        <Tag variant="tag400">
          <EyeCloseIcon />
          태그명
        </Tag>
      </div>
    </div>
  );
};

export default page;
