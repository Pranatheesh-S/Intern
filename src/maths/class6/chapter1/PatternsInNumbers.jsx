import React, { useState } from 'react';
import { Sparkles, Music, Play, Check, Calculator, RefreshCw, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import './theme.css';
import { SEQUENCES } from './data';

export default function PatternsInNumbers({ currentSlide = 1 }) {
  const [selectedSeqId, setSelectedSeqId] = useState('virahanka');
  const [nSlider, setNSlider] = useState(6);
  const [guessSeqId, setGuessSeqId] = useState('triangular');
  const [userGuesses, setUserGuesses] = useState({ t1: '', t2: '', t3: '' });
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [scoreStreak, setScoreStreak] = useState(0);

  // Slide 3 Sanskrit Beat Pad State
  const [beatHistory, setBeatHistory] = useState([]);
  const [currentMoraTotal, setCurrentMoraTotal] = useState(0);

  const currentSeq = SEQUENCES?.find(s => s.id === selectedSeqId) || {
    name: 'Virahānka (Fibonacci)',
    formula: 'a_n = a_{n-1} + a_{n-2}',
    rule: 'Start with 1, 2. Each subsequent term is sum of previous two terms.',
    terms: [1, 2, 3, 5, 8, 13, 21, 34],
    calc: (n) => {
      let a = 1, b = 2;
      if (n === 1) return 1;
      if (n === 2) return 2;
      for (let i = 3; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
      }
      return b;
    }
  };

  const playBeep = (freq, durationMs) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch (e) {}
  };

  const playVirahankaRhythm = () => {
    playBeep(440, 150);
    setTimeout(() => playBeep(330, 350), 300);
    setTimeout(() => playBeep(440, 150), 750);
    setTimeout(() => playBeep(440, 150), 1000);
    setTimeout(() => playBeep(330, 350), 1250);
  };

  const addBeat = (type) => {
    const cost = type === 'L' ? 1 : 2;
    playBeep(type === 'L' ? 520 : 330, type === 'L' ? 160 : 320);
    setBeatHistory(prev => [...prev, { type, cost }]);
    setCurrentMoraTotal(prev => prev + cost);
  };

  const resetBeats = () => {
    setBeatHistory([]);
    setCurrentMoraTotal(0);
  };

  const guessSeq = SEQUENCES?.find(s => s.id === guessSeqId) || currentSeq;

  const handleCheckQuiz = () => {
    const e1 = guessSeq.calc(5);
    const e2 = guessSeq.calc(6);
    const e3 = guessSeq.calc(7);

    const u1 = parseInt(userGuesses.t1, 10);
    const u2 = parseInt(userGuesses.t2, 10);
    const u3 = parseInt(userGuesses.t3, 10);

    if (u1 === e1 && u2 === e2 && u3 === e3) {
      setScoreStreak(prev => prev + 1);
      setQuizFeedback({ success: true, message: `🎉 Brilliant! Next 3 terms are ${e1}, ${e2}, and ${e3}!` });
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });
      playBeep(587.33, 200);
    } else {
      setScoreStreak(0);
      setQuizFeedback({ success: false, message: `Not quite! Formula yields: ${e1}, ${e2}, ${e3}. Try another sequence!` });
      playBeep(220, 250);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', justifyContent: 'space-between' }}>
      {/* SLIDE 1: TABLE 1 */}
      {currentSlide === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Number Theory & Table 1: Fundamental Sequences
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              The branch of mathematics investigating patterns, prime distributions, divisibility, and progressions in whole numbers is termed <strong>Number Theory</strong>. Table 1 catalogs the 10 foundational sequences:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem' }}>
            {[
              { id: '1', name: "All 1's", terms: '1, 1, 1, 1, 1 ...' },
              { id: '2', name: 'Counting Numbers', terms: '1, 2, 3, 4, 5 ...' },
              { id: '3', name: 'Odd Numbers', terms: '1, 3, 5, 7, 9 ...' },
              { id: '4', name: 'Even Numbers', terms: '2, 4, 6, 8, 10 ...' },
              { id: '5', name: 'Triangular Numbers', terms: '1, 3, 6, 10, 15 ...' },
              { id: '6', name: 'Square Numbers', terms: '1, 4, 9, 16, 25 ...' },
              { id: '7', name: 'Cube Numbers', terms: '1, 8, 27, 64, 125 ...' },
              { id: '8', name: 'Virahānka (Fibonacci)', terms: '1, 2, 3, 5, 8 ...' },
              { id: '9', name: 'Powers of 2', terms: '1, 2, 4, 8, 16 ...' },
              { id: '10', name: 'Powers of 3', terms: '1, 3, 9, 27, 81 ...' }
            ].map(s => (
              <div key={s.id} style={{ background: '#ffffff', padding: '0.65rem 0.95rem', borderRadius: '10px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.88rem' }}>{s.id}. {s.name}</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--theme-primary, #0d9488)', fontFamily: 'monospace', fontWeight: '900' }}>{s.terms}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLIDE 2: SEQUENCE EXPLORER & CALCULATOR */}
      {currentSlide === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Interactive Sequence Term Calculator
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Select any sequence from Table 1 and adjust the term position $N$ to evaluate its closed-form formula and observe recurrence relations dynamically:
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {SEQUENCES?.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSeqId(s.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: selectedSeqId === s.id ? '2px solid var(--theme-primary, #0d9488)' : '1.5px solid var(--theme-border, #a7f3d0)',
                  background: selectedSeqId === s.id ? 'var(--theme-badge-bg, #ccfbf1)' : '#ffffff',
                  color: selectedSeqId === s.id ? 'var(--theme-primary-dark, #0f766e)' : '#475569',
                  fontWeight: '900',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', display: 'flex', flexDirection: 'column', gap: '0.65rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '1.15rem' }}>{currentSeq.name}</span>
              <span style={{ background: 'var(--theme-badge-bg, #ccfbf1)', color: 'var(--theme-badge-text, #0f766e)', padding: '0.25rem 0.8rem', borderRadius: '8px', fontWeight: '900', fontSize: '0.88rem', border: '1px solid var(--theme-border, #a7f3d0)' }}>
                {currentSeq.formula}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.55, textAlign: 'justify', textJustify: 'inter-word' }}>
              <strong>Algebraic Rule:</strong> {currentSeq.rule}
            </p>

            {/* Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--theme-bg, #f0fdfa)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--theme-border, #a7f3d0)' }}>
              <span style={{ fontWeight: '900', fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)' }}>Term N = {nSlider}:</span>
              <input
                type="range"
                min="1"
                max="12"
                value={nSlider}
                onChange={(e) => setNSlider(parseInt(e.target.value, 10))}
                style={{ flex: 1, accentColor: 'var(--theme-primary, #0d9488)' }}
              />
              <div style={{ background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', color: '#ffffff', padding: '0.35rem 1rem', borderRadius: '10px', fontWeight: '900', fontSize: '1rem', boxShadow: 'var(--theme-btn-shadow, 0 4px 12px rgba(13, 148, 136, 0.3))' }}>
                Term #{nSlider} = {currentSeq.calc(nSlider)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 3: ACHARYA VIRAHANKA & SANSKRIT BEAT PAD MINI-GAME */}
      {currentSlide === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Acharya Virahānka (c. 700 CE) — Sanskrit Rhythms
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Centuries before Fibonacci (1202 CE), the celebrated Indian scholar and prosodist <strong>Acharya Virahānka</strong> proved that composing poetic lines of short syllables (<em>Laghu</em> = 1 beat) and long syllables (<em>Guru</em> = 2 beats) obeys $1, 2, 3, 5, 8, 13, 21 \dots$ where each count equals the sum of the preceding two.
            </p>
          </div>

          {/* Interactive Sanskrit Beat Pad Mini-Game */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '1rem' }}>🎵 Interactive Sanskrit Beat Sequencer:</span>
              <button
                onClick={playVirahankaRhythm}
                style={{ padding: '0.4rem 1rem', borderRadius: '8px', background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))', color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: 'var(--theme-btn-shadow, 0 4px 12px rgba(13, 148, 136, 0.25))' }}
              >
                <Music size={15} /> Play Full Acoustic Meter
              </button>
            </div>

            {/* Beat Trigger Buttons */}
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button
                onClick={() => addBeat('L')}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', background: 'var(--theme-badge-bg, #ccfbf1)', border: '1.8px solid var(--theme-border, #a7f3d0)', color: 'var(--theme-primary-dark, #0f766e)', fontWeight: '900', fontSize: '0.92rem', cursor: 'pointer' }}
              >
                🥁 Tap Laghu (S = 1 Beat)
              </button>
              <button
                onClick={() => addBeat('G')}
                style={{ flex: 1, padding: '0.65rem', borderRadius: '10px', background: 'var(--theme-bg, #f0fdfa)', border: '1.8px solid var(--theme-border, #a7f3d0)', color: 'var(--theme-primary, #0d9488)', fontWeight: '900', fontSize: '0.92rem', cursor: 'pointer' }}
              >
                🥁 Tap Guru (L = 2 Beats)
              </button>
              <button
                onClick={resetBeats}
                style={{ padding: '0.65rem 1rem', borderRadius: '10px', background: '#f1f5f9', border: '1.5px solid #cbd5e1', color: '#475569', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {/* Active Beat Display */}
            <div style={{ background: 'var(--theme-bg, #f0fdfa)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid var(--theme-border, #a7f3d0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.92rem', color: 'var(--theme-heading, #134e4a)', fontWeight: '800' }}>
                Your Meter Pattern: {beatHistory.length === 0 ? 'Tap Laghu or Guru above!' : beatHistory.map(b => b.type === 'L' ? '[S: 1]' : '[L: 2]').join(' ')}
              </div>
              <div style={{ background: 'var(--theme-badge-bg, #ccfbf1)', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: '900', color: 'var(--theme-badge-text, #0f766e)', fontSize: '0.95rem' }}>
                Total Beats: {currentMoraTotal}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE 4: PRACTICE & SEQUENCE DETECTIVE GAME */}
      {currentSlide === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', height: '100%', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.38rem', fontWeight: '900', color: 'var(--theme-heading, #134e4a)' }}>
              Pattern Detective: Deduce the Rule & Predict 3 Terms
            </h3>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
              Select a sequence, deduce its recurrence rule, and input the subsequent three numbers to verify your prediction accuracy:
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.8px solid var(--theme-border, #a7f3d0)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <select
                  value={guessSeqId}
                  onChange={(e) => {
                    setGuessSeqId(e.target.value);
                    setUserGuesses({ t1: '', t2: '', t3: '' });
                    setQuizFeedback(null);
                  }}
                  style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1.8px solid var(--theme-border, #a7f3d0)', fontWeight: '800', fontSize: '0.9rem', color: 'var(--theme-heading, #134e4a)' }}
                >
                  {SEQUENCES?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <span style={{ fontWeight: '900', color: 'var(--theme-heading, #134e4a)', fontSize: '0.95rem' }}>
                  Given: {guessSeq.calc(1)}, {guessSeq.calc(2)}, {guessSeq.calc(3)}, {guessSeq.calc(4)} ...
                </span>
              </div>

              {scoreStreak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: '900', fontSize: '0.85rem', border: '1px solid #86efac' }}>
                  <Zap size={15} /> Streak: {scoreStreak}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              {['t1', 't2', 't3'].map((k, i) => (
                <input
                  key={k}
                  type="number"
                  placeholder={`Term #${i + 5}`}
                  value={userGuesses[k]}
                  onChange={(e) => setUserGuesses({ ...userGuesses, [k]: e.target.value })}
                  style={{ width: '105px', padding: '0.45rem', borderRadius: '8px', border: '2px solid var(--theme-primary, #0d9488)', textAlign: 'center', fontWeight: '900', fontSize: '0.95rem', color: 'var(--theme-heading, #134e4a)' }}
                />
              ))}

              <button
                onClick={handleCheckQuiz}
                style={{
                  padding: '0.45rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--theme-btn-gradient, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--theme-btn-shadow, 0 4px 14px rgba(13, 148, 136, 0.35))'
                }}
              >
                Verify Solution
              </button>
            </div>

            {quizFeedback && (
              <div style={{
                background: quizFeedback.success ? '#f0fdf4' : '#fef2f2',
                color: quizFeedback.success ? '#15803d' : '#b91c1c',
                border: `1.8px solid ${quizFeedback.success ? '#86efac' : '#fca5a5'}`,
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontSize: '0.92rem',
                fontWeight: '900'
              }}>
                {quizFeedback.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
