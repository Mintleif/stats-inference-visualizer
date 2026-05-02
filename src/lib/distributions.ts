import {
  betaFunction,
  combination,
  factorial,
  gamma,
  normalPdf,
  normalSample,
  round
} from "./math";
import type { DistributionConfig, DistributionKey } from "./types";

function range(start: number, end: number, steps: number) {
  return Array.from({ length: steps }, (_, index) => start + ((end - start) * index) / (steps - 1));
}

function poissonSample(lambda: number) {
  const limit = Math.exp(-lambda);
  let product = 1;
  let k = 0;
  do {
    k += 1;
    product *= Math.random();
  } while (product > limit);
  return k - 1;
}

function gammaSample(shape: number, rate: number): number {
  // Marsaglia and Tsang's method; handles shape < 1 by boosting then rescaling.
  if (shape < 1) {
    return gammaSample(shape + 1, rate) * Math.random() ** (1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const z = normalSample();
    const v = (1 + c * z) ** 3;
    if (v <= 0) continue;
    const u = Math.random();
    if (u < 1 - 0.0331 * z ** 4) return (d * v) / rate;
    if (Math.log(u) < 0.5 * z ** 2 + d * (1 - v + Math.log(v))) {
      return (d * v) / rate;
    }
  }
}

function empiricalValues(n: number, shift: number, spread: number) {
  return Array.from({ length: Math.floor(n) }, (_, index) => {
    const wave = Math.sin(index * 1.7) + 0.35 * Math.cos(index * 0.8);
    const trend = (index / Math.max(1, n - 1) - 0.5) * 0.8;
    return shift + spread * (wave + trend);
  }).sort((a, b) => a - b);
}

export const distributions: Record<DistributionKey, DistributionConfig> = {
  bernoulli: {
    key: "bernoulli",
    name: "Bernoulli",
    kind: "discrete",
    formula: "P(X=x)=p^x(1-p)^{1-x},\\quad x\\in\\{0,1\\}",
    formulaDetails: [
      { label: "Mean", math: "E(X)=p" },
      { label: "Variance", math: "\\operatorname{Var}(X)=p(1-p)" },
      { label: "MLE", math: "\\hat p=\\bar X=\\frac{1}{n}\\sum_{i=1}^n x_i" }
    ],
    parameters: [{ key: "p", label: "Success probability p", min: 0.01, max: 0.99, step: 0.01, defaultValue: 0.5 }],
    mean: ({ p }) => p,
    variance: ({ p }) => p * (1 - p),
    explanation: ({ p }) =>
      `p controls how much mass sits on 1. At p = ${round(p)}, success is ${round(p * 100, 1)}% likely and the variance is largest near p = 0.5.`,
    points: ({ p }) => [
      { x: 0, y: 1 - p, label: "failure" },
      { x: 1, y: p, label: "success" }
    ],
    sample: ({ p }) => (Math.random() < p ? 1 : 0)
  },
  binomial: {
    key: "binomial",
    name: "Binomial",
    kind: "discrete",
    formula: "P(X=x)=\\binom{n}{x}p^x(1-p)^{n-x},\\quad x=0,1,\\ldots,n",
    formulaDetails: [
      { label: "Mean", math: "E(X)=np" },
      { label: "Variance", math: "\\operatorname{Var}(X)=np(1-p)" },
      { label: "MLE for p", math: "\\hat p=\\frac{x}{n}\\quad\\text{for one count, or}\\quad \\hat p=\\frac{\\sum x_i}{mn}\\text{ for }m\\text{ observations}" }
    ],
    parameters: [
      { key: "n", label: "Trials n", min: 1, max: 60, step: 1, defaultValue: 12 },
      { key: "p", label: "Success probability p", min: 0.01, max: 0.99, step: 0.01, defaultValue: 0.35 }
    ],
    mean: ({ n, p }) => n * p,
    variance: ({ n, p }) => n * p * (1 - p),
    explanation: ({ n, p }) =>
      `n sets the maximum count and p shifts the center to np = ${round(n * p)}. Larger n makes the count more spread out in absolute terms.`,
    points: ({ n, p }) =>
      Array.from({ length: Math.floor(n) + 1 }, (_, k) => ({
        x: k,
        y: combination(Math.floor(n), k) * p ** k * (1 - p) ** (Math.floor(n) - k)
      })),
    sample: ({ n, p }) => {
      let successes = 0;
      for (let i = 0; i < n; i += 1) successes += Math.random() < p ? 1 : 0;
      return successes;
    }
  },
  poisson: {
    key: "poisson",
    name: "Poisson",
    kind: "discrete",
    formula: "P(X=x)=e^{-\\lambda}\\frac{\\lambda^x}{x!},\\quad x=0,1,2,\\ldots",
    formulaDetails: [
      { label: "Mean", math: "E(X)=\\lambda" },
      { label: "Variance", math: "\\operatorname{Var}(X)=\\lambda" },
      { label: "MLE", math: "\\hat\\lambda=\\bar X" }
    ],
    parameters: [{ key: "lambda", label: "Rate λ", min: 0.2, max: 18, step: 0.1, defaultValue: 4 }],
    mean: ({ lambda }) => lambda,
    variance: ({ lambda }) => lambda,
    explanation: ({ lambda }) =>
      `λ is both the average count and the variance. Increasing λ moves the distribution right and makes it look more bell-shaped.`,
    points: ({ lambda }) => {
      const max = Math.max(12, Math.ceil(lambda + 5 * Math.sqrt(lambda)));
      return Array.from({ length: max + 1 }, (_, k) => ({
        x: k,
        y: Math.exp(-lambda) * lambda ** k / factorial(k)
      }));
    },
    sample: ({ lambda }) => poissonSample(lambda)
  },
  exponential: {
    key: "exponential",
    name: "Exponential",
    kind: "continuous",
    formula: "f(x)=\\frac{1}{\\theta}e^{-x/\\theta},\\quad x\\ge 0",
    formulaDetails: [
      { label: "Mean", math: "E(X)=\\theta" },
      { label: "Variance", math: "\\operatorname{Var}(X)=\\theta^2" },
      { label: "MLE", math: "\\hat\\theta=\\bar X" },
      { label: "Gamma connection", math: "X\\sim\\operatorname{Exponential}(\\theta)\\iff X\\sim\\operatorname{Gamma}(\\alpha=1,\\beta=\\theta)" }
    ],
    parameters: [{ key: "theta", label: "Scale θ", min: 0.2, max: 8, step: 0.1, defaultValue: 1.2 }],
    mean: ({ theta }) => theta,
    variance: ({ theta }) => theta ** 2,
    explanation: ({ theta }) =>
      `θ is the scale, so it is the average waiting time. A larger θ stretches the curve to the right and makes long waits more likely.`,
    points: ({ theta }) =>
      range(0, Math.max(6 * theta, 3), 90).map((x) => ({
        x: round(x, 3),
        y: (1 / theta) * Math.exp(-x / theta)
      })),
    sample: ({ theta }) => -theta * Math.log(1 - Math.random())
  },
  gamma: {
    key: "gamma",
    name: "Gamma",
    kind: "continuous",
    formula: "f(x)=\\frac{1}{\\beta^\\alpha\\Gamma(\\alpha)}x^{\\alpha-1}e^{-x/\\beta},\\quad x>0",
    formulaDetails: [
      { label: "Mean", math: "E(X)=\\alpha\\beta" },
      { label: "Variance", math: "\\operatorname{Var}(X)=\\alpha\\beta^2" },
      { label: "MLE notes", math: "\\hat\\beta=\\frac{\\bar X}{\\hat\\alpha},\\quad \\log\\hat\\alpha-\\psi(\\hat\\alpha)=\\log\\bar X-\\overline{\\log X}" }
    ],
    parameters: [
      { key: "alpha", label: "Shape α", min: 0.4, max: 12, step: 0.1, defaultValue: 3 },
      { key: "beta", label: "Scale β", min: 0.2, max: 6, step: 0.1, defaultValue: 1 }
    ],
    mean: ({ alpha, beta }) => alpha * beta,
    variance: ({ alpha, beta }) => alpha * beta ** 2,
    explanation: ({ alpha, beta }) =>
      `α acts like accumulated waiting stages; larger α creates a mound. β is a scale, so larger β stretches the distribution to the right.`,
    points: ({ alpha, beta }) =>
      range(0.001, Math.max(alpha * beta * 3.5, 5), 110).map((x) => ({
        x: round(x, 3),
        y: (1 / (beta ** alpha * gamma(alpha))) * x ** (alpha - 1) * Math.exp(-x / beta)
      })),
    sample: ({ alpha, beta }) => gammaSample(alpha, 1 / beta)
  },
  beta: {
    key: "beta",
    name: "Beta",
    kind: "continuous",
    formula: "f(x)=\\frac{\\Gamma(\\alpha+\\beta)}{\\Gamma(\\alpha)\\Gamma(\\beta)}x^{\\alpha-1}(1-x)^{\\beta-1},\\quad 0<x<1",
    formulaDetails: [
      { label: "Mean", math: "E(X)=\\frac{\\alpha}{\\alpha+\\beta}" },
      { label: "Variance", math: "\\operatorname{Var}(X)=\\frac{\\alpha\\beta}{(\\alpha+\\beta)^2(\\alpha+\\beta+1)}" },
      { label: "Conjugate update", math: "\\operatorname{Beta}(\\alpha,\\beta)\\to\\operatorname{Beta}(\\alpha+s,\\beta+f)" },
      { label: "MLE notes", math: "\\psi(\\hat\\alpha)-\\psi(\\hat\\alpha+\\hat\\beta)=\\overline{\\log X},\\quad \\psi(\\hat\\beta)-\\psi(\\hat\\alpha+\\hat\\beta)=\\overline{\\log(1-X)}" }
    ],
    parameters: [
      { key: "alpha", label: "α: prior successes", min: 0.3, max: 20, step: 0.1, defaultValue: 2 },
      { key: "beta", label: "β: prior failures", min: 0.3, max: 20, step: 0.1, defaultValue: 5 }
    ],
    mean: ({ alpha, beta }) => alpha / (alpha + beta),
    variance: ({ alpha, beta }) => (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
    explanation: ({ alpha, beta }) =>
      `Beta is a distribution over probabilities. α pulls belief toward 1, β pulls toward 0; together they act like prior success/failure counts for Bernoulli data.`,
    points: ({ alpha, beta }) =>
      range(0.001, 0.999, 120).map((x) => ({
        x: round(x, 3),
        y: x ** (alpha - 1) * (1 - x) ** (beta - 1) / betaFunction(alpha, beta)
      })),
    sample: ({ alpha, beta }) => {
      const left = gammaSample(alpha, 1);
      const right = gammaSample(beta, 1);
      return left / (left + right);
    }
  },
  normal: {
    key: "normal",
    name: "Normal",
    kind: "continuous",
    formula: "f(x)=\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
    formulaDetails: [
      { label: "Equivalent PDF", math: "f(x)=\\frac{1}{\\sqrt{\\sigma^2}\\sqrt{2\\pi}}e^{-\\frac{1}{2\\sigma^2}(x-\\mu)^2}" },
      { label: "Mean", math: "E(X)=\\mu" },
      { label: "Variance", math: "\\operatorname{Var}(X)=\\sigma^2" },
      { label: "MLE", math: "\\hat\\mu=\\bar X,\\quad \\hat\\sigma^2=\\frac{1}{n}\\sum_{i=1}^n(x_i-\\bar X)^2" }
    ],
    parameters: [
      { key: "mu", label: "Mean μ", min: -5, max: 5, step: 0.1, defaultValue: 0 },
      { key: "sigma", label: "Standard deviation σ", min: 0.2, max: 4, step: 0.1, defaultValue: 1 }
    ],
    mean: ({ mu }) => mu,
    variance: ({ sigma }) => sigma ** 2,
    explanation: ({ mu, sigma }) =>
      `mu moves the bell left or right. sigma controls spread: larger sigma gives a wider, flatter bell and more extreme observations.`,
    points: ({ mu, sigma }) =>
      range(mu - 4 * sigma, mu + 4 * sigma, 120).map((x) => ({
        x: round(x, 3),
        y: normalPdf(x, mu, sigma)
      })),
    sample: ({ mu, sigma }) => normalSample(mu, sigma)
  },
  empirical: {
    key: "empirical",
    name: "Empirical",
    kind: "discrete",
    formula: "\\hat F_n(x)=\\frac{1}{n}\\sum_{i=1}^n\\mathbf{1}\\{X_i\\le x\\}",
    formulaDetails: [
      { label: "Mean", math: "\\bar X=\\frac{1}{n}\\sum_{i=1}^n X_i" },
      { label: "Variance", math: "s_n^2=\\frac{1}{n}\\sum_{i=1}^n(X_i-\\bar X)^2" },
      { label: "Nonparametric MLE", math: "\\hat P(X=x_i)=\\frac{1}{n}\\quad\\text{for each observed point }x_i" },
      { label: "CDF jump", math: "\\hat F_n(x)\\text{ jumps by }1/n\\text{ at each observation.}" }
    ],
    parameters: [
      { key: "n", label: "Sample size n", min: 5, max: 80, step: 1, defaultValue: 24 },
      { key: "shift", label: "Center shift", min: -4, max: 4, step: 0.1, defaultValue: 0 },
      { key: "spread", label: "Spread", min: 0.5, max: 4, step: 0.1, defaultValue: 1.2 }
    ],
    mean: ({ n, shift, spread }) => {
      const values = empiricalValues(n, shift, spread);
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    },
    variance: ({ n, shift, spread }) => {
      const values = empiricalValues(n, shift, spread);
      const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
      return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
    },
    explanation: ({ n }) =>
      `The empirical distribution is built from the data themselves. Each of the ${Math.floor(n)} observations receives probability 1/n, so the CDF is a step function.`,
    points: ({ n, shift, spread }) =>
      empiricalValues(n, shift, spread).map((value, index, values) => ({
        x: round(value, 3),
        y: round((index + 1) / values.length, 3)
      })),
    sample: ({ n, shift, spread }) => {
      const values = empiricalValues(n, shift, spread);
      return values[Math.floor(Math.random() * values.length)];
    }
  }
};

export const distributionOptions = Object.values(distributions);
