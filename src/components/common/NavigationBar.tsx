"use client";

import { useState } from "react";

import CalendarIcon from "@/assets/icons/icon_calendar.svg";
import HomeIcon from "@/assets/icons/icon_home.svg";
import MypageIcon from "@/assets/icons/icon_mypage.svg";
import ReportIcon from "@/assets/icons/icon_report.svg";
import WriteIcon from "@/assets/icons/icon_write.svg";
import { cn } from "@/lib/utils";

type NavTab = "home" | "calendar" | "write" | "report" | "mypage";

interface NavItem {
  tab: NavTab;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
}

const NAV_ITEMS: NavItem[] = [
  { tab: "home", label: "홈", icon: HomeIcon },
  { tab: "calendar", label: "캘린더", icon: CalendarIcon },
  { tab: "write", label: "기록", icon: WriteIcon },
  { tab: "report", label: "리포트", icon: ReportIcon, iconClassName: "size-8" },
  { tab: "mypage", label: "마이", icon: MypageIcon },
];

interface NavigationBarProps {
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  className?: string;
}

const NavigationBar = ({
  activeTab: initialTab = "home",
  onTabChange,
  className,
}: NavigationBarProps) => {
  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <nav
      className={cn(
        "rounded-t-20 flex w-full justify-between bg-gray-900 px-5 pt-3.75 pb-7.75 [border-top:0.4px_solid_var(--color-gray-800)]",
        className,
      )}>
      {NAV_ITEMS.map(({ tab, label, icon: Icon, iconClassName = "size-6" }) => (
        <button
          key={tab}
          type="button"
          onClick={() => handleTabChange(tab)}
          className={cn(
            "flex cursor-pointer flex-col items-center",
            activeTab === tab ? "text-white" : "text-gray-700",
          )}>
          <span className="flex h-8 shrink-0 items-center justify-center px-2.5">
            <Icon className={iconClassName} />
          </span>
          <span className="body-4">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavigationBar;
