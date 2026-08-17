import React from 'react';

/**
 * Fixed left-side template shared by chapter spread pages.
 */
export default function ChapterLeftPanel({
  eyebrow = 'Chapter 1 • Class 6 Social Science',
  title = 'Locating Places on the Earth',
  imageSrc,
  imageAlt = 'Earth from space',
  badge = 'Ancient Indian Astronomy',
  caption = 'Earth from space — a spherical globe in the cosmos',
  quote = 'The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. ... It is surrounded by all creatures, terrestrial as well as aquatic.',
  quoteAuthor = 'Āryabhaṭa',
  quoteSource = 'Āryabhaṭīya · about 500 CE'
}) {
  return (
    <aside className="chapter-left-panel" aria-label="Chapter introduction">
      <p className="chapter-left-eyebrow">{eyebrow}</p>
      <h1 className="chapter-left-title">{title}</h1>

      <div className="chapter-earth-visual">
        {imageSrc && (
          <img src={imageSrc} alt={imageAlt} className="chapter-earth-img" />
        )}
        {badge && <div className="chapter-earth-badge">{badge}</div>}
        {caption && <div className="chapter-earth-caption">{caption}</div>}
      </div>

      <blockquote className="chapter-quote-card">
        <span className="chapter-quote-mark" aria-hidden="true">&ldquo;</span>
        <p className="chapter-quote-text">{quote}</p>
        <footer className="chapter-quote-attr">
          — {quoteAuthor}
          {quoteSource && <small>{quoteSource}</small>}
        </footer>
      </blockquote>
    </aside>
  );
}
