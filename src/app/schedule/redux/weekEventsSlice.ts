'use client';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { omit } from 'lodash';
import { CEvent, WeekDay } from '../types';

const DEFAULT_EVENTS = {
  '1': {
    id: '1',
    name: 'Meeting with Bob',
    description: 'Discuss project updates',
    labels: ['work'],
    day: WeekDay.Monday,
    minute: 9 * 60,
  },
  '2': {
    id: '2',
    name: 'Gym Session',
    description: 'Leg day workout',
    labels: ['health'],
    day: WeekDay.Wednesday,
    minute: 12 * 60,
  },
};

interface WeekEventsState {
  eventsById: Record<string, CEvent>;
}

const initialState: WeekEventsState = {
  eventsById: { ...DEFAULT_EVENTS },
};

const weekEventsSlice = createSlice({
  name: 'weekEvents',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<CEvent>) => {
      state.eventsById[action.payload.id] = action.payload;
    },
    removeEvent: (state, action: PayloadAction<CEvent>) => {
      state.eventsById = omit(state.eventsById, action.payload.id);
    },
    clearEvents: (state) => {
      state.eventsById = {};
    },
  },
});

// Actions
export const { addEvent, removeEvent, clearEvents } = weekEventsSlice.actions;

// Reducer
export default weekEventsSlice.reducer;

// Selectors
export const WeekEventSelectors = {
  allEvents: (slice: WeekEventsState): CEvent[] =>
    Object.values(slice.eventsById),
  eventById: (slice: WeekEventsState, id: string): CEvent =>
    slice.eventsById[id],
};
