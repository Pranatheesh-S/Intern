import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';

function CarAnimationLayer({ signalChanges, STOP_LINE_X }) {
  const signalColors = ['red', 'yellow', 'green'];
  const requestRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const signalChangesRef = useRef(signalChanges);

  useEffect(() => {
    signalChangesRef.current = signalChanges;
  }, [signalChanges]);
  
  const carsRef = useRef([]);
  const [renderCars, setRenderCars] = useState([]);
  const nextCarSpawnRef = useRef(0);

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
            hue: Math.floor(Math.random() * 360),
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
      const frontX = car.x + 180;
      if (currentLight !== 'green' && frontX < STOP_LINE_X + 40) {
        distToStop = (STOP_LINE_X + 50) - frontX;
      }
      
      if (i > 0) {
        const carAhead = carsRef.current[i - 1];
        const distToCar = carAhead.x - car.x - 160;
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
      
      // Realistic suspension: pitch forward when braking, squat when accelerating
      const targetPitch = car.isBraking ? 1.5 : (car.v < car.maxV && !isBraking && car.v > 20 ? -0.5 : 0);
      car.pitch = car.pitch || 0;
      car.pitch += (targetPitch - car.pitch) * deltaTime * 6;
      
      // Smooth road vibration
      car.bounce = Math.sin(car.x * 0.03) * (car.v / 250) + Math.cos(car.x * 0.01) * 0.5;
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
    <>
      {renderCars.map(car => {
        const isSport = car.type === 'sport';
        
        const bodyPath = isSport 
          ? "M 12,50 L 8,32 L 35,26 L 80,12 L 110,12 L 150,28 L 195,38 L 192,50 L 173,50 A 18 18 0 0 0 137 50 L 63,50 A 18 18 0 0 0 27 50 Z"
          : "M 8,50 L 5,30 C 5,28 10,25 25,25 C 50,25 65,10 85,10 L 115,10 C 135,10 150,25 155,26 C 170,28 190,32 192,35 C 193,37 192,50 190,50 L 173,50 A 18 18 0 0 0 137 50 L 63,50 A 18 18 0 0 0 27 50 Z";

        const windowPath = isSport
          ? "M 45,26 L 82,14 L 95,14 L 95,26 Z M 98,14 L 105,14 L 135,26 L 98,26 Z"
          : "M 35,25 C 55,25 68,13 85,13 L 95,13 L 95,25 Z M 100,13 L 112,13 C 125,13 142,22 148,25 L 100,25 Z";

        const doorSeams = isSport
          ? "M 95,26 L 95,48 M 140,26 C 138,36 135,48 132,48 M 45,26 C 45,36 48,48 55,48"
          : "M 95,25 L 95,48 M 150,25 C 148,35 142,48 137,48 M 35,25 C 35,35 40,48 48,48";

        const mirrorPath = isSport
          ? "M 132,25 C 135,22 140,22 142,24 C 142,27 138,27 132,27 Z"
          : "M 145,24 C 148,20 153,20 155,23 C 155,26 151,26 145,26 Z";

        const handlePath = isSport
          ? "M 90,32 L 95,32 L 95,33 L 90,33 Z"
          : "M 90,30 L 95,30 L 95,31 L 90,31 Z M 60,30 L 65,30 L 65,31 L 60,31 Z";

        const tailLight = isSport
          ? "M 12,50 L 8,32 L 12,32 L 15,48 Z"
          : "M 8,50 L 5,30 L 8,30 L 10,48 Z";

        const headLight = isSport
          ? "M 195,38 L 193.5,42 L 189,42 L 190,38 Z"
          : "M 192,35 C 192.5,37 192,40 191.5,40 L 186,40 L 186,35 Z";

        const roofHighlight = isSport
          ? "M 15,31 L 35,26 L 80,12 L 110,12 L 150,28 L 190,38"
          : "M 10,30 C 10,25 25,25 25,25 C 50,25 65,10 85,10 L 115,10 C 135,10 150,25 155,26 C 170,28 190,32 192,35";
          
        const spoilerPath = isSport ? "M 12,31 L 5,23 L 15,22 L 20,26 Z" : "";

        return (
          <div key={car.id} style={{
            position: 'absolute',
            left: `${car.x}px`,
            bottom: car.type === 'sport' ? '10%' : '50%',
            width: '200px',
            height: '60px',
            transform: `translateY(${car.bounce}px) rotate(${car.pitch || 0}deg)`,
            transformOrigin: '50% 70%',
            zIndex: 20
          }}>
            
            {/* Headlight Beam */}
            <div style={{
              position: 'absolute', left: '190px', top: isSport ? '10px' : '7.5px', width: '300px', height: '60px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)',
              clipPath: 'polygon(0 45%, 100% -20%, 100% 120%, 0 55%)',
              pointerEvents: 'none', filter: 'blur(3px)', mixBlendMode: 'screen'
            }} />

            <svg viewBox="0 0 200 60" width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
              <defs>
                <linearGradient id={`paint-${car.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={`hsl(${car.hue}, 70%, 80%)`} />
                  <stop offset="15%" stopColor={`hsl(${car.hue}, 85%, 55%)`} />
                  <stop offset="45%" stopColor={`hsl(${car.hue}, 95%, 40%)`} />
                  <stop offset="50%" stopColor={`hsl(${car.hue}, 80%, 20%)`} />
                  <stop offset="55%" stopColor={`hsl(${car.hue}, 90%, 35%)`} />
                  <stop offset="100%" stopColor={`hsl(${car.hue}, 90%, 10%)`} />
                </linearGradient>
                <linearGradient id="window-glass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="40%" stopColor="#334155" />
                  <stop offset="45%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>
              
              {/* Drop Shadow Base */}
              <path d={bodyPath} fill="rgba(0,0,0,0.4)" transform="translate(0, 5) scale(1, 0.95)" filter="blur(3px)" />

              {/* Spoiler */}
              {isSport && <path d={spoilerPath} fill="#111" />}

              {/* Chassis Base */}
              <path d={bodyPath} fill={`url(#paint-${car.id})`} />
              
              {/* Windows */}
              <path d={windowPath} fill="url(#window-glass)" stroke="#020617" strokeWidth="1" />
              
              {/* Details */}
              <path d={doorSeams} fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
              <path d={handlePath} fill="#cbd5e1" />
              <path d={mirrorPath} fill={`hsl(${car.hue}, 90%, 35%)`} stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
              
              {/* Lights */}
              <path d={headLight} fill="#f8fafc" filter="drop-shadow(0 0 4px #fff)" />
              <path d={tailLight} fill={car.isBraking ? "#ef4444" : "#991b1b"} />
              
              {/* Edge Highlights for 3D effect */}
              <path d={roofHighlight} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            </svg>

            {/* Brake Light Glow Effect */}
            <div style={{ 
              position: 'absolute', left: '-15px', top: isSport ? '35px' : '30px', width: '30px', height: '15px', 
              background: car.isBraking ? 'radial-gradient(ellipse at right, rgba(239,68,68,0.9) 0%, transparent 70%)' : 'transparent', 
              borderRadius: '50%',
              transition: 'background 0.1s',
              pointerEvents: 'none', filter: 'blur(2px)'
            }} />

            {/* Realistic Alloy Wheels */}
            {[45, 155].map((centerX, idx) => (
              <div key={idx} style={{ 
                position: 'absolute', bottom: '-8px', left: `${centerX - 18}px`, width: '36px', height: '36px', 
                background: 'radial-gradient(circle, #020617 40%, #1e293b 80%, #050505 100%)', 
                borderRadius: '50%', boxSizing: 'border-box',
                boxShadow: '0 8px 12px rgba(0,0,0,0.9), inset 0 0 5px rgba(0,0,0,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {/* Brake Caliper */}
                <div style={{
                  position: 'absolute', top: '5px', right: '3px', width: '8px', height: '14px',
                  background: car.isBraking ? '#ef4444' : (isSport ? '#ef4444' : '#f59e0b'),
                  borderRadius: '8px 4px 4px 8px', zIndex: 1, 
                  boxShadow: 'inset 2px 0 4px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(0,0,0,0.6)'
                }} />
                
                {/* Brake Disc (Slotted Metallic) */}
                <div style={{ 
                  position: 'absolute', width: '22px', height: '22px', 
                  background: 'repeating-radial-gradient(circle, #94a3b8 0px, #cbd5e1 1px, #64748b 2.5px)', 
                  borderRadius: '50%', zIndex: 1, border: '1px solid #334155'
                }} />
                
                {/* Spinning Rim */}
                <svg viewBox="0 0 32 32" style={{ 
                  width: '32px', height: '32px', 
                  animation: `spin ${300 / Math.max(1, car.v)}s linear infinite`,
                  zIndex: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
                }}>
                  <defs>
                    <linearGradient id={`metal-${car.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f8fafc" />
                      <stop offset="40%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                    <linearGradient id={`metal-dark-${car.id}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="40%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>

                  {/* Outer Rim Lip */}
                  <circle cx="16" cy="16" r="14" fill="none" stroke={`url(#metal-${car.id})`} strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="14.5" fill="none" stroke="#000" strokeWidth="0.5" />

                  {isSport ? (
                    // Sport rim: Aggressive Y-spokes
                    <g fill="none" stroke={`url(#metal-${car.id})`} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                      {[0, 72, 144, 216, 288].map(angle => (
                        <path key={angle} d="M 16,13 L 16,6.5 L 12.5,2.5 M 16,6.5 L 19.5,2.5" transform={`rotate(${angle} 16 16)`} />
                      ))}
                    </g>
                  ) : (
                    // Sedan rim: Luxury multi-spoke
                    <g fill="none" stroke={`url(#metal-dark-${car.id})`} strokeWidth="2.5" strokeLinecap="round">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                        <line key={angle} x1="16" y1="13" x2="16" y2="2.5" transform={`rotate(${angle} 16 16)`} />
                      ))}
                    </g>
                  )}
                  
                  {/* Center Hub */}
                  <circle cx="16" cy="16" r="4" fill={`url(#metal-${car.id})`} />
                  <circle cx="16" cy="16" r="1.5" fill="#020617" />
                  
                  {/* Lug Nuts */}
                  <g fill="#0f172a">
                    {[0, 72, 144, 216, 288].map(angle => (
                      <circle key={angle} cx="16" cy="13.5" r="0.6" transform={`rotate(${angle} 16 16)`} />
                    ))}
                  </g>
                </svg>
              </div>
            ))}
            
            {/* Drop shadow on road */}
            <div style={{
              position: 'absolute', bottom: '-10px', left: '20px', width: '160px', height: '16px',
              background: 'rgba(0,0,0,0.8)', filter: 'blur(6px)', borderRadius: '50%', zIndex: -1
            }} />
            
            {/* Wet reflection of the car itself on the road */}
            <div style={{
              position: 'absolute', bottom: '-45px', left: '0px', width: '200px', height: '40px',
              background: `linear-gradient(180deg, hsl(${car.hue}, 80%, 40%), transparent)`,
              opacity: 0.25, filter: 'blur(8px)', borderRadius: '10px', zIndex: -2,
              transform: 'scaleY(-1)'
            }} />
          </div>
        );
      })}
    </>
  );
}

export default function TrafficSignalActivity({ onNext }) {
  const [signalChanges, setSignalChanges] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const signalColors = ['red', 'yellow', 'green'];
  const currentSignalColor = signalColors[signalChanges % 3];

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

  return (
    <div className="dark-coords-main-content" style={{ height: '100%', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
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
          <CarAnimationLayer signalChanges={signalChanges} STOP_LINE_X={STOP_LINE_X} />
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
