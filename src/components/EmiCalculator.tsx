"use client";

import { useMemo, useState } from "react";
import { formatIndianPrice } from "@/lib/format";

export function EmiCalculator({ price }: { price: number }) {
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, loanAmount, totalInterest } = useMemo(() => {
    const loan = price * (1 - downPaymentPct / 100);
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const monthlyEmi =
      monthlyRate === 0 ? loan / months : (loan * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    return { emi: monthlyEmi, loanAmount: loan, totalInterest: monthlyEmi * months - loan };
  }, [price, downPaymentPct, rate, years]);

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h3 className="font-display text-lg text-ink">EMI Calculator</h3>

      <div className="mt-5 space-y-5">
        <Slider label="Down Payment" value={downPaymentPct} onChange={setDownPaymentPct} min={10} max={80} step={5} display={`${downPaymentPct}%`} />
        <Slider label="Interest Rate" value={rate} onChange={setRate} min={6} max={13} step={0.1} display={`${rate.toFixed(1)}%`} />
        <Slider label="Loan Tenure" value={years} onChange={setYears} min={5} max={30} step={1} display={`${years} yrs`} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-ink-faint">Monthly EMI</div>
          <div className="mt-1 font-display text-xl text-accent">{formatIndianPrice(emi)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-ink-faint">Loan Amount</div>
          <div className="mt-1 text-sm font-medium text-ink">{formatIndianPrice(loanAmount)}</div>
        </div>
        <div className="col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-ink-faint">Total Interest Payable</div>
          <div className="mt-1 text-sm font-medium text-ink">{formatIndianPrice(totalInterest)}</div>
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-ink-faint">
        Indicative only — actual EMI depends on the lender&apos;s terms and your eligibility.
      </p>
    </div>
  );
}

function Slider({
  label, value, onChange, min, max, step, display,
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; display: string;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium uppercase tracking-wide text-ink-faint">{label}</span>
        <span className="font-medium text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
