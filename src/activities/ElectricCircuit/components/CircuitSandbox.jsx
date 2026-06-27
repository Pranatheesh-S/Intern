import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BatteryBareSVG, BatteryHolderSVG, BulbBareSVG, BulbHolderSVG } from '../../ElectricSwitch/CircuitElements';
import { Trash2 } from 'lucide-react';

// Draggable component wrapper using framer-motion drag
const DraggableComponent = ({ id, position, onDragEnd, children, disabled }) => {
  return (
    <motion.div
      drag={!disabled}
      dragMomentum={false}
      onDragEnd={(e, info) => onDragEnd(id, info.offset.x, info.offset.y)}
      initial={position}
      animate={position}
      whileDrag={{ zIndex: 100, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: 'absolute',
        touchAction: 'none',
        cursor: disabled ? 'default' : 'grab',
        zIndex: 10
      }}
    >
      {children}
    </motion.div>
  );
};

export default function CircuitSandbox({ onWiringChange, isTesting, isGlowing, resetSignal, fullResetSignal, onAssemblyStatusChange }) {
  // Component positions
  const [positions, setPositions] = useState({
    cell: { x: 50, y: 50 },
    cellHolder: { x: 100, y: 300 },
    lamp: { x: 250, y: 50 },
    lampHolder: { x: 200, y: 200 }
  });

  const [assembly, setAssembly] = useState({
    isCellInHolder: false,
    isLampInHolder: false
  });

  const [wires, setWires] = useState([]); // Array of { start: string, end: string }
  const [activeTerminal, setActiveTerminal] = useState(null);
  const containerRef = useRef(null);

  // Terminals definition
  // Coordinates are relative to the top-left of the Holder SVG
  const terminals = {
    'cellHolder-pos': { comp: 'cellHolder', offsetX: 135, offsetY: 34 }, // + side
    'cellHolder-neg': { comp: 'cellHolder', offsetX: 5, offsetY: 34 }, // - side
    'lampHolder-left':   { comp: 'lampHolder', offsetX: 30, offsetY: 77 },    // screw 1
    'lampHolder-right':  { comp: 'lampHolder', offsetX: 90, offsetY: 77 }     // screw 2
  };

  useEffect(() => {
    onWiringChange(wires);
  }, [wires, onWiringChange]);

  useEffect(() => {
    if (onAssemblyStatusChange) {
      onAssemblyStatusChange(assembly);
    }
  }, [assembly, onAssemblyStatusChange]);

  useEffect(() => {
    if (resetSignal > 0) {
      setWires([]);
      setActiveTerminal(null);
      // We don't reset assembly state between arrangements to save time for the student
    }
  }, [resetSignal]);

  useEffect(() => {
    if (fullResetSignal > 0) {
      setWires([]);
      setActiveTerminal(null);
      setPositions({
        cell: { x: 50, y: 50 },
        cellHolder: { x: 100, y: 300 },
        lamp: { x: 250, y: 50 },
        lampHolder: { x: 200, y: 200 }
      });
      setAssembly({
        isCellInHolder: false,
        isLampInHolder: false
      });
    }
  }, [fullResetSignal]);

  const handleDragEnd = (id, offsetX, offsetY) => {
    if (isTesting) return;
    
    setPositions(prev => {
      const newPos = {
        x: Math.max(20, Math.min(containerRef.current ? containerRef.current.clientWidth - 100 : 450, prev[id].x + offsetX)),
        y: Math.max(20, Math.min(380, prev[id].y + offsetY))
      };

      // Check for snapping
      if (id === 'cell') {
        const holderPos = prev.cellHolder;
        const dist = Math.sqrt(Math.pow(newPos.x - holderPos.x, 2) + Math.pow(newPos.y - holderPos.y, 2));
        if (dist < 60) {
          setAssembly(a => ({ ...a, isCellInHolder: true }));
          return prev; // Snap! Don't update cell position, it's absorbed.
        }
      }

      if (id === 'lamp') {
        const holderPos = prev.lampHolder;
        const dist = Math.sqrt(Math.pow(newPos.x - holderPos.x, 2) + Math.pow(newPos.y - holderPos.y, 2));
        if (dist < 60) {
          setAssembly(a => ({ ...a, isLampInHolder: true }));
          return prev; // Snap!
        }
      }

      return { ...prev, [id]: newPos };
    });
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
    if (tId !== 'cellHolder-neg' && tId !== 'cellHolder-pos') return false;
    return wires.some(w => w.start === tId || w.end === tId);
  };

  const handleTerminalClick = (terminalId) => {
    if (isTesting) return;
    
    // Only allow wiring if both components are assembled (optional constraint, but good for physics realism)
    if (!assembly.isCellInHolder || !assembly.isLampInHolder) {
        return; 
    }

    if (activeTerminal) {
      if (activeTerminal === terminalId) {
        setActiveTerminal(null); // Deselect
        return;
      }
      
      if (isBatteryInUse(terminalId)) {
        return; // Battery terminal already in use
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
      if (isBatteryInUse(terminalId)) {
        return; // Battery terminal already in use
      }
      setActiveTerminal(terminalId);
    }
  };

  const clearWires = () => {
    if (isTesting) return;
    setWires([]);
    setActiveTerminal(null);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '450px',
        position: 'relative',
        background: 'var(--neutral-bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <div className="canvas-bg-grid" style={{ width: '100%', height: '100%', position: 'absolute', opacity: 0.5 }} />

      {/* Controls */}
      {!isTesting && (
        <button
          onClick={clearWires}
          className="outline"
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.8rem' }}
        >
          <Trash2 size={14} /> Clear Wires
        </button>
      )}

      {/* Render SVG Wires Layer */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}>
        {wires.map((wire, idx) => {
          const start = getTerminalCoords(wire.start);
          const end = getTerminalCoords(wire.end);
          
          // Add a slight curve to the wires
          const controlY = Math.max(start.y, end.y) + 40;
          const path = `M ${start.x},${start.y} C ${start.x},${controlY} ${end.x},${controlY} ${end.x},${end.y}`;
          
          return (
            <g key={idx}>
              <path d={path} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
              <path d={path} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>

      {/* Draggable Bare Cell */}
      <AnimatePresence>
        {!assembly.isCellInHolder && (
          <DraggableComponent id="cell" position={positions.cell} onDragEnd={handleDragEnd} disabled={isTesting}>
            <svg width="120" height="60" style={{ pointerEvents: 'none' }}>
              <BatteryBareSVG />
            </svg>
          </DraggableComponent>
        )}
      </AnimatePresence>

      {/* Draggable Bare Bulb */}
      <AnimatePresence>
        {!assembly.isLampInHolder && (
          <DraggableComponent id="lamp" position={positions.lamp} onDragEnd={handleDragEnd} disabled={isTesting}>
            <svg width="100" height="100" style={{ pointerEvents: 'none' }} viewBox="-40 -50 80 100">
              <BulbBareSVG isOn={false} />
            </svg>
          </DraggableComponent>
        )}
      </AnimatePresence>

      {/* Draggable Cell Holder */}
      <DraggableComponent id="cellHolder" position={positions.cellHolder} onDragEnd={handleDragEnd} disabled={isTesting}>
        <div style={{ position: 'relative' }}>
          <svg width="150" height="60" style={{ pointerEvents: 'none' }} viewBox="-20 -10 150 60">
            <BatteryHolderSVG hasCell={assembly.isCellInHolder} />
          </svg>
          
          {/* Interactive Terminals */}
          {assembly.isCellInHolder && (
             <>
                <div 
                  className={`terminal-hitbox ${activeTerminal === 'cellHolder-neg' ? 'active' : ''}`}
                  onClick={() => handleTerminalClick('cellHolder-neg')}
                  style={{
                    position: 'absolute', left: 5 - 15, top: 34 - 15, width: 30, height: 30,
                    cursor: isTesting || isBatteryInUse('cellHolder-neg') ? 'default' : 'crosshair', pointerEvents: isTesting || isBatteryInUse('cellHolder-neg') ? 'none' : 'auto', zIndex: 20
                  }}
                />
                <div 
                  className={`terminal-hitbox ${activeTerminal === 'cellHolder-pos' ? 'active' : ''}`}
                  onClick={() => handleTerminalClick('cellHolder-pos')}
                  style={{
                    position: 'absolute', left: 135 - 15, top: 34 - 15, width: 30, height: 30,
                    cursor: isTesting || isBatteryInUse('cellHolder-pos') ? 'default' : 'crosshair', pointerEvents: isTesting || isBatteryInUse('cellHolder-pos') ? 'none' : 'auto', zIndex: 20
                  }}
                />
             </>
          )}
        </div>
      </DraggableComponent>

      {/* Draggable Lamp Holder */}
      <DraggableComponent id="lampHolder" position={positions.lampHolder} onDragEnd={handleDragEnd} disabled={isTesting}>
        <div style={{ position: 'relative' }}>
          <svg width="120" height="120" style={{ pointerEvents: 'none' }} viewBox="-60 -20 120 120">
            <BulbHolderSVG hasBulb={assembly.isLampInHolder} isOn={isGlowing} />
          </svg>

          {/* Interactive Terminals */}
          {assembly.isLampInHolder && (
             <>
                <div 
                  className={`terminal-hitbox ${activeTerminal === 'lampHolder-left' ? 'active' : ''}`}
                  onClick={() => handleTerminalClick('lampHolder-left')}
                  style={{
                    position: 'absolute', left: 30 - 15, top: 77 - 15, width: 30, height: 30,
                    cursor: isTesting ? 'default' : 'crosshair', pointerEvents: isTesting ? 'none' : 'auto', zIndex: 20
                  }}
                />
                <div 
                  className={`terminal-hitbox ${activeTerminal === 'lampHolder-right' ? 'active' : ''}`}
                  onClick={() => handleTerminalClick('lampHolder-right')}
                  style={{
                    position: 'absolute', left: 90 - 15, top: 77 - 15, width: 30, height: 30,
                    cursor: isTesting ? 'default' : 'crosshair', pointerEvents: isTesting ? 'none' : 'auto', zIndex: 20
                  }}
                />
             </>
          )}
        </div>
      </DraggableComponent>

    </div>
  );
}
