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
  id: string;
  name: string;
  description?: string;
  labels?: string[];
  day: WeekDay;
  minute: number;
}
