"use client";
import { Button } from '@cloudscape-design/components';
import WeekView from "./schedule/components/WeekView";

import { Provider } from "react-redux";
import store from "./store";


export default function Home() {
  return (
    <Provider store={store}>
      <div>Hello world
        <p>A button</p>
        <Button>a BUTTON</Button> 
        <WeekView></WeekView>
      </div>
    </Provider>
  );
}
