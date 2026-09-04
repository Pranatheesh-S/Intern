import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, CheckCircle, RotateCcw, Activity } from 'lucide-react';

export default function PatternsInNumbers({ onNext }) {
  const [isRunning, setIsRunning] = useState(true);
  const [distance, setDistance] = useState(0); 
  const [fare, setFare] = useState(30);
  const [showPlus15, setShowPlus15] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  
  const requestRef = useRef();
  const lastTimeRef = useRef();
  const worldXRef = useRef(0);
  const markersRef = useRef(null);
  const autoRef = useRef(null);
  
  const PIXELS_PER_KM = 800;
  const SPEED = 250; 

  useEffect(() => {
    const animate = (time) => {
      if (lastTimeRef.current != null) {
        const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.1); // cap delta
        
        if (isRunning) {
          worldXRef.current += SPEED * deltaTime;
          
          if (markersRef.current) {
            markersRef.current.style.transform = `translateX(${-worldXRef.current + 172}px)`; // 172px offsets the marker to align exactly with the center of the auto rickshaw wheel
          }
          if (autoRef.current) {
            // Ultra-smooth, slow glide instead of shaky vibration
            const bounce = Math.sin(worldXRef.current * 0.005) * 1;
            const pitch = Math.cos(worldXRef.current * 0.003) * 0.2;
            autoRef.current.style.transform = `translateY(${bounce}px) rotate(${pitch}deg)`;
          }
          
          const currentKm = Math.floor(worldXRef.current / PIXELS_PER_KM);
          
          if (currentKm > distance && currentKm <= 5) {
            setDistance(currentKm);
            setShowPlus15(true);
            setTimeout(() => {
              setFare(30 + (currentKm * 15));
            }, 300); 
            
            setTimeout(() => {
              setShowPlus15(false);
            }, 1500);
            
            if (currentKm === 5) {
              setIsRunning(false); 
            }
          }
          
          if (worldXRef.current > PIXELS_PER_KM * 7) {
            worldXRef.current = 0;
            setDistance(0);
            setFare(30);
          }
        }
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, distance]);

  const handleReset = () => {
    worldXRef.current = 0;
    if (markersRef.current) {
      markersRef.current.style.transform = `translateX(172px)`;
    }
    if (autoRef.current) {
      autoRef.current.style.transform = `translateY(0px) rotate(0deg)`;
    }
    setDistance(0);
    setFare(30);
    setIsRunning(true);
    setQuizAnswer(null);
  };

  const playState = isRunning ? 'running' : 'paused';

  return (
    <div className="dark-coords-main-content" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#020617', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @keyframes panFast { 0% { transform: translateX(0); } 100% { transform: translateX(-960px); } }
        @keyframes panSlow { 0% { transform: translateX(0); } 100% { transform: translateX(-800px); } }
        @keyframes panTrees { 0% { transform: translateX(0); } 100% { transform: translateX(-1200px); } }
        @keyframes popIn {
          0% { transform: scale(0.5) translateY(20px); opacity: 0; }
          60% { transform: scale(1.1) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes meterUpdate {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.5); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes dustAnim {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0.8; }
          100% { transform: translate(-100px, -20px) scale(3); opacity: 0; }
        }
        @keyframes glowPulse {
          0% { filter: drop-shadow(0 0 10px rgba(34,197,94,0.4)); }
          50% { filter: drop-shadow(0 0 25px rgba(34,197,94,0.9)); }
          100% { filter: drop-shadow(0 0 10px rgba(34,197,94,0.4)); }
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .premium-btn {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        }
        .premium-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
      `}</style>

      {/* Visual Column */}
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
        
        {/* Sky Background */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #1e1b4b 70%, #431407 100%)' }}>
          
          {/* Subtle Sun/Atmospheric Glow */}
          <div style={{ position: 'absolute', bottom: '0', left: '20%', width: '600px', height: '300px', background: 'radial-gradient(ellipse at bottom, rgba(234,88,12,0.4) 0%, transparent 70%)', filter: 'blur(30px)' }} />

          {/* Stars */}
          {[...Array(30)].map((_, i) => (
             <div key={i} style={{
               position: 'absolute', width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`, background: '#fff', borderRadius: '50%',
               top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.1, boxShadow: '0 0 6px rgba(255,255,255,0.8)'
             }} />
          ))}

          {/* Parallax Cityscape Background (Detailed SVG) */}
          <div style={{ 
            position: 'absolute', bottom: '130px', left: 0, width: '300%', height: '350px', opacity: 0.9,
            background: 'url("data:image/svg+xml,%3Csvg width=\'1200\' height=\'350\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,350 L0,200 L40,200 L40,120 L100,120 L100,220 L140,220 L140,80 L220,80 L220,180 L280,180 L280,40 L380,40 L380,240 L440,240 L440,150 L520,150 L520,280 L580,280 L580,100 L680,100 L680,210 L740,210 L740,60 L840,60 L840,190 L900,190 L900,140 L980,140 L980,260 L1040,260 L1040,90 L1140,90 L1140,350 Z\' fill=\'%2309090b\'/%3E%3Cg fill=\'%23fbbf24\' opacity=\'0.4\'%3E%3Crect x=\'50\' y=\'140\' width=\'8\' height=\'15\'/%3E%3Crect x=\'80\' y=\'170\' width=\'8\' height=\'15\'/%3E%3Crect x=\'160\' y=\'100\' width=\'12\' height=\'12\'/%3E%3Crect x=\'200\' y=\'140\' width=\'12\' height=\'12\'/%3E%3Crect x=\'300\' y=\'60\' width=\'8\' height=\'25\'/%3E%3Crect x=\'350\' y=\'110\' width=\'8\' height=\'25\'/%3E%3Crect x=\'460\' y=\'170\' width=\'15\' height=\'10\'/%3E%3Crect x=\'540\' y=\'200\' width=\'15\' height=\'10\'/%3E%3Crect x=\'610\' y=\'130\' width=\'10\' height=\'20\'/%3E%3Crect x=\'700\' y=\'160\' width=\'10\' height=\'20\'/%3E%3Crect x=\'770\' y=\'80\' width=\'12\' height=\'18\'/%3E%3Crect x=\'810\' y=\'120\' width=\'12\' height=\'18\'/%3E%3Crect x=\'930\' y=\'160\' width=\'8\' height=\'15\'/%3E%3Crect x=\'1070\' y=\'110\' width=\'15\' height=\'15\'/%3E%3C/g%3E%3C/svg%3E")', 
            backgroundRepeat: 'repeat-x', animation: 'panSlow 90s linear infinite', animationPlayState: playState
          }} />

          {/* Trees / Street Level Foreground (Fast Parallax) */}
          <div style={{
            position: 'absolute', bottom: '130px', left: 0, width: '300%', height: '80px',
            background: 'linear-gradient(90deg, #064e3b 0%, #022c22 50%, #064e3b 100%)',
            clipPath: 'polygon(0% 100%, 5% 40%, 10% 20%, 15% 40%, 20% 60%, 25% 30%, 30% 10%, 35% 30%, 40% 50%, 45% 20%, 50% 10%, 55% 40%, 60% 60%, 65% 30%, 70% 20%, 75% 50%, 80% 70%, 85% 30%, 90% 10%, 95% 40%, 100% 100%)',
            opacity: 0.6, animation: 'panTrees 20s linear infinite', animationPlayState: playState
          }} />

          {/* Realistic Asphalt Road */}
          <div style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '130px', 
            background: '#111827',
            backgroundImage: 'radial-gradient(#1e293b 15%, transparent 16%), radial-gradient(#1e293b 15%, transparent 16%)',
            backgroundSize: '8px 8px', backgroundPosition: '0 0, 4px 4px',
            borderTop: '6px solid #1e293b', boxShadow: 'inset 0 40px 60px rgba(0,0,0,0.9)'
          }}>
            
            {/* Road Edge Line */}
            <div style={{ position: 'absolute', top: '10px', width: '100%', height: '3px', background: 'rgba(255,255,255,0.3)', boxShadow: '0 0 5px rgba(255,255,255,0.2)' }} />

            {/* Dashed lines panning fast with 3D perspective */}
            <div style={{ 
              position: 'absolute', top: '60px', left: 0, width: '200%', height: '8px', 
              background: 'repeating-linear-gradient(90deg, transparent, transparent 60px, #fde047 60px, #fde047 120px)', 
              opacity: 0.8, animation: 'panFast 3.84s linear infinite', animationPlayState: playState,
              boxShadow: '0 0 10px rgba(253,224,71,0.4)', transform: 'perspective(500px) rotateX(10deg)'
            }} />

            {/* Wet Road Reflection (Environmental) */}
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'linear-gradient(180deg, rgba(234,88,12,0.1) 0%, transparent 40%)',
              pointerEvents: 'none'
            }} />
          </div>

          {/* Syncing Distance Markers with React State */}
          <div ref={markersRef} style={{
            position: 'absolute', bottom: '130px', left: '0', width: '200%', height: '100px',
            transform: 'translateX(172px)'
          }}>
             {[...Array(20)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${i * 800}px`, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Glowing +15 Annotation */}
                  {(distance === i && showPlus15) && (
                    <div style={{
                      position: 'absolute', top: '-60px', background: '#22c55e', color: '#fff', padding: '8px 16px', borderRadius: '20px',
                      fontSize: '24px', fontWeight: '900', boxShadow: '0 10px 25px rgba(34,197,94,0.6), inset 0 2px 5px rgba(255,255,255,0.4)',
                      animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}>
                      +₹15
                    </div>
                  )}
                  {/* Kilometre Stone (Highly Realistic) */}
                  <div style={{
                    width: '45px', height: '65px', 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)',
                    borderRadius: '22px 22px 0 0', border: '2px solid #94a3b8', borderBottom: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                    boxShadow: '8px 8px 15px rgba(0,0,0,0.8), inset -5px -5px 15px rgba(0,0,0,0.2), inset 2px 2px 5px rgba(255,255,255,0.9)',
                    animation: distance === i && showPlus15 ? 'glowPulse 1s ease-in-out' : 'none',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {/* Stone texture */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                    <span style={{ color: '#0f172a', fontWeight: '900', fontSize: '22px', lineHeight: 1, zIndex: 1, textShadow: '0 1px 1px rgba(255,255,255,0.8)' }}>{i}</span>
                    <span style={{ color: '#334155', fontWeight: '800', fontSize: '11px', zIndex: 1 }}>km</span>
                  </div>
                </div>
             ))}
          </div>

          {/* Hyper-Realistic Auto Rickshaw */}
          <div ref={autoRef} style={{
            position: 'absolute', bottom: '20px', left: '150px', width: '360px', height: '220px',
            zIndex: 20, transformOrigin: '50% 100%'
          }}>
            {/* Dynamic Headlight Beam */}
            <div style={{
              position: 'absolute', left: '320px', top: '150px', width: '600px', height: '120px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(253,224,71,0.3) 40%, transparent 100%)',
              clipPath: 'polygon(0 40%, 100% -30%, 100% 130%, 0 60%)', transform: 'translateY(-50%)',
              mixBlendMode: 'screen', filter: 'blur(4px)', pointerEvents: 'none', zIndex: 1
            }} />

            {/* Drop shadow on road */}
            <div style={{
              position: 'absolute', bottom: '-5px', left: '30px', width: '280px', height: '20px',
              background: 'rgba(0,0,0,0.9)', filter: 'blur(8px)', borderRadius: '50%', zIndex: -1
            }} />
            
            {/* Wet reflection on road */}
            <div style={{
              position: 'absolute', bottom: '-40px', left: '40px', width: '260px', height: '40px',
              background: 'linear-gradient(180deg, rgba(234,179,8,0.3), transparent)',
              opacity: 0.4, filter: 'blur(8px)', borderRadius: '10px', zIndex: -2, transform: 'scaleY(-1)'
            }} />

            <svg width="360" height="220" viewBox="0 0 360 220" style={{ position: 'absolute', zIndex: 2, overflow: 'visible' }}>
              <defs>
                <linearGradient id="autoYellow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="30%" stopColor="#eab308" />
                  <stop offset="70%" stopColor="#ca8a04" />
                  <stop offset="100%" stopColor="#854d0e" />
                </linearGradient>
                <linearGradient id="autoGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="40%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
                <linearGradient id="autoBlack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="40%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="60%" stopColor="rgba(255,255,255,0)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                </linearGradient>
                <radialGradient id="wheelTire" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#020617" />
                  <stop offset="90%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <radialGradient id="wheelRim" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="60%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>
              </defs>

              {/* Chassis Base Shadow inside body */}
              <path d="M 30 180 L 30 90 L 300 90 L 320 120 L 330 150 L 300 180 Z" fill="#020617" />

              {/* Interior Back Wall & Cabin */}
              <path d="M 45 90 L 55 30 C 100 20, 140 20, 160 20 L 160 90 Z" fill="url(#autoBlack)" />
              <path d="M 160 90 L 160 50 L 250 50 L 260 90 Z" fill="#09090b" />
              
              {/* Detailed Passenger Seats */}
              <path d="M 50 70 L 110 70 L 110 90 L 45 90 Z" fill="#1c1917" />
              <path d="M 50 70 C 50 50, 110 50, 110 70" fill="#292524" />

              {/* Driver Figure (Detailed Silhouette) - Removed as requested */}
              {/* Steering Column & Handlebars */}
              <path d="M 230 90 L 210 65" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
              <path d="M 200 70 L 220 60" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
              
              {/* Roof (Canvas with physical folds) */}
              <path d="M 25 35 C 60 -10, 220 -15, 275 40 L 265 48 C 220 15, 75 15, 35 45 Z" fill="url(#autoGreen)" />
              <path d="M 35 45 C 75 15, 220 15, 265 48" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.9" />
              {/* Roof Ribs (3D depth) */}
              <path d="M 80 8 L 80 25" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              <path d="M 140 2 L 140 22" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              <path d="M 200 5 L 200 25" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
              
              {/* Roof Pillars (Metal tubes) */}
              <path d="M 35 90 L 45 42 L 52 42 L 42 90 Z" fill="url(#autoBlack)" />
              <path d="M 155 90 L 155 22 L 163 22 L 163 90 Z" fill="url(#autoBlack)" />
              <path d="M 275 90 L 265 48 L 257 48 L 267 90 Z" fill="url(#autoBlack)" />

              {/* Side Mirror */}
              <path d="M 270 70 L 285 65" stroke="#0f172a" strokeWidth="3" />
              <rect x="282" y="55" width="10" height="20" rx="3" fill="#334155" />
              <rect x="284" y="57" width="6" height="16" rx="2" fill="#cbd5e1" />

              {/* Windshield Glass */}
              <path d="M 270 90 L 253 48 L 260 48 L 277 90 Z" fill="url(#glass)" />
              {/* Glass Glare */}
              <path d="M 268 80 L 257 55 L 260 55 L 271 80 Z" fill="rgba(255,255,255,0.4)" />

              {/* Main Lower Body (Yellow Shell) */}
              <path d="M 25 180 L 25 90 L 280 90 C 295 90, 305 95, 315 110 L 330 145 C 335 155, 325 175, 305 180 L 305 180 A 32 32 0 0 0 235 180 L 120 180 A 32 32 0 0 0 50 180 Z" fill="url(#autoYellow)" stroke="#713f12" strokeWidth="2" />
              
              {/* Body Panels / Creases / 3D Highlights */}
              <path d="M 30 100 L 305 100" stroke="#fef08a" strokeWidth="3" opacity="0.8" />
              <path d="M 28 115 L 315 115" stroke="#a16207" strokeWidth="2" opacity="0.8" />
              <path d="M 130 140 L 240 140" stroke="#a16207" strokeWidth="3" opacity="0.6" />
              <path d="M 280 90 L 300 135" stroke="#fef08a" strokeWidth="2" opacity="0.5" />

              {/* Door/Entry cutout trim */}
              <path d="M 120 90 L 120 160 L 50 160 L 50 90" fill="none" stroke="#451a03" strokeWidth="4" />

              {/* Headlight Assembly (Detailed) */}
              <path d="M 320 135 L 335 138 L 335 155 L 315 158 Z" fill="#94a3b8" />
              <path d="M 333 139 C 342 142, 342 153, 333 154 Z" fill="url(#glass)" stroke="#cbd5e1" strokeWidth="2" />
              {/* Glowing Bulb */}
              <ellipse cx="335" cy="147" rx="3" ry="5" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />

              {/* Front Grill / Decor */}
              <path d="M 320 115 L 335 125 L 328 132 L 310 120 Z" fill="#0f172a" opacity="0.8" />

              {/* Taillight Assembly */}
              <path d="M 25 140 L 15 140 L 15 160 L 25 160 Z" fill="#94a3b8" />
              <path d="M 22 142 L 17 142 L 17 158 L 22 158 Z" fill="#ef4444" filter="drop-shadow(-5px 0 10px #ef4444)" />

              {/* Wheels (Hyper-realistic) */}
              {[85, 270].map((cx, i) => (
                <g key={i}>
                  {/* Wheel Arch Shadow */}
                  <path d={`M ${cx - 35} 180 A 35 35 0 0 1 ${cx + 35} 180 Z`} fill="#020617" />
                  
                  {/* The Tire */}
                  <circle cx={cx} cy="180" r="28" fill="url(#wheelTire)" />
                  {/* Tire Treads (Subtle) */}
                  <circle cx={cx} cy="180" r="26" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="4 2" />

                  {/* The Spinning Rim */}
                  <g style={{ transformOrigin: `${cx}px 180px`, animation: 'spin 0.3s linear infinite', animationPlayState: playState }}>
                    <circle cx={cx} cy="180" r="16" fill="url(#wheelRim)" stroke="#334155" strokeWidth="4" />
                    {/* Metal Spokes */}
                    {[0, 60, 120, 180, 240, 300].map(angle => (
                      <line key={angle} x1={cx} y1="164" x2={cx} y2="196" stroke="#0f172a" strokeWidth="4" transform={`rotate(${angle} ${cx} 180)`} />
                    ))}
                    {/* Center Hub */}
                    <circle cx={cx} cy="180" r="6" fill="#020617" />
                    <circle cx={cx} cy="180" r="3" fill="#cbd5e1" />
                  </g>
                </g>
              ))}
            </svg>
            
            {/* Exhaust Pipe & Smoke */}
            <div style={{ position: 'absolute', bottom: '15px', left: '-10px', width: '15px', height: '8px', background: '#334155', borderRadius: '4px' }} />
            <div className="dust-particle" style={{ bottom: '15px', left: '-25px', width: '30px', height: '30px', animationDelay: '0s', animationPlayState: playState }} />
            <div className="dust-particle" style={{ bottom: '25px', left: '-20px', width: '40px', height: '40px', animationDelay: '0.2s', animationPlayState: playState }} />
            <div className="dust-particle" style={{ bottom: '10px', left: '-35px', width: '25px', height: '25px', animationDelay: '0.4s', animationPlayState: playState }} />
          </div>
          
          {/* Dashboard / Fare Meter Overlay */}
          <div style={{
            position: 'absolute', top: '30px', left: '40px',
            background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))',
            backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '24px 32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.1)',
            display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 30
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isRunning ? '#22c55e' : '#ef4444', boxShadow: `0 0 10px ${isRunning ? '#22c55e' : '#ef4444'}` }} />
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Taxi Meter</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: '600' }}>Distance</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ color: '#fff', fontSize: '28px', fontWeight: '900' }}>{distance}</span>
                <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '700' }}>km</span>
              </div>
            </div>

            <div style={{
              background: '#042f2e', padding: '16px 24px', borderRadius: '12px',
              border: '2px solid #134e4a', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)',
              position: 'relative', overflow: 'hidden', minWidth: '220px'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)', pointerEvents: 'none' }} />
              
              <div style={{ color: '#34d399', fontSize: '12px', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px', opacity: 0.8 }}>TOTAL FARE</div>
              <div style={{ 
                color: '#10b981', fontSize: '48px', fontWeight: '900', fontFamily: 'monospace',
                textShadow: '0 0 20px rgba(16,185,129,0.8)', display: 'flex', alignItems: 'baseline', gap: '8px',
                animation: showPlus15 ? 'meterUpdate 0.4s ease-out' : 'none'
              }}>
                <span style={{ fontSize: '28px' }}>₹</span>
                {fare.toString().padStart(3, '0')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px', background: '#0f172a' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#f8fafc', margin: 0, letterSpacing: '-0.5px' }}>
            Patterns in Numbers
          </h2>
          <p style={{ fontSize: '18px', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
            A pattern is a sequence of numbers that follows a specific, predictable rule.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
          
          <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>
              ① Real-Life Example
            </h3>
            <p style={{ fontSize: '16px', color: '#f8fafc', margin: 0, lineHeight: 1.5 }}>
              Watch the taxi meter on the left. The base fare is <strong>₹30</strong>. As the taxi drives, notice exactly what happens to the fare at every new kilometre marker.
            </p>
            <div style={{ marginTop: '16px' }}>
              <button
                className="premium-btn"
                onClick={() => isRunning ? setIsRunning(false) : (distance === 5 ? handleReset() : setIsRunning(true))}
                style={{
                  background: isRunning ? '#334155' : (distance === 5 ? '#f59e0b' : '#3b82f6'), color: 'white', border: 'none',
                  padding: '12px 24px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                {isRunning ? <><Pause size={18} /> Pause Taxi</> : (distance === 5 ? <><RotateCcw size={18} /> Restart Taxi</> : <><Play size={18} /> Drive Taxi</>)}
              </button>
            </div>
          </div>


          {/* Interactive Quiz */}
          <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.1) 100%)', border: '1px solid rgba(245,158,11,0.2)', padding: '24px', borderRadius: '20px', marginTop: 'auto' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>
              ② Test Your Knowledge
            </h3>
            <p style={{ fontSize: '18px', color: '#f8fafc', fontWeight: '700', margin: '0 0 16px 0' }}>
              After 6 km, what will the fare be?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[105, 120, 135].map(ans => {
                const isSelected = quizAnswer === ans;
                const isCorrect = ans === 120;
                const showResult = quizAnswer !== null;

                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.1)';
                let color = '#f8fafc';

                if (showResult) {
                  if (isSelected && isCorrect) { bg = 'rgba(34,197,94,0.2)'; border = '#22c55e'; color = '#4ade80'; }
                  else if (isSelected && !isCorrect) { bg = 'rgba(239,68,68,0.2)'; border = '#ef4444'; color = '#f87171'; }
                  else if (isCorrect) { border = '#22c55e'; color = '#4ade80'; }
                  else { opacity: 0.5; }
                }

                return (
                  <button
                    key={ans} onClick={() => setQuizAnswer(ans)} disabled={showResult} className="premium-btn"
                    style={{
                      flex: 1, padding: '16px', borderRadius: '12px', background: bg, border: `2px solid ${border}`, color: color,
                      fontSize: '20px', fontWeight: '800', cursor: showResult ? 'default' : 'pointer', opacity: (showResult && !isSelected && !isCorrect) ? 0.5 : 1
                    }}
                  >
                    ₹{ans}
                  </button>
                );
              })}
            </div>
            

          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button
            className="premium-btn"
            onClick={onNext}
            style={{
              background: '#22c55e', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '14px',
              fontSize: '18px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 10px 20px -5px rgba(34,197,94,0.5)'
            }}
          >
            Next Section <CheckCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
