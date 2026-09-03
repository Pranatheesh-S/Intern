import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RealisticCup } from './RealisticCup';

export const WeighingScale = ({ currentCupOnScale, mass, isHovered }) => {
  const [displayMass, setDisplayMass] = useState(0);
  const [isSettling, setIsSettling] = useState(false);
  const prevCupRef = useRef(null);

  // Digital weighing settling simulation (rapid realistic sensor sampling)
  useEffect(() => {
    if (!currentCupOnScale || mass === undefined || mass === 0) {
      setDisplayMass(0);
      setIsSettling(false);
      prevCupRef.current = null;
      return;
    }

    // Only run settling when a new cup is placed
    if (prevCupRef.current !== currentCupOnScale) {
      prevCupRef.current = currentCupOnScale;
      setIsSettling(true);

      const target = mass;
      // 4-step rapid sensor stabilization sequence (~550ms total)
      const step1 = parseFloat((target * 0.42 + (Math.random() * 4 - 2)).toFixed(2));
      const step2 = parseFloat((target * 0.84 + (Math.random() * 2 - 1)).toFixed(2));
      const step3 = parseFloat((target * 0.98 + (Math.random() * 0.8 - 0.4)).toFixed(2));

      setDisplayMass(step1);

      const t1 = setTimeout(() => {
        setDisplayMass(step2);
      }, 160);

      const t2 = setTimeout(() => {
        setDisplayMass(step3);
      }, 340);

      const t3 = setTimeout(() => {
        setDisplayMass(target);
        setIsSettling(false);
      }, 550);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setDisplayMass(mass);
    }
  }, [currentCupOnScale, mass]);

  // Determine physical depression depth based on mass (Pebbles compresses ~4.5px, Water ~2.5px)
  const getDepressionY = () => {
    if (!currentCupOnScale) return 0;
    if (currentCupOnScale === 'pebbles') return 4.5;
    if (currentCupOnScale === 'sand') return 3.5;
    return 2.5; // water
  };

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
        background: 'radial-gradient(ellipse at 50% -20%, whitefff 0%, #f2f0ec 50%, #e5e2db 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* Subtle desk texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.15,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
        pointerEvents: 'none'
      }} />

      {/* Scale Assembly */}
      <div style={{ position: 'relative', width: '380px', height: '260px', marginTop: '20px' }}>
        
        {/* Invisible expanded drop target for extremely forgiving dropping */}
        <div 
          data-droptarget="scale"
          style={{
            position: 'absolute',
            top: '-40px', left: '50%', transform: 'translateX(-50%)',
            width: '320px', height: '160px', 
            borderRadius: '50%',
            background: 'transparent',
            zIndex: 20 
          }}
        />

        {/* Ambient shadow on desk */}
        <div style={{
          position: 'absolute', bottom: '-10px', left: '30px', right: '30px', height: '30px',
          background: 'rgba(0,0,0,0.2)', borderRadius: '50%', filter: 'blur(10px)'
        }} />

        {/* Scale Body Base (White Plastic) - Stationary Physical Housing */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(145deg, #f2f3f5 0%, #e6e8ea 45%, #d1d5d8 100%)',
          borderRadius: '40px 40px 50px 50px',
          boxShadow: 'inset 0 4px 8px rgba(255,255,255,1), inset 0 -15px 30px rgba(0,0,0,0.08), 0 12px 0 #9ea4aa, 0 20px 25px rgba(0,0,0,0.5)',
          border: '1px solid #c2c7cc',
          overflow: 'hidden'
        }}>
          {/* Subtle micro-surface texture for molded plastic */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            opacity: 0.12, mixBlendMode: 'multiply', pointerEvents: 'none'
          }} />
          
          {/* Molded seams/edge highlights */}
          <div style={{
            position: 'absolute', inset: '4px',
            borderRadius: '36px 36px 46px 46px',
            boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.7)',
            pointerEvents: 'none'
          }} />
          
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
                background: 'linear-gradient(135deg, #7c8f82 0%, #9baea1 100%)',
                borderRadius: '6px',
                border: '3px solid #1a1a1a',
                boxShadow: 'inset 4px 6px 12px rgba(0,0,0,0.6), 0 2px 2px rgba(255,255,255,0.7)',
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                padding: '10px 15px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                 {/* Internal LCD drop shadow for depth */}
                 <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 8px 10px rgba(0,0,0,0.2)', pointerEvents: 'none' }} />

                 {/* LCD Glass reflection */}
                 <div style={{ position: 'absolute', top: '-10%', left: '-10%', right: '-10%', height: '55%', background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)', transform: 'rotate(-2deg)', pointerEvents: 'none' }} />
                 
                 {/* Stabilizing indicator dot */}
                 {isSettling && (
                   <div style={{
                     position: 'absolute',
                     left: '14px', top: '14px',
                     width: '6px', height: '6px',
                     borderRadius: '50%',
                     background: '#2d3830',
                     opacity: 0.7
                   }} />
                 )}

                 {/* Digit reading - resets strictly to 0.00 g when empty */}
                 <span style={{ 
                   fontFamily: "'Courier New', Courier, monospace",
                   fontSize: '2.5rem', 
                   color: '#1a1f1c', 
                   fontWeight: 'bold',
                   letterSpacing: '1px',
                   zIndex: 1,
                   textShadow: '0px 0px 1px rgba(0,0,0,0.3)',
                   whiteSpace: 'nowrap'
                 }}>
                   {displayMass ? `${displayMass.toFixed(2)} g` : '0.00 g'}
                 </span>
              </div>

              {/* Physical Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button style={{
                  width: '85px', height: '28px',
                  background: 'linear-gradient(180deg, #e53935 0%, #b71c1c 100%)',
                  border: '1px solid #4a0000', borderRadius: '4px',
                  color: 'white', fontSize: '11px', fontWeight: 'bold',
                  boxShadow: '0 4px 0 #5c0000, 0 6px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
                  cursor: 'default', fontFamily: 'Arial, sans-serif',
                  textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                }}>ON/TARE</button>
                <button style={{
                  width: '85px', height: '28px',
                  background: 'linear-gradient(180deg, #f5f5f5 0%, #d4d4d4 100%)',
                  border: '1px solid #7a7a7a', borderRadius: '4px',
                  color: '#222', fontSize: '11px', fontWeight: 'bold',
                  boxShadow: '0 4px 0 #8f8f8f, 0 6px 6px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
                  cursor: 'default', fontFamily: 'Arial, sans-serif',
                  textShadow: '0 1px 0 rgba(255,255,255,0.8)'
                }}>UNIT</button>
              </div>
            </div>
          </div>
        </div>

        {/* Visible Support Stem / Connection linking Pan to Machine Body */}
        <div style={{
          position: 'absolute',
          top: '25px', left: '50%', transform: 'translateX(-50%)',
          width: '120px', height: '40px',
          background: 'linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 15%, #2a2a2a 50%, #5a5a5a 85%, #1a1a1a 100%)',
          borderRadius: '50%',
          boxShadow: 'inset 0 10px 10px rgba(0,0,0,0.9), 0 5px 10px rgba(0,0,0,0.8)',
          borderBottom: '2px solid #333'
        }}>
          <div style={{ position: 'absolute', bottom: '-20px', left: '-15%', right: '-15%', height: '40px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', filter: 'blur(10px)', zIndex: -1 }} />
        </div>

        {/* The Stainless Steel Pan */}
        <motion.div 
          animate={{ 
            y: getDepressionY()
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          style={{
            position: 'absolute',
            top: '-15px', left: '50%', x: '-50%',
            width: '260px', height: '110px', 
            background: 'linear-gradient(135deg, #d3d8db 0%, #aab5bc 40%, #e6eaec 60%, #8b99a3 100%)',
            borderRadius: '50%',
            border: isHovered ? '2px solid var(--lesson-success)' : '1.5px solid whitefff',
            borderBottom: '3px solid #89959e',
            boxShadow: isHovered 
              ? 'inset 0 0 25px rgba(0,0,0,0.15), 0 12px 15px rgba(0,0,0,0.5), 0 0 16px rgba(217, 119, 6, 0.35)' 
              : 'inset 0 0 25px rgba(0,0,0,0.15), 0 12px 15px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border 0.2s, box-shadow 0.2s'
          }}
        >
           {/* Realistic Stainless Steel Plate */}
           <div style={{
             position: 'absolute', inset: '4px',
             borderRadius: '50%',
             background: 'linear-gradient(160deg, #d8dde2 0%, #a6b2ba 40%, #c4cbd1 60%, #87939c 100%)',
             boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(255,255,255,0.6), 0 1px 1px rgba(255,255,255,0.9)',
             overflow: 'hidden'
           }}>
             {/* Micro-brushed metal texture noise */}
             <div style={{
               position: 'absolute', inset: 0,
               backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.5 0.1\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
               opacity: 0.12, mixBlendMode: 'multiply', transform: 'rotate(-10deg) scale(1.5)', pointerEvents: 'none'
             }} />
             
             {/* Broad realistic reflection */}
             <div style={{
               position: 'absolute', inset: 0,
               borderRadius: '50%',
               background: 'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0) 60%)',
               mixBlendMode: 'screen'
             }} />
           </div>
           
           {/* Inner pan recession */}
           <div style={{
             position: 'absolute', inset: '18px',
             borderRadius: '50%',
             background: 'linear-gradient(145deg, #aab2b8 0%, #c8ced4 50%, #89949d 100%)',
             boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.35), 0 1px 1px rgba(255,255,255,0.7)',
             pointerEvents: 'none',
             overflow: 'hidden'
           }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 60%)',
              }} />
           </div>
           
           {/* Anchor point: Renders ONLY currentCupOnScale if present */}
           <div 
             style={{
               position: 'absolute', top: '50%', left: '50%',
               width: '1px', height: '1px'
             }}
           >
             <AnimatePresence mode="wait">
               {currentCupOnScale && (
                 <motion.div
                   key={currentCupOnScale}
                   initial={{ opacity: 0, y: -8 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, transition: { duration: 0.1 } }}
                   transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                   style={{
                     position: 'absolute',
                     bottom: '0px',
                     left: '-40px',
                     width: '80px', height: '100px',
                     zIndex: 10
                   }}
                 >
                    <RealisticCup material={currentCupOnScale} velocityX={0} />
                    
                    {/* Realistic Grounding Contact Shadow on the metal pan */}
                    <motion.div 
                      initial={{ opacity: 0.3, scale: 0.9 }}
                      animate={{ opacity: 0.7, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute', bottom: '-4px', left: '12%', right: '12%', height: '8px',
                        background: 'rgba(0,0,0,0.65)', borderRadius: '50%', filter: 'blur(3px)', zIndex: -1
                      }} 
                    />
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </motion.div>
      </div>
    </div>
  );
};
