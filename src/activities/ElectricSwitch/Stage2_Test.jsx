import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
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
    setIsPinConnected(!isPinConnected);
    setTestTriggered(true);
  };

  const handleReset = () => {
    setPrediction(null);
    setPredictionSubmitted(false);
    setIsPinConnected(false);
    setTestTriggered(false);
  };

  const isPredictionCorrect = prediction === 'on';

  // State calculations
  const isCurrentFlowing = isPinConnected;
  const isBulbOn = isPinConnected;

  return (
    <div className="main-grid">
      {/* Left Panel: Prediction & Explanation */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            Stage 2: Test the Switch
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Active Learning</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Test how the switch regulates the flow of current in a closed circuit loop.
          </p>
        </div>

        {/* Step 1: Active Learning Prediction */}
        {!predictionSubmitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <HelpCircle style={{ color: '#818cf8' }} size={20} />
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem' }}>Predict the Outcome</h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                What will happen to the bulb if the safety pin is rotated so that it touches the second drawing pin?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <button
                  onClick={() => setPrediction('on')}
                  className={prediction === 'on' ? 'outline active' : 'outline'}
                  style={{
                    justifyContent: 'flex-start',
                    background: prediction === 'on' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    borderColor: prediction === 'on' ? '#6366f1' : 'rgba(255,255,255,0.06)',
                    color: prediction === 'on' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#fbbf24',
                    marginRight: '0.5rem'
                  }} />
                  The Bulb will turn ON (Glow)
                </button>

                <button
                  onClick={() => setPrediction('off')}
                  className={prediction === 'off' ? 'outline active' : 'outline'}
                  style={{
                    justifyContent: 'flex-start',
                    background: prediction === 'off' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    borderColor: prediction === 'off' ? '#ef4444' : 'rgba(255,255,255,0.06)',
                    color: prediction === 'off' ? '#ffffff' : '#94a3b8'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    background: '#64748b',
                    marginRight: '0.5rem'
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
              <Play size={16} fill="currentColor" /> Submit Prediction & Test
            </button>
          </div>
        ) : (
          /* Step 2: Test & Observe Results */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#64748b', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                PREDICTION SUBMITTED
              </span>
              <p style={{ margin: '0.25rem 0 0 0', color: '#cbd5e1' }}>
                Your prediction: <strong style={{ color: prediction === 'on' ? '#fbbf24' : '#94a3b8' }}>
                  Bulb will stay {prediction.toUpperCase()}
                </strong>
              </p>
            </div>

            {/* Instruction to Tap Switch */}
            {!testTriggered ? (
              <div className="pulse-target" style={{ 
                background: 'rgba(99, 102, 241, 0.15)', 
                border: '1px solid #6366f1',
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <Lightbulb size={24} style={{ color: '#fbbf24', marginBottom: '0.5rem' }} className="bulb-glowing" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff' }}>Test Your Prediction!</h4>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Tap the <strong>Safety Pin</strong> in the circuit board on the right to rotate and close the switch.
                </p>
              </div>
            ) : (
              // Science explanation card based on state
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                  background: isPinConnected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', 
                  border: isPinConnected ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '10px',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  {isPinConnected ? (
                    <CheckCircle2 style={{ color: '#10b981' }} size={18} />
                  ) : (
                    <HelpCircle style={{ color: '#ef4444' }} size={18} />
                  )}
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff' }}>
                    {isPinConnected ? 'Circuit is CLOSED (ON)' : 'Circuit is OPEN (OFF)'}
                  </h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {isPinConnected ? (
                    <>
                      {isPredictionCorrect ? (
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>✓ Correct! </span>
                      ) : (
                        <span style={{ color: '#f87171', fontWeight: 'bold' }}>Observe: </span>
                      )}
                      When the safety pin touches the second drawing pin, it closes the gap and completes the circuit loop. 
                      This allows electrical current to flow from the battery to the bulb, turning it <strong>ON</strong>!
                    </>
                  ) : (
                    <>
                      When the safety pin is swung away, a gap is left in the circuit. The path is broken, preventing the current from flowing. 
                      This is an <strong>OPEN</strong> circuit and the bulb is <strong>OFF</strong>.
                    </>
                  )}
                </p>
              </motion.div>
            )}

            {/* Quick Status Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '0.5rem',
              background: 'rgba(30, 41, 59, 0.3)',
              borderRadius: '10px',
              padding: '0.75rem'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>SWITCH STATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isPinConnected ? '#34d399' : '#cbd5e1' }}>
                  {isPinConnected ? 'ON (CONNECTED)' : 'OFF (DISCONNECTED)'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>BULB STATE</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isBulbOn ? '#fbbf24' : '#94a3b8' }}>
                  {isBulbOn ? 'GLOWING' : 'DARK'}
                </span>
              </div>
            </div>

            {/* Manual Toggle Switch Button for accessibility */}
            <button 
              onClick={handleToggleSwitch}
              className="outline" 
              style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', borderColor: '#4f46e5' }}
            >
              {isPinConnected ? <ToggleRight size={18} style={{ color: '#34d399' }} /> : <ToggleLeft size={18} />}
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

      {/* Right Panel: SVG Canvas Workspace */}
      <div className="canvas-container" style={{ padding: '2rem' }}>
        <div className="canvas-bg-grid" />
        
        {/* Connection status tag */}
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 10 }}>
          <span className={`status-badge ${isPinConnected ? 'closed' : 'open'}`}>
            {isPinConnected ? 'Closed Circuit' : 'Open Circuit'}
          </span>
        </div>

        {/* SVG Canvas Board */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 600 480" 
          style={{ maxWidth: '600px', maxHeight: '480px' }}
        >
          {/* Cardboard Base */}
          <CardboardSVG />

          {/* Bulb Component */}
          <BulbSVG isPlaced={true} isOn={isBulbOn} />

          {/* Battery Component */}
          <BatterySVG isPlaced={true} />

          {/* Connecting Wires */}
          <WiresSVG 
            isWireConnected={true} 
            isBatteryPresent={true}
            isBulbPresent={true}
            arePinsPlaced={true}
            isCurrentFlowing={isCurrentFlowing}
          />

          {/* Drawing Pin 1 (Pivot) */}
          <DrawingPinSVG x={450} y={250} label="Drawing Pin 1" isPlaced={true} />

          {/* Safety Pin (Pivoted at Pin 1. Rotates dynamically!) */}
          <motion.g
            animate={{ rotate: isPinConnected ? 0 : -35 }}
            transition={{ type: 'spring', stiffness: 90, damping: 10 }}
            style={{ originX: '450px', originY: '250px', cursor: predictionSubmitted ? 'pointer' : 'not-allowed' }}
            onClick={handleToggleSwitch}
          >
            <SafetyPinSVG 
              x={450} 
              y={250} 
              rotation={0} // rotation is controlled by motion.g above
              isPlaced={true}
              material="metal"
            />
          </motion.g>

          {/* Drawing Pin 2 (Contact Point) */}
          <DrawingPinSVG x={450} y={370} label="Drawing Pin 2" isPlaced={true} />
        </svg>

        {/* Action Prompt Overlay inside Canvas */}
        {predictionSubmitted && !testTriggered && (
          <div style={{ 
            position: 'absolute', 
            top: '55%', 
            right: '32%', 
            background: 'rgba(99, 102, 241, 0.95)',
            color: '#ffffff',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }} className="bulb-glowing">
            <span>👈 Click safety pin!</span>
          </div>
        )}
      </div>
    </div>
  );
}
