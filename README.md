# Statistics Intuition + Inference Visualizer

An interactive portfolio project for learning probability distributions and mathematical statistics by seeing the ideas move. The app is built as a browser-based probability and inference workshop: sliders, simulations, charts, LaTeX-style derivations, Bayesian updating, and quick reference cards all live in one Next.js App Router experience.

## Features

- Distribution Explorer for Bernoulli, Binomial, Poisson, Exponential, Gamma, Beta, Normal, and Empirical distributions.
- Formula cards for each distribution with PDF/PMF or CDF, mean, variance, MLE notes, and relevant connections such as the Beta-Binomial conjugate update.
- Distribution comparison methods: Kolmogorov-Smirnov distance, integrated absolute distance, and integrated squared distance.
- Central Limit Theorem simulator with a selectable base distribution, sample size, simulation count, original distribution view, and sample-mean histogram.
- Confidence interval simulator with selectable sampling distribution, generated sample, sample mean, confidence interval, and coverage indicator.
- Bayesian updating with Beta-Binomial, Gamma-Poisson, and Normal-Normal conjugate models.
- Bayesian decision content covering prior vs posterior, Bayesian vs frequentist interpretation, discrete vs continuous Bayes formulas, expected loss, and Bayes decision rules.
- Statistical Inference Lab with collapsible derivations for MLE, Fisher Information, CRLB, MVUE, likelihood ratio tests, and small-vs-large-sample estimation.
- Quick Reference with fast decision rules and revision prompts.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- KaTeX for math rendering via the local `MathBlock` component

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
  ExamMode.tsx        Renders the Quick Reference section
  ChartCard.tsx
  MathBlock.tsx       KaTeX rendering wrapper
  SliderField.tsx
  StepAccordion.tsx

src/lib/
  distributions.ts    Distribution formulas, formula details, parameters, moments, graph data, samplers
  inferenceContent.ts Step-by-step derivation content, LRT examples, and quick reference cards
  math.ts             Probability helpers, simulation helpers, numerical utilities
  types.ts            Shared TypeScript types
```

## How to Add a New Distribution

Add a new entry in `src/lib/types.ts` to the `DistributionKey` union, then add a matching configuration object in `src/lib/distributions.ts`.

Each distribution needs:

- `name` and `kind`
- LaTeX `formula`
- `formulaDetails` for mean, variance, MLE notes, or related results
- slider `parameters`
- `mean(params)` and `variance(params)`
- `explanation(params)`
- `points(params)` for chart data
- `sample(params)` for simulation

The Distribution Explorer, CLT Simulator, and Confidence Interval Visualizer read from this shared configuration automatically.

## How to Add a New Inference Example

Open `src/lib/inferenceContent.ts` and add an `InferenceExample` to the relevant array:

- `mleExamples`
- `fisherExamples`
- `crlbExamples`
- `mvueExamples`
- `lrtExamples`
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

## Current Notes

- The empirical distribution replaces the earlier F-distribution idea. It shows the empirical CDF and treats the observed sample as the estimated distribution.
- The math renderer is centralized in `src/components/MathBlock.tsx`, which uses KaTeX directly. If formulas display incorrectly, this is the first place to debug escaping or rendering behavior.
- The UI label is `Quick Reference`, but the component file is still named `ExamMode.tsx`.

## Purpose

The goal is not to replace a textbook. It is a bridge between intuition and execution: students can see how parameters change shapes, watch simulation results stabilize, compare Bayesian and frequentist thinking, and rehearse derivations in the same notation they will use on paper.
