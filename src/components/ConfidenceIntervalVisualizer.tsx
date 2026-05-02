"use client";

import { useMemo, useState } from "react";
import { mean, normalSample, quantileNormal, round } from "@/lib/math";
import type { ChartPoint } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

export function ConfidenceIntervalVisualizer() {
  const [populationMean, setPopulationMean] = useState(10);
  const [sd, setSd] = useState(2);
  const [sampleSize, setSampleSize] = useState(25);
  const [confidence, setConfidence] = useState(0.95);
  const [runId, setRunId] = useState(1);

  const simulation = useMemo(() => {
    const sample = Array.from({ length: sampleSize }, () => normalSample(populationMean, sd));
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
  }, [populationMean, sd, sampleSize, confidence, runId]);

  const sampleData: ChartPoint[] = simulation.sample.map((value, index) => ({
    x: index + 1,
    y: round(value, 3)
  }));

  return (
    <Panel title="Confidence Interval Visualizer" eyebrow="Coverage, one sample at a time">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderField label="Population mean" min={-10} max={30} step={0.5} value={populationMean} onChange={setPopulationMean} />
          <SliderField label="Known standard deviation" min={0.5} max={10} step={0.1} value={sd} onChange={setSd} />
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
          </div>
          <ChartCard
            title="Generated sample values"
            data={sampleData}
            kind="bar"
            referenceX={undefined}
            height={260}
          />
          <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">Known-sigma z interval</p>
            <MathBlock math="\\bar X \\pm z_{\\alpha/2}\\frac{\\sigma}{\\sqrt n}" />
          </div>
        </div>
      </div>
    </Panel>
  );
}
