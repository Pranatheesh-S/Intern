import React, { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { RealisticCup } from './RealisticCup';

export const WeighingScale = ({ currentCupOnScale, mass }) => {
  const containerRef = useRef(null);
  
  // Cursor parallax tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  const springConfig = { damping: 30, stiffness: 200, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Parallax constraints: ±3 degrees, centered around 20 degrees X tilt
  const rotateY = useTransform(smoothMouseX, [0, 1], [-3, 3]);
  const rotateX = useTransform(smoothMouseY, [0, 1], [23, 17]); 

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Dynamic platform depth based on mass (max depth around 5, idle at 20)
  const targetZ = currentCupOnScale ? Math.max(8, 20 - (mass / 12)) : 20;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
        paddingTop: '40px' // Space for the cup
      }}
    >
      <motion.div 
        data-droptarget="scale"
        style={{
          position: 'relative',
          width: '260px',
          height: '200px',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY
        }}
      >
        {/* Soft Ambient Shadow Beneath the Machine */}
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-20px',
          right: '-20px',
          height: '60px',
          background: 'rgba(0,0,0,0.15)',
          borderRadius: '50%',
          filter: 'blur(20px)',
          transform: 'translateZ(-40px)',
          pointerEvents: 'none'
        }} />

        {/* Scale Body */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
          borderRadius: '24px',
          border: '1px solid #ffffff',
          boxShadow: '0 20px 0 #cbd5e1, 0 30px 40px rgba(0,0,0,0.3)', // Physical thickness and ambient shadow
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
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.15), 0 2px 0 rgba(255,255,255,0.9)',
            transform: 'translateZ(2px)' // Extrude slightly from body
          }}>
            
            {/* Recessed LCD Display */}
            <div style={{
              background: '#212529',
              padding: '5px',
              borderRadius: '8px',
              boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.6)',
              width: '135px'
            }}>
              <div style={{
                background: 'linear-gradient(180deg, #9ae6b4, #68d391)', // Soft green LCD
                borderRadius: '4px',
                padding: '8px 10px',
                boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.25)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                overflow: 'hidden'
              }}>
                <span style={{ 
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#1a202c',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 4px rgba(39, 103, 73, 0.4)'
                }}>
                  {mass ? `${mass.toFixed(2)} g` : '0.00 g'}
                </span>
              </div>
            </div>

            {/* Physical Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                background: 'linear-gradient(to bottom, #f97316, #ea580c)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '6px 10px',
                boxShadow: '0 4px 0 #c2410c, 0 5px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transform: 'translateY(0)',
                transition: 'all 0.1s'
              }} onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #c2410c, 0 1px 2px rgba(0,0,0,0.2)' }}
                 onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #c2410c, 0 5px 6px rgba(0,0,0,0.3)' }}>
                ON/TARE
              </button>
              <button style={{
                background: 'linear-gradient(to bottom, #e5e7eb, #9ca3af)',
                border: 'none',
                borderRadius: '6px',
                color: '#1f2937',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '6px 10px',
                boxShadow: '0 4px 0 #6b7280, 0 5px 6px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'all 0.1s'
              }} onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 0 0 #6b7280, 0 1px 2px rgba(0,0,0,0.2)' }}
                 onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 #6b7280, 0 5px 6px rgba(0,0,0,0.3)' }}>
                UNIT
              </button>
            </div>

          </div>
        </div>

        {/* Weighing Platform (Pan) */}
        <motion.div
          animate={{ 
            translateZ: targetZ, // Depress downwards based on weight
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            marginLeft: '-80px', // half of width
            width: '160px',
            height: '85px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f1f5f9, #cbd5e1)', // Metallic light gray
            border: '2px solid #ffffff',
            boxShadow: '0 6px 0 #94a3b8, 0 12px 15px rgba(0,0,0,0.25)', // Platform thickness
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Subtle inner pan bevel */}
          <div style={{
            width: '90%', height: '80%', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.08)'
          }} />
          
          {/* Container for the Cup, placed ON the pan.
              We rotateX counter to the dynamic container rotation, 
              so the cup stands straight up. */}
          <motion.div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            x: '-50%',
            y: '-50%',
            rotateX: useTransform(rotateX, v => -v), // counter-rotate
            transformStyle: 'preserve-3d' 
          }}>
            <AnimatePresence>
              {currentCupOnScale && (
                <motion.div
                  key={currentCupOnScale}
                  initial={{ y: -70, opacity: 0, scale: 1.05 }}
                  animate={{ y: -50, opacity: 1, scale: 1 }} // y:-50 to sit on the platform
                  exit={{ y: -30, opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
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
                    bottom: '-8px', 
                    left: '15%', 
                    right: '15%', 
                    height: '14px',
                    background: 'rgba(0,0,0,0.4)', 
                    borderRadius: '50%', 
                    filter: 'blur(3px)',
                    zIndex: -1
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
