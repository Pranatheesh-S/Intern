import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

const LEAVES = [
  {
    id: 'hibiscus',
    name: 'Hibiscus (Gudhal)',
    emoji: '🌺',
    venation: 'reticulate',
    desc: 'A broad oval leaf. When held to light, you see a central midrib with a fine net-like web of veins branching in all directions.',
    hint: 'Net-like pattern spreading from a central rib',
    svgPath: 'M 80 10 Q 120 20 130 60 Q 140 100 100 130 Q 80 145 60 130 Q 20 100 30 60 Q 40 20 80 10 Z',
    midribPath: 'M 80 10 L 80 140',
    veinPaths: ['M 80 35 Q 55 50 45 65', 'M 80 35 Q 105 50 115 65', 'M 80 60 Q 50 72 38 85', 'M 80 60 Q 110 72 122 85', 'M 80 85 Q 58 98 52 110', 'M 80 85 Q 102 98 108 110', 'M 65 50 Q 50 60 45 70', 'M 95 50 Q 110 60 115 70'],
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
    svgPath: 'M 80 5 Q 130 15 140 80 Q 130 145 80 155 Q 30 145 20 80 Q 30 15 80 5 Z',
    midribPath: 'M 80 5 L 80 155',
    veinPaths: ['M 80 25 L 45 60', 'M 80 25 L 115 60', 'M 80 45 L 32 80', 'M 80 45 L 128 80', 'M 80 65 L 27 100', 'M 80 65 L 133 100', 'M 80 85 L 30 115', 'M 80 85 L 130 115', 'M 80 105 L 40 130', 'M 80 105 L 120 130'],
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
    svgPath: 'M 70 5 Q 78 5 90 150 Q 88 158 80 160 Q 72 158 70 150 Z',
    midribPath: 'M 80 5 L 80 160',
    veinPaths: ['M 80 20 L 73 155', 'M 80 20 L 87 155', 'M 80 30 L 68 155', 'M 80 30 L 92 155', 'M 80 45 L 65 155', 'M 80 45 L 95 155'],
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
    svgPath: 'M 80 12 Q 108 22 118 55 Q 120 88 100 112 Q 88 128 80 132 Q 72 128 60 112 Q 40 88 42 55 Q 52 22 80 12 Z',
    midribPath: 'M 80 12 L 80 132',
    veinPaths: ['M 80 32 Q 60 45 52 58', 'M 80 32 Q 100 45 108 58', 'M 80 55 Q 53 65 46 76', 'M 80 55 Q 107 65 114 76', 'M 80 78 Q 57 88 52 98', 'M 80 78 Q 103 88 108 98', 'M 63 48 Q 53 58 50 68', 'M 97 48 Q 107 58 110 68'],
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
    svgPath: 'M 65 5 Q 75 5 95 80 Q 98 120 90 155 Q 85 165 80 165 Q 75 165 70 155 Q 62 120 65 80 Z',
    midribPath: 'M 80 5 L 80 165',
    veinPaths: ['M 80 20 L 70 160', 'M 80 20 L 90 160', 'M 80 35 L 66 160', 'M 80 35 L 94 160', 'M 80 50 L 63 160', 'M 80 50 L 97 160', 'M 80 70 L 68 160', 'M 80 70 L 92 160'],
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
  const textColor = isLight ? '#0f172a' : '#f0f9ff';
  const textMuted = isLight ? '#334155' : '#cbd5e1';
  const sidebarBg = isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(15, 23, 41, 0.94)';
  const sidebarBorder = isLight ? '#cbd5e1' : 'rgba(14,165,233,0.3)';
  const resetBtnBorder = isLight ? '#94a3b8' : 'rgba(255,255,255,0.2)';
  
  const rightBg = !selectedLeaf
    ? (isLight ? '#f8fafc' : '#0a0f1e')
    : (lit ? (isLight ? '#fefce8' : '#1c1917') : (isLight ? '#f1f5f9' : '#0a0f1e'));

  const classificationBg = isLight ? '#ffffff' : '#0f172a';
  const classificationBorder = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)';
  const classificationTextMuted = isLight ? '#1e293b' : '#e2e8f0';
  const classificationTextHighlight = isLight ? '#0284c7' : '#38bdf8';

  const optBg = isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)';
  const optBorder = isLight ? '#cbd5e1' : 'rgba(148, 163, 184, 0.3)';
  const optText = isLight ? '#1e293b' : '#f8fafc';

  const doneOverlayBg = isLight ? 'rgba(248, 250, 252, 0.98)' : 'rgba(10,15,30,0.96)';
  const doneOverlayText = isLight ? '#1e293b' : '#f1f5f9';
  const doneOverlaySub = isLight ? '#334155' : '#cbd5e1';
  const doneRedoBg = isLight ? '#cbd5e1' : '#334155';
  const doneRedoText = isLight ? '#1e293b' : '#e2e8f0';

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
      <aside style={{ width: 290, background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.95rem', overflowY: 'auto' }}>
        <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: '800', padding: 0 }}>
          <ArrowLeft size={20} /> Back
        </button>
        <div>
          <div style={{ fontSize: '0.95rem', color: isLight ? '#0284c7' : '#38bdf8', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.05em' }}>Activity 2.5</div>
          <div style={{ fontSize: '1.45rem', fontWeight: '900', color: textColor, marginTop: '0.15rem', lineHeight: '1.2' }}>Activity 2.5: Let Us Compare</div>
          <div style={{ fontSize: '1rem', color: isLight ? '#0f172a' : '#e2e8f0', marginTop: '0.35rem', fontWeight: '800' }}>{doneCount}/{LEAVES.length} identified</div>
        </div>

        <div style={{ height: 8, background: isLight ? '#cbd5e1' : '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', width: `${(doneCount / LEAVES.length) * 100}%`, transition: 'width 0.5s' }} />
        </div>

        <div style={{ fontSize: '1.02rem', color: isLight ? '#0f172a' : '#e2e8f0', fontStyle: 'italic', fontWeight: '700', lineHeight: '1.45' }}>Select a leaf specimen, then light it up to see the veins!</div>

        {LEAVES.map(l => (
          <button key={l.id} onClick={() => { setSelectedLeaf(l.id); setLit(false); }} style={{ background: selectedLeaf === l.id ? (isLight ? 'rgba(14,165,233,0.18)' : 'rgba(14,165,233,0.3)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'), border: `2.5px solid ${checked[l.id] === true ? '#22c55e' : checked[l.id] === false ? '#ef4444' : selectedLeaf === l.id ? '#0ea5e9' : (isLight ? '#94a3b8' : 'rgba(255,255,255,0.18)')}`, borderRadius: '14px', padding: '0.85rem 1rem', cursor: 'pointer', color: isLight ? '#0f172a' : '#f8fafc', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', boxShadow: selectedLeaf === l.id ? '0 4px 14px rgba(14,165,233,0.25)' : 'none' }}>
            <span style={{ fontSize: '1.65rem' }}>{l.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.12rem', fontWeight: 900 }}>{l.name}</div>
              {checked[l.id] === true && <div style={{ fontSize: '0.92rem', color: isLight ? '#15803d' : '#4ade80', fontWeight: '800' }}>✅ {l.venationType}</div>}
              {checked[l.id] === false && <div style={{ fontSize: '0.92rem', color: isLight ? '#dc2626' : '#f87171', fontWeight: '800' }}>❌ Try again</div>}
            </div>
          </button>
        ))}

        <button onClick={handleReset} style={{ marginTop: 'auto', background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)', border: `2px solid ${resetBtnBorder}`, color: isLight ? '#0f172a' : '#f8fafc', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
          <RefreshCw size={18} /> Reset Lab
        </button>
      </aside>

      {/* Right — Lightbox + Classification */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedLeaf ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', color: isLight ? '#0f172a' : '#f8fafc', textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5.5rem', opacity: 0.6 }}>🍃</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: textColor }}>Select a leaf specimen from the panel to begin examining it.</div>
            <div style={{ fontSize: '1.18rem', color: isLight ? '#0f172a' : '#e2e8f0', fontWeight: '700' }}>Hold each leaf up to the light to see its venation pattern clearly.</div>
          </div>
        ) : (
          <>
            {/* Lightbox area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: rightBg, transition: 'background 0.5s', padding: '1.5rem', position: 'relative' }}>
              {lit && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,253,200,0.6) 0%, rgba(253,224,71,0.2) 50%, transparent 80%)', pointerEvents: 'none' }} />}
 
              <div style={{ position: 'relative', zIndex: 2, marginBottom: '0.75rem' }}>
                <svg width="220" height="220" viewBox="0 0 160 170" style={{ filter: lit ? 'drop-shadow(0 0 24px #fbbf24)' : (isLight ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' : 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))'), transition: 'filter 0.5s' }}>
                  <defs>
                    <clipPath id="leaf-shape-clip">
                      <path d={leaf.svgPath} />
                    </clipPath>
                  </defs>
                  {/* Leaf body */}
                  <path d={leaf.svgPath} fill={lit ? '#fef08a' : (isLight ? '#86efac' : '#15803d')} stroke={lit ? '#b45309' : (isLight ? '#15803d' : '#4ade80')} strokeWidth="2.5" />
                  
                  {/* Clipped veins group */}
                  <g clipPath="url(#leaf-shape-clip)">
                    {/* Midrib */}
                    <path d={leaf.midribPath} stroke={lit ? '#78350f' : (isLight ? '#14532d' : '#86efac')} strokeWidth={lit ? 3.5 : 2.5} fill="none" />
                    {/* Side veins */}
                    {leaf.veinPaths.map((p, i) => (
                      <path key={i} d={p} stroke={lit ? '#92400e' : (isLight ? '#15803d' : '#4ade80')} strokeWidth={lit ? 1.8 : 1.4} fill="none" opacity={1} />
                    ))}
                    {/* Inner net for reticulate */}
                    {lit && leaf.venation === 'reticulate' && leaf.veinPaths.map((p, i) => (
                      <path key={`net-${i}`} d={p.replace(/Q (\d+) (\d+) (\d+) (\d+)/, (m, cx, cy, ex, ey) => `Q ${parseInt(cx)+8} ${parseInt(cy)-5} ${parseInt(ex)-5} ${parseInt(ey)+5}`)} stroke="#b45309" strokeWidth="1.2" fill="none" opacity="0.8" />
                    ))}
                  </g>
                </svg>
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
