"use client";

import { useState } from "react";

export default function AIInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const askAI = async () => {
    if (!input) return;
  
    setLoading(true);
  
    await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: input,
        date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      }),
    });
  
    setLoading(false);
  
    // Refresh calendar
    window.location.reload();
  };
  
  
  return (
    <div className="space-y-2">
      <textarea
        className="w-full rounded border p-2"
        rows={3}
        placeholder="Tell AI your tasks (e.g. 'I have class 9–12, gym, and 3 hours of study')"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={askAI}
        className="rounded bg-black px-4 py-2 text-white"
        disabled={loading}
      >
        {loading ? "Planning..." : "Fill My Calendar"}
      </button>

      {status && (
        <div className="text-sm text-zinc-600">
          {status}
        </div>
      )}
    </div>
  );
}
