export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type AlarmSetting = {
  dayOfWeek: DayOfWeek;
  notifyTime: string;
};

export type AlarmData = {
  isActive: boolean;
  settings: AlarmSetting[];
};
