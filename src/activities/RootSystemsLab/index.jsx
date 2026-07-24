import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';

const PLANTS = [
  { id: 'mustard', name: 'Mustard', emoji: '🌼', rootType: 'taproot', rootColor: '#b45309', potColor: '#b45309',
    desc: 'One thick main root (taproot) going deep into the soil, with many small side roots branching from it.',
    stemColor: '#16a34a', leaves: 3 },
  { id: 'grass', name: 'Common Grass', emoji: '🌾', rootType: 'fibrous', rootColor: '#4d7c0f', potColor: '#65a30d',
    desc: 'Many thin, hair-like roots of roughly equal thickness arising from the base — called fibrous roots.',
    stemColor: '#22c55e', leaves: 5 },
  { id: 'hibiscus', name: 'Hibiscus', emoji: '🌺', rootType: 'taproot', rootColor: '#92400e', potColor: '#c2410c',
    desc: 'A clear taproot system — one dominant root going deep with many lateral (side) roots.',
    stemColor: '#15803d', leaves: 4 },
  { id: 'wheat', name: 'Wheat', emoji: '🌾', rootType: 'fibrous', rootColor: '#78350f', potColor: '#d97706',
    desc: 'Dense fibrous root system — a bunch of equally thin roots spreading out from the stem base.',
    stemColor: '#ca8a04', leaves: 4 },
  { id: 'marigold', name: 'Marigold', emoji: '🌼', rootType: 'taproot', rootColor: '#9a3412', potColor: '#ea580c',
    desc: 'Taproot system with one main root and fine lateral roots — easily visible when the plant is dug up.',
    stemColor: '#15803d', leaves: 3 },
];

const ROOT_LABELS = [
  { id: 'taproot', label: 'Taproot System', icon: '🥕', color: '#f59e0b', desc: 'One thick main root + side branches' },
  { id: 'fibrous', label: 'Fibrous Root System', icon: '🌾', color: '#84cc16', desc: 'Many thin, equal roots from base' },
];

export default function RootSystemsLab({ onBackToDashboard }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [digProgress, setDigProgress] = useState({});
  const [digging, setDigging] = useState(null);
  const [washed, setWashed] = useState({});
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [allDone, setAllDone] = useState(false);

  const plant = PLANTS.find(p => p.id === selectedPlant);
  const progress = digProgress[selectedPlant] || 0;
  const isFullyDug = progress >= 100;
  const isWashed = washed[selectedPlant];
  const doneCount = Object.keys(checked).filter(k => checked[k]).length;

  const containerBg = isLight ? '#fdfaf6' : '#1a0f05';
  const textColor = isLight ? '#451a03' : '#fef3c7';
  const textMuted = isLight ? '#7c2d12' : '#92400e';
  const textFaint = isLight ? '#9a3412' : '#78350f';
  
  const sidebarBg = isLight ? '#fbf4eb' : '#120b03';
  const sidebarBorder = isLight ? '#fed7aa' : 'rgba(180,83,9,0.3)';
  const resetBtnBorder = isLight ? '#f97316' : 'rgba(255,255,255,0.1)';
  const resetBtnColor = isLight ? '#ea580c' : '#78350f';
  
  const mainBg = isLight ? '#fdfaf6' : '#1a0f05';
  const cardBg = isLight ? '#ffffff' : '#120b03';
  const cardBorder = isLight ? '#fed7aa' : 'rgba(180,83,9,0.3)';
  
  const excavationViewBg = isLight ? '#fdf6ee' : '#1c0e05';
  const soilGradient = isLight 
    ? 'linear-gradient(180deg, #b45309 0%, #7c2d12 50%, #451a03 100%)'
    : 'linear-gradient(180deg, #3d1c0a 0%, #2d1408 50%, #1a0b04 100%)';
  const soilBorder = isLight ? '#b45309' : '#5c2d0f';
  
  const progressTrackBg = isLight ? '#ffedd5' : '#2a1608';
  
  const buttonDugBg = isLight ? '#ffedd5' : '#2a1608';
  const buttonDugText = isLight ? '#b45309' : '#78350f';
  
  const closeUpDescBg = isLight ? '#fff7ed' : '#1c0e05';
  const closeUpDescText = isLight ? '#7c2d12' : '#fde68a';
  
  const classificationAlertText = isLight ? '#7c2d12' : '#fde68a';
  const optBg = isLight ? '#fffaf5' : 'rgba(255,255,255,0.03)';
  const optBorder = isLight ? '#ffedd5' : 'rgba(255,255,255,0.08)';
  const optText = isLight ? '#ea580c' : '#92400e';
  
  const doneOverlayBg = isLight ? 'rgba(253, 250, 246, 0.98)' : 'rgba(26,15,5,0.96)';
  const doneOverlaySub = isLight ? '#7c2d12' : '#92400e';
  const doneRedoBg = isLight ? '#ffedd5' : '#2a1608';
  const doneRedoText = isLight ? '#ea580c' : '#fef3c7';

  useEffect(() => {
    if (!digging) return;

    let timer;
    const tick = () => {
      setDigProgress(prev => {
        const cur = prev[digging] || 0;
        if (cur >= 100) {
          setDigging(null);
          return prev;
        }
        timer = setTimeout(tick, 80);
        return { ...prev, [digging]: Math.min(100, cur + 4) };
      });
    };

    timer = setTimeout(tick, 80);
    return () => clearTimeout(timer);
  }, [digging]);

  const handleDig = () => {
    if (!selectedPlant || isFullyDug) return;
    setDigging(selectedPlant);
  };

  const handleWash = () => {
    if (!isFullyDug) return;
    setWashed(prev => ({ ...prev, [selectedPlant]: true }));
  };

  const handleCheck = (plantId) => {
    const correct = PLANTS.find(p => p.id === plantId).rootType;
    const isRight = answers[plantId] === correct;
    setChecked(prev => ({ ...prev, [plantId]: isRight }));
    if (isRight) {
      const newChecked = { ...checked, [plantId]: true };
      if (Object.keys(newChecked).filter(k => newChecked[k]).length === PLANTS.length) {
        setAllDone(true);
        confetti({ particleCount: 160, spread: 85, origin: { y: 0.5 } });
      }
    }
  };

  const handleReset = () => {
    setSelectedPlant(null); setDigProgress({}); setDigging(null);
    setWashed({}); setAnswers({}); setChecked({}); setAllDone(false);
  };

  const TaprootSVG = ({ color }) => (
    <svg width="140" height="180" viewBox="0 0 140 180">
      {/* Main taproot */}
      <line x1="70" y1="0" x2="70" y2="140" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {/* Lateral roots */}
      {[[30, 25, 45, 55], [110, 30, 95, 60], [25, 55, 38, 80], [115, 60, 100, 85], [32, 90, 45, 110], [108, 95, 92, 115], [40, 118, 50, 134]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      ))}
      {/* Root tip */}
      <ellipse cx="70" cy="148" rx="4" ry="6" fill={color} opacity="0.7" />
    </svg>
  );

  const FibrousRootSVG = ({ color }) => (
    <svg width="140" height="180" viewBox="0 0 140 180">
      {/* Multiple thin roots spreading out */}
      {[
        [70,0,30,160], [70,0,45,155], [70,0,55,160], [70,0,65,158],
        [70,0,75,160], [70,0,85,155], [70,0,95,160], [70,0,110,158],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      ))}
      {/* Tiny branches */}
      {[[32,120,20,145],[48,130,35,150],[80,128,92,148],[95,118,108,140]].map(([x1,y1,x2,y2], i) => (
        <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      ))}
    </svg>
  );

  const PlantTopSVG = ({ p }) => (
    <svg width="80" height="100" viewBox="0 0 80 100">
      <line x1="40" y1="90" x2="40" y2="30" stroke={p.stemColor} strokeWidth="4" />
      {Array.from({ length: p.leaves }).map((_, i) => (
        <React.Fragment key={i}>
          <ellipse cx={i % 2 === 0 ? 22 : 58} cy={30 + i * 14} rx="16" ry="8" fill={p.stemColor} opacity="0.85" transform={`rotate(${i % 2 === 0 ? 25 : -25} ${i % 2 === 0 ? 22 : 58} ${30 + i * 14})`} />
        </React.Fragment>
      ))}
    </svg>
  );

  return (
    <div style={{ display: 'flex', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Left — Plant list */}
      <aside style={{ width: 220, background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: 0 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <div style={{ fontSize: '0.65rem', color: isLight ? '#f97316' : '#f59e0b', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.6</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: textColor }}>⛏️ Root Excavation Station</div>
          <div style={{ fontSize: '0.7rem', color: textMuted, marginTop: '0.2rem' }}>{doneCount}/{PLANTS.length} identified</div>
        </div>
        <div style={{ height: 4, background: progressTrackBg, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #84cc16)', width: `${(doneCount / PLANTS.length) * 100}%`, transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontSize: '0.7rem', color: textFaint, fontStyle: 'italic' }}>Select a plant → dig it up → wash roots → classify!</div>
        {PLANTS.map(p => (
          <button key={p.id} onClick={() => setSelectedPlant(p.id)} style={{ background: selectedPlant === p.id ? (isLight ? '#fed7aa' : 'rgba(180,83,9,0.2)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.03)'), border: `1px solid ${checked[p.id] === true ? 'rgba(132,204,22,0.5)' : checked[p.id] === false ? 'rgba(248,113,113,0.4)' : selectedPlant === p.id ? 'rgba(245,158,11,0.5)' : (isLight ? '#fed7aa' : 'rgba(255,255,255,0.06)')}`, borderRadius: '10px', padding: '0.6rem 0.75rem', cursor: 'pointer', color: textColor, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.2rem' }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{p.name}</div>
              {checked[p.id] === true && <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 'bold' }}>✅ {p.rootType === 'taproot' ? 'Taproot' : 'Fibrous'}</div>}
              {digProgress[p.id] >= 100 && !checked[p.id] && <div style={{ fontSize: '0.65rem', color: isLight ? '#ea580c' : '#f59e0b', fontWeight: 'bold' }}>⛏️ Dug up</div>}
            </div>
          </button>
        ))}
        <button onClick={handleReset} style={{ marginTop: 'auto', background: 'none', border: `1px solid ${resetBtnBorder}`, color: resetBtnColor, padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
          <RefreshCw size={12} /> Reset Lab
        </button>
      </aside>

      {/* Main workbench */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {!selectedPlant ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: textFaint, textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', opacity: 0.4 }}>⛏️</div>
            <div style={{ fontSize: '1rem', color: textMuted, fontWeight: 'bold' }}>Select a potted plant from the left panel</div>
            <div style={{ fontSize: '0.8rem' }}>You'll dig it up, wash the roots, and classify them!</div>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>{plant.emoji}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: textColor }}>{plant.name}</div>
                <div style={{ fontSize: '0.75rem', color: textMuted }}>Potted Herb Specimen</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Dig Scene */}
              <div style={{ background: cardBg, borderRadius: '16px', padding: '1.25rem', border: `1px solid ${cardBorder}` }}>
                <div style={{ fontSize: '0.75rem', color: isLight ? '#ea580c' : '#f59e0b', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase' }}>⛏️ Excavation View</div>
                <div style={{ position: 'relative', height: 200, background: excavationViewBg, borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Plant above ground */}
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem', zIndex: 2 }}>
                    <PlantTopSVG p={plant} />
                  </div>
                  {/* Soil layers */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${100 - progress}%`, background: soilGradient, transition: 'height 0.15s', borderTop: `2px solid ${soilBorder}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0.25rem', fontSize: '0.65rem', color: '#ffedd5', fontWeight: 'bold' }}>
                    {progress < 100 && progress > 0 && '🪱 Soil...'}
                  </div>
                  {/* Roots revealed */}
                  {progress > 20 && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${progress}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'height 0.15s' }}>
                      <div style={{ opacity: Math.min(1, (progress - 20) / 40) }}>
                        {plant.rootType === 'taproot' ? <TaprootSVG color={plant.rootColor} /> : <FibrousRootSVG color={plant.rootColor} />}
                      </div>
                    </div>
                  )}
                </div>
                {/* Dig progress */}
                <div style={{ height: 6, background: progressTrackBg, borderRadius: 4, overflow: 'hidden', margin: '0.75rem 0' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #84cc16)', width: `${progress}%`, transition: 'width 0.1s', borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={handleDig} disabled={isFullyDug || digging === selectedPlant} style={{ flex: 1, background: isFullyDug ? buttonDugBg : '#f59e0b', border: 'none', color: isFullyDug ? buttonDugText : '#1a0f05', padding: '0.6rem', borderRadius: '8px', cursor: isFullyDug ? 'default' : 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    {isFullyDug ? '✅ Fully Dug!' : digging === selectedPlant ? '⛏️ Digging...' : '⛏️ Dig!'}
                  </button>
                  {isFullyDug && !isWashed && (
                    <button onClick={handleWash} style={{ flex: 1, background: '#0ea5e9', border: 'none', color: '#fff', padding: '0.6rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      💧 Wash Roots
                    </button>
                  )}
                </div>
              </div>

              {/* Root Close-up */}
              <div style={{ background: cardBg, borderRadius: '16px', padding: '1.25rem', border: `1px solid ${isWashed ? 'rgba(132,204,22,0.3)' : cardBorder}`, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: isWashed ? '#16a34a' : textFaint, fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {isWashed ? '🔬 Root Close-Up (Washed)' : '🪣 Wash the roots to examine'}
                </div>
                {!isFullyDug && <div style={{ color: textFaint, fontSize: '0.8rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>Dig up the plant first!</div>}
                {isFullyDug && !isWashed && <div style={{ color: textMuted, fontSize: '0.8rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500' }}>Click "Wash Roots" to clean them for examination.</div>}
                {isWashed && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {plant.rootType === 'taproot'
                        ? <TaprootSVG color="#ea580c" />
                        : <FibrousRootSVG color="#16a34a" />}
                    </div>
                    <div style={{ background: closeUpDescBg, borderRadius: '8px', padding: '0.75rem', fontSize: '0.8rem', color: closeUpDescText, lineHeight: 1.5, border: `1px solid ${sidebarBorder}`, fontWeight: '500' }}>{plant.desc}</div>
                  </>
                )}
              </div>
            </div>

            {/* Classification */}
            {isWashed && (
              <div style={{ background: cardBg, borderRadius: '12px', padding: '1rem', border: `1px solid ${sidebarBorder}` }}>
                <div style={{ fontSize: '0.8rem', color: classificationAlertText, marginBottom: '0.75rem', fontWeight: '500' }}>
                  Based on what you observed — classify the root system of <strong>{plant.name}</strong>:
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ROOT_LABELS.map(opt => (
                    <button key={opt.id} onClick={() => !checked[selectedPlant] && setAnswers(a => ({ ...a, [selectedPlant]: opt.id }))} style={{ background: answers[selectedPlant] === opt.id ? `${opt.color}22` : optBg, border: `2px solid ${answers[selectedPlant] === opt.id ? opt.color : optBorder}`, color: answers[selectedPlant] === opt.id ? opt.color : optText, padding: '0.5rem 1rem', borderRadius: '10px', cursor: checked[selectedPlant] ? 'default' : 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s', fontWeight: answers[selectedPlant] === opt.id ? '600' : 'normal' }}>
                      {opt.icon} {opt.label}
                      <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>— {opt.desc}</span>
                    </button>
                  ))}
                  {answers[selectedPlant] && !checked[selectedPlant] && (
                    <button onClick={() => handleCheck(selectedPlant)} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold' }}>
                      Verify ✓
                    </button>
                  )}
                  {checked[selectedPlant] === true && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>✅ Correct!</span>}
                  {checked[selectedPlant] === false && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.85rem' }}>❌ Look at the root diagram again.</span>
                      <button onClick={() => { setAnswers(a => ({ ...a, [selectedPlant]: null })); setChecked(c => { const n = { ...c }; delete n[selectedPlant]; return n; }); }} style={{ background: 'none', border: '1px solid #dc2626', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Retry</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* All done overlay */}
      {allDone && (
        <div style={{ position: 'absolute', inset: 0, background: doneOverlayBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', zIndex: 50, textAlign: 'center', padding: '2rem' }}>
          <Award size={56} color="#f59e0b" style={{ filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.2))' }} />
          <h2 style={{ color: isLight ? '#ea580c' : '#f59e0b', margin: 0, fontWeight: '800' }}>Root Explorer Badge!</h2>
          <p style={{ color: doneOverlaySub, maxWidth: 420, lineHeight: 1.6, fontSize: '0.95rem', fontWeight: '500' }}>
            You correctly identified all 5 root systems!<br />
            <strong style={{ color: isLight ? '#c2410c' : '#f59e0b' }}>Mustard, Hibiscus, Marigold</strong> → Taproot System<br />
            <strong style={{ color: '#16a34a' }}>Grass, Wheat</strong> → Fibrous Root System<br /><br />
            <span style={{ fontSize: '0.85rem', color: textFaint }}>Notice the pattern? Continue to Activity 2.7 to discover how this connects to leaf venation!</span>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: doneRedoBg, border: 'none', color: doneRedoText, padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Redo</button>
            <button onClick={onBackToDashboard} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Back to Chapter</button>
          </div>
        </div>
      )}
    </div>
  );
}
