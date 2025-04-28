import { RootState } from '@/app/store';
import { createSlice, PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { CEvent } from '../types';
import { WeekEventActions } from './weekEventsSlice';

interface DragCreateEventState {
  inprograss: boolean;
  event: CEvent | null;
}

const initialState: DragCreateEventState = {
  inprograss: false,
  event: null,
};

const dragCreateEventSlice = createSlice({
  name: 'editEvent',
  initialState,
  reducers: {
    start: (state, action: PayloadAction<CEvent>) => {
      state.inprograss = true;
      state.event = cloneDeep(action.payload);
    },
    endEditEvent: (state) => {
      state.inprograss = false;
      state.event = null;
    },
  },
});

export default dragCreateEventSlice.reducer;

// Thunk to access another slice's state
const startDragCreateEvent =
  () =>
  (dispatch: ThunkDispatch<RootState, unknown, PayloadAction<CEvent>>) => {
    const event = dispatch(WeekEventActions.createEvent({}));
    dispatch(dragCreateEventSlice.actions.start(event));
  };

export const DragCreateEventActions = {
  start: startDragCreateEvent,
};

export const DragCreateEventSelectors = {
  inprogress: (state: RootState): boolean => state.dragCreateEvent.inprograss,
  event: (state: RootState): CEvent | null => state.dragCreateEvent.event,
};
