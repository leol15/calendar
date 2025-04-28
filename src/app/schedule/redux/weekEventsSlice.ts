'use client';

import { RootState } from '@/app/store';
import { PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit';
import { merge, omit } from 'lodash';
import { CEvent, WeekDay } from '../types';
import { loadEventsFromLocalStorage, saveEventsToLocalStorage } from '../utils';

// const DEFAULT_EVENTS: Record<number, CEvent> = {
//   1: {
//     id: 1,
//     name: 'Meeting with Bob',
//     description: 'Discuss project updates',
//     labels: ['work'],
//     days: [WeekDay.Monday],
//     start: 9 * 60,
//     duration: 60,
//   },
//   2: {
//     id: 2,
//     name: 'Gym Session',
//     description: 'Leg day workout',
//     labels: ['health'],
//     days: [WeekDay.Wednesday],
//     start: 12 * 60,
//     duration: 30,
//   },
// };

interface WeekEventsState {
  eventsById: Record<string, CEvent>;
  ids: number[];
}

const initialState: WeekEventsState = {
  eventsById: {},
  ids: [],
};

const weekEventsSlice = createSlice({
  name: 'weekEvents',
  initialState,
  reducers: {
    upsertEvent: (state, action: PayloadAction<CEvent>) => {
      state.eventsById[action.payload.id] = action.payload;
      if (!state.ids.includes(action.payload.id)) {
        state.ids.push(action.payload.id);
        state.ids.sort((a, b) => a - b);
      }
      saveEventsToLocalStorage(Object.values(state.eventsById));
    },
    removeEvent: (state, action: PayloadAction<number>) => {
      state.eventsById = omit(state.eventsById, action.payload);
      state.ids = state.ids.filter((id) => id !== action.payload);
      saveEventsToLocalStorage(Object.values(state.eventsById));
    },
    clearEvents: (state) => {
      state.eventsById = {};
      state.ids = [];
      saveEventsToLocalStorage(Object.values(state.eventsById));
    },
    reloadFromLocalStorage: (state) => {
      const events = loadEventsFromLocalStorage();
      state.eventsById = {};
      state.ids = [];
      events.forEach((event) => {
        state.eventsById[event.id] = event;
        state.ids.push(event.id);
      });
      state.ids.sort((a, b) => a - b);
    },
  },
});

// Actions
const { upsertEvent, removeEvent, clearEvents, reloadFromLocalStorage } =
  weekEventsSlice.actions;

const createEvent =
  (
    event: Partial<CEvent>
  ): ThunkAction<CEvent, RootState, unknown, PayloadAction<CEvent>> =>
  (dispatch, getState) => {
    const state = getState();
    const id = (state.weekEvents.ids[state.weekEvents.ids.length - 1] || 0) + 1;
    const defaultEvent = {
      id: 0,
      name: `New event ${id}`,
      days: [WeekDay.Monday],
      start: 0,
      duration: 60,
    };
    const newEvent: CEvent = merge({}, defaultEvent, event, { id });
    dispatch(upsertEvent(newEvent));
    return newEvent;
  };

export const WeekEventActions = {
  createEvent,
  upsertEvent,
  removeEvent,
  clearEvents,
  reloadFromLocalStorage,
};

// Reducer
export default weekEventsSlice.reducer;

// Selectors
export const WeekEventSelectors = {
  allEvents: (slice: WeekEventsState): CEvent[] =>
    Object.values(slice.eventsById),
  eventById: (slice: WeekEventsState, id: string): CEvent =>
    slice.eventsById[id],
  eventsByDay: (slice: WeekEventsState, day: WeekDay): CEvent[] =>
    Object.values(slice.eventsById).filter((event) => event.days.includes(day)),
};
