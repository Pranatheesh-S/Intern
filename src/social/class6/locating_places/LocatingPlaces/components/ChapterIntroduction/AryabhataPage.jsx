import React, { useState } from 'react';
import { ArrowRight, Info, Link2, ArrowLeft } from 'lucide-react';
import ChapterLeftPanel from './ChapterLeftPanel';
import ChapterBackFooter from '../ChapterBackFooter';

const CONTENT_PAGE_COUNT = 3;

function SectionOne() {
  return (
    <div className="arya-right-content">
      <div className="arya-r-heading">
        <span className="arya-r-heading-emoji">📖</span>
        Historical Facts – Who was Āryabhaṭa?
      </div>
      <div className="arya-section-one-cards">
        <div className="arya-hero-card">
          <h2>A pioneer of Indian astronomy &amp; mathematics</h2>
          <p>
            Working around 500 CE, Āryabhaṭa asked the same questions this chapter asks — what shape is the Earth,
            why do the stars appear to move, and how do we measure our planet? His answers were centuries ahead of their time.
          </p>
          <p>
            At just 23, he composed the <strong>Āryabhaṭīya</strong> in 499 CE.
          </p>
          <p>
            It became an important work in Indian mathematics and astronomy.
          </p>
        </div>
        <div className="arya-secondary-card">
          <h2><span aria-hidden="true">📚</span> His key ideas</h2>
          <ul>
            <li>The Earth is a <strong>sphere</strong> — not flat, but a globe spinning in space.</li>
            <li>The Earth <strong>rotates on its axis</strong>, giving us day, night, and the apparent motion of stars.</li>
            <li>He measured Earth&apos;s size and explained <strong>eclipses</strong> through shadows and reflected sunlight.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SectionTwo() {
  return (
    <div className="arya-right-content arya-section-two">
      <div className="arya-r-heading">
        <span className="arya-r-heading-emoji">📖</span>
        Historical Facts – Key Ideas &amp; Discoveries
      </div>
      <div className="arya-fact-grid">
        <FactCell emoji="⏳" label="Key Idea 1" title="476 – 550 CE" note="About 1,500 years ago" />
        <FactCell emoji="📜" label="Key Idea 2" title="The Āryabhaṭīya" note="Composed in 499 CE, at just 23" />
        <FactCell emoji="🌍" label="Key Idea 3" title="The Earth is a sphere" note="Not flat — a spinning globe in space" />
        <FactCell emoji="☀️" label="Key Idea 4" title="The Earth spins on its axis" note="Why we get day & night, and why stars seem to move" />
        <FactCell emoji="📏" label="Key Idea 5" title="Earth's size" note="Estimated the circumference astonishingly close to today's value" />
        <FactCell emoji="🌕" label="Key Idea 6" title="Eclipses & moonlight" note="By shadows, not myth; the Moon shines by reflected sunlight. Also gave π ≈ 3.1416" />
        <FactCell emoji="🗺️" label="Key Idea 7" title="Coordinates" note="Latitude and longitude help us find the exact location of a place on Earth." />
        <FactCell emoji="🕐" label="Key Idea 8" title="Time Zones" note="Earth's rotation creates different time zones around the world." />
      </div>
    </div>
  );
}

function SectionThree() {
  return (
    <div className="arya-right-content arya-section-three">
      <div className="arya-r-heading">
        <span className="arya-r-heading-emoji">📖</span>
        Historical Facts – Why It Matters Today
      </div>

      <div className="arya-box orange">
        <h3><Info size={18} /> Why this matters for our chapter</h3>
        <ul>
          <li>
            A <strong>spherical Earth</strong> is exactly why we use a <strong>globe</strong> with latitude and longitude to locate any place.
          </li>
          <li>
            Because the Earth <strong>spins once a day</strong> (360° in 24 hours), the world turns <strong>15° every hour</strong> — the idea behind <strong>time zones</strong> and IST.
          </li>
        </ul>
      </div>

      <div className="arya-box green">
        <h3><Link2 size={18} /> His contribution</h3>
        <p>
          Āryabhaṭa&apos;s work helped people understand mathematics, astronomy and the shape and motion of the Earth — laying groundwork that map-makers and timekeepers still rely on today.
        </p>
      </div>

      <div className="arya-timeline-block">
        <div className="arya-timeline-heading">Timeline of Āryabhaṭa</div>
        <div className="arya-timeline">
          <div className="line" />
          <div className="events">
            <div className="event">
              <div className="dot" />
              <div className="date">476 CE</div>
              <div className="desc">Born</div>
            </div>
            <div className="event">
              <div className="dot" />
              <div className="date">499 CE</div>
              <div className="desc">Āryabhaṭīya</div>
            </div>
            <div className="event">
              <div className="dot" />
              <div className="date">~500 CE</div>
              <div className="desc">Earth spins</div>
            </div>
            <div className="event">
              <div className="dot" />
              <div className="date">550 CE</div>
              <div className="desc">Legacy lives on</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactCell({ emoji, label, title, note }) {
  return (
    <div className="arya-cell edu-key-idea-card">
      <div className="arya-cell-emoji edu-key-idea-emoji" aria-hidden="true">{emoji}</div>
      <div className="arya-cell-body edu-key-idea-body">
        <div className="label edu-key-idea-label">{label}</div>
        <div className="h edu-key-idea-title">{title}</div>
        <div className="sub edu-key-idea-desc">{note}</div>
      </div>
    </div>
  );
}

const SECTIONS = [SectionOne, SectionTwo, SectionThree];

export default function AryabhataPage({ onNext, isNextEnabled }) {
  const [contentPage, setContentPage] = useState(0);
  const isLastSection = contentPage >= CONTENT_PAGE_COUNT - 1;
  const ActiveSection = SECTIONS[contentPage];

  return (
    <div className="arya-chapter-page">
      <div className="arya-spread edu-two-column-spread">
        <ChapterLeftPanel />

        <div className="arya-right">
          <div className="arya-right-body">
            <ActiveSection />
          </div>

          <div className="arya-page-nav">
            <div className="arya-page-nav-side">
              {contentPage > 0 && (
                <button
                  type="button"
                  className="arya-prev-page-btn"
                  onClick={() => setContentPage(p => p - 1)}
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              )}
            </div>

            <div className="arya-page-dots">
              <span className="arya-page-label">
                Section {contentPage + 1} of {CONTENT_PAGE_COUNT}
              </span>
              {Array.from({ length: CONTENT_PAGE_COUNT }).map((_, i) => (
                <span key={i} className={`arya-dot${i === contentPage ? ' active' : ''}`} />
              ))}
            </div>

            <div className="arya-page-nav-side end">
              {!isLastSection && (
                <button
                  type="button"
                  className="arya-next-page-btn"
                  onClick={() => setContentPage(p => p + 1)}
                >
                  Next Page
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {isLastSection && isNextEnabled !== false && (
        <ChapterBackFooter
          nextLabel="Continue"
          onNext={onNext}
          nextVariant="navy"
        />
      )}
    </div>
  );
}
