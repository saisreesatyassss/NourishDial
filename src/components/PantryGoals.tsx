import React, { useState } from 'react';
import { PANTRY_CATALOG } from '../data/initialData';
import { LogEntry, PantryItem, UserGoals } from '../types/horology';

interface PantryGoalsProps {
  goals: UserGoals;
  onUpdateGoals: (goals: UserGoals) => void;
  onQuickLogPantryItem: (entry: LogEntry) => void;
}

export const PantryGoals: React.FC<PantryGoalsProps> = ({
  goals,
  onUpdateGoals,
  onQuickLogPantryItem,
}) => {
  const [localGoals, setLocalGoals] = useState<UserGoals>({ ...goals });
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(PANTRY_CATALOG);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // New item state
  const [newItemName, setNewItemName] = useState('');
  const [newItemServing, setNewItemServing] = useState('');
  const [newItemCalories, setNewItemCalories] = useState('150');
  const [newItemProtein, setNewItemProtein] = useState('10');
  const [newItemCarbs, setNewItemCarbs] = useState('15');
  const [newItemFat, setNewItemFat] = useState('5');

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals(localGoals);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName) return;

    const item: PantryItem = {
      id: `pantry-${Date.now()}`,
      name: newItemName,
      servingSize: newItemServing || '1 serving',
      calories: Number(newItemCalories) || 0,
      protein: Number(newItemProtein) || 0,
      carbs: Number(newItemCarbs) || 0,
      fat: Number(newItemFat) || 0,
      category: 'PROTEIN',
    };

    setPantryItems([item, ...pantryItems]);
    setShowAddForm(false);
    setNewItemName('');
    setNewItemServing('');
  };

  const handleLogItem = (item: PantryItem) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      time: timeStr,
      mealType: 'SNACK',
      verificationTag: 'QUICK LOG',
      title: item.name,
      description: `Pantry Quick-Log: ${item.servingSize}`,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      imageUrl: item.imageUrl,
      isConfirmed: true,
    };

    onQuickLogPantryItem(newEntry);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#e0e2eb] gap-2">
        <div>
          <h1 className="font-headline-lg text-[26px] font-bold text-[#191c22]">
            Pantry Catalog &amp; Horological Calibration
          </h1>
          <span className="font-label-engraved text-[11px] text-[#414942] uppercase tracking-widest">
            CALIBRATION WORKSHOP • NUTRITIONAL STAPLES &amp; GOAL HOROLOGY
          </span>
        </div>

        {savedSuccess && (
          <div className="px-3 py-1 rounded bg-[#316342] text-white font-label-engraved text-xs animate-bounce">
            ✓ Horological Targets Synchronized!
          </div>
        )}
      </div>

      {/* Main Grid: Goals Settings vs Pantry Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Horological Targets Calibration Console */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <form
            onSubmit={handleSaveGoals}
            className="relative p-6 rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08)] flex flex-col justify-between"
          >
            {/* Screws */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
              <span className="block w-2 h-0.5 bg-[#4a3617] rotate-45" />
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
              <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-45" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#316342] shadow-[0_0_8px_#316342]" />
                <h2 className="font-headline-md text-[20px] font-bold text-[#191c22]">
                  Chronometer Calibration Knobs
                </h2>
              </div>

              {/* Daily Calorie Target Dial */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-engraved text-xs text-[#191c22] font-bold uppercase">
                    Daily Kinetic Target (Kcal)
                  </label>
                  <span className="font-label-gauge-readout text-sm text-[#874a00] font-bold">
                    {localGoals.targetCalories} KCAL
                  </span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="50"
                  value={localGoals.targetCalories}
                  onChange={(e) =>
                    setLocalGoals({ ...localGoals, targetCalories: Number(e.target.value) })
                  }
                  className="w-full accent-[#316342] cursor-pointer"
                />
              </div>

              {/* Water Quota */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-engraved text-xs text-[#191c22] font-bold uppercase">
                    Hydration Cylinder Volume (mL)
                  </label>
                  <span className="font-label-gauge-readout text-sm text-[#0062a0] font-bold">
                    {localGoals.targetWaterMl} mL
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="5000"
                  step="250"
                  value={localGoals.targetWaterMl}
                  onChange={(e) =>
                    setLocalGoals({ ...localGoals, targetWaterMl: Number(e.target.value) })
                  }
                  className="w-full accent-[#0062a0] cursor-pointer"
                />
              </div>

              {/* Macro Quotas (Grams) */}
              <div className="pt-2 border-t border-[#e0e2eb]">
                <span className="font-label-engraved text-[11px] text-[#414942] uppercase font-bold block mb-2">
                  Macro Drum Target Quotas:
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-label-engraved text-[10px] text-[#316342] font-bold block">
                      PROTEIN (g)
                    </label>
                    <input
                      type="number"
                      value={localGoals.targetProteinG}
                      onChange={(e) =>
                        setLocalGoals({ ...localGoals, targetProteinG: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 rounded bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-label-engraved text-[10px] text-[#874a00] font-bold block">
                      CARBS (g)
                    </label>
                    <input
                      type="number"
                      value={localGoals.targetCarbsG}
                      onChange={(e) =>
                        setLocalGoals({ ...localGoals, targetCarbsG: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 rounded bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
                    />
                  </div>

                  <div>
                    <label className="font-label-engraved text-[10px] text-[#c84b31] font-bold block">
                      FATS (g)
                    </label>
                    <input
                      type="number"
                      value={localGoals.targetFatG}
                      onChange={(e) =>
                        setLocalGoals({ ...localGoals, targetFatG: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 rounded bg-white border border-[#c1c9bf] font-label-gauge-readout text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Horological BMR Summary */}
              <div className="mt-4 p-3 rounded-xl bg-[#ecedf7] text-[11px] font-label-engraved text-[#414942]">
                <div className="flex justify-between">
                  <span>Basal Metabolic Rate:</span>
                  <span className="font-bold text-[#191c22]">{localGoals.bmrKcal} kcal</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>TDEE Energy Expenditure:</span>
                  <span className="font-bold text-[#191c22]">{localGoals.tdeeKcal} kcal</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Planned Caloric Deficit:</span>
                  <span className="font-bold text-[#316342]">
                    -{localGoals.tdeeKcal - localGoals.targetCalories} kcal / day
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-5">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-b from-[#3d7a52] via-[#316342] to-[#254b32] text-white font-label-gauge-readout text-xs uppercase tracking-wider shadow-[0px_3px_6px_rgba(49,99,66,0.3)] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                Apply Horological Calibration
              </button>
            </div>
          </form>
        </div>

        {/* Right 7 Cols: Quick-Log Pantry Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-6 rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-headline-md text-[20px] font-bold text-[#191c22]">
                  Pantry Staple Repertoire
                </h2>
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase">
                  Pre-Calibrated Horological Portions • 1-Click Timeline Logging
                </span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-lg bg-[#e0e2eb] hover:bg-[#d8dae3] text-[#191c22] font-label-gauge-readout text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  {showAddForm ? 'close' : 'add'}
                </span>
                {showAddForm ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            {/* Add Custom Item Drawer */}
            {showAddForm && (
              <form
                onSubmit={handleAddCustomItem}
                className="mb-4 p-4 rounded-xl bg-white border border-[#c1c9bf] shadow-sm flex flex-col gap-3"
              >
                <div className="font-headline-md text-sm font-bold text-[#191c22]">
                  Register New Pantry Staple:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Staple Title (e.g. Rolled Oats)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                    className="px-2.5 py-1.5 rounded border border-[#c1c9bf] text-xs font-body-sm"
                  />
                  <input
                    type="text"
                    placeholder="Serving (e.g. 1 cup 80g)"
                    value={newItemServing}
                    onChange={(e) => setNewItemServing(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-[#c1c9bf] text-xs font-body-sm"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 font-label-engraved text-[10px]">
                  <div>
                    <span className="block text-[#414942]">Calories</span>
                    <input
                      type="number"
                      value={newItemCalories}
                      onChange={(e) => setNewItemCalories(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-[#c1c9bf]"
                    />
                  </div>
                  <div>
                    <span className="block text-[#316342]">Protein</span>
                    <input
                      type="number"
                      value={newItemProtein}
                      onChange={(e) => setNewItemProtein(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-[#c1c9bf]"
                    />
                  </div>
                  <div>
                    <span className="block text-[#874a00]">Carbs</span>
                    <input
                      type="number"
                      value={newItemCarbs}
                      onChange={(e) => setNewItemCarbs(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-[#c1c9bf]"
                    />
                  </div>
                  <div>
                    <span className="block text-[#c84b31]">Fat</span>
                    <input
                      type="number"
                      value={newItemFat}
                      onChange={(e) => setNewItemFat(e.target.value)}
                      className="w-full px-2 py-1 rounded border border-[#c1c9bf]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-1.5 rounded bg-[#316342] text-white font-label-engraved text-xs font-bold hover:bg-[#4a7c59] cursor-pointer"
                >
                  Save to Pantry Catalog
                </button>
              </form>
            )}

            {/* Pantry Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {pantryItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#ecedf7] border border-[#e0e2eb] flex flex-col justify-between hover:border-[#316342] transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-headline-md text-[13px] font-bold text-[#191c22]">
                        {item.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#e0e2eb] font-label-gauge-readout text-[11px] font-bold text-[#874a00] flex-shrink-0">
                        {item.calories} kcal
                      </span>
                    </div>
                    <span className="font-body-sm text-[11px] text-[#717971] block mt-0.5">
                      {item.servingSize}
                    </span>

                    {/* Macro pills */}
                    <div className="flex items-center gap-1.5 mt-2 font-label-engraved text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#316342]/10 text-[#316342] font-semibold">
                        P: {item.protein}g
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#874a00]/10 text-[#874a00] font-semibold">
                        C: {item.carbs}g
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#c84b31]/10 text-[#c84b31] font-semibold">
                        F: {item.fat}g
                      </span>
                    </div>
                  </div>

                  {/* Log button */}
                  <div className="mt-3 pt-2 border-t border-[#e0e2eb]/70 flex justify-end">
                    <button
                      onClick={() => handleLogItem(item)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-[#316342] hover:text-white text-[#191c22] font-label-gauge-readout text-[10px] font-bold shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">add</span>
                      Log to Folio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
