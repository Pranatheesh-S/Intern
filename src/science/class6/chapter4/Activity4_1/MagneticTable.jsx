import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';

const ITEMS = [
  { id: 'pencil', name: 'Pencil', material: 'Wood', isMagnetic: false, icon: '✏️' },
  { id: 'eraser', name: 'Eraser', material: 'Rubber', isMagnetic: false, icon: '🧽' },
  { id: 'nail', name: 'Iron nail', material: 'Iron', isMagnetic: true, icon: '🔩' },
  { id: 'clip', name: 'Steel clip', material: 'Steel', isMagnetic: true, icon: '📎' },
  { id: 'glass', name: 'Glass tumbler', material: 'Glass', isMagnetic: false, icon: '🥤' },
  { id: 'key', name: 'Iron key', material: 'Iron', isMagnetic: true, icon: '🔑' },
  { id: 'ruler', name: 'Plastic ruler', material: 'Plastic', isMagnetic: false, icon: '📏' },
  { id: 'scissors', name: 'Steel scissors', material: 'Steel', isMagnetic: true, icon: '✂️' }
];

function MagnetIcon() {
  return (
    <div style={{
      display: 'flex',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      width: '60px',
      height: '30px',
      fontWeight: 'bold',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ flex: 1, backgroundColor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</div>
      <div style={{ flex: 1, backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
    </div>
  );
}

function TableRow({ item, index, prediction, observation, onPredict, onTest }) {
  const isMatched = prediction !== null && observation !== null && 
    ((prediction === 'Yes' && item.isMagnetic) || (prediction === 'No' && !item.isMagnetic));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 2fr 2fr 2fr',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid var(--border)',
      backgroundColor: index % 2 === 0 ? 'var(--surface-hover)' : 'transparent',
      transition: 'background-color 0.2s',
      fontSize: '0.95rem'
    }}>
      {/* Object Column */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{item.name}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.material}</span>
        </div>
      </div>

      {/* Prediction Column */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => onPredict(item.id, 'Yes')}
          style={{
            padding: '0.25rem 1.5rem',
            borderRadius: '6px',
            border: prediction === 'Yes' ? '1px solid #10b981' : '1px solid var(--border)',
            backgroundColor: prediction === 'Yes' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
            color: prediction === 'Yes' ? '#10b981' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          Yes
        </button>
        <button 
          onClick={() => onPredict(item.id, 'No')}
          style={{
            padding: '0.25rem 1.5rem',
            borderRadius: '6px',
            border: prediction === 'No' ? '1px solid #3b82f6' : '1px solid var(--border)',
            backgroundColor: prediction === 'No' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: prediction === 'No' ? '#3b82f6' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          No
        </button>
      </div>

      {/* Observation Column */}
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {observation ? (
          item.isMagnetic ? (
            <span style={{ color: '#10b981' }}>Attracted ✓</span>
          ) : (
            <span style={{ color: '#ef4444' }}>No pull X</span>
          )
        ) : (
          <button 
            onClick={() => onTest(item.id)}
            disabled={!prediction}
            style={{
              padding: '0.25rem 1rem',
              borderRadius: '6px',
              border: prediction ? '1px solid var(--accent)' : '1px solid var(--border)',
              backgroundColor: prediction ? 'rgba(139, 92, 246, 0.2)' : 'var(--surface-hover)',
              color: prediction ? 'var(--accent)' : 'var(--text-muted)',
              cursor: prediction ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              transition: 'all 0.2s'
            }}
          >
            {prediction ? 'Test Object' : 'Make Prediction'}
          </button>
        )}
      </div>

      {/* Match Column */}
      <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {observation && prediction ? (
          isMatched ? (
            <span style={{ color: '#10b981' }}>✓ matched</span>
          ) : (
            <span style={{ color: '#ef4444' }}>X wrong prediction</span>
          )
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>-</span>
        )}
      </div>
    </div>
  );
}

export default function MagneticTable({ onComplete, addXp = () => {} }) {
  const [predictions, setPredictions] = useState({});
  const [observations, setObservations] = useState({});

  const handlePredict = (id, choice) => {
    if (observations[id]) return;
    setPredictions(prev => ({ ...prev, [id]: choice }));
  };

  const handleTest = (id) => {
    if (predictions[id] && !observations[id]) {
      setObservations(prev => ({ ...prev, [id]: true }));
      addXp(10);
    }
  };

  const attractedCount = Object.keys(observations).filter(id => ITEMS.find(i => i.id === id).isMagnetic).length;
  const notAttractedCount = Object.keys(observations).filter(id => !ITEMS.find(i => i.id === id).isMagnetic).length;
  const testedCount = Object.keys(observations).length;
  
  const rightPredictionsCount = Object.keys(observations).filter(id => {
    const pred = predictions[id];
    const isMag = ITEMS.find(i => i.id === id).isMagnetic;
    return (pred === 'Yes' && isMag) || (pred === 'No' && !isMag);
  }).length;

  const isComplete = testedCount === ITEMS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div style={{ 
        backgroundColor: 'var(--surface)', 
        borderRadius: '12px', 
        border: '1px solid var(--border)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        color: 'var(--text-primary)',
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        {/* Activity Image */}
        <img src="/activity_4.1.png" alt="Activity items" style={{ width: '100%', height: 'auto', display: 'block', borderBottom: '1px solid var(--border)' }} />

        {/* Item List */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-heading)', fontSize: '1.25rem' }}>Items in the Picture:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              "Pens (Plastic)",
              "Water Bottle (Stainless Steel)",
              "Compass (Metal)",
              "Experiment: Test which items are magnetic!",
              "Ruler (Plastic)",
              "Eraser (Rubber)",
              "Paper Clips (Metal)",
              "Coins (Metal)",
              "Pencil Case (Fabric)",
              "Notebook (Paper)",
              "Pencil (Wood)"
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Action */}
        <div style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: 'var(--surface-hover)',
        }}>
          <button
            onClick={onComplete}
            className="primary"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--accent)',
              color: 'white'
            }}
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
