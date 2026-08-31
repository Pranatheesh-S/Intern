import React, { useState, useRef, Suspense } from 'react';
import { CheckCircle } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import moonTextureUrl from '../../../assets/moon_texture.jpg';

const Moon3D = ({ day }) => {
  const moonRef = useRef();
  const lightRef = useRef();
  const sunGroupRef = useRef();
  
  // Load local realistic moon texture
  const colorMap = useTexture(moonTextureUrl);

  useFrame((state, delta) => {
    // Very slow natural rotation of the moon itself
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.05;
      moonRef.current.rotation.z = Math.PI * 0.1; // slight tilt
    }

    // Orbit the light (Sun) based on the day
    if (sunGroupRef.current) {
      const cycleLength = 29.53;
      // Day 0 = New Moon (Sun behind Moon) -> angle 0
      // Day 14.7 = Full Moon (Sun behind Camera) -> angle PI
      const targetAngle = (day / cycleLength) * Math.PI * 2;
      
      // Smoothly animate the sun position to the target angle
      sunGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sunGroupRef.current.rotation.y, 
        targetAngle, 
        0.1
      );
    }
  });

  return (
    <>
      <group ref={sunGroupRef}>
        <directionalLight 
          ref={lightRef}
          position={[0, 0, -10]} // Starts at z=-10 (Behind the moon -> New Moon)
          intensity={2.5} 
          color="#ffffff" 
          castShadow
        />
      </group>
      
      {/* Ambient light simulates Earthshine (the faint glow on the dark side) */}
      <ambientLight intensity={0.08} color="#60a5fa" />

      <group ref={moonRef}>
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial 
            map={colorMap}
            roughness={0.8} 
            metalness={0.1}
          />
        </Sphere>
      </group>
    </>
  );
};

export default function MoonDialActivity({ onNext }) {
  const [moonDay, setMoonDay] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const getMoonPhase = (day) => {
    if (day === 0 || day === 29) return 'New Moon';
    if (day > 0 && day < 7) return 'Waxing Crescent';
    if (day === 7) return 'First Quarter';
    if (day > 7 && day < 14) return 'Waxing Gibbous';
    if (day === 14 || day === 15) return 'Full Moon';
    if (day > 15 && day < 22) return 'Waning Gibbous';
    if (day === 22) return 'Last Quarter';
    if (day > 22 && day < 29) return 'Waning Crescent';
    return 'New Moon';
  };

  return (
    <div className="dark-coords-main-content" style={{ minHeight: '100vh', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        @keyframes twinkleStar {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes slowDrift {
          0% { transform: translateX(0) scale(1); }
          50% { transform: translateX(5%) scale(1.05); }
          100% { transform: translateX(0) scale(1); }
        }
        @keyframes shootingStar {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 1; height: 2px; width: 0; }
          10% { width: 150px; }
          20% { transform: translateX(-600px) translateY(600px) rotate(-45deg); opacity: 0; width: 0; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Visual Column */}
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Deep space background (Ultra-realistic gradient) */}
        <div style={{
          flex: 1,
          position: 'relative',
          background: 'radial-gradient(circle at center, #0B101E 0%, #030408 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: '500px'
        }}>
          
          {/* Ethereal clouds (Nebula effect) */}
          <div style={{
            position: 'absolute', top: '20%', left: '-10%', width: '120%', height: '60%',
            background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
            animation: 'slowDrift 40s ease-in-out infinite', filter: 'blur(60px)', mixBlendMode: 'screen'
          }} />
          <div style={{
            position: 'absolute', top: '40%', right: '-20%', width: '100%', height: '80%',
            background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.06) 0%, transparent 60%)',
            animation: 'slowDrift 50s ease-in-out infinite reverse', filter: 'blur(80px)', mixBlendMode: 'screen'
          }} />

          {/* High Density Parallax Stars */}
          {[...Array(80)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'absolute', 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`, 
                width: `${Math.random() * 2 + 1}px`, 
                height: `${Math.random() * 2 + 1}px`, 
                background: Math.random() > 0.3 ? '#fff' : '#bae6fd', 
                borderRadius: '50%', 
                opacity: Math.random() * 0.7 + 0.3,
                boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255,255,255,0.8)`,
                animation: `twinkleStar ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`
              }} 
            />
          ))}

          {/* Occasional Shooting Star */}
          <div style={{
            position: 'absolute', top: '5%', right: '15%', height: '2px',
            background: 'linear-gradient(90deg, rgba(255,255,255,1), transparent)',
            animation: 'shootingStar 12s linear infinite 3s', opacity: 0,
            boxShadow: '0 0 10px #fff', transformOrigin: 'right center'
          }} />

          {/* The Highly Realistic 3D Moon */}
          <div style={{
            position: 'relative',
            flexShrink: 0,
            width: '400px',
            height: '400px',
            overflow: 'visible',
            cursor: 'grab'
          }}>
            <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
              <Suspense fallback={<Html center><div style={{ color: 'white' }}>Loading Moon...</div></Html>}>
                <Moon3D day={moonDay} />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>

      {/* Text/Interaction Column */}
      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div>
          <div className="dark-top-title" style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>ACTIVITY 3 OF 3</div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            The Moon Phase Pattern
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6' }}>
            The moon repeats its phases roughly every <strong>30 days</strong>.
          </p>
        </div>

        {/* Day Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '600' }}>Day:</span>
            <div style={{ background: 'rgba(253, 230, 138, 0.15)', padding: '6px 16px', borderRadius: '8px', color: '#fde68a', fontWeight: '800', fontSize: '18px' }}>
              {moonDay}
            </div>
          </div>
          <input 
            type="range" 
            min="0" max="29" 
            value={moonDay} 
            onChange={(e) => setMoonDay(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#fde68a', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '24px', fontWeight: '300', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <strong style={{ color: '#fff' }}>{getMoonPhase(moonDay)}</strong>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#e2e8f0', lineHeight: 1.5 }}>
            If it is a <strong>Full Moon</strong> today (Day 15), how many days until the <strong>NEXT Full Moon</strong>?
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[15, 30, 45].map(ans => {
              const isSelected = selectedAnswer === ans;
              const isCorrect = ans === 30;
              const showResult = selectedAnswer !== null;

              let btnBg = 'rgba(255,255,255,0.05)';
              let btnBorder = 'rgba(255,255,255,0.1)';
              
              if (showResult && isSelected) {
                if (isCorrect) {
                  btnBg = 'rgba(34, 197, 94, 0.2)'; btnBorder = '#22c55e';
                } else {
                  btnBg = 'rgba(239, 68, 68, 0.2)'; btnBorder = '#ef4444';
                }
              } else if (showResult && isCorrect) {
                btnBorder = '#22c55e';
              }

              return (
                <button
                  key={ans}
                  onClick={() => setSelectedAnswer(ans)}
                  disabled={showResult}
                  style={{
                    flex: '1 1 calc(33% - 12px)',
                    padding: '16px 8px', borderRadius: '12px',
                    background: btnBg, border: `2px solid ${btnBorder}`,
                    color: '#fff', fontSize: '18px', fontWeight: '600',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: showResult && !isSelected && !isCorrect ? 0.5 : 1,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}
                >
                  {ans} Days
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div style={{ marginTop: '20px', fontSize: '15px', color: selectedAnswer === 30 ? '#4ade80' : '#f87171', fontWeight: '500', lineHeight: 1.5 }}>
              {selectedAnswer === 30 
                ? "Correct! The moon completes its cycle roughly every 30 days." 
                : 'Not quite. Use the slider to see how long it takes to return to the same phase!'}
            </div>
          )}

          {selectedAnswer === 30 && (
            <button
              onClick={onNext}
              style={{
                marginTop: '24px',
                width: '100%',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
              }}
            >
              Next Activity <CheckCircle size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
