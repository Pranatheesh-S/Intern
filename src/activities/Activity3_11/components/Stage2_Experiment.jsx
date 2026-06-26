import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info, AlertTriangle } from 'lucide-react';
import { DndContext, useDraggable, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import CircuitSandbox3_11 from './CircuitSandbox3_11';
import { TEST_MATERIALS } from './MaterialObjects';

function DraggableMaterial({ item, isSelected, isTested, onClick }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      style={{
        flex: '0 0 auto',
        width: '80px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        background: isSelected ? 'var(--surface-hover)' : 'var(--surface)',
        border: `2px solid ${isSelected ? 'var(--accent)' : isTested ? 'var(--success-border)' : 'var(--border)'}`,
        borderRadius: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        touchAction: 'none'
      }}
      title={item.name}
    >
      <span style={{ fontSize: '2rem' }}>{item.icon}</span>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.2' }}>
        {item.name}
      </span>
      {isTested && (
        <div style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          width: '16px',
          height: '16px',
          background: 'var(--success)',
          borderRadius: '50%',
          border: '2px solid var(--surface)'
        }} />
      )}
    </button>
  );
}

export default function Stage2_Experiment({ onComplete }) {
  const [testedItem, setTestedItem] = useState(null);
  const [results, setResults] = useState({}); // { itemId: boolean (glows) }
  const [activeDragItem, setActiveDragItem] = useState(null);

  const handleMaterialSelect = (item) => {
    setTestedItem(item);
    
    // Automatically record after a short delay so the user sees the result first
    if (results[item.id] === undefined) {
      setTimeout(() => {
        setResults(prev => ({
          ...prev,
          [item.id]: item.isConductor
        }));
      }, 1000);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const item = TEST_MATERIALS.find(m => m.id === active.id);
    setActiveDragItem(item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (over && over.id === 'circuit-gap') {
      const item = TEST_MATERIALS.find(m => m.id === active.id);
      if (item) {
        handleMaterialSelect(item);
      }
    }
  };

  const allTested = TEST_MATERIALS.every(item => results[item.id] !== undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>
          Testing Materials
        </h3>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Drag an object from the inventory below and drop it onto the free ends of the tester. Does the lamp glow?
        </p>
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
        
        {/* Sandbox */}
        <CircuitSandbox3_11 
          testedItem={testedItem} 
        />

        {/* Status Text */}
        <div style={{ minHeight: '24px', color: 'var(--text-primary)', fontWeight: 'bold', textAlign: 'center' }}>
          {testedItem ? (
            testedItem.isConductor ? (
              <span style={{ color: 'var(--warning)' }}>The lamp glows! {testedItem.name} is made of {testedItem.material}, which is a conductor and allows electric current to pass.</span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>The lamp does not glow. {testedItem.name} is made of {testedItem.material}, which is an insulator and blocks electric current.</span>
            )
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>Drag an object into the circuit gap to test it.</span>
          )}
        </div>

        {/* Inventory Tray */}
        <div style={{ width: '100%', background: 'var(--canvas-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-secondary)' }}>Materials Inventory</h4>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            overflowX: 'auto', 
            paddingBottom: '0.5rem',
            WebkitOverflowScrolling: 'touch'
          }}>
            {TEST_MATERIALS.map((item) => (
              <DraggableMaterial 
                key={item.id} 
                item={item} 
                isSelected={testedItem?.id === item.id}
                isTested={results[item.id] !== undefined}
                onClick={() => handleMaterialSelect(item)}
              />
            ))}
          </div>
        </div>

        {/* Progress and Continue */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Tested: <strong>{Object.keys(results).length}</strong> / {TEST_MATERIALS.length}
          </div>
          <button 
            className="primary" 
            onClick={() => onComplete(results)}
            disabled={!allTested}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: allTested ? 1 : 0.5 
            }}
          >
            Record Observations <ArrowRight size={18} />
          </button>
        </div>

        {!allTested && Object.keys(results).length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.85rem' }}>
            <AlertTriangle size={14} />
            <span>Test all materials to proceed to the Conclusion stage.</span>
          </div>
        )}

      </div>
    </div>
    
    <DragOverlay dropAnimation={{ duration: 150, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
      {activeDragItem ? (
        <div style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: 'var(--surface-hover)',
          border: '2px solid var(--accent)',
          borderRadius: '8px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          cursor: 'grabbing'
        }}>
          <span style={{ fontSize: '2rem' }}>{activeDragItem.icon}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '1.2' }}>
            {activeDragItem.name}
          </span>
        </div>
      ) : null}
    </DragOverlay>
    </DndContext>
  );
}
