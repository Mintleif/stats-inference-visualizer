"use client";

import { useMemo, useState } from "react";
import { betaFunction, gamma, normalPdf, round } from "@/lib/math";
import type { ChartPoint } from "@/lib/types";
import { ChartCard } from "./ChartCard";
import { MathBlock } from "./MathBlock";
import { Panel } from "./Panel";
import { SliderField } from "./SliderField";

type BayesModel = "beta-binomial" | "gamma-poisson" | "normal-normal";

function betaPdf(x: number, alpha: number, beta: number) {
  return x ** (alpha - 1) * (1 - x) ** (beta - 1) / betaFunction(alpha, beta);
}

function gammaPdf(x: number, alpha: number, beta: number) {
  return (1 / (beta ** alpha * gamma(alpha))) * x ** (alpha - 1) * Math.exp(-x / beta);
}

export function BayesianUpdating() {
  const [model, setModel] = useState<BayesModel>("beta-binomial");

  const [priorAlpha, setPriorAlpha] = useState(2);
  const [priorBeta, setPriorBeta] = useState(2);
  const [successes, setSuccesses] = useState(8);
  const [failures, setFailures] = useState(3);

  const [poissonAlpha, setPoissonAlpha] = useState(3);
  const [poissonBeta, setPoissonBeta] = useState(1.5);
  const [poissonTotal, setPoissonTotal] = useState(18);
  const [poissonN, setPoissonN] = useState(6);

  const [priorMean, setPriorMean] = useState(0);
  const [priorSd, setPriorSd] = useState(2);
  const [knownSd, setKnownSd] = useState(1.5);
  const [sampleMean, setSampleMean] = useState(1);
  const [normalN, setNormalN] = useState(12);

  const betaPosteriorAlpha = priorAlpha + successes;
  const betaPosteriorBeta = priorBeta + failures;
  const betaPosteriorMean = betaPosteriorAlpha / (betaPosteriorAlpha + betaPosteriorBeta);

  const gammaPosteriorAlpha = poissonAlpha + poissonTotal;
  const gammaPosteriorBeta = 1 / (1 / poissonBeta + poissonN);
  const gammaPosteriorMean = gammaPosteriorAlpha * gammaPosteriorBeta;

  const posteriorVariance = 1 / (1 / priorSd ** 2 + normalN / knownSd ** 2);
  const posteriorMean =
    posteriorVariance * (priorMean / priorSd ** 2 + (normalN * sampleMean) / knownSd ** 2);
  const posteriorSd = Math.sqrt(posteriorVariance);

  const data: ChartPoint[] = useMemo(() => {
    if (model === "gamma-poisson") {
      return Array.from({ length: 140 }, (_, index) => {
        const x = 0.001 + (Math.max(gammaPosteriorMean, poissonAlpha * poissonBeta) * 3.5 * index) / 139;
        return {
          x: round(x, 3),
          prior: gammaPdf(x, poissonAlpha, poissonBeta),
          posterior: gammaPdf(x, gammaPosteriorAlpha, gammaPosteriorBeta)
        };
      });
    }

    if (model === "normal-normal") {
      const left = Math.min(priorMean - 4 * priorSd, posteriorMean - 4 * posteriorSd);
      const right = Math.max(priorMean + 4 * priorSd, posteriorMean + 4 * posteriorSd);
      return Array.from({ length: 140 }, (_, index) => {
        const x = left + ((right - left) * index) / 139;
        return {
          x: round(x, 3),
          prior: normalPdf(x, priorMean, priorSd),
          posterior: normalPdf(x, posteriorMean, posteriorSd)
        };
      });
    }

    return Array.from({ length: 120 }, (_, index) => {
      const x = 0.001 + (0.998 * index) / 119;
      return {
        x: round(x, 3),
        prior: betaPdf(x, priorAlpha, priorBeta),
        posterior: betaPdf(x, betaPosteriorAlpha, betaPosteriorBeta)
      };
    });
  }, [
    model,
    priorAlpha,
    priorBeta,
    betaPosteriorAlpha,
    betaPosteriorBeta,
    poissonAlpha,
    poissonBeta,
    gammaPosteriorAlpha,
    gammaPosteriorBeta,
    gammaPosteriorMean,
    priorMean,
    priorSd,
    posteriorMean,
    posteriorSd
  ]);

  const updateMath =
    model === "beta-binomial"
      ? "\\operatorname{Beta}(\\alpha,\\beta)\\;\\xrightarrow[]{s,f}\\;\\operatorname{Beta}(\\alpha+s,\\beta+f)"
      : model === "gamma-poisson"
        ? "\\lambda\\sim\\operatorname{Gamma}(\\alpha,\\beta),\\;\\sum X_i=t\\Rightarrow \\lambda\\mid x\\sim\\operatorname{Gamma}\\left(\\alpha+t,\\frac{1}{1/\\beta+n}\\right)"
        : "\\mu\\sim N(\\mu_0,\\tau^2),\\;\\bar X\\mid\\mu\\sim N\\left(\\mu,\\frac{\\sigma^2}{n}\\right)\\Rightarrow \\mu\\mid x\\sim N(\\mu_n,\\tau_n^2)";

  const posteriorCenter =
    model === "beta-binomial"
      ? betaPosteriorMean
      : model === "gamma-poisson"
        ? gammaPosteriorMean
        : posteriorMean;

  return (
    <Panel title="Bayesian Updating" eyebrow="Prior, likelihood, posterior, decision">
      <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
        <div className="space-y-4">
          <label className="block rounded-2xl border border-ink/10 bg-white/70 p-4">
            <span className="mb-2 block text-sm font-bold text-ink">Conjugate model</span>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as BayesModel)}
              className="w-full rounded-xl border border-ink/10 bg-cream px-3 py-2 font-semibold text-ink"
            >
              <option value="beta-binomial">Beta prior + Binomial/Bernoulli data</option>
              <option value="gamma-poisson">Gamma prior + Poisson data</option>
              <option value="normal-normal">Normal prior + Normal mean data</option>
            </select>
          </label>

          {model === "beta-binomial" ? (
            <>
              <SliderField label="Prior α" min={0.5} max={30} step={0.5} value={priorAlpha} onChange={setPriorAlpha} />
              <SliderField label="Prior β" min={0.5} max={30} step={0.5} value={priorBeta} onChange={setPriorBeta} />
              <SliderField label="Observed successes s" min={0} max={80} step={1} value={successes} onChange={setSuccesses} />
              <SliderField label="Observed failures f" min={0} max={80} step={1} value={failures} onChange={setFailures} />
            </>
          ) : null}

          {model === "gamma-poisson" ? (
            <>
              <SliderField label="Prior shape α" min={0.5} max={20} step={0.5} value={poissonAlpha} onChange={setPoissonAlpha} />
              <SliderField label="Prior scale β" min={0.2} max={8} step={0.1} value={poissonBeta} onChange={setPoissonBeta} />
              <SliderField label="Total count t = Σxᵢ" min={0} max={80} step={1} value={poissonTotal} onChange={setPoissonTotal} />
              <SliderField label="Number of intervals n" min={1} max={40} step={1} value={poissonN} onChange={setPoissonN} />
            </>
          ) : null}

          {model === "normal-normal" ? (
            <>
              <SliderField label="Prior mean μ₀" min={-8} max={8} step={0.1} value={priorMean} onChange={setPriorMean} />
              <SliderField label="Prior SD τ" min={0.2} max={6} step={0.1} value={priorSd} onChange={setPriorSd} />
              <SliderField label="Known data SD σ" min={0.2} max={6} step={0.1} value={knownSd} onChange={setKnownSd} />
              <SliderField label="Sample mean x̄" min={-8} max={8} step={0.1} value={sampleMean} onChange={setSampleMean} />
              <SliderField label="Sample size n" min={1} max={100} step={1} value={normalN} onChange={setNormalN} />
            </>
          ) : null}

          <div className="rounded-[1.5rem] border border-gold/40 bg-gold/15 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">Posterior mean</p>
            <p className="mt-2 text-4xl font-black text-ink">{round(posteriorCenter, 4)}</p>
          </div>
        </div>

        <div className="space-y-5">
          <ChartCard
            title="Prior vs posterior"
            data={data}
            kind="line"
            series={[
              { key: "prior", color: "#345c73", name: "prior" },
              { key: "posterior", color: "#b96b4f", name: "posterior" }
            ]}
            referenceX={round(posteriorCenter, 3)}
            height={340}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-clay">Update rule</p>
              <MathBlock math={updateMath} />
            </div>
            <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-4 leading-7 text-ink/75">
              <p><strong>Prior:</strong> your probability model for the parameter before the new data.</p>
              <p className="mt-2"><strong>Posterior:</strong> the updated parameter model after combining prior and likelihood.</p>
              <p className="mt-2"><strong>Frequentist contrast:</strong> frequentists treat the parameter as fixed and randomize estimators; Bayesians put probability directly on the parameter.</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-5">
            <p className="font-display text-2xl font-semibold text-ink">Discrete vs continuous Bayesian updating</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-clay">Discrete parameter</p>
                <MathBlock math="P(\\theta_j\\mid x)=\\frac{P(x\\mid\\theta_j)P(\\theta_j)}{\\sum_k P(x\\mid\\theta_k)P(\\theta_k)}" />
                <p className="mt-3 text-sm leading-6 text-ink/70">
                  Use sums when the possible parameter values are a list, such as theta in {"{theta1, theta2, theta3}"}.
                </p>
              </div>
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-clay">Continuous parameter</p>
                <MathBlock math="\\pi(\\theta\\mid x)=\\frac{f(x\\mid\\theta)\\pi(\\theta)}{\\int f(x\\mid t)\\pi(t)\\,dt}" />
                <p className="mt-3 text-sm leading-6 text-ink/70">
                  Use integrals when theta can vary continuously over an interval.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-ink/10 bg-white/75 p-5">
            <p className="font-display text-2xl font-semibold text-ink">Expected loss and Bayesian decision rule</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-clay">Squared loss</p>
                <MathBlock math="L(a,\\theta)=(a-\\theta)^2" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Choose posterior mean.</p>
              </div>
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-clay">Absolute loss</p>
                <MathBlock math="L(a,\\theta)=|a-\\theta|" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Choose posterior median.</p>
              </div>
              <div className="rounded-2xl bg-sage/40 p-4">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-clay">0-1 loss</p>
                <MathBlock math="L(a,\\theta)=\\mathbf{1}(a\\ne\\theta)" />
                <p className="mt-3 text-sm leading-6 text-ink/70">Choose posterior mode/MAP.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink/75">
              General rule: pick the action a that minimizes posterior expected loss.
            </p>
            <div className="mt-3">
              <MathBlock math="a^*=\\arg\\min_a E[L(a,\\theta)\\mid x]" />
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
