import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

export default function Stage2_Test({ onComplete }) {
  const [prediction, setPrediction] = useState(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
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

    if (nextState) {
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#60a5fa', '#fde047', '#38bdf8', '#ffffff'],
        origin: { x: 0.72, y: 0.65 },
      });
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setPredictionSubmitted(false);
    setIsPinConnected(false);
    setTestTriggered(false);
  };

  const isPredictionCorrect = prediction === 'on';
  const isCurrentFlowing = isPinConnected;
  const isBulbOn = isPinConnected;

  return (
    <div className="main-grid" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Left Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', borderColor: '#fde68a' }}>
            Stage 2: Test the Switch
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Active Learning</h2>
          <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-muted)' }}>
            Test how the switch regulates the flow of current in a closed circuit loop.
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
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                What will happen to the bulb if the safety pin is rotated so that it touches the second drawing pin?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => setPrediction('on')}
                  style={{
                    justifyContent: 'flex-start',
                    background: prediction === 'on' ? 'var(--accent-bg)' : 'var(--card-bg)',
                    borderColor: prediction === 'on' ? 'var(--accent-text)' : 'var(--border)',
                    color: prediction === 'on' ? 'var(--accent-text)' : 'var(--text-muted)'
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
                    color: prediction === 'off' ? 'var(--danger)' : 'var(--text-muted)'
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
              <Play size={16} fill="currentColor" /> Submit Prediction &amp; Test
            </button>
          </div>
        ) : (
          /* Test & Observe */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: 'var(--text-faint)', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                PREDICTION SUBMITTED
              </span>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>
                Your prediction: <strong style={{ color: prediction === 'on' ? 'var(--warning)' : 'var(--text-muted)' }}>
                  Bulb will stay {prediction.toUpperCase()}
                </strong>
              </p>
            </div>

            {!testTriggered ? (
              <div className="pulse-target" style={{ 
                background: 'var(--accent-bg)', 
                border: '1px solid var(--accent-border)',
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <Lightbulb size={24} style={{ color: 'var(--warning)', marginBottom: '0.5rem' }} className="bulb-glowing" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Test Your Prediction!</h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Tap the <strong>Safety Pin</strong> in the circuit board on the right to rotate and close the switch.
                </p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: isPinConnected ? 'var(--success-bg)' : 'var(--danger-bg)', 
                  border: isPinConnected ? '1px solid #a7f3d0' : '1px solid #fecaca',
                  borderRadius: '10px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  {isPinConnected ? (
                    <CheckCircle2 style={{ color: 'var(--success)' }} size={18} />
                  ) : (
                    <HelpCircle style={{ color: 'var(--danger)' }} size={18} />
                  )}
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {isPinConnected ? 'Circuit is CLOSED (ON)' : 'Circuit is OPEN (OFF)'}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {isPinConnected ? (
                    <>
                      {isPredictionCorrect ? (
                        <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ Correct! </span>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Observe: </span>
                      )}
                      When the safety pin touches the second drawing pin, it completes the circuit loop. 
                      Current flows from the battery to the bulb, turning it <strong>ON</strong>!
                    </>
                  ) : (
                    <>
                      When the safety pin is swung away, a gap is left in the circuit. The path is broken. 
                      This is an <strong>OPEN</strong> circuit and the bulb is <strong>OFF</strong>.
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Stats */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
              background: 'var(--surface)', borderRadius: '10px', padding: '0.75rem',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>SWITCH STATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isPinConnected ? 'var(--success)' : 'var(--text-secondary)' }}>
                  {isPinConnected ? 'ON (CONNECTED)' : 'OFF (DISCONNECTED)'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>BULB STATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isBulbOn ? 'var(--warning)' : 'var(--text-faint)' }}>
                  {isBulbOn ? 'GLOWING' : 'DARK'}
                </span>
              </div>
            </div>

            <button 
              onClick={handleToggleSwitch}
              className="outline" 
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isPinConnected ? <ToggleRight size={18} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={18} />}
              Toggle Safety Pin Switch
            </button>
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

      {/* Right Panel: SVG Canvas */}
      <div className="canvas-container" style={{ padding: '2rem', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <div className="canvas-bg-grid" />
        
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
          <span className={`status-badge ${isPinConnected ? 'closed' : 'open'}`}>
            {isPinConnected ? 'Closed Circuit' : 'Open Circuit'}
          </span>
        </div>

        <svg width="100%" height="100%" viewBox="0 0 600 480" style={{ maxWidth: '600px', maxHeight: '480px', userSelect: 'none', WebkitUserSelect: 'none' }}>
          <CardboardSVG />
          <BulbSVG isPlaced={true} isOn={isBulbOn} />
          <BatterySVG isPlaced={true} />
          <WiresSVG 
            isWireConnected={true} 
            isBatteryPresent={true}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
          />
          <DrawingPinSVG x={450} y={250} label="Drawing Pin 1" isPlaced={true} />
          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -35 }}
            transition={{ type: 'spring', stiffness: 90, damping: 10 }}
            style={{ originX: '450px', originY: '250px', cursor: predictionSubmitted ? 'pointer' : 'not-allowed' }}
            onClick={handleToggleSwitch}
          >
            <SafetyPinSVG x={450} y={250} rotation={0} isPlaced={true} material="metal" />
          </motion.g>
          <DrawingPinSVG x={450} y={370} label="Drawing Pin 2" isPlaced={true} />
        </svg>

        {predictionSubmitted && !testTriggered && (
          <div style={{ 
            position: 'absolute', top: '55%', right: '32%', 
            background: 'var(--accent)', color: 'var(--text-heading)',
            padding: '0.4rem 0.8rem', borderRadius: '6px',
            fontSize: '0.75rem', fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(79,70,229,0.3)',
            pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem'
          }} className="bulb-glowing">
            <span>👈 Click safety pin!</span>
          </div>
        )}
      </div>
    </div>
  );
}
