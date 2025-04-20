'use client';
import { configureStore } from '@reduxjs/toolkit';
import weekEventsSlice from './schedule/redux/weekEventsSlice';

const store = configureStore({
  reducer: {
    weekEvents: weekEventsSlice, 
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;