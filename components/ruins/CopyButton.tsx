"use client";

import { useState } from "react";

export function CopyButton({ text, label = "コピー" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.prompt("コピーしてください", text);
    }
  }

  return (
    <button type="button" className="ruins-copy" onClick={copy} aria-live="polite">
      {done ? "コピーしました" : label}
    </button>
  );
}
