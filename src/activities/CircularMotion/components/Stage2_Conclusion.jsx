import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Stage2_Conclusion() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Conclusion: Circular Motion</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Let's reflect on what you just observed when you whirled the eraser on the thread.
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
        gap: '1.5rem'
      }}>
        <h4 style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center', color: 'var(--text-heading)' }}>
          Is the motion of the eraser the same as that of a merry-go-round?
        </h4>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={selectedAnswer === 'yes' ? 'primary' : 'outline'}
            onClick={() => setSelectedAnswer('yes')}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1.1rem',
              background: selectedAnswer === 'yes' ? 'var(--success)' : '',
              borderColor: selectedAnswer === 'yes' ? 'var(--success-border)' : ''
            }}
          >
            Yes
          </button>
          <button 
            className={selectedAnswer === 'no' ? 'primary' : 'outline'}
            onClick={() => setSelectedAnswer('no')}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1.1rem',
              background: selectedAnswer === 'no' ? '#ef4444' : '',
              borderColor: selectedAnswer === 'no' ? '#fca5a5' : ''
            }}
          >
            No
          </button>
        </div>

        {selectedAnswer === 'yes' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid var(--success-border)',
              padding: '1rem',
              borderRadius: '8px',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <CheckCircle size={20} />
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
              <strong>Correct!</strong> Just like the eraser moving around your hand, the horses (or seats) on a merry-go-round move in a circular path around the center pole.
            </p>
          </motion.div>
        )}

        {selectedAnswer === 'no' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #fca5a5',
              padding: '1rem',
              borderRadius: '8px',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <XCircle size={20} />
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
              <strong>Not quite.</strong> Think about how the eraser moves around your hand at a fixed distance. The seats on a merry-go-round also move around the center pole at a fixed distance. Try again!
            </p>
          </motion.div>
        )}
      </div>
      
      {selectedAnswer === 'yes' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{
            background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
            padding: '1.5rem',
            textAlign: 'center'
          }}
        >
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-text)', fontSize: '1.2rem' }}>
            What is Circular Motion?
          </h4>
          <p style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            When an object moves along a circular path, its motion is called <strong>circular motion</strong>.
          </p>
        </motion.div>
      )}

    </div>
  );
}
