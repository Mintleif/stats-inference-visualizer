"use client";

import katex from "katex";

function renderLatex(math: string, displayMode: boolean) {
  return katex.renderToString(math, {
    displayMode,
    throwOnError: false,
    strict: false,
    trust: true
  });
}

export function MathBlock({ math, compact = false }: { math: string; compact?: boolean }) {
  return (
    <div
      className={`math-scroll min-w-0 max-w-full rounded-2xl border border-ink/10 bg-cream/80 text-ink shadow-sm ${
        compact ? "p-3 text-[0.82rem]" : "p-4"
      }`}
      dangerouslySetInnerHTML={{ __html: renderLatex(math, true) }}
    />
  );
}

export function MathInline({ math }: { math: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderLatex(math, false) }} />;
}
