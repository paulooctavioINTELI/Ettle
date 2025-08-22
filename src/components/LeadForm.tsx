"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

export default function LeadForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setStatus("ok");
      setMessage("You're on the list! We'll email you the download link.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex w-full max-w-xl gap-3">
      <input
        aria-label="Email address"
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-soft bg-[#2A2A2F] px-4 py-3 text-white placeholder:text-muted outline-none ring-1 ring-white/10 focus:ring-primary"
      />
      <button className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Joining..." : "Join the beta"}
      </button>
      {message && (
        <p className="mt-2 text-sm text-muted">{message}</p>
      )}
    </form>
  );
}
