import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RealisticCup } from './RealisticCup';

export const WeighingScale = ({ currentCupOnScale, mass }) => {
  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px',
        paddingTop: '40px' // Space for the cup
      }}
    >
      <div 
        data-droptarget="scale"
        style={{
          position: 'relative',
          width: '240px',
          height: '180px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(20deg)', // Subtle 3D tilt
        }}
      >
        {/* Scale Body */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: '24px',
          border: '1px solid #ffffff',
          boxShadow: '0 16px 0 #ced4da, 0 24px 30px rgba(0,0,0,0.25)', // Physical thickness and ambient shadow
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: '20px'
        }}>
          
          {/* Display & Buttons Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '85%',
            background: '#dee2e6',
            padding: '10px 14px',
            borderRadius: '12px',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 0 rgba(255,255,255,0.8)'
          }}>
            
            {/* Recessed LCD Display */}
            <div style={{
              background: '#212529',
              padding: '4px',
              borderRadius: '8px',
              boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.5)',
              width: '130px'
            }}>
              <div style={{
                background: 'linear-gradient(180deg, #9ae6b4, #68d391)', // Soft green LCD
                borderRadius: '4px',
                padding: '6px 8px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.15)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <span style={{ 
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#1a202c',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 2px rgba(39, 103, 73, 0.2)'
                }}>
                  {mass ? `${mass.toFixed(2)} g` : '0.00 g'}
                </span>
              </div>
            </div>

            {/* Physical Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button style={{
                background: 'linear-gradient(to bottom, #f97316, #ea580c)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '4px 8px',
                boxShadow: '0 4px 0 #c2410c, 0 5px 5px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transform: 'translateY(0)',
                transition: 'all 0.1s'
              }} onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #c2410c, 0 1px 2px rgba(0,0,0,0.2)' }}
                 onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #c2410c, 0 5px 5px rgba(0,0,0,0.2)' }}>
                ON/TARE
              </button>
              <button style={{
                background: 'linear-gradient(to bottom, #d1d5db, #9ca3af)',
                border: 'none',
                borderRadius: '6px',
                color: '#374151',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '4px 8px',
                boxShadow: '0 4px 0 #6b7280, 0 5px 5px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.1s'
              }} onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #6b7280, 0 1px 2px rgba(0,0,0,0.2)' }}
                 onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #6b7280, 0 5px 5px rgba(0,0,0,0.2)' }}>
                UNIT
              </button>
            </div>

          </div>
        </div>

        {/* Weighing Platform (Pan) */}
        <motion.div
          animate={{ 
            translateZ: currentCupOnScale ? 15 : 20, // Depress downwards slightly when cup is placed
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            marginLeft: '-75px', // half of width
            width: '150px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)', // Metallic light gray
            border: '2px solid #ffffff',
            boxShadow: '0 6px 0 #94a3b8, 0 10px 10px rgba(0,0,0,0.15)', // Platform thickness
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Subtle inner pan bevel */}
          <div style={{
            width: '90%', height: '80%', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
          }} />
          
          {/* Container for the Cup, placed ON the pan.
              We rotateX(-20deg) to counter the 20deg tilt of the scale, 
              so the cup stands straight up. */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%) rotateX(-20deg)', 
            transformStyle: 'preserve-3d' 
          }}>
            <AnimatePresence>
              {currentCupOnScale && (
                <motion.div
                  key={currentCupOnScale}
                  initial={{ y: -60, opacity: 0, scale: 1.05 }}
                  animate={{ y: -50, opacity: 1, scale: 1 }} // y:-50 to sit on the platform
                  exit={{ y: -30, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  style={{ 
                    position: 'relative', 
                    width: '80px', 
                    height: '100px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* The actual cup */}
                  <RealisticCup material={currentCupOnScale} />
                  
                  {/* Tight contact shadow strictly underneath the cup */}
                  <div style={{
                    position: 'absolute', 
                    bottom: '-6px', 
                    left: '10%', 
                    right: '10%', 
                    height: '12px',
                    background: 'rgba(0,0,0,0.4)', 
                    borderRadius: '50%', 
                    filter: 'blur(3px)',
                    zIndex: -1
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
