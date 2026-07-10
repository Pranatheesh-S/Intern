import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function Activity4_1({ onBackToDashboard }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Chapters
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} />
              Activity 4.1
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — Let Us Explore: Magnetic and Non-magnetic Materials</span>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <iframe 
          src="/Activity4_1/index.html" 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Activity 4.1"
        />
      </div>
    </div>
  );
}
