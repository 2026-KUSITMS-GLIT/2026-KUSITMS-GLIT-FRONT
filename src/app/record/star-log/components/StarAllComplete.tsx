import Image from "next/image";

import HeartImage from "@/assets/images/record/hearts-3.png";

const StarAllComplete = () => {
  return (
    <section className="-mx-5 flex min-h-0 flex-1 flex-col bg-[radial-gradient(90%_35%_at_50%_0%,color-mix(in_srgb,var(--color-sea-blue-600)_54%,var(--color-white)_10%)_0%,color-mix(in_srgb,var(--color-sea-blue-600)_32%,transparent)_45%,transparent_100%),radial-gradient(90%_35%_at_50%_100%,color-mix(in_srgb,var(--color-sea-blue-600)_54%,var(--color-white)_10%)_0%,color-mix(in_srgb,var(--color-sea-blue-600)_32%,transparent)_45%,transparent_100%),linear-gradient(180deg,var(--color-gray-900)_0%,var(--color-gray-900)_100%)] px-5">
      <div className="flex-[0.4]" />
      <div className="flex flex-col items-center">
        <Image src={HeartImage} alt="모든 작업 기록 완료" width={128} height={128} priority />
        <p className="head-4 mt-3.75 text-white">모든 작업 기록 완료</p>
      </div>
      <div className="flex-[0.4]" />
    </section>
  );
};

export default StarAllComplete;
