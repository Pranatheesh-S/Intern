import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, ChevronRight, Check, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';
import dicot1Img from '../../../../assets/dicot_1.png';
import monocot1Img from '../../../../assets/monocot_1.png';
import diImg from '../../../../assets/di.png';
import moImg from '../../../../assets/mo.png';
import chickpeaSplitImg from '../../../../assets/chickpea_split.png';
import maizeCutImg from '../../../../assets/maize_cut.png';

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

    let strokeColor = '#0284c7';
    let fillColor = '#f0f9ff';
    let textColor = '#0369a1';

    if (isCorrect) {
      strokeColor = '#16a34a';
      fillColor = '#dcfce7';
      textColor = '#15803d';
    } else if (isWrong) {
      strokeColor = '#dc2626';
      fillColor = '#fee2e2';
      textColor = '#b91c1c';
    } else if (placed) {
      strokeColor = '#0284c7';
      fillColor = '#e0f2fe';
      textColor = '#0369a1';
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
          strokeWidth={placed ? 1.8 : 1.4}
          strokeDasharray={placed ? 'none' : '3 2'}
        />
        <text
          x={x + width / 2 - (placed && !checked ? 4 : 0)}
          y={y + height / 2 + 3}
          textAnchor="middle"
          fontSize="8"
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundImage: `url(${darkForestBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      
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
      <div style={{ background: '#071A33', borderBottom: '1.5px solid #1e3a8a', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <button onClick={onBackToDashboard} style={{ background: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid #38bdf8', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 800, padding: '0.45rem 0.9rem', borderRadius: '8px' }}>
            <ArrowLeft size={18} color="#38bdf8" /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.95rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Activity 2.8 — Science Lab</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginTop: '0.1rem' }}>🌱 Seed Dissection & Anatomy Station</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: '#0f2744', border: '1.5px solid #38bdf8', color: '#ffffff', padding: '0.5rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800', boxShadow: '0 2px 10px rgba(56, 189, 248, 0.25)' }}>
          <RefreshCw size={15} color="#38bdf8" /> Restart Lab
        </button>
      </div>

      {/* Steps Progress Indicator */}
      <div style={{ background: '#071A33', padding: '0.85rem 1.75rem', display: 'flex', gap: '0.65rem', alignItems: 'center', borderBottom: '1.5px solid #1e3a8a', zIndex: 5 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', opacity: i <= stepIndex ? 1 : 0.7 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: i < stepIndex ? '#16a34a' : i === stepIndex ? '#2563eb' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', border: i === stepIndex ? '2.5px solid #38bdf8' : i < stepIndex ? '2px solid #4ade80' : '1.5px solid #334155', color: '#fff', fontWeight: 'bold', transition: 'all 0.3s' }}>
                {i < stepIndex ? '✓' : s.icon}
              </div>
              <span style={{ fontSize: '0.95rem', color: i === stepIndex ? '#38bdf8' : i < stepIndex ? '#4ade80' : '#cbd5e1', fontWeight: i === stepIndex ? '900' : '700' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < stepIndex ? '#16a34a' : '#1e3a8a', transition: 'background 0.5s', minWidth: 15 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Main Sandbox */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto' }}>
        
        {/* Step Guide Text */}
        <div style={{ background: '#081C36', border: '1.5px solid #1e3a8a', borderRadius: '14px', padding: '0.9rem 1.4rem', display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '2rem' }}>{currentStep?.icon || '🔬'}</div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#38bdf8' }}>{STEPS[stepIndex]?.label}</div>
            <div style={{ fontSize: '1.02rem', fontWeight: '600', color: '#f8fafc', marginTop: '0.15rem', lineHeight: '1.5' }}>{STEPS[stepIndex]?.desc}</div>
          </div>
        </div>

        {/* ================= STEP 1: SOAK SEEDS ================= */}
        {step === 'soak' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#071A33', border: '1.5px solid #1e3a8a', borderRadius: '18px', padding: '1.75rem 2.5rem', maxWidth: '660px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.35rem', boxShadow: '0 12px 36px rgba(0,0,0,0.45)' }}>
              
              {/* Day Badge */}
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: '900', background: soakProgress >= 100 ? 'rgba(22, 163, 74, 0.25)' : 'rgba(37, 99, 235, 0.3)', color: soakProgress >= 100 ? '#4ade80' : '#38bdf8', border: soakProgress >= 100 ? '1.5px solid #4ade80' : '1.5px solid #38bdf8', padding: '0.45rem 1.1rem', borderRadius: '20px', transition: 'all 0.3s' }}>
                  {soakProgress >= 100 ? '✅ Swelling Complete' : `📅 Day ${dayCount}`}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff' }}>Hydration: {soakProgress}%</span>
              </div>

              {/* 3D Beaker SVG */}
              <div style={{ width: 220, height: 260, position: 'relative' }}>
                <svg width="220" height="260" viewBox="0 0 220 260" style={{ overflow: 'visible' }}>
                  <defs>
                    {/* Shadow blur filter */}
                    <filter id="seedShadowBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
                    </filter>

                    {/* Wet specular sheen gradient */}
                    <linearGradient id="wetSheen" x1="0%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </linearGradient>

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

                    {/* REALISTIC CHICKPEA (DICOT) GRADIENTS */}
                    <radialGradient id="realChickpeaGrad" cx="38%" cy="32%" r="68%">
                      <stop offset="0%" stopColor={soakProgress > 50 ? '#fdf4e2' : '#f5dfb8'} />
                      <stop offset="25%" stopColor={soakProgress > 50 ? '#f3d9a9' : '#e6c38a'} />
                      <stop offset="60%" stopColor={soakProgress > 50 ? '#dbaa6c' : '#c89254'} />
                      <stop offset="85%" stopColor={soakProgress > 50 ? '#b87f43' : '#a76a33'} />
                      <stop offset="100%" stopColor={soakProgress > 50 ? '#7d491f' : '#6f3d17'} />
                    </radialGradient>

                    <linearGradient id="chickpeaLeftLobe" x1="0%" y1="0%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor="#fef3db" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#b67a3f" stopOpacity="0.4" />
                    </linearGradient>

                    <linearGradient id="chickpeaRightLobe" x1="100%" y1="0%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor="#fae2b6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#965d28" stopOpacity="0.4" />
                    </linearGradient>

                    {/* REALISTIC MAIZE (MONOCOT) GRADIENTS */}
                    <radialGradient id="realMaizeGrad" cx="44%" cy="28%" r="72%">
                      <stop offset="0%" stopColor={soakProgress > 50 ? '#fff8cc' : '#feed82'} />
                      <stop offset="25%" stopColor={soakProgress > 50 ? '#fdd84d' : '#f7c325'} />
                      <stop offset="60%" stopColor={soakProgress > 50 ? '#f59e0b' : '#ea8c06'} />
                      <stop offset="85%" stopColor={soakProgress > 50 ? '#d97706' : '#c26200'} />
                      <stop offset="100%" stopColor={soakProgress > 50 ? '#8c3d00' : '#78350f'} />
                    </radialGradient>

                    <linearGradient id="maizeCrownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fffde8" />
                      <stop offset="100%" stopColor="#fde047" />
                    </linearGradient>

                    <linearGradient id="maizeEmbryoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#fef9c3" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#fef08a" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>

                  {/* shadow under beaker */}
                  <ellipse cx="110" cy="245" rx="75" ry="12" fill="rgba(0,0,0,0.25)" />

                  {/* Volumetric marks behind beaker fill */}
                  <g stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
                    <line x1="165" y1="110" x2="178" y2="110" />
                    <line x1="165" y1="150" x2="175" y2="150" />
                    <line x1="165" y1="190" x2="178" y2="190" />
                  </g>
                  
                  {/* Liquid (meniscus and body) clipping beaker boundaries */}
                  <g>
                    <path d="M 46 238 L 46 130 Q 110 126 174 130 L 174 238 Q 110 244 46 238 Z" fill="url(#liquidGrad)" />
                    <ellipse cx="110" cy="130" rx="64" ry="7" fill="#bae6fd" opacity="0.5" />
                  </g>

                  {/* Volumetric labels */}
                  <g fill="#ffffff" fontSize="11" fontWeight="bold">
                    <text x="184" y="113">200ml</text>
                    <text x="182" y="153">150ml</text>
                    <text x="184" y="193">100ml</text>
                  </g>

                  {/* Volumetric scale line */}
                  <line x1="165" y1="80" x2="165" y2="220" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                  {/* ================= REALISTIC SOAKED SEEDS IN WATER ================= */}
                  
                  {/* --- 1. CHICKPEA (DICOT) --- */}
                  {/* Underwater soft shadow on beaker base */}
                  <ellipse cx="78" cy="226" rx="20" ry="5.5" fill="rgba(2, 28, 60, 0.55)" filter="url(#seedShadowBlur)" />

                  {/* Realistic Swollen Chickpea Seed */}
                  <g transform={`translate(78, 198) scale(${1 + (soakProgress * 0.0035)}) translate(-78, -198)`}>
                    {/* Base 3D Seed Body */}
                    <path
                      d="M 78 172 C 72 177 63 187 61 200 C 59 213 67 225 78 226 C 89 225 97 213 95 200 C 93 187 84 177 78 172 Z"
                      fill="url(#realChickpeaGrad)"
                      stroke="#8c5828"
                      strokeWidth="0.8"
                    />

                    {/* Left Cotyledon Lobe with realistic curvature */}
                    <path
                      d="M 77 176 C 70 182 63 192 63 203 C 63 216 71 223 77 225 C 75 215 75 194 77 176 Z"
                      fill="url(#chickpeaLeftLobe)"
                      opacity="0.8"
                    />

                    {/* Right Cotyledon Lobe */}
                    <path
                      d="M 79 176 C 86 182 93 192 93 203 C 93 216 85 223 79 225 C 81 215 81 194 79 176 Z"
                      fill="url(#chickpeaRightLobe)"
                      opacity="0.85"
                    />

                    {/* Cotyledon Division Crease Line */}
                    <path
                      d="M 78 178 Q 76 202 78 224"
                      fill="none"
                      stroke="#78471e"
                      strokeWidth="0.9"
                      opacity="0.55"
                    />

                    {/* Micropyle & Hilum anatomical eye at the rostrum peak */}
                    <ellipse cx="78" cy="179" rx="2.5" ry="3.5" fill="#42250d" />
                    <circle cx="78" cy="178.5" r="1.2" fill="#fffdf5" opacity="0.9" />

                    {/* Soft hydrated seed coat wrinkles (softens as hydration completes) */}
                    <path
                      d="M 66 196 Q 70 205 67 214 M 90 196 Q 86 205 89 214 M 71 216 Q 78 221 85 216"
                      fill="none"
                      stroke="#a8743d"
                      strokeWidth="0.65"
                      opacity={Math.max(0.2, 0.7 - (soakProgress / 180))}
                      strokeLinecap="round"
                    />

                    {/* Wet specular glossy sheen & surface highlights */}
                    <path
                      d="M 77 173 Q 79 173 79 175 Q 77 176 77 173 Z"
                      fill="#ffffff"
                      opacity="0.85"
                    />
                    <path
                      d="M 66 188 C 64 194 65 204 68 210 C 67 203 66 195 68 189 Z"
                      fill="url(#wetSheen)"
                      opacity="0.8"
                    />
                    <ellipse cx="87" cy="197" rx="2.2" ry="7" transform="rotate(15 87 197)" fill="#ffffff" opacity="0.4" />

                    {/* Underwater Cyan Caustic / Refraction Rim */}
                    <path
                      d="M 61 200 C 59 213 67 225 78 226 C 89 225 97 213 95 200"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth="1.1"
                      opacity="0.5"
                    />
                  </g>
                  <text x="45" y="242" fill="#ffffff" fontSize="11" fontWeight="bold">Chickpea (Dicot)</text>

                  {/* --- 2. MAIZE (MONOCOT) --- */}
                  {/* Underwater soft shadow on beaker base */}
                  <ellipse cx="138" cy="226" rx="19" ry="5.5" fill="rgba(2, 28, 60, 0.55)" filter="url(#seedShadowBlur)" />

                  {/* Realistic Swollen Maize Kernel */}
                  <g transform={`translate(138, 198) scale(${1 + (soakProgress * 0.0022)}) translate(-138, -198)`}>
                    {/* Base 3D Kernel Wedge Body */}
                    <path
                      d="M 138 226 L 125 194 Q 123 173 138 172 Q 153 173 151 194 Z"
                      fill="url(#realMaizeGrad)"
                      stroke="#b86b02"
                      strokeWidth="0.8"
                    />

                    {/* Golden Crown Cap at Top Rim */}
                    <path
                      d="M 125 177 Q 138 171 151 177 Q 138 180 125 177 Z"
                      fill="url(#maizeCrownGrad)"
                      opacity="0.9"
                    />

                    {/* Pedicel / Tip Cap at Base */}
                    <path
                      d="M 134 223 L 138 227 L 142 223 Q 138 221 134 223 Z"
                      fill="#8b572a"
                      stroke="#5c3818"
                      strokeWidth="0.5"
                    />

                    {/* Shield-shaped Scutellum & Embryo Structure visible under translucent coat */}
                    <path
                      d="M 138 223 L 130 199 Q 138 191 146 199 Z"
                      fill="url(#maizeEmbryoGrad)"
                      stroke="rgba(217, 119, 6, 0.4)"
                      strokeWidth="0.6"
                      opacity="0.88"
                    />
                    {/* Embryo axis ridge */}
                    <path
                      d="M 138 221 L 137 200 Q 138 196 139 200 L 138 221"
                      fill="#ffffff"
                      opacity="0.8"
                    />

                    {/* Wet Glossy Surface Specular Highlights */}
                    <path
                      d="M 127 181 C 125 187 126 197 129 205 C 127 197 127 188 129 183 Z"
                      fill="url(#wetSheen)"
                      opacity="0.85"
                    />
                    <path
                      d="M 149 183 C 151 189 150 199 147 207 C 148 199 149 189 147 185 Z"
                      fill="#ffffff"
                      opacity="0.4"
                    />
                    <ellipse cx="138" cy="175.5" rx="6" ry="1.5" fill="#ffffff" opacity="0.7" />

                    {/* Underwater Cyan Caustic / Refraction Rim */}
                    <path
                      d="M 125 194 Q 123 173 138 172 Q 153 173 151 194 L 138 226 Z"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth="1.1"
                      opacity="0.45"
                    />
                  </g>
                  <text x="120" y="242" fill="#ffffff" fontSize="11" fontWeight="bold">Maize (Monocot)</text>

                  {/* Beaker Glass Structure (Overlayed to show reflections) */}
                  <path d="M 38 60 Q 32 60 34 50 Q 38 35 48 35 L 172 35 Q 182 35 186 50 Q 188 60 182 60 Z" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" />
                  <path d="M 38 52 Q 24 50 36 60" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
                  <path d="M 44 58 L 44 235 Q 44 246 56 246 L 164 246 Q 176 246 176 235 L 176 58" fill="url(#beakerGlass)" stroke="rgba(255,255,255,0.6)" strokeWidth="3.5" />

                  {/* Rising Water Bubbles (Only animate during active soaking) */}
                  {soaking && (
                    <g fill="#bae6fd" opacity="0.6">
                      <circle cx="85" cy="180" r="2.5" className="bubble-1" />
                      <circle cx="130" cy="175" r="1.8" className="bubble-2" />
                      <circle cx="95" cy="160" r="3.2" className="bubble-3" />
                      <circle cx="140" cy="165" r="2.2" className="bubble-4" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Progress and controls */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: 14, background: '#0f172a', borderRadius: '10px', overflow: 'hidden', width: '100%', border: '1.5px solid #1e3a8a' }}>
                  <div className={soaking ? "shimmer-bg" : ""} style={{ height: '100%', background: 'linear-gradient(90deg, #38bdf8, #2563eb)', width: `${soakProgress}%`, transition: 'width 0.1s ease', borderRadius: '10px' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
                  {soakProgress < 100 ? (
                    <button className="primary" onClick={handleStartSoak} disabled={soaking} style={{ padding: '0.85rem 3rem', fontSize: '1.05rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', background: soaking ? '#334155' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', cursor: soaking ? 'not-allowed' : 'pointer', border: soaking ? '1.5px solid #475569' : '1.5px solid #38bdf8', color: '#fff', borderRadius: '10px', boxShadow: soaking ? 'none' : '0 6px 20px rgba(37, 99, 235, 0.4)' }}>
                      {soaking ? '⏳ Day by Day Hydration...' : '💧 Start Soaking (3 Days)'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ color: '#4ade80', fontWeight: '800', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>✨ Seeds are swollen & seed coats are soft! Ready to dissect.</span>
                      </div>
                      <button className="primary" onClick={() => setStep('peel')} style={{ padding: '0.85rem 3rem', fontSize: '1.05rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1.5px solid #4ade80', color: '#fff', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(22, 163, 74, 0.4)' }}>
                        Proceed to Dissection Tray <ChevronRight size={18} />
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
            <div style={{ background: '#071A33', border: `1.5px solid ${peeled.chickpea ? '#22c55e' : '#1e3a8a'}`, borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', boxShadow: '0 12px 36px rgba(0,0,0,0.45)', transition: 'border 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1.5px solid #1e3a8a', paddingBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>Dicot Specimen</span>
                <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ffffff' }}>Chickpea (Gram)</span>
              </div>

              {/* Dissection Visualization Area */}
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b2347', borderRadius: '14px', border: '1.5px solid #1e3a8a', position: 'relative', overflow: 'hidden', padding: '0.75rem' }}>
                <img
                  src={!peeled.chickpea ? dicot1Img : diImg}
                  alt={!peeled.chickpea ? "Dicot Chickpea Seed" : "Dicot Peeled & Split"}
                  style={{
                    maxHeight: '180px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    cursor: !peeled.chickpea ? 'pointer' : 'default',
                    transition: 'transform 0.3s ease',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  }}
                  onClick={() => !peeled.chickpea && setPeeled(p => ({ ...p, chickpea: true }))}
                />

                {!peeled.chickpea && (
                  <button onClick={() => setPeeled(p => ({ ...p, chickpea: true }))} style={{ position: 'absolute', bottom: 12, padding: '0.55rem 1.3rem', fontSize: '0.95rem', fontWeight: '900', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: '1.5px solid #38bdf8', color: '#fff', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
                    🔓 Peel & Split Seed
                  </button>
                )}
              </div>

              {/* Description */}
              {peeled.chickpea ? (
                <div style={{ background: 'rgba(22, 163, 74, 0.25)', color: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '12px', padding: '0.85rem 1.15rem', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left', width: '100%', fontWeight: '600' }}>
                  <strong style={{ color: '#4ade80' }}>Observation:</strong> The seed coat peeled off smoothly, and the chickpea split easily into <strong style={{ color: '#4ade80' }}>TWO equal halves</strong> (cotyledons). It is a <strong style={{ color: '#4ade80' }}>Dicotyledon (Dicot)</strong>!
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#cbd5e1' }}>Click the button or seed to peel the coat and investigate the structure.</div>
              )}
            </div>

            {/* Maize Card */}
            <div style={{ background: '#071A33', border: `1.5px solid ${peeled.maize ? '#22c55e' : '#1e3a8a'}`, borderRadius: '18px', padding: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', boxShadow: '0 12px 36px rgba(0,0,0,0.45)', transition: 'border 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderBottom: '1.5px solid #1e3a8a', paddingBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>Monocot Specimen</span>
                <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#ffffff' }}>Maize (Corn)</span>
              </div>

              {/* Dissection Visualization Area */}
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b2347', borderRadius: '14px', border: '1.5px solid #1e3a8a', position: 'relative', overflow: 'hidden', padding: '0.75rem' }}>
                <img
                  src={!peeled.maize ? monocot1Img : moImg}
                  alt={!peeled.maize ? "Monocot Maize Kernel" : "Monocot Peeled"}
                  style={{
                    maxHeight: '180px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    cursor: !peeled.maize ? 'pointer' : 'default',
                    transition: 'transform 0.3s ease',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  }}
                  onClick={() => !peeled.maize && setPeeled(p => ({ ...p, maize: true }))}
                />

                {!peeled.maize && (
                  <button onClick={() => setPeeled(p => ({ ...p, maize: true }))} style={{ position: 'absolute', bottom: 12, padding: '0.55rem 1.3rem', fontSize: '0.95rem', fontWeight: '900', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: '1.5px solid #38bdf8', color: '#fff', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}>
                    🔓 Peel Outer Layer
                  </button>
                )}
              </div>

              {/* Description */}
              {peeled.maize ? (
                <div style={{ background: 'rgba(22, 163, 74, 0.25)', color: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '12px', padding: '0.85rem 1.15rem', fontSize: '0.95rem', lineHeight: '1.6', textAlign: 'left', width: '100%', fontWeight: '600' }}>
                  <strong style={{ color: '#4ade80' }}>Observation:</strong> In maize, the seed coat is fused with the fruit wall. It cannot be split into two. It has only <strong style={{ color: '#4ade80' }}>ONE single cotyledon</strong>! It is a <strong style={{ color: '#4ade80' }}>Monocotyledon (Monocots)</strong>.
                </div>
              ) : (
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#cbd5e1' }}>Click the button or seed to peel the coat and investigate the structure.</div>
              )}
            </div>

            {/* Bottom Proceed bar */}
            {peeled.chickpea && peeled.maize && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: '0.75rem', paddingBottom: '1.25rem' }}>
                <button className="primary" onClick={() => setStep('compare')} style={{ padding: '0.85rem 3.5rem', fontSize: '1.05rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid #38bdf8', color: '#fff', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)' }}>
                  Proceed to Labeling Station <ChevronRight size={18} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ================= STEP 3: LABEL ANATOMY ================= */}
        {step === 'compare' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Instruction banner */}
            <div style={{ background: 'rgba(37, 99, 235, 0.25)', border: '1.5px solid #38bdf8', borderRadius: '12px', padding: '0.8rem 1.25rem', fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Info size={20} color="#38bdf8" />
              <span><strong style={{ color: '#38bdf8' }}>How to Label:</strong> First select a label tag from the toolbar below, then click the correct dotted box on the seed diagrams to place it.</span>
            </div>

            {/* Label Selector Toolbar */}
            <div style={{ background: '#071A33', border: '1.5px solid #1e3a8a', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.05em' }}>Anatomical Labels</span>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                {LABELS.map(lbl => {
                  const isSelected = activeLabel === lbl.id;
                  return (
                    <button
                      key={lbl.id}
                      onClick={() => !checked && setActiveLabel(lbl.id)}
                      disabled={checked}
                      style={{
                        padding: '0.55rem 1.1rem',
                        borderRadius: '20px',
                        border: `1.5px solid ${isSelected ? '#38bdf8' : '#1e3a8a'}`,
                        background: isSelected ? '#2563eb' : '#0f2744',
                        color: '#ffffff',
                        cursor: checked ? 'not-allowed' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.4)' : 'none'
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
              <div style={{ background: '#071A33', border: '1.5px solid #1e3a8a', borderRadius: '18px', padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.95rem', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: '900', borderBottom: '1.5px solid #1e3a8a', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🫘 Dicot (Chickpea Split Open)</span>
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700' }}>Interactive Diagram</span>
                </h4>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '12px', border: '1.5px solid #1e3a8a', minHeight: '260px' }}>
                  <svg width="100%" height="240px" viewBox="0 0 300 130" style={{ overflow: 'visible' }}>
                    {/* Real Chickpea Split Image Asset */}
                    <image
                      href={chickpeaSplitImg}
                      x="70"
                      y="10"
                      width="125"
                      height="110"
                      preserveAspectRatio="xMidYMid meet"
                    />

                    {/* Connection Lines with terminal dots */}
                    <line x1="105" y1="72" x2="100" y2="76" stroke="#d4a373" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="100" cy="76" r="3" fill="#d4a373" stroke="#fff" strokeWidth="1" />

                    <line x1="195" y1="32" x2="152" y2="28" stroke="#2a9d8f" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="152" cy="28" r="3" fill="#2a9d8f" stroke="#fff" strokeWidth="1" />

                    <line x1="195" y1="97" x2="152" y2="92" stroke="#e76f51" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="152" cy="92" r="3" fill="#e76f51" stroke="#fff" strokeWidth="1" />

                    {/* Native SVG Label Anchors */}
                    {renderSvgAnchorBox('chickpea', 'cotyledon', 'Cotyledon', 10, 60)}
                    {renderSvgAnchorBox('chickpea', 'plumule', 'Plumule', 195, 20)}
                    {renderSvgAnchorBox('chickpea', 'radicle', 'Radicle', 195, 85)}
                  </svg>
                </div>
              </div>

              {/* Monocot (Maize) Longitudinal Section Labeling */}
              <div style={{ background: '#071A33', border: '1.5px solid #1e3a8a', borderRadius: '18px', padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.95rem', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.35)' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: '900', borderBottom: '1.5px solid #1e3a8a', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🌽 Monocot (Maize Slice cut)</span>
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700' }}>Interactive Diagram</span>
                </h4>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '12px', border: '1.5px solid #1e3a8a', minHeight: '260px' }}>
                  <svg width="100%" height="240px" viewBox="0 0 300 130" style={{ overflow: 'visible' }}>
                    {/* Real Maize Cut Image Asset */}
                    <image
                      href={maizeCutImg}
                      x="98"
                      y="8"
                      width="104"
                      height="114"
                      preserveAspectRatio="xMidYMid meet"
                    />

                    {/* Connection Lines with terminal dots */}
                    <line x1="105" y1="32" x2="135" y2="36" stroke="#ca6702" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="135" cy="36" r="3" fill="#ca6702" stroke="#fff" strokeWidth="1" />

                    <line x1="105" y1="92" x2="138" y2="82" stroke="#708090" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="138" cy="82" r="3" fill="#708090" stroke="#fff" strokeWidth="1" />

                    <line x1="195" y1="67" x2="160" y2="68" stroke="#2a9d8f" strokeWidth="1.4" strokeDasharray="3 2" />
                    <circle cx="160" cy="68" r="3" fill="#2a9d8f" stroke="#fff" strokeWidth="1" />

                    {/* Native SVG Label Anchors */}
                    {renderSvgAnchorBox('maize', 'endosperm', 'Endosperm', 10, 20)}
                    {renderSvgAnchorBox('maize', 'scutellum', 'Single Cotyledon', 10, 80)}
                    {renderSvgAnchorBox('maize', 'embryo', 'Embryo', 195, 55)}
                  </svg>
                </div>
              </div>

            </div>

            {/* Verification options */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', marginTop: '0.75rem', paddingBottom: '1.5rem' }}>
              {checked && !allCorrect && (
                <div style={{ color: '#ef4444', fontSize: '1rem', fontWeight: '800', background: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #ef4444', padding: '0.5rem 1.25rem', borderRadius: '8px' }}>
                  ❌ Some labels are placed incorrectly. Double check the structures and try again!
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                {checked && !allCorrect && (
                  <button className="outline" onClick={() => { setChecked(false); setAllCorrect(false); }} style={{ padding: '0.65rem 2rem', fontSize: '0.95rem', fontWeight: '800', borderRadius: '8px', cursor: 'pointer', background: '#0f2744', border: '1.5px solid #38bdf8', color: '#ffffff' }}>
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
                      padding: '0.85rem 3.5rem',
                      fontSize: '1.05rem',
                      fontWeight: '900',
                      borderRadius: '10px',
                      border: '1.5px solid #38bdf8',
                      color: '#fff',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      cursor: (
                        !placedLabels.chickpea.plumule ||
                        !placedLabels.chickpea.radicle ||
                        !placedLabels.chickpea.cotyledon ||
                        !placedLabels.maize.endosperm ||
                        !placedLabels.maize.scutellum ||
                        !placedLabels.maize.embryo
                      ) ? 'not-allowed' : 'pointer',
                      opacity: (
                        !placedLabels.chickpea.plumule ||
                        !placedLabels.chickpea.radicle ||
                        !placedLabels.chickpea.cotyledon ||
                        !placedLabels.maize.endosperm ||
                        !placedLabels.maize.scutellum ||
                        !placedLabels.maize.embryo
                      ) ? 0.5 : 1,
                      boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
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
              <div style={{ fontSize: '3.2rem' }}>🏆</div>
              <h2 style={{ color: '#38bdf8', margin: '0.25rem 0 0.5rem 0', fontSize: '1.65rem', fontWeight: '900' }}>Grand Discovery Complete!</h2>
              <p style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>You have connected seed structure to plant biology!</p>
            </div>

            {/* The grand correlation textbook visualization */}
            <div style={{ background: '#071A33', border: '1.5px solid #1e3a8a', borderRadius: '22px', padding: '2.25rem 2.5rem', maxWidth: '960px', width: '100%', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1.45rem', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                🔑 The Seed-Leaf-Root Correlation Rule
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
                
                {/* Dicot board */}
                <div style={{ background: '#0b2347', border: '1.5px solid #1e3a8a', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🫘</div>
                    <div style={{ color: '#a78bfa', fontWeight: '900', fontSize: '1.45rem', marginBottom: '0.6rem' }}>Dicotyledons (Dicots)</div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '1.15rem', color: '#ffffff', textAlign: 'left', background: '#071A33', padding: '1.25rem 1.4rem', borderRadius: '12px', border: '1.5px solid #1e3a8a', marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Cotyledons:</strong>
                        <span style={{ color: '#a78bfa', fontWeight: '900' }}>2 Halves</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Leaf Venation:</strong>
                        <span style={{ color: '#a78bfa', fontWeight: '900' }}>🕸️ Reticulate</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Root System:</strong>
                        <span style={{ color: '#a78bfa', fontWeight: '900' }}>🥕 Taproot</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.05rem', color: '#cbd5e1', marginTop: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, fontWeight: '600' }}>
                    Examples: Gram, Chickpea, Pea, Mustard, Neem, Mango, Tulsi, Hibiscus.
                  </div>
                </div>

                {/* Monocot board */}
                <div style={{ background: '#0b2347', border: '1.5px solid #1e3a8a', borderRadius: '16px', padding: '1.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌽</div>
                    <div style={{ color: '#38bdf8', fontWeight: '900', fontSize: '1.45rem', marginBottom: '0.6rem' }}>Monocotyledons (Monocots)</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '1.15rem', color: '#ffffff', textAlign: 'left', background: '#071A33', padding: '1.25rem 1.4rem', borderRadius: '12px', border: '1.5px solid #1e3a8a', marginTop: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Cotyledons:</strong>
                        <span style={{ color: '#38bdf8', fontWeight: '900' }}>1 Single</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Leaf Venation:</strong>
                        <span style={{ color: '#38bdf8', fontWeight: '900' }}>📏 Parallel</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#cbd5e1' }}>Root System:</strong>
                        <span style={{ color: '#38bdf8', fontWeight: '900' }}>🌾 Fibrous</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '1.05rem', color: '#cbd5e1', marginTop: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, fontWeight: '600' }}>
                    Examples: Maize, Wheat, Rice, Grass, Bamboo, Banana, Banyan, Onion.
                  </div>
                </div>

              </div>
            </div>

            {/* Back options */}
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <button className="outline" onClick={handleReset} style={{ padding: '0.75rem 1.75rem', borderRadius: '10px', fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#0f2744', border: '1.5px solid #38bdf8', color: '#ffffff', cursor: 'pointer' }}>
                <RefreshCw size={16} color="#38bdf8" /> Redo Experiment
              </button>
              <button className="primary" onClick={onBackToDashboard} style={{ padding: '0.75rem 2.5rem', borderRadius: '10px', fontSize: '1.05rem', fontWeight: '900', border: '1.5px solid #38bdf8', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)' }}>
                Finish Lab ➔
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


