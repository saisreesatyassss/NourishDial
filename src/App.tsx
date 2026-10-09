/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ScreenTab } from './components/Header';
import { KineticEnergyMeter } from './components/KineticEnergyMeter';
import { HydrationCylinder } from './components/HydrationCylinder';
import { AICaptureBanner } from './components/AICaptureBanner';
import { NutritionalLedger } from './components/NutritionalLedger';
import { AILensFoodCam } from './components/AILensFoodCam';
import { WeeklyLedger } from './components/WeeklyLedger';
import { PantryGoals } from './components/PantryGoals';
import { AddDishModal } from './components/AddDishModal';
import { CalibrationModal } from './components/CalibrationModal';
import { ChronoChatbot } from './components/ChronoChatbot';
import { INITIAL_DAY_RECORD, INITIAL_GOALS } from './data/initialData';
import { LogEntry, UserGoals } from './types/horology';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('daily-log');
  const [goals, setGoals] = useState<UserGoals>(INITIAL_GOALS);
  const [entries, setEntries] = useState<LogEntry[]>(INITIAL_DAY_RECORD.entries);
  const [waterLoggedMl, setWaterLoggedMl] = useState<number>(INITIAL_DAY_RECORD.waterLoggedMl);
  const [displayDate, setDisplayDate] = useState<string>(INITIAL_DAY_RECORD.displayDate);

  // Modal states
  const [isAddDishOpen, setIsAddDishOpen] = useState<boolean>(false);
  const [addDishMealType, setAddDishMealType] = useState<string>('DINNER');
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Compute live nutritional tallies from confirmed items (excluding pure water)
  const confirmedFoodEntries = entries.filter((e) => e.isConfirmed && !e.isWater);
  const totalCalories = confirmedFoodEntries.reduce((sum, e) => sum + e.calories, 0);
  const totalProtein = confirmedFoodEntries.reduce((sum, e) => sum + e.protein, 0);
  const totalCarbs = confirmedFoodEntries.reduce((sum, e) => sum + e.carbs, 0);
  const totalFat = confirmedFoodEntries.reduce((sum, e) => sum + e.fat, 0);

  // Water dosing handler
  const handleDoseWater = (amountMl: number) => {
    setWaterLoggedMl((prev) => prev + amountMl);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const waterEntry: LogEntry = {
      id: `water-${Date.now()}`,
      time: timeStr,
      mealType: 'HYDRATION',
      verificationTag: 'MANUAL VERIFIED',
      title:
        amountMl === 100
          ? 'Hydration Sip — Chilled Mineral Infusion'
          : amountMl === 250
          ? 'Glass Dosing — Fresh Spring Water'
          : 'Flask Refuel — Electrolyte Spring Water',
      description: `Tactile stamp-key dosed +${amountMl} mL to borosilicate reservoir`,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      isWater: true,
      waterAmountMl: amountMl,
      isConfirmed: true,
    };

    setEntries((prev) => [waterEntry, ...prev]);
  };

  // Add dish handler
  const handleAddEntry = (entry: LogEntry) => {
    // If replacing an unconfirmed entry of the same meal type, remove or replace it
    setEntries((prev) => {
      const filtered = prev.filter(
        (e) => !(e.mealType === entry.mealType && !e.isConfirmed)
      );
      return [...filtered, entry];
    });
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    const entryToDelete = entries.find((e) => e.id === id);
    if (entryToDelete?.isWater && entryToDelete.waterAmountMl) {
      setWaterLoggedMl((prev) => Math.max(0, prev - entryToDelete.waterAmountMl!));
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  // Commit from AI Lens Food Cam
  const handleCommitFromAILens = (entry: LogEntry) => {
    handleAddEntry(entry);
    setActiveTab('daily-log');
  };

  // Quick log from Pantry
  const handleQuickLogPantryItem = (entry: LogEntry) => {
    handleAddEntry(entry);
  };

  // Reset to default
  const handleResetData = () => {
    setEntries(INITIAL_DAY_RECORD.entries);
    setWaterLoggedMl(INITIAL_DAY_RECORD.waterLoggedMl);
    setGoals(INITIAL_GOALS);
    setIsCalibrationOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#191c22] flex flex-col justify-between selection:bg-[#4a7c59] selection:text-[#e1ffe5]">
      {/* Horological Fixed Master Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        displayDate={displayDate}
        totalWaterMl={waterLoggedMl}
        onOpenDatePicker={() => setIsCalibrationOpen(true)}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Horological Stage */}
      <main className="w-full pt-20 md:pt-24 pb-12 bg-[#f9f9ff] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* SCREEN 1: DAILY LOG (Console & Folio Ledger) */}
          {activeTab === 'daily-log' && (
            <div className="flex flex-col w-full gap-8">
              {/* Top Hardware Deck: Instrumentation Console */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Cols: Calorie Chronometer & Macro Tumblers */}
                <div className="lg:col-span-7">
                  <KineticEnergyMeter
                    consumedCalories={totalCalories}
                    targetCalories={goals.targetCalories}
                    proteinG={totalProtein}
                    targetProteinG={goals.targetProteinG}
                    carbsG={totalCarbs}
                    targetCarbsG={goals.targetCarbsG}
                    fatG={totalFat}
                    targetFatG={goals.targetFatG}
                    onEditTarget={() => setIsCalibrationOpen(true)}
                  />
                </div>

                {/* Right 5 Cols: Apothecary Hydration Sight Glass & Tactile Pump Keys */}
                <div className="lg:col-span-5">
                  <HydrationCylinder
                    waterLoggedMl={waterLoggedMl}
                    waterTargetMl={goals.targetWaterMl}
                    streakDays={goals.streakDays}
                    onDoseWater={handleDoseWater}
                    onResetOrCustom={() => setIsCalibrationOpen(true)}
                  />
                </div>
              </div>

              {/* Quick AI Capture Banner: Viewfinder Scanner Console */}
              <AICaptureBanner
                onActivateLens={() => setActiveTab('ai-lens-food-cam')}
              />

              {/* Today's Meal Timeline / Parchment Horological Ledger */}
              <NutritionalLedger
                entries={entries}
                onAddDish={(mealType) => {
                  if (mealType) setAddDishMealType(mealType);
                  setIsAddDishOpen(true);
                }}
                onDeleteEntry={handleDeleteEntry}
                onOpenCalibration={() => setIsCalibrationOpen(true)}
                onSelectEntryDetails={() => setActiveTab('ai-lens-food-cam')}
              />
            </div>
          )}

          {/* SCREEN 2: AI LENS FOOD CAM & CALORIMETER */}
          {activeTab === 'ai-lens-food-cam' && (
            <AILensFoodCam
              onCommitEntry={handleCommitFromAILens}
              onBackToLog={() => setActiveTab('daily-log')}
            />
          )}

          {/* SCREEN 3: WEEKLY LEDGER */}
          {activeTab === 'weekly-ledger' && (
            <WeeklyLedger
              currentDayCalories={totalCalories}
              currentDayWater={waterLoggedMl}
              targetCalories={goals.targetCalories}
              targetWater={goals.targetWaterMl}
            />
          )}

          {/* SCREEN 4: PANTRY & GOALS */}
          {activeTab === 'pantry-and-goals' && (
            <PantryGoals
              goals={goals}
              onUpdateGoals={setGoals}
              onQuickLogPantryItem={handleQuickLogPantryItem}
            />
          )}
        </div>
      </main>

      {/* Auxiliary Modals */}
      <AddDishModal
        isOpen={isAddDishOpen}
        onClose={() => setIsAddDishOpen(false)}
        onAddEntry={handleAddEntry}
        defaultMealType={addDishMealType}
      />

      <CalibrationModal
        isOpen={isCalibrationOpen}
        onClose={() => setIsCalibrationOpen(false)}
        goals={goals}
        onSaveGoals={setGoals}
        onResetData={handleResetData}
      />

      {/* Horological Chrono-Advisor Chatbot */}
      <ChronoChatbot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        currentCalories={totalCalories}
        goals={goals}
        waterLoggedMl={waterLoggedMl}
        recentEntries={entries}
        onCommitDishFromChat={(dish) => {
          handleAddEntry(dish);
        }}
      />

      {/* Master Horological Footer */}
      <footer className="w-full bg-[#f2f3fd] py-8 border-t border-[#e0e2eb]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#414942]">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-base font-bold text-[#191c22]">
              NourishDial
            </span>
            <span className="font-label-engraved text-xs">— MK IV CHRONOGRAPH</span>
          </div>
          <div className="font-label-engraved text-xs text-center sm:text-right text-[#717971]">
            © 2024 NourishDial Chrono-Labs. Calibrated under ISO-8601 Horological Standards.
          </div>
        </div>
      </footer>
    </div>
  );
}
