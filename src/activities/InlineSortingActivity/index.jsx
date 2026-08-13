import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, ChevronRight, Award, HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../ThemeContext.jsx';

const SORT_ITEMS = [
  { id: 'rose', name: '🌹 Rose Plant', type: 'shrub', desc: 'Medium height, woody stem branching near base.' },
  { id: 'grass', name: '🌱 Grass', type: 'herb', desc: 'Short, soft green stem with no woodiness.' },
  { id: 'banyan', name: '🌳 Banyan Tree', type: 'tree', desc: 'Very tall, thick hard brown trunk.' },
  { id: 'tomato', name: '🍅 Tomato Plant', type: 'herb', desc: 'Short, green tender stem.' },
  { id: 'hibiscus', name: '🌺 Hibiscus', type: 'shrub', desc: 'Medium height, woody branches branching near ground.' },
  { id: 'mango', name: '🥭 Mango Tree', type: 'tree', desc: 'Tall, thick woody trunk branching high up.' }
];

export default function InlineSortingActivity({ onBackToDashboard }) {
  const { theme } = useTheme();
  
  // Game states
  const [selectedItem, setSelectedItem] = useState(null);
  const [correctCounts, setCorrectCounts] = useState({}); // itemId -> category
  const [statusMsg, setStatusMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // If all items are sorted correctly
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
    if (selectedItem.type === category) {
      setCorrectCounts(prev => ({ ...prev, [selectedItem.id]: category }));
      setStatusMsg(`✅ Correct! ${selectedItem.name} is a ${category}.`);
      setSelectedItem(null);
    } else {
      setStatusMsg(`❌ Not quite! ${selectedItem.name} is not a ${category}. Try again!`);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setCorrectCounts({});
    setStatusMsg('');
    setShowSuccess(false);
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
        <div className="frame-page-left">
          <div className="textbook-eyebrow">Activity 2.3 · Classification Lab</div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)' }}>
            Let Us Group Plants
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '13.5px', color: 'var(--mut)', lineHeight: '1.5' }}>
            <p>
              In this activity, we put our classification skills to the test. Botanists sort plants into three primary categories based on growth habits:
            </p>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>🌱 <b>Herbs:</b> Short plants with soft, green, and tender stems.</li>
              <li>🌺 <b>Shrubs:</b> Medium plants with thin, woody stems branching near the base.</li>
              <li>🌳 <b>Trees:</b> Tall plants with a thick, hard main trunk.</li>
            </ul>
          </div>

          <div className="textbook-explore" style={{ marginTop: '1.25rem' }}>
            ✏️ <b>Your Goal:</b> Classify all 6 plants in the tray by matching them to their corresponding categories.
          </div>

          {showSuccess && (
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ background: '#ecfdf5', border: '1.5px solid #10b981', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🎉 Classification Complete!
                </span>
                <span style={{ fontSize: '12px', color: 'var(--mut)' }}>
                  Excellent job! You correctly grouped all 6 specimen.
                </span>
                <button onClick={onBackToDashboard} className="primary" style={{ background: '#16a34a', width: '100%', fontSize: '12.5px', padding: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '0.5rem' }}>
                  Complete Activity <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============ RIGHT COLUMN: SORTING WORKSPACE ============ */}
        <div className="frame-page-right">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--cardline)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--mut)' }}>
              🗂️ Sorting Tray &amp; Bins
            </span>
            <button onClick={handleReset} className="outline" style={{ fontSize: '11.5px', padding: '0.25rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <RefreshCw size={11} /> Reset
            </button>
          </div>

          {showSuccess ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', textAlign: 'center' }}>
              <div style={{ padding: '1.25rem', background: '#ecfdf5', borderRadius: '50%', border: '2.5px solid #10b981' }}>
                <Award size={48} color="#16a34a" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--serif-font)', color: 'var(--navy)', margin: '0 0 0.5rem 0' }}>Perfect Score!</h3>
                <p style={{ fontSize: '13px', color: 'var(--mut)', maxWidth: '300px', margin: 0 }}>
                  You have successfully demonstrated the core plant grouping criteria.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Items tray */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--navy)', display: 'block', marginBottom: '0.5rem' }}>
                  1. Select a plant specimen:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {SORT_ITEMS.map(item => {
                    const isSorted = !!correctCounts[item.id];
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={isSorted}
                        onClick={() => handleItemClick(item)}
                        style={{
                          fontSize: '12.5px',
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--cardline)',
                          background: isSelected ? '#f4f8ff' : '#ffffff',
                          color: isSorted ? 'rgba(0,0,0,0.3)' : 'var(--ink)',
                          textDecoration: isSorted ? 'line-through' : 'none',
                          opacity: isSorted ? 0.4 : 1,
                          cursor: isSorted ? 'default' : 'pointer',
                          boxShadow: isSelected ? '0 4px 12px rgba(99,102,241,0.1)' : 'none',
                          fontWeight: isSelected ? '600' : '400'
                        }}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active description */}
              {selectedItem && (
                <div style={{ background: '#f4f8ff', borderLeft: '4px solid var(--accent)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '13px', color: 'var(--ink)' }}>
                  <strong>Specimen Details:</strong> {selectedItem.desc}
                </div>
              )}

              {/* Bins grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--navy)' }}>
                  2. Choose the correct category bin:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {['herb', 'shrub', 'tree'].map(category => {
                    const itemsInBin = SORT_ITEMS.filter(item => correctCounts[item.id] === category);
                    return (
                      <button
                        key={category}
                        disabled={!selectedItem}
                        onClick={() => handleBinClick(category)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '1rem 0.5rem',
                          minHeight: '120px',
                          background: selectedItem ? '#fff' : '#f8fafc',
                          border: selectedItem ? '2px dashed var(--accent)' : '1px solid var(--cardline)',
                          borderRadius: '10px',
                          cursor: selectedItem ? 'pointer' : 'default',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--navy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {category}s
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
                          {itemsInBin.map(i => (
                            <span key={i.id} style={{ fontSize: '10px', background: '#ecfdf5', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '0.15rem 0.35rem', borderRadius: '4px', textAlign: 'center', fontWeight: '600' }}>
                              {i.name.split(' ')[1] || i.name}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status message */}
              {statusMsg && (
                <div style={{
                  fontSize: '13px',
                  color: statusMsg.startsWith('✅') ? '#10b981' : '#ef4444',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: '0.5rem',
                  background: statusMsg.startsWith('✅') ? '#ecfdf5' : '#fef2f2',
                  borderRadius: '6px',
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
