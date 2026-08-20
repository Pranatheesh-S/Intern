import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function ProfessorBuddy({ 
  message, 
  state = 'welcome', 
  onSpeechToggle,
  isSpeechActive = false
}) {
  const [blinking, setBlinking] = useState(false);
  const [talking, setTalking] = useState(false);

  // Blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Handle Speech Narration
  const handleNarrate = () => {
    if (talking) {
      sounds.stopSpeech();
      setTalking(false);
    } else {
      setTalking(true);
      sounds.speak(message);
      // Roughly calculate speech duration based on word count
      const duration = (message.split(' ').length / 2.5) * 1000;
      setTimeout(() => setTalking(false), duration);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-end gap-4 pointer-events-none max-w-lg select-none">
      {/* Cartoon Professor Avatar */}
      <div className="pointer-events-auto relative group cursor-pointer" onClick={handleNarrate}>
        {/* Glow backdrop */}
        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 rounded-full blur-md opacity-60 group-hover:opacity-90 transition duration-300 animate-pulse" />

        {/* Avatar Card */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 bg-gradient-to-b from-sky-100 to-teal-50 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 transform group-hover:scale-105">
          {/* Scientific Lab Coat & Head SVG graphic */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="#e0f2fe" />
            
            {/* Hair */}
            <path d="M 25 40 Q 20 20 40 18 Q 50 10 60 18 Q 80 20 75 40 Z" fill="#475569" />
            <circle cx="30" cy="25" r="8" fill="#64748b" />
            <circle cx="70" cy="25" r="8" fill="#64748b" />

            {/* Face */}
            <circle cx="50" cy="46" r="22" fill="#fed7aa" />

            {/* Glasses */}
            <circle cx="41" cy="44" r="8" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <circle cx="59" cy="44" r="8" fill="none" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="49" y1="44" x2="51" y2="44" stroke="#0f172a" strokeWidth="2.5" />

            {/* Eyes */}
            {!blinking ? (
              <>
                <circle cx="41" cy="44" r="3" fill="#0284c7" />
                <circle cx="59" cy="44" r="3" fill="#0284c7" />
                <circle cx="42" cy="43" r="1" fill="#ffffff" />
                <circle cx="60" cy="43" r="1" fill="#ffffff" />
              </>
            ) : (
              <>
                <line x1="38" y1="44" x2="44" y2="44" stroke="#0f172a" strokeWidth="2" />
                <line x1="56" y1="44" x2="62" y2="44" stroke="#0f172a" strokeWidth="2" />
              </>
            )}

            {/* Rosy Cheeks */}
            <circle cx="34" cy="50" r="3.5" fill="#f87171" opacity="0.6" />
            <circle cx="66" cy="50" r="3.5" fill="#f87171" opacity="0.6" />

            {/* Smile / Mouth */}
            {talking ? (
              <path d="M 43 54 Q 50 62 57 54 Z" fill="#ef4444" />
            ) : state === 'celebrate' || state === 'correct' ? (
              <path d="M 40 52 Q 50 64 60 52" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            ) : state === 'wrong' ? (
              <path d="M 43 57 Q 50 52 57 57" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            ) : (
              <path d="M 42 53 Q 50 60 58 53" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
            )}

            {/* Lab Coat */}
            <path d="M 22 75 Q 50 65 78 75 L 85 100 L 15 100 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
            {/* Tie / Badge */}
            <path d="M 47 68 L 53 68 L 51 82 L 49 82 Z" fill="#0284c7" />
            <circle cx="34" cy="78" r="3" fill="#fbbf24" />
          </svg>

          {/* Badge icon */}
          <div className="absolute top-1 right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          </div>
        </div>

        {/* Character Badge Name Tag */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/40 shadow-lg whitespace-nowrap">
          Prof. Buddy 🔬
        </div>
      </div>

      {/* Speech Bubble Card */}
      <div className="pointer-events-auto relative flex-1 bg-slate-900/85 backdrop-blur-xl border border-emerald-500/30 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in">
        {/* Tail indicator pointing to Prof */}
        <div className="absolute left-[-8px] bottom-6 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-slate-900/90 border-b-8 border-b-transparent" />

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Science Guide</span>
            </div>
            <p className="text-sm md:text-base text-slate-100 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          {/* Narration voice toggle */}
          <button
            onClick={handleNarrate}
            className={`p-2 rounded-xl border transition-all ${
              talking
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 animate-pulse'
                : 'bg-slate-800 text-emerald-400 border-emerald-500/30 hover:bg-slate-700'
            }`}
            title={talking ? "Stop Narration" : "Read aloud"}
          >
            {talking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
