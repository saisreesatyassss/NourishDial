import React, { useState, useRef, useEffect } from 'react';
import { LogEntry, UserGoals } from '../types/horology';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  parsedDish?: {
    title: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    description: string;
  } | null;
}

interface ChronoChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  currentCalories: number;
  goals: UserGoals;
  waterLoggedMl: number;
  recentEntries: LogEntry[];
  onCommitDishFromChat: (dish: LogEntry) => void;
}

export const ChronoChatbot: React.FC<ChronoChatbotProps> = ({
  isOpen,
  onToggle,
  currentCalories,
  goals,
  waterLoggedMl,
  recentEntries,
  onCommitDishFromChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content:
        'Greetings. I am your **NourishDial Chrono-Advisor**. Your Kinetic Energy Meter currently logs ' +
        currentCalories.toLocaleString() +
        ' kcal with approximately ' +
        Math.max(0, goals.targetCalories - currentCalories).toLocaleString() +
        ' kcal remaining in today\'s metabolic reserve.\n\nHow may I calibrate your nutrition or calculate dish timing today?',
      timestamp: 'NOW',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const remainingKcal = Math.max(0, goals.targetCalories - currentCalories);

  // Auto-scroll to bottom of messages thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Extract structured dish from markdown codeblocks if assistant suggests logging
  const extractDishData = (text: string) => {
    const match = text.match(/```json:log_dish\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const confirmedFoods = recentEntries.filter((e) => e.isConfirmed && !e.isWater);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          context: {
            currentCalories,
            targetCalories: goals.targetCalories,
            remainingCalories: remainingKcal,
            proteinLogged: confirmedFoods.reduce((s, e) => s + e.protein, 0),
            proteinTarget: goals.targetProteinG,
            carbsLogged: confirmedFoods.reduce((s, e) => s + e.carbs, 0),
            carbsTarget: goals.targetCarbsG,
            fatLogged: confirmedFoods.reduce((s, e) => s + e.fat, 0),
            fatTarget: goals.targetFatG,
            waterLoggedMl,
            waterTargetMl: goals.targetWaterMl,
            recentEntries: confirmedFoods.slice(0, 5).map((e) => e.title),
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.reply || 'Consultation processed.';
      const dish = extractDishData(replyText);

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parsedDish: dish,
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error: any) {
      const fallbackMsg: ChatMessage = {
        id: `model-err-${Date.now()}`,
        role: 'model',
        content:
          'Our chronometer connection experienced micro-latency. Based on your remaining ' +
          remainingKcal +
          ' kcal, consider a lean peptide and complex carb dinner (such as grilled salmon with wild quinoa) to harmonize your macro balance drums.',
        timestamp: 'NOW',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitExtractedDish = (dish: any) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newEntry: LogEntry = {
      id: `chat-dish-${Date.now()}`,
      time: timeStr,
      mealType: dish.mealType || 'SNACK',
      verificationTag: 'AI OPTIC LOGGED',
      title: dish.title || 'Logged from Chrono-Advisor',
      description: dish.description || 'Conversationally logged nutritional item',
      calories: Math.round(Number(dish.calories) || 0),
      protein: Math.round(Number(dish.protein) || 0),
      carbs: Math.round(Number(dish.carbs) || 0),
      fat: Math.round(Number(dish.fat) || 0),
      isConfirmed: true,
    };

    onCommitDishFromChat(newEntry);
  };

  // Render markdown with nice clean styling
  const renderMessageContent = (content: string) => {
    // Strip json codeblock from direct text presentation so we can show it as an interactive card instead
    const cleaned = content.replace(/```json:log_dish[\s\S]*?```/g, '').trim();

    return (
      <div className="space-y-2 text-xs leading-relaxed text-[#191c22]">
        {cleaned.split('\n\n').map((paragraph, pIdx) => {
          if (paragraph.startsWith('•') || paragraph.startsWith('-')) {
            const listItems = paragraph.split('\n');
            return (
              <ul key={pIdx} className="space-y-1 my-1 pl-1">
                {listItems.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1.5">
                    <span className="text-[#316342] font-bold">▪</span>
                    <span dangerouslySetInnerHTML={{ __html: formatInline(item.replace(/^[•\-]\s*/, '')) }} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={pIdx} dangerouslySetInnerHTML={{ __html: formatInline(paragraph) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <>
      {/* Floating Horological Chrono Button (Always Visible) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={onToggle}
          title="Open Chrono-Advisor Chatbot"
          className="relative group p-3.5 rounded-full bg-gradient-to-br from-[#dfc8a2] via-[#b38f56] to-[#6d4f23] text-white shadow-[0px_8px_20px_rgba(0,0,0,0.3),inset_0px_1px_1px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[#ffdcc1]/50"
        >
          {/* Inner Enamel Center */}
          <div className="w-10 h-10 rounded-full bg-[#1e242b] flex items-center justify-center shadow-inner relative">
            <span className="material-symbols-outlined text-[#b9efc5] text-2xl group-hover:rotate-12 transition-transform">
              smart_toy
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#316342] shadow-[0_0_6px_#316342] animate-pulse" />
          </div>

          {!isOpen && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white font-label-engraved text-[9px] font-bold border border-white">
              AI
            </span>
          )}
        </button>
      </div>

      {/* Floating Expandable Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[92vw] sm:w-[420px] max-h-[82vh] h-[640px] z-50 flex flex-col rounded-2xl bg-[#f2f3fd] border border-[#e0e2eb] shadow-[0px_24px_48px_rgba(15,17,21,0.25),0px_1px_0px_rgba(255,255,255,0.9)_inset] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Brass Screws Header Accents */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#b38f56] flex items-center justify-center">
            <span className="block w-1.5 h-0.5 bg-[#4a3617] rotate-45" />
          </div>
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#b38f56] flex items-center justify-center">
            <span className="block w-1.5 h-0.5 bg-[#4a3617] -rotate-45" />
          </div>

          {/* Panel Header */}
          <div className="px-5 pt-4 pb-3 bg-gradient-to-r from-[#e6e8f1] via-[#ecedf7] to-[#e6e8f1] border-b border-[#e0e2eb] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1e242b] flex items-center justify-center text-[#9dd3aa] shadow-inner">
                <span className="material-symbols-outlined text-base">psychology</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-headline-md text-sm font-bold text-[#191c22]">
                    Chrono-Advisor
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-[#316342]/10 text-[#316342] font-label-engraved text-[9px] font-bold">
                    GEMINI 3.8 FLASH
                  </span>
                </div>
                <span className="font-label-engraved text-[9px] text-[#414942] uppercase tracking-wider block">
                  HORO-CONSULTANT • NUTRITION ESCROW
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      role: 'model',
                      content: 'Thread cleared. Metabolic escrow initialized. How may I assist?',
                      timestamp: 'NOW',
                    },
                  ])
                }
                title="Clear Thread"
                className="p-1 rounded hover:bg-[#e0e2eb] text-[#717971] transition-colors cursor-pointer text-xs"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
              </button>
              <button
                onClick={onToggle}
                className="p-1 rounded hover:bg-[#e0e2eb] text-[#717971] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          {/* Live Chronometer Status Ribbon */}
          <div className="px-4 py-1.5 bg-[#ecedf7] border-b border-[#e0e2eb]/60 flex items-center justify-between font-label-engraved text-[10px] text-[#414942]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#316342]" />
              Rem: <strong className="text-[#316342]">{remainingKcal} kcal</strong>
            </span>
            <span>•</span>
            <span>
              Target: <strong className="text-[#874a00]">{goals.targetCalories} kcal</strong>
            </span>
            <span>•</span>
            <span>
              Water: <strong className="text-[#0062a0]">{waterLoggedMl} mL</strong>
            </span>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f9f9ff]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="font-label-engraved text-[9px] text-[#717971]">
                    {msg.role === 'user' ? 'YOU' : 'CHRONO-HOROLOGIST'}
                  </span>
                  <span className="text-[8px] text-[#c1c9bf]">({msg.timestamp})</span>
                </div>

                <div
                  className={`p-3 rounded-xl max-w-[88%] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#316342] text-white rounded-tr-none'
                      : 'bg-white border border-[#e0e2eb] text-[#191c22] rounded-tl-none shadow-[inset_0px_1px_0px_rgba(255,255,255,0.9)]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                  ) : (
                    renderMessageContent(msg.content)
                  )}

                  {/* Render Parsed Log Dish Action Card if available */}
                  {msg.parsedDish && (
                    <div className="mt-3 p-2.5 rounded-lg bg-[#ecedf7] border border-[#316342]/30 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-md text-xs font-bold text-[#191c22]">
                          {msg.parsedDish.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#316342] text-white font-label-gauge-readout text-[10px] font-bold">
                          {msg.parsedDish.calories} kcal
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-label-engraved text-[10px] text-[#414942]">
                        <span>P: {msg.parsedDish.protein}g</span>
                        <span>•</span>
                        <span>C: {msg.parsedDish.carbs}g</span>
                        <span>•</span>
                        <span>F: {msg.parsedDish.fat}g</span>
                      </div>
                      <button
                        onClick={() => handleCommitExtractedDish(msg.parsedDish)}
                        className="w-full py-1.5 rounded bg-gradient-to-b from-[#3d7a52] to-[#254b32] text-white font-label-gauge-readout text-[10px] uppercase font-bold shadow hover:brightness-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xs">add_circle</span>
                        Commit to Folio Timeline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-[#e0e2eb] rounded-xl rounded-tl-none max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-[#316342] animate-ping" />
                <span className="font-label-engraved text-[11px] text-[#414942]">
                  Computing metabolic triangulation...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-3 py-1.5 bg-[#ecedf7] border-t border-[#e0e2eb]/70 flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => handleSend('What should I eat for dinner with my remaining macros?')}
              className="px-2 py-1 rounded-full bg-white border border-[#c1c9bf] text-[#414942] hover:bg-[#316342] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              🍽 Dinner recommendation?
            </button>
            <button
              onClick={() => handleSend('Log 2 hard-boiled eggs and an avocado')}
              className="px-2 py-1 rounded-full bg-white border border-[#c1c9bf] text-[#414942] hover:bg-[#316342] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              🥚 Log 2 eggs &amp; avocado
            </button>
            <button
              onClick={() => handleSend('How is my hydration pacing today?')}
              className="px-2 py-1 rounded-full bg-white border border-[#c1c9bf] text-[#414942] hover:bg-[#0062a0] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              💧 Hydration pacing?
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#e0e2eb] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask horologist or say 'Log 2 scrambled eggs'..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#f2f3fd] border border-[#c1c9bf] text-xs font-body-sm text-[#191c22] focus:outline-none focus:ring-2 focus:ring-[#316342]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-b from-[#3d7a52] via-[#316342] to-[#254b32] text-white shadow hover:brightness-105 active:translate-y-0.5 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
