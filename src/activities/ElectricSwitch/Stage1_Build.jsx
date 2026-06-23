import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Info, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { 
  CardboardSVG, 
  DrawingPinSVG, 
  SafetyPinSVG, 
  BulbSVG, 
  BatterySVG, 
  WiresSVG 
} from './CircuitElements';

const STEPS = [
  {
    id: 'cardboard',
    name: 'Cardboard Base',
    desc: 'Acts as an insulating platform to build the switch on.',
    hint: 'First, we need the cardboard base to mount our switch.',
    prereq: []
  },
  {
    id: 'pin1',
    name: 'First Drawing Pin',
    desc: 'Serves as the pivot point/anchor for the safety pin.',
    hint: 'Place the first drawing pin into the cardboard base.',
    prereq: ['cardboard']
  },
  {
    id: 'safetyPin',
    name: 'Safety Pin',
    desc: 'The movable conductor that will close or open the gap.',
    hint: 'Attach the safety pin to the first drawing pin.',
    prereq: ['cardboard', 'pin1'],
    errorMsg: '❌ Safety pin cannot rotate or stay in place without a drawing pin anchor! Place the first drawing pin first.'
  },
  {
    id: 'pin2',
    name: 'Second Drawing Pin',
    desc: 'The contact terminal that the safety pin will touch to close the circuit.',
    hint: 'Fix the second drawing pin so the safety pin can touch it.',
    prereq: ['cardboard', 'safetyPin']
  },
  {
    id: 'battery',
    name: 'Electric Cell (Battery)',
    desc: 'The source of electrical energy for the circuit.',
    hint: 'Place the 1.5V electric cell on the board.',
    prereq: ['cardboard']
  },
  {
    id: 'bulb',
    name: 'Electric Bulb',
    desc: 'The load/device that will indicate if current is flowing.',
    hint: 'Install the bulb holder and bulb.',
    prereq: ['cardboard']
  },
  {
    id: 'wires',
    name: 'Connecting Wires',
    desc: 'Provide a path for electric current to flow through.',
    hint: 'Connect the wires to link the battery, bulb, and switch.',
    prereq: ['cardboard', 'pin1', 'pin2', 'battery', 'bulb'],
    errorMsg: '❌ Wires need terminals (pins, battery, bulb) to connect! Place all other components first.'
  }
];

export default function Stage1_Build({ onComplete }) {
  const [placed, setPlaced] = useState({
    cardboard: false,
    pin1: false,
    safetyPin: false,
    pin2: false,
    battery: false,
    bulb: false,
    wires: false
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlaceItem = (itemId) => {
    setError('');
    const stepDef = STEPS.find(s => s.id === itemId);
    
    // Check prerequisites
    const missingPrereqs = stepDef.prereq.filter(p => !placed[p]);
    if (missingPrereqs.length > 0) {
      if (stepDef.errorMsg) {
        setError(stepDef.errorMsg);
      } else {
        const missingNames = missingPrereqs.map(p => STEPS.find(s => s.id === p).name).join(', ');
        setError(`❌ Cannot place ${stepDef.name} yet. You must first place: ${missingNames}`);
      }
      return;
    }

    // Place the item
    const newPlaced = { ...placed, [itemId]: true };
    setPlaced(newPlaced);

    // Check if construction completed
    const allPlaced = Object.values(newPlaced).every(v => v === true);
    if (allPlaced) {
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setPlaced({
      cardboard: false,
      pin1: false,
      safetyPin: false,
      pin2: false,
      battery: false,
      bulb: false,
      wires: false
    });
    setError('');
    setSuccess(false);
  };

  // Get current prompt/guiding step
  const getNextStepPrompt = () => {
    if (success) return '✅ Switch Constructed Successfully!';
    const nextStep = STEPS.find(s => !placed[s.id]);
    return nextStep ? `Next step: ${nextStep.hint}` : '';
  };

  return (
    <div className="main-grid">
      {/* Left Panel: Instructions & Inventory */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <span className="status-badge neutral" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            Stage 1: Build the Switch
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Virtual Science Lab</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Construct a simple electric switch on a cardboard sheet using everyday components.
          </p>
        </div>

        {/* Guiding Prompt */}
        <div style={{ 
          background: success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.8)',
          border: success ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '1rem',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'flex-start'
        }}>
          {success ? (
            <Sparkles style={{ color: '#10b981', flexShrink: 0 }} size={20} />
          ) : (
            <Info style={{ color: '#6366f1', flexShrink: 0 }} size={20} />
          )}
          <div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: success ? '#34d399' : '#e2e8f0' }}>
              {success ? 'Construction Complete!' : 'Instruction'}
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              {getNextStepPrompt()}
            </p>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inventory list */}
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#cbd5e1' }}>Component Tray</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {STEPS.map((step) => {
              const isPlaced = placed[step.id];
              const isAvailable = step.prereq.every(p => placed[p]);
              
              return (
                <button
                  key={step.id}
                  onClick={() => handlePlaceItem(step.id)}
                  disabled={isPlaced}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: isPlaced 
                      ? 'rgba(16, 185, 129, 0.05)' 
                      : isAvailable 
                        ? 'rgba(30, 41, 59, 0.6)' 
                        : 'rgba(15, 23, 42, 0.3)',
                    borderColor: isPlaced 
                      ? 'rgba(16, 185, 129, 0.3)' 
                      : isAvailable 
                        ? 'rgba(99, 102, 241, 0.3)' 
                        : 'rgba(255, 255, 255, 0.02)',
                    color: isPlaced 
                      ? '#a7f3d0' 
                      : isAvailable 
                        ? '#ffffff' 
                        : '#64748b',
                    textAlign: 'left',
                    width: '100%',
                    boxShadow: isAvailable && !isPlaced ? '0 0 10px rgba(99,102,241,0.1)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{step.name}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 'normal' }}>
                      {step.desc}
                    </span>
                  </div>
                  {isPlaced ? (
                    <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                  ) : isAvailable ? (
                    <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 'bold', border: '1px solid rgba(99,102,241,0.4)', borderRadius: '4px', padding: '0.1rem 0.35rem' }}>
                      PLACE
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>LOCKED</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleReset} className="outline" style={{ flex: 1, gap: '0.35rem' }}>
            <RotateCcw size={16} /> Reset
          </button>
          
          <button 
            onClick={onComplete} 
            className="success" 
            disabled={!success}
            style={{ flex: 2, gap: '0.35rem' }}
          >
            Go to Stage 2 <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Right Panel: SVG Canvas Workspace */}
      <div className="canvas-container" style={{ padding: '2rem' }}>
        <div className="canvas-bg-grid" />
        
        {/* SVG Canvas Board */}
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 600 480" 
          style={{ maxWidth: '600px', maxHeight: '480px' }}
        >
          {/* Cardboard Base */}
          {placed.cardboard ? (
            <motion.g
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <CardboardSVG />
            </motion.g>
          ) : (
            // Dotted Cardboard Placeholder
            <g onClick={() => handlePlaceItem('cardboard')} style={{ cursor: 'pointer' }} className="pulse-target">
              <rect x={370} y={200} width={160} height={210} rx={12} fill="rgba(99, 102, 241, 0.05)" stroke="#6366f1" strokeWidth={2} strokeDasharray="5,5" />
              <text x={450} y={305} fill="#818cf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                PLACE CARDBOARD BASE
              </text>
            </g>
          )}

          {/* Bulb Component */}
          <BulbSVG 
            isPlaced={placed.bulb} 
            isTarget={placed.cardboard && !placed.bulb}
            isOn={false}
            onClick={() => {
              if (!placed.bulb && placed.cardboard) {
                handlePlaceItem('bulb');
              }
            }}
          />

          {/* Battery Component */}
          <BatterySVG 
            isPlaced={placed.battery}
            isTarget={placed.cardboard && !placed.battery}
            onClick={() => {
              if (!placed.battery && placed.cardboard) {
                handlePlaceItem('battery');
              }
            }}
          />

          {/* Connecting Wires */}
          <WiresSVG 
            isWireConnected={placed.wires} 
            isTarget={placed.cardboard && placed.pin1 && placed.pin2 && placed.battery && placed.bulb && !placed.wires}
            isBatteryPresent={placed.battery}
            isBulbPresent={placed.bulb}
            arePinsPlaced={placed.pin1 && placed.pin2}
            isCurrentFlowing={false}
            onClick={() => {
              if (placed.cardboard && placed.pin1 && placed.pin2 && placed.battery && placed.bulb && !placed.wires) {
                handlePlaceItem('wires');
              }
            }}
          />

          {/* Drawing Pin 1 (Pivot) */}
          <DrawingPinSVG 
            x={450} 
            y={250} 
            label={placed.pin1 ? "Drawing Pin 1" : ""}
            isPlaced={placed.pin1}
            isTarget={placed.cardboard && !placed.pin1}
            onClick={() => {
              if (!placed.pin1 && placed.cardboard) {
                handlePlaceItem('pin1');
              }
            }}
          />

          {/* Safety Pin (Pivot point is Pin 1 at 450, 250) */}
          <SafetyPinSVG 
            x={450} 
            y={250} 
            rotation={-35} 
            isPlaced={placed.safetyPin}
            isTarget={placed.pin1 && !placed.safetyPin}
            onClick={() => {
              if (!placed.safetyPin && placed.pin1) {
                handlePlaceItem('safetyPin');
              }
            }}
          />

          {/* Drawing Pin 2 (Contact Point) */}
          <DrawingPinSVG 
            x={450} 
            y={370} 
            label={placed.pin2 ? "Drawing Pin 2" : ""}
            isPlaced={placed.pin2}
            isTarget={placed.safetyPin && !placed.pin2}
            onClick={() => {
              if (!placed.pin2 && placed.safetyPin) {
                handlePlaceItem('pin2');
              }
            }}
          />
        </svg>

        {/* Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 'bold' }}>WORKSPACE TERMINALS</span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>💡 Hint: Click on highlighted areas inside the board to build directly!</span>
        </div>
      </div>
    </div>
  );
}
