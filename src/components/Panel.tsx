import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, children, className = "" }: PanelProps) {
  return (
    <section className={`rounded-[2rem] border border-white/70 bg-white/72 p-5 shadow-soft backdrop-blur md:p-7 ${className}`}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-clay">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
