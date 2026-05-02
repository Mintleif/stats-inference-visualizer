export type ChartPoint = {
  x: number;
  y?: number;
  label?: string;
  [key: string]: number | string | undefined;
};

export type DistributionKey =
  | "bernoulli"
  | "binomial"
  | "poisson"
  | "exponential"
  | "gamma"
  | "beta"
  | "normal"
  | "empirical";

export type DistributionKind = "discrete" | "continuous";

export type ParameterConfig = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type DistributionConfig = {
  key: DistributionKey;
  name: string;
  kind: DistributionKind;
  formula: string;
  formulaDetails: { label: string; math: string }[];
  parameters: ParameterConfig[];
  mean: (params: Record<string, number>) => number;
  variance: (params: Record<string, number>) => number;
  explanation: (params: Record<string, number>) => string;
  points: (params: Record<string, number>) => ChartPoint[];
  sample: (params: Record<string, number>) => number;
};

export type DerivationStep = {
  title: string;
  math: string;
  explanation: string;
};

export type InferenceExample = {
  id: string;
  title: string;
  context: string;
  steps: DerivationStep[];
  result: string;
};

export type ReferenceCard = {
  title: string;
  body: string;
  formula?: string;
};
