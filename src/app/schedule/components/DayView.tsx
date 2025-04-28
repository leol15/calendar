'use client';
import { RootState } from '@/app/store';
import { range } from 'lodash';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragCreateEventActions } from '../redux/dragCreateEventSlice';
import { WeekEventSelectors } from '../redux/weekEventsSlice';
import { CEvent, WeekDay } from '../types';
import { EventView } from './EventView';

interface WeekDayProps {
  day: WeekDay;
}

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

  const containerRef = React.useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current?.clientHeight) {
      return;
    }
    dispatch(
      DragCreateEventActions.start(
        day,
        containerRef.current?.getBoundingClientRect().top,
        containerRef.current?.clientHeight,
        e.clientY,
        e.screenY
      )
    );
  };
  return (
    <div className="day" onMouseDown={handleMouseDown}>
      <div className="hour-container" ref={containerRef}>
        {range(24).map((hour, i) => (
          <div key={i} className="hour">
            <span>{hour}</span>
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
