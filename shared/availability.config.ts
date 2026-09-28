export interface TimeWindow {
  start: string;
  end: string;
}

export interface WeeklySchedule {
  thursday: TimeWindow[];
  saturday: TimeWindow[];
}

export interface AvailabilityConfig {
  timezone: string;
  durationMinutes: number;
  weekly: WeeklySchedule;
  blockedDates: string[];
  monthlyCap: number;
  minNoticeMinutes: number;
}

export const AVAILABILITY_CONFIG: AvailabilityConfig = {
  timezone: "Asia/Kolkata",
  durationMinutes: 60,
  weekly: {
    thursday: [{ start: "14:00", end: "16:00" }],
    saturday: [{ start: "11:00", end: "13:00" }],
  },
  blockedDates: ["2026-09-24"],
  monthlyCap: 15,
  minNoticeMinutes: 60,
};
