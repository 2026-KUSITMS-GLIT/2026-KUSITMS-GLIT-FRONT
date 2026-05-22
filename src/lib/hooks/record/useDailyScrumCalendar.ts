import { useRef, useState } from "react";

import { getMonthlyCalendar } from "@/lib/apis/calendar/calendar";
import { isWithinSelectableRecordRange, parseApiDate } from "@/lib/utils/calendar";

type UseDailyScrumCalendarParams = {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  showScrumToast: (message: string) => void;
};

const formatDateForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const formatMonthForApi = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const useDailyScrumCalendar = ({
  selectedDate,
  setSelectedDate,
  showScrumToast,
}: UseDailyScrumCalendarParams) => {
  const [calendarDraftDate, setCalendarDraftDate] = useState<Date | null>(null);
  const [calendarScrumDates, setCalendarScrumDates] = useState<Date[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarScrumDateCacheRef = useRef<Record<string, boolean>>({});

  const loadCalendarScrumDates = (monthDate: Date) => {
    const load = async () => {
      try {
        const monthlyCalendar = await getMonthlyCalendar(formatMonthForApi(monthDate));
        const scrumDates =
          monthlyCalendar?.days
            ?.filter(day => day.hasScrums && day.date)
            .map(day => parseApiDate(day.date!)) ?? [];

        monthlyCalendar?.days?.forEach(day => {
          if (day.date) {
            calendarScrumDateCacheRef.current[day.date] = day.hasScrums ?? false;
          }
        });

        setCalendarScrumDates(scrumDates);
      } catch {
        setCalendarScrumDates([]);
      }
    };

    void load();
  };

  const isScrumDate = (date: Date) => {
    const dateKey = formatDateForApi(date);
    const cached = calendarScrumDateCacheRef.current[dateKey];

    if (cached !== undefined) return cached;

    return calendarScrumDates.some(scrumDate => formatDateForApi(scrumDate) === dateKey);
  };

  const handleCalendarDateClick = (date: Date) => {
    if (isScrumDate(date)) {
      showScrumToast("이미 기록을 남긴 날이에요");
      return;
    }

    if (!isWithinSelectableRecordRange(date)) {
      showScrumToast("최근 14일 이내만 선택할 수 있어요");
    }
  };

  const openCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    loadCalendarScrumDates(selectedDate ?? new Date());
    setIsCalendarOpen(true);
  };

  const closeCalendarSheet = () => {
    setCalendarDraftDate(selectedDate);
    setIsCalendarOpen(false);
  };

  const confirmCalendarDate = () => {
    if (!calendarDraftDate) return;

    if (isScrumDate(calendarDraftDate)) {
      showScrumToast("이미 기록을 남긴 날이에요");
      return;
    }

    if (!isWithinSelectableRecordRange(calendarDraftDate)) {
      showScrumToast("최근 14일 이내만 선택할 수 있어요");
      return;
    }

    setSelectedDate(calendarDraftDate);
    setIsCalendarOpen(false);
  };

  return {
    calendarDraftDate,
    calendarScrumDates,
    isCalendarOpen,
    setCalendarDraftDate,
    openCalendarSheet,
    loadCalendarScrumDates,
    isScrumDate,
    handleCalendarDateClick,
    closeCalendarSheet,
    confirmCalendarDate,
  };
};
