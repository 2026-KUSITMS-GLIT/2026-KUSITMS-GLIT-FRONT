import { cn } from "@/lib/utils";

type CTAButtonVariant = "gradient" | "primary" | "gray";
type CTAButtonSize = "lg" | "md";

const VARIANT_STYLES: Record<CTAButtonVariant, string> = {
  gradient: "bg-cta-gradient active:bg-cta-gradient-tap text-typo-primary",
  primary: "bg-sea-blue-400 active:bg-sea-blue-400/[.93] text-typo-primary",
  gray: "bg-gray-800 text-offwhite-500 disabled:cursor-not-allowed",
};

const SIZE_STYLES: Record<CTAButtonSize, string> = {
  lg: "h-13 py-3 px-6 rounded-12 flex-row items-center justify-center gap-1 body-3 [&_svg]:size-6",
  md: "h-10 py-2.5 px-3.5 rounded-8 flex-row items-center justify-center gap-0.5 body-4 [&_svg]:size-4",
};

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const CTAButton = ({
  variant = "primary",
  size = "lg",
  fullWidth = true,
  leftIcon,
  rightIcon,
  children,
  className,
  type,
  ...props
}: CTAButtonProps) => {
  const activeVariant = props.disabled ? "gray" : variant;

  return (
    <button
      type={type ?? "button"}
      className={cn(
        "inline-flex cursor-pointer transition-colors",
        fullWidth ? "w-full" : size === "lg" ? "w-83.75" : "w-34.5",
        VARIANT_STYLES[activeVariant],
        SIZE_STYLES[size],
        className,
      )}
      {...props}>
      {leftIcon && (
        <span className="flex shrink-0 items-center justify-center [&_svg]:block">{leftIcon}</span>
      )}
      <span className="truncate pt-0.5 text-center">{children}</span>
      {rightIcon && (
        <span className="flex shrink-0 items-center justify-center [&_svg]:block">{rightIcon}</span>
      )}
    </button>
  );
};

export default CTAButton;
