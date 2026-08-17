import React from 'react';

/** Large chapter visual with badge and caption — Materials master image treatment. */
export default function EduChapterVisual({
  src,
  alt,
  badge,
  caption,
  fallbackSrc = null,
  className = ''
}) {
  return (
    <div className={`edu-chapter-visual illustration ${className}`.trim()}>
      {src && (
        <img
          src={src}
          alt={alt}
          onError={(e) => {
            if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
        />
      )}
      {badge && <div className="edu-chapter-visual__badge badge">{badge}</div>}
      {caption && <div className="edu-chapter-visual__caption illu-caption">{caption}</div>}
    </div>
  );
}
