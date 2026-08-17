import React, { useState } from 'react';
import ChapterBackFooter from './ChapterBackFooter';

const fmt = (h) => {
  h = ((h % 24) + 24) % 24;
  let hr = Math.floor(h);
  let mn = Math.round((h - hr) * 60);
  if (mn === 60) { mn = 0; hr = (hr + 1) % 24; }
  const ap = hr < 12 ? 'am' : 'pm';
  let hh = hr % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${mn.toString().padStart(2, '0')} ${ap}`;
};

const localTime = (targetLong) => 12 + targetLong / 15;

export default function TimeZonesPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('tz');

  // TZ State
  const [tzLon, setTzLon] = useState(30);

  // STD State
  const [gmtH, setGmtH] = useState(12);
  const [quickThinkFb, setQuickThinkFb] = useState(null);

  // IDL State
  const [idlMission, setIdlMission] = useState(1);
  const [idlAnimState, setIdlAnimState] = useState('ready'); // ready, flying, asked, answered
  const [idlAnswer, setIdlAnswer] = useState(null);
  const [animProgress, setAnimProgress] = useState(0);

  const missions = [
    {
      id: 1,
      from: 'Tokyo',
      to: 'Honolulu',
      dir: 'East',
      startDay: 'MONDAY',
      endDay: 'SUNDAY',
      desc: 'Crossing East → Subtract a day',
      q: 'What happens to the date?',
      options: ['Sunday', 'Monday', 'Tuesday'],
      correct: 'Sunday',
      startCoord: { x: 120, y: 120 },
      endCoord: { x: 420, y: 130 }
    },
    {
      id: 2,
      from: 'Sydney',
      to: 'Los Angeles',
      dir: 'East',
      startDay: 'FRIDAY',
      endDay: 'THURSDAY',
      desc: 'Crossing East → Subtract a day',
      q: 'What happens to the date?',
      options: ['Thursday', 'Friday', 'Saturday'],
      correct: 'Thursday',
      startCoord: { x: 140, y: 180 },
      endCoord: { x: 500, y: 140 }
    },
    {
      id: 3,
      from: 'Honolulu',
      to: 'Tokyo',
      dir: 'West',
      startDay: 'SUNDAY',
      endDay: 'MONDAY',
      desc: 'Crossing West → Add a day',
      q: 'What happens to the date?',
      options: ['Saturday', 'Sunday', 'Monday'],
      correct: 'Monday',
      startCoord: { x: 420, y: 130 },
      endCoord: { x: 120, y: 120 }
    },
    {
      id: 4,
      from: 'USA',
      to: 'Japan',
      dir: 'West',
      startDay: 'WEDNESDAY',
      endDay: 'THURSDAY',
      desc: 'Crossing West → Add a day',
      q: 'What happens to the date?',
      options: ['Tuesday', 'Wednesday', 'Thursday'],
      correct: 'Thursday',
      startCoord: { x: 520, y: 110 },
      endCoord: { x: 120, y: 120 }
    }
  ];

  const currentMission = missions[idlMission - 1];

  const startFlight = () => {
    setIdlAnimState('flying');
    setAnimProgress(0);
    
    // Animate to middle
    let p = 0;
    const interval = setInterval(() => {
      p += 0.05;
      if (p >= 0.5) {
        clearInterval(interval);
        setIdlAnimState('asked');
        setAnimProgress(0.5);
      } else {
        setAnimProgress(p);
      }
    }, 50);
  };

  const handleAnswer = (opt) => {
    setIdlAnswer(opt);
    if (opt === currentMission.correct) {
      setIdlAnimState('answered');
      
      // Finish flight
      let p = 0.5;
      const interval = setInterval(() => {
        p += 0.05;
        if (p >= 1) {
          clearInterval(interval);
          setAnimProgress(1);
        } else {
          setAnimProgress(p);
        }
      }, 50);
    }
  };

  const tabs = [
    { id: 'tz', label: 'Time Zones', sub: '15° = 1 hour' },
    { id: 'std', label: 'Local & Standard Time', sub: 'IST · GMT' },
    { id: 'idl', label: 'International Date Line', sub: '±1 day' }
  ];

  const renderClock = (cx, cy, r, hour, hl) => {
    const ha = ((hour % 12) * 30) * Math.PI / 180;
    const hx = cx + r * 0.5 * Math.sin(ha);
    const hy = cy - r * 0.5 * Math.cos(ha);
    const lines = [];
    for (let k = 0; k < 12; k++) {
      const a = k * 30 * Math.PI / 180;
      lines.push(<line key={k} x1={cx + r * 0.82 * Math.sin(a)} y1={cy - r * 0.82 * Math.cos(a)} x2={cx + r * 0.94 * Math.sin(a)} y2={cy - r * 0.94 * Math.cos(a)} stroke="#9fb0c0" strokeWidth="1" />);
    }
    return (
      <g key={cx}>
        <circle cx={cx} cy={cy} r={r} fill={hl ? '#fff5e0' : '#fff'} stroke={hl ? '#F5A623' : '#c9d4e0'} strokeWidth={hl ? 2.4 : 1.4} />
        {lines}
        <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.7} stroke="#20303f" strokeWidth="1.4" />
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#20303f" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="2.4" fill="#20303f" />
      </g>
    );
  };

  const renderTZExplorer = () => {
    return (
      <svg viewBox="0 0 640 240" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%', display: 'block' }}>
        <text x="200" y="40" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0E3556">Greenwich Time</text>
        {renderClock(200, 110, 50, 12, false)}
        <text x="200" y="190" textAnchor="middle" fontSize="14" fill="#5c6b7a" fontFamily="monospace">0° Longitude</text>
        
        <text x="440" y="40" textAnchor="middle" fontSize="16" fontWeight="700" fill="#c98511">Local Time</text>
        {renderClock(440, 110, 50, localTime(tzLon), true)}
        <text x="440" y="190" textAnchor="middle" fontSize="14" fill="#5c6b7a" fontFamily="monospace">
          {tzLon === 0 ? '0° GMT' : (Math.abs(tzLon) + '° ' + (tzLon > 0 ? 'East' : 'West'))}
        </text>
        <line x1="320" y1="60" x2="320" y2="160" stroke="#e4ebf3" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    );
  };

  const renderISTGlobe = () => {
    const ist = gmtH + 5.5;
    return (
      <svg viewBox="0 0 640 220" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%', display: 'block' }}>
        <text x="120" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0E3556">Greenwich (GMT)</text>
        {renderClock(120, 110, 54, gmtH, false)}
        <text x="120" y="196" textAnchor="middle" fontSize="12" fill="#5c6b7a" fontFamily="monospace">0° longitude</text>
        
        <text x="320" y="110" textAnchor="middle" fontSize="30" fill="#c9d4e0">+5:30 →</text>
        
        <text x="520" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill="#c98511">India (IST)</text>
        {renderClock(520, 110, 54, ist, true)}
        <text x="520" y="196" textAnchor="middle" fontSize="12" fill="#5c6b7a" fontFamily="monospace">82.5° E meridian</text>
      </svg>
    );
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
      <style>{`
        .tab-btn { flex: 1; font-family: inherit; font-weight: 700; cursor: pointer; border: none; background: transparent; color: var(--text-muted, #5c6b7a); border-radius: 10px; padding: 11px 8px; font-size: clamp(12px, 1.3vw, 14.5px); transition: all 0.2s; display: flex; flexDirection: column; gap: 1px; align-items: center; }
        .tab-btn.active { background: var(--navy, #0E3556); color: #fff; }
        .tab-btn small { font-weight: 400; font-size: 10.5px; opacity: 0.7; }
        .tab-btn.active small { opacity: 0.85; }
        
        .hist { background: #eef3ff; border-left: 4px solid #7c5cff; border-radius: 9px; padding: 11px 13px; margin: 10px 0; font-size: 12.5px; line-height: 1.5; color: #3a3a66; }
        .hist b { color: #7c5cff; }
        .kbox { background: #fbf5e6; border-left: 4px solid #F5A623; border-radius: 9px; padding: 11px 13px; margin: 10px 0; font-size: 13px; line-height: 1.5; color: #7a5a2a; }
        .kbox b { color: #0E3556; }
        
        .readout { background: #f4f7fb; border: 1px solid #e4ebf3; border-radius: 12px; padding: 12px 15px; margin-top: 10px; }
        .readout .big { font-size: clamp(18px, 2.2vw, 26px); font-weight: 800; color: #0E3556; }
        .readout .big span { color: #F5A623; }
        .readout .work { font-family: "IBM Plex Mono", monospace; font-size: 12px; color: #5c6b7a; margin-top: 5px; line-height: 1.5; }
        
        .chip { font-family: inherit; font-weight: 600; cursor: pointer; border: 1px solid #d6e0ec; background: #fff; color: #0E3556; border-radius: 8px; padding: 6px 11px; font-size: 12px; transition: all 0.15s; }
        .chip:hover { border-color: #7c5cff; background: #f5f2ff; }
        .chip.active { background: #0E3556; color: #fff; border-color: #0E3556; }
        
        .c-num { background: #f7f9fc; border: 1px solid #d6e0ec; border-radius: 9px; padding: 9px 11px; font-size: 14px; font-family: inherit; width: 100%; }
        .c-num:focus { outline: none; border-color: #7c5cff; }
      
        @media (max-width: 768px) {
          .panels-container { flex-direction: column !important; }
          .panel-left, .panel-right { flex: 1 !important; width: 100% !important; min-height: unset !important; }
        }
      `}</style>
      
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '6px', background: '#fff', borderRadius: '14px', padding: '6px', boxShadow: '0 8px 24px rgba(14,42,69,.1)', flexShrink: 0, marginBottom: '16px' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
            <small>{t.sub}</small>
          </button>
        ))}
      </div>

      <div className="panels-container" style={{ flex: 1, display: 'flex', gap: '18px', minHeight: 0 }}>
        {/* LEFT PANEL */}
        <div className="panel-left" style={{ flex: (activeTab === 'std' || activeTab === 'idl') ? 0.4 : 0.82, background: activeTab === 'std' ? '#fff' : 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRadius: '16px', padding: '24px', overflowY: 'auto', boxShadow: activeTab === 'std' ? '0 4px 12px rgba(0,0,0,0.05)' : '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'tz' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 3 · (a)</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Understanding time zones</h1>
              
              <ul style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '24px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>Earth rotates once every <b style={{ color: '#0E3556' }}>24 hours</b>.</li>
                <li>Earth has <b style={{ color: '#0E3556' }}>360°</b> of longitude.</li>
                <li>Every <b style={{ color: '#0E3556' }}>15°</b> of longitude equals <b style={{ color: '#0E3556' }}>1 hour</b>.</li>
                <li>Places <b style={{ color: '#0E3556' }}>east</b> are ahead in time. Places <b style={{ color: '#0E3556' }}>west</b> are behind.</li>
                <li><b style={{ color: '#0E3556' }}>Greenwich (0°)</b> is the starting reference for all time zones.</li>
              </ul>
              
              <div className="kbox" style={{ marginTop: 'auto' }}>
                <div style={{ fontWeight: 700, color: '#F5A623', fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Did You Know?</div>
                <div>India uses one Standard Time (IST) based on <b>82.5° East</b> longitude.</div>
              </div>
            </div>
          )}
          {activeTab === 'std' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: '8px' }}>
              
              {/* SECTION 1 */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '26px', margin: '0 0 16px' }}>Why is the time different?</h2>
                
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>☀️</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '16px', marginTop: '16px' }}>
                    <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>📍 Porbandar</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>"It is still bright here!"</div>
                      <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e2e8f0', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>WEST</div>
                    </div>
                    
                    <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', position: 'relative' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>📍 Tinsukia</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>"The Sun is already setting!"</div>
                      <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e2e8f0', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>EAST</div>
                    </div>
                  </div>
                </div>
                
                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#334155', marginTop: '16px', marginBottom: 0 }}>
                  Places in the east see the Sun earlier because the Earth rotates from west to east.
                </p>
              </div>

              {/* SECTION 2 */}
              <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(253, 230, 138, 0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '20px' }}>⚠️</div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#92400e' }}>If every city followed its own local time...</h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '24px', fontSize: '15px', color: '#92400e', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.4 }}>
                  <li>School timings would be confusing.</li>
                  <li>Train timings would be different in every city.</li>
                  <li>People would find it difficult to plan meetings.</li>
                </ul>
              </div>

              {/* SECTION 3 */}
              <div style={{ background: '#dcfce7', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(134, 239, 172, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '20px' }}>🇮🇳</div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#166534' }}>Indian Standard Time (IST)</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534', background: '#fff', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Different Local Times</div>
                  <div style={{ fontSize: '16px', color: '#15803d', fontWeight: 900 }}>↓</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#166534', background: '#fff', padding: '6px 12px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>One Common Time</div>
                  <div style={{ fontSize: '16px', color: '#15803d', fontWeight: 900 }}>↓</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', background: '#16a34a', padding: '8px 16px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(22, 163, 74, 0.2)' }}>Indian Standard Time (IST)</div>
                </div>
                
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#166534', textAlign: 'center', lineHeight: 1.4 }}>
                  Everyone in India follows one common time called IST.
                </p>
              </div>

              {/* SECTION 4 */}
              <div style={{ background: '#e0f2fe', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(125, 211, 252, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0369a1' }}>GMT</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0284c7', background: '#fff', padding: '4px 12px', borderRadius: '20px' }}>+5 hours 30 minutes</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0369a1' }}>IST</div>
                </div>
                
                <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#075985', textAlign: 'center', lineHeight: 1.4 }}>
                  India's Standard Time is 5 hours 30 minutes ahead of Greenwich Mean Time (GMT).
                </p>
              </div>

            </div>
          )}
          {activeTab === 'idl' && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '8px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Time zones & the date</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 24px', lineHeight: 1.2 }}>THE INTERNATIONAL DATE LINE</h1>
              
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '24px', color: '#334155' }}>
                The Earth is divided into time zones. Countries choose one standard time for everyday life. Opposite the Prime Meridian, near <b>180° longitude</b>, lies a special imaginary line called the <b>International Date Line</b>. When people cross this line, the date changes.
              </p>

              <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '24px', border: '2px solid #86efac', boxShadow: '0 4px 12px rgba(134, 239, 172, 0.2)', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⭐ Remember
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>Cross East ⬅</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#15803d' }}>Subtract one day</div>
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>Cross West ➡</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#15803d' }}>Add one day</div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', margin: '0 0 12px' }}>Why does this happen?</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.55, color: '#475569', margin: 0 }}>
                  Imagine you travel around the Earth. When you reach the opposite side of the globe, the calendar needs to stay correct. So, the date changes when crossing the International Date Line.
                </p>
              </div>

              <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(253,230,138,0.3)', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '20px' }}>🌍</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Did You Know?</div>
                </div>
                <div style={{ fontSize: '14px', color: '#92400e', lineHeight: 1.5 }}>
                  The International Date Line is not perfectly straight. It bends around some countries and islands so that one country does not have two different dates.
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155', marginBottom: '12px' }}>Countries with Multiple Time Zones</div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, fontSize: '13px', color: '#475569' }}>🇷🇺 <b>Russia</b> → 11 Time Zones</div>
                  <div style={{ flex: 1, fontSize: '13px', color: '#475569' }}>🇺🇸 <b>USA</b> → 6 Time Zones</div>
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>🇨🇦 <b>Canada</b> → 6 Time Zones</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', fontStyle: 'italic' }}>Large countries need more than one standard time.</div>
              </div>

              <div style={{ marginTop: 'auto', background: '#e0f2fe', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0369a1', marginBottom: '12px', textTransform: 'uppercase' }}>Key Takeaways</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#075985', fontWeight: 600 }}><span>✔</span> Time zones divide the Earth.</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#075985', fontWeight: 600 }}><span>✔</span> International Date Line is near 180°.</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#075985', fontWeight: 600 }}><span>✔</span> Crossing East → Previous Day</li>
                  <li style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#075985', fontWeight: 600 }}><span>✔</span> Crossing West → Next Day</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="panel-right" style={{ flex: (activeTab === 'std' || activeTab === 'idl') ? 0.6 : 1.18, background: activeTab === 'std' ? '#F7FAFC' : (activeTab === 'tz' ? '#F7FAFC' : '#fff'), borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: activeTab === 'std' ? 'none' : '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'tz' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0E3556', margin: '0 0 16px', textAlign: 'center' }}>Local Time Explorer</h2>
              
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '16px', marginBottom: '24px' }}>
                {renderTZExplorer()}
                
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <div style={{ fontSize: '16px', color: '#5c6b7a', marginBottom: '4px' }}>
                    Selected Longitude: <b style={{ color: '#0E3556' }}>{tzLon === 0 ? '0° GMT' : (Math.abs(tzLon) + '° ' + (tzLon > 0 ? 'East' : 'West'))}</b>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5A623' }}>
                    {fmt(localTime(tzLon))}
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <input type="range" style={{ width: '100%', accentColor: '#F5A623', cursor: 'pointer', height: '8px' }} min="-45" max="45" step="15" value={tzLon} onChange={e => setTzLon(Number(e.target.value))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, color: '#5c6b7a', marginTop: '8px' }}>
                  <span>← West (Earlier)</span>
                  <span style={{ color: '#0E3556' }}>Greenwich</span>
                  <span style={{ color: '#16a34a' }}>East (Later) →</span>
                </div>
              </div>
              
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', color: '#5c6b7a', fontWeight: 600, marginBottom: '8px' }}>At {Math.abs(tzLon) + '° ' + (tzLon >= 0 ? 'E' : 'W')}</div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#334155' }}>Time Difference</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#0E3556' }}>{Math.abs(tzLon)} ÷ 15 = {Math.abs(tzLon / 15)} hour{Math.abs(tzLon / 15) !== 1 ? 's' : ''}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#334155' }}>Greenwich Time</span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#5c6b7a' }}>12:00 pm</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e4ebf3' }}>
                  <span style={{ fontSize: '18px', fontWeight: 600, color: '#0E3556' }}>Local Time</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a' }}>{fmt(localTime(tzLon))}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="chip active" style={{ padding: '12px 24px', fontSize: '18px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556', borderRadius: '30px' }} onClick={() => setActiveTab('std')}>Next</button>
              </div>
            </div>
          )}

          {activeTab === 'std' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, fontFamily: '"Space Grotesk", system-ui, sans-serif', paddingRight: '8px' }}>
              
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0E3556', margin: '0 0 8px' }}>Let's Use Standard Time</h2>
                <div style={{ fontSize: '16px', color: '#5c6b7a' }}>We now know why India follows one common time. Let's use IST to solve everyday situations.</div>
              </div>

              {/* SECTION 1: Everyday Examples */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '16px' }}>Where do we use IST?</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚆</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Train Timetable</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Everyone follows the same time.</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>School</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Classes begin at one common time.</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✈️</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Flights</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Departure and arrival use IST.</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📺</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>Television</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Programs start at the same time across India.</div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Did You Know? */}
              <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(253,230,138,0.3)', border: '1px solid #fde68a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '20px' }}>💡</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Did You Know?</div>
                </div>
                <div style={{ fontSize: '15px', color: '#92400e', lineHeight: 1.5 }}>
                  India is almost 3,000 km wide from east to west. The Sun rises much earlier in Arunachal Pradesh than in Gujarat. Yet everyone follows the same IST clock.
                </div>
              </div>

              {/* SECTION 3: Quick Thinking */}
              <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '16px' }}>Think Before You Calculate</div>
                <div style={{ fontSize: '16px', color: '#334155', fontWeight: 600, marginBottom: '20px', textAlign: 'center' }}>
                  If it is 12:00 noon in London, do you think it is earlier or later in India?
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <button onClick={() => !quickThinkFb && setQuickThinkFb('earlier')} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 700, background: quickThinkFb === 'earlier' ? '#fee2e2' : '#f1f5f9', color: quickThinkFb === 'earlier' ? '#991b1b' : '#475569', border: quickThinkFb === 'earlier' ? '2px solid #ef4444' : '2px solid #cbd5e1', borderRadius: '12px', cursor: quickThinkFb === 'later' ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <input type="radio" checked={quickThinkFb === 'earlier'} readOnly style={{ accentColor: '#ef4444' }} /> Earlier
                    </div>
                  </button>
                  <button onClick={() => !quickThinkFb && setQuickThinkFb('later')} style={{ flex: 1, padding: '16px', fontSize: '18px', fontWeight: 700, background: quickThinkFb === 'later' ? '#dcfce7' : '#f1f5f9', color: quickThinkFb === 'later' ? '#166534' : '#475569', border: quickThinkFb === 'later' ? '2px solid #22c55e' : '2px solid #cbd5e1', borderRadius: '12px', cursor: quickThinkFb === 'later' ? 'default' : 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <input type="radio" checked={quickThinkFb === 'later'} readOnly style={{ accentColor: '#22c55e' }} /> Later
                    </div>
                  </button>
                </div>
                
                {quickThinkFb === 'earlier' && (
                  <div style={{ color: '#991b1b', fontSize: '14px', fontWeight: 600, textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                    Not quite! Remember, the Earth rotates from west to east, so places in the east are ahead in time. Try again!
                    <div style={{ marginTop: '8px' }}><button onClick={() => setQuickThinkFb(null)} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Retry</button></div>
                  </div>
                )}
                
                {quickThinkFb === 'later' && (
                  <div style={{ background: '#dcfce7', color: '#166534', padding: '16px', borderRadius: '12px', textAlign: 'center', animation: 'scaleIn 0.3s' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Excellent! 🎉</div>
                    <div style={{ fontSize: '15px', fontWeight: 600 }}>India is ahead of Greenwich by 5 hours 30 minutes.</div>
                  </div>
                )}
              </div>

              {/* SECTIONS 4 & 5: Calculator (Revealed only after correct prediction) */}
              {quickThinkFb === 'later' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                  <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                      <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, color: '#0E3556' }}>Try It Yourself</h3>
                      <div style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>Slide the time to see what happens in India!</div>
                    </div>
                    
                    {/* The Visual Result Box */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
                       {/* GMT Side */}
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
                          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Greenwich</div>
                          <div style={{ fontSize: '32px', fontWeight: 900, color: '#0E3556' }}>{fmt(gmtH)}</div>
                       </div>
                       
                       {/* Connection */}
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f1f5f9', padding: '8px 16px', borderRadius: '20px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#3b82f6' }}>+ 5h 30m</div>
                          <div style={{ fontSize: '20px', color: '#3b82f6', fontWeight: 900 }}>→</div>
                       </div>

                       {/* IST Side */}
                       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
                          <div style={{ fontSize: '14px', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>India</div>
                          <div style={{ fontSize: '32px', fontWeight: 900, color: '#f59e0b', background: '#fef3c7', padding: '4px 16px', borderRadius: '12px' }}>{fmt(gmtH + 5.5)}</div>
                       </div>
                    </div>

                    {/* Interactive Slider */}
                    <div style={{ position: 'relative', padding: '0 20px' }}>
                       <input 
                         type="range" 
                         min="0" 
                         max="23" 
                         value={gmtH} 
                         onChange={e => setGmtH(Number(e.target.value))}
                         style={{ width: '100%', accentColor: '#3b82f6', height: '8px', borderRadius: '4px', outline: 'none', cursor: 'pointer' }}
                       />
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px' }}>
                          <div style={{ textAlign: 'center', cursor: 'pointer', opacity: gmtH === 8 ? 1 : 0.5, transition: 'opacity 0.2s' }} onClick={() => setGmtH(8)}>
                             <div style={{ fontSize: '20px' }}>🌅</div>
                             <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>Morning</div>
                          </div>
                          <div style={{ textAlign: 'center', cursor: 'pointer', opacity: gmtH === 12 ? 1 : 0.5, transition: 'opacity 0.2s' }} onClick={() => setGmtH(12)}>
                             <div style={{ fontSize: '20px' }}>☀️</div>
                             <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>Noon</div>
                          </div>
                          <div style={{ textAlign: 'center', cursor: 'pointer', opacity: gmtH === 18 ? 1 : 0.5, transition: 'opacity 0.2s' }} onClick={() => setGmtH(18)}>
                             <div style={{ fontSize: '20px' }}>🌇</div>
                             <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>Evening</div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* SECTION 6: Remember */}
                  <div style={{ background: '#f0fdf4', borderRadius: '16px', padding: '24px', border: '2px solid #86efac', boxShadow: '0 4px 12px rgba(134, 239, 172, 0.2)', marginBottom: '24px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#166534', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remember</div>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ color: '#16a34a', fontSize: '18px' }}>✔</div>
                        <div style={{ fontSize: '15px', color: '#15803d', fontWeight: 600 }}>Different cities can have different local times.</div>
                      </li>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ color: '#16a34a', fontSize: '18px' }}>✔</div>
                        <div style={{ fontSize: '15px', color: '#15803d', fontWeight: 600 }}>India avoids confusion by using IST.</div>
                      </li>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ color: '#16a34a', fontSize: '18px' }}>✔</div>
                        <div style={{ fontSize: '15px', color: '#15803d', fontWeight: 600 }}>IST is always GMT + 5 hours 30 minutes.</div>
                      </li>
                    </ul>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button onClick={() => setActiveTab('tz')} style={{ padding: '16px 24px', background: '#f1f5f9', color: '#475569', fontSize: '16px', fontWeight: 700, border: '1px solid #cbd5e1', borderRadius: '12px', cursor: 'pointer' }}>← Back to Time Zones</button>
                    <button onClick={() => setActiveTab('idl')} style={{ flex: 1, padding: '16px', background: '#0E3556', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14,53,86,0.2)' }}>
                      Continue → International Date Line
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'idl' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, fontFamily: '"Space Grotesk", system-ui, sans-serif' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0E3556', margin: '0 0 4px' }}>🌍 Around the World Flight</h2>
                  <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Help the airplane complete its journey. Watch the calendar!</div>
                </div>
                {idlMission <= 4 && (
                  <div style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Mission {idlMission} / 4
                  </div>
                )}
              </div>

              {idlMission <= 4 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* The Interactive Globe / Map */}
                  <div style={{ position: 'relative', width: '100%', height: '260px', background: '#e0f2fe', borderRadius: '16px', overflow: 'hidden', border: '1px solid #bae6fd', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.05)' }}>
                    
                    {/* SVG Map representing the Pacific Ocean centered Date Line */}
                    <svg viewBox="0 0 600 260" style={{ width: '100%', height: '100%', display: 'block' }}>
                      <defs>
                        <linearGradient id="oceanFade" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#bae6fd" />
                          <stop offset="100%" stopColor="#7dd3fc" />
                        </linearGradient>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#oceanFade)" />
                      
                      {/* Continents mock */}
                      <path d="M 0 50 Q 50 40 80 80 T 150 140 Q 120 180 80 200 Q 40 220 0 200 Z" fill="#bbf7d0" stroke="#86efac" strokeWidth="2" />
                      <text x="60" y="120" fontSize="14" fontWeight="800" fill="#166534">Asia</text>
                      <circle cx="120" cy="120" r="5" fill="#ef4444" />
                      <text x="120" y="110" fontSize="12" fontWeight="700" fill="#0f172a" textAnchor="middle">Tokyo</text>

                      <path d="M 20 220 Q 60 210 80 250 T 160 260 L 0 260 Z" fill="#bbf7d0" stroke="#86efac" strokeWidth="2" />
                      <text x="100" y="245" fontSize="14" fontWeight="800" fill="#166534">Australia</text>
                      <circle cx="140" cy="180" r="5" fill="#ef4444" />
                      <text x="140" y="170" fontSize="12" fontWeight="700" fill="#0f172a" textAnchor="middle">Sydney</text>

                      <path d="M 450 0 Q 500 50 600 60 L 600 0 Z" fill="#bbf7d0" stroke="#86efac" strokeWidth="2" />
                      <path d="M 500 80 Q 550 120 600 140 L 600 80 Z" fill="#bbf7d0" stroke="#86efac" strokeWidth="2" />
                      <text x="550" y="40" fontSize="14" fontWeight="800" fill="#166534">N. America</text>
                      
                      <circle cx="500" cy="140" r="5" fill="#ef4444" />
                      <text x="500" y="130" fontSize="12" fontWeight="700" fill="#0f172a" textAnchor="middle">LA</text>

                      <circle cx="420" cy="130" r="5" fill="#ef4444" />
                      <text x="420" y="120" fontSize="12" fontWeight="700" fill="#0f172a" textAnchor="middle">Honolulu</text>
                      
                      {/* Date Line */}
                      <path d="M 300 0 L 300 80 L 330 100 L 330 150 L 300 180 L 300 260" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" opacity="0.8" />
                      <text x="300" y="20" fontSize="12" fontWeight="800" fill="#d97706" textAnchor="middle" background="#fff">DATE LINE (180°)</text>

                      {/* Flight Path */}
                      <path 
                        d={`M ${currentMission.startCoord.x} ${currentMission.startCoord.y} Q 300 50 ${currentMission.endCoord.x} ${currentMission.endCoord.y}`} 
                        fill="none" 
                        stroke="#0E3556" 
                        strokeWidth="2" 
                        strokeDasharray="4 4" 
                        opacity="0.3" 
                      />

                      {/* Airplane */}
                      {idlAnimState !== 'ready' && (
                        <g style={{ 
                          transform: `translate(${
                            currentMission.startCoord.x + (currentMission.endCoord.x - currentMission.startCoord.x) * animProgress
                          }px, ${
                            currentMission.startCoord.y + (currentMission.endCoord.y - currentMission.startCoord.y) * animProgress - Math.sin(animProgress * Math.PI) * 40
                          }px)`,
                          transition: 'transform 0.05s linear'
                        }}>
                          <text x="0" y="0" fontSize="24" textAnchor="middle" dominantBaseline="middle" 
                                style={{ transform: `scaleX(${currentMission.dir === 'West' ? -1 : 1})` }}>
                            ✈️
                          </text>
                        </g>
                      )}
                    </svg>

                    {/* Mission Overlay */}
                    {idlAnimState === 'ready' && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0E3556', marginBottom: '8px' }}>
                          Mission: {currentMission.from} ➔ {currentMission.to}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '24px' }}>
                          Direction: Travel {currentMission.dir}
                        </div>
                        <button onClick={startFlight} style={{ padding: '16px 32px', fontSize: '18px', fontWeight: 700, background: '#0E3556', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(14,53,86,0.3)', transition: 'transform 0.1s' }} onMouseDown={e=>e.target.style.transform='scale(0.95)'} onMouseUp={e=>e.target.style.transform='none'}>
                          Start Journey ✈️
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Below Globe: Calendar & Story */}
                  <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flex: 1 }}>
                    {/* Calendar Card */}
                    <div style={{ width: '160px', background: '#fff', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ background: '#ef4444', padding: '12px', textAlign: 'center', color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '2px' }}>CALENDAR</div>
                      <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '24px', position: 'relative' }}>
                        
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', transition: 'all 0.5s', transform: (idlAnimState === 'answered' && animProgress >= 0.5) ? 'rotateX(-90deg)' : 'rotateX(0)', opacity: (idlAnimState === 'answered' && animProgress >= 0.5) ? 0 : 1, position: 'absolute' }}>
                          {currentMission.startDay}
                        </div>
                        
                        <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', transition: 'all 0.5s', transform: (idlAnimState === 'answered' && animProgress >= 0.5) ? 'rotateX(0)' : 'rotateX(90deg)', opacity: (idlAnimState === 'answered' && animProgress >= 0.5) ? 1 : 0, position: 'absolute' }}>
                          {currentMission.endDay}
                        </div>

                      </div>
                    </div>

                    {/* Question / Explanation Panel */}
                    <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      {idlAnimState === 'ready' && (
                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: '#475569' }}>
                          Ready to Fly!
                        </div>
                      )}
                      
                      {idlAnimState === 'flying' && (
                        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, color: '#0E3556', animation: 'pulse 1s infinite' }}>
                          Flying across the ocean...
                        </div>
                      )}

                      {idlAnimState === 'asked' && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0E3556', marginBottom: '16px', textAlign: 'center' }}>
                            {currentMission.q}
                          </div>
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            {currentMission.options.map(opt => (
                              <button key={opt} onClick={() => handleAnswer(opt)} style={{ padding: '12px 24px', background: idlAnswer === opt ? (opt === currentMission.correct ? '#16a34a' : '#dc2626') : '#fff', color: idlAnswer === opt ? '#fff' : '#334155', border: '2px solid', borderColor: idlAnswer === opt ? (opt === currentMission.correct ? '#16a34a' : '#dc2626') : '#cbd5e1', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                                {opt}
                              </button>
                            ))}
                          </div>
                          {idlAnswer && idlAnswer !== currentMission.correct && (
                            <div style={{ textAlign: 'center', color: '#dc2626', fontWeight: 600, marginTop: '12px', fontSize: '14px', animation: 'fadeIn 0.2s' }}>
                              Not quite! Check the rule on the left.
                            </div>
                          )}
                        </div>
                      )}

                      {idlAnimState === 'answered' && (
                        <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a', marginBottom: '8px' }}>
                            Excellent! 🎉
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginBottom: '16px' }}>
                            You crossed the International Date Line. Because you travelled {currentMission.dir}, the date {currentMission.dir === 'East' ? 'moved back' : 'moved forward'} by one day.
                          </div>
                          {animProgress >= 1 && (
                            <button onClick={() => {
                              setIdlMission(m => m + 1);
                              setIdlAnimState('ready');
                              setIdlAnswer(null);
                            }} style={{ padding: '12px 24px', background: '#0E3556', color: '#fff', fontSize: '16px', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer' }}>
                              Next Mission →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Completion Screen */
                <div style={{ flex: 1, background: '#fff', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0E3556', margin: '0 0 16px' }}>Congratulations!</h2>
                  <div style={{ fontSize: '16px', color: '#475569', textAlign: 'center', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
                    You discovered one of the most interesting facts in Geography. Now you know why calendars change while travelling around the world!
                  </div>
                  
                  <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>Cross East ⬅</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>Previous Day</div>
                    </div>
                    <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>Cross West ➡</div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#15803d' }}>Next Day</div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={activeTab === 'idl' && idlMission > 4 ? 'Finish Chapter' : undefined}
        onNext={activeTab === 'idl' && idlMission > 4 ? () => setActiveTab('tz') : undefined}
        nextVariant="green"
      />
    </div>
  );
}
