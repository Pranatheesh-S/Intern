import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, Lightbulb, Star, Box, Coffee, Droplet, GlassWater, ArrowRight } from 'lucide-react';

export default function Stage8c_VolumeConcept({ onComplete, addXp }) {
  const [volumesRevealed, setVolumesRevealed] = useState({
    teaCup: false,
    soupBowl: false,
    waterGlass: false,
    bucket: false
  });

  const handleReveal = (item) => {
    if (!volumesRevealed[item]) {
      setVolumesRevealed(prev => ({ ...prev, [item]: true }));
      addXp(20);
    }
  };

  const allRevealed = Object.values(volumesRevealed).every(v => v);
  
  React.useEffect(() => {
    if (allRevealed && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allRevealed, onComplete]);

  return (
    <div style={{ padding: '16px 24px', background: 'var(--surface)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflow: 'hidden' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <Box size={22} color="var(--accent)" />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)', margin: 0 }}>Phase 2: Understanding Volume</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '2px 0 0 0' }}>Let's find out how much space different containers can hold.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flex: 1, minHeight: 0 }}>
        
        {/* Left Column - Main Content */}
        <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Section 1: 01 - WHY? */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--text-heading)', margin: '0 0 10px 0' }}>
              <span style={{ background: 'var(--surface)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>01 &mdash; WHY?</span>
              Why can't I fill the bottle completely?
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
              {/* Illustration */}
              <div style={{ width: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, display: 'flex' }}>
                <img src="/images/volume_overflow.png" alt="Overflowing Bottle" style={{ width: '100%', objectFit: 'cover' }} />
              </div>
              
              {/* Explanation */}
              <div style={{ flex: 1, background: 'var(--surface)', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: '#92400e', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '0.5px' }}>WHY CAN'T I ADD MORE WATER?</div>
                <p style={{ margin: '0 0 2px 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>The bottle has limited space.</p>
                <p style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Once it is full, no more water can fit.</p>
                <div style={{ background: '#fef3c7', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.9rem', fontWeight: '500' }}>
                  That amount of space is called <strong style={{ color: 'var(--accent)', fontSize: '1.05rem', textTransform: 'uppercase' }}>VOLUME</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 02 - UNDERSTAND */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--text-heading)', margin: '0 0 10px 0' }}>
              <span style={{ background: 'var(--surface)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>02 &mdash; UNDERSTAND</span>
              Volume in Everyday Life
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ flex: 1.2 }}>
                <p style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  Different containers can hold different amounts of liquid.
                </p>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  The amount a container can hold is described using <strong>volume</strong>.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flex: 1, justifyContent: 'center' }}>
                {/* Bottle 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '90px', background: 'var(--surface)', border: '2px solid var(--surface)', borderRadius: '10px 10px 4px 4px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-6px', left: '10px', width: '26px', height: '6px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
                    <div style={{ position: 'absolute', bottom: '0px', left: '-2px', right: '-2px', height: '40px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)', borderBottom: 'none' }}>
                      <span style={{ fontSize: '0.55rem', fontWeight: 'bold', lineHeight: '1.1' }}>Water</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--accent)' }}>500 mL</span>
                    </div>
                  </div>
                </div>
                {/* Bottle 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '90px', background: 'white', border: '2px solid var(--border)', borderRadius: '10px 10px 4px 4px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-6px', left: '10px', width: '26px', height: '6px', background: 'var(--text-muted)', borderRadius: '2px' }}></div>
                    <div style={{ position: 'absolute', bottom: '0px', left: '-2px', right: '-2px', height: '40px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border)', borderBottom: 'none' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>Milk</span>
                      <span style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-secondary)' }}>500 mL</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1.2, background: 'var(--accent-bg)', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>
                  Same volume,<br/>different material!
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 03 - EXPLORE */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '12px 16px', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexShrink: 0 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: 'var(--text-heading)', margin: '0 0 6px 0' }}>
                <span style={{ background: 'var(--surface)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>03 &mdash; EXPLORE</span>
                Explore Different Volumes
              </h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click each container to discover how much it can hold.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              
              {/* Tea Cup */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <Coffee size={36} color="#f59e0b" strokeWidth={1.5} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Tea Cup</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold', height: '18px', fontSize: '0.85rem' }}>
                    {volumesRevealed.teaCup ? '150 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.teaCup ? (
                  <button onClick={() => handleReveal('teaCup')} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '22px' }}></div>
                )}
              </div>

              {/* Soup Bowl */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <div style={{ width: '44px', height: '24px', background: '#86efac', borderRadius: '0 0 24px 24px', border: '2px solid #4ade80', marginTop: '6px' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Soup Bowl</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold', height: '18px', fontSize: '0.85rem' }}>
                    {volumesRevealed.soupBowl ? '300 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.soupBowl ? (
                  <button onClick={() => handleReveal('soupBowl')} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '22px' }}></div>
                )}
              </div>

              {/* Water Glass */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <div style={{ width: '30px', height: '36px', border: '2px solid var(--text-muted)', borderRadius: '2px 2px 4px 4px', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '24px', background: 'var(--surface)', borderRadius: '0 0 2px 2px' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Water Glass</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold', height: '18px', fontSize: '0.85rem' }}>
                    {volumesRevealed.waterGlass ? '250 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.waterGlass ? (
                  <button onClick={() => handleReveal('waterGlass')} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '22px' }}></div>
                )}
              </div>

              {/* Bucket */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <div style={{ width: '44px', height: '36px', background: 'var(--accent)', borderRadius: '4px', border: '2px solid var(--accent)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-8px', left: '-4px', right: '-4px', height: '14px', border: '2px solid var(--text-primary)', borderRadius: '50%', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'var(--text-primary)' }}>Bucket</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold', height: '18px', fontSize: '0.85rem' }}>
                    {volumesRevealed.bucket ? '10 L' : '?'}
                  </div>
                </div>
                {!volumesRevealed.bucket ? (
                  <button onClick={() => handleReveal('bucket')} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--accent)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '22px' }}></div>
                )}
              </div>

            </div>
          </div>

        </div>
        
        {/* Right Column - Sidebar */}
        <div style={{ flex: '1', minWidth: '240px', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Key Takeaway */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', margin: '0 0 12px 0', fontSize: '1rem' }}>
              <Star size={18} /> Key Takeaway
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <CheckCircle size={14} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.3' }}>Volume is the amount of space occupied by an object or substance.</span>
              </li>
              <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <CheckCircle size={14} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.3' }}>More space &rarr; greater <strong>volume</strong>.</span>
              </li>
              <li style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                <CheckCircle size={14} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.3' }}>Different containers can hold different amounts.</span>
              </li>
            </ul>
          </div>

          {/* Did You Know? */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', margin: '0 0 8px 0', fontSize: '1rem' }}>
              <Lightbulb size={18} /> Did You Know?
            </h4>
            <p style={{ margin: '0 0 10px 0', color: '#92400e', fontSize: '0.85rem', lineHeight: '1.4', position: 'relative', zIndex: 1 }}>
              Volume is usually measured in millilitres (mL) or litres (L).
            </p>
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '6px 12px', borderRadius: '6px', alignSelf: 'flex-start', color: '#b45309', fontWeight: 'bold', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
              1 L = 1000 mL
            </div>
            
            <div style={{ position: 'absolute', bottom: '-4px', right: '4px', opacity: 0.15, zIndex: 0 }}>
               <svg width="32" height="40" viewBox="0 0 40 50">
                  <path d="M10 0 L30 0 L35 15 L35 45 C35 48, 32 50, 29 50 L11 50 C8 50, 5 48, 5 45 L5 15 Z" fill="none" stroke="#d97706" strokeWidth="2" />
                  <path d="M35 20 C42 20, 42 40, 35 40" fill="none" stroke="#d97706" strokeWidth="2" />
               </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
