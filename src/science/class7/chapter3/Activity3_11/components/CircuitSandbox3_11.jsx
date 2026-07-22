import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { BatteryBareSVG, BulbHolderSVG } from '../../ElectricSwitch/CircuitElements';

export default function CircuitSandbox3_11({ testedItem, onGlowStateChange }) {
  const isGlowing = testedItem && testedItem.isConductor;

  const { isOver, setNodeRef } = useDroppable({
    id: 'circuit-gap',
  });

  useEffect(() => {
    if (onGlowStateChange) {
      onGlowStateChange(isGlowing);
    }
  }, [isGlowing, onGlowStateChange]);

  return (
    <div 
      ref={setNodeRef}
      style={{ 
        width: '100%', 
        height: '350px', 
        background: isOver ? 'var(--surface-hover)' : 'var(--canvas-bg)', 
        borderRadius: '8px', 
        position: 'relative',
        overflow: 'hidden',
        border: isOver ? '2px dashed var(--accent)' : '1px solid var(--border)',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Grid Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.5
      }} />

      <svg width="100%" height="100%" viewBox="0 0 600 350" style={{ position: 'absolute', top: 0, left: 0 }}>
        
        {/* Fixed Wire: Battery + to Bulb right terminal */}
        <path d="M 240,120 Q 310,60 380,157" fill="none" stroke="#ef4444" strokeWidth="4" />
        
        {/* Free Wire 1: Battery - to left gap */}
        <path d={testedItem ? "M 153,120 Q 153,255 220,255" : "M 153,120 Q 153,230 220,230"} fill="none" stroke="#3b82f6" strokeWidth="4" />
        <circle cx={testedItem ? 220 : 220} cy={testedItem ? 255 : 230} r="5" fill="#3b82f6" />
        
        {/* Free Wire 2: Bulb left to right gap */}
        <path d={testedItem ? "M 320,157 C 320,210 380,210 380,255" : "M 320,157 C 320,210 380,210 380,230"} fill="none" stroke="#eab308" strokeWidth="4" />
        <circle cx={testedItem ? 380 : 380} cy={testedItem ? 255 : 230} r="5" fill="#eab308" />

        {/* The gap area (visual marker if empty) */}
        {!testedItem && (
          <rect x="235" y="215" width="130" height="30" fill="none" stroke={isOver ? "var(--accent)" : "var(--border)"} strokeDasharray="4 4" rx="4" />
        )}
        
        {!testedItem && isOver && (
           <text x="300" y="235" fill="var(--accent)" fontSize="12" fontWeight="bold" textAnchor="middle">DROP HERE</text>
        )}

        {/* Battery */}
        <g transform="translate(150, 100)">
          <BatteryBareSVG />
        </g>
        
        {/* Bulb */}
        <g transform="translate(350, 100)">
          <BulbHolderSVG hasBulb={true} isOn={isGlowing} />
        </g>

        {/* Render the tested item using foreignObject for perfect alignment */}
        {testedItem && (
          <motion.foreignObject 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            x="220" y="235" width="160" height="40"
            style={{ overflow: 'visible' }}
          >
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--surface)',
              border: '2px solid var(--accent)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{testedItem.icon}</span>
              <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{testedItem.name}</span>
            </div>
          </motion.foreignObject>
        )}
      </svg>

      {/* Glowing Overlay Effect if Conducts */}
      {isGlowing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 65% 35%, rgba(253, 224, 71, 0.15) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

    </div>
  );
}
