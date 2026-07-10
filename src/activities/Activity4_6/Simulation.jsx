import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, RotateCcw, Compass, Activity, Eye, EyeOff, Pointer } from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, useDraggable } from '@dnd-kit/core';

// Helper: Calculate angle between two points
const calculateAngle = (cx, cy, px, py) => {
  const dy = py - cy;
  const dx = px - cx;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI;
  return theta; // in degrees
};

// Compass component
const CompassNeedle = ({ rotation }) => (
  <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', background: '#fff', border: '4px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
    <div style={{ position: 'absolute', top: '5px', fontWeight: 'bold', color: '#ef4444', fontSize: '10px' }}>N</div>
    <div style={{ position: 'absolute', bottom: '5px', fontWeight: 'bold', color: '#3b82f6', fontSize: '10px' }}>S</div>
    <div style={{ position: 'absolute', left: '5px', fontWeight: 'bold', color: '#94a3b8', fontSize: '10px' }}>W</div>
    <div style={{ position: 'absolute', right: '5px', fontWeight: 'bold', color: '#94a3b8', fontSize: '10px' }}>E</div>
    
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: "spring", stiffness: 40, damping: 10 }}
      style={{ position: 'absolute', width: '4px', height: '80px', display: 'flex', flexDirection: 'column' }}
    >
      {/* North pointing part (Red) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '40px solid #ef4444', transform: 'translateX(-4px)' }} />
      {/* South pointing part (Blue) */}
      <div style={{ flex: 1, width: '0', height: '0', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '40px solid #3b82f6', transform: 'translateX(-4px)' }} />
    </motion.div>
    
    <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#334155', borderRadius: '50%' }} />
  </div>
);

// Draggable Bar Magnet
const DraggableMagnet = ({ isFlipped }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'bar_magnet',
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 1000 : 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ 
        width: '160px', height: '40px', display: 'flex', borderRadius: '4px', overflow: 'hidden', 
        boxShadow: isDragging ? '0 10px 15px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
        flexDirection: isFlipped ? 'row-reverse' : 'row'
      }}>
        <div style={{ flex: 1, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>N</div>
        <div style={{ flex: 1, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px' }}>S</div>
      </div>
    </div>
  );
};

export default function Simulation({ onComplete, onNext }) {
  const [step, setStep] = useState(1);
  const [magnetPos, setMagnetPos] = useState({ x: 650, y: 500 });
  const [isFlipped, setIsFlipped] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(0); // 0 is North (pointing up)
  const [showFields, setShowFields] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const compassPos = { x: 650, y: 300 };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const calculateMagneticEffect = (x, y, flipped) => {
    // Magnet poles relative to magnet center
    const magnetWidth = 160;
    const nPoleX = flipped ? x + magnetWidth / 4 : x - magnetWidth / 4;
    const sPoleX = flipped ? x - magnetWidth / 4 : x + magnetWidth / 4;
    const poleY = y;

    // Distances
    const distN = Math.sqrt((nPoleX - compassPos.x) ** 2 + (poleY - compassPos.y) ** 2);
    const distS = Math.sqrt((sPoleX - compassPos.x) ** 2 + (poleY - compassPos.y) ** 2);

    // If magnet is far away, Earth's field dominates (0 degrees)
    if (distN > 250 && distS > 250) {
      setNeedleRotation(0);
      setFeedback({ type: 'info', text: "Earth's magnetic field aligns the compass needle." });
      return;
    }

    // Determine the dominating pole based on distance
    // The North pole of the magnet will repel the North pole (red) of the compass
    // The compass N-pole points away from the Magnet N-pole, and towards the Magnet S-pole
    
    // Angle from compass to N-pole of magnet
    const angleToN = calculateAngle(compassPos.x, compassPos.y, nPoleX, poleY);
    // Angle from compass to S-pole of magnet
    const angleToS = calculateAngle(compassPos.x, compassPos.y, sPoleX, poleY);

    if (distN < distS) {
      // Near North pole -> compass North points AWAY from it. 
      // angleToN is the angle towards the magnet N pole. We want the opposite.
      let newRot = angleToN + 90; // +90 because our visual needle has 0 deg pointing UP (y-axis negative in DOM)
      
      setNeedleRotation(newRot);
      
      if (step === 3 && distN < 120 && !flipped) {
        setFeedback({ type: 'success', text: '✅ Like poles repel. Compass needle moves away!' });
        setTimeout(() => setStep(4), 2000);
      } else {
        setFeedback({ type: 'success', text: '✅ Like poles repel.' });
      }

    } else {
      // Near South pole -> compass North points TOWARDS it.
      let newRot = angleToS - 90;
      
      setNeedleRotation(newRot);

      if (step === 4 && distS < 120 && flipped) {
        setFeedback({ type: 'success', text: '✅ Unlike poles attract. Compass needle moves toward!' });
        setTimeout(() => setStep(5), 2000);
      } else {
        setFeedback({ type: 'success', text: '✅ Unlike poles attract.' });
      }
    }
  };

  const handleDragEnd = (event) => {
    const { delta } = event;
    const newX = magnetPos.x + delta.x;
    const newY = magnetPos.y + delta.y;
    
    // Boundary check
    const boundedX = Math.max(80, Math.min(newX, 1220));
    const boundedY = Math.max(20, Math.min(newY, 680));
    
    setMagnetPos({ x: boundedX, y: boundedY });
    calculateMagneticEffect(boundedX, boundedY, isFlipped);
  };

  const flipMagnet = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    calculateMagneticEffect(magnetPos.x, magnetPos.y, newFlipped);
  };

  const handleReset = () => {
    setMagnetPos({ x: 650, y: 500 });
    setIsFlipped(false);
    setNeedleRotation(0);
    setFeedback(null);
    setStep(1);
    setShowFields(false);
  };

  useEffect(() => {
    if (step === 5) {
      onComplete();
    }
  }, [step, onComplete]);

  // Handle magnetic field animation overlay
  const renderMagneticFields = () => {
    if (!showFields) return null;
    return (
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', opacity: 0.3 }}>
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform={`translate(${magnetPos.x}, ${magnetPos.y}) ${isFlipped ? 'scale(-1, 1)' : ''}`}>
             <path d="M -80 0 Q 0 -150 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 150 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 -300 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
             </path>
             <path d="M -80 0 Q 0 300 80 0" fill="none" stroke="url(#fieldGrad)" strokeWidth="2" strokeDasharray="5,5">
               <animate attributeName="stroke-dashoffset" from="100" to="0" dur="3s" repeatCount="indefinite" />
             </path>
          </g>
        </svg>
      </div>
    );
  };

  return (
    <div className="main-grid" style={{ gridTemplateColumns: "1fr", gap: "1rem", maxWidth: "1800px", margin: "0 auto", width: "100%" }}>
      
      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "1.5rem" }}>
        
        {/* Left Panel: Instructions */}
        <div className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--surface)" }}>
          <h3 style={{ margin: 0, color: "var(--text-heading)", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Instructions</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            
            <div style={{ opacity: step >= 1 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 1</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Take a magnetic compass and a bar magnet.</p>
              {step === 1 && (
                <button onClick={() => setStep(2)} className="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>Next</button>
              )}
            </div>

            <div style={{ opacity: step >= 2 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 2</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Place the compass on the surface. Observe it resting towards North.</p>
              {step === 2 && (
                <button onClick={() => setStep(3)} className="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>Next</button>
              )}
            </div>

            <div style={{ opacity: step >= 3 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 3</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Bring the <strong>North Pole</strong> of the magnet near the <strong>North Pole</strong> of the compass.</p>
            </div>

            <div style={{ opacity: step >= 4 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--accent)' }}>Step 4</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Flip the magnet and bring the <strong>South Pole</strong> near the compass.</p>
            </div>
            
            <div style={{ opacity: step >= 5 ? 1 : 0.3 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--success)' }}>Complete</div>
              <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Experiment completed! Proceed to the questions.</p>
              {step === 5 && (
                <button onClick={onNext} className="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Next <ArrowRight size={14} />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Panel: Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowFields(!showFields)} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {showFields ? <EyeOff size={16} /> : <Eye size={16} />} 
                {showFields ? "Hide Field Lines" : "Show Field Lines"}
              </button>
              <button onClick={flipMagnet} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RotateCcw size={16} /> Flip Magnet
              </button>
            </div>
            <button onClick={handleReset} className="outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Reset Workspace
            </button>
          </div>

          <div className="glass-panel" style={{ position: 'relative', flex: 1, minHeight: '700px', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            
            {renderMagneticFields()}

            {/* Compass Container (Fixed) */}
            <div style={{ position: 'absolute', left: compassPos.x - 50, top: compassPos.y - 50 }}>
              <CompassNeedle rotation={needleRotation} />
            </div>

            {/* Draggable Magnet Area */}
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div style={{ position: 'absolute', inset: 0 }}>
                {step >= 3 && (
                  <div style={{ position: 'absolute', left: magnetPos.x - 80, top: magnetPos.y - 20 }}>
                    <DraggableMagnet isFlipped={isFlipped} />
                  </div>
                )}
              </div>
            </DndContext>

            {/* Feedback Overlay */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    background: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--surface)', 
                    color: feedback.type === 'success' ? 'var(--success)' : 'var(--text-primary)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '24px',
                    border: `1px solid ${feedback.type === 'success' ? 'var(--success-border)' : 'var(--border)'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                >
                  {feedback.text}
                </motion.div>
              )}
            </AnimatePresence>

            {step >= 3 && !feedback && (
              <div style={{ position: 'absolute', bottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.8)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                <Pointer size={16} /> Drag the magnet closer to the compass
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
