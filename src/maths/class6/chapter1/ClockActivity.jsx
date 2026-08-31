import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function ClockActivity({ onNext }) {
  const [clockAddHours, setClockAddHours] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  const [currentSeconds, setCurrentSeconds] = useState(0);

  useEffect(() => {
    let animationFrame;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      setCurrentSeconds((elapsed / 1000) % 60);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const clockStartHour = 9;
  const currentClockHour = ((clockStartHour + clockAddHours - 1) % 12) + 1;

  return (
    <div className="dark-coords-main-content" style={{ minHeight: '100vh', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Visual Column */}
      <div className="dark-coords-left" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column', background: '#020617' }}>
        
        {/* Immersive Deep Space Background */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(ellipse at center, #0B0F19 0%, #000000 100%)',
          overflow: 'hidden'
        }}>
          {/* Intense Nebula Clouds */}
          <div style={{
            position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%',
            background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 10%, rgba(14, 165, 233, 0.1) 0%, transparent 40%)',
            filter: 'blur(40px)', mixBlendMode: 'screen'
          }} />
          
          {/* Parallax Star Layers */}
          {[...Array(30)].map((_, i) => (
             <div key={`star-sm-${i}`} style={{
               position: 'absolute',
               width: '1px', height: '1px', background: '#fff', borderRadius: '50%',
               top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
               opacity: Math.random() * 0.4 + 0.1
             }} />
          ))}
          {[...Array(20)].map((_, i) => (
             <div key={`star-md-${i}`} style={{
               position: 'absolute',
               width: '2px', height: '2px', background: Math.random() > 0.5 ? '#93c5fd' : '#fca5a5', borderRadius: '50%',
               top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
               opacity: Math.random() * 0.6 + 0.3,
               boxShadow: '0 0 8px rgba(255,255,255,0.8)'
             }} />
          ))}
          {[...Array(5)].map((_, i) => (
             <div key={`star-lg-${i}`} style={{
               position: 'absolute',
               width: '3px', height: '3px', background: '#fff', borderRadius: '50%',
               top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
               opacity: 1,
               boxShadow: '0 0 15px 2px rgba(255,255,255,1)'
             }} />
          ))}
        </div>

        <div style={{
          flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px'
        }}>
          {/* The Highly Realistic Premium Clock */}
          <div style={{
            position: 'relative',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            // Outer Brushed Metal Chamfer
            background: 'linear-gradient(135deg, #e2e8f0 0%, #64748b 30%, #1e293b 70%, #94a3b8 100%)',
            boxShadow: '0 50px 100px rgba(0,0,0,0.9), 0 0 0 1px #000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Inner Metallic Bezel Ring */}
            <div style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0f172a 0%, #475569 50%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.4), inset 0 -2px 10px rgba(0,0,0,0.8)'
            }}>
              
              {/* Dial (Face) */}
              <div style={{
                position: 'absolute',
                width: '330px',
                height: '330px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at center, #1e293b 0%, #020617 100%)',
                boxShadow: 'inset 0 15px 40px rgba(0,0,0,0.9)',
                overflow: 'hidden'
              }}>
                
                {/* Dial Texture (Carbon/Matte look) */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.15, mixBlendMode: 'overlay' }}>
                  <filter id="noiseFilter">
                    <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" stitchTiles="stitch"/>
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
                </svg>

                {/* Sub-dials/Rings */}
                <div style={{
                  position: 'absolute', top: '2%', left: '2%', width: '96%', height: '96%',
                  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)'
                }} />
                <div style={{
                  position: 'absolute', top: '15%', left: '15%', width: '70%', height: '70%',
                  borderRadius: '50%', border: '2px dashed rgba(255,255,255,0.03)'
                }} />

                {/* Minute Ticks */}
                {[...Array(60)].map((_, i) => {
                  const isHour = i % 5 === 0; 
                  const angle = ((i - 15) * 6 * Math.PI) / 180;
                  const r = isHour ? 148 : 154;
                  const length = isHour ? 14 : 6;
                  const thickness = isHour ? 4 : 2;
                  const x = Math.cos(angle) * r;
                  const y = Math.sin(angle) * r;
                  return (
                    <div key={`tick-${i}`} style={{
                      position: 'absolute', left: '50%', top: '50%',
                      width: `${length}px`, height: `${thickness}px`,
                      background: isHour ? '#fff' : 'rgba(255,255,255,0.3)',
                      boxShadow: isHour ? '0 0 8px rgba(255,255,255,0.6)' : 'none',
                      borderRadius: '2px',
                      transform: `translate(calc(-50% + ${x - length/2}px), calc(-50% + ${y}px)) rotate(${i * 6}deg)`
                    }} />
                  );
                })}

                {/* 3D Metallic Numbers */}
                {[...Array(12)].map((_, i) => {
                  const angle = ((i - 3) * 30 * Math.PI) / 180;
                  const rText = 115;
                  const xText = Math.cos(angle) * rText;
                  const yText = Math.sin(angle) * rText;
                  const hour = i === 0 ? 12 : i;
                  const isTarget = hour === clockStartHour;

                  return (
                    <div key={i} style={{
                      position: 'absolute', left: '50%', top: '50%',
                      transform: `translate(calc(-50% + ${xText}px), calc(-50% + ${yText}px))`,
                      fontWeight: '800', fontSize: '26px',
                      fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                      color: isTarget ? '#fcd34d' : '#f8fafc',
                      // Gives a sharp embossed 3D metallic feel
                      textShadow: isTarget 
                        ? '0 0 20px rgba(245, 158, 11, 0.9), 1px 1px 0px #b45309, -1px -1px 0px #fef3c7' 
                        : '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.2)',
                      zIndex: 2
                    }}>
                      {hour}
                    </div>
                  );
                })}

                {/* Glass Glare Overlay (Curved Reflections) */}
                <div style={{
                  position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.03) 100%)',
                  borderRadius: '50%', pointerEvents: 'none', zIndex: 20
                }} />
                
                {/* Crescent Glare */}
                <div style={{
                  position: 'absolute', top: '2%', left: '10%', width: '80%', height: '35%',
                  background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 70%)',
                  borderRadius: '50%', pointerEvents: 'none', zIndex: 20
                }} />

                {/* Hands container */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}>
                  
                  {/* Minute Hand (Static at 12, highly realistic sword shape) */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transformOrigin: 'left center', transform: 'rotate(-90deg)',
                    filter: 'drop-shadow(15px 15px 10px rgba(0,0,0,0.6))'
                  }}>
                    {/* Metal body */}
                    <div style={{
                      position: 'absolute', left: '-15px', top: '-4px', width: '140px', height: '8px',
                      background: 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 50%, #94a3b8 100%)',
                      clipPath: 'polygon(0 20%, 90% 40%, 100% 50%, 90% 60%, 0 80%)'
                    }}>
                      {/* Luminescent core */}
                      <div style={{ position: 'absolute', left: '20px', top: '30%', width: '100px', height: '40%', background: '#fff', borderRadius: '10px', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }} />
                    </div>
                  </div>

                  {/* The Hour Hand (Dynamic) */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transformOrigin: 'left center',
                    transform: `rotate(${(currentClockHour - 3) * 30}deg)`,
                    transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    filter: 'drop-shadow(12px 12px 8px rgba(0,0,0,0.6))'
                  }}>
                     {/* Metal body */}
                     <div style={{
                      position: 'absolute', left: '-10px', top: '-5px', width: '100px', height: '10px',
                      background: 'linear-gradient(180deg, #3b82f6 0%, #7dd3fc 50%, #3b82f6 100%)',
                      clipPath: 'polygon(0 20%, 90% 40%, 100% 50%, 90% 60%, 0 80%)',
                      boxShadow: 'inset 0 0 5px rgba(255,255,255,0.5)'
                    }}>
                      {/* Glowing core */}
                      <div style={{ position: 'absolute', left: '15px', top: '30%', width: '60px', height: '40%', background: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(59,130,246,0.8)' }} />
                    </div>
                  </div>

                  {/* Sweeping Second Hand (Red, ultra-thin, precise) */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transformOrigin: 'left center',
                    transform: `rotate(${(currentSeconds * 6) - 90}deg)`,
                    filter: 'drop-shadow(20px 20px 15px rgba(0,0,0,0.4))'
                  }}>
                    <div style={{
                      position: 'absolute', left: '-30px', top: '-1px', width: '170px', height: '2px',
                      background: '#ef4444'
                    }} />
                    {/* Counterweight circle */}
                    <div style={{
                      position: 'absolute', left: '-25px', top: '-5px', width: '10px', height: '10px',
                      background: '#ef4444', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)'
                    }} />
                  </div>

                  {/* The Center Cap / Pin (3D machined metal) */}
                  <div style={{
                    position: 'absolute', left: '50%', top: '50%', width: '20px', height: '20px',
                    background: 'radial-gradient(circle at 40% 40%, #f8fafc 0%, #94a3b8 40%, #0f172a 100%)',
                    borderRadius: '50%', transform: 'translate(-50%, -50%)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.8), inset 0 -2px 5px rgba(0,0,0,0.8)', zIndex: 11
                  }}>
                    <div style={{ position: 'absolute', left: '20%', top: '20%', width: '40%', height: '40%', background: 'rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text/Interaction Column */}
      <div className="dark-coords-right" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '40px' }}>
        <div>
          <div className="dark-top-title" style={{ fontSize: '14px', marginBottom: '8px', opacity: 0.8 }}>ACTIVITY 2 OF 3</div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px', color: '#f8fafc' }}>
            The Clock Pattern
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6' }}>
            The clock repeats itself every 12 hours. It <strong>wraps around</strong> seamlessly.
          </p>
        </div>

        {/* Time Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '600' }}>Add hours:</span>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '6px 16px', borderRadius: '8px', color: '#60a5fa', fontWeight: '800', fontSize: '18px' }}>
              +{clockAddHours}
            </div>
          </div>
          <input 
            type="range" 
            min="0" max="24" 
            value={clockAddHours} 
            onChange={(e) => setClockAddHours(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
          />
          <div style={{ fontSize: '20px', fontWeight: '300', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <span style={{ color: '#f59e0b', fontWeight: '600' }}>{clockStartHour}</span>
            <span style={{ color: '#64748b' }}>+</span>
            <span>{clockAddHours} hr</span>
            <span style={{ color: '#64748b' }}>→</span>
            <strong style={{ color: '#fff' }}>{currentClockHour} o'clock</strong>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#e2e8f0', lineHeight: 1.5 }}>
            If it is exactly <strong>9 o'clock</strong> now, what time will it be after exactly <strong>50 hours</strong>?
          </h3>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[8, 9, 10, 11, 12].map(ans => {
              const isSelected = selectedAnswer === ans;
              const isCorrect = ans === 11;
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
                    flex: '1 1 calc(20% - 10px)',
                    padding: '16px 8px', borderRadius: '12px',
                    background: btnBg, border: `2px solid ${btnBorder}`,
                    color: '#fff', fontSize: '18px', fontWeight: '600',
                    cursor: showResult ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: showResult && !isSelected && !isCorrect ? 0.5 : 1,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                  }}
                >
                  {ans}
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div style={{ marginTop: '20px', fontSize: '15px', color: selectedAnswer === 11 ? '#4ade80' : '#f87171', fontWeight: '500', lineHeight: 1.5 }}>
              {selectedAnswer === 11 
                ? "Correct! 50 ÷ 12 = 4 with a remainder of 2. It's the same as adding 2 hours: 9 + 2 = 11." 
                : 'Not quite. Try to find the remainder when 50 is divided by 12!'}
            </div>
          )}

          {selectedAnswer === 11 && (
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
