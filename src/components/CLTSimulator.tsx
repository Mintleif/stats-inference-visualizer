"use client";

import { useMemo, useState } from "react";
import { distributionOptions, distributions } from "@/lib/distributions";
import { histogram, mean, normalPdf, round } from "@/lib/math";
import type { ChartPoint, DistributionKey } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

function defaultParams(key: DistributionKey) {
  return Object.fromEntries(
    distributions[key].parameters.map((parameter) => [parameter.key, parameter.defaultValue])
  );
}

export function CLTSimulator() {
  const [base, setBase] = useState<DistributionKey>("exponential");
  const [sampleSize, setSampleSize] = useState(20);
  const [simulations, setSimulations] = useState(800);
  const [runId, setRunId] = useState(1);
  const distribution = distributions[base];
  const params = useMemo(() => defaultParams(base), [base]);

  const simulated = useMemo(() => {
    void runId;
    const means = Array.from({ length: simulations }, () => {
      const sample = Array.from({ length: sampleSize }, () => distribution.sample(params));
      return mean(sample);
    });
    const hist = histogram(means, 26);
    const center = distribution.mean(params);
    const sd = Math.sqrt(distribution.variance(params) / sampleSize);
    const normalCurve: ChartPoint[] = hist.map((point) => ({
      ...point,
      normal: normalPdf(point.x, center, sd) * (hist[1]?.x - hist[0]?.x || 1)
    }));
    return { means, hist: normalCurve, center, sd };
  }, [distribution, params, sampleSize, simulations, runId]);

  return (
    <Panel title="Central Limit Theorem Simulator" eyebrow="Averages become normal">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <label className="block rounded-2xl border border-ink/10 bg-white/70 p-4">
            <span className="mb-2 block text-sm font-bold text-ink">Base distribution</span>
            <select
              value={base}
              onChange={(event) => setBase(event.target.value as DistributionKey)}
              className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 font-semibold text-ink"
            >
              {distributionOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
          <SliderField label="Sample size n" min={1} max={120} step={1} value={sampleSize} onChange={setSampleSize} />
          <SliderField label="Number of simulations" min={100} max={3000} step={100} value={simulations} onChange={setSimulations} />
          <button
            type="button"
            onClick={() => setRunId((value) => value + 1)}
            className="w-full rounded-2xl bg-clay px-5 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Resimulate
          </button>
          <div className="rounded-2xl bg-sage/50 p-4 text-sm leading-6 text-ink/75">
            The original distribution can be skewed or discrete. The histogram shows repeated sample means. As n grows, those means tighten around {round(simulated.center)} and look increasingly normal.
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <ChartCard
            title={`Original ${distribution.name}`}
            data={distribution.points(params)}
            kind={distribution.kind === "discrete" ? "bar" : "area"}
          />
          <ChartCard
            title={`Sample means, n = ${sampleSize}`}
            data={simulated.hist}
            kind="bar"
            series={[
              { key: "y", color: "#3d6650", name: "simulated means" },
              { key: "normal", color: "#b96b4f", name: "normal guide" }
            ]}
            referenceX={round(simulated.center, 3)}
          />
        </div>
      </div>
    </Panel>
  );
}
