import React, { useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
        background: 'linear-gradient(180deg, #3a3b3d 0%, #2a2a2c 40%, #1a1a1b 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
      }}
    >
      {/* Horizontal Wall Seam for background depth */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: 0, right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #1f1f21, #3f4044, #1f1f21)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }} />

      {/* Scale Assembly */}
      <div style={{ position: 'relative', width: '380px', height: '260px', marginTop: '20px' }}>
        
        {/* Ambient shadow on desk */}
        <div style={{
          position: 'absolute', bottom: '-20px', left: '20px', right: '20px', height: '50px',
          background: 'rgba(0,0,0,0.8)', borderRadius: '50%', filter: 'blur(15px)'
        }} />

        {/* Scale Body Base (White Plastic) */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center 30%, #ffffff 0%, #e6e6e6 60%, #cccccc 100%)',
          borderRadius: '40px 40px 50px 50px',
          boxShadow: 'inset 0 4px 10px white, inset 0 -15px 20px rgba(0,0,0,0.1), 0 15px 0 #b3b3b3, 0 25px 20px rgba(0,0,0,0.5)',
          border: '1px solid #d9d9d9'
        }}>
          
          {/* Front Bevel/Panel Area */}
          <div style={{
            position: 'absolute', bottom: '15px', left: '5%', right: '5%', height: '110px',
            background: 'linear-gradient(180deg, #eeeeee 0%, #d4d4d4 100%)',
            borderRadius: '10px 10px 30px 30px',
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -2px 5px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 15px'
          }}>
            {/* Branding */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 10px', marginBottom: '10px' }}>
              <span style={{ color: '#c8102e', fontWeight: '900', fontSize: '15px', letterSpacing: '1px', fontFamily: 'Arial, sans-serif' }}>OHAUS</span>
              <span style={{ color: '#444', fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px', fontFamily: 'Arial, sans-serif' }}>SCOUT</span>
            </div>

            {/* LCD and Buttons Row */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
              
              {/* LCD Screen */}
              <div style={{
                width: '210px', height: '65px',
                background: '#8a9b8e', // off-green LCD background
                borderRadius: '4px',
                border: '2px solid #a3a3a3',
                boxShadow: 'inset 2px 4px 10px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.8)',
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                padding: '10px 15px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                 {/* LCD Glass reflection */}
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)', pointerEvents: 'none' }} />
                 
                 {/* Digit reading */}
                 <span style={{ 
                   fontFamily: "'Courier New', Courier, monospace", // Fallback digital-like font
                   fontSize: '2.5rem', 
                   color: '#1a1f1c', 
                   fontWeight: 'bold',
                   letterSpacing: '1px',
                   zIndex: 1,
                   textShadow: '1px 1px 0px rgba(255,255,255,0.1)'
                 }}>
                   {mass ? `${mass.toFixed(2)} g` : '0.00 g'}
                 </span>
              </div>

              {/* Physical Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  width: '85px', height: '28px',
                  background: 'linear-gradient(180deg, #d32f2f, #b71c1c)',
                  border: '1px solid #7f0000', borderRadius: '4px',
                  color: 'white', fontSize: '11px', fontWeight: 'bold',
                  boxShadow: '0 3px 0 #7f0000, 0 4px 5px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.4)',
                  cursor: 'default',
                  fontFamily: 'Arial, sans-serif'
                }}>ON/TARE</button>
                <button style={{
                  width: '85px', height: '28px',
                  background: 'linear-gradient(180deg, #e0e0e0, #bdbdbd)',
                  border: '1px solid #9e9e9e', borderRadius: '4px',
                  color: '#333', fontSize: '11px', fontWeight: 'bold',
                  boxShadow: '0 3px 0 #888, 0 4px 5px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.8)',
                  cursor: 'default',
                  fontFamily: 'Arial, sans-serif'
                }}>UNIT</button>
              </div>
            </div>
          </div>
        </div>

        {/* The Stainless Steel Pan (Ellipse perspective) */}
        <div style={{
          position: 'absolute',
          top: '-15px', left: '50%', transform: 'translateX(-50%)',
          width: '260px', height: '110px', 
          background: 'linear-gradient(135deg, #e6e9ec 0%, #b8c1c8 40%, #f5f7f9 60%, #9ca8b2 100%)',
          borderRadius: '50%',
          border: '1px solid #fff',
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1), 0 5px 0 #89959e, 0 12px 15px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
           {/* Inner pan recession */}
           <div style={{
             position: 'absolute', inset: '6px',
             borderRadius: '50%',
             background: 'linear-gradient(135deg, #d1d8df 0%, #e6e9ec 50%, #b8c1c8 100%)',
             boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.2), 0 1px 1px rgba(255,255,255,0.8)'
           }} />
           
           {/* Purely functional, invisible drop target and anchor point */}
           <div 
             data-droptarget="scale"
             style={{
               position: 'absolute', top: '50%', left: '50%',
               width: '1px', height: '1px'
             }}
           >
             <AnimatePresence>
               {currentCupOnScale && (
                 <motion.div
                   key={currentCupOnScale}
                   layoutId={`cup-transition-${currentCupOnScale}`}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   transition={{ type: 'spring', stiffness: 600, damping: 40 }}
                   style={{
                     position: 'absolute',
                     bottom: '0px', // Bottom perfectly touches the pan center (y=0)
                     left: '-40px', // Center horizontally (width is 80px)
                     width: '80px', height: '100px',
                     zIndex: 10
                   }}
                 >
                    <RealisticCup material={currentCupOnScale} />
                    
                    {/* Realistic Contact Shadow on the metal pan */}
                    <div style={{
                      position: 'absolute', bottom: '-4px', left: '15%', right: '15%', height: '8px',
                      background: 'rgba(0,0,0,0.5)', borderRadius: '50%', filter: 'blur(3px)', zIndex: -1
                    }} />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};
