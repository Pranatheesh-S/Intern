import React, { useState, useRef, useEffect } from 'react';
import { Award, RefreshCw, Scan, FlaskConical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

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
  const containerBg = `url(${darkForestBg}) center/cover no-repeat fixed`;
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const sidebarBg = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(15, 31, 61, 0.88)';
  const borderColor = isLight ? '#cbd5e1' : 'rgba(99,102,241,0.12)';
  const cardBorder = isLight ? '#cbd5e1' : 'rgba(255,255,255,0.05)';
  const fontColorMuted = isLight ? '#334155' : '#e2e8f0';
  const fontColorFaint = isLight ? '#475569' : '#cbd5e1';

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
                    height: '360px',
                    minHeight: '360px',
                    cursor: 'crosshair',
                    overflow: 'hidden'
                  }}
                >
                  <img src={plantImage} alt={activePlant.displayName} style={{ height: '340px', objectFit: 'contain' }} />

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
                 {(() => {
                   let endX = 50;
                   let endY = 30;
                   let qX = 50;
                   let qY = 50;
                   
                   if (selectedPlantId === 'plantA') {
                     endX = 50 + Math.min(flexLevel * 0.4, 38);
                     endY = 30 - flexLevel * 0.05;
                     qX = 50 + Math.min(flexLevel * 0.3, 28);
                     qY = 50 - flexLevel * 0.1;
                   } else if (selectedPlantId === 'plantB') {
                     endX = 50 + Math.min(flexLevel * 0.18, 16);
                     endY = 28;
                     qX = 50 + Math.min(flexLevel * 0.15, 14);
                     qY = 48;
                   } else if (selectedPlantId === 'plantC') {
                     endX = 50 + Math.min(flexLevel * 0.03, 2.5);
                     endY = 25;
                     qX = 50 + Math.min(flexLevel * 0.04, 3);
                     qY = 48;
                   }

                   return (
                     <div style={{
                       background: isLight 
                         ? 'radial-gradient(ellipse at center, #f8fafc 0%, #e2e8f0 100%)' 
                         : 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)',
                       borderRadius: '16px',
                       border: `1px solid var(--border)`,
                       minHeight: '220px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       overflow: 'hidden',
                       position: 'relative',
                       width: '100%'
                     }}>
                       {/* Laboratory background grid lines */}
                       <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem 1.5rem', pointerEvents: 'none', opacity: 0.15 }}>
                         <div style={{ borderBottom: '1px dashed var(--accent)', width: '100%', fontSize: '9px', color: 'var(--accent)' }}>30° Flex Limit</div>
                         <div style={{ borderBottom: '1px dashed var(--accent)', width: '100%', fontSize: '9px', color: 'var(--accent)' }}>60° Flex Limit</div>
                         <div style={{ borderBottom: '1px dashed var(--accent)', width: '100%', fontSize: '9px', color: 'var(--accent)' }}>Base Clamp Alignment</div>
                       </div>

                        <svg width="240" height="200" viewBox="0 0 100 90">
                          <defs>
                            <linearGradient id="clay-pot-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#7c2d12" />
                              <stop offset="30%" stopColor="#ea580c" />
                              <stop offset="70%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#7c2d12" />
                            </linearGradient>
                            <linearGradient id="clay-rim-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ea580c" />
                              <stop offset="100%" stopColor="#9a3412" />
                            </linearGradient>
                            <linearGradient id="basil-stem-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#15803d" />
                              <stop offset="50%" stopColor="#4ade80" />
                              <stop offset="100%" stopColor="#14532d" />
                            </linearGradient>
                            <linearGradient id="rose-stem-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#78350f" />
                              <stop offset="50%" stopColor="#b45309" />
                              <stop offset="100%" stopColor="#451a03" />
                            </linearGradient>
                            <linearGradient id="neem-stem-grad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#451a03" />
                              <stop offset="50%" stopColor="#78350f" />
                              <stop offset="100%" stopColor="#270f02" />
                            </linearGradient>
                          </defs>

                          {/* Grid overlay in SVG */}
                          <g opacity="0.08">
                            <line x1="10" y1="30" x2="90" y2="30" stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" />
                            <line x1="10" y1="50" x2="90" y2="50" stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" />
                            <text x="92" y="32" fontSize="4" textAnchor="start">30px</text>
                            <text x="92" y="52" fontSize="4" textAnchor="start">50px</text>
                          </g>

                          {/* Specimen Clay Pot */}
                          <polygon points="35,84 65,84 60,72 40,72" fill="url(#clay-pot-grad)" stroke="#451a03" strokeWidth="1" />
                          <rect x="33" y="70" width="34" height="2.5" fill="url(#clay-rim-grad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                          <ellipse cx="50" cy="71" rx="16" ry="2.2" fill="#271b12" stroke="#1d110a" strokeWidth="0.5" />

                          {/* Bending stem path */}
                          {(() => {
                            const getPt = (t) => {
                              const x = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * qX + t * t * endX;
                              const y = (1 - t) * (1 - t) * 71 + 2 * (1 - t) * t * qY + t * t * endY;
                              return { x, y };
                            };

                            if (selectedPlantId === 'plantA') {
                              const p0_5 = getPt(0.5);
                              const p0_8 = getPt(0.8);
                              const p1_0 = getPt(1.0);
                              return (
                                <>
                                  {/* 3D cylindrical green stem shadow, midtone, and highlight layers */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  {/* Fine longitudinal ridges for square stem detail */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#166534" strokeWidth="0.5" strokeDasharray="5,3"
                                    style={{ transition: 'd 0.1s ease' }}
                                    opacity="0.65"
                                  />

                                  {/* Node 1 (t = 0.5): opposite leaves with leaf veins */}
                                  <g>
                                    {/* Left Leaf */}
                                    <path d={`M ${p0_5.x} ${p0_5.y} C ${p0_5.x - 5} ${p0_5.y - 4}, ${p0_5.x - 11} ${p0_5.y - 3}, ${p0_5.x - 13} ${p0_5.y + 1} C ${p0_5.x - 9} ${p0_5.y + 4}, ${p0_5.x - 4} ${p0_5.y + 3}, ${p0_5.x} ${p0_5.y} Z`} fill="#16a34a" stroke="#14532d" strokeWidth="0.5" />
                                    <path d={`M ${p0_5.x} ${p0_5.y} Q ${p0_5.x - 6} ${p0_5.y + 0.5} ${p0_5.x - 13} ${p0_5.y + 1}`} fill="none" stroke="#14532d" strokeWidth="0.4" opacity="0.7" />
                                    <path d={`M ${p0_5.x - 4} ${p0_5.y + 0.5} Q ${p0_5.x - 6} ${p0_5.y - 1.5} ${p0_5.x - 7} ${p0_5.y - 2.5}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                    <path d={`M ${p0_5.x - 7} ${p0_5.y + 1.2} Q ${p0_5.x - 9} ${p0_5.y + 0.2} ${p0_5.x - 10} ${p0_5.y - 1}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                    <path d={`M ${p0_5.x - 4} ${p0_5.y + 0.5} Q ${p0_5.x - 5} ${p0_5.y + 2.5} ${p0_5.x - 6} ${p0_5.y + 3.2}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                    
                                    {/* Right Leaf */}
                                    <path d={`M ${p0_5.x} ${p0_5.y} C ${p0_5.x + 5} ${p0_5.y - 4}, ${p0_5.x + 11} ${p0_5.y - 3}, ${p0_5.x + 13} ${p0_5.y + 1} C ${p0_5.x + 9} ${p0_5.y + 4}, ${p0_5.x + 4} ${p0_5.y + 3}, ${p0_5.x} ${p0_5.y} Z`} fill="#16a34a" stroke="#14532d" strokeWidth="0.5" />
                                    <path d={`M ${p0_5.x} ${p0_5.y} Q ${p0_5.x + 6} ${p0_5.y + 0.5} ${p0_5.x + 13} ${p0_5.y + 1}`} fill="none" stroke="#14532d" strokeWidth="0.4" opacity="0.7" />
                                    <path d={`M ${p0_5.x + 4} ${p0_5.y + 0.5} Q ${p0_5.x + 6} ${p0_5.y - 1.5} ${p0_5.x + 7} ${p0_5.y - 2.5}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                    <path d={`M ${p0_5.x + 7} ${p0_5.y + 1.2} Q ${p0_5.x + 9} ${p0_5.y + 0.2} ${p0_5.x + 10} ${p0_5.y - 1}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                    <path d={`M ${p0_5.x + 4} ${p0_5.y + 0.5} Q ${p0_5.x + 5} ${p0_5.y + 2.5} ${p0_5.x + 6} ${p0_5.y + 3.2}`} fill="none" stroke="#14532d" strokeWidth="0.3" opacity="0.5" />
                                  </g>

                                  {/* Node 2 (t = 0.8) */}
                                  <g>
                                    <path d={`M ${p0_8.x} ${p0_8.y} C ${p0_8.x - 4} ${p0_8.y - 3}, ${p0_8.x - 9} ${p0_8.y - 2}, ${p0_8.x - 11} ${p0_8.y + 1} C ${p0_8.x - 8} ${p0_8.y + 3}, ${p0_8.x - 3} ${p0_8.y + 2}, ${p0_8.x} ${p0_8.y} Z`} fill="#22c55e" stroke="#14532d" strokeWidth="0.5" />
                                    <path d={`M ${p0_8.x} ${p0_8.y} C ${p0_8.x + 4} ${p0_8.y - 3}, ${p0_8.x + 9} ${p0_8.y - 2}, ${p0_8.x + 11} ${p0_8.y + 1} C ${p0_8.x + 8} ${p0_8.y + 3}, ${p0_8.x + 3} ${p0_8.y + 2}, ${p0_8.x} ${p0_8.y} Z`} fill="#22c55e" stroke="#14532d" strokeWidth="0.5" />
                                  </g>

                                  {/* Apex (t = 1.0): Leaves + Detailed Flower Spikes (Verticillasters) */}
                                  <g>
                                    {/* Small bract leaves */}
                                    <path d={`M ${p1_0.x} ${p1_0.y} C ${p1_0.x - 3} ${p1_0.y - 2}, ${p1_0.x - 7} ${p1_0.y - 2}, ${p1_0.x - 8} ${p1_0.y + 0.5} Z`} fill="#4ade80" stroke="#15803d" strokeWidth="0.4" />
                                    <path d={`M ${p1_0.x} ${p1_0.y} C ${p1_0.x + 3} ${p1_0.y - 2}, ${p1_0.x + 7} ${p1_0.y - 2}, ${p1_0.x + 8} ${p1_0.y + 0.5} Z`} fill="#4ade80" stroke="#15803d" strokeWidth="0.4" />
                                    
                                    {/* Central Flower spike shaft */}
                                    <line x1={p1_0.x} y1={p1_0.y} x2={p1_0.x} y2={p1_0.y - 12} stroke="#4ade80" strokeWidth="0.8" strokeLinecap="round" />
                                    
                                    {/* Tier 1 - lower flower whorl */}
                                    <circle cx={p1_0.x} cy={p1_0.y - 3} r="1.5" fill="#a855f7" />
                                    <circle cx={p1_0.x - 1.5} cy={p1_0.y - 2.5} r="1.2" fill="#c084fc" />
                                    <circle cx={p1_0.x + 1.5} cy={p1_0.y - 2.5} r="1.2" fill="#c084fc" />
                                    <circle cx={p1_0.x - 2.2} cy={p1_0.y - 1.5} r="0.9" fill="#e9d5ff" />
                                    <circle cx={p1_0.x + 2.2} cy={p1_0.y - 1.5} r="0.9" fill="#e9d5ff" />
                                    
                                    {/* Tier 2 - mid flower whorl */}
                                    <circle cx={p1_0.x} cy={p1_0.y - 7} r="1.2" fill="#a855f7" />
                                    <circle cx={p1_0.x - 1.2} cy={p1_0.y - 6.5} r="1.0" fill="#c084fc" />
                                    <circle cx={p1_0.x + 1.2} cy={p1_0.y - 6.5} r="1.0" fill="#c084fc" />

                                    {/* Tier 3 - spike tip flowers */}
                                    <circle cx={p1_0.x} cy={p1_0.y - 11} r="0.9" fill="#d8b4fe" />
                                    <circle cx={p1_0.x - 0.8} cy={p1_0.y - 10.5} r="0.7" fill="#c084fc" />
                                    <circle cx={p1_0.x + 0.8} cy={p1_0.y - 10.5} r="0.7" fill="#c084fc" />
                                  </g>
                                </>
                              );
                            }

                            if (selectedPlantId === 'plantB') {
                              const p0_1 = getPt(0.1);
                              const p0_4 = getPt(0.4);
                              const p0_7 = getPt(0.7);
                              const p1_0 = getPt(1.0);
                              
                              const getNormalAngle = (t) => {
                                const p1 = getPt(t);
                                const p2 = getPt(t + 0.05);
                                const dx = p2.x - p1.x;
                                const dy = p2.y - p1.y;
                                return Math.atan2(dy, dx) - Math.PI / 2;
                              };

                              const a0_4 = getNormalAngle(0.4);
                              const a0_7 = getNormalAngle(0.7);

                              return (
                                <>
                                  {/* Woody, textured brown stem layers */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#451a03" strokeWidth="4.2" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#78350f" strokeWidth="3.0" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#d97706" strokeWidth="0.8" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  {/* Bark textures */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#451a03" strokeWidth="0.8" strokeDasharray="8,6"
                                    style={{ transition: 'd 0.1s ease' }}
                                    opacity="0.5"
                                  />

                                  {/* Left thorn at t = 0.4 */}
                                  <g transform={`translate(${p0_4.x}, ${p0_4.y}) rotate(${a0_4 * 180 / Math.PI})`}>
                                    <path d="M 0,-1.5 C -2,-1.5 -3.5,0.5 -4.5,2.5 C -3,2 -1.5,0.5 0,0.5 Z" fill="#991b1b" stroke="#451a03" strokeWidth="0.3" />
                                  </g>

                                  {/* Right thorn at t = 0.7 */}
                                  <g transform={`translate(${p0_7.x}, ${p0_7.y}) rotate(${(a0_7 * 180 / Math.PI) + 180})`}>
                                    <path d="M 0,-1.5 C -2,-1.5 -3.5,0.5 -4.5,2.5 C -3,2 -1.5,0.5 0,0.5 Z" fill="#991b1b" stroke="#451a03" strokeWidth="0.3" />
                                  </g>

                                  {/* Shrub branch close to base (t=0.1) */}
                                  <g>
                                    <path d={`M ${p0_1.x} ${p0_1.y} C ${p0_1.x - 8} ${p0_1.y - 4}, ${p0_1.x - 14} ${p0_1.y - 8}, ${p0_1.x - 16} ${p0_1.y - 13}`} fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d={`M ${p0_1.x - 8} ${p0_1.y - 5} C ${p0_1.x - 12} ${p0_1.y - 8}, ${p0_1.x - 16} ${p0_1.y - 6}, ${p0_1.x - 15} ${p0_1.y - 3} Z`} fill="#166534" stroke="#14532d" strokeWidth="0.4" />
                                    <path d={`M ${p0_1.x - 12} ${p0_1.y - 7} C ${p0_1.x - 16} ${p0_1.y - 11}, ${p0_1.x - 20} ${p0_1.y - 9}, ${p0_1.x - 18} ${p0_1.y - 6} Z`} fill="#166534" stroke="#14532d" strokeWidth="0.4" />
                                    <circle cx={p0_1.x - 16} cy={p0_1.y - 13} r="1.5" fill="#be123c" />
                                    <path d={`M ${p0_1.x - 17.5} ${p0_1.y - 13} Q ${p0_1.x - 16} ${p0_1.y - 11} ${p0_1.x - 14.5} ${p0_1.y - 13} Z`} fill="#15803d" />
                                  </g>

                                  {/* Rose Bud sepals and bloom petals at top (t = 1.0) */}
                                  <g>
                                    <path d={`M ${p1_0.x - 3} ${p1_0.y} C ${p1_0.x - 2} ${p1_0.y + 2.5}, ${p1_0.x + 2} ${p1_0.y + 2.5}, ${p1_0.x + 3} ${p1_0.y} C ${p1_0.x + 1} ${p1_0.y + 1}, ${p1_0.x - 1} ${p1_0.y + 1}, ${p1_0.x - 3} ${p1_0.y} Z`} fill="#15803d" stroke="#14532d" strokeWidth="0.4" />
                                    <path d={`M ${p1_0.x - 2.5} ${p1_0.y} Q ${p1_0.x - 4} ${p1_0.y - 5} ${p1_0.x - 5} ${p1_0.y - 6} Q ${p1_0.x - 2.5} ${p1_0.y - 2} ${p1_0.x} ${p1_0.y}`} fill="#15803d" />
                                    <path d={`M ${p1_0.x + 2.5} ${p1_0.y} Q ${p1_0.x + 4} ${p1_0.y - 5} ${p1_0.x + 5} ${p1_0.y - 6} Q ${p1_0.x + 2.5} ${p1_0.y - 2} ${p1_0.x} ${p1_0.y}`} fill="#15803d" />
                                    
                                    <path d={`M ${p1_0.x - 3} ${p1_0.y} C ${p1_0.x - 5} ${p1_0.y - 6}, ${p1_0.x - 2} ${p1_0.y - 9}, ${p1_0.x} ${p1_0.y - 10} C ${p1_0.x + 2} ${p1_0.y - 9}, ${p1_0.x + 5} ${p1_0.y - 6}, ${p1_0.x + 3} ${p1_0.y} Z`} fill="#be123c" stroke="#881337" strokeWidth="0.5" />
                                    <path d={`M ${p1_0.x - 1.8} ${p1_0.y} C ${p1_0.x - 3} ${p1_0.y - 5}, ${p1_0.x - 1.5} ${p1_0.y - 8}, ${p1_0.x} ${p1_0.y - 8.5} C ${p1_0.x + 1.5} ${p1_0.y - 8}, ${p1_0.x + 3} ${p1_0.y - 5}, ${p1_0.x + 1.8} ${p1_0.y} Z`} fill="#e11d48" />
                                    <path d={`M ${p1_0.x - 1} ${p1_0.y} C ${p1_0.x - 1.5} ${p1_0.y - 4}, ${p1_0.x} ${p1_0.y - 7}, ${p1_0.x + 1} ${p1_0.y - 6} Z`} fill="#fda4af" opacity="0.8" />
                                  </g>
                                </>
                              );
                            }

                            if (selectedPlantId === 'plantC') {
                              const p1_0 = getPt(1.0);
                              return (
                                <>
                                  {/* Heavy, rough bark neem tree trunk layers */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#270f02" strokeWidth="7.0" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#451a03" strokeWidth="5.0" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round"
                                    style={{ transition: 'd 0.1s ease' }}
                                  />
                                  {/* Bark crack fissures */}
                                  <path
                                    d={`M50 71 Q${qX} ${qY} ${endX} ${endY}`}
                                    fill="none" stroke="#1c0a00" strokeWidth="0.8" strokeDasharray="14,10"
                                    style={{ transition: 'd 0.1s ease' }}
                                    opacity="0.85"
                                  />
                                  <path
                                    d={`M49 71 Q${qX - 1} ${qY} ${endX - 1} ${endY}`}
                                    fill="none" stroke="#270f02" strokeWidth="0.6" strokeDasharray="6,24"
                                    style={{ transition: 'd 0.1s ease' }}
                                    opacity="0.7"
                                  />

                                  {/* Detailed Pinnate compound leaves on crown */}
                                  <g transform={`translate(${p1_0.x}, ${p1_0.y})`}>
                                    <circle cx="0" cy="-6" r="8" fill="#14532d" opacity="0.65" />
                                    <circle cx="-5" cy="-4" r="6" fill="#166534" opacity="0.6" />
                                    <circle cx="5" cy="-4" r="6" fill="#166534" opacity="0.6" />

                                    {/* Pinnate Leaf 1: Left */}
                                    <g transform="rotate(-45)">
                                      <path d="M 0,0 C -2,-4 -4,-9 -5,-13" fill="none" stroke="#166534" strokeWidth="0.6" />
                                      <path d="M -1,-3 C -3,-4 -5,-4 -6,-3 C -5,-2 -2,-2 -1,-3 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-3 C 2,-4 4,-4 5,-3 C 4,-2 1,-2 0,-3 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M -2,-7 C -4,-8 -7,-8 -8,-7 C -7,-5 -4,-5 -2,-7 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-7 C 2,-8 5,-8 6,-7 C 5,-5 2,-5 0,-7 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M -3,-10 C -5,-12 -8,-12 -9,-11 C -8,-9 -5,-9 -3,-10 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-10 C 2,-12 5,-12 6,-11 C 5,-9 2,-9 0,-10 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M -5,-13 C -5.5,-16 -5,-18 -4.5,-19 C -4,-18 -3.5,-16 -5,-13 Z" fill="#4ade80" />
                                    </g>

                                    {/* Pinnate Leaf 2: Right */}
                                    <g transform="rotate(45)">
                                      <path d="M 0,0 C 2,-4 4,-9 5,-13" fill="none" stroke="#166534" strokeWidth="0.6" />
                                      <path d="M 1,-3 C 3,-4 5,-4 6,-3 C 5,-2 2,-2 1,-3 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-3 C -2,-4 -4,-4 -5,-3 C -4,-2 -1,-2 0,-3 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 2,-7 C 4,-8 7,-8 8,-7 C 7,-5 4,-5 2,-7 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-7 C -2,-8 -5,-8 -6,-7 C -5,-5 -2,-5 0,-7 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 3,-10 C 5,-12 8,-12 9,-11 C 8,-9 5,-9 3,-10 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-10 C -2,-12 -5,-12 -6,-11 C -5,-9 -2,-9 0,-10 Z" fill="#22c55e" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 5,-13 C 5.5,-16 5,-18 4.5,-19 C 4,-18 3.5,-16 5,-13 Z" fill="#4ade80" />
                                    </g>

                                    {/* Pinnate Leaf 3: Center */}
                                    <g transform="rotate(0)">
                                      <path d="M 0,0 C 0,-5 0,-11 0,-16" fill="none" stroke="#166534" strokeWidth="0.6" />
                                      <path d="M -1,-4 C -3,-5 -6,-5 -7,-4 C -6,-3 -3,-3 -1,-4 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 1,-4 C 3,-5 6,-5 7,-4 C 6,-3 3,-3 1,-4 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M -1,-8 C -3.5,-9.5 -7,-9.5 -8,-8 C -7,-6.5 -3.5,-6.5 -1,-8 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 1,-8 C 3.5,-9.5 7,-9.5 8,-8 C 7,-6.5 3.5,-6.5 1,-8 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M -1,-12 C -3,-14 -6,-14 -7,-13 C -6,-11.5 -3,-11.5 -1,-12 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 1,-12 C 3,-14 6,-14 7,-13 C 6,-11.5 3,-11.5 1,-12 Z" fill="#15803d" stroke="#14532d" strokeWidth="0.2" />
                                      <path d="M 0,-16 C 0,-19 0,-21 0,-22 Z" fill="#4ade80" />
                                    </g>
                                  </g>
                                </>
                              );
                            }
                            return null;
                          })()}

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
                   );
                 })()}

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
