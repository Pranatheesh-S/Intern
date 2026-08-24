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
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {options.map(opt => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ background: value === opt.id ? `${opt.color}25` : optBgDefault, border: `1.5px solid ${value === opt.id ? opt.color : optBorderDefault}`, color: value === opt.id ? opt.color : optTextDefault, padding: '0.45rem 0.85rem', borderRadius: '8px', cursor: checked ? 'default' : 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.15s', fontWeight: value === opt.id ? '600' : 'normal' }}>
          <span style={{ fontSize: '1.05rem' }}>{opt.icon}</span> {opt.label}
        </button>
      ))}
      {checked && isCorrect && <span style={{ color: '#4ade80', fontSize: '1rem' }}>✅</span>}
      {checked && isWrong && <span style={{ color: '#f87171', fontSize: '1rem' }}>❌</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: headerBg, borderBottom: `1px solid ${sidebarBorder}`, padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#8b5cf6', textTransform: 'uppercase', fontWeight: 'bold' }}>Activity 2.7 — Table 2.4</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: textColor }}>🔗 Venation ↔ Root Correlation Lab</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: 'none', border: `1px solid ${checkBtnBorder}`, color: textMuted, padding: '0.35rem 0.7rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Instruction */}
      <div style={{ background: containerBg, borderBottom: `1px solid ${borderCol}`, padding: '0.75rem 1.5rem', fontSize: '0.82rem', color: textMuted, lineHeight: 1.6 }}>
        <strong style={{ color: '#a78bfa' }}>Task:</strong> Fill in Table 2.4 below. For each plant, select its leaf venation type AND root system type. Use what you learned from Activities 2.5 and 2.6! Hints are available if you need them.
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '33%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Plant Name', '#', 'Leaf Venation', 'Root System'].map((h, i) => (
                <th key={i} style={{ background: headerBg, color: '#8b5cf6', fontSize: '0.95rem', fontWeight: 'bold', textTransform: 'uppercase', padding: '1rem 1.25rem', borderBottom: `2px solid ${sidebarBorder}`, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_PLANTS.map((plant, idx) => {
              const ans = answers[plant.id];
              const res = results[plant.id];
              const rowOk = res?.venation && res?.root;
              const rowWrong = checked && (!res?.venation || !res?.root);
              return (
                <tr key={plant.id} style={{ background: rowOk ? (isLight ? 'rgba(74,222,128,0.1)' : 'rgba(74,222,128,0.05)') : rowWrong ? (isLight ? 'rgba(248,113,113,0.1)' : 'rgba(248,113,113,0.05)') : idx % 2 === 0 ? rowOddBg : rowEvenBg, borderBottom: `1px solid ${borderCol}`, transition: 'background 0.3s' }}>
                  {/* Plant name */}
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{plant.emoji}</span>
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 600, color: textColor }}>{plant.name}</div>
                        <div style={{ fontSize: '0.8rem', color: textMuted, fontStyle: 'italic', marginTop: '0.15rem' }}>{plant.hint}</div>
                      </div>
                    </div>
                  </td>
                  {/* Row number */}
                  <td style={{ padding: '1.2rem 0.5rem', textAlign: 'center', fontSize: '1rem', color: textMuted, fontWeight: 'bold' }}>{idx + 1}</td>
                  {/* Venation */}
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    <CellPicker options={VENATION_OPTIONS} value={ans.venation} isCorrect={res?.venation} isWrong={checked && !res?.venation} onChange={v => handleSet(plant.id, 'venation', v)} />
                  </td>
                  {/* Root */}
                  <td style={{ padding: '1.2rem 1.25rem' }}>
                    <CellPicker options={ROOT_OPTIONS} value={ans.root} isCorrect={res?.root} isWrong={checked && !res?.root} onChange={v => handleSet(plant.id, 'root', v)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Check button */}
        {!checked && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={handleCheck} disabled={!allFilled} style={{ background: allFilled ? '#8b5cf6' : (isLight ? '#cbd5e1' : '#1e293b'), border: 'none', color: allFilled ? '#fff' : (isLight ? '#94a3b8' : '#475569'), padding: '0.9rem 3.5rem', borderRadius: '10px', cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1.05rem', fontWeight: 'bold', boxShadow: allFilled ? '0 4px 16px rgba(139,92,246,0.4)' : 'none', transition: 'all 0.3s' }}>
              {allFilled ? '🔍 Check My Table' : `Fill all rows to continue (${TABLE_PLANTS.filter(p => answers[p.id].venation && answers[p.id].root).length}/${TABLE_PLANTS.length} done)`}
            </button>
          </div>
        )}

        {/* Partial error */}
        {checked && !allCorrect && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>Some entries are incorrect. Check the highlighted rows and try again!</div>
            <button onClick={handleReset} style={{ background: isLight ? '#cbd5e1' : '#1e293b', border: '1px solid rgba(248,113,113,0.3)', color: isLight ? '#b91c1c' : '#f87171', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Try Again</button>
          </div>
        )}
      </div>

      {/* EUREKA OVERLAY */}
      {showEureka && (
        <div style={{ position: 'absolute', inset: 0, background: eurekaBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', zIndex: 50, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '3rem' }}>💡</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: isLight ? '#d97706' : '#fbbf24', margin: '0 0 0.25rem 0', fontWeight: '800' }}>Eureka! You discovered the Rule!</h2>
            <p style={{ color: textMuted, margin: 0, fontSize: '0.85rem' }}>Table 2.4 is complete — and look at the pattern that emerged!</p>
          </div>

          {/* Rule diagram */}
          <div style={{ background: ruleBoxBg, borderRadius: '20px', padding: '2rem', border: `1px solid ${cardBorder}`, maxWidth: 520, width: '100%' }}>
            <h4 style={{ color: '#8b5cf6', margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}>🔑 The Correlation Rule</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
              {/* Reticulate → Taproot */}
              <div style={{ background: isLight ? '#ffffff' : 'rgba(124,58,237,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(124,58,237,0.3)', boxShadow: isLight ? '0 4px 6px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🕸️</div>
                <div style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '0.85rem' }}>Reticulate Venation</div>
                <div style={{ color: textMuted, fontSize: '0.7rem', marginTop: '0.2rem' }}>Net-like pattern</div>
              </div>
              <div style={{ textAlign: 'center', color: isLight ? '#d97706' : '#fbbf24', fontSize: '1.5rem' }}>⟺</div>
              <div style={{ background: isLight ? '#ffffff' : 'rgba(245,158,11,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(245,158,11,0.3)', boxShadow: isLight ? '0 4px 6px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🥕</div>
                <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '0.85rem' }}>Taproot System</div>
                <div style={{ color: textMuted, fontSize: '0.7rem', marginTop: '0.2rem' }}>One main root</div>
              </div>

              {/* Parallel → Fibrous */}
              <div style={{ background: isLight ? '#ffffff' : 'rgba(8,145,178,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(8,145,178,0.3)', boxShadow: isLight ? '0 4px 6px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📏</div>
                <div style={{ color: '#0891b2', fontWeight: 'bold', fontSize: '0.85rem' }}>Parallel Venation</div>
                <div style={{ color: textMuted, fontSize: '0.7rem', marginTop: '0.2rem' }}>Straight parallel lines</div>
              </div>
              <div style={{ textAlign: 'center', color: isLight ? '#d97706' : '#fbbf24', fontSize: '1.5rem' }}>⟺</div>
              <div style={{ background: isLight ? '#ffffff' : 'rgba(132,204,22,0.1)', borderRadius: '12px', padding: '1rem', textAlign: 'center', border: '1px solid rgba(132,204,22,0.3)', boxShadow: isLight ? '0 4px 6px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>🌾</div>
                <div style={{ color: '#84cc16', fontWeight: 'bold', fontSize: '0.85rem' }}>Fibrous Root System</div>
                <div style={{ color: textMuted, fontSize: '0.7rem', marginTop: '0.2rem' }}>Many thin equal roots</div>
              </div>
            </div>
          </div>

          <div style={{ background: ruleBoxBg, borderRadius: '12px', padding: '1rem 1.5rem', border: `1px solid ${cardBorder}`, maxWidth: 480, fontSize: '0.82rem', color: textMuted, lineHeight: 1.6, textAlign: 'center' }}>
            <strong style={{ color: isLight ? '#d97706' : '#fbbf24' }}>Why does this happen?</strong><br />
            Plants with reticulate venation are called <strong style={{ color: '#7c3aed' }}>Dicots</strong> — they have two cotyledons in their seeds and develop a main taproot. Plants with parallel venation are <strong style={{ color: '#0891b2' }}>Monocots</strong> — one cotyledon, fibrous roots. This is how nature keeps things consistent!
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: isLight ? '#cbd5e1' : '#1e293b', border: 'none', color: textColor, padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <RefreshCw size={14} /> Redo
            </button>
            <button onClick={() => onBackToDashboard('go_to_quiz')} style={{ background: '#8b5cf6', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Next: Take Quiz ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
