import React, { useState } from 'react';
import { Search, Compass, ShieldCheck, HelpCircle, ArrowLeft, RefreshCw, Award, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const MYSTERY_PLANTS = [
  {
    id: 'plantA',
    displayName: 'Mystery Plant Alpha',
    realName: 'Holy Basil (Tulsi)',
    category: 'Herb',
    stemInfo: 'Green, tender, and extremely soft. Bends easily. No bark or wood present.',
    leafInfo: 'Simple leaves arranged in opposite pairs. Margins are slightly serrated with reticulate venation.',
    magnifierZoom: 'Opposite pairing leaves, fine soft hairs (trichomes) on stem.',
    leafDetails: 'Simple Leaf. Oval shape with fine teeth. Soft texture.',
    stemDetails: 'Herbaceous Stem. Rich green, non-woody, square cross-section.',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, brown, woody branching at base', 'Thick, hard, trunk branching high up'],
      leaf: ['Simple (Opposite pairs)', 'Simple (Alternate nodes with thorns)', 'Compound (Pinnate leaflets)'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: {
      stem: 0,
      leaf: 0,
      class: 0
    }
  },
  {
    id: 'plantB',
    displayName: 'Mystery Plant Beta',
    realName: 'Wild Rose Shrub',
    category: 'Shrub',
    stemInfo: 'Thin, woody, and brown stem with sharp prickles. Branches emerge directly near the soil level.',
    leafInfo: 'Alternate leaves with compound structures (pinnate). Leaf margins are sharply toothed.',
    magnifierZoom: 'Sharp thorns, hard brown epidermis, alternate branching nodes.',
    leafDetails: 'Pinnately Compound Leaf. 5-7 oval leaflets with serrated margins.',
    stemDetails: 'Shrubby Woody Stem. Branching close to the ground, thin and sturdy with prickles.',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, brown, woody branching at base', 'Thick, hard, trunk branching high up'],
      leaf: ['Simple (Opposite pairs)', 'Simple (Alternate nodes with thorns)', 'Compound (Pinnate leaflets)'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: {
      stem: 1,
      leaf: 1,
      class: 1
    }
  },
  {
    id: 'plantC',
    displayName: 'Mystery Plant Gamma',
    realName: 'Neem Tree Sapling',
    category: 'Tree',
    stemInfo: 'Thick, dark brown woody trunk. Solid and impossible to bend. Bark is rough and fibrous.',
    leafInfo: 'Large pinnately compound leaves. Leaflets are lance-shaped, serrate, and highly bitter.',
    magnifierZoom: 'Rough, scaly brown bark, thick wood rings forming under trunk.',
    leafDetails: 'Large Pinnately Compound Leaf. Multiple serrated green leaflets along a central spine.',
    stemDetails: 'Arboreal Trunk. Hard, thick, covered in rough grey bark, single main axis.',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, brown, woody branching at base', 'Thick, hard, trunk branching high up'],
      leaf: ['Simple (Opposite pairs)', 'Simple (Alternate nodes with thorns)', 'Compound (Pinnate leaflets)'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: {
      stem: 2,
      leaf: 2,
      class: 2
    }
  }
];

export default function PlantDetective({ onBackToDashboard }) {
  const [selectedPlantId, setSelectedPlantId] = useState('plantA');
  const [activeTool, setActiveTool] = useState('none'); // 'none', 'magnifier', 'leaf_comparator', 'stem_tester'
  const [answers, setAnswers] = useState({
    plantA: { stem: null, leaf: null, class: null },
    plantB: { stem: null, leaf: null, class: null },
    plantC: { stem: null, leaf: null, class: null }
  });
  const [results, setResults] = useState({
    plantA: null, // true/false
    plantB: null,
    plantC: null
  });
  const [showDetectiveBadge, setShowDetectiveBadge] = useState(false);

  const activePlant = MYSTERY_PLANTS.find(p => p.id === selectedPlantId);

  const handleSelectOption = (field, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [selectedPlantId]: {
        ...prev[selectedPlantId],
        [field]: optionIndex
      }
    }));
    // Clear previous check result
    setResults(prev => ({
      ...prev,
      [selectedPlantId]: null
    }));
  };

  const handleVerifyPlant = () => {
    const userAnswers = answers[selectedPlantId];
    const correctAnswers = activePlant.answers;

    if (userAnswers.stem === null || userAnswers.leaf === null || userAnswers.class === null) {
      alert('Please fill out all clues in the file sheet before verifying!');
      return;
    }

    const isCorrect = 
      userAnswers.stem === correctAnswers.stem &&
      userAnswers.leaf === correctAnswers.leaf &&
      userAnswers.class === correctAnswers.class;

    setResults(prev => {
      const updated = { ...prev, [selectedPlantId]: isCorrect };
      
      // If all three are correct, trigger final win!
      if (updated.plantA && updated.plantB && updated.plantC) {
        setShowDetectiveBadge(true);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      return updated;
    });
  };

  const handleReset = () => {
    setAnswers({
      plantA: { stem: null, leaf: null, class: null },
      plantB: { stem: null, leaf: null, class: null },
      plantC: { stem: null, leaf: null, class: null }
    });
    setResults({
      plantA: null,
      plantB: null,
      plantC: null
    });
    setShowDetectiveBadge(false);
    setActiveTool('none');
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      height: '100%',
      minHeight: '540px',
      background: '#0a2e1d',
      color: '#f0fdf4',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sidebar Clues Deck */}
      <aside style={{
        background: '#022c22',
        borderRight: '1px solid rgba(16, 185, 129, 0.1)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflowY: 'auto'
      }}>
        <div>
          {/* Header Back Button */}
          <button
            onClick={onBackToDashboard}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: 0,
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Chapters
          </button>

          {/* Mission Description */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            borderLeft: '3px solid #10b981',
            padding: '0.75rem',
            borderRadius: '0 8px 8px 0',
            marginBottom: '1.25rem'
          }}>
            <strong style={{ color: '#34d399', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Case Assignment:
            </strong>
            <span style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              Select a plant, use diagnostic tools to inspect its stem and leaves, fill out the clues form, and verify each identity.
            </span>
          </div>

          {/* Plant Selector Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', textTransform: 'uppercase', color: '#a7f3d0' }}>Case Catalog</h4>
            {MYSTERY_PLANTS.map(plant => {
              const isVerified = results[plant.id] === true;
              const isFailed = results[plant.id] === false;
              const isSelected = selectedPlantId === plant.id;

              return (
                <button
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlantId(plant.id);
                    setActiveTool('none');
                  }}
                  style={{
                    background: isSelected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.03)',
                    border: isSelected 
                      ? '1px solid #10b981' 
                      : '1px solid rgba(255,255,255,0.05)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{plant.displayName}</span>
                  {isVerified ? (
                    <span style={{ color: '#34d399', fontSize: '0.7rem', fontWeight: 'bold' }}>✓ IDENTIFIED</span>
                  ) : isFailed ? (
                    <span style={{ color: '#f87171', fontSize: '0.7rem', fontWeight: 'bold' }}>✗ RETRY CLUES</span>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '0.7rem' }}>UNRESOLVED</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Case */}
        <button
          onClick={handleReset}
          style={{
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#9ca3af',
            padding: '0.5rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            width: '100%'
          }}
        >
          <RefreshCw size={12} /> Clear Case Files
        </button>
      </aside>

      {/* Main Forensic Workbench */}
      <main style={{
        display: 'grid',
        gridTemplateRows: '1fr 220px',
        padding: '1.25rem',
        gap: '1.25rem',
        overflow: 'hidden'
      }}>
        {/* Top: Examination Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 260px',
          gap: '1rem',
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Diagnostic Display Canvas */}
          <div style={{
            background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Display Plant Graphics */}
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease-out' }}>
              {selectedPlantId === 'plantA' && (
                <svg width="220" height="220" viewBox="0 0 100 100">
                  {/* Pot */}
                  <rect x="42" y="78" width="16" height="15" fill="#d97706" rx="2" />
                  <line x1="40" y1="78" x2="60" y2="78" stroke="#b45309" strokeWidth="2" />
                  {/* Stem (Herb) */}
                  <path d="M 50 78 Q 48 55 52 30" fill="none" stroke="#34d399" strokeWidth="2" />
                  <path d="M 50 62 Q 60 55 65 52" fill="none" stroke="#34d399" strokeWidth="1.5" />
                  <path d="M 50 48 Q 38 42 32 38" fill="none" stroke="#34d399" strokeWidth="1.5" />
                  {/* Leaves */}
                  <ellipse cx="52" cy="30" rx="4" ry="7" fill="#10b981" />
                  <ellipse cx="65" cy="52" rx="6" ry="4" fill="#059669" transform="rotate(-15 65 52)" />
                  <ellipse cx="32" cy="38" rx="6" ry="4" fill="#059669" transform="rotate(25 32 38)" />
                  <ellipse cx="50" cy="55" rx="5" ry="3" fill="#10b981" transform="rotate(30 50 55)" />
                </svg>
              )}

              {selectedPlantId === 'plantB' && (
                <svg width="220" height="220" viewBox="0 0 100 100">
                  {/* Pot */}
                  <rect x="42" y="78" width="16" height="15" fill="#78350f" rx="2" />
                  <line x1="40" y1="78" x2="60" y2="78" stroke="#451a03" strokeWidth="2" />
                  {/* Shrub Woody Stems branching close to base */}
                  <path d="M 50 78 Q 42 60 35 40" fill="none" stroke="#b45309" strokeWidth="2" />
                  <path d="M 50 78 Q 58 55 65 42" fill="none" stroke="#78350f" strokeWidth="2" />
                  <path d="M 46 68 Q 50 45 48 30" fill="none" stroke="#b45309" strokeWidth="1.5" />
                  {/* Thorns */}
                  <line x1="46" y1="70" x2="43" y2="68" stroke="#dc2626" strokeWidth="1" />
                  <line x1="53" y1="62" x2="56" y2="64" stroke="#dc2626" strokeWidth="1" />
                  {/* Leaves */}
                  <circle cx="35" cy="40" r="3.5" fill="#047857" />
                  <circle cx="65" cy="42" r="3.5" fill="#047857" />
                  <circle cx="48" cy="30" r="4.5" fill="#065f46" />
                  {/* Flowers (Red Rose bud) */}
                  <circle cx="33" cy="35" r="4" fill="#dc2626" />
                  <circle cx="67" cy="38" r="4" fill="#dc2626" />
                </svg>
              )}

              {selectedPlantId === 'plantC' && (
                <svg width="220" height="220" viewBox="0 0 100 100">
                  {/* Earth Mound */}
                  <ellipse cx="50" cy="88" rx="22" ry="6" fill="#78350f" />
                  {/* Thick Tree Trunk */}
                  <path d="M 47 88 L 47 48 L 53 48 L 53 88 Z" fill="#78350f" />
                  <path d="M 47 55 Q 38 42 32 38" fill="none" stroke="#78350f" strokeWidth="2.5" />
                  <path d="M 53 52 Q 62 40 68 36" fill="none" stroke="#78350f" strokeWidth="2.5" />
                  {/* Dense compound leaf canopies */}
                  <ellipse cx="32" cy="38" rx="10" ry="6" fill="#047857" />
                  <ellipse cx="68" cy="36" rx="9" ry="5" fill="#065f46" opacity="0.9" />
                  <ellipse cx="50" cy="42" rx="14" ry="8" fill="#15803d" />
                </svg>
              )}

              <h4 style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#34d399' }}>
                {activePlant.displayName}
              </h4>
            </div>

            {/* Diagnostic Overlay HUD */}
            {activeTool !== 'none' && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(2, 44, 34, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <Search size={14} style={{ color: '#34d399' }} />
                <div>
                  <strong style={{ color: '#fbbf24', textTransform: 'uppercase', display: 'block', fontSize: '0.65rem' }}>
                    {activeTool === 'magnifier' ? '🔬 Magnifier Zoom' : activeTool === 'leaf_comparator' ? '🍃 Leaf Specimen analysis' : '🪵 Stem Mechanical Flex Test'}
                  </strong>
                  <span>
                    {activeTool === 'magnifier' && activePlant.magnifierZoom}
                    {activeTool === 'leaf_comparator' && `${activePlant.leafDetails} - ${activePlant.leafInfo}`}
                    {activeTool === 'stem_tester' && `${activePlant.stemDetails} - ${activePlant.stemInfo}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Diagnostics Tool Shelf */}
          <div style={{
            background: 'rgba(2, 44, 34, 0.5)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h4 style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', color: '#a7f3d0' }}>Tool Shelf</h4>

            <button
              onClick={() => setActiveTool(activeTool === 'magnifier' ? 'none' : 'magnifier')}
              style={{
                background: activeTool === 'magnifier' ? '#10b981' : 'rgba(255,255,255,0.03)',
                border: activeTool === 'magnifier' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                color: activeTool === 'magnifier' ? '#ffffff' : '#d1d5db',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={14} /> Inspect Node (Zoom)
            </button>

            <button
              onClick={() => setActiveTool(activeTool === 'leaf_comparator' ? 'none' : 'leaf_comparator')}
              style={{
                background: activeTool === 'leaf_comparator' ? '#10b981' : 'rgba(255,255,255,0.03)',
                border: activeTool === 'leaf_comparator' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                color: activeTool === 'leaf_comparator' ? '#ffffff' : '#d1d5db',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Compass size={14} /> Compare Leaf Shape
            </button>

            <button
              onClick={() => setActiveTool(activeTool === 'stem_tester' ? 'none' : 'stem_tester')}
              style={{
                background: activeTool === 'stem_tester' ? '#10b981' : 'rgba(255,255,255,0.03)',
                border: activeTool === 'stem_tester' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                color: activeTool === 'stem_tester' ? '#ffffff' : '#d1d5db',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <HelpCircle size={14} /> Flex/Tap Stem
            </button>

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.05)',
              padding: '0.5rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              lineHeight: '1.3',
              color: '#9ca3af',
              marginTop: 'auto'
            }}>
              💡 Select a tool and activate it on the plant above. Inspect details to log correct clues!
            </div>
          </div>
        </div>

        {/* Bottom: Classification Terminal Form */}
        <div style={{
          background: 'rgba(2, 44, 34, 0.8)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🧬 Forensic Clues sheet - {activePlant.displayName}
            </h4>
            {results[selectedPlantId] === true && (
              <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                ✓ IDENTIFIED CORRECTLY ({activePlant.realName})
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem' }}>
            {/* Clue 1: Stem type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Stem Property:</span>
              <select
                value={answers[selectedPlantId].stem ?? ''}
                onChange={(e) => handleSelectOption('stem', e.target.value === '' ? null : parseInt(e.target.value))}
                style={{
                  background: '#042f1a',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Choose stem type --</option>
                {activePlant.options.stem.map((opt, idx) => (
                  <option key={idx} value={idx}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Clue 2: Leaf complexity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Leaf Structure:</span>
              <select
                value={answers[selectedPlantId].leaf ?? ''}
                onChange={(e) => handleSelectOption('leaf', e.target.value === '' ? null : parseInt(e.target.value))}
                style={{
                  background: '#042f1a',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Choose leaf shape --</option>
                {activePlant.options.leaf.map((opt, idx) => (
                  <option key={idx} value={idx}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Clue 3: Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>Classification:</span>
              <select
                value={answers[selectedPlantId].class ?? ''}
                onChange={(e) => handleSelectOption('class', e.target.value === '' ? null : parseInt(e.target.value))}
                style={{
                  background: '#042f1a',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#ffffff',
                  padding: '0.4rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Class --</option>
                {activePlant.options.class.map((opt, idx) => (
                  <option key={idx} value={idx}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Verification trigger */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              onClick={handleVerifyPlant}
              style={{
                background: '#10b981',
                border: 'none',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              Verify Clues & Identification
            </button>
          </div>
        </div>

        {/* Master Badge Overlay */}
        {showDetectiveBadge && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(2, 44, 34, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            zIndex: 20
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(52, 211, 153, 0.4)'
            }}>
              <Award size={48} />
            </div>

            <h2 style={{ color: '#fbbf24', fontSize: '1.75rem', margin: '0 0 0.5rem 0' }}>Case Solved!</h2>
            <h3 style={{ fontSize: '1.2rem', color: '#ecfdf5', margin: '0 0 1rem 0' }}>Master Plant Detective Badge</h3>

            <p style={{ fontSize: '0.85rem', color: '#a7f3d0', maxWidth: '420px', lineHeight: '1.5', margin: '0 0 2rem 0' }}>
              Awesome job, detective! You correctly analyzed and classified all mystery plants.
              <br />
              <strong style={{ color: '#ffffff' }}>Plant Alpha</strong> is Tulsi (Herb), <strong style={{ color: '#ffffff' }}>Plant Beta</strong> is Wild Rose (Shrub), and <strong style={{ color: '#ffffff' }}>Plant Gamma</strong> is Neem (Tree).
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReset}
                className="outline"
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'none'
                }}
              >
                Inspect Again
              </button>
              <button
                onClick={onBackToDashboard}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.85rem',
                  background: '#fbbf24',
                  border: 'none',
                  color: '#022c22',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Back to Activities
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
