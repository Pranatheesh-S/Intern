import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DoubleBatteryHolderSVG, LEDSVG } from '../../ElectricSwitch/CircuitElements';
import useMeasure from 'react-use-measure';

// A simple draggable wrapper
const DraggableComponent = ({ id, children, position, onDragEnd, disabled }) => {
  return (
    <motion.div
      drag={!disabled}
      dragMomentum={false}
      onDragEnd={(e, info) => onDragEnd(id, info.offset.x, info.offset.y)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'absolute',
        cursor: disabled ? 'default' : 'grab',
        touchAction: 'none',
        zIndex: 10
      }}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
    >
      {children}
    </motion.div>
  );
};

export default function CircuitSandbox3_7({ onWiringChange, isTesting, isGlowing, resetSignal }) {
  const [ref, bounds] = useMeasure();
  
  // Base positions
  const [positions, setPositions] = useState({
    battery: { x: 100, y: 220 },
    led: { x: 350, y: 100 }
  });

  // Wires: array of { start: 'terminalId', end: 'terminalId' }
  const [wires, setWires] = useState([]);
  
  // Currently interacting terminal
  const [activeTerminal, setActiveTerminal] = useState(null);

  // Define terminals (offsets relative to the SVG container)
  const terminals = {
    'batt-neg': { comp: 'battery', offsetX: 5, offsetY: 34 }, // - side (left)
    'batt-pos': { comp: 'battery', offsetX: 227, offsetY: 34 }, // + side (right)
    'led-short': { comp: 'led', offsetX: 35, offsetY: 95 }, // short leg (left)
    'led-long': { comp: 'led', offsetX: 65, offsetY: 105 }  // long leg (right)
  };

  useEffect(() => {
    onWiringChange(wires);
  }, [wires, onWiringChange]);

  useEffect(() => {
    if (resetSignal > 0) {
      setWires([]);
      setActiveTerminal(null);
    }
  }, [resetSignal]);

  const handleDragEnd = (id, offsetX, offsetY) => {
    if (isTesting) return;
    
    setPositions(prev => ({
      ...prev,
      [id]: {
        x: Math.max(20, Math.min(bounds.width ? bounds.width - 150 : 550, prev[id].x + offsetX)),
        y: Math.max(20, Math.min(bounds.height ? bounds.height - 100 : 380, prev[id].y + offsetY))
      }
    }));
  };

  const getTerminalCoords = (terminalId) => {
    const t = terminals[terminalId];
    if (!t) return { x: 0, y: 0 };
    const pos = positions[t.comp];
    return {
      x: pos.x + t.offsetX,
      y: pos.y + t.offsetY
    };
  };

  const isBatteryInUse = (tId) => {
    if (tId !== 'batt-neg' && tId !== 'batt-pos') return false;
    return wires.some(w => w.start === tId || w.end === tId);
  };

  const isLedInUse = (tId) => {
    if (tId !== 'led-short' && tId !== 'led-long') return false;
    return wires.some(w => w.start === tId || w.end === tId);
  };

  const handleTerminalClick = (terminalId) => {
    if (isTesting) return;
    
    if (activeTerminal) {
      if (activeTerminal === terminalId) {
        setActiveTerminal(null); // Deselect
        return;
      }
      
      if (isBatteryInUse(terminalId) || isLedInUse(terminalId)) {
        return; // Terminal already in use (for this activity, 1 wire per terminal max)
      }

      // Prevent duplicate wires
      const exists = wires.find(w => 
        (w.start === activeTerminal && w.end === terminalId) ||
        (w.end === activeTerminal && w.start === terminalId)
      );

      if (!exists) {
        setWires([...wires, { start: activeTerminal, end: terminalId }]);
      }
      setActiveTerminal(null);
    } else {
      if (isBatteryInUse(terminalId) || isLedInUse(terminalId)) {
        return; // Terminal already in use
      }
      setActiveTerminal(terminalId);
    }
  };

  const handleWireClick = (index) => {
    if (isTesting) return;
    setWires(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div ref={ref} style={{ 
      width: '100%', 
      height: '450px', 
      background: 'var(--canvas-bg)', 
      borderRadius: '8px', 
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)'
    }}>
      {/* Grid Background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.5
      }} />

      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
        {wires.map((wire, idx) => {
          const startCoords = getTerminalCoords(wire.start);
          const endCoords = getTerminalCoords(wire.end);
          
          const controlY = Math.max(startCoords.y, endCoords.y) + 40 + (idx * 20);
          const path = `M ${startCoords.x},${startCoords.y} C ${startCoords.x},${controlY} ${endCoords.x},${controlY} ${endCoords.x},${endCoords.y}`;
          
          let wireColorMain = '#ef4444'; // default red
          let wireColorOutline = '#b91c1c'; // default dark red

          if (wire.start === 'batt-neg' || wire.end === 'batt-neg') {
             wireColorMain = '#3b82f6'; // blue
             wireColorOutline = '#1d4ed8'; // dark blue
          } else if (wire.start === 'batt-pos' || wire.end === 'batt-pos') {
             wireColorMain = '#ef4444'; // red
             wireColorOutline = '#b91c1c'; // dark red
          }

          return (
            <g key={idx} style={{ pointerEvents: 'auto', cursor: isTesting ? 'default' : 'pointer' }} onClick={() => handleWireClick(idx)}>
              <path d={path} fill="none" stroke="transparent" strokeWidth={20} />
              <path d={path} fill="none" stroke={wireColorOutline} strokeWidth={5} strokeLinecap="round" opacity={0.8} />
              <path d={path} fill="none" stroke={wireColorMain} strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}

        {activeTerminal && (
          <line 
            x1={getTerminalCoords(activeTerminal).x} 
            y1={getTerminalCoords(activeTerminal).y} 
            x2={getTerminalCoords(activeTerminal).x} 
            y2={getTerminalCoords(activeTerminal).y - 20} 
            stroke="var(--accent)" 
            strokeWidth={3} 
            strokeDasharray="4 4" 
          />
        )}
      </svg>

      {/* Draggable Battery (Already Assembled) */}
      <DraggableComponent id="battery" position={positions.battery} onDragEnd={handleDragEnd} disabled={isTesting}>
        <div style={{ position: 'relative' }}>
          <svg width="250" height="60" style={{ pointerEvents: 'none' }} viewBox="-20 -10 250 60">
            <DoubleBatteryHolderSVG cellsCount={2} />
          </svg>
          
          <div 
            className={`terminal-hitbox ${activeTerminal === 'batt-neg' ? 'active' : ''}`}
            onClick={() => handleTerminalClick('batt-neg')}
            style={{
              position: 'absolute', left: 5 - 15, top: 34 - 15, width: 30, height: 30,
              cursor: isTesting || isBatteryInUse('batt-neg') ? 'default' : 'crosshair', pointerEvents: isTesting || isBatteryInUse('batt-neg') ? 'none' : 'auto', zIndex: 20
            }}
          />
          <div 
            className={`terminal-hitbox ${activeTerminal === 'batt-pos' ? 'active' : ''}`}
            onClick={() => handleTerminalClick('batt-pos')}
            style={{
              position: 'absolute', left: 227 - 15, top: 34 - 15, width: 30, height: 30,
              cursor: isTesting || isBatteryInUse('batt-pos') ? 'default' : 'crosshair', pointerEvents: isTesting || isBatteryInUse('batt-pos') ? 'none' : 'auto', zIndex: 20
            }}
          />
        </div>
      </DraggableComponent>

      {/* Draggable LED */}
      <DraggableComponent id="led" position={positions.led} onDragEnd={handleDragEnd} disabled={isTesting}>
        <div style={{ position: 'relative' }}>
          <svg width="100" height="120" style={{ pointerEvents: 'none' }} viewBox="-50 -30 100 120">
            <LEDSVG isOn={isGlowing} />
          </svg>
          
          {/* LED Short Leg */}
          <div 
            className={`terminal-hitbox ${activeTerminal === 'led-short' ? 'active' : ''}`}
            onClick={() => handleTerminalClick('led-short')}
            style={{
              position: 'absolute', left: 35 - 15, top: 95 - 15, width: 30, height: 30,
              cursor: isTesting || isLedInUse('led-short') ? 'default' : 'crosshair', pointerEvents: isTesting || isLedInUse('led-short') ? 'none' : 'auto', zIndex: 20
            }}
          />
          {/* LED Long Leg */}
          <div 
            className={`terminal-hitbox ${activeTerminal === 'led-long' ? 'active' : ''}`}
            onClick={() => handleTerminalClick('led-long')}
            style={{
              position: 'absolute', left: 65 - 15, top: 105 - 15, width: 30, height: 30,
              cursor: isTesting || isLedInUse('led-long') ? 'default' : 'crosshair', pointerEvents: isTesting || isLedInUse('led-long') ? 'none' : 'auto', zIndex: 20
            }}
          />
        </div>
      </DraggableComponent>
      
      {!isTesting && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'var(--text-muted)', fontSize: '0.75rem', pointerEvents: 'none' }}>
          Click terminal circles to connect wires. Click a wire to remove it.
        </div>
      )}
    </div>
  );
}
