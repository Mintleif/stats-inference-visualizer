"use client";

import { examCards } from "@/lib/inferenceContent";
import { Panel } from "./Panel";

export function ExamMode() {
  return (
    <Panel title="Exam Mode" eyebrow="Fast recall cards">
      <div className="mb-5 rounded-[1.5rem] border border-clay/30 bg-clay/10 p-5">
        <p className="font-display text-2xl font-semibold text-ink">When you freeze, reduce the problem to three questions.</p>
        <p className="mt-2 leading-7 text-ink/75">
          What kind of random variable is this? What parameter is unknown? Which statistic naturally summarizes the data?
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {examCards.map((card) => (
          <article key={card.title} className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <h3 className="font-display text-2xl font-semibold text-moss">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/75">{card.body}</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}
