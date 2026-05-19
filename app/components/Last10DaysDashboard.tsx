"use client";

import { useState } from "react";

import { last10DailyAttacks } from "../data/dailyAttacks";

const chartWidth = 800;
const chartHeight = 400;
const chartMargin = { top: 30, right: 60, bottom: 70, left: 62 };
const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
const maxLaunched = Math.max(
  ...last10DailyAttacks.map((item) => item.uavs + item.missiles),
  1
);
const countAxisMax = Math.ceil(maxLaunched / 100) * 100;
const countTicks = Array.from({ length: 6 }, (_, index) =>
  Math.round((countAxisMax / 5) * index)
);
const rateTicks = [0, 20, 40, 60, 80, 100];
const dayStep = plotWidth / last10DailyAttacks.length;
const barWidth = Math.min(34, dayStep * 0.45);

function getX(index: number) {
  return chartMargin.left + dayStep * index + dayStep / 2;
}

function getCountY(value: number) {
  return chartMargin.top + plotHeight - (value / countAxisMax) * plotHeight;
}

function getRateY(value: number) {
  return chartMargin.top + plotHeight - (value / 100) * plotHeight;
}

function getRateLinePoints() {
  return last10DailyAttacks
    .map((item, index) =>
      item.interceptionRate === null
        ? null
        : `${getX(index)},${getRateY(item.interceptionRate)}`
    )
    .filter(Boolean)
    .join(" ");
}

export default function Last10DaysDashboard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem =
    activeIndex === null ? null : last10DailyAttacks[activeIndex] ?? null;
  const activeX = activeIndex === null ? 0 : getX(activeIndex);
  const tooltipWidth = 178;
  const tooltipHeight = 106;
  const tooltipX = Math.min(
    Math.max(activeX - tooltipWidth / 2, chartMargin.left),
    chartWidth - chartMargin.right - tooltipWidth
  );
  const tooltipY = chartMargin.top + 12;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          
          <p className="mt-1 text-l text-zinc-400">
            Daily launched UAVs, missiles, and total interception rate.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-zinc-300">
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#1d4ed8]" />
            UAVs
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-[#ef4444]" />
            Missiles
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-0.5 w-5 bg-[#22c55e]" />
            Interception rates
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ width: `${chartWidth}px` }}>
          <svg
            width={chartWidth}
            height={chartHeight}
            role="img"
            aria-label="Last 10 days attacks chart with UAV bars, missile bars, and interception rate line"
            className="block"
          >
            {countTicks.map((tick) => {
              const y = getCountY(tick);

              return (
                <g key={tick}>
                  <line
                    x1={chartMargin.left}
                    x2={chartWidth - chartMargin.right}
                    y1={y}
                    y2={y}
                    stroke="#3f3f46"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={chartMargin.left - 12}
                    y={y + 4}
                    fill="#d4d4d8"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {rateTicks.map((tick) => {
              const y = getRateY(tick);

              return (
                <text
                  key={tick}
                  x={chartWidth - chartMargin.right + 12}
                  y={y + 4}
                  fill="#86efac"
                  fontSize="12"
                >
                  {tick}%
                </text>
              );
            })}

{last10DailyAttacks.map((item, index) => {
  const x = getX(index);
  const total = item.uavs + item.missiles;

  const baselineY = chartMargin.top + plotHeight;
  const uavY = getCountY(item.uavs);
  const totalY = getCountY(total);

  const uavHeight = baselineY - uavY;
  const missileHeight = uavY - totalY;

  return (
    <g key={item.date}>
{/* UAVs: bottom part of stacked bar */}
<rect
  x={x - barWidth / 2}
  y={uavY}
  width={barWidth}
  height={uavHeight}
  fill="#001c6a"
  
/>

{/* Missiles: upper part of stacked bar */}
<rect
  x={x - barWidth / 2}
  y={totalY}
  width={barWidth}
  height={missileHeight}
  fill="#c70303"
 
/>
                  
                  <text
                    x={x}
                    y={chartMargin.top + plotHeight + 28}
                    fill="#f6eeee"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {item.label}
                  </text>
                  <rect
                    x={x - dayStep / 2}
                    y={chartMargin.top}
                    width={dayStep}
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Show values for ${item.label}`}
                  />
                </g>
              );
            })}

            <line
              x1={chartMargin.left}
              x2={chartWidth - chartMargin.right}
              y1={chartMargin.top + plotHeight}
              y2={chartMargin.top + plotHeight}
              stroke="#71717a"
            />
            <line
              x1={chartMargin.left}
              x2={chartMargin.left}
              y1={chartMargin.top}
              y2={chartMargin.top + plotHeight}
              stroke="#71717a"
            />
            <line
              x1={chartWidth - chartMargin.right}
              x2={chartWidth - chartMargin.right}
              y1={chartMargin.top}
              y2={chartMargin.top + plotHeight}
              stroke="#365943"
            />

            <polyline
              points={getRateLinePoints()}
              fill="none"
              stroke="#01a13c"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {last10DailyAttacks.map((item, index) => {
              if (item.interceptionRate === null) {
                return null;
              }

              return (
                <circle
                  key={`${item.date}-rate`}
                  cx={getX(index)}
                  cy={getRateY(item.interceptionRate)}
                  r={4}
                  fill="#09090b"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
              );
            })}

            {activeItem && (
              <g>
                <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height={tooltipHeight}
                  rx={8}
                  fill="#18181b"
                  stroke="#52525b"
                />
                <text
                  x={tooltipX + 12}
                  y={tooltipY + 22}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="700"
                >
                  {activeItem.label}
                </text>
                <text x={tooltipX + 12} y={tooltipY + 45} fill="#bfdbfe" fontSize="12">
                  UAVs: {activeItem.uavs.toLocaleString("en-SE")}
                </text>
                <text x={tooltipX + 12} y={tooltipY + 64} fill="#fecaca" fontSize="12">
                  Missiles: {activeItem.missiles.toLocaleString("en-SE")}
                </text>
                <text x={tooltipX + 12} y={tooltipY + 83} fill="#bbf7d0" fontSize="12">
                  Rate:{" "}
                  {activeItem.interceptionRate === null
                    ? "n/a"
                    : `${activeItem.interceptionRate.toFixed(1)}%`}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
