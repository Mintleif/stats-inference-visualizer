"use client";

import { useMemo, useState } from "react";
import { betaFunction, round } from "@/lib/math";
import type { ChartPoint } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

function betaPdf(x: number, alpha: number, beta: number) {
  return x ** (alpha - 1) * (1 - x) ** (beta - 1) / betaFunction(alpha, beta);
}

export function BayesianUpdating() {
  const [priorAlpha, setPriorAlpha] = useState(2);
  const [priorBeta, setPriorBeta] = useState(2);
  const [successes, setSuccesses] = useState(8);
  const [failures, setFailures] = useState(3);

  const posteriorAlpha = priorAlpha + successes;
  const posteriorBeta = priorBeta + failures;
  const posteriorMean = posteriorAlpha / (posteriorAlpha + posteriorBeta);

  const data: ChartPoint[] = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => {
        const x = 0.001 + (0.998 * index) / 119;
        return {
          x: round(x, 3),
          prior: betaPdf(x, priorAlpha, priorBeta),
          posterior: betaPdf(x, posteriorAlpha, posteriorBeta)
        };
      }),
    [priorAlpha, priorBeta, posteriorAlpha, posteriorBeta]
  );

  return (
    <Panel title="Bayesian Updating" eyebrow="Beta-binomial intuition">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderField label="Prior alpha" min={0.5} max={30} step={0.5} value={priorAlpha} onChange={setPriorAlpha} />
          <SliderField label="Prior beta" min={0.5} max={30} step={0.5} value={priorBeta} onChange={setPriorBeta} />
          <SliderField label="Observed successes" min={0} max={80} step={1} value={successes} onChange={setSuccesses} />
          <SliderField label="Observed failures" min={0} max={80} step={1} value={failures} onChange={setFailures} />
          <div className="rounded-[1.5rem] border border-gold/40 bg-gold/15 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">Posterior mean</p>
            <p className="mt-2 text-4xl font-black text-ink">{round(posteriorMean, 4)}</p>
          </div>
        </div>

        <div className="space-y-5">
          <ChartCard
            title="Prior vs posterior belief about p"
            data={data}
            kind="line"
            series={[
              { key: "prior", color: "#345c73", name: "prior" },
              { key: "posterior", color: "#b96b4f", name: "posterior" }
            ]}
            referenceX={round(posteriorMean, 3)}
            height={340}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">Update rule</p>
              <MathBlock math="\\operatorname{Beta}(\\alpha,\\beta)+s\\text{ successes}+f\\text{ failures}=\\operatorname{Beta}(\\alpha+s,\\beta+f)" />
            </div>
            <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4 leading-7 text-ink/75">
              Think of alpha and beta as prior pseudo-counts. Successes add to alpha, failures add to beta. More data makes the posterior narrower, so the estimate becomes less wobbly.
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
