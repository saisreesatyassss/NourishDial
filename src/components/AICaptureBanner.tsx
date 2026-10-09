import React from 'react';

interface AICaptureBannerProps {
  onActivateLens: () => void;
}

export const AICaptureBanner: React.FC<AICaptureBannerProps> = ({ onActivateLens }) => {
  return (
    <div className="relative w-full rounded-xl p-4 bg-gradient-to-r from-[#e6e8f1] via-[#ecedf7] to-[#e6e8f1] shadow-[0px_2px_6px_rgba(0,0,0,0.06),0px_1px_0px_rgba(255,255,255,0.9)_inset] flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden border border-[#e0e2eb]">
      {/* Camera Viewfinder Grid Watermark Decor */}
      <div className="absolute inset-y-0 right-1/4 w-48 opacity-10 pointer-events-none flex items-center justify-center">
        <div className="w-36 h-36 border border-[#191c22] rounded-lg relative flex items-center justify-center">
          <div className="w-8 h-8 border border-[#316342]" />
          <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#191c22]" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#191c22]" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#191c22]" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#191c22]" />
        </div>
      </div>

      {/* Banner Content */}
      <div className="flex items-center gap-4 z-10">
        {/* Lens Turret Shutter Icon */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2f323a] to-[#16181d] p-1 shadow-[0px_4px_8px_rgba(0,0,0,0.3),inset_0px_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center flex-shrink-0">
          <div className="w-full h-full rounded-full bg-[#121418] flex items-center justify-center relative shadow-[inset_0px_2px_4px_rgba(0,0,0,0.8)]">
            <span className="material-symbols-outlined text-[#9dd3aa] text-2xl">photo_camera</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#316342] shadow-[0px_0px_6px_#316342] animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-[20px] font-semibold text-[#191c22] tracking-tight">
              AI Optical Food Cam &amp; Calorimeter
            </span>
            <span className="px-2 py-0.5 rounded bg-[#316342]/10 text-[#316342] font-label-engraved text-[10px] font-bold">
              HORO-NEURAL V4
            </span>
          </div>
          <p className="font-body-sm text-[13px] text-[#414942] max-w-2xl mt-0.5">
            Point lens at dish or beverage for instant volume decomposition, nutrient triangulation, and immediate timeline posting.
          </p>
        </div>
      </div>

      {/* Launch Button */}
      <div className="flex items-center gap-3 z-10 w-full md:w-auto justify-end">
        <button
          onClick={onActivateLens}
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-b from-[#3d7a52] via-[#316342] to-[#254b32] text-white font-label-gauge-readout text-[12px] uppercase tracking-wider shadow-[0px_4px_8px_rgba(49,99,66,0.35),inset_0px_1px_1px_rgba(255,255,255,0.6),inset_0px_-2px_3px_rgba(0,0,0,0.3)] active:translate-y-0.5 active:shadow-[inset_0px_2px_4px_rgba(0,0,0,0.4)] hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-lg">center_focus_strong</span>
          <span>Activate AI Lens</span>
        </button>
      </div>
    </div>
  );
};
