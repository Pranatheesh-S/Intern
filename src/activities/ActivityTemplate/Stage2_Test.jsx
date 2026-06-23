import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronRight, Play, CheckCircle } from 'lucide-react';
import { 
  BoardBaseSVG, 
  GenericCellSVG, 
  GenericLoadSVG, 
  GenericTerminalSVG, 
  GenericWiresSVG 
} from './CanvasElements';

export default function Stage2_Test({ onComplete }) {
  const [prediction, setPrediction] = useState(null); // 'on' | 'off'
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handlePredict = (value) => {
    if (predictionSubmitted) return;
    setPrediction(value);
  };

  const handleSubmitPrediction = () => {
    if (prediction === null) return;
    setPredictionSubmitted(true);
  };

  const handleToggleConnection = () => {
    if (!predictionSubmitted) return;
    setIsConnected(!isConnected);
  };

  const isPredictionCorrect = (prediction === 'on');

  return (
    <div className="main-grid">
      {/* Left Panel: Predictions & Explanation */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <span className="status-badge closed" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            Stage 2: Prediction & Test
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Predict Outcome</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Make a prediction first to unlock the interactive test environment.
          </p>
        </div>

        {/* Prediction Selector Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>
            QUESTION: What will happen when we connect the two terminals together?
          </span>
          
          <button
            onClick={() => handlePredict('on')}
            disabled={predictionSubmitted}
            className="outline"
            style={{
              justifyContent: 'flex-start',
              borderColor: prediction === 'on' ? '#6366f1' : 'rgba(255,255,255,0.06)',
              background: prediction === 'on' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              opacity: predictionSubmitted && prediction !== 'on' ? 0.5 : 1
            }}
          >
            The circuit closes and the bulb glows (ON)
          </button>

          <button
            onClick={() => handlePredict('off')}
            disabled={predictionSubmitted}
            className="outline"
            style={{
              justifyContent: 'flex-start',
              borderColor: prediction === 'off' ? '#6366f1' : 'rgba(255,255,255,0.06)',
              background: prediction === 'off' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              opacity: predictionSubmitted && prediction !== 'off' ? 0.5 : 1
            }}
          >
            The circuit remains inactive (OFF)
          </button>
        </div>

        {/* Action Button: Submit Prediction */}
        {!predictionSubmitted && (
          <button
            onClick={handleSubmitPrediction}
            className="primary"
            disabled={prediction === null}
            style={{ gap: '0.35rem' }}
          >
            Submit Prediction & Test
          </button>
        )}

        {/* Science explanation reveals after prediction submission */}
        {predictionSubmitted && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{
              background: isPredictionCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${isPredictionCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.8rem'
            }}>
              <h4 style={{ margin: 0, color: isPredictionCorrect ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                {isPredictionCorrect ? '✓ Good Prediction!' : '❌ Incorrect Prediction'}
              </h4>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.4' }}>
                {isPredictionCorrect 
                  ? "Correct! Connecting the terminals with a copper wire closes the loop, allowing charges to circulate." 
                  : "Not quite! Linking the terminals provides a pathway for the current to flow, meaning the bulb will turn ON."}
              </p>
            </div>

            {/* Instruction on how to test */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.8rem' }}>
              <span style={{ fontWeight: 'bold', color: '#818cf8', display: 'block', marginBottom: '0.2rem' }}>
                👉 RUN TEST
              </span>
              Click/Tap the orange connector wire on the canvas to close/open the circuit.
            </div>

            {/* Completion navigation */}
            <button onClick={onComplete} className="success" style={{ gap: '0.25rem' }}>
              Go to Sandbox <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Interactive Canvas */}
      <div className="canvas-container" style={{ padding: '2rem' }}>
        <div className="canvas-bg-grid" />
        
        {/* Connection overlay notice */}
        {predictionSubmitted && (
          <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            <span className={`status-badge ${isConnected ? 'closed' : 'open'}`}>
              {isConnected ? 'Circuit: CLOSED (ON)' : 'Circuit: OPEN (OFF)'}
            </span>
          </div>
        )}

        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 600 480" 
          style={{ maxWidth: '600px', maxHeight: '480px' }}
        >
          {/* Cardboard Base */}
          <BoardBaseSVG />

          {/* Bulb Component */}
          <GenericLoadSVG 
            isPlaced={true} 
            isActive={isConnected}
          />

          {/* Battery Component */}
          <GenericCellSVG 
            isPlaced={true} 
          />

          {/* Connecting Wires */}
          <GenericWiresSVG 
            isPlaced={true} 
            isActive={isConnected}
            isBroken={false}
          />

          {/* Terminal 1 */}
          <GenericTerminalSVG 
            x={450} 
            y={250} 
            label="Terminal 1" 
            isPlaced={true} 
            onClick={handleToggleConnection}
          />

          {/* Interactive Bridge Wire Connector */}
          <motion.g
            animate={{ rotate: isConnected ? 0 : -30 }}
            transition={{ type: 'spring', stiffness: 90, damping: 10 }}
            style={{ originX: '450px', originY: '250px', cursor: predictionSubmitted ? 'pointer' : 'not-allowed' }}
            onClick={handleToggleConnection}
          >
            {/* Bridge wire arm */}
            <line x1={450} y1={250} x2={450} y2={370} stroke="#f59e0b" strokeWidth={6} strokeLinecap="round" />
            <circle cx={450} cy={250} r={4} fill="#ffffff" />
            <circle cx={450} cy={370} r={6} fill="#f59e0b" />
          </motion.g>

          {/* Terminal 2 */}
          <GenericTerminalSVG 
            x={450} 
            y={370} 
            label="Terminal 2" 
            isPlaced={true} 
          />
        </svg>
      </div>
    </div>
  );
}
