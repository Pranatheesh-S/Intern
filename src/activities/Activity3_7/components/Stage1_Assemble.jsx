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
import { ArrowRight, Info, AlertTriangle, RotateCcw } from 'lucide-react';
import { DoubleBatteryHolderSVG, BatteryBareSVG } from '../../ElectricSwitch/CircuitElements';

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
      {/* Visual representation matching BatteryBareSVG but rotatable */}
      <div style={{
        width: '90px', height: '40px',
        transform: reversed ? 'rotate(180deg)' : 'none',
        transition: 'transform 0.3s',
        position: 'relative'
      }}>
        <svg width="90" height="40" viewBox="0 0 90 40" style={{ pointerEvents: 'none' }}>
          <BatteryBareSVG />
        </svg>
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
        width: '100px',
        height: '50px',
        border: `2px dashed ${isOver ? 'var(--accent)' : 'var(--border)'}`,
        background: isOver ? 'var(--accent-bg)' : 'transparent',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        position: 'absolute',
        top: '5px'
      }}
    >
      {children}
    </div>
  );
}

export default function Stage1_Assemble({ onComplete }) {
  const [cells, setCells] = useState(() => [
    { id: 'cell_1', reversed: Math.random() > 0.5, slot: null },
    { id: 'cell_2', reversed: Math.random() > 0.5, slot: null },
  ]);
  const [activeId, setActiveId] = useState(null);

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
      setCells(prev => prev.map(c => c.id === active.id ? { ...c, slot: null } : c));
      return;
    }

    if (over.id.toString().startsWith('slot_')) {
      const slotIndex = parseInt(over.id.split('_')[1]);
      
      const existingCell = cells.find(c => c.slot === slotIndex);
      if (existingCell && existingCell.id !== active.id) {
        setCells(prev => prev.map(c => {
          if (c.id === active.id) return { ...c, slot: slotIndex };
          if (c.id === existingCell.id) return { ...c, slot: cells.find(x => x.id === active.id).slot };
          return c;
        }));
      } else {
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
    ]);
  };

  // Determine readiness
  const slot0 = cells.find(c => c.slot === 0);
  const slot1 = cells.find(c => c.slot === 1);
  const isFull = slot0 && slot1;
  const isCorrect = isFull && !slot0.reversed && !slot1.reversed;
  
  let feedbackMessage = "";
  if (isFull) {
    if (isCorrect) {
      feedbackMessage = "Battery is ready to use! The positive and negative terminals are correctly arranged.";
    } else {
      feedbackMessage = "The cells are in the holder, but one or both are placed backwards. The negative (-) flat end must face left towards the spring! Double-click a cell to flip it.";
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '800px' }}>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>
            Build the Battery
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Take two electric cells and drag them into the cell holder. Take care that for each cell, its <b>negative terminal (flat side)</b> is towards the spring side (left).
          </p>
        </div>
        <button onClick={handleReset} className="outline" style={{ padding: '0.5rem', borderRadius: '50%' }} title="Reset Activity">
          <RotateCcw size={18} />
        </button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ 
          background: 'var(--bg-color)', 
          borderRadius: '12px', 
          padding: '2rem', 
          border: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '3rem',
          alignItems: 'flex-start'
        }}>
          
          {/* Inventory Sidebar */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h4 style={{ margin: 0, borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', width: '100%', textAlign: 'center' }}>Available Cells</h4>
            
            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'var(--accent-bg)', padding: '0.5rem', borderRadius: '4px', textAlign: 'center', width: '100%' }}>
              💡 Double-click any cell to flip its (+/−) terminals
            </div>

            <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              {cells.filter(c => c.slot === null).map(cell => (
                <div key={cell.id} onDoubleClick={() => toggleReverse(cell.id)} title="Double click to flip">
                  <DraggableCell id={cell.id} reversed={cell.reversed} />
                </div>
              ))}
              {cells.filter(c => c.slot === null).length === 0 && (
                <div style={{ color: 'var(--text-faint)', fontStyle: 'italic', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>
                  All cells are in the holder.
                </div>
              )}
            </div>
          </div>

          {/* Holder Area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            
            <div style={{ position: 'relative', width: '300px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              
              {/* Holder Background */}
              <div style={{ position: 'absolute', pointerEvents: 'none', top: 20 }}>
                <svg width="250" height="60" viewBox="-20 -10 250 60">
                  <DoubleBatteryHolderSVG cellsCount={0} />
                </svg>
              </div>

              {/* Slots Overlay */}
              <div style={{ position: 'absolute', top: 20, left: 30, width: '250px', height: '60px' }}>
                <div style={{ position: 'absolute', left: '-5px' }}>
                  <DroppableSlot id="slot_0">
                    {slot0 && (
                      <div onDoubleClick={() => toggleReverse(slot0.id)} title="Double click to flip">
                        <DraggableCell id={slot0.id} reversed={slot0.reversed} />
                      </div>
                    )}
                  </DroppableSlot>
                </div>
                
                <div style={{ position: 'absolute', left: '105px' }}>
                  <DroppableSlot id="slot_1">
                    {slot1 && (
                      <div onDoubleClick={() => toggleReverse(slot1.id)} title="Double click to flip">
                        <DraggableCell id={slot1.id} reversed={slot1.reversed} />
                      </div>
                    )}
                  </DroppableSlot>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isFull && (
                <motion.div 
                  key={isCorrect ? 'correct' : 'incorrect'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ 
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'var(--warning-bg)', 
                    border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--warning-border)'}`, 
                    padding: '1rem 2rem', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '400px'
                  }}
                >
                  {isCorrect ? (
                    <Info size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  ) : (
                    <AlertTriangle size={24} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                  )}
                  <div>
                    <p style={{ margin: 0, color: isCorrect ? 'var(--success)' : 'var(--warning)', fontWeight: 'bold' }}>
                      {isCorrect ? 'Correct!' : 'Incorrect Arrangement'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                      {feedbackMessage}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              className="primary" 
              onClick={onComplete}
              disabled={!isCorrect}
              style={{ 
                padding: '0.75rem 2rem', 
                fontSize: '1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                opacity: isCorrect ? 1 : 0.5,
                marginTop: '1rem'
              }}
            >
              Proceed to Experiment <ArrowRight size={18} />
            </button>

          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <DraggableCell id={activeId} reversed={cells.find(c => c.id === activeId)?.reversed} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
