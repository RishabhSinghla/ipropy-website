"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function EnquiryForm({
  project,
  title = "Tell us what you're looking for",
  subtitle = "Share your requirement and our team will call you back within a few hours.",
}: {
  project?: string;
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
          project: project ?? "",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
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

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full Name" className="input" />
        <input name="phone" required type="tel" placeholder="Phone Number" pattern="[0-9+ ]{7,15}" className="input" />
        <input name="email" type="email" placeholder="Email (optional)" className="input sm:col-span-2" />
        <textarea name="message" placeholder="What are you looking for?" rows={3} className="input sm:col-span-2 resize-none" />
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-danger">Something went wrong — please try again in a moment.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {status === "loading" && <Loader2 size={15} className="animate-spin" />}
        Send Enquiry
      </button>

      <style jsx>{`
        .input {
          border: 1px solid var(--line);
          background: var(--paper);
          border-radius: 0.75rem;
          padding: 0.7rem 1rem;
          font-size: 0.875rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: var(--accent);
        }
        .input::placeholder {
          color: var(--ink-faint);
        }
      `}</style>
    </form>
  );
}
