import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sliders } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage3_MicroscopeObservation({ onComplete, addXp }) {
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3', { volume: 0.5 });
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const [coarse, setCoarse] = useState(0);
  const [fine, setFine] = useState(0);
  const [light, setLight] = useState(20);
  const [isClear, setIsClear] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);

  // Target values for perfect focus
  const TARGET_COARSE = 70;
  const TARGET_FINE = 45;
  const TARGET_LIGHT = 80;

  // Calculate visual properties based on slider distance to targets
  const coarseDiff = Math.abs(coarse - TARGET_COARSE);
  const fineDiff = Math.abs(fine - TARGET_FINE);
  const lightDiff = Math.abs(light - TARGET_LIGHT);

  const blurPx = (coarseDiff * 0.4) + (fineDiff * 0.1);
  const brightness = light < 10 ? 0.2 : (light / 100) + 0.2; // 0.2 to 1.2
  
  useEffect(() => {
    // If it's close enough to target, consider it clear
    if (coarseDiff < 5 && fineDiff < 10 && lightDiff < 15) {
      if (!isClear) {
        setIsClear(true);
        if (!hasAwarded) {
          playSuccess();
          addXp(20);
          setHasAwarded(true);
        }
      }
    } else {
      setIsClear(false);
    }
  }, [coarse, fine, light, isClear, hasAwarded, coarseDiff, fineDiff, lightDiff, playSuccess, addXp]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Let's Observe the Cells</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
          Your slide is on the stage. Use the microscope knobs to focus the image and adjust the lighting until you can clearly see the onion cells.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, alignItems: 'center' }}>
        
        {/* Microscope Viewport */}
        <div style={{ 
          flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: 'var(--surface)', borderRadius: '16px', padding: '1rem',
          boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--border)'
        }}>
          <div style={{ 
            width: '400px', height: '400px', borderRadius: '50%', background: 'black', 
            border: '10px solid #334155', position: 'relative', overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            {/* The Microscope Image */}
            <div style={{
              width: '100%', height: '100%',
              backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/4/48/Onion_cells.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `blur(${blurPx}px) brightness(${brightness})`,
              transition: 'filter 0.1s ease-out'
            }} />
            
            {/* Crosshair (optional) */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.3)' }} />
          </div>
        </div>

        {/* Controls */}
        <div style={{ 
          width: '320px', background: 'var(--bg)', padding: '2rem', borderRadius: '16px', 
          border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          display: 'flex', flexDirection: 'column', gap: '2rem'
        }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-heading)' }}>
            <Sliders size={20} /> Microscope Controls
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                <span>Coarse Adjustment</span>
                <span>{coarse}</span>
              </label>
              <input 
                type="range" min="0" max="100" value={coarse} 
                onChange={(e) => { setCoarse(parseInt(e.target.value)); playClick(); }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Moves the stage significantly to find the image.</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                <span>Fine Adjustment</span>
                <span>{fine}</span>
              </label>
              <input 
                type="range" min="0" max="100" value={fine} 
                onChange={(e) => { setFine(parseInt(e.target.value)); playClick(); }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sharpens the image to see fine details.</span>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                <span>Light Intensity (Diaphragm)</span>
                <span>{light}</span>
              </label>
              <input 
                type="range" min="0" max="100" value={light} 
                onChange={(e) => { setLight(parseInt(e.target.value)); playClick(); }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Controls the amount of light passing through.</span>
            </div>

          </div>

          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: isClear ? 1 : 0, height: isClear ? 'auto' : 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--success)', textAlign: 'center', marginBottom: '1rem' }}>
              <CheckCircle size={24} style={{ marginBottom: '0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem 0' }}>Congratulations!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>You have successfully focused the microscope.</p>
            </div>
            <button className="primary" onClick={onComplete} style={{ width: '100%', padding: '1rem', borderRadius: '30px' }}>
              Explore the Cell <ArrowRight size={18} />
            </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
