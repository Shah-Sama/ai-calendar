import { NextResponse } from "next/server";
import { supabase } from "../lib/supabase";

/**
 * GET /api
 * Fetch all calendar events
 */
export async function GET() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/**
 * POST /api
 * Create a new event
 */
export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: body.title,
      start_time: body.start,
      end_time: body.end,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/**
 * PUT /api
 * Update an existing event's time
 */
export async function PUT(req: Request) {
  const body = await req.json();

  const { error } = await supabase
    .from("events")
    .update({
      start_time: body.start,
      end_time: body.end,
    })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api
 * Delete an event by id
 */
export async function DELETE(req: Request) {
    const body = await req.json();
  
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", body.id);
  
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  
    return NextResponse.json({ success: true });
  }
  