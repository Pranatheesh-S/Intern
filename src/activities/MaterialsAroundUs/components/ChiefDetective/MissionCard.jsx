import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Shield, ChevronRight } from 'lucide-react';
import './animations.css';

export default function MissionCard({ mission, onAccept }) {
  const renderStars = (diff) => {
    return Array(3).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < diff ? '#fbbf24' : '#475569' }}>★</span>
    ));
  };

  return (
    <div className="fade-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={20} style={{ color: 'var(--accent)' }} /> 
          MISSION BRIEFING
        </h2>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-text)' }}>{mission.title}</h3>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
          {mission.dialogue}
        </p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Target size={18} style={{ color: 'var(--danger)', marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Objective</strong>
              <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{mission.objective}</span>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)' }}>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Difficulty</strong>
              <div style={{ fontSize: '1.1rem', letterSpacing: '2px' }}>{renderStars(mission.difficulty)}</div>
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Est. Time</strong>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {mission.estimatedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          onClick={onAccept}
          className="primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
        >
          Open Secret Book <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
