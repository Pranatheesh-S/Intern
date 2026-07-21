import React from "react";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function SloganPage({
  chapterNum,
  title,
  sloganImg,
  sloganExplanation,
  onBack,
  onEnterLab,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generate stable random bubbles across the width of the page
  const bubbles = React.useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4, // 4px to 12px
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 5,
    }));
  }, []);

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      color: "#1e293b",
      background: "#e9e4d8",
      fontFamily: "Space Grotesk, system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <style>{`
        /* Erupting bubbles styling from cover page */
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
          background: rgba(47, 107, 61, 0.18); /* matching green theme */
          animation: bubbleRise linear infinite;
        }
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; }
          100% { transform: translateY(-105vh) scale(1.3); opacity: 0; }
        }

        /* Full-screen layout */
        .frame {
          width: 100%;
          height: 100vh;
          background: #fff;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          z-index: 10;
          position: relative;
        }

        /* Scrollable layout columns for full height */
        .left {
          background: #f4ecdf;
          padding: clamp(75px, 8vw, 95px) clamp(20px, 2.5vw, 36px) clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px);
          overflow-y: auto;
          height: 100vh;
          box-sizing: border-box;
        }
        .right {
          background: #ffffff;
          padding: clamp(75px, 8vw, 95px) clamp(20px, 2.5vw, 36px) clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
          box-sizing: border-box;
        }

        /* Slim green scrollbars */
        .left::-webkit-scrollbar, .right::-webkit-scrollbar {
          width: 6px;
        }
        .left::-webkit-scrollbar-track, .right::-webkit-scrollbar-track {
          background: transparent;
        }
        .left::-webkit-scrollbar-thumb, .right::-webkit-scrollbar-thumb {
          background: rgba(47, 107, 61, 0.25);
          border-radius: 99px;
        }
        .left::-webkit-scrollbar-thumb:hover, .right::-webkit-scrollbar-thumb:hover {
          background: rgba(47, 107, 61, 0.45);
        }

        /* Cascade Sequential Pop Up animations (one-by-one) */
        .animate-pop {
          opacity: 0;
          transform: translateY(16px) scale(0.97);
          animation: popInOneByOne 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        @keyframes popInOneByOne {
          0% { opacity: 0; transform: translateY(16px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .eyebrow {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #b5651d;
          margin-bottom: 10px;
        }
        .eyebrow span.chap {
          color: #0b1f3a;
          background: #e3dcc9;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
        }
        
        h1.title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(26px, 3.2vw, 38px);
          color: #0b1f3a;
          margin: 0 0 26px 0;
          line-height: 1.15;
          font-weight: bold;
        }

        .hero {
          position: relative;
          height: clamp(150px, 20vh, 260px);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 26px;
          background: linear-gradient(160deg, #2f6b3d 0%, #1e4a28 55%, #14331b 100%);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        .hero img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #c9932e;
          color: #3a2705;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.8px;
          padding: 8px 14px;
          border-radius: 20px;
        }
        .caption {
          position: absolute;
          bottom: 14px;
          left: 18px;
          color: #f4ecdf;
          font-size: 13px;
          opacity: 0.9;
        }

        .quote-card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 8px 22px rgba(0,0,0,0.08);
          padding: clamp(20px, 2.5vw, 30px) clamp(20px, 2.5vw, 34px);
          position: relative;
        }
        .quote-mark {
          font-size: 46px;
          color: #2f6b3d;
          line-height: 0.5;
          margin-bottom: 10px;
          font-family: Georgia, serif;
        }
        .sanskrit {
          font-size: 16px;
          color: #0b1f3a;
          font-weight: 600;
          line-height: 1.7;
          margin-bottom: 6px;
        }
        .source-top {
          text-align: right;
          color: #7a7364;
          font-size: 13px;
          margin-bottom: 16px;
        }
        .translation {
          font-family: Georgia, serif;
          font-style: italic;
          color: #33322e;
          font-size: clamp(16px, 1.8vw, 22px);
          font-weight: 700;
          line-height: 1.65;
        }
        .source-bottom {
          text-align: right;
          color: #33322e;
          font-style: italic;
          font-size: 15px;
          margin-top: 14px;
        }

        .right h2.section {
          font-family: Georgia, serif;
          font-size: 24px;
          color: #0b1f3a;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
        }
        
        .highlight {
          background: #e9edfb;
          border-left: 5px solid #3a5bbf;
          border-radius: 14px;
          padding: 22px 26px;
          margin-bottom: 26px;
          text-align: left;
        }
        .highlight h3 {
          font-family: Georgia, serif;
          color: #0b1f3a;
          font-size: 19px;
          margin: 0 0 10px 0;
          font-weight: bold;
        }
        .highlight p {
          color: #3a3a34;
          font-size: 15px;
          line-height: 1.65;
          margin: 0;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          width: 100%;
        }
        .card {
          background: #fff;
          border: 1px solid #ece7db;
          border-radius: 16px;
          padding: 18px 20px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
          text-align: left;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }
        .card .label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #b5651d;
          margin-bottom: 6px;
        }
        .card h4 {
          font-family: Georgia, serif;
          font-size: 17px;
          color: #0b1f3a;
          margin: 0 0 8px 0;
          font-weight: bold;
        }
        .card p {
          font-size: 13.5px;
          color: #5a584f;
          line-height: 1.55;
          margin: 0;
        }

        .back-cover-btn {
          position: absolute;
          top: clamp(14px, 2.5vw, 36px);
          left: clamp(14px, 2.5vw, 36px);
          z-index: 30;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #0b1f3a;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .back-cover-btn:hover {
          color: #0b1f3a;
        }

        .enter-lab-cta {
          margin-top: auto;
          align-self: flex-start;
          font-weight: 700;
          border: none;
          cursor: pointer;
          background: #10b981;
          color: #06180f;
          padding: 14px 36px;
          border-radius: 10px;
          font-size: 16px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .enter-lab-cta:hover {
          background: #34d399;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
        }

        @media (max-width: 980px) {
          .frame {
            grid-template-columns: 1fr;
            overflow-y: auto;
            max-height: 85vh;
          }
          .grid {
            grid-template-columns: 1fr;
          }
          .enter-lab-cta {
            margin-top: 24px;
          }
        }
      `}</style>

      {/* Bubble background */}
      <div className="bubble-bg">
        {bubbles.map(b => (
          <span key={b.id} style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`
          }} />
        ))}
      </div>

      <button className="back-cover-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Cover Page
      </button>

      {chapterNum === 2 && (
        <button 
          className="enter-lab-cta animate-pop" 
          style={{ 
            position: 'absolute', 
            top: 'clamp(14px, 2.5vw, 36px)', 
            right: 'clamp(14px, 2.5vw, 36px)', 
            zIndex: 30, 
            animationDelay: "0.85s", 
            margin: 0,
            padding: '10px 20px',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)'
          }} 
          onClick={onEnterLab}
        >
          Enter Learning Lab <BookOpen size={16} />
        </button>
      )}

      {chapterNum === 2 ? (
        /* EXACT FROM-HEAD-TO-TOE HTML PREVIEW SPECIFICATION FOR CHAPTER 2 */
        <div className="frame">
          <div className="left">
            <div className="eyebrow animate-pop" style={{ animationDelay: "0.1s" }}>
              <span className="chap">CH</span>APTER 2 &nbsp;•&nbsp; CLASS 6 SCIENCE
            </div>
            
            <h1 className="title animate-pop" style={{ animationDelay: "0.22s" }}>Diversity in the Living World</h1>
            
            <div className="hero animate-pop" style={{ animationDelay: "0.38s" }}>
              <div className="badge">ANCIENT WISDOM ON NATURE</div>
              <img src="/activities/cover_banner_ch2.png" alt="Ancient wisdom nature illustration" />
              <div className="caption">Ancient wisdom linking tree life and human society.</div>
            </div>
            
            <div className="quote-card animate-pop" style={{ animationDelay: "0.58s" }}>
              <div className="quote-mark">“</div>
              <div className="sanskrit">
                छायामन्यस्य कुर्वन्ति तिष्ठन्ति स्वयमातपे ।<br />
                फलान्यपि परार्थाय वृक्षाः सत्पुरुषा इव ॥
              </div>
              <div className="source-top">(सुभाषित)</div>
              <div className="translation">
                "Trees stand in the Sun and give shade to others. Their fruits are also for others. Likewise, good people bear all hardships and bring welfare to others. They give to others whatever they have earned."
              </div>
              <div className="source-bottom">(Wise saying)</div>
            </div>
          </div>
          
          <div className="right">
            <div style={{ marginBottom: "20px", flexShrink: 0 }}>
              <h2 className="section animate-pop" style={{ animationDelay: "0.78s", margin: 0 }}>Why study this chapter?</h2>
            </div>
            
            <div className="highlight animate-pop" style={{ animationDelay: "0.98s" }}>
              <h3>Interconnected Web of Life</h3>
              <p>
                {sloganExplanation}
              </p>
            </div>
            
            <div className="grid" style={{ marginBottom: "12px" }}>
              <div className="card animate-pop" style={{ animationDelay: "1.12s" }}>
                <div className="label">01 &nbsp;•&nbsp; BIOMES & HABITATS</div>
                <h4>Biomes & Habitats</h4>
                <p>Plants and animals thrive in specific environments, from deserts to grasslands, adapting to survive.</p>
              </div>
              <div className="card animate-pop" style={{ animationDelay: "1.24s" }}>
                <div className="label">02 &nbsp;•&nbsp; ADAPTATION</div>
                <h4>Adaptation</h4>
                <p>Discover how organisms develop special features over generations to fit their unique habitats.</p>
              </div>
              <div className="card animate-pop" style={{ animationDelay: "1.36s" }}>
                <div className="label">03 &nbsp;•&nbsp; INTERCONNECTED LIFE</div>
                <h4>Interconnected Life</h4>
                <p>Understand the delicate web where plants, animals, and humans depend on each other for survival.</p>
              </div>
              <div className="card animate-pop" style={{ animationDelay: "1.48s" }}>
                <div className="label">04 &nbsp;•&nbsp; CLASSIFICATION</div>
                <h4>Classification</h4>
                <p>Learn how scientists group and organize the vast variety of living creatures based on shared traits.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD ROUTING FOR OTHER BIOLOGY CHAPTERS */
        <div style={{
          width: "100%",
          maxWidth: "1350px",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          alignItems: "center",
          padding: "2rem clamp(24px, 4vw, 64px)",
          gap: "clamp(24px, 5vw, 80px)",
          zIndex: 5,
          boxSizing: "border-box"
        }}>
          {/* LEFT SHEET: Slogan Mount */}
          <div className="animate-pop" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%", animationDelay: "0.2s" }}>
            <div className="quote-card" style={{ background: "#faf8f4", border: "1px solid rgba(0,0,0,0.08)" }}>
              <div className="vintage-tape" />
              <div className="spiral-holes" style={{ display: "none" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="spiral-hole" />
                ))}
              </div>

              <div style={{ position: "relative", width: "100%", padding: "0.4rem", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px", boxSizing: "border-box" }}>
                {sloganImg ? (
                  <img
                    src={sloganImg}
                    alt="Chapter Slogan"
                    style={{
                      width: "100%",
                      maxHeight: "380px",
                      objectFit: "contain",
                      borderRadius: "4px"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "260px",
                    background: "linear-gradient(135deg, #065f46 0%, #022c22 100%)",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a7f3d0",
                    padding: "2rem",
                    textAlign: "center",
                    boxSizing: "border-box"
                  }}>
                    <Sparkles size={48} style={{ marginBottom: "1rem", color: "#34d399" }} />
                    <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>वृक्षाः सत्पुरुषा इव</h3>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem", opacity: 0.8 }}>"Trees are like good people, living for others."</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SHEET: Explanation text */}
          <div className="animate-pop" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%", animationDelay: "0.7s" }}>
            <div className="quote-card" style={{ background: "#faf8f4", border: "1px solid rgba(0,0,0,0.08)", transform: "rotate(1deg)" }}>
              <div style={{ position: "absolute", top: "0.85rem", right: "1.25rem", fontFamily: "monospace", fontSize: "0.75rem", fontWeight: "bold", color: "#8b5a2b", opacity: 0.8, letterSpacing: "0.08em" }}>[ 📁 FIELD ENTRY #0{chapterNum} ]</div>
              <h4 style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: "1.6rem", color: "#065f46", borderBottom: "2px solid rgba(6, 95, 70, 0.15)", paddingBottom: "0.5rem", marginBottom: "1.25rem", marginTop: 0 }}>Why study this chapter?</h4>
              <p style={{ fontSize: "1.15rem", lineHeight: "1.85", color: "#1a202c", textAlign: "left", margin: 0 }}>
                {sloganExplanation}
              </p>
            </div>

            <button className="enter-lab-cta animate-pop" style={{ animationDelay: "1.2s" }} onClick={onEnterLab}>
              Enter Learning Lab <BookOpen size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
