import React, { useState, useEffect } from 'react';
import { ArrowLeft, Compass, Search } from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, DragOverlay } from '@dnd-kit/core';
import MapGrid from './MapGrid';
import DiscoveryLog from './DiscoveryLog';

const INITIAL_ITEMS = [
  { id: 1, name: 'Iron Key', type: 'magnetic', x: -2, y: 1, discovered: false, icon: '🔑' },
  { id: 2, name: 'Wooden Log', type: 'non-magnetic', x: 1, y: 2, discovered: false, icon: '🪵' },
  { id: 3, name: 'Plastic Bottle', type: 'non-magnetic', x: 3, y: 1, discovered: false, icon: '🧴' },
  { id: 4, name: 'Steel Spoon', type: 'magnetic', x: -3, y: -2, discovered: false, icon: '🥄' },
  { id: 5, name: 'Nickel Coin', type: 'magnetic', x: 3, y: -2, discovered: false, icon: '🪙' },
  { id: 6, name: 'Rubber Eraser', type: 'non-magnetic', x: 0, y: 0, discovered: false, icon: '🧽' },
];

export default function Activity4_1({ onBackToDashboard, onComplete, onNext }) {
  const [characterPos, setCharacterPos] = useState({ x: -4, y: 3 });
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [feedback, setFeedback] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { over } = event;
    if (over) {
      const [xStr, yStr] = over.id.split(',');
      const x = parseInt(xStr);
      const y = parseInt(yStr);
      if (!isNaN(x) && !isNaN(y)) {
        setCharacterPos({ x, y });
        setFeedback(null);
      }
    }
  };

  useEffect(() => {
    // Check if character landed on an item
    const itemOnTile = items.find(i => i.x === characterPos.x && i.y === characterPos.y && !i.discovered);
    if (itemOnTile) {
      setFeedback(`You found a ${itemOnTile.name}! Testing with magnet... It is ${itemOnTile.type === 'magnetic' ? 'Magnetic! 🧲' : 'Non-Magnetic.'}`);
      setItems(prev => prev.map(i => i.id === itemOnTile.id ? { ...i, discovered: true } : i));
    }
  }, [characterPos, items]);

  const discoveredItems = items.filter(i => i.discovered);
  const isComplete = discoveredItems.length === items.length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Chapters
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} style={{ color: 'var(--accent)' }} />
              Activity 4.1: The Magnet Explorer
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — Find and test materials on the island</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', minHeight: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feedback ? (
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', background: 'var(--surface)', color: feedback.includes('Please') ? '#ef4444' : 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {feedback}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center', background: 'var(--surface)', color: 'var(--text-muted)' }}>
              Drag the character to explore the island and find materials!
            </div>
          )}

          <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <MapGrid characterPos={characterPos} items={items} activeDragId={activeDragId} />
            <DragOverlay>
              {activeDragId === 'character' ? (
                <div style={{
                  fontSize: '2.5rem',
                  filter: 'drop-shadow(4px 8px 12px rgba(0,0,0,0.5))',
                  cursor: 'grabbing'
                }}>
                  🧑‍🔬🧲
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DiscoveryLog discoveredItems={discoveredItems} totalItems={items.length} />
        </div>
      </div>

      {/* Completion Modal */}
      {isComplete && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="glass-panel" style={{
            background: 'var(--surface)',
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: 'var(--success)', margin: '0 0 1rem 0', fontSize: '2.5rem' }}>🎉</h2>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Exploration Complete!</h3>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
              You successfully tested all materials on the island. You are now ready to continue to the next part of Chapter 4.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexDirection: 'column' }}>
              {onComplete && (
                <button 
                  onClick={onComplete} 
                  className="primary" 
                  style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Continue to Next Content
                </button>
              )}
              <button 
                onClick={onBackToDashboard} 
                style={{ padding: '0.75rem', fontWeight: 'bold', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer' }}
              >
                Return to Chapter Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
