import type { Metadata } from "next";
import { Camera, EyeOff, PhoneCall, Users } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Sell your property",
  description: "List your property with iPropy. We show it to buyers we are already talking to, and your name and number are never published.",
};

const POINTS = [
  { icon: EyeOff, title: "Your number stays private", body: "Buyers see the home, the price and the photos. Never your name, never your phone number — every call comes to us first." },
  { icon: Users, title: "Buyers we already know", body: "We match your property against the people already asking us for homes like it, before it is even on the website." },
  { icon: Camera, title: "Shown properly", body: "We visit, take the photos and write the listing, so it reads well and answers the questions buyers ask." },
  { icon: PhoneCall, title: "One person to call", body: "Visits, offers and paperwork go through one person at iPropy who knows your property." },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Sell with iPropy</span>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">Sell your property without your phone ringing all day</h1>
          <p className="mt-5 max-w-xl text-base text-ink-soft">
            Tell us about it and we will call you back. If it is a fit, we list it here — and every buyer deals with us, not with you.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {POINTS.map((p) => (
              <div key={p.title}>
                <p.icon size={20} className="text-accent" />
                <h2 className="mt-3 font-display text-lg text-ink">{p.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryForm intent="sell" title="Tell us about your property" subtitle="A few words is enough — we will call you to fill in the rest." />
        </div>
      </div>
    </div>
  );
}
