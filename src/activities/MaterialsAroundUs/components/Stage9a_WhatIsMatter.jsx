import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Scale, Box, HelpCircle, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

export default function Stage9a_WhatIsMatter({ onComplete, addXp }) {
  const [airRevealed, setAirRevealed] = useState(false);
  const [plasticRevealed, setPlasticRevealed] = useState(false);

  useEffect(() => {
    if (airRevealed && plasticRevealed) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [airRevealed, plasticRevealed, onComplete]);

  return (
    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
        <Box size={28} color="#059669" />
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#047857', margin: 0 }}>6.4 What is Matter?</h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', margin: '4px 0 0 0' }}>
            Anything that <strong>occupies space</strong> and <strong>has mass</strong> is called <strong>matter</strong>.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Column: Air & Units */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Is Air Matter? */}
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ background: '#fef9c3', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #fde047' }}>
              <HelpCircle size={20} color="#a16207" />
              <h3 style={{ margin: 0, color: '#854d0e', fontSize: '1.1rem' }}>Is Air Matter?</h3>
            </div>
            
            <div style={{ padding: '20px' }}>
              {!airRevealed ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Annie&backgroundColor=transparent" alt="Thinking Girl" style={{ width: '80px', height: '80px' }} />
                  <p style={{ textAlign: 'center', color: '#475569', margin: 0, fontSize: '0.95rem' }}>We can't see air. Does it occupy space and have mass?</p>
                  <button 
                    onClick={() => { setAirRevealed(true); addXp(20); }}
                    style={{ background: '#eab308', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    Investigate Air <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f0fdfa', padding: '12px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                    <Wind size={24} color="#0d9488" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#0f766e' }}>Air occupies space:</strong>
                      <div style={{ color: '#115e59', fontSize: '0.9rem', marginTop: '4px' }}>When you blow into a balloon, it expands because air fills the space inside it!</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', background: '#f0fdfa', padding: '12px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
                    <Scale size={24} color="#0d9488" style={{ flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#0f766e' }}>Air has mass:</strong>
                      <div style={{ color: '#115e59', fontSize: '0.9rem', marginTop: '4px' }}>An inflated balloon is slightly heavier than an empty one!</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px' }}>
                    Yes! Air is matter.
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Units of Matter */}
          <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '20px', border: '1px solid #bbf7d0' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#166534', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={20} /> Measuring Matter
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '4px' }}>Mass (Quantity of matter)</div>
                <div style={{ background: 'white', padding: '10px 16px', borderRadius: '8px', border: '1px solid #dcfce3', color: '#166534', fontSize: '0.9rem' }}>
                  Measured in <strong>Kilogram (kg)</strong> and <strong>Gram (g)</strong>.
                </div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: '#15803d', marginBottom: '4px' }}>Volume (Space occupied)</div>
                <div style={{ background: 'white', padding: '10px 16px', borderRadius: '8px', border: '1px solid #dcfce3', color: '#166534', fontSize: '0.9rem' }}>
                  Measured in <strong>Litre (L)</strong>, <strong>Millilitre (mL)</strong>, and <strong>Cubic Metre (m³)</strong>.
                  <div style={{ background: '#dcfce3', padding: '6px', borderRadius: '4px', marginTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    1 m³ = 1000 L
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Right Column: Plastic Boon or Bane */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#dcfce3', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #bbf7d0' }}>
              <HelpCircle size={20} color="#16a34a" />
              <h3 style={{ margin: 0, color: '#15803d', fontSize: '1.1rem' }}>Think it over!</h3>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <p style={{ margin: '0 0 20px 0', color: '#334155', fontSize: '1rem', lineHeight: '1.5', textAlign: 'center' }}>
                Can you think about what changes the invention of plastic brought to humans?
                <br/><br/><strong>Is it a boon (blessing) or a bane (curse)?</strong>
              </p>

              {!plasticRevealed ? (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <button 
                    onClick={() => { setPlasticRevealed(true); addXp(20); }}
                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    Analyze Plastic
                  </button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 'bold', marginBottom: '8px' }}>
                      <CheckCircle size={18} /> Boon (Helpful)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      <li>Extremely versatile and can be molded into any shape.</li>
                      <li>Lightweight, waterproof, and durable.</li>
                      <li>Used in life-saving medical devices and technology.</li>
                    </ul>
                  </div>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 'bold', marginBottom: '8px' }}>
                      <AlertTriangle size={18} /> Bane (Harmful)
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#b91c1c', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      <li>Non-biodegradable; stays in the environment for hundreds of years.</li>
                      <li>Pollutes oceans and harms marine life.</li>
                      <li>Releases toxic gases when burned.</li>
                    </ul>
                  </div>

                </motion.div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
