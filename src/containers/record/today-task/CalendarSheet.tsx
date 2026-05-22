import Calendar from "@/components/calendar/Calendar";
import BottomSheet from "@/components/common/BottomSheet";
import { getSelectableRecordDateRange } from "@/lib/utils/calendar";
import { cn } from "@/lib/utils/cn";

interface CalendarSheetProps {
  isOpen: boolean;
  selectedDate: Date | null;
  isScrumDate: (date: Date) => boolean;
  doneEnabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  onCalendarDayClick: (date: Date) => void;
}

const CalendarSheet = ({
  isOpen,
  selectedDate,
  isScrumDate,
  doneEnabled,
  onClose,
  onConfirm,
  onSelectDate,
  onMonthChange,
  onCalendarDayClick,
}: CalendarSheetProps) => {
  const { start, end } = getSelectableRecordDateRange();

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      text="완료"
      onTextClick={onConfirm}
      textDisabled={!doneEnabled}
      textClassName={cn(doneEnabled && "text-sea-blue-500")}>
      <div className="w-full px-5 pt-2.5 pb-7.5">
        <Calendar
          mode="single"
          selected={selectedDate ?? undefined}
          defaultMonth={end}
          className="w-full p-0"
          classNames={{
            root: "w-full",
            months: "relative flex w-full flex-col gap-4 md:flex-row",
            month: "flex w-full flex-col gap-4",
          }}
          onSelect={newDate => {
            if (newDate) {
              onSelectDate(newDate);
            }
          }}
          onMonthChange={onMonthChange}
          onCalendarDayClick={onCalendarDayClick}
          disabled={[{ before: start }, { after: end }]}
          modifiers={{
            otherSelected: new Date(),
            calendar: isScrumDate,
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default CalendarSheet;
