// conceptually an event

export enum WeekDay {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export interface CEvent {
  id: number;
  name: string;
  description?: string;
  labels?: string[];
  days: WeekDay[];
  start: number; // start time in minutes from midnight
  duration: number; // in minutes
}
