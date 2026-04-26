import { cn } from "@/lib/utils";
import BackIcon from "@/assets/icons/icon_back.svg";

interface HeaderProps {
  title?: string;
  leftIcon?: React.ReactNode;
  onLeftClick?: () => void;
  className?: string;
}

const Header = ({
  title,
  leftIcon,
  onLeftClick,
  className,
}: HeaderProps) => {
  const renderLeftIcon = leftIcon === undefined ? <BackIcon className="size-7" /> : leftIcon;

  return (
    <header
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] h-16 w-full items-center px-4.5 py-4.25 bg-gray-900 text-white",
        className
      )}
    >
      <div className="flex justify-start">
        {renderLeftIcon && (
          <button
            type="button"
            onClick={onLeftClick}
            className="flex items-center justify-center p-2 -ml-2 cursor-pointer transition-opacity hover:opacity-80 disabled:cursor-not-allowed"
          >
            {renderLeftIcon}
          </button>
        )}
      </div>

      <div className="flex justify-center">
        {title && (
          <h1 className="body-2 text-center truncate">
            {title}
          </h1>
        )}
      </div>
      <div />
    </header>
  );
};

export default Header;
