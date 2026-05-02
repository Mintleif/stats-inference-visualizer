# Statistics Intuition + Inference Visualizer

An interactive portfolio project for learning probability distributions and mathematical statistics by seeing the ideas move. The app is built for students revising for exams: sliders, simulations, charts, LaTeX derivations, and concise reference cards all live in one Next.js App Router experience.

## Features

- Distribution Explorer for Bernoulli, Binomial, Poisson, Exponential, Gamma, Beta, and Normal distributions.
- Central Limit Theorem simulator with original distribution and sample-mean histogram.
- Confidence interval simulator showing sample mean, interval, and whether it covers the true mean.
- Beta-binomial Bayesian updating with prior/posterior curves.
- Statistical Inference Lab with step-by-step MLE, Fisher Information, CRLB, MVUE, likelihood ratio testing, and small-vs-large-sample estimation.
- Exam Mode with quick decision rules and revision prompts.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- KaTeX via `react-katex`

## Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production check:

```bash
npm run build
npm run start
```

## Project Structure

```text
src/app/
  layout.tsx          App metadata and global CSS imports
  page.tsx            Main route
  globals.css         Tailwind and visual foundation

src/components/
  StatsVisualizer.tsx Main tabbed experience
  DistributionExplorer.tsx
  CLTSimulator.tsx
  ConfidenceIntervalVisualizer.tsx
  BayesianUpdating.tsx
  InferenceLab.tsx
  ExamMode.tsx
  ChartCard.tsx
  MathBlock.tsx
  SliderField.tsx
  StepAccordion.tsx

src/lib/
  distributions.ts    Distribution formulas, parameters, moments, graph data, samplers
  inferenceContent.ts Step-by-step derivation content and exam cards
  math.ts             Probability helpers, simulation helpers, numerical utilities
  types.ts            Shared TypeScript types
```

## How to Add a New Distribution

Add a new entry in `src/lib/types.ts` to the `DistributionKey` union, then add a matching configuration object in `src/lib/distributions.ts`.

Each distribution needs:

- `name` and `kind`
- LaTeX `formula`
- slider `parameters`
- `mean(params)` and `variance(params)`
- `explanation(params)`
- `points(params)` for chart data
- `sample(params)` for simulation

The Distribution Explorer and CLT Simulator read from this shared configuration automatically.

## How to Add a New Inference Example

Open `src/lib/inferenceContent.ts` and add an `InferenceExample` to the relevant array:

- `mleExamples`
- `fisherExamples`
- `crlbExamples`
- `mvueExamples`
- `smallLargeExamples`

Use this shape:

```ts
{
  id: "unique-id",
  title: "Model or theorem",
  context: "Short exam-focused setup.",
  steps: [
    {
      title: "Likelihood",
      math: "L(\\theta)=...",
      explanation: "Plain-English meaning of the step."
    }
  ],
  result: "\\hat\\theta=..."
}
```

The Inference Lab renders the example as a collapsible step-by-step derivation.

## Purpose

The goal is not to replace a textbook. It is a bridge between intuition and exam execution: students can see how parameters change shapes, watch simulation results stabilize, and rehearse derivations in the same notation they will use on paper.
