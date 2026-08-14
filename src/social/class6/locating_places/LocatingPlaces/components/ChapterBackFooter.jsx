import React from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

const NEXT_VARIANTS = {
  navy: {
    background: '#0E3556',
    hoverBackground: '#124070',
    color: '#fff',
    boxShadow: '0 10px 24px rgba(14,53,86,.25)'
  },
  green: {
    background: '#16a34a',
    hoverBackground: '#15803d',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)'
  },
  blue: {
    background: '#3b82f6',
    hoverBackground: '#2563eb',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  }
};

export default function ChapterBackFooter({
  onBack,
  nextLabel,
  onNext,
  nextDisabled = false,
  nextVariant = 'green',
  centerContent = null
}) {
  if (!onBack && !nextLabel) return null;

  const nextStyle = NEXT_VARIANTS[nextVariant] || NEXT_VARIANTS.green;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 2rem',
      borderTop: '1px solid #d6e0ec',
      background: '#ffffff',
      flexShrink: 0,
      gap: '12px'
    }}>
      <div style={{ flex: '0 0 auto' }}>
        {onBack ? (
          <button
            onClick={onBack}
            style={{
              fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: '#0E3556',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '999px',
              fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)',
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'center',
              transition: 'all .2s',
              boxShadow: '0 10px 24px rgba(14,53,86,.25)'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#124070'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#0E3556'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back
          </button>
        ) : (
          <div style={{ width: '1px' }} />
        )}
      </div>

      {centerContent && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {centerContent}
        </div>
      )}

      <div style={{ flex: '0 0 auto', marginLeft: centerContent ? 0 : 'auto' }}>
        {nextLabel && onNext ? (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            style={{
              fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              border: 'none',
              cursor: nextDisabled ? 'not-allowed' : 'pointer',
              background: nextDisabled ? '#c3cfdd' : nextStyle.background,
              color: nextStyle.color,
              padding: '12px 24px',
              borderRadius: '999px',
              fontSize: 'clamp(14px, 0.6vw + 0.82vh, 19px)',
              display: 'inline-flex',
              gap: '8px',
              alignItems: 'center',
              transition: 'all .2s',
              boxShadow: nextDisabled ? 'none' : nextStyle.boxShadow,
              opacity: nextDisabled ? 0.85 : 1
            }}
            onMouseOver={e => {
              if (!nextDisabled) {
                e.currentTarget.style.background = nextStyle.hoverBackground;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={e => {
              if (!nextDisabled) {
                e.currentTarget.style.background = nextStyle.background;
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {nextLabel}
            {!nextDisabled && (nextVariant === 'navy' ? <ChevronRight size={16} strokeWidth={2.5} /> : <ArrowRight size={16} strokeWidth={2.5} />)}
          </button>
        ) : (
          <div style={{ width: '1px' }} />
        )}
      </div>
    </div>
  );
}
