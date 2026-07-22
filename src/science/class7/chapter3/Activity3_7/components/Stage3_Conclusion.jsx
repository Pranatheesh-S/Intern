import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function Stage3_Conclusion() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-color)',
        borderRadius: '12px',
        padding: '3rem 2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '40px', 
        background: 'rgba(16, 185, 129, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '-1rem'
      }}>
        <CheckCircle size={40} style={{ color: 'var(--success)' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.75rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>
          Experiment Complete!
        </h3>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
          You have successfully built a double-cell battery and tested an LED.
        </p>
      </div>

      <div style={{
        background: 'var(--canvas-bg)',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        border: '1px solid var(--border)'
      }}>
        <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ color: 'var(--accent)' }} /> 
          What did we learn?
        </h4>
        
        <ul style={{ margin: 0, padding: '0 0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Batteries vs Cells:</strong> A battery is simply a combination of two or more cells. They are connected end-to-end (positive to negative) to provide more power.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>LEDs are Directional:</strong> Unlike a regular incandescent lamp, an LED (Light Emitting Diode) only allows electric current to pass through it in <b>one direction</b>.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Correct Wiring:</strong> To make an LED glow, the longer wire (positive) must be connected to the positive terminal of the battery, and the shorter wire (negative) to the negative terminal.
          </li>
        </ul>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '1rem' }}>
        You can now return to the dashboard and explore other activities.
      </p>

    </motion.div>
  );
}
