import { type ComponentProps } from "react";
import { type Day, type DayButton } from "react-day-picker";

import { cn } from "@/lib/utils";

const datingDayStyle = {
  default: "size-7.5 rounded-full text-white",
  outside: "text-gray-600",
  disabled: "text-gray-600",
  selected: "bg-sea-blue-400 text-black",
  otherSelected: "bg-gray-500 text-black",
  scrum:
    "after:absolute after:top-full after:h-0.75 after:w-7.5 after:rounded-full after:bg-yellow-500",
};

function DatingDayContent({
  children,
  modifiers,
}: Pick<ComponentProps<typeof Day>, "children" | "modifiers">) {
  return (
    <span
      className={cn(
        "relative flex items-center justify-center",
        datingDayStyle.default,
        modifiers.outside && datingDayStyle.outside,
        modifiers.disabled && datingDayStyle.disabled,
        modifiers.selected && datingDayStyle.selected,
        modifiers.otherSelected && datingDayStyle.otherSelected,
        modifiers.scrum && datingDayStyle.scrum,
      )}>
      {children}
    </span>
  );
}

function DatingDay({ className, children, modifiers, ...props }: ComponentProps<typeof Day>) {
  return (
    <td className={cn(className, "body-2 p-0 text-center")} {...props}>
      <DatingDayContent modifiers={modifiers}>{children}</DatingDayContent>
    </td>
  );
}

function DatingDayButton({
  className,
  children,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) {
  return (
    <button
      type="button"
      className={cn(
        className,
        "body-2 flex aspect-square w-full cursor-pointer items-center justify-center",
      )}
      {...props}>
      <DatingDayContent modifiers={modifiers}>{children}</DatingDayContent>
    </button>
  );
}

export { DatingDay, DatingDayButton };
