import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Columns, Grid, LayoutGrid, Check } from 'lucide-react';

export default function Stage3_Classification({ onComplete, addXp }) {
  const [sortingMode, setSortingMode] = useState('shape'); // 'shape' or 'color'
  const [shapePlacements, setShapePlacements] = useState({});
  const [realPlacements, setRealPlacements] = useState({});

  // 3D Geometric Shapes
  const shapesData = [
    { id: 'cone1', name: 'Cone', shape: 'Cone', color: 'Pink', bg: '#ec4899' },
    { id: 'cone2', name: 'Cone', shape: 'Cone', color: 'Yellow', bg: '#eab308' },
    { id: 'pyramid1', name: 'Pyramid', shape: 'Pyramid', color: 'Orange', bg: '#f97316' },
    { id: 'pyramid2', name: 'Pyramid', shape: 'Pyramid', color: 'Purple', bg: '#a855f7' },
    { id: 'cube1', name: 'Cube', shape: 'Cube', color: 'Blue', bg: '#3b82f6' },
    { id: 'cube2', name: 'Cube', shape: 'Cube', color: 'Purple', bg: '#a855f7' },
    { id: 'cylinder1', name: 'Cylinder', shape: 'Cylinder', color: 'Green', bg: '#22c55e' },
    { id: 'cylinder2', name: 'Cylinder', shape: 'Cylinder', color: 'Blue', bg: '#3b82f6' }
  ];

  // Real world items to classify
  const realItems = [
    { id: 'spoon', name: 'Steel Spoon', category: 'Kitchen Shelf', color: '#94a3b8' },
    { id: 'pepper', name: 'Black Pepper Jar', category: 'Grocer Stand', color: '#78350f' },
    { id: 'aspirin', name: 'Aspirin Tablets', category: 'Chemist Rack', color: '#f87171' },
    { id: 'plate', name: 'Ceramic Plate', category: 'Kitchen Shelf', color: '#cbd5e1' },
    { id: 'pulses', name: 'Moong Dal Pack', category: 'Grocer Stand', color: '#fbbf24' },
    { id: 'cough', name: 'Cough Syrup', category: 'Chemist Rack', color: '#f43f5e' }
  ];

  const handleShapeSort = (shapeId, basketName) => {
    const item = shapesData.find(s => s.id === shapeId);
    let isCorrect = false;

    if (sortingMode === 'shape') {
      isCorrect = item.shape === basketName;
    } else {
      isCorrect = item.color === basketName;
    }

    if (isCorrect) {
      setShapePlacements(prev => ({ ...prev, [shapeId]: basketName }));
      addXp(5);
    }
  };

  const handleRealSort = (itemId, targetCategory) => {
    const item = realItems.find(i => i.id === itemId);
    if (item.category === targetCategory) {
      setRealPlacements(prev => ({ ...prev, [itemId]: targetCategory }));
      addXp(5);
    }
  };

  // Categories based on mode
  const shapeBaskets = sortingMode === 'shape' 
    ? ['Cone', 'Pyramid', 'Cube', 'Cylinder']
    : ['Pink', 'Orange', 'Blue', 'Purple', 'Yellow', 'Green'];

  const allShapesSorted = Object.keys(shapePlacements).length === shapesData.length;
  const allRealSorted = Object.keys(realPlacements).length === realItems.length;

  const handleResetShapes = (mode) => {
    setSortingMode(mode);
    setShapePlacements({});
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Intro */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--accent-border)' }}>
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={22} style={{ color: 'var(--accent)' }} /> Activity 6.2: Grouping & Classification
        </h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Arranging things into groups is called <strong>classification</strong>. We classify objects based on shared characteristics like shape, color, or use. Classification helps us find items easily.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Sorting 3D Geometric Blocks */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>1. Shape Sorting Challenge</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                onClick={() => handleResetShapes('shape')} 
                className={sortingMode === 'shape' ? 'outline active' : 'outline'}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Sort by Shape
              </button>
              <button 
                onClick={() => handleResetShapes('color')} 
                className={sortingMode === 'color' ? 'outline active' : 'outline'}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                Sort by Color
              </button>
            </div>
          </div>

          {/* Shapes Tray */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', minHeight: '60px', padding: '0.5rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            {shapesData.map((shape) => {
              const isSorted = shapePlacements[shape.id] !== undefined;
              if (isSorted) return null;
              return (
                <div
                  key={shape.id}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: shape.bg,
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <span>{shape.shape}</span>
                  <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>{shape.color}</span>
                  
                  {/* Quick Select dropdown for touch convenience */}
                  <select
                    value=""
                    onChange={(e) => handleShapeSort(shape.id, e.target.value)}
                    style={{ marginTop: '0.25rem', fontSize: '0.65rem', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', outline: 'none' }}
                  >
                    <option value="" disabled style={{ color: '#000' }}>Drop in...</option>
                    {shapeBaskets.map(b => (
                      <option key={b} value={b} style={{ color: '#000' }}>{b}</option>
                    ))}
                  </select>
                </div>
              );
            })}
            {allShapesSorted && (
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Check size={16} /> All shapes classified!
              </div>
            )}
          </div>

          {/* Sorting Baskets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
            {shapeBaskets.map((basket) => {
              const itemsInBasket = shapesData.filter(s => shapePlacements[s.id] === basket);
              return (
                <div
                  key={basket}
                  style={{
                    background: 'var(--surface)',
                    border: '1px dashed var(--border)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    minHeight: '100px'
                  }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--text-heading)' }}>Basket: {basket}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {itemsInBasket.map((item) => (
                      <div key={item.id} style={{ padding: '0.2rem 0.5rem', background: item.bg, color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        {item.shape} ({item.color})
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real World Layout sorting */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>2. Everyday Classification</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            In homes and shops, things are arranged systematically: similar utensils go together, chemist groups drugs, and grocer keeps pulses in one corner. Classify the items below:
          </p>

          {/* Items Tray */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '60px', padding: '0.5rem', background: 'var(--surface)', borderRadius: '8px' }}>
            {realItems.map((item) => {
              const isSorted = realPlacements[item.id] !== undefined;
              if (isSorted) return null;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  <span>{item.name}</span>
                  <select
                    value=""
                    onChange={(e) => handleRealSort(item.id, e.target.value)}
                    style={{ fontSize: '0.65rem', border: '1px solid var(--border)', borderRadius: '4px', background: 'transparent', outline: 'none' }}
                  >
                    <option value="" disabled>Store in...</option>
                    <option value="Kitchen Shelf">Kitchen Shelf</option>
                    <option value="Grocer Stand">Grocer Stand</option>
                    <option value="Chemist Rack">Chemist Rack</option>
                  </select>
                </div>
              );
            })}
            {allRealSorted && (
              <div style={{ width: '100%', textAlign: 'center', color: 'var(--success)', fontWeight: 'bold', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Check size={16} /> All goods stacked correctly!
              </div>
            )}
          </div>

          {/* Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Kitchen Shelf', 'Grocer Stand', 'Chemist Rack'].map((cat) => {
              const items = realItems.filter(i => realPlacements[i.id] === cat);
              return (
                <div
                  key={cat}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{cat}</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {items.map(item => (
                      <span key={item.id} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-bg)', color: 'var(--accent-text)', border: '1px solid var(--accent-border)', borderRadius: '4px' }}>
                        {item.name}
                      </span>
                    ))}
                    {items.length === 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Empty shelf</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Progression */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          disabled={!allShapesSorted || !allRealSorted}
          onClick={onComplete}
          className="primary"
          style={{ padding: '0.75rem 2rem' }}
        >
          Proceed to Lustre & Hardness
        </button>
      </div>
    </div>
  );
}
