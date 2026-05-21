import Calendar from "@/components/calendar/Calendar";
import BottomSheet from "@/components/common/BottomSheet";
import { cn } from "@/lib/utils/cn";

const getSelectableDateRange = () => {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);

  start.setDate(end.getDate() - 13);

  return { start, end };
};

interface CalendarSheetProps {
  isOpen: boolean;
  selectedDate: Date | null;
  scrumDates: Date[];
  doneEnabled: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelectDate: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  onScrumDateClick: () => void;
}

const CalendarSheet = ({
  isOpen,
  selectedDate,
  scrumDates,
  doneEnabled,
  onClose,
  onConfirm,
  onSelectDate,
  onMonthChange,
  onScrumDateClick,
}: CalendarSheetProps) => {
  const { start, end } = getSelectableDateRange();

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
          onScrumDateClick={onScrumDateClick}
          disabled={[{ before: start }, { after: end }]}
          modifiers={{
            otherSelected: new Date(),
            calendar: scrumDates,
          }}
        />
      </div>
    </BottomSheet>
  );
};

export default CalendarSheet;
