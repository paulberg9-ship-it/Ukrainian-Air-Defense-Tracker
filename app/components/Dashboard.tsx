import { attacks } from "../data/attacks";
import Last10DaysDashboard from "./Last10DaysDashboard";
import MonthlyInterceptionDashboard from "./MonthlyInterceptionDashboard";
import YearlyDashboard from "./YearlyDashboard";

export default function Dashboard() {
  const totalLaunched = attacks.reduce((sum, item) => sum + item.launched, 0);
  const totalIntercepted = attacks.reduce((sum, item) => sum + item.intercepted, 0);

  const totalUAVs = attacks
    .filter((item) => item.weaponType === "UAV")
    .reduce((sum, item) => sum + item.launched, 0);

  const totalBallisticMissiles = attacks
    .filter((item) => item.weaponType === "Ballistic missile")
    .reduce((sum, item) => sum + item.launched, 0);

  const totalCruiseMissiles = attacks
    .filter((item) => item.weaponType === "Cruise missile")
    .reduce((sum, item) => sum + item.launched, 0);

  const weaponTypeStats = [
    {
      title: "UAVs",
      launched: totalUAVs,
      intercepted: attacks
        .filter((item) => item.weaponType === "UAV")
        .reduce((sum, item) => sum + item.intercepted, 0),
      colorClass: "text-white text-7xl",
      labelColorClass: "text-blue-700",
      borderClass: "hover:border-blue-700/70",
    },
    {
      title: "Ballistic Missiles",
      launched: totalBallisticMissiles,
      intercepted: attacks
        .filter((item) => item.weaponType === "Ballistic missile")
        .reduce((sum, item) => sum + item.intercepted, 0),
      colorClass: "text-white text-7xl",
      labelColorClass: "text-red-700",
      borderClass: "hover:border-red-700/70",
    },
    {
      title: "Cruise Missiles",
      launched: totalCruiseMissiles,
      intercepted: attacks
        .filter((item) => item.weaponType === "Cruise missile")
        .reduce((sum, item) => sum + item.intercepted, 0),
      colorClass: "text-white text-7xl",
      labelColorClass: "text-yellow-500",
      borderClass: "hover:border-yellow-500/70",
    },
  ].map((item) => ({
    ...item,
    interceptionRate:
      item.launched > 0 ? (item.intercepted / item.launched) * 100 : 0,
  }));

  const overallInterceptionRate =
    totalLaunched > 0 ? (totalIntercepted / totalLaunched) * 100 : 0;
  return (
    
    <section className="mx-auto max-w-6xl px-4 py-4">
       <p className=" mb-4 mt-4 max-w-7xl text-5xl font-bold text-zinc-300 px-4 py-4">
          Last 10 Days Attacks 
      </p>
       <div className="mb-4">
        <Last10DaysDashboard />
      </div>


<div className="mx-auto max-w-7xl px-4 py-4 text-center">
  <h1 className="text-5xl font-bold text-zinc-300">
    Russia’s Aerial War in Numbers
  </h1>

  <p className="mt-3 text-lg text-zinc-400">
    UAV and missile launches against Ukraine · 2022–2026
  </p>
</div>
      {/* Overall Stats */}
<div className="mx-auto mt-10 max-w-5xl text-center">
  <div className="rounded-[2rem] border border-red-950/50 bg-gradient-to-b from-red-950/20 to-zinc-950/20 px-6 py-8">
    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500/80">
      Total Launched
    </p>
    <p className="mt-3 text-8xl font-black leading-none text-red-600 drop-shadow-[0_0_12px_rgba(185,28,28,0.55)] md:text-9xl">
      {totalLaunched.toLocaleString("en-SE")}
    </p>
  </div>

  <div className="mx-auto mt-8 grid max-w-3xl gap-5 md:grid-cols-2">
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
        Total Destroyed
      </p>
      <p className="mt-3 text-5xl font-extrabold text-zinc-500 drop-shadow-[0_0_8px_rgba(113,113,122,0.55)]">
        {totalIntercepted.toLocaleString("en-SE")}
      </p>
    </div>

    <div className="rounded-3xl border border-green-950/60 bg-zinc-950/80 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-900">
        Interception Rate
      </p>
      <p className="mt-3 text-5xl font-extrabold text-green-700 drop-shadow-[0_0_8px_rgba(21,128,61,0.6)]">
        {overallInterceptionRate.toFixed(0)}%
      </p>
    </div>
  </div>
</div>

{/* Weapon Type Stats */}
<div className="mt-8 grid gap-6 md:grid-cols-3">
  {weaponTypeStats.map((item) => (
    <div
      key={item.title}
      className={`group rounded-3xl border border-zinc-800 bg-zinc-950/80 p-7 text-center transition-colors ${item.borderClass}`}
    >
      <p className={`text-lg font-semibold uppercase tracking-wide ${item.labelColorClass}`}>
        {item.title}
      </p>
      <p className={`mt-4 text-5xl font-extrabold ${item.colorClass}`}>
        {item.launched.toLocaleString("en-SE")}
      </p>
      <p className={`mt-2 text-sm font-semibold uppercase tracking-wide ${item.labelColorClass}`}>
        Launched
      </p>

      <div className="mt-5 grid gap-2 overflow-hidden text-sm text-zinc-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <p>
          Intercepted:{" "}
          <span className="font-semibold text-zinc-100">
            {item.intercepted.toLocaleString("en-SE")}
          </span>
        </p>
        <p>
          Interception rate:{" "}
          <span className="font-semibold text-zinc-100">
            {item.interceptionRate.toFixed(1)}%
          </span>
        </p>
      </div>
    </div>
  ))}
</div>

 {/* Yearly summary */}
      <div className="mb-8 mt-12">
        <YearlyDashboard />
      </div>

       <div className="border-t border-zinc-700/80 my-8" />

      <div className="mb-8">
        <MonthlyInterceptionDashboard />
      </div>

      <div className="border-t border-zinc-700/80 my-8" />

     

      
    </section>
  );
}
