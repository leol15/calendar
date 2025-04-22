'use client';
import { configureStore } from '@reduxjs/toolkit';
import dragCreateEventSlice from './schedule/redux/dragCreateEventSlice';
import editEventSlice from './schedule/redux/editEventSlice';
import weekEventsSlice from './schedule/redux/weekEventsSlice';

const store = configureStore({
  reducer: {
    weekEvents: weekEventsSlice,
    editEvent: editEventSlice,
    dragCreateEvent: dragCreateEventSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
