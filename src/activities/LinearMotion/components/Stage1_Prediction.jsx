import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Circle, Pencil, Box, ArrowRight, HelpCircle } from 'lucide-react';

export default function Stage1_Prediction({ onComplete, savedPredictions }) {
  const [predictions, setPredictions] = useState(savedPredictions || {
    car: null,
    marble: null,
    pencil: null,
    box: null
  });

  const handlePredict = (item, value) => {
    setPredictions(prev => ({ ...prev, [item]: value }));
  };

  const isComplete = Object.values(predictions).every(val => val !== null);

  const handleNext = () => {
    if (isComplete) {
      onComplete(predictions);
    }
  };

  const objects = [
    { id: 'car', name: 'Toy Car', icon: Car, color: '#3b82f6', action: 'pushed/rolled' },
    { id: 'marble', name: 'Marble', icon: Circle, color: '#10b981', action: 'rolled' },
    { id: 'pencil', name: 'Pencil', icon: Pencil, color: '#f59e0b', action: 'rolled' },
    { id: 'box', name: 'Small Box', icon: Box, color: '#ec4899', action: 'pushed' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <HelpCircle size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Make Your Predictions</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Predict which of these objects can move in a <strong>straight line</strong> when pushed or rolled.
          Select <strong>Yes</strong> if you think it can move in a straight line, and <strong>No</strong> if you think it cannot.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        {objects.map(obj => {
          const Icon = obj.icon;
          const isYes = predictions[obj.id] === true;
          const isNo = predictions[obj.id] === false;

          return (
            <motion.div
              key={obj.id}
              whileHover={{ y: -4 }}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                border: `1px solid ${isYes || isNo ? obj.color : 'var(--border)'}`,
                boxShadow: isYes || isNo ? `0 4px 12px ${obj.color}20` : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: `${obj.color}15`,
                color: obj.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={32} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', color: 'var(--text-heading)' }}>{obj.name}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>When {obj.action}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handlePredict(obj.id, true)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: isYes ? obj.color : 'transparent',
                    color: isYes ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${isYes ? obj.color : 'var(--border)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: isYes ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => handlePredict(obj.id, false)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: isNo ? '#ef4444' : 'transparent',
                    color: isNo ? 'white' : 'var(--text-secondary)',
                    border: `1px solid ${isNo ? '#ef4444' : 'var(--border)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: isNo ? 'bold' : 'normal',
                    transition: 'all 0.2s'
                  }}
                >
                  No
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={handleNext}
          disabled={!isComplete}
          className="primary"
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: isComplete ? 1 : 0.5,
            cursor: isComplete ? 'pointer' : 'not-allowed'
          }}
        >
          Confirm Predictions and Start Experiment <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
