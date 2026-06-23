import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Play, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { 
  BoardBaseSVG, 
  GenericCellSVG, 
  GenericLoadSVG, 
  GenericTerminalSVG, 
  GenericWiresSVG 
} from './CanvasElements';

// Define the steps list
const ASSEMBLY_STEPS = [
  { id: 1, label: "Place the Board Base", key: "basePlaced" },
  { id: 2, label: "Add the Contact Terminals", key: "terminalsPlaced" },
  { id: 3, label: "Attach the Power Cell", key: "cellPlaced" },
  { id: 4, label: "Attach the Bulb Load", key: "loadPlaced" },
  { id: 5, label: "Connect the Pathway Wires", key: "wiresPlaced" }
];

export default function Stage1_Assemble({ onComplete }) {
  // Assembly State
  const [boardState, setBoardState] = useState({
    basePlaced: false,
    terminalsPlaced: false,
    cellPlaced: false,
    loadPlaced: false,
    wiresPlaced: false
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  // Get active step index (0-indexed)
  const getActiveStepIndex = () => {
    for (let i = 0; i < ASSEMBLY_STEPS.length; i++) {
      if (!boardState[ASSEMBLY_STEPS[i].key]) return i;
    }
    return ASSEMBLY_STEPS.length; // all done
  };

  const activeStepIdx = getActiveStepIndex();

  const handlePlaceComponent = (key) => {
    setErrorMessage('');

    // 1. Enforce board base must be placed first
    if (key !== 'basePlaced' && !boardState.basePlaced) {
      setErrorMessage("⚠️ Put down the main board base first so you have a solid platform to work on!");
      return;
    }

    // 2. Enforce steps order if sequential is desired, or let them place with dependencies
    if (key === 'wiresPlaced' && (!boardState.cellPlaced || !boardState.loadPlaced || !boardState.terminalsPlaced)) {
      setErrorMessage("⚠️ You must place the battery, bulb, and terminals before connecting them with wires!");
      return;
    }

    // If validations pass, update state
    const newState = { ...boardState, [key]: true };
    setBoardState(newState);

    // Check if fully assembled
    const allDone = ASSEMBLY_STEPS.every(step => newState[step.key]);
    if (allDone) {
      setCompleted(true);
      confetti({ particleCount: 80, spread: 60 });
    }
  };

  const handleReset = () => {
    setBoardState({
      basePlaced: false,
      terminalsPlaced: false,
      cellPlaced: false,
      loadPlaced: false,
      wiresPlaced: false
    });
    setErrorMessage('');
    setCompleted(false);
  };

  return (
    <div className="main-grid">
      {/* Left Panel: Steps & Inventory Tray */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <span className="status-badge closed" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            Stage 1: Assembly
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Assemble Circuit</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Place the required parts onto the workspace in order to build your test circuit.
          </p>
        </div>

        {/* Steps List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
          {ASSEMBLY_STEPS.map((step, idx) => {
            const isDone = boardState[step.key];
            const isActive = idx === activeStepIdx && !completed;

            return (
              <div 
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(30, 41, 59, 0.4)',
                  border: `1px solid ${isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}`,
                  opacity: isDone ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${isActive ? '#6366f1' : '#475569'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    color: isActive ? '#818cf8' : '#64748b',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}>
                    {step.id}
                  </div>
                )}
                <span style={{ 
                  fontSize: '0.825rem', 
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#f8fafc' : isDone ? '#64748b' : '#cbd5e1'
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Warning messages */}
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            borderRadius: '10px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            lineHeight: '1.4'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Placement buttons tray */}
        {!completed ? (
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold' }}>INVENTORY TRAY</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <button 
                onClick={() => handlePlaceComponent('basePlaced')}
                className="outline"
                disabled={boardState.basePlaced}
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                1. Base Board
              </button>
              <button 
                onClick={() => handlePlaceComponent('terminalsPlaced')}
                className="outline"
                disabled={boardState.terminalsPlaced}
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                2. Terminals
              </button>
              <button 
                onClick={() => handlePlaceComponent('cellPlaced')}
                className="outline"
                disabled={boardState.cellPlaced}
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                3. Battery Cell
              </button>
              <button 
                onClick={() => handlePlaceComponent('loadPlaced')}
                className="outline"
                disabled={boardState.loadPlaced}
                style={{ fontSize: '0.8rem', padding: '0.5rem' }}
              >
                4. Bulb Load
              </button>
            </div>
            <button 
              onClick={() => handlePlaceComponent('wiresPlaced')}
              className="primary"
              disabled={boardState.wiresPlaced}
              style={{ fontSize: '0.8rem', padding: '0.6rem', gridColumn: 'span 2' }}
            >
              5. Connect Wires
            </button>
          </div>
        ) : (
          /* Finished block */
          <div style={{ 
            marginTop: 'auto', 
            background: 'rgba(16, 185, 129, 0.08)', 
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <h4 style={{ margin: 0, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Sparkles size={16} /> Circuit Built!
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1' }}>
              Your circuit is fully assembled. You are ready to run tests.
            </p>
            <button onClick={onComplete} className="success" style={{ width: '100%', gap: '0.25rem', padding: '0.5rem' }}>
              Go to Stage 2 <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Right Panel: Workspace Canvas */}
      <div className="canvas-container" style={{ padding: '2rem' }}>
        <div className="canvas-bg-grid" />
        
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 600 480" 
          style={{ maxWidth: '600px', maxHeight: '480px' }}
        >
          {/* Cardboard Base */}
          {boardState.basePlaced && <BoardBaseSVG />}

          {/* Bulb Component */}
          <GenericLoadSVG 
            isPlaced={boardState.loadPlaced} 
            isTarget={boardState.basePlaced && !boardState.loadPlaced && activeStepIdx === 3}
            isActive={false}
            onClick={() => handlePlaceComponent('loadPlaced')}
          />

          {/* Battery Component */}
          <GenericCellSVG 
            isPlaced={boardState.cellPlaced} 
            isTarget={boardState.basePlaced && !boardState.cellPlaced && activeStepIdx === 2}
            onClick={() => handlePlaceComponent('cellPlaced')}
          />

          {/* Connecting Wires */}
          <GenericWiresSVG 
            isPlaced={boardState.wiresPlaced} 
            isActive={false}
            isBroken={false}
            onClick={() => handlePlaceComponent('wiresPlaced')}
          />

          {/* Drawing Pin 1 (Pivot) */}
          <GenericTerminalSVG 
            x={450} 
            y={250} 
            label="Terminal 1" 
            isPlaced={boardState.terminalsPlaced} 
            isTarget={boardState.basePlaced && !boardState.terminalsPlaced && activeStepIdx === 1}
            onClick={() => handlePlaceComponent('terminalsPlaced')}
          />

          {/* Drawing Pin 2 (Contact Point) */}
          <GenericTerminalSVG 
            x={450} 
            y={370} 
            label="Terminal 2" 
            isPlaced={boardState.terminalsPlaced} 
          />
        </svg>

        {/* Interactive Instruction Overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', pointerEvents: 'none' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            💡 Tip: Click items in the tray or tap matching dash boundaries to place them.
          </span>
        </div>
      </div>
    </div>
  );
}
