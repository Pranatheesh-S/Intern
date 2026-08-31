import React, { useState, useEffect } from 'react';
import { Pause, Play, CheckCircle } from 'lucide-react';

export default function PatternsInNumbers({ onNext }) {
  const [isRunning, setIsRunning] = useState(true);
  const [distance, setDistance] = useState(0);
  
  // Logic: 1 km every 4 seconds.
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setDistance(prev => {
          if (prev >= 10) return 0; // Loop after 10km
          return prev + 1;
        });
      }, 4000); // 4 seconds per km
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const fare = 30 + (distance * 15);

  const toggleAnimation = () => setIsRunning(!isRunning);

  // CSS variables for animation play state
  const playState = isRunning ? 'running' : 'paused';

  return (
    <div className="dark-coords-main-content" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <style>{`
        @keyframes panLeftFast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes panLeftSlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes bobbing {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(2px) rotate(-0.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes dustAnim {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-80px, -10px) scale(2); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes moveKmStone {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-20vw); }
        }
        
        .road-lines {
          background-image: repeating-linear-gradient(90deg, transparent, transparent 40px, #ffffff 40px, #ffffff 80px);
          background-size: 200% 100%;
          animation: panLeftFast 1.5s linear infinite;
        }

        .city-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='800' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,200 L0,150 L30,150 L30,100 L70,100 L70,130 L90,130 L90,80 L140,80 L140,160 L160,160 L160,60 L210,60 L210,120 L240,120 L240,90 L290,90 L290,170 L310,170 L310,110 L360,110 L360,140 L400,140 L400,70 L460,70 L460,150 L480,150 L480,90 L530,90 L530,130 L570,130 L570,50 L630,50 L630,160 L650,160 L650,100 L700,100 L700,140 L730,140 L730,80 L780,80 L780,200 Z' fill='%231e1b4b'/%3E%3Crect x='40' y='120' width='8' height='12' fill='%23fef08a' opacity='0.6'/%3E%3Crect x='100' y='100' width='8' height='12' fill='%23fef08a' opacity='0.4'/%3E%3Crect x='180' y='80' width='8' height='12' fill='%23fef08a' opacity='0.7'/%3E%3Crect x='260' y='140' width='8' height='12' fill='%23fef08a' opacity='0.5'/%3E%3Crect x='330' y='130' width='8' height='12' fill='%23fef08a' opacity='0.8'/%3E%3Crect x='420' y='100' width='8' height='12' fill='%23fef08a' opacity='0.6'/%3E%3Crect x='500' y='110' width='8' height='12' fill='%23fef08a' opacity='0.5'/%3E%3Crect x='590' y='80' width='8' height='12' fill='%23fef08a' opacity='0.7'/%3E%3Crect x='670' y='130' width='8' height='12' fill='%23fef08a' opacity='0.6'/%3E%3Crect x='750' y='100' width='8' height='12' fill='%23fef08a' opacity='0.8'/%3E%3C/svg%3E");
          background-repeat: repeat-x;
          background-size: 800px 200px;
          animation: panLeftSlow 60s linear infinite;
        }

        .dust-particle {
          position: absolute;
          background: #71717a;
          border-radius: 50%;
          animation: dustAnim 1s linear infinite;
        }
        
        .streetlamp-layer {
          display: flex;
          position: absolute;
          width: 200%;
          bottom: 120px;
          animation: panLeftFast 8s linear infinite;
        }
        
        .kmstone-layer {
          display: flex;
          position: absolute;
          width: 200%;
          bottom: 110px;
          animation: panLeftFast 8s linear infinite;
        }

        .lamp-post {
          width: 600px;
          flex-shrink: 0;
          position: relative;
        }
      `}</style>

      {/* Visual Column */}
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', background: '#0a0f1d' }}>
        
        {/* The Scene Container */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #0f172a 0%, #312e81 40%, #7c2d12 80%, #171717 100%)' }}>
          
          {/* Stars */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '2px', height: '2px', background: '#fff', opacity: 0.8, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '25%', left: '45%', width: '3px', height: '3px', background: '#fff', opacity: 0.6, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '15%', left: '75%', width: '2px', height: '2px', background: '#fff', opacity: 0.9, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '35%', left: '85%', width: '2px', height: '2px', background: '#fff', opacity: 0.5, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '5%', left: '55%', width: '1px', height: '1px', background: '#fff', opacity: 0.7, borderRadius: '50%' }} />

          {/* City Skyline Layer */}
          <div className="city-bg" style={{ position: 'absolute', bottom: '130px', left: 0, width: '200%', height: '200px', animationPlayState: playState }} />

          {/* Streetlamps Layer */}
          <div className="streetlamp-layer" style={{ animationPlayState: playState, animationDuration: '4s' }}>
            {[0,1,2,3,4,5,6].map(i => (
              <div key={i} className="lamp-post">
                <svg width="60" height="180" viewBox="0 0 60 180">
                  <path d="M 10 180 L 10 40 Q 10 10, 40 10 L 50 10" fill="none" stroke="#1f2937" strokeWidth="6" />
                  <ellipse cx="50" cy="12" rx="8" ry="4" fill="#fef08a" />
                  {/* Glow */}
                  <polygon points="42,14 58,14 120,180 -20,180" fill="#fef08a" opacity="0.1" />
                </svg>
              </div>
            ))}
          </div>

          {/* Road Base */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '130px', background: '#171717', borderTop: '2px solid #3f3f46' }}>
            {/* Road Dashed Lines */}
            <div className="road-lines" style={{ position: 'absolute', top: '60px', left: 0, width: '100%', height: '6px', animationPlayState: playState, opacity: 0.4 }} />
          </div>

          {/* KM Stones Layer */}
          <div style={{ 
            position: 'absolute', 
            bottom: '120px', 
            left: 0, 
            width: '100%', 
            height: '40px',
            animation: 'moveKmStone 4s linear infinite',
            animationPlayState: playState
          }}>
            <svg width="30" height="40" viewBox="0 0 30 40" style={{ position: 'absolute', left: '100%' }}>
              <path d="M 0 40 L 0 15 Q 15 0, 30 15 L 30 40 Z" fill="#e2e8f0" />
              <rect x="0" y="15" width="30" height="25" fill="#cbd5e1" />
              <text x="15" y="28" fontSize="10" fontWeight="bold" fill="#0f172a" textAnchor="middle">{distance + 1}km</text>
            </svg>
          </div>

          {/* Headlight beam */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '52%',
            width: '400px',
            height: '100px',
            background: 'linear-gradient(90deg, rgba(253,224,71,0.3) 0%, rgba(253,224,71,0) 100%)',
            clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
            transformOrigin: 'left center',
            animation: 'bobbing 0.5s infinite alternate ease-in-out',
            animationPlayState: playState
          }} />

          {/* Auto Rickshaw SVG */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '20%', // Positioning Auto in lower left center
            width: '280px',
            height: '150px',
            animation: 'bobbing 0.5s infinite alternate ease-in-out',
            animationPlayState: playState,
            zIndex: 10
          }}>
            <svg width="280" height="150" viewBox="0 0 280 150">
              {/* Back chassis structure */}
              <path d="M 30 110 L 30 60 C 30 40, 50 30, 80 30 L 170 30 C 190 30, 200 40, 220 70 L 250 110 Z" fill="#eab308" />
              {/* Roof */}
              <path d="M 25 60 C 25 35, 50 20, 90 20 L 160 20 C 190 20, 200 30, 210 50" fill="none" stroke="#171717" strokeWidth="8" strokeLinecap="round" />
              <path d="M 15 25 C 40 10, 100 10, 170 20 Z" fill="#171717" />
              {/* Main Body */}
              <path d="M 30 70 L 220 70 L 250 110 L 260 120 C 260 130, 250 140, 230 140 L 40 140 C 30 140, 20 130, 20 110 Z" fill="#facc15" />
              <path d="M 30 70 L 220 70 L 250 110 L 260 120 C 260 130, 250 140, 230 140 L 40 140 C 30 140, 20 130, 20 110 Z" fill="none" stroke="#ca8a04" strokeWidth="4" />
              {/* Window Cutouts */}
              <path d="M 50 70 L 50 35 L 90 35 L 90 70 Z" fill="#1e1b4b" />
              <path d="M 105 70 L 105 35 L 160 35 L 185 70 Z" fill="#1e1b4b" />
              {/* Driver silhouette */}
              <circle cx="135" cy="50" r="12" fill="#0f172a" />
              <rect x="125" y="60" width="20" height="20" fill="#0f172a" />
              <line x1="145" y1="65" x2="175" y2="70" stroke="#0f172a" strokeWidth="4" />
              {/* Wheels */}
              <circle cx="70" cy="140" r="18" fill="#171717" />
              <circle cx="70" cy="140" r="8" fill="#94a3b8" />
              <circle cx="210" cy="140" r="18" fill="#171717" />
              <circle cx="210" cy="140" r="8" fill="#94a3b8" />
              {/* Headlight */}
              <ellipse cx="255" cy="105" rx="5" ry="10" fill="#fef08a" />
              <ellipse cx="255" cy="105" rx="3" ry="6" fill="#ffffff" />
              {/* Taillight */}
              <ellipse cx="20" cy="115" rx="4" ry="8" fill="#ef4444" />
              <ellipse cx="20" cy="115" rx="2" ry="4" fill="#fca5a5" />
              {/* Details */}
              <line x1="30" y1="90" x2="240" y2="90" stroke="#ca8a04" strokeWidth="2" />
              <line x1="30" y1="100" x2="245" y2="100" stroke="#ca8a04" strokeWidth="2" />
            </svg>
            
            {/* Exhaust Dust Particles */}
            <div className="dust-particle" style={{ bottom: '10px', left: '10px', width: '20px', height: '20px', animationDelay: '0s', animationPlayState: playState }} />
            <div className="dust-particle" style={{ bottom: '5px', left: '15px', width: '15px', height: '15px', animationDelay: '0.3s', animationPlayState: playState }} />
            <div className="dust-particle" style={{ bottom: '15px', left: '5px', width: '25px', height: '25px', animationDelay: '0.6s', animationPlayState: playState }} />
            <div className="dust-particle" style={{ bottom: '8px', left: '12px', width: '18px', height: '18px', animationDelay: '0.9s', animationPlayState: playState }} />
          </div>

          {/* Digital Meter UI overlay */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#022c22', // Dark green background for digital meter
            border: '3px solid #064e3b',
            borderRadius: '12px',
            padding: '16px 24px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            minWidth: '220px',
            fontFamily: 'monospace'
          }}>
            <div style={{ color: '#34d399', fontSize: '36px', fontWeight: 'bold', textShadow: '0 0 10px #34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>₹</span>
              <span style={{ minWidth: '70px', textAlign: 'right' }}>{fare}</span>
            </div>
            <div style={{ color: '#059669', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', gap: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#34d399' }}>{distance} KM</span> - 
              <span style={{ opacity: distance === 0 ? 1 : 0.5 }}>30</span>, 
              <span style={{ opacity: distance === 1 ? 1 : 0.5 }}>45</span>, 
              <span style={{ opacity: distance === 2 ? 1 : 0.5 }}>60</span>, 
              <span style={{ opacity: distance === 3 ? 1 : 0.5 }}>75</span>, 
              <span style={{ opacity: distance >= 4 ? 1 : 0.5 }}>90</span>
            </div>
            {/* Blinking recording light */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'blink 1s infinite' }} />
          </div>
        </div>
      </div>

      {/* Text/Interaction Column */}
      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div>
          <div className="dark-top-title" style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
            SECTION 1.2
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            Patterns in Numbers
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6' }}>
            Among the most basic patterns in mathematics are patterns of whole numbers: 0, 1, 2, 3, 4, ... The branch of mathematics that studies them is called <strong style={{color: '#f8fafc'}}>number theory</strong>.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '20px', color: '#e2e8f0', margin: 0 }}>
              🚕 The auto meter counts in equal steps
            </h3>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
              LIVING PICTURE - A REAL CASE, MOVING
            </span>
          </div>

          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
            A dusk ride through town. The camera rides with the auto: street lamps sweep past, dust rises off the road, and the meter does its mathematics — ₹30 to start, +₹15 at every kilometre stone.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
            <button
              onClick={toggleAnimation}
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
            </button>
            <div style={{ color: '#cbd5e1', fontSize: '15px', fontWeight: '500' }}>
              kilometre stone <strong>{distance}</strong> just passed — same ₹15 jump, every single time
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <button
            onClick={onNext}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)'
            }}
          >
            Next Section <CheckCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
