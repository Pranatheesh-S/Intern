import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, ArrowLeft, Target } from 'lucide-react';
import './CoordinatesPageDark.css';
import worldMapUrl from './world-map.jpg';

const cases = [
  { id: 1, title: 'Case 1 - Both in India', loc1: 'Porbandar', loc2: 'Tinsukia' },
  { id: 2, title: 'Case 2 - India ⇄ Japan', loc1: 'Delhi', loc2: 'Tokyo' },
  { id: 3, title: 'Case 3 - India ⇄ UK', loc1: 'Mumbai', loc2: 'London' },
  { id: 4, title: 'Case 4 - India ⇄ USA', loc1: 'Chennai', loc2: 'New York' },
];

const caseData = {
  1: {
    friendA: {
      name: 'Aarav', avatar: '👦🏽', locLabel: 'Porbandar, Gujarat', lonString: '69°E', tzString: 'IST (GMT+5:30)',
      lon: 69.6, offsetMins: 0,
      chatBg: '#064e3b', chatBorder: '#047857', chatNameColor: '#34d399',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    friendB: {
      name: 'Meghna', avatar: '👧🏽', locLabel: 'Tinsukia, Assam', lonString: '95°E', tzString: 'IST (GMT+5:30)',
      lon: 95.3, offsetMins: 0,
      chatBg: '#451a03', chatBorder: '#78350f', chatNameColor: '#fbbf24',
      paneBgGradient: 'linear-gradient(to bottom, #332128, #170f14)', paneBorder: '#4a333c'
    },
    relationText: "⇄\nSame clock\ndiff. sky!",
    summaryFormat: (timeA, timeB) => `When it is ${timeA} in Porbandar, it is ${timeB} in Tinsukia.`,
    sliderLabel: "Move the time in Porbandar:",
    chatScript: [
      { friend: 'A', text: "Hi Meghna! It's half past five in the evening here in Porbandar, and the sun is still shining brightly!" },
      { friend: 'B', text: "Really? My watch also says 5:30 — but here in Tinsukia the sun has already set and it's getting dark!" },
      { friend: 'A', text: "How can it be dark there when both our clocks show the very same time?" },
      { friend: 'B', text: "Because Assam is in the far east of India. The sun rises and sets there almost two hours earlier than in Gujarat." },
      { friend: 'A', text: "Ah! But all of India follows one Indian Standard Time, so our watches match even though our skies do not." },
      { friend: 'B', text: "Exactly — same standard time, but different local sun time!" }
    ],
    mapDots: [
      { lon: 69.6, latPercent: 38, label: 'Porbandar', labelOffset: 8, color: '#10b981', labelColor: '#34d399' },
      { lon: 95.3, latPercent: 34.7, label: 'Tinsukia', labelOffset: -16, color: '#f59e0b', labelColor: '#fbbf24' }
    ]
  },
  2: {
    friendA: {
      name: 'Rohan', avatar: '🧑🏽', locLabel: 'Delhi, India', lonString: '77°E', tzString: 'IST (GMT+5:30)',
      lon: 77.2, offsetMins: 0,
      chatBg: '#0f3a4a', chatBorder: '#0c4a6e', chatNameColor: '#38bdf8',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    friendB: {
      name: 'Yuki', avatar: '👱‍♀️', locLabel: 'Tokyo, Japan', lonString: '139°E', tzString: 'JST (GMT+9)',
      lon: 139.7, offsetMins: 210, // 3.5 hours ahead
      chatBg: '#3b252d', chatBorder: '#5c3a46', chatNameColor: '#f472b6',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    relationText: "⇄\nTokyo is\n3½ h ahead",
    summaryFormat: (timeA, timeB) => `When it is ${timeA} in Delhi, it is ${timeB} in Tokyo.`,
    sliderLabel: "Move the time in Delhi:",
    chatScript: [
      { friend: 'A', text: "Good afternoon, Yuki! It's 12 noon here in Delhi — time for lunch!" },
      { friend: 'B', text: "Hello Rohan! Here in Tokyo it is already half past three in the afternoon." },
      { friend: 'A', text: "So you are three and a half hours ahead of me!" },
      { friend: 'B', text: "Yes. Japan lies far to the east, and since the Earth turns from west to east, the east meets the sun first." },
      { friend: 'A', text: "So while I'm eating lunch, you're almost ready for evening tea!" }
    ],
    mapDots: [
      { lon: 77.2, latPercent: 36, label: 'Delhi', labelOffset: -16, color: '#38bdf8', labelColor: '#7dd3fc' },
      { lon: 139.7, latPercent: 32, label: 'Tokyo', labelOffset: -16, color: '#f472b6', labelColor: '#fbcfe8' }
    ]
  },
  3: {
    friendA: {
      name: 'Priya', avatar: '👩🏽', locLabel: 'Mumbai, India', lonString: '73°E', tzString: 'IST (GMT+5:30)',
      lon: 72.8, offsetMins: 0,
      chatBg: '#0f3a4a', chatBorder: '#0c4a6e', chatNameColor: '#38bdf8',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    friendB: {
      name: 'George', avatar: '👱🏼‍♂️', locLabel: 'London, UK', lonString: '0°', tzString: 'GMT (GMT+0)',
      lon: -0.1, offsetMins: -330, // UK is 5.5 hours behind IST
      chatBg: '#3b252d', chatBorder: '#5c3a46', chatNameColor: '#f472b6',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    relationText: "⇄\nLondon is\n5½ h behind",
    summaryFormat: (timeA, timeB) => `When it is ${timeA} in Mumbai, it is ${timeB} in London.`,
    sliderLabel: "Move the time in Mumbai:",
    chatScript: [
      { friend: 'A', text: "Hi George! It's 12 noon here in Mumbai — the sun is right overhead." },
      { friend: 'B', text: "Hello Priya! It is only half past six in the morning here in London. I've just woken up!" },
      { friend: 'A', text: "I'm five and a half hours ahead of you." },
      { friend: 'B', text: "That's right. London sits on the Prime Meridian at zero degrees, and India is to the east, so your day starts before mine." },
      { friend: 'A', text: "By the time you finish breakfast, I'll be having my lunch!" }
    ],
    mapDots: [
      { lon: 72.8, latPercent: 40, label: 'Mumbai', labelOffset: 8, color: '#38bdf8', labelColor: '#7dd3fc' },
      { lon: -0.1, latPercent: 25, label: 'London', labelOffset: -12, color: '#f472b6', labelColor: '#fbcfe8' }
    ]
  },
  4: {
    friendA: {
      name: 'Isha', avatar: '👩🏽', locLabel: 'Chennai, India', lonString: '80°E', tzString: 'IST (GMT+5:30)',
      lon: 80.2, offsetMins: 0,
      chatBg: '#0f3a4a', chatBorder: '#0c4a6e', chatNameColor: '#38bdf8',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    friendB: {
      name: 'Jake', avatar: '👱🏼‍♂️', locLabel: 'New York, USA', lonString: '74°W', tzString: 'EST (GMT-5)',
      lon: -74, offsetMins: -630, // 10.5 hours behind IST
      chatBg: '#3b252d', chatBorder: '#5c3a46', chatNameColor: '#f472b6',
      paneBgGradient: 'linear-gradient(to bottom, #1e293b, #0f172a)', paneBorder: '#334155'
    },
    relationText: "⇄\nNew York is\n10½ h behind",
    summaryFormat: (timeA, timeB) => `When it is ${timeA} in Chennai, it is ${timeB} in New York.`,
    sliderLabel: "Move the time in Chennai:",
    chatScript: [
      { friend: 'A', text: "Hi Jake! It's 12 noon here in Chennai. What are you up to?" },
      { friend: 'B', text: "Whoa, Isha — it's half past one in the morning here in New York! I really should be asleep!" },
      { friend: 'A', text: "You're ten and a half hours behind me!" },
      { friend: 'B', text: "Yes. America is far to the west, almost on the opposite side of the globe. When it's daytime for you, it's the middle of the night for me." },
      { friend: 'A', text: "So when you wake up for school, I'll be finishing my whole day!" }
    ],
    mapDots: [
      { lon: 80.2, latPercent: 45, label: 'Chennai', labelOffset: 8, color: '#38bdf8', labelColor: '#7dd3fc' },
      { lon: -74, latPercent: 30, label: 'New York', labelOffset: -12, color: '#f472b6', labelColor: '#fbcfe8' }
    ]
  }
};

export default function TwoFriendsActivity({ onBack, onNextActivity }) {
  const [activeCase, setActiveCase] = useState(1);
  const [timeMins, setTimeMins] = useState(17 * 60 + 30); // Default to 5:30 PM for case 1
  const [playing, setPlaying] = useState(false);
  const [chatStep, setChatStep] = useState(-1);
  const [quizAnswer, setQuizAnswer] = useState(null);

  useEffect(() => {
    // Set initial time when switching cases
    if (activeCase === 1) setTimeMins(17 * 60 + 30); // 5:30 PM
    if (activeCase === 2) setTimeMins(12 * 60 + 0);  // 12:00 PM
    if (activeCase === 3) setTimeMins(12 * 60 + 0);  // 12:00 PM
    if (activeCase === 4) setTimeMins(12 * 60 + 0);  // 12:00 PM
    setPlaying(false);
  }, [activeCase]);

  const data = caseData[activeCase] || caseData[1];
  const istMins = timeMins;
  
  // Math for sun (simplified for layout)
  const sunLon = -((istMins / 60 - 12) * 15 - 82.5); // Sun's current longitude relative to map
  
  const getSunStatus = (lon) => {
    let diff = lon - sunLon;
    while(diff < -180) diff += 360;
    while(diff > 180) diff -= 360;
    if (diff > -85 && diff < 85) return "☀️ Daytime";
    if (diff >= 85 && diff <= 98) return "🌆 Sunset";
    if (diff <= -85 && diff >= -98) return "🌅 Sunrise";
    return "🌙 Night";
  };

  const format12 = (m) => {
    let mt = Math.round(m);
    while(mt < 0) mt += 24*60;
    while(mt >= 24*60) mt -= 24*60;
    const hr = Math.floor(mt / 60);
    const mn = mt % 60;
    const ap = hr < 12 ? 'AM' : 'PM';
    let h = hr % 12;
    if (h === 0) h = 12;
    return `${h}:${mn.toString().padStart(2,'0')} ${ap}`;
  };

  useEffect(() => {
    let interval;
    if (playing) {
      interval = setInterval(() => {
        setTimeMins(m => (m + 15) % 1440);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const timeA = format12(istMins + data.friendA.offsetMins);
  const timeB = format12(istMins + data.friendB.offsetMins);

  return (
    <div className="dark-coords-page">
      <div className="dark-coords-main-content">
        {/* LEFT PANE */}
        <div className="dark-coords-left" style={{ padding: '16px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          <div>
            <h2 style={{ color: '#6ee7b7', margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌍 Two Friends, Two Times — live time zones
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '17px', margin: '6px 0', lineHeight: '1.5' }}>
              When two friends in different places talk, their clocks — and their skies — may not agree, because time depends on <strong>longitude</strong>. Pick a case, <strong>slide the time in India</strong> to watch both clocks and the day/night map move, then press ▶ <strong>Play</strong> to hear the friends talk. Choose each friend's voice below.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {cases.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveCase(c.id)}
                style={{ 
                  background: activeCase === c.id ? '#10b981' : '#1e293b', 
                  color: activeCase === c.id ? '#0f172a' : '#e2e8f0', 
                  border: '1px solid #334155', 
                  borderRadius: '6px', 
                  padding: '8px 10px', 
                  fontSize: '13px', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {c.title} <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: 'normal', marginLeft: '4px' }}>({c.loc1} ⇄ {c.loc2})</span>
              </button>
            ))}
          </div>

          {/* CLOCKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Friend A */}
            <div style={{ flex: 1, background: data.friendA.paneBgGradient, border: `1px solid ${data.friendA.paneBorder}`, borderRadius: '8px', padding: '6px 12px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '18px' }}>{data.friendA.avatar}</span>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{data.friendA.name}</span>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>• {data.friendA.locLabel} ({data.friendA.lonString})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{timeA.split(' ')[0]} <span style={{ fontSize: '12px', color: '#f59e0b' }}>{timeA.split(' ')[1]}</span></span>
                <span style={{ color: '#fcd34d', fontSize: '12px', fontWeight: 'bold' }}>{getSunStatus(data.friendA.lon)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#94a3b8', fontSize: '9px', textAlign: 'center', width: '40px', whiteSpace: 'pre-line' }}>
              {data.relationText}
            </div>

            {/* Friend B */}
            <div style={{ flex: 1, background: data.friendB.paneBgGradient, border: `1px solid ${data.friendB.paneBorder}`, borderRadius: '8px', padding: '6px 12px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '18px' }}>{data.friendB.avatar}</span>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '15px' }}>{data.friendB.name}</span>
                <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>• {data.friendB.locLabel} ({data.friendB.lonString})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{timeB.split(' ')[0]} <span style={{ fontSize: '12px', color: '#f59e0b' }}>{timeB.split(' ')[1]}</span></span>
                <span style={{ color: '#c084fc', fontSize: '12px', fontWeight: 'bold' }}>{getSunStatus(data.friendB.lon)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#3b2f15', border: '1px solid #784a0c', padding: '8px', borderRadius: '6px', textAlign: 'center', color: '#fde68a', fontSize: '16px', fontWeight: 'bold' }}>
            {data.summaryFormat(timeA, timeB)}
          </div>

          {/* Map */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', flex: 1, minHeight: '60px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${worldMapUrl})`, backgroundPosition: 'center', backgroundSize: '100% 100%', opacity: 0.6 }} />
             {/* Equator Line */}
             <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(249, 115, 22, 0.4)' }} />
             {/* Night Shadows */}
             {(() => {
                const sunX = 50 + (sunLon / 360) * 100;
                let night1 = { left: 0, width: 0 };
                let night2 = { left: 0, width: 0 };
                
                if (sunX >= 25 && sunX <= 75) {
                   night1 = { left: 0, width: sunX - 25 };
                   night2 = { left: sunX + 25, width: 100 - (sunX + 25) };
                } else if (sunX < 25) {
                   night1 = { left: sunX + 25, width: 50 };
                } else if (sunX > 75) {
                   night1 = { left: sunX - 75, width: 50 };
                }

                return (
                  <>
                    {night1.width > 0 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${night1.left}%`, width: `${night1.width}%`, background: 'rgba(0,0,0,0.65)', pointerEvents: 'none' }} />}
                    {night2.width > 0 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${night2.left}%`, width: `${night2.width}%`, background: 'rgba(0,0,0,0.65)', pointerEvents: 'none' }} />}
                  </>
                );
             })()}
             
             {/* Sun dot */}
             <div style={{ position: 'absolute', left: `${50 + (sunLon/360)*100}%`, top: '50%', transform: 'translate(-50%, -50%)', fontSize: '24px', filter: 'drop-shadow(0 0 10px #f59e0b)' }}>☀️</div>
             
             {/* City dots & labels */}
             {data.mapDots.map((dot, idx) => (
               <React.Fragment key={idx}>
                 <div style={{ position: 'absolute', left: `${50 + (dot.lon/360)*100}%`, top: `${dot.latPercent}%`, transform: 'translate(-50%, -50%)', width: '6px', height: '6px', background: dot.color, borderRadius: '50%', boxShadow: '0 0 0 2px #fff', zIndex: 2 }} />
                 <div style={{ position: 'absolute', left: `${50 + (dot.lon/360)*100}%`, top: `${dot.latPercent}%`, transform: `translate(-50%, ${dot.labelOffset}px)`, color: dot.labelColor, fontSize: '9px', fontWeight: 'bold', textShadow: '0px 1px 2px #000', zIndex: 2 }}>{dot.label}</div>
               </React.Fragment>
             ))}
             
             <div style={{ position: 'absolute', bottom: 4, width: '100%', textAlign: 'center', fontSize: '9px', color: '#94a3b8', zIndex: 2 }}>
               ☀️ = where the Sun is overhead now • shaded = night side • friend A • friend B
             </div>
          </div>
          
          {/* Controls */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setPlaying(!playing)} style={{ background: playing ? '#ef4444' : '#10b981', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', flexShrink: 0, fontSize: '14px' }}>
              {playing ? '⏸' : '▶'}
            </button>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', whiteSpace: 'nowrap' }}>⏱ {data.sliderLabel}</div>
            <input type="range" min="0" max="1440" value={timeMins} onChange={e => { setTimeMins(Number(e.target.value)); setPlaying(false); }} style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer' }} />
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap' }}>{format12(istMins)}</div>
          </div>
          
        </div>

        {/* RIGHT PANE */}
        <div className="dark-coords-right" style={{ padding: '0', overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Chat Interface */}
          <div style={{ background: '#0f172a', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
              {data.chatScript.map((msg, i) => {
                const isA = msg.friend === 'A';
                const friendData = isA ? data.friendA : data.friendB;
                return (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignSelf: isA ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
                    {isA && <div style={{ fontSize: '20px' }}>{friendData.avatar}</div>}
                    <div style={{ 
                      background: friendData.chatBg,
                      border: `1px solid ${friendData.chatBorder}`,
                      padding: '8px 12px',
                      borderRadius: isA ? '0 12px 12px 12px' : '12px 0 12px 12px',
                      color: '#f8fafc',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: friendData.chatNameColor, marginBottom: '2px' }}>
                        {friendData.name} · {friendData.locLabel.split(',')[0]}
                      </div>
                      {msg.text}
                    </div>
                    {!isA && <div style={{ fontSize: '20px' }}>{friendData.avatar}</div>}
                  </div>
                );
              })}
            </div>
            
            {data.voiceText && (
              <div style={{ padding: '8px 16px', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #334155' }}>
                {data.voiceText}
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', background: '#0a0f1c', borderTop: '1px solid #334155' }}>
              <button className="dark-nav-btn" onClick={onBack} style={{ padding: '8px 16px', fontSize: '13px' }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button className="dark-nav-btn next" onClick={() => activeCase < 4 ? setActiveCase(activeCase + 1) : onNextActivity()} style={{ background: '#10b981', color: '#0f172a', padding: '8px 16px', fontSize: '13px' }}>
                {activeCase < 4 ? 'Next' : 'Explore Solar System'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
