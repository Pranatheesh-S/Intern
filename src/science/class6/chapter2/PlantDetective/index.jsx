import React, { useState, useRef, useEffect } from 'react';
import { Award, RefreshCw, Scan, FlaskConical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';

const MYSTERY_PLANTS = [
  {
    id: 'plantA',
    displayName: 'Mystery Plant Alpha',
    realName: 'Holy Basil (Tulsi)',
    category: 'Herb',
    emoji: '🌿',
    magnifierZones: {
      top: { label: 'Flower Tip', detail: 'Tiny purple flower buds — arranged in whorls at the apex. Characteristic of the mint family (Lamiaceae).' },
      mid: { label: 'Stem Node', detail: 'Soft square-shaped green stem. Opposite leaf pairs emerge at every node. Faint trichomes (microscopic hairs) visible.' },
      bot: { label: 'Root Entry', detail: 'Soft fibrous roots spread horizontally near the soil surface — no deep taproot, consistent with herbaceous growth.' }
    },
    flexResponse: { resistance: 5, label: 'Very Flexible', color: 'var(--success)', gauge: 'herb' },
    stemInfo: 'Soft, green, herbaceous',
    leafInfo: 'Opposite leaf pairs (simple)',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, woody, branching at base', 'Thick, hard, trunk with bark'],
      leaf: ['Opposite leaf pairs (simple)', 'Alternate leaf nodes with thorns', 'Pinnate compound leaflets'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: { stem: 0, leaf: 0, class: 0 }
  },
  {
    id: 'plantB',
    displayName: 'Mystery Plant Beta',
    realName: 'Wild Rose Shrub',
    category: 'Shrub',
    emoji: '🌺',
    magnifierZones: {
      top: { label: 'Rose Bud', detail: 'Tightly-closed crimson petals — compound flower structure. Multiple stamens visible at the center.' },
      mid: { label: 'Thorn Stem', detail: 'Hard brown epidermis with sharp epidermal prickles (modified stem outgrowths). Clear wood grain visible in cross-section.' },
      bot: { label: 'Base Branch', detail: 'Branches emerge close to ground level — a key diagnostic feature separating shrubs from trees.' }
    },
    flexResponse: { resistance: 55, label: 'Stiff / Woody', color: 'var(--warning)', gauge: 'shrub' },
    stemInfo: 'Thin, woody, branching at base',
    leafInfo: 'Alternate leaf nodes with thorns',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, woody, branching at base', 'Thick, hard, trunk with bark'],
      leaf: ['Opposite leaf pairs (simple)', 'Alternate leaf nodes with thorns', 'Pinnate compound leaflets'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: { stem: 1, leaf: 1, class: 1 }
  },
  {
    id: 'plantC',
    displayName: 'Mystery Plant Gamma',
    realName: 'Neem Tree Sapling',
    category: 'Tree',
    emoji: '🌳',
    magnifierZones: {
      top: { label: 'Leaf Crown', detail: 'Large compound pinnate leaves — each with 8–18 lance-shaped, serrated leaflets arranged along a central rachis.' },
      mid: { label: 'Bark Surface', detail: 'Thick, rough, scaly brown bark — multiple layers of dead cork cells (periderm) protecting the living inner wood.' },
      bot: { label: 'Trunk Base', detail: 'Single thick woody trunk firmly anchored in soil. Annual growth rings clearly visible in cross-section.' }
    },
    flexResponse: { resistance: 100, label: 'Rigid / Unbendable', color: 'var(--danger)', gauge: 'tree' },
    stemInfo: 'Thick, hard, trunk with bark',
    leafInfo: 'Pinnate compound leaflets',
    options: {
      stem: ['Soft, green, herbaceous', 'Thin, woody, branching at base', 'Thick, hard, trunk with bark'],
      leaf: ['Opposite leaf pairs (simple)', 'Alternate leaf nodes with thorns', 'Pinnate compound leaflets'],
      class: ['Herb', 'Shrub', 'Tree']
    },
    answers: { stem: 2, leaf: 2, class: 2 }
  }
];

const CLUE_TAGS = {
  stem: [
    { label: 'Soft, green, herbaceous', idx: 0 },
    { label: 'Thin, woody, branching at base', idx: 1 },
    { label: 'Thick, hard, trunk with bark', idx: 2 }
  ],
  leaf: [
    { label: 'Opposite leaf pairs (simple)', idx: 0 },
    { label: 'Alternate leaf nodes with thorns', idx: 1 },
    { label: 'Pinnate compound leaflets', idx: 2 }
  ],
  class: [
    { label: 'Herb', idx: 0 },
    { label: 'Shrub', idx: 1 },
    { label: 'Tree', idx: 2 }
  ]
};

const PLANT_IMAGES = {
  plantA: '/herb_specimen.png',
  plantB: '/shrub_specimen.png',
  plantC: '/tree_specimen.png',
};

export default function PlantDetective({ onBackToDashboard }) {
  const { theme } = useTheme();
  const [selectedPlantId, setSelectedPlantId] = useState('plantA');
  const [magnifierPos, setMagnifierPos] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [flexLevel, setFlexLevel] = useState(0); // 0 = straight, 100 = max flex
  const [isDraggingFlex, setIsDraggingFlex] = useState(false);
  const [flexLocked, setFlexLocked] = useState(false);
  const [answers, setAnswers] = useState({
    plantA: { stem: null, leaf: null, class: null },
    plantB: { stem: null, leaf: null, class: null },
    plantC: { stem: null, leaf: null, class: null }
  });
  const [draggedTag, setDraggedTag] = useState(null);
  const [results, setResults] = useState({ plantA: null, plantB: null, plantC: null });
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'flex' | 'sheet'
  const specimenRef = useRef(null);
  const flexBarRef = useRef(null);

  const activePlant = MYSTERY_PLANTS.find(p => p.id === selectedPlantId);
  const plantImage = PLANT_IMAGES[selectedPlantId];

  // Reset flex when plant changes
  useEffect(() => {
    setFlexLevel(0);
    setFlexLocked(false);
    setMagnifierPos(null);
    setActiveZone(null);
  }, [selectedPlantId]);

  // Magnifier zone detection
  const getZoneFromY = (relY, height) => {
    if (relY < height * 0.33) return 'top';
    if (relY < height * 0.66) return 'mid';
    return 'bot';
  };

  const handleSpecimenMouseMove = (e) => {
    const rect = specimenRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    setMagnifierPos({ x: relX, y: relY });
    setActiveZone(getZoneFromY(relY, rect.height));
  };

  const handleSpecimenLeave = () => {
    setMagnifierPos(null);
    setActiveZone(null);
  };

  // Flex bar drag
  const handleFlexMouseDown = (e) => {
    if (flexLocked) return;
    setIsDraggingFlex(true);
    e.preventDefault();
  };

  const handleFlexMouseMove = (e) => {
    if (!isDraggingFlex || flexLocked) return;
    const rect = flexBarRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = Math.round((relX / rect.width) * 100);
    setFlexLevel(pct);
  };

  const handleFlexMouseUp = () => {
    if (!isDraggingFlex) return;
    setIsDraggingFlex(false);
    setFlexLocked(true);
  };

  // Clue tag drag-and-drop
  const handleTagDragStart = (e, field, idx) => {
    setDraggedTag({ field, idx });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSlotDrop = (e, field) => {
    e.preventDefault();
    if (!draggedTag || draggedTag.field !== field) return;
    setAnswers(prev => ({
      ...prev,
      [selectedPlantId]: { ...prev[selectedPlantId], [field]: draggedTag.idx }
    }));
    setDraggedTag(null);
    setResults(prev => ({ ...prev, [selectedPlantId]: null }));
  };

  const handleSlotDragOver = (e) => e.preventDefault();

  const handleSlotClear = (field) => {
    setAnswers(prev => ({
      ...prev,
      [selectedPlantId]: { ...prev[selectedPlantId], [field]: null }
    }));
  };

  // Scanning verification
  const handleVerify = () => {
    const ans = answers[selectedPlantId];
    if (ans.stem === null || ans.leaf === null || ans.class === null) {
      return;
    }
    setScanning(true);
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const isCorrect =
          ans.stem === activePlant.answers.stem &&
          ans.leaf === activePlant.answers.leaf &&
          ans.class === activePlant.answers.class;
        const updated = { ...results, [selectedPlantId]: isCorrect };
        setResults(updated);
        setScanning(false);
        setScanProgress(0);
        if (updated.plantA && updated.plantB && updated.plantC) {
          setShowBadge(true);
          confetti({ particleCount: 200, spread: 90, origin: { y: 0.55 } });
        }
      }
    }, 40);
  };

  const handleReset = () => {
    setAnswers({ plantA: { stem: null, leaf: null, class: null }, plantB: { stem: null, leaf: null, class: null }, plantC: { stem: null, leaf: null, class: null } });
    setResults({ plantA: null, plantB: null, plantC: null });
    setShowBadge(false);
    setFlexLevel(0);
    setFlexLocked(false);
  };

  const currentFlex = activePlant.flexResponse;
  const gaugeVal = Math.min(flexLevel, currentFlex.resistance);
  const gaugeColor = gaugeVal < 30 ? 'var(--success)' : gaugeVal < 70 ? 'var(--warning)' : 'var(--danger)';

  const allSlotsFilledForPlant = () => {
    const a = answers[selectedPlantId];
    return a.stem !== null && a.leaf !== null && a.class !== null;
  };

  const isLight = theme === 'light';
  const containerBg = isLight ? '#ffffff' : '#0a1628';
  const textColor = isLight ? '#1e293b' : '#e2e8f0';
  const sidebarBg = isLight ? '#f8fafc' : '#0f1f3d';
  const borderColor = isLight ? '#cbd5e1' : 'rgba(99,102,241,0.12)';
  const cardBorder = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.05)';
  const fontColorMuted = isLight ? '#475569' : '#94a3b8';
  const fontColorFaint = isLight ? '#64748b' : '#475569';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      height: '100%',
      minHeight: '560px',
      background: containerBg,
      color: textColor,
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}
      onMouseMove={handleFlexMouseMove}
      onMouseUp={handleFlexMouseUp}
    >
      {/* Sidebar */}
      <aside style={{ background: sidebarBg, borderRight: `1px solid ${borderColor}`, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FlaskConical size={18} color={isLight ? '#4f46e5' : '#818cf8'} />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: isLight ? '#4f46e5' : '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Case Catalog</span>
        </div>

        {/* Plant case cards */}
        {MYSTERY_PLANTS.map(plant => {
          const isVerified = results[plant.id] === true;
          const isFailed = results[plant.id] === false;
          const isSelected = selectedPlantId === plant.id;
          return (
            <button
              key={plant.id}
              onClick={() => { setSelectedPlantId(plant.id); setActiveTab('scanner'); }}
              style={{
                background: isSelected 
                  ? (isLight ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.15)') 
                  : (isLight ? '#ffffff' : 'rgba(255,255,255,0.02)'),
                border: isSelected 
                  ? '1px solid #6366f1' 
                  : `1px solid ${cardBorder}`,
                padding: '0.85rem 0.9rem',
                borderRadius: '12px',
                color: textColor,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 0 16px ${isLight ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.15)'}` : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{plant.emoji}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{plant.displayName}</span>
              </div>
              {isVerified
                ? <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 'bold' }}>✓ ID'D</span>
                : isFailed
                ? <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 'bold' }}>✗ RETRY</span>
                : <span style={{ color: fontColorFaint, fontSize: '11px' }}>OPEN</span>}
            </button>
          );
        })}

        {/* Mission card */}
        <div style={{ 
          background: isLight ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.06)', 
          border: `1px solid ${isLight ? '#c7d2fe' : 'rgba(99,102,241,0.15)'}`, 
          borderRadius: '10px', 
          padding: '0.8rem', 
          marginTop: 'auto' 
        }}>
          <strong style={{ color: isLight ? '#4338ca' : '#a5b4fc', fontSize: '11px', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>Mission Brief</strong>
          <span style={{ fontSize: '12px', lineHeight: '1.5', color: fontColorMuted }}>
            Use the Scanner, Flex Tester, and Clue Sheet tools to identify all 3 mystery plants and unlock your Detective Badge.
          </span>
        </div>

        <button onClick={handleReset} style={{ background: 'none', border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255,255,255,0.07)'}`, color: fontColorFaint, padding: '0.5rem', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <RefreshCw size={12} /> Clear All Files
        </button>
      </aside>

      {/* Main workbench */}
      <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 0, background: isLight ? '#f1f5f9' : '#0f1f3d', borderBottom: `1px solid ${borderColor}` }}>
          {[
            { id: 'scanner', label: '🔬 Scanner', tip: 'Hover to inspect' },
            { id: 'flex', label: '🪵 Flex Tester', tip: 'Drag to bend stem' },
            { id: 'sheet', label: '🧬 Clue Sheet', tip: 'Drag tags to slots' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? (isLight ? '#ffffff' : 'rgba(99,102,241,0.15)') : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === tab.id ? (isLight ? '#4f46e5' : '#a5b4fc') : fontColorFaint,
                padding: '0.85rem 1.25rem',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}
            >
              {tab.label}
              <span style={{ fontSize: '10px', color: fontColorFaint, fontWeight: 'normal' }}>{tab.tip}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0, overflow: 'hidden' }}>

          {/* Left panel — specimen / tool area */}
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }}>

            {/* ---- SCANNER TAB ---- */}
            {activeTab === 'scanner' && (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scan size={13} /> Move your cursor over the plant to activate the magnifier lens
                </div>
                <div
                  ref={specimenRef}
                  onMouseMove={handleSpecimenMouseMove}
                  onMouseLeave={handleSpecimenLeave}
                  style={{
                    position: 'relative',
                    background: isLight 
                      ? 'radial-gradient(ellipse at center, #f0fdf4 0%, #dcfce7 100%)' 
                      : 'radial-gradient(ellipse at center, #1a2e1a 0%, #0a1a0a 100%)',
                    borderRadius: '16px',
                    border: `1px solid ${isLight ? '#bbf7d0' : 'rgba(34, 197, 94, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '240px',
                    cursor: 'crosshair',
                    overflow: 'hidden'
                  }}
                >
                  <img src={plantImage} alt={activePlant.displayName} style={{ height: '220px', objectFit: 'contain' }} />

                  {/* Magnifier lens overlay */}
                  {magnifierPos && (
                    <div style={{
                      position: 'absolute',
                      left: magnifierPos.x - 44,
                      top: magnifierPos.y - 44,
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      border: '3px solid var(--accent)',
                      boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 0 20px rgba(99,102,241,0.2)',
                      background: 'var(--accent-bg)',
                      backdropFilter: 'brightness(1.3)',
                      pointerEvents: 'none',
                      zIndex: 10,
                      transition: 'left 0.05s, top 0.05s'
                    }} />
                  )}

                  {/* Zone indicator strips */}
                  {['top', 'mid', 'bot'].map((zone, i) => (
                    <div key={zone} style={{
                      position: 'absolute',
                      top: `${i * 33}%`,
                      left: 0,
                      right: 0,
                      height: '33%',
                      borderBottom: i < 2 ? '1px dashed var(--accent-border)' : 'none',
                      background: activeZone === zone ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      transition: 'background 0.15s',
                      pointerEvents: 'none'
                    }} />
                  ))}
                </div>

                {/* Zone detail card */}
                {activeZone && (
                  <div style={{
                    background: 'var(--accent-bg)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    <strong style={{ color: 'var(--accent-text)', display: 'block', marginBottom: '0.4rem', fontSize: '13px' }}>
                      🔬 {activePlant.magnifierZones[activeZone].label}
                    </strong>
                    <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                      {activePlant.magnifierZones[activeZone].detail}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ---- FLEX TESTER TAB ---- */}
            {activeTab === 'flex' && (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                  🪵 Drag the lever right to apply force to the stem. See how much it bends!
                </div>

                {/* Animated stem bending visual */}
                <div style={{
                  background: isLight 
                    ? 'radial-gradient(ellipse at center, #fffbeb 0%, #fef3c7 100%)' 
                    : 'radial-gradient(ellipse at center, #1e1a0a 0%, #0a0f0a 100%)',
                  borderRadius: '16px',
                  border: `1px solid ${isLight ? '#fde68a' : 'rgba(217,119,6,0.12)'}`,
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <svg width="200" height="180" viewBox="0 0 100 90">
                    {/* Ground */}
                    <rect x="0" y="75" width="100" height="15" fill="#1c1008" />
                    <rect x="35" y="72" width="30" height="8" fill="#78350f" rx="2" />
                    {/* Bending stem */}
                    {selectedPlantId === 'plantA' && (
                      <path
                        d={`M50 72 Q${50 + Math.min(flexLevel * 0.3, 28)} ${50 - flexLevel * 0.1} ${50 + Math.min(flexLevel * 0.4, 38)} ${30 - flexLevel * 0.05}`}
                        fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
                        style={{ transition: 'd 0.1s ease' }}
                      />
                    )}
                    {selectedPlantId === 'plantB' && (
                      <path
                        d={`M50 72 Q${50 + Math.min(flexLevel * 0.15, 14)} ${48} ${50 + Math.min(flexLevel * 0.18, 16)} ${28}`}
                        fill="none" stroke="#92400e" strokeWidth="5.5" strokeLinecap="round"
                        style={{ transition: 'd 0.1s ease' }}
                      />
                    )}
                    {selectedPlantId === 'plantC' && (
                      <path
                        d={`M50 72 Q${50 + Math.min(flexLevel * 0.04, 3)} ${48} ${50 + Math.min(flexLevel * 0.03, 2.5)} ${25}`}
                        fill="none" stroke="#451a03" strokeWidth="8" strokeLinecap="round"
                        style={{ transition: 'd 0.1s ease' }}
                      />
                    )}
                    {/* Force arrow */}
                    {flexLevel > 5 && (
                      <g opacity={Math.min(flexLevel / 50, 1)}>
                        <line x1={50 + Math.min(flexLevel * 0.35, 35)} y1="30" x2={50 + Math.min(flexLevel * 0.4, 40)} y2="30" stroke="#f59e0b" strokeWidth="1.5" />
                        <polygon points={`${50 + Math.min(flexLevel * 0.42, 42)},30 ${50 + Math.min(flexLevel * 0.37, 37)},27 ${50 + Math.min(flexLevel * 0.37, 37)},33`} fill="#f59e0b" />
                      </g>
                    )}
                  </svg>
                  {flexLocked && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: currentFlex.color, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                      {currentFlex.label}
                    </div>
                  )}
                </div>

                {/* Drag lever */}
                <div style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: 'var(--text-faint)' }}>
                    <span>No Force</span>
                    <span style={{ color: flexLocked ? currentFlex.color : 'var(--text-muted)' }}>
                      {flexLocked ? currentFlex.label : 'Apply Force →'}
                    </span>
                    <span>Max Force</span>
                  </div>
                  <div
                    ref={flexBarRef}
                    onMouseDown={handleFlexMouseDown}
                    style={{
                      width: '100%',
                      height: '20px',
                      background: 'rgba(120,120,120,0.1)',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      position: 'relative',
                      cursor: flexLocked ? 'default' : 'grab',
                      userSelect: 'none'
                    }}
                  >
                    {/* Fill */}
                    <div style={{ height: '100%', width: `${flexLevel}%`, background: `linear-gradient(90deg, var(--success), ${gaugeColor})`, borderRadius: '10px', transition: 'background 0.3s' }} />
                    {/* Handle */}
                    <div style={{
                      position: 'absolute',
                      left: `calc(${flexLevel}% - 10px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#fff',
                      border: `3px solid ${gaugeColor}`,
                      boxShadow: `0 0 8px ${gaugeColor}66`,
                      transition: 'border-color 0.3s'
                    }} />
                  </div>
                  {flexLocked && (
                    <div style={{ marginTop: '0.65rem', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {selectedPlantId === 'plantA' && '✅ The stem bent easily! This is characteristic of a herb — soft herbaceous tissues with no lignin (wood). The green parenchyma cells have low rigidity.'}
                      {selectedPlantId === 'plantB' && '⚠️ The stem shows moderate resistance before bending. Thin woody xylem tissue is present — a shrub characteristic. Branches near the base absorb and distribute stress.'}
                      {selectedPlantId === 'plantC' && '🔴 The stem does not bend at all! The thick woody trunk is reinforced by concentric rings of secondary xylem (wood), making it rigid and nearly unbreakable by hand.'}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ---- CLUE SHEET TAB ---- */}
            {activeTab === 'sheet' && (
              <>
                <div style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                  🏷️ Drag clue tags from the right panel and drop them into the correct slots below:
                </div>

                {/* Slots */}
                {['stem', 'leaf', 'class'].map(field => {
                  const slotVal = answers[selectedPlantId][field];
                  const slotLabel = slotVal !== null ? CLUE_TAGS[field].find(t => t.idx === slotVal)?.label : null;
                  return (
                    <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'capitalize' }}>
                        {field === 'class' ? '🔬 Classification' : field === 'stem' ? '🌿 Stem Type' : '🍃 Leaf Structure'}
                      </span>
                      <div
                        onDrop={(e) => handleSlotDrop(e, field)}
                        onDragOver={handleSlotDragOver}
                        style={{
                          minHeight: '48px',
                          border: `2px dashed ${slotLabel ? 'var(--accent-border)' : 'var(--border)'}`,
                          borderRadius: '10px',
                          background: slotLabel ? 'var(--accent-bg)' : 'var(--surface)',
                          padding: '0.5rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          fontSize: '13px',
                          color: slotLabel ? 'var(--accent-text)' : 'var(--text-faint)'
                        }}
                      >
                        <span>{slotLabel || `Drop a "${field}" tag here…`}</span>
                        {slotLabel && (
                          <button onClick={() => handleSlotClear(field)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '14px', padding: '0 0 0 8px' }}>×</button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Verification result */}
                {results[selectedPlantId] !== null && (
                  <div style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: '12px',
                    background: results[selectedPlantId] ? 'var(--success-bg)' : 'var(--danger-bg)',
                    border: `1px solid ${results[selectedPlantId] ? 'var(--success-border)' : 'var(--danger-border)'}`,
                    fontSize: '13.5px',
                    color: results[selectedPlantId] ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {results[selectedPlantId]
                      ? `✅ Correctly identified as ${activePlant.realName}!`
                      : '❌ Incorrect — double-check your clues using the Scanner and Flex Tester.'}
                  </div>
                )}

                {/* Verify button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <button
                    onClick={handleVerify}
                    disabled={!allSlotsFilledForPlant() || scanning}
                    style={{
                      background: allSlotsFilledForPlant() ? 'linear-gradient(135deg, var(--accent), #818cf8)' : 'var(--surface)',
                      border: 'none',
                      color: allSlotsFilledForPlant() ? '#ffffff' : 'var(--text-faint)',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '24px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: allSlotsFilledForPlant() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: allSlotsFilledForPlant() ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Scan size={15} />
                    {scanning ? 'Scanning…' : 'Run Forensic Scan'}
                  </button>
                </div>

                {/* Scan progress bar */}
                {scanning && (
                  <div style={{ width: '100%', height: '4px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${scanProgress}%`,
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-text))',
                      transition: 'width 0.04s linear',
                      boxShadow: '0 0 8px rgba(99,102,241,0.6)'
                    }} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right panel — clue tag library + status */}
          <div style={{
            borderLeft: `1px solid ${borderColor}`,
            background: isLight ? '#f1f5f9' : '#0d1a30',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            overflowY: 'auto'
          }}>
            {activeTab === 'sheet' ? (
              <>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🏷️ Clue Tag Library</span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-faint)' }}>Drag a tag and drop it into the matching slot on the left.</span>
                {(['stem', 'leaf', 'class'] ).map(field => (
                  <div key={field}>
                    <span style={{ fontSize: '11.5px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                      {field === 'class' ? 'Classification' : field === 'stem' ? 'Stem Tags' : 'Leaf Tags'}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {CLUE_TAGS[field].map(tag => (
                        <div
                          key={tag.idx}
                          draggable
                          onDragStart={(e) => handleTagDragStart(e, field, tag.idx)}
                          style={{
                            background: isLight ? '#ffffff' : 'var(--accent-bg)',
                            border: `1px solid ${isLight ? '#cbd5e1' : 'var(--accent-border)'}`,
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '12.5px',
                            color: textColor,
                            cursor: 'grab',
                            userSelect: 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {tag.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Plant stat card */}
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔖 Plant File</span>
                <div style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '2rem' }}>{activePlant.emoji}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{activePlant.displayName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>UNRESOLVED</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', fontSize: '12.5px', lineHeight: '1.5', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <span>📍 Scan <b>top, middle, and base</b> zones of the specimen to gather microscopic clues.</span>
                    <span>🪵 Use the Flex Tester to gauge stem rigidity — this reveals herb/shrub/tree characteristics.</span>
                    <span>🧬 Fill all 3 clue slots in the Clue Sheet and run the Forensic Scan.</span>
                  </div>
                </div>

                {/* Case status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Case Progress</span>
                  {MYSTERY_PLANTS.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: results[p.id] === true ? 'var(--success)' : results[p.id] === false ? 'var(--danger)' : 'var(--text-faint)' }}>
                      <span>{results[p.id] === true ? '✅' : results[p.id] === false ? '❌' : '○'}</span>
                      <span>{p.displayName}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Badge overlay */}
      {showBadge && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          zIndex: 30,
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px var(--accent-bg)', marginBottom: '1.25rem' }}>
            <Award size={52} color="var(--accent-text)" />
          </div>
          <h2 style={{ color: 'var(--warning)', fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>All Cases Solved!</h2>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>Master Plant Detective Badge Earned</h3>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
            Outstanding work! You've correctly identified all three specimens:<br />
            <strong style={{ color: 'var(--accent-text)' }}>Alpha</strong> = Tulsi (Herb) · <strong style={{ color: 'var(--accent-text)' }}>Beta</strong> = Wild Rose (Shrub) · <strong style={{ color: 'var(--accent-text)' }}>Gamma</strong> = Neem (Tree)
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ padding: '0.6rem 1.5rem', fontSize: '13px', borderRadius: '24px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'none', cursor: 'pointer' }}>Investigate Again</button>
            <button onClick={onBackToDashboard} style={{ padding: '0.6rem 1.5rem', fontSize: '13px', background: 'linear-gradient(135deg, var(--accent), #818cf8)', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '24px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>Proceed to Quiz →</button>
          </div>
        </div>
      )}
    </div>
  );
}
