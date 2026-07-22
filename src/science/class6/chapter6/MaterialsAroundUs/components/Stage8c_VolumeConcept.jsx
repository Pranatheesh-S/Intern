import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle, Lightbulb, Star, Box, Coffee, Droplet, GlassWater } from 'lucide-react';

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
    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Box size={24} color="#6366f1" />
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#4f46e5', margin: 0 }}>Phase 2: Understanding Volume</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Let's continue exploring why some containers hold more water than others.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Column - Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1: Why can't I fill the bottle completely? */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: '#3730a3', margin: '0 0 16px 0' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>1</span>
              Why can't I fill the bottle completely?
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              {/* Illustration Replacement */}
              <div style={{ flex: 1, display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '220px', height: '180px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0', flexShrink: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <img 
                    src="/images/volume_overflow.png" 
                    alt="Overflowing Bottle" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '50% 50% 50% 0', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.85rem', fontWeight: '500', maxWidth: '160px' }}>
                  Why was I not able to transfer the water from the jug into an empty water bottle completely?
                </div>
              </div>
              
              {/* Explanation */}
              <div style={{ flex: 1.2, background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  A bottle has limited space. Once it is full, no more water can be poured in.
                </p>
                <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  That is why I couldn't fill the bottle completely.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#4f46e5', fontSize: '0.85rem' }}>
                  <Info size={16} />
                  <span>Every container can hold only a certain amount of space.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Volume in Everyday Life */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: '#3730a3', margin: '0 0 16px 0' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>2</span>
              Volume in Everyday Life
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  Different bottles have different volumes.
                </p>
                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  The number written on the label shows how much liquid the bottle can hold.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                {/* Bottle 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '140px', background: '#e0f2fe', border: '3px solid #bae6fd', borderRadius: '16px 16px 6px 6px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '15px', width: '34px', height: '10px', background: '#94a3b8', borderRadius: '4px' }}></div>
                    <div style={{ position: 'absolute', top: '45px', left: '-3px', right: '-3px', height: '50px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #e2e8f0' }}>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', lineHeight: '1.2' }}>Drinking</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', lineHeight: '1.2' }}>Water</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: '900', color: '#0284c7', marginTop: '2px' }}>500 mL</span>
                    </div>
                  </div>
                </div>
                {/* Bottle 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '70px', height: '140px', background: 'white', border: '3px solid #e2e8f0', borderRadius: '16px 16px 6px 6px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', left: '15px', width: '34px', height: '10px', background: '#94a3b8', borderRadius: '4px' }}></div>
                    <div style={{ position: 'absolute', top: '45px', left: '-3px', right: '-3px', height: '50px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid #e2e8f0' }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>Milk</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: '900', color: '#475569', marginTop: '4px' }}>500 mL</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1.2, background: '#f5f3ff', padding: '16px', borderRadius: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ background: '#ddd6fe', color: '#6d28d9', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', flexShrink: 0, marginTop: '2px' }}>0</div>
                  <p style={{ margin: '0 0 12px 0', color: '#4c1d95', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    Even though both bottles contain different liquids, the label shows they have the same volume.
                  </p>
                </div>
                <div style={{ color: '#6d28d9', fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'center' }}>
                  Same volume, different material!
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Explore Different Volumes */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', color: '#3730a3', margin: '0 0 8px 0' }}>
              <span style={{ background: '#e0e7ff', color: '#4f46e5', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>3</span>
              Explore Different Volumes
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.9rem' }}>Click on each item to see its volume.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              
              {/* Tea Cup */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <Coffee size={48} color="#f59e0b" strokeWidth={1.5} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Tea Cup</div>
                  <div style={{ color: '#4f46e5', fontWeight: 'bold', height: '20px', marginTop: '4px' }}>
                    {volumesRevealed.teaCup ? '150 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.teaCup ? (
                  <button onClick={() => handleReveal('teaCup')} style={{ background: 'white', border: '1px solid #c7d2fe', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '26px' }}></div>
                )}
              </div>

              {/* Soup Bowl */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '56px', height: '30px', background: '#86efac', borderRadius: '0 0 30px 30px', border: '2px solid #4ade80', marginTop: '18px' }}></div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Soup Bowl</div>
                  <div style={{ color: '#4f46e5', fontWeight: 'bold', height: '20px', marginTop: '4px' }}>
                    {volumesRevealed.soupBowl ? '300 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.soupBowl ? (
                  <button onClick={() => handleReveal('soupBowl')} style={{ background: 'white', border: '1px solid #c7d2fe', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '26px' }}></div>
                )}
              </div>

              {/* Water Glass */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '48px', border: '2px solid #94a3b8', borderRadius: '2px 2px 6px 6px', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: '#bae6fd', borderRadius: '0 0 4px 4px' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Water Glass</div>
                  <div style={{ color: '#4f46e5', fontWeight: 'bold', height: '20px', marginTop: '4px' }}>
                    {volumesRevealed.waterGlass ? '250 mL' : '?'}
                  </div>
                </div>
                {!volumesRevealed.waterGlass ? (
                  <button onClick={() => handleReveal('waterGlass')} style={{ background: 'white', border: '1px solid #c7d2fe', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '26px' }}></div>
                )}
              </div>

              {/* Bucket */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '56px', height: '48px', background: '#38bdf8', borderRadius: '4px', border: '2px solid #0284c7', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '-5px', right: '-5px', height: '20px', border: '2px solid #0f172a', borderRadius: '50%', clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' }}></div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#334155' }}>Bucket</div>
                  <div style={{ color: '#4f46e5', fontWeight: 'bold', height: '20px', marginTop: '4px' }}>
                    {volumesRevealed.bucket ? '10 L' : '?'}
                  </div>
                </div>
                {!volumesRevealed.bucket ? (
                  <button onClick={() => handleReveal('bucket')} style={{ background: 'white', border: '1px solid #c7d2fe', color: '#4f46e5', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '500' }}>View Volume</button>
                ) : (
                  <div style={{ height: '26px' }}></div>
                )}
              </div>

            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 16px', borderRadius: '8px', color: '#475569', fontSize: '0.85rem' }}>
              <Info size={16} color="#6366f1" />
              Different containers can hold different amounts of liquid. That amount is called their <strong>volume</strong>.
            </div>

          </div>

        </div>
        
        {/* Right Column - Sidebar */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Key Takeaway */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', margin: '0 0 16px 0', fontSize: '1.05rem' }}>
              <Star size={20} /> Key Takeaway
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>All materials occupy space.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>The space occupied by an object or substance is called its <strong>volume</strong>.</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>More water means more space (higher <strong>volume</strong>).</span>
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.4' }}>Different containers can hold different amounts.</span>
              </li>
            </ul>
          </div>

          {/* Did You Know? */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706', margin: '0 0 12px 0', fontSize: '1.05rem' }}>
              <Lightbulb size={20} /> Did You Know?
            </h4>
            <p style={{ margin: '0 0 16px 0', color: '#92400e', fontSize: '0.85rem', lineHeight: '1.5' }}>
              Volume is usually measured in millilitres (mL) or litres (L).
            </p>
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', color: '#b45309', fontWeight: 'bold', fontSize: '0.9rem' }}>
              1 L = 1000 mL
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', opacity: 0.2 }}>
               <svg width="40" height="50" viewBox="0 0 40 50">
                  <path d="M10 0 L30 0 L35 15 L35 45 C35 48, 32 50, 29 50 L11 50 C8 50, 5 48, 5 45 L5 15 Z" fill="none" stroke="#d97706" strokeWidth="2" />
                  <path d="M35 20 C42 20, 42 40, 35 40" fill="none" stroke="#d97706" strokeWidth="2" />
               </svg>
            </div>
          </div>
          {/* Bottom spacer for sidebar since button is removed */}
          <div style={{ flex: 1 }}></div>

        </div>
      </div>
    </div>
  );
}
