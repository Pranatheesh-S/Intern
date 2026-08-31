import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle } from 'lucide-react';

export default function ManActivity({ onNext, onPrev }) {
  const [targetStage, setTargetStage] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactionPhase, setInteractionPhase] = useState('observing');
  // Phases: 'observing', 'predicting_first', 'animating_first', 'explaining_pattern', 'predicting_second', 'animating_second', 'completed'
  
  const [predictedValue1, setPredictedValue1] = useState(null);
  const [predictedValue2, setPredictedValue2] = useState(null);
  
  const requestRef = useRef();
  const lastTimeRef = useRef();
  
  const targetStageRef = useRef(targetStage);
  const interactionPhaseRef = useRef(interactionPhase);

  useEffect(() => { targetStageRef.current = targetStage; }, [targetStage]);
  useEffect(() => { interactionPhaseRef.current = interactionPhase; }, [interactionPhase]);
  
  const GROUND_Y = 280;
  const GRAVITY = 1000;
  const VX = 200;

  const WINDUP_START_X = 120.29; // Calculated from hand pos at 0 degrees, 100 tx
  const WINDUP_START_Y = 164.73; // Calculated from hand pos at 0 degrees, 100 tx
  const RELEASE_X = 150;
  const RELEASE_Y = 170;
  
  const bounceVys = [
    -Math.sqrt(2 * GRAVITY * 70), // Arc 2
    -Math.sqrt(2 * GRAVITY * 35), // Arc 3
    -Math.sqrt(2 * GRAVITY * 17.5), // Arc 4
    -Math.sqrt(2 * GRAVITY * 8.75), // Arc 5
    -Math.sqrt(2 * GRAVITY * 4.375), // Arc 6
  ];

  const stateRef = useRef({
    phase: 'idle', 
    windupTimer: 0,
    x: WINDUP_START_X,
    y: WINDUP_START_Y,
    vy: 0,
    bounceIndex: 0,
    pathPoints: []
  });

  const [renderState, setRenderState] = useState({ 
    phase: 'idle',
    windupTimer: 0,
    x: WINDUP_START_X, 
    y: WINDUP_START_Y, 
    pathPoints: [],
    bounceIndex: 0
  });

  const resetPhysics = () => {
    stateRef.current = {
      phase: 'idle',
      windupTimer: 0,
      x: WINDUP_START_X,
      y: WINDUP_START_Y,
      vy: 0,
      bounceIndex: 0,
      pathPoints: []
    };
    setTargetStage(0);
    setIsPlaying(false);
    setInteractionPhase('observing');
    setPredictedValue1(null);
    setPredictedValue2(null);
    setRenderState({ ...stateRef.current });
  };

  const advanceStage = () => {
    if (targetStage < 3) {
      setTargetStage(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const update = (time) => {
    if (lastTimeRef.current != undefined && isPlaying) {
      if (!stateRef.current) return;
      
      let { phase, windupTimer, x, y, vy, bounceIndex, pathPoints } = stateRef.current;
      
      let deltaTime = (time - lastTimeRef.current) / 1000;
      if (deltaTime < 0) deltaTime = 0;
      if (deltaTime > 0.05) deltaTime = 0.05;

      if (phase === 'idle' && targetStageRef.current > bounceIndex) {
        if (bounceIndex === 0) {
          phase = 'windup';
        } else {
          phase = 'flying';
          vy = bounceVys[bounceIndex - 1];
        }
      } else if (phase === 'windup') {
        windupTimer += deltaTime;
        const progress = Math.min(windupTimer / 0.15, 1.0);
        
        let currentRotation = 0;
        let currentTranslateX = 100;
        if (progress < 0.6) {
           const p = progress / 0.6;
           currentRotation = (p * (2 - p)) * -4; // Very subtle lean
           currentTranslateX = 100 - (p * (2 - p)) * 4; 
        } else {
           const p = (progress - 0.6) / 0.4;
           currentRotation = -4 + (p * p) * 14; // Snaps to 10
           currentTranslateX = 96 + (p * p) * 14; // Shift forward to 110
        }
        
        const rx = 20.29;
        const ry = -115.27;
        const theta = currentRotation * Math.PI / 180;
        x = currentTranslateX + rx * Math.cos(theta) - ry * Math.sin(theta);
        y = 280 + rx * Math.sin(theta) + ry * Math.cos(theta);
        
        if (windupTimer >= 0.15) {
          phase = 'flying';
          x = RELEASE_X; 
          y = RELEASE_Y; 
          vy = -Math.sqrt(2 * GRAVITY * 30);
          pathPoints = [{ x, y }]; 
        }
      } else if (phase === 'flying') {
        vy += GRAVITY * deltaTime;
        x += VX * deltaTime;
        y += vy * deltaTime;
        
        pathPoints.push({ x, y });

        if (y >= GROUND_Y && vy > 0) {
          y = GROUND_Y;
          bounceIndex++;
          
          if (bounceIndex === targetStageRef.current) {
            phase = 'idle'; 
            
            if (bounceIndex === 3 && interactionPhaseRef.current === 'observing') {
              setInteractionPhase('predicting_first');
            }
            if (bounceIndex === 4 && interactionPhaseRef.current === 'animating_first') {
              setInteractionPhase('explaining_pattern');
            }
            if (bounceIndex === 5 && interactionPhaseRef.current === 'animating_fifth') {
              setInteractionPhase('predicting_second');
            }
            if (bounceIndex === 6 && interactionPhaseRef.current === 'animating_second') {
              setInteractionPhase('completed');
            }
          } else if (bounceIndex < bounceVys.length + 1) {
            vy = bounceVys[bounceIndex - 1];
          }
        }
      }

      stateRef.current = { phase, windupTimer, x, y, vy, bounceIndex, pathPoints };
      setRenderState({ phase, windupTimer, x, y, pathPoints: [...pathPoints], bounceIndex });
      
      if (phase === 'idle') {
        setIsPlaying(false);
      }
    }
    
    lastTimeRef.current = time;
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  const handleFirstPredict = (val) => {
    if (val === 17.5) {
      setInteractionPhase('animating_first');
      setTargetStage(4);
      setIsPlaying(true);
    }
  };

  const handleSecondPredict = (val) => {
    if (val === 4.375 && predictedValue1 === 8.75) {
      setPredictedValue2(val);
      setInteractionPhase('animating_second');
      setTargetStage(6);
      setIsPlaying(true);
    } else if (val === 8.75) {
      setPredictedValue1(val);
      setInteractionPhase('animating_fifth');
      setTargetStage(5);
      setIsPlaying(true);
    }
  };

  let boyRotation = 0;
  let boyTranslateX = 100;
  if (renderState.phase === 'windup') {
    const progress = Math.min(renderState.windupTimer / 0.15, 1.0);
    if (progress < 0.6) {
       const p = progress / 0.6;
       boyRotation = (p * (2 - p)) * -4;
       boyTranslateX = 100 - (p * (2 - p)) * 4;
    } else {
       const p = (progress - 0.6) / 0.4;
       boyRotation = -4 + (p * p) * 14;
       boyTranslateX = 96 + (p * p) * 14;
    }
  } else if (renderState.bounceIndex > 0 || renderState.phase === 'flying') {
    boyRotation = 10;
    boyTranslateX = 110;
  }

  const peaks = [
    { x: 199, y: 140, label: '140 cm' },
    { x: 380, y: 210, label: '70 cm' },
    { x: 507, y: 245, label: '35 cm' },
    { x: 598, y: 262.5, label: '17.5 cm' },
    { x: 662, y: 271.25, label: '8.75 cm' },
    { x: 707, y: 275.625, label: '4.375 cm' }
  ];

  const getPathString = () => {
    if (renderState.pathPoints.length === 0) return '';
    return `M ${renderState.pathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  };

  return (
    <div style={{
      background: '#040814',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      padding: '40px 60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <style>
        {`
          .premium-choice-btn {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 12px 20px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 90px;
            text-align: center;
          }
          .premium-choice-btn:hover {
            background: rgba(249, 115, 22, 0.15);
            border-color: rgba(249, 115, 22, 0.4);
            color: #F97316;
            transform: translateY(-2px);
          }
          .premium-action-btn {
            background: rgba(249, 115, 22, 0.15);
            border: 1px solid rgba(249, 115, 22, 0.3);
            border-radius: 12px;
            padding: 0 24px;
            height: 48px;
            color: #F97316;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .premium-action-btn:hover:not(:disabled) {
            background: rgba(249, 115, 22, 0.25);
            transform: translateY(-2px);
          }
          .premium-action-btn:disabled {
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.3);
            cursor: default;
          }
        `}
      </style>

      {/* Top Header */}
      <div style={{
        textAlign: 'center',
        opacity: 0.7,
        fontSize: '13px',
        letterSpacing: '2px',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: '40px'
      }}>
        Step 3 of 4 — The Parabola Pattern
      </div>

      {/* Cinematic Visualization Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1000px',
          height: '400px',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 100%, rgba(24, 32, 56, 0.5) 0%, rgba(4, 8, 20, 0) 80%)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          <svg viewBox="0 0 1000 350" style={{ width: '100%', height: '100%', display: 'block' }}>
            <defs>
              <radialGradient id="ballGradient" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fdba74" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </radialGradient>
            </defs>

            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
            <rect width="1000" height="350" fill="url(#grid)" />
            
            <line x1="40" y1={GROUND_Y} x2="960" y2={GROUND_Y} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

            {/* Peak Markers (Engineering style) */}
            {peaks.map((peak, i) => {
              let isVisible = false;
              let label = peak.label;
              
              if (i < 3) {
                isVisible = targetStage >= i + 1;
              } else if (i === 3) {
                isVisible = targetStage >= 3; 
                if (interactionPhase === 'observing' || interactionPhase === 'predicting_first') {
                  label = '?';
                }
              } else if (i >= 4) {
                isVisible = targetStage >= i + 1;
              }
              
              if (!isVisible) return null;
              
              const isCurrent = targetStage === i + 1 || (i === 3 && interactionPhase === 'predicting_first');

              return (
                <g key={i} style={{ transition: 'opacity 0.5s ease', opacity: isCurrent ? 1 : 0.4 }}>
                  <line 
                    x1={peak.x} y1={peak.y} 
                    x2={peak.x} y2={GROUND_Y} 
                    stroke="rgba(255,255,255,0.2)" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <line 
                    x1={peak.x - 10} y1={peak.y} 
                    x2={peak.x + 10} y2={peak.y} 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={peak.x} y={peak.y - 15} 
                    textAnchor="middle" 
                    fill={isCurrent ? '#F97316' : 'rgba(255,255,255,0.6)'} 
                    fontSize="13" 
                    fontWeight="500"
                    letterSpacing="0.5px"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Smooth Continuous Trajectory Curve */}
            {renderState.pathPoints.length > 0 && (
              <path 
                d={getPathString()} 
                fill="none" 
                stroke="#F97316" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
                style={{ filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.4))' }}
              />
            )}

            {/* Boy rendering */}
            <g transform={`translate(${boyTranslateX}, 280) scale(0.55) rotate(${boyRotation}, 0, 0)`} style={{ transition: renderState.phase === 'windup' ? 'none' : 'transform 0.5s ease-out' }}>
              <ellipse cx="0" cy="0" rx="60" ry="10" fill="#000000" opacity="0.8" filter="blur(6px)" />
              <rect x="-60" y="-30" width="120" height="30" fill="#040814" />
              <image 
                href="/boy_throwing.jpg" 
                transform="scale(-1, 1)"
                x="-110" 
                y="-240" 
                width="220" 
                height="240" 
                preserveAspectRatio="xMidYMid slice"
                style={{ 
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.6) brightness(0.7) grayscale(0.1)',
                  maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
                }}
              />
            </g>

            {/* Dynamic Ball Ground Shadow */}
            {renderState.phase === 'flying' && (
              <ellipse 
                cx={renderState.x} 
                cy={GROUND_Y} 
                rx={Math.max(2, 12 - (GROUND_Y - renderState.y) * 0.05)} 
                ry="3" 
                fill="#000000" 
                opacity={Math.max(0, 0.4 - (GROUND_Y - renderState.y) * 0.003)} 
                style={{ filter: 'blur(2px)' }}
              />
            )}

            {/* The 3D Realistic Ball */}
            <circle 
              cx={renderState.x} 
              cy={renderState.y} 
              r="6.5" 
              fill="url(#ballGradient)" 
              style={{ filter: 'drop-shadow(0 4px 6px rgba(249, 115, 22, 0.3))' }}
            />
          </svg>
        </div>

        {/* Unified Bottom Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '24px 32px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1000px',
          marginTop: '32px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}>
          {/* Left Content (Text & Sequence) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: '600' }}>
              {interactionPhase === 'completed' ? 'Pattern Found ✓' : (interactionPhase.startsWith('predicting') ? 'Predict' : 'Observe')}
            </div>
            
            <div style={{ fontSize: '24px', fontWeight: '300', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ opacity: targetStage >= 1 ? 1 : 0.2 }}>140</span>
              <span style={{ color: '#F97316', opacity: targetStage >= 2 ? 1 : 0 }}>→</span>
              <span style={{ opacity: targetStage >= 2 ? 1 : 0.2 }}>70</span>
              <span style={{ color: '#F97316', opacity: targetStage >= 3 ? 1 : 0 }}>→</span>
              <span style={{ opacity: targetStage >= 3 ? 1 : 0.2 }}>35</span>
              
              <span style={{ color: '#F97316', opacity: targetStage >= 3 ? 1 : 0 }}>→</span>
              {interactionPhase === 'predicting_first' || (targetStage === 3 && interactionPhase === 'observing') ? (
                 <span style={{ opacity: 1, color: '#F97316', fontWeight: '500' }}>?</span>
              ) : (
                 <span style={{ opacity: targetStage >= 4 ? 1 : 0.2 }}>17.5</span>
              )}

              {(interactionPhase === 'predicting_second' || interactionPhase === 'animating_fifth' || interactionPhase === 'animating_second' || interactionPhase === 'completed') && (
                <>
                  <span style={{ color: '#F97316', opacity: 1 }}>→</span>
                  <span style={{ opacity: interactionPhase === 'completed' ? 1 : (predictedValue1 ? 1 : 0.5), color: predictedValue1 ? '#fff' : '#F97316', fontWeight: predictedValue1 ? '300' : '500' }}>
                    {interactionPhase === 'completed' ? '8.75' : (predictedValue1 || '?')}
                  </span>
                  <span style={{ color: '#F97316', opacity: 1 }}>→</span>
                  <span style={{ opacity: interactionPhase === 'completed' ? 1 : (predictedValue2 ? 1 : 0.5), color: predictedValue2 ? '#fff' : '#F97316', fontWeight: predictedValue2 ? '300' : '500' }}>
                    {interactionPhase === 'completed' ? '4.375' : (predictedValue2 || '?')}
                  </span>
                </>
              )}
            </div>

            {interactionPhase === 'predicting_first' && (
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>What will the next height be?</div>
            )}
            
            {interactionPhase === 'explaining_pattern' && (
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                Each height is exactly half of the previous height.
                <div style={{ display: 'flex', gap: '20px', marginTop: '12px', color: '#F97316', fontSize: '14px', fontFamily: 'monospace' }}>
                  <span>140 ÷ 2 = 70</span>
                  <span>70 ÷ 2 = 35</span>
                  <span>35 ÷ 2 = 17.5</span>
                </div>
              </div>
            )}

            {interactionPhase === 'predicting_second' && (
              <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Can you predict the next two heights?</div>
            )}
          </div>

          {/* Right Content (Controls) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            {interactionPhase === 'observing' && (
              <button 
                className="premium-action-btn" 
                onClick={advanceStage} 
                disabled={isPlaying}
              >
                {targetStage === 0 ? 'Start Throw' : 'Next Arc'} 
                <SkipForward size={18} />
              </button>
            )}
            
            {interactionPhase === 'predicting_first' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {[8.75, 17.5, 20].map(val => (
                  <button key={val} className="premium-choice-btn" onClick={() => handleFirstPredict(val)}>
                    {val} cm
                  </button>
                ))}
              </div>
            )}

            {interactionPhase === 'explaining_pattern' && (
              <button className="premium-action-btn" onClick={() => setInteractionPhase('predicting_second')}>
                Continue Challenge <SkipForward size={18} />
              </button>
            )}

            {interactionPhase === 'predicting_second' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                 {!predictedValue1 && (
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginRight: '8px' }}>5th height:</span>
                     {[10, 8.75, 8].map(val => (
                       <button key={val} className="premium-choice-btn" onClick={() => handleSecondPredict(val)}>{val} cm</button>
                     ))}
                   </div>
                 )}
                 {predictedValue1 && !predictedValue2 && (
                   <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                     <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginRight: '8px' }}>6th height:</span>
                     {[5, 4.375, 4].map(val => (
                       <button key={val} className="premium-choice-btn" onClick={() => handleSecondPredict(val)}>{val} cm</button>
                     ))}
                   </div>
                 )}
              </div>
            )}

            {interactionPhase === 'completed' && (
              <button className="premium-action-btn" onClick={onNext} style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#22c55e' }}>
                Next Chapter <CheckCircle size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Bottom Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '24px',
        marginTop: 'auto'
      }}>
        <button onClick={onPrev} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <button onClick={onNext} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          Skip
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
