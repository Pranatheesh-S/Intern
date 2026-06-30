import React, { useState } from 'react';
import useSound from 'use-sound';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  BookOpen, 
  Tractor, 
  MapPin, 
  Waves, 
  Check, 
  Users, 
  Home, 
  Mountain, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function Stage1_Explore({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  const [discoveredSpots, setDiscoveredSpots] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Spot data matching the clean background image coordinates
  const spots = [
    { 
      id: 'school', 
      emoji: '🏫', 
      icon: BookOpen, 
      label: 'Primary School', 
      text: 'The roof is leaking after heavy rains and needs urgent maintenance.', 
      x: 18, 
      y: 59,
      cardX: 10,
      cardY: 32,
      lineX1: 18,
      lineY1: 44,
      color: '#3b82f6',
      bgLight: 'rgba(59, 130, 246, 0.1)',
      borderLight: 'rgba(59, 130, 246, 0.3)'
    },
    { 
      id: 'road', 
      emoji: '🛣️', 
      icon: MapPin, 
      label: 'Main Road', 
      text: 'Heavy rains have severely damaged the main connecting road.', 
      x: 43, 
      y: 67,
      cardX: 31,
      cardY: 44,
      lineX1: 39,
      lineY1: 56,
      color: '#ef4444',
      bgLight: 'rgba(239, 68, 68, 0.1)',
      borderLight: 'rgba(239, 68, 68, 0.3)'
    },
    { 
      id: 'farm', 
      emoji: '🚜', 
      icon: Tractor, 
      label: 'Farms', 
      text: 'The fields require better irrigation facilities for the upcoming season.', 
      x: 67, 
      y: 64,
      cardX: 56,
      cardY: 32,
      lineX1: 64,
      lineY1: 44,
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.1)',
      borderLight: 'rgba(16, 185, 129, 0.3)'
    },
    { 
      id: 'water', 
      emoji: '🚰', 
      icon: Waves, 
      label: 'Village Well', 
      text: 'The village faces a water shortage and needs a new handpump.', 
      x: 91, 
      y: 66,
      cardX: 80,
      cardY: 44,
      lineX1: 88,
      lineY1: 56,
      color: '#8b5cf6',
      bgLight: 'rgba(139, 92, 246, 0.1)',
      borderLight: 'rgba(139, 92, 246, 0.3)'
    },
  ];

  const handleDiscover = (id) => {
    setActiveSpot(id);
    if (id && !discoveredSpots.includes(id)) {
      playClick();
      setDiscoveredSpots(prev => [...prev, id]);
      addXp(5);
    } else if (id) {
      playClick();
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      
      {/* Dynamic Keyframes injected into the page */}
      <style>{`
        @keyframes kenBurnsEffect {
          0% { transform: scale(1.0); }
          50% { transform: scale(1.04) translate(-0.8%, -0.4%); }
          100% { transform: scale(1.0); }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .hotspot-button {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          outline: none;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 10;
        }
        .hotspot-button:hover {
          transform: translate(-50%, -50%) scale(1.3);
          box-shadow: 0 6px 15px rgba(0,0,0,0.4);
        }
        .hotspot-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: pulseRing 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite;
          pointer-events: none;
        }
      `}</style>

      {/* 1. Introduction Header */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Chapter Introduction
        </div>
        <h1 style={{ margin: 0, fontSize: '3rem', color: 'var(--text-heading)', lineHeight: '1.2' }}>
          Grassroots <span style={{ color: '#38bdf8' }}>Democracy</span>
        </h1>
      </section>

      {/* 2. Meet Lakshmanpur - Interactive 2D Landscape */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Meet Lakshmanpur</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0 }}>
              Welcome to Lakshmanpur — a village of 200 houses tucked in the foothills. Click around the village to discover the daily challenges the villagers face.
            </p>
          </div>
          {activeSpot && (
            <button 
              onClick={() => setActiveSpot(null)} 
              className="outline"
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Overview View
            </button>
          )}
        </div>

        {/* Outer container */}
        <div style={{ 
          width: '100%', 
          height: '620px', 
          borderRadius: '24px', 
          position: 'relative', 
          background: '#0ea5e9',
          boxShadow: '0 20px 45px rgba(0,0,0,0.3)', 
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          
          {/* Animated Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/lakshmanpur_clean_background.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
            animation: 'kenBurnsEffect 30s ease-in-out infinite',
            pointerEvents: 'none'
          }} />

          {/* Dark Overlay Vignette for readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.1) 40%, rgba(15, 23, 42, 0.1) 70%, rgba(15, 23, 42, 0.4) 100%)',
            pointerEvents: 'none'
          }} />

          {/* 2A. OVERLAY HEADER INFO & STATS */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            zIndex: 5,
            pointerEvents: 'none'
          }}>
            {/* Left Hand Title and Quote */}
            <div style={{ maxWidth: '42%', display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'auto' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <h3 style={{ margin: '0 0 0.25rem 0', color: '#0f172a', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  Life in Lakshmanpur
                </h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Lakshmanpur is a small village in the foothills of the Himalayas. The people work hard, but face many challenges.
                </p>
              </div>

              {/* Gandhi Quote card */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.95)',
                color: 'white',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.15rem'
              }}>
                <span style={{ fontSize: '0.78rem', fontStyle: 'italic', fontWeight: '600' }}>
                  "The real India lives in its villages."
                </span>
                <span style={{ fontSize: '0.65rem', alignSelf: 'flex-end', opacity: 0.9, fontWeight: '700' }}>
                  — Mahatma Gandhi
                </span>
              </div>
            </div>

            {/* Right Hand Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.6rem',
              maxWidth: '54%',
              pointerEvents: 'auto'
            }}>
              {/* Stat 1: People */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 0.8rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                  <Users size={16} color="#15803d" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#166534', fontSize: '0.85rem', fontWeight: 'bold', lineHeight: 1.1 }}>700</span>
                  <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: '600' }}>People</span>
                </div>
              </div>

              {/* Stat 2: Houses */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 0.8rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={16} color="#1d4ed8" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#1e40af', fontSize: '0.85rem', fontWeight: 'bold', lineHeight: 1.1 }}>200</span>
                  <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: '600' }}>Houses</span>
                </div>
              </div>

              {/* Stat 3: Farmers */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 0.8rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Tractor size={16} color="#ca8a04" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#854d0e', fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1.1 }}>Most People</span>
                  <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: '600' }}>are Farmers</span>
                </div>
              </div>

              {/* Stat 4: Himalayas */}
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.6rem 0.8rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mountain size={16} color="#7c3aed" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#6b21a8', fontSize: '0.8rem', fontWeight: 'bold', lineHeight: 1.1 }}>Foothills</span>
                  <span style={{ color: '#475569', fontSize: '0.65rem', fontWeight: '600' }}>of the Himalayas</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2B. SVG CONNECTOR LINES LAYER */}
          <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 6
          }}>
            <AnimatePresence>
              {spots.map(spot => {
                const isDiscovered = discoveredSpots.includes(spot.id);
                if (!isDiscovered) return null;

                return (
                  <motion.line
                    key={`line-${spot.id}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    x1={`${spot.lineX1}%`}
                    y1={`${spot.lineY1}%`}
                    x2={`${spot.x}%`}
                    y2={`${spot.y}%`}
                    stroke={spot.color}
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          {/* 2C. INTERACTIVE HOTSPOTS */}
          {spots.map(spot => {
            const isDiscovered = discoveredSpots.includes(spot.id);
            const isActive = activeSpot === spot.id;

            return (
              <button
                key={`hotspot-${spot.id}`}
                className="hotspot-button"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  background: isDiscovered ? spot.color : '#ffffff',
                  border: `3px solid ${spot.color}`
                }}
                onClick={() => handleDiscover(spot.id)}
              >
                {/* Pulse Ring */}
                <div 
                  className="hotspot-pulse" 
                  style={{ background: spot.color }} 
                />
                
                {/* Center Content: Check if discovered, otherwise small center dot */}
                {isDiscovered ? (
                  <Check size={12} color="#ffffff" strokeWidth={3} />
                ) : (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: spot.color }} />
                )}
              </button>
            );
          })}

          {/* 2D. FLOATING INFORMATION CARDS */}
          <AnimatePresence>
            {spots.map(spot => {
              const isDiscovered = discoveredSpots.includes(spot.id);
              if (!isDiscovered) return null;

              const isActive = activeSpot === spot.id;

              return (
                <motion.div
                  key={`card-${spot.id}`}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.85, 
                    scale: isActive ? 1.03 : 1.0, 
                    y: 0,
                    boxShadow: isActive ? '0 12px 30px rgba(0,0,0,0.25)' : '0 6px 15px rgba(0,0,0,0.15)'
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    position: 'absolute',
                    left: `${spot.cardX}%`,
                    top: `${spot.cardY}%`,
                    width: '180px',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    border: `1.5px solid ${isActive ? spot.color : 'rgba(255,255,255,0.8)'}`,
                    borderRadius: '16px',
                    padding: '0.8rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    zIndex: isActive ? 8 : 7,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDiscover(spot.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: spot.bgLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <spot.icon size={13} color={spot.color} />
                    </div>
                    <strong style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 'bold' }}>
                      {spot.label}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: '1.35' }}>
                    {spot.text}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Instruction overlay when nothing is active */}
          <AnimatePresence>
            {!activeSpot && discoveredSpots.length < spots.length && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }} 
                animate={{ opacity: 1, y: 0, x: '-50%' }} 
                exit={{ opacity: 0, y: -20, x: '-50%' }} 
                style={{ 
                  position: 'absolute', 
                  bottom: '30px', 
                  left: '50%', 
                  background: 'rgba(15, 23, 42, 0.95)', 
                  backdropFilter: 'blur(8px)',
                  padding: '0.8rem 1.6rem', 
                  borderRadius: '20px', 
                  fontWeight: 'bold', 
                  color: '#ffffff', 
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)', 
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <HelpCircle size={16} color="#38bdf8" />
                <span>Click on the pulsing markers to explore the village issues!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. Problem Question (Redesigned matching mockup) */}
      <AnimatePresence>
        {allDiscovered && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={20} color="var(--accent-text)" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
                  Make a Decision
                </h3>
              </div>
              
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '800px' }}>
                These are some of the urgent problems faced by the villagers of Lakshmanpur. 
                <strong> What do you think should be done about these issues?</strong>
              </p>

              {/* Two Option Cards matching the mockup layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
                {/* Option 1: Villagers come together */}
                <button
                  onClick={() => handleSelect('Option 1')}
                  disabled={selectedAnswer !== null}
                  style={{
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    textAlign: 'left',
                    background: selectedAnswer === 'Option 1' ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface)',
                    border: `2px solid ${selectedAnswer === 'Option 1' ? '#3b82f6' : 'var(--border)'}`,
                    cursor: selectedAnswer === null ? 'pointer' : 'default', 
                    transition: 'all 0.25s ease',
                    opacity: selectedAnswer !== null && selectedAnswer !== 'Option 1' ? 0.45 : 1,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    boxShadow: selectedAnswer === 'Option 1' ? '0 8px 24px rgba(59, 130, 246, 0.15)' : 'none'
                  }}
                >
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    background: '#dbeafe', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={18} color="#1d4ed8" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
                      Panchayati Raj (Local governance)
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Let the villagers come together, discuss their own local problems, and find solutions themselves.
                    </p>
                  </div>
                </button>

                {/* Option 2: Send to Central Capital */}
                <button
                  onClick={() => handleSelect('Option 2')}
                  disabled={selectedAnswer !== null}
                  style={{
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    textAlign: 'left',
                    background: selectedAnswer === 'Option 2' ? 'rgba(139, 92, 246, 0.1)' : 'var(--surface)',
                    border: `2px solid ${selectedAnswer === 'Option 2' ? '#8b5cf6' : 'var(--border)'}`,
                    cursor: selectedAnswer === null ? 'pointer' : 'default', 
                    transition: 'all 0.25s ease',
                    opacity: selectedAnswer !== null && selectedAnswer !== 'Option 2' ? 0.45 : 1,
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start',
                    boxShadow: selectedAnswer === 'Option 2' ? '0 8px 24px rgba(139, 92, 246, 0.15)' : 'none'
                  }}
                >
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    background: '#f3e8ff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Mountain size={18} color="#7c3aed" />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: 'var(--text-heading)', fontWeight: 'bold' }}>
                      Centralized Decision-Making
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Send every issue to the State capital or to New Delhi (national capital) to decide.
                    </p>
                  </div>
                </button>
              </div>

              {/* 3B. Think About It - Feedback Panel */}
              {selectedAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  style={{ 
                    marginTop: '2rem', 
                    padding: '1.75rem', 
                    borderRadius: '20px', 
                    background: 'rgba(234, 179, 8, 0.08)', 
                    border: '1px solid rgba(234, 179, 8, 0.35)', 
                    color: 'var(--text-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ca8a04', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    💡 Think About It
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap-reverse' }}>
                    <p style={{ margin: 0, fontSize: '0.98rem', lineHeight: '1.6', flex: 1 }}>
                      {selectedAnswer === 'Option 1' ? (
                        <>
                          <strong>Exactly!</strong> Local villagers understand their challenges best. 
                          It would be extremely slow and inefficient if they had to travel hundreds of kilometers to the State or National capital just to fix a leaking pipe, clear a road, or maintain their school. 
                          India is vast, and governing local issues locally (at the grassroots level) is why we have the <strong>Panchayati Raj System</strong>.
                        </>
                      ) : (
                        <>
                          <strong>Consider this:</strong> Can people run to the State or the national capital for every single small issue? 
                          Imagine waiting months for the central government in New Delhi just to fix a leaking pipe or clear a small dirt road. 
                          It is far more efficient to give local villagers the power to govern, discuss, and decide on issues affecting their daily lives. 
                          This is the essence of <strong>Grassroots Democracy</strong>.
                        </>
                      )}
                    </p>
                    
                    {/* Floating Kid Illustration Placeholder from Mockup */}
                    <div style={{ 
                      width: '100px', 
                      height: '80px', 
                      background: 'rgba(234, 179, 8, 0.15)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      userSelect: 'none',
                      flexShrink: 0
                    }}>
                      👦🏻👧🏻
                    </div>
                  </div>
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
          style={{ opacity: selectedAnswer ? 1 : 0.5, padding: '0.8rem 1.75rem', gap: '0.5rem', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold' }}
        >
          Discover Panchayati Raj <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
