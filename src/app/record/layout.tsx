"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import { cn } from "@/lib/utils";

const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isRecordHome = pathname === "/record";

  return (
    <div
      className={cn(
        "relative flex size-full min-h-0 flex-col overflow-hidden bg-gray-900",
        isRecordHome ? "animate-slide-in-left" : "animate-slide-in-right",
      )}>
      <Header
        title={isRecordHome ? "기록하기" : "오늘의 작업"}
        rightLabel={isRecordHome ? undefined : "다음"}
        onRightClick={isRecordHome ? undefined : () => {}}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4 [-webkit-overflow-scrolling:touch]">
        {children}
      </main>

      {isRecordHome && <NavigationBar className="shrink-0" />}
    </div>
  );
};

export default RecordLayout;
