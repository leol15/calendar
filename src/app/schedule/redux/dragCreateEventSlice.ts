import { RootState } from '@/app/store';
import { createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { cloneDeep, isNil } from 'lodash';
import { CEvent, WeekDay } from '../types';
import { EditEventActions } from './editEventSlice';
import { WeekEventActions } from './weekEventsSlice';

interface DragCreateEventState {
  inprograss: boolean;
  event: CEvent | null;
  enabled: boolean;
  containerHeight: number | null;
  yStart: number;
}

const initialState: DragCreateEventState = {
  inprograss: false,
  event: null,
  enabled: false,
  containerHeight: null,
  yStart: 0,
};

interface StartEventType {
  e: CEvent;
  height: number;
  yStart: number;
}

const dragCreateEventSlice = createSlice({
  name: 'editEvent',
  initialState,
  reducers: {
    dragCreateEventStart: (state, action: PayloadAction<StartEventType>) => {
      state.inprograss = true;
      state.event = cloneDeep(action.payload.e);
      // state.containerTop = action.payload.top;
      state.containerHeight = action.payload.height;
      state.yStart = action.payload.yStart;
      // state.yDiff = action.payload.yDiff;
    },
    endEditEvent: (state) => {
      state.inprograss = false;
      state.event = null;
    },
    toggleEnabled: (state, action: PayloadAction<boolean | undefined>) => {
      state.enabled = isNil(action.payload) ? !state.enabled : action.payload;
    },
  },
});

export default dragCreateEventSlice.reducer;

// Thunk to access another slice's state
const startDragCreateEvent =
  (
    week: WeekDay,
    containerTop: number,
    containerHeight: number,
    clientY: number,
    screenY: number
  ) =>
  (
    dispatch: ThunkDispatch<RootState, unknown, PayloadAction<StartEventType>>,
    getState: () => RootState
  ) => {
    const enabled = getState().dragCreateEvent.enabled;
    if (!enabled) {
      return;
    }

    const offsetY = screenY - clientY;
    const clientY2 = screenY - offsetY;
    console.log('leooo clientY clientY2', clientY, clientY2);
    const top = clientY2 - containerTop;
    const minute = Math.floor((top / containerHeight) * 24 * 60);
    const minuteBy15 = Math.floor(minute / 15) * 15;

    const event: CEvent = dispatch(
      WeekEventActions.createEvent({
        days: [week],
        start: minuteBy15,
      })
    );
    dispatch(
      dragCreateEventSlice.actions.dragCreateEventStart({
        e: event,
        height: containerHeight,
        yStart: screenY,
      })
    );
  };

const dragCreateEventMove =
  (screenY: number) =>
  (
    dispatch: ThunkDispatch<RootState, unknown, PayloadAction<CEvent>>,
    getState: () => RootState
  ) => {
    const state = getState().dragCreateEvent;
    const event = state.event;
    if (
      !state.enabled ||
      !state.inprograss ||
      !event ||
      !state.containerHeight
    ) {
      return;
    }

    // TODO handle dragging upwards
    const diff = Math.abs(screenY - state.yStart);
    const minute = Math.floor((diff / state.containerHeight) * 24 * 60);
    const minuteBy15 = Math.floor(minute / 15) * 15;

    dispatch(
      WeekEventActions.upsertEvent({
        ...event,
        duration: minuteBy15,
      })
    );
  };

const dragCreateEventEnd =
  () =>
  (
    dispatch: ThunkDispatch<RootState, unknown, PayloadAction<undefined>>,
    getState: () => RootState
  ) => {
    const state = getState().dragCreateEvent;
    const event = state.event;
    if (!state.enabled || !state.inprograss || !event) {
      return;
    }
    dispatch(dragCreateEventSlice.actions.endEditEvent());
    dispatch(EditEventActions.startEditEvent(event.id));
  };

export const DragCreateEventActions = {
  start: startDragCreateEvent,
  move: dragCreateEventMove,
  end: dragCreateEventEnd,
  toggleEnabled: dragCreateEventSlice.actions.toggleEnabled,
};

export const DragCreateEventSelectors = {
  inprogress: (state: RootState): boolean => state.dragCreateEvent.inprograss,
  event: (state: RootState): CEvent | null => state.dragCreateEvent.event,
  enabled: (state: RootState): boolean => state.dragCreateEvent.enabled,
};
