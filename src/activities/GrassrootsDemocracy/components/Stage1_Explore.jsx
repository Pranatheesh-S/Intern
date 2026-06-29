import React, { useState } from 'react';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, MapPin, Building, Waves, Tractor, BookOpen } from 'lucide-react';

export default function Stage1_Explore({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const [discoveredSpots, setDiscoveredSpots] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const spots = [
    { id: 'school', icon: BookOpen, label: 'Primary School', text: 'The roof is leaking after heavy rains and needs urgent maintenance.', x: 25, y: 35 },
    { id: 'farm', icon: Tractor, label: 'Farms', text: 'The fields require better irrigation facilities for the upcoming season.', x: 75, y: 40 },
    { id: 'road', icon: MapPin, label: 'Main Road', text: 'Heavy rains have severely damaged the main connecting road.', x: 45, y: 70 },
    { id: 'water', icon: Waves, label: 'Village Well', text: 'The village faces a water shortage and needs a new handpump.', x: 65, y: 65 },
  ];

  const handleDiscover = (id) => {
    if (!discoveredSpots.includes(id)) {
      playClick();
      setDiscoveredSpots(prev => [...prev, id]);
      addXp(5);
    }
  };

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return;
    playClick();
    setSelectedAnswer(option);
    addXp(10);
  };

  const allDiscovered = discoveredSpots.length === spots.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      {/* 1. Introduction Header */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Chapter Introduction
        </div>
        <h1 style={{ margin: 0, fontSize: '3rem', color: 'var(--text-heading)', lineHeight: '1.2' }}>
          Grassroots <span style={{ color: '#38bdf8' }}>Democracy</span>
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
            <div style={{ color: '#eab308', fontSize: '2rem', fontWeight: 'bold' }}>6 lakh</div>
            <div style={{ color: 'var(--text-secondary)' }}>villages across India</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
            <div style={{ color: '#eab308', fontSize: '2rem', fontWeight: 'bold' }}>~2/3</div>
            <div style={{ color: 'var(--text-secondary)' }}>of 1.4 billion people live in rural areas</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} style={{ borderLeft: '3px solid #eab308', paddingLeft: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2rem' }}>
          <p style={{ margin: 0, fontSize: '1.2rem' }}>"The real India lives in its villages."</p>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#eab308', fontWeight: 'bold' }}>— Mahatma Gandhi</p>
        </motion.div>
      </section>

      {/* 2. Meet Lakshmanpur */}
      <section>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', marginBottom: '1rem' }}>Meet Lakshmanpur</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Welcome to Lakshmanpur — a village of 200 houses tucked in the foothills. Click around the village to discover the daily challenges the villagers face.
        </p>
        
        <div style={{ 
          width: '100%', height: '300px', borderRadius: '16px', position: 'relative', 
          background: 'linear-gradient(to bottom, #0ea5e9 0%, #38bdf8 40%, #10b981 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)', overflow: 'hidden'
        }}>
          {/* Animated Sun */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', top: '20px', right: '40px', width: '60px', height: '60px', background: '#fef08a', borderRadius: '50%', boxShadow: '0 0 40px #fef08a' }} />
          
          {/* Mountains Background */}
          <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, pointerEvents: 'none' }}>
            <path d="M0,300 L0,120 L150,50 L300,140 L450,60 L600,150 L800,40 L1000,130 L1000,300 Z" fill="#065f46" opacity="0.6" />
            <path d="M0,300 L0,150 L200,90 L350,160 L550,100 L700,170 L900,80 L1000,140 L1000,300 Z" fill="#047857" opacity="0.8" />
            <path d="M0,300 L0,180 L250,130 L400,180 L650,140 L850,190 L1000,160 L1000,300 Z" fill="#059669" />
          </svg>

          {/* Hotspots */}
          {spots.map((spot) => {
            const isDiscovered = discoveredSpots.includes(spot.id);
            return (
              <div key={spot.id} style={{ position: 'absolute', top: `${spot.y}%`, left: `${spot.x}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button
                  onClick={() => handleDiscover(spot.id)}
                  style={{
                    width: '50px', height: '50px', borderRadius: '50%', border: 'none',
                    background: isDiscovered ? 'var(--success)' : 'white',
                    color: isDiscovered ? 'white' : '#059669',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s'
                  }}
                >
                  <spot.icon size={24} />
                </button>
                <AnimatePresence>
                  {isDiscovered && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(0,0,0,0.8)', color: 'white', padding: '0.8rem', borderRadius: '8px', width: '200px', textAlign: 'center', marginTop: '10px', fontSize: '0.85rem' }}>
                      <strong>{spot.label}</strong><br/>{spot.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Problem Question */}
      <AnimatePresence>
        {allDiscovered && (
          <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
            <div className="glass-panel" style={{ padding: '2rem', background: 'var(--card-bg)', border: '1px solid var(--accent-border)' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-heading)' }}>The Big Question 🤔</h3>
              <p style={{ marginTop: '1rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                The village has many immediate needs: roads, water, school repairs. Who should be responsible for making these daily decisions and solving these local problems?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {['The Prime Minister in New Delhi', 'The Chief Minister in the State Capital', 'The Villagers themselves'].map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = index === 2;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      disabled={selectedAnswer !== null}
                      style={{
                        padding: '1rem', borderRadius: '12px', textAlign: 'left',
                        background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--surface)',
                        border: `1px solid ${isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--border)'}`,
                        cursor: selectedAnswer === null ? 'pointer' : 'default', transition: 'all 0.2s',
                        opacity: selectedAnswer !== null && !isSelected ? 0.5 : 1
                      }}
                    >
                      <span style={{ fontSize: '1rem', color: isSelected ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--text-primary)' }}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  <strong>Exactly!</strong> Imagine if a villager had to travel 500 km to the capital just to fix a leaking pipe. India is too large. Villages need the power to govern their own local issues. This is why we have the <strong>Panchayati Raj System</strong>.
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          onClick={onComplete}
          disabled={!selectedAnswer}
          className="primary" 
          style={{ opacity: selectedAnswer ? 1 : 0.5, padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Discover Panchayati Raj <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
