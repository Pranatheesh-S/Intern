import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';

export default function WhatMaths({ onNext, onPrev }) {
  const [time, setTime] = useState(15.2); // start at 3:11 PM (approx 15.2)
  const [isPlaying, setIsPlaying] = useState(true);
  const lastTimeRef = useRef(Date.now());
  const requestRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;
        
        setTime(prev => {
          let newTime = prev + delta * 1.5; // 1.5 hours per real second
          if (newTime >= 24) newTime -= 24;
          return newTime;
        });
      } else {
        lastTimeRef.current = Date.now();
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // Handle play/pause sync
  useEffect(() => {
    lastTimeRef.current = Date.now();
  }, [isPlaying]);

  // Interpolation helpers
  // Sun is up from 6 to 18.
  const isDay = time > 6 && time < 18;
  const sunAngle = isDay ? ((time - 6) / 12) * Math.PI : 0;
  
  // Moon is up from 18 to 24, and 0 to 6
  let moonAngle = 0;
  if (time >= 18) moonAngle = ((time - 18) / 12) * Math.PI;
  if (time < 6) moonAngle = ((time + 6) / 12) * Math.PI;

  const getPhase = (t) => {
    if (t >= 5 && t < 7) return 'dawn';
    if (t >= 7 && t < 17) return 'noon';
    if (t >= 17 && t < 19) return 'dusk';
    return 'night';
  };

  const getPhaseDescription = (t) => {
    const phase = getPhase(t);
    if (phase === 'dawn') return 'dawn — the sun rises, shadows stretch west';
    if (phase === 'noon') return 'noon — short shadows, bright sunlight';
    if (phase === 'dusk') return 'dusk — long shadows return, right on time';
    return 'night — the stars emerge, the pattern continues';
  };

  const formatTime = (t) => {
    let hours = Math.floor(t);
    let mins = Math.floor((t - hours) * 60);
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  // Sky Opacities
  const dayOpacity = Math.max(0, Math.sin(((time - 6) / 12) * Math.PI)) || 0;
  const dawnDuskOpacity = Math.max(0, 1 - Math.abs(time - 6) / 2) + Math.max(0, 1 - Math.abs(time - 18) / 2);
  const nightOpacity = 1 - dayOpacity;

  // Shadow calculations
  // Angle of light from sun or moon
  let lightAngle = isDay ? sunAngle : moonAngle;
  let shadowOpacity = isDay ? 0.6 : 0.3; // weaker shadows at night
  if (!isDay && (time > 5 && time < 19)) shadowOpacity = 0; // twilight

  const shadowSkew = Math.cos(lightAngle) * -60;
  const shadowScale = Math.max(0.2, 1 / Math.max(0.1, Math.sin(lightAngle)));

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">What is Mathematics?</div>
          
          <div className="dark-globe-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              height: '50vh',
              minHeight: '300px',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#020111',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}>
              
              {/* Night Sky (Stars) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(1px 1px at 10% 20%, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 30% 40%, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 50% 10%, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 70% 30%, white, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 90% 50%, white, rgba(0,0,0,0)), radial-gradient(1px 1px at 20% 60%, white, rgba(0,0,0,0)), radial-gradient(2px 2px at 80% 20%, white, rgba(0,0,0,0))',
                opacity: nightOpacity,
                transition: 'opacity 0.2s'
              }} />

              {/* Dawn/Dusk Layer */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, #2b1055, #7597de, #fdba74)',
                opacity: dawnDuskOpacity,
                transition: 'opacity 0.2s'
              }} />

              {/* Day Layer */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, #38bdf8, #bae6fd, #e0f2fe)',
                opacity: dayOpacity,
                transition: 'opacity 0.2s'
              }} />

              {/* Detailed Clouds (SVG) */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: `${((time * 4) % 120) - 20}%`,
                width: '150px',
                opacity: Math.max(0, dayOpacity - 0.1),
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                transition: 'opacity 0.2s'
              }}>
                <svg viewBox="0 0 150 60" style={{ width: '100%', height: 'auto' }}>
                  <path fill="#ffffff" opacity="0.9" d="M40,50 C20,50 10,35 20,25 C25,10 50,5 60,15 C75,-5 110,0 120,20 C140,20 150,35 135,50 Z" />
                </svg>
              </div>
              <div style={{
                position: 'absolute',
                top: '30%',
                left: `${(((time + 8) * 2.5) % 120) - 20}%`,
                width: '200px',
                opacity: Math.max(0, dayOpacity - 0.2),
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                transition: 'opacity 0.2s'
              }}>
                <svg viewBox="0 0 150 60" style={{ width: '100%', height: 'auto' }}>
                  <path fill="#ffffff" opacity="0.8" d="M30,50 C10,50 5,30 20,20 C25,5 55,0 70,15 C90,-5 125,5 135,25 C150,25 150,45 130,50 Z" />
                </svg>
              </div>

              {/* Sun */}
              {isDay && (
                <div style={{
                  position: 'absolute',
                  width: '80px',
                  height: '80px',
                  left: `${50 - 45 * Math.cos(sunAngle)}%`,
                  top: `${100 - 85 * Math.sin(sunAngle)}%`,
                  transform: 'translate(-50%, -50%)',
                }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 30px rgba(253, 224, 71, 0.6))' }}>
                    <circle cx="50" cy="50" r="30" fill="#fef08a" />
                    <circle cx="50" cy="50" r="40" fill="#fef08a" opacity="0.4" />
                    <circle cx="50" cy="50" r="50" fill="#fef08a" opacity="0.2" />
                  </svg>
                </div>
              )}

              {/* Moon */}
              {!isDay && (
                <div style={{
                  position: 'absolute',
                  width: '60px',
                  height: '60px',
                  left: `${50 - 45 * Math.cos(moonAngle)}%`,
                  top: `${100 - 85 * Math.sin(moonAngle)}%`,
                  transform: 'translate(-50%, -50%)',
                }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 20px rgba(226, 232, 240, 0.4))' }}>
                    <circle cx="50" cy="50" r="35" fill="#e2e8f0" />
                    <circle cx="40" cy="40" r="8" fill="#cbd5e1" opacity="0.6" />
                    <circle cx="65" cy="55" r="5" fill="#cbd5e1" opacity="0.5" />
                    <circle cx="45" cy="65" r="10" fill="#cbd5e1" opacity="0.4" />
                  </svg>
                </div>
              )}

              {/* SVG Scenery Overlay (Mountains & Ground) */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%' }}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <path d="M-100,200 Q150,50 400,150 T1100,100 L1100,300 L-100,300 Z" fill="#064e3b" opacity={0.5 + 0.5 * dayOpacity} style={{ transition: 'opacity 0.2s' }} />
                  <path d="M-100,250 Q250,80 600,220 T1100,150 L1100,300 L-100,300 Z" fill="#065f46" opacity={0.4 + 0.6 * dayOpacity} style={{ transition: 'opacity 0.2s' }} />
                  <path d="M-100,300 Q400,220 1100,280 L1100,350 L-100,350 Z" fill="#15803d" opacity={0.3 + 0.7 * dayOpacity} style={{ transition: 'opacity 0.2s' }} />
                </svg>
              </div>

              {/* Scenery Container (House and Tree) */}
              <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '25%',
                width: '120px',
                height: '130px',
              }}>
                {/* House Shadow */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '120px',
                  height: '130px',
                  background: 'transparent',
                  opacity: shadowOpacity,
                  transformOrigin: 'bottom center',
                  transform: `skewX(${shadowSkew}deg) scaleY(${shadowScale * 0.5})`,
                  filter: 'blur(5px)'
                }}>
                   <svg viewBox="0 0 120 130" style={{ width: '100%', height: '100%' }}>
                     <rect x="10" y="50" width="100" height="80" fill="black" />
                     <path d="M0,50 L60,10 L120,50 Z" fill="black" />
                   </svg>
                </div>
                
                {/* Realistic House SVG */}
                <svg style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  filter: `brightness(${0.4 + 0.6 * dayOpacity}) drop-shadow(0 5px 5px rgba(0,0,0,0.3))`
                }} viewBox="0 0 120 130">
                  <rect x="10" y="50" width="100" height="80" fill="#b91c1c" rx="2" />
                  <path d="M10,60 L110,60 M10,70 L110,70 M10,80 L110,80 M10,90 L110,90 M10,100 L110,100 M10,110 L110,110 M10,120 L110,120" stroke="#991b1b" strokeWidth="1" opacity="0.5" />
                  <rect x="80" y="10" width="15" height="40" fill="#7f1d1d" />
                  <path d="M78,10 L97,10" stroke="#451a03" strokeWidth="3" />
                  <path d="M0,50 L60,10 L120,50 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M10,43 L60,10 L110,43 M20,50 L60,23 L100,50 M30,50 L60,30 L90,50" stroke="#451a03" strokeWidth="1" fill="none" opacity="0.5"/>
                  <rect x="25" y="90" width="24" height="40" fill="#451a03" rx="2" />
                  <rect x="28" y="93" width="18" height="34" fill="#78350f" rx="1" />
                  <circle cx="44" cy="110" r="2.5" fill="#fbbf24" />
                  
                  <rect x="65" y="65" width="30" height="30" fill={time > 18 || time < 6 ? '#fef08a' : '#93c5fd'} stroke="#451a03" strokeWidth="3" rx="1" />
                  <line x1="80" y1="65" x2="80" y2="95" stroke="#451a03" strokeWidth="2" />
                  <line x1="65" y1="80" x2="95" y2="80" stroke="#451a03" strokeWidth="2" />
                  {(time > 18 || time < 6) && (
                    <rect x="65" y="65" width="30" height="30" fill="#fef08a" opacity="0.5" />
                  )}
                </svg>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12%',
                right: '25%',
                width: '90px',
                height: '140px',
              }}>
                {/* Tree Shadow */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '90px',
                  height: '140px',
                  background: 'transparent',
                  opacity: shadowOpacity,
                  transformOrigin: 'bottom center',
                  transform: `skewX(${shadowSkew}deg) scaleY(${shadowScale * 0.5})`,
                  filter: 'blur(5px)'
                }}>
                   <svg viewBox="0 0 90 140" style={{ width: '100%', height: '100%' }}>
                     <path d="M40,140 L40,60 C40,50 35,45 30,40 M45,140 L45,50 C45,40 50,35 55,30 M35,140 L55,140 Z" stroke="black" strokeWidth="10" fill="none" />
                     <circle cx="45" cy="50" r="40" fill="black" />
                   </svg>
                </div>

                {/* Realistic Tree SVG */}
                <svg style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  filter: `brightness(${0.4 + 0.6 * dayOpacity}) drop-shadow(0 5px 6px rgba(0,0,0,0.3))`
                }} viewBox="0 0 90 140">
                  <path d="M40,140 L40,60 C40,50 35,45 30,40 M45,140 L45,50 C45,40 50,35 55,30 M35,140 L55,140 Z" stroke="#451a03" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M42,130 L42,70 M48,135 L48,80 M38,135 L38,90" stroke="#78350f" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  <circle cx="45" cy="50" r="40" fill="#14532d" />
                  <circle cx="25" cy="65" r="25" fill="#166534" />
                  <circle cx="70" cy="60" r="30" fill="#15803d" />
                  <circle cx="45" cy="30" r="30" fill="#22c55e" opacity="0.9" />
                  <circle cx="35" cy="20" r="20" fill="#4ade80" opacity="0.8" />
                  <circle cx="60" cy="35" r="20" fill="#4ade80" opacity="0.6" />
                </svg>
              </div>
            </div>

            {/* Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '40px',
              background: 'rgba(255,255,255,0.05)',
              padding: '16px 32px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 24px',
                  background: 'var(--dark-accent-blue)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} fill="#fff" /> Pause Time
                  </>
                ) : (
                  <>
                    <Play size={18} fill="#fff" /> Resume Time
                  </>
                )}
              </button>

              <div style={{
                fontSize: '16px',
                color: '#e2e8f0',
                fontWeight: '700'
              }}>
                {formatTime(time)} · <span style={{ color: '#94a3b8', fontWeight: '500' }}>{getPhaseDescription(time)}</span>
              </div>
            </div>
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={onPrev}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="dark-nav-dots">
              <div className="dark-nav-dot active" />
              <div className="dark-nav-dot" />
              <div className="dark-nav-dot" />
              <div className="dark-nav-dot" />
            </div>
            <button className="dark-nav-btn next" onClick={onNext}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP 1 OF 4</div>
          <h2 className="dark-step-title">The sky never breaks its promise</h2>
          
          <div className="dark-step-text">
            Mathematics is, in large part, the search for patterns, and for the explanations as to why those patterns exist.
          </div>
          
          <div className="dark-step-text">
            The oldest pattern humans ever noticed: dawn, noon, dusk, night — and again, and again. Watch a full day pass over one house, with the light, the shadows and the stars all obeying the same rule they obeyed yesterday.
          </div>
          
          <div className="dark-key-idea-box">
            <div className="dark-key-idea-title">REAL-TIME OBSERVATION</div>
            <div className="dark-key-idea-text">
              Notice how the shadows cast by the house and tree change length and direction as the sun moves across the sky. The natural world is a giant clockwork of reliable patterns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
