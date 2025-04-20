'use client';
import React from 'react';

interface WeekDayProps {
  day: string;
}

const DayView: React.FC<WeekDayProps> = ({ day }) => {
  return <div style={{}}>{day}</div>;
};

export default DayView;
