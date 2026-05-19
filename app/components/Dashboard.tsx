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

  const overallInterceptionRate =
    totalLaunched > 0 ? (totalIntercepted / totalLaunched) * 100 : 0;
  return (
    
    <section className="mx-auto max-w-6xl px-6 py-4">

       <p className="max-w-7xl text-5xl font-bold text-zinc-300 px-4 py-4">
          Attacks in last 10 days 
      </p>
       <div className="mb-8">
        <Last10DaysDashboard />
      </div>


        <div className="border-t border-zinc-700/80 my-8" />
      {/* Overall Stats */}
      <div className="mb-12 grid gap-4 md:grid-cols-3">
        <div className="p-4">
          <p className="text-5xl font-medium text-zinc-300">Total Launched</p>
          <p className="mt-2 text-7xl font-bold text-red-500">{totalLaunched.toLocaleString('en-SE')}</p>
        </div>

        <div className="p-4">
          <p className="text-5xl font-medium text-zinc-300">Total Intercepted</p>
          <p className="mt-2 text-7xl font-bold text-gray-400">{totalIntercepted.toLocaleString('en-SE')}</p>
        </div>

        <div className="p-4">
          <p className="text-5xl font-medium text-zinc-300">Interception rate</p>
          <p className="mt-2 text-7xl font-bold text-green-500">{overallInterceptionRate.toLocaleString('en-SE', { maximumFractionDigits: 1 })}%</p>
        </div>
      </div>

 {/* Yearly summary */}
      <div className="mb-8">
        <YearlyDashboard />
      </div>

       <div className="border-t border-zinc-700/80 my-8" />

{/* Weapon Type Stats */}
<div className="mb-12 grid gap-4 md:grid-cols-3">
  <div className="p-4">
    <p className="text-4xl font-medium text-zinc-300">UAVs</p>
    <p className="mt-2 text-7xl font-bold text-cyan-400">
      {totalUAVs.toLocaleString("en-SE")}
    </p>
  </div>

  <div className="p-4">
    <p className="text-4xl font-medium text-zinc-300">Ballistic Missiles</p>
    <p className="mt-2 text-7xl font-bold text-orange-500">
      {totalBallisticMissiles.toLocaleString("en-SE")}
    </p>
  </div>

  <div className="p-4">
    <p className="text-4xl font-medium text-zinc-300">Cruise Missiles</p>
    <p className="mt-2 text-7xl font-bold text-purple-400">
      {totalCruiseMissiles.toLocaleString("en-SE")}
    </p>
  </div>
</div>

      <div className="mb-8">
        <MonthlyInterceptionDashboard />
      </div>

      <div className="border-t border-zinc-700/80 my-8" />

     

      
    </section>
  );
}
