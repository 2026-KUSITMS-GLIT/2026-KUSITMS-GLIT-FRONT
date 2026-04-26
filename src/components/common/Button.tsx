import { cn } from "@/lib/utils";

type ButtonVariant = "gradient" | "primary" | "gray";
type ButtonSize = "lg" | "md";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  gradient: "bg-btn-gradient active:bg-btn-gradient-tap text-typo-primary",
  primary: "bg-sea-blue-400 active:bg-sea-blue-400/[.93] text-typo-primary",
  gray: "bg-gray-800 text-offwhite-500 disabled:cursor-not-allowed",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  lg: "w-83.75 h-13 py-3 px-6 rounded-12 flex-row items-center justify-center gap-1 body-3 [&_svg]:size-6",
  md: "w-34.5 h-10 py-2.5 px-3.5 rounded-8 flex-row items-center justify-center gap-0.5 body-4 [&_svg]:size-4",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = ({
  variant = "primary",
  size = "lg",
  fullWidth = true,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) => {
  const activeVariant = props.disabled ? "gray" : variant;

  return (
    <button
      className={cn(
        "inline-flex transition-colors cursor-pointer",
        fullWidth ? "w-full flex-1" : "w-fit",
        VARIANT_STYLES[activeVariant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {leftIcon && (
        <span className="flex shrink-0 items-center justify-center [&_svg]:block">
          {leftIcon}
        </span>
      )}
      <span className="text-center truncate pt-0.5">{children}</span>
      {rightIcon && (
        <span className="flex shrink-0 items-center justify-center [&_svg]:block">
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
