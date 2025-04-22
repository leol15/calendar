'use client';
import { RootState } from '@/app/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { WeekEventSelectors } from '../redux/weekEventsSlice';
import { CEvent, WeekDay } from '../types';
import { EventView } from './EventView';

interface WeekDayProps {
  day: WeekDay;
}

const HOURS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const DayView: React.FC<WeekDayProps> = ({ day }) => {
  // get the events for the day
  const events = useSelector<RootState, CEvent[]>((state) =>
    WeekEventSelectors.eventsByDay(state.weekEvents, day)
  );
  const getEventDisplayPosition = (event: CEvent) => {
    const top = event.start / (24 * 60);
    const height = event.duration / (24 * 60);
    return { top: `${top * 100}%`, height: `${height * 100}%` };
  };
  return (
    <div className="day">
      {day}
      <div className="hour-container">
        {HOURS.map((hour, i) => (
          <div key={i} className="hour">
            {hour}
          </div>
        ))}
        {events.map((event, i) => (
          <div
            key={i}
            className="event-position-container"
            style={getEventDisplayPosition(event)}
          >
            <EventView event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;
