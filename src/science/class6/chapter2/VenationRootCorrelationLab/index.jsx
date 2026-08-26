import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

const TABLE_PLANTS = [
  { id: 'lemongrass',  name: 'Lemon Grass',   emoji: '🌿', venation: 'parallel',   root: 'fibrous', hint: 'Grass-family plant — narrow leaves, grows in clumps.' },
  { id: 'marigold',    name: 'Marigold',       emoji: '🌼', venation: 'reticulate', root: 'taproot', hint: 'Broad leaf with a visible midrib and net pattern.' },
  { id: 'sadabahar',   name: 'Sadabahar',      emoji: '🌸', venation: 'reticulate', root: 'taproot', hint: 'Periwinkle — shiny oval leaves, net venation.' },
  { id: 'mustard',     name: 'Mustard',        emoji: '🟡', venation: 'reticulate', root: 'taproot', hint: 'Broad wavy leaves with a prominent midrib.' },
  { id: 'chickpea',    name: 'Chickpea',       emoji: '🫘', venation: 'reticulate', root: 'taproot', hint: 'Compound leaves with net venation — dicot plant.' },
];

const VENATION_OPTIONS = [
  { id: 'reticulate', label: 'Reticulate (Net)', icon: '🕸️', color: '#7c3aed' },
  { id: 'parallel',   label: 'Parallel (Lines)', icon: '📏', color: '#0891b2' },
];
const ROOT_OPTIONS = [
  { id: 'taproot',  label: 'Taproot',  icon: '🥕', color: '#f59e0b' },
  { id: 'fibrous',  label: 'Fibrous',  icon: '🌾', color: '#84cc16' },
];

export default function VenationRootCorrelationLab({ onBackToDashboard }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Theme-specific styles
  const containerBg = `url(${darkForestBg}) center/cover no-repeat fixed`;
  const textColor = isLight ? '#0f172a' : '#f0f9ff';
  const headerBg = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(22, 27, 34, 0.88)';
  const borderCol = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.05)';
  const sidebarBorder = isLight ? '#e2e8f0' : 'rgba(139,92,246,0.2)';
  const textMuted = isLight ? '#475569' : '#94a3b8';
  const textFaint = isLight ? '#64748b' : '#64748b';
  const cardBg = isLight ? '#ffffff' : '#161b22';
  const cardBorder = isLight ? '#e2e8f0' : 'rgba(139,92,246,0.3)';
  const optBgDefault = isLight ? '#ffffff' : 'rgba(255,255,255,0.03)';
  const optBorderDefault = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.08)';
  const optTextDefault = isLight ? '#475569' : '#94a3b8';
  const rowOddBg = isLight ? '#f1f5f9' : '#0d1117';
  const rowEvenBg = isLight ? '#ffffff' : '#0f1520';
  const eurekaBg = isLight ? 'rgba(255,255,255,0.98)' : 'rgba(13,17,23,0.97)';
  const ruleBoxBg = isLight ? '#f8fafc' : '#161b22';
  const checkBtnBorder = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.1)';

  const [answers, setAnswers] = useState(() => Object.fromEntries(TABLE_PLANTS.map(p => [p.id, { venation: null, root: null }])));
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({});
  const [showEureka, setShowEureka] = useState(false);

  const allFilled = TABLE_PLANTS.every(p => answers[p.id].venation && answers[p.id].root);
  const allCorrect = TABLE_PLANTS.every(p => results[p.id]?.venation && results[p.id]?.root);

  const handleSet = (plantId, field, value) => {
    if (checked) return;
    setAnswers(prev => ({ ...prev, [plantId]: { ...prev[plantId], [field]: value } }));
  };

  const handleCheck = () => {
    const res = {};
    TABLE_PLANTS.forEach(p => {
      res[p.id] = {
        venation: answers[p.id].venation === p.venation,
        root: answers[p.id].root === p.root,
      };
    });
    setResults(res);
    setChecked(true);
    const allRight = TABLE_PLANTS.every(p => res[p.id].venation && res[p.id].root);
    if (allRight) {
      setTimeout(() => {
        setShowEureka(true);
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.4 } });
      }, 600);
    }
  };

  const handleReset = () => {
    setAnswers(Object.fromEntries(TABLE_PLANTS.map(p => [p.id, { venation: null, root: null }])));
    setChecked(false); setResults({}); setShowEureka(false);
  };

  const CellPicker = ({ options, value, isCorrect, isWrong, onChange }) => (
    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ background: value === opt.id ? `${opt.color}35` : (isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'), border: `2.5px solid ${value === opt.id ? opt.color : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)')}`, color: value === opt.id ? opt.color : (isLight ? '#0f172a' : '#f8fafc'), padding: '0.6rem 1.05rem', borderRadius: '10px', cursor: checked ? 'default' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', transition: 'all 0.15s', fontWeight: '800', boxShadow: value === opt.id ? `0 4px 12px ${opt.color}40` : 'none' }}>
          <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span> {opt.label}
        </button>
      ))}
      {checked && isCorrect && <span style={{ color: '#4ade80', fontSize: '1.2rem', fontWeight: '900' }}>✅</span>}
      {checked && isWrong && <span style={{ color: '#f87171', fontSize: '1.2rem', fontWeight: '900' }}>❌</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: headerBg, borderBottom: `2px solid ${sidebarBorder}`, padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToDashboard} style={{ background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.1)', border: '1.5px solid rgba(56, 189, 248, 0.4)', color: isLight ? '#0f172a' : '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: '800', padding: '0.45rem 0.9rem', borderRadius: '8px' }}>
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.95rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.06em', background: 'rgba(14, 165, 233, 0.18)', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1.5px solid rgba(56, 189, 248, 0.4)', display: 'inline-block', marginBottom: '0.35rem', boxShadow: '0 2px 10px rgba(14, 165, 233, 0.25)' }}>Activity 2.7 — Table 2.4</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#38bdf8', letterSpacing: '0.01em' }}>🔗 Venation ↔ Root Correlation Lab</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.1)', border: '1.5px solid rgba(255, 255, 255, 0.25)', color: isLight ? '#0f172a' : '#fef3c7', padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <RefreshCw size={15} /> Reset
        </button>
      </div>

      {/* Instruction */}
      <div style={{ background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.92)', borderBottom: `2px solid rgba(56, 189, 248, 0.3)`, padding: '1rem 1.75rem', fontSize: '1.12rem', color: isLight ? '#0f172a' : '#f8fafc', fontWeight: '700', lineHeight: 1.6 }}>
        <strong style={{ color: '#38bdf8', fontWeight: '900', fontSize: '1.2rem', background: 'rgba(56, 189, 248, 0.15)', padding: '0.2rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.3)', marginRight: '0.5rem' }}>Task:</strong> Fill in Table 2.4 below. For each plant, select its leaf venation type AND root system type. Use what you learned from Activities 2.5 and 2.6! Hints are available if you need them.
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', background: isLight ? '#ffffff' : '#0f172a', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '33%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Plant Name', '#', 'Leaf Venation', 'Root System'].map((h, i) => (
                <th key={i} style={{ background: isLight ? '#f1f5f9' : '#0f172a', color: '#38bdf8', fontSize: '1.08rem', fontWeight: '900', textTransform: 'uppercase', padding: '1.1rem 1.35rem', borderBottom: `3px solid #0284c7`, textAlign: 'left', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: isLight ? '#ffffff' : '#0f172a' }}>
            {TABLE_PLANTS.map((plant, idx) => {
              const ans = answers[plant.id];
              const res = results[plant.id];
              const rowOk = res?.venation && res?.root;
              const rowWrong = checked && (!res?.venation || !res?.root);
              const rowBg = rowOk 
                ? (isLight ? '#dcfce7' : '#0d281e') 
                : rowWrong 
                  ? (isLight ? '#fee2e2' : '#2b1419') 
                  : idx % 2 === 0 
                    ? (isLight ? '#ffffff' : '#0f172a') 
                    : (isLight ? '#f8fafc' : '#141e33');
              return (
                <tr key={plant.id} style={{ background: rowBg, borderBottom: `1.5px solid ${borderCol}`, transition: 'background 0.3s' }}>
                  {/* Plant name */}
                  <td style={{ padding: '1.35rem 1.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>{plant.emoji}</span>
                      <div>
                        <div style={{ fontSize: '1.22rem', fontWeight: 900, color: textColor }}>{plant.name}</div>
                        <div style={{ fontSize: '0.98rem', color: isLight ? '#334155' : '#cbd5e1', fontStyle: 'italic', fontWeight: '700', marginTop: '0.2rem' }}>{plant.hint}</div>
                      </div>
                    </div>
                  </td>
                  {/* Row number */}
                  <td style={{ padding: '1.35rem 0.5rem', textAlign: 'center', fontSize: '1.2rem', color: '#38bdf8', fontWeight: '900' }}>{idx + 1}</td>
                  {/* Venation */}
                  <td style={{ padding: '1.35rem 1.35rem' }}>
                    <CellPicker options={VENATION_OPTIONS} value={ans.venation} isCorrect={res?.venation} isWrong={checked && !res?.venation} onChange={v => handleSet(plant.id, 'venation', v)} />
                  </td>
                  {/* Root */}
                  <td style={{ padding: '1.35rem 1.35rem' }}>
                    <CellPicker options={ROOT_OPTIONS} value={ans.root} isCorrect={res?.root} isWrong={checked && !res?.root} onChange={v => handleSet(plant.id, 'root', v)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Check button */}
        {!checked && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.2rem' }}>
            <button onClick={handleCheck} disabled={!allFilled} style={{ background: allFilled ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'var(--accent, #4f46e5)', border: 'none', color: '#ffffff', opacity: 1, padding: '1rem 3.5rem', borderRadius: '14px', cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1.18rem', fontWeight: '900', boxShadow: allFilled ? '0 8px 28px rgba(2, 132, 199, 0.5)' : '0 4px 14px rgba(79, 70, 229, 0.4)', transition: 'all 0.3s' }}>
              {allFilled ? '🔍 Check My Table' : `Fill all rows to continue (${TABLE_PLANTS.filter(p => answers[p.id].venation && answers[p.id].root).length}/${TABLE_PLANTS.length} done)`}
            </button>
          </div>
        )}

        {/* Partial error */}
        {checked && !allCorrect && (
          <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ color: '#ffffff', fontSize: '1.08rem', fontWeight: '900', textAlign: 'center', background: '#991b1b', padding: '0.6rem 1.4rem', borderRadius: '10px', border: '1.5px solid #dc2626', boxShadow: '0 4px 14px rgba(153, 27, 27, 0.4)' }}>Some entries are incorrect. Check the highlighted rows and try again!</div>
            <button onClick={handleReset} style={{ background: '#991b1b', border: '1.5px solid #dc2626', color: '#ffffff', padding: '0.6rem 1.8rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '900', boxShadow: '0 4px 14px rgba(153, 27, 27, 0.4)' }}>Try Again</button>
          </div>
        )}
      </div>

      {/* EUREKA OVERLAY */}
      {showEureka && (
        <div style={{ position: 'absolute', inset: 0, background: eurekaBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', zIndex: 50, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.4))' }}>💡</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: isLight ? '#ea580c' : '#f59e0b', margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.85rem' }}>Eureka! You discovered the Rule!</h2>
            <p style={{ color: isLight ? '#0f172a' : '#f8fafc', margin: 0, fontSize: '1.12rem', fontWeight: '800' }}>Table 2.4 is complete — and look at the pattern that emerged!</p>
          </div>

          {/* Rule diagram */}
          <div style={{ background: ruleBoxBg, borderRadius: '22px', padding: '2.2rem', border: `2px solid ${cardBorder}`, maxWidth: 580, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <h4 style={{ color: '#38bdf8', margin: '0 0 1.75rem 0', textAlign: 'center', fontSize: '1.35rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🔑 The Correlation Rule</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.25rem', alignItems: 'center' }}>
              {/* Reticulate → Taproot */}
              <div style={{ background: isLight ? '#ffffff' : 'rgba(124,58,237,0.18)', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid rgba(124,58,237,0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🕸️</div>
                <div style={{ color: '#a78bfa', fontWeight: '900', fontSize: '1.05rem' }}>Reticulate Venation</div>
                <div style={{ color: isLight ? '#334155' : '#cbd5e1', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Net-like pattern</div>
              </div>
              <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: '2rem', fontWeight: '900' }}>⟺</div>
              <div style={{ background: isLight ? '#ffffff' : 'rgba(245,158,11,0.18)', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid rgba(245,158,11,0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🥕</div>
                <div style={{ color: '#f59e0b', fontWeight: '900', fontSize: '1.05rem' }}>Taproot System</div>
                <div style={{ color: isLight ? '#334155' : '#cbd5e1', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>One main root</div>
              </div>

              {/* Parallel → Fibrous */}
              <div style={{ background: isLight ? '#ffffff' : 'rgba(8,145,178,0.18)', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid rgba(8,145,178,0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📏</div>
                <div style={{ color: '#38bdf8', fontWeight: '900', fontSize: '1.05rem' }}>Parallel Venation</div>
                <div style={{ color: isLight ? '#334155' : '#cbd5e1', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Straight parallel lines</div>
              </div>
              <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: '2rem', fontWeight: '900' }}>⟺</div>
              <div style={{ background: isLight ? '#ffffff' : 'rgba(132,204,22,0.18)', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid rgba(132,204,22,0.4)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🌾</div>
                <div style={{ color: '#a3e635', fontWeight: '900', fontSize: '1.05rem' }}>Fibrous Root System</div>
                <div style={{ color: isLight ? '#334155' : '#cbd5e1', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Many thin equal roots</div>
              </div>
            </div>
          </div>

          <div style={{ background: ruleBoxBg, borderRadius: '14px', padding: '1.25rem 1.75rem', border: `2px solid ${cardBorder}`, maxWidth: 540, fontSize: '1.05rem', color: isLight ? '#0f172a' : '#f8fafc', lineHeight: 1.6, textAlign: 'center', fontWeight: '700' }}>
            <strong style={{ color: '#f59e0b', fontWeight: '900', fontSize: '1.15rem' }}>Why does this happen?</strong><br />
            Plants with reticulate venation are called <strong style={{ color: '#a78bfa', fontWeight: '900' }}>Dicots</strong> — they have two cotyledons in their seeds and develop a main taproot. Plants with parallel venation are <strong style={{ color: '#38bdf8', fontWeight: '900' }}>Monocots</strong> — one cotyledon, fibrous roots. This is how nature keeps things consistent!
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button onClick={handleReset} style={{ background: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.25)', color: textColor, padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <RefreshCw size={16} /> Redo
            </button>
            <button onClick={() => onBackToDashboard('go_to_quiz')} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: '900', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>Next: Take Quiz ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
