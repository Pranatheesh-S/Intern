import React, { useState } from 'react';

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

export default function TimeZonesPage() {
  const [activeTab, setActiveTab] = useState('tz');

  // TZ State
  const [tzLon, setTzLon] = useState(30);

  // STD State
  const [gmtH, setGmtH] = useState(12);
  const [istMode, setIstMode] = useState('calc'); // 'calc' or 'porbandar'

  // IDL State
  const [idlDir, setIdlDir] = useState('E');
  const [offGmt, setOffGmt] = useState(12);
  const [offVal, setOffVal] = useState(5.5);

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

  const renderTZStrip = () => {
    const zones = [-45, -30, -15, 0, 15, 30, 45];
    const step = 88, x0 = 56, cy = 90, r = 34;
    return (
      <svg viewBox="0 0 640 240" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%', display: 'block' }}>
        {zones.map((lon, i) => {
          const cx = x0 + i * step;
          const hr = localTime(lon);
          const hl = (lon === Math.max(-45, Math.min(45, tzLon)) && Math.abs(tzLon) <= 45);
          return (
            <g key={lon}>
              {renderClock(cx, cy, r, hr, hl)}
              <text x={cx} y={cy + r + 18} textAnchor="middle" fontSize="12" fontWeight="700" fill={hl ? '#c98511' : '#0E3556'}>{fmt(hr)}</text>
              <text x={cx} y={cy + r + 32} textAnchor="middle" fontSize="10" fill="#5c6b7a" fontFamily="monospace">{lon === 0 ? '0° GMT' : (Math.abs(lon) + '°' + (lon > 0 ? 'E' : 'W'))}</text>
            </g>
          );
        })}
        <line x1="30" y1="200" x2="610" y2="200" stroke="#c9d4e0" />
        <text x="150" y="222" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3b82c4">← WEST · earlier</text>
        <text x="470" y="222" textAnchor="middle" fontSize="10" fontWeight="700" fill="#e0781f">EAST · later →</text>
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

  const renderIDL = () => {
    return (
      <svg viewBox="0 0 640 260" style={{ width: '100%', height: '100%', maxHeight: '100%', maxWidth: '100%', display: 'block' }}>
        <rect x="10" y="20" width="620" height="200" rx="8" fill="#eaf3fb" stroke="#9fbdd8" />
        <line x1="320" y1="20" x2="320" y2="220" stroke="#c79a3e" strokeWidth="2" />
        <text x="320" y="14" textAnchor="middle" fontSize="10" fill="#c79a3e" fontFamily="monospace">Prime Meridian 0°</text>
        
        <line x1="30" y1="20" x2="30" y2="220" stroke="#d94a3d" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1="610" y1="20" x2="610" y2="220" stroke="#d94a3d" strokeWidth="2.5" strokeDasharray="6 4" />
        <text x="30" y="238" textAnchor="middle" fontSize="10" fontWeight="700" fill="#d94a3d">180° · Date Line</text>
        <text x="610" y="238" textAnchor="middle" fontSize="10" fontWeight="700" fill="#d94a3d">180° · Date Line</text>
        
        <text x="120" y="120" textAnchor="middle" fontSize="12" fill="#5c6b7a">−12</text>
        <text x="520" y="120" textAnchor="middle" fontSize="12" fill="#5c6b7a">+12</text>
        <text x="320" y="120" textAnchor="middle" fontSize="12" fill="#5c6b7a">GMT</text>
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

      <div style={{ flex: 1, display: 'flex', gap: '18px', minHeight: 0 }}>
        {/* LEFT PANEL */}
        <div style={{ flex: 0.82, background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)', borderRadius: '16px', padding: '24px', overflowY: 'auto', boxShadow: '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'tz' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Big Question 3</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>Understanding time zones</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>The Earth spins west → east, making a full turn (<b style={{ color: '#0E3556' }}>360°</b>) every <b style={{ color: '#0E3556' }}>24 hours</b>. That works out to <b style={{ color: '#0E3556' }}>15° per hour</b> (15 × 24 = 360).</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Mark the meridians every 15°. Moving <b style={{ color: '#0E3556' }}>east</b> of the Prime Meridian each 15° <b style={{ color: '#0E3556' }}>adds</b> an hour of <b style={{ color: '#0E3556' }}>local time</b>; moving <b style={{ color: '#0E3556' }}>west</b> each 15° <b style={{ color: '#0E3556' }}>subtracts</b> one. If it's 12 noon at Greenwich, it's 1 pm at 15°E, 2 pm at 30°E… and 11 am at 15°W, 10 am at 30°W.</p>
              <div className="kbox">🗺️ India stretches roughly <b>8°N–37°N</b> and <b>68°E–97°E</b> — wide enough that its east and west edges see the Sun at different times.</div>
            </>
          )}
          {activeTab === 'std' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Local vs standard time</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>One clock for a country</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Two friends phone each other — one in <b style={{ color: '#0E3556' }}>Porbandar (Gujarat, west)</b>, one in <b style={{ color: '#0E3556' }}>Tinsukia (Assam, east)</b>. In Assam the Sun has already set; in Gujarat it's still daylight. With about <b style={{ color: '#0E3556' }}>30°</b> of longitude between them, their <b style={{ color: '#0E3556' }}>local</b> times differ by 2 hours.</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Using many local times would be chaos, so a country adopts a <b style={{ color: '#0E3556' }}>standard time</b> based on one meridian. <b style={{ color: '#0E3556' }}>Indian Standard Time (IST)</b> is <b style={{ color: '#0E3556' }}>5 hours 30 minutes</b> ahead of <b style={{ color: '#0E3556' }}>Greenwich Mean Time (GMT)</b>.</p>
              <div className="hist">🕉️ <b>Don't miss out:</b> Greenwich wasn't the first prime meridian. Long before Europe, India used the <b>madhya rekhā</b> ('middle line') through <b>Ujjayinī (Ujjain)</b> — where the astronomer <b>Varāhamihira</b> worked ~1,500 years ago — as the reference for its astronomical texts.</div>
            </>
          )}
          {activeTab === 'idl' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#F5A623', fontWeight: 600 }}>Time zones & the date</div>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, color: '#0E3556', fontSize: '32px', margin: '8px 0 16px' }}>The International Date Line</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Standard times are grouped into <b style={{ color: '#0E3556' }}>time zones</b> that bend along borders so each country keeps one time. On a world map, the number inside a country is the hours to <b style={{ color: '#0E3556' }}>add to GMT</b> (if +) or <b style={{ color: '#0E3556' }}>subtract</b> (if −).</p>
              <p style={{ fontSize: '15px', lineHeight: 1.55, marginBottom: '12px' }}>Opposite the Prime Meridian, near <b style={{ color: '#0E3556' }}>180°</b>, runs the <b style={{ color: '#0E3556' }}>International Date Line</b>. The +12 and −12 zones meet here. Cross it going <b style={{ color: '#0E3556' }}>east → subtract a day</b>; going <b style={{ color: '#0E3556' }}>west → add a day</b>. It zig-zags to avoid splitting a country across two dates.</p>
              <div className="kbox">🕐 Not every country has one time: the <b>USA has 6</b> time zones and <b>Russia has 11</b> — crossing Russia east→west you'd reset your watch 10 times.</div>
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1.18, background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '0 16px 40px rgba(14,42,69,.12)' }}>
          {activeTab === 'tz' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderTZStrip()}
              </div>
              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target longitude (drag) · noon at Greenwich</label>
                <input type="range" style={{ width: '100%', accentColor: '#7c5cff' }} min="-180" max="180" step="15" value={tzLon} onChange={e => setTzLon(Number(e.target.value))} />
              </div>
              <div className="readout">
                <div className="big">At {Math.abs(tzLon) === 180 ? '180°' : (Math.abs(tzLon) + '°' + (tzLon > 0 ? 'E' : tzLon < 0 ? 'W' : ' (GMT)'))}, local time = <span>{fmt(localTime(tzLon))}</span></div>
                <div className="work">Computed: 12:00 + ({tzLon} ÷ 15) = 12 {tzLon >= 0 ? '+' : '−'} {Math.abs(tzLon / 15).toFixed(2)} h. Every 15° of longitude = 1 hour.</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setActiveTab('std')}>Continue → Standard Time</button>
              </div>
            </div>
          )}

          {activeTab === 'std' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderISTGlobe()}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginTop: '16px' }}>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Time at Greenwich (GMT, 24h)</label>
                  <input type="number" className="c-num" value={gmtH} min="0" max="23" step="0.5" onChange={e => setGmtH(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#5c6b7a' }}>Try:</span>
                <button className="chip" onClick={() => { setGmtH(12); setIstMode('calc'); }}>Noon in London</button>
                <button className="chip" onClick={() => setIstMode('porbandar')}>Porbandar ↔ Tinsukia</button>
              </div>
              
              {istMode === 'calc' && (
                <div className="readout">
                  <div className="big">GMT {fmt(gmtH)} → IST <span>{fmt(gmtH + 5.5)}</span></div>
                  <div className="work">IST = GMT + 5 h 30 min. So noon in London (12:00) becomes 5:30 pm in India.</div>
                </div>
              )}
              {istMode === 'porbandar' && (
                <div className="readout">
                  <div className="big">Porbandar ↔ Tinsukia: <span>2 hours</span> apart</div>
                  <div className="work">30° of longitude ÷ 15 = 2 h of local-time difference. Tinsukia (east) is ahead, so its Sun sets earlier — yet both cities keep the same IST.</div>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setActiveTab('tz')}>← Back to Time Zones</button>
                <button className="chip active" style={{ padding: '10px 20px', fontSize: '14px', background: '#0E3556', color: '#fff', border: '1px solid #0E3556' }} onClick={() => setActiveTab('idl')}>Continue → Date Line</button>
              </div>
            </div>
          )}

          {activeTab === 'idl' && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '6px' }}>
                {renderIDL()}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginTop: '16px', flexWrap: 'wrap' }}>
                <button className={`chip ${idlDir === 'E' ? 'active' : ''}`} onClick={() => setIdlDir('E')}>✈ Cross East →</button>
                <button className={`chip ${idlDir === 'W' ? 'active' : ''}`} onClick={() => setIdlDir('W')}>← Cross West ✈</button>
                <div style={{ flex: 1 }} />
                <div style={{ maxWidth: '260px' }}>
                  <label style={{ fontSize: '11px', color: '#5c6b7a', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Country GMT offset (h) · GMT time
                    <input type="number" className="c-num" style={{ width: '70px', display: 'inline-block', padding: '5px 8px', marginLeft: '6px' }} value={offGmt} min="0" max="23" step="0.5" onChange={e => setOffGmt(Number(e.target.value) || 0)} />
                  </label>
                  <input type="number" className="c-num" value={offVal} step="0.5" onChange={e => setOffVal(Number(e.target.value) || 0)} />
                </div>
              </div>
              
              <div className="readout">
                {idlDir === 'E' && (
                  <>
                    <div className="big">Crossing East → <span>subtract a day</span></div>
                    <div className="work">e.g. Monday becomes Sunday. (The +12 and −12 zones meet at ~180°.)</div>
                  </>
                )}
                {idlDir === 'W' && (
                  <>
                    <div className="big">Crossing West → <span>add a day</span></div>
                    <div className="work">e.g. Sunday becomes Monday.</div>
                  </>
                )}
              </div>
              
              <div className="readout" style={{ marginTop: '16px' }}>
                <div className="big">GMT {offVal >= 0 ? '+' : '−'}{Math.abs(offVal)} → <span>{fmt(offGmt + offVal)}</span></div>
                <div className="work">Standard time = GMT {fmt(offGmt)} {offVal >= 0 ? '+' : '−'} {Math.abs(offVal)} h. (India's +5.5 turns noon GMT into 5:30 pm.)</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                <button className="chip" style={{ padding: '10px 20px', fontSize: '14px', background: '#fff', color: '#5c6b7a', border: '1px solid #d6e0ec' }} onClick={() => setActiveTab('std')}>← Back to Standard Time</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
