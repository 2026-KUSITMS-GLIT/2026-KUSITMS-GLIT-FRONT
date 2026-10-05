const IS_FIRST_STAR_KEY = "isFirstStar";
const CALENDAR_GUIDE_DISMISSED_KEY = "calendarGuideDismissed";

export const saveIsFirstStar = (isFirstStar: boolean) => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(IS_FIRST_STAR_KEY, String(isFirstStar));
};

export const getIsFirstStar = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.sessionStorage.getItem(IS_FIRST_STAR_KEY) === "true";
};

export const hasDismissedCalendarGuide = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.sessionStorage.getItem(CALENDAR_GUIDE_DISMISSED_KEY) === "true";
};

export const dismissCalendarGuide = () => {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(CALENDAR_GUIDE_DISMISSED_KEY, "true");
};
