import React from 'react';

const Card = ({ title, children }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    width: '260px'
  }}>
    <div style={{
      width: '100%',
      height: '160px',
      background: '#0a1122',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      {children}
    </div>
    <span style={{
      fontSize: '15px',
      fontWeight: '800',
      color: '#e2e8f0',
      textAlign: 'center',
      lineHeight: '1.3'
    }}>
      {title}
    </span>
  </div>
);

// 1. Sun Arc
const SunArc = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 80">
    <rect width="130" height="80" fill="#e0f2fe" />
    <path d="M15,65 Q65,5 115,65" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="0" cy="0" r="10" fill="#fcd34d" style={{ animation: 'sun-move 6s infinite linear' }} />
    <circle cx="0" cy="0" r="5" fill="#d97706" style={{ animation: 'sun-move 6s infinite linear' }} />
    <rect x="0" y="65" width="130" height="15" fill="#22c55e" />
  </svg>
);

// 2. Floor Tiling
const FloorTiling = () => {
  const tiles = [];
  const colors = ['#3b82f6', '#f59e0b'];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      tiles.push(
        <rect
          key={`${i}-${j}`}
          x={15 + j * 26}
          y={2 + i * 26}
          width="22"
          height="22"
          fill={colors[(i + j) % 2]}
          style={{
            animation: 'pop-in 4s infinite',
            animationDelay: `${(i * 4 + j) * 0.15}s`,
            opacity: 0,
            animationFillMode: 'both'
          }}
          rx="2"
        />
      );
    }
  }
  return <svg width="100%" height="100%" viewBox="0 0 130 80"><rect width="130" height="80" fill="#fff" />{tiles}</svg>;
};

// 3. Wall Building
const WallBuilding = () => {
  const bricks = [];
  for (let row = 0; row < 5; row++) {
    const isOffset = row % 2 !== 0;
    for (let col = 0; col < 4; col++) {
      const x = isOffset ? col * 32 - 11 : col * 32 + 5;
      bricks.push(
        <rect
          key={`${row}-${col}`}
          x={x}
          y={65 - row * 14}
          width="30"
          height="12"
          fill="#ef4444"
          style={{
            animation: 'drop-in 4s infinite',
            animationDelay: `${(row * 4 + col) * 0.1}s`,
            opacity: 0,
            animationFillMode: 'both'
          }}
          rx="1"
        />
      );
    }
  }
  return <svg width="100%" height="100%" viewBox="0 0 130 80"><rect width="130" height="80" fill="#fef3c7" />{bricks}</svg>;
};

// 4. Song Beat
const SongBeat = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 80">
    <rect width="130" height="80" fill="#f8fafc" />
    {[
      { color: '#8b5cf6', delay: '0s' },
      { color: '#8b5cf6', delay: '0.2s' },
      { color: '#06b6d4', delay: '0.4s' },
      { color: '#06b6d4', delay: '0.1s' },
      { color: '#10b981', delay: '0.3s' },
      { color: '#ef4444', delay: '0.5s', dot: true },
      { color: '#06b6d4', delay: '0.2s' },
    ].map((bar, i) => (
      <g key={i}>
        <rect x={15 + i * 15} y="30" width="8" height="40" fill={bar.color} rx="4"
          style={{
            transformOrigin: 'bottom',
            animation: 'eq-bounce 1s infinite alternate ease-in-out',
            animationDelay: bar.delay
          }}
        />
        {bar.dot && <circle cx={15 + i * 15 + 4} cy="20" r="4" fill="#ef4444" style={{ animation: 'bounce 1s infinite alternate ease-in-out' }} />}
      </g>
    ))}
  </svg>
);

// 5. Heartbeat
const Heartbeat = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 80">
    <rect width="130" height="80" fill="#1e293b" />
    <path d="M0,40 L30,40 L35,25 L45,65 L55,15 L65,50 L75,40 L130,40" fill="none" stroke="#22c55e" strokeWidth="2"
      strokeDasharray="200"
      strokeDashoffset="200"
      style={{
        animation: 'draw-line 3s infinite linear'
      }}
    />
    {/* Grid lines */}
    <path d="M0,20 L130,20 M0,60 L130,60 M30,0 L30,80 M60,0 L60,80 M90,0 L90,80 M120,0 L120,80" fill="none" stroke="#334155" strokeWidth="0.5" />
    <text x="110" y="22" fill="#f43f5e" fontSize="16" style={{ animation: 'heart-beat 1s infinite' }}>❤</text>
    <circle cx="0" cy="40" r="3" fill="#a7f3d0" style={{ animation: 'ecg-dot 3s infinite linear' }} />
  </svg>
);

// 6. Railway Line
const RailwayLine = () => (
  <svg width="100%" height="100%" viewBox="0 0 130 80">
    {/* Sky */}
    <rect width="130" height="80" fill="#e0f2fe" />
    {/* Ground */}
    <rect x="0" y="40" width="130" height="40" fill="#a3e635" />
    {/* Horizon line */}
    <line x1="0" y1="40" x2="130" y2="40" stroke="#65a30d" strokeWidth="1" />
    
    {/* Rails ballast (gravel bed) */}
    <polygon points="65,40 30,80 100,80" fill="#d4d4d8" />

    {/* Sleepers */}
    {[0, 1, 2, 3, 4, 5].map(i => (
      <line
        key={i}
        x1="20" y1="80" x2="110" y2="80"
        stroke="#78350f" strokeWidth="5"
        style={{
          transformOrigin: 'center center',
          animation: 'sleeper-move 2s infinite ease-in',
          animationDelay: `${i * 0.333}s`,
          opacity: 0
        }}
      />
    ))}
    
    {/* Rails */}
    <path d="M65,40 L35,80 M65,40 L95,80" fill="none" stroke="#52525b" strokeWidth="3" />

    {/* The Train Model */}
    <g style={{ animation: 'train-bounce 0.2s infinite alternate' }}>
      {/* Train Body base */}
      <path d="M50,40 L80,40 L85,60 L45,60 Z" fill="#b91c1c" />
      <rect x="52" y="25" width="26" height="15" fill="#991b1b" rx="2" />
      <path d="M48,25 L82,25 L80,20 L50,20 Z" fill="#451a03" />
      
      {/* Windows */}
      <rect x="55" y="28" width="8" height="8" fill="#e0f2fe" rx="1" />
      <rect x="67" y="28" width="8" height="8" fill="#e0f2fe" rx="1" />
      
      {/* Grill/Cowcatcher */}
      <polygon points="50,60 80,60 85,70 45,70" fill="#3f3f46" />
      <line x1="50" y1="62" x2="80" y2="62" stroke="#18181b" strokeWidth="1" />
      <line x1="48" y1="65" x2="82" y2="65" stroke="#18181b" strokeWidth="1" />
      <line x1="46" y1="68" x2="84" y2="68" stroke="#18181b" strokeWidth="1" />

      {/* Headlight */}
      <circle cx="65" cy="50" r="4" fill="#fef08a" />
      <circle cx="65" cy="50" r="8" fill="#fef08a" opacity="0.4" />
      
      {/* Wheels/Buffers */}
      <circle cx="50" cy="58" r="3" fill="#18181b" />
      <circle cx="80" cy="58" r="3" fill="#18181b" />
    </g>

    {/* Steam from train */}
    <circle cx="65" cy="15" r="4" fill="#cbd5e1" style={{ animation: 'steam-puff 1.5s infinite' }} />
    <circle cx="65" cy="10" r="6" fill="#cbd5e1" style={{ animation: 'steam-puff 1.5s infinite 0.5s' }} />
    <circle cx="65" cy="2" r="8" fill="#cbd5e1" style={{ animation: 'steam-puff 1.5s infinite 1s' }} />
  </svg>
);


export default function PatternsEverywhere({ onNext, onPrev }) {
  return (
    <div className="dark-coords-page">
      {/* Keyframes */}
      <style>{`
        @keyframes sun-move {
          0% { transform: translate(15px, 65px); opacity: 0; }
          10% { opacity: 1; }
          25% { transform: translate(40px, 30px); }
          50% { transform: translate(65px, 5px); }
          75% { transform: translate(90px, 30px); }
          90% { opacity: 1; }
          100% { transform: translate(115px, 65px); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          10%, 80% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes drop-in {
          0% { transform: translateY(-20px); opacity: 0; }
          15%, 85% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(0); opacity: 0; }
        }
        @keyframes eq-bounce {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
        @keyframes draw-line {
          0% { stroke-dashoffset: 200; }
          80%, 100% { stroke-dashoffset: 0; }
        }
        @keyframes ecg-dot {
          0% { transform: translate(0, 0); opacity: 1; }
          12.5% { transform: translate(15px, 0); }
          15% { transform: translate(17.5px, -7.5px); }
          20% { transform: translate(22.5px, 12.5px); }
          25% { transform: translate(27.5px, -12.5px); }
          30% { transform: translate(32.5px, 5px); }
          35% { transform: translate(37.5px, 0); }
          100% { transform: translate(130px, 0); opacity: 0; }
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          20% { transform: scale(1.3); }
          40% { transform: scale(1); }
          60% { transform: scale(1.3); }
        }
        @keyframes sleeper-move {
          0% { transform: scale(0) translateY(-40px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: scale(1.5) translateY(10px); opacity: 0; }
        }
        @keyframes train-bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-1px); }
        }
        @keyframes steam-puff {
          0% { transform: scale(0.5) translateY(0); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: scale(1.5) translateY(-10px); opacity: 0; }
        }
      `}</style>

      <div className="dark-coords-main-content">
        <div className="dark-coords-left">
          <div className="dark-top-title">Patterns in the World</div>
          
          <div className="dark-globe-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '24px',
              padding: '40px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              maxWidth: '1000px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.2)'
            }}>
              <Card title="the sun's daily arc"><SunArc /></Card>
              <Card title="a floor being tiled"><FloorTiling /></Card>
              <Card title="a wall being built"><WallBuilding /></Card>
              <Card title="a song's beat"><SongBeat /></Card>
              <Card title="your own heartbeat"><Heartbeat /></Card>
              <Card title="the railway line"><RailwayLine /></Card>
            </div>
            
            <div style={{
              marginTop: '48px',
              color: '#94a3b8',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              maxWidth: '800px',
              background: 'rgba(255,255,255,0.05)',
              padding: '20px 32px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)',
              lineHeight: '1.6',
              marginBottom: '80px'
            }}>
              Six patterns you met before breakfast — all of them alive: the sunrise, a floor being tiled, a wall being built, the beat of a song, your own heartbeat, and the railway line.
            </div>
          </div>

          <div className="dark-bottom-nav">
            <button className="dark-nav-btn" onClick={onPrev}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
            <div className="dark-nav-dots">
              <div className="dark-nav-dot" />
              <div className="dark-nav-dot active" />
              <div className="dark-nav-dot" />
              <div className="dark-nav-dot" />
            </div>
            <button className="dark-nav-btn next" onClick={onNext}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="dark-coords-right">
          <div className="dark-step-eyebrow">STEP 2 OF 4</div>
          <h2 className="dark-step-title">Patterns are everywhere</h2>
          
          <div className="dark-step-text">
            Such patterns indeed exist all around us — in nature, in our homes and schools, and in the motion of the sun, moon and stars. They occur in everything we do and see: shopping and cooking, throwing a ball and playing games, understanding weather patterns and using technology.
          </div>
          
          <div className="dark-step-text">
            The search for patterns and their explanations can be a fun and creative endeavour. It is for this reason that mathematicians think of mathematics both as an <strong>art</strong> and as a <strong>science</strong>.
          </div>


          
          <div className="dark-step-text">
            For example, understanding patterns in the motion of stars, planets and their satellites led humankind to the theory of gravitation — which let us launch satellites and send rockets to the Moon and Mars. Understanding patterns in genomes has helped in diagnosing and curing diseases.
          </div>
        </div>
      </div>
    </div>
  );
}
