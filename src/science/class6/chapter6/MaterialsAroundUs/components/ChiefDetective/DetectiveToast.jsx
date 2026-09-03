import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';

export default function DetectiveToast({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // auto disappear after 5s
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="detective-toast"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--lesson-surface)',
            border: '2px solid var(--lesson-accent)',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            zIndex: 1000,
            maxWidth: '350px'
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--lesson-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Radio size={20} style={{ color: 'var(--lesson-accent)' }} />
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--lesson-accent)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              📡 Incoming Message
            </strong>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--lesson-primary)' }}>
              Chief Detective Blake
            </strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--lesson-secondary)', lineHeight: '1.4' }}>
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
