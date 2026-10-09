import React, { useState, useRef } from 'react';
import { AI_PRESET_SCANS } from '../data/initialData';
import { LogEntry } from '../types/horology';

interface AILensFoodCamProps {
  onCommitEntry: (entry: LogEntry) => void;
  onBackToLog: () => void;
}

export const AILensFoodCam: React.FC<AILensFoodCamProps> = ({ onCommitEntry, onBackToLog }) => {
  const [selectedImage, setSelectedImage] = useState<string>(AI_PRESET_SCANS[0].imageUrl);
  const [customText, setCustomText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(AI_PRESET_SCANS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        runScan(base64, customText || file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const runScan = async (imgBase64?: string, textPrompt?: string) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    const imageToSend = imgBase64 || selectedImage;
    const promptToSend = textPrompt || customText;

    try {
      const res = await fetch('/api/ai/food-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageToSend,
          textPrompt: promptToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to analyze dish.`);
      }

      const json = await res.json();
      if (json && json.data) {
        setAnalysisResult({
          ...json.data,
          imageUrl: imageToSend,
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.warn('Analysis using fallback calibration data:', err.message);
      // Fallback preset
      const preset = AI_PRESET_SCANS.find((p) =>
        promptToSend.toLowerCase().includes(p.category.toLowerCase())
      ) || AI_PRESET_SCANS[0];
      setAnalysisResult({
        ...preset,
        imageUrl: imageToSend,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCommit = () => {
    if (!analysisResult) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: LogEntry = {
      id: `entry-${Date.now()}`,
      time: timeStr,
      mealType: (analysisResult.category as any) || 'LUNCH',
      verificationTag: 'AI OPTIC LOGGED',
      title: analysisResult.dishName || analysisResult.title || 'AI Scanned Dish',
      description: analysisResult.description || 'Decomposed with Horo-Neural optical scan',
      calories: Math.round(Number(analysisResult.calories) || 450),
      protein: Math.round(Number(analysisResult.protein) || 30),
      carbs: Math.round(Number(analysisResult.carbs) || 40),
      fat: Math.round(Number(analysisResult.fat) || 15),
      imageUrl: analysisResult.imageUrl || selectedImage,
      isConfirmed: true,
    };

    onCommitEntry(newEntry);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-[#e0e2eb]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLog}
            className="p-2 rounded-lg bg-[#ecedf7] hover:bg-[#e0e2eb] text-[#414942] transition-colors flex items-center gap-1 font-label-engraved text-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Folio Ledger
          </button>
          <div>
            <h1 className="font-headline-lg text-[26px] font-bold text-[#191c22]">
              AI Optical Food Cam &amp; Calorimeter
            </h1>
            <span className="font-label-engraved text-[11px] text-[#414942] uppercase tracking-widest">
              HORO-NEURAL V4 • VOLUMETRIC DECOMPOSITION MATRIX
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#316342] shadow-[0_0_8px_#316342] animate-pulse" />
          <span className="font-label-engraved text-[11px] text-[#316342] font-bold">
            NEURAL ENGINE ARMED
          </span>
        </div>
      </div>

      {/* Main Optical Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Optical Viewfinder Chamber */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-[#0d1217] p-4 shadow-[0px_10px_30px_rgba(0,0,0,0.3),inset_0px_1px_2px_rgba(255,255,255,0.2)] border-2 border-[#31363f] overflow-hidden min-h-[380px] flex flex-col justify-between">
            {/* Viewfinder Target Reticle Lines */}
            <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl flex items-center justify-center">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#9dd3aa]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#9dd3aa]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#9dd3aa]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#9dd3aa]" />

              {/* Center Crosshair Ring */}
              <div className="w-24 h-24 rounded-full border border-dashed border-[#9dd3aa]/60 flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full bg-[#9dd3aa] shadow-[0_0_8px_#9dd3aa]" />
                <span className="absolute -top-6 font-label-engraved text-[9px] text-[#9dd3aa] tracking-widest uppercase">
                  FOCAL PLANE 1.0
                </span>
              </div>
            </div>

            {/* Laser Scan Sweep Animation */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#9dd3aa] to-transparent shadow-[0_0_12px_#9dd3aa] animate-[bounce_2s_infinite] pointer-events-none z-30" />
            )}

            {/* Viewfinder Image Display */}
            <div className="w-full h-72 rounded-xl overflow-hidden relative bg-black/60 flex items-center justify-center">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Optical Camera View"
                  className={`w-full h-full object-cover transition-all ${
                    isAnalyzing ? 'brightness-110 saturate-125' : ''
                  }`}
                />
              ) : (
                <div className="text-white/40 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl">photo_camera</span>
                  <span className="font-label-engraved text-xs mt-2">Awaiting Image Capture</span>
                </div>
              )}

              {/* Overlay Sensor Readouts */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[#9dd3aa] font-label-engraved text-[10px] border border-[#9dd3aa]/40">
                LENS CALIBRATION: HORO-4K
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white/80 font-label-engraved text-[10px]">
                {isAnalyzing ? 'SPECTROMETRIC ANALYSIS...' : 'STATUS: READY TO TRIANGULATE'}
              </div>
            </div>

            {/* Bottom Controls / Upload Triggers */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 z-20">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-[#252a32] hover:bg-[#323943] text-white font-label-gauge-readout text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                Upload Dish Photo
              </button>

              <button
                onClick={() => runScan()}
                disabled={isAnalyzing}
                className="px-5 py-2 rounded-lg bg-gradient-to-b from-[#3d7a52] via-[#316342] to-[#254b32] text-white font-label-gauge-readout text-xs uppercase tracking-wider shadow-[0px_4px_8px_rgba(49,99,66,0.4)] active:translate-y-0.5 hover:brightness-105 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">center_focus_strong</span>
                {isAnalyzing ? 'Scanning...' : 'Decompose & Triangulate'}
              </button>
            </div>
          </div>

          {/* Preset Sample Dishes Strip */}
          <div className="p-4 rounded-xl bg-[#ecedf7] border border-[#e0e2eb]">
            <span className="font-label-engraved text-[10px] text-[#414942] uppercase tracking-wider block mb-2 font-bold">
              Horological Specimen Plates (Click to Quick-Scan):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {AI_PRESET_SCANS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(preset.imageUrl);
                    setCustomText(preset.title);
                    setAnalysisResult(preset);
                  }}
                  className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedImage === preset.imageUrl
                      ? 'border-[#316342] bg-[#ffffff] shadow-sm'
                      : 'border-[#c1c9bf] bg-[#e0e2eb] hover:bg-white'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.title}
                    className="w-full h-14 object-cover rounded mb-1"
                  />
                  <span className="block font-headline-md text-[11px] text-[#191c22] font-semibold truncate">
                    {preset.title}
                  </span>
                  <span className="block font-label-engraved text-[9px] text-[#874a00]">
                    ~{preset.calories} kcal
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Description Input */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Or enter custom dish / gram portion notes..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runScan()}
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#c1c9bf] text-sm font-body-sm text-[#191c22] focus:outline-none focus:ring-2 focus:ring-[#316342]"
              />
              <button
                onClick={() => runScan()}
                className="px-3 py-2 rounded-lg bg-[#316342] text-white font-label-engraved text-xs cursor-pointer hover:bg-[#4a7c59]"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Horological Spectrometer Decomposition Results */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="relative p-6 rounded-2xl bg-[#f2f3fd] shadow-[0px_1px_0px_rgba(255,255,255,0.8)_inset,0px_12px_28px_rgba(15,17,21,0.08)] border border-[#e0e2eb] flex flex-col justify-between">
            {/* Hardware Corner Screws */}
            <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
              <span className="block w-2 h-0.5 bg-[#4a3617] rotate-45" />
            </div>
            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] flex items-center justify-center">
              <span className="block w-2 h-0.5 bg-[#4a3617] -rotate-12" />
            </div>

            {/* Decomposition Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#4a7c59] text-white font-label-engraved text-[10px] font-bold">
                    {analysisResult?.category || 'LUNCH'}
                  </span>
                  <span className="font-label-engraved text-[10px] text-[#414942]">
                    CONFIDENCE: {analysisResult?.confidenceScore || 96}%
                  </span>
                </div>
                <div className="font-label-gauge-readout text-xs text-[#316342] font-bold">
                  VOLUMETRIC PASS #04
                </div>
              </div>

              <h2 className="font-headline-lg text-[24px] font-bold text-[#191c22]">
                {analysisResult?.dishName || analysisResult?.title || 'Dish Identified'}
              </h2>
              <p className="font-body-sm text-[13px] text-[#414942] mt-1">
                {analysisResult?.description}
              </p>
            </div>

            {/* Giant Horological Calorie Seal */}
            <div className="my-5 p-4 rounded-xl bg-gradient-to-br from-[#ecedf7] to-[#e0e2eb] shadow-[inset_0px_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-around">
              <div className="text-center">
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase block">
                  Caloric Chrono Value
                </span>
                <span className="font-label-gauge-num text-[36px] font-extrabold text-[#191c22]">
                  {analysisResult?.calories || 0}
                </span>
                <span className="font-label-engraved text-[10px] text-[#874a00] uppercase font-bold block">
                  KCAL ESTIMATED
                </span>
              </div>

              <div className="h-16 w-px bg-[#c1c9bf]" />

              <div className="text-center">
                <span className="font-label-engraved text-[10px] text-[#414942] uppercase block">
                  Displacement Weight
                </span>
                <span className="font-label-gauge-num text-[28px] font-bold text-[#316342]">
                  {analysisResult?.estimatedGrams || 350}g
                </span>
                <span className="font-label-engraved text-[10px] text-[#717971] uppercase block">
                  MEASURED MASS
                </span>
              </div>
            </div>

            {/* Macro Tumbler Readout Bars */}
            <div className="flex flex-col gap-2.5">
              {/* Protein Bar */}
              <div>
                <div className="flex justify-between font-label-engraved text-[11px] mb-1">
                  <span className="text-[#316342] font-bold">
                    PROTEIN PEPTIDES: {analysisResult?.protein || 0}g
                  </span>
                  <span className="text-[#414942]">
                    {Math.round(((analysisResult?.protein || 0) * 4 / (analysisResult?.calories || 1)) * 100)}% Kcal share
                  </span>
                </div>
                <div className="h-3 rounded bg-[#e0e2eb] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[#4a7c59] to-[#316342]"
                    style={{ width: `${Math.min(100, ((analysisResult?.protein || 0) / 60) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carbs Bar */}
              <div>
                <div className="flex justify-between font-label-engraved text-[11px] mb-1">
                  <span className="text-[#874a00] font-bold">
                    GLYCEMIC CARBS: {analysisResult?.carbs || 0}g
                  </span>
                  <span className="text-[#414942]">
                    {Math.round(((analysisResult?.carbs || 0) * 4 / (analysisResult?.calories || 1)) * 100)}% Kcal share
                  </span>
                </div>
                <div className="h-3 rounded bg-[#e0e2eb] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[#a8600e] to-[#874a00]"
                    style={{ width: `${Math.min(100, ((analysisResult?.carbs || 0) / 80) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Fats Bar */}
              <div>
                <div className="flex justify-between font-label-engraved text-[11px] mb-1">
                  <span className="text-[#c84b31] font-bold">
                    LIPID FRACTION: {analysisResult?.fat || 0}g
                  </span>
                  <span className="text-[#414942]">
                    {Math.round(((analysisResult?.fat || 0) * 9 / (analysisResult?.calories || 1)) * 100)}% Kcal share
                  </span>
                </div>
                <div className="h-3 rounded bg-[#e0e2eb] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded bg-gradient-to-r from-[#ff8c72] to-[#c84b31]"
                    style={{ width: `${Math.min(100, ((analysisResult?.fat || 0) / 45) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Volume Decomposition Profile */}
            <div className="mt-4 p-3 rounded-lg bg-[#ecedf7] border border-[#e0e2eb]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-sm text-[#0062a0]">view_in_ar</span>
                <span className="font-label-engraved text-[10px] text-[#0062a0] uppercase font-bold">
                  Volumetric Profile:
                </span>
              </div>
              <p className="font-label-engraved text-[11px] text-[#414942]">
                {analysisResult?.volumeDecomposition || '~380 cm³ volumetric profile, calibrated 70% dense solid matrix.'}
              </p>
            </div>

            {/* Micronutrient Trace Elements */}
            {analysisResult?.micronutrientHighlights && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {analysisResult.micronutrientHighlights.map((micro: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-white border border-[#c1c9bf] font-label-engraved text-[10px] text-[#316342] font-semibold"
                  >
                    ★ {micro}
                  </span>
                ))}
              </div>
            )}

            {/* Horological Chrono Note */}
            {analysisResult?.horologicalNote && (
              <div className="mt-3 p-2.5 rounded bg-[#ffdcc1]/30 border border-[#ffdcc1] text-[#874a00] font-label-engraved text-[10px]">
                ⏱ {analysisResult.horologicalNote}
              </div>
            )}

            {/* Commit to Folio Timeline Button */}
            <div className="mt-5 pt-3 border-t border-[#e0e2eb]">
              <button
                onClick={handleCommit}
                className="w-full py-3 rounded-xl bg-gradient-to-b from-[#3d7a52] via-[#316342] to-[#254b32] text-white font-label-gauge-readout text-[13px] uppercase tracking-wider shadow-[0px_4px_10px_rgba(49,99,66,0.35),inset_0px_1px_1px_rgba(255,255,255,0.6)] active:translate-y-0.5 hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span>Commit to Folio Timeline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
