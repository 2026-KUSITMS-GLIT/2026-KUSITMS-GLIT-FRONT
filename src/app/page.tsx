import EyeOpenIcon from "@/assets/icons/icon_eye_open.svg";
import EyeCloseIcon from "@/assets/icons/icon_eye_closed.svg";
import ChevronLeftIcon from "@/assets/icons/icon_chevron_left.svg";

const page = () => {
  return (
    <div>
      <EyeOpenIcon className="text-sea-blue-600 size-8" />
      <EyeCloseIcon className="text-tag-100 size-5" />
      <ChevronLeftIcon className="text-tag-300 size-6" />
      <p className="head-1 text-sea-blue-600">글릿</p>
    </div>
  );
};

export default page;
