import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type CTAVariant = "gradient" | "primary";
type CTASize = "lg" | "md";

const VARIANT_STYLES: Record<CTAVariant | "gray", string> = {
  gradient: "bg-cta-gradient active:bg-cta-gradient-tap text-typo-primary",
  primary: "bg-sea-blue-400 active:bg-sea-blue-400/[.93] text-typo-primary",
  gray: "bg-gray-400/40 text-offwhite-500",
};

const SIZE_STYLES: Record<CTASize, string> = {
  lg: "h-13 py-3 px-6 rounded-12 body-3",
  md: "h-10 py-2.5 px-3.5 rounded-8 body-4",
};

const WIDTH_STYLES: Record<CTASize, string> = {
  lg: "w-83.75",
  md: "w-34.5",
};

interface CTAProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CTAVariant;
  size?: CTASize;
  children: React.ReactNode;
}

const CTA = forwardRef<HTMLButtonElement, CTAProps>(
  ({ variant = "gradient", size = "lg", children, className, type, disabled, ...props }, ref) => {
    const activeVariant = disabled ? "gray" : variant;

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={disabled}
        className={cn(
          "inline-flex cursor-pointer flex-row items-center justify-center transition-colors disabled:cursor-not-allowed",
          WIDTH_STYLES[size],
          VARIANT_STYLES[activeVariant],
          SIZE_STYLES[size],
          className,
        )}
        {...props}>
        <span className="truncate pt-0.5 text-center">{children}</span>
      </button>
    );
  },
);
CTA.displayName = "CTA";

export default CTA;
