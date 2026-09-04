import React, { useState, useRef, useEffect } from 'react';
import { Award, RefreshCw, Scan, FlaskConical } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';
import tulsi24Img from '../../../../assets/tulsi_2.4.png';
import tulsiFlexImg from '../../../../assets/tulsi_flex.png';
import rose24Img from '../../../../assets/rose_2.4.png';
import roseFlexImg from '../../../../assets/rose_flex.png';
import neem24Img from '../../../../assets/neem_2.4.png';
import neemFlexImg from '../../../../assets/neem_flex.png';

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
  plantA: tulsi24Img,
  plantB: rose24Img,
  plantC: neem24Img,
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
  const textColor = '#0f172a';
  const sidebarBg = 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)';
  const borderColor = 'rgba(167, 243, 208, 0.95)';
  const cardBorder = 'rgba(167, 243, 208, 0.95)';
  const fontColorMuted = '#334155';
  const fontColorFaint = '#64748b';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '265px 1fr',
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
      <aside style={{ 
        background: sidebarBg, 
        backdropFilter: 'blur(16px)',
        borderRight: `1.5px solid ${borderColor}`, 
        padding: '1.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.85rem', 
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FlaskConical size={19} color="#064e3b" />
          <span style={{ fontSize: '14.5px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Case Catalog</span>
        </div>

        {/* Plant case cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
                    ? 'linear-gradient(135deg, #0284c7, #1d4ed8)' 
                    : '#ffffff',
                  border: isSelected 
                    ? '2px solid #0284c7' 
                    : '1.5px solid rgba(167, 243, 208, 0.95)',
                  padding: '0.9rem 0.95rem',
                  borderRadius: '12px',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.35)' : '0 2px 6px rgba(6, 78, 59, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <span style={{ fontSize: '1.45rem' }}>{plant.emoji}</span>
                  <span style={{ fontSize: '14px', fontWeight: '800' }}>{plant.displayName}</span>
                </div>
                {isVerified
                  ? <span style={{ color: isSelected ? '#ffffff' : '#047857', background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '800' }}>✓ ID'D</span>
                  : isFailed
                  ? <span style={{ color: isSelected ? '#ffffff' : '#dc2626', background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(239, 68, 68, 0.15)', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '800' }}>✗ RETRY</span>
                  : <span style={{ color: isSelected ? '#ffffff' : '#0284c7', background: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(2, 132, 199, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '800' }}>OPEN</span>}
              </button>
            );
          })}
        </div>

        {/* Mission card */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)', 
          border: '1.5px solid #fde047', 
          borderLeft: '4px solid #eab308',
          borderRadius: '12px', 
          padding: '1rem 1.1rem', 
          boxShadow: '0 2px 8px rgba(234, 179, 8, 0.15)'
        }}>
          <strong style={{ color: '#854d0e', fontSize: '13px', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem', fontWeight: '800', letterSpacing: '0.04em' }}>Mission Brief</strong>
          <span style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#1e293b', fontWeight: '600', display: 'block' }}>
            Use the Scanner, Flex Tester, and Clue Sheet tools to identify all 3 mystery plants and unlock your Detective Badge.
          </span>
        </div>

        <button onClick={handleReset} style={{ 
          background: '#ffffff', 
          border: '1.5px solid rgba(167, 243, 208, 0.95)', 
          color: '#0f172a', 
          padding: '0.7rem 0.9rem', 
          borderRadius: '10px', 
          fontSize: '13px', 
          fontWeight: '700',
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '0.45rem',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.2s'
        }}>
          <RefreshCw size={14} color="#064e3b" /> Clear All Files
        </button>
      </aside>

      {/* Main workbench */}
      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
        backdropFilter: 'blur(16px)'
      }}>
        {/* Tab bar */}
        <div style={{ 
          display: 'flex', 
          gap: 0, 
          background: 'rgba(240, 250, 244, 0.98)', 
          borderBottom: `1.5px solid ${borderColor}`,
          backdropFilter: 'blur(10px)'
        }}>
          {[
            { id: 'scanner', label: '🔬 Scanner', tip: 'Hover to inspect' },
            { id: 'flex', label: '🪵 Flex Tester', tip: 'Drag to bend stem' },
            { id: 'sheet', label: '🧬 Clue Sheet', tip: 'Drag tags to slots' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? '#ffffff' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #0284c7' : '3px solid transparent',
                  color: isActive ? '#0284c7' : '#064e3b',
                  padding: '0.9rem 1.35rem',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                {tab.label}
                <span style={{ fontSize: '11px', color: isActive ? '#0369a1' : '#475569', fontWeight: isActive ? '700' : '600' }}>{tab.tip}</span>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', gap: 0, overflow: 'hidden' }}>

          {/* Left panel — specimen / tool area */}
          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }}>

            {/* ---- SCANNER TAB ---- */}
            {activeTab === 'scanner' && (
              <>
                <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scan size={15} color="#064e3b" /> Move your cursor over the plant to activate the magnifier lens
                </div>
                <div
                  ref={specimenRef}
                  onMouseMove={handleSpecimenMouseMove}
                  onMouseLeave={handleSpecimenLeave}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(167, 243, 208, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '360px',
                    minHeight: '360px',
                    cursor: 'crosshair',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(6, 78, 59, 0.08)'
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
                      border: '3px solid #0284c7',
                      boxShadow: '0 0 0 1px rgba(2, 132, 199, 0.3), 0 0 20px rgba(2, 132, 199, 0.25)',
                      background: 'rgba(2, 132, 199, 0.1)',
                      backdropFilter: 'brightness(1.2)',
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
                      borderBottom: i < 2 ? '1px dashed #10b981' : 'none',
                      background: activeZone === zone ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                      transition: 'background 0.15s',
                      pointerEvents: 'none'
                    }} />
                  ))}
                </div>

                {/* Zone detail card */}
                {activeZone && (
                  <div style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    border: '1.5px solid #0284c7',
                    borderLeft: '4px solid #0284c7',
                    borderRadius: '12px',
                    padding: '1.1rem 1.25rem',
                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.12)',
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    <strong style={{ color: '#0369a1', display: 'block', marginBottom: '0.4rem', fontSize: '14.5px', fontWeight: '800' }}>
                      🔬 {activePlant.magnifierZones[activeZone].label}
                    </strong>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.65', color: '#0f172a', fontWeight: '600' }}>
                      {activePlant.magnifierZones[activeZone].detail}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ---- FLEX TESTER TAB ---- */}
            {activeTab === 'flex' && (
              <>
                <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(167, 243, 208, 0.95)',
                      minHeight: '220px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                      width: '100%',
                      boxShadow: '0 4px 14px rgba(6, 78, 59, 0.08)'
                    }}>
                      {/* Laboratory background grid lines */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem 1.5rem', pointerEvents: 'none', opacity: 0.2 }}>
                        <div style={{ borderBottom: '1px dashed #0284c7', width: '100%', fontSize: '9px', color: '#0369a1' }}>30° Flex Limit</div>
                        <div style={{ borderBottom: '1px dashed #0284c7', width: '100%', fontSize: '9px', color: '#0369a1' }}>60° Flex Limit</div>
                        <div style={{ borderBottom: '1px dashed #0284c7', width: '100%', fontSize: '9px', color: '#0369a1' }}>Base Clamp Alignment</div>
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

                        {/* Specimen Mounting Base / Pot Back */}
                        <polygon points="35,84 65,84 60,72 40,72" fill="url(#clay-pot-grad)" stroke="#451a03" strokeWidth="1" />
                        <ellipse cx="50" cy="71" rx="16" ry="2.2" fill="#271b12" stroke="#1d110a" strokeWidth="0.5" />

                        {/* Bending stem path */}
                        {(() => {
                          const getPt = (t) => {
                            const x = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * qX + t * t * endX;
                            const y = (1 - t) * (1 - t) * 71 + 2 * (1 - t) * t * qY + t * t * endY;
                            return { x, y };
                          };

                          if (selectedPlantId === 'plantA') {
                            return (
                              <g
                                style={{
                                  transformOrigin: '50px 71.5px',
                                  transform: `rotate(${Math.min(flexLevel * 0.38, 38)}deg) skewX(${-Math.min(flexLevel * 0.12, 12)}deg)`,
                                  transition: isDraggingFlex ? 'none' : 'transform 0.15s ease-out'
                                }}
                              >
                                <image
                                  href={tulsiFlexImg}
                                  x="30.5"
                                  y="4"
                                  width="39"
                                  height="68"
                                  preserveAspectRatio="xMidYMid meet"
                                  style={{
                                    filter: 'drop-shadow(0 2px 5px rgba(0, 30, 15, 0.25))'
                                  }}
                                />
                              </g>
                            );
                          }

                          if (selectedPlantId === 'plantB') {
                            return (
                              <g
                                style={{
                                  transformOrigin: '50px 71.5px',
                                  transform: `rotate(${Math.min(flexLevel * 0.18, 18)}deg) skewX(${-Math.min(flexLevel * 0.06, 6)}deg)`,
                                  transition: isDraggingFlex ? 'none' : 'transform 0.15s ease-out'
                                }}
                              >
                                <image
                                  href={roseFlexImg}
                                  x="12.5"
                                  y="3.5"
                                  width="85"
                                  height="68"
                                  preserveAspectRatio="xMidYMid meet"
                                  style={{
                                    filter: 'drop-shadow(0 2px 6px rgba(0, 30, 15, 0.22))'
                                  }}
                                />
                              </g>
                            );
                          }

                          if (selectedPlantId === 'plantC') {
                            return (
                              <g
                                style={{
                                  transformOrigin: '50px 71.5px',
                                  transform: `rotate(${Math.min(flexLevel * 0.03, 3)}deg) skewX(${-Math.min(flexLevel * 0.01, 1)}deg)`,
                                  transition: isDraggingFlex ? 'none' : 'transform 0.15s ease-out'
                                }}
                              >
                                <image
                                  href={neemFlexImg}
                                  x="-12.5"
                                  y="4"
                                  width="125"
                                  height="83.4"
                                  preserveAspectRatio="xMidYMid meet"
                                  style={{
                                    filter: 'drop-shadow(0 2px 6px rgba(0, 30, 15, 0.22))'
                                  }}
                                />
                              </g>
                            );
                          }
                          return null;
                        })()}

                        {/* Front Mounting Clamp / Pot Rim holding the specimen stem firmly */}
                        <rect x="33" y="70" width="34" height="2.5" fill="url(#clay-rim-grad)" stroke="#451a03" strokeWidth="0.8" rx="0.5" />
                        <rect x="44" y="69.5" width="12" height="3.5" fill="#1e293b" stroke="#0284c7" strokeWidth="0.6" rx="0.8" />
                        <circle cx="46.5" cy="71.2" r="0.7" fill="#94a3b8" />
                        <circle cx="53.5" cy="71.2" r="0.7" fill="#94a3b8" />

                        {/* Force arrow */}
                        {flexLevel > 5 && (
                          <g opacity={Math.min(flexLevel / 50, 1)}>
                            <line x1={50 + Math.min(flexLevel * 0.35, 35)} y1="30" x2={50 + Math.min(flexLevel * 0.4, 40)} y2="30" stroke="#f59e0b" strokeWidth="1.5" />
                            <polygon points={`${50 + Math.min(flexLevel * 0.42, 42)},30 ${50 + Math.min(flexLevel * 0.37, 37)},27 ${50 + Math.min(flexLevel * 0.37, 37)},33`} fill="#f59e0b" />
                          </g>
                        )}
                      </svg>

                      {flexLocked && (
                        <div style={{ position: 'absolute', top: 12, right: 12, background: currentFlex.color, borderRadius: '20px', padding: '5px 14px', fontSize: '13px', fontWeight: 'bold', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                          {currentFlex.label}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Drag lever */}
                <div style={{ 
                  padding: '1.1rem', 
                  background: '#ffffff', 
                  borderRadius: '12px', 
                  border: '1.5px solid rgba(167, 243, 208, 0.95)',
                  boxShadow: '0 2px 8px rgba(6, 78, 59, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#0f172a', fontWeight: '800' }}>
                    <span>No Force</span>
                    <span style={{ color: flexLocked ? currentFlex.color : '#0284c7', fontSize: '13.5px' }}>
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
                      background: 'rgba(167, 243, 208, 0.45)',
                      borderRadius: '10px',
                      border: '1.5px solid rgba(167, 243, 208, 0.95)',
                      position: 'relative',
                      cursor: flexLocked ? 'default' : 'grab',
                      userSelect: 'none'
                    }}
                  >
                    {/* Fill */}
                    <div style={{ height: '100%', width: `${flexLevel}%`, background: `linear-gradient(90deg, #10b981, ${gaugeColor})`, borderRadius: '10px', transition: 'background 0.3s' }} />
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
                    <div style={{ marginTop: '0.8rem', fontSize: '14px', color: '#0f172a', lineHeight: '1.65', fontWeight: '600' }}>
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
                <div style={{ fontSize: '13.5px', color: '#1e293b', fontWeight: '600' }}>
                  🏷️ Drag clue tags from the right panel and drop them into the correct slots below:
                </div>

                {/* Slots */}
                {['stem', 'leaf', 'class'].map(field => {
                  const slotVal = answers[selectedPlantId][field];
                  const slotLabel = slotVal !== null ? CLUE_TAGS[field].find(t => t.idx === slotVal)?.label : null;
                  return (
                    <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: '#064e3b', textTransform: 'capitalize' }}>
                        {field === 'class' ? '🔬 Classification' : field === 'stem' ? '🌿 Stem Type' : '🍃 Leaf Structure'}
                      </span>
                      <div
                        onDrop={(e) => handleSlotDrop(e, field)}
                        onDragOver={handleSlotDragOver}
                        style={{
                          minHeight: '50px',
                          border: `2px dashed ${slotLabel ? '#0284c7' : 'rgba(16, 185, 129, 0.6)'}`,
                          borderRadius: '10px',
                          background: slotLabel ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' : '#ffffff',
                          padding: '0.55rem 0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          fontSize: '13.5px',
                          fontWeight: '800',
                          color: slotLabel ? '#0369a1' : '#64748b',
                          boxShadow: '0 2px 6px rgba(6, 78, 59, 0.05)'
                        }}
                      >
                        <span>{slotLabel || `Drop a "${field}" tag here…`}</span>
                        {slotLabel && (
                          <button onClick={() => handleSlotClear(field)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', padding: '0 0 0 8px' }}>×</button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Verification result */}
                {results[selectedPlantId] !== null && (
                  <div style={{
                    padding: '0.95rem 1.2rem',
                    borderRadius: '12px',
                    background: results[selectedPlantId] ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: `2px solid ${results[selectedPlantId] ? '#10b981' : '#ef4444'}`,
                    fontSize: '14px',
                    fontWeight: '800',
                    color: results[selectedPlantId] ? '#064e3b' : '#991b1b',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
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
                      background: allSlotsFilledForPlant() ? 'linear-gradient(135deg, #0284c7, #1d4ed8)' : 'rgba(203, 213, 225, 0.8)',
                      border: 'none',
                      color: allSlotsFilledForPlant() ? '#ffffff' : '#475569',
                      padding: '0.8rem 1.6rem',
                      borderRadius: '24px',
                      fontSize: '14px',
                      fontWeight: '800',
                      cursor: allSlotsFilledForPlant() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: allSlotsFilledForPlant() ? '0 4px 14px rgba(2, 132, 199, 0.45)' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Scan size={16} />
                    {scanning ? 'Scanning…' : 'Run Forensic Scan'}
                  </button>
                </div>

                {/* Scan progress bar */}
                {scanning && (
                  <div style={{ width: '100%', height: '5px', background: 'rgba(167, 243, 208, 0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${scanProgress}%`,
                      background: 'linear-gradient(90deg, #0284c7, #2563eb)',
                      transition: 'width 0.04s linear',
                      boxShadow: '0 0 8px rgba(2, 132, 199, 0.6)'
                    }} />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right panel — clue tag library + status */}
          <div style={{
            borderLeft: `1.5px solid ${borderColor}`,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.96) 100%)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.1rem',
            overflowY: 'auto'
          }}>
            {activeTab === 'sheet' ? (
              <>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🏷️ Clue Tag Library</span>
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>Drag a tag and drop it into the matching slot on the left.</span>
                {(['stem', 'leaf', 'class'] ).map(field => (
                  <div key={field}>
                    <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem', letterSpacing: '0.04em' }}>
                      {field === 'class' ? 'Classification' : field === 'stem' ? 'Stem Tags' : 'Leaf Tags'}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {CLUE_TAGS[field].map(tag => (
                        <div
                          key={tag.idx}
                          draggable
                          onDragStart={(e) => handleTagDragStart(e, field, tag.idx)}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid rgba(167, 243, 208, 0.95)',
                            borderRadius: '8px',
                            padding: '0.6rem 0.85rem',
                            fontSize: '13.5px',
                            fontWeight: '700',
                            color: '#0f172a',
                            cursor: 'grab',
                            userSelect: 'none',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(6, 78, 59, 0.06)'
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
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔖 Plant File</span>
                <div style={{ 
                  background: '#ffffff', 
                  border: '1.5px solid rgba(167, 243, 208, 0.95)', 
                  borderLeft: '4px solid #064e3b',
                  borderRadius: '12px', 
                  padding: '1.15rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.7rem',
                  boxShadow: '0 2px 8px rgba(6, 78, 59, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '2.1rem' }}>{activePlant.emoji}</span>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{activePlant.displayName}</div>
                      <div style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: '800', letterSpacing: '0.04em' }}>UNRESOLVED</div>
                    </div>
                  </div>
                  <div style={{ borderTop: '1.5px solid rgba(167, 243, 208, 0.7)', paddingTop: '0.7rem', fontSize: '13.5px', lineHeight: '1.6', color: '#1e293b', fontWeight: '600', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span>📍 Scan <b>top, middle, and base</b> zones of the specimen to gather microscopic clues.</span>
                    <span>🪵 Use the Flex Tester to gauge stem rigidity — this reveals herb/shrub/tree characteristics.</span>
                    <span>🧬 Fill all 3 clue slots in the Clue Sheet and run the Forensic Scan.</span>
                  </div>
                </div>

                {/* Case status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#064e3b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Case Progress</span>
                  {MYSTERY_PLANTS.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '800', color: results[p.id] === true ? '#047857' : results[p.id] === false ? '#dc2626' : '#0f172a' }}>
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
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)', marginBottom: '1.25rem' }}>
            <Award size={52} color="#047857" />
          </div>
          <h2 style={{ color: '#facc15', fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>All Cases Solved!</h2>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff', margin: '0 0 1rem 0' }}>Master Plant Detective Badge Earned</h3>
          <p style={{ fontSize: '13.5px', color: '#e2e8f0', maxWidth: '420px', lineHeight: '1.6', margin: '0 0 2rem 0' }}>
            Outstanding work! You've correctly identified all three specimens:<br />
            <strong style={{ color: '#38bdf8' }}>Alpha</strong> = Tulsi (Herb) · <strong style={{ color: '#38bdf8' }}>Beta</strong> = Wild Rose (Shrub) · <strong style={{ color: '#38bdf8' }}>Gamma</strong> = Neem (Tree)
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ padding: '0.6rem 1.5rem', fontSize: '13px', borderRadius: '24px', border: '1.5px solid rgba(255, 255, 255, 0.25)', color: '#f1f5f9', background: 'rgba(30, 41, 59, 0.9)', cursor: 'pointer', fontWeight: '600' }}>Investigate Again</button>
            <button onClick={onBackToDashboard} style={{ padding: '0.6rem 1.5rem', fontSize: '13px', background: 'linear-gradient(135deg, #0284c7, #1d4ed8)', border: '1.5px solid #60a5fa', color: '#fff', fontWeight: 'bold', borderRadius: '24px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)' }}>Proceed to Quiz →</button>
          </div>
        </div>
      )}
    </div>
  );
}
