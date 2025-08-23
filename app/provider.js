"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store/store";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MultiBackend, TouchTransition } from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export function Providers({ children }) {
  const HTML5toTouch = {
    backends: [
      {
        backend: HTML5Backend,
      },
      {
        backend: TouchBackend,
        options: { enableMouseEvents: true },
        preview: true,
        transition: TouchTransition, // Use touch backend for mobile
      },
    ],
  };
  return (
    <Provider store={store}>
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        {children}
      </DndProvider>
    </Provider>
  );
}
