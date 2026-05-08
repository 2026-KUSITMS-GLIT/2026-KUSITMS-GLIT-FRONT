import Link from "next/link";

import { StarTwoIcon } from "@/assets/icons";
import CTA from "@/components/common/CTA";
import NavigationBar from "@/components/common/NavigationBar";

const page = () => {
  return (
    <>
      <div className="px-5">
        <p className="head-5 text-center text-white">
          오늘의 경험을 기록하고 <br /> 다솔님의 강점을 확인해보세요
        </p>
        <Link href="/record">
          <CTA leftIcon={<StarTwoIcon />}>기록하러 가기</CTA>
        </Link>
        {/* 레이더 차트 */}
        {/* 잔디 */}
      </div>
      <NavigationBar className="absolute right-0 bottom-0 left-0" />
    </>
  );
};

export default page;
