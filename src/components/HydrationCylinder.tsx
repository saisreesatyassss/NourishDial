import React, { useState } from 'react';

interface HydrationCylinderProps {
  waterLoggedMl: number;
  waterTargetMl: number;
  streakDays: number;
  onDoseWater: (amountMl: number) => void;
  onResetOrCustom?: () => void;
}

export const HydrationCylinder: React.FC<HydrationCylinderProps> = ({
  waterLoggedMl,
  waterTargetMl,
  streakDays,
  onDoseWater,
  onResetOrCustom,
}) => {
  const [lastDose, setLastDose] = useState<number | null>(null);

  const percentage = Math.min(100, Math.round((waterLoggedMl / waterTargetMl) * 100));
  const remainingMl = Math.max(0, waterTargetMl - waterLoggedMl);

  const handleDose = (ml: number) => {
    onDoseWater(ml);
    setLastDose(ml);
    setTimeout(() => setLastDose(null), 1200);
  };

  return (
    <div className="relative p-6 rounded-xl bg-[#f2f3fd] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08),0px_2px_4px_rgba(15,17,21,0.04)] border border-[#e0e2eb]/70 flex flex-col justify-between">
      {/* Hardware Brass Screws */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] rotate-12" />
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-45" />
      </div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] rotate-60" />
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] shadow-[0px_1px_1px_rgba(255,255,255,0.6)_inset,0px_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
        <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-12" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0062a0] shadow-[0_0_8px_#0062a0]" />
          <h3 className="font-headline-md text-[22px] font-semibold text-[#191c22] tracking-tight">
            Hydration Cylinder
          </h3>
        </div>
        <button
          onClick={onResetOrCustom}
          title="Adjust Reservoir Quota"
          className="font-label-gauge-readout text-[12px] text-[#0062a0] font-bold hover:underline cursor-pointer"
        >
          {waterLoggedMl.toLocaleString()} / {waterTargetMl.toLocaleString()} mL
        </button>
      </div>

      {/* Main Water Cylinder Sight Column + Level Callout */}
      <div className="grid grid-cols-12 gap-4 items-center my-1">
        {/* The Glass Capsule Sight Beaker */}
        <div className="col-span-5 flex justify-center">
          {/* Heavy Cast Bezel Flange */}
          <div className="w-24 h-64 p-2 rounded-full bg-gradient-to-b from-[#d2ccc0] via-[#bcb5a7] to-[#8d877b] shadow-[0px_8px_16px_rgba(0,0,0,0.18),inset_0px_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center relative">
            {/* Recessed Borosilicate Chamber */}
            <div className="w-full h-full rounded-full bg-[#0a1b2a] shadow-[inset_0px_4px_10px_rgba(0,0,0,0.7),0px_1px_0px_rgba(255,255,255,0.4)] relative overflow-hidden flex flex-col justify-end">
              {/* Graduated Markings (Debossed Tick Lines) */}
              <div className="absolute inset-y-4 right-2 w-5 flex flex-col justify-between z-20 pointer-events-none select-none">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">3000</span>
                  <div className="w-2 h-0.5 bg-white/60" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">2500</span>
                  <div className="w-1.5 h-0.5 bg-white/40" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">2000</span>
                  <div className="w-2 h-0.5 bg-white/60" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">1500</span>
                  <div className="w-1.5 h-0.5 bg-white/40" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">1000</span>
                  <div className="w-2 h-0.5 bg-white/60" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[8px] font-label-engraved text-white/50">500</span>
                  <div className="w-1.5 h-0.5 bg-white/40" />
                </div>
              </div>

              {/* Rising Aqueous Fluid */}
              <div
                className="w-full rounded-b-full bg-gradient-to-t from-[#004a7a] via-[#0062a0] to-[#38a3f1] relative transition-all duration-700 ease-out"
                style={{ height: `${percentage}%` }}
              >
                {/* Fluid Meniscus Glow Line & Highlight */}
                <div className="w-full h-2 rounded-[50%] bg-[#81cbff] shadow-[0px_0px_8px_#38a3f1] -mt-1 opacity-90" />
                {/* Micro Bubbles in Tube */}
                <div className="absolute bottom-6 left-3 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                <div className="absolute bottom-16 left-6 w-1 h-1 rounded-full bg-white/50 animate-ping" />
                <div className="absolute bottom-28 left-4 w-2 h-2 rounded-full bg-white/30" />
              </div>

              {/* Thick Borosilicate Specular Reflection Sheen */}
              <div className="absolute inset-y-0 left-2 w-1.5 bg-white/20 blur-[0.5px] rounded-full pointer-events-none" />
              <div className="absolute top-2 inset-x-3 h-4 bg-white/10 rounded-full blur-[1px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Metric Details & Embossed Leather Badge */}
        <div className="col-span-7 flex flex-col gap-3">
          {/* Fluid Readout Plaque */}
          <div className="p-3 rounded-lg bg-[#ecedf7] shadow-[inset_0px_2px_4px_rgba(15,17,21,0.15)]">
            <span className="font-label-engraved text-[10px] text-[#414942] font-semibold">
              HYDRO-LEVEL INDEX
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-label-gauge-num text-[24px] text-[#0062a0] font-black">
                {percentage}%
              </span>
              <span className="font-body-sm text-[13px] text-[#191c22] font-medium">
                OF HYDRATION GOAL
              </span>
            </div>
            <p className="font-label-engraved text-[10px] text-[#717971] mt-1">
              {remainingMl > 0
                ? `${remainingMl.toLocaleString()} mL remaining before 21:00 bell.`
                : 'Hydration quota fully satisfied.'}
            </p>
          </div>

          {/* Stitched Leather Streak Emblem */}
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-[#733e00] to-[#512b00] shadow-[0px_4px_10px_rgba(0,0,0,0.25),inset_0px_1px_1px_rgba(255,255,255,0.3)] text-[#ffdcc1] overflow-hidden">
            {/* Stitched Border Simulation */}
            <div className="absolute inset-1 rounded-lg border border-dashed border-[#ffb779]/40 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#3c1e00] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5),0px_1px_0px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#ffdcc1]">
                <span className="material-symbols-outlined text-[20px] text-[#ffb779]">
                  local_fire_department
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-md text-[20px] leading-none font-bold text-[#ffdcc1]">
                    {streakDays} DAYS
                  </span>
                  <span className="px-1 py-0.5 rounded bg-[#9a5405] text-[9px] font-label-engraved tracking-widest uppercase font-bold text-white">
                    RECORD
                  </span>
                </div>
                <span className="font-label-engraved text-[10px] text-[#ffb779] uppercase tracking-wider mt-0.5">
                  Caloric Deficit Sustained
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tactile Mechanical Water Dosing Buttons (Pressable Stamp-Keys) */}
      <div className="grid grid-cols-3 gap-2 pt-2 relative">
        {lastDose && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#0062a0] text-white font-label-engraved text-[10px] shadow animate-bounce">
            +{lastDose} mL Dosed!
          </div>
        )}

        {/* +100ml Sip Key */}
        <button
          onClick={() => handleDose(100)}
          className="group relative px-2 py-3 rounded-lg bg-gradient-to-b from-[#ffffff] via-[#ebe7df] to-[#d6cfc2] shadow-[0px_4px_6px_rgba(15,17,21,0.16),0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_-2px_3px_rgba(0,0,0,0.15)_inset] active:translate-y-0.5 active:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.25)] transition-all flex flex-col items-center justify-center cursor-pointer select-none"
          type="button"
        >
          <span className="material-symbols-outlined text-[#0062a0] text-base group-hover:scale-110 transition-transform">
            water_drop
          </span>
          <span className="font-label-gauge-readout text-[12px] text-[#191c22] font-bold mt-0.5">
            +100 ml
          </span>
          <span className="font-label-engraved text-[9px] text-[#414942] uppercase">
            Sip Key
          </span>
        </button>

        {/* +250ml Glass Key */}
        <button
          onClick={() => handleDose(250)}
          className="group relative px-2 py-3 rounded-lg bg-gradient-to-b from-[#ffffff] via-[#ebe7df] to-[#d6cfc2] shadow-[0px_4px_6px_rgba(15,17,21,0.16),0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_-2px_3px_rgba(0,0,0,0.15)_inset] active:translate-y-0.5 active:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.25)] transition-all flex flex-col items-center justify-center cursor-pointer select-none"
          type="button"
        >
          <span className="material-symbols-outlined text-[#0062a0] text-base group-hover:scale-110 transition-transform">
            local_cafe
          </span>
          <span className="font-label-gauge-readout text-[12px] text-[#191c22] font-bold mt-0.5">
            +250 ml
          </span>
          <span className="font-label-engraved text-[9px] text-[#414942] uppercase">
            Glass Key
          </span>
        </button>

        {/* +500ml Flask Key (Dark Gunmetal Finish) */}
        <button
          onClick={() => handleDose(500)}
          className="group relative px-2 py-3 rounded-lg bg-gradient-to-b from-[#424752] via-[#31363f] to-[#1f2329] text-white shadow-[0px_4px_6px_rgba(15,17,21,0.24),0px_1px_0px_rgba(255,255,255,0.3)_inset,0px_-2px_3px_rgba(0,0,0,0.4)_inset] active:translate-y-0.5 active:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] transition-all flex flex-col items-center justify-center cursor-pointer select-none"
          type="button"
        >
          <span className="material-symbols-outlined text-[#66b3fd] text-base group-hover:scale-110 transition-transform">
            sports_bar
          </span>
          <span className="font-label-gauge-readout text-[12px] text-white font-bold mt-0.5">
            +500 ml
          </span>
          <span className="font-label-engraved text-[9px] text-[#d8dae3] uppercase">
            Flask Key
          </span>
        </button>
      </div>
    </div>
  );
};
