import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ArrowRight,
  Brain
} from 'lucide-react';

export default function PredictionPanel({ onComplete }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const [answered, setAnswered] = useState(false);

  const QUESTION = {
    text: "Before interacting: What do you think will happen if you move away from the inner side of the spoon?",
    options: [
      { key: 'A', text: "Image becomes larger" },
      { key: 'B', text: "Image becomes inverted" },
      { key: 'C', text: "Image disappears" },
      { key: 'D', text: "No change" }
    ],
    correct: 'B', // Though this is a prediction, we can highlight the actual behavior.
  };

  const handleOptionSelect = (key) => {
    if (answered) return;
    setSelectedKey(key);
  };

  const handleAnswerSubmit = () => {
    if (selectedKey === null || answered) return;
    setAnswered(true);
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Brain style={{ color: '#6366f1' }} size={20} />
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Prediction Check</h3>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="prediction"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          <h4 style={{ fontSize: '1rem', color: '#f8fafc', lineHeight: '1.5', marginBottom: '1.25rem' }}>
            {QUESTION.text}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
            {QUESTION.options.map((opt) => {
              const isSelected = selectedKey === opt.key;
              
              let buttonStyle = {
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '1rem',
                fontSize: '0.875rem'
              };

              if (answered) {
                if (isSelected) {
                  buttonStyle.background = 'rgba(99, 102, 241, 0.1)';
                  buttonStyle.borderColor = '#6366f1';
                  buttonStyle.color = '#818cf8';
                } else {
                  buttonStyle.opacity = 0.5;
                }
              } else if (isSelected) {
                buttonStyle.borderColor = '#6366f1';
                buttonStyle.background = 'rgba(99, 102, 241, 0.1)';
              }

              return (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(opt.key)}
                  disabled={answered}
                  className="outline"
                  style={buttonStyle}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <span style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '6px', 
                      background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.04)',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      flexShrink: 0
                    }}>
                      {answered && isSelected ? <Check size={14} /> : opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
            <AnimatePresence>
              {answered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ 
                    background: 'rgba(30, 41, 59, 0.4)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem',
                    borderLeft: `4px solid #6366f1`
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#818cf8' }}>
                    PREDICTION SAVED
                  </span>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    Great! Now let's test your prediction in the Virtual Experiment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {!answered ? (
                <button 
                  onClick={handleAnswerSubmit} 
                  className="primary"
                  disabled={selectedKey === null}
                >
                  Submit Prediction
                </button>
              ) : (
                <button onClick={onComplete} className="success" style={{ gap: '0.25rem' }}>
                  Test Your Prediction <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
