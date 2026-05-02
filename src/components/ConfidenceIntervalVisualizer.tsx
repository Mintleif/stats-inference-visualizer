"use client";

import { useMemo, useState } from "react";
import { distributionOptions, distributions } from "@/lib/distributions";
import { mean, normalSample, quantileNormal, round } from "@/lib/math";
import type { ChartPoint, DistributionKey } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

function defaultParams(key: DistributionKey) {
  return Object.fromEntries(
    distributions[key].parameters.map((parameter) => [parameter.key, parameter.defaultValue])
  );
}

export function ConfidenceIntervalVisualizer() {
  const [selected, setSelected] = useState<DistributionKey>("normal");
  const [paramsByDistribution, setParamsByDistribution] = useState(
    () =>
      Object.fromEntries(
        distributionOptions.map((distribution) => [distribution.key, defaultParams(distribution.key)])
      ) as Record<DistributionKey, Record<string, number>>
  );
  const [sampleSize, setSampleSize] = useState(25);
  const [confidence, setConfidence] = useState(0.95);
  const [runId, setRunId] = useState(1);
  const distribution = distributions[selected];
  const params = paramsByDistribution[selected];
  const populationMean = distribution.mean(params);
  const sd = Math.sqrt(distribution.variance(params));

  function updateParam(key: string, value: number) {
    setParamsByDistribution((current) => ({
      ...current,
      [selected]: {
        ...current[selected],
        [key]: value
      }
    }));
  }

  const simulation = useMemo(() => {
    void runId;
    const sample = Array.from({ length: sampleSize }, () => {
      const value = distribution.sample(params);
      return Number.isFinite(value) ? value : normalSample(populationMean, sd);
    });
    const sampleMean = mean(sample);
    const z = quantileNormal(confidence);
    const margin = z * sd / Math.sqrt(sampleSize);
    return {
      sample,
      sampleMean,
      lower: sampleMean - margin,
      upper: sampleMean + margin,
      contains: populationMean >= sampleMean - margin && populationMean <= sampleMean + margin
    };
  }, [distribution, params, populationMean, sd, sampleSize, confidence, runId]);

  const sampleData: ChartPoint[] = simulation.sample.map((value, index) => ({
    x: index + 1,
    y: round(value, 3)
  }));

  return (
    <Panel title="Confidence Interval Visualizer" eyebrow="Coverage, one sample at a time">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <label className="block rounded-2xl border border-ink/10 bg-white/70 p-4">
            <span className="mb-2 block text-sm font-bold text-ink">Sampling distribution</span>
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value as DistributionKey)}
              className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 font-semibold text-ink"
            >
              {distributionOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
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
          <SliderField label="Sample size" min={5} max={200} step={1} value={sampleSize} onChange={setSampleSize} />
          <label className="block rounded-2xl border border-ink/10 bg-white/70 p-4">
            <span className="mb-2 block text-sm font-bold text-ink">Confidence level</span>
            <select
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
              className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 font-semibold text-ink"
            >
              <option value={0.8}>80%</option>
              <option value={0.9}>90%</option>
              <option value={0.95}>95%</option>
              <option value={0.98}>98%</option>
              <option value={0.99}>99%</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => setRunId((value) => value + 1)}
            className="w-full rounded-2xl bg-clay px-5 py-3 font-black text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Repeat simulation
          </button>
        </div>

        <div className="space-y-5">
          <div className={`rounded-[1.5rem] border p-5 ${simulation.contains ? "border-moss bg-moss/10" : "border-clay bg-clay/10"}`}>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">Current interval</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">
              [{round(simulation.lower)}, {round(simulation.upper)}]
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/75">
              Sample mean = {round(simulation.sampleMean)}. This interval {simulation.contains ? "contains" : "misses"} the true population mean {populationMean}.
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              True mean = {round(populationMean)} and true standard deviation = {round(sd)} for the selected {distribution.name} model.
            </p>
          </div>
          <ChartCard
            title="Generated sample values"
            data={sampleData}
            kind="bar"
            referenceX={undefined}
            height={260}
          />
          <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">
              {selected === "normal" ? "Known-σ z interval" : "Large-sample CLT interval"}
            </p>
            <MathBlock math="\\bar X \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n}" />
            <p className="mt-3 text-sm leading-6 text-ink/70">
              For Normal data with known σ this is exact. For non-Normal data, it is a CLT approximation for the mean, so it improves as n grows.
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
