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
  const sidebarBg = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 23, 41, 0.88)';
  const sidebarBorder = isLight ? '#e2e8f0' : 'rgba(14,165,233,0.2)';
  const resetBtnBorder = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)';
  
  const rightBg = !selectedLeaf
    ? (isLight ? '#f8fafc' : '#0a0f1e')
    : (lit ? '#fef9c3' : (isLight ? '#f1f5f9' : '#0a0f1e'));

  const leafFillOpacity = isLight ? '60' : '40';
  
  const classificationBg = isLight ? '#ffffff' : '#0f1729';
  const classificationBorder = isLight ? '#e2e8f0' : 'rgba(14,165,233,0.15)';
  const classificationTextMuted = isLight ? '#475569' : '#94a3b8';
  const classificationTextHighlight = isLight ? '#0f1729' : '#e2e8f0';

  const optBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)';
  const optBorder = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)';
  const optText = isLight ? '#475569' : '#94a3b8';

  const doneOverlayBg = isLight ? 'rgba(248, 250, 252, 0.98)' : 'rgba(10,15,30,0.95)';
  const doneOverlayText = isLight ? '#334155' : '#94a3b8';
  const doneOverlaySub = isLight ? '#475569' : '#64748b';
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
      <aside style={{ width: 240, background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
        <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: 0 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <div style={{ fontSize: '0.65rem', color: isLight ? '#0ea5e9' : '#38bdf8', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.5</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: textColor }}>🍃 Leaf Venation Lab</div>
          <div style={{ fontSize: '0.7rem', color: textMuted, marginTop: '0.2rem' }}>{doneCount}/{LEAVES.length} identified</div>
        </div>

        <div style={{ height: 4, background: isLight ? '#e2e8f0' : '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', width: `${(doneCount / LEAVES.length) * 100}%`, transition: 'width 0.5s' }} />
        </div>

        <div style={{ fontSize: '0.7rem', color: textMuted, fontStyle: 'italic' }}>Select a leaf specimen, then light it up to see the veins!</div>

        {LEAVES.map(l => (
          <button key={l.id} onClick={() => { setSelectedLeaf(l.id); setLit(false); }} style={{ background: selectedLeaf === l.id ? (isLight ? 'rgba(14,165,233,0.1)' : 'rgba(14,165,233,0.15)') : (isLight ? '#f1f5f9' : 'rgba(255,255,255,0.03)'), border: `1px solid ${checked[l.id] === true ? 'rgba(74,222,128,0.5)' : checked[l.id] === false ? 'rgba(248,113,113,0.4)' : selectedLeaf === l.id ? 'rgba(14,165,233,0.5)' : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.06)')}`, borderRadius: '10px', padding: '0.6rem 0.75rem', cursor: 'pointer', color: isLight ? '#334155' : '#e2e8f0', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.2rem' }}>{l.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{l.name}</div>
              {checked[l.id] === true && <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: '600' }}>✅ {l.venationType}</div>}
              {checked[l.id] === false && <div style={{ fontSize: '0.65rem', color: '#dc2626', fontWeight: '600' }}>❌ Try again</div>}
            </div>
          </button>
        ))}

        <button onClick={handleReset} style={{ marginTop: 'auto', background: 'none', border: `1px solid ${resetBtnBorder}`, color: textMuted, padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <RefreshCw size={12} /> Reset Lab
        </button>
      </aside>

      {/* Right — Lightbox + Classification */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selectedLeaf ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: textMuted, textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', opacity: 0.3 }}>🍃</div>
            <div style={{ fontSize: '1.05rem', fontWeight: '600', color: textColor }}>Select a leaf specimen from the panel to begin examining it.</div>
            <div style={{ fontSize: '0.82rem', color: textMuted }}>Hold each leaf up to the light to see its venation pattern clearly.</div>
          </div>
        ) : (
          <>
            {/* Lightbox area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: rightBg, transition: 'background 0.5s', padding: '1.5rem', position: 'relative' }}>
              {lit && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,253,200,0.8) 0%, rgba(253,224,71,0.3) 50%, transparent 80%)', pointerEvents: 'none' }} />}
 
              <div style={{ position: 'relative', zIndex: 2 }}>
                <svg width="200" height="200" viewBox="0 0 160 170" style={{ filter: lit ? 'drop-shadow(0 0 20px #fbbf24)' : 'none', transition: 'filter 0.5s' }}>
                  <defs>
                    <clipPath id="leaf-shape-clip">
                      <path d={leaf.svgPath} />
                    </clipPath>
                  </defs>
                  {/* Leaf body */}
                  <path d={leaf.svgPath} fill={lit ? 'rgba(253,224,71,0.6)' : leaf.color + leafFillOpacity} stroke={leaf.color} strokeWidth="2" />
                  
                  {/* Clipped veins group */}
                  <g clipPath="url(#leaf-shape-clip)">
                    {/* Midrib */}
                    <path d={leaf.midribPath} stroke={lit ? '#92400e' : leaf.color + '80'} strokeWidth={lit ? 2.5 : 1.5} fill="none" />
                    {/* Side veins */}
                    {leaf.veinPaths.map((p, i) => (
                      <path key={i} d={p} stroke={lit ? '#b45309' : (isLight ? leaf.color + '90' : leaf.color + '50')} strokeWidth={lit ? 1.2 : 0.8} fill="none" opacity={lit ? 1 : 0.6} />
                    ))}
                    {/* Inner net for reticulate */}
                    {lit && leaf.venation === 'reticulate' && leaf.veinPaths.map((p, i) => (
                      <path key={`net-${i}`} d={p.replace(/Q (\d+) (\d+) (\d+) (\d+)/, (m, cx, cy, ex, ey) => `Q ${parseInt(cx)+8} ${parseInt(cy)-5} ${parseInt(ex)-5} ${parseInt(ey)+5}`)} stroke="#d97706" strokeWidth="0.5" fill="none" opacity="0.5" />
                    ))}
                  </g>
                </svg>
              </div>

              <div style={{ zIndex: 2, textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: lit ? '#92400e' : textColor, marginBottom: '0.3rem' }}>{leaf.name}</div>
                {!lit && <div style={{ fontSize: '0.78rem', color: isLight ? '#334155' : '#64748b', marginBottom: '1rem', maxWidth: '380px' }}>{leaf.desc}</div>}
                {lit && <div style={{ fontSize: '0.8rem', color: '#92400e', background: 'rgba(255,255,200,0.8)', padding: '0.4rem 0.8rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '500', border: '1px solid rgba(217,119,6,0.3)' }}>💡 Hint: {leaf.hint}</div>}
                <button onClick={() => setLit(l => !l)} style={{ background: lit ? '#fbbf24' : (isLight ? '#ffffff' : '#1e293b'), border: `1px solid ${lit ? '#d97706' : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)')}`, color: lit ? '#78350f' : (isLight ? '#334155' : '#94a3b8'), padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  {lit ? '🔦 Turn Off Light' : '🔦 Hold to Light — See Veins!'}
                </button>
              </div>
            </div>

            {/* Classification panel */}
            <div style={{ background: classificationBg, borderTop: `1px solid ${classificationBorder}`, padding: '1.25rem 1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: classificationTextMuted, marginBottom: '0.75rem', fontWeight: '500' }}>What venation pattern do you see in <strong style={{ color: classificationTextHighlight }}>{leaf.name}</strong>?</div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => !checked[selectedLeaf] && setAnswers(a => ({ ...a, [selectedLeaf]: opt.id }))} style={{ background: answers[selectedLeaf] === opt.id ? `${opt.color}22` : optBg, border: `2px solid ${answers[selectedLeaf] === opt.id ? opt.color : optBorder}`, color: answers[selectedLeaf] === opt.id ? opt.color : optText, padding: '0.5rem 1rem', borderRadius: '10px', cursor: checked[selectedLeaf] ? 'default' : 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s', fontWeight: answers[selectedLeaf] === opt.id ? '600' : 'normal' }}>
                    {opt.icon} {opt.label}
                  </button>
                ))}
                {answers[selectedLeaf] && !checked[selectedLeaf] && (
                  <button onClick={() => handleCheck(selectedLeaf)} style={{ background: '#0ea5e9', border: 'none', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(14,165,233,0.3)' }}>
                    Verify ✓
                  </button>
                )}
                {checked[selectedLeaf] === true && <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>✅ Correct! It's {leaf.venationType} venation.</span>}
                {checked[selectedLeaf] === false && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.85rem' }}>❌ Not quite. Look at the light pattern again!</span>
                    <button onClick={() => { setAnswers(a => ({ ...a, [selectedLeaf]: null })); setChecked(c => { const n = { ...c }; delete n[selectedLeaf]; return n; }); }} style={{ background: 'none', border: '1px solid #dc2626', color: '#dc2626', padding: '0.2rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>Retry</button>
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
          <Award size={56} color="#eab308" style={{ filter: 'drop-shadow(0 4px 12px rgba(234,179,8,0.3))' }} />
          <h2 style={{ color: isLight ? '#d97706' : '#fbbf24', margin: 0, fontSize: '1.75rem', fontWeight: '800' }}>Venation Expert Badge!</h2>
          <p style={{ color: doneOverlayText, maxWidth: 420, lineHeight: 1.6, fontSize: '0.95rem' }}>
            You correctly identified all 5 leaf venation patterns!<br />
            <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>Hibiscus, Rose</span> → Reticulate (net-like)<br />
            <span style={{ color: '#0891b2', fontWeight: 'bold' }}>Banana, Grass, Maize</span> → Parallel (straight lines)
          </p>
          <p style={{ color: doneOverlaySub, fontSize: '0.82rem', maxWidth: 380, fontStyle: 'italic' }}>
            Remember: Plants with reticulate venation usually have taproots. Plants with parallel venation usually have fibrous roots!
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={handleReset} style={{ background: doneRedoBg, border: 'none', color: doneRedoText, padding: '0.65rem 1.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Redo Lab</button>
            <button onClick={() => onBackToDashboard('next_activity')} style={{ background: '#0ea5e9', border: 'none', color: '#fff', padding: '0.65rem 1.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(14,165,233,0.3)' }}>Next: Roots Lab ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
