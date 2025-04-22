import { AppDispatch } from '@/app/store';
import {
  Box,
  Button,
  Form,
  FormField,
  Input,
  Modal,
  SpaceBetween,
  TimeInput,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditEventActions, EditEventSelectors } from '../redux/editEventSlice';
import { CEvent, WeekDay } from '../types';
import { TimeUtils } from '../utils';

interface EventEditorProps {
  todo?: string;
}

export const EventEditor: React.FC<EventEditorProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isEditing = useSelector(EditEventSelectors.isEditing);
  const event = useSelector(EditEventSelectors.event);
  const [startTime, setStartTime] = useState<string>(
    TimeUtils.toString(event?.start || 0)
  );
  useEffect(() => {
    if (isEditing && event) {
      setStartTime(TimeUtils.toString(event.start));
    }
  }, [isEditing]);

  const concelEdit = () => {
    dispatch(EditEventActions.cancelEditEvent());
  };
  const saveEdit = () => {
    dispatch(EditEventActions.saveEditEvent());
  };
  const deleteEvent = () => {
    dispatch(EditEventActions.deleteEvent());
  };

  const updateEvent = (diff: Partial<CEvent>) => {
    const newEvent: CEvent = Object.assign({}, event, diff);
    dispatch(EditEventActions.updateEditEvent(newEvent));
  };

  const isEventValid = (event: CEvent): boolean => {
    return (
      !!event &&
      !!event.name &&
      !isNaN(event.start) &&
      !isNaN(event.duration) &&
      event.duration > 0 &&
      event.days.length > 0
    );
  };

  if (!isEditing || !event) {
    return null;
  }
  return (
    <Modal
      visible={isEditing}
      onDismiss={(e) => e.detail.reason === 'closeButton' && concelEdit()}
      size="medium"
      footer={
        // <Box float="left">
        <Box display="block">
          <Box float="left" textAlign="left">
            <Button variant="normal" onClick={deleteEvent}>
              Delete
            </Button>
          </Box>
          <Box float="right">
            <Button variant="link" onClick={concelEdit}>
              Cancel
            </Button>
            <Button
              disabled={!isEventValid(event)}
              variant="primary"
              onClick={saveEdit}
            >
              Save
            </Button>
          </Box>
        </Box>
        // </Box>
      }
      header={`Editing ${event?.id}`}
    >
      <Form>
        {/* {JSON.stringify(event)} */}
        <SpaceBetween direction="vertical" size="l">
          <FormField label="Name">
            <Input
              value={event.name}
              placeholder={event.name}
              invalid={!event.name}
              onChange={(e) => updateEvent({ name: e.detail.value })}
            />
          </FormField>
          <FormField label="Description">
            <Input
              type="url"
              value={event?.description || ''}
              placeholder={event?.description}
              onChange={(e) => updateEvent({ description: e.detail.value })}
            />
          </FormField>
          <FormField label={`Days of week (${event.days.length})`}>
            <div style={{}}>
              <SpaceBetween direction="horizontal" size="xxxs">
                {Object.values(WeekDay).map((day) => (
                  <Button
                    key={day}
                    variant={event.days.includes(day) ? 'normal' : 'link'}
                    onClick={() => {
                      const newDays = event.days.includes(day)
                        ? event.days.filter((d) => d !== day)
                        : [...event.days, day];
                      updateEvent({ days: newDays });
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {day.slice(0, 1)}
                    </span>
                  </Button>
                ))}
              </SpaceBetween>
            </div>
          </FormField>
          <SpaceBetween direction="horizontal" size="l">
            <FormField label="Start time">
              <TimeInput
                onChange={({ detail }) => {
                  setStartTime(detail.value);
                  updateEvent({ start: TimeUtils.fromString(detail.value) });
                }}
                value={startTime}
                format="hh:mm"
                placeholder="hh:mm"
              />
            </FormField>
            <FormField label="Duration (minutes)">
              <Input
                type="number"
                value={String(event.duration)}
                placeholder={event.duration.toString()}
                onChange={(e) => {
                  const value = parseInt(e.detail.value);
                  if (!isNaN(value) && value > 0) {
                    updateEvent({ duration: value });
                  }
                }}
              />
            </FormField>
          </SpaceBetween>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};
