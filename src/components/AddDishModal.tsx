import React, { useState } from 'react';
import { LogEntry } from '../types/horology';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: LogEntry) => void;
  defaultMealType?: string;
}

export const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  onAddEntry,
  defaultMealType = 'DINNER',
}) => {
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState<any>(defaultMealType);
  const [calories, setCalories] = useState('550');
  const [protein, setProtein] = useState('35');
  const [carbs, setCarbs] = useState('45');
  const [fat, setFat] = useState('18');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      time: timeStr,
      mealType: mealType,
      verificationTag: 'MANUAL VERIFIED',
      title: title,
      description: description || 'Chronological verified dish entry',
      calories: Math.round(Number(calories) || 0),
      protein: Math.round(Number(protein) || 0),
      carbs: Math.round(Number(carbs) || 0),
      fat: Math.round(Number(fat) || 0),
      imageUrl: imageUrl || undefined,
      isConfirmed: true,
    };

    onAddEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_20px_40px_rgba(0,0,0,0.3)] p-6">
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
              Log Dish to Chrono-Ledger
            </h3>
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase">
              FOLIO ENTRY REGISTRATION • MANUAL OR OPTIC INPUT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#e0e2eb] text-[#717971] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
              Dish Title / Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grass-fed Ribeye or Lentil Dahl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] text-sm text-[#191c22] focus:ring-2 focus:ring-[#316342] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] text-sm text-[#191c22]"
              >
                <option value="BREAKFAST">BREAKFAST</option>
                <option value="LUNCH">LUNCH</option>
                <option value="MID-DAY REFUEL">MID-DAY REFUEL</option>
                <option value="DINNER">DINNER</option>
                <option value="SNACK">SNACK</option>
              </select>
            </div>
            <div>
              <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
                Kinetic Calories (Kcal)
              </label>
              <input
                type="number"
                required
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm text-[#191c22]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-label-engraved text-[10px] text-[#316342] font-bold block mb-1">
                PROTEIN (g)
              </label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
            </div>
            <div>
              <label className="font-label-engraved text-[10px] text-[#874a00] font-bold block mb-1">
                CARBS (g)
              </label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
            </div>
            <div>
              <label className="font-label-engraved text-[10px] text-[#c84b31] font-bold block mb-1">
                LIPIDS (g)
              </label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
              Description / Ingredients
            </label>
            <input
              type="text"
              placeholder="e.g. 200g prime cut with roasted seasonal asparagus"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] text-sm text-[#191c22]"
            />
          </div>

          <div>
            <label className="font-label-engraved text-xs text-[#191c22] font-semibold block mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] text-xs font-mono text-[#191c22]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#e0e2eb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#ecedf7] hover:bg-[#e0e2eb] text-[#414942] font-label-engraved text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#316342] hover:bg-[#4a7c59] text-white font-label-gauge-readout text-xs uppercase font-bold shadow cursor-pointer"
            >
              Commit to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
