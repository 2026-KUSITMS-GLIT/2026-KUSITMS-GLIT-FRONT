const RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY = "record-project-tag-add-guide-seen";

export const hasSeenProjectTagAddGuide = (): boolean => {
  if (typeof window === "undefined") return true;

  return window.localStorage.getItem(RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY) === "true";
};

export const markProjectTagAddGuideSeen = () => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(RECORD_PROJECT_TAG_ADD_GUIDE_SEEN_KEY, "true");
};
