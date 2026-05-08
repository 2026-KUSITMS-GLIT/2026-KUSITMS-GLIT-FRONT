import { cn } from "@/lib/utils";

type ChipState = "default" | "selected" | "unselected";

const STATE_STYLES: Record<ChipState, string> = {
  default: "border-gray-800 bg-gray-800/54 text-white active:bg-gray-800",
  selected: "border-sea-blue-400 bg-gray-800 text-white active:bg-gray-800",
  unselected: "border-transparent bg-gray-800 text-offwhite-400 opacity-30 active:bg-gray-800",
};

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: ChipState;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Chip = ({ state = "default", leftIcon, children, className, ...props }: ChipProps) => {
  return (
    <button
      type="button"
      className={cn(
        "body-4 rounded-6 inline-flex w-fit cursor-pointer items-center border-[0.6px] px-2 py-2.5 transition active:opacity-[0.76]",
        STATE_STYLES[state],
        className,
      )}
      {...props}>
      <div className="flex items-center gap-0.75 px-px [&_svg]:block [&_svg]:size-4 [&_svg]:shrink-0">
        {leftIcon}
        <span>{children}</span>
      </div>
    </button>
  );
};

export default Chip;
