import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const VerticalLevelMap = ({ sections, activeSectionId, onSelectNode, bgImage, stickyTop }) => {
  const containerRef = useRef(null);

  // Configuration for the vertical map
  const nodeSpacingY = 120;
  const mapWidth = 280;
  const mapHeight = sections.length * nodeSpacingY + 120;
  
  // Calculate nodes with positions
  const nodes = sections.map((sec, i) => {
    const y = 60 + i * nodeSpacingY;
    // Creates a smooth sine wave pattern left and right
    const x = (mapWidth / 2) + Math.sin(i * Math.PI / 2) * 55; 
    return { ...sec, x, y, index: i };
  });

  // Build the curvy SVG path that connects the nodes vertically
  const pathD = `M ${nodes[0]?.x || mapWidth/2},${nodes[0]?.y || 60} ` + nodes.map((n, i) => {
    if (i === 0) return '';
    const prev = nodes[i - 1];
    const cpY = (prev.y + n.y) / 2;
    // Vertical cubic bezier S-curve
    return `C ${prev.x},${cpY} ${n.x},${cpY} ${n.x},${n.y}`;
  }).join(' ');

  // Find index of current active section to calculate progress line
  const activeIndex = nodes.findIndex(n => n.id === activeSectionId);
  const progressRatio = activeIndex >= 0 ? (activeIndex / (nodes.length - 1)) : 0;

  // Auto-scroll the map when the active section changes
  useEffect(() => {
    const activeNode = nodes.find(n => n.id === activeSectionId);
    if (activeNode && containerRef.current) {
      containerRef.current.scrollTo({
        top: Math.max(0, activeNode.y - containerRef.current.clientHeight / 2),
        behavior: 'smooth'
      });
    }
  }, [activeSectionId, nodes]);

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse-leaf {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.25) rotate(15deg); }
        }
      `}</style>
      <div className={`${bgImage ? '' : 'glass-panel'} hide-scrollbar`} style={{
        width: `${mapWidth}px`,
        minWidth: `${mapWidth}px`,
        maxWidth: `${mapWidth}px`,
        flexShrink: 0,
        flexGrow: 0,
        position: 'sticky',
        top: stickyTop || '6.5rem',
        height: 'calc(100vh - 8.5rem)', // Full viewport height minus some padding
        overflowY: 'hidden',
        overflowX: 'hidden',
        padding: '0',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backgroundImage: bgImage ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.15)), url(${bgImage})` : 'none',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: bgImage ? '2.5rem' : '0'
      }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: bgImage ? '0.65rem' : '1rem',
        left: bgImage ? '0.65rem' : '50%',
        transform: bgImage ? 'none' : 'translateX(-50%)',
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: bgImage ? 'rgba(15, 23, 42, 0.7)' : 'var(--card-bg)',
          backdropFilter: 'blur(12px)',
          padding: '0.4rem 0.85rem',
          borderRadius: '8px',
          border: bgImage ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border)',
          fontWeight: 'bold',
          color: bgImage ? '#ffffff' : 'var(--text-heading)',
          textShadow: bgImage ? '0 1px 3px rgba(0, 0, 0, 0.5)' : 'none',
          pointerEvents: 'auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
        }}>
          Level Map
        </div>
      </div>

      <div ref={containerRef} className="hide-scrollbar" style={{ flex: 1, position: 'relative', width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ position: 'relative', width: '100%', height: `${mapHeight}px` }}>
          {/* SVG Path Background */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${mapHeight}px` }}>
            {/* Base locked path (dotted) */}
            <path 
              d={pathD} 
              fill="none" 
              stroke={bgImage ? 'rgba(255, 255, 255, 0.35)' : 'var(--border)'} 
              strokeWidth="4" 
              strokeDasharray="8 8" 
              strokeLinecap="round" 
            />
            {/* Animated active/completed path */}
            <motion.path 
              d={pathD} 
              fill="none" 
              stroke={bgImage ? '#10b981' : 'var(--accent)'} 
              strokeWidth="6" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressRatio }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />
          </svg>

          {/* Node Buttons */}
          {nodes.map(n => {
            const isActive = activeSectionId === n.id;
            const isCompleted = n.isCompleted;

            return (
              <div
                key={n.id}
                style={{
                  position: 'absolute',
                  left: n.x,
                  top: n.y,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: isActive ? 10 : 5
                }}
              >
                {/* Title Tooltip */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    marginTop: '12px',
                    transform: 'translateX(-50%)',
                    background: 'var(--card-bg)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    width: '150px',
                    whiteSpace: 'normal',
                    textAlign: 'center',
                    border: bgImage ? '1px solid #10b981' : '1px solid var(--accent)',
                    opacity: isActive ? 1 : 0,
                    transition: 'all 0.3s ease',
                    pointerEvents: isActive ? 'auto' : 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {n.title}
                </div>

                {/* Candy Crush Level Badge Leaf/Flower Overlay */}
                {bgImage && (
                  <span style={{
                    position: 'absolute',
                    top: isActive ? '-10px' : '-6px',
                    right: isActive ? '-10px' : '-6px',
                    fontSize: isActive ? '1.2rem' : '0.9rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                    animation: isActive ? 'pulse-leaf 2s infinite ease-in-out' : 'none',
                    pointerEvents: 'none',
                    zIndex: 12
                  }}>
                    {isActive ? '🍃' : isCompleted ? '🌸' : '🌿'}
                  </span>
                )}

                {/* The clickable node */}
                <button
                  onClick={() => onSelectNode ? onSelectNode(n.id) : document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  style={{
                    width: isActive ? '45px' : '35px',
                    height: isActive ? '45px' : '35px',
                    minWidth: isActive ? '45px' : '35px',
                    minHeight: isActive ? '45px' : '35px',
                    aspectRatio: '1/1',
                    boxSizing: 'border-box',
                    padding: 0,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: bgImage ? 
                      (isActive ? '#10b981' : isCompleted ? '#059669' : 'rgba(255, 255, 255, 0.35)') :
                      (isActive ? 'var(--accent)' : isCompleted ? 'var(--success)' : 'var(--page-bg)'),
                    border: `3px solid ${isActive || isCompleted ? '#fff' : (bgImage ? 'rgba(255,255,255,0.45)' : 'var(--border)')}`,
                    boxShadow: isActive ? (bgImage ? '0 0 20px #10b981' : '0 0 20px var(--accent)') : 'none',
                    backdropFilter: bgImage && !isActive && !isCompleted ? 'blur(4px)' : 'none',
                    color: isActive || isCompleted ? '#fff' : (bgImage ? '#fff' : 'var(--text-secondary)'),
                    textShadow: bgImage && !isActive && !isCompleted ? '0 1px 3px rgba(0,0,0,0.6)' : 'none',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fontSize: isActive ? '1.1rem' : '0.9rem',
                    fontWeight: 'bold',
                    lineHeight: 1,
                    fontFamily: 'system-ui'
                  }}
                >
                  {n.index + 1}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default VerticalLevelMap;
