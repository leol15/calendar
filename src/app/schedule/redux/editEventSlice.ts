import { RootState } from '@/app/store';
import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { CEvent } from '../types';
import { WeekEventActions } from './weekEventsSlice';

interface EditEventState {
  isEditing: boolean;
  event: CEvent | null;
}

const initialState: EditEventState = {
  isEditing: false,
  event: null,
};

const editEventSlice = createSlice({
  name: 'editEvent',
  initialState,
  reducers: {
    startEditEvent: (state, action: PayloadAction<CEvent>) => {
      state.isEditing = true;
      state.event = cloneDeep(action.payload);
    },
    updateEvent: (state, action: PayloadAction<CEvent>) => {
      if (state.isEditing) {
        state.event = action.payload;
      }
    },
    endEditEvent: (state) => {
      state.isEditing = false;
      state.event = null;
    },
  },
});

export default editEventSlice.reducer;

// Thunk to access another slice's state
const startEditEvent =
  (eventId: number) => (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const event = state.weekEvents.eventsById[eventId];
    if (event) {
      dispatch(editEventSlice.actions.startEditEvent(event));
    }
  };

const cancelEditEvent = () => (dispatch: Dispatch) => {
  dispatch(editEventSlice.actions.endEditEvent());
};

const saveEditEvent = () => (dispatch: Dispatch, getState: () => RootState) => {
  // save event
  const state = getState();
  if (state.editEvent.event) {
    dispatch(WeekEventActions.upsertEvent(state.editEvent.event));
  }
  dispatch(editEventSlice.actions.endEditEvent());
};
const deleteEvent = () => (dispatch: Dispatch, getState: () => RootState) => {
  const state = getState();
  if (state.editEvent.event) {
    dispatch(WeekEventActions.removeEvent(state.editEvent.event.id));
  }
  dispatch(editEventSlice.actions.endEditEvent());
};

export const EditEventActions = {
  startEditEvent,
  updateEditEvent: editEventSlice.actions.updateEvent,
  cancelEditEvent,
  saveEditEvent,
  deleteEvent,
};

export const EditEventSelectors = {
  isEditing: (state: RootState): boolean => state.editEvent.isEditing,
  event: (state: RootState): CEvent | null => state.editEvent.event,
};
