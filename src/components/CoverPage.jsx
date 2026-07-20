import React from "react";
import { ArrowLeft } from "lucide-react";

export default function CoverPage({
  classNum,
  subjectName,
  chapterNum,
  title,
  topics,
  coverGraphic,
  onBack,
  onNext,
}) {
  const [gifFailed, setGifFailed] = React.useState(false);
  const gifSrc = `/activities/cover_ch${chapterNum}.gif`;

  // Generate stable random bubble positions
  const bubbles = React.useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 9 + 4, // 4px to 13px
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 5,
    }));
  }, []);

  // Render dynamic animated biology graphic depending on the chapter
  const renderGraphic = () => {
    switch (coverGraphic) {
      case "diversity":
        return (
          <svg viewBox="0 0 400 400" className="bio-svg" style={{ width: "100%", height: "100%", maxHeight: "380px" }}>
            <defs>
              <radialGradient id="skyGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f2a1d" />
                <stop offset="100%" stopColor="#08140f" />
              </radialGradient>
              <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#skyGrad)" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.25" />
            
            <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
            <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
            
            <path className="sway-plant" d="M200,340 Q220,260 180,200 Q200,250 200,340 Z" fill="url(#leafGrad)" />
            <path className="sway-plant s2" d="M230,340 Q250,280 220,230 Q235,280 230,340 Z" fill="#34d399" opacity="0.8" />
            <path className="sway-plant s3" d="M170,340 Q150,290 180,240 Q170,290 170,340 Z" fill="#059669" opacity="0.8" />

            <text x="130" y="160" fontSize="38" className="float-bio">🦋</text>
            <text x="270" y="150" fontSize="36" className="float-bio f2">🐦</text>
            <text x="150" y="250" fontSize="32" className="float-bio f3">🐠</text>
            <text x="250" y="240" fontSize="34" className="float-bio f4">🌸</text>

            <circle cx="200" cy="200" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" className="spin-slow" />
          </svg>
        );
      case "diet":
        return (
          <svg viewBox="0 0 400 400" className="bio-svg" style={{ width: "100%", height: "100%", maxHeight: "380px" }}>
            <defs>
              <radialGradient id="dietGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2c1a04" />
                <stop offset="100%" stopColor="#140b01" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#dietGrad)" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.3" />
            
            <path d="M200,200 L200,50 A150,150 0 0,1 330,275 Z" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1.5" />
            <path d="M200,200 L330,275 A150,150 0 0,1 110,325 Z" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M200,200 L110,325 A150,150 0 0,1 200,50 Z" fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />

            <text x="260" y="140" fontSize="34" className="float-bio">🍎</text>
            <text x="210" y="270" fontSize="36" className="float-bio f2">🌾</text>
            <text x="130" y="160" fontSize="34" className="float-bio f3">🥦</text>
            <text x="140" y="250" fontSize="32" className="float-bio f4">🥛</text>

            <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </svg>
        );
      case "living_creatures":
        return (
          <svg viewBox="0 0 400 400" className="bio-svg" style={{ width: "100%", height: "100%", maxHeight: "380px" }}>
            <defs>
              <radialGradient id="livingGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#081e2b" />
                <stop offset="100%" stopColor="#040f16" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#livingGrad)" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.3" />
            
            <circle cx="200" cy="200" r="60" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="5 5" className="spin-slow" />
            <circle cx="200" cy="200" r="30" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2 4" className="spin-fast" />

            <text x="200" y="210" fontSize="28" className="float-bio" style={{ textAnchor: "middle" }}>🧬</text>
            <text x="130" y="130" fontSize="34" className="float-bio f2">🐸</text>
            <text x="270" y="130" fontSize="32" className="float-bio f3">🌻</text>
            <text x="130" y="270" fontSize="34" className="float-bio f4">🌱</text>
            <text x="270" y="270" fontSize="36" className="float-bio">🦉</text>
          </svg>
        );
      case "treasures":
      default:
        return (
          <svg viewBox="0 0 400 400" className="bio-svg" style={{ width: "100%", height: "100%", maxHeight: "380px" }}>
            <defs>
              <radialGradient id="treasureGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="160" fill="url(#treasureGrad)" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.3" />
            
            <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(16,185,129,0.15)" strokeWidth="1.5" strokeDasharray="10 5" className="spin-slow" />
            <text x="200" y="215" fontSize="48" className="float-bio" style={{ textAnchor: "middle" }}>💎</text>
            <text x="140" y="150" fontSize="36" className="float-bio">☀️</text>
            <text x="260" y="150" fontSize="36" className="float-bio f2">💧</text>
            <text x="140" y="250" fontSize="34" className="float-bio f3">🍃</text>
            <text x="260" y="250" fontSize="36" className="float-bio f4">🪵</text>
          </svg>
        );
    }
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      color: "#e8ebff",
      background: "radial-gradient(130% 120% at 75% 15%, #0d2015 0%, #060e0a 100%)",
      fontFamily: "Space Grotesk, system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {/* CSS Stylesheet Inject */}
      <style>{`
        .cover-frame {
          position: absolute;
          inset: clamp(12px, 2vw, 24px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          pointer-events: none;
          z-index: 10;
        }
        .cover-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            repeating-linear-gradient(0deg, transparent 0 33px, rgba(16, 185, 129, 0.02) 33px 34px),
            repeating-linear-gradient(90deg, transparent 0 33px, rgba(16, 185, 129, 0.02) 33px 34px);
          z-index: 1;
        }
        .cover-grid::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(0deg, transparent 0 135px, rgba(16, 185, 129, 0.04) 135px 136px),
            repeating-linear-gradient(90deg, transparent 0 135px, rgba(16, 185, 129, 0.04) 135px 136px);
        }
        
        /* Adjusted positioning to prevent overlap with Back Button & Theme Toggle */
        .cover-tick {
          position: absolute;
          font-family: monospace;
          font-size: clamp(9px, 1vw, 11px);
          letter-spacing: 0.14em;
          color: #34d399;
          opacity: 0.7;
          z-index: 5;
        }
        
        /* Centered Responsive Content Grid with wider columns for larger assets */
        .layout-grid {
          width: 100%;
          max-width: 1300px;
          height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) 1px minmax(0, 0.85fr);
          align-items: center;
          padding: 2rem clamp(24px, 4vw, 64px);
          gap: clamp(24px, 5vw, 80px);
          z-index: 5;
          box-sizing: border-box;
        }

        /* Scaled up Graphic Container */
        .graphic-container {
          position: relative;
          aspect-ratio: 1;
          width: 100%;
          max-width: min(48vh, 460px);
          justify-self: center;
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 14px;
          background: rgba(6, 15, 10, 0.35);
          display: grid;
          place-items: center;
          box-shadow: inset 0 0 30px rgba(16, 185, 129, 0.05);
          overflow: hidden;
        }
        .graphic-label {
          position: absolute;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #34d399;
          opacity: 0.65;
          z-index: 12;
        }
        .graphic-label.tl { top: 10px; left: 12px; }
        .graphic-label.tr { top: 10px; right: 12px; }
        .graphic-label.bl { bottom: 10px; left: 12px; }
        .graphic-label.br { bottom: 10px; right: 12px; }

        /* Animation Classes */
        .sway-plant {
          transform-origin: bottom center;
          animation: plantSway 5s ease-in-out infinite alternate;
        }
        .sway-plant.s2 { animation-duration: 6.2s; animation-delay: 0.4s; }
        .sway-plant.s3 { animation-duration: 4.3s; animation-delay: 0.2s; }
        @keyframes plantSway {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(4deg); }
        }
        
        .float-bio {
          animation: bioFloat 6s ease-in-out infinite;
          display: inline-block;
        }
        .float-bio.f2 { animation-duration: 7.2s; animation-delay: 1s; }
        .float-bio.f3 { animation-duration: 5.4s; animation-delay: 0.5s; }
        .float-bio.f4 { animation-duration: 6.6s; animation-delay: 1.5s; }
        @keyframes bioFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }

        .spin-slow {
          transform-origin: 200px 200px;
          animation: bioSpin 35s linear infinite;
        }
        .spin-fast {
          transform-origin: 200px 200px;
          animation: bioSpin 16s linear infinite reverse;
        }
        @keyframes bioSpin {
          100% { transform: rotate(360deg); }
        }

        /* Divider */
        .meridian-divider {
          position: relative;
          width: 1px;
          height: 65%;
          justify-self: center;
          background: repeating-linear-gradient(180deg, rgba(16, 185, 129, 0.3) 0 6px, transparent 6px 12px);
        }
        .meridian-divider span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #34d399;
          white-space: nowrap;
          background: #060d08;
          padding: 4px 10px;
          opacity: 0.8;
          border: 1px solid rgba(16, 185, 129, 0.15);
          border-radius: 4px;
        }

        /* Title Cartouche */
        .title-badge {
          display: inline-block;
          font-family: monospace;
          font-size: clamp(10px, 1vw, 12px);
          letter-spacing: 0.26em;
          padding: 6px 16px;
          border-radius: 99px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          text-transform: uppercase;
        }
        .ch-heading {
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: clamp(38px, 5.2vw, 84px);
          line-height: 1.05;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 1.4rem 0 1rem 0;
        }
        .ch-heading em {
          font-style: normal;
          background: linear-gradient(90deg, #34d399 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #10b981;
        }
        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 1rem;
        }
        .meta-ch-num {
          font-family: monospace;
          font-size: clamp(10px, 1.1vw, 12px);
          letter-spacing: 0.15em;
          color: #e8ebff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 4px 10px;
          border-radius: 6px;
        }
        .meta-ch-title {
          font-weight: 700;
          font-size: clamp(16px, 1.8vw, 22px);
          color: #ffffff;
        }
        .meta-ch-topics {
          font-family: monospace;
          font-size: clamp(9px, 0.9vw, 11px);
          letter-spacing: 0.1em;
          color: #10b981;
          margin-top: 6px;
          opacity: 0.85;
          text-transform: uppercase;
        }

        /* Cover CTA */
        .cover-cta {
          margin-top: 2rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          background: #10b981;
          color: #06180f;
          padding: clamp(13px, 1.5vw, 16px) clamp(24px, 3vw, 36px);
          border-radius: 10px;
          font-size: clamp(13px, 1.4vw, 16px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .cover-cta:hover {
          background: #34d399;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
        }

        .back-dashboard-btn {
          position: absolute;
          top: clamp(18px, 3vw, 36px);
          left: clamp(18px, 3vw, 36px);
          z-index: 20;
          font-size: clamp(11px, 1.1vw, 13px);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #34d399;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .back-dashboard-btn:hover {
          color: #ffffff;
        }

        /* Bubbles Background */
        .bubble-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }
        .bubble-bg span {
          position: absolute;
          bottom: -20px;
          border-radius: 50%;
          background: rgba(52, 211, 153, 0.15);
          animation: bubbleRise linear infinite;
        }
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { transform: translateY(-105vh) scale(1.3); opacity: 0; }
        }

        @media (max-aspect-ratio: 1/1), (max-width: 760px) {
          .layout-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            justify-items: center;
            text-align: center;
            gap: 24px;
            overflow-y: auto;
            padding-top: 5rem;
          }
          .meridian-divider { display: none; }
          .graphic-container { max-width: min(35vh, 280px); }
          .back-dashboard-btn { position: absolute; top: 16px; left: 16px; }
        }
      `}</style>

      {/* Bubble backgrounds */}
      <div className="bubble-bg">
        {bubbles.map(b => (
          <span style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`
          }} key={b.id} />
        ))}
      </div>

      <div className="cover-grid" />
      <div className="cover-frame" />

      {/* Grid Coordinates (Shifted to avoid overlapping items) */}
      <span className="cover-tick" style={{ top: "84px", left: "36px" }}>BIOMASS·90°</span>
      <span className="cover-tick" style={{ top: "36px", right: "36px" }}>0.28°N</span>
      <span className="cover-tick" style={{ bottom: "84px", left: "36px" }}>ECOSYSTEM</span>
      <span className="cover-tick" style={{ bottom: "84px", right: "84px" }}>BIOSPHERE</span>

      <button className="back-dashboard-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back to Chapters
      </button>

      <div className="layout-grid">
        {/* LEFT: Graphics (Autoload GIF with inline SVG fallback) */}
        <div className="graphic-container">
          <span className="graphic-label tl">BIOME</span>
          <span className="graphic-label tr">LIFE ↑</span>
          <span className="graphic-label bl">SYS·CH {chapterNum}</span>
          <span className="graphic-label br">FUTURAX</span>
          {!gifFailed ? (
            <img 
              src={gifSrc} 
              alt="Chapter Graphic" 
              onError={() => setGifFailed(true)} 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                borderRadius: "14px",
                transform: chapterNum === 2 ? "scale(1.1)" : "none"
              }}
            />
          ) : (
            renderGraphic()
          )}
        </div>

        {/* MIDDLE: Line */}
        <div className="meridian-divider">
          <span>CHAPTER EXPLORER · CH 0{chapterNum}</span>
        </div>

        {/* RIGHT: Metadata and Heading */}
        <div style={{ maxWidth: "560px", zIndex: 10 }}>
          <span className="title-badge">Class {classNum} · {subjectName}</span>
          <div className="meta-ch-topics">◎ {topics}</div>
          <h1 className="ch-heading">
            Biology <em>Lab</em>
          </h1>
          <div className="meta-row">
            <span className="meta-ch-num">CH 0{chapterNum}</span>
            <span className="meta-ch-title">{title}</span>
          </div>
          <button className="cover-cta" onClick={onNext}>
            Begin Chapter <ArrowLeft style={{ transform: "rotate(180deg)" }} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
