import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, X, AlertTriangle, AlertCircle } from 'lucide-react';
import CircuitSandbox3_7 from './CircuitSandbox3_7';
import HintDiagram3_7 from './HintDiagram3_7';

const arrangements = [
  { id: 1, desc: 'Connect the positive terminal to the longer wire of the LED, and the negative to the shorter wire.', glows: true },
  { id: 2, desc: 'Interchange the wires: connect positive to the shorter wire, and negative to the longer wire.', glows: false }
];

export default function Stage2_Experiment({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWires, setCurrentWires] = useState([]);
  
  const [isWiringCorrect, setIsWiringCorrect] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  
  const [resetSignal, setResetSignal] = useState(0);

  const currentArrangement = arrangements[currentIndex];

  const checkWiring = useCallback(() => {
    if (currentWires.length !== 2) return false;

    // Helper to check if a wire exists between two terminals
    const hasWire = (t1, t2) => {
      return currentWires.some(w => 
        (w.start === t1 && w.end === t2) || (w.start === t2 && w.end === t1)
      );
    };

    if (currentArrangement.id === 1) {
      // + to long, - to short
      return hasWire('batt-pos', 'led-long') && hasWire('batt-neg', 'led-short');
    } else if (currentArrangement.id === 2) {
      // + to short, - to long
      return hasWire('batt-pos', 'led-short') && hasWire('batt-neg', 'led-long');
    }
    
    return false;
  }, [currentWires, currentArrangement]);

  useEffect(() => {
    if (!isTesting) {
      setIsWiringCorrect(checkWiring());
      setCurrentPrediction(null);
    }
  }, [currentWires, checkWiring, isTesting]);

  const handleTest = () => {
    setIsTesting(true);
  };

  const handleNext = () => {
    if (currentIndex < arrangements.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsTesting(false);
      setCurrentWires([]);
      setIsWiringCorrect(false);
      setCurrentPrediction(null);
      setResetSignal(prev => prev + 1);
    } else {
      onComplete({ completedArrangements: arrangements });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 1rem auto' }}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>
          Testing LED Directionality
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Wire the assembled battery to the LED according to the instructions.
        </p>
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

        <div style={{ width: '100%', maxWidth: '950px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <div style={{ flex: '0 0 250px', width: '100%' }}>
            <HintDiagram3_7 arrangementId={currentArrangement.id} />
          </div>

          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '100%' }}>
              <CircuitSandbox3_7 
                onWiringChange={setCurrentWires} 
                isTesting={isTesting}
                isGlowing={isTesting && currentArrangement.glows}
                resetSignal={resetSignal}
              />
            </div>
            {!isTesting && (
              <button 
                className="outline" 
                onClick={() => {
                  setCurrentWires([]);
                  setResetSignal(prev => prev + 1);
                }}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Reset Wiring
              </button>
            )}
          </div>
        </div>

        {/* Prediction Phase */}
        {!isTesting && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            {!isWiringCorrect ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', background: 'var(--warning-bg)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                 <AlertTriangle size={18} />
                 <span>Please wire the circuit as described above to continue.</span>
               </div>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Wiring matched! Will the LED glow?</p>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
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
                    {currentArrangement.glows ? 'The LED glows in this arrangement.' : 'The LED does not glow in this arrangement.'}
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="primary" 
              onClick={handleNext}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              {currentIndex < arrangements.length - 1 ? 'Next Arrangement' : 'Take Quiz'} <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
