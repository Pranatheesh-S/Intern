import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CompletionCard({ onContinue }) {
  const checklist = [
    "Snow in the Himalayas melts into rivers",
    "These rivers support villages, farms, and cities",
    "Therefore, they are the Water Tower of Asia",
    "The Indian Plate collided with the Eurasian Plate",
    "The collision folded the earth into mountains",
    "The Himalayas are still growing today"
  ];

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '24px',
      padding: '3rem',
      maxWidth: '600px',
      width: '90%',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
          What Did You Discover?
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          You have uncovered the secrets of the Himalayas.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
          {checklist.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <CheckCircle size={24} color="#10b981" />
              <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent) 0%, #4f46e5 100%)',
            color: '#fff',
            border: 'none',
            padding: '1.25rem',
            borderRadius: '16px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
          }}
        >
          Complete Expedition <ArrowRight size={24} />
        </motion.button>
      </div>
    </div>
  );
}
