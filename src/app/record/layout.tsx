"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Header, { type HeaderAnimationDirection } from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import { cn } from "@/lib/utils";

const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isRecordHome = pathname === "/record";
  const isTodayTask = pathname === "/record/today-task";
  const isDeepLog = pathname === "/record/deep-log";
  const isSelectSkills = pathname === "/record/select-skills";
  const [canGoDeepLog, setCanGoDeepLog] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<HeaderAnimationDirection>("right");

  useEffect(() => {
    const handleTodayTaskReadyChange = (event: Event) => {
      setCanGoDeepLog((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener("today-task-ready-change", handleTodayTaskReadyChange);

    return () => {
      window.removeEventListener("today-task-ready-change", handleTodayTaskReadyChange);
    };
  }, []);

  return (
    <div
      key={pathname}
      className={cn(
        "relative flex size-full min-h-0 flex-col overflow-hidden bg-gray-900",
        animationDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right",
      )}>
      <Header
        title={
          isRecordHome
            ? "기록하기"
            : isDeepLog
              ? "심화 기록할 작업"
              : isSelectSkills
                ? "역량 선택"
                : "오늘의 작업"
        }
        rightLabel={isTodayTask ? "다음" : undefined}
        onRightClick={
          isTodayTask && canGoDeepLog ? () => router.push("/record/deep-log") : undefined
        }
        rightDisabled={isTodayTask && !canGoDeepLog}
        rightLabelClassName={isTodayTask && canGoDeepLog ? "text-gray-100" : undefined}
        onAnimationDirectionChange={setAnimationDirection}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 [-webkit-overflow-scrolling:touch]">
        {children}
      </main>

      {isRecordHome && <NavigationBar className="shrink-0" />}
    </div>
  );
};

export default RecordLayout;
