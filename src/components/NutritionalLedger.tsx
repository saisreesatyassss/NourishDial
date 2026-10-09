import React from 'react';
import { LogEntry } from '../types/horology';

interface NutritionalLedgerProps {
  entries: LogEntry[];
  onAddDish: (slotMealType?: string) => void;
  onDeleteEntry: (id: string) => void;
  onOpenCalibration: () => void;
  onSelectEntryDetails?: (entry: LogEntry) => void;
}

export const NutritionalLedger: React.FC<NutritionalLedgerProps> = ({
  entries,
  onAddDish,
  onDeleteEntry,
  onOpenCalibration,
  onSelectEntryDetails,
}) => {
  // Compute subtotal calories for confirmed items
  const subtotalCalories = entries
    .filter((e) => e.isConfirmed && !e.isWater)
    .reduce((sum, e) => sum + e.calories, 0);

  return (
    <div className="w-full rounded-xl bg-[#f2f3fd] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_12px_32px_rgba(15,17,21,0.06)] relative p-6 border border-[#e0e2eb]/80">
      {/* Ledger Top Binding Strip with Rivets & Ruling */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-3 border-b-0 relative">
        {/* Binder Ring Fasteners */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#d4af37] via-[#9e7d17] to-[#513e00] shadow-[0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2a1d00]" />
            </div>
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#d4af37] via-[#9e7d17] to-[#513e00] shadow-[0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2a1d00]" />
            </div>
          </div>
          <div>
            <h2 className="font-headline-lg text-[26px] font-bold text-[#191c22] tracking-tight">
              Today's Nutritional Ledger
            </h2>
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase tracking-widest">
              CHRONOLOGICAL ENTRY ARCHIVE — FOLIO 419
            </span>
          </div>
        </div>

        {/* Subtotal Pill & Quick Add */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded bg-[#e0e2eb] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.15)] text-[#191c22] font-label-engraved text-[11px]">
            SUBTOTAL LOGGED:{' '}
            <span className="text-[#316342] font-bold ml-1">
              {subtotalCalories.toLocaleString()} KCAL
            </span>
          </div>
          <button
            onClick={() => onAddDish()}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-b from-[#ffffff] via-[#eeeae0] to-[#ddd6c7] text-[#191c22] font-label-gauge-readout text-[11px] uppercase font-bold shadow-[0px_2px_4px_rgba(15,17,21,0.12),0px_1px_0px_rgba(255,255,255,0.9)_inset] active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Log Meal
          </button>
        </div>
      </div>

      {/* Timeline Entries Matrix */}
      <div className="flex flex-col gap-4 mt-4 relative">
        {/* Vertical Connecting Wire Gauge Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#316342] via-[#874a00] to-[#c1c9bf]/60 z-0 hidden sm:block" />

        {entries.map((entry) => {
          // If this is a Water Interlude
          if (entry.isWater) {
            return (
              <div
                key={entry.id}
                className="relative z-10 flex items-center justify-between p-3 rounded-xl bg-[#66b3fd]/10 shadow-[inset_0px_1px_2px_rgba(0,98,160,0.1)] gap-4 sm:ml-6 group border border-[#66b3fd]/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#66b3fd]/30 text-[#0062a0] flex items-center justify-center flex-shrink-0 shadow-[inset_0px_1px_2px_rgba(0,0,0,0.1)]">
                    <span className="material-symbols-outlined text-sm">water_drop</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-label-engraved text-[11px] text-[#0062a0] font-bold">
                      {entry.time}
                    </span>
                    <span className="font-body-md text-[14px] text-[#191c22] font-semibold">
                      {entry.title}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded bg-[#66b3fd]/20 text-[#0062a0] font-label-gauge-readout text-[12px] font-bold">
                    +{entry.waterAmountMl || 500} mL
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    title="Remove logged water entry"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#717971] hover:text-[#ba1a1a] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            );
          }

          // If this is an Unconfirmed/Slot Placeholder
          if (!entry.isConfirmed) {
            return (
              <div
                key={entry.id}
                className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-[#e0e2eb]/60 shadow-[inset_0px_2px_5px_rgba(0,0,0,0.15)] gap-4 border border-dashed border-[#c1c9bf]"
              >
                <div className="flex items-center gap-4">
                  {/* Pending Notch */}
                  <div className="w-12 h-12 rounded-full bg-[#ecedf7] shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] flex items-center justify-center flex-shrink-0 text-[#717971]">
                    <span className="material-symbols-outlined text-lg">
                      radio_button_unchecked
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-engraved text-[11px] text-[#874a00] font-bold">
                        {entry.time} • {entry.mealType} ESTIMATE
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#ffdcc1] text-[#2e1500] text-[10px] font-label-engraved font-bold">
                        TARGET: ~{entry.calories} KCAL
                      </span>
                    </div>
                    <span className="font-headline-md text-[18px] text-[#414942] font-semibold mt-0.5">
                      {entry.title}
                    </span>
                    <span className="font-body-sm text-[13px] text-[#717971]">
                      {entry.description}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-16 md:ml-0">
                  <button
                    onClick={() => onAddDish(entry.mealType)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#ffffff] via-[#eeeae0] to-[#ddd6c7] text-[#191c22] font-label-gauge-readout text-[11px] uppercase font-bold shadow-[0px_3px_5px_rgba(15,17,21,0.15),0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_-2px_2px_rgba(0,0,0,0.15)_inset] active:translate-y-0.5 active:shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] transition-all flex items-center gap-1.5 cursor-pointer hover:brightness-105"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span>Add Dish</span>
                  </button>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1.5 rounded hover:bg-[#d8dae3] text-[#717971] hover:text-[#ba1a1a] transition-colors"
                    title="Dismiss placeholder"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            );
          }

          // Verified Food Entry
          return (
            <div
              key={entry.id}
              className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-[#ecedf7] shadow-[0px_2px_6px_rgba(0,0,0,0.04),0px_1px_0px_rgba(255,255,255,0.9)_inset] gap-4 border border-[#e0e2eb]/60 group"
            >
              <div className="flex items-center gap-4">
                {/* Timeline Indicator Rivet */}
                <div className="w-12 h-12 rounded-full bg-[#ffffff] shadow-[0px_2px_4px_rgba(0,0,0,0.12),inset_0px_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center flex-shrink-0 text-[#316342]">
                  <span
                    className="material-symbols-outlined text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>

                {/* Food Thumbnail Plaque */}
                {entry.imageUrl ? (
                  <div
                    onClick={() => onSelectEntryDetails?.(entry)}
                    className="w-16 h-16 rounded-lg overflow-hidden relative shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2),0px_1px_2px_rgba(0,0,0,0.1)] flex-shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-[#4a7c59] transition-all"
                    title="Click to view optical breakdown"
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src={entry.imageUrl}
                      alt={entry.title}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-[#e0e2eb] flex items-center justify-center text-[#717971] flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">restaurant</span>
                  </div>
                )}

                {/* Description & Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-engraved text-[10px] text-[#414942] font-bold">
                      {entry.time} • {entry.mealType}
                    </span>

                    {/* AI Optic Badge vs Manual Tag */}
                    {entry.verificationTag === 'AI OPTIC LOGGED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#4a7c59] text-[#e1ffe5] text-[10px] font-label-engraved font-bold flex items-center gap-1 shadow-[0px_0px_6px_#4a7c59]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e1ffe5] animate-ping" />
                        AI OPTIC LOGGED
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-[#e6e8f1] text-[#414942] text-[10px] font-label-engraved">
                        {entry.verificationTag}
                      </span>
                    )}
                  </div>
                  <span className="font-headline-md text-[18px] text-[#191c22] font-semibold mt-0.5">
                    {entry.title}
                  </span>
                  <span className="font-body-sm text-[13px] text-[#414942]">
                    {entry.description}
                  </span>
                </div>
              </div>

              {/* Calorie & Macro Gauges Pillbox */}
              <div className="flex items-center gap-4 ml-16 md:ml-0 self-end md:self-center">
                <div className="flex items-center gap-1 font-label-engraved text-[11px]">
                  <span className="px-2 py-1 rounded bg-[#316342]/10 text-[#316342] font-bold">
                    P: {entry.protein}g
                  </span>
                  <span className="px-2 py-1 rounded bg-[#874a00]/10 text-[#874a00] font-bold">
                    C: {entry.carbs}g
                  </span>
                  <span className="px-2 py-1 rounded bg-[#c84b31]/10 text-[#c84b31] font-bold">
                    F: {entry.fat}g
                  </span>
                </div>

                {/* Calorie Stamped Seal */}
                <div className="px-4 py-2 rounded-lg bg-[#e0e2eb] shadow-[inset_0px_2px_3px_rgba(0,0,0,0.2)] text-right min-w-[72px]">
                  <span className="block font-label-gauge-num text-[20px] text-[#191c22] font-bold leading-tight">
                    {entry.calories}
                  </span>
                  <span className="block font-label-engraved text-[9px] text-[#414942] uppercase">
                    Kcal
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  title="Remove entry from ledger"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#717971] hover:text-[#ba1a1a] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auxiliary Horological Calibration Bar */}
      <div className="mt-6 w-full p-3 rounded-lg bg-[#ecedf7] shadow-[inset_0px_1px_2px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#e0e2eb]/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#414942] text-base">
            precision_manufacturing
          </span>
          <span className="font-label-engraved text-[10px] text-[#414942] uppercase tracking-wider">
            CHRONOMETER ACCURACY TOLERANCE: ±15 KCAL / 24H
          </span>
        </div>
        <div className="flex items-center gap-3 font-label-engraved text-[10px] text-[#414942]">
          <span>SYNCHRONIZED: 2 MINS AGO</span>
          <span className="w-1 h-1 rounded-full bg-[#717971]" />
          <button
            onClick={onOpenCalibration}
            className="text-[#316342] hover:underline font-bold cursor-pointer"
          >
            MANUAL RE-CALIBRATE
          </button>
        </div>
      </div>
    </div>
  );
};
