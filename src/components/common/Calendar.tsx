"use client";

import * as React from "react";
import { DayPicker, type DayButton, type Locale } from "react-day-picker";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@/assets/icons";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("body-2 group/calendar bg-gray-850 rounded-8 p-2 text-white", className)}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatCaption: date => `${date.getMonth() + 1}월`,
        formatWeekdayName: date => ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
        ...formatters,
      }}
      classNames={{
        root: "w-fit max-w-full",
        months: "relative flex w-fit max-w-full flex-col gap-4 md:flex-row",
        month: "flex w-fit max-w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 grid h-6.25 grid-cols-7 items-center gap-x-5",
        button_previous:
          "col-start-1 flex size-6 cursor-pointer items-center justify-center justify-self-center p-0.5 text-white",
        button_next:
          "col-start-7 flex size-6 cursor-pointer items-center justify-center justify-self-center p-0.5 text-white",
        month_caption: "flex h-6.25 w-full items-center justify-center",
        caption_label: "body-3 text-white select-none",
        table: "w-full border-collapse",
        weekdays: "grid grid-cols-7 gap-x-5",
        weekday: "body-4 text-center text-white select-none first:text-error-primary",
        weeks: "mt-4 flex flex-col gap-y-4",
        week: "grid w-full grid-cols-7 gap-x-5",
        day: "body-2 p-0 text-center",
        today: "text-white data-[selected=true]:rounded-none",
        outside: "text-gray-600",
        disabled: "text-gray-600",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-6", className)} {...props} />;
          }

          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-6", className)} {...props} />;
          }

          return <></>;
        },
        DayButton: ({ ...props }) => <CalendarDayButton locale={locale} {...props} />,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  return (
    <button
      type="button"
      data-day={day.date.toLocaleDateString(locale?.code)}
      className={cn(className, "body-2 flex aspect-square w-full items-center justify-center")}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
