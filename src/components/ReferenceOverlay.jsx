import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export default function ReferenceOverlay({ title = "Reference Blueprint", position = "left", children }) {
  const storageKey = `ref_overlay_${title.replace(/\s+/g, '_')}`;
  
  const [isOpen, setIsOpen] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved === 'true';
  });
  
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    sessionStorage.setItem(storageKey, isOpen);
  }, [isOpen, storageKey]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.3, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="outline"
          style={{
            position: 'absolute',
            top: '1rem',
            ...(position === 'right' ? { right: '1rem' } : { left: '1rem' }),
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.8rem',
            fontSize: '0.85rem',
            fontWeight: '500',
            background: 'var(--surface)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
        >
          <Eye size={16} />
          Show {title}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: '1rem',
              ...(position === 'right' ? { right: '1rem' } : { left: '1rem' }),
              zIndex: 100,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              cursor: 'grab',
              minWidth: '240px'
            }}
            whileDrag={{ cursor: 'grabbing', boxShadow: '0 12px 48px rgba(0,0,0,0.2)' }}
          >
            {/* Header */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.6rem 1rem',
                background: 'var(--neutral-bg)',
                borderBottom: '1px solid var(--border)',
                userSelect: 'none'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Eye size={14} /> {title}
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: 'var(--text-muted)' }}
                onPointerDown={(e) => e.stopPropagation()} 
              >
                <X size={16} />
              </button>
            </div>

            {/* Content (Zoomable) */}
            <div 
              style={{ 
                padding: '1rem', 
                background: 'var(--canvas-bg)',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPointerDown={(e) => e.stopPropagation()} 
            >
              <motion.div animate={{ scale: zoom }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                {children}
              </motion.div>
            </div>

            {/* Controls */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '0.5rem', 
                padding: '0.5rem',
                borderTop: '1px solid var(--border)',
                userSelect: 'none',
                background: 'var(--surface)'
              }}
              onPointerDown={(e) => e.stopPropagation()} 
            >
              <button className="icon-btn" onClick={handleZoomOut} title="Zoom Out" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '6px' }}><ZoomOut size={14} /></button>
              <button className="icon-btn" onClick={handleResetZoom} title="Reset Zoom" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '6px' }}><Maximize size={14} /></button>
              <button className="icon-btn" onClick={handleZoomIn} title="Zoom In" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '6px' }}><ZoomIn size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
