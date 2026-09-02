import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

import hibLeafImg from '../../../../assets/hib_leaf.png';
import bananaLeafImg from '../../../../assets/banana_leaf.png';
import grassLeafImg from '../../../../assets/grass_leaf.png';
import roseLeafImg from '../../../../assets/rose_leaf.png';
import maizeLeafImg from '../../../../assets/maize_leaf.png';

const LEAVES = [
  {
    id: 'hibiscus',
    name: 'Hibiscus (Gudhal)',
    emoji: '🌺',
    venation: 'reticulate',
    desc: 'A broad oval leaf. When held to light, you see a central midrib with a fine net-like web of veins branching in all directions.',
    hint: 'Net-like pattern spreading from a central rib',
    image: hibLeafImg,
    venationType: 'Reticulate',
    color: '#dc2626',
  },
  {
    id: 'banana',
    name: 'Banana Plant',
    emoji: '🍌',
    venation: 'parallel',
    desc: 'A long, wide leaf. When held to light, veins run straight and parallel from the midrib to the leaf edges — like lines on a ruled page.',
    hint: 'Long parallel lines running side by side',
    image: bananaLeafImg,
    venationType: 'Parallel',
    color: '#ca8a04',
  },
  {
    id: 'grass',
    name: 'Common Grass',
    emoji: '🌾',
    venation: 'parallel',
    desc: 'A narrow blade. Veins are fine and run exactly parallel to each other from base to tip — very easy to see when backlit.',
    hint: 'Thin lines running parallel to the long axis of the blade',
    image: grassLeafImg,
    venationType: 'Parallel',
    color: '#16a34a',
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    venation: 'reticulate',
    desc: 'A small oval leaflet. The central midrib is prominent and lateral veins branch out forming a complex reticulate (net) pattern.',
    hint: 'Branching network — like cracks in dried mud',
    image: roseLeafImg,
    venationType: 'Reticulate',
    color: '#e11d48',
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    emoji: '🌽',
    venation: 'parallel',
    desc: 'A long sword-shaped leaf. When held to light, clearly visible parallel veins run side-by-side the entire length of the blade.',
    hint: 'Clear parallel lines — no branching, just straight lines',
    image: maizeLeafImg,
    venationType: 'Parallel',
    color: '#d97706',
  },
];

const OPTIONS = [
  { id: 'reticulate', label: 'Reticulate (Net-like)', icon: '🕸️', color: '#7c3aed' },
  { id: 'parallel', label: 'Parallel (Straight lines)', icon: '📏', color: '#0891b2' },
];

export default function LeafVenationLab({ onBackToDashboard }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedLeaf, setSelectedLeaf] = useState(null);
  const [lit, setLit] = useState(false);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [allDone, setAllDone] = useState(false);

  const leaf = LEAVES.find(l => l.id === selectedLeaf);
  const doneCount = Object.keys(checked).filter(k => checked[k]).length;

  const containerBg = `url(${darkForestBg}) center/cover no-repeat fixed`;
  const textColor = '#0f172a';
  const textMuted = '#334155';
  const sidebarBg = 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)';
  const sidebarBorder = 'rgba(167, 243, 208, 0.95)';
  const resetBtnBorder = 'rgba(167, 243, 208, 0.95)';
  
  const rightBg = !selectedLeaf
    ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)'
    : (lit ? 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)' : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)');

  const classificationBg = 'rgba(240, 250, 244, 0.98)';
  const classificationBorder = 'rgba(167, 243, 208, 0.95)';
  const classificationTextMuted = '#1e293b';
  const classificationTextHighlight = '#0284c7';

  const optBg = '#ffffff';
  const optBorder = 'rgba(167, 243, 208, 0.95)';
  const optText = '#1e293b';

  const doneOverlayBg = 'rgba(248, 250, 252, 0.98)';
  const doneOverlayText = '#1e293b';
  const doneOverlaySub = '#334155';
  const doneRedoBg = '#cbd5e1';
  const doneRedoText = '#1e293b';

  const handleCheck = (leafId) => {
    const correct = LEAVES.find(l => l.id === leafId).venation;
    const isRight = answers[leafId] === correct;
    setChecked(prev => ({ ...prev, [leafId]: isRight }));
    if (isRight) {
      const newChecked = { ...checked, [leafId]: true };
      if (Object.keys(newChecked).filter(k => newChecked[k]).length === LEAVES.length) {
        setAllDone(true);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }
    }
  };

  const handleReset = () => {
    setSelectedLeaf(null);
    setLit(false);
    setAnswers({});
    setChecked({});
    setAllDone(false);
  };

  return (
    <div style={{ display: 'flex', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Left — Leaf Specimens Panel */}
      <aside style={{ width: 290, background: sidebarBg, backdropFilter: 'blur(16px)', borderRight: `1.5px solid ${sidebarBorder}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.95rem', overflowY: 'auto', boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)' }}>
        <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: '800', padding: 0 }}>
          <ArrowLeft size={20} color="#0f172a" /> Back
        </button>
        <div>
          <div style={{ fontSize: '0.95rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Activity 2.5</div>
          <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', marginTop: '0.15rem', lineHeight: '1.2' }}>Activity 2.5: Let Us Compare</div>
          <div style={{ fontSize: '1rem', color: '#0f172a', marginTop: '0.35rem', fontWeight: '800' }}>{doneCount}/{LEAVES.length} identified</div>
        </div>

        <div style={{ height: 8, background: '#cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', width: `${(doneCount / LEAVES.length) * 100}%`, transition: 'width 0.5s' }} />
        </div>

        <div style={{ fontSize: '1.02rem', color: '#1e293b', fontStyle: 'italic', fontWeight: '700', lineHeight: '1.45' }}>Select a leaf specimen, then light it up to see the veins!</div>

        {LEAVES.map(l => {
          const isSelected = selectedLeaf === l.id;
          const isCheckedTrue = checked[l.id] === true;
          const isCheckedFalse = checked[l.id] === false;
          const cardBorderColor = isCheckedTrue ? '#22c55e' : isCheckedFalse ? '#ef4444' : isSelected ? '#0ea5e9' : '#cbd5e1';
          const cardBg = isSelected ? 'rgba(14, 165, 233, 0.16)' : '#ffffff';

          return (
            <button
              key={l.id}
              onClick={() => { setSelectedLeaf(l.id); setLit(false); }}
              style={{
                background: cardBg,
                border: `2.5px solid ${cardBorderColor}`,
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                color: '#0f172a',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 4px 14px rgba(14, 165, 233, 0.25)' : '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span style={{ fontSize: '1.65rem' }}>{l.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a' }}>{l.name}</div>
                {isCheckedTrue && <div style={{ fontSize: '0.92rem', color: '#15803d', fontWeight: '800' }}>✅ {l.venationType}</div>}
                {isCheckedFalse && <div style={{ fontSize: '0.92rem', color: '#dc2626', fontWeight: '800' }}>❌ Try again</div>}
              </div>
            </button>
          );
        })}

        <button onClick={handleReset} style={{ marginTop: 'auto', background: '#ffffff', border: `2px solid ${resetBtnBorder}`, color: '#0f172a', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)' }}>
          <RefreshCw size={18} color="#0f172a" /> Reset Lab
        </button>
      </aside>

      {/* Right — Lightbox + Classification */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)', backdropFilter: 'blur(16px)' }}>
        {!selectedLeaf ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', color: '#0f172a', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5.5rem', opacity: 0.6 }}>🍃</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: textColor }}>Select a leaf specimen from the panel to begin examining it.</div>
            <div
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                color: '#ffffff',
                padding: '0.9rem 1.75rem',
                borderRadius: '14px',
                border: '1.5px solid rgba(52, 211, 153, 0.5)',
                boxShadow: '0 4px 18px rgba(6, 78, 59, 0.25)',
                fontSize: '1.18rem',
                fontWeight: '700',
                maxWidth: '520px',
                lineHeight: '1.5',
                textAlign: 'center',
              }}
            >
              Hold each leaf up to the light to see its venation pattern clearly.
            </div>
          </div>
        ) : (
          <>
            {/* Lightbox area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: rightBg, transition: 'background 0.5s', padding: '1.5rem', position: 'relative' }}>
              {lit && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,253,200,0.6) 0%, rgba(253,224,71,0.2) 50%, transparent 80%)', pointerEvents: 'none' }} />}
 
              <div style={{ position: 'relative', zIndex: 2, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lit && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '340px',
                      height: '340px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(253, 224, 71, 0.75) 0%, rgba(245, 158, 11, 0.35) 45%, transparent 70%)',
                      filter: 'blur(16px)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                )}
                <img
                  src={leaf.image}
                  alt={leaf.name}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '420px',
                    maxHeight: '300px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    filter: lit
                      ? 'brightness(1.22) contrast(1.22) drop-shadow(0 0 32px rgba(251, 191, 36, 0.85))'
                      : 'drop-shadow(0 6px 18px rgba(0,0,0,0.18))',
                    transition: 'filter 0.5s, transform 0.5s',
                    transform: lit ? 'scale(1.03)' : 'scale(1)',
                  }}
                />
              </div>

              {/* Text & Control Container with crisp background card for high contrast */}
              <div style={{ zIndex: 2, textAlign: 'center', background: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.96)', backdropFilter: 'blur(12px)', padding: '1.5rem 2.25rem', borderRadius: '20px', border: isLight ? '2.5px solid #94a3b8' : '2.5px solid rgba(255, 255, 255, 0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.22)', maxWidth: '490px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: '900', color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '0.02em' }}>{leaf.name}</div>
                {!lit && <div style={{ fontSize: '1.15rem', color: isLight ? '#0f172a' : '#f8fafc', fontWeight: '700', lineHeight: '1.6' }}>{leaf.desc}</div>}
                {lit && <div style={{ fontSize: '1.15rem', color: isLight ? '#78350f' : '#fef08a', background: isLight ? '#fef3c7' : 'rgba(217, 119, 6, 0.45)', padding: '0.75rem 1.25rem', borderRadius: '14px', fontWeight: '800', border: '2.5px solid #f59e0b', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)' }}>💡 Hint: {leaf.hint}</div>}
                <button onClick={() => setLit(l => !l)} style={{ background: lit ? '#f59e0b' : (isLight ? '#0f172a' : '#0ea5e9'), border: 'none', color: '#ffffff', padding: '0.85rem 1.85rem', borderRadius: '14px', cursor: 'pointer', fontSize: '1.15rem', fontWeight: '900', transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', marginTop: '0.3rem' }}>
                  {lit ? '🔦 Turn Off Light' : '🔦 Hold to Light — See Veins!'}
                </button>
              </div>
            </div>

            {/* Classification panel */}
            <div style={{ background: classificationBg, borderTop: `2.5px solid ${classificationBorder}`, padding: '1.5rem 2.25rem' }}>
              <div style={{ fontSize: '1.15rem', color: classificationTextMuted, marginBottom: '0.95rem', fontWeight: '800' }}>What venation pattern do you see in <strong style={{ color: classificationTextHighlight, fontSize: '1.25rem', fontWeight: '900' }}>{leaf.name}</strong>?</div>
              <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {OPTIONS.map(opt => {
                  const isSelected = answers[selectedLeaf] === opt.id;
                  const isRet = opt.id === 'reticulate';
                  const activeColor = isRet ? (isLight ? '#581c87' : '#e9d5ff') : (isLight ? '#075985' : '#7dd3fc');
                  const activeBg = isRet ? (isLight ? '#f3e8ff' : 'rgba(124, 58, 237, 0.4)') : (isLight ? '#e0f2fe' : 'rgba(8, 145, 178, 0.4)');
                  const activeBorder = isRet ? '#9333ea' : '#0284c7';

                  return (
                    <button key={opt.id} onClick={() => !checked[selectedLeaf] && setAnswers(a => ({ ...a, [selectedLeaf]: opt.id }))} style={{ background: isSelected ? activeBg : optBg, border: `3px solid ${isSelected ? activeBorder : optBorder}`, color: isSelected ? activeColor : optText, padding: '0.75rem 1.5rem', borderRadius: '16px', cursor: checked[selectedLeaf] ? 'default' : 'pointer', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.65rem', transition: 'all 0.2s', fontWeight: '800' }}>
                      <span style={{ fontSize: '1.35rem' }}>{opt.icon}</span> {opt.label}
                    </button>
                  );
                })}
                {answers[selectedLeaf] && !checked[selectedLeaf] && (
                  <button onClick={() => handleCheck(selectedLeaf)} style={{ background: '#0284c7', border: 'none', color: '#fff', padding: '0.75rem 1.75rem', borderRadius: '14px', cursor: 'pointer', fontSize: '1.15rem', fontWeight: '900', boxShadow: '0 4px 16px rgba(2,132,199,0.45)' }}>
                    Verify ✓
                  </button>
                )}
                {checked[selectedLeaf] === true && <span style={{ color: isLight ? '#15803d' : '#4ade80', fontWeight: '900', fontSize: '1.15rem' }}>✅ Correct! It's {leaf.venationType} venation.</span>}
                {checked[selectedLeaf] === false && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isLight ? '#dc2626' : '#f87171', fontWeight: '900', fontSize: '1.15rem' }}>❌ Not quite. Look at the light pattern again!</span>
                    <button onClick={() => { setAnswers(a => ({ ...a, [selectedLeaf]: null })); setChecked(c => { const n = { ...c }; delete n[selectedLeaf]; return n; }); }} style={{ background: 'rgba(220,38,38,0.15)', border: `2px solid ${isLight ? '#dc2626' : '#f87171'}`, color: isLight ? '#dc2626' : '#f87171', padding: '0.4rem 1rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.98rem', fontWeight: '800' }}>Retry</button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* All done overlay */}
      {allDone && (
        <div style={{ position: 'absolute', inset: 0, background: doneOverlayBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', zIndex: 50, textAlign: 'center', padding: '2rem', transition: 'background 0.5s' }}>
          <Award size={64} color="#eab308" style={{ filter: 'drop-shadow(0 4px 12px rgba(234,179,8,0.4))' }} />
          <h2 style={{ color: isLight ? '#b45309' : '#fbbf24', margin: 0, fontSize: '1.9rem', fontWeight: '800' }}>Venation Expert Badge!</h2>
          <p style={{ color: doneOverlayText, maxWidth: 460, lineHeight: 1.6, fontSize: '1.05rem', fontWeight: '500' }}>
            You correctly identified all 5 leaf venation patterns!<br />
            <span style={{ color: isLight ? '#6b21a8' : '#c084fc', fontWeight: 'bold' }}>Hibiscus, Rose</span> → Reticulate (net-like)<br />
            <span style={{ color: isLight ? '#0369a1' : '#38bdf8', fontWeight: 'bold' }}>Banana, Grass, Maize</span> → Parallel (straight lines)
          </p>
          <p style={{ color: doneOverlaySub, fontSize: '0.9rem', maxWidth: 420, fontStyle: 'italic', lineHeight: 1.5 }}>
            Remember: Plants with reticulate venation usually have taproots. Plants with parallel venation usually have fibrous roots!
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={handleReset} style={{ background: doneRedoBg, border: 'none', color: doneRedoText, padding: '0.7rem 1.85rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: '700' }}>Redo Lab</button>
            <button onClick={() => onBackToDashboard('next_activity')} style={{ background: '#0284c7', border: 'none', color: '#fff', padding: '0.7rem 1.85rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}>Next: Roots Lab ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
