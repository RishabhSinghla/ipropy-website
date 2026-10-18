"use client";

import { useState, type FormEvent } from "react";
import { BellRing, CheckCircle2, Loader2 } from "lucide-react";

/**
 * "Tell me when a home like this comes in." A buyer leaves a number and the
 * search they were looking at; it lands in the CRM as a lead with that search
 * written in the message, so the team can call them the day one arrives.
 */
export function AlertSignup({ criteria, compact = false }: { criteria: string; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          website: form.get("website"),
          intent: "alert",
          message: criteria,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      setStatus(data.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-5 text-sm text-ink">
        <CheckCircle2 className="shrink-0 text-success" size={20} />
        Done — we will call you as soon as a home like this comes in.
      </div>
    );
  }

  const field = "min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent";
  return (
    <form onSubmit={onSubmit} className={compact ? "" : "rounded-2xl border border-line bg-paper p-5 sm:p-6"}>
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 shrink-0 text-accent" size={20} />
        <div>
          <p className="font-display text-lg text-ink">Tell me when a home like this comes in</p>
          <p className="mt-0.5 text-sm text-ink-soft">{criteria}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input name="name" required maxLength={80} placeholder="Your name" autoComplete="name" aria-label="Your name" className={field} />
        <input name="phone" required type="tel" inputMode="tel" maxLength={16} pattern="[0-9+ \-]{10,16}" placeholder="Mobile number" autoComplete="tel" aria-label="Mobile number" className={field} />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button type="submit" disabled={status === "loading"} className="flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper disabled:opacity-60">
          {status === "loading" && <Loader2 size={14} className="animate-spin" />} Alert me
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-sm text-danger">That did not go through — please try again.</p>}
    </form>
  );
}
