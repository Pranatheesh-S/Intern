import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, Sunrise, Sunset, Navigation, CheckCircle2 } from 'lucide-react';

const DIRECTIONS = [
  { id: 'N', label: 'North', type: 'Main Direction', angle: 0, description: 'North is one of the four main directions. Most maps show a small arrow pointing towards North.', icon: <Navigation size={48} color="#ef4444" style={{ transform: 'rotate(0deg)' }}/> },
  { id: 'NE', label: 'North-East', type: 'Intermediate Direction', angle: 45, description: 'North-East lies between North and East. It is called an intermediate direction.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(45deg)' }}/> },
  { id: 'E', label: 'East', type: 'Main Direction', angle: 90, description: 'East is one of the four main directions. It is to the right of North on a compass.', icon: <Sunrise size={48} color="#f59e0b" /> },
  { id: 'SE', label: 'South-East', type: 'Intermediate Direction', angle: 135, description: 'South-East lies between South and East. It is called an intermediate direction.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(135deg)' }}/> },
  { id: 'S', label: 'South', type: 'Main Direction', angle: 180, description: 'South is opposite to North. It is one of the four main directions.', icon: <Navigation size={48} color="#3b82f6" style={{ transform: 'rotate(180deg)' }}/> },
  { id: 'SW', label: 'South-West', type: 'Intermediate Direction', angle: 225, description: 'South-West lies between South and West. It is called an intermediate direction.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(225deg)' }}/> },
  { id: 'W', label: 'West', type: 'Main Direction', angle: 270, description: 'West is opposite to East. It is one of the four main directions.', icon: <Sunset size={48} color="#f59e0b" /> },
  { id: 'NW', label: 'North-West', type: 'Intermediate Direction', angle: 315, description: 'North-West lies between North and West. It is called an intermediate direction.', icon: <Navigation size={48} color="#f59e0b" style={{ transform: 'rotate(315deg)' }}/> }
];

export default function Directions({ onComplete }) {
  const [activeDir, setActiveDir] = useState(null);
  const [viewedDirs, setViewedDirs] = useState(new Set());
  const [hoveredDir, setHoveredDir] = useState(null);

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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
      
      {/* Header */}
      <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)', zIndex: 10 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>UNDERSTANDING MAPS</div>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
          Directions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: 0, maxWidth: '800px' }}>
          Maps help us know which way to go. The four main directions are North, East, South and West. Between them are four more directions called intermediate directions.
        </p>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: '650px', flexWrap: 'wrap' }}>
        
        {/* LEFT: Interactive Compass Area */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', padding: '3rem', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          {/* Decorative background glow */}
          <div style={{ position: 'absolute', width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Realistic Compass */}
          <div style={{ position: 'relative', width: '380px', height: '380px', borderRadius: '50%', background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #475569 100%)', boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.8), inset 0 -2px 10px rgba(0,0,0,0.4)', padding: '20px' }}>
            
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
                <svg width="24" height="200" viewBox="0 0 24 200" style={{ position: 'absolute' }}>
                   <path d="M 12 10 L 24 100 L 12 100 Z" fill="#ef4444" />
                   <path d="M 12 10 L 0 100 L 12 100 Z" fill="#dc2626" />
                </svg>
                {/* South Half */}
                <svg width="24" height="200" viewBox="0 0 24 200" style={{ position: 'absolute', transform: 'rotate(180deg)' }}>
                   <path d="M 12 10 L 24 100 L 12 100 Z" fill="#e2e8f0" />
                   <path d="M 12 10 L 0 100 L 12 100 Z" fill="#cbd5e1" />
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
                        fontSize: dir.id.length === 1 ? '1.5rem' : '1.1rem',
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
          </div>

          <p style={{ color: '#94a3b8', marginTop: '2rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Click on any direction to learn more
          </p>

        </div>

        {/* RIGHT: Information Panel */}
        <div style={{ flex: '1 1 50%', minWidth: '350px', background: 'var(--card-bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              {!activeDir ? (
                <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ padding: '2rem', background: 'var(--surface)', borderRadius: '50%', marginBottom: '2rem', color: 'var(--accent)' }}>
                    <Compass size={64} strokeWidth={1.5} />
                  </div>
                  <h2 style={{ color: 'var(--text-heading)', margin: '0 0 1rem 0' }}>Explore the Compass</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '300px' }}>
                    Click any direction on the compass to learn about it.
                  </p>
                </motion.div>
              ) : (
                <motion.div key={activeDir} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--surface)', borderRadius: '24px', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                    {getActiveInfo()?.icon}
                  </div>
                  <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>
                    {getActiveInfo()?.label}
                  </h2>
                  <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: getActiveInfo()?.type === 'Main Direction' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: getActiveInfo()?.type === 'Main Direction' ? '#3b82f6' : '#d97706', borderRadius: '8px', fontWeight: 'bold', marginBottom: '2rem', border: getActiveInfo()?.type === 'Main Direction' ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' }}>
                    Type: {getActiveInfo()?.type}
                  </div>
                  
                  <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.15rem', lineHeight: 1.6, margin: 0 }}>
                      {getActiveInfo()?.description}
                    </p>
                  </div>

                  {activeDir === 'N' && (
                    <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                       <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                         <span style={{ color: '#ef4444', fontWeight: 'bold' }}>↑ N</span>
                         <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Map</span>
                       </div>
                       <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                         Maps usually use a North arrow to help us understand directions.
                       </p>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Progress & Completion Area */}
          <div style={{ padding: '2rem 3rem', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
            
            <div style={{ marginBottom: isAllViewed ? '2rem' : 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Directions Explored ({viewedDirs.size}/8)</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {DIRECTIONS.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: viewedDirs.has(d.id) ? '#10b981' : 'var(--bg-primary)', color: viewedDirs.has(d.id) ? 'white' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {d.id} {viewedDirs.has(d.id) && <CheckCircle2 size={12} />}
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {isAllViewed && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.1rem' }}>Remember</h3>
                    <p style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>
                      Most maps do not show all eight directions. Instead, they usually show only a North arrow. Once North is known, the other directions can easily be found.
                    </p>
                  </div>
                  
                  <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '16px', textAlign: 'center' }}>
                     <h3 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>Excellent!</h3>
                     <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>You explored all the directions on the compass. Now you're ready to learn how maps use symbols to represent places.</p>
                     
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', background: 'white', color: '#10b981', borderRadius: '20px', fontWeight: 'bold', marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)' }}>
                       🧭 Compass Explorer
                     </div>

                     <button onClick={onComplete} className="primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                       Continue to Symbols <ArrowRight size={20} />
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
