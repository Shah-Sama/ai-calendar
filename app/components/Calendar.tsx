"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

export default function Calendar() {
  const today = new Date().toISOString().slice(0, 10);

  const [events, setEvents] = useState<EventInput[]>([
    {
      id: "1",
      title: "Study",
      start: `${today}T10:00:00`,
      end: `${today}T12:00:00`,
    },
    {
      id: "2",
      title: "Gym",
      start: `${today}T18:00:00`,
      end: `${today}T19:30:00`,
    },
  ]);

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      editable
      selectable
      nowIndicator
      height="auto"
      events={events}

      select={(info) => {
        const title = prompt("Task name?");
        if (!title) return;

        setEvents((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            title,
            start: info.start,
            end: info.end,
          },
        ]);
      }}

      eventDrop={(info) => {
        if (!info.event.start || !info.event.end) return;
      
        setEvents((prev) =>
          prev.map((event) =>
            event.id === info.event.id
              ? {
                  ...event,
                  start: info.event.start!,
                  end: info.event.end!,
                }
              : event
          )
        );
      }}
      

      eventResize={(info) => {
        if (!info.event.start || !info.event.end) return;
      
        setEvents((prev) =>
          prev.map((event) =>
            event.id === info.event.id
              ? {
                  ...event,
                  start: info.event.start!,
                  end: info.event.end!,
                }
              : event
          )
        );
      }}
      
    />
  );
}
