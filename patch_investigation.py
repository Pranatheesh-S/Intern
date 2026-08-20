import re

file_path = "src/science/class6/chapter6/MaterialsAroundUs/components/Educational/InvestigationHandbook.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix Clue 05 Layout and bold text
# In renderClue5:
clue5_replacement = """    const renderClue5 = () => {
    const uses = [
      {
        name: "POT",
        type: "POT",
        desc: "COOKING",
        text: "Pottery was used for cooking.",
      },
      {
        name: "STORAGE JAR",
        type: "JAR",
        desc: "STORING FOOD GRAINS",
        text: "Storage jars were used for storing food grains.",
      },
      {
        name: "CONTAINER",
        type: "CONTAINER",
        desc: "HOLDING LIQUIDS",
        text: "Containers were used for holding liquids.",
      },
    ];

    const handleInvestigate = (index) => {
      if (isReplayingClue5 || completedClues.has(4)) return;
      if (investigatedUses.has(index)) return;

      const newUses = new Set(investigatedUses).add(index);
      setInvestigatedUses(newUses);
      playVoice(uses[index].text);

      if (newUses.size === 3) {
        setTimeout(() => {
          setCompletedClues((prev) => new Set(prev).add(4));
          playVoice(
            "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, Holding liquids.",
            500,
          );
        }, 3000);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "16px",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: "bold",
              color: "#64748b",
              fontSize: "14px",
              letterSpacing: "2px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <SvgIcons.MagnifyingGlass />
            {completedClues.has(4) ? "REVIEWING CLUE 05" : "CASE CLUE 05"}
          </div>
          <h3
            style={{
              color: "#0f172a",
              margin: "0 0 16px 0",
              fontSize: "32px",
              fontWeight: "900",
            }}
          >
            {clues[4].title}
          </h3>
        </div>

        <div style={{ display: "flex", gap: "24px", minHeight: "300px" }}>
          {uses.map((use, i) => (
            <div
              key={i}
              onClick={() => handleInvestigate(i)}
              style={{
                flex: 1,
                background: investigatedUses.has(i) ? "#f0fdf4" : "#f8fafc",
                border: investigatedUses.has(i)
                  ? "3px solid #22c55e"
                  : "3px dashed #cbd5e1",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor:
                  investigatedUses.has(i) ||
                  isReplayingClue5 ||
                  completedClues.has(4)
                    ? "default"
                    : "pointer",
                transform: investigatedUses.has(i)
                  ? "scale(1.05) translateY(-10px)"
                  : "none",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                padding: "16px",
                textAlign: "center",
                boxShadow: investigatedUses.has(i)
                  ? "0 20px 25px -5px rgba(34, 197, 94, 0.2)"
                  : "none",
                position: "relative",
              }}
            >
              {!investigatedUses.has(i) && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    color: "#cbd5e1",
                  }}
                >
                  <SvgIcons.MagnifyingGlass />
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <ObjectIcon
                  type={use.type}
                  isInvestigated={investigatedUses.has(i)}
                />
              </div>
              <div
                style={{
                  fontWeight: "900",
                  color: "#1e293b",
                  marginBottom: "8px",
                  fontSize: "20px",
                }}
              >
                {use.name}
              </div>
              {investigatedUses.has(i) && (
                <div
                  style={{
                    color: "#16a34a",
                    fontWeight: "bold",
                    fontSize: "16px",
                    animation: "fadeIn 0.5s",
                  }}
                >
                  {use.desc}
                </div>
              )}
            </div>
          ))}
        </div>

        {completedClues.has(4) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              animation: "fadeIn 1s forwards",
              marginTop: "auto",
              padding: "16px",
              background: "#f1f5f9",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <div
                style={{
                  color: "#16a34a",
                  fontWeight: "900",
                  fontSize: "18px",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SvgIcons.Check />
                ALL USES INVESTIGATED
              </div>
              <div
                style={{
                  fontSize: "20px",
                  color: "#0f172a",
                  lineHeight: "1.4",
                }}
              >
                <HighlightedText
                  phrases={["POTTERY WAS USED FOR VARIOUS PURPOSES.", " "]}
                  activeCharIndex={highlightIndex}
                />
                <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "18px", color: "#1e3a8a", fontWeight: "bold" }}>
                  <HighlightedText phrases={["Cooking", ", "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. ".length} />
                  <HighlightedText phrases={["Storing food grains", ", "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, ".length} />
                  <HighlightedText phrases={["Holding liquids"]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, ".length} />
                </div>
              </div>
            </div>
            
            <button
              onClick={replayClue5}
              disabled={isReplayingClue5}
              style={{
                padding: "12px 24px",
                background: isReplayingClue5 ? "#dbeafe" : "white",
                color: "#1e3a8a",
                border: "2px solid #1e3a8a",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: isReplayingClue5 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <SvgIcons.Play />
              {isReplayingClue5
                ? "REPLAYING SEQUENCE..."
                : "REPLAY EXPLANATION"}
            </button>
          </div>
        )}
      </div>
    );
  };"""
content = re.sub(r'const renderClue5 = \(\) => \{.*?(?=const renderFinal = \(\) => \()', clue5_replacement + "\n\n  ", content, flags=re.DOTALL)

# 2. Fix Clue 04 wheel
wheel_replacement = """const Wheel = ({ isSpinning, phase }) => (
  <svg
    viewBox="0 0 350 350"
    width="100%"
    height="100%"
    style={{ overflow: "visible", maxWidth: "350px" }}
  >
    <defs>
      <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B85D19" />
        <stop offset="50%" stopColor="#D2691E" />
        <stop offset="100%" stopColor="#8B4513" />
      </linearGradient>
      <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="15"
          stdDeviation="10"
          floodColor="#000"
          floodOpacity="0.4"
        />
      </filter>
    </defs>

    {/* Wheel Base (Stationary) */}
    <g filter="url(#shadow3d)">
      <rect
        x="155"
        y="250"
        width="40"
        height="70"
        fill="#334155"
        rx="4"
      />
      <path d="M 125 310 L 225 310 L 245 330 L 105 330 Z" fill="#1e293b" />
    </g>

    {/* Rotating Wheel Top */}
    <g>
      {/* Thickness of the wheel */}
      <path
        d="M 65 240 A 110 25 0 0 0 285 240 L 285 255 A 110 25 0 0 1 65 255 Z"
        fill="#475569"
      />
      <ellipse
        cx="175"
        cy="240"
        rx="110"
        ry="25"
        fill="url(#wheelGrad)"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      {/* Concentric rings on wheel, animated to show spinning */}
      <ellipse
        cx="175"
        cy="240"
        rx="80"
        ry="18"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="3"
        strokeDasharray="20 15"
        style={{ animation: isSpinning ? "spinWheel 0.5s linear infinite" : "none" }}
      />
      <ellipse
        cx="175"
        cy="240"
        rx="40"
        ry="9"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeDasharray="10 10"
        style={{ animation: isSpinning ? "spinWheel 0.3s linear infinite reverse" : "none" }}
      />
      <circle cx="175" cy="240" r="6" fill="#cbd5e1" />
    </g>

    {/* Clay Morphing - kept centered on the vertical axis */}
    <g>
      {/* Phase 0: Lump */}
      <path
        d="M 135 235 Q 175 140 215 235 C 215 250 135 250 135 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 0 ? 1 : 0,
        }}
      />
      {/* Phase 1: Cylinder/Stretching */}
      <path
        d="M 145 235 Q 135 140 175 120 Q 215 140 205 235 C 205 245 145 245 145 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 1 ? 1 : 0,
        }}
      />
      {/* Phase 2: Pot */}
      <path
        d="M 145 235 C 130 190 120 140 150 120 L 200 120 C 230 140 220 190 205 235 C 205 245 145 245 145 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 2 ? 1 : 0,
        }}
      />
      {/* Pot opening (only visible in phase 2) */}
      <ellipse
        cx="175"
        cy="120"
        rx="25"
        ry="8"
        fill="#5C3A21"
        style={{
          opacity: phase === 2 ? 1 : 0,
          transition: "opacity 1s ease-in-out 0.5s",
        }}
      />
      <ellipse
        cx="175"
        cy="120"
        rx="18"
        ry="5"
        fill="#3e2723"
        style={{
          opacity: phase === 2 ? 1 : 0,
          transition: "opacity 1s ease-in-out 0.5s",
        }}
      />
    </g>

    <style>{`
      @keyframes spinWheel {
        0% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 50; }
      }
    `}</style>
  </svg>
);"""
content = re.sub(r'const Wheel = \(\{ isSpinning, phase \}\) => \(.*?</svg>\n\);', wheel_replacement, content, flags=re.DOTALL)

# 3. Update clue 4 layout to isolate text and prevent bleeding
clue4_replacement = """    const renderClue4 = () => {
    const steps = [
      { label: "CLEAN THE CLAY", btn: "CLEAN CLAY" },
      { label: "KNEAD THE CLAY", btn: "KNEAD" },
      { label: "SHAPE THE CLAY", btn: "SHAPE" },
      { label: "TURN THE WHEEL", btn: "SPIN THE WHEEL" },
      { label: "BAKE THE POT", btn: "BAKE" },
    ];

    const stepTexts = [
      "",
      "First, clean the clay.",
      "Then, knead the clay to make it soft.",
      "Next, shape the clay.",
      "Use a rotating wheel to form the pot.",
      "Finally, bake the pot in a kiln.",
    ];
    
    // Using bolding for learning terms in Clue 4 explanation
    const getHighlightedComponent = (stepIndex) => {
        if (stepIndex === 1) return <HighlightedText phrases={["First, ", "clean", " the clay."]} activeCharIndex={highlightIndex} />;
        if (stepIndex === 2) return <HighlightedText phrases={["Then, ", "knead", " the clay to make it soft."]} activeCharIndex={highlightIndex} />;
        if (stepIndex === 3) return <HighlightedText phrases={["Next, ", "shape", " the clay."]} activeCharIndex={highlightIndex} />;
        if (stepIndex === 4) return <HighlightedText phrases={["Use a ", "rotating wheel", " to form the pot."]} activeCharIndex={highlightIndex} />;
        if (stepIndex === 5) return <HighlightedText phrases={["Finally, ", "bake", " the pot in a kiln."]} activeCharIndex={highlightIndex} />;
        return null;
    }

    const handleStep = () => {
      if (isReplayingClue4) return;
      const nextStep = makingStep + 1;
      setMakingStep(nextStep);

      if (nextStep <= 5) {
        playVoice(stepTexts[nextStep]);
      }

      if (nextStep === 5) {
        setTimeout(() => {
          setMakingStep(6);
          setIsRevealed(true);
          setCompletedClues((prev) => new Set(prev).add(3));
          setTimeout(() => {
            playVoice("TERRACOTTA. Baked clay is called terracotta.", 0);
          }, 500);
        }, 3000);
      }
    };

    return (
      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "32px",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: "bold",
                color: "#64748b",
                fontSize: "14px",
                letterSpacing: "2px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SvgIcons.MagnifyingGlass />
              {completedClues.has(3) ? "REVIEWING CLUE 04" : "CASE CLUE 04"}
            </div>
            <h3
              style={{
                color: "#0f172a",
                margin: "0",
                fontSize: "32px",
                fontWeight: "900",
              }}
            >
              {clues[3].title}
            </h3>
          </div>
          {/* Progress Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minWidth: "300px",
            }}
          >
            {[0, 1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background:
                      s < makingStep
                        ? "#1e3a8a"
                        : s === makingStep
                          ? "#3b82f6"
                          : "#cbd5e1",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {s < makingStep ? <IconCheck /> : s + 1}
                </div>
                {s < 4 && (
                  <div
                    style={{
                      height: "4px",
                      flex: 1,
                      background: s < makingStep ? "#1e3a8a" : "#cbd5e1",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, gap: "48px" }}>
          <div
            style={{
              flex: "0 0 50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
            }}
          >
            {makingStep < 3 && (
              <svg
                viewBox="0 0 350 350"
                width="100%"
                height="100%"
                style={{ maxWidth: "350px" }}
              >
                <defs>
                  <radialGradient id="clayLumpGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#D2691E" />
                    <stop offset="100%" stopColor="#8B4513" />
                  </radialGradient>
                </defs>
                <ellipse
                  cx="175"
                  cy="250"
                  rx="90"
                  ry="20"
                  fill="rgba(0,0,0,0.2)"
                />
                <path
                  d="M 85 240 C 85 140 120 90 175 90 C 230 90 265 140 265 240 C 265 280 85 280 85 240 Z"
                  fill="url(#clayLumpGrad)"
                  style={{
                    transformOrigin: "175px 240px",
                    transform:
                      makingStep === 1
                        ? "scale(1.2, 0.8)"
                        : makingStep === 2
                          ? "scale(0.8, 1.2)"
                          : "none",
                    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
                {makingStep === 0 && (
                  <g style={{ animation: "fadeIn 0.5s" }}>
                    <circle cx="120" cy="150" r="4" fill="#5C3A21" />
                    <circle cx="210" cy="180" r="3" fill="#5C3A21" />
                    <circle cx="180" cy="130" r="5" fill="#5C3A21" />
                  </g>
                )}
              </svg>
            )}
            {makingStep === 3 && <Wheel isSpinning={true} phase={1} />}
            {makingStep === 4 && <Wheel isSpinning={true} phase={2} />}
            {makingStep === 5 && <Kiln isBaking={true} />}
            {makingStep === 6 && <PlainPot showDecoration={false} />}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {makingStep < 6 && makingStep > 0 && (
              <div key={makingStep} style={{ animation: "fadeIn 0.3s forwards", marginBottom: "24px" }}>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1e3a8a",
                    marginBottom: "8px",
                  }}
                >
                  STEP 0{makingStep}
                </div>
                <div style={{ color: "#0f172a", fontSize: "36px", fontWeight: "900", marginBottom: "16px" }}>
                  {steps[makingStep - 1].label}
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    color: "#475569",
                  }}
                >
                  {getHighlightedComponent(makingStep)}
                </p>
              </div>
            )}
            {makingStep < 5 && !isReplayingClue4 ? (
              <button
                onClick={handleStep}
                style={{
                  padding: "16px 32px",
                  background: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  transition: "transform 0.2s",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <SvgIcons.Play />
                {steps[makingStep].btn}
              </button>
            ) : null}
            
            {(makingStep === 6 || (completedClues.has(3) && makingStep === 6)) && (
              <div
                key="final-step"
                style={{
                  animation: "fadeIn 1s ease-in-out forwards",
                }}
              >
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    color: "#1e3a8a",
                    marginBottom: "16px",
                  }}
                >
                  <HighlightedText
                    phrases={["TERRACOTTA."]}
                    activeCharIndex={highlightIndex}
                  />
                </div>
                <p
                  style={{
                    fontSize: "24px",
                    color: "#475569",
                    lineHeight: "1.5",
                    marginBottom: "24px",
                  }}
                >
                  <HighlightedText
                    phrases={["Baked clay ", "is called terracotta."]}
                    activeCharIndex={highlightIndex - "TERRACOTTA. ".length}
                  />
                </p>
                <button
                  onClick={replayClue4}
                  disabled={isReplayingClue4}
                  style={{
                    padding: "12px 24px",
                    background: isReplayingClue4 ? "#dbeafe" : "white",
                    color: "#1e3a8a",
                    border: "2px solid #1e3a8a",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: isReplayingClue4 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <SvgIcons.Play />
                  {isReplayingClue4
                    ? "REPLAYING SEQUENCE..."
                    : "REPLAY EXPLANATION"}
                </button>
              </div>
            )}
            
            {makingStep === 0 && (
               <button
                onClick={handleStep}
                style={{
                  padding: "16px 32px",
                  background: "#1e3a8a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  transition: "transform 0.2s",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                <SvgIcons.Play />
                START MAKING
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };"""
content = re.sub(r'const renderClue4 = \(\) => \{.*?(?=const renderClue5 = \(\) => \{)', clue4_replacement + "\n\n  ", content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
