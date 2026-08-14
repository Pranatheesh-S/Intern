import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sloganHeroImg from '../../../../../../assets/slogan-hero-image.jpg';

export default function ChapterIntroSpread({ onContinue, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward (Next), -1 = backward (Prev)

  const goToPage = (targetPage) => {
    if (targetPage === currentPage) return;
    setDirection(targetPage > currentPage ? 1 : -1);
    setCurrentPage(targetPage);
  };

  return (
    <div className="slogan-stage-container">
      <style>{`
        .slogan-stage-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #1b1712;
          background: radial-gradient(circle at 20% 15%, rgba(255,255,255,0.03), transparent 40%),
                      linear-gradient(160deg, #1b1712 0%, #100e0b 100%);
          font-family: Georgia, 'Times New Roman', serif;
          color: #2a1f16;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.6vh 1.6vw;
        }

        .slogan-stage-container * {
          box-sizing: border-box;
          font-weight: 700 !important;
        }

        .slogan-frame-wrapper {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          height: 100%;
          min-height: 0;
        }

        .slogan-frame {
          width: 100%;
          max-width: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f4ead9;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.4);
          flex: 1 1 auto;
          min-height: 0;
        }

        /* ================= LEFT — static column ================= */
        .slogan-left {
          position: relative;
          background: #f4ead9;
          padding: 2.4vh 2vw 2vh;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #d8c39c;
          min-height: 0;
          overflow: hidden;
        }

        .slogan-eyebrow {
          font-family: 'Trebuchet MS', sans-serif;
          letter-spacing: 2.5px;
          font-size: 1.7vh;
          font-weight: 700;
          color: #8f4520;
          text-transform: uppercase;
          flex: 0 0 auto;
        }

        .slogan-title {
          font-size: clamp(30px, 4.8vh, 56px);
          line-height: 1.05;
          margin: 6px 0 1.4vh;
          color: #2a1f16;
          font-weight: 700;
          letter-spacing: -0.5px;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .slogan-left-image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 24px -8px rgba(50,30,10,0.4);
          flex: 1 1 auto;
          min-height: 0;
        }
        .slogan-left-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .slogan-left-image::after {
          content: "";
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
        }

        .slogan-quote-block {
          margin-top: 1.6vh;
          background: #fbf5e9;
          border-left: 4px solid #b5602f;
          border-radius: 4px;
          padding: 1.6vh 1.6vw;
          position: relative;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .slogan-quote-sanskrit {
          font-size: clamp(17px, 2.5vh, 26px);
          line-height: 1.4;
          color: #2a1f16;
          margin: 0 0 6px;
        }
        .slogan-quote-ref-small {
          font-size: clamp(13px, 1.65vh, 17px);
          color: #8a7355;
          font-style: italic;
          margin: 0 0 1vh;
        }
        .slogan-quote-en {
          font-size: clamp(16px, 2.25vh, 24px);
          font-style: italic;
          line-height: 1.4;
          color: #2a1f16;
          margin: 0 0 0.8vh;
        }
        .slogan-quote-source {
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(13px, 1.65vh, 17px);
          color: #8f4520;
          font-weight: 600;
        }

        /* ================= RIGHT — dynamic column ================= */
        .slogan-right {
          position: relative;
          background: #fffdf8;
          display: flex;
          flex-direction: column;
          padding: 2.2vh 2vw 1.8vh;
          overflow: hidden;
          min-height: 0;
        }

        .slogan-right-head {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(20px, 2.9vh, 27px);
          font-weight: 700;
          color: #2a1f16;
          margin-bottom: 1.4vh;
          flex: 0 0 auto;
        }
        .slogan-right-head .icon {
          font-size: clamp(21px, 3.2vh, 29px);
        }

        .slogan-flip-stage {
          flex: 1 1 auto;
          min-height: 0;
          position: relative;
          perspective: 1500px;
        }

        .slogan-page {
          position: absolute;
          inset: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
          gap: 1vh;
        }

        /* Shared Card Components */
        .slogan-card {
          background: #f4ead9;
          border-radius: 8px;
          padding: 1.1vh 1.3vw;
          margin-bottom: 0;
          border: 1px solid #d8c39c;
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .slogan-card h3 {
          margin: 0 0 0.5vh;
          font-size: clamp(16px, 2.45vh, 23px);
          color: #2a1f16;
          flex: 0 0 auto;
        }
        .slogan-card p, .slogan-card li {
          font-size: clamp(14px, 2vh, 19px);
          line-height: 1.42;
          color: #45362a;
          margin: 0;
        }
        .slogan-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(12px, 1.5vh, 16px);
          font-weight: 700;
          letter-spacing: 1px;
          color: #8f4520;
          text-transform: uppercase;
          margin-bottom: 0.5vh;
          flex: 0 0 auto;
        }
        .slogan-label-row .dot {
          width: 1.9vh;
          height: 1.9vh;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #b5602f;
          color: #fff;
          font-size: 1.4vh;
          flex: 0 0 auto;
        }

        .slogan-callout {
          background: #fff4e0;
          border: 1px solid #ecd6a4;
        }
        .slogan-callout ul { padding-left: 1.6vh; margin: 0.4vh 0 0; }
        .slogan-callout li { margin-bottom: 0.3vh; }

        .slogan-realworld {
          background: #eef4ec;
          border: 1px solid #cfe0c9;
        }

        .slogan-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1vw;
          margin-bottom: 0;
          flex: 1 1 0;
          min-height: 0;
        }
        .slogan-two-col .slogan-card { margin-bottom: 0; }
        .slogan-material-dot {
          display: inline-block;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          margin-right: 6px;
          vertical-align: middle;
        }

        .slogan-timeline {
          margin-top: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
        .slogan-timeline-track {
          position: relative;
          display: flex;
          justify-content: space-between;
          padding: 0 6px;
          margin-bottom: 0;
        }
        .slogan-timeline-track::before {
          content: "";
          position: absolute;
          left: 6%;
          right: 6%;
          top: 0.7vh;
          height: 2px;
          background: #d8c39c;
        }
        .slogan-tl-point {
          position: relative;
          flex: 1;
          text-align: center;
          z-index: 1;
        }
        .slogan-tl-point .node {
          width: 1.4vh;
          height: 1.4vh;
          border-radius: 50%;
          background: #b5602f;
          border: 2px solid #fff;
          margin: 0 auto 0.7vh;
          box-shadow: 0 0 0 1px #b5602f;
        }
        .slogan-tl-point .year {
          font-family: 'Trebuchet MS', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 1.8vh, 17px);
          color: #2a1f16;
          margin-bottom: 0.3vh;
        }
        .slogan-tl-point .desc {
          font-size: clamp(12px, 1.6vh, 16px);
          color: #5c4c3a;
          line-height: 1.3;
          padding: 0 4px;
        }

        /* Footer & Navigation Controls */
        .slogan-right-foot {
          margin-top: 1.2vh;
          padding-top: 1.2vh;
          border-top: 1px solid #d8c39c;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex: 0 0 auto;
        }

        .slogan-page-indicator {
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(14px, 1.8vh, 17px);
          color: #7a6a55;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .slogan-dots { display: flex; gap: 6px; }
        .slogan-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #d8c39c;
          transition: background 0.25s ease;
        }
        .slogan-dots span.active { background: #b5602f; }

        .slogan-nav-btns { display: flex; gap: 10px; }

        .slogan-btn {
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(14px, 1.85vh, 18px);
          font-weight: 600;
          padding: 1vh 1.4vw;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
        }
        .slogan-btn:active { transform: translateY(1px) scale(0.98); }

        .slogan-btn-secondary {
          background: #e8e0cf;
          color: #2a1f16;
        }
        .slogan-btn-secondary:hover:not(:disabled) { background: #ddd2b8; }

        .slogan-btn-primary {
          background: #2a1f16;
          color: #fdf6e8;
        }
        .slogan-btn-primary:hover:not(:disabled) { box-shadow: 0 4px 12px -2px rgba(0,0,0,0.3); }

        .slogan-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .slogan-bottom-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 1vh;
          flex: 0 0 auto;
        }
        .slogan-bottom-bar button { padding: 1.2vh 1.6vw; }
      `}</style>

      <div className="slogan-frame-wrapper">
        <div className="slogan-frame">
          {/* ============ LEFT (STATIC) ============ */}
          <div className="slogan-left">
            <div className="slogan-eyebrow">Chapter 6 · Class 6 Science</div>
            <h1 className="slogan-title">Materials Around Us</h1>

            <div className="slogan-left-image">
              <img src={sloganHeroImg} alt="Ancient Indian pottery, brass vessels, minerals and metallurgy tools" />
            </div>

            <div className="slogan-quote-block">
              <p className="slogan-quote-sanskrit">उपादं भवेत्तस्य (मूषाया:) मृत्तिका लोहमेव च ।</p>
              <p className="slogan-quote-ref-small">(रसरत्नसमुच्चय – १०.३)</p>
              <p className="slogan-quote-en">"The materials used to make the crucible (a vessel used to melt substances) are clay and iron."</p>
              <p className="slogan-quote-source">— Rasaratnasamuchchaya, 10.3</p>
            </div>
          </div>

          {/* ============ RIGHT (DYNAMIC) ============ */}
          <div className="slogan-right">
            <div className="slogan-right-head">
              <span className="icon">📖</span>
              <span>Historical Facts – Ancient Indian Science</span>
            </div>

            <div className="slogan-flip-stage">
              <AnimatePresence mode="wait" initial={false}>
                {currentPage === 1 ? (
                  <motion.div
                    key="page1"
                    initial={{ rotateY: direction > 0 ? 75 : -75, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: direction > 0 ? -75 : 75, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ transformOrigin: direction > 0 ? 'left center' : 'right center' }}
                    className="slogan-page"
                  >
                    <div className="slogan-card">
                      <h3>Ancient Indian Science – Early Materials Engineering</h3>
                      <p>Ancient Indian scholars carefully selected materials based on their properties. Long before modern laboratories, they understood that different materials were suitable for different purposes.</p>
                    </div>

                    <div className="slogan-card">
                      <div className="slogan-label-row"><span className="dot">📜</span> Ancient Source</div>
                      <h3 style={{ marginBottom: '2px' }}>Rasaratnasamuchchaya</h3>
                      <p>An important Sanskrit text on metallurgy, minerals, and traditional chemical practices.</p>
                    </div>

                    <div className="slogan-card">
                      <div className="slogan-label-row"><span className="dot">🔬</span> Scientific Connection</div>
                      <h3 style={{ marginBottom: '2px' }}>Properties Matter</h3>
                      <p>Ancient Indians selected clay because it is heat resistant, and iron because it is strong — an early understanding of material properties.</p>
                    </div>

                    <div className="slogan-card">
                      <div className="slogan-label-row"><span className="dot">🔥</span> Used For</div>
                      <h3 style={{ marginBottom: '2px' }}>Crucible (Melting Vessel)</h3>
                      <p>A crucible is a special container used to heat or melt substances at very high temperatures.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="page2"
                    initial={{ rotateY: direction > 0 ? 75 : -75, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: direction > 0 ? -75 : 75, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ transformOrigin: direction > 0 ? 'left center' : 'right center' }}
                    className="slogan-page"
                  >
                    <div className="slogan-label-row" style={{ marginBottom: '2px', flex: '0 0 auto' }}>
                      <span className="dot">🧪</span> Material Choice
                    </div>
                    <h3 style={{ margin: '0 0 0.8vh', fontSize: 'clamp(17px, 2.5vh, 24px)', flex: '0 0 auto' }}>
                      The Crucible Was Made of Two Materials
                    </h3>

                    <div className="slogan-two-col">
                      <div className="slogan-card">
                        <h3><span className="slogan-material-dot" style={{ background: '#4a3a2a' }}></span>Clay</h3>
                        <p>Withstands high temperatures without melting easily — used for the outer body.</p>
                      </div>
                      <div className="slogan-card">
                        <h3><span className="slogan-material-dot" style={{ background: '#8a8a8a' }}></span>Iron</h3>
                        <p>Provides strength and durability, keeping the crucible stable during heating.</p>
                      </div>
                    </div>

                    <div className="slogan-card slogan-callout">
                      <div className="slogan-label-row" style={{ color: '#a9812f' }}>ⓘ Why This Matters For Our Chapter</div>
                      <ul>
                        <li>Different materials have different properties.</li>
                        <li>We choose materials based on their use, not just their appearance.</li>
                        <li>This is exactly why we classify materials in this chapter.</li>
                      </ul>
                    </div>

                    <div className="slogan-card slogan-realworld">
                      <div className="slogan-label-row" style={{ color: '#5c8a52' }}>🔗 Real-Life Example</div>
                      <p>Just like ancient scientists used clay for crucibles, today we use clay to make bricks for houses because it is strong and resists heat. We use iron for cooking pans because it conducts heat well!</p>
                    </div>

                    <div className="slogan-card">
                      <h3>Timeline of Indian Materials Science</h3>
                      <div className="slogan-timeline">
                        <div className="slogan-timeline-track">
                          <div className="slogan-tl-point">
                            <div className="node"></div>
                            <div className="year">3000 BCE</div>
                            <div className="desc">Indus Valley baked clay bricks</div>
                          </div>
                          <div className="slogan-tl-point">
                            <div className="node"></div>
                            <div className="year">400 CE</div>
                            <div className="desc">Iron Pillar of Delhi built (rust-resistant iron)</div>
                          </div>
                          <div className="slogan-tl-point">
                            <div className="node"></div>
                            <div className="year">13th Century</div>
                            <div className="desc">Rasaratnasamuchchaya written</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Footer Navigation */}
            <div className="slogan-right-foot">
              <div className="slogan-page-indicator">
                <span>Page {currentPage} / 2</span>
                <div className="slogan-dots">
                  <span className={currentPage === 1 ? 'active' : ''}></span>
                  <span className={currentPage === 2 ? 'active' : ''}></span>
                </div>
              </div>
              <div className="slogan-nav-btns">
                <button
                  className="slogan-btn slogan-btn-secondary"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  ← Previous Page
                </button>
                <button
                  className="slogan-btn slogan-btn-primary"
                  onClick={() => goToPage(2)}
                  disabled={currentPage === 2}
                >
                  Next Page →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Outer Bottom Navigation Bar */}
        <div className="slogan-bottom-bar">
          <button className="slogan-btn slogan-btn-secondary" onClick={onBack}>
            ← Back
          </button>
          <button className="slogan-btn slogan-btn-primary" onClick={onContinue}>
            Begin Investigation →
          </button>
        </div>
      </div>
    </div>
  );
}
