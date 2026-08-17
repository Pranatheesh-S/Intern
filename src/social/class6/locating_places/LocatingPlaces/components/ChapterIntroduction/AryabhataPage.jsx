import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Info, Link2, Layers, Sparkles } from 'lucide-react';
import earthImg from './assets/Earth.png';

const NAVY = '#0E3556';
const AMBER = '#C8891B';
const MONO = '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace';
const SERIF = '"Fraunces", "Iowan Old Style", Palatino, Georgia, serif';
const SANS = '"Space Grotesk", system-ui, -apple-system, sans-serif';

const SLIDES = [
  { title: 'Who was Āryabhaṭa?', badge: 'Section 1' },
  { title: 'Shape, Motion & Math', badge: 'Section 2' },
  { title: 'Coordinates & Time', badge: 'Section 3' },
  { title: 'Why It Matters Today', badge: 'Section 4' }
];

const SLIDE_2_GRID = [
  { icon: '🌍', badge: 'Key Fact 1 · Earth Shape', title: 'The Earth is a Sphere', desc: 'Not flat — a globe spinning in space surrounded by atmosphere.' },
  { icon: '🔄', badge: 'Key Fact 2 · Rotation', title: 'Rotation on Axis', desc: 'Earth rotates on its axis daily, giving us day, night & moving stars.' },
  { icon: '📏', badge: 'Key Fact 3 · Circumference', title: "Earth's Size", desc: "Estimated Earth's size astonishingly close to modern satellite values." },
  { icon: '🌘', badge: 'Key Fact 4 · Astronomy', title: 'Eclipses & Math', desc: 'Moon shines by reflected light; eclipses by shadows. Gave π ≈ 3.1416.' }
];

const SLIDE_3_GRID = [
  { icon: '⏳', badge: 'Key Fact 1 · Lifespan', title: '476 – 550 CE', desc: 'Lived about 1,500 years ago in ancient India.' },
  { icon: '📜', badge: 'Key Fact 2 · Masterpiece', title: 'The Āryabhaṭīya', desc: 'Composed in 499 CE when he was just 23 years old.' },
  { icon: '🗺', badge: 'Key Fact 3 · Coordinates', title: 'Latitude & Longitude', desc: 'Used coordinate principles to mark exact locations on Earth.' },
  { icon: '🕰', badge: 'Key Fact 4 · Global Time', title: 'Time & Rotation', desc: "Linked 360° rotation (15° every hour) to global time zones." }
];

const TIMELINE = [
  { year: '476 CE', desc: 'Born' },
  { year: '499 CE', desc: 'Āryabhaṭīya' },
  { year: '~500 CE', desc: 'Earth spins' },
  { year: '550 CE', desc: 'Legacy lives on' }
];

const cardBase = {
  borderRadius: '16px',
  boxSizing: 'border-box'
};

export default function AryabhataPage({ onNext, onBack, isNextEnabled }) {
  const [slide, setSlide] = useState(0);
  const [turnDir, setTurnDir] = useState('fwd'); // 'fwd' | 'back'
  const isLast = slide === SLIDES.length - 1;

  const goToSlide = (target) => {
    if (target < 0 || target >= SLIDES.length) return;
    setTurnDir(target > slide ? 'fwd' : 'back');
    setSlide(target);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', minHeight: 0, background: '#fff', overflow: 'hidden' }}>
      <style>{`
        @keyframes bookTurnFwd {
          0%   { opacity: 0; transform: perspective(1200px) rotateY(-14deg) translateX(24px) scale(0.98); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: perspective(1200px) rotateY(0deg) translateX(0) scale(1); }
        }
        @keyframes bookTurnBack {
          0%   { opacity: 0; transform: perspective(1200px) rotateY(14deg) translateX(-24px) scale(0.98); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: perspective(1200px) rotateY(0deg) translateX(0) scale(1); }
        }
        .book-slide-fwd { animation: bookTurnFwd 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
        .book-slide-back { animation: bookTurnBack 0.38s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
      `}</style>

      {/* ============ LEFT PAGE — fixed blueprint ============ */}
      <div style={{
        flex: '0 0 44%',
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: '15px', letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#E08A1E', marginBottom: '6px'
          }}>
            Chapter 1 · Class 6 Social Science
          </div>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: 'clamp(24px, 2.2vw, 32px)', lineHeight: 1.1, margin: 0,
            letterSpacing: '-.01em'
          }}>
            Locating Places on the Earth
          </h1>
        </div>

        {/* Earth plate image */}
        <div style={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          background: '#000', flex: '1 1 auto', minHeight: 0,
          boxShadow: '0 10px 30px rgba(14,42,69,.18)'
        }}>
          <img src={earthImg} alt="Earth from space" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <span style={{
            position: 'absolute', top: '14px', right: '14px',
            background: '#D79A2B', color: '#fff', fontFamily: SANS, fontWeight: 800,
            fontSize: '14px', letterSpacing: '.08em', textTransform: 'uppercase',
            padding: '8px 16px', borderRadius: '999px', boxShadow: '0 4px 14px rgba(0,0,0,.35)'
          }}>
            Ancient Indian Astronomy
          </span>
          <span style={{
            position: 'absolute', left: '18px', bottom: '14px', color: '#fff',
            fontFamily: SANS, fontWeight: 700, fontSize: '15px',
            textShadow: '0 2px 8px rgba(0,0,0,.85)'
          }}>
            Earth from space — a spherical globe in the cosmos
          </span>
        </div>

        {/* Quote card */}
        <div style={{
          ...cardBase, background: '#fff', flexShrink: 0,
          boxShadow: '0 8px 24px rgba(14,42,69,.08)', padding: '16px 20px'
        }}>
          <div style={{ fontFamily: SERIF, fontSize: '36px', lineHeight: .5, color: '#C9D4E2' }}>“</div>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, color: NAVY,
            fontSize: '16px', lineHeight: 1.55, margin: '6px 0 10px'
          }}>
            The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. … It is
            surrounded by all creatures.
          </p>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, color: NAVY, fontSize: '15px' }}>— Āryabhaṭa</div>
            <div style={{ fontFamily: SANS, color: '#5c6b7a', fontSize: '14px', marginTop: '2px' }}>Āryabhaṭīya · about 500 CE</div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT PAGE — book slide paged ============ */}
      <div style={{
        flex: 1, minWidth: 0, height: '100%', boxSizing: 'border-box', background: '#fff',
        padding: '24px 28px 16px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: SANS, fontWeight: 700, fontSize: '14px', letterSpacing: '.12em', textTransform: 'uppercase', color: AMBER, marginBottom: '4px' }}>
            <Sparkles size={16} color={AMBER} /> {SLIDES[slide].badge}
          </div>
          <h2 style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: 'clamp(24px, 2.2vw, 28px)', margin: 0
          }}>
            <BookOpen size={28} color="#3b6ea5" strokeWidth={2.2} />
            Historical Facts — {SLIDES[slide].title}
          </h2>
        </div>

        {/* Slide viewport — 100% height fit, NO scroll */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <div key={slide} className={turnDir === 'fwd' ? 'book-slide-fwd' : 'book-slide-back'} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* SLIDE 0: Overview */}
            {slide === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
                <div style={{ ...cardBase, background: '#EEF0FB', borderLeft: `6px solid ${NAVY}`, padding: '24px 26px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 800, color: NAVY, fontSize: '22px', margin: '0 0 14px' }}>
                    A pioneer of Indian astronomy &amp; mathematics
                  </h3>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#243b53', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
                    Working around 500 CE (about 1,500 years ago), Āryabhaṭa asked the fundamental questions this chapter explores — what shape is the Earth,
                    why do stars appear to move across the sky, and how do we measure our planet?
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#243b53', fontSize: '17px', lineHeight: 1.65, margin: '0 0 14px' }}>
                    At just 23 years of age, he composed the famous <b>Āryabhaṭīya</b> in 499 CE.
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#243b53', fontSize: '17px', lineHeight: 1.65, margin: 0 }}>
                    It became an important foundational work in Indian mathematics and astronomy, influencing generations of scholars.
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 1: Shape, Motion & Math */}
            {slide === 1 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '12px' }}>
                {SLIDE_2_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#FBF3E3', border: '1px solid #F2DFBC', borderRadius: '14px',
                    padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    boxShadow: '0 4px 12px rgba(14,42,69,.05)', justifyContent: 'center', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '26px', lineHeight: 1.1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '12px', letterSpacing: '.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 800, color: NAVY, fontSize: '17px', margin: '3px 0 0', lineHeight: 1.2 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 500, color: '#243b53', fontSize: '14px', lineHeight: 1.45 }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 2: Coordinates & Time */}
            {slide === 2 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '12px' }}>
                {SLIDE_3_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px',
                    padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'flex-start',
                    boxShadow: '0 4px 12px rgba(14,42,69,.05)', justifyContent: 'center', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '26px', lineHeight: 1.1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '12px', letterSpacing: '.04em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 800, color: NAVY, fontSize: '17px', margin: '3px 0 0', lineHeight: 1.2 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 500, color: '#4a5b6d', fontSize: '14px', lineHeight: 1.45 }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3: Why It Matters & Timeline */}
            {slide === 3 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
                <div style={{ ...cardBase, background: '#FDF4E4', border: '1px solid #F2DFBC', padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: SERIF, fontWeight: 800, color: AMBER, fontSize: '20px', margin: '0 0 12px' }}>
                    <Info size={22} color={AMBER} /> Why this matters for our chapter
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#243b53', fontSize: '16px', lineHeight: 1.6 }}>
                      A spherical Earth is exactly why we use a globe with latitude and longitude to locate any place.
                    </li>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#243b53', fontSize: '16px', lineHeight: 1.6 }}>
                      Because the Earth spins once a day (360° in 24 hours), the world turns <b>15° every hour</b> — the
                      idea behind time zones and IST.
                    </li>
                  </ul>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 24px' }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 800, color: NAVY, fontSize: '18px', marginBottom: '14px' }}>
                    Timeline of Āryabhaṭa
                  </div>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', left: '6%', right: '6%', top: '8px', height: '2px', background: '#EADFC8' }} />
                    {TIMELINE.map(t => (
                      <div key={t.year} style={{ position: 'relative', textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#D79A2B', margin: '0 auto 8px', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                        <div style={{ fontFamily: MONO, fontWeight: 700, color: NAVY, fontSize: '16px' }}>{t.year}</div>
                        <div style={{ fontFamily: SANS, color: '#5c6b7a', fontSize: '15px', marginTop: '2px', fontWeight: 600 }}>{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ============ BOOK SLIDE FOOTER ============ */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '14px', paddingTop: '16px', marginTop: '14px', borderTop: '1px solid #E4EBF3'
        }}>
          {/* Page Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, color: '#5c6b7a', fontSize: '15px' }}>
              Slide {slide + 1} of {SLIDES.length}
            </span>
            <span style={{ display: 'inline-flex', gap: '8px' }}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: '11px', height: '11px', padding: 0, borderRadius: '50%', border: 'none',
                    cursor: 'pointer', background: i === slide ? '#D79A2B' : '#DCE4EC',
                    transition: 'all .25s', transform: i === slide ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
            </span>
          </div>

          {/* Nav Buttons parallel */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (slide > 0) {
                  goToSlide(slide - 1);
                } else if (onBack) {
                  onBack();
                }
              }}
              disabled={slide === 0 && !onBack}
              style={{
                fontFamily: SANS, fontWeight: 700, fontSize: '15px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#0E3556', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '12px 24px',
                cursor: (slide === 0 && !onBack) ? 'not-allowed' : 'pointer',
                opacity: (slide === 0 && !onBack) ? 0.35 : 1,
                boxShadow: '0 6px 16px rgba(14,42,69,.22)'
              }}
            >
              <ChevronLeft size={18} strokeWidth={2.5} /> Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (isLast) { if (onNext) onNext(); return; }
                goToSlide(slide + 1);
              }}
              disabled={isLast && isNextEnabled === false}
              style={{
                fontFamily: SANS, fontWeight: 700, fontSize: '15px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: isLast ? '#16a34a' : '#0E3556', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '12px 26px',
                cursor: isLast && isNextEnabled === false ? 'not-allowed' : 'pointer',
                opacity: isLast && isNextEnabled === false ? 0.45 : 1,
                boxShadow: isLast ? '0 6px 16px rgba(22,163,74,.3)' : '0 6px 16px rgba(14,42,69,.22)'
              }}
            >
              {isLast ? 'Continue' : 'Next'} <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
