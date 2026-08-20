import React, { useState, useEffect, useRef } from "react";


const SvgIcons = {
  MagnifyingGlass: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
  ),
  Play: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>),
  Pause: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>),
  Check: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>),
  IconCurrent: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg>),
  IconLocked: () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"></path></svg>)
};


const clues = [
  {
    id: 1,
    title: "HOW OLD IS POTTERY?",
    bigFact: "7,000ΓÇô8,000 YEARS",
    text: "The earliest pottery found in the Indian subcontinent dates back to 7,000 to 8,000 years in the Ganga plains (Lahuradewa) and in Baluchistan (Mehrgarh).",
    timelineText: "AGE"
  },
  {
    id: 2,
    title: "POTTERY TECHNOLOGY",
    bigFact: "AROUND 4000 BCE",
    text: "About 4000 BCE onwards, Sindhu-Sarasvat─½ developed techniques of wheel-turned pottery production, pigmentation, application of protective or decorative coats (called ΓÇÿslipsΓÇÖ) of multiple colours, decorative painting, etc.",
    timelineText: "SHAPING"
  },
  {
    id: 3,
    title: "HARAPPAN POTTERY",
    bigFact: "2600ΓÇô1900 BCE",
    text: "These techniques became further sophisticated during the Sindhu-Sarasvat─½ (also known as ΓÇÿHarappanΓÇÖ) Civilisation (2600ΓÇô1900 BCE), with a bright red surface painted with black-coloured designs displaying geometric patterns, and aquatic and terrestrial animals.",
    timelineText: "DESIGN"
  },
  {
    id: 4,
    title: "HOW WAS IT MADE?",
    bigFact: "TERRACOTTA",
    text: "The clay used for making pots, dishes, bowls and other items was carefully selected and cleaned, sieved, kneaded, turned over a wheel and finally baked in kilns (baked clay is called ΓÇÿterracottaΓÇÖ).",
    timelineText: "MAKING"
  },
  {
    id: 5,
    title: "HOW WAS IT USED?",
    bigFact: "STORAGE & COOKING",
    text: "Pots were used for various purposes, from cooking to storage of food grains, oil, ghee, and so on. Some very large storage jars and other pottery items are exhibited at the National Museum, New Delhi.",
    timelineText: "USES"
  }
];

const HighlightedText = ({ phrases, activeCharIndex }) => {
  const fullText = phrases.join('');
  return (
    <span>
      {fullText.split('').map((char, index) => (
        <span key={index} style={{
          backgroundColor: index < activeCharIndex ? '#fef08a' : 'transparent',
          color: index < activeCharIndex ? '#000' : 'inherit',
          transition: 'background-color 0.1s',
          borderRadius: '2px'
        }}>
          {char}
        </span>
      ))}
    </span>
  );
};

const PotterySpotlight = ({ page1Layout }) => {
  const [currentClue, setCurrentClue] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [hasPlayed, setHasPlayed] = useState(false);

  const currentData = clues[currentClue - 1];

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  useEffect(() => {
    stopAudio();
    setHasPlayed(false);
  }, [currentClue]);

  useEffect(() => {
    return stopAudio;
  }, []);

  const playAudio = () => {
    if (!('speechSynthesis' in window)) return;
    stopAudio();
    setIsPlaying(true);
    setHasPlayed(true);

    const fullText = currentData.text;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = 'en-IN';
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.lang === 'en-IN' && (v.name.includes('Female') || v.name.includes('Ravi') === false));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 0.9;
    
    utterance.onboundary = (e) => {
      setActiveCharIndex(e.charIndex);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setActiveCharIndex(fullText.length);
    };

    window.speechSynthesis.speak(utterance);
  };

  const timelineNode = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', paddingTop: '16px', flexWrap: 'nowrap', overflow: 'hidden' }}>
      {clues.map((c, idx) => (
        <React.Fragment key={c.id}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div 
              onClick={() => setCurrentClue(c.id)}
              style={{
                width: '32px', height: '32px', 
                borderRadius: '50%',
                background: currentClue === c.id ? '#3b82f6' : (currentClue > c.id ? '#10b981' : '#e2e8f0'),
                color: currentClue === c.id || currentClue > c.id ? 'white' : '#64748b',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                boxShadow: currentClue === c.id ? '0 0 0 4px rgba(59,130,246,0.3)' : 'none',
                flexShrink: 0
              }}
            >
              {currentClue > c.id ? <SvgIcons.Check /> : `0${c.id}`}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 'bold', 
              color: currentClue === c.id ? '#3b82f6' : '#64748b',
              marginTop: '4px'
            }}>
              {c.timelineText}
            </div>
          </div>
          {idx < clues.length - 1 && (
            <div style={{ 
              height: '4px', 
              width: '40px',
              background: currentClue > c.id ? '#10b981' : '#e2e8f0',
              margin: '0 4px',
              flexShrink: 1,
              transform: 'translateY(-8px)'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px 0', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>
          {currentData.title}
        </h3>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '1px' }}>
          DO YOU KNOW?
        </div>
      </div>

      <div style={{ 
        flex: '1 1 auto', 
        backgroundColor: '#f8fafc', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: '24px',
        minHeight: 0,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        
        <div style={{ fontSize: '60px', fontWeight: '900', color: '#1e3a8a', marginBottom: '24px', lineHeight: '1.1' }}>
          {currentData.bigFact}
        </div>
        
        <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', maxWidth: '90%' }}>
          {isPlaying ? (
            <HighlightedText phrases={[currentData.text]} activeCharIndex={activeCharIndex} />
          ) : (
             <span style={{ backgroundColor: hasPlayed ? '#fef08a' : 'transparent' }}>{currentData.text}</span>
          )}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={isPlaying ? stopAudio : playAudio}
            style={{
              background: isPlaying ? '#ef4444' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '24px',
              padding: '12px 24px',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: 'bold', fontSize: '18px',
              cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {isPlaying ? <SvgIcons.Pause /> : <SvgIcons.Play />}
            {isPlaying ? 'PLAYING...' : (hasPlayed ? 'PLAY AGAIN' : 'PLAY EXPLANATION')}
          </button>
          
          {currentClue < clues.length ? (
             <button 
               onClick={() => setCurrentClue(currentClue + 1)}
               style={{
                 background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '24px',
                 padding: '12px 24px', fontWeight: 'bold', fontSize: '18px',
                 cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}
             >
               NEXT CLUE ΓåÆ
             </button>
          ) : (
             <div style={{
                 background: '#10b981', color: 'white', borderRadius: '24px',
                 padding: '12px 24px', fontWeight: 'bold', fontSize: '18px',
                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
               }}>
               INVESTIGATION COMPLETE! <SvgIcons.Check />
             </div>
          )}
        </div>
        {timelineNode}
      </div>
    </div>
  );
};

export default function InvestigationHandbook({
  currentFlowIndex = 0,
  onComplete,
  page1Layout = false,
}) {
  const isBarrier3 = currentFlowIndex >= 13;
  const isBarrier2 = currentFlowIndex >= 5 && currentFlowIndex < 13;

  return (
    <div
      style={{
        minHeight: 0,
        boxSizing: "border-box",
        height: "100%",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        border: "clamp(6px, 1.5vw, 18px) solid #1b2a4a",
        position: "relative",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "30px",
          background: "linear-gradient(to right, transparent, rgba(0,0,0,0.1))",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "2px",
          background: "rgba(0,0,0,0.1)",
          zIndex: 10,
        }}
      />

      {!isBarrier2 && !isBarrier3 ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: page1Layout ? "10px 18px" : "20px 28px 60px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: page1Layout ? "14px" : "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                margin: page1Layout ? "0 0 8px 0" : "0 0 12px 0",
                fontSize: page1Layout ? "var(--text-3xl)" : "var(--text-xl)",
                color: "#1b2a4a",
                fontWeight: "bold",
                borderBottom: "4px solid #3b4ea0",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              What are Objects Made Of?
            </h2>

            <div
              style={{
                fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                color: "#334155",
                lineHeight: page1Layout ? "1.4" : "1.5",
                marginBottom: page1Layout ? "8px" : "14px",
              }}
            >
              <p style={{ margin: "0" }}>
                Look around you! You can see many things - a chair, a book, a
                water bottle, a pencil and so on. These are all{" "}
                <strong style={{ color: "#1b2a4a" }}>objects.</strong> Even
                though they look different, each object is made of some{" "}
                <strong style={{ color: "#1b2a4a" }}>material.</strong>
              </p>
            </div>

            <div
              style={{
                border: "2px dashed #93c5fd",
                borderRadius: "10px",
                padding: page1Layout ? "8px" : "12px",
                marginBottom: page1Layout ? "8px" : "12px",
              }}
            >
              <div
                style={{
                  fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                  color: "#1e293b",
                  marginBottom: "6px",
                }}
              >
                <strong style={{ color: "#1b2a4a" }}>Material:</strong> The
                substance used to make an object.
              </div>
              <div
                style={{
                  fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                  color: "#1e293b",
                }}
              >
                <strong style={{ color: "#1b2a4a" }}>Object:</strong> Anything
                we can see or use around us.
              </div>
            </div>

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "10px",
                padding: page1Layout ? "8px" : "12px",
                marginBottom: page1Layout ? "8px" : "12px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 6px 0",
                  color: "#d97706",
                  fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                }}
              >
                Examples:
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                  color: "#451a03",
                }}
              >
                <div>Chair can be made of wood, plastic or steel.</div>
                <div>A plate can be made of steel, glass or plastic.</div>
                <div>A bottle can be made of plastic, glass or steel.</div>
              </div>
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                padding: page1Layout ? "8px" : "12px",
              }}
            >
              <div
                style={{
                  fontSize: page1Layout ? "var(--text-xl)" : "var(--text-base)",
                  color: "#1e3a8a",
                  lineHeight: "1.4",
                }}
              >
                <strong>Think!</strong> One object can be made from different
                materials. One material can be used to make many different
                objects.
              </div>
            </div>
          </div>

          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px dashed #cbd5e1",
              paddingLeft: page1Layout ? "16px" : "24px",
            }}
          >
            <h2
              style={{
                margin: page1Layout ? "0 0 8px 0" : "0 0 12px 0",
                fontSize: page1Layout ? "var(--text-3xl)" : "var(--text-xl)",
                color: "#1b2a4a",
                fontWeight: "bold",
                borderBottom: "4px solid #3b4ea0",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              Historical Spotlight: Pottery
            </h2>

            <PotterySpotlight page1Layout={page1Layout} />
          </div>
        </div>
      ) : isBarrier2 ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: "20px 28px 60px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "var(--text-xl)",
                color: "#1e3a8a",
                fontWeight: "bold",
                borderBottom: "4px solid #3b82f6",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              How Can We Group Objects?
            </h2>

            <div
              style={{
                fontSize: "var(--text-base)",
                color: "#334155",
                lineHeight: "1.5",
                marginBottom: "14px",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                We see many objects around us every day, such as books, bottles,
                spoons and toys.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                These objects may differ in their shape, size, colour and
                material.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                To make it easier to study and compare them, we group objects
                that share a{" "}
                <strong style={{ color: "#1e3a8a" }}>common property</strong>.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                This process is called{" "}
                <strong style={{ color: "#1e3a8a" }}>classification</strong>.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                Objects can be grouped based on their material, colour, shape,
                hardness, softness or shine.
              </p>
              <p style={{ margin: "0" }}>
                The same object can also be grouped in different ways depending
                on the property we choose.
              </p>
            </div>

            <div
              style={{
                background: "#eff6ff",
                border: "2px dashed #bfdbfe",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "#1e3a8a",
                  lineHeight: "1.4",
                }}
              >
                <strong>Remember</strong>
                <br />
                Classification means arranging objects into groups based on a{" "}
                <strong style={{ color: "#1e3a8a" }}>common property</strong>.
              </div>
            </div>
          </div>

          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px dashed #cbd5e1",
              paddingLeft: "24px",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "var(--text-xl)",
                color: "#1e3a8a",
                fontWeight: "bold",
              }}
            >
              Case File 02: Scientific Classification
            </h2>

            <div
              style={{
                fontSize: "var(--text-base)",
                color: "#334155",
                lineHeight: "1.5",
                marginBottom: "14px",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>Your next case is ready!</p>
              <p style={{ margin: "0 0 10px 0" }}>
                Observe each object carefully and identify the material it is
                made of.
              </p>
              <p style={{ margin: "0" }}>
                Once you identify the material, place the object into the
                correct material group.
              </p>
            </div>

            <div
              style={{
                border: "2px solid #ddd6fe",
                background: "#f5f3ff",
                borderRadius: "10px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  color: "#6d28d9",
                  fontSize: "var(--text-base)",
                }}
              >
                Examples
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: "#ede9fe",
                    color: "#6d28d9",
                    padding: "5px 16px",
                    borderRadius: "20px",
                    fontSize: "var(--text-sm)",
                    fontWeight: "bold",
                  }}
                >
                  Chair ΓÇö Wood
                </div>
                <div
                  style={{
                    background: "#ede9fe",
                    color: "#6d28d9",
                    padding: "5px 16px",
                    borderRadius: "20px",
                    fontSize: "var(--text-sm)",
                    fontWeight: "bold",
                  }}
                >
                  Water Bottle ΓÇö Plastic
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: "20px 28px 60px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "var(--text-xl)",
                color: "#1e3a8a",
                fontWeight: "bold",
                borderBottom: "4px solid #3b82f6",
                paddingBottom: "6px",
                display: "inline-block",
              }}
            >
              Choosing the Right Material
            </h2>

            <div
              style={{
                fontSize: "var(--text-base)",
                color: "#334155",
                lineHeight: "1.5",
                marginBottom: "14px",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                Different objects are made for different purposes.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                The material used to make an object depends on its{" "}
                <strong style={{ color: "#1e3a8a" }}>properties</strong> and how
                the object will be used.
              </p>
              <p style={{ margin: "0 0 10px 0" }}>
                For example, a pen is made of different materials such as
                plastic, metal and ink. Each material is chosen because it
                performs a specific job.
              </p>
              <p style={{ margin: "0" }}>
                Choosing the right material helps us make objects that are{" "}
                <strong style={{ color: "#1e3a8a" }}>safe</strong>,{" "}
                <strong style={{ color: "#1e3a8a" }}>useful</strong> and{" "}
                <strong style={{ color: "#1e3a8a" }}>long-lasting</strong>.
              </p>
            </div>

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  color: "#b45309",
                  lineHeight: "1.4",
                }}
              >
                <strong>Remember</strong>
                <br />
                The properties of a material help us decide where and how it
                should be used.
              </div>
            </div>
          </div>

          <div
            style={{
              minHeight: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px dashed #cbd5e1",
              paddingLeft: "24px",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "var(--text-xl)",
                color: "#1e3a8a",
                fontWeight: "bold",
              }}
            >
              Case File 03: Choosing the Right Material
            </h2>

            <div
              style={{
                fontSize: "var(--text-base)",
                color: "#334155",
                lineHeight: "1.5",
                marginBottom: "14px",
              }}
            >
              <p style={{ margin: "0 0 10px 0" }}>
                Your next challenge is to decide which material is the{" "}
                <strong style={{ color: "#16a34a" }}>best choice</strong> for
                making an object.
              </p>
              <p style={{ margin: "0" }}>
                Sometimes an object can be made from different materials, but
                only some materials are{" "}
                <strong style={{ color: "#3b82f6" }}>suitable</strong> for its
                purpose.
              </p>
            </div>

            <div
              style={{
                border: "2px dashed #c4b5fd",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "12px",
                background: "#f5f3ff",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#6d28d9",
                  fontSize: "var(--text-base)",
                }}
              >
                Think Like a Scientist
              </h4>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "var(--text-sm)",
                  color: "#334155",
                }}
              >
                Before making a choice, ask yourself:
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "var(--text-sm)",
                  color: "#334155",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "#6d28d9", fontWeight: "bold" }}>
                    ΓÇó
                  </span>{" "}
                  Is this material strong enough?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "#6d28d9", fontWeight: "bold" }}>
                    ΓÇó
                  </span>{" "}
                  Is it safe to use?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "#6d28d9", fontWeight: "bold" }}>
                    ΓÇó
                  </span>{" "}
                  Will it work well for this purpose?
                </div>
              </div>
            </div>

            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: "10px",
                padding: "12px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 6px 0",
                  color: "#d97706",
                  fontSize: "var(--text-base)",
                }}
              >
                Example
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-sm)",
                  color: "#451a03",
                }}
              >
                A shopping bag can be made from cloth or paper, but each
                material is suitable for different situations.
              </p>
            </div>
          </div>
        </div>
      )}

      {onComplete && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "white",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "12px 32px",
          }}
        >
          <button
            onClick={onComplete}
            style={{
              background: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "var(--text-base)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2563eb")}
            onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
          >
            Next Γ₧ö
          </button>
        </div>
      )}
    </div>
  );
}
