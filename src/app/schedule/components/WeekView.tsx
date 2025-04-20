'use client';

import { RootState } from '@/app/store';
import { useSelector } from 'react-redux';
import { WeekEventSelectors } from '../redux/weekEventsSlice';
import { WeekDay } from '../types';
import DayView from './DayView';

export default function WeekView() {
  const events = useSelector<RootState>((state) =>
    WeekEventSelectors.allEvents(state.weekEvents)
  );
  return (
    <div>
      <h1>Week View</h1>
      {JSON.stringify(events)}
      {Object.values(WeekDay).map((day, i) => (
        <DayView key={i} day={day}></DayView>
      ))}
      {/* Add your week view components here */}
    </div>
  );
}
