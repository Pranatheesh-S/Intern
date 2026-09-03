import React, { useState } from 'react';
import ancientHeroImage from '../../../../../../assets/ancient-materials-hero.jpg';

export default function ChapterIntroSpread({ onContinue, onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [page1Classes, setPage1Classes] = useState('page');
  const [page2Classes, setPage2Classes] = useState('page hidden-page');
  const [page1ZIndex, setPage1ZIndex] = useState('');
  const [page2ZIndex, setPage2ZIndex] = useState('');

  const goToPage = (target) => {
    if (animating || target === currentPage) return;
    setAnimating(true);

    const forward = target > currentPage;

    const outgoingClasses = `page ${forward ? 'flip-out' : 'flip-out-rev'}`;
    const incomingClasses = `page ${forward ? 'flip-in' : 'flip-in-rev'}`;

    if (currentPage === 1) {
      setPage1Classes(outgoingClasses);
      setPage1ZIndex(1);
      setPage2Classes(incomingClasses);
      setPage2ZIndex(2);
    } else {
      setPage2Classes(outgoingClasses);
      setPage2ZIndex(1);
      setPage1Classes(incomingClasses);
      setPage1ZIndex(2);
    }

    setTimeout(() => {
      if (target === 1) {
        setPage1Classes('page');
        setPage1ZIndex('');
        setPage2Classes('page hidden-page');
        setPage2ZIndex('');
      } else {
        setPage1Classes('page hidden-page');
        setPage1ZIndex('');
        setPage2Classes('page');
        setPage2ZIndex('');
      }
      setCurrentPage(target);
      setAnimating(false);
    }, 520);
  };

  return (
    <div className="chapter-intro-wrapper">
      <style>{`
        :root {
          --parchment: #f4ead9;
          --parchment-deep: #ead9bd;
          --ink: #2a1f16;
          --iron: #232323;
          --clay: #b5602f;
          --clay-deep: #8f4520;
          --brass: #a9812f;
          --line: #d8c39c;
          --shadow: rgba(60, 38, 15, 0.25);
          --heading-color: #800000;
        }

        .chapter-intro-wrapper * { box-sizing: border-box; }

        @font-face {
          font-family: 'system-serif';
        }

        .chapter-intro-wrapper {
          margin: 0; padding: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: var(--iron);
          font-family: Georgia, 'Times New Roman', serif;
          color: var(--ink);
          box-sizing: border-box;
        }

        .stage {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.6vh 1.6vw;
          background:
            radial-gradient(circle at 20% 15%, rgba(255,255,255,0.03), transparent 40%),
            linear-gradient(160deg, #1b1712 0%, #100e0b 100%);
          overflow: hidden;
          z-index: 10000;
        }

        .frame {
          width: 100%;
          max-width: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--parchment);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.4);
          flex: 1 1 auto;
          min-height: 0;
        }

        /* ================= LEFT — static column ================= */
        .left {
          position: relative;
          background: var(--parchment);
          padding: 2.4vh 2vw 2vh;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--line);
          min-height: 0;
          overflow: hidden;
        }

        .eyebrow {
          font-family: 'Trebuchet MS', sans-serif;
          letter-spacing: 2.5px;
          font-size: 1.7vh;
          font-weight: 700;
          color: var(--clay-deep);
          text-transform: uppercase;
          flex: 0 0 auto;
        }

        .title {
          font-size: clamp(33px, 5.3vh, 60px);
          line-height: 1.05;
          margin: 6px 0 1.4vh;
          color: var(--heading-color);
          font-weight: 700;
          letter-spacing: -0.5px;
          white-space: nowrap;
          flex: 0 0 auto;
        }

        .left-image {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 10px 24px -8px rgba(50,30,10,0.4);
          flex: 1 1 auto;
          min-height: 0;
        }
        .left-image img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .left-image::after {
          content: "";
          position: absolute; inset: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
        }

        .quote-block {
          margin-top: 1.6vh;
          background: #fbf5e9;
          border-left: 4px solid var(--clay);
          border-radius: 4px;
          padding: 1.6vh 1.6vw;
          position: relative;
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .quote-sanskrit {
          font-size: clamp(17px, 2.5vh, 26px);
          line-height: 1.4;
          color: var(--ink);
          margin: 0 0 6px;
        }
        .quote-ref-small {
          font-size: clamp(13px, 1.65vh, 17px);
          color: #8a7355;
          font-style: italic;
          margin: 0 0 1vh;
        }
        .quote-en {
          font-size: clamp(16px, 2.25vh, 24px);
          font-style: italic;
          line-height: 1.4;
          color: var(--ink);
          margin: 0 0 0.8vh;
        }
        .quote-source {
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(13px, 1.65vh, 17px);
          color: var(--clay-deep);
          font-weight: 600;
        }

        /* ================= RIGHT — dynamic column ================= */
        .right {
          position: relative;
          background: #fffdf8;
          display: flex;
          flex-direction: column;
          padding: 2.2vh 2vw 1.8vh;
          overflow: hidden;
          min-height: 0;
        }

        .right-head {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(23px, 3.4vh, 31px);
          font-weight: 700;
          color: #000000;
          margin-bottom: 1.4vh;
          flex: 0 0 auto;
        }
        .right-head .icon { font-size: clamp(21px, 3.2vh, 29px); }

        .flip-stage {
          flex: 1 1 auto;
          min-height: 0;
          position: relative;
          perspective: 1800px;
        }

        .page {
          position: absolute;
          inset: 0;
          overflow: hidden;
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transform-origin: left center;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* flip animation states */
        .page.hidden-page { display: none; }

        @keyframes flipOut {
          0%   { transform: rotateY(0deg);   opacity: 1; }
          100% { transform: rotateY(-100deg); opacity: 0; }
        }
        @keyframes flipIn {
          0%   { transform: rotateY(100deg); opacity: 0; }
          100% { transform: rotateY(0deg);   opacity: 1; }
        }
        @keyframes flipOutRev {
          0%   { transform: rotateY(0deg);   opacity: 1; }
          100% { transform: rotateY(100deg); opacity: 0; }
        }
        @keyframes flipInRev {
          0%   { transform: rotateY(-100deg); opacity: 0; }
          100% { transform: rotateY(0deg);    opacity: 1; }
        }

        .flip-out { animation: flipOut 0.5s ease forwards; }
        .flip-in { animation: flipIn 0.5s ease forwards; }
        .flip-out-rev { animation: flipOutRev 0.5s ease forwards; }
        .flip-in-rev { animation: flipInRev 0.5s ease forwards; }

        /* -------- content blocks shared -------- */
        #page1, #page2 {
          gap: 1vh;
        }

        .card {
          background: var(--parchment);
          border-radius: 8px;
          padding: 1.1vh 1.3vw;
          margin-bottom: 0;
          border: 1px solid var(--line);
          flex: 1 1 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .card h3 {
          margin: 0 0 0.5vh;
          font-size: clamp(20px, 3.15vh, 28px);
          color: var(--heading-color);
          flex: 0 0 auto;
        }
        .card p, .card li {
          font-size: clamp(15px, 2.15vh, 20px);
          line-height: 1.42;
          color: #45362a;
          margin: 0;
        }
        .label-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(12px, 1.5vh, 16px);
          font-weight: 700;
          letter-spacing: 1px;
          color: #D46A92;
          text-transform: uppercase;
          margin-bottom: 0.5vh;
          flex: 0 0 auto;
        }
        .label-row .dot {
          width: 1.9vh; height: 1.9vh;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--clay);
          color: #fff;
          font-size: 1.4vh;
          flex: 0 0 auto;
        }

        .callout {
          background: #fff4e0;
          border: 1px solid #ecd6a4;
        }
        .callout ul { padding-left: 1.6vh; margin: 0.4vh 0 0; }
        .callout li { margin-bottom: 0.3vh; color: #362a1c; font-size: clamp(15.5px, 2.25vh, 21px); }

        .realworld {
          background: #eef4ec;
          border: 1px solid #cfe0c9;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1vw;
          margin-bottom: 0;
          flex: 1 1 0;
          min-height: 0;
        }
        .two-col .card { margin-bottom: 0; }
        .material-dot {
          display: inline-block; width: 11px; height: 11px; border-radius: 50%;
          margin-right: 6px; vertical-align: middle;
        }

        .timeline {
          margin-top: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 100%;
        }
        .timeline-track {
          position: relative;
          display: flex;
          justify-content: space-between;
          padding: 0 6px;
          margin-bottom: 0;
        }
        .timeline-track::before {
          content: "";
          position: absolute;
          left: 6%; right: 6%; top: 0.7vh;
          height: 2px;
          background: var(--line);
        }
        .tl-point {
          position: relative;
          flex: 1;
          text-align: center;
          z-index: 1;
        }
        .tl-point .node {
          width: 1.4vh; height: 1.4vh;
          border-radius: 50%;
          background: var(--clay);
          border: 2px solid #fff;
          margin: 0 auto 0.7vh;
          box-shadow: 0 0 0 1px var(--clay);
        }
        .tl-point .year {
          font-family: 'Trebuchet MS', sans-serif;
          font-weight: 700;
          font-size: clamp(13px, 1.8vh, 17px);
          color: var(--ink);
          margin-bottom: 0.3vh;
        }
        .tl-point .desc {
          font-size: clamp(12px, 1.6vh, 16px);
          color: #5c4c3a;
          line-height: 1.3;
          padding: 0 4px;
        }

        /* -------- page 2 layout (fixes overlap) -------- */
        #page2 {
          gap: 0.9vh;
        }
        #page2 .label-row {
          flex: 0 0 auto;
          margin-bottom: 0.2vh;
        }
        #page2 .page-heading {
          flex: 0 0 auto;
          margin: 0;
          font-size: clamp(19px, 2.85vh, 26px);
          color: var(--heading-color);
        }
        #page2 .material-card {
          flex: 0 0 auto;
          padding: 1vh 1.3vw;
        }
        #page2 .material-card h3 {
          margin-bottom: 0.3vh;
          font-size: clamp(18px, 2.65vh, 24px);
        }
        #page2 .material-card p {
          font-size: clamp(13.5px, 1.9vh, 17.5px);
          line-height: 1.35;
        }
        #page2 .callout-box {
          flex: 0 0 auto;
          padding: 1vh 1.3vw;
        }
        #page2 .callout-box .label-row {
          margin-bottom: 0.4vh;
        }
        #page2 .timeline-card {
          flex: 1 1 0;
          min-height: 0;
          max-height: 19vh;
          justify-content: flex-start;
          padding: 0.7vh 1.3vw;
        }
        #page2 .timeline-card h3 {
          margin: 0 0 0.4vh;
          font-size: clamp(17px, 2.4vh, 21px);
          color: var(--heading-color);
          flex: 0 0 auto;
        }
        #page2 .timeline-card .timeline {
          flex: 1 1 0;
          min-height: 0;
        }

        /* -------- footer / pagination / nav -------- */
        .right-foot {
          margin-top: 1.2vh;
          padding-top: 1.2vh;
          border-top: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex: 0 0 auto;
        }

        .page-indicator {
          font-family: 'Trebuchet MS', sans-serif;
          font-size: clamp(14px, 1.8vh, 17px);
          color: #7a6a55;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .dots { display: flex; gap: 6px; }
        .dots span {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--line);
          transition: background 0.25s ease;
        }
        .dots span.active { background: var(--clay); }

        .nav-btns { display: flex; gap: 10px; }

        .chapter-intro-wrapper button {
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
        .chapter-intro-wrapper button:active { transform: translateY(1px) scale(0.98); }

        .btn-secondary {
          background: #e8e0cf;
          color: var(--ink);
        }
        .btn-secondary:hover:not(:disabled) { background: #ddd2b8; }

        .btn-primary {
          background: var(--ink);
          color: #fdf6e8;
        }
        .btn-primary:hover:not(:disabled) { box-shadow: 0 4px 12px -2px rgba(0,0,0,0.3); }

        .chapter-intro-wrapper button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .bottom-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-top: 1vh;
          flex: 0 0 auto;
        }
        .bottom-bar button { padding: 1.2vh 1.6vw; }

        .chapter-intro-wrapper * { font-weight: 700 !important; }

        .requested-light-green { color: #D46A92 !important; }
      `}</style>

      <div className="stage">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%', height: '100%', minHeight: 0 }}>

          <div className="frame">
            {/* ============ LEFT (STATIC) ============ */}
            <div className="left">
              <div className="eyebrow"><span className="requested-light-green">Chapter 6 · Class 6 Science</span></div>
              <h1 className="title">Materials Around Us</h1>

              <div className="left-image">
                <img src={ancientHeroImage} alt="Ancient Indian pottery, brass vessels, minerals and metallurgy tools" />
              </div>

              <div className="quote-block">
                <p className="quote-sanskrit">उपादनं भवेतस्य (मूणाया:) मुनिका लोहेन च ।</p>
                <p className="quote-ref-small">(रसरतसमुच्चय – १०.३)</p>
                <p className="quote-en">"The materials used to make the crucible (a vessel used to melt substances) are clay and iron."</p>
                <p className="quote-source">— Rasaratnasamuchchaya, 10.3</p>
              </div>
            </div>

            {/* ============ RIGHT (DYNAMIC) ============ */}
            <div className="right">

              <div className="right-head" id="rightHead">
                <span className="icon">📖</span>
                <span id="rightHeadText">Historical Facts – Ancient Indian Science</span>
              </div>

              <div className="flip-stage" id="flipStage">

                {/* PAGE 1 */}
                <div className={page1Classes} id="page1" style={{ zIndex: page1ZIndex }}>
                  <div className="card">
                    <h3>Ancient Indian Science – Early Materials Engineering</h3>
                    <p>Long ago, Indian scientists picked the right material for each job. This was one of the first steps in materials science.</p>
                  </div>

                  <div className="card">
                    <div className="label-row"><span className="dot">📜</span> Ancient Source</div>
                    <h3 style={{ marginBottom: '2px' }}>Rasaratnasamuchchaya</h3>
                    <p>An important Sanskrit text on metallurgy, minerals, and traditional chemical practices.</p>
                  </div>

                  <div className="card">
                    <div className="label-row"><span className="dot">🔬</span> Scientific Connection</div>
                    <h3 style={{ marginBottom: '2px' }}>Properties Matter</h3>
                    <p>Clay does not burn easily, and iron is very strong. Ancient people chose materials based on properties like these.</p>
                  </div>

                  <div className="card">
                    <div className="label-row"><span className="dot">🔥</span> Used For</div>
                    <h3 style={{ marginBottom: '2px' }}>Crucible (Melting Vessel)</h3>
                    <p>A crucible is a special container used to heat or melt substances at very high temperatures.</p>
                  </div>
                </div>

                {/* PAGE 2 */}
                <div className={page2Classes} id="page2" style={{ zIndex: page2ZIndex }}>
                  <div className="label-row"><span className="dot">🧪</span> Material Choice</div>
                  <h3 className="page-heading">The Crucible Was Made of Two Materials</h3>

                  <div className="card material-card">
                    <h3><span className="material-dot" style={{ background: '#4a3a2a' }}></span>Clay</h3>
                    <p>Withstands high temperatures without melting easily — used for the outer body.</p>
                  </div>

                  <div className="card material-card">
                    <h3><span className="material-dot" style={{ background: '#8a8a8a' }}></span>Iron</h3>
                    <p>Provides strength and durability, keeping the crucible stable during heating.</p>
                  </div>

                  <div className="card callout callout-box">
                    <div className="label-row" style={{ color: '#a9812f' }}>ⓘ Why This Matters For Our Chapter</div>
                    <ul>
                      <li>Different materials have different properties.</li>
                      <li>We choose materials based on their use, not just their appearance.</li>
                      <li>This is exactly why we classify materials in this chapter.</li>
                    </ul>
                  </div>

                  <div className="card timeline-card">
                    <h3>Timeline of Indian Materials Science</h3>
                    <div className="timeline">
                      <div className="timeline-track">
                        <div className="tl-point">
                          <div className="node"></div>
                          <div className="year">3000 BCE</div>
                          <div className="desc">Indus Valley baked clay bricks</div>
                        </div>
                        <div className="tl-point">
                          <div className="node"></div>
                          <div className="year">400 CE</div>
                          <div className="desc">Iron Pillar of Delhi built (rust-resistant iron)</div>
                        </div>
                        <div className="tl-point">
                          <div className="node"></div>
                          <div className="year">13th Century</div>
                          <div className="desc">Rasaratnasamuchchaya written</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="right-foot">
                <div className="page-indicator">
                  <span id="pageLabel">Page {currentPage} / 2</span>
                  <span className="dots">
                    <span id="dot1" className={currentPage === 1 ? 'active' : ''}></span>
                    <span id="dot2" className={currentPage === 2 ? 'active' : ''}></span>
                  </span>
                </div>
                <div className="nav-btns">
                  <button className="btn-secondary" id="prevBtn" disabled={currentPage === 1} onClick={() => goToPage(1)}>← Previous Page</button>
                  <button className="btn-primary" id="nextBtn" disabled={currentPage === 2} onClick={() => goToPage(2)}>Next Page →</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-bar">
            <button className="btn-secondary" id="backBtn" onClick={onBack}>← Back</button>
            <button className="btn-primary" id="beginBtn" onClick={onContinue}>Begin Investigation →</button>
          </div>

        </div>
      </div>
    </div>
  );
}


