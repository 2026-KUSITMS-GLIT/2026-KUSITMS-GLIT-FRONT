"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

interface GuidanceProps extends React.PropsWithChildren<
  Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">
> {
  defaultOpen?: boolean;
  items?: readonly string[];
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const defaultDropItems = [
  "팀 프로젝트에서 기능 명세를 내가 처음 잡아야 했던 상황",
  "대외활동 중 행사를 기획하게 됐는데 기한은 2주밖에 없었던 경험",
  "공모전 기획안을 팀장으로서 처음부터 끝까지 리드해야 했던 상황",
] as const;

const Guidance = ({
  defaultOpen = false,
  items = defaultDropItems,
  children,
  className,
  onClick,
  ...props
}: GuidanceProps) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const canDrop = items.length > 0;

  const handleTitleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    onClick?.(event);

    if (event.defaultPrevented || !canDrop) {
      return;
    }

    setIsOpen(prev => !prev);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <button
        type="button"
        aria-expanded={canDrop ? isOpen : undefined}
        aria-controls={canDrop ? panelId : undefined}
        className="body-3 text-sea-blue-400 w-fit cursor-pointer text-left underline underline-offset-4"
        onClick={handleTitleClick}>
        {children}
      </button>
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
