"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ChartPoint } from "@/lib/types";

type ChartCardProps = {
  title: string;
  data: ChartPoint[];
  kind?: "bar" | "line" | "area";
  series?: { key: string; color: string; name: string }[];
  referenceX?: number;
  referenceArea?: { start: number; end: number; color?: string };
  height?: number;
};

const defaultSeries = [{ key: "y", color: "#3d6650", name: "density" }];

export function ChartCard({
  title,
  data,
  kind = "area",
  series = defaultSeries,
  referenceX,
  referenceArea,
  height = 300
}: ChartCardProps) {
  const chartMargin = { top: 16, right: 20, bottom: 8, left: 2 };

  return (
    <div className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-moss">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {kind === "bar" ? (
            <BarChart data={data} margin={chartMargin}>
              <CartesianGrid stroke="#dfe8dc" strokeDasharray="4 4" />
              <XAxis dataKey="x" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {referenceX !== undefined ? <ReferenceLine x={referenceX} stroke="#b96b4f" strokeWidth={2} /> : null}
              {referenceArea ? (
                <ReferenceArea x1={referenceArea.start} x2={referenceArea.end} fill={referenceArea.color ?? "#dcae51"} fillOpacity={0.2} />
              ) : null}
              {series.map((item) => (
                <Bar key={item.key} dataKey={item.key} name={item.name} fill={item.color} radius={[8, 8, 0, 0]} />
              ))}
              {series.length > 1 ? <Legend /> : null}
            </BarChart>
          ) : kind === "line" ? (
            <LineChart data={data} margin={chartMargin}>
              <CartesianGrid stroke="#dfe8dc" strokeDasharray="4 4" />
              <XAxis dataKey="x" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {referenceX !== undefined ? <ReferenceLine x={referenceX} stroke="#b96b4f" strokeWidth={2} /> : null}
              {referenceArea ? (
                <ReferenceArea x1={referenceArea.start} x2={referenceArea.end} fill={referenceArea.color ?? "#dcae51"} fillOpacity={0.2} />
              ) : null}
              {series.map((item) => (
                <Line key={item.key} dataKey={item.key} name={item.name} stroke={item.color} dot={false} strokeWidth={3} />
              ))}
              {series.length > 1 ? <Legend /> : null}
            </LineChart>
          ) : (
            <AreaChart data={data} margin={chartMargin}>
              <CartesianGrid stroke="#dfe8dc" strokeDasharray="4 4" />
              <XAxis dataKey="x" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {referenceX !== undefined ? <ReferenceLine x={referenceX} stroke="#b96b4f" strokeWidth={2} /> : null}
              {referenceArea ? (
                <ReferenceArea x1={referenceArea.start} x2={referenceArea.end} fill={referenceArea.color ?? "#dcae51"} fillOpacity={0.2} />
              ) : null}
              {series.map((item) => (
                <Area
                  key={item.key}
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color}
                  fill={item.color}
                  fillOpacity={0.24}
                  strokeWidth={3}
                />
              ))}
              {series.length > 1 ? <Legend /> : null}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
