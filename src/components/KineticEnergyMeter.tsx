import React from 'react';

interface KineticEnergyMeterProps {
  consumedCalories: number;
  targetCalories: number;
  proteinG: number;
  targetProteinG: number;
  carbsG: number;
  targetCarbsG: number;
  fatG: number;
  targetFatG: number;
  onEditTarget?: () => void;
}

export const KineticEnergyMeter: React.FC<KineticEnergyMeterProps> = ({
  consumedCalories,
  targetCalories,
  proteinG,
  targetProteinG,
  carbsG,
  targetCarbsG,
  fatG,
  targetFatG,
  onEditTarget,
}) => {
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const deficitCalories = targetCalories - consumedCalories;

  // Needle angle calculation:
  // At 0 kcal => -120 deg (bottom left)
  // At 1250 kcal => 0 deg (top center)
  // At 2500 kcal => +115 deg (bottom right)
  const maxScaleKcal = Math.max(2500, targetCalories * 1.2);
  const needleRotation = -120 + (Math.min(consumedCalories, maxScaleKcal) / maxScaleKcal) * 235;

  // SVG circular arc dash: max visible sweep is ~470 of 628 circumference
  const arcLength = Math.min(470, (consumedCalories / maxScaleKcal) * 470);

  // Macro Drum percentages and remaining
  const proteinPercent = Math.min(100, Math.round((proteinG / targetProteinG) * 100));
  const proteinRemain = Math.max(0, targetProteinG - proteinG);

  const carbsPercent = Math.min(100, Math.round((carbsG / targetCarbsG) * 100));
  const carbsRemain = Math.max(0, targetCarbsG - carbsG);

  const fatPercent = Math.min(100, Math.round((fatG / targetFatG) * 100));
  const fatRemain = Math.max(0, targetFatG - fatG);

  return (
    <div className="relative p-6 rounded-xl bg-[#f2f3fd] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08),0px_2px_4px_rgba(15,17,21,0.04)] border border-[#e0e2eb]/70">
      {/* Milled Brass Corner Screws */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] rotate-45" />
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-12" />
      </div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] rotate-90" />
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] rotate-30" />
      </div>

      {/* Header & Calibration Readout */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#316342] shadow-[0_0_8px_#316342]" />
          <h2 className="font-headline-md text-[22px] font-semibold text-[#191c22] tracking-tight">
            Kinetic Energy Meter
          </h2>
          <span className="px-1.5 py-0.5 rounded bg-[#ecedf7] text-[#414942] font-label-engraved text-[10px] uppercase">
            GAUGE MOD. 77-B
          </span>
        </div>
        <button
          onClick={onEditTarget}
          title="Click to recalibrate calorie target"
          className="px-3 py-1.5 rounded-lg bg-[#e6e8f1] hover:bg-[#e0e2eb] transition-colors shadow-[inset_0px_2px_4px_rgba(15,17,21,0.15)] flex items-center gap-1.5 cursor-pointer group"
        >
          <span className="font-label-engraved text-[10px] text-[#414942]">TARGET DIAL:</span>
          <span className="font-label-gauge-readout text-[12px] text-[#874a00] font-bold group-hover:underline">
            {targetCalories.toLocaleString()} KCAL
          </span>
          <span className="material-symbols-outlined text-[13px] text-[#874a00]">edit</span>
        </button>
      </div>

      {/* Gauges Chamber: Analog Radial & Dial Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Mechanical Tachometer Face */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          {/* Brushed Bezel Rim */}
          <div className="w-64 h-64 rounded-full p-2.5 bg-gradient-to-b from-[#d8d5ce] via-[#b8b3a8] to-[#8d887d] shadow-[0px_10px_20px_rgba(0,0,0,0.16),0px_2px_4px_rgba(0,0,0,0.12),inset_0px_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center relative">
            {/* Sunken Well Face */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#f2ece4] via-[#e5dcd1] to-[#ded4c6] shadow-[inset_0px_5px_12px_rgba(15,17,21,0.3),inset_0px_1px_3px_rgba(15,17,21,0.4)] relative flex items-center justify-center overflow-hidden">
              {/* Radial Dial Markings (SVG) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 240">
                {/* Outer decorative arc track */}
                <circle
                  cx="120"
                  cy="120"
                  fill="none"
                  r="100"
                  stroke="#d5c8b7"
                  strokeDasharray="470 628"
                  strokeDashoffset="-80"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                {/* Filled energy sweep */}
                <circle
                  className="transition-all duration-700 ease-out"
                  cx="120"
                  cy="120"
                  fill="none"
                  r="100"
                  stroke={consumedCalories > targetCalories ? '#ba1a1a' : '#4a7c59'}
                  strokeDasharray={`${arcLength} 628`}
                  strokeDashoffset="-80"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                {/* Tick marks */}
                {/* 0 kcal */}
                <line stroke="#414942" strokeWidth="2.5" x1="42" x2="52" y1="168" y2="162" />
                {/* 500 kcal */}
                <line stroke="#414942" strokeWidth="3" x1="30" x2="42" y1="120" y2="120" />
                {/* 1000 kcal */}
                <line stroke="#414942" strokeWidth="2.5" x1="52" x2="60" y1="62" y2="72" />
                {/* 1500 kcal */}
                <line stroke="#874a00" strokeWidth="3.5" x1="120" x2="120" y1="28" y2="40" />
                {/* 2000 kcal */}
                <line stroke="#ba1a1a" strokeWidth="3" x1="188" x2="180" y1="62" y2="72" />
                {/* 2500 kcal */}
                <line stroke="#ba1a1a" strokeWidth="3.5" x1="210" x2="198" y1="120" y2="120" />
              </svg>

              {/* Radial Numbers */}
              <span className="absolute left-7 bottom-12 font-label-engraved text-[10px] text-[#414942] font-bold">
                0
              </span>
              <span className="absolute left-5 top-24 font-label-engraved text-[10px] text-[#414942] font-bold">
                500
              </span>
              <span className="absolute left-14 top-10 font-label-engraved text-[10px] text-[#414942] font-bold">
                1k
              </span>
              <span className="absolute top-5 font-label-engraved text-[10px] text-[#874a00] font-bold">
                1.5k
              </span>
              <span className="absolute right-14 top-10 font-label-engraved text-[10px] text-[#ba1a1a] font-bold">
                2k
              </span>
              <span className="absolute right-5 top-24 font-label-engraved text-[10px] text-[#ba1a1a] font-bold">
                2.5k
              </span>

              {/* Physical Brass Indicator Needle (dynamically rotated) */}
              <div
                className="absolute w-full h-full pointer-events-none flex items-center justify-center transition-transform duration-700 ease-out"
                style={{ transform: `rotate(${needleRotation}deg)` }}
              >
                <div className="w-1.5 h-28 -mt-20 bg-gradient-to-t from-[#c84b31] via-[#e25a3c] to-[#ff7b5a] rounded-t-full shadow-[0px_4px_8px_rgba(15,17,21,0.45)] relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[8px] border-b-[#ffdad6]" />
                </div>
              </div>

              {/* Convex Glass Glare Reflection */}
              <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-80" />
              <div className="absolute -top-12 -left-8 w-44 h-44 rounded-full bg-white/20 blur-sm pointer-events-none" />

              {/* Central Milled Hub / Debossed Digital Vault */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-b from-[#e3ded4] to-[#c9c2b4] shadow-[0px_2px_4px_rgba(0,0,0,0.18),inset_0px_2px_3px_rgba(255,255,255,0.9),inset_0px_-2px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center z-10 text-center p-2">
                {/* Center Enamel Rivet */}
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#d4af37] via-[#a37c15] to-[#493405] shadow-[0px_1px_2px_rgba(0,0,0,0.5)] mb-1" />
                <span className="font-label-engraved text-[10px] text-[#414942] font-semibold uppercase">
                  Remaining
                </span>
                <span className="font-label-gauge-num text-[24px] text-[#316342] font-extrabold tracking-tight drop-shadow-sm">
                  {remainingCalories.toLocaleString()}
                </span>
                <span className="font-label-engraved text-[10px] text-[#874a00]">
                  KCAL OF {targetCalories.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Gauge Calibration Tag Plaque */}
          <div className="mt-2 px-3 py-0.5 rounded-full bg-[#e0e2eb] shadow-[inset_0px_1px_1px_rgba(0,0,0,0.15)] flex items-center gap-1.5">
            <span className="font-label-engraved text-[10px] text-[#414942] tracking-wider">
              DEFICIT CHRONO:
            </span>
            <span
              className={`font-label-gauge-readout text-[11px] font-bold ${
                deficitCalories >= 0 ? 'text-[#4a7c59]' : 'text-[#ba1a1a]'
              }`}
            >
              {deficitCalories >= 0 ? `-${deficitCalories} KCAL TODAY` : `+${Math.abs(deficitCalories)} KCAL SURPLUS`}
            </span>
          </div>
        </div>

        {/* Right Side: Mechanical Odometer Tumbler Casettes */}
        <div className="md:col-span-5 flex flex-col gap-3">
          {/* Protein Tumbler Drum */}
          <div className="p-3 rounded-lg bg-[#ecedf7] shadow-[inset_0px_2px_4px_rgba(15,17,21,0.15),0px_1px_0px_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#316342] shadow-[0_0_4px_#316342]" />
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase font-bold">
                  Protein Drum
                </span>
              </div>
              <span className="font-label-gauge-readout text-[12px] text-[#316342] font-bold">
                {Math.round(proteinG)} / {targetProteinG}g
              </span>
            </div>
            {/* Physical Roller Housing */}
            <div className="h-6 rounded bg-[#e0e2eb] shadow-[inset_0px_2px_3px_rgba(0,0,0,0.3)] p-0.5 overflow-hidden flex items-center">
              <div
                className="h-full rounded bg-gradient-to-r from-[#4a7c59] via-[#316342] to-[#b9efc5] shadow-[0px_1px_2px_rgba(0,0,0,0.2)] transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              >
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(255,255,255,0.2)_6px,rgba(255,255,255,0.2)_8px)]" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-[#414942] font-label-engraved text-[10px]">
              <span>{proteinPercent}% QUOTA</span>
              <span>{proteinRemain}g REQ</span>
            </div>
          </div>

          {/* Carbs Tumbler Drum */}
          <div className="p-3 rounded-lg bg-[#ecedf7] shadow-[inset_0px_2px_4px_rgba(15,17,21,0.15),0px_1px_0px_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#a8600e] shadow-[0_0_4px_#a8600e]" />
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase font-bold">
                  Carbs Drum
                </span>
              </div>
              <span className="font-label-gauge-readout text-[12px] text-[#874a00] font-bold">
                {Math.round(carbsG)} / {targetCarbsG}g
              </span>
            </div>
            <div className="h-6 rounded bg-[#e0e2eb] shadow-[inset_0px_2px_3px_rgba(0,0,0,0.3)] p-0.5 overflow-hidden flex items-center">
              <div
                className="h-full rounded bg-gradient-to-r from-[#a8600e] via-[#874a00] to-[#ffdcc1] shadow-[0px_1px_2px_rgba(0,0,0,0.2)] transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              >
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(255,255,255,0.2)_6px,rgba(255,255,255,0.2)_8px)]" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-[#414942] font-label-engraved text-[10px]">
              <span>{carbsPercent}% CAPACITY</span>
              <span>{carbsRemain}g REMAIN</span>
            </div>
          </div>

          {/* Lipids / Fats Tumbler Drum */}
          <div className="p-3 rounded-lg bg-[#ecedf7] shadow-[inset_0px_2px_4px_rgba(15,17,21,0.15),0px_1px_0px_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-sm bg-[#c84b31] shadow-[0_0_4px_#c84b31]" />
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase font-bold">
                  Lipid Balance
                </span>
              </div>
              <span className="font-label-gauge-readout text-[12px] text-[#191c22] font-bold">
                {Math.round(fatG)} / {targetFatG}g
              </span>
            </div>
            <div className="h-6 rounded bg-[#e0e2eb] shadow-[inset_0px_2px_3px_rgba(0,0,0,0.3)] p-0.5 overflow-hidden flex items-center">
              <div
                className="h-full rounded bg-gradient-to-r from-[#b34026] via-[#c84b31] to-[#ff8c72] shadow-[0px_1px_2px_rgba(0,0,0,0.2)] transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              >
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_6px,rgba(255,255,255,0.2)_6px,rgba(255,255,255,0.2)_8px)]" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-[#414942] font-label-engraved text-[10px]">
              <span>{fatPercent}% RATIO</span>
              <span>{fatRemain}g LEFT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
