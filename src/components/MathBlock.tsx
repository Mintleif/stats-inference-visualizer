"use client";

import { BlockMath, InlineMath } from "react-katex";

export function MathBlock({ math }: { math: string }) {
  return (
    <div className="math-scroll rounded-2xl border border-ink/10 bg-cream/80 p-4 text-ink shadow-sm">
      <BlockMath math={math} />
    </div>
  );
}

export function MathInline({ math }: { math: string }) {
  return <InlineMath math={math} />;
}
