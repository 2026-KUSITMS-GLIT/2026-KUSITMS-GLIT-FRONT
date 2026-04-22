export interface ButtonProps {
  /** Is this the principal call to action on the page? */
  primary?: boolean;
  /** What background color to use */
  backgroundColor?: string;
  /** How large should the button be? */
  size?: "small" | "medium" | "large";
  /** Button contents */
  label: string;
  /** Optional click handler */
  onClick?: () => void;
}

/** Primary UI component for user interaction */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const base = "inline-block cursor-pointer border-0 rounded-full font-bold leading-none font-sans";

  const variant = primary ? "bg-yellow-500 text-black" : "bg-transparent text-gray-900";

  const sizeClass = {
    small: "px-4 py-2.5 text-xs",
    medium: "px-5 py-3 text-sm",
    large: "px-6 py-3 text-base",
  }[size];

  return (
    <button
      type="button"
      className={[base, variant, sizeClass].join(" ")}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}>
      {label}
    </button>
  );
};
