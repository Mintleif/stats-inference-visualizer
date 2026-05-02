type SliderFieldProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function SliderField({ label, value, min, max, step, onChange }: SliderFieldProps) {
  return (
    <label className="block rounded-2xl border border-ink/10 bg-white/65 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="rounded-full bg-sage px-3 py-1 text-sm font-bold text-moss">
          {Number(value.toFixed(3))}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-moss via-gold to-clay accent-moss"
      />
    </label>
  );
}
