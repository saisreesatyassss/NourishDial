import React, { useState } from 'react';
import { UserGoals } from '../types/horology';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: UserGoals;
  onSaveGoals: (goals: UserGoals) => void;
  onResetData: () => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  goals,
  onSaveGoals,
  onResetData,
}) => {
  const [targetKcal, setTargetKcal] = useState(goals.targetCalories);
  const [toleranceKcal, setToleranceKcal] = useState(goals.toleranceKcal24h);
  const [streakDays, setStreakDays] = useState(goals.streakDays);
  const [bmr, setBmr] = useState(goals.bmrKcal);
  const [tdee, setTdee] = useState(goals.tdeeKcal);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveGoals({
      ...goals,
      targetCalories: Number(targetKcal),
      toleranceKcal24h: Number(toleranceKcal),
      streakDays: Number(streakDays),
      bmrKcal: Number(bmr),
      tdeeKcal: Number(tdee),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_20px_40px_rgba(0,0,0,0.3)] p-6">
        {/* Brass Screws */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
          <span className="block w-2 h-0.5 bg-[#4a3617] rotate-45" />
        </div>
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
          <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-45" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-headline-md text-[20px] font-bold text-[#191c22]">
              Chronometer Recalibration
            </h3>
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase">
              ISO-8601 HOROLOGICAL LABORATORY BENCHMARK
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#e0e2eb] text-[#717971] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 font-body-sm text-sm">
          <div>
            <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
              Target Dial (Kcal / 24h)
            </label>
            <input
              type="number"
              value={targetKcal}
              onChange={(e) => setTargetKcal(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                Accuracy Tolerance
              </label>
              <input
                type="number"
                value={toleranceKcal}
                onChange={(e) => setToleranceKcal(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
              <span className="text-[10px] text-[#717971] font-label-engraved">± kcal / 24h</span>
            </div>

            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                Caloric Deficit Streak
              </label>
              <input
                type="number"
                value={streakDays}
                onChange={(e) => setStreakDays(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
              <span className="text-[10px] text-[#717971] font-label-engraved">Consecutive Days</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                BMR (Basal Kcal)
              </label>
              <input
                type="number"
                value={bmr}
                onChange={(e) => setBmr(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
            </div>
            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                TDEE (Burned Kcal)
              </label>
              <input
                type="number"
                value={tdee}
                onChange={(e) => setTdee(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#ecedf7] border border-[#e0e2eb] mt-1 text-[11px] font-label-engraved text-[#414942]">
            Synchronized with NTP atomic horological servers. Oscillatory quartz stability verified: ±0.02%.
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#e0e2eb] mt-2">
            <button
              type="button"
              onClick={onResetData}
              className="text-xs text-[#ba1a1a] hover:underline font-label-engraved cursor-pointer"
            >
              Reset to Folio Default
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-[#ecedf7] text-[#414942] font-label-engraved text-xs cursor-pointer hover:bg-[#e0e2eb]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[#316342] text-white font-label-gauge-readout text-xs uppercase font-bold shadow cursor-pointer hover:bg-[#4a7c59]"
              >
                Sync Calibration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
