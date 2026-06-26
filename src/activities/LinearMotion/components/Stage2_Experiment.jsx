import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Circle, Pencil, Box, ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function Stage2_Experiment({ onComplete }) {
  const [activeObject, setActiveObject] = useState(null); // Which object is on the track
  const [isPlaying, setIsPlaying] = useState(false);
  const [observations, setObservations] = useState({
    car: null,
    marble: null,
    pencil: null,
    box: null
  });
  const [feedback, setFeedback] = useState({});

  const dropZoneRef = useRef(null);

  const objects = [
    { id: 'car', name: 'Toy Car', icon: Car, color: '#3b82f6', distance: 300, duration: 1.5, type: 'car' },
    { id: 'marble', name: 'Marble', icon: Circle, color: '#10b981', distance: 300, duration: 2, type: 'marble' },
    { id: 'pencil', name: 'Pencil', icon: Pencil, color: '#f59e0b', distance: 300, duration: 2, type: 'pencil' },
    { id: 'box', name: 'Small Box', icon: Box, color: '#ec4899', distance: 120, duration: 1, type: 'slide' }
  ];

  const currentObj = activeObject ? objects.find(o => o.id === activeObject) : null;

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, currentObj.duration * 1000 + 500);
  };

  const handleObserve = (val) => {
    setObservations(prev => ({ ...prev, [activeObject]: val }));
    setFeedback(prev => ({
      ...prev,
      [activeObject]: val ? 'Correct! It moves in a straight line.' : 'Incorrect! Observe closely, it moves in a straight line.'
    }));
  };

  const isComplete = Object.values(observations).every(val => val === true);

  const handleNext = () => {
    if (isComplete) {
      onComplete(observations);
    }
  };

  const handleDragEnd = (event, info, objId) => {
    if (!dropZoneRef.current) return;
    const rect = dropZoneRef.current.getBoundingClientRect();
    const margin = 80; // Generous drop area
    if (
      info.point.x >= rect.left - margin &&
      info.point.x <= rect.right + margin &&
      info.point.y >= rect.top - margin &&
      info.point.y <= rect.bottom + margin
    ) {
      setActiveObject(objId);
      setIsPlaying(false);
    }
  };

  const renderObjectArt = (obj, isPlayingAnimation) => {
    if (obj.id === 'car') {
      return (
        <div style={{ position: 'relative', width: '56px', height: '32px' }}>
          <div style={{ position: 'absolute', bottom: '6px', left: 0, width: '56px', height: '16px', background: 'linear-gradient(to bottom, #ef4444, #dc2626)', borderRadius: '6px 12px 4px 4px', boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.2)' }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '12px', width: '28px', height: '10px', background: '#ef4444', borderRadius: '10px 10px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '14px', width: '10px', height: '8px', background: '#93c5fd', borderRadius: '6px 0 0 0' }} />
          <div style={{ position: 'absolute', bottom: '22px', left: '26px', width: '12px', height: '8px', background: '#93c5fd', borderRadius: '0 8px 0 0' }} />
          <motion.div 
            animate={{ rotate: isPlayingAnimation ? 720 : 0 }} 
            transition={{ duration: obj.duration, ease: "easeOut" }}
            style={{ position: 'absolute', bottom: 0, left: '6px', width: '14px', height: '14px', borderRadius: '50%', background: '#1e293b', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }} />
          </motion.div>
          <motion.div 
            animate={{ rotate: isPlayingAnimation ? 720 : 0 }} 
            transition={{ duration: obj.duration, ease: "easeOut" }}
            style={{ position: 'absolute', bottom: 0, right: '8px', width: '14px', height: '14px', borderRadius: '50%', background: '#1e293b', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }} />
          </motion.div>
        </div>
      );
    }
    if (obj.id === 'marble') {
      return <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, #ffffff, ${obj.color})`, boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.2)' }} />;
    }
    if (obj.id === 'pencil') {
      return <div style={{ width: '40px', height: '12px', background: `linear-gradient(to bottom, #fde68a, ${obj.color})`, borderRadius: '2px', borderRight: '6px solid #475569', borderLeft: '4px solid #f87171' }} />;
    }
    return (
      <div style={{ 
        width: '36px', height: '36px', 
        background: 'linear-gradient(135deg, #d97706, #92400e)', 
        borderRadius: '4px', 
        border: '2px solid #78350f',
        position: 'relative',
        boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '2px', background: '#78350f' }} />
        <div style={{ position: 'absolute', left: '16px', top: 0, bottom: 0, width: '2px', background: '#78350f' }} />
        <div style={{ position: 'absolute', top: '10px', left: '8px', width: '20px', height: '16px', border: '1px dashed #fcd34d', opacity: 0.5 }} />
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Object Tray */}
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.2rem' }}>Drag an Object to the Start Line</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', minHeight: '80px', alignItems: 'center' }}>
          {objects.map(obj => {
            const isPlaced = activeObject === obj.id;
            const isObserved = observations[obj.id] === true;

            return (
              <div key={obj.id} style={{ position: 'relative' }}>
                <motion.div
                  drag={!isPlaced}
                  dragSnapToOrigin={true}
                  onDragEnd={(e, info) => handleDragEnd(e, info, obj.id)}
                  style={{
                    padding: '1rem',
                    background: 'var(--surface)',
                    border: `1px solid ${isObserved ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: isPlaced ? 'default' : 'grab',
                    opacity: isPlaced ? 0.3 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    zIndex: 10,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  whileDrag={{ scale: 1.1, zIndex: 99, cursor: 'grabbing', boxShadow: '0 10px 15px rgba(0,0,0,0.2)' }}
                >
                  <div style={{ pointerEvents: 'none' }}>
                    {renderObjectArt(obj, false)}
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{obj.name}</span>
                </motion.div>
                {isObserved && !isPlaced && (
                  <CheckCircle size={16} style={{ position: 'absolute', top: '-8px', right: '-8px', color: 'var(--success)', background: 'var(--bg)', borderRadius: '50%' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics Canvas */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '250px', 
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
      }}>
        {/* Table Surface */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(to right, #d4d4d8, #e4e4e7)',
          borderTop: '2px solid #a1a1aa'
        }} />

        {/* Start Line */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '80px',
          width: '4px',
          height: '60px',
          background: '#ef4444',
          borderRadius: '2px'
        }} />
        <div style={{ position: 'absolute', bottom: '85px', left: '60px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.8rem', letterSpacing: '1px' }}>START</div>

        {/* Drop Zone */}
        <div 
          ref={dropZoneRef}
          style={{
            position: 'absolute',
            bottom: '25px',
            left: '60px',
            width: '60px',
            height: '60px',
            border: activeObject ? 'none' : '2px dashed var(--accent)',
            borderRadius: '8px',
            background: activeObject ? 'transparent' : 'var(--accent-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {!activeObject && (
            <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', textAlign: 'center' }}>Drop<br/>Here</span>
          )}
        </div>

        {/* The Animated Object (Placed on track) */}
        <AnimatePresence mode="wait">
          {activeObject && currentObj && (
            <motion.div
              key={activeObject}
              initial={{ x: 0, rotate: 0, y: 0 }}
              animate={isPlaying ? { 
                x: currentObj.distance, 
                rotate: currentObj.type === 'marble' ? 720 : 
                        currentObj.type === 'pencil' ? [0, 8, -8, 8, -8, 0] : 
                        currentObj.type === 'slide' ? [0, -15, 0] : 0,
                y: currentObj.type === 'car' ? [0, -4, 0, -2, 0, -1, 0] : 
                   currentObj.type === 'pencil' ? [0, -2, 0, -3, 0, -2, 0] : 0
              } : { rotate: 0, y: 0 }}
              transition={{ 
                x: { duration: currentObj.duration, ease: currentObj.type === 'slide' ? "circOut" : "easeOut" },
                rotate: { duration: currentObj.duration, ease: currentObj.type === 'marble' ? "linear" : "easeInOut" },
                y: { duration: currentObj.duration, ease: "easeInOut" }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 350 }}
              dragElastic={0}
              onDragStart={() => setIsPlaying(false)}
              whileDrag={{ cursor: 'grabbing', scale: 1.05 }}
              style={{
                position: 'absolute',
                bottom: '40px',
                left: '65px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))',
                cursor: 'grab'
              }}
            >
              {renderObjectArt(currentObj, isPlaying)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls and Observation Logging */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minHeight: '220px' }}>
        
        {activeObject ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="primary"
                style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: currentObj.color, borderColor: currentObj.color }}
              >
                <Play size={18} fill="#ffffff" /> Auto Push
              </button>
              <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>...or physically drag the object yourself!</span>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'var(--surface)' }}>
              <h4 style={{ margin: 0, color: 'var(--text-heading)' }}>Did the {currentObj.name.toLowerCase()} move in a straight line?</h4>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button
                  onClick={() => handleObserve(true)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: observations[currentObj.id] === true ? 'var(--success)' : 'transparent',
                    color: observations[currentObj.id] === true ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${observations[currentObj.id] === true ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: observations[currentObj.id] === true ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  Yes, straight line
                </button>
                <button
                  onClick={() => handleObserve(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: observations[currentObj.id] === false ? '#ef4444' : 'transparent',
                    color: observations[currentObj.id] === false ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${observations[currentObj.id] === false ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: observations[currentObj.id] === false ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  No, changed direction
                </button>
              </div>
              {feedback[currentObj.id] && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    background: observations[currentObj.id] === true ? 'var(--success-bg)' : 'var(--warning-bg)',
                    color: observations[currentObj.id] === true ? 'var(--success)' : 'var(--warning)',
                    fontWeight: '500'
                  }}
                >
                  {feedback[currentObj.id]}
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
            Drag an object from the tray above and place it on the start line to begin.
          </div>
        )}

      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className="primary"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isComplete ? 1 : 0.5,
            cursor: isComplete ? 'pointer' : 'not-allowed'
          }}
        >
          View Conclusion <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
}
