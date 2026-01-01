export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/app/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // ✅ FIX 1: extract date
    const { prompt, date } = await req.json();

    if (!prompt || !date) {
      return NextResponse.json(
        { error: "Prompt and date are required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `
You are a scheduling assistant.

You MUST return ONLY valid JSON:

{
  "events": [
    {
      "title": string,
      "start": string (ISO datetime),
      "end": string (ISO datetime)
    }
  ]
}

Rules:
- ALL events MUST use this date: ${date}
- Do NOT use any other dates
- Do NOT overlap events
- No text outside JSON
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = response.output_text;

    // 🔐 Hard validation
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("AI did not return valid JSON");
    }

    if (!Array.isArray(parsed.events)) {
      throw new Error("Invalid AI response structure");
    }
    function localToUTC(dateTime: string) {
      // dateTime like "2026-01-01T19:00:00"
      const local = new Date(dateTime);
      return local.toISOString(); // converts to UTC with Z
    }
    

    

    const { error } = await supabase.from("events").insert(
      parsed.events.map((e: any) => ({
        title: e.title,
        start_time: localToUTC(e.start),
        end_time: localToUTC(e.end),
      }))
    );
    

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: parsed.events.length,
    });
  } catch (error) {
    console.error("AI CALENDAR ERROR:", error);
    return NextResponse.json(
      { error: "Failed to populate calendar" },
      { status: 500 }
    );
  }
}
