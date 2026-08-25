"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { PHONE_DISPLAY, PHONE_HREF, whatsappLink } from "@/lib/contact";

/*
 * The inputs are styled with utilities, not a styled-jsx block.
 *
 * The block that used to live at the bottom of this file referenced --line,
 * --paper, --accent and --ink-faint. Those variables were renamed when the
 * palette changed, so every declaration resolved empty and the browser dropped
 * the lot: no border, transparent background, and placeholder text rendered at
 * full foreground ink. The form looked like a filled-in, read-only summary.
 * Nothing threw, so nothing caught it.
 */
const INPUT =
  "w-full rounded-[2px] border border-rule-hard bg-chalk-2 px-4 py-3 text-sm text-ink " +
  "outline-none transition-colors placeholder:text-ink-2 focus:border-open";

/** A labelled field. Placeholders are not labels; they vanish the moment you type. */
function Field({
  label,
  name,
  children,
  required,
  optional,
  hint,
  className = "",
}: {
  label: string;
  name: string;
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={`enq-${name}`} className="label block text-ink-2">
        {label}
        {required && <span className="text-alert"> *</span>}
        {optional && <span className="text-ink-3"> (optional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}

export function EnquiryForm({
  project,
  title = "Tell us what you're looking for",
  subtitle = "Tell us the floor you want. One reply, from a person, usually the same day.",
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
      <div className="flex flex-col items-center gap-3 rounded-[2px] border border-rule-hard bg-chalk-2 p-10 text-center">
        <CheckCircle2 className="text-open" size={32} />
        <p className="font-display text-lg text-ink">Got it. We will reply today.</p>
        <a
          href={whatsappLink("Hi, I just sent an enquiry on your site.")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-data mt-1 inline-flex min-h-11 items-center gap-2 text-xs uppercase tracking-[0.1em] text-open"
        >
          <MessageCircle size={14} /> Or message us now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[2px] border border-rule-hard bg-chalk-2 p-6 sm:p-8">
      {title && <h3 className="font-display text-xl text-ink">{title}</h3>}
      {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" required>
          <input id="enq-name" name="name" required autoComplete="name" className={INPUT} />
        </Field>
        <Field label="Phone" name="phone" required hint="We will WhatsApp before we call.">
          <input
            id="enq-phone"
            name="phone"
            required
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            pattern="[0-9+ ]{7,15}"
            className={INPUT}
          />
        </Field>
        <Field label="Email" name="email" optional className="sm:col-span-2">
          <input id="enq-email" name="email" type="email" autoComplete="email" className={INPUT} />
        </Field>
        <Field label="What are you looking for?" name="message" optional className="sm:col-span-2">
          <textarea id="enq-message" name="message" rows={3} className={`${INPUT} resize-none`} />
        </Field>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-alert">Something went wrong — please try again in a moment.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="font-data mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-[2px] bg-ink px-8 text-xs uppercase tracking-[0.12em] text-chalk transition-colors hover:bg-open disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" && <Loader2 size={15} className="animate-spin" />}
        Send enquiry
      </button>

      {/* Two other ways out. A family that will not fill a form will still tap
          WhatsApp, and in this market a visible number is what makes a firm
          look real. */}
      <div className="mt-5 flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center">
        <span className="label">Or reach us directly</span>
        <div className="flex flex-wrap gap-2">
          <a
            href={whatsappLink("Hi, I am looking for a builder floor in Faridabad.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-data inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-rule-hard px-4 text-xs uppercase tracking-[0.1em] text-ink transition-colors hover:border-open hover:text-open"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <a
            href={PHONE_HREF}
            className="font-data inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-rule-hard px-4 text-xs tracking-[0.05em] text-ink transition-colors hover:border-open hover:text-open"
          >
            <Phone size={14} /> {PHONE_DISPLAY}
          </a>
        </div>
      </div>

    </form>
  );
}
