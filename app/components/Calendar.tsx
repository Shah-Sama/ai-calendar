"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);

  /**
   * Load events from Supabase on page load
   */
  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map((e: any) => ({
            id: e.id,
            title: e.title,
            start: e.start_time,
            end: e.end_time,
          }))
        );
      });
  }, []);

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      editable
      selectable
      nowIndicator
      height="auto"
      events={events}

      /**
       * Create a new event (persisted)
       */
      select={async (info) => {
        const title = prompt("Task name?");
        if (!title) return;

        const res = await fetch("/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            start: info.start,
            end: info.end,
          }),
        });

        const saved = await res.json();

        setEvents((prev) => [
          ...prev,
          {
            id: saved.id,
            title: saved.title,
            start: saved.start_time,
            end: saved.end_time,
          },
        ]);
      }}

      /**
       * Persist drag (move) updates
       */
      eventDrop={async (info) => {
        if (!info.event.start || !info.event.end) return;

        await fetch("/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: info.event.id,
            start: info.event.start,
            end: info.event.end,
          }),
        });
      }}

      /**
       * Persist resize updates
       */
      eventResize={async (info) => {
        if (!info.event.start || !info.event.end) return;

        await fetch("/api", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: info.event.id,
            start: info.event.start,
            end: info.event.end,
          }),
        });
      }}
    />
  );
}
