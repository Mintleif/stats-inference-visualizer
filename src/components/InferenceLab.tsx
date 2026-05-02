"use client";

import { useMemo, useState } from "react";
import {
  crlbExamples,
  fisherExamples,
  lrtExample,
  mleExamples,
  mvueExamples,
  smallLargeExamples
} from "@/lib/inferenceContent";
import { normalPdf, round } from "@/lib/math";
import type { ChartPoint, InferenceExample } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { StepAccordion } from "./StepAccordion";

type LabSection = {
  id: string;
  title: string;
  intro: string;
  examples: InferenceExample[];
};

const labSections: LabSection[] = [
  {
    id: "mle",
    title: "A. Maximum Likelihood Estimation",
    intro: "The exam rhythm: likelihood, log-likelihood, derivative, zero, solve.",
    examples: mleExamples
  },
  {
    id: "fisher",
    title: "B. Fisher Information",
    intro: "Information measures how sharply the log-likelihood changes around the true parameter.",
    examples: fisherExamples
  },
  {
    id: "crlb",
    title: "C. Cramer-Rao Lower Bound",
    intro: "CRLB gives a best-possible variance target for unbiased estimators.",
    examples: crlbExamples
  },
  {
    id: "mvue",
    title: "D. MVUE",
    intro: "Two common routes: hit the CRLB, or use Lehmann-Scheffe with completeness.",
    examples: mvueExamples
  },
  {
    id: "lrt",
    title: "E. Likelihood Ratio Test",
    intro: "For simple-vs-simple tests, reject where the observed data support H1 much more than H0.",
    examples: [lrtExample]
  },
  {
    id: "small-large",
    title: "F. Small Sample vs Large Sample",
    intro: "Small samples prefer exact distributions; large samples lean on asymptotic normality.",
    examples: smallLargeExamples
  }
];

function LrtVisual() {
  const data: ChartPoint[] = useMemo(
    () =>
      Array.from({ length: 140 }, (_, index) => {
        const x = -3 + (6 * index) / 139;
        return {
          x: round(x, 3),
          h0: normalPdf(x, -0.7, 0.9),
          h1: normalPdf(x, 0.9, 0.9)
        };
      }),
    []
  );

  return (
    <div className="space-y-4">
      <ChartCard
        title="Visual rejection region"
        data={data}
        kind="line"
        series={[
          { key: "h0", color: "#345c73", name: "likelihood under H0" },
          { key: "h1", color: "#b96b4f", name: "likelihood under H1" }
        ]}
        referenceX={0.25}
        referenceArea={{ start: 0.25, end: 3, color: "#b96b4f" }}
      />
      <p className="rounded-2xl bg-sage/50 p-4 text-sm leading-6 text-ink/75">
        In this sketch, large observations are more likely under H1 than H0. The shaded right tail is the rejection region. The critical value c is chosen so the H0 probability of landing in the shaded region equals alpha.
      </p>
    </div>
  );
}

export function InferenceLab() {
  const [active, setActive] = useState("mle");
  const section = labSections.find((item) => item.id === active) ?? labSections[0];

  return (
    <Panel title="Statistical Inference Lab" eyebrow="Derivations you can rehearse">
      <div className="grid gap-6 xl:grid-cols-[330px_1fr]">
        <aside className="space-y-2">
          {labSections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                active === item.id
                  ? "border-moss bg-moss text-white shadow-soft"
                  : "border-ink/10 bg-white/70 text-ink hover:border-moss/50"
              }`}
            >
              <span className="block font-display text-xl font-semibold">{item.title}</span>
              <span className="mt-1 block text-sm opacity-75">{item.intro}</span>
            </button>
          ))}
          <div className="rounded-[1.5rem] border border-gold/40 bg-gold/15 p-4 text-sm leading-6 text-ink/75">
            Exam trick: always name the parameter, name the statistic, and say which theorem or bound you are using. That alone often earns method marks.
          </div>
        </aside>

        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-5">
            <h3 className="font-display text-3xl font-semibold text-ink">{section.title}</h3>
            <p className="mt-2 leading-7 text-ink/75">{section.intro}</p>
            {active === "small-large" ? (
              <div className="mt-4">
                <MathBlock math="\\sqrt n(\\hat\\theta-\\theta)\\overset{d}{\\longrightarrow}N\\left(0,\\frac{1}{I(\\theta)}\\right)" />
              </div>
            ) : null}
          </div>

          {active === "lrt" ? <LrtVisual /> : null}

          <div className="space-y-4">
            {section.examples.map((example, index) => (
              <StepAccordion key={example.id} example={example} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
