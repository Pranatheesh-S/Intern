import React from 'react';

/** Spread-style quote card — Sanskrit + translation or single quote block. */
export default function EduQuoteCard({
  primaryText,
  secondaryText = null,
  translation,
  citation = null,
  citationSecondary = null,
  className = ''
}) {
  return (
    <div className={`edu-quote-card--spread quote-card ${className}`.trim()}>
      <span className="quote-mark" aria-hidden="true">&ldquo;</span>
      {primaryText && <div className="quote-sanskrit">{primaryText}</div>}
      {citationSecondary && <div className="quote-citation-sm">{citationSecondary}</div>}
      {secondaryText && !translation && (
        <div className="quote-translation">{secondaryText}</div>
      )}
      {translation && (
        <div className="quote-translation">
          {translation}
          <span className="quote-mark-end" aria-hidden="true">&rdquo;</span>
        </div>
      )}
      {citation && <div className="quote-citation">{citation}</div>}
    </div>
  );
}
