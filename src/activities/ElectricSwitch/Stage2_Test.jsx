import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  MousePointerClick,
  Sparkles,
  Zap
} from 'lucide-react';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

const CONDUCTOR_ITEMS = [
  { id: 'metal', name: 'Safety Pin', type: 'Conductor (Metal)', desc: 'Conducts electric current and closes the circuit gap.' },
  { id: 'plastic', name: 'Plastic Clip', type: 'Insulator (Plastic)', desc: 'Non-conductive plastic; current cannot pass through.' },
  { id: 'wood', name: 'Wooden Stick', type: 'Insulator (Wood)', desc: 'Non-conductive wood; current cannot pass through.' }
];

export default function Stage2_Test({ onComplete }) {
  const [prediction, setPrediction] = useState(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('metal');
  const [isPinConnected, setIsPinConnected] = useState(false);
  const [testTriggered, setTestTriggered] = useState(false);

  const handlePredictSubmit = () => {
    if (prediction !== null) {
      setPredictionSubmitted(true);
    }
  };

  const handleToggleSwitch = () => {
    if (!predictionSubmitted) return;
    const nextState = !isPinConnected;
    setIsPinConnected(nextState);
    setTestTriggered(true);

    if (nextState && selectedMaterial === 'metal') {
      confetti({
        particleCount: 50,
        spread: 70,
        colors: ['#60a5fa', '#fde047', '#38bdf8', '#ffffff'],
        origin: { x: 0.65, y: 0.6 },
      });
    }
  };

  const handleSelectMaterial = (matId) => {
    setSelectedMaterial(matId);
    setIsPinConnected(false);
  };

  const handleReset = () => {
    setPrediction(null);
    setPredictionSubmitted(false);
    setSelectedMaterial('metal');
    setIsPinConnected(false);
    setTestTriggered(false);
  };

  const isConductor = selectedMaterial === 'metal';
  const isCurrentFlowing = isPinConnected && isConductor;
  const isBulbOn = isCurrentFlowing;
  const isPredictionCorrect = (prediction === 'on' && isConductor) || (prediction === 'off' && !isConductor);

  return (
    <div className="main-grid" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Left Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', borderColor: '#fde68a' }}>
            Stage 2: Test the Switch
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', color: 'var(--text-heading)' }}>Active Learning</h2>
          <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-muted)' }}>
            Align the safety pin to bridge the drawing pins and test electric current flow!
          </p>
        </div>

        {/* Prediction step */}
        {!predictionSubmitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <HelpCircle style={{ color: 'var(--accent-text)' }} size={20} />
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Predict the Outcome</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                What will happen to the electric bulb when you drag/align the metallic safety pin so that it touches Drawing Pin 2?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => setPrediction('on')}
                  style={{
                    justifyContent: 'flex-start',
                    background: prediction === 'on' ? 'var(--accent-bg)' : 'var(--card-bg)',
                    borderColor: prediction === 'on' ? 'var(--accent-text)' : 'var(--border)',
                    color: prediction === 'on' ? 'var(--accent-text)' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', width: '8px', height: '8px', 
                    borderRadius: '50%', background: 'var(--warning)', marginRight: '0.5rem'
                  }} />
                  The Bulb will turn ON (Glow)
                </button>

                <button
                  onClick={() => setPrediction('off')}
                  style={{
                    justifyContent: 'flex-start',
                    background: prediction === 'off' ? 'var(--danger-bg)' : 'var(--card-bg)',
                    borderColor: prediction === 'off' ? 'var(--danger)' : 'var(--border)',
                    color: prediction === 'off' ? 'var(--danger)' : 'var(--text-muted)',
                    borderRadius: '10px',
                    padding: '0.65rem 0.9rem',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', width: '8px', height: '8px', 
                    borderRadius: '50%', background: 'var(--text-faint)', marginRight: '0.5rem'
                  }} />
                  The Bulb will stay OFF (No Light)
                </button>
              </div>
            </div>

            <button
              onClick={handlePredictSubmit}
              disabled={prediction === null}
              className="primary"
              style={{ width: '100%', gap: '0.5rem' }}
            >
              <Play size={16} fill="currentColor" /> Submit Prediction &amp; Start Test
            </button>
          </div>
        ) : (
          /* Test & Observe */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-faint)', fontWeight: 'bold', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                PREDICTION SUBMITTED
              </span>
              <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-secondary)' }}>
                Your prediction: <strong style={{ color: prediction === 'on' ? 'var(--warning)' : 'var(--text-muted)' }}>
                  Bulb will stay {prediction.toUpperCase()}
                </strong>
              </p>
            </div>

            {/* Switch Arm Material Tray Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                SELECT SWITCH ARM MATERIAL:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                {CONDUCTOR_ITEMS.map((item) => {
                  const isSel = selectedMaterial === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectMaterial(item.id)}
                      style={{
                        padding: '0.5rem 0.25rem',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        background: isSel ? 'var(--accent-bg)' : 'var(--surface)',
                        border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                        color: isSel ? 'var(--accent-text)' : 'var(--text-secondary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!testTriggered ? (
              <div className="pulse-target" style={{ 
                background: 'var(--accent-bg)', 
                border: '1px solid var(--accent-border)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <MousePointerClick size={24} style={{ color: 'var(--accent-text)', flexShrink: 0 }} />
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Align the Switch Arm!</h4>
                  <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Click or drag the safety pin on the right canvas to touch Drawing Pin 2 and complete the circuit.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: isBulbOn ? 'var(--success-bg)' : 'var(--danger-bg)', 
                  border: isBulbOn ? '1px solid #a7f3d0' : '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                  {isBulbOn ? (
                    <CheckCircle2 style={{ color: 'var(--success)' }} size={18} />
                  ) : (
                    <HelpCircle style={{ color: 'var(--danger)' }} size={18} />
                  )}
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {isBulbOn ? 'Circuit CLOSED (Current Flowing)' : 'Circuit OPEN / Broken Path'}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {isBulbOn ? (
                    <>
                      {isPredictionCorrect ? (
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Great Job! </span>
                      ) : null}
                      The metallic safety pin acts as a <strong>conductor</strong>. Touching Drawing Pin 2 completes the unbroken circuit loop, turning the bulb <strong>ON</strong>!
                    </>
                  ) : (
                    <>
                      {!isConductor ? (
                        <span>The <strong>{CONDUCTOR_ITEMS.find(i => i.id === selectedMaterial)?.name}</strong> is an insulator. Even when aligned, current cannot pass through it!</span>
                      ) : (
                        <span>When the safety pin is swung away, an air gap is left. Since air is an insulator, the path is broken and the bulb remains <strong>OFF</strong>.</span>
                      )}
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Live Stats Card */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
              background: 'var(--surface)', borderRadius: '10px', padding: '0.75rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>SWITCH ARM</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: isPinConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                  {isPinConnected ? 'ALIGNED (CONNECTED)' : 'OPEN (GAP)'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>BULB LIGHT</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: isBulbOn ? 'var(--warning)' : 'var(--text-faint)' }}>
                  {isBulbOn ? '💡 GLOWING' : 'DARK'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
          <button onClick={handleReset} className="outline" style={{ flex: 1, gap: '0.35rem' }}>
            <RotateCcw size={16} /> Reset
          </button>
          <button 
            onClick={onComplete} 
            className="success"
            disabled={!testTriggered}
            style={{ flex: 2, gap: '0.35rem' }}
          >
            Explore Sandbox <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Panel: Interactive SVG Canvas Workspace */}
      <div className="canvas-container" style={{ padding: '2rem', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div className="canvas-bg-grid" />
        
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
          <span className={`status-badge ${isBulbOn ? 'closed' : 'open'}`}>
            {isBulbOn ? 'Closed Circuit' : 'Open Circuit'}
          </span>
        </div>

        <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ width: '100%', height: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
          {/* Cardboard Base */}
          <CardboardSVG x={480} y={240} />

          {/* Bulb and Battery components with exact coordinates */}
          <g transform="translate(100, 18)">
            <BulbSVG isPlaced={true} isOn={isBulbOn} />
          </g>
          <g transform="translate(70, 40)">
            <BatterySVG isPlaced={true} />
          </g>

          {/* Wires */}
          <WiresSVG 
            isWireConnected={true} 
            isBatteryPresent={true}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
          />

          {/* Drawing Pin 1 (Pivot Pin) */}
          <DrawingPinSVG x={560} y={290} label="Drawing Pin 1" isPlaced={true} />

          {/* Interactive Swinging Switch Arm (Safety Pin / Plastic / Wood) */}
          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -45 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
            style={{ originX: '560px', originY: '290px', cursor: predictionSubmitted ? 'pointer' : 'not-allowed' }}
            onClick={handleToggleSwitch}
          >
            <SafetyPinSVG x={560} y={290} rotation={0} isPlaced={true} material={selectedMaterial} />
          </motion.g>

          {/* Drawing Pin 2 (Contact Pin) */}
          <g onClick={handleToggleSwitch} style={{ cursor: predictionSubmitted ? 'pointer' : 'default' }}>
            <DrawingPinSVG x={560} y={410} label="Drawing Pin 2" isPlaced={true} isTarget={!isPinConnected && predictionSubmitted} />
          </g>

          {/* Connection Sparkle & Hint Target */}
          {predictionSubmitted && !isPinConnected && (
            <g transform="translate(560, 410)" style={{ cursor: 'pointer' }} onClick={handleToggleSwitch}>
              <circle r={22} fill="rgba(99, 102, 241, 0.15)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" className="bulb-glowing" />
              <text x={0} y={35} fill="var(--accent-text)" fontSize="11" fontWeight="bold" textAnchor="middle">
                🎯 Click Pin 2 to Align!
              </text>
            </g>
          )}
        </svg>

        {predictionSubmitted && !testTriggered && (
          <div style={{ 
            position: 'absolute', top: '52%', right: '28%', 
            background: 'var(--accent)', color: 'white',
            padding: '0.45rem 0.9rem', borderRadius: '8px',
            fontSize: '0.8rem', fontWeight: 'bold',
            boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
            pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem'
          }} className="bulb-glowing">
            <Zap size={14} style={{ color: '#fbbf24' }} /> Click safety pin to close switch!
          </div>
        )}
      </div>
    </div>
  );
}
