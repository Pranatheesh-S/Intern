import React, { useState, useEffect } from 'react';
import { CheckCircle, FastForward, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ClockActivity({ onNext }) {
  // Time state
  const [rotations, setRotations] = useState(0);
  const [extraHours, setExtraHours] = useState(0); // 0 to 11
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState(0); 
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [finalAnswer, setFinalAnswer] = useState(null);
  
  const [errorMsg, setErrorMsg] = useState('');

  // Clock animation state
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
  const totalHoursAdded = (rotations * 12) + extraHours;
  const currentClockHour = ((clockStartHour + totalHoursAdded - 1) % 12) + 1;
  
  // Continuous angle for smooth winding
  const hourHandAngle = ((clockStartHour - 3) * 30) + (totalHoursAdded * 30);

  const handleQ1Submit = () => {
    if (parseInt(q1Answer) === 4) {
      setErrorMsg(''); setWizardStep(2);
    } else {
      setErrorMsg('Not quite. 50 ÷ 12 = ?');
    }
  };

  const handleQ2Submit = () => {
    if (parseInt(q2Answer) === 2) {
      setErrorMsg(''); setWizardStep(3);
      setRotations(4); setExtraHours(2);
    } else {
      setErrorMsg('Try again. 50 - (4 × 12) = ?');
    }
  };

  const handleFinalAnswer = (ans) => {
    setFinalAnswer(ans);
    if (ans === 11) {
      setErrorMsg(''); setWizardStep(4);
    } else {
      setErrorMsg('Remember, we just need to add the 2 extra hours to the starting time (9).');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', display: 'flex', background: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Realistic Wall Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 30%, #f1f5f9 0%, #cbd5e1 100%)',
        overflow: 'hidden', zIndex: 0
      }}>
        {/* Subtle wall texture */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4, mixBlendMode: 'multiply' }}>
          <filter id="wallNoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#wallNoise)"/>
        </svg>
      </div>

      <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 10 }}>
         <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '2px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
           Activity 2 of 3
         </div>
         <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: 0, textShadow: '0 2px 4px rgba(255,255,255,0.5)' }}>
           The Clock Pattern
         </h1>
      </div>

      {/* Left Area: Center the Clock */}
      <div style={{ flex: 1, paddingRight: '450px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        
        {/* Photorealistic Classic Wall Clock */}
        <div style={{
          position: 'relative', width: '500px', height: '500px', borderRadius: '50%',
          // Thick dark mahogany wood frame
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #270f01 100%)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 4px 10px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Inner brass rim */}
          <div style={{
            position: 'absolute', width: '430px', height: '430px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #92400e 100%)',
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.5), 0 5px 15px rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            
            {/* Clock Face (Vintage Cream Paper) */}
            <div style={{
              position: 'absolute', width: '410px', height: '410px', borderRadius: '50%',
              background: '#fffbeb', // warm cream
              boxShadow: 'inset 0 15px 40px rgba(0,0,0,0.3)', // deep shadow inside the rim
              overflow: 'hidden'
            }}>
              
              {/* Paper Texture */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, mixBlendMode: 'multiply' }}>
                <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="3" stitchTiles="stitch"/></filter>
                <rect width="100%" height="100%" filter="url(#paperNoise)"/>
              </svg>

              {/* Ticks (Classic thin lines) */}
              {[...Array(60)].map((_, i) => {
                const isHour = i % 5 === 0; 
                const angle = ((i - 15) * 6 * Math.PI) / 180;
                const r = isHour ? 175 : 185;
                const length = isHour ? 18 : 8;
                const thickness = isHour ? 4 : 2;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                return (
                  <div key={`tick-${i}`} style={{
                    position: 'absolute', left: '50%', top: '50%', width: `${length}px`, height: `${thickness}px`,
                    background: '#1c1917', borderRadius: '2px',
                    transform: `translate(calc(-50% + ${x - length/2}px), calc(-50% + ${y}px)) rotate(${i * 6}deg)`
                  }} />
                );
              })}

              {/* Numbers (Classic Serif Font) */}
              {[...Array(12)].map((_, i) => {
                const angle = ((i - 3) * 30 * Math.PI) / 180;
                const rText = 135;
                const xText = Math.cos(angle) * rText;
                const yText = Math.sin(angle) * rText;
                const hour = i === 0 ? 12 : i;
                const isTarget = hour === currentClockHour;

                return (
                  <div key={i} style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: `translate(calc(-50% + ${xText}px), calc(-50% + ${yText}px))`,
                    fontWeight: 'bold', fontSize: '42px', fontFamily: '"Times New Roman", Times, serif',
                    color: isTarget ? '#ea580c' : '#1c1917', // burnt orange for highlight
                    textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                    zIndex: 2, transition: 'color 0.3s'
                  }}>
                    {hour}
                  </div>
                );
              })}

              {/* Realistic Hands Container with Global Drop Shadow */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, filter: 'drop-shadow(4px 8px 6px rgba(0,0,0,0.4))' }}>
                
                {/* Minute Hand (Classic Spade Shape - approximated with CSS borders) */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transformOrigin: 'left center', transform: 'rotate(-90deg)'
                }}>
                  {/* Base pointer */}
                  <div style={{
                    position: 'absolute', left: '-20px', top: '-4px', width: '190px', height: '8px',
                    background: '#1c1917', borderRadius: '4px'
                  }} />
                  {/* Decorative spade tip */}
                  <div style={{
                    position: 'absolute', left: '160px', top: '-10px', width: '20px', height: '20px',
                    background: '#1c1917', borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute', left: '175px', top: '0',
                    borderLeft: '15px solid #1c1917', borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
                    transform: 'translateY(-50%)'
                  }} />
                </div>

                {/* Hour Hand (Dynamic) */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transformOrigin: 'left center',
                  transform: `rotate(${hourHandAngle}deg)`, transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                   {/* Base pointer */}
                   <div style={{
                    position: 'absolute', left: '-20px', top: '-6px', width: '130px', height: '12px',
                    background: '#1c1917', borderRadius: '6px'
                  }} />
                  {/* Decorative spade body */}
                  <div style={{
                    position: 'absolute', left: '70px', top: '-14px', width: '28px', height: '28px',
                    background: '#1c1917', borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute', left: '95px', top: '0',
                    borderLeft: '20px solid #1c1917', borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
                    transform: 'translateY(-50%)'
                  }} />
                </div>

                {/* Sweeping Second Hand (Thin Brass) */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', transformOrigin: 'left center',
                  transform: `rotate(${(currentSeconds * 6) - 90}deg)`
                }}>
                  <div style={{ position: 'absolute', left: '-30px', top: '-1px', width: '200px', height: '2px', background: '#d97706' }} />
                  <div style={{ position: 'absolute', left: '-25px', top: '-5px', width: '10px', height: '10px', background: '#d97706', borderRadius: '50%' }} />
                </div>

                {/* Center Pin (Brass) */}
                <div style={{
                  position: 'absolute', left: '50%', top: '50%', width: '16px', height: '16px',
                  background: 'radial-gradient(circle at 30% 30%, #fde68a 0%, #d97706 50%, #78350f 100%)',
                  borderRadius: '50%', transform: 'translate(-50%, -50%)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.6)', zIndex: 11
                }} />
              </div>

              {/* Heavy Glass Reflection Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 20 }} />
              <div style={{ position: 'absolute', top: '5%', left: '5%', width: '90%', height: '90%', background: 'radial-gradient(ellipse at top left, rgba(255,255,255,0.15) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 20 }} />

            </div>
          </div>
        </div>
      </div>

      {/* Right Floating Light Glass Panel */}
      <div style={{ 
          position: 'absolute', right: '40px', top: '40px', bottom: '40px', width: '480px',
          background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)', borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255,255,255,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 20
      }}>
        <div style={{ padding: '40px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <p style={{ fontSize: '18px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
              The clock repeats itself every 12 hours. Because of this, it <strong>wraps around</strong> seamlessly. 
            </p>
          </div>

          {wizardStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease-out' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Explore the Clock</h3>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={() => setRotations(r => r + 1)}
                  style={{
                    flex: 1, padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe',
                    borderRadius: '16px', color: '#2563eb', fontWeight: '700', fontSize: '16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.1)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#dbeafe' }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#eff6ff' }}
                >
                  <FastForward size={20} /> +12 Hours (1 Full Rotation)
                </button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.8)', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ color: '#475569', fontWeight: '600' }}>Add extra hours:</span>
                  <span style={{ color: '#0f172a', fontWeight: '800' }}>+{extraHours}</span>
                </div>
                <input 
                  type="range" min="0" max="11" 
                  value={extraHours} 
                  onChange={(e) => setExtraHours(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563eb', cursor: 'pointer', marginBottom: '24px' }}
                />

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontSize: '18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                  <span style={{ color: '#ea580c', fontWeight: '800' }}>{clockStartHour}</span>
                  <span style={{ color: '#94a3b8' }}>+</span>
                  <span style={{ color: '#64748b' }}>(</span>
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>{rotations}</span>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>x 12h</span>
                  <span style={{ color: '#64748b' }}>)</span>
                  <span style={{ color: '#94a3b8' }}>+</span>
                  <span style={{ color: '#2563eb', fontWeight: '800' }}>{extraHours}h</span>
                  <span style={{ color: '#94a3b8' }}>=</span>
                  <strong style={{ color: '#0f172a', fontSize: '22px' }}>{currentClockHour}</strong>
                </div>
              </div>

              <button 
                onClick={() => setWizardStep(1)}
                style={{
                  marginTop: '10px', padding: '18px', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  borderRadius: '16px', border: 'none', color: '#fff', fontWeight: '800', fontSize: '18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)'
                }}
              >
                Solve the 50-Hour Challenge <ArrowRight size={20} />
              </button>
            </div>
          )}

          {wizardStep > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.5s ease-out' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setWizardStep(0)}>
                <ArrowLeft size={20} color="#64748b" />
                <span style={{ color: '#64748b', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Back to Explore</span>
              </div>

              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '24px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#c2410c', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  If it is exactly 9 o'clock now, what time will it be after exactly 50 hours?
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: wizardStep === 1 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                <label style={{ fontSize: '16px', color: '#334155', fontWeight: '700', lineHeight: 1.5 }}>
                  1. How many full 12-hour rotations fit into 50 hours?
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input 
                    type="number" value={q1Answer} onChange={e => setQ1Answer(e.target.value)} disabled={wizardStep > 1}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '20px', fontWeight: 'bold' }}
                    placeholder="e.g. 2"
                  />
                  {wizardStep === 1 && (
                    <button onClick={handleQ1Submit} style={{ padding: '0 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Check</button>
                  )}
                  {wizardStep > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', color: '#16a34a' }}><CheckCircle size={28} /></div>
                  )}
                </div>
              </div>

              {wizardStep >= 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: wizardStep === 2 ? 1 : 0.5, transition: 'opacity 0.3s', animation: 'fadeIn 0.5s ease-out' }}>
                  <label style={{ fontSize: '16px', color: '#334155', fontWeight: '700', lineHeight: 1.5 }}>
                    2. We found 4 rotations (48 hours). How many extra hours are left over from 50?
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="number" value={q2Answer} onChange={e => setQ2Answer(e.target.value)} disabled={wizardStep > 2}
                      style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '20px', fontWeight: 'bold' }}
                      placeholder="e.g. 5"
                    />
                    {wizardStep === 2 && (
                      <button onClick={handleQ2Submit} style={{ padding: '0 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Check</button>
                    )}
                    {wizardStep > 2 && (
                      <div style={{ display: 'flex', alignItems: 'center', color: '#16a34a' }}><CheckCircle size={28} /></div>
                    )}
                  </div>
                </div>
              )}

              {wizardStep >= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.5s ease-out' }}>
                  <label style={{ fontSize: '18px', color: '#ea580c', fontWeight: '800', lineHeight: 1.5 }}>
                    3. Final Step: Add the {q2Answer} extra hours to the starting time (9). What is the time?
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[8, 9, 10, 11, 12].map(ans => {
                      const isSelected = finalAnswer === ans;
                      const isCorrect = ans === 11;
                      const isDone = wizardStep === 4;
                      
                      let bg = '#f8fafc';
                      let border = '#cbd5e1';
                      let color = '#334155';
                      
                      if (isDone) {
                        if (isCorrect) { bg = '#dcfce7'; border = '#22c55e'; color = '#16a34a'; }
                        else if (isSelected) { bg = '#fee2e2'; border = '#ef4444'; color = '#dc2626'; }
                      } else if (isSelected) {
                        bg = '#eff6ff'; border = '#3b82f6';
                      }

                      return (
                        <button
                          key={ans} onClick={() => handleFinalAnswer(ans)} disabled={isDone}
                          style={{
                            flex: '1 1 calc(20% - 10px)', padding: '16px 8px', borderRadius: '12px',
                            background: bg, border: `2px solid ${border}`, color: color, fontSize: '20px', fontWeight: '900',
                            cursor: isDone ? 'default' : 'pointer', transition: 'all 0.2s',
                            opacity: (isDone && !isCorrect) ? 0.5 : 1
                          }}
                        >
                          {ans}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#b91c1c', borderRadius: '0 8px 8px 0', fontSize: '15px', fontWeight: '600' }}>
                  {errorMsg}
                </div>
              )}

              {wizardStep === 4 && (
                <button
                  onClick={onNext}
                  style={{
                    marginTop: 'auto', width: '100%', background: '#16a34a', color: 'white', border: 'none',
                    padding: '20px', borderRadius: '16px', fontSize: '20px', fontWeight: '800', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)', animation: 'fadeIn 0.5s ease-out'
                  }}
                >
                  Activity Complete! <CheckCircle size={24} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
