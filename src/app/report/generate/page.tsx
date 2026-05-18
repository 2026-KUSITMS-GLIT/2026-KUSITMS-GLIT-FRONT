"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

import characterLiedown from "@/assets/images/report/character_liedown.png";

const Page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const title =
    type === "mini" ? "미니 리포트를 생성하고 있어요!" : "커리어 리포트를 생성하고 있어요!";

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Image src={characterLiedown} alt="리포트 생성 중" width={173} height={104} />
      <p className="head-3 pb-1 text-gray-100">{title}</p>
      <p className="text-typo-tertiary body-2 pb-7">최대 1분 정도 소요될 수 있어요.</p>
      <p className="body-3 text-gradient-100">80% 완료</p>
    </div>
  );
};

export default Page;
