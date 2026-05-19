/* eslint-disable @typescript-eslint/no-require-imports */

const XLSX = require("xlsx");
const fs = require("fs");

const workbook = XLSX.readFile("data/missile_attacks_clean.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
const monthOrder = new Map(
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
    (month, index) => [month, index]
  )
);
const weaponTypeOrder = new Map([
  ["UAV", 0],
  ["Cruise missile", 1],
  ["Ballistic missile", 2],
]);

function excelDateToJSDate(serial) {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  return new Date(utcValue * 1000);
}

function getMonth(value) {
  const date = getDate(value);

  if (!date) return "Unknown";

  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getDate(value) {
  let date;

  if (typeof value === "number") {
    date = excelDateToJSDate(value);
  } else {
    date = new Date(value);
  }

  if (isNaN(date)) return null;

  return date;
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getDateLabel(dateKey) {
  return new Date(`${dateKey}T00:00:00Z`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function getMonthSortValue(monthLabel) {
  const [month, year] = monthLabel.split(" ");

  return Number(year) * 12 + (monthOrder.get(month) ?? 0);
}

const grouped = {};

// Valid weapon types
const validWeaponTypes = ["UAV", "Cruise missile", "Ballistic missile"];

for (const row of rows) {
  const month = getMonth(row.date);
  const weaponType = row.weapon_type || "Unknown";

  // Only include valid weapon types
  if (!validWeaponTypes.includes(weaponType)) continue;

  const key = `${month}-${weaponType}`;

  if (!grouped[key]) {
    grouped[key] = {
      month,
      weaponType,
      launched: 0,
      intercepted: 0,
    };
  }

  grouped[key].launched += Number(row.launched || 0);
  grouped[key].intercepted += Number(row.destroyed || 0);
}

const attacks = Object.values(grouped).sort((a, b) => {
  const monthDifference = getMonthSortValue(a.month) - getMonthSortValue(b.month);

  if (monthDifference !== 0) return monthDifference;

  return (
    (weaponTypeOrder.get(a.weaponType) ?? Number.MAX_SAFE_INTEGER) -
    (weaponTypeOrder.get(b.weaponType) ?? Number.MAX_SAFE_INTEGER)
  );
});

const fileContent = `export const attacks = ${JSON.stringify(attacks, null, 2)};
`;

fs.writeFileSync("app/data/attacks.ts", fileContent);

const datedRows = rows
  .map((row) => ({ ...row, dateObject: getDate(row.date) }))
  .filter((row) => row.dateObject);

if (datedRows.length === 0) {
  throw new Error("No rows with valid dates found in data/missile_attacks_clean.xlsx");
}

const latestDate = datedRows.reduce(
  (latest, row) => (row.dateObject > latest ? row.dateObject : latest),
  datedRows[0].dateObject
);

const last10DateKeys = Array.from({ length: 10 }, (_, index) => {
  const date = new Date(
    Date.UTC(
      latestDate.getUTCFullYear(),
      latestDate.getUTCMonth(),
      latestDate.getUTCDate() - (9 - index)
    )
  );

  return getDateKey(date);
});

const dailyGrouped = Object.fromEntries(
  last10DateKeys.map((dateKey) => [
    dateKey,
    {
      date: dateKey,
      label: getDateLabel(dateKey),
      uavs: 0,
      missiles: 0,
      launched: 0,
      intercepted: 0,
    },
  ])
);

for (const row of datedRows) {
  const dateKey = getDateKey(row.dateObject);
  const dailyItem = dailyGrouped[dateKey];
  const weaponType = row.weapon_type || "Unknown";

  if (!dailyItem || !validWeaponTypes.includes(weaponType)) continue;

  const launched = Number(row.launched || 0);
  const intercepted = Number(row.destroyed || 0);

  if (weaponType === "UAV") {
    dailyItem.uavs += launched;
  } else {
    dailyItem.missiles += launched;
  }

  dailyItem.launched += launched;
  dailyItem.intercepted += intercepted;
}

const last10DailyAttacks = last10DateKeys.map((dateKey) => {
  const dailyItem = dailyGrouped[dateKey];

  return {
    ...dailyItem,
    interceptionRate:
      dailyItem.launched > 0
        ? Number(((dailyItem.intercepted / dailyItem.launched) * 100).toFixed(1))
        : null,
  };
});

const dailyFileContent = `export const last10DailyAttacks = ${JSON.stringify(last10DailyAttacks, null, 2)};
`;

fs.writeFileSync("app/data/dailyAttacks.ts", dailyFileContent);

console.log("Real Excel data converted successfully.");
console.log(`Rows created: ${attacks.length}`);
console.log(`Daily rows created: ${last10DailyAttacks.length}`);
