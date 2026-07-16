import React from 'react';
import aryabhataImg from './assets/aryabhata.jpg';
import { ChevronRight } from 'lucide-react';

export default function AryabhataPage({ onNext, isNextEnabled }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* ============ LEFT PAGE ============ */}
      <div style={{ 
        flex: 1,
        height: '100%',
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)',
        padding: 'clamp(20px, 2.6vw, 42px) clamp(20px, 2.6vw, 42px) 16px clamp(20px, 2.6vw, 42px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRight: '1px solid rgba(0,0,0,0.08)' // added subtle divider just in case
      }}>
        <div style={{
          fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace',
          fontSize: 'clamp(10px, 1vw, 12px)',
          letterSpacing: '.24em',
          textTransform: 'uppercase',
          color: '#F5A623',
          fontWeight: 600
        }}>
          Chapter 1 · Class 6 Social Science
        </div>
        
        <h1 style={{
          fontFamily: '"Fraunces", "Iowan Old Style", Palatino, Georgia, serif',
          fontWeight: 900,
          color: '#0E3556',
          fontSize: 'clamp(28px, 3.6vw, 50px)',
          lineHeight: 1.02,
          margin: '6px 0 0',
          letterSpacing: '-.01em'
        }}>
          Locating Places<br/>on the Earth
        </h1>

        <div style={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          margin: 'clamp(14px, 2vw, 26px) 0',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'radial-gradient(120% 100% at 30% 20%, #123c60, #08213a)',
          border: '1px solid rgba(14,53,86,.25)',
          display: 'grid',
          placeItems: 'center',
          boxShadow: 'inset 0 0 60px rgba(0,0,0,.35)'
        }}>
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '12px',
            fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace',
            fontSize: '9.5px',
            letterSpacing: '.12em',
            color: '#0a2a45',
            background: '#F5A623',
            padding: '5px 10px',
            borderRadius: '999px',
            fontWeight: 600,
            zIndex: 10
          }}>
            ANCIENT INDIAN ASTRONOMER
          </span>
          
          <svg style={{ width: '82%', height: '82%' }} viewBox="0 0 400 400" aria-label="Armillary sphere over a night sky">
            {/* stars */}
            <g fill="#cfe6f6">
              <circle cx="60" cy="60" r="1.5"></circle><circle cx="120" cy="40" r="1"></circle><circle cx="330" cy="70" r="1.6"></circle>
              <circle cx="360" cy="150" r="1"></circle><circle cx="40" cy="180" r="1.2"></circle><circle cx="300" cy="330" r="1.4"></circle>
              <circle cx="90" cy="330" r="1"></circle><circle cx="200" cy="30" r="1.2"></circle><circle cx="370" cy="280" r="1"></circle>
              <circle cx="30" cy="300" r="1.3"></circle><circle cx="250" cy="360" r="1"></circle><circle cx="150" cy="360" r="1.1"></circle>
            </g>
            {/* armillary sphere */}
            <g fill="none" stroke="#7FD0F0" strokeWidth="1.4" strokeOpacity=".85">
              <circle cx="200" cy="200" r="140" strokeOpacity=".5" style={{ transformOrigin: '200px 200px', animation: 'spin 40s linear infinite' }}></circle>
              <ellipse cx="200" cy="200" rx="140" ry="52" transform="rotate(-22 200 200)"></ellipse>
              <ellipse cx="200" cy="200" rx="52" ry="140"></ellipse>
              <line x1="200" y1="44" x2="200" y2="356" stroke="#9fd8f2" strokeOpacity=".6"></line>
              <line x1="60" y1="200" x2="340" y2="200" stroke="#F5A623" strokeOpacity=".8" strokeWidth="1.6"></line>
            </g>
            {/* earth */}
            <circle cx="200" cy="200" r="20" fill="#123c60" stroke="#F5A623" strokeWidth="1.6"></circle>
            <path d="M188 196 q7 -6 14 0 t10 4" fill="none" stroke="#7FD0F0" strokeWidth="1.2" strokeOpacity=".8"></path>
            <circle cx="200" cy="200" r="20" fill="none" stroke="#7FD0F0" strokeWidth=".8" strokeOpacity=".5"></circle>
          </svg>
          
          <span style={{
            position: 'absolute',
            left: '14px',
            bottom: '12px',
            fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace',
            fontSize: '10px',
            letterSpacing: '.1em',
            color: '#9fd0ea',
            opacity: .85
          }}>
            Armillary sphere · a tool to model the heavens
          </span>
        </div>

        <blockquote style={{
          background: '#fff',
          borderLeft: '4px solid #F5A623',
          borderRadius: '12px',
          padding: 'clamp(14px, 1.7vw, 22px)',
          boxShadow: '0 8px 22px rgba(14,42,69,.08)',
          margin: 0
        }}>
          <p style={{
            fontFamily: '"Fraunces", "Iowan Old Style", Palatino, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.5vw, 19px)',
            lineHeight: 1.5,
            color: '#20303f',
            margin: 0
          }}>
            "The globe of the Earth stands in space… and is spherical, surrounded by all creatures, terrestrial as well as aquatic."
          </p>
          <span style={{
            display: 'block',
            textAlign: 'right',
            marginTop: '10px',
            fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            color: '#0E3556'
          }}>
            — Āryabhaṭa
            <small style={{
              display: 'block',
              fontWeight: 400,
              fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace',
              fontSize: '10px',
              color: '#5c6b7a',
              letterSpacing: '.06em'
            }}>
              Āryabhaṭīya · about 500 CE
            </small>
          </span>
        </blockquote>
      </div>

      {/* ============ RIGHT PAGE ============ */}
      <div style={{
        flex: 1,
        height: '100%',
        boxSizing: 'border-box',
        background: '#fff',
        padding: 'clamp(20px, 2.6vw, 42px) clamp(20px, 2.6vw, 42px) 16px clamp(20px, 2.6vw, 42px)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#0E3556',
          fontWeight: 700,
          fontSize: 'clamp(17px, 2vw, 24px)'
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ flex: '0 0 auto' }}>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z" stroke="#0E3556" strokeWidth="1.6"></path>
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5z" stroke="#0E3556" strokeWidth="1.6"></path>
          </svg>
          Historical Facts — Who was Āryabhaṭa?
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          paddingRight: '6px',
          marginTop: 'clamp(12px, 1.6vw, 18px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(10px, 1.3vw, 14px)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4deea transparent'
        }}>
          
          <div style={{
            background: 'linear-gradient(180deg, #f4f8ff, #eef4fd)',
            border: '1px solid #e4ebf3',
            borderLeft: '5px solid #2f6df0',
            borderRadius: '14px',
            padding: 'clamp(14px, 1.7vw, 20px)'
          }}>
            <h3 style={{
              fontFamily: '"Fraunces", "Iowan Old Style", Palatino, Georgia, serif',
              fontWeight: 600,
              color: '#0E3556',
              fontSize: 'clamp(19px, 2.1vw, 26px)',
              marginBottom: '6px',
              marginTop: 0
            }}>
              A pioneer of Indian astronomy &amp; mathematics
            </h3>
            <p style={{
              color: '#5c6b7a',
              fontSize: 'clamp(13px, 1.35vw, 15px)',
              lineHeight: 1.5,
              margin: 0
            }}>
              Working around 500 CE, Āryabhaṭa asked the same questions this chapter asks — what shape is the Earth, why do the stars appear to move, and how do we measure our planet? His answers were centuries ahead of their time.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(10px, 1.3vw, 14px)'
          }}>
            <FactBlock 
              label="Lived Around" labelColor="#2f6df0"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#2f6df0" strokeWidth="1.7"></circle><path d="M12 7v5l3 2" stroke="#2f6df0" strokeWidth="1.7" strokeLinecap="round"></path></svg>}
              title="476 – 550 CE"
              note="About 1,500 years ago"
            />
            <FactBlock 
              label="Famous Book" labelColor="#7c5cff"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z" stroke="#7c5cff" strokeWidth="1.7"></path><path d="M5 16h13" stroke="#7c5cff" strokeWidth="1.7"></path></svg>}
              title="The Āryabhaṭīya"
              note="Composed in 499 CE, at just 23"
            />
            <FactBlock 
              label="Key Idea 1" labelColor="#12a15f"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#12a15f" strokeWidth="1.7"></circle><path d="M3 12h18M12 3a14 14 0 0 1 0 18" stroke="#12a15f" strokeWidth="1.4"></path></svg>}
              title="The Earth is a sphere"
              note="Not flat — a spinning globe in space"
            />
            <FactBlock 
              label="Key Idea 2" labelColor="#e0781f"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="#e0781f" strokeWidth="1.7"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="#e0781f" strokeWidth="1.5" strokeLinecap="round"></path></svg>}
              title="The Earth spins on its axis"
              note="Why we get day &amp; night, and why stars seem to move"
            />
            <FactBlock 
              label="Measured" labelColor="#0E3556"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#0E3556" strokeWidth="1.7"></circle><path d="M12 3v18" stroke="#0E3556" strokeWidth="1.4" strokeDasharray="2 2"></path></svg>}
              title="Earth's size"
              note="Estimated the circumference astonishingly close to today's value"
            />
            <FactBlock 
              label="Explained" labelColor="#c98511"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="12" r="6" stroke="#c98511" strokeWidth="1.7"></circle><circle cx="15" cy="12" r="6" fill="#fff" stroke="#c98511" strokeWidth="1.7"></circle></svg>}
              title="Eclipses & moonlight"
              note="By shadows, not myth; the Moon shines by reflected sunlight. Also gave π ≈ 3.1416"
            />
          </div>

          <div style={{
            background: '#fff8ec',
            border: '1px solid #f5e2bf',
            borderLeft: '5px solid #F5A623',
            borderRadius: '14px',
            padding: 'clamp(14px, 1.7vw, 20px)'
          }}>
            <h4 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#b4761c',
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              fontWeight: 700,
              margin: '0 0 8px 0'
            }}>
              ◎ Why this matters for our chapter
            </h4>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: 'clamp(12.5px, 1.3vw, 14.5px)', color: '#20303f', lineHeight: 1.45, marginBottom: '7px' }}>
              <span style={{ flex: '0 0 auto', width: '7px', height: '7px', borderRadius: '50%', background: '#F5A623', marginTop: '6px' }}></span>
              <span>A <b style={{ color: '#0E3556' }}>spherical Earth</b> is exactly why we use a <b style={{ color: '#0E3556' }}>globe</b> with latitude and longitude to locate any place.</span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: 'clamp(12.5px, 1.3vw, 14.5px)', color: '#20303f', lineHeight: 1.45, marginBottom: '7px' }}>
              <span style={{ flex: '0 0 auto', width: '7px', height: '7px', borderRadius: '50%', background: '#F5A623', marginTop: '6px' }}></span>
              <span>Because the Earth <b style={{ color: '#0E3556' }}>spins once a day</b> (360° in 24 hours), the world turns <b style={{ color: '#0E3556' }}>15° every hour</b> — the idea behind <b style={{ color: '#0E3556' }}>time zones</b> and IST.</span>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #effaf3, #e8f6ee)',
            border: '1px solid #cdeede',
            borderRadius: '14px',
            padding: 'clamp(14px, 1.7vw, 20px)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#12a15f', fontSize: 'clamp(15px, 1.6vw, 18px)', fontWeight: 700, margin: '0 0 7px 0' }}>
              🛡 His contribution
            </h4>
            <p style={{ color: '#2b5a44', fontSize: 'clamp(13px, 1.35vw, 15px)', lineHeight: 1.5, margin: 0 }}>
              Āryabhaṭa's work helped people understand mathematics, astronomy and the shape and motion of the Earth — laying groundwork that map-makers and timekeepers still rely on today.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '4px 2px 2px' }}>
            <TimelinePoint year="476 CE" desc="Born" first />
            <TimelinePoint year="499 CE" desc="Āryabhaṭīya" />
            <TimelinePoint year="~500 CE" desc="Earth spins" />
            <TimelinePoint year="550 CE" desc="Legacy lives on" last />
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          marginTop: '0',
          borderTop: '1px solid #e4ebf3'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5c6b7a', fontWeight: 600, fontSize: '13px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5A2.5 2.5 0 0 1 20 21.5z" stroke="#5c6b7a" strokeWidth="1.5"></path></svg>
            Page 1 of 2
          </div>
          {isNextEnabled !== false && (
            <button 
              onClick={onNext}
              style={{
                fontFamily: '"Space Grotesk", system-ui, -apple-system, sans-serif',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: '#0E3556',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: '14px',
                display: 'inline-flex',
                gap: '8px',
                alignItems: 'center',
                transition: 'all .2s',
                boxShadow: '0 10px 24px rgba(14,53,86,.25)'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#124070'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#0E3556'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Next
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

function FactBlock({ label, labelColor, icon, title, note }) {
  return (
    <div style={{ background: '#F3F7FC', border: '1px solid #e4ebf3', borderRadius: '12px', padding: 'clamp(12px, 1.5vw, 17px)', position: 'relative' }}>
      <div style={{ fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace', fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', color: labelColor }}>
        {label}
      </div>
      <div style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', fontWeight: 700, color: '#20303f', fontSize: 'clamp(14px, 1.5vw, 17px)', lineHeight: 1.25 }}>
        <div style={{ flex: '0 0 auto', marginTop: '1px' }}>{icon}</div>
        {title}
      </div>
      <div style={{ color: '#5c6b7a', fontSize: '12px', marginTop: '5px', fontWeight: 400, lineHeight: 1.4 }}>
        {note}
      </div>
    </div>
  );
}

function TimelinePoint({ year, desc, first, last }) {
  return (
    <div style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '6px',
        left: first ? '50%' : 0,
        right: last ? '50%' : 0,
        height: '2px',
        background: '#dbe4ef'
      }}></div>
      <i style={{
        position: 'relative',
        display: 'block',
        width: '11px',
        height: '11px',
        borderRadius: '50%',
        background: '#F5A623',
        margin: '0 auto 7px',
        zIndex: 1,
        boxShadow: '0 0 0 3px #fff'
      }}></i>
      <b style={{ display: 'block', fontFamily: '"IBM Plex Mono", "SF Mono", ui-monospace, Menlo, monospace', fontSize: '11px', color: '#0E3556' }}>
        {year}
      </b>
      <span style={{ display: 'block', fontSize: '10px', color: '#5c6b7a', lineHeight: 1.2 }}>
        {desc}
      </span>
    </div>
  );
}

