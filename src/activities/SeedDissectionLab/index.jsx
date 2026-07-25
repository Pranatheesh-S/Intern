import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ChevronRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const STEPS = [
  { id: 'soak',    label: 'Step 1: Soak Seeds',     icon: '💧', desc: 'Hydrate the seeds in water. Watch the seed coats wrinkle, loosen, and swell over a simulated 3-day period.' },
  { id: 'peel',    label: 'Step 2: Peel Seed Coat',  icon: '✂️', desc: 'Peel the outer seed coat to reveal the food storage cotyledons underneath. Compare peelability.' },
  { id: 'compare', label: 'Step 3: Label Anatomy',   icon: '🔬', desc: 'Examine both seeds under a lens. Identify and label the plumule, radicle, endosperm, and cotyledons.' },
  { id: 'result',  label: 'Step 4: Discovery!',      icon: '🏆', desc: 'Review the Grand Correlation: Cotyledons ↔ Leaf Venation ↔ Root System.' },
];

const LABELS = [
  { id: 'Plumule', label: '🌱 Plumule (Baby Shoot)', desc: 'Grows upwards to form leaves and stem.' },
  { id: 'Radicle', label: '🥕 Radicle (Baby Root)', desc: 'Grows downwards to become the main taproot.' },
  { id: 'Cotyledon', label: '🫘 Cotyledon (Food Store)', desc: 'Stores nutrients for the germinating embryo.' },
  { id: 'Endosperm', label: '🌾 Endosperm (Starch)', desc: 'Starch storage tissue that nourishes the monocot embryo.' },
  { id: 'Single Cotyledon', label: '🛡️ Single Cotyledon', desc: 'Also called scutellum, transfers starch to the embryo.' },
  { id: 'Embryo', label: '👶 Embryo (Baby Plant)', desc: 'The immature plant consisting of plumule and radicle sheaths.' }
];

export default function SeedDissectionLab({ onBackToDashboard }) {
  const [step, setStep] = useState('soak');
  const [soakProgress, setSoakProgress] = useState(0); // 0 to 100
  const [soaking, setSoaking] = useState(false);
  const [dayCount, setDayCount] = useState(0); // 0 to 3

  // Step 2: Peeling states
  const [peeled, setPeeled] = useState({ chickpea: false, maize: false });

  // Step 3: Labeling states
  const [activeLabel, setActiveLabel] = useState(null);
  const [placedLabels, setPlacedLabels] = useState({
    chickpea: { plumule: null, radicle: null, cotyledon: null },
    maize: { endosperm: null, scutellum: null, embryo: null }
  });
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  // Soaking effect
  useEffect(() => {
    if (soaking && soakProgress < 100) {
      const timer = setTimeout(() => {
        setSoakProgress(p => {
          const next = Math.min(100, p + 2);
          setDayCount(Math.min(3, Math.floor((next / 100) * 3)));
          return next;
        });
      }, 50);
      return () => clearTimeout(timer);
    }
    if (soakProgress >= 100) {
      setSoaking(false);
    }
  }, [soaking, soakProgress]);

  const handleStartSoak = () => {
    setSoakProgress(0);
    setDayCount(0);
    setSoaking(true);
  };

  // Label placing logic
  const handlePlaceLabel = (seed, target) => {
    if (checked) return;
    if (!activeLabel) return;

    setPlacedLabels(prev => {
      const next = { ...prev };
      next[seed] = { ...next[seed], [target]: activeLabel };
      return next;
    });
    setActiveLabel(null);
  };

  const handleRemoveLabel = (seed, target) => {
    if (checked) return;
    setPlacedLabels(prev => {
      const next = { ...prev };
      next[seed] = { ...next[seed], [target]: null };
      return next;
    });
  };

  const handleCheckLabeling = () => {
    setChecked(true);
    const chickCorrect =
      placedLabels.chickpea.plumule === 'Plumule' &&
      placedLabels.chickpea.radicle === 'Radicle' &&
      placedLabels.chickpea.cotyledon === 'Cotyledon';

    const maizeCorrect =
      placedLabels.maize.endosperm === 'Endosperm' &&
      placedLabels.maize.scutellum === 'Single Cotyledon' &&
      placedLabels.maize.embryo === 'Embryo';

    const ok = chickCorrect && maizeCorrect;
    setAllCorrect(ok);

    if (ok) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => setStep('result'), 1200);
    }
  };

  const handleReset = () => {
    setStep('soak');
    setSoakProgress(0);
    setSoaking(false);
    setDayCount(0);
    setPeeled({ chickpea: false, maize: false });
    setPlacedLabels({
      chickpea: { plumule: null, radicle: null, cotyledon: null },
      maize: { endosperm: null, scutellum: null, embryo: null }
    });
    setActiveLabel(null);
    setChecked(false);
    setAllCorrect(false);
  };

  const renderSvgAnchorBox = (seed, target, label, x, y, width = 95, height = 24) => {
    const placed = placedLabels[seed][target];
    const isCorrect = checked && placed === label;
    const isWrong = checked && placed !== label;

    let strokeColor = 'var(--accent)';
    let fillColor = 'rgba(99, 102, 241, 0.03)';
    let textColor = 'var(--accent)';

    if (isCorrect) {
      strokeColor = 'var(--success)';
      fillColor = 'var(--success-bg)';
      textColor = 'var(--success)';
    } else if (isWrong) {
      strokeColor = 'var(--danger)';
      fillColor = 'var(--danger-bg)';
      textColor = 'var(--danger)';
    } else if (placed) {
      strokeColor = 'var(--border)';
      fillColor = 'var(--surface)';
      textColor = 'var(--text-primary)';
    }

    return (
      <g
        onClick={() => {
          if (checked) return;
          if (placed) {
            handleRemoveLabel(seed, target);
          } else {
            if (!activeLabel) return;
            handlePlaceLabel(seed, target);
          }
        }}
        style={{ cursor: checked ? 'not-allowed' : 'pointer' }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          ry={6}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={placed ? 1.5 : 1.2}
          strokeDasharray={placed ? 'none' : '3 2'}
        />
        <text
          x={x + width / 2 - (placed && !checked ? 4 : 0)}
          y={y + height / 2 + 2.5}
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill={textColor}
        >
          {placed ? placed : `+ Drop ${label}`}
        </text>
        {placed && !checked && (
          <g transform={`translate(${x + width - 10}, ${y + height / 2 - 3})`}>
            <path d="M 0 0 L 6 6 M 6 0 L 0 6" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };

  const stepIndex = STEPS.findIndex(s => s.id === step);
  const currentStep = STEPS[stepIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--page-bg)', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      
      {/* Styles for animations */}
      <style>{`
        @keyframes float-bubble {
          0% { transform: translateY(0) scale(0.7); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-90px) scale(1.2); opacity: 0; }
        }
        .bubble-1 { animation: float-bubble 2.5s infinite ease-in; }
        .bubble-2 { animation: float-bubble 1.8s infinite ease-in; animation-delay: 0.4s; }
        .bubble-3 { animation: float-bubble 3s infinite ease-in; animation-delay: 0.8s; }
        .bubble-4 { animation: float-bubble 2.2s infinite ease-in; animation-delay: 1.2s; }
        
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
          background-size: 200% 100%;
          animation: shimmer-anim 1.5s infinite;
        }
        @keyframes shimmer-anim {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.8 — Science Lab</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>🌱 Seed Dissection & Anatomy Station</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
          <RefreshCw size={12} /> Restart Lab
        </button>
      </div>

      {/* Steps Progress Indicator */}
      <div style={{ background: 'var(--card-bg)', padding: '0.65rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--border)', zIndex: 5 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', opacity: i <= stepIndex ? 1 : 0.4 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i < stepIndex ? 'var(--success)' : i === stepIndex ? 'var(--accent)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', border: i === stepIndex ? '2px solid var(--accent-border)' : 'none', color: '#fff', fontWeight: 'bold', transition: 'all 0.3s' }}>
                {i < stepIndex ? '✓' : s.icon}
              </div>
              <span style={{ fontSize: '0.75rem', color: i === stepIndex ? 'var(--text-heading)' : 'var(--text-secondary)', fontWeight: i === stepIndex ? 'bold' : '500' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIndex ? 'var(--success)' : 'var(--border-light)', transition: 'background 0.5s', minWidth: 15 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Main Sandbox */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto' }}>
        
        {/* Step Guide Text */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
          <div style={{ fontSize: '1.5rem' }}>{currentStep?.icon || '🔬'}</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{STEPS[stepIndex]?.label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem', lineHeight: '1.4' }}>{STEPS[stepIndex]?.desc}</div>
          </div>
        </div>

        {/* ================= STEP 1: SOAK SEEDS ================= */}
        {step === 'soak' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem 2rem', maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', boxShadow: 'var(--card-shadow)' }}>
              
              {/* Day Badge */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', background: soakProgress >= 100 ? 'var(--success-bg)' : 'var(--accent-bg)', color: soakProgress >= 100 ? 'var(--success)' : 'var(--accent)', padding: '0.35rem 0.8rem', borderRadius: '20px', transition: 'all 0.3s' }}>
                  {soakProgress >= 100 ? '✅ Swelling Complete' : `📅 Day ${dayCount}`}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hydration: {soakProgress}%</span>
              </div>

              {/* 3D Beaker SVG */}
              <div style={{ width: 220, height: 260, position: 'relative' }}>
                <svg width="220" height="260" viewBox="0 0 220 260" style={{ overflow: 'visible' }}>
                  <defs>
                    {/* Beaker Glass Radial Gradient */}
                    <linearGradient id="beakerGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
                      <stop offset="25%" stopColor="rgba(255, 255, 255, 0.15)" />
                      <stop offset="90%" stopColor="rgba(255, 255, 255, 0.1)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.55)" />
                    </linearGradient>
                    {/* Liquid fill color gradient */}
                    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
                    </linearGradient>
                    {/* Seed dry/hydrated chickpea */}
                    <radialGradient id="chickpeaGrad" cx="45%" cy="40%" r="60%">
                      {/* Morph color from dry brown #d4a373 to soaked cream #faedcd */}
                      <stop offset="0%" stopColor={soakProgress > 50 ? '#faedcd' : '#d4a373'} />
                      <stop offset="70%" stopColor={soakProgress > 50 ? '#e9d8a6' : '#a98467'} />
                      <stop offset="100%" stopColor={soakProgress > 50 ? '#d4a373' : '#6f523b'} />
                    </radialGradient>
                    {/* Seed dry/hydrated corn */}
                    <radialGradient id="cornGrad" cx="45%" cy="45%" r="60%">
                      <stop offset="0%" stopColor={soakProgress > 50 ? '#fef08a' : '#f59e0b'} />
                      <stop offset="100%" stopColor={soakProgress > 50 ? '#eab308' : '#b45309'} />
                    </radialGradient>
                  </defs>

                  {/* shadow under beaker */}
                  <ellipse cx="110" cy="245" rx="75" ry="12" fill="rgba(0,0,0,0.12)" />

                  {/* Volumetric marks behind beaker fill */}
                  <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
                    <line x1="165" y1="110" x2="178" y2="110" />
                    <line x1="165" y1="150" x2="175" y2="150" />
                    <line x1="165" y1="190" x2="178" y2="190" />
                  </g>
                  
                  {/* Liquid (meniscus and body) clipping beaker boundaries */}
                  {/* Fill starts at height 240 and rises slightly to 120 */}
                  <g>
                    {/* Base water block */}
                    <path d="M 46 238 L 46 130 Q 110 126 174 130 L 174 238 Q 110 244 46 238 Z" fill="url(#liquidGrad)" />
                    {/* Ripple/Meniscus ellipse top */}
                    <ellipse cx="110" cy="130" rx="64" ry="7" fill="#bae6fd" opacity="0.5" />
                  </g>

                  {/* Volumetric labels */}
                  <g fill="rgba(255,255,255,0.5)" fontSize="9" fontWeight="bold">
                    <text x="184" y="113">200ml</text>
                    <text x="182" y="153">150ml</text>
                    <text x="184" y="193">100ml</text>
                  </g>

                  {/* Volumetric scale line */}
                  <line x1="165" y1="80" x2="165" y2="220" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                  {/* SOAKING SEEDS (Swelling and moving based on progress) */}
                  {/* Chickpea Seed */}
                  <g transform={`translate(${75 - (soakProgress*0.1)}, ${190 - (soakProgress*0.08)}) scale(${1 + (soakProgress * 0.0035)})`}>
                    {/* Teardrop shape */}
                    <path d="M 15 2 C 7 13 8 20 15 25 C 22 20 23 13 15 2 Z" fill="url(#chickpeaGrad)" stroke="#5c4033" strokeWidth="0.8" />
                    {/* Beak tip */}
                    <path d="M 14 3 Q 15 6 16 3" fill="none" stroke="#faedcd" strokeWidth="1" />
                    {/* Micropyle dot */}
                    <circle cx="15" cy="8" r="1.2" fill="#3d2612" />
                    
                    {/* Wrinkling paths (fades out as hydration reaches 100%) */}
                    <path d="M 10 12 Q 13 16 11 20 M 20 12 Q 17 16 19 20" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" opacity={Math.max(0, 1 - (soakProgress / 80))} />
                  </g>
                  <text x="52" y="240" fill="var(--text-primary)" fontSize="8.5" fontWeight="bold">Chickpea (Dicot)</text>

                  {/* Maize Kernel */}
                  <g transform={`translate(${125 + (soakProgress*0.08)}, ${185 - (soakProgress*0.05)}) scale(${1 + (soakProgress * 0.0018)})`}>
                    {/* Wedge shape */}
                    <path d="M 15 25 L 5 10 Q 4 3 15 2 Q 26 3 25 10 Z" fill="url(#cornGrad)" stroke="#b45309" strokeWidth="0.8" />
                    {/* Whitish embryo base shield */}
                    <path d="M 15 25 L 8 15 Q 15 11 22 15 Z" fill="#ffffff" opacity="0.6" />
                  </g>
                  <text x="122" y="240" fill="var(--text-primary)" fontSize="8.5" fontWeight="bold">Maize (Monocot)</text>

                  {/* Beaker Glass Structure (Overlayed to show reflections) */}
                  {/* Lip and spout of beaker */}
                  <path d="M 38 60 Q 32 60 34 50 Q 38 35 48 35 L 172 35 Q 182 35 186 50 Q 188 60 182 60 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                  {/* Beaker Spout Notch */}
                  <path d="M 38 52 Q 24 50 36 60" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
                  {/* Beaker body tube */}
                  <path d="M 44 58 L 44 235 Q 44 246 56 246 L 164 246 Q 176 246 176 235 L 176 58" fill="url(#beakerGlass)" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" />

                  {/* Rising Water Bubbles (Only animate during active soaking) */}
                  {soaking && (
                    <g fill="#bae6fd" opacity="0.5">
                      <circle cx="85" cy="180" r="2.5" className="bubble-1" />
                      <circle cx="130" cy="175" r="1.8" className="bubble-2" />
                      <circle cx="95" cy="160" r="3.2" className="bubble-3" />
                      <circle cx="140" cy="165" r="2.2" className="bubble-4" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Progress and controls */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ height: 10, background: 'var(--surface)', borderRadius: '10px', overflow: 'hidden', width: '100%', border: '1px solid var(--border)' }}>
                  <div className={soaking ? "shimmer-bg" : ""} style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, var(--accent))', width: `${soakProgress}%`, transition: 'width 0.1s ease', borderRadius: '10px' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                  {soakProgress < 100 ? (
                    <button className="primary" onClick={handleStartSoak} disabled={soaking} style={{ padding: '0.7rem 2.5rem', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', background: soaking ? 'var(--border)' : 'var(--accent)', cursor: soaking ? 'not-allowed' : 'pointer', border: 'none', color: '#fff', borderRadius: '8px', boxShadow: soaking ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                      {soaking ? '⏳ Day by Day Hydration...' : '💧 Start Soaking (3 Days)'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>✨ Seeds are swollen & seed coats are soft! Ready to dissect.</span>
                      </div>
                      <button className="primary" onClick={() => setStep('peel')} style={{ padding: '0.65rem 2.5rem', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', color: '#fff', background: 'var(--success)', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' }}>
                        Proceed to Dissection Tray <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 2: PEEL SEED COAT ================= */}
        {step === 'peel' && (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Chickpea Card */}
            <div style={{ background: 'var(--card-bg)', border: `1px solid ${peeled.chickpea ? 'var(--success)' : 'var(--border)'}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', boxShadow: 'var(--card-shadow)', transition: 'border 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>Dicot Specimen</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>Chickpea (Gram)</span>
              </div>

              {/* Dissection SVG Area */}
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)', position: 'relative' }}>
                <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                  <defs>
                    <radialGradient id="chickpeaInner" cx="45%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#fefae0" />
                      <stop offset="70%" stopColor="#faedcd" />
                      <stop offset="100%" stopColor="#e9d8a6" />
                    </radialGradient>
                  </defs>

                  {/* Shadows */}
                  <ellipse cx="50" cy="85" rx="35" ry="8" fill="rgba(0,0,0,0.12)" />

                  {!peeled.chickpea ? (
                    /* Initial Swollen seed with loose coat */
                    <g style={{ cursor: 'pointer' }} onClick={() => setPeeled(p => ({ ...p, chickpea: true }))}>
                      {/* Seed Body */}
                      <path d="M 50 15 Q 30 50 32 70 Q 35 85 50 85 Q 65 85 68 70 Q 70 50 50 15 Z" fill="#e9d8a6" stroke="#a98467" strokeWidth="1.2" />
                      {/* Seed coat wrinkly wrinkled lines */}
                      <path d="M 33 65 Q 40 68 50 67 M 67 65 Q 60 68 50 67" fill="none" stroke="#faedcd" strokeWidth="0.8" />
                      {/* Loose coat flap indicators */}
                      <path d="M 30 35 C 28 50 31 75 50 86 C 69 75 72 50 70 35" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
                    </g>
                  ) : (
                    /* Peeled seed - showing split layers */
                    <g>
                      {/* Peeled shell segments lying nearby */}
                      <path d="M 12 70 Q 2 45 18 35 T 25 55" fill="none" stroke="#a98467" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                      <path d="M 88 70 Q 98 45 82 35 T 75 55" fill="none" stroke="#a98467" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

                      {/* Main seed splitting down the middle */}
                      <g transform="translate(-8, 0) rotate(-4 42 70)">
                        <path d="M 45 20 Q 28 45 30 70 Q 33 82 45 82 Q 52 82 52 70 Z" fill="url(#chickpeaInner)" stroke="#d4a373" strokeWidth="1" />
                        <text x="34" y="55" fontSize="6.5" fill="#a98467" fontWeight="bold">Cotyledon 1</text>
                      </g>
                      <g transform="translate(8, 0) rotate(4 58 70)">
                        <path d="M 55 20 Q 72 45 70 70 Q 67 82 55 82 Q 48 82 48 70 Z" fill="url(#chickpeaInner)" stroke="#d4a373" strokeWidth="1" />
                        <text x="56" y="55" fontSize="6.5" fill="#a98467" fontWeight="bold">Cotyledon 2</text>
                      </g>
                    </g>
                  )}
                </svg>

                {!peeled.chickpea && (
                  <button onClick={() => setPeeled(p => ({ ...p, chickpea: true }))} style={{ position: 'absolute', bottom: 10, padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>
                    🔓 Peel & Split Seed
                  </button>
                )}
              </div>

              {/* Description */}
              {peeled.chickpea ? (
                <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', lineHeight: '1.5', textAlign: 'left', width: '100%' }}>
                  <strong>Observation:</strong> The seed coat peeled off smoothly, and the chickpea split easily into <strong>TWO equal halves</strong> (cotyledons). It is a <strong>Dicotyledon (Dicot)</strong>!
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click the button or seed to peel the coat and investigate the structure.</div>
              )}
            </div>

            {/* Maize Card */}
            <div style={{ background: 'var(--card-bg)', border: `1px solid ${peeled.maize ? 'var(--success)' : 'var(--border)'}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', boxShadow: 'var(--card-shadow)', transition: 'border 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase' }}>Monocot Specimen</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>Maize (Corn)</span>
              </div>

              {/* Dissection SVG Area */}
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)', position: 'relative' }}>
                <svg width="180" height="180" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                  {/* Shadows */}
                  <ellipse cx="50" cy="85" rx="30" ry="7" fill="rgba(0,0,0,0.12)" />

                  {!peeled.maize ? (
                    /* Initial Swollen Maize kernel */
                    <g style={{ cursor: 'pointer' }} onClick={() => setPeeled(p => ({ ...p, maize: true }))}>
                      <path d="M 50 82 L 28 45 Q 26 22 50 20 Q 74 22 72 45 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" />
                      <path d="M 50 82 L 35 56 Q 50 48 65 56 Z" fill="#ffffff" opacity="0.55" />
                    </g>
                  ) : (
                    /* Peeled Maize kernel - thin outer coat tags loose, main body remains whole caryopsis */
                    <g>
                      {/* Loose transparent coat peeling from the corner */}
                      <path d="M 28 45 Q 16 35 22 20 Q 34 26 36 38" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 1" />
                      
                      {/* Main kernel remains fully intact */}
                      <path d="M 50 82 L 28 45 Q 26 22 50 20 Q 74 22 72 45 Z" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
                      {/* Embryo region remains firm */}
                      <path d="M 50 82 L 35 56 Q 50 48 65 56 Z" fill="#ffffff" opacity="0.65" />
                      
                      {/* Slice cut indicator line */}
                      <line x1="50" y1="20" x2="50" y2="82" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
                    </g>
                  )}
                </svg>

                {!peeled.maize && (
                  <button onClick={() => setPeeled(p => ({ ...p, maize: true }))} style={{ position: 'absolute', bottom: 10, padding: '0.4rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }}>
                    🔓 Peel Outer Layer
                  </button>
                )}
              </div>

              {/* Description */}
              {peeled.maize ? (
                <div style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', lineHeight: '1.5', textAlign: 'left', width: '100%' }}>
                  <strong>Observation:</strong> In maize, the seed coat is fused with the fruit wall. It cannot be split into two. It has only <strong>ONE single cotyledon</strong>! It is a <strong>Monocotyledon (Monocots)</strong>.
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click the button or seed to peel the coat and investigate the structure.</div>
              )}
            </div>

            {/* Bottom Proceed bar */}
            {peeled.chickpea && peeled.maize && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '0.5rem', paddingBottom: '1rem' }}>
                <button className="primary" onClick={() => setStep('compare')} style={{ padding: '0.7rem 3rem', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', color: '#fff', background: 'var(--accent)', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                  Proceed to Labeling Station <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ================= STEP 3: LABEL ANATOMY ================= */}
        {step === 'compare' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Instruction banner */}
            <div style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.78rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} />
              <span><strong>How to Label:</strong> First select a label tag from the toolbar below, then click the correct dotted box on the seed diagrams to place it.</span>
            </div>

            {/* Label Selector Toolbar */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)' }}>Anatomical Labels</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {LABELS.map(lbl => {
                  const isSelected = activeLabel === lbl.id;
                  return (
                    <button
                      key={lbl.id}
                      onClick={() => !checked && setActiveLabel(lbl.id)}
                      disabled={checked}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '20px',
                        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-light)'}`,
                        background: isSelected ? 'var(--accent-bg)' : 'var(--surface)',
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                        cursor: checked ? 'not-allowed' : 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lbl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Labeling Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', flex: 1 }}>
              
              {/* Dicot (Chickpea) Split Labeling */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-heading)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🫘 Dicot (Chickpea Split Open)</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interactive Dissection Diagram</span>
                </h4>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '260px' }}>
                  <svg width="100%" height="240px" viewBox="0 0 300 130" style={{ overflow: 'visible' }}>
                    <defs>
                      <radialGradient id="dicotCot" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fefae0" />
                        <stop offset="90%" stopColor="#faedcd" />
                        <stop offset="100%" stopColor="#e9c46a" />
                      </radialGradient>
                    </defs>

                    {/* Connection Lines with terminal dots pointing to anatomical structures */}
                    {/* Cotyledon line */}
                    <line x1="105" y1="72" x2="100" y2="80" stroke="#d4a373" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="100" cy="80" r="3" fill="#d4a373" stroke="#fff" strokeWidth="1" />

                    {/* Plumule line */}
                    <line x1="195" y1="32" x2="147" y2="47" stroke="#2a9d8f" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="147" cy="47" r="3" fill="#2a9d8f" stroke="#fff" strokeWidth="1" />

                    {/* Radicle line */}
                    <line x1="195" y1="97" x2="148" y2="87" stroke="#e76f51" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="148" cy="87" r="3" fill="#e76f51" stroke="#fff" strokeWidth="1" />

                    {/* Left Cotyledon */}
                    <g transform="translate(55, 15)">
                      <ellipse cx="45" cy="88" rx="35" ry="6" fill="rgba(0,0,0,0.08)" />
                      <path d="M 35 15 Q 10 40 12 65 Q 15 80 35 80 Q 55 80 58 65 Q 60 40 35 15 Z" fill="url(#dicotCot)" stroke="#d4a373" strokeWidth="1.5" />
                    </g>

                    {/* Right Cotyledon */}
                    <g transform="translate(125, 15)">
                      <ellipse cx="45" cy="88" rx="35" ry="6" fill="rgba(0,0,0,0.08)" />
                      <path d="M 35 15 Q 10 40 12 65 Q 15 80 35 80 Q 55 80 58 65 Q 60 40 35 15 Z" fill="url(#dicotCot)" stroke="#d4a373" strokeWidth="1.5" />
                      
                      {/* Embryo Structure (detailed Plumule and Radicle) */}
                      <g transform="translate(10, 38)">
                        {/* Plumule (shoot) */}
                        <path d="M 12 -5 Q 22 -15 15 -25 Q 10 -15 12 -5" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="1" />
                        <path d="M 12 -5 Q 2 -15 9 -25 Q 14 -15 12 -5" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="1" />
                        {/* Radicle (root) */}
                        <path d="M 12 -5 Q 15 5 18 15 Q 12 10 12 -5" fill="#ffffff" stroke="#e76f51" strokeWidth="1" />
                        <circle cx="12" cy="-5" r="2.5" fill="#f4a261" />
                      </g>
                    </g>

                    {/* Native SVG Label Anchors */}
                    {renderSvgAnchorBox('chickpea', 'cotyledon', 'Cotyledon', 10, 60)}
                    {renderSvgAnchorBox('chickpea', 'plumule', 'Plumule', 195, 20)}
                    {renderSvgAnchorBox('chickpea', 'radicle', 'Radicle', 195, 85)}
                  </svg>
                </div>
              </div>

              {/* Monocot (Maize) Longitudinal Section Labeling */}
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-heading)', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🌽 Monocot (Maize Slice cut)</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interactive Dissection Diagram</span>
                </h4>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '260px' }}>
                  <svg width="100%" height="240px" viewBox="0 0 300 130" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="endospermLabGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffe494" />
                        <stop offset="100%" stopColor="#ffd166" />
                      </linearGradient>
                      <radialGradient id="scutGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e9ecef" />
                      </radialGradient>
                    </defs>

                    {/* Connection Lines with terminal dots pointing to anatomical structures */}
                    {/* Endosperm line */}
                    <line x1="105" y1="32" x2="170" y2="46" stroke="#ca6702" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="170" cy="46" r="3" fill="#ca6702" stroke="#fff" strokeWidth="1" />

                    {/* Single Cotyledon line */}
                    <line x1="105" y1="92" x2="150" y2="75" stroke="#708090" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="150" cy="75" r="3" fill="#708090" stroke="#fff" strokeWidth="1" />

                    {/* Embryo line */}
                    <line x1="195" y1="67" x2="170" y2="85" stroke="#2a9d8f" strokeWidth="1.2" strokeDasharray="3 2" />
                    <circle cx="170" cy="85" r="3" fill="#2a9d8f" stroke="#fff" strokeWidth="1" />

                    {/* Sliced Maize kernel */}
                    <g transform="translate(105, 15)">
                      <ellipse cx="65" cy="98" rx="35" ry="6" fill="rgba(0,0,0,0.08)" />
                      {/* Sliced Maize kernel outer wall */}
                      <path d="M 65 95 L 38 52 Q 35 24 65 22 Q 95 24 92 52 Z" fill="none" stroke="#fca311" strokeWidth="2.5" />
                      
                      {/* Endosperm (large food deposit) */}
                      <path d="M 65 23 Q 94 25 91 50 Q 75 42 65 48 Q 55 42 39 50 Q 36 25 65 23 Z" fill="url(#endospermLabGrad)" stroke="#ffd166" strokeWidth="0.8" />

                      {/* Shield cotyledon (scutellum) */}
                      <path d="M 39 50 L 65 94 L 91 50 Q 75 45 65 52 Q 55 45 39 50 Z" fill="url(#scutGrad)" stroke="#ced4da" strokeWidth="0.8" />
                      
                      {/* Embryo body */}
                      <g transform="translate(65, 70)">
                        <path d="M -4 -10 Q 0 -22 4 -10 Z" fill="#e9f5db" stroke="#2a9d8f" strokeWidth="0.8" />
                        <path d="M -3 3 Q 0 14 3 3 Z" fill="#ffffff" stroke="#e76f51" strokeWidth="0.8" />
                        <circle cx="0" cy="-3" r="2" fill="#adb5bd" />
                      </g>
                    </g>

                    {/* Native SVG Label Anchors */}
                    {renderSvgAnchorBox('maize', 'endosperm', 'Endosperm', 10, 20)}
                    {renderSvgAnchorBox('maize', 'scutellum', 'Single Cotyledon', 10, 80)}
                    {renderSvgAnchorBox('maize', 'embryo', 'Embryo', 195, 55)}
                  </svg>
                </div>
              </div>

            </div>

            {/* Verification options */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', paddingBottom: '1.5rem' }}>
              {checked && !allCorrect && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  ❌ Some labels are placed incorrectly. Double check the structures and try again!
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                {checked && !allCorrect && (
                  <button className="outline" onClick={() => { setChecked(false); setAllCorrect(false); }} style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem', borderRadius: '8px', cursor: 'pointer' }}>
                    Try Again
                  </button>
                )}
                
                {!checked && (
                  <button
                    disabled={
                      !placedLabels.chickpea.plumule ||
                      !placedLabels.chickpea.radicle ||
                      !placedLabels.chickpea.cotyledon ||
                      !placedLabels.maize.endosperm ||
                      !placedLabels.maize.scutellum ||
                      !placedLabels.maize.embryo
                    }
                    onClick={handleCheckLabeling}
                    style={{
                      padding: '0.65rem 3rem',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      background: 'var(--accent)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    Check Anatomy Labels
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= STEP 4: DISCOVERY & CORRELATION ================= */}
        {step === 'result' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', paddingBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem' }}>🏆</div>
              <h2 style={{ color: 'var(--accent)', margin: '0.25rem 0 0.5rem 0' }}>Grand Discovery Complete!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>You have connected seed structure to plant biology!</p>
            </div>

            {/* The grand correlation textbook visualization */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--accent-border)', borderRadius: '20px', padding: '1.5rem', maxWidth: '680px', width: '100%', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ margin: 0, color: 'var(--accent)', fontSize: '0.95rem', fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🔑 The Seed-Leaf-Root Correlation Rule
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                {/* Dicot board */}
                <div style={{ background: 'var(--surface)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🫘</div>
                  <div style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Dicotyledons (Dicots)</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Cotyledons:</strong>
                      <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>2 Halves</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Leaf Venation:</strong>
                      <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>🕸️ Reticulate</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Root System:</strong>
                      <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>🥕 Taproot</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    Examples: Gram, Chickpea, Pea, Mustard, Neem, Mango, Tulsi, Hibiscus.
                  </div>
                </div>

                {/* Monocot board */}
                <div style={{ background: 'var(--surface)', border: '1px solid rgba(8, 145, 178, 0.2)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🌽</div>
                  <div style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Monocotyledons (Monocots)</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left', background: 'var(--card-bg)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Cotyledons:</strong>
                      <span style={{ color: '#0891b2', fontWeight: 'bold' }}>1 Single</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Leaf Venation:</strong>
                      <span style={{ color: '#0891b2', fontWeight: 'bold' }}>📏 Parallel</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Root System:</strong>
                      <span style={{ color: '#0891b2', fontWeight: 'bold' }}>🌾 Fibrous</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.65rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                    Examples: Maize, Wheat, Rice, Grass, Bamboo, Banana, Banyan, Onion.
                  </div>
                </div>

              </div>
            </div>

            {/* Back options */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="outline" onClick={handleReset} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <RefreshCw size={14} /> Redo Experiment
              </button>
              <button className="primary" onClick={onBackToDashboard} style={{ padding: '0.6rem 2rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', border: 'none', background: 'var(--accent)', color: '#fff' }}>
                Finish Lab ➔
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


