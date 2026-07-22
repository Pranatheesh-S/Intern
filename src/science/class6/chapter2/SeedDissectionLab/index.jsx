import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Award, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const SEEDS = [
  {
    id: 'chickpea',
    name: 'Chickpea (Chana)',
    emoji: '🫘',
    soakColor: '#d4a574',
    peelColor: '#f5e6c8',
    cotyledons: 2,
    type: 'Dicot',
    typeColor: '#7c3aed',
    description: 'When you remove the seed coat of a soaked chickpea, it easily splits into TWO equal halves. Each half is called a cotyledon.',
    funFact: 'Chickpea has two cotyledons — so it is a Dicot plant. It also has reticulate venation and taproots!',
    soakNote: 'Watch the chickpea absorb water and swell up. The seed coat wrinkles and loosens.',
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    emoji: '🌽',
    soakColor: '#f5c842',
    peelColor: '#fef3c7',
    cotyledons: 1,
    type: 'Monocot',
    typeColor: '#0891b2',
    description: 'When you peel the outer layer of a soaked maize seed, you find a single thin cotyledon inside. It cannot be split into two halves.',
    funFact: 'Maize has one cotyledon — so it is a Monocot plant. It also has parallel venation and fibrous roots!',
    soakNote: 'The maize seed swells slightly. Notice it stays firm — the single cotyledon is tightly packed inside.',
  }
];

const STEPS = [
  { id: 'soak',    label: 'Step 1: Soak Seeds',     icon: '💧', desc: 'Place seeds in water for 2–3 days (simulated here in seconds). Watch them absorb water and swell.' },
  { id: 'peel',    label: 'Step 2: Peel Seed Coat',  icon: '✂️', desc: 'Remove the outer seed coat. Pinch and peel it off gently to reveal what\'s inside.' },
  { id: 'compare', label: 'Step 3: Compare & Label', icon: '🔬', desc: 'Examine both seeds side by side. Count the cotyledons and classify each seed.' },
  { id: 'result',  label: 'Step 4: Discovery!',      icon: '🏆', desc: 'Discover the rule: cotyledon count → Monocot or Dicot → links to venation & roots!' },
];

export default function SeedDissectionLab({ onBackToDashboard }) {
  const [step, setStep] = useState('soak');
  const [soakProgress, setSoakProgress] = useState(0); // 0-100
  const [peeled, setPeeled] = useState({ chickpea: false, maize: false });
  const [answers, setAnswers] = useState({ chickpea: null, maize: null });
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);
  const [soaking, setSoaking] = useState(false);

  useEffect(() => {
    if (soaking && soakProgress < 100) {
      const timer = setTimeout(() => setSoakProgress(p => Math.min(100, p + 2)), 60);
      return () => clearTimeout(timer);
    }
    if (soakProgress >= 100) setSoaking(false);
  }, [soaking, soakProgress]);

  const handleStartSoak = () => {
    setSoaking(true);
  };

  const handleNextStep = () => {
    if (step === 'soak' && soakProgress >= 100) setStep('peel');
    else if (step === 'peel' && peeled.chickpea && peeled.maize) setStep('compare');
    else if (step === 'compare') handleCheck();
  };

  const handleCheck = () => {
    setChecked(true);
    const ok = answers.chickpea === 2 && answers.maize === 1;
    setAllCorrect(ok);
    if (ok) {
      setStep('result');
      confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 } });
    }
  };

  const handleReset = () => {
    setStep('soak');
    setSoakProgress(0);
    setSoaking(false);
    setPeeled({ chickpea: false, maize: false });
    setAnswers({ chickpea: null, maize: null });
    setChecked(false);
    setAllCorrect(false);
  };

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const currentStep = STEPS[stepIndex] || STEPS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--page-bg)', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="glass-panel" style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.8 — Science Lab</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>🌱 Seed Dissection Lab</div>
          </div>
        </div>
        <button className="outline" onClick={handleReset} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={12} /> Restart
        </button>
      </div>

      {/* Step Progress Bar */}
      <div className="glass-panel" style={{ background: 'var(--card-bg)', padding: '0.75rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: i <= stepIndex ? 1 : 0.4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < stepIndex ? 'var(--success)' : i === stepIndex ? 'var(--accent)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', border: i === stepIndex ? '2px solid var(--accent-border)' : 'none', transition: 'all 0.3s', color: '#fff' }}>
                {i < stepIndex ? '✓' : s.icon}
              </div>
              <span style={{ fontSize: '0.7rem', color: i === stepIndex ? 'var(--text-heading)' : 'var(--text-muted)', fontWeight: i === stepIndex ? 'bold' : 'normal' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--success)' : 'var(--border-light)', transition: 'background 0.5s', minWidth: 20 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem', overflowY: 'auto' }}>

        {/* STEP 1 — SOAK */}
        {step === 'soak' && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div className="glass-panel" style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>💧 Soak the Seeds in Water</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                In the real experiment, you would soak chickpea and maize seeds in water for 2–3 days until they absorb water and the seed coat loosens. Watch the simulation below!
              </p>

              {/* Water Bowl Animation */}
              <div style={{ position: 'relative', margin: '1.5rem auto', width: 320, height: 180 }}>
                <svg width="320" height="180" viewBox="0 0 320 180">
                  {/* Bowl */}
                  <ellipse cx="160" cy="155" rx="130" ry="22" fill="#1e40af" opacity="0.3" />
                  <path d="M 30 80 Q 30 155 160 170 Q 290 155 290 80 Z" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
                  {/* Water fill based on progress */}
                  <clipPath id="waterClip">
                    <path d="M 30 80 Q 30 155 160 170 Q 290 155 290 80 Z" />
                  </clipPath>
                  <rect x="30" y={80 + (1 - soakProgress / 100) * 75} width="260" height="90" fill="#3b82f6" opacity="0.4" clipPath="url(#waterClip)" />
                  {/* Chickpea */}
                  <ellipse cx="120" cy={140 - soakProgress * 0.15} rx={18 + soakProgress * 0.06} ry={14 + soakProgress * 0.04} fill={soakProgress > 20 ? '#c9956a' : '#a0784e'} />
                  <text x="120" y={143 - soakProgress * 0.15} textAnchor="middle" fontSize="10" fill="#fff">C</text>
                  {/* Maize */}
                  <ellipse cx="200" cy={138 - soakProgress * 0.12} rx={14 + soakProgress * 0.04} ry={18 + soakProgress * 0.05} fill={soakProgress > 20 ? '#f0c040' : '#c9a020'} />
                  <text x="200" y={141 - soakProgress * 0.12} textAnchor="middle" fontSize="10" fill="#fff">M</text>
                  {/* Bubbles */}
                  {soaking && <><circle cx="110" cy={120 - soakProgress * 0.3} r="3" fill="#93c5fd" opacity="0.6"><animate attributeName="cy" values={`${120};${80}`} dur="1.5s" repeatCount="indefinite" /></circle><circle cx="190" cy={115 - soakProgress * 0.3} r="2" fill="#93c5fd" opacity="0.6"><animate attributeName="cy" values={`${115};${75}`} dur="2s" repeatCount="indefinite" /></circle></>}
                </svg>
                {soakProgress > 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', color: '#60a5fa' }}>Seeds absorbing water… {soakProgress}%</div>}
              </div>

              {/* Soak progress bar */}
              <div style={{ background: 'var(--surface)', borderRadius: '8px', height: 12, margin: '1rem auto', width: '80%', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, var(--accent))', width: `${soakProgress}%`, transition: 'width 0.1s', borderRadius: '8px' }} />
              </div>

              {soakProgress < 100 && (
                <button className="primary" onClick={handleStartSoak} disabled={soaking} style={{ background: soaking ? 'var(--surface)' : 'var(--accent)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: soaking ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  {soaking ? '⏳ Soaking in progress...' : '💧 Start Soaking'}
                </button>
              )}
              {soakProgress >= 100 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1rem' }}>✅ Seeds fully soaked! Ready to peel.</div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {SEEDS.map(s => <span key={s.id}>{s.emoji} {s.soakNote}</span>)}
                  </div>
                </div>
              )}
            </div>
            {soakProgress >= 100 && (
              <button className="primary" onClick={() => setStep('peel')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '0.65rem 2rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--btn-shadow)' }}>
                Proceed to Peel <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* STEP 2 — PEEL */}
        {step === 'peel' && SEEDS.map(seed => (
          <div className="glass-panel" key={seed.id} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${peeled[seed.id] ? 'var(--success-border)' : 'var(--border)'}`, boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center', transition: 'border 0.3s' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>{seed.name}</div>
            {/* Seed visual */}
            <div style={{ position: 'relative', cursor: peeled[seed.id] ? 'default' : 'pointer' }} onClick={() => !peeled[seed.id] && setPeeled(p => ({ ...p, [seed.id]: true }))}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                {!peeled[seed.id] ? (
                  <>
                    <ellipse cx="80" cy="80" rx={seed.id === 'chickpea' ? 50 : 38} ry={seed.id === 'chickpea' ? 42 : 52} fill={seed.soakColor} stroke="#475569" strokeWidth="2" />
                    <text x="80" y="85" textAnchor="middle" fontSize="14" fill="#64748b">Tap to peel →</text>
                    <ellipse cx="80" cy="80" rx={seed.id === 'chickpea' ? 50 : 38} ry={seed.id === 'chickpea' ? 42 : 52} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
                  </>
                ) : seed.id === 'chickpea' ? (
                  <>
                    {/* Two halves */}
                    <ellipse cx="55" cy="80" rx="38" ry="42" fill="#fef3c7" stroke="#a78bfa" strokeWidth="2" transform="rotate(-10 55 80)" />
                    <ellipse cx="108" cy="80" rx="38" ry="42" fill="#fde68a" stroke="#a78bfa" strokeWidth="2" transform="rotate(10 108 80)" />
                    <text x="55" y="82" textAnchor="middle" fontSize="9" fill="#7c3aed" fontWeight="bold">Cotyledon 1</text>
                    <text x="108" y="82" textAnchor="middle" fontSize="9" fill="#7c3aed" fontWeight="bold">Cotyledon 2</text>
                  </>
                ) : (
                  <>
                    {/* One thin cotyledon */}
                    <ellipse cx="80" cy="80" rx="30" ry="55" fill="#fef3c7" stroke="#0891b2" strokeWidth="2" />
                    <line x1="80" y1="25" x2="80" y2="135" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x="80" y="82" textAnchor="middle" fontSize="9" fill="#0891b2" fontWeight="bold">Cotyledon 1</text>
                    <text x="80" y="96" textAnchor="middle" fontSize="8" fill="#64748b">(only one)</text>
                  </>
                )}
              </svg>
              {!peeled[seed.id] && <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: '0.7rem', color: '#a78bfa', animation: 'pulse 1.5s infinite' }}>👆 Click to peel!</div>}
            </div>
            {peeled[seed.id] && (
              <div style={{ background: 'var(--success-bg)', borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: 'var(--success)', lineHeight: '1.5', border: '1px solid var(--success-border)' }}>
                {seed.description}
              </div>
            )}
          </div>
        ))}

        {step === 'peel' && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
            {peeled.chickpea && peeled.maize ? (
              <button className="primary" onClick={() => setStep('compare')} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '0.65rem 2rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--btn-shadow)' }}>
                Proceed to Compare <ChevronRight size={18} />
              </button>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Peel both seeds to continue ({Object.values(peeled).filter(Boolean).length}/2 peeled)</div>
            )}
          </div>
        )}

        {/* STEP 3 — COMPARE & LABEL */}
        {step === 'compare' && SEEDS.map(seed => (
          <div className="glass-panel" key={seed.id} style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '1.5rem', border: `1px solid ${checked && answers[seed.id] === seed.cotyledons ? 'var(--success-border)' : checked && answers[seed.id] !== seed.cotyledons ? 'var(--danger-border)' : 'var(--border)'}`, transition: 'border 0.3s', boxShadow: 'var(--card-shadow)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{seed.emoji}</div>
              <div style={{ fontWeight: 'bold', color: 'var(--text-heading)' }}>{seed.name}</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '0 0 1rem 0' }}>How many cotyledons does this seed have?</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {[1, 2].map(n => (
                <button key={n} onClick={() => !checked && setAnswers(a => ({ ...a, [seed.id]: n }))} style={{ width: 64, height: 64, borderRadius: '12px', border: `2px solid ${answers[seed.id] === n ? 'var(--accent)' : 'var(--border)'}`, background: answers[seed.id] === n ? 'var(--accent-bg)' : 'transparent', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', cursor: checked ? 'default' : 'pointer', transition: 'all 0.2s' }}>
                  {n}
                </button>
              ))}
            </div>
            {checked && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.8rem', color: answers[seed.id] === seed.cotyledons ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                {answers[seed.id] === seed.cotyledons ? `✅ Correct! ${seed.cotyledons} cotyledon${seed.cotyledons > 1 ? 's' : ''} → ${seed.type}` : `❌ Answer: ${seed.cotyledons} cotyledon${seed.cotyledons > 1 ? 's' : ''}`}
              </div>
            )}
          </div>
        ))}

        {step === 'compare' && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem' }}>
            {checked && !allCorrect && <div style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Some answers are wrong. Try again!</div>}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {checked && !allCorrect && <button className="outline" onClick={() => { setChecked(false); setAnswers({ chickpea: null, maize: null }); }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Try Again</button>}
              {!checked && (
                <button className="primary" onClick={handleCheck} disabled={answers.chickpea === null || answers.maize === null} style={{ background: answers.chickpea !== null && answers.maize !== null ? 'var(--accent)' : 'var(--surface)', border: 'none', color: '#fff', padding: '0.65rem 2rem', borderRadius: '10px', cursor: answers.chickpea !== null && answers.maize !== null ? 'pointer' : 'not-allowed', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: answers.chickpea !== null && answers.maize !== null ? 'var(--btn-shadow)' : 'none' }}>
                  Check My Answers
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 — RESULT */}
        {step === 'result' && (
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingBottom: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
              <h2 style={{ color: 'var(--accent)', margin: 0 }}>Discovery Complete!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>You've mastered seed anatomy!</p>
            </div>

            {/* The Rule */}
            <div className="glass-panel" style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--accent-border)', maxWidth: '600px', width: '100%', boxShadow: 'var(--card-shadow)' }}>
              <h4 style={{ color: 'var(--warning)', margin: '0 0 1.5rem 0', textAlign: 'center' }}>🔑 The Grand Correlation Rule</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {SEEDS.map(seed => (
                  <div key={seed.id} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: `1px solid ${seed.typeColor}40` }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{seed.emoji}</div>
                    <div style={{ fontWeight: 'bold', color: seed.typeColor, fontSize: '1rem', marginBottom: '0.25rem' }}>{seed.type}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {seed.cotyledons} cotyledon{seed.cotyledons > 1 ? 's' : ''}<br />
                      {seed.id === 'chickpea' ? 'Reticulate venation' : 'Parallel venation'}<br />
                      {seed.id === 'chickpea' ? 'Taproot system' : 'Fibrous roots'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: seed.typeColor, marginTop: '0.5rem', fontStyle: 'italic' }}>{seed.funFact.substring(0, 60)}…</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="outline" onClick={handleReset} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <RefreshCw size={14} /> Redo Lab
              </button>
              <button className="primary" onClick={onBackToDashboard} style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: 'var(--btn-shadow)' }}>
                Back to Chapter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
