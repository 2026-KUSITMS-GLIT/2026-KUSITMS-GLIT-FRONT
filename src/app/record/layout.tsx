"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Header from "@/components/common/Header";
import Modal from "@/components/common/Modal";
import NavigationBar from "@/components/common/NavigationBar";
import { cn } from "@/lib/utils";

const RECORD_ROUTE_ORDER = [
  "/record",
  "/record/today-task",
  "/record/deep-log",
  "/record/select-skills",
] as const;

const getAnimationDirection = (prevPathname: string, pathname: string) => {
  const prevIndex = RECORD_ROUTE_ORDER.indexOf(prevPathname as (typeof RECORD_ROUTE_ORDER)[number]);
  const currentIndex = RECORD_ROUTE_ORDER.indexOf(pathname as (typeof RECORD_ROUTE_ORDER)[number]);

  if (prevIndex === -1 || currentIndex === -1) return "right";

  return currentIndex < prevIndex ? "left" : "right";
};

const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isRecordHome = pathname === "/record";
  const isTodayTask = pathname === "/record/today-task";
  const isDeepLog = pathname === "/record/deep-log";
  const isSelectSkills = pathname === "/record/select-skills";
  const [canGoDeepLog, setCanGoDeepLog] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const [animationDirection, setAnimationDirection] = useState<"left" | "right">("right");

  useLayoutEffect(() => {
    const nextAnimationDirection = getAnimationDirection(prevPathnameRef.current, pathname);

    setAnimationDirection(nextAnimationDirection);
    prevPathnameRef.current = pathname;
  }, [pathname]);

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
                ? "직무 역량 선택"
                : "오늘의 작업"
        }
        rightLabel={isTodayTask ? "다음" : undefined}
        onLeftClick={isSelectSkills ? () => setIsExitModalOpen(true) : undefined}
        onRightClick={
          isTodayTask && canGoDeepLog ? () => router.push("/record/deep-log") : undefined
        }
        rightDisabled={isTodayTask && !canGoDeepLog}
        rightLabelClassName={isTodayTask && canGoDeepLog ? "text-gray-100" : undefined}
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 [-webkit-overflow-scrolling:touch]">
        {children}
      </main>

      <Modal
        isOpen={isSelectSkills && isExitModalOpen}
        type="double"
        title="정말 그만두시겠어요?"
        contents="지금 나가면 작성 중인 내용이 없어져요"
        btnLLabel="나가기"
        btnRLabel="머무르기"
        onBtnLClick={() => router.back()}
        onBtnRClick={() => setIsExitModalOpen(false)}
        onClose={() => setIsExitModalOpen(false)}
      />

      {isRecordHome && <NavigationBar className="shrink-0" />}
    </div>
  );
};

export default RecordLayout;
