import { CancelIcon, ErrorIcon, SuccessIcon } from "@/assets/icons";
import { cn } from "@/lib/utils/cn";

const MAX_LENGTH = 31;

interface ToastProps {
  contents: string;
  variant?: "error" | "success";
  leftIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
}

const Toast = ({
  contents,
  variant = "error",
  leftIcon,
  showLeftIcon = true,
  showCloseButton = true,
  onClose,
  className,
}: ToastProps) => {
  const defaultLeftIcon =
    variant === "success" ? (
      <SuccessIcon className="-mt-0.5 size-6" />
    ) : (
      <ErrorIcon className="-mt-0.5 size-6 text-yellow-500" />
    );

  return (
    <div
      className={cn(
        "rounded-8 inline-flex items-center gap-18.5 bg-[rgba(43,43,43,0.95)] p-3",
        className,
      )}>
      <div className="flex items-center gap-2">
        {showLeftIcon && (leftIcon ?? defaultLeftIcon)}
        <span className="body-4 text-gray-100">{contents.slice(0, MAX_LENGTH)}</span>
      </div>
      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex shrink-0 cursor-pointer items-center justify-center">
          <CancelIcon className="size-6 text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default Toast;
