"use client";

import { useState } from "react";

import { attacks } from "../data/attacks";

const series = [
  {
    key: "uavRate",
    label: "UAVs",
    weaponType: "UAV",
    color: "#1d4ed8",
    toggleId: "uav-rate-toggle",
  },
  {
    key: "cruiseRate",
    label: "Cruise Missiles",
    weaponType: "Cruise missile",
    color: "#facc15",
    toggleId: "cruise-rate-toggle",
  },
  {
    key: "ballisticRate",
    label: "Ballistic Missiles",
    weaponType: "Ballistic missile",
    color: "#ef4444",
    toggleId: "ballistic-rate-toggle",
  },
] as const;

type SeriesKey = (typeof series)[number]["key"];
type ChartRow = {
  month: string;
} & Record<SeriesKey, number | null>;

const monthOrder = new Map(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
    (month, index) => [month, index]
  )
);

function getMonthSortValue(monthLabel: string) {
  const [month, year] = monthLabel.split(" ");
  return Number(year) * 12 + (monthOrder.get(month) ?? 0);
}

const chartData = Array.from(new Set(attacks.map((item) => item.month)))
  .sort((a, b) => getMonthSortValue(a) - getMonthSortValue(b))
  .map((month) => {
    const monthItems = attacks.filter((item) => item.month === month);

    return series.reduce<ChartRow>(
      (row, item) => {
        const attack = monthItems.find(
          (monthItem) => monthItem.weaponType === item.weaponType
        );

        row[item.key] =
          attack && attack.launched > 0
            ? Number(((attack.intercepted / attack.launched) * 100).toFixed(1))
            : null;

        return row;
      },
      { month, uavRate: null, cruiseRate: null, ballisticRate: null }
    );
  });

const chartWidth = Math.max(chartData.length * 72, 900);
const chartHeight = 360;
const chartMargin = { top: 24, right: 34, bottom: 86, left: 54 };
const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
const yTicks = [0, 20, 40, 60, 80, 100];

function getX(index: number) {
  return chartMargin.left + (plotWidth / Math.max(chartData.length - 1, 1)) * index;
}

function getY(value: number) {
  return chartMargin.top + plotHeight - (value / 100) * plotHeight;
}

function getPolylinePoints(key: SeriesKey) {
  return chartData
    .map((item, index) => {
      const value = item[key];
      return value === null ? null : `${getX(index)},${getY(value)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export default function MonthlyInterceptionDashboard() {
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
    uavRate: true,
    cruiseRate: true,
    ballisticRate: true,
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeMonth = activeIndex === null ? null : chartData[activeIndex] ?? null;
  const activeX = activeIndex === null ? 0 : getX(activeIndex);
  const tooltipWidth = 174;
  const tooltipHeight = 92;
  const tooltipX = Math.min(
    Math.max(activeX - tooltipWidth / 2, chartMargin.left),
    chartWidth - chartMargin.right - tooltipWidth
  );
  const tooltipY = chartMargin.top + 10;

  function toggleSeries(key: SeriesKey) {
    setVisibleSeries((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="monthly-chart-header mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">
            Monthly interception rates
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Share of launched weapons intercepted each month.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {series.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={visibleSeries[item.key]}
              onClick={() => toggleSeries(item.key)}
              className={`cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                visibleSeries[item.key]
                  ? "border-zinc-500 bg-zinc-800 text-white"
                  : "border-zinc-800 bg-zinc-950 text-zinc-500"
              }`}
            >
              <span
                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="monthly-chart-scroller overflow-x-auto">
        <div style={{ width: `${chartWidth}px` }}>
          <svg
            width={chartWidth}
            height={chartHeight}
            role="img"
            aria-label="Monthly interception rates for UAVs, cruise missiles, and ballistic missiles"
            className="block"
          >
            {yTicks.map((tick) => {
              const y = getY(tick);

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
                    {tick}%
                  </text>
                </g>
              );
            })}

            {chartData.map((item, index) => {
              const x = getX(index);

              return (
                <g key={item.month}>
                  <line
                    x1={x}
                    x2={x}
                    y1={chartMargin.top}
                    y2={chartMargin.top + plotHeight}
                    stroke="#27272a"
                    strokeDasharray="3 5"
                  />
                  <text
                    x={x}
                    y={chartMargin.top + plotHeight + 28}
                    fill="#f6eeee"
                    fontSize="12"
                    textAnchor="end"
                    transform={`rotate(-45 ${x} ${chartMargin.top + plotHeight + 28})`}
                  >
                    {item.month}
                  </text>
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

            {series.map(
              (item) =>
                visibleSeries[item.key] && (
                  <polyline
                    key={item.key}
                    points={getPolylinePoints(item.key)}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )
            )}

            {series.map(
              (item) =>
                visibleSeries[item.key] && (
                  <g key={`${item.key}-points`}>
                    {chartData.map((monthItem, index) => {
                      const value = monthItem[item.key];

                      if (value === null) {
                        return null;
                      }

                      return (
                        <circle
                          key={`${item.key}-${monthItem.month}`}
                          cx={getX(index)}
                          cy={getY(value)}
                          r={3.5}
                          fill="#09090b"
                          stroke={item.color}
                          strokeWidth={2}
                        >
                          <title>{`${item.label} ${monthItem.month}: ${value.toFixed(1)}%`}</title>
                        </circle>
                      );
                    })}
                  </g>
                )
            )}

            {chartData.map((monthItem, index) => {
              const x = getX(index);
              const bandWidth = plotWidth / Math.max(chartData.length - 1, 1);

              return (
                <rect
                  key={`${monthItem.month}-values`}
                  x={x - bandWidth / 2}
                  y={chartMargin.top}
                  width={bandWidth}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Show values for ${monthItem.month}`}
                />
              );
            })}

            {activeMonth && (
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
                  {activeMonth.month}
                </text>

                {series.map((item, seriesIndex) => {
                  const value = activeMonth[item.key];

                  if (!visibleSeries[item.key]) {
                    return null;
                  }

                  return (
                    <g key={`${activeMonth.month}-${item.key}-value`}>
                      <circle
                        cx={tooltipX + 14}
                        cy={tooltipY + 43 + seriesIndex * 18}
                        r={4}
                        fill={item.color}
                      />
                      <text
                        x={tooltipX + 26}
                        y={tooltipY + 47 + seriesIndex * 18}
                        fill="#e4e4e7"
                        fontSize="12"
                      >
                        {item.label}: {value === null ? "n/a" : `${value.toFixed(1)}%`}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
