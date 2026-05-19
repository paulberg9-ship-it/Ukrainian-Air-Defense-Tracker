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

  const chartWidth = Math.max(data.length * 100, 700);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="mb-4 text-xl font-semibold text-white">Weapons Launched By Year</h3>

   <div className="mb-4 flex">
  {/* Fixed Y-axis */}
  <div className="shrink-0">
    <BarChart
      width={90}
      height={240}
      data={data}
      margin={{ top: 10, right: 0, left: 0, bottom: 30 }}
    >
      <YAxis
        dataKey="launched"
        stroke="#a1a1aa"
        tick={{ fill: "#a1a1aa", fontSize: 12 }}
        width={80}
        tickFormatter={(value) => Number(value).toLocaleString("en-SE")}
      />

      {/* Invisible bar only to force Y-axis scale */}
      <Bar dataKey="launched" fill="transparent" />
    </BarChart>
  </div>

  {/* Scrollable bars */}
  <div className="overflow-x-auto">
    <div style={{ width: `${chartWidth}px` }}>
      <BarChart
        width={chartWidth}
        height={240}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

        <XAxis
          dataKey="year"
          stroke="#f6eeee"
          tick={{ fill: "#f6eeee", fontSize: 12 }}
        />

        {/* Hidden Y-axis, because fixed Y-axis is on the left */}
        <YAxis hide dataKey="launched" />

        <Tooltip
        cursor={{ fill: "transparent" }}
        contentStyle={{
        backgroundColor: "rgba(24, 24, 27, 0.85)",
        border: "1px solid #3f3f46",
        borderRadius: "12px",
        color: "#ffffff",
    }}
        itemStyle={{ color: "#ffffff" }}
        labelStyle={{ color: "#ffffff" }}
        formatter={(value) =>
        Number(value ?? 0).toLocaleString("en-SE")
  }
/>

        <Bar dataKey="launched" fill="#ff0000" barSize={80} />
      </BarChart>
    </div>
  </div>
</div>

      {/* Yearly totals list removed per request */}
    </div>
  );
}
