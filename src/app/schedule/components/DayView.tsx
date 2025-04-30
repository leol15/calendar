'use client';
import { RootState } from '@/app/store';
import { range } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DAYS } from '../constants';
import { DragCreateEventActions } from '../redux/dragCreateEventSlice';
import { WeekEventSelectors } from '../redux/weekEventsSlice';
import { CEvent, WeekDay } from '../types';
import { randomColor } from '../utils';
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

  // time marker
  const shouldRenderTimeMarker = DAYS[new Date().getDay() - 1] === day;
  const markerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldRenderTimeMarker) {
      return;
    }
    const setTime = () => {
      const hour = new Date().getHours();
      const minutes = new Date().getMinutes();
      const top = ((hour * 60 + minutes) / (24 * 60)) * 100;
      if (markerRef.current) {
        markerRef.current.style.top = `${top}%`;
        const [r, g, b] = randomColor();
        markerRef.current.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      }
    };
    const interval = setInterval(setTime, 1000);
    setTime();

    return () => clearInterval(interval);
  }, [shouldRenderTimeMarker]);

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
      {shouldRenderTimeMarker && (
        <div className="time-marker" ref={markerRef}></div>
      )}
    </div>
  );
};

export default DayView;
