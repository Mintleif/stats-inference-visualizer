"use client";

import type { InferenceExample } from "@/lib/types";
import { MathBlock } from "./MathBlock";

export function StepAccordion({ example, defaultOpen = false }: { example: InferenceExample; defaultOpen?: boolean }) {
  return (
    <details className="group rounded-[1.5rem] border border-ink/10 bg-white/75 p-4 shadow-sm" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">{example.title}</h3>
          <p className="mt-1 text-sm text-ink/70">{example.context}</p>
        </div>
        <span className="rounded-full bg-moss px-3 py-1 text-sm font-bold text-white transition group-open:rotate-2">
          Steps
        </span>
      </summary>
      <div className="mt-5 space-y-4">
        {example.steps.map((step, index) => (
          <div key={`${example.id}-${step.title}`} className="rounded-2xl bg-sage/40 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">
              Step {index + 1}: {step.title}
            </p>
            <div className="mt-3">
              <MathBlock math={step.math} />
            </div>
            <p className="mt-3 text-sm leading-6 text-ink/75">{step.explanation}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-gold/40 bg-gold/15 p-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-clay">Final answer</p>
          <MathBlock math={example.result} />
        </div>
      </div>
    </details>
  );
}
