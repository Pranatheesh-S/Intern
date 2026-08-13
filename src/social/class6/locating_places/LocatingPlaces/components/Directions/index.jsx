import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Sunrise, Sunset, Navigation, CheckCircle2, ArrowLeft, ArrowUp, ArrowDown, Map, Lightbulb, MapPin } from 'lucide-react';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';

const DIRECTIONS = [
  { id: 'N', label: 'North', type: 'Main Direction', angle: 0, description: <>North is one of the four <b>cardinal directions</b>. On a compass it sits at the top. Most maps show a small arrow marked 'N' pointing towards North.</>, note: 'Maps usually print a North arrow so you can orient every other direction from it.', icon: <Navigation size={48} color="#ef4444" style={{ transform: 'rotate(0deg)' }}/> },
  { id: 'NE', label: 'North-East', type: 'Intermediate Direction', angle: 45, description: <>North-East is an <b>intermediate direction</b> — it lies exactly halfway between North and East.</>, note: 'Intermediate directions (NE, SE, SW, NW) give you finer bearings between the four main ones.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(45deg)' }}/> },
  { id: 'E', label: 'East', type: 'Main Direction', angle: 90, description: <>East is a <b>cardinal direction</b>, one quarter-turn clockwise from North. The <b>Sun rises in the East</b>.</>, note: 'Facing the sunrise, North is on your left and South on your right.', icon: <Sunrise size={48} color="#f59e0b" /> },
  { id: 'SE', label: 'South-East', type: 'Intermediate Direction', angle: 135, description: <>South-East is an <b>intermediate direction</b>, halfway between South and East.</>, note: "Between two cardinals — useful for describing a spot that isn't due S or due E.", icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(135deg)' }}/> },
  { id: 'S', label: 'South', type: 'Main Direction', angle: 180, description: <>South is a <b>cardinal direction</b>, directly opposite North at the bottom of the compass.</>, note: 'On most maps, down the page is roughly South.', icon: <Navigation size={48} color="#3b82f6" style={{ transform: 'rotate(180deg)' }}/> },
  { id: 'SW', label: 'South-West', type: 'Intermediate Direction', angle: 225, description: <>South-West is an <b>intermediate direction</b>, halfway between South and West.</>, note: 'Halfway between two cardinals, like all intermediate points.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(225deg)' }}/> },
  { id: 'W', label: 'West', type: 'Main Direction', angle: 270, description: <>West is a <b>cardinal direction</b>, opposite East. The <b>Sun sets in the West</b>.</>, note: 'Facing the sunset, South is on your left and North on your right.', icon: <Sunset size={48} color="#f59e0b" /> },
  { id: 'NW', label: 'North-West', type: 'Intermediate Direction', angle: 315, description: <>North-West is an <b>intermediate direction</b>, halfway between North and West.</>, note: 'The last of the four intermediate directions.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(315deg)' }}/> }
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

  const isAllViewed = viewedDirs.size === 8;

  const handleDirClick = (id) => {
    setActiveDir(id);
    setViewedDirs(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const getActiveInfo = () => DIRECTIONS.find(d => d.id === activeDir);

  // SVG path for a 45-degree pie slice (one eighth of a circle)
  // Center is 50,50. Radius is 50.
  // 45 degrees in radians is PI/4.
  // Start angle: -22.5 deg, End angle: 22.5 deg (to center the slice on the top)
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
    <div style={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
      
      {/* Top Bar for Back Button */}
      {activeDir !== null && (
        <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <button 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveDir(null);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      )}

      {/* Two Column Layout (Reversed to match global layout) */}
      <div style={{ display: 'flex', flexDirection: 'row-reverse', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* LEFT: Interactive Compass Area */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', padding: '2rem', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Realistic Compass */}
          <motion.div 
            animate={pulseCompass ? { scale: [1, 1.05, 1], boxShadow: ['0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 100px rgba(56,189,248,0.8), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)'] } : {}}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', width: '420px', height: '420px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', padding: '20px' }}
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
                <svg width="30" height="240" viewBox="0 0 30 240" style={{ position: 'absolute' }}>
                   <path d="M 15 12 L 30 120 L 15 120 Z" fill="#ef4444" />
                   <path d="M 15 12 L 0 120 L 15 120 Z" fill="#dc2626" />
                </svg>
                {/* South Half */}
                <svg width="30" height="240" viewBox="0 0 30 240" style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
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
                      paddingTop: '20px',
                      transform: `rotate(${dir.angle}deg)`,
                      pointerEvents: 'none',
                      zIndex: 15
                    }}>
                      <div style={{
                        transform: `rotate(-${dir.angle}deg)`, // keep text upright
                        color: isActive ? '#38bdf8' : (isHovered ? '#fff' : '#94a3b8'),
                        fontWeight: 'bold',
                        fontSize: dir.id.length === 1 ? '1.8rem' : '1.3rem',
                        textShadow: isActive ? '0 0 10px rgba(56, 189, 248, 0.8)' : 'none',
                        transition: 'all 0.2s',
                        fontFamily: 'serif'
                      }}>
                        {dir.id}
                      </div>
                      {/* Active Indicator Dot */}
                      {isActive && (
                         <div style={{ marginTop: '5px', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', zIndex: 30 }}>
              <button 
                onClick={() => {
                  setPulseCompass(true);
                  setTimeout(() => setPulseCompass(false), 500);
                }}
                style={{ 
                  background: 'var(--amber)', color: '#fff', border: 'none', borderRadius: '99px', padding: '12px 28px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(245,166,35,0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                Click Compass to Explore <ArrowRight size={18} strokeWidth={3} />
              </button>
            </motion.div>
          )}
        </div>

        {/* RIGHT: Information Panel (Visually on Left) */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', minHeight: 0, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          
          <ScrollableWithNav scrollStyle={{ padding: '1rem 1.5rem' }}>
            <AnimatePresence mode="wait">
              {!activeDir ? (
                <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Section 1 - Introduction */}
                  <div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Compass size={36} color="var(--amber)" /> Finding Directions
                    </h2>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.15rem', lineHeight: 1.5, margin: 0 }}>
                      Directions help us know where places are.<br/>
                      Every map uses directions to help us travel from one place to another.
                    </p>
                  </div>

                  {/* Section 2 - The Four Main Directions */}
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                       <h3 style={{ color: 'var(--text-heading)', fontSize: '1.15rem', margin: 0 }}>The Four Main Directions</h3>
                       <span style={{ fontSize: '0.85rem', background: '#fffbeb', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>Cardinal Directions</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 800, fontSize: '0.95rem' }}><ArrowUp size={16} strokeWidth={3} /> NORTH</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Top</div>
                      </div>
                      <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 800, fontSize: '0.95rem' }}><ArrowRight size={16} strokeWidth={3} /> EAST</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Right</div>
                      </div>
                      <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontWeight: 800, fontSize: '0.95rem' }}><ArrowDown size={16} strokeWidth={3} /> SOUTH</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Bottom</div>
                      </div>
                      <div style={{ background: '#faf5ff', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontWeight: 800, fontSize: '0.95rem' }}><ArrowLeft size={16} strokeWidth={3} /> WEST</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Left</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4 - Intermediate Directions */}
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div>
                        <h3 style={{ color: 'var(--text-heading)', fontSize: '1.15rem', margin: '0 0 6px 0' }}>Intermediate Directions</h3>
                        <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>These lie between the main directions.</p>
                     </div>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       {['NE', 'SE', 'SW', 'NW'].map(d => (
                         <div key={d} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--amber)' }}>{d}</div>
                       ))}
                     </div>
                  </div>

                  {/* Section 5.5 - Fun Fact */}
                  <div style={{ background: '#fdf4ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fae8ff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Lightbulb size={28} color="#c026d3" flexShrink={0} />
                    <p style={{ color: '#86198f', margin: 0, fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                      <strong>Fun Fact:</strong> A real compass needle is magnetic and will always point towards the Earth's Magnetic North Pole!
                    </p>
                  </div>

                </motion.div>
              ) : (
                <motion.div key={activeDir} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '0.5rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                      {getActiveInfo()?.icon}
                    </div>
                    <h2 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-heading)' }}>
                      {getActiveInfo()?.label}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.4rem 1rem', background: getActiveInfo()?.type === 'Main Direction' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(168, 85, 247, 0.1)', color: getActiveInfo()?.type === 'Main Direction' ? '#3b82f6' : '#a855f7', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', border: getActiveInfo()?.type === 'Main Direction' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(168, 85, 247, 0.2)' }}>
                      Type: {getActiveInfo()?.type === 'Main Direction' ? 'Cardinal Point' : 'Intermediate Direction'}
                    </div>
                    <div style={{ padding: '0.4rem 1rem', background: '#fffbeb', color: '#d97706', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', border: '1px solid #fde68a', fontFamily: 'monospace' }}>
                      Bearing {getActiveInfo()?.angle}°
                    </div>
                    <div style={{ padding: '0.4rem 1rem', background: '#ecfdf5', color: '#10b981', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', border: '1px solid #a7f3d0' }}>
                      Opposite: {getOpposite(getActiveInfo()?.id)}
                    </div>
                  </div>
                  
                  <div style={{ background: 'var(--bg-primary)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '1.25rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.5, margin: 0 }}>
                      {getActiveInfo()?.description}
                    </p>
                  </div>

                  <div style={{ background: 'var(--surface)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                     <div style={{ width: '50px', height: '50px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                       <Map size={24} color="#64748b" />
                     </div>
                     <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, lineHeight: 1.4 }}>
                       {getActiveInfo()?.note}
                     </p>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </ScrollableWithNav>
          
          {/* Progress & Completion Area */}
          <div style={{ padding: '0.75rem 1.5rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            
            {viewedDirs.size > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Directions Explored ({viewedDirs.size}/8)</div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {DIRECTIONS.map(d => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: viewedDirs.has(d.id) ? '#10b981' : 'var(--bg-primary)', color: viewedDirs.has(d.id) ? 'white' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold', border: viewedDirs.has(d.id) ? 'none' : '1px solid var(--border)' }}>
                      {d.id} {viewedDirs.has(d.id) && <CheckCircle2 size={12} />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: '#fffbeb', padding: '0.85rem', borderRadius: '12px', border: '1px solid #fde68a', marginBottom: isAllViewed ? '0.75rem' : '0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <h3 style={{ margin: 0, color: '#b45309', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Lightbulb size={16} color="#d97706" /> Remember</h3>
              <p style={{ color: '#92400e', margin: 0, fontSize: '0.85rem', lineHeight: 1.4 }}>
                Most maps do not show all eight directions. Instead, they usually show only a North arrow. Once North is known, the other directions can easily be found.
              </p>
            </div>
            
            <AnimatePresence>
              {isAllViewed && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981', fontWeight: 600, textAlign: 'center' }}>
                    All directions explored! Use the button below to continue.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={isAllViewed ? 'Explore Directions using India Map' : undefined}
        onNext={isAllViewed ? onComplete : undefined}
        nextVariant="blue"
      />
    </div>
  );
}
