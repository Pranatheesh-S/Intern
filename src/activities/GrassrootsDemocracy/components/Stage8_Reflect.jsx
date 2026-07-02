import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Brain, Map as MapIcon, Users, Building, Shield, Home, Check } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage7_Reflect({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [done, setDone] = useState(false);
  const [activeConcept, setActiveConcept] = useState(null);
  const [discoveredConcepts, setDiscoveredConcepts] = useState([]);

  const concepts = [
    { id: '1', title: 'Gram Sabha', icon: Users, color: '#0ea5e9', text: 'The village assembly where everyone discusses and decides.', x: 49, y: 53, popupStyle: { bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)' } },
    { id: '2', title: 'Gram Panchayat', icon: Home, color: '#84cc16', text: 'The village council that takes decisions and implements them locally.', x: 23, y: 53, popupStyle: { bottom: 'calc(100% + 12px)', right: 'calc(100% - 20px)' } },
    { id: '3', title: 'Panchayat Samiti', icon: Building, color: '#f97316', text: 'Works at the block level and supports villages in development and welfare activities.', x: 76, y: 28, popupStyle: { right: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' } },
    { id: '4', title: 'Zila Parishad', icon: MapIcon, color: '#f43f5e', text: 'Works at the district level and plans large-scale development for all blocks.', x: 81, y: 76, popupStyle: { bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)' } },
    { id: '5', title: 'Key Officials', icon: Shield, color: '#8b5cf6', text: 'Secretary and Patwari assist in records, meetings and administration.', x: 13, y: 81, popupStyle: { left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' } }
  ];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem', alignItems: 'center' }}>
      
      <section style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Chapter Summary
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
        </div>
        <style>{`
          @keyframes pulseRing {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
          }
          .hotspot-button {
            width: 28px !important;
            height: 28px !important;
            padding: 0 !important;
            min-width: 28px !important;
            min-height: 28px !important;
            aspect-ratio: 1 / 1 !important;
            border-radius: 50% !important;
            cursor: pointer;
            border: none;
            outline: none;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10;
          }
          .hotspot-button:hover {
            transform: scale(1.2);
            box-shadow: 0 8px 20px rgba(0,0,0,0.35);
          }
          .hotspot-pulse {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 50% !important;
            animation: pulseRing 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
            pointer-events: none;
          }
        `}</style>

        <div style={{ 
          width: '100%', 
          height: '460px', 
          borderRadius: '24px', 
          position: 'relative', 
          background: '#1e293b',
          boxShadow: '0 20px 45px rgba(0,0,0,0.3)', 
          border: '1px solid var(--border)',
          marginBottom: '2rem'
        }}>
          
          {/* Background Image Container with Overflow Hidden */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: "url('/concept-map-bg-5.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }} />
          </div>

          {/* Hotspots */}
          {concepts.map(concept => {
            const isActive = activeConcept === concept.id;
            const isDiscovered = discoveredConcepts.includes(concept.id);
            return (
              <div key={concept.id} style={{ position: 'absolute', left: `${concept.x}%`, top: `${concept.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 20 : 10 }}>
                <button
                  className="hotspot-button"
                  style={{
                    background: isDiscovered ? concept.color : '#ffffff',
                    border: `3px solid ${concept.color}`
                  }}
                  onClick={() => { 
                    playClick(); 
                    setActiveConcept(isActive ? null : concept.id); 
                    if (!isDiscovered) {
                      setDiscoveredConcepts(prev => [...prev, concept.id]);
                    }
                  }}
                >
                  <div 
                    className="hotspot-pulse" 
                    style={{ background: concept.color }} 
                  />
                  {isDiscovered ? (
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  ) : (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: concept.color }} />
                  )}
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      style={{
                        position: 'absolute',
                        ...concept.popupStyle,
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '12px',
                        width: '240px',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                        display: 'flex',
                        gap: '12px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        pointerEvents: 'none' // allow clicks to pass through if they hit the edge
                      }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: concept.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                        <concept.icon size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold' }}>{concept.title}</h4>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem', lineHeight: '1.4' }}>{concept.text}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '2rem 0' }}></div>

      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--text-heading)' }}>
            Ready for the final challenge?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
            Review the concept map above to make sure you remember everything.
          </p>
        </div>

        <button 
          onClick={() => { playSuccess(); if(onComplete) onComplete(); }}
          className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}
        >
          Take the Quiz
        </button>
      </section>
    </div>
  );
}
