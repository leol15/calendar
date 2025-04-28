'use client';

import LoadingBar from '@cloudscape-design/chat-components/loading-bar';
import {
  Button,
  Popover,
  SpaceBetween,
  StatusIndicator,
  ToggleButton,
} from '@cloudscape-design/components';
import { range } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragCreateEventActions,
  DragCreateEventSelectors,
} from '../redux/dragCreateEventSlice';
import { WeekEventActions } from '../redux/weekEventsSlice';
import { WeekDay } from '../types';
import { copySavedCalandar, pasteSavedCalandar } from '../utils';
import DayView from './DayView';
import './common.css';

export default function WeekView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dispatch = useDispatch<any>();
  const toggleDragEdit = () => dispatch(DragCreateEventActions.toggleEnabled());
  const dragEditEnabled = useSelector(DragCreateEventSelectors.enabled);

  const handleMouseMove = (e: React.MouseEvent) => {
    dispatch(DragCreateEventActions.move(e.screenY));
  };
  const handleMouseUp = () => {
    dispatch(DragCreateEventActions.end());
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
          pressed={dragEditEnabled}
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
        style={{ cursor: dragEditEnabled ? 'crosshair' : '' }}
        className="week-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="left-hour-marker">
          {range(24).map((hour) => (
            <div key={hour} className="hour-marker">
              {hour}:00
            </div>
          ))}
        </div>
        {Object.values(WeekDay).map((day, i) => (
          <DayView key={i} day={day}></DayView>
        ))}
      </div>
    </div>
  );
}
