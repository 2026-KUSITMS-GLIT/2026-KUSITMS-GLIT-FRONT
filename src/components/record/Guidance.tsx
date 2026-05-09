"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type GuidanceVariant = "default" | "drop";

interface GuidanceProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  variant?: GuidanceVariant;
  items?: readonly string[];
}

const defaultDropItems = [
  "팀 프로젝트에서 기능 명세를 내가 처음 잡아야 했던 상황",
  "대외활동 중 행사를 기획하게 됐는데 기한은 2주밖에 없었던 경험",
  "공모전 기획안을 팀장으로서 처음부터 끝까지 리드해야 했던 상황",
] as const;

const Guidance = ({
  variant = "default",
  items = defaultDropItems,
  children,
  className,
  ...props
}: GuidanceProps) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const isDrop = variant === "drop";
  const canDrop = isDrop && items.length > 0;

  return (
    <div
      data-variant={variant}
      className={cn(
        "flex flex-col",
        isDrop ? "items-start text-left" : "items-center text-center",
        className,
      )}
      {...props}>
      {canDrop ? (
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="body-3 text-sea-blue-400 w-fit cursor-pointer text-left underline underline-offset-4"
          onClick={() => setIsOpen(prev => !prev)}>
          {children}
        </button>
      ) : (
        <p className="body-3 text-sea-blue-400 w-fit cursor-pointer text-center underline underline-offset-4">
          {children}
        </p>
      )}
      {canDrop && (
        <div
          id={panelId}
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={cn("drop-panel", isOpen && "drop-panel-open")}>
          <ul
            className={cn(
              "drop-list body-4 text-gray-750 flex flex-col items-start text-left",
              isOpen && "drop-list-open",
            )}>
            {items.map(item => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Guidance;
