import type { ChartPoint } from "./types";

export function round(value: number, digits = 3) {
  if (!Number.isFinite(value)) return value;
  return Number(value.toFixed(digits));
}

export function factorial(n: number) {
  if (n < 0) return NaN;
  let result = 1;
  for (let i = 2; i <= Math.floor(n); i += 1) result *= i;
  return result;
}

export function combination(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  const safeK = Math.min(k, n - k);
  let result = 1;
  for (let i = 1; i <= safeK; i += 1) {
    result *= (n - safeK + i) / i;
  }
  return result;
}

export function gamma(z: number): number {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7
  ];

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }

  const shifted = z - 1;
  let x = 0.9999999999998099;
  for (let i = 0; i < coefficients.length; i += 1) {
    x += coefficients[i] / (shifted + i + 1);
  }
  const t = shifted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (shifted + 0.5) * Math.exp(-t) * x;
}

export function betaFunction(alpha: number, beta: number) {
  return gamma(alpha) * gamma(beta) / gamma(alpha + beta);
}

export function normalPdf(x: number, mean = 0, sd = 1) {
  return (
    (1 / (sd * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * ((x - mean) / sd) ** 2)
  );
}

export function normalSample(mean = 0, sd = 1) {
  const u1 = Math.max(Math.random(), Number.EPSILON);
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + sd * z;
}

export function quantileNormal(confidence: number) {
  const lookup: Record<number, number> = {
    0.8: 1.282,
    0.9: 1.645,
    0.95: 1.96,
    0.98: 2.326,
    0.99: 2.576
  };
  return lookup[confidence] ?? 1.96;
}

export function histogram(values: number[], bins = 24): ChartPoint[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = max === min ? 1 : (max - min) / bins;
  const counts = Array.from({ length: bins }, () => 0);

  for (const value of values) {
    const index = Math.min(bins - 1, Math.floor((value - min) / width));
    counts[index] += 1;
  }

  return counts.map((count, index) => {
    const x = min + width * (index + 0.5);
    return {
      x: round(x, 3),
      y: count / values.length
    };
  });
}

export function mean(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function variance(values: number[]) {
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1);
}
