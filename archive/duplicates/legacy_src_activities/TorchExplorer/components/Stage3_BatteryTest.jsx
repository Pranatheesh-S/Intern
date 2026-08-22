import React, { useState } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  DragOverlay
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, RotateCcw, AlertTriangle, ArrowRight, Lightbulb, LightbulbOff, CheckCircle2, Info } from 'lucide-react';

const MAX_SLOTS = 3;

// A simple draggable cell component
function DraggableCell({ id, reversed }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : 10,
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{
        width: '60px', height: '100px', 
        background: 'linear-gradient(to right, #2563eb, #1e40af)', 
        borderRadius: '8px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        transform: reversed ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.3s'
      }}>
        <div style={{ position: 'absolute', top: '-6px', width: '20px', height: '6px', background: '#d1d5db', borderRadius: '4px 4px 0 0' }} />
        <div style={{ position: 'absolute', top: '10px' }}>+</div>
        <div style={{ position: 'absolute', bottom: '10px' }}>−</div>
        <div style={{ position: 'absolute', bottom: 0, width: '60px', height: '10px', background: '#9ca3af', borderRadius: '0 0 8px 8px' }} />
      </div>
    </div>
  );
}

function DroppableSlot({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        width: '70px',
        height: '110px',
        border: `2px dashed ${isOver ? 'var(--accent)' : 'var(--border)'}`,
        background: isOver ? 'var(--accent-bg)' : 'rgba(0,0,0,0.05)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
    >
      {children}
    </div>
  );
}

export default function Stage3_BatteryTest({ onComplete }) {
  // cells array holds objects like { id: 'cell_1', reversed: false, slot: null }
  const [cells, setCells] = useState(() => [
    { id: 'cell_1', reversed: Math.random() > 0.5, slot: null },
    { id: 'cell_2', reversed: Math.random() > 0.5, slot: null },
    { id: 'cell_3', reversed: Math.random() > 0.5, slot: null },
  ]);
  const [activeId, setActiveId] = useState(null);
  const [switchOn, setSwitchOn] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragStart = (e) => {
    setActiveId(e.active.id);
  };

  const handleDragEnd = (e) => {
    setActiveId(null);
    const { active, over } = e;
    
    if (!over) {
      // Drop outside - return to tray
      setCells(prev => prev.map(c => c.id === active.id ? { ...c, slot: null } : c));
      return;
    }

    if (over.id.toString().startsWith('slot_')) {
      const slotIndex = parseInt(over.id.split('_')[1]);
      
      // Check if slot is occupied
      const existingCell = cells.find(c => c.slot === slotIndex);
      if (existingCell && existingCell.id !== active.id) {
        // Swap cells
        setCells(prev => prev.map(c => {
          if (c.id === active.id) return { ...c, slot: slotIndex };
          if (c.id === existingCell.id) return { ...c, slot: cells.find(x => x.id === active.id).slot };
          return c;
        }));
      } else {
        // Move to empty slot
        setCells(prev => prev.map(c => c.id === active.id ? { ...c, slot: slotIndex } : c));
      }
    }
  };

  const toggleReverse = (cellId) => {
    setCells(prev => prev.map(c => c.id === cellId ? { ...c, reversed: !c.reversed } : c));
  };

  const handleReset = () => {
    setCells([
      { id: 'cell_1', reversed: Math.random() > 0.5, slot: null },
      { id: 'cell_2', reversed: Math.random() > 0.5, slot: null },
      { id: 'cell_3', reversed: Math.random() > 0.5, slot: null },
    ]);
    setSwitchOn(false);
    setSandboxMode(false);
  };

  // Logic to determine if bulb glows
  // Rule: Cells must be contiguous, starting from slot 0.
  // Rule: All cells must be facing the correct way (reversed = false is positive up). 
  // Wait, if it's a flashlight, the spring is at the bottom (-). So the bottom of cell 1 touches spring.
  // The top of cell 1 (+) touches bottom of cell 2 (-). Top of cell 2 (+) touches bulb.
  // So all cells must have reversed=false.
  // At least 1 cell must be present to glow weakly. 2 cells = normal, 3 cells = bright!
  
  const activeSlots = [0, 1, 2].map(s => cells.find(c => c.slot === s));
  
  // Find contiguous sequence from the top (slot 2) or bottom (slot 0)
  // Let's assume the circuit connects the bottom of slot 0 to the top of slot 2.
  // A break in the middle means no circuit.
  
  let circuitComplete = false;
  let voltage = 0;
  let message = "Torch is OFF.";
  
  if (switchOn) {
    // Check if slots are filled contiguously from bottom
    if (activeSlots[0] && activeSlots[1] && activeSlots[2]) {
      // 3 cells
      if (!activeSlots[0].reversed && !activeSlots[1].reversed && !activeSlots[2].reversed) {
        circuitComplete = true;
        voltage = 3;
        message = "3 cells connected correctly! The bulb is super bright!";
      } else if (activeSlots[0].reversed && activeSlots[1].reversed && activeSlots[2].reversed) {
        message = "The cells are connected to each other correctly, but the entire pack is upside down! The top positive (+) terminal must face the bulb.";
      } else {
        message = "Incorrect connection! The negative (−) terminal of one cell must touch the positive (+) terminal of the next. Double-click to flip them.";
      }
    } else if (activeSlots[0] && activeSlots[1] && !activeSlots[2]) {
      // 2 cells in bottom slots
      if (!activeSlots[0].reversed && !activeSlots[1].reversed) {
        circuitComplete = true;
        voltage = 2;
        message = "2 cells connected correctly. The bulb glows normally.";
      } else if (activeSlots[0].reversed && activeSlots[1].reversed) {
        message = "The cells are connected to each other correctly, but the entire pack is upside down! The top positive (+) terminal must face the bulb.";
      } else {
        message = "Incorrect connection! The negative (−) terminal of one cell must touch the positive (+) terminal of the next. Double-click to flip them.";
      }
    } else if (activeSlots[0] && !activeSlots[1] && !activeSlots[2]) {
      // 1 cell
      if (!activeSlots[0].reversed) {
        circuitComplete = true;
        voltage = 1;
        message = "1 cell connected. The bulb glows dimly.";
      } else {
        message = "The cell is upside down! The negative (−) base must touch the bottom spring.";
      }
    } else if (!activeSlots[0] && !activeSlots[1] && !activeSlots[2]) {
      message = "No cells in the torch. Please add cells to the battery holder.";
    } else {
      message = "Cells must be stacked continuously from the bottom spring (Slot 0).";
    }
  } else {
    message = "The switch is OFF. Slide it to ON to test the circuit.";
  }

  // Handle auto-completion of initial scenario
  if (!sandboxMode && circuitComplete && voltage >= 2) {
    setTimeout(() => {
      setSandboxMode(true);
    }, 3000);
  }

  let insightText = "";
  if (!circuitComplete && switchOn && activeSlots.some(Boolean)) {
    if (message.includes("upside down")) {
      insightText = "Even though the cells are connected, the pack is backwards! The flat negative (−) end often cannot make a proper physical connection with the bulb's base. Also,the torch uses an LED bulb, electricity can only flow through it in one direction!";
    } else if (message.includes("continuously")) {
      insightText = "Electricity needs a continuous, unbroken path to flow from the battery to the bulb and back. A gap between the cells breaks the circuit, preventing the electric current from reaching the bulb!";
    } else {
      insightText = "If batteries are connected + to + or − to −, they do not work properly because they push against each other. To make the bulb glow, connect them + to − so that they work together.";
    }
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)' }}>
            {sandboxMode ? "Sandbox: Free Experimentation" : "Build the Battery"}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {sandboxMode 
              ? "Try 1, 2, or 3 cells. What happens if you reverse one? (Double-click a cell to reverse it)"
              : "Place at least 2 cells into the battery holder correctly, then turn on the switch."}
          </p>
        </div>
        <button onClick={handleReset} className="outline" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Reset Activity">
          <RotateCcw size={18} />
        </button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 200px', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Inventory */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h4 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', width: '100%', textAlign: 'center' }}>Available Cells</h4>
            
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'var(--accent-bg)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', width: '100%' }}>
              💡 Double-click any cell to flip its (+/−) terminals
            </div>

            <div style={{ minHeight: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              {cells.filter(c => c.slot === null).map(cell => (
                <div key={cell.id} onDoubleClick={() => toggleReverse(cell.id)} title="Double click to reverse">
                  <DraggableCell id={cell.id} reversed={cell.reversed} />
                </div>
              ))}
              {cells.filter(c => c.slot === null).length === 0 && (
                <div style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                  All cells are in the holder.
                </div>
              )}
            </div>
          </div>

          {/* Torch View */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', padding: '10px 0', minHeight: '480px' }}>
            
            {/* SVG Background Cross-section */}
            <svg width="160" height="480" style={{ position: 'absolute', top: 0, zIndex: 0, filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>
              <defs>
                <linearGradient id="metalGradVert" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="20%" stopColor="#94a3b8" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="80%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="interiorGradVert" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="50%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              
              {/* Reflector Head */}
              <path d="M 40,110 L 10,30 L 150,30 L 120,110 Z" fill="url(#metalGradVert)" />
              <rect x="5" y="20" width="150" height="10" fill="#1e293b" rx="2" />
              
              {/* Main Body */}
              <path d="M 40,110 L 120,110 L 120,460 Q 80,470 40,460 Z" fill="url(#metalGradVert)" />
              
              {/* Reflector inner cone */}
              <path d="M 45,110 L 25,35 L 135,35 L 115,110 Z" fill="#94a3b8" />
              
              {/* Inner Cutaway for Battery Holder */}
              <rect x="42" y="110" width="76" height="340" fill="url(#interiorGradVert)" rx="4" />
            </svg>

            {/* Bulb */}
            <motion.div 
              animate={{ 
                backgroundColor: circuitComplete ? (voltage === 3 ? '#fef08a' : voltage === 2 ? '#fde047' : '#fef9c3') : '#e2e8f0',
                boxShadow: circuitComplete ? `0 -10px ${voltage * 25}px ${voltage * 10}px rgba(253, 224, 71, ${voltage * 0.4})` : 'inset 0 2px 4px rgba(0,0,0,0.1)'
              }}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '4px solid #cbd5e1', zIndex: 10,
                marginTop: '30px', marginBottom: '15px'
              }}
            >
              {circuitComplete ? <Lightbulb size={32} color="#ca8a04" /> : <LightbulbOff size={32} color="#94a3b8" />}
            </motion.div>

            {/* Battery Slots */}
            <div style={{ 
              display: 'flex', flexDirection: 'column-reverse', gap: '4px',
              zIndex: 10, padding: '5px'
            }}>
              {[0, 1, 2].map(slotIndex => (
                <DroppableSlot key={`slot_${slotIndex}`} id={`slot_${slotIndex}`}>
                  {cells.find(c => c.slot === slotIndex) && (
                    <div onDoubleClick={() => toggleReverse(cells.find(c => c.slot === slotIndex).id)} title="Double click to reverse">
                      <DraggableCell id={cells.find(c => c.slot === slotIndex).id} reversed={cells.find(c => c.slot === slotIndex).reversed} />
                    </div>
                  )}
                </DroppableSlot>
              ))}
              
              {/* Spring at the bottom */}
              <div style={{ width: '100%', height: '15px', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                <svg width="60" height="15" viewBox="0 0 60 15">
                  <path d="M 0,2 L 10,12 L 20,2 L 30,12 L 40,2 L 50,12 L 60,2" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

          </div>

          {/* Controls & Feedback */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>Torch Switch</h4>
              <button
                onClick={() => setSwitchOn(!switchOn)}
                style={{
                  width: '80px', height: '40px', borderRadius: '20px',
                  background: switchOn ? 'var(--success)' : '#64748b',
                  border: 'none', position: 'relative', cursor: 'pointer',
                  transition: 'background 0.3s'
                }}
              >
                <motion.div
                  animate={{ x: switchOn ? 40 : 0 }}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'white', position: 'absolute', top: '3px', left: '3px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <Power size={18} color={switchOn ? 'var(--success)' : '#64748b'} />
                </motion.div>
              </button>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: switchOn ? 'var(--success)' : 'var(--text-muted)' }}>
                {switchOn ? 'ON' : 'OFF'}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={message}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '1rem', borderRadius: '8px',
                  background: circuitComplete ? 'var(--success-bg)' : (switchOn ? 'var(--warning-bg)' : 'var(--surface)'),
                  border: `1px solid ${circuitComplete ? 'var(--success-border)' : (switchOn ? 'var(--warning-border)' : 'var(--border)')}`,
                  fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center',
                  color: circuitComplete ? 'var(--success)' : (switchOn ? 'var(--warning)' : 'var(--text-secondary)')
                }}
              >
                {message}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {!circuitComplete && switchOn && activeSlots.some(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '1rem', borderRadius: '8px', background: 'var(--neutral-bg)', border: '1px dashed var(--border)', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.4rem' }}>
                      <Info size={16} /> Why doesn't it glow?
                    </div>
                    {insightText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {sandboxMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 'auto' }}>
                <button 
                  onClick={onComplete}
                  className="primary"
                  style={{ width: '100%', padding: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  Proceed to Quiz <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

          </div>

        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? <DraggableCell id={activeId} reversed={cells.find(c => c.id === activeId)?.reversed} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Educational Tip */}
      <div style={{ marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={18} /> Series vs. Parallel Connections
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          In a standard torch, cells are stacked end-to-end where the positive (+) terminal of one cell touches the negative (−) terminal of the next. This is called a <strong>Series Connection</strong>. A series connection adds the voltage of each cell together, providing enough power to make the bulb glow brightly!<br/><br/>
          <em>What if we connected them side-by-side (all positives together and all negatives together)?</em> That is called a <strong>Parallel Connection</strong>. In parallel, the voltage stays the same as a single cell (so the bulb wouldn't get brighter), but the battery would last much longer before running out of energy.
        </p>
      </div>

    </div>
  );
}
