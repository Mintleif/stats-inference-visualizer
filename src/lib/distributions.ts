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

export const distributions: Record<DistributionKey, DistributionConfig> = {
  bernoulli: {
    key: "bernoulli",
    name: "Bernoulli",
    kind: "discrete",
    formula: "P(X=x)=p^x(1-p)^{1-x},\\quad x\\in\\{0,1\\}",
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
    formula: "P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k},\\quad k=0,1,\\ldots,n",
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
    formula: "P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!},\\quad k=0,1,2,\\ldots",
    parameters: [{ key: "lambda", label: "Rate lambda", min: 0.2, max: 18, step: 0.1, defaultValue: 4 }],
    mean: ({ lambda }) => lambda,
    variance: ({ lambda }) => lambda,
    explanation: ({ lambda }) =>
      `lambda is both the average count and the variance. Increasing lambda moves the distribution right and makes it look more bell-shaped.`,
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
    formula: "f(x)=\\lambda e^{-\\lambda x},\\quad x\\ge 0",
    parameters: [{ key: "lambda", label: "Rate lambda", min: 0.2, max: 6, step: 0.1, defaultValue: 1.2 }],
    mean: ({ lambda }) => 1 / lambda,
    variance: ({ lambda }) => 1 / lambda ** 2,
    explanation: ({ lambda }) =>
      `lambda is the event rate. A larger lambda means shorter waiting times, so the curve drops faster and the mean 1/lambda gets smaller.`,
    points: ({ lambda }) =>
      range(0, Math.max(6 / lambda, 3), 90).map((x) => ({
        x: round(x, 3),
        y: lambda * Math.exp(-lambda * x)
      })),
    sample: ({ lambda }) => -Math.log(1 - Math.random()) / lambda
  },
  gamma: {
    key: "gamma",
    name: "Gamma",
    kind: "continuous",
    formula: "f(x)=\\frac{\\beta^\\alpha}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\beta x},\\quad x>0",
    parameters: [
      { key: "alpha", label: "Shape alpha", min: 0.4, max: 12, step: 0.1, defaultValue: 3 },
      { key: "beta", label: "Rate beta", min: 0.2, max: 6, step: 0.1, defaultValue: 1 }
    ],
    mean: ({ alpha, beta }) => alpha / beta,
    variance: ({ alpha, beta }) => alpha / beta ** 2,
    explanation: ({ alpha, beta }) =>
      `alpha acts like accumulated waiting stages; larger alpha creates a mound. beta is a rate, so larger beta compresses the distribution toward zero.`,
    points: ({ alpha, beta }) =>
      range(0.001, Math.max((alpha / beta) * 3.5, 5), 110).map((x) => ({
        x: round(x, 3),
        y: (beta ** alpha / gamma(alpha)) * x ** (alpha - 1) * Math.exp(-beta * x)
      })),
    sample: ({ alpha, beta }) => gammaSample(alpha, beta)
  },
  beta: {
    key: "beta",
    name: "Beta",
    kind: "continuous",
    formula: "f(p)=\\frac{p^{\\alpha-1}(1-p)^{\\beta-1}}{B(\\alpha,\\beta)},\\quad 0<p<1",
    parameters: [
      { key: "alpha", label: "Alpha: prior successes", min: 0.3, max: 20, step: 0.1, defaultValue: 2 },
      { key: "beta", label: "Beta: prior failures", min: 0.3, max: 20, step: 0.1, defaultValue: 5 }
    ],
    mean: ({ alpha, beta }) => alpha / (alpha + beta),
    variance: ({ alpha, beta }) => (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
    explanation: ({ alpha, beta }) =>
      `Beta is a distribution over probabilities. alpha pulls belief toward 1, beta pulls toward 0; together they act like prior success/failure counts for Bernoulli data.`,
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
    parameters: [
      { key: "mu", label: "Mean mu", min: -5, max: 5, step: 0.1, defaultValue: 0 },
      { key: "sigma", label: "Standard deviation sigma", min: 0.2, max: 4, step: 0.1, defaultValue: 1 }
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
  }
};

export const distributionOptions = Object.values(distributions);
