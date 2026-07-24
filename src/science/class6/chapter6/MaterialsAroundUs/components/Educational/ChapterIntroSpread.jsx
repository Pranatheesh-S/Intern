import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ArrowRight, Lightbulb, Link2, Info, ArrowLeft, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChapterIntroSpread({ onContinue, onBack }) {
  const rightPageRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    if (rightPageRef.current) {
      rightPageRef.current.scrollTop = 0;
      // Unlock immediately if the content doesn't require scrolling
      const { scrollHeight, clientHeight } = rightPageRef.current;
      if (scrollHeight <= clientHeight + 10) {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleScroll = (e) => {
    if (isUnlocked) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Unlock if scrolled within 50px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setIsUnlocked(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#ffffff',
      fontFamily: 'Georgia, "Times New Roman", serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '16px',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <style>
        {`
          .book-frame {
            width: 100%;
            height: 100%;
            background: #ffffff;
            border: 8px solid #1b2a4a;
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 30px 80px rgba(0,0,0,0.18);
            position: relative;
          }
          .spread {
            display: flex;
            width: 100%;
            height: 100%;
            border-radius: 18px;
            overflow: hidden;
          }
          .page-spread {
            flex: 1;
            padding: 44px 48px 40px;
          }
          .left-page {
            background: #f6f1e4;
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
            position: relative;
          }
          .right-page {
            background: #ffffff;
            border-left: 1px solid #ece7d8;
            height: 100%;
            overflow-y: auto;
          }

          /* ---------- LEFT PAGE ---------- */
          .eyebrow {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12.5px;
            font-weight: 700;
            letter-spacing: 2px;
            color: #d97a2f;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .title {
            font-size: 44px;
            line-height: 1.08;
            color: #1b2a4a;
            font-weight: 700;
            margin: 0 0 24px 0;
          }
          .illustration {
            position: relative;
            background: linear-gradient(160deg, #16233f, #101a30);
            border: 2px solid #1b2a4a;
            border-radius: 16px;
            flex: 1.2;
            min-height: 230px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: 0 10px 24px rgba(20,30,60,0.25);
          }
          .badge {
            position: absolute;
            top: 16px;
            right: 16px;
            background: #c8932f;
            color: #fff;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 1.2px;
            padding: 6px 12px;
            border-radius: 20px;
            text-transform: uppercase;
          }
          .illu-caption {
            position: absolute;
            left: 18px;
            bottom: 16px;
            color: #c9d2e6;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11.5px;
            letter-spacing: 0.3px;
          }
          .quote-card {
            position: relative;
            margin-top: 24px;
            background: #ffffff;
            border: 1px solid #e7e2d3;
            border-radius: 10px;
            padding: 22px 30px 20px;
            color: #26324d;
            box-shadow: 0 4px 10px rgba(30,30,30,0.04);
            flex: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .quote-card .quote-mark {
            position: absolute;
            top: 6px;
            left: 14px;
            font-family: Georgia, serif;
            font-size: 46px;
            line-height: 1;
            color: #3f7d4f;
            opacity: 0.85;
          }
          .quote-card .quote-mark-end {
            display: inline-block;
            font-family: Georgia, serif;
            font-size: 34px;
            line-height: 0;
            color: #3f7d4f;
            opacity: 0.85;
            vertical-align: -14px;
            margin-left: 6px;
          }
          .quote-card .quote-sanskrit {
            font-size: 26px;
            font-weight: 700;
            color: #1b2a4a;
            line-height: 1.5;
            margin: 6px 0 4px;
          }
          .quote-card .quote-citation-sm {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            color: #6b7280;
            text-align: right;
            margin-bottom: 14px;
          }
          .quote-card .quote-translation {
            font-style: italic;
            color: #26324d;
            font-size: 22px;
            line-height: 1.55;
          }
          .quote-card .quote-citation {
            margin-top: 10px;
            text-align: right;
            font-size: 18px;
            color: #26324d;
          }

          /* ---------- RIGHT PAGE ---------- */
          .r-heading {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: 700;
            color: #1b2a4a;
            margin: 0 0 20px 0;
          }
          .r-heading svg { flex: none; }

          .hero-card {
            background: #eef0fb;
            border-left: 4px solid #3b4ea0;
            border-radius: 10px;
            padding: 20px 24px;
            margin-bottom: 18px;
          }
          .hero-card h2 {
            margin: 0 0 8px 0;
            font-size: 22px;
            color: #1b2a4a;
            font-weight: 700;
          }
          .hero-card p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 22px;
            line-height: 1.65;
            color: #1e293b;
          }

          .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 18px;
          }
          .cell {
            border: 1px solid #e7e2d3;
            border-radius: 10px;
            padding: 14px 16px;
            background: #fff;
          }
          .cell .label {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.1px;
            color: #a97417;
            margin-bottom: 6px;
            text-transform: uppercase;
          }
          .cell .h {
            display: flex;
            align-items: flex-start;
            gap: 7px;
            font-size: 17.5px;
            font-weight: 700;
            color: #1b2a4a;
            margin-bottom: 4px;
            line-height: 1.3;
          }
          .cell .sub {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 18px;
            color: #334155;
            line-height: 1.5;
          }
          .cell.quote-cell .h { font-style: italic; font-size: 13.5px; font-weight: 600; line-height: 1.4; }
          .cell.wide { grid-column: 1 / -1; }

          .box {
            border-radius: 10px;
            padding: 18px 22px;
            margin-bottom: 14px;
          }
          .box.orange {
            background: #fdf1e3;
            border: 1px solid #f2d9b8;
          }
          .box.green {
            background: #eef6ee;
            border: 1px solid #cfe6d3;
          }
          .box h3 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 10px 0;
            font-size: 15px;
            font-weight: 700;
          }
          .box.orange h3 { color: #d97a2f; }
          .box.green h3 { color: #3f7d4f; }
          .box ul {
            margin: 0;
            padding-left: 18px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            line-height: 1.7;
            color: #1f2937;
          }
          .box p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            line-height: 1.7;
            color: #1f2937;
          }

          .timeline-heading {
            font-size: 15px;
            font-weight: 700;
            color: #1b2a4a;
            margin: 22px 6px 0;
            letter-spacing: 0.2px;
          }
          .timeline {
            position: relative;
            margin: 14px 6px 8px;
            padding-top: 10px;
          }
          .timeline .line {
            position: absolute;
            top: 16px;
            left: 0;
            right: 0;
            height: 2px;
            background: #e4dfce;
          }
          .timeline .events {
            display: flex;
            justify-content: space-between;
            position: relative;
          }
          .timeline .event {
            flex: 1;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
          }
          .timeline .dot {
            width: 12px;
            height: 12px;
            background: #c8932f;
            border-radius: 50%;
            margin: 0 auto 10px;
            position: relative;
            z-index: 2;
            box-shadow: 0 0 0 4px #fff;
          }
          .timeline .date {
            font-weight: 700;
            font-size: 13.5px;
            color: #1b2a4a;
            margin-bottom: 2px;
          }
          .timeline .desc {
            font-size: 16px;
            color: #4b5563;
            padding: 0 8px;
            line-height: 1.45;
          }

          .fact-card {
            margin-top: 20px;
            background: #fdf0d6;
            border: 1px solid #f0d9a6;
            border-radius: 10px;
            padding: 16px 20px;
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }
          .fact-card .icon {
            font-size: 20px;
            line-height: 1;
          }
          .fact-card h4 {
            margin: 0 0 4px 0;
            font-size: 13.5px;
            font-weight: 700;
            color: #a97417;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 0.3px;
          }
          .fact-card p {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 20px;
            line-height: 1.65;
            color: #1e293b;
          }

          .spread-next-btn {
            position: absolute;
            top: 24px;
            right: 24px;
            z-index: 10000;
            background: #3b4ea0;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(59,78,160,0.3);
            transition: all 0.3s;
          }
          .spread-next-btn:not(:disabled) {
            cursor: pointer;
          }
          .spread-next-btn:not(:disabled):hover {
            transform: translateY(-2px);
            background: #2a3a80;
          }
          .spread-next-btn:disabled {
            background: #cbd5e1;
            color: #64748b;
            box-shadow: none;
            cursor: not-allowed;
          }
          .spread-back-btn {
            position: absolute;
            top: 24px;
            left: 24px;
            z-index: 10000;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            color: #1e293b;
            padding: 8px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: all 0.2s;
          }
          .spread-back-btn:hover {
            background: #f8fafc;
            transform: translateY(-1px);
          }
        `}
      </style>

      <button className="spread-back-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back
      </button>

      <button 
        className="spread-next-btn" 
        onClick={onContinue}
        disabled={!isUnlocked}
        title={!isUnlocked ? "Scroll down to read all content first" : ""}
      >
        {isUnlocked ? <Unlock size={16} /> : <Lock size={16} />}
        Begin Investigation <ArrowRight size={18} />
      </button>

      <motion.div 
        className="book-frame"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="spread">
          {/* ---------- LEFT PAGE ---------- */}
          <div className="page-spread left-page">
            <div className="eyebrow">CHAPTER 6 &nbsp;•&nbsp; CLASS 8 SCIENCE</div>
            <h1 className="title">Materials Around Us</h1>
            
            <div className="illustration">
              <img 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', background: '#1b2a4a' }} 
                src="/blueprint_glassware.png" 
                alt="Laboratory glassware and chemical structures blueprint" 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400/1b2a4a/ffffff?text=Science+Blueprint'; }}
              />
              <div className="badge">Ancient Indian Materials Science</div>
              <div className="illu-caption">Blueprint sketch - laboratory glassware &amp; simple chemical structures</div>
            </div>
            
            <div className="quote-card">
              <span className="quote-mark">“</span>
              <div className="quote-sanskrit">उपादानं भवेत्तस्य (मूषायाः) मृत्तिका लोहमेव च।</div>
              <div className="quote-citation-sm">(रसरत्नसमुच्चय—१०.३)</div>
              <div className="quote-translation">
                The materials used to make the crucible (a vessel used to melt substances) are clay and iron.
                <span className="quote-mark-end">”</span>
              </div>
              <div className="quote-citation">(Rasaratnasamuchchaya - 10.3)</div>
            </div>
          </div>

          {/* ---------- RIGHT PAGE ---------- */}
          <div className="page-spread right-page" ref={rightPageRef} onScroll={handleScroll}>
            <div className="r-heading">
              <BookOpen size={24} color="#1b2a4a" />
              Historical Facts — Ancient Indian Science
            </div>

            <div className="hero-card">
              <h2>Ancient Indian Science — Early Materials Engineering</h2>
              <p>Ancient Indian scholars carefully selected materials based on their properties. Long before modern laboratories, they understood that different materials were suitable for different purposes.</p>
            </div>

            <div className="grid-container">
              <div className="cell">
                <div className="label">Ancient Source</div>
                <div className="h">📜 Rasaratnasamuchchaya</div>
                <div className="sub">An important Sanskrit text on metallurgy, minerals, and traditional chemical practices.</div>
              </div>
              <div className="cell">
                <div className="label">Scientific Connection</div>
                <div className="h">🔬 Properties Matter</div>
                <div className="sub">Ancient Indians selected clay because it is heat resistant, and iron because it is strong — an early understanding of material properties.</div>
              </div>
              <div className="cell">
                <div className="label">Used For</div>
                <div className="h">🔥 Crucible (Melting Vessel)</div>
                <div className="sub">A crucible is a special container used to heat or melt substances at very high temperatures.</div>
              </div>
              <div className="cell">
                <div className="label">Material Choice 1</div>
                <div className="h">🟤 Clay</div>
                <div className="sub">Clay can withstand high temperatures without melting easily, making it suitable for the outer body of a crucible.</div>
              </div>
              <div className="cell wide">
                <div className="label">Material Choice 2</div>
                <div className="h">⚙️ Iron</div>
                <div className="sub">Iron provides strength and durability, helping the crucible remain stable during heating.</div>
              </div>
            </div>

            <div className="box orange">
              <h3><Info size={18} /> Why this matters for our chapter</h3>
              <ul>
                <li>Different materials have different properties.</li>
                <li>We choose materials based on their use, not just their appearance.</li>
                <li>This is exactly why we classify materials in this chapter.</li>
              </ul>
            </div>

            <div className="box green">
              <h3><Link2 size={18} /> Real-Life Example</h3>
              <p>Just like ancient scientists used clay for crucibles, today we use clay to make bricks for houses because it is strong and resists heat. We use iron for cooking pans because it conducts heat well!</p>
            </div>

            <div className="timeline-heading">Timeline of Indian Materials Science</div>
            <div className="timeline">
              <div className="line"></div>
              <div className="events">
                <div className="event">
                  <div className="dot"></div>
                  <div className="date">3000 BCE</div>
                  <div className="desc">Indus Valley baked clay bricks</div>
                </div>
                <div className="event">
                  <div className="dot"></div>
                  <div className="date">400 CE</div>
                  <div className="desc">Iron Pillar of Delhi built (Rust-resistant iron)</div>
                </div>
                <div className="event">
                  <div className="dot"></div>
                  <div className="date">13th Century</div>
                  <div className="desc">Rasaratnasamuchchaya written</div>
                </div>
              </div>
            </div>

            <div className="fact-card">
              <div className="icon">💡</div>
              <div>
                <h4>Did You Know?</h4>
                <p>The famous <strong>Iron Pillar of Delhi</strong> was built over 1,600 years ago and has barely rusted! This shows that ancient Indian metallurgists had a highly advanced understanding of materials and how to prevent corrosion.</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
