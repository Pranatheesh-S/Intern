import React, { useState } from 'react';
import { X, Sparkles, Volume2, CheckCircle, Lightbulb, BookmarkCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function DiscoveryPopup({ 
  organism, 
  onClose, 
  onCollect, 
  isCollected 
}) {
  const [speaking, setSpeaking] = useState(false);

  if (!organism) return null;

  const handleSpeak = () => {
    if (speaking) {
      sounds.stopSpeech();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      sounds.speak(`${organism.name}. ${organism.details} Fun Fact: ${organism.fact}`);
      setTimeout(() => setSpeaking(false), 8000);
    }
  };

  const handleCollectClick = () => {
    sounds.playStar();
    onCollect(organism.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      {/* Pop-up Card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-emerald-950/90 border-2 border-emerald-400/40 rounded-3xl p-6 shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Glow backdrop decorative accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />

        {/* Header Bar */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 bg-emerald-500/20 rounded-2xl border border-emerald-400/30 shadow-inner">
              {organism.emoji}
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {organism.type === 'plant' ? '🌿 Plant Discovery' : '🐾 Animal Discovery'}
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {organism.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="relative z-10 my-5 space-y-4">
          {/* Simple Explanation */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
              {organism.details}
            </p>
          </div>

          {/* Fun Fact Card */}
          <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Did You Know?
              </span>
              <p className="text-xs md:text-sm text-amber-100/90 font-medium mt-0.5">
                {organism.fact}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="relative z-10 flex items-center gap-3 pt-2">
          {/* Voice Narration Button */}
          <button
            onClick={handleSpeak}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition ${
              speaking
                ? 'bg-amber-500 text-slate-950 border-amber-300 animate-pulse'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{speaking ? 'Stop Reading' : 'Listen Narration'}</span>
          </button>

          {/* Add to Journal Button */}
          <button
            onClick={handleCollectClick}
            disabled={isCollected}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition transform ${
              isCollected
                ? 'bg-emerald-800/60 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 active:scale-95 shadow-emerald-500/20'
            }`}
          >
            {isCollected ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-emerald-300" />
                <span>Saved to Journal (+25 XP)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Collect Entry (+25 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
