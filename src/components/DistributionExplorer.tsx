"use client";

import { useMemo, useState } from "react";
import { distributionOptions, distributions } from "@/lib/distributions";
import type { DistributionKey } from "@/lib/types";
import { round } from "@/lib/math";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

function defaultParams(key: DistributionKey) {
  return Object.fromEntries(
    distributions[key].parameters.map((parameter) => [parameter.key, parameter.defaultValue])
  );
}

export function DistributionExplorer() {
  const [selected, setSelected] = useState<DistributionKey>("beta");
  const [paramsByDistribution, setParamsByDistribution] = useState(
    () =>
      Object.fromEntries(
        distributionOptions.map((distribution) => [distribution.key, defaultParams(distribution.key)])
      ) as Record<DistributionKey, Record<string, number>>
  );

  const distribution = distributions[selected];
  const params = paramsByDistribution[selected];
  const points = useMemo(() => distribution.points(params), [distribution, params]);

  function updateParam(key: string, value: number) {
    setParamsByDistribution((current) => ({
      ...current,
      [selected]: {
        ...current[selected],
        [key]: value
      }
    }));
  }

  return (
    <Panel title="Distribution Explorer" eyebrow="Probability shapes">
      <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {distributionOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSelected(option.key)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                  selected === option.key
                    ? "border-moss bg-moss text-white shadow-soft"
                    : "border-ink/10 bg-white/70 text-ink hover:border-moss/50"
                }`}
              >
                {option.name}
                <span className="block text-xs font-semibold opacity-70">
                  {option.kind === "discrete" ? "PMF" : "PDF"}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {distribution.parameters.map((parameter) => (
              <SliderField
                key={parameter.key}
                label={parameter.label}
                min={parameter.min}
                max={parameter.max}
                step={parameter.step}
                value={params[parameter.key]}
                onChange={(value) => updateParam(parameter.key, value)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <ChartCard
            title={`${distribution.name} ${distribution.kind === "discrete" ? "PMF" : "PDF"}`}
            data={points}
            kind={distribution.kind === "discrete" ? "bar" : "area"}
            height={330}
          />
          <div className="grid gap-4">
            <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">Formula</p>
              <MathBlock math={distribution.formula} compact />
              <div className="mt-4 grid gap-3">
                {distribution.formulaDetails.map((detail) => (
                  <div key={detail.label} className="min-w-0 overflow-hidden rounded-2xl bg-sage/40 p-3">
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-moss">{detail.label}</p>
                    <div className="min-w-0">
                      <MathBlock math={detail.math} compact />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">Moments</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-sage/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-moss">Mean</p>
                  <p className="mt-2 text-3xl font-black text-ink">{round(distribution.mean(params))}</p>
                </div>
                <div className="rounded-2xl bg-sage/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-moss">Variance</p>
                  <p className="mt-2 text-3xl font-black text-ink">{round(distribution.variance(params))}</p>
                </div>
              </div>
              <p className="mt-4 leading-7 text-ink/75">{distribution.explanation(params)}</p>
            </div>
          </div>
          <details className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
            <summary className="cursor-pointer font-display text-2xl font-semibold text-ink">
              Distribution comparison methods
            </summary>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-clay">Kolmogorov-Smirnov</p>
                <MathBlock math="D=\\sup_x |F(x)-G(x)|" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Looks at the largest vertical gap between two CDFs.</p>
              </div>
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-clay">Absolute area</p>
                <MathBlock math="d_1(f,g)=\\int_a^b |f(x)-g(x)|\\,dx" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Measures total absolute density difference across an interval.</p>
              </div>
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-clay">Squared area</p>
                <MathBlock math="d_2(f,g)=\\int_a^b (f(x)-g(x))^2\\,dx" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Punishes large local differences more strongly because they are squared.</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </Panel>
  );
}
