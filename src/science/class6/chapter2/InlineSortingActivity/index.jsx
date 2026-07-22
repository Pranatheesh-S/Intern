import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, ChevronRight, Award, HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext.jsx';

const SORT_ITEMS = [
  { id: 'rose', name: 'Rose Plant', type: 'shrub', desc: 'Medium height, thin woody stem branching near base.' },
  { id: 'grass', name: 'Grass', type: 'herb', desc: 'Short, soft green stem with no woodiness.' },
  { id: 'banyan', name: 'Banyan Tree', type: 'tree', desc: 'Very tall, thick hard brown trunk.' },
  { id: 'tomato', name: 'Tomato Plant', type: 'herb', desc: 'Short, green tender stem.' },
  { id: 'hibiscus', name: 'Hibiscus', type: 'shrub', desc: 'Medium height, woody branches branching near ground.' },
  { id: 'mango', name: 'Mango Tree', type: 'tree', desc: 'Tall, thick woody trunk branching high up.' }
];

const renderPlantSVG = (id) => {
  switch (id) {
    case 'rose':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <path d="M50,90 Q45,60 51,35" fill="none" stroke="#047857" strokeWidth="3" />
          <path d="M48,65 Q32,58 36,48" fill="none" stroke="#047857" strokeWidth="2.5" />
          <path d="M36,48 C30,42 45,38 48,58" fill="#10b981" />
          <path d="M51,52 Q68,48 62,38" fill="none" stroke="#047857" strokeWidth="2.5" />
          <path d="M62,38 C68,32 55,30 51,48" fill="#10b981" />
          <path d="M48,72 L42,70 L48,68" fill="#047857" />
          <path d="M52,56 L58,54 L52,52" fill="#047857" />
          <circle cx="51" cy="30" r="13" fill="#ef4444" />
          <circle cx="44" cy="24" r="11" fill="#dc2626" />
          <circle cx="58" cy="24" r="11" fill="#dc2626" />
          <circle cx="51" cy="18" r="9" fill="#f87171" />
          <circle cx="51" cy="28" r="6" fill="#b91c1c" />
        </svg>
      );
    case 'grass':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <path d="M15,85 C35,88 65,88 85,85" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M50,85 Q38,35 20,15 C32,35 46,65 50,85" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
          <path d="M50,85 Q58,30 78,10 C68,30 57,65 50,85" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
          <path d="M45,85 Q32,45 38,25 C42,42 44,72 45,85" fill="#059669" />
          <path d="M55,85 Q68,50 62,30 C60,48 57,72 55,85" fill="#059669" />
          <path d="M50,85 Q50,40 52,20 C48,40 48,70 50,85" fill="#047857" />
        </svg>
      );
    case 'banyan':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <path d="M35,90 L38,55 Q25,45 18,35 L28,35 Q38,50 45,55 Q52,50 62,35 L72,35 Q65,45 58,55 L61,90 Z" fill="#78350f" />
          <path d="M26,45 Q24,68 28,90" fill="none" stroke="#92400e" strokeWidth="2" />
          <path d="M72,45 Q74,68 70,90" fill="none" stroke="#92400e" strokeWidth="2" />
          <path d="M50,52 Q51,72 49,90" fill="none" stroke="#92400e" strokeWidth="2" />
          <circle cx="50" cy="28" r="23" fill="#065f46" />
          <circle cx="30" cy="34" r="18" fill="#047857" />
          <circle cx="70" cy="34" r="18" fill="#047857" />
          <circle cx="40" cy="20" r="16" fill="#10b981" />
          <circle cx="60" cy="20" r="16" fill="#10b981" />
        </svg>
      );
    case 'tomato':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <path d="M50,90 Q47,55 51,25" fill="none" stroke="#059669" strokeWidth="3" />
          <path d="M50,68 Q30,58 36,42" fill="none" stroke="#059669" strokeWidth="2.5" />
          <path d="M51,52 Q70,48 65,35" fill="none" stroke="#059669" strokeWidth="2.5" />
          <path d="M36,42 C32,38 42,32 46,47" fill="#10b981" />
          <path d="M65,35 C68,30 56,28 52,44" fill="#10b981" />
          <circle cx="32" cy="58" r="9" fill="#ef4444" />
          <path d="M32,49 L32,51" stroke="#047857" strokeWidth="2" />
          <circle cx="64" cy="50" r="9" fill="#ef4444" />
          <path d="M64,41 L64,43" stroke="#047857" strokeWidth="2" />
          <circle cx="50" cy="32" r="8" fill="#f59e0b" />
        </svg>
      );
    case 'hibiscus':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <line x1="50" y1="90" x2="50" y2="68" stroke="#78350f" strokeWidth="3.5" />
          <path d="M50,78 Q30,62 22,48" stroke="#78350f" strokeWidth="2.5" fill="none" />
          <path d="M50,78 Q70,62 78,48" stroke="#78350f" strokeWidth="2.5" fill="none" />
          <path d="M50,68 Q50,42 52,32" stroke="#78350f" strokeWidth="2.5" fill="none" />
          <circle cx="22" cy="48" r="11" fill="#047857" fillOpacity="0.8" />
          <circle cx="78" cy="48" r="11" fill="#047857" fillOpacity="0.8" />
          <circle cx="50" cy="32" r="13" fill="#059669" />
          <path d="M52,32 C40,20 64,20 52,32 C52,18 69,32 52,32 C64,44 40,44 52,32 C40,38 40,20 52,32" fill="#f43f5e" />
          <circle cx="52" cy="32" r="3.5" fill="#e11d48" />
          <line x1="52" y1="32" x2="60" y2="20" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="60" cy="20" r="3" fill="#f59e0b" />
        </svg>
      );
    case 'mango':
      return (
        <svg width="70" height="70" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="#ffffff" />
          <rect x="43" y="52" width="14" height="38" fill="#451a03" />
          <path d="M43,58 Q30,48 26,38" stroke="#451a03" strokeWidth="3" fill="none" />
          <path d="M57,58 Q70,48 74,38" stroke="#451a03" strokeWidth="3" fill="none" />
          <circle cx="50" cy="32" r="22" fill="#047857" />
          <circle cx="34" cy="36" r="15" fill="#065f46" />
          <circle cx="66" cy="36" r="15" fill="#065f46" />
          <ellipse cx="36" cy="44" rx="5" ry="7.5" fill="#fbbf24" transform="rotate(15 36 44)" />
          <ellipse cx="62" cy="40" rx="5" ry="7.5" fill="#fbbf24" transform="rotate(-10 62 40)" />
          <ellipse cx="50" cy="25" rx="5" ry="7.5" fill="#f59e0b" transform="rotate(5 50 25)" />
        </svg>
      );
    default:
      return null;
  }
};

export default function InlineSortingActivity({ onBackToDashboard }) {
  const { theme } = useTheme();
  
  // Game states
  const [selectedItem, setSelectedItem] = useState(null);
  const [correctCounts, setCorrectCounts] = useState({}); // itemId -> category
  const [statusMsg, setStatusMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (Object.keys(correctCounts).length === SORT_ITEMS.length) {
      setShowSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [correctCounts]);

  const handleItemClick = (item) => {
    if (correctCounts[item.id]) return;
    setSelectedItem(item);
    setStatusMsg('');
  };

  const handleBinClick = (category) => {
    if (!selectedItem) return;
    handleClassify(selectedItem, category);
  };

  const handleClassify = (item, category) => {
    if (item.type === category) {
      setCorrectCounts(prev => ({ ...prev, [item.id]: category }));
      setStatusMsg(`✅ Correct! ${item.name} is classified as a ${category.toUpperCase()}.`);
      setSelectedItem(null);
    } else {
      setStatusMsg(`❌ Try again! ${item.name} is not a ${category.toUpperCase()}. Think about its stem and height.`);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (draggedItem) {
      handleClassify(draggedItem, category);
      setDraggedItem(null);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setCorrectCounts({});
    setStatusMsg('');
    setShowSuccess(false);
    setDraggedItem(null);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      background: 'var(--page-bg)',
      fontFamily: 'var(--geo-font)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <div className="split-frame">
        
        {/* ============ LEFT COLUMN: LESSON & GUIDELINES ============ */}
        <div className="frame-page-left" style={{ padding: '2.5rem 2rem' }}>
          <div className="textbook-eyebrow" style={{ fontSize: '13px' }}>Activity 2.3 · Classification Lab</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>
            Let Us Group Plants
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '16px', color: 'var(--mut)', lineHeight: '1.65' }}>
            <p>
              In this activity, we put our classification skills to the test. Botanists sort plants into three primary categories based on growth habits:
            </p>
            <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li>🌱 <strong style={{ color: 'var(--navy)' }}>Herbs:</strong> Short plants (usually under 1 meter) with soft, green, and tender stems. Easy to bend.</li>
              <li>🌺 <strong style={{ color: 'var(--navy)' }}>Shrubs:</strong> Medium-sized plants (1 to 3 meters) with thin, woody stems branching out close to the base.</li>
              <li>🌳 <strong style={{ color: 'var(--navy)' }}>Trees:</strong> Tall plants (above 3 meters) with a single, thick, hard woody trunk. Branches start high up.</li>
            </ul>
          </div>

          <div className="textbook-explore" style={{ marginTop: '2rem', fontSize: '14.5px', padding: '1.1rem' }}>
            👉 <b>Classification Challenge:</b> Drag each plant card on the right and drop it into its correct category tray. You can also click a card and then select a tray!
          </div>

          {showSuccess && (
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🎉 Classification Complete!
                </span>
                <span style={{ fontSize: '13px', color: 'var(--mut)' }}>
                  Excellent job! You correctly categorized all 6 specimens.
                </span>
                <button onClick={() => onBackToDashboard('go_to_quiz')} className="primary" style={{ background: '#10b981', borderColor: '#10b981', width: '100%', fontSize: '13.5px', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '0.5rem' }}>
                  Proceed to Checkpoint Quiz ➔
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============ RIGHT COLUMN: SORTING WORKSPACE ============ */}
        <div className="frame-page-right" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--cardline)', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--mut)' }}>
              🗂️ Botanical sorting workspace
            </span>
            <button onClick={handleReset} className="outline" style={{ fontSize: '12px', padding: '0.4rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={12} /> Reset Sorting
            </button>
          </div>

          {showSuccess ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', minHeight: '350px' }}>
              <div style={{ padding: '1.5rem', background: '#ecfdf5', borderRadius: '50%', border: '3px solid #10b981' }}>
                <Award size={64} color="#16a34a" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--serif-font)', color: 'var(--navy)', margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>Perfect Classification!</h3>
                <p style={{ fontSize: '14.5px', color: 'var(--mut)', maxWidth: '360px', margin: 0, lineHeight: '1.5' }}>
                  You have successfully grouped Herbs, Shrubs, and Trees by their physical characteristics. Click complete in the left pane to check your level progress!
                </p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Items tray */}
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--navy)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  1. Plant Specimens Tray (Drag or Click a Card)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                  {SORT_ITEMS.map(item => {
                    const isSorted = !!correctCounts[item.id];
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        draggable={!isSorted}
                        onDragStart={(e) => handleDragStart(e, item)}
                        onClick={() => handleItemClick(item)}
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.04)' : '#ffffff',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--cardline)',
                          borderRadius: '12px',
                          padding: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          cursor: isSorted ? 'default' : 'grab',
                          opacity: isSorted ? 0.35 : 1,
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 8px 24px rgba(99,102,241,0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ background: '#f8fafc', borderRadius: '50%', padding: '4px', border: '1px solid #f1f5f9' }}>
                          {renderPlantSVG(item.id)}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--navy)', textDecoration: isSorted ? 'line-through' : 'none' }}>
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active description */}
              {selectedItem && (
                <div style={{ background: '#eff6ff', borderLeft: '4px solid var(--accent)', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '13.5px', color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>ℹ️</span>
                  <span><strong>{selectedItem.name} Tip:</strong> {selectedItem.desc}</span>
                </div>
              )}

              {/* Bins grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  2. Classification Trays (Drop or Select category)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { key: 'herb', label: '🌿 Herbs Bin', bg: 'rgba(16, 185, 129, 0.03)', border: '2px dashed #10b981', activeBorder: '2px solid #10b981', color: '#1b5e20', rule: 'Soft green stems, short height.' },
                    { key: 'shrub', label: '🌺 Shrubs Bin', bg: 'rgba(245, 158, 11, 0.03)', border: '2px dashed #f59e0b', activeBorder: '2px solid #f59e0b', color: '#b45309', rule: 'Medium height, branches near ground.' },
                    { key: 'tree', label: '🌳 Trees Bin', bg: 'rgba(30, 58, 138, 0.03)', border: '2px dashed #3b82f6', activeBorder: '2px solid #3b82f6', color: '#1e3a8a', rule: 'Single thick woody trunk branching high.' }
                  ].map(bin => {
                    const itemsInBin = SORT_ITEMS.filter(item => correctCounts[item.id] === bin.key);
                    const canDrop = !!selectedItem;
                    return (
                      <div
                        key={bin.key}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, bin.key)}
                        onClick={() => handleBinClick(bin.key)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '1.25rem 0.85rem',
                          minHeight: '180px',
                          background: bin.bg,
                          border: canDrop ? bin.activeBorder : bin.border,
                          borderRadius: '16px',
                          cursor: canDrop ? 'pointer' : 'default',
                          transition: 'all 0.2s',
                          boxShadow: canDrop ? '0 8px 24px rgba(0,0,0,0.04)' : 'none'
                        }}
                      >
                        <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: bin.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                          {bin.label}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--mut)', textAlign: 'center', marginBottom: '1rem', lineHeight: '1.3' }}>
                          {bin.rule}
                        </span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', marginTop: 'auto' }}>
                          {itemsInBin.map(i => (
                            <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', background: '#ffffff', color: bin.color, border: `1px solid ${bin.color}33`, padding: '0.35rem 0.5rem', borderRadius: '8px', fontWeight: '700', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              <span>{SORT_ITEMS.find(p => p.id === i.id)?.name.split(' ')[0]}</span>
                              <span>{i.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status message */}
              {statusMsg && (
                <div style={{
                  fontSize: '13.5px',
                  color: statusMsg.startsWith('✅') ? '#10b981' : '#ef4444',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '0.75rem',
                  background: statusMsg.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
                  borderRadius: '10px',
                  border: `1px solid ${statusMsg.startsWith('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                }}>
                  {statusMsg}
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
