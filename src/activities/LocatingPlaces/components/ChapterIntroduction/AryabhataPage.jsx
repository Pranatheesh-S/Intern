import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Info, Link2, Layers, Sparkles } from 'lucide-react';
import Earth3DGlobe from './Earth3DGlobe';

const NAVY = '#0A2540';
const AMBER = '#B45309';
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
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: '13px', letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#B45309', marginBottom: '6px'
          }}>
            Chapter 1 · Class 6 Social Science
          </div>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: 1.1, margin: 0,
            letterSpacing: '-.01em'
          }}>
            Locating Places on the Earth
          </h1>
        </div>

        {/* Interactive 3D Earth Globe Model (Fully Lit, No Reflections or Dark Shadows) */}
        <div style={{
          position: 'relative', borderRadius: '16px', overflow: 'hidden',
          flex: '1 1 auto', minHeight: 0
        }}>
          <Earth3DGlobe />
        </div>

        {/* Quote card */}
        <div style={{
          ...cardBase, background: '#fff', flexShrink: 0,
          boxShadow: '0 8px 24px rgba(14,42,69,.08)', padding: '10px 14px'
        }}>
          <div style={{ fontFamily: SERIF, fontSize: '36px', lineHeight: .5, color: '#C9D4E2' }}>“</div>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, color: NAVY,
            fontSize: '13px', lineHeight: 1.45, margin: '4px 0 6px'
          }}>
            The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. … It is
            surrounded by all creatures.
          </p>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, color: NAVY, fontSize: '13px' }}>— Āryabhaṭa</div>
            <div style={{ fontFamily: SANS, color: '#5c6b7a', fontSize: '12px', marginTop: '2px' }}>Āryabhaṭīya · about 500 CE</div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT PAGE — book slide paged ============ */}
      <div style={{
        flex: 1, minWidth: 0, height: '100%', boxSizing: 'border-box', background: '#fff',
        padding: '12px 16px 8px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: SANS, fontWeight: 800, fontSize: '13px', letterSpacing: '.14em', textTransform: 'uppercase', color: AMBER, marginBottom: '2px' }}>
            <Sparkles size={16} color={AMBER} /> {SLIDES[slide].badge}
          </div>
          <h2 style={{
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: 'clamp(18px, 2vw, 24px)', margin: 0
          }}>
            <BookOpen size={30} color="#3b6ea5" strokeWidth={2.2} />
            Historical Facts — {SLIDES[slide].title}
          </h2>
        </div>

        {/* Slide viewport — 100% height fit, NO scroll */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <div key={slide} className={turnDir === 'fwd' ? 'book-slide-fwd' : 'book-slide-back'} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* SLIDE 0: Overview */}
            {slide === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  ...cardBase,
                  background: '#F7F1E2',
                  border: '1px solid #F2DFBC',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(60,40,20,.06)'
                }}>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 900, color: '#B45309', fontSize: '19px', margin: 0, lineHeight: 1.25 }}>
                    A pioneer of Indian astronomy &amp; mathematics
                  </h3>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '14px', lineHeight: 1.55, margin: 0 }}>
                    Working around 500 CE (about 1,500 years ago), Āryabhaṭa asked the fundamental questions this chapter explores — what shape is the Earth,
                    why do stars appear to move across the sky, and how do we measure our planet?
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '14px', lineHeight: 1.55, margin: 0 }}>
                    At just 23 years of age, he composed the famous <b style={{ color: '#1A0D05', fontWeight: 800 }}>Āryabhaṭīya</b> in 499 CE.
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '14px', lineHeight: 1.55, margin: 0 }}>
                    It became an important foundational work in Indian mathematics and astronomy, influencing generations of scholars.
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 1: Shape, Motion & Math */}
            {slide === 1 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px', height: '100%' }}>
                {SLIDE_2_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#FBF3E3', border: '1px solid #F2DFBC', borderRadius: '16px',
                    padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'flex-start',
                    boxShadow: '0 4px 14px rgba(60,40,20,.05)', justifyContent: 'center', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '24px', lineHeight: 1.1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '16px', margin: '2px 0 0', lineHeight: 1.2 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '12.5px', lineHeight: 1.45, textAlign: 'left' }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 2: Coordinates & Time */}
            {slide === 2 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, 1fr)', gap: '16px', height: '100%' }}>
                {SLIDE_3_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#FBF3E3', border: '1px solid #F2DFBC', borderRadius: '16px',
                    padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'flex-start',
                    boxShadow: '0 4px 14px rgba(60,40,20,.05)', justifyContent: 'center', flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '24px', lineHeight: 1.1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '11px', letterSpacing: '.06em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '16px', margin: '2px 0 0', lineHeight: 1.2 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '12.5px', lineHeight: 1.45, textAlign: 'left' }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3: Why It Matters & Timeline */}
            {slide === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ ...cardBase, background: '#FDF4E4', border: '1px solid #F2DFBC', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: SERIF, fontWeight: 900, color: AMBER, fontSize: '17px', margin: 0 }}>
                    <Info size={20} color={AMBER} /> Why this matters for our chapter
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '13px', lineHeight: 1.5 }}>
                      A spherical Earth is exactly why we use a globe with latitude and longitude to locate any place.
                    </li>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '13px', lineHeight: 1.5 }}>
                      Because the Earth spins once a day (360° in 24 hours), the world turns <b style={{ color: '#1A0D05', fontWeight: 800 }}>15° every hour</b> — the
                      idea behind time zones and IST.
                    </li>
                  </ul>
                </div>

                <div style={{ background: '#FAF6EE', border: '1.5px solid #E5D5C0', borderRadius: '16px', padding: '12px 16px', boxShadow: '0 6px 18px rgba(44,26,14,.06)' }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '16px', marginBottom: '10px' }}>
                    Timeline of Āryabhaṭa
                  </div>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', left: '6%', right: '6%', top: '7px', height: '3px', background: 'linear-gradient(90deg, #B45309 0%, #D79A2B 50%, #B45309 100%)', borderRadius: '2px' }} />
                    {TIMELINE.map(t => (
                      <div key={t.year} style={{ position: 'relative', textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#B45309', margin: '0 auto 6px', border: '2px solid #FAF6EE', boxShadow: '0 2px 6px rgba(180,83,9,0.3)' }} />
                        <div style={{ fontFamily: MONO, fontWeight: 800, color: '#2C1A0E', fontSize: '13px' }}>{t.year}</div>
                        <div style={{ fontFamily: SANS, color: '#3D2E24', fontSize: '11.5px', marginTop: '1px', fontWeight: 600 }}>{t.desc}</div>
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
          gap: '10px', paddingTop: '8px', marginTop: '6px', borderTop: '1px solid #E4EBF3'
        }}>
          {/* Page Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, color: '#5c6b7a', fontSize: '12px' }}>
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
                    width: '9px', height: '9px', padding: 0, borderRadius: '50%', border: 'none',
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
                fontFamily: SANS, fontWeight: 700, fontSize: '13px',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#0E3556', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '8px 16px',
                cursor: (slide === 0 && !onBack) ? 'not-allowed' : 'pointer',
                opacity: (slide === 0 && !onBack) ? 0.35 : 1,
                boxShadow: '0 4px 12px rgba(14,42,69,.18)'
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
                fontFamily: SANS, fontWeight: 700, fontSize: '13px',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: isLast ? '#16a34a' : '#0E3556', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '8px 18px',
                cursor: isLast && isNextEnabled === false ? 'not-allowed' : 'pointer',
                opacity: isLast && isNextEnabled === false ? 0.45 : 1,
                boxShadow: isLast ? '0 4px 12px rgba(22,163,74,.25)' : '0 4px 12px rgba(14,42,69,.18)'
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
