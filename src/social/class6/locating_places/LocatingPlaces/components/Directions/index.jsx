import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Sunrise, Sunset, Navigation, CheckCircle2, ArrowLeft, ArrowUp, ArrowDown, Map, Lightbulb, MapPin } from 'lucide-react';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';

const DIRECTIONS = [
  { 
    id: 'N', label: 'North', type: 'Main Direction', angle: 0, 
    description: <>North is one of the four <b>cardinal directions</b>. On a compass it sits at the top. Most maps show a small arrow marked 'N' pointing towards North.</>, 
    note: 'Maps usually print a North arrow so you can orient every other direction from it.', 
    question: 'Where is North located on a standard map?',
    options: ['At the top', 'At the bottom', 'On the right', 'On the left'],
    correct: 'At the top',
    explanation: 'Standard maps are always aligned with North pointing to the top.',
    icon: <Navigation size={48} color="#ef4444" style={{ transform: 'rotate(0deg)' }}/> 
  },
  { 
    id: 'NE', label: 'North-East', type: 'Intermediate Direction', angle: 45, 
    description: <>North-East is an <b>intermediate direction</b> — it lies exactly halfway between North and East.</>, 
    note: 'Intermediate directions (NE, SE, SW, NW) give you finer bearings between the four main ones.', 
    question: 'Which direction lies halfway between North and East?',
    options: ['North-West', 'North-East', 'South-East', 'South-West'],
    correct: 'North-East',
    explanation: 'North-East (NE) lies between North and East.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(45deg)' }}/> 
  },
  { 
    id: 'E', label: 'East', type: 'Main Direction', angle: 90, 
    description: <>East is a <b>cardinal direction</b>, one quarter-turn clockwise from North. The <b>Sun rises in the East</b>.</>, 
    note: 'Facing the sunrise, North is on your left and South on your right.', 
    question: 'Where does the Sun rise every morning?',
    options: ['In the West', 'In the East', 'In the North', 'In the South'],
    correct: 'In the East',
    explanation: 'The Sun always rises in the East.',
    icon: <Sunrise size={48} color="#f59e0b" /> 
  },
  { 
    id: 'SE', label: 'South-East', type: 'Intermediate Direction', angle: 135, 
    description: <>South-East is an <b>intermediate direction</b>, halfway between South and East.</>, 
    note: "Between two cardinals — useful for describing a spot that isn't due S or due E.", 
    question: 'Which direction sits halfway between South and East?',
    options: ['South-West', 'North-East', 'South-East', 'North-West'],
    correct: 'South-East',
    explanation: 'South-East (SE) is between South and East.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(135deg)' }}/> 
  },
  { 
    id: 'S', label: 'South', type: 'Main Direction', angle: 180, 
    description: <>South is a <b>cardinal direction</b>, directly opposite North at the bottom of the compass.</>, 
    note: 'On most maps, down the page is roughly South.', 
    question: 'Which direction is directly opposite to North?',
    options: ['East', 'West', 'South', 'North-East'],
    correct: 'South',
    explanation: 'South is 180° directly opposite to North.',
    icon: <Navigation size={48} color="#3b82f6" style={{ transform: 'rotate(180deg)' }}/> 
  },
  { 
    id: 'SW', label: 'South-West', type: 'Intermediate Direction', angle: 225, 
    description: <>South-West is an <b>intermediate direction</b>, halfway between South and West.</>, 
    note: 'Halfway between two cardinals, like all intermediate points.', 
    question: 'Which direction lies between South and West?',
    options: ['South-West', 'North-West', 'South-East', 'North-East'],
    correct: 'South-West',
    explanation: 'South-West (SW) lies between South and West.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(225deg)' }}/> 
  },
  { 
    id: 'W', label: 'West', type: 'Main Direction', angle: 270, 
    description: <>West is a <b>cardinal direction</b>, opposite East. The <b>Sun sets in the West</b>.</>, 
    note: 'Facing the sunset, South is on your left and North on your right.', 
    question: 'Where does the Sun set in the evening?',
    options: ['In the East', 'In the West', 'In the North', 'In the South'],
    correct: 'In the West',
    explanation: 'The Sun sets in the West in the evening.',
    icon: <Sunset size={48} color="#f59e0b" /> 
  },
  { 
    id: 'NW', label: 'North-West', type: 'Intermediate Direction', angle: 315, 
    description: <>North-West is an <b>intermediate direction</b>, halfway between North and West.</>, 
    note: 'The last of the four intermediate directions.', 
    question: 'Which direction lies halfway between North and West?',
    options: ['North-East', 'South-West', 'North-West', 'South-East'],
    correct: 'North-West',
    explanation: 'North-West (NW) sits between North and West.',
    icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(315deg)' }}/> 
  }
];

const getOpposite = (id) => {
  switch (id) {
    case 'N': return 'South';
    case 'NE': return 'South-West';
    case 'E': return 'West';
    case 'SE': return 'North-West';
    case 'S': return 'North';
    case 'SW': return 'North-East';
    case 'W': return 'East';
    case 'NW': return 'South-East';
    default: return '';
  }
};

export default function Directions({ onComplete, onBack }) {
  const [activeDir, setActiveDir] = useState(null);
  const [viewedDirs, setViewedDirs] = useState(new Set());
  const [hoveredDir, setHoveredDir] = useState(null);
  const [pulseCompass, setPulseCompass] = useState(false);
  const [infoPage, setInfoPage] = useState(1);
  const [answers, setAnswers] = useState({});

  const isAllViewed = viewedDirs.size === 8;

  const handleDirClick = (id) => {
    setActiveDir(id);
    setViewedDirs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleAnswerQuestion = (dirId, opt) => {
    setAnswers(prev => ({ ...prev, [dirId]: opt }));
  };

  const getActiveInfo = () => DIRECTIONS.find(d => d.id === activeDir);

  // SVG path for a 45-degree pie slice (one eighth of a circle)
  const createPieSlice = () => {
    const r = 50;
    const startAngle = -22.5 * (Math.PI / 180);
    const endAngle = 22.5 * (Math.PI / 180);
    const x1 = 50 + r * Math.sin(startAngle);
    const y1 = 50 - r * Math.cos(startAngle);
    const x2 = 50 + r * Math.sin(endAngle);
    const y2 = 50 - r * Math.cos(endAngle);
    return `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: '#ffffff', overflow: 'hidden', borderRadius: '24px', border: '1px solid #d6e0ec', boxShadow: '0 8px 30px rgba(14,42,69,0.08)' }}>
      
      {/* Top Bar for Back Button */}
      {activeDir !== null && (
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #d6e0ec', background: '#ffffff' }}>
          <button 
            onClick={() => {
              setActiveDir(null);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '999px', color: '#0E3556', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <ArrowLeft size={16} /> Back to Overview
          </button>
        </div>
      )}

      {/* Two Column Layout (Reversed to match global layout) */}
      <div style={{ display: 'flex', flexDirection: 'row-reverse', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT: Interactive Compass Area */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', padding: '1.5rem', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Realistic Compass */}
          <motion.div 
            animate={pulseCompass ? { scale: [1, 1.05, 1], boxShadow: ['0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 100px rgba(56,189,248,0.8), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)'] } : {}}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', width: '380px', height: '380px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', padding: '16px' }}
          >
            
            {/* Inner Dark Dial */}
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #020617 80%)', boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), 0 2px 5px rgba(255,255,255,0.2)' }}>
              
              {/* Dial Markings */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {Array.from({length: 36}).map((_, i) => (
                  <line key={i} x1="50" y1="2" x2="50" y2={i % 9 === 0 ? "8" : "4"} stroke="rgba(255,255,255,0.2)" strokeWidth={i % 9 === 0 ? "1" : "0.5"} transform={`rotate(${i * 10} 50 50)`} />
                ))}
              </svg>

              {/* The Needle */}
              <motion.div 
                animate={{ rotate: getActiveInfo()?.angle || 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))', zIndex: 10 }}
              >
                {/* North Half */}
                <svg width="26" height="210" viewBox="0 0 30 240" style={{ position: 'absolute' }}>
                   <path d="M 15 12 L 30 120 L 15 120 Z" fill="#ef4444" />
                   <path d="M 15 12 L 0 120 L 15 120 Z" fill="#dc2626" />
                </svg>
                {/* South Half */}
                <svg width="26" height="210" viewBox="0 0 30 240" style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
                   <path d="M 15 12 L 30 120 L 15 120 Z" fill="#e2e8f0" />
                   <path d="M 15 12 L 0 120 L 15 120 Z" fill="#cbd5e1" />
                </svg>
                {/* Center Pin */}
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg, #fcd34d 0%, #b45309 100%)', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', zIndex: 15 }} />
              </motion.div>

              {/* Interactive Slices and Labels */}
              {DIRECTIONS.map((dir) => {
                const isActive = activeDir === dir.id;
                const isHovered = hoveredDir === dir.id;
                
                return (
                  <div key={dir.id} style={{ position: 'absolute', inset: 0 }}>
                    {/* Invisible Clickable Pie Slice */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, transform: `rotate(${dir.angle}deg)`, zIndex: 20, pointerEvents: 'none' }}>
                      <path 
                        d={createPieSlice()} 
                        fill={isActive ? 'rgba(56, 189, 248, 0.15)' : (isHovered ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.001)')}
                        onMouseEnter={() => setHoveredDir(dir.id)}
                        onMouseLeave={() => setHoveredDir(null)}
                        onClick={() => handleDirClick(dir.id)}
                        style={{ transition: 'fill 0.2s', cursor: 'pointer', pointerEvents: 'all' }}
                      />
                    </svg>
                    
                    {/* Label */}
                    <div style={{
                      position: 'absolute', 
                      inset: 0, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      paddingTop: '18px',
                      transform: `rotate(${dir.angle}deg)`,
                      pointerEvents: 'none',
                      zIndex: 15
                    }}>
                      <div style={{
                        transform: `rotate(-${dir.angle}deg)`,
                        color: isActive ? '#38bdf8' : (isHovered ? '#fff' : '#94a3b8'),
                        fontWeight: 'bold',
                        fontSize: dir.id.length === 1 ? '1.6rem' : '1.2rem',
                        textShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none',
                        transition: 'all 0.2s',
                        fontFamily: 'serif'
                      }}>
                        {dir.id}
                      </div>
                      {/* Active Indicator Dot */}
                      {isActive && (
                         <div style={{ marginTop: '4px', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Glass Reflection Overlay */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'linear-gradient(160deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%)', pointerEvents: 'none', zIndex: 25 }} />
            </div>
          </motion.div>

          {/* Ready to Explore Button */}
          {!activeDir && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', zIndex: 30 }}>
              <button 
                onClick={() => {
                  setPulseCompass(true);
                  setTimeout(() => setPulseCompass(false), 500);
                }}
                style={{ 
                  background: '#F5A623', color: '#fff', border: 'none', borderRadius: '99px', padding: '10px 24px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(245,166,35,0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                Click Compass to Explore <ArrowRight size={16} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </div>

        {/* RIGHT: Information Panel (Visually on Left) */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', minHeight: 0, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRight: '1px solid #d6e0ec', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem 3.8rem 1.25rem', overflow: 'hidden', justifyContent: 'space-between' }}>
            <AnimatePresence mode="wait">
              {!activeDir ? (
                <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  
                  {infoPage === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'space-between' }}>
                      {/* Section 1 - Introduction */}
                      <div style={{ flexShrink: 0 }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#0E3556', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Compass size={28} color="#F5A623" /> Finding Directions
                        </h2>
                        <p style={{ color: '#20303f', fontSize: '0.95rem', lineHeight: 1.4, margin: 0 }}>
                          Directions help us know where places are.<br/>
                          Every map uses directions to help us travel from one place to another.
                        </p>
                      </div>

                      {/* Section 2 - The Four Main Directions */}
                      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '0.85rem', border: '1px solid #d6e0ec', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                           <h3 style={{ color: '#0E3556', fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>The Four Main Directions</h3>
                           <span style={{ fontSize: '11px', background: '#fffbeb', color: '#d97706', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>Cardinal Directions</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                          <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 800, fontSize: '12px' }}><ArrowUp size={14} strokeWidth={3} /> NORTH</div>
                            <div style={{ fontSize: '11px', color: '#47586b', marginTop: '2px' }}>Top</div>
                          </div>
                          <div style={{ background: '#fffbeb', padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800, fontSize: '12px' }}><ArrowRight size={14} strokeWidth={3} /> EAST</div>
                            <div style={{ fontSize: '11px', color: '#47586b', marginTop: '2px' }}>Right</div>
                          </div>
                          <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontWeight: 800, fontSize: '12px' }}><ArrowDown size={14} strokeWidth={3} /> SOUTH</div>
                            <div style={{ fontSize: '11px', color: '#47586b', marginTop: '2px' }}>Bottom</div>
                          </div>
                          <div style={{ background: '#faf5ff', padding: '8px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7', fontWeight: 800, fontSize: '12px' }}><ArrowLeft size={14} strokeWidth={3} /> WEST</div>
                            <div style={{ fontSize: '11px', color: '#47586b', marginTop: '2px' }}>Left</div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3 - Intermediate Directions */}
                      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '0.85rem', border: '1px solid #d6e0ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                         <div>
                            <h3 style={{ color: '#0E3556', fontSize: '0.95rem', margin: '0 0 3px 0', fontWeight: 700 }}>Intermediate Directions</h3>
                            <p style={{ color: '#20303f', margin: 0, fontSize: '12px' }}>These lie between the main directions.</p>
                         </div>
                         <div style={{ display: 'flex', gap: '6px' }}>
                           {['NE', 'SE', 'SW', 'NW'].map(d => (
                             <div key={d} style={{ background: '#ffffff', border: '1px solid #d6e0ec', borderRadius: '8px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', color: '#F5A623' }}>{d}</div>
                           ))}
                         </div>
                      </div>
                    </div>
                  )}

                  {infoPage === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'space-between' }}>
                      {/* Fun Fact */}
                      <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '0.85rem', border: '1px solid #fae8ff', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <Lightbulb size={22} color="#c026d3" style={{ flexShrink: 0 }} />
                        <p style={{ color: '#86198f', margin: 0, fontSize: '12px', lineHeight: 1.45, fontWeight: 500 }}>
                          <strong>Fun Fact:</strong> A real compass needle is magnetic and will always point towards the Earth's Magnetic North Pole!
                        </p>
                      </div>

                      {/* Remember */}
                      <div style={{ background: '#fffbeb', padding: '0.85rem', borderRadius: '12px', border: '1px solid #fde68a', display: 'flex', flexDirection: 'column', gap: '0.3rem', flexShrink: 0 }}>
                        <h3 style={{ margin: 0, color: '#b45309', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}><Lightbulb size={14} color="#d97706" /> Remember</h3>
                        <p style={{ color: '#92400e', margin: 0, fontSize: '12px', lineHeight: 1.4 }}>
                          Most maps do not show all eight directions. Instead, they usually show only a North arrow. Once North is known, the other directions can easily be found.
                        </p>
                      </div>

                      {/* Directions Explored Progress */}
                      {viewedDirs.size > 0 && (
                        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '0.85rem', border: '1px solid #d6e0ec', flexShrink: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#47586b', marginBottom: '0.4rem' }}>Directions Explored ({viewedDirs.size}/8)</div>
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                            {DIRECTIONS.map(d => (
                              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: viewedDirs.has(d.id) ? '#10b981' : '#ffffff', color: viewedDirs.has(d.id) ? 'white' : '#5c6b7a', fontSize: '11px', fontWeight: 'bold', border: viewedDirs.has(d.id) ? 'none' : '1px solid #d6e0ec' }}>
                                {d.id} {viewedDirs.has(d.id) && <CheckCircle2 size={11} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isAllViewed && (
                        <p style={{ margin: 0, fontSize: '12px', color: '#10b981', fontWeight: 600, textAlign: 'center' }}>
                          All directions explored! Use the button below to continue.
                        </p>
                      )}
                    </div>
                  )}

                </motion.div>
              ) : (
                <motion.div key={activeDir} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between', minHeight: 0, overflowY: 'auto' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.2rem', flexShrink: 0 }}>
                    <div style={{ display: 'inline-flex', padding: '0.35rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #d6e0ec' }}>
                      {getActiveInfo()?.icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0E3556', lineHeight: 1.1 }}>
                        {getActiveInfo()?.label}
                      </h2>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                        {getActiveInfo()?.type} • Bearing {getActiveInfo()?.angle}°
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid #d6e0ec', flexShrink: 0 }}>
                    <p style={{ color: '#20303f', fontSize: '13px', lineHeight: 1.4, margin: 0 }}>
                      {getActiveInfo()?.description}
                    </p>
                  </div>

                  {/* Quick Check Interactive Question */}
                  <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid #d6e0ec', flexShrink: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0E3556', marginBottom: '6px' }}>
                      ❓ Quick Check: {getActiveInfo()?.question}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {getActiveInfo()?.options.map(opt => {
                        const userAns = answers[activeDir];
                        const isCorrect = opt === getActiveInfo()?.correct;
                        const isSelected = userAns === opt;
                        let bg = '#f8fafc', borderColor = '#cbd5e1', textColor = '#334155';
                        
                        if (userAns) {
                          if (isCorrect) { bg = '#ecfdf5'; borderColor = '#10b981'; textColor = '#047857'; }
                          else if (isSelected) { bg = '#fef2f2'; borderColor = '#ef4444'; textColor = '#b91c1c'; }
                        }

                        return (
                          <button
                            key={opt}
                            onClick={() => handleAnswerQuestion(activeDir, opt)}
                            style={{
                              background: bg, border: `1px solid ${borderColor}`, color: textColor,
                              padding: '6px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                              cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {answers[activeDir] && (
                      <div style={{ marginTop: '6px', fontSize: '11.5px', fontWeight: 600, color: answers[activeDir] === getActiveInfo()?.correct ? '#10b981' : '#ef4444' }}>
                        {answers[activeDir] === getActiveInfo()?.correct ? `✓ Correct! ${getActiveInfo()?.explanation}` : `Not quite! ${getActiveInfo()?.explanation}`}
                      </div>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', padding: '0.65rem 0.9rem', borderRadius: '12px', border: '1px solid #d6e0ec', display: 'flex', gap: '0.7rem', alignItems: 'center', flexShrink: 0 }}>
                     <div style={{ width: '34px', height: '34px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                       <Map size={18} color="#64748b" />
                     </div>
                     <p style={{ color: '#47586b', fontSize: '11.5px', margin: 0, lineHeight: 1.3 }}>
                       {getActiveInfo()?.note}
                     </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Sub-page Navigation (only for welcome view) */}
            {!activeDir && (
              <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #d8c8a4', paddingTop: '6px', marginTop: '8px' }}>
                <button
                  onClick={() => setInfoPage(1)}
                  disabled={infoPage === 1}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '12px',
                    background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '4px 12px', cursor: infoPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: infoPage === 1 ? 0.35 : 1
                  }}
                >
                  ◀ Back
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#8a6a3a' }}>
                  <span>Page {infoPage} of 2</span>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: infoPage === 1 ? '#0E3556' : '#d8c8a4' }} />
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: infoPage === 2 ? '#0E3556' : '#d8c8a4' }} />
                </div>
                <button
                  onClick={() => setInfoPage(2)}
                  disabled={infoPage === 2}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: '12px',
                    background: '#0E3556', color: '#fff', border: 'none', borderRadius: '999px',
                    padding: '4px 12px', cursor: infoPage === 2 ? 'not-allowed' : 'pointer',
                    opacity: infoPage === 2 ? 0.35 : 1
                  }}
                >
                  Next ▶
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={isAllViewed ? 'Explore Directions using India Map' : 'Next'}
        onNext={isAllViewed ? onComplete : onComplete}
        nextVariant="blue"
      />
    </div>
  );
}
