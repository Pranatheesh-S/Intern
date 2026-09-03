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

  // Activity 2.6 Design Tokens
  const containerBg = `url(${darkForestBg}) center/cover no-repeat fixed`;
  const textColor = '#0f172a';
  const headerBg = 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)';
  const borderCol = 'rgba(167, 243, 208, 0.95)';
  const sidebarBorder = 'rgba(167, 243, 208, 0.95)';
  const textMuted = '#334155';
  const textFaint = '#475569';
  const cardBg = '#ffffff';
  const cardBorder = 'rgba(167, 243, 208, 0.95)';
  const optBgDefault = '#ffffff';
  const optBorderDefault = 'rgba(167, 243, 208, 0.95)';
  const optTextDefault = '#0f172a';
  const rowOddBg = 'rgba(240, 253, 244, 0.6)';
  const rowEvenBg = '#ffffff';
  const eurekaBg = 'rgba(248, 250, 252, 0.98)';
  const ruleBoxBg = '#ffffff';
  const checkBtnBorder = 'rgba(167, 243, 208, 0.95)';

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
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ background: value === opt.id ? `${opt.color}25` : '#ffffff', border: `2.5px solid ${value === opt.id ? opt.color : 'rgba(167, 243, 208, 0.95)'}`, color: value === opt.id ? opt.color : '#0f172a', padding: '0.6rem 1.05rem', borderRadius: '10px', cursor: checked ? 'default' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', transition: 'all 0.15s', fontWeight: '800', boxShadow: value === opt.id ? `0 4px 12px ${opt.color}40` : '0 2px 6px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '1.25rem' }}>{opt.icon}</span> {opt.label}
        </button>
      ))}
      {checked && isCorrect && <span style={{ color: '#16a34a', fontSize: '1.2rem', fontWeight: '900' }}>✅</span>}
      {checked && isWrong && <span style={{ color: '#dc2626', fontSize: '1.2rem', fontWeight: '900' }}>❌</span>}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: headerBg, backdropFilter: 'blur(16px)', borderBottom: `2px solid ${sidebarBorder}`, padding: '0.9rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBackToDashboard} style={{ background: '#ffffff', border: '1.5px solid rgba(167, 243, 208, 0.95)', color: '#0f172a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: '800', padding: '0.45rem 0.9rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <ArrowLeft size={18} color="#0f172a" /> Back
          </button>
          <div>
            <div style={{ fontSize: '0.95rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.06em', background: 'rgba(14, 165, 233, 0.18)', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1.5px solid rgba(56, 189, 248, 0.4)', display: 'inline-block', marginBottom: '0.35rem', boxShadow: '0 2px 10px rgba(14, 165, 233, 0.25)' }}>Activity 2.7 — Table 2.4</div>
            <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0f172a', letterSpacing: '0.01em' }}>🔗 Venation ↔ Root Correlation Lab</div>
          </div>
        </div>
        <button onClick={handleReset} style={{ background: '#ffffff', border: '2px solid rgba(167, 243, 208, 0.95)', color: '#0f172a', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <RefreshCw size={15} color="#0f172a" /> Reset Lab
        </button>
      </div>

      {/* Instruction */}
      <div style={{ background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)', backdropFilter: 'blur(16px)', borderBottom: `2px solid rgba(167, 243, 208, 0.95)`, padding: '1rem 1.75rem', fontSize: '1.12rem', color: '#0f172a', fontWeight: '700', lineHeight: 1.6, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <strong style={{ color: '#0284c7', fontWeight: '900', fontSize: '1.2rem', background: 'rgba(14, 165, 233, 0.18)', padding: '0.25rem 0.75rem', borderRadius: '8px', border: '1.5px solid rgba(56, 189, 248, 0.4)', marginRight: '0.65rem' }}>Task:</strong> Fill in Table 2.4 below. For each plant, select its leaf venation type AND root system type. Use what you learned from Activities 2.5 and 2.6! Hints are available if you need them.
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: `2px solid ${cardBorder}`, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '33%' }} />
            <col style={{ width: '33%' }} />
          </colgroup>
          <thead>
            <tr>
              {['Plant Name', '#', 'Leaf Venation', 'Root System'].map((h, i) => (
                <th key={i} style={{ background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)', color: '#0284c7', fontSize: '1.08rem', fontWeight: '900', textTransform: 'uppercase', padding: '1.1rem 1.35rem', borderBottom: `3px solid rgba(167, 243, 208, 0.95)`, textAlign: 'left', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: '#ffffff' }}>
            {TABLE_PLANTS.map((plant, idx) => {
              const ans = answers[plant.id];
              const res = results[plant.id];
              const rowOk = res?.venation && res?.root;
              const rowWrong = checked && (!res?.venation || !res?.root);
              const rowBg = rowOk 
                ? 'rgba(220, 252, 231, 0.7)' 
                : rowWrong 
                  ? 'rgba(254, 226, 226, 0.7)' 
                  : idx % 2 === 0 
                    ? '#ffffff' 
                    : 'rgba(240, 253, 244, 0.5)';
              return (
                <tr key={plant.id} style={{ background: rowBg, borderBottom: `1.5px solid ${borderCol}`, transition: 'background 0.3s' }}>
                  {/* Plant name */}
                  <td style={{ padding: '1.35rem 1.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}>{plant.emoji}</span>
                      <div>
                        <div style={{ fontSize: '1.22rem', fontWeight: 900, color: '#0f172a' }}>{plant.name}</div>
                        <div style={{ fontSize: '0.98rem', color: '#334155', fontStyle: 'italic', fontWeight: '700', marginTop: '0.2rem' }}>{plant.hint}</div>
                      </div>
                    </div>
                  </td>
                  {/* Row number */}
                  <td style={{ padding: '1.35rem 0.5rem', textAlign: 'center', fontSize: '1.2rem', color: '#0284c7', fontWeight: '900' }}>{idx + 1}</td>
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
            <button onClick={handleCheck} disabled={!allFilled} style={{ background: allFilled ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#cbd5e1', border: 'none', color: allFilled ? '#ffffff' : '#475569', opacity: 1, padding: '1rem 3.5rem', borderRadius: '14px', cursor: allFilled ? 'pointer' : 'not-allowed', fontSize: '1.18rem', fontWeight: '900', boxShadow: allFilled ? '0 8px 28px rgba(2, 132, 199, 0.4)' : 'none', transition: 'all 0.3s' }}>
              {allFilled ? '🔍 Check My Table' : `Fill all rows to continue (${TABLE_PLANTS.filter(p => answers[p.id].venation && answers[p.id].root).length}/${TABLE_PLANTS.length} done)`}
            </button>
          </div>
        )}

        {/* Partial error */}
        {checked && !allCorrect && (
          <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ color: '#991b1b', fontSize: '1.08rem', fontWeight: '900', textAlign: 'center', background: '#fee2e2', padding: '0.75rem 1.6rem', borderRadius: '12px', border: '2px solid #ef4444', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.15)' }}>Some entries are incorrect. Check the highlighted rows and try again!</div>
            <button onClick={handleReset} style={{ background: '#ffffff', border: '2px solid #dc2626', color: '#dc2626', padding: '0.6rem 1.8rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '900', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>Try Again</button>
          </div>
        )}
      </div>

      {/* EUREKA OVERLAY */}
      {showEureka && (
        <div style={{ position: 'absolute', inset: 0, background: eurekaBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', zIndex: 50, padding: '2rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.3))' }}>💡</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#0f172a', margin: '0 0 0.4rem 0', fontWeight: '900', fontSize: '1.85rem' }}>Eureka! You discovered the Rule!</h2>
            <p style={{ color: '#334155', margin: 0, fontSize: '1.12rem', fontWeight: '700' }}>Table 2.4 is complete — and look at the pattern that emerged!</p>
          </div>

          {/* Rule diagram */}
          <div style={{ background: ruleBoxBg, borderRadius: '22px', padding: '2rem', border: `2px solid ${cardBorder}`, maxWidth: 580, width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h4 style={{ color: '#0284c7', margin: '0 0 1.5rem 0', textAlign: 'center', fontSize: '1.35rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em' }}>🔑 The Correlation Rule</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.25rem', alignItems: 'center' }}>
              {/* Reticulate → Taproot */}
              <div style={{ background: '#f5f3ff', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid #ddd6fe', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🕸️</div>
                <div style={{ color: '#6d28d9', fontWeight: '900', fontSize: '1.05rem' }}>Reticulate Venation</div>
                <div style={{ color: '#334155', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Net-like pattern</div>
              </div>
              <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: '2rem', fontWeight: '900' }}>⟺</div>
              <div style={{ background: '#fffbeb', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid #fde68a', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🥕</div>
                <div style={{ color: '#b45309', fontWeight: '900', fontSize: '1.05rem' }}>Taproot System</div>
                <div style={{ color: '#334155', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>One main root</div>
              </div>

              {/* Parallel → Fibrous */}
              <div style={{ background: '#f0f9ff', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid #bae6fd', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📏</div>
                <div style={{ color: '#0369a1', fontWeight: '900', fontSize: '1.05rem' }}>Parallel Venation</div>
                <div style={{ color: '#334155', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Straight parallel lines</div>
              </div>
              <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: '2rem', fontWeight: '900' }}>⟺</div>
              <div style={{ background: '#f7fee7', borderRadius: '14px', padding: '1.2rem 1rem', textAlign: 'center', border: '2px solid #d9f99d', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🌾</div>
                <div style={{ color: '#4d7c0f', fontWeight: '900', fontSize: '1.05rem' }}>Fibrous Root System</div>
                <div style={{ color: '#334155', fontSize: '0.88rem', fontWeight: '700', marginTop: '0.25rem' }}>Many thin equal roots</div>
              </div>
            </div>
          </div>

          <div style={{ background: ruleBoxBg, borderRadius: '14px', padding: '1.25rem 1.75rem', border: `2px solid ${cardBorder}`, maxWidth: 540, fontSize: '1.05rem', color: '#0f172a', lineHeight: 1.6, textAlign: 'center', fontWeight: '700', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
            <strong style={{ color: '#b45309', fontWeight: '900', fontSize: '1.15rem' }}>Why does this happen?</strong><br />
            Plants with reticulate venation are called <strong style={{ color: '#6d28d9', fontWeight: '900' }}>Dicots</strong> — they have two cotyledons in their seeds and develop a main taproot. Plants with parallel venation are <strong style={{ color: '#0369a1', fontWeight: '900' }}>Monocots</strong> — one cotyledon, fibrous roots. This is how nature keeps things consistent!
          </div>

          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button onClick={handleReset} style={{ background: '#cbd5e1', border: 'none', color: '#0f172a', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.02rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <RefreshCw size={16} /> Redo
            </button>
            <button onClick={() => onBackToDashboard('go_to_quiz')} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.75rem 1.75rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.05rem', fontWeight: '900', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>Next: Take Quiz ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
