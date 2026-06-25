import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  FlipHorizontal,
  Eye,
  CircleDot,
  RotateCcw
} from 'lucide-react';
import { MirrorSVG, ReflectedObject } from './MirrorElements';

export default function Stage1_Experiment({ onComplete }) {
  // State variables for the simulation
  const [mirrorType, setMirrorType] = useState('concave'); // 'concave' | 'convex'
  const [distance, setDistance] = useState('close'); // 'close' | 'far'
  
  // Track exploration progress
  const [explored, setExplored] = useState({
    concaveClose: false,
    concaveFar: false,
    convexClose: false,
    convexFar: false
  });

  const handleMirrorChange = (newType) => {
    setMirrorType(newType);
    updateExploration(newType, distance);
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
    updateExploration(mirrorType, newDistance);
  };

  const updateExploration = (type, d) => {
    const key = `${type}${d.charAt(0).toUpperCase() + d.slice(1)}`;
    setExplored(prev => ({ ...prev, [key]: true }));
  };

  const hasExploredAll = explored.concaveClose && explored.concaveFar && explored.convexClose && explored.convexFar;

  const handleReset = () => {
    setMirrorType('concave');
    setDistance('close');
    setExplored({
      concaveClose: false,
      concaveFar: false,
      convexClose: false,
      convexFar: false
    });
  };

  // Determine image properties based on physics rules
  let imageScale = 1;
  let isVerticallyInverted = false;
  
  if (mirrorType === 'concave') {
    if (distance === 'close') {
      imageScale = 1.6; // Enlarged, upright
      isVerticallyInverted = false;
    } else {
      imageScale = 0.8; // Smaller or inverted (we'll make it smaller and inverted)
      isVerticallyInverted = true;
    }
  } else if (mirrorType === 'convex') {
    if (distance === 'close') {
      imageScale = 0.7; // Smaller, upright
      isVerticallyInverted = false;
    } else {
      imageScale = 0.4; // Even smaller, upright
      isVerticallyInverted = false;
    }
  }

  return (
    <div className="main-grid">
      {/* Left Panel: Controls & Observations */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            Stage 1: Virtual Experiment
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Spherical Mirrors</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Change the mirror type and object distance to observe how images form in concave and convex mirrors.
          </p>
        </div>

        {/* Interactive Controls */}
        <div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-faint)' }}>Interactive Controls</h3>
          
          <div className="responsive-grid-2" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
            <button 
              className={mirrorType === 'concave' ? 'primary' : 'outline'}
              onClick={() => handleMirrorChange('concave')}
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
            >
              <CircleDot size={16} /> Concave Mirror
            </button>
            <button 
              className={mirrorType === 'convex' ? 'primary' : 'outline'}
              onClick={() => handleMirrorChange('convex')}
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
            >
              <CircleDot size={16} /> Convex Mirror
            </button>
          </div>

          <div className="responsive-grid-2" style={{ gap: '0.5rem' }}>
            <button 
              className={distance === 'close' ? 'primary' : 'outline'}
              onClick={() => handleDistanceChange('close')}
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
            >
              <ZoomIn size={16} /> Move Object Closer
            </button>
            <button 
              className={distance === 'far' ? 'primary' : 'outline'}
              onClick={() => handleDistanceChange('far')}
              style={{ padding: '0.75rem 0.5rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
            >
              <ZoomOut size={16} /> Move Object Away
            </button>
          </div>
        </div>

        {/* Observation Panel */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-faint)' }}>Observation Panel</h3>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={mirrorType}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              style={{
                background: 'var(--tab-bg)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '1rem'
              }}
            >
              {mirrorType === 'concave' ? (
                <>
                  <h4 style={{ color: 'var(--accent-text)', margin: '0 0 0.5rem 0' }}>Concave Mirror</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-heading)', background: 'rgba(99, 102, 241, 0.4)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.75rem', display: 'inline-block' }}>
                    Curved Inwards
                  </span>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-faint)', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>Can produce enlarged images (when object is close).</li>
                    <li>Can produce inverted images (when object is far).</li>
                    <li>Image heavily depends on distance.</li>
                  </ul>
                </>
              ) : (
                <>
                  <h4 style={{ color: 'var(--success)', margin: '0 0 0.5rem 0' }}>Convex Mirror</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-heading)', background: 'rgba(16, 185, 129, 0.4)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginBottom: '0.75rem', display: 'inline-block' }}>
                    Curved Outwards
                  </span>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-faint)', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li>Always produces upright images.</li>
                    <li>Images always appear smaller.</li>
                    <li>Provides a wider field of view.</li>
                  </ul>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={handleReset} 
            className="outline" 
            style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RotateCcw size={16} /> Reset
          </button>
          <button 
            onClick={onComplete} 
            className="success" 
            disabled={!hasExploredAll}
            style={{ flex: 1, gap: '0.35rem', padding: '0.75rem' }}
            title={!hasExploredAll ? "Please test all mirrors and distances first!" : ""}
          >
            {hasExploredAll ? "Go to Prediction" : "Explore all combinations to continue"} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Panel: Mirror Canvas Workspace */}
      <div className="canvas-container" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="canvas-bg-grid" />
        
        <div style={{ position: 'relative', width: '200px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Mirror background */}
          <MirrorSVG type={mirrorType} width={200} height={350} />
          
          {/* Reflected Image */}
          <div style={{ position: 'absolute', top: '50px', left: '50px', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ReflectedObject 
              scale={imageScale} 
              isVerticallyInverted={isVerticallyInverted} 
              opacity={0.8}
            />
          </div>
        </div>

        {/* Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', pointerEvents: 'none', background: 'rgba(15, 23, 42, 0.7)', padding: '0.5rem', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontWeight: 'bold' }}>Simulation Active</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>
            Distance: {distance === 'close' ? 'Object is Close' : 'Object is Far Away'}
          </span>
        </div>
      </div>
    </div>
  );
}
