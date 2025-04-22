'use client';

import LoadingBar from '@cloudscape-design/chat-components/loading-bar';
import {
  Button,
  Popover,
  SpaceBetween,
  StatusIndicator,
  ToggleButton,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DragCreateEventActions } from '../redux/dragCreateEventSlice';
import { WeekEventActions } from '../redux/weekEventsSlice';
import { WeekDay } from '../types';
import { copySavedCalandar, pasteSavedCalandar } from '../utils';
import DayView from './DayView';
import './common.css';

export default function WeekView() {
  const [mouseDown, setMouseDown] = useState(false);

  const [dragEdit, setdragEdit] = useState(false);
  const toggleDragEdit = () => setdragEdit(!dragEdit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const handleMouseDown = (e: React.MouseEvent) => {
    if (dragEdit) {
      setMouseDown(true);
      console.log('mouse down', e.clientY);
      dispatch(DragCreateEventActions.start());
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseDown) {
      console.log('mouse move', e.clientY);
    }
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDown) {
      setMouseDown(false);
      console.log('mouse up', e.clientY);
    }
  };

  const pasteCalandar = async () => {
    pasteSavedCalandar().then(() =>
      dispatch(WeekEventActions.reloadFromLocalStorage())
    );
  };

  return (
    <div>
      <LoadingBar variant="gen-ai" />
      <SpaceBetween direction="horizontal" size="l">
        <h3>Calandar</h3>
        <ToggleButton
          onChange={toggleDragEdit}
          pressed={dragEdit}
          iconName="lock-private"
          pressedIconName="unlocked"
        >
          Edit
        </ToggleButton>
        <Popover
          dismissButton={false}
          position="top"
          size="small"
          triggerType="custom"
          content={
            <StatusIndicator type="success">
              Copied to clipboard
            </StatusIndicator>
          }
        >
          <Button iconName="copy" onClick={copySavedCalandar}>
            Copy Calandar
          </Button>
        </Popover>
        <Popover
          dismissButton={false}
          position="top"
          size="small"
          triggerType="custom"
          content={
            <StatusIndicator type="success">
              Pasted from clipboard
            </StatusIndicator>
          }
        >
          <Button iconName="upload" onClick={pasteCalandar}>
            Paste Calandar
          </Button>
        </Popover>
      </SpaceBetween>
      <div
        style={{ cursor: dragEdit ? 'crosshair' : '' }}
        className="week-container"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {Object.values(WeekDay).map((day, i) => (
          <DayView key={i} day={day}></DayView>
        ))}
      </div>
    </div>
  );
}
