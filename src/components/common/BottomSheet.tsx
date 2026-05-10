"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  onIconClick?: () => void;
  onTextClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  hasOverlay?: boolean;
}

const BottomSheet = ({
  isOpen,
  onClose,
  onIconClick,
  onTextClick,
  text,
  icon,
  children,
  className,
  textClassName,
  hasOverlay = true,
}: BottomSheetProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const openTimer = window.setTimeout(() => {
        setShouldRender(true);
        setIsClosing(false);
      }, 0);

      return () => {
        window.clearTimeout(openTimer);
      };
    }

    if (!shouldRender) return;

    const closingTimer = window.setTimeout(() => {
      setIsClosing(true);
    }, 0);
    const closeTimer = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, 250);

    return () => {
      window.clearTimeout(closingTimer);
      window.clearTimeout(closeTimer);
    };
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const hasHeader = text !== undefined || icon !== undefined;

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-107.5 min-w-93.75 -translate-x-1/2 items-end">
      <button
        type="button"
        aria-label="바텀시트 닫기"
        onClick={onClose}
        className={cn("absolute inset-0 cursor-default", hasOverlay && "bg-gray-900/75")}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "rounded-t-20 bg-gray-850 relative flex max-h-dvh w-full flex-col",
          isClosing ? "animate-slide-out-down" : "animate-slide-in-up",
          className,
        )}>
        <div className="absolute top-4 flex w-full justify-center">
          <div className="h-1.25 w-13.5 rounded-full bg-gray-100" />
        </div>

        {hasHeader && (
          <div className="absolute top-2.5 flex w-full items-center justify-end px-5">
            <div className="flex items-center gap-0.5">
              {text !== undefined && (
                <button
                  type="button"
                  onClick={onTextClick}
                  className={cn("body-3 cursor-pointer px-1 text-gray-600", textClassName)}>
                  {text}
                </button>
              )}
              {icon !== undefined && (
                <button
                  type="button"
                  onClick={onIconClick}
                  aria-label="닫기"
                  className="flex size-6 cursor-pointer items-center justify-center text-white">
                  {icon}
                </button>
              )}
            </div>
          </div>
        )}

        <div className={cn("mt-8.5 flex-1 overflow-y-auto")}>{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
