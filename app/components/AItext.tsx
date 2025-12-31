"use client";

import { useState } from "react";

export default function AIInput() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input) return;

    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <textarea
        className="w-full rounded border p-2"
        rows={3}
        placeholder="Ask AI to plan your day..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={askAI}
        className="rounded bg-black px-4 py-2 text-white"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="rounded bg-zinc-100 p-3 text-sm">
          {response}
        </div>
      )}
    </div>
  );
}
