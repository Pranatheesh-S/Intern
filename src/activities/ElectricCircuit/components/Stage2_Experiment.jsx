import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X, AlertTriangle, AlertCircle, RotateCcw } from 'lucide-react';
import CircuitSandbox from './CircuitSandbox';
import ReferenceDiagram from './HintDiagram';

const arrangements = [
  { id: 1, desc: 'Connect the positive terminal to one lamp terminal, and the negative to the other.', glows: true },
  { id: 2, desc: 'Connect only the positive terminal to one lamp terminal.', glows: false },
  { id: 3, desc: 'Connect only the negative terminal to one lamp terminal.', glows: false },
  { id: 4, desc: 'Connect both the positive and negative terminals to the SAME lamp terminal.', glows: false },
  { id: 5, desc: 'Connect only the negative terminal to the OTHER lamp terminal.', glows: false },
  { id: 6, desc: 'Connect the terminals in the reverse order of Arrangement 1.', glows: true },
];

// Helper to check if a wire exists between two components
const hasConnection = (wires, t1, t2) => {
  return wires.some(w => 
    (w.start === t1 && w.end === t2) || 
    (w.start === t2 && w.end === t1)
  );
};

const checkWiringMatch = (wires, arrangementId) => {
  // Extract all connections using the new terminal IDs
  const posToLeft = hasConnection(wires, 'cellHolder-pos', 'lampHolder-left');
  const posToRight = hasConnection(wires, 'cellHolder-pos', 'lampHolder-right');
  const negToLeft = hasConnection(wires, 'cellHolder-neg', 'lampHolder-left');
  const negToRight = hasConnection(wires, 'cellHolder-neg', 'lampHolder-right');
  
  const posConnected = posToLeft || posToRight;
  const negConnected = negToLeft || negToRight;

  const totalWires = wires.length;

  switch (arrangementId) {
    case 1:
      // Normal proper connection
      return totalWires === 2 && 
             ((posToLeft && negToRight) || (posToRight && negToLeft));
    case 2:
      // Only positive connected
      return totalWires === 1 && posConnected;
    case 3:
      // Only negative connected
      return totalWires === 1 && negConnected;
    case 4:
      // Both to same terminal
      return totalWires === 2 && 
             ((posToLeft && negToLeft) || (posToRight && negToRight));
    case 5:
      // Only negative connected to the "other" terminal
      return totalWires === 1 && negConnected;
    case 6:
      // Reverse connection
      return totalWires === 2 && 
             ((posToRight && negToLeft) || (posToLeft && negToRight));
    default:
      return false;
  }
};

export default function Stage2_Experiment({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Store user's predictions (true/false) and results (observed glows)
  const [results, setResults] = useState({});
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [currentWires, setCurrentWires] = useState([]);
  const [assembly, setAssembly] = useState({ isCellInHolder: false, isLampInHolder: false });
  const [resetSignal, setResetSignal] = useState(0);
  const [fullResetSignal, setFullResetSignal] = useState(0);

  const currentArrangement = arrangements[currentIndex];
  
  const isWiringCorrect = checkWiringMatch(currentWires, currentArrangement.id);
  const isFullyAssembled = assembly.isCellInHolder && assembly.isLampInHolder;

  const handleTest = () => {
    setIsTesting(true);
    
    // Save the observation
    setResults(prev => ({
      ...prev,
      [currentArrangement.id]: {
        prediction: currentPrediction,
        observation: currentArrangement.glows
      }
    }));
  };

  const handleNext = () => {
    if (currentIndex < arrangements.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentPrediction(null);
      setIsTesting(false);
      setResetSignal(prev => prev + 1);
    } else {
      onComplete(results);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1, textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>
            Interactive Assembly & Wiring
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Drag the Electric Cell and Lamp into their holders, then wire them up according to the instructions.
          </p>
        </div>
        <button 
          onClick={() => {
            setFullResetSignal(prev => prev + 1);
            setCurrentWires([]);
            setCurrentPrediction(null);
            setIsTesting(false);
          }} 
          className="outline" 
          style={{ padding: '0.5rem', borderRadius: '50%' }} 
          title="Reset Lab"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {arrangements.map((arr, idx) => (
          <div 
            key={arr.id}
            style={{
              width: '40px',
              height: '6px',
              borderRadius: '3px',
              background: idx < currentIndex ? 'var(--success)' : idx === currentIndex ? 'var(--accent)' : 'var(--border)'
            }}
          />
        ))}
      </div>

      <div style={{
        background: 'var(--bg-color)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        
        <h4 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)', textAlign: 'center', width: '100%' }}>
          Arrangement {currentArrangement.id}: <br/>
          <span style={{ fontWeight: 'normal', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {currentArrangement.desc}
          </span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', width: '100%', maxWidth: '1200px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Left Side: Target Diagram */}
          <div style={{ flex: '0 0 400px', width: '100%' }}>
            <ReferenceDiagram arrangementId={currentArrangement.id} />
          </div>

          {/* Right Side: Interactive Sandbox */}
          <div style={{ flex: '1', minWidth: '400px' }}>
            <CircuitSandbox 
              onWiringChange={setCurrentWires} 
              onAssemblyStatusChange={setAssembly}
              isTesting={isTesting}
              isGlowing={isTesting && currentArrangement.glows}
              resetSignal={resetSignal}
              fullResetSignal={fullResetSignal}
            />
          </div>
        </div>

        {/* Prediction Phase */}
        {!isTesting && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            {!isFullyAssembled ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ea580c', background: '#ffedd5', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                 <AlertCircle size={18} />
                 <span><b>Assembly Required:</b> Drag the cell and the lamp into their holders first!</span>
               </div>
            ) : !isWiringCorrect ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', background: 'var(--warning-bg)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                 <AlertTriangle size={18} />
                 <span>Please wire the circuit as described above to continue.</span>
               </div>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Wiring matched! Will the lamp glow?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    className={currentPrediction === true ? 'primary' : 'outline'}
                    onClick={() => setCurrentPrediction(true)}
                    style={{ 
                      background: currentPrediction === true ? 'var(--success)' : '',
                      borderColor: currentPrediction === true ? 'var(--success-border)' : ''
                    }}
                  >
                    Yes, it will glow
                  </button>
                  <button 
                    className={currentPrediction === false ? 'primary' : 'outline'}
                    onClick={() => setCurrentPrediction(false)}
                    style={{ 
                      background: currentPrediction === false ? '#ef4444' : '',
                      borderColor: currentPrediction === false ? '#fca5a5' : ''
                    }}
                  >
                    No, it will not
                  </button>
                </div>
                
                <button 
                  className="primary" 
                  onClick={handleTest}
                  disabled={currentPrediction === null}
                  style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}
                >
                  Test Connection
                </button>
              </>
            )}
          </div>
        )}

        {/* Observation Phase */}
        {isTesting && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%' }}
          >
            {/* Feedback message */}
            <div style={{ 
              padding: '1rem 2rem', 
              borderRadius: '8px', 
              background: currentPrediction === currentArrangement.glows ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${currentPrediction === currentArrangement.glows ? 'var(--success-border)' : '#fca5a5'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {currentPrediction === currentArrangement.glows ? (
                <Check size={24} style={{ color: 'var(--success)' }} />
              ) : (
                <X size={24} style={{ color: '#ef4444' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: currentPrediction === currentArrangement.glows ? 'var(--success)' : '#ef4444' }}>
                  {currentPrediction === currentArrangement.glows ? 'Prediction Correct!' : 'Prediction Incorrect'}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {currentArrangement.glows ? 'The lamp glows in this arrangement.' : 'The lamp does not glow in this arrangement.'}
                </span>
              </div>
            </div>

            <button 
              className="primary" 
              onClick={handleNext}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              {currentIndex < arrangements.length - 1 ? 'Next Arrangement' : 'View Results'} <ArrowRight size={16} />
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
