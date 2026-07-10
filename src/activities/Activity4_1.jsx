import React, { useEffect, useRef } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function Activity4_1({ onBackToDashboard }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'resize_iframe' && iframeRef.current) {
        // Add a small buffer to prevent nested scrollbars during transitions
        iframeRef.current.style.height = `${e.data.height + 20}px`;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
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
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', minHeight: '600px' }}>
        <iframe 
          ref={iframeRef}
          src="/Activity4_1/index.html" 
          style={{ width: '100%', height: '600px', border: 'none', transition: 'height 0.3s ease' }}
          title="Activity 4.1"
        />
      </div>
    </div>
  );
}
