import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, ChevronRight } from 'lucide-react';
import DetectiveNotebook from './DetectiveNotebook';
import './animations.css';

export default function RewardCard({ debrief, onContinue }) {
  return (
    <div className="fade-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ borderBottom: '1px solid var(--lesson-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#A64B27', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={20} /> 
          EVIDENCE REVIEW
        </h2>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--lesson-primary)' }}>{debrief.title}</h3>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ fontSize: '1.05rem', color: 'var(--lesson-secondary)', lineHeight: '1.6', margin: 0 }}>
          {debrief.dialogue}
        </p>

        {debrief.observations && debrief.observations.length > 0 && (
          <DetectiveNotebook observations={debrief.observations} />
        )}

        <div style={{ background: 'var(--lesson-success-bg)', border: '1px solid var(--lesson-success-border)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <strong style={{ fontSize: '0.85rem', color: '#A64B27', textTransform: 'uppercase' }}>Evidence Submitted</strong>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1rem', color: 'var(--lesson-text)' }}>{debrief.rewardReason}</span>
            <CheckCircle size={24} style={{ color: '#A64B27' }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <button 
          onClick={onContinue}
          className="primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          {debrief.isFinal ? 'Close Case File' : 'Next Assignment'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
