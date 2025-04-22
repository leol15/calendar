import { AppDispatch } from '@/app/store';
import { useDispatch } from 'react-redux';
import { EditEventActions } from '../redux/editEventSlice';
import { CEvent } from '../types';
import { getContrastColor, stringToRgb, toRgbString } from '../utils';

interface EventViewProps {
  event: CEvent;
}

export const EventView: React.FC<EventViewProps> = ({ event }) => {
  const dispatch = useDispatch<AppDispatch>();

  const eventClicked = () => {
    console.log('event clicked', event.id);
    dispatch(EditEventActions.startEditEvent(event.id));
  };

  const bgColor = [...stringToRgb(event.name), 0.7];
  const fgColor = getContrastColor(bgColor);
  return (
    <div
      className="event"
      style={{
        backgroundColor: toRgbString(bgColor),
      }}
      onClick={eventClicked}
    >
      <p
        className="event-name"
        style={{
          color: toRgbString(fgColor),
        }}
      >
        {event.name}
      </p>
    </div>
  );
};
