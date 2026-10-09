import React, { useState } from 'react';
import { WEEKLY_HISTORY } from '../data/initialData';

interface WeeklyLedgerProps {
  currentDayCalories: number;
  currentDayWater: number;
  targetCalories: number;
  targetWater: number;
  onSelectDay?: (dateKey: string) => void;
}

export const WeeklyLedger: React.FC<WeeklyLedgerProps> = ({
  currentDayCalories,
  currentDayWater,
  targetCalories,
  targetWater,
  onSelectDay,
}) => {
  const [selectedDayKey, setSelectedDayKey] = useState<string>('2026-10-24');

  // Build the 7 days array
  const days = Object.entries(WEEKLY_HISTORY).map(([dateKey, val]) => {
    // If today, use live updated currentDayCalories and currentDayWater
    const isToday = dateKey === '2026-10-24';
    return {
      dateKey,
      dayName: val.dayName,
      calories: isToday ? currentDayCalories : val.calories,
      target: targetCalories,
      waterMl: isToday ? currentDayWater : val.waterMl,
      waterTarget: targetWater,
      protein: val.protein,
      carbs: val.carbs,
      fat: val.fat,
      entriesCount: val.entriesCount,
      isToday,
    };
  });

  const totalWeeklyCalories = days.reduce((acc, d) => acc + d.calories, 0);
  const totalWeeklyTarget = days.reduce((acc, d) => acc + d.target, 0);
  const netDeficit = totalWeeklyTarget - totalWeeklyCalories;
  const avgWeeklyWater = Math.round(days.reduce((acc, d) => acc + d.waterMl, 0) / days.length);

  const selectedDay = days.find((d) => d.dateKey === selectedDayKey) || days[days.length - 1];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#e0e2eb] gap-3">
        <div>
          <h1 className="font-headline-lg text-[26px] font-bold text-[#191c22]">
            Weekly Ledger &amp; Chrono Archive
          </h1>
          <span className="font-label-engraved text-[11px] text-[#414942] uppercase tracking-widest">
            FOLIO ARCHIVE 419 • 7-DAY DEFICIT &amp; HYDRATION RECAPITULATION
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-[#ecedf7] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.15)] font-label-engraved text-xs text-[#874a00] font-bold">
            NET 7-DAY BALANCE: {netDeficit > 0 ? `-${netDeficit} KCAL DEFICIT` : `+${Math.abs(netDeficit)} KCAL SURPLUS`}
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Weekly Deficit Meter */}
        <div className="relative p-5 rounded-xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_4px_12px_rgba(0,0,0,0.04)]">
          <span className="font-label-engraved text-[10px] text-[#414942] uppercase font-semibold">
            Caloric Chronometer Deficit
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-label-gauge-num text-[32px] text-[#316342] font-extrabold">
              {netDeficit > 0 ? `-${netDeficit.toLocaleString()}` : `+${Math.abs(netDeficit)}`}
            </span>
            <span className="font-label-engraved text-xs text-[#874a00] font-bold">KCAL NET</span>
          </div>
          <p className="font-body-sm text-[12px] text-[#717971] mt-1">
            Target weekly intake: {totalWeeklyTarget.toLocaleString()} kcal across 7 days.
          </p>
        </div>

        {/* Weekly Hydration Average */}
        <div className="relative p-5 rounded-xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_4px_12px_rgba(0,0,0,0.04)]">
          <span className="font-label-engraved text-[10px] text-[#414942] uppercase font-semibold">
            7-Day Aqueous Compliance
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-label-gauge-num text-[32px] text-[#0062a0] font-extrabold">
              {avgWeeklyWater.toLocaleString()}
            </span>
            <span className="font-label-engraved text-xs text-[#0062a0] font-bold">ML / DAY AVG</span>
          </div>
          <p className="font-body-sm text-[12px] text-[#717971] mt-1">
            {Math.round((avgWeeklyWater / targetWater) * 100)}% of daily 3,000 mL benchmark.
          </p>
        </div>

        {/* Sustained Record Streak */}
        <div className="relative p-5 rounded-xl bg-gradient-to-br from-[#733e00] to-[#512b00] text-[#ffdcc1] shadow-[0px_4px_10px_rgba(0,0,0,0.25)] border border-[#ffb779]/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ffb779]">local_fire_department</span>
            <span className="font-label-engraved text-[10px] text-[#ffdcc1] uppercase font-bold tracking-wider">
              Caloric Streak Record
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-md text-[32px] font-bold text-[#ffdcc1]">14 DAYS</span>
            <span className="px-2 py-0.5 rounded bg-[#9a5405] text-[10px] font-label-engraved font-bold text-white">
              UNBROKEN
            </span>
          </div>
          <p className="font-label-engraved text-[11px] text-[#ffb779] mt-1">
            Zero metabolic overflow events recorded since Oct 10.
          </p>
        </div>
      </div>

      {/* Main 7-Day Caloric Barometer Chart */}
      <div className="p-6 rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-headline-md text-[20px] font-bold text-[#191c22]">
              7-Day Energy Consumption Tachograph
            </h3>
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase">
              BAR HEIGHT = LOGGED KCAL • RED DASH = 2,100 KCAL TARGET
            </span>
          </div>
          <div className="flex items-center gap-3 font-label-engraved text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#4a7c59]" /> Under Target (Deficit)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#ba1a1a]" /> Target Limit
            </span>
          </div>
        </div>

        {/* Barometer Chart */}
        <div className="relative pt-6 pb-2">
          {/* Target Reference Line */}
          <div
            className="absolute inset-x-0 border-b border-dashed border-[#ba1a1a] z-10 pointer-events-none"
            style={{ bottom: '90px' }}
          >
            <span className="absolute -top-3.5 right-0 px-1 rounded bg-[#ba1a1a] text-white text-[9px] font-label-engraved">
              {targetCalories} KCAL
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56">
            {days.map((day) => {
              const maxScale = 2500;
              const heightPercent = Math.min(100, Math.round((day.calories / maxScale) * 100));
              const isSelected = day.dateKey === selectedDayKey;

              return (
                <button
                  key={day.dateKey}
                  onClick={() => {
                    setSelectedDayKey(day.dateKey);
                    onSelectDay?.(day.dateKey);
                  }}
                  className={`flex flex-col items-center justify-end h-full p-2 rounded-xl transition-all cursor-pointer group ${
                    isSelected ? 'bg-[#e0e2eb] ring-2 ring-[#316342]' : 'hover:bg-[#ecedf7]'
                  }`}
                >
                  <span className="font-label-gauge-readout text-[11px] font-bold text-[#191c22] mb-1">
                    {day.calories}
                  </span>

                  {/* Vertical Column Drum */}
                  <div className="w-full max-w-[36px] h-40 rounded-lg bg-[#e0e2eb] p-1 flex items-end shadow-inner">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        day.calories > day.target
                          ? 'bg-gradient-to-t from-[#c84b31] to-[#ff8c72]'
                          : 'bg-gradient-to-t from-[#316342] to-[#4a7c59]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="font-label-engraved text-[11px] text-[#414942] font-bold mt-2">
                    {day.dayName}
                  </span>
                  <span className="font-label-engraved text-[9px] text-[#717971]">
                    {day.dateKey.slice(5)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Folio Inspector */}
        <div className="mt-6 pt-4 border-t border-[#e0e2eb] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#ecedf7] p-4 rounded-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-base font-bold text-[#191c22]">
                Folio Day: {selectedDay.dayName} ({selectedDay.dateKey})
              </span>
              {selectedDay.isToday && (
                <span className="px-2 py-0.5 rounded bg-[#4a7c59] text-white text-[10px] font-label-engraved font-bold">
                  ACTIVE TODAY
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 font-label-engraved text-xs text-[#414942]">
              <span>Calories: <strong>{selectedDay.calories} kcal</strong></span>
              <span>•</span>
              <span>Water: <strong>{selectedDay.waterMl} mL</strong></span>
              <span>•</span>
              <span>Protein: <strong>{selectedDay.protein}g</strong></span>
              <span>•</span>
              <span>Carbs: <strong>{selectedDay.carbs}g</strong></span>
              <span>•</span>
              <span>Lipids: <strong>{selectedDay.fat}g</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-label-engraved text-xs text-[#316342] font-semibold">
              Variance: {selectedDay.calories - selectedDay.target} kcal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
