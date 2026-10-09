import React from 'react';
import { NOURISHDIA_EMBLEM_URL, USER_AVATAR_URL } from '../data/initialData';

export type ScreenTab = 'daily-log' | 'ai-lens-food-cam' | 'weekly-ledger' | 'pantry-and-goals';

interface HeaderProps {
  activeTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  displayDate: string;
  totalWaterMl: number;
  onOpenDatePicker?: () => void;
  onOpenCalibration?: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  displayDate,
  totalWaterMl,
  onOpenDatePicker,
  onOpenCalibration,
  onToggleChat,
  isChatOpen,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#e6e8f1]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e0e2eb]/60">
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Brand Emblem & Horological Identity */}
        <button
          onClick={() => onTabChange('daily-log')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="relative p-1 rounded-full bg-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_-1px_2px_rgba(0,0,0,0.15)_inset] transition-transform group-hover:scale-105">
            <img
              alt="NourishDial Emblem"
              className="h-8 w-auto object-contain"
              src={NOURISHDIA_EMBLEM_URL}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-md text-[22px] font-semibold text-[#874a00] tracking-tight">
                NourishDial
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#316342] shadow-[0_0_6px_#4a7c59] animate-pulse" />
            </div>
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase tracking-widest">
              Precision Nutrition &amp; Hydration Horology
            </span>
          </div>
        </button>

        {/* Tactile Master Deck Navigation Bar */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-[#e0e2eb] shadow-[inset_0px_2px_4px_rgba(15,17,21,0.25),inset_0px_1px_1px_rgba(15,17,21,0.15)]">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('daily-log')}
              className={`px-4 py-1.5 rounded-lg transition-all duration-150 font-body-sm text-[13px] cursor-pointer ${
                activeTab === 'daily-log'
                  ? 'bg-[#4a7c59] text-[#e1ffe5] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_2px_4px_rgba(15,17,21,0.18)] font-bold'
                  : 'text-[#414942] hover:bg-[#ecedf7] hover:text-[#191c22]'
              }`}
            >
              Daily Log
            </button>
            <button
              onClick={() => onTabChange('ai-lens-food-cam')}
              className={`px-4 py-1.5 rounded-lg transition-all duration-150 font-body-sm text-[13px] flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ai-lens-food-cam'
                  ? 'bg-[#4a7c59] text-[#e1ffe5] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_2px_4px_rgba(15,17,21,0.18)] font-bold'
                  : 'text-[#414942] hover:bg-[#ecedf7] hover:text-[#191c22]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
              AI Lens Food Cam
            </button>
            <button
              onClick={() => onTabChange('weekly-ledger')}
              className={`px-4 py-1.5 rounded-lg transition-all duration-150 font-body-sm text-[13px] cursor-pointer ${
                activeTab === 'weekly-ledger'
                  ? 'bg-[#4a7c59] text-[#e1ffe5] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_2px_4px_rgba(15,17,21,0.18)] font-bold'
                  : 'text-[#414942] hover:bg-[#ecedf7] hover:text-[#191c22]'
              }`}
            >
              Weekly Ledger
            </button>
            <button
              onClick={() => onTabChange('pantry-and-goals')}
              className={`px-4 py-1.5 rounded-lg transition-all duration-150 font-body-sm text-[13px] cursor-pointer ${
                activeTab === 'pantry-and-goals'
                  ? 'bg-[#4a7c59] text-[#e1ffe5] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_2px_4px_rgba(15,17,21,0.18)] font-bold'
                  : 'text-[#414942] hover:bg-[#ecedf7] hover:text-[#191c22]'
              }`}
            >
              Pantry &amp; Goals
            </button>
          </nav>
        </div>

        {/* Right Aux Chrono Indicators & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Chrono-Advisor AI Chat Toggle Button */}
          <button
            onClick={onToggleChat}
            title="Consult Chrono-Advisor Chatbot"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isChatOpen
                ? 'bg-[#316342] text-white border-[#316342] shadow-sm'
                : 'bg-[#ecedf7] hover:bg-[#e0e2eb] text-[#191c22] border-transparent shadow-[inset_0px_1px_2px_rgba(15,17,21,0.15)]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span className="font-label-engraved text-[11px] font-bold">Chrono-Advisor</span>
          </button>

          {/* Date Indicator Badge */}
          <button
            onClick={onOpenDatePicker}
            title="Calendar Folio Selection"
            className="hidden lg:flex items-center px-3 py-1.5 rounded-lg bg-[#ecedf7] shadow-[inset_0px_1px_2px_rgba(15,17,21,0.2)] hover:bg-[#e0e2eb] transition-colors cursor-pointer"
          >
            <span className="font-label-engraved text-[11px] text-[#a8600e] font-semibold">
              {displayDate}
            </span>
          </button>

          {/* Quick Water Cylinder Badge */}
          <button
            onClick={() => onTabChange('daily-log')}
            title="Aqueous Hydration Total"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#66b3fd]/20 text-[#0062a0] hover:bg-[#66b3fd]/30 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">water_drop</span>
            <span className="font-label-gauge-readout text-[12px] font-bold">
              {totalWaterMl.toLocaleString()} ml
            </span>
          </button>

          {/* User Chrono Profile */}
          <button
            onClick={onOpenCalibration}
            title="Horological Profile & Calibration"
            className="relative p-1 rounded-full bg-[#e0e2eb] shadow-[0px_1px_0px_rgba(255,255,255,0.9)_inset,0px_2px_5px_rgba(15,17,21,0.2)] hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src={USER_AVATAR_URL}
            />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-[#ecedf7] border-t border-[#e0e2eb] text-[11px] font-body-sm overflow-x-auto">
        <button
          onClick={() => onTabChange('daily-log')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'daily-log' ? 'bg-[#4a7c59] text-white font-bold' : 'text-[#414942]'
          }`}
        >
          Daily Log
        </button>
        <button
          onClick={() => onTabChange('ai-lens-food-cam')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'ai-lens-food-cam' ? 'bg-[#4a7c59] text-white font-bold' : 'text-[#414942]'
          }`}
        >
          AI Lens Cam
        </button>
        <button
          onClick={() => onTabChange('weekly-ledger')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'weekly-ledger' ? 'bg-[#4a7c59] text-white font-bold' : 'text-[#414942]'
          }`}
        >
          Weekly Ledger
        </button>
        <button
          onClick={() => onTabChange('pantry-and-goals')}
          className={`px-2.5 py-1 rounded ${
            activeTab === 'pantry-and-goals' ? 'bg-[#4a7c59] text-white font-bold' : 'text-[#414942]'
          }`}
        >
          Pantry & Goals
        </button>
      </div>
    </header>
  );
};
