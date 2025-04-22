'use client';

import { applyDensity, Density } from '@cloudscape-design/global-styles';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { EventEditor } from './schedule/components/EventEditor';
import WeekView from './schedule/components/WeekView';
import { WeekEventActions } from './schedule/redux/weekEventsSlice';
import { CEvent } from './schedule/types';
import { loadEventsFromLocalStorage } from './schedule/utils';
import store from './store';

export default function Home() {
  useEffect(() => {
    applyDensity(Density.Compact);
    const storedEvents = loadEventsFromLocalStorage();
    storedEvents.forEach((event: CEvent) => {
      store.dispatch(WeekEventActions.upsertEvent(event));
    });
  }, []);

  return (
    <Provider store={store}>
      <div>
        <EventEditor />
        <WeekView></WeekView>
      </div>
    </Provider>
  );
}
