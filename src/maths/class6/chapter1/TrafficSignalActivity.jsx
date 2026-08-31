import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';

export default function TrafficSignalActivity({ onNext }) {
  const [signalChanges, setSignalChanges] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const signalColors = ['red', 'yellow', 'green'];
  const currentSignalColor = signalColors[signalChanges % 3];

  const requestRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const signalChangesRef = useRef(signalChanges);

  useEffect(() => {
    signalChangesRef.current = signalChanges;
  }, [signalChanges]);
  
  const carsRef = useRef([]);
  const [renderCars, setRenderCars] = useState([]);
  const nextCarSpawnRef = useRef(0);

  const STOP_LINE_X = 400; 

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSignalChanges(prev => prev + 1);
      }, 1500); 
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const updatePhysics = (time) => {
    const deltaTime = Math.max(0, Math.min((time - lastTimeRef.current) / 1000, 0.05));
    lastTimeRef.current = time;

    const currentLight = signalColors[(signalChangesRef.current) % 3];

    if (time > nextCarSpawnRef.current) {
      if (carsRef.current.length < 5) {
        const lastCar = carsRef.current[carsRef.current.length - 1];
        if (!lastCar || lastCar.x > 150) {
          carsRef.current.push({
            id: Math.random(),
            x: -200,
            v: 300, 
            maxV: 300 + Math.random() * 50,
            hue: Math.floor(Math.random() * 360), // For metallic car paint
            type: Math.random() > 0.5 ? 'sedan' : 'sport',
            bounce: 0
          });
          nextCarSpawnRef.current = time + 1500 + Math.random() * 2000;
        }
      }
    }

    for (let i = 0; i < carsRef.current.length; i++) {
      const car = carsRef.current[i];
      let targetV = car.maxV;

      let distToStop = Infinity;
      if (currentLight !== 'green' && car.x < STOP_LINE_X) {
        distToStop = STOP_LINE_X - car.x;
      }
      
      if (i > 0) {
        const carAhead = carsRef.current[i - 1];
        const distToCar = carAhead.x - car.x - 160; // safe distance
        if (distToCar < distToStop) {
          distToStop = distToCar;
        }
      }

      const isBraking = distToStop < 250;

      if (isBraking) {
        targetV = 0;
        const decel = 350; 
        car.v = Math.max(0, car.v - decel * deltaTime);
      } else {
        const accel = 200;
        car.v = Math.min(car.maxV, car.v + accel * deltaTime);
      }
      
      car.x += car.v * deltaTime;
      car.isBraking = isBraking && car.v > 0;
      
      // Suspension bounce effect based on speed
      car.bounce = Math.sin(car.x * 0.1) * (car.v / 150);
    }

    carsRef.current = carsRef.current.filter(car => car.x < 1000);
    setRenderCars([...carsRef.current]);
    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 

  return (
    <div className="dark-coords-main-content" style={{ minHeight: '100vh', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Visual Column */}
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', background: '#020617' }}>
        
        {/* Night Sky with subtle gradient and stars */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(180deg, #020617 0%, #0f172a 40%, #1e293b 80%)'
        }}>
           {/* Stars */}
           {[...Array(40)].map((_, i) => (
             <div key={i} style={{
               position: 'absolute',
               width: `${Math.random() * 2 + 1}px`, 
               height: `${Math.random() * 2 + 1}px`, 
               background: '#fff', 
               borderRadius: '50%',
               top: `${Math.random() * 50}%`, 
               left: `${Math.random() * 100}%`,
               opacity: Math.random() * 0.5 + 0.1,
               boxShadow: '0 0 6px rgba(255,255,255,0.8)',
               animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`
             }} />
           ))}
        </div>

        {/* Far Parallax Cityscape (Silhouettes) */}
        <div style={{
          position: 'absolute', bottom: '35%', width: '100%', height: '40%', opacity: 0.4,
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'1000\' height=\'300\'%3E%3Cpath d=\'M0,300 L0,220 L40,220 L40,160 L90,160 L90,240 L130,240 L130,120 L210,120 L210,190 L270,190 L270,80 L350,80 L350,210 L410,210 L410,130 L490,130 L490,260 L570,260 L570,100 L650,100 L650,200 L730,200 L730,150 L810,150 L810,270 L910,270 L910,90 L980,90 L980,300 Z\' fill=\'%230f172a\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: 'auto 100%'
        }} />

        {/* Mid Parallax Cityscape (Detailed Buildings with windows) */}
        <div style={{
          position: 'absolute', bottom: '35%', width: '100%', height: '35%', opacity: 0.8,
          background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'250\'%3E%3Cpath d=\'M0,250 L0,180 L60,180 L60,100 L140,100 L140,200 L200,200 L200,70 L290,70 L290,160 L360,160 L360,50 L450,50 L450,220 L530,220 L530,90 L610,90 L610,180 L700,180 L700,120 L780,120 L780,250 Z\' fill=\'%231e293b\'/%3E%3Cg fill=\'%23fbbf24\' opacity=\'0.3\'%3E%3Crect x=\'20\' y=\'190\' width=\'6\' height=\'10\'/%3E%3Crect x=\'80\' y=\'120\' width=\'8\' height=\'12\'/%3E%3Crect x=\'100\' y=\'140\' width=\'8\' height=\'12\'/%3E%3Crect x=\'110\' y=\'160\' width=\'8\' height=\'12\'/%3E%3Crect x=\'220\' y=\'90\' width=\'10\' height=\'10\'/%3E%3Crect x=\'250\' y=\'110\' width=\'10\' height=\'10\'/%3E%3Crect x=\'380\' y=\'80\' width=\'6\' height=\'15\'/%3E%3Crect x=\'400\' y=\'120\' width=\'6\' height=\'15\'/%3E%3Crect x=\'550\' y=\'110\' width=\'12\' height=\'12\'/%3E%3Crect x=\'580\' y=\'150\' width=\'12\' height=\'12\'/%3E%3Crect x=\'730\' y=\'150\' width=\'8\' height=\'15\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat-x', backgroundPosition: 'bottom', backgroundSize: 'auto 100%'
        }} />

        {/* Trees / Street level backdrop */}
        <div style={{
          position: 'absolute', bottom: '35%', width: '100%', height: '15%',
          background: 'linear-gradient(90deg, #064e3b 0%, #065f46 50%, #064e3b 100%)',
          clipPath: 'polygon(0% 100%, 5% 40%, 10% 20%, 15% 40%, 20% 60%, 25% 30%, 30% 10%, 35% 30%, 40% 50%, 45% 20%, 50% 10%, 55% 40%, 60% 60%, 65% 30%, 70% 20%, 75% 50%, 80% 70%, 85% 30%, 90% 10%, 95% 40%, 100% 100%)',
          opacity: 0.4
        }} />

        {/* Streetlight Glows */}
        {[100, 500, 900].map((x, i) => (
          <div key={`light-${i}`} style={{
            position: 'absolute', bottom: '35%', left: `${x}px`, width: '200px', height: '200px',
            background: 'radial-gradient(circle at top center, rgba(253,230,138,0.2) 0%, transparent 60%)',
            transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 1
          }} />
        ))}

        {/* Main Traffic Pole & Environmental Glow */}
        
        {/* Dynamic Environmental Glow from Signal */}
        <div style={{
          position: 'absolute',
          bottom: '35%',
          left: `${STOP_LINE_X + 30}px`,
          width: '300px',
          height: '400px',
          background: currentSignalColor === 'red' ? 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 60%)' :
                      currentSignalColor === 'yellow' ? 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 60%)' :
                      'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 60%)',
          transform: 'translate(-50%, 50%)',
          pointerEvents: 'none',
          zIndex: 5,
          transition: 'background 0.3s ease'
        }} />

        <div style={{
          position: 'absolute',
          bottom: '35%',
          left: `${STOP_LINE_X + 30}px`,
          width: '120px',
          height: '350px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 10
        }}>
          {/* Signal Box */}
          <div style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            padding: '16px 14px',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            border: '2px solid #334155',
            boxShadow: '0 30px 60px rgba(0,0,0,0.9), inset 0 2px 10px rgba(255,255,255,0.1), inset -2px -2px 15px rgba(0,0,0,0.8)',
            position: 'relative'
          }}>
            {/* Box Hood / Sun Visor Top */}
            <div style={{ position: 'absolute', top: '-10px', left: '10%', width: '80%', height: '15px', background: '#334155', borderRadius: '10px 10px 0 0', clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }} />

            {['red', 'yellow', 'green'].map(color => {
              const isActive = currentSignalColor === color;
              let onBg, offBg, glow;
              if (color === 'red') { onBg = '#ef4444'; offBg = '#451a1a'; glow = 'rgba(239,68,68,0.8)'; }
              if (color === 'yellow') { onBg = '#f59e0b'; offBg = '#452a0a'; glow = 'rgba(245,158,11,0.8)'; }
              if (color === 'green') { onBg = '#22c55e'; offBg = '#062c16'; glow = 'rgba(34,197,94,0.8)'; }
              
              return (
                <div key={color} style={{ position: 'relative' }}>
                  {/* Sun Visor / Light Hood */}
                  <div style={{
                    position: 'absolute', top: '-8px', left: '-5px', width: 'calc(100% + 10px)', height: '20px',
                    background: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)',
                    borderRadius: '50% 50% 0 0', zIndex: 5, boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                  }} />
                  {/* The Light Lens */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: isActive ? onBg : offBg,
                    // Realistic LED dot pattern using radial gradient
                    backgroundImage: isActive ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 20%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' : 'none',
                    boxShadow: isActive ? `0 0 40px 15px ${glow}, inset 0 2px 5px rgba(255,255,255,0.8)` : 'inset 0 4px 10px rgba(0,0,0,0.9), 0 2px 2px rgba(255,255,255,0.05)',
                    transition: 'all 0.1s ease',
                    position: 'relative',
                    zIndex: 2
                  }} />
                </div>
              );
            })}
          </div>
          {/* Metallic Pole Base */}
          <div style={{ 
            width: '14px', 
            flex: 1, 
            background: 'linear-gradient(90deg, #1e293b 0%, #64748b 30%, #94a3b8 50%, #64748b 70%, #1e293b 100%)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 5px 0 15px rgba(0,0,0,0.5)'
          }} />
          {/* Concrete Base */}
          <div style={{ width: '40px', height: '10px', background: '#475569', borderRadius: '4px 4px 0 0', boxShadow: '0 5px 10px rgba(0,0,0,0.5)' }} />
        </div>

        {/* Asphalt Road */}
        <div style={{
          width: '100%',
          height: '35%',
          position: 'absolute',
          bottom: 0,
          background: '#111827',
          // Realistic asphalt texture pattern
          backgroundImage: 'radial-gradient(#1e293b 15%, transparent 16%), radial-gradient(#1e293b 15%, transparent 16%)',
          backgroundSize: '8px 8px',
          backgroundPosition: '0 0, 4px 4px',
          borderTop: '6px solid #1e293b',
          boxShadow: 'inset 0 40px 60px rgba(0,0,0,0.9)'
        }}>
          {/* Wet Road Reflection (Environmental) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: `linear-gradient(180deg, 
              ${currentSignalColor === 'red' ? 'rgba(239,68,68,0.1)' : currentSignalColor === 'yellow' ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'} 0%, 
              transparent 40%)`,
            transition: 'background 0.3s ease',
            pointerEvents: 'none'
          }} />

          {/* Edge line */}
          <div style={{ position: 'absolute', top: '10px', width: '100%', height: '3px', background: 'rgba(255,255,255,0.3)', boxShadow: '0 0 5px rgba(255,255,255,0.2)' }} />

          {/* Glowing Stop line on the road */}
          <div style={{
            position: 'absolute',
            left: `${STOP_LINE_X}px`,
            top: '5%',
            width: '14px',
            height: '90%',
            background: '#e2e8f0',
            borderRadius: '2px',
            boxShadow: '0 0 10px rgba(255,255,255,0.4)',
            transform: 'perspective(500px) rotateX(20deg)'
          }} />

          {/* Dashed Lane Divider */}
          <div style={{
            position: 'absolute',
            top: '50%',
            width: '100%',
            height: '6px',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, #fde047 40px, #fde047 80px)',
            opacity: 0.7,
            boxShadow: '0 0 5px rgba(253, 224, 71, 0.3)'
          }} />

          {/* Cars */}
          {renderCars.map(car => {
            const isSport = car.type === 'sport';
            
            // SVG Body Definitions
            const bodyPath = isSport 
              ? "M 10,50 L 10,35 Q 10,25 25,25 L 60,25 L 90,10 Q 110,8 130,10 L 155,25 L 185,28 Q 195,30 195,40 L 195,50 L 173,50 A 18 18 0 0 0 137 50 L 63,50 A 18 18 0 0 0 27 50 Z"
              : "M 10,50 L 10,30 Q 10,20 20,20 L 40,20 L 70,5 Q 100,2 130,5 L 165,22 L 190,25 Q 195,27 195,40 L 195,50 L 173,50 A 18 18 0 0 0 137 50 L 63,50 A 18 18 0 0 0 27 50 Z";

            const windowPath = isSport
              ? "M 65,25 L 92,12 Q 110,10 128,12 L 150,25 Z"
              : "M 45,20 L 72,7 Q 100,4 128,7 L 160,22 Z";

            const windowPillar = isSport
              ? "M 105,12 L 100,25"
              : "M 105,5 L 105,22";

            return (
              <div key={car.id} style={{
                position: 'absolute',
                left: `${car.x}px`,
                bottom: car.type === 'sport' ? '10%' : '50%',
                width: '200px',
                height: '60px',
                transform: `translateY(${car.bounce}px)`,
                zIndex: 20
              }}>
                
                {/* Headlight Beam */}
                <div style={{
                  position: 'absolute', right: '-240px', top: isSport ? '18px' : '15px', width: '250px', height: '60px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
                  clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)',
                  pointerEvents: 'none', filter: 'blur(5px)'
                }} />

                {/* SVG Car Body */}
                <svg viewBox="0 0 200 60" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                  <defs>
                    <linearGradient id={`paint-${car.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`hsl(${car.hue}, 80%, 65%)`} />
                      <stop offset="50%" stopColor={`hsl(${car.hue}, 90%, 40%)`} />
                      <stop offset="100%" stopColor={`hsl(${car.hue}, 100%, 20%)`} />
                    </linearGradient>
                    <linearGradient id="window-glass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#bae6fd" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Chassis Base */}
                  <path d={bodyPath} fill={`url(#paint-${car.id})`} />
                  
                  {/* Glossy Top Edge Highlight */}
                  <path d={bodyPath} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" transform="translate(0, -1)" />
                  
                  {/* Glass */}
                  <path d={windowPath} fill="url(#window-glass)" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
                  
                  {/* Door / Window Pillar */}
                  <path d={windowPillar} stroke={`hsl(${car.hue}, 100%, 15%)`} strokeWidth="3" />
                  
                  {/* Beltline Highlight */}
                  <path d={isSport ? "M 25,25 L 185,28" : "M 20,20 L 190,25"} stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                  
                  {/* Headlight */}
                  <path d={isSport ? "M 180,28 L 195,30 L 195,36 L 180,36 Z" : "M 185,25 L 195,27 L 195,34 L 185,34 Z"} fill="#fff" />
                  
                  {/* Rear Brake Light Housing */}
                  <path d={isSport ? "M 9,35 L 15,35 L 15,42 L 9,42 Z" : "M 9,30 L 15,30 L 15,38 L 9,38 Z"} fill={car.isBraking ? "#ef4444" : "#991b1b"} />
                </svg>

                {/* Brake Light External Glow Effect */}
                <div style={{ 
                  position: 'absolute', left: '-5px', top: isSport ? '35px' : '30px', width: '20px', height: '20px', 
                  background: car.isBraking ? '#ef4444' : 'transparent', 
                  boxShadow: car.isBraking ? '0 0 35px 15px rgba(239,68,68,0.95)' : '0 0 10px 2px rgba(239,68,68,0.3)', 
                  borderRadius: '50%',
                  transition: 'background 0.1s, box-shadow 0.1s',
                  pointerEvents: 'none'
                }} />

                {/* Realistic Alloy Wheels */}
                {[45, 155].map((centerX, idx) => (
                  <div key={idx} style={{ 
                    position: 'absolute', bottom: '-8px', left: `${centerX - 18}px`, width: '36px', height: '36px', 
                    background: '#0f172a', borderRadius: '50%', border: '4px solid #1e293b',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.9), inset 0 0 5px rgba(0,0,0,1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: `spin ${300 / Math.max(1, car.v)}s linear infinite`
                  }}>
                    {/* Alloy Rim Detail using repeating-conic-gradient */}
                    <div style={{ 
                      width: '24px', height: '24px', 
                      background: 'radial-gradient(circle, #cbd5e1 0%, #64748b 70%, #334155 100%)', 
                      borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <div style={{ 
                        width: '20px', height: '20px', 
                        background: 'repeating-conic-gradient(from 0deg, transparent 0deg 40deg, #1e293b 40deg 72deg)', 
                        borderRadius: '50%' 
                      }} />
                      {/* Center Cap */}
                      <div style={{ position: 'absolute', width: '6px', height: '6px', background: '#020617', borderRadius: '50%' }} />
                    </div>
                  </div>
                ))}
                
                {/* Drop shadow on road */}
                <div style={{
                  position: 'absolute', bottom: '-10px', left: '20px', width: '160px', height: '20px',
                  background: 'rgba(0,0,0,0.95)', filter: 'blur(7px)', borderRadius: '50%', zIndex: -1
                }} />
                
                {/* Wet reflection of the car itself on the road */}
                <div style={{
                  position: 'absolute', bottom: '-45px', left: '0px', width: '200px', height: '40px',
                  background: `linear-gradient(180deg, hsl(${car.hue}, 80%, 40%), transparent)`,
                  opacity: 0.35, filter: 'blur(8px)', borderRadius: '10px', zIndex: -2,
                  transform: 'scaleY(-1)'
                }} />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes twinkle { 
          0% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
          100% { opacity: 0.1; transform: scale(0.8); }
        }
      `}</style>

      {/* Text/Interaction Column */}
      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div>
          <div className="dark-top-title" style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>ACTIVITY 1 OF 3</div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            The Traffic Signal
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6' }}>
            The signal follows a strict rule: <strong>Red → Yellow → Green</strong>. Watch how the cars obey the repeating pattern.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)',
            }}
          >
            {isRunning ? '⏸ Pause' : '▶ Run'}
          </button>
          <div style={{ fontSize: '16px', color: '#94a3b8' }}>
            Changes: <span style={{ color: '#fff', fontSize: '20px', fontWeight: '800' }}>{signalChanges}</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#e2e8f0', lineHeight: 1.5 }}>
            If the signal starts at <strong>Red</strong>, after exactly <strong>10 changes</strong>, which color is showing?
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Red', 'Yellow', 'Green'].map(color => {
              const isSelected = selectedAnswer === color;
              const isCorrect = color === 'Yellow';
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
                  key={color}
                  onClick={() => setSelectedAnswer(color)}
                  disabled={showResult}
                  style={{
                    padding: '16px', borderRadius: '12px',
                    background: btnBg, border: `2px solid ${btnBorder}`,
                    color: '#fff', fontSize: '16px', fontWeight: '600',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: showResult && !isSelected && !isCorrect ? 0.5 : 1,
                    display: 'flex', justifyContent: 'space-between'
                  }}
                >
                  <span>{color}</span>
                  {showResult && isCorrect && <CheckCircle size={20} color="#4ade80" />}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div style={{ marginTop: '20px', fontSize: '15px', color: selectedAnswer === 'Yellow' ? '#4ade80' : '#f87171', fontWeight: '500', lineHeight: 1.5 }}>
              {selectedAnswer === 'Yellow' 
                ? 'Correct! The sequence is Red(0) -> Yellow(1) -> Green(2) -> Red(3) -> ... -> Yellow(10).' 
                : 'Not quite. Try running the simulation and counting the changes!'}
            </div>
          )}

          {selectedAnswer === 'Yellow' && (
            <button
              onClick={onNext}
              style={{
                marginTop: '24px',
                width: '100%',
                background: '#3b82f6',
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
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
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
