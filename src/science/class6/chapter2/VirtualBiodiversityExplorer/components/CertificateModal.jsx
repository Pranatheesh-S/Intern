import React, { useEffect } from 'react';
import { Award, Star, RefreshCw, ArrowRight, Download, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function CertificateModal({
  xp,
  stars,
  discoveredCount,
  onReplay,
  onNextLesson
}) {
  useEffect(() => {
    sounds.playSuccess();
    // Confetti celebration burst
    const end = Date.now() + 3 * 1000;
    const colors = ['#10b981', '#fbbf24', '#06b6d4', '#f43f5e'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Certificate Outer Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-4 border-amber-400/60 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-center text-white my-8">
        
        {/* Decorative corner ribbons */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-bl-full border-b border-l border-amber-400/30" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-tr-full border-t border-r border-emerald-500/30" />

        {/* Certificate Gold Seal Header */}
        <div className="relative z-10 inline-flex p-4 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-2xl border-4 border-amber-200 mb-3 animate-bounce">
          <Award className="w-10 h-10 text-slate-950" />
        </div>

        <span className="block text-xs font-extrabold uppercase tracking-widest text-amber-300">
          CBSE Grade 6 Science Certificate of Excellence
        </span>

        <h1 className="text-2xl md:text-4xl font-black text-white mt-1 mb-2 tracking-tight">
          Master Nature Explorer 🌿
        </h1>

        <p className="text-sm text-slate-300 max-w-md mx-auto">
          This certificate is proudly awarded for successfully exploring plant and animal diversity in Activity 2.1!
        </p>

        {/* Gamification Stats Cards Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-lg mx-auto">
          <div className="bg-slate-800/80 border border-amber-400/30 p-3 rounded-2xl">
            <span className="text-xs text-slate-400 block font-medium">XP Earned</span>
            <span className="text-xl md:text-2xl font-extrabold text-emerald-400">{xp} XP</span>
          </div>

          <div className="bg-slate-800/80 border border-amber-400/30 p-3 rounded-2xl">
            <span className="text-xs text-slate-400 block font-medium">Stars Collected</span>
            <span className="text-xl md:text-2xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400" /> {stars}
            </span>
          </div>

          <div className="bg-slate-800/80 border border-amber-400/30 p-3 rounded-2xl">
            <span className="text-xs text-slate-400 block font-medium">Species Found</span>
            <span className="text-xl md:text-2xl font-extrabold text-cyan-400">{discoveredCount}/8</span>
          </div>
        </div>

        {/* Badge Banner */}
        <div className="bg-emerald-950/60 border border-emerald-400/40 p-4 rounded-2xl max-w-md mx-auto mb-6 flex items-center justify-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Badge Unlocked</span>
            <h4 className="font-extrabold text-white text-base">Eco Detective Level 1</h4>
          </div>
        </div>

        {/* Buttons Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs md:text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate</span>
          </button>

          <button
            onClick={onReplay}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs md:text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Replay Activity</span>
          </button>

          <button
            onClick={onNextLesson}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-xs md:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-xl transition transform active:scale-95"
          >
            <span>Next Lesson (2.2)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
