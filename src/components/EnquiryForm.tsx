"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export interface EnquiryListing {
  id: string;
  title: string;
  url: string;
}

/**
 * One form for every way somebody reaches us. It lands in the CRM as a lead,
 * and the message carries what they were looking at — a rep calling back
 * should never have to ask "which property was it?".
 */
export function EnquiryForm({
  listing,
  intent = "buy",
  title = "Tell us what you're looking for",
  subtitle = "Share your requirement and our team will call you back the same day.",
}: {
  listing?: EnquiryListing;
  intent?: "buy" | "sell";
  title?: string;
  subtitle?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
          email: form.get("email"),
          message: form.get("message"),
          website: form.get("website"),
          intent,
          listing,
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-paper-dim p-10 text-center">
        <CheckCircle2 className="text-success" size={32} />
        <p className="font-display text-lg text-ink">Thank you — our team will call you shortly.</p>
      </div>
    );
  }

  const field = "w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input name="name" required maxLength={80} placeholder="Your name" autoComplete="name" className={field} />
        <input name="phone" required type="tel" inputMode="tel" maxLength={16} pattern="[0-9+ \-]{10,16}" placeholder="Mobile number" autoComplete="tel" className={field} />
        <input name="email" type="email" maxLength={120} placeholder="Email (optional)" autoComplete="email" className={`${field} sm:col-span-2`} />
        <textarea
          name="message"
          rows={3}
          maxLength={1000}
          placeholder={intent === "sell"
            ? "Where is it, what is it (e.g. 3 BHK builder floor), and what price do you expect?"
            : listing ? "Anything you'd like to know? A good time to visit?" : "Budget, locality, size — whatever you know so far."}
          className={`${field} resize-none sm:col-span-2`}
        />
        {/* A field people never see and bots always fill. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-danger">That did not go through — please try again, or call us.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={15} className="animate-spin" />}
        {intent === "sell" ? "Request a call back" : "Send enquiry"}
      </button>
      <p className="mt-3 text-center text-[11px] text-ink-faint">We only use your number to reply to this enquiry.</p>
    </form>
  );
}
