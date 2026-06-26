import React from 'react';
import { ArrowRight, Battery, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Stage1_Setup({ onComplete }) {
  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', fontSize: '1.5rem' }}>Preparing the Equipment</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          Before we can connect the circuit, we need to prepare the cell and the lamp. 
          Make sure to remove about 1 cm of the plastic covering from both ends of each wire to expose the metal.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Cell Setup */}
        <div style={{ 
          background: 'var(--bg-color)', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <Battery size={48} style={{ color: '#ef4444' }} />
          <h4 style={{ margin: 0, color: 'var(--text-heading)' }}>The Electric Cell</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Attach two wires to the two ends of the cell holder. Insert the cell such that its negative terminal is towards the spring side. Alternatively, use electrical tape to fix the wires.
          </p>
        </div>

        {/* Lamp Setup */}
        <div style={{ 
          background: 'var(--bg-color)', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <Lightbulb size={48} style={{ color: '#eab308' }} />
          <h4 style={{ margin: 0, color: 'var(--text-heading)' }}>The Lamp</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Attach two wires to the screws of the lamp holder, or use tape to attach them to the two ends of the incandescent lamp.
          </p>
        </div>

      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}
      >
        <button 
          className="primary" 
          onClick={onComplete}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem'
          }}
        >
          Begin Experiment <ArrowRight size={16} />
        </button>
      </motion.div>

    </div>
  );
}
