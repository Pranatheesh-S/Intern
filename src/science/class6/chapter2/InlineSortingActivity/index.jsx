import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, ChevronRight, Award, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext.jsx';

import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

import roseImg from '../../../../assets/specimens/rose.png';
import mangoImg from '../../../../assets/specimens/mango.png';
import lotusImg from '../../../../assets/specimens/lotus.png';
import grassImg from '../../../../assets/specimens/grass.png';
import fishImg from '../../../../assets/specimens/fish.png';
import cowImg from '../../../../assets/specimens/cow.png';

const SORT_ITEMS = [
  {
    id: 'mango',
    name: 'Mango Tree',
    kind: 'Plant 🌳',
    desc: 'Tall plant with hard woody trunk, bears flowers & mangos on land.',
    image: mangoImg,
    answers: {
      flowers: 'with_flowers',
      stem: 'hard_stem',
      eating: 'make_food',
      habitat: 'land'
    }
  },
  {
    id: 'rose',
    name: 'Rose Plant',
    kind: 'Plant 🌺',
    desc: 'Medium-height woody shrub with red flowers growing on land.',
    image: roseImg,
    answers: {
      flowers: 'with_flowers',
      stem: 'hard_stem',
      eating: 'make_food',
      habitat: 'land'
    }
  },
  {
    id: 'lotus',
    name: 'Lotus Plant',
    kind: 'Plant 🪷',
    desc: 'Aquatic plant with soft stem and pink flowers floating in water.',
    image: lotusImg,
    answers: {
      flowers: 'with_flowers',
      stem: 'soft_stem',
      eating: 'make_food',
      habitat: 'water'
    }
  },
  {
    id: 'fern',
    name: 'Fern Plant',
    kind: 'Plant 🌿',
    desc: 'Non-flowering land plant with soft green leaves and soft stems.',
    image: grassImg,
    answers: {
      flowers: 'no_flowers',
      stem: 'soft_stem',
      eating: 'make_food',
      habitat: 'land'
    }
  },
  {
    id: 'fish',
    name: 'Fish',
    kind: 'Animal 🐟',
    desc: 'Aquatic animal living in water, eats smaller organisms.',
    image: fishImg,
    answers: {
      flowers: 'no_flowers',
      stem: 'soft_stem',
      eating: 'eat_others',
      habitat: 'water'
    }
  },
  {
    id: 'cow',
    name: 'Cow',
    kind: 'Animal 🐄',
    desc: 'Land animal living on farms/fields, eats plants & grass.',
    image: cowImg,
    answers: {
      flowers: 'no_flowers',
      stem: 'soft_stem',
      eating: 'eat_others',
      habitat: 'land'
    }
  }
];

const CRITERIA = [
  {
    id: 'flowers',
    label: 'Presence / absence of flowers',
    shortLabel: 'Presence / absence of flowers',
    icon: '🌸',
    bins: [
      { key: 'with_flowers', label: '🌸 With Flowers', rule: 'Living things that produce flowers' },
      { key: 'no_flowers', label: '🌿 Without Flowers', rule: 'Non-flowering plants & animals' }
    ]
  },
  {
    id: 'stem',
    label: 'Hard / soft stem',
    shortLabel: 'Hard / soft stem',
    icon: '🪵',
    bins: [
      { key: 'hard_stem', label: '🪵 Hard / Woody Stem', rule: 'Trees & shrubs with hard woody stems' },
      { key: 'soft_stem', label: '🟢 Soft / No Woody Stem', rule: 'Herbs, soft plants & animals' }
    ]
  },
  {
    id: 'eating',
    label: 'Eating habits',
    shortLabel: 'Eating habits',
    icon: '🍃',
    bins: [
      { key: 'make_food', label: '☀️ Make Own Food', rule: 'Plants that produce food via photosynthesis' },
      { key: 'eat_others', label: '🥩 Eat Other Organisms', rule: 'Animals that consume plants or animals' }
    ]
  },
  {
    id: 'habitat',
    label: 'Place they live',
    shortLabel: 'Place they live',
    icon: '🏞️',
    bins: [
      { key: 'land', label: '🏞️ Live on Land', rule: 'Terrestrial plants and animals' },
      { key: 'water', label: '🌊 Live in Water', rule: 'Aquatic plants and animals' }
    ]
  }
];

const getBinStyle = (binKey) => {
  switch (binKey) {
    case 'with_flowers':
    case 'hard_stem':
    case 'make_food':
    case 'land':
      return {
        bg: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '#38bdf8',
        color: '#38bdf8',
        labelBg: 'rgba(56, 189, 248, 0.15)'
      };
    default:
      return {
        bg: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '#34d399',
        color: '#34d399',
        labelBg: 'rgba(52, 211, 153, 0.15)'
      };
  }
};

export default function InlineSortingActivity({ onBackToDashboard }) {
  const { theme } = useTheme();

  const [selectedCriterionId, setSelectedCriterionId] = useState('flowers');
  const [selectedItem, setSelectedItem] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  // Map of progress per criterion: { [critId]: { [itemId]: binKey } }
  const [progress, setProgress] = useState({
    flowers: {},
    stem: {},
    eating: {},
    habitat: {}
  });

  const [completedCriteria, setCompletedCriteria] = useState([]);
  const [statusMsg, setStatusMsg] = useState('');

  const currentCriterion = CRITERIA.find(c => c.id === selectedCriterionId) || CRITERIA[0];
  const currentCriterionProgress = progress[selectedCriterionId] || {};

  const isCurrentCriterionComplete = SORT_ITEMS.every(
    item => !!currentCriterionProgress[item.id]
  );

  useEffect(() => {
    if (isCurrentCriterionComplete && !completedCriteria.includes(selectedCriterionId)) {
      setCompletedCriteria(prev => [...prev, selectedCriterionId]);
      confetti({ particleCount: 80, spread: 65, origin: { y: 0.6 } });
    }
  }, [isCurrentCriterionComplete, selectedCriterionId, completedCriteria]);

  const handleSelectCriterion = (critId) => {
    setSelectedCriterionId(critId);
    setSelectedItem(null);
    setStatusMsg('');
  };

  const handleItemClick = (item) => {
    if (currentCriterionProgress[item.id]) return;
    setSelectedItem(item);
    setStatusMsg('');
  };

  const handleClassify = (item, targetBinKey) => {
    const correctBinKey = item.answers[selectedCriterionId];
    const targetBinObj = currentCriterion.bins.find(b => b.key === targetBinKey);

    if (targetBinKey === correctBinKey) {
      setProgress(prev => ({
        ...prev,
        [selectedCriterionId]: {
          ...prev[selectedCriterionId],
          [item.id]: targetBinKey
        }
      }));
      setStatusMsg(`✅ Correct! ${item.name} belongs in "${targetBinObj?.label}".`);
      setSelectedItem(null);
    } else {
      setStatusMsg(`❌ Try again! ${item.name} does not belong in "${targetBinObj?.label}".`);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDrop = (e, targetBinKey) => {
    e.preventDefault();
    if (draggedItem) {
      handleClassify(draggedItem, targetBinKey);
      setDraggedItem(null);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setDraggedItem(null);
    setProgress({
      flowers: {},
      stem: {},
      eating: {},
      habitat: {}
    });
    setCompletedCriteria([]);
    setStatusMsg('');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 3rem)',
      backgroundImage: `url(${darkForestBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: 'var(--geo-font)',
      color: 'var(--ink)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      {/* Textbook Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1.5px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={() => onBackToDashboard(false)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '7px', 
              fontSize: '12.5px', 
              padding: '0.45rem 1.1rem',
              borderRadius: '20px',
              border: '1.5px solid #60a5fa',
              background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
              cursor: 'pointer',
              color: '#ffffff',
              fontWeight: '700',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={14} color="#ffffff" /> Exit Activity
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={handleReset} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '12px', 
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              background: 'rgba(30, 41, 59, 0.9)',
              cursor: 'pointer',
              color: '#f1f5f9',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            <RefreshCw size={13} color="#38bdf8" /> Reset Activity
          </button>
        </div>
      </div>

      <div className="split-frame" style={{ padding: '1rem', gap: '1.25rem', flex: 1 }}>
        
        {/* ============ LEFT COLUMN: LESSON & GUIDELINES ============ */}
        <div className="frame-page-left" style={{ 
          padding: '2.5rem 2rem',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="textbook-eyebrow" style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '800', letterSpacing: '0.06em' }}>
            Activity 2.3 · Classification Lab
          </div>
          <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', fontSize: '2.2rem', marginBottom: '1.25rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.6)', fontWeight: '800' }}>
            Let Us Group
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '15.5px', color: '#ffffff', lineHeight: '1.65' }}>
            <p style={{ margin: 0 }}>
              Living things — both <strong>plants and animals</strong> — can be grouped using different observable features. Select a criterion on the right and sort the specimens into their corresponding trays.
            </p>

            <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Selectable Grouping Criteria:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '14px', color: '#cbd5e1' }}>
                <li>🌸 <strong>Presence / absence of flowers:</strong> Flowering vs Non-flowering</li>
                <li>🪵 <strong>Hard / soft stem:</strong> Hard woody stem vs Soft / flexible stem</li>
                <li>🍃 <strong>Eating habits:</strong> Make own food vs Eat other organisms</li>
                <li>🏞️ <strong>Place they live:</strong> Live on land vs Live in water</li>
              </ul>
            </div>

            <div className="textbook-explore" style={{ fontSize: '14px', padding: '0.9rem 1rem', background: 'rgba(30, 41, 59, 0.95)', borderLeft: '4px solid #38bdf8', border: '1.5px solid rgba(255, 255, 255, 0.2)', borderLeftWidth: '4px', color: '#ffffff', borderRadius: '8px' }}>
              👉 <b>Instruction:</b> Select a feature tab, then drag each living thing (or click a card then click a tray) to group it!
            </div>
          </div>

          {/* Concluding Message Box */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div style={{
              background: completedCriteria.length > 0 ? 'rgba(6, 78, 59, 0.88)' : 'rgba(30, 41, 59, 0.95)',
              border: `1.5px solid ${completedCriteria.length > 0 ? '#10b981' : 'rgba(56, 189, 248, 0.4)'}`,
              borderRadius: '14px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <span style={{ fontSize: '13.5px', fontWeight: 'bold', color: completedCriteria.length > 0 ? '#34d399' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💡 Key takeaway
              </span>
              <p style={{ fontSize: '14px', color: '#f8fafc', margin: 0, lineHeight: '1.5', fontWeight: '600' }}>
                “Different features can be used to group living things. The same living thing can belong to different groups when we use different features.”
              </p>
              
              {completedCriteria.length > 0 && (
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '0.25rem', fontWeight: 'bold' }}>
                  ✓ Completed {completedCriteria.length} of 4 criteria!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ============ RIGHT COLUMN: SORTING WORKSPACE ============ */}
        <div className="frame-page-right" style={{ 
          padding: '1.75rem',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Header & Criterion Selector Tabs */}
          <div>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.04em', display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
              1. Choose Grouping Criterion:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
              {CRITERIA.map(crit => {
                const isActive = selectedCriterionId === crit.id;
                const isDone = completedCriteria.includes(crit.id);
                return (
                  <button
                    key={crit.id}
                    onClick={() => handleSelectCriterion(crit.id)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: isActive ? '2px solid #38bdf8' : isDone ? '1.5px solid #10b981' : '1.5px solid rgba(255, 255, 255, 0.2)',
                      background: isActive ? 'rgba(56, 189, 248, 0.25)' : isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                      color: isActive ? '#ffffff' : isDone ? '#a7f3d0' : '#cbd5e1',
                      fontWeight: isActive ? '800' : '600',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 12px rgba(56, 189, 248, 0.25)' : 'none'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{crit.icon}</span>
                      <span>{crit.shortLabel}</span>
                    </span>
                    {isDone && <CheckCircle size={14} color="#34d399" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Living Things Specimens Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. Living Things Cards (Plants & Animals)
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                {SORT_ITEMS.filter(i => !!currentCriterionProgress[i.id]).length} / {SORT_ITEMS.length} Sorted
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {SORT_ITEMS.map(item => {
                const isSorted = !!currentCriterionProgress[item.id];
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    draggable={!isSorted}
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => handleItemClick(item)}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.3)' : 'rgba(30, 41, 59, 0.95)',
                      border: isSelected ? '2px solid #38bdf8' : isSorted ? '1.5px solid rgba(255, 255, 255, 0.1)' : '1.5px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: isSorted ? 'default' : 'grab',
                      opacity: isSorted ? 0.35 : 1,
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 8px 24px rgba(56, 189, 248, 0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1.33', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        draggable={false}
                      />
                    </div>
                    <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#ffffff', textDecoration: isSorted ? 'line-through' : 'none' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#cbd5e1', fontWeight: '600' }}>
                      {item.kind}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Specimen Description Tip */}
          {selectedItem && (
            <div style={{ background: 'rgba(30, 41, 59, 0.9)', borderLeft: '4px solid #38bdf8', border: '1px solid rgba(255, 255, 255, 0.15)', borderLeftWidth: '4px', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '13px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>ℹ️</span>
              <span><strong style={{ color: '#38bdf8' }}>{selectedItem.name}:</strong> {selectedItem.desc}</span>
            </div>
          )}

          {/* Classification Trays for Current Criterion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              3. Grouping Trays for "{currentCriterion.label}"
            </span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
              {currentCriterion.bins.map(bin => {
                const itemsInBin = SORT_ITEMS.filter(
                  item => currentCriterionProgress[item.id] === bin.key
                );
                const canDrop = !!selectedItem;
                const styleProps = getBinStyle(bin.key);

                return (
                  <div
                    key={bin.key}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, bin.key)}
                    onClick={() => selectedItem && handleClassify(selectedItem, bin.key)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem 0.75rem',
                      minHeight: '160px',
                      background: styleProps.bg,
                      border: `2px solid ${styleProps.border}`,
                      borderRadius: '14px',
                      cursor: canDrop ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      position: 'relative'
                    }}
                  >
                    {/* Tray Label Header */}
                    <div style={{
                      background: styleProps.labelBg,
                      border: `1px solid ${styleProps.border}`,
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      color: styleProps.color,
                      letterSpacing: '0.04em',
                      marginBottom: '0.4rem',
                      textAlign: 'center'
                    }}>
                      {bin.label}
                    </div>

                    <span style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'center', marginBottom: '0.75rem', fontWeight: '500' }}>
                      {bin.rule}
                    </span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', marginTop: 'auto' }}>
                      {itemsInBin.map(i => (
                        <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', background: 'rgba(15, 23, 42, 0.92)', color: '#ffffff', border: `1.5px solid ${styleProps.border}`, padding: '0.35rem 0.5rem', borderRadius: '8px', fontWeight: '700' }}>
                          <img src={i.image} alt={i.name} style={{ width: '18px', height: '18px', borderRadius: '4px', objectFit: 'cover' }} />
                          <span>{i.name}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>({i.kind})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Message / Visual Feedback */}
          {statusMsg && (
            <div style={{
              fontSize: '13.5px',
              color: statusMsg.startsWith('✅') ? '#a7f3d0' : '#fca5a5',
              textAlign: 'center',
              fontWeight: 'bold',
              padding: '0.65rem 0.85rem',
              background: statusMsg.startsWith('✅') ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
              borderRadius: '10px',
              border: `1.5px solid ${statusMsg.startsWith('✅') ? '#34d399' : '#ef4444'}`
            }}>
              {statusMsg}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
