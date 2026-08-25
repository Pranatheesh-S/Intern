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
  {
    icon: '🌍',
    badge: 'Key Fact 1 · Earth Shape',
    title: 'The Earth is a Sphere',
    desc: 'Stated clearly that the Earth is a round sphere floating in space, surrounded by an envelope of atmosphere rather than resting flat.'
  },
  {
    icon: '🔄',
    badge: 'Key Fact 2 · Rotation',
    title: 'Rotation on Axis',
    desc: 'Discovered that the Earth rotates on its own axis once every day, creating the continuous natural cycle of day, night and moving stars.'
  },
  {
    icon: '📏',
    badge: 'Key Fact 3 · Circumference',
    title: "Earth's Dimensions",
    desc: 'Calculated the circumference and diameter of the spherical Earth, astonishingly close to the measurements obtained by modern satellites.'
  },
  {
    icon: '🌘',
    badge: 'Key Fact 4 · Astronomy',
    title: 'Eclipses & Geometry',
    desc: 'Explained that the Moon shines by reflected sunlight, proved eclipses are cast by planetary shadows, and derived constant π ≈ 3.1416.'
  }
];

const SLIDE_3_GRID = [
  {
    icon: '⏳',
    badge: 'Key Fact 1 · Classical Era',
    title: '476 – 550 CE',
    desc: 'Lived and worked in ancient Kusumapura (Patliputra) over 1,500 years ago during the flourishing golden era of Indian science.'
  },
  {
    icon: '📜',
    badge: 'Key Fact 2 · Masterpiece',
    title: 'The Āryabhaṭīya',
    desc: 'Composed his world-renowned treatise on mathematics and astronomy in 499 CE at the young age of just 23 years.'
  },
  {
    icon: '🗺️',
    badge: 'Key Fact 3 · Coordinates',
    title: 'Global Coordinates',
    desc: 'Pioneered coordinate geometry methods using meridians of longitude and parallels of latitude to define precise locations on Earth.'
  },
  {
    icon: '🕰️',
    badge: 'Key Fact 4 · Time Systems',
    title: 'Rotation & Time',
    desc: "Connected the Earth's 360° rotational geometry (turning 15° every hour) to solar passage and geographical time variations."
  }
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
        flex: '0 0 45%',
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)',
        borderRight: '1.5px solid #E5D5C0',
        padding: '24px 28px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden'
      }}>
        {/* Left Header - Perfectly Parallel Height with Right */}
        <div style={{ flexShrink: 0, height: '74px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{
            fontFamily: SANS, fontWeight: 800,
            fontSize: '14.5px', letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#B45309', marginBottom: '6px'
          }}>
            Chapter 1 · Class 6 Social Science
          </div>
          <h1 style={{
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: '26px', lineHeight: 1.2, margin: 0,
            letterSpacing: '-.01em', whiteSpace: 'nowrap'
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
          boxShadow: '0 8px 24px rgba(14,42,69,.08)', padding: '16px 20px'
        }}>
          <div style={{ fontFamily: SERIF, fontSize: '36px', lineHeight: .5, color: '#C9D4E2' }}>“</div>
          <p style={{
            fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, color: NAVY,
            fontSize: '16px', lineHeight: 1.55, margin: '6px 0 10px',
            textAlign: 'justify', textJustify: 'inter-word'
          }}>
            The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. … It is
            surrounded by all creatures.
          </p>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, color: NAVY, fontSize: '15.5px' }}>— Āryabhaṭa</div>
            <div style={{ fontFamily: SANS, color: '#5c6b7a', fontSize: '14px', marginTop: '2px' }}>Āryabhaṭīya · about 500 CE</div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT PAGE — book slide paged ============ */}
      <div style={{
        flex: '1 1 55%',
        minWidth: 0,
        height: '100%',
        boxSizing: 'border-box',
        background: '#fff',
        padding: '24px 28px 20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Right Header - Perfectly Parallel Height with Left */}
        <div style={{ flexShrink: 0, height: '74px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: SANS, fontWeight: 800, fontSize: '14.5px', letterSpacing: '.14em', textTransform: 'uppercase', color: AMBER, marginBottom: '6px' }}>
            <Sparkles size={16} color={AMBER} /> {SLIDES[slide].badge}
          </div>
          <h2 style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontFamily: SERIF, fontWeight: 900, color: NAVY,
            fontSize: '24px', lineHeight: 1.2, margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            <BookOpen size={26} color="#3b6ea5" strokeWidth={2.2} />
            Historical Facts — {SLIDES[slide].title}
          </h2>
        </div>

        {/* Slide viewport — 100% height fit, NO scroll */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
          <div key={slide} className={turnDir === 'fwd' ? 'book-slide-fwd' : 'book-slide-back'} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* SLIDE 0: Overview */}
            {slide === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <div style={{
                  ...cardBase,
                  background: '#F7F1E2',
                  border: '1px solid #F2DFBC',
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: '0 4px 16px rgba(60,40,20,.06)'
                }}>
                  <h3 style={{ fontFamily: SERIF, fontWeight: 900, color: '#B45309', fontSize: '24px', margin: 0, lineHeight: 1.3 }}>
                    A pioneer of Indian astronomy &amp; mathematics
                  </h3>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '18px', lineHeight: 1.65, margin: 0, textAlign: 'justify', textJustify: 'inter-word' }}>
                    Working around 500 CE (about 1,500 years ago), Āryabhaṭa asked the fundamental questions this chapter explores — what shape is the Earth,
                    why do stars appear to move across the sky, and how do we measure our planet?
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '18px', lineHeight: 1.65, margin: 0, textAlign: 'justify', textJustify: 'inter-word' }}>
                    At just 23 years of age, he composed the famous <b style={{ color: '#1A0D05', fontWeight: 800 }}>Āryabhaṭīya</b> in 499 CE.
                  </p>
                  <p style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '18px', lineHeight: 1.65, margin: 0, textAlign: 'justify', textJustify: 'inter-word' }}>
                    It became an important foundational work in Indian mathematics and astronomy, influencing generations of scholars.
                  </p>
                </div>
              </div>
            )}

            {/* SLIDE 1: Shape, Motion & Math */}
            {slide === 1 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: '16px', height: '100%' }}>
                {SLIDE_2_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#FBF3E3', border: '1px solid #F2DFBC', borderRadius: '16px',
                    padding: '18px 22px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(60,40,20,.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '20px', margin: '3px 0 0', lineHeight: 1.25 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '15.5px', lineHeight: 1.55, textAlign: 'justify', textJustify: 'inter-word' }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 2: Coordinates & Time */}
            {slide === 2 && (
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: '16px', height: '100%' }}>
                {SLIDE_3_GRID.map((k) => (
                  <div key={k.title} style={{
                    background: '#FBF3E3', border: '1px solid #F2DFBC', borderRadius: '16px',
                    padding: '18px 22px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(60,40,20,.05)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>{k.icon}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontFamily: SANS, fontWeight: 800, color: AMBER, fontSize: '13px', letterSpacing: '.06em', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                          {k.badge}
                        </div>
                        <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '20px', margin: '3px 0 0', lineHeight: 1.25 }}>
                          {k.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '15.5px', lineHeight: 1.55, textAlign: 'justify', textJustify: 'inter-word' }}>
                      {k.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SLIDE 3: Why It Matters & Timeline */}
            {slide === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
                <div style={{ ...cardBase, background: '#FDF4E4', border: '1px solid #F2DFBC', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: SERIF, fontWeight: 900, color: AMBER, fontSize: '22px', margin: 0 }}>
                    <Info size={22} color={AMBER} /> Why this matters for our chapter
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '17px', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
                      A spherical Earth is exactly why we use a globe with latitude and longitude to locate any place accurately.
                    </li>
                    <li style={{ fontFamily: SANS, fontWeight: 600, color: '#3D2E24', fontSize: '17px', lineHeight: 1.6, textAlign: 'justify', textJustify: 'inter-word' }}>
                      Because the Earth spins once a day (360° in 24 hours), the world turns <b style={{ color: '#1A0D05', fontWeight: 800 }}>15° every hour</b> — the fundamental principle behind international time zones and IST.
                    </li>
                  </ul>
                </div>

                <div style={{ background: '#FAF6EE', border: '1.5px solid #E5D5C0', borderRadius: '16px', padding: '18px 24px', boxShadow: '0 6px 18px rgba(44,26,14,.06)' }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, color: '#2C1A0E', fontSize: '20px', marginBottom: '14px' }}>
                    Timeline of Āryabhaṭa
                  </div>
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', left: '6%', right: '6%', top: '9px', height: '3px', background: 'linear-gradient(90deg, #B45309 0%, #D79A2B 50%, #B45309 100%)', borderRadius: '2px' }} />
                    {TIMELINE.map(t => (
                      <div key={t.year} style={{ position: 'relative', textAlign: 'center', flex: 1 }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#B45309', margin: '0 auto 8px', border: '3px solid #FAF6EE', boxShadow: '0 3px 8px rgba(180,83,9,0.35)' }} />
                        <div style={{ fontFamily: MONO, fontWeight: 800, color: '#2C1A0E', fontSize: '17px' }}>{t.year}</div>
                        <div style={{ fontFamily: SANS, color: '#3D2E24', fontSize: '15px', marginTop: '2px', fontWeight: 600 }}>{t.desc}</div>
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
            <span style={{ fontFamily: SANS, fontWeight: 700, color: '#5c6b7a', fontSize: '15.5px' }}>
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
                fontFamily: SANS, fontWeight: 700, fontSize: '15.5px',
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
                fontFamily: SANS, fontWeight: 700, fontSize: '15.5px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: isLast ? '#16a34a' : '#F59E0B', color: '#fff', border: 'none',
                borderRadius: '999px', padding: '12px 26px',
                cursor: isLast && isNextEnabled === false ? 'not-allowed' : 'pointer',
                opacity: isLast && isNextEnabled === false ? 0.45 : 1,
                boxShadow: isLast ? '0 6px 16px rgba(22,163,74,.3)' : '0 6px 16px rgba(245,158,11,.38)'
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
