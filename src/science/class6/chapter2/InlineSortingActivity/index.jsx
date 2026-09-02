import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, ChevronRight, Award, Sparkles, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext.jsx';

import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

import roseImg from '../../../../assets/specimens/rose.png';
import mangoTreeImg from '../../../../assets/mango_tree.png';
import lotusImg from '../../../../assets/specimens/lotus.png';
import grassImg from '../../../../assets/specimens/grass.png';
import fishImg from '../../../../assets/specimens/fish.png';
import cowImg from '../../../../assets/brown_cow.png';

const SORT_ITEMS = [
  {
    id: 'mango',
    name: 'Mango Tree',
    kind: 'Plant 🌳',
    desc: 'Tall plant with hard woody trunk, bears flowers & mangos on land.',
    image: mangoTreeImg,
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
        bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '#0284c7',
        color: '#0369a1',
        labelBg: 'rgba(2, 132, 199, 0.12)',
        ruleColor: '#075985'
      };
    default:
      return {
        bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        border: '#10b981',
        color: '#047857',
        labelBg: 'rgba(16, 185, 129, 0.12)',
        ruleColor: '#065f46'
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
        <div className="frame-page-left act23-mint-left" style={{ 
          padding: '2.5rem 2rem',
          background: 'linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(167, 243, 208, 0.85)',
          borderRadius: '20px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'flex-start'
        }}>
          <div>
            <div className="textbook-eyebrow" style={{ 
              fontSize: '15.5px', 
              color: '#065f46', 
              fontWeight: '800', 
              letterSpacing: '0.06em',
              display: 'inline-block',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              border: '1.5px solid #10b981',
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
              marginBottom: '0.5rem'
            }}>
              Activity 2.3 · Classification Lab
            </div>
            <h1 className="textbook-title" style={{ fontFamily: 'var(--serif-font)', fontSize: '2.3rem', marginBottom: '1.25rem', color: '#064e3b', fontWeight: '800' }}>
              Let Us Group
            </h1>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', fontSize: '18px', color: '#064e3b', lineHeight: '1.6', fontWeight: '700' }}>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
              Living things — both <strong style={{ color: '#047857' }}>plants and animals</strong> — can be grouped using different observable features. Select a criterion on the right and sort the specimens into their corresponding trays.
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '1.15rem', borderRadius: '12px', border: '1.5px solid rgba(167, 243, 208, 0.85)', boxShadow: '0 2px 8px rgba(6, 78, 59, 0.05)' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#047857', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Selectable Grouping Criteria:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '15px', color: '#064e3b', fontWeight: '700' }}>
                <li>🌸 <strong style={{ color: '#047857' }}>Presence / absence of flowers:</strong> Flowering vs Non-flowering</li>
                <li>🪵 <strong style={{ color: '#047857' }}>Hard / soft stem:</strong> Hard woody stem vs Soft / flexible stem</li>
                <li>🍃 <strong style={{ color: '#047857' }}>Eating habits:</strong> Make own food vs Eat other organisms</li>
                <li>🏞️ <strong style={{ color: '#047857' }}>Place they live:</strong> Live on land vs Live in water</li>
              </ul>
            </div>

            <div className="textbook-explore" style={{ fontSize: '15px', fontWeight: '700', padding: '1rem 1.15rem', background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', borderLeft: '4px solid #eab308', border: '1.5px solid #fde047', borderLeftWidth: '4px', color: '#713f12', borderRadius: '10px', boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)', lineHeight: '1.5' }}>
              👉 <b style={{ color: '#854d0e' }}>Instruction:</b> Select a feature tab, then drag each living thing (or click a card then click a tray) to group it!
            </div>
          </div>

          {/* Concluding Message Box */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1.5px solid rgba(167, 243, 208, 0.7)' }}>
            <div style={{
              background: completedCriteria.length > 0 ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : 'rgba(255, 255, 255, 0.95)',
              border: `1.5px solid ${completedCriteria.length > 0 ? '#10b981' : 'rgba(167, 243, 208, 0.85)'}`,
              borderLeft: `4px solid ${completedCriteria.length > 0 ? '#10b981' : '#047857'}`,
              borderRadius: '14px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              boxShadow: '0 2px 8px rgba(6, 78, 59, 0.05)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: completedCriteria.length > 0 ? '#047857' : '#065f46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                💡 Key takeaway
              </span>
              <p style={{ fontSize: '15px', color: '#064e3b', margin: 0, lineHeight: '1.55', fontWeight: '700' }}>
                “Different features can be used to group living things. The same living thing can belong to different groups when we use different features.”
              </p>
              
              {completedCriteria.length > 0 && (
                <div style={{ fontSize: '13px', color: '#047857', marginTop: '0.25rem', fontWeight: '800' }}>
                  ✓ Completed {completedCriteria.length} of 4 criteria!
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ============ RIGHT COLUMN: SORTING WORKSPACE ============ */}
        <div className="frame-page-right act23-mint-right" style={{ 
          padding: '1.75rem',
          background: 'linear-gradient(145deg, rgba(246, 252, 248, 0.97) 0%, rgba(236, 247, 241, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(167, 243, 208, 0.85)',
          borderRadius: '20px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Header & Criterion Selector Tabs */}
          <div>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#047857', letterSpacing: '0.04em', display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
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
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: isActive ? '2px solid #0284c7' : isDone ? '1.5px solid #10b981' : '1.5px solid rgba(167, 243, 208, 0.9)',
                      background: isActive ? 'linear-gradient(135deg, #0284c7, #2563eb)' : isDone ? 'rgba(16, 185, 129, 0.12)' : '#ffffff',
                      color: isActive ? '#ffffff' : isDone ? '#065f46' : '#064e3b',
                      fontWeight: '800',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '6px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.35)' : '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{crit.icon}</span>
                      <span>{crit.shortLabel}</span>
                    </span>
                    {isDone && <CheckCircle size={15} color={isActive ? '#ffffff' : '#059669'} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Living Things Specimens Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. Living Things Cards (Plants &amp; Animals)
              </span>
              <span style={{ fontSize: '13px', color: '#047857', fontWeight: '700' }}>
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
                      background: isSelected ? 'rgba(16, 185, 129, 0.2)' : '#ffffff',
                      border: isSelected ? '2px solid #10b981' : isSorted ? '1.5px solid rgba(167, 243, 208, 0.5)' : '1.5px solid rgba(167, 243, 208, 0.85)',
                      borderRadius: '12px',
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: isSorted ? 'default' : 'grab',
                      opacity: isSorted ? 0.35 : 1,
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 8px 24px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(6, 78, 59, 0.06)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1.33', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      background: 'rgba(234, 246, 238, 0.6)',
                      border: '1px solid rgba(167, 243, 208, 0.6)',
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
                    <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#064e3b', textDecoration: isSorted ? 'line-through' : 'none' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#047857', fontWeight: '700' }}>
                      {item.kind}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Specimen Description Tip */}
          {selectedItem && (
            <div style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', borderLeft: '4px solid #eab308', border: '1.5px solid #fde047', borderLeftWidth: '4px', padding: '0.85rem 1.1rem', borderRadius: '10px', fontSize: '14px', fontWeight: '700', color: '#713f12', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)' }}>
              <span>ℹ️</span>
              <span><strong style={{ color: '#854d0e' }}>{selectedItem.name}:</strong> {selectedItem.desc}</span>
            </div>
          )}

          {/* Classification Trays for Current Criterion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
                      boxShadow: '0 4px 14px rgba(6, 78, 59, 0.08)',
                      position: 'relative'
                    }}
                  >
                    {/* Tray Label Header */}
                    <div style={{
                      background: styleProps.labelBg,
                      border: `1px solid ${styleProps.border}`,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '800',
                      color: styleProps.color,
                      letterSpacing: '0.04em',
                      marginBottom: '0.4rem',
                      textAlign: 'center'
                    }}>
                      {bin.label}
                    </div>

                    <span style={{ fontSize: '12px', color: styleProps.ruleColor, textAlign: 'center', marginBottom: '0.75rem', fontWeight: '700' }}>
                      {bin.rule}
                    </span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', marginTop: 'auto' }}>
                      {itemsInBin.map(i => (
                        <div key={i.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12.5px', background: '#ffffff', color: '#064e3b', border: `1.5px solid ${styleProps.border}`, padding: '0.4rem 0.6rem', borderRadius: '8px', fontWeight: '800', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                          <img src={i.image} alt={i.name} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                          <span>{i.name}</span>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>({i.kind})</span>
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
              fontSize: '14px',
              color: statusMsg.startsWith('✅') ? '#065f46' : '#991b1b',
              textAlign: 'center',
              fontWeight: '800',
              padding: '0.75rem 1rem',
              background: statusMsg.startsWith('✅') ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderRadius: '10px',
              border: `1.5px solid ${statusMsg.startsWith('✅') ? '#10b981' : '#ef4444'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {statusMsg}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
