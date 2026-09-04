import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Zap, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dark Sci-Fi Visual Gallery Collection
const SCI_FI_SLIDES = [
  {
    id: 'bar_magnet',
    image: '/assets/scifi_bar_magnet.jpg'
  },
  {
    id: 'compass',
    image: '/assets/scifi_compass.jpg'
  },
  {
    id: 'horseshoe',
    image: '/assets/scifi_horseshoe.jpg'
  },
  {
    id: 'warship',
    image: '/assets/scifi_warship.jpg'
  },
  {
    id: 'notebook',
    image: '/assets/scifi_notebook.jpg'
  }
];

export default function Chapter4Cover({ onStartJourney, onBack }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Smooth auto-advancing slideshow
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SCI_FI_SLIDES.length);
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const activeSlideData = SCI_FI_SLIDES[currentSlide];

  return (
    <div className="chapter4-cover-wrapper">
      {/* Back Button */}
      <button
        onClick={onBack || (() => window.history.back())}
        className="cover-back-btn"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <style>{`
        .chapter4-cover-wrapper {
          --ink: #FFFFFF;
          --geo: "Space Grotesk", system-ui, -apple-system, sans-serif;
          --mono: "IBM Plex Mono", monospace;
          
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          font-family: var(--geo);
          color: var(--ink);
          overflow: hidden;
          background: 
            radial-gradient(1100px circle at 15% 30%, rgba(6, 182, 212, 0.16) 0%, transparent 60%),
            radial-gradient(900px circle at 85% 75%, rgba(139, 92, 246, 0.13) 0%, transparent 55%),
            radial-gradient(800px circle at 50% 10%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            #030712;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        /* Sci-Fi Nodal Matrix Grid */
        .scifi-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: 
            radial-gradient(circle at center, rgba(56, 189, 248, 0.22) 1.2px, transparent 1.2px),
            linear-gradient(to right, rgba(56, 189, 248, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.04) 1px, transparent 1px);
          background-size: 40px 40px, 40px 40px, 40px 40px;
          opacity: 0.85;
        }

        /* Ambient Cybernetic Plasma Wave Flow */
        .plasma-wave {
          position: absolute;
          width: 60vw;
          height: 60vh;
          border-radius: 50%;
          filter: blur(85px);
          pointer-events: none;
          opacity: 0.6;
          animation: plasmaDrift 16s ease-in-out infinite alternate;
        }
        .plasma-wave.cyan {
          top: -15%;
          left: -10%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
        }
        .plasma-wave.violet {
          bottom: -15%;
          right: -10%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%);
          animation-delay: -8s;
        }
        @keyframes plasmaDrift {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, 25px) scale(1.08); }
          100% { transform: translate(-25px, 40px) scale(0.95); }
        }

        /* Floating Micro Particles */
        .spark-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #38BDF8;
          border-radius: 50%;
          box-shadow: 0 0 8px #38BDF8;
          pointer-events: none;
          animation: sparkFloat 6s ease-in-out infinite alternate;
        }
        @keyframes sparkFloat {
          0% { transform: translateY(0px) scale(0.8); opacity: 0.2; }
          50% { opacity: 0.85; transform: translateY(-15px) scale(1.3); }
          100% { transform: translateY(-30px) scale(0.6); opacity: 0.15; }
        }

        /* Outer HUD Frame Line */
        .frame-line {
          position: absolute;
          inset: clamp(16px, 2.5vw, 36px);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 20px;
          pointer-events: none;
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.8), 0 0 60px rgba(6, 182, 212, 0.08);
        }

        /* Corner HUD Reticle Accents */
        .hud-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          pointer-events: none;
          border-color: #38BDF8;
          border-style: solid;
        }
        .hud-corner.tl { top: clamp(14px, 2.3vw, 34px); left: clamp(14px, 2.3vw, 34px); border-width: 2.5px 0 0 2.5px; border-top-left-radius: 6px; }
        .hud-corner.tr { top: clamp(14px, 2.3vw, 34px); right: clamp(14px, 2.3vw, 34px); border-width: 2.5px 2.5px 0 0; border-top-right-radius: 6px; }
        .hud-corner.bl { bottom: clamp(14px, 2.3vw, 34px); left: clamp(14px, 2.3vw, 34px); border-width: 0 0 2.5px 2.5px; border-bottom-left-radius: 6px; }
        .hud-corner.br { bottom: clamp(14px, 2.3vw, 34px); right: clamp(14px, 2.3vw, 34px); border-width: 0 2.5px 2.5px 0; border-bottom-right-radius: 6px; }

        /* Single Standing Page Layout - Text on Left, Divider in Center-Left, Image on Right */
        .layout-container {
          position: relative;
          width: 100%;
          max-width: 1560px;
          height: 100%;
          max-height: calc(100vh - 65px);
          margin: 0 auto;
          padding: 0 clamp(24px, 4vw, 64px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) 1px minmax(0, 1.48fr);
          align-items: center;
          gap: clamp(36px, 5vw, 88px);
          z-index: 10;
        }

        /* Left Side: Text Cartouche with Pure White Typography */
        .text-cartouche {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
          max-width: 620px;
          padding-right: clamp(10px, 2vw, 36px);
        }

        .pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.2rem;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          font-family: var(--mono);
          font-size: clamp(0.88rem, 1.0vw, 1.02rem);
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #FFFFFF;
          text-transform: uppercase;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }

        .main-title {
          font-family: var(--geo);
          font-size: clamp(2.7rem, 4.3vw, 4.4rem);
          font-weight: 900;
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
          white-space: nowrap;
          color: #FFFFFF;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .description-text {
          font-size: clamp(1.25rem, 1.5vw, 1.55rem);
          line-height: 1.6;
          color: #FFFFFF;
          margin: 0;
          font-weight: 400;
          opacity: 0.95;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
        }

        .cta-wrapper {
          margin-top: 0.5rem;
        }

        /* Shimmering Aqua CTA Button */
        .start-journey-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1.15rem 2.75rem;
          border-radius: 30px;
          background: linear-gradient(135deg, #00F2FE 0%, #00C6FF 100%);
          border: none;
          color: #030712;
          font-family: var(--geo);
          font-weight: 900;
          font-size: 1.25rem;
          letter-spacing: 0.03em;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 242, 254, 0.45);
          z-index: 1;
        }

        /* Moving Radiant Shimmer Light Sweep */
        .start-journey-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.75) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(25deg);
          animation: shimmerSweep 2.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        @keyframes shimmerSweep {
          0% {
            left: -75%;
          }
          50%, 100% {
            left: 175%;
          }
        }

        .start-journey-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 16px 40px rgba(0, 242, 254, 0.7);
          background: linear-gradient(135deg, #38BDF8 0%, #00F2FE 100%);
        }
        .start-journey-btn:active {
          transform: translateY(0) scale(0.98);
        }

        /* Cover Back Button - Bottom Left Position */
        .cover-back-btn {
          position: absolute;
          bottom: clamp(20px, 3vw, 40px);
          left: clamp(20px, 3vw, 40px);
          z-index: 100;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.15rem;
          border-radius: 24px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          background: rgba(3, 7, 18, 0.88);
          backdrop-filter: blur(12px);
          color: #E0F2FE;
          font-family: var(--geo);
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          transition: all 0.2s ease;
        }

        .cover-back-btn:hover {
          border-color: rgba(56, 189, 248, 0.8);
          color: #FFFFFF;
          background: rgba(6, 182, 212, 0.15);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
        }

        .cover-back-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
        }

        /* Center-Left Meridian Dashed Divider Line */
        .meridian-line {
          position: relative;
          width: 1px;
          height: 74%;
          justify-self: center;
          background: repeating-linear-gradient(180deg, rgba(56, 189, 248, 0.4) 0 6px, transparent 6px 12px);
        }

        /* Right Side: Clean Dark Sci-Fi Visual Showcase Card */
        .gallery-card {
          position: relative;
          aspect-ratio: 16 / 10;
          width: 100%;
          max-width: min(82vh, 780px);
          justify-self: center;
          border: 2px solid rgba(56, 189, 248, 0.4);
          border-radius: 32px;
          background: #000000;
          overflow: hidden;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.9), 0 0 50px rgba(6, 182, 212, 0.2);
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .gallery-card:hover {
          border-color: rgba(56, 189, 248, 0.85);
          box-shadow: 0 32px 85px rgba(0, 0, 0, 0.98), 0 0 65px rgba(6, 182, 212, 0.35);
          transform: translateY(-2px);
        }

        .gallery-image-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* FuturaX Corner Branding */
        .corner-brand {
          position: absolute;
          bottom: clamp(20px, 3vw, 40px);
          right: clamp(20px, 3vw, 40px);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          z-index: 10;
        }
        .brand-logo {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #00F2FE;
          color: #030712;
          display: grid;
          place-items: center;
          font-weight: 900;
          font-size: 16px;
          box-shadow: 0 0 14px rgba(0, 242, 254, 0.5);
        }
        .brand-title { font-size: 14px; font-weight: 700; color: #FFF; }
        .brand-sub { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; color: rgba(224, 242, 254, 0.6); display: block; }

        @media (max-width: 860px) {
          .layout-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1.5rem;
          }
          .meridian-line { display: none; }
          .text-cartouche { align-items: center; padding-right: 0; }
          .gallery-card { max-width: 460px; }
          .corner-brand { position: static; margin-top: 0.5rem; justify-content: center; }
          .main-title { white-space: normal; }
        }
      `}</style>

      {/* Futuristic Cybernetic Background Elements */}
      <div className="scifi-grid"></div>
      <div className="plasma-wave cyan"></div>
      <div className="plasma-wave violet"></div>

      {/* Floating Star Sparks */}
      <div className="spark-particle" style={{ top: '22%', left: '18%', animationDelay: '0s' }}></div>
      <div className="spark-particle" style={{ top: '75%', left: '12%', animationDelay: '-2s' }}></div>
      <div className="spark-particle" style={{ top: '35%', right: '14%', animationDelay: '-4s' }}></div>
      <div className="spark-particle" style={{ top: '82%', right: '24%', animationDelay: '-1s' }}></div>

      {/* Outer HUD Framing & Corner Reticles */}
      <div className="frame-line"></div>
      <div className="hud-corner tl"></div>
      <div className="hud-corner tr"></div>
      <div className="hud-corner bl"></div>
      <div className="hud-corner br"></div>

      {/* Center Layout Container */}
      <div className="layout-container">
        
        {/* Left Cartouche (Pure White Typography & Shimmer CTA) */}
        <div className="text-cartouche">
          <div className="pill-badge">
            <Zap size={18} color="#FFFFFF" />
            GRADE 6 · SCIENCE · CHAPTER 4
          </div>

          <h1 className="main-title">Exploring Magnets</h1>

          <p className="description-text">
            Hands-on physics labs for every chapter activity. Experience real magnetic fields, settling compasses, and iron filings gathering at the poles.
          </p>

          <div className="cta-wrapper">
            <button 
              className="start-journey-btn"
              onClick={onStartJourney}
            >
              Start the journey
              <ArrowRight size={22} />
            </button>
          </div>
        </div>

        {/* Center-Left Meridian Dashed Divider Line */}
        <div className="meridian-line"></div>

        {/* Right Side: Clean Dark Sci-Fi Visual Showcase Card */}
        <div
          className="gallery-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setCurrentSlide((prev) => (prev + 1) % SCI_FI_SLIDES.length)}
          title="Click to view next visual asset"
        >
          {/* Animated Image Slide with Crossfade Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlideData.id}
              className="gallery-image-container"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
            >
              <img
                src={activeSlideData.image}
                alt={`Dark Sci-Fi Visual ${currentSlide + 1}`}
                className="gallery-image"
              />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* FuturaX Corner Branding */}
      <div className="corner-brand">
        <div className="brand-logo">Fx</div>
        <div>
          <div className="brand-title">FuturaX</div>
          <span className="brand-sub">AI-NATIVE LEARNING LAB</span>
        </div>
      </div>
    </div>
  );
}
