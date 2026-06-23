import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw,
  Zap,
  ZapOff,
  Layers,
  Scissors,
  CheckCircle,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  BoardBaseSVG, 
  GenericCellSVG, 
  GenericLoadSVG, 
  GenericTerminalSVG, 
  GenericWiresSVG 
} from './CanvasElements';

export default function Stage3_Sandbox() {
  const [isClosed, setIsClosed] = useState(false);
  const [hasCell, setHasCell] = useState(true);
  const [isWireOk, setIsWireOk] = useState(true);
  const [material, setMaterial] = useState('metal'); // 'metal' | 'plastic'

  const handleReset = () => {
    setIsClosed(false);
    setHasCell(true);
    setIsWireOk(true);
    setMaterial('metal');
  };

  const isConductor = material === 'metal';
  const isActive = isClosed && hasCell && isWireOk && isConductor;

  // Science explanation builder
  const getExplanation = () => {
    if (!isClosed) {
      return {
        title: "Circuit Open",
        desc: "The connection bridge is open, creating a physical gap in the circuit. Current cannot jump across the gap.",
        status: "neutral"
      };
    }
    if (!hasCell) {
      return {
        title: "No Energy Source",
        desc: "The circuit is closed, but there is no power cell. A battery is needed to push electrons around the loop.",
        status: "warning"
      };
    }
    if (!isWireOk) {
      return {
        title: "Broken Wire Loop",
        desc: "A break in the wire stops the circulation of current. It represents an open circuit.",
        status: "warning"
      };
    }
    if (!isConductor) {
      return {
        title: "Insulator Block",
        desc: "Plastic is an insulator. Insulators block the flow of electric current even when the circuit is closed.",
        status: "danger"
      };
    }
    return {
      title: "Current Flows Successfully!",
      desc: "The circuit is closed, a cell is present, wires are intact, and the bridge is a conductor. The load is active!",
      status: "success"
    };
  };

  const explanation = getExplanation();

  return (
    <div className="main-grid">
      {/* Left Panel: Sandbox controls */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <span className="status-badge closed" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            Stage 3: Sandbox Lab
          </span>
          <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>Circuit Explorer</h2>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            Modify circuit properties to test how electricity behaves under different conditions.
          </p>
        </div>

        {/* Dynamic Science Report */}
        <div style={{
          background: explanation.status === 'success' ? 'rgba(16, 185, 129, 0.08)' : 
                      explanation.status === 'danger' ? 'rgba(239, 68, 68, 0.08)' :
                      explanation.status === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(30, 41, 59, 0.6)',
          border: `1px solid ${
            explanation.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
            explanation.status === 'danger' ? 'rgba(239, 68, 68, 0.2)' :
            explanation.status === 'warning' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)'
          }`,
          borderRadius: '12px',
          padding: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            color: explanation.status === 'success' ? '#34d399' : 
                   explanation.status === 'danger' ? '#f87171' : 
                   explanation.status === 'warning' ? '#fbbf24' : '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <HelpCircle size={16} />
            {explanation.title}
          </h4>
          <p style={{ margin: 0, fontSize: '0.825rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            {explanation.desc}
          </p>
        </div>

        {/* Sandbox Form controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Bridge switch */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Connection Bridge</span>
            <button 
              onClick={() => setIsClosed(!isClosed)} 
              className="outline" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              {isClosed ? (
                <>
                  <ToggleRight size={16} style={{ color: '#34d399' }} /> Closed (ON)
                </>
              ) : (
                <>
                  <ToggleLeft size={16} /> Open (OFF)
                </>
              )}
            </button>
          </div>

          {/* Cell status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Power Source</span>
            <button 
              onClick={() => setHasCell(!hasCell)} 
              className={hasCell ? 'outline' : 'warning'} 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {hasCell ? 'Remove Battery' : 'Insert Battery'}
            </button>
          </div>

          {/* Wire status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Wires Loop</span>
            <button 
              onClick={() => setIsWireOk(!isWireOk)} 
              className={isWireOk ? 'outline' : 'success'} 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Scissors size={14} />
              {isWireOk ? 'Cut Wire' : 'Repair Wire'}
            </button>
          </div>

          {/* Material selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={14} /> Bridge Material
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <button 
                onClick={() => setMaterial('metal')} 
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.5rem',
                  borderColor: material === 'metal' ? '#6366f1' : 'rgba(255,255,255,0.02)',
                  background: material === 'metal' ? 'rgba(99, 102, 241, 0.15)' : '#0f172a'
                }}
              >
                Metal (Conductor)
              </button>
              <button 
                onClick={() => setMaterial('plastic')} 
                style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.5rem',
                  borderColor: material === 'plastic' ? '#06b6d4' : 'rgba(255,255,255,0.02)',
                  background: material === 'plastic' ? 'rgba(6, 182, 212, 0.15)' : '#0f172a'
                }}
              >
                Plastic (Insulator)
              </button>
            </div>
          </div>
        </div>

        {/* Reset button */}
        <button onClick={handleReset} className="outline" style={{ marginTop: 'auto', gap: '0.35rem' }}>
          <RotateCcw size={16} /> Reset Sandbox
        </button>
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
          <BoardBaseSVG />

          {/* Bulb Component */}
          <GenericLoadSVG 
            isPlaced={true} 
            isActive={isActive}
          />

          {/* Battery Component */}
          <GenericCellSVG 
            isPlaced={hasCell} 
            onClick={() => setHasCell(!hasCell)}
          />

          {/* Connecting Wires */}
          <GenericWiresSVG 
            isPlaced={true} 
            isActive={isActive}
            isBroken={!isWireOk}
            onClick={() => setIsWireOk(!isWireOk)}
          />

          {/* Terminal 1 */}
          <GenericTerminalSVG 
            x={450} 
            y={250} 
            label="Terminal 1" 
            isPlaced={true} 
            onClick={() => setIsClosed(!isClosed)}
          />

          {/* Interactive Bridge Wire Connector */}
          <motion.g
            animate={{ rotate: isClosed ? 0 : -30 }}
            transition={{ type: 'spring', stiffness: 90, damping: 10 }}
            style={{ originX: '450px', originY: '250px', cursor: 'pointer' }}
            onClick={() => setIsClosed(!isClosed)}
          >
            {/* Bridge wire arm (colors based on material selection!) */}
            <line 
              x1={450} 
              y1={250} 
              x2={450} 
              y2={370} 
              stroke={material === 'metal' ? '#f59e0b' : '#06b6d4'} 
              strokeWidth={6} 
              strokeLinecap="round" 
            />
            <circle cx={450} cy={250} r={4} fill="#ffffff" />
            <circle cx={450} cy={370} r={6} fill={material === 'metal' ? '#f59e0b' : '#06b6d4'} />
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
