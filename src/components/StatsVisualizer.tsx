"use client";

import { useState } from "react";
import { BayesianUpdating } from "./BayesianUpdating";
import { CLTSimulator } from "./CLTSimulator";
import { ConfidenceIntervalVisualizer } from "./ConfidenceIntervalVisualizer";
import { DistributionExplorer } from "./DistributionExplorer";
import { ExamMode } from "./ExamMode";
import { InferenceLab } from "./InferenceLab";

const sections = [
  { id: "distribution", label: "Distribution Explorer", component: <DistributionExplorer /> },
  { id: "clt", label: "CLT Simulator", component: <CLTSimulator /> },
  { id: "ci", label: "Confidence Intervals", component: <ConfidenceIntervalVisualizer /> },
  { id: "bayes", label: "Bayesian Updating", component: <BayesianUpdating /> },
  { id: "lab", label: "Inference Lab", component: <InferenceLab /> },
  { id: "exam", label: "Quick Reference", component: <ExamMode /> }
];

export function StatsVisualizer() {
  const [active, setActive] = useState("distribution");
  const activeSection = sections.find((section) => section.id === active) ?? sections[0];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute left-[-8rem] top-28 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 right-[-8rem] h-96 w-96 rounded-full bg-tide/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <header className="animate-rise-in rounded-[2.25rem] border border-white/70 bg-white/68 p-6 shadow-soft backdrop-blur md:p-9">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-clay">Portfolio project</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <h1 className="font-display text-5xl font-semibold leading-[0.96] text-ink md:text-7xl">
                Statistics Intuition + Inference Visualizer
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/75">
                An interactive probability and inference workshop for distributions, simulation, confidence intervals, Bayesian updating, and mathematical statistics derivations.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-ink p-5 text-cream">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-gold">How to use it</p>
              <p className="mt-3 leading-7 text-cream/80">
                Tweak sliders, compare curves, rerun simulations, then rehearse derivations step by step until the algebra has somewhere friendly to land.
              </p>
            </div>
          </div>
        </header>

        <nav className="sticky top-3 z-10 my-6 rounded-[1.5rem] border border-white/70 bg-cream/82 p-2 shadow-soft backdrop-blur">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black transition ${
                  active === section.id
                    ? "bg-ink text-cream shadow-soft"
                    : "text-ink/70 hover:bg-white hover:text-ink"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="animate-rise-in" key={activeSection.id}>
          {activeSection.component}
        </div>
      </div>
    </main>
  );
}
