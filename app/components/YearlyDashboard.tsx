"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { attacks } from "../data/attacks";

export default function YearlyDashboard() {
  const yearlyMap: Record<string, number> = {};

  attacks.forEach((item) => {
    const parts = item.month.split(" ");
    const year = parts[1] ?? item.month;
    yearlyMap[year] = (yearlyMap[year] || 0) + item.launched;
  });

  const data = Object.keys(yearlyMap)
    .sort()
    .map((year) => ({ year, launched: yearlyMap[year] }));

  const chartWidth = Math.max(data.length * 120, 900);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Weapons Launched By Year</h3>

      <div className="mb-4 overflow-x-auto">
        <div style={{ width: `${chartWidth}px` }}>
          <BarChart width={chartWidth} height={240} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" stroke="#f6eeee" />
            <YAxis stroke="#a1a1aa" />
            <Tooltip formatter={(value) => Number(value ?? 0).toLocaleString('en-SE')} />
            <Bar dataKey="launched" fill="#ef4444" />
          </BarChart>
        </div>
      </div>

      {/* Yearly totals list removed per request */}
    </div>
  );
}
