import re

file_path = "src/science/class6/chapter6/MaterialsAroundUs/components/Educational/InvestigationHandbook.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace the state variables and voice/timer functions
state_replacement = """  const [clueIndex, setClueIndex] = useState(0);
  const [completedClues, setCompletedClues] = useState(new Set());
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  
  // Highlighting
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Clue 4 & 5 State
  const [makingStep, setMakingStep] = useState(0);
  const [investigatedUses, setInvestigatedUses] = useState(new Set());
  
  // Playback Control State
  const [isReplayingClue4, setIsReplayingClue4] = useState(false);
  const [isReplayingClue5, setIsReplayingClue5] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Animation Refs
  const sequenceTimerRef = useRef(null);
  const playbackRef = useRef({
      active: false,
      sequence: [],
      startTime: 0,
      elapsed: 0,
      currentIndex: 0,
      clue: 0
  });

  const clues = [
    { title: "HOW OLD IS POTTERY?", label: "01 AGE" },
    { title: "HOW WAS POTTERY SHAPED?", label: "02 SHAPING" },
    { title: "HOW WAS POTTERY DECORATED?", label: "03 DESIGN" },
    { title: "HOW WAS POTTERY MADE?", label: "04 MAKING" },
    { title: "HOW WAS POTTERY USED?", label: "05 USES" },
  ];

  const stopPlayback = () => {
      playbackRef.current.active = false;
      setIsPaused(false);
      setIsReplayingClue4(false);
      setIsReplayingClue5(false);
      if (sequenceTimerRef.current) cancelAnimationFrame(sequenceTimerRef.current);
      window.speechSynthesis.cancel();
      setHighlightIndex(-1);
  };

  const pausePlayback = () => {
      if (!playbackRef.current.active) {
          window.speechSynthesis.pause();
          setIsPaused(true);
          return;
      }
      playbackRef.current.active = false;
      setIsPaused(true);
      if (sequenceTimerRef.current) cancelAnimationFrame(sequenceTimerRef.current);
      window.speechSynthesis.pause();
  };

  const resumePlayback = () => {
      if (isReplayingClue4 || isReplayingClue5) {
          playbackRef.current.active = true;
          playbackRef.current.startTime = Date.now() - playbackRef.current.elapsed;
          setIsPaused(false);
          window.speechSynthesis.resume();
          runPlaybackLoop();
      } else {
          setIsPaused(false);
          window.speechSynthesis.resume();
      }
  };

  const startPlayback = (clueNum, sequence) => {
      stopPlayback();
      playbackRef.current = {
          active: true,
          sequence: sequence,
          startTime: Date.now(),
          elapsed: 0,
          currentIndex: 0,
          clue: clueNum
      };
      setIsPaused(false);
      
      if (clueNum === 4) {
          setMakingStep(0);
          setIsReplayingClue4(true);
      } else if (clueNum === 5) {
          setInvestigatedUses(new Set());
          setIsReplayingClue5(true);
      }
      
      runPlaybackLoop();
  };

  const runPlaybackLoop = () => {
      if (!playbackRef.current.active) return;
      
      playbackRef.current.elapsed = Date.now() - playbackRef.current.startTime;
      const state = playbackRef.current;
      
      while (state.currentIndex < state.sequence.length && state.elapsed >= state.sequence[state.currentIndex].delay) {
          const evt = state.sequence[state.currentIndex];
          state.currentIndex++;
          
          if (state.clue === 4) {
              if (evt.step !== undefined) setMakingStep(evt.step);
              if (evt.text) playVoiceText(evt.text);
              if (evt.action === "finish") {
                  setIsReplayingClue4(false);
                  setIsRevealed(true);
                  setCompletedClues((prev) => new Set(prev).add(3));
                  stopPlayback();
                  return;
              }
          } else if (state.clue === 5) {
              if (evt.id !== undefined && evt.id < 3) {
                  setInvestigatedUses(prev => {
                      const newSet = new Set(prev);
                      newSet.add(evt.id);
                      return newSet;
                  });
              }
              if (evt.text) playVoiceText(evt.text);
              if (evt.action === "finish") {
                  setIsReplayingClue5(false);
                  setCompletedClues((prev) => new Set(prev).add(4));
                  stopPlayback();
                  return;
              }
          }
      }
      
      sequenceTimerRef.current = requestAnimationFrame(runPlaybackLoop);
  };
  
  const playVoiceText = (text) => {
      window.speechSynthesis.cancel();
      setHighlightIndex(-1);
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      let indianFemaleVoice = voices.find(
        (v) => (v.lang.includes("en-IN") && (v.name.includes("Female") || v.name.includes("Ravi") === false)) || v.name.includes("Veena") || v.name.includes("Google हिन्दी")
      );
      if (!indianFemaleVoice) {
          indianFemaleVoice = voices.find((v) => v.lang.includes("en-IN")) || voices.find((v) => v.lang.includes("en-GB") || v.lang.includes("en-US"));
      }
      if (indianFemaleVoice) utterance.voice = indianFemaleVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      utterance.onboundary = (e) => {
          if (e.name === "word") setHighlightIndex(e.charIndex);
      };
      
      utterance.onend = () => {
          setHighlightIndex(-1);
      };

      window.speechSynthesis.speak(utterance);
  };

  // For older clues backwards compatibility
  const playVoice = (text, delay = 0) => {
      stopPlayback();
      setIsPlayingVoice(true);
      if (delay > 0) {
          setTimeout(() => {
              playVoiceText(text);
          }, delay);
      } else {
          playVoiceText(text);
      }
  };

  useEffect(() => {
    return stopPlayback;
  }, [clueIndex]);"""
content = re.sub(r'  const \[clueIndex, setClueIndex\] = useState\(0\);.*?  }, \[clueIndex\]\);', state_replacement, content, flags=re.DOTALL)


# 2. Update replayClue4 and replayClue5
replay_replacement = """  const replayClue4 = () => {
    const sequence = [
      { step: 1, delay: 500, text: "First, clean the clay." },
      { step: 2, delay: 3500, text: "Then, knead the clay to make it soft." },
      { step: 3, delay: 6500, text: "Next, shape the clay." },
      { step: 4, delay: 9500, text: "Use a rotating wheel to form the pot." },
      { step: 5, delay: 12500, text: "Finally, bake the pot in a kiln." },
      { step: 6, delay: 16500, text: "TERRACOTTA. Baked clay is called terracotta." },
      { step: 7, delay: 20000, action: "finish" }
    ];
    startPlayback(4, sequence);
  };

  const replayClue5 = () => {
    const sequence = [
      { id: 0, delay: 500, text: "Pottery was used for cooking." },
      { id: 1, delay: 4000, text: "Storage jars were used for storing food grains." },
      { id: 2, delay: 8000, text: "Containers were used for holding liquids." },
      { id: 3, delay: 12000, text: "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, Holding liquids." },
      { id: 4, delay: 17000, action: "finish" }
    ];
    startPlayback(5, sequence);
  };"""
content = re.sub(r'  const replayClue4 = \(\) => \{.*?  const HighlightedText =', replay_replacement + "\n\n  const HighlightedText =", content, flags=re.DOTALL)


# 3. Update renderClue4
clue4_replacement = """  const renderClue4 = () => {
    const steps = [
      { label: "CLEAN THE CLAY", btn: "START" },
      { label: "KNEAD THE CLAY", btn: "KNEAD" },
      { label: "SHAPE THE CLAY", btn: "SHAPE" },
      { label: "TURN THE WHEEL", btn: "SPIN THE WHEEL" },
      { label: "BAKE THE POT", btn: "BAKE" },
    ];

    const getHighlightedComponent = (stepIndex) => {
      if (stepIndex === 1) return <HighlightedText phrases={["First, ", "clean", " the clay."]} activeCharIndex={highlightIndex} />;
      if (stepIndex === 2) return <HighlightedText phrases={["Then, ", "knead", " the clay to make it soft."]} activeCharIndex={highlightIndex} />;
      if (stepIndex === 3) return <HighlightedText phrases={["Next, ", "shape", " the clay."]} activeCharIndex={highlightIndex} />;
      if (stepIndex === 4) return <HighlightedText phrases={["Use a ", "rotating wheel", " to form the pot."]} activeCharIndex={highlightIndex} />;
      if (stepIndex === 5) return <HighlightedText phrases={["Finally, ", "bake", " the pot in a kiln."]} activeCharIndex={highlightIndex} />;
      return null;
    };

    return (
      <div style={{ display: "flex", flex: 1, gap: "32px", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ fontWeight: "bold", color: "#64748b", fontSize: "14px", letterSpacing: "2px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <SvgIcons.MagnifyingGlass />
              {completedClues.has(3) ? "REVIEWING CLUE 04" : "CASE CLUE 04"}
            </div>
            <h3 style={{ color: "#0f172a", margin: "0", fontSize: "32px", fontWeight: "900" }}>{clues[3].title}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "300px" }}>
            {[0, 1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: s < (makingStep === 6 ? 5 : makingStep) ? "#1e3a8a" : s === (makingStep === 6 ? 5 : makingStep) ? "#3b82f6" : "#cbd5e1", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "14px", fontWeight: "bold" }}>
                  {s < (makingStep === 6 ? 5 : makingStep) ? <IconCheck /> : s + 1}
                </div>
                {s < 4 && <div style={{ height: "4px", flex: 1, background: s < (makingStep === 6 ? 5 : makingStep) ? "#1e3a8a" : "#cbd5e1" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, gap: "48px" }}>
          <div style={{ flex: "0 0 50%", display: "flex", justifyContent: "center", alignItems: "center", background: "transparent" }}>
            {makingStep < 3 && (
              <svg viewBox="0 0 350 350" width="100%" height="100%" style={{ maxWidth: "350px" }}>
                <defs><radialGradient id="clayLumpGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#D2691E" /><stop offset="100%" stopColor="#8B4513" /></radialGradient></defs>
                <ellipse cx="175" cy="250" rx="90" ry="20" fill="rgba(0,0,0,0.2)" />
                <path d="M 85 240 C 85 140 120 90 175 90 C 230 90 265 140 265 240 C 265 280 85 280 85 240 Z" fill="url(#clayLumpGrad)" style={{ transformOrigin: "175px 240px", transform: makingStep === 1 ? "scale(1.2, 0.8)" : makingStep === 2 ? "scale(0.8, 1.2)" : "none", transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                {makingStep === 0 && (
                  <g style={{ animation: "fadeIn 0.5s" }}>
                    <circle cx="120" cy="150" r="4" fill="#5C3A21" />
                    <circle cx="210" cy="180" r="3" fill="#5C3A21" />
                    <circle cx="180" cy="130" r="5" fill="#5C3A21" />
                  </g>
                )}
              </svg>
            )}
            {makingStep === 3 && <Wheel isSpinning={!isPaused} phase={1} />}
            {makingStep === 4 && <Wheel isSpinning={!isPaused} phase={2} />}
            {makingStep === 5 && <Kiln isBaking={!isPaused} />}
            {makingStep === 6 && <PlainPot showDecoration={false} />}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {makingStep < 6 && makingStep > 0 && (
              <div key={makingStep} style={{ animation: "fadeIn 0.3s forwards", marginBottom: "24px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "8px" }}>STEP 0{makingStep}</div>
                <div style={{ color: "#0f172a", fontSize: "36px", fontWeight: "900", marginBottom: "16px" }}>{steps[makingStep - 1].label}</div>
                <p style={{ fontSize: "24px", color: "#475569" }}>{getHighlightedComponent(makingStep)}</p>
              </div>
            )}
            {makingStep === 0 && !isReplayingClue4 && (
              <div style={{ animation: "fadeIn 0.3s forwards", marginBottom: "24px" }}>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "8px" }}>STEP 01</div>
                <div style={{ color: "#0f172a", fontSize: "36px", fontWeight: "900", marginBottom: "16px" }}>{steps[0].label}</div>
              </div>
            )}
            
            {makingStep === 6 && (
              <div key="final-step" style={{ animation: "fadeIn 1s ease-in-out forwards", marginBottom: "24px" }}>
                <div style={{ fontSize: "36px", fontWeight: "900", color: "#1e3a8a", marginBottom: "16px" }}>
                  <HighlightedText phrases={["TERRACOTTA."]} activeCharIndex={highlightIndex} />
                </div>
                <p style={{ fontSize: "24px", color: "#475569", lineHeight: "1.5" }}>
                  <HighlightedText phrases={["Baked clay ", "is called terracotta."]} activeCharIndex={highlightIndex - "TERRACOTTA. ".length} />
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              {!isReplayingClue4 && makingStep !== 6 && (
                <button
                  onClick={replayClue4}
                  style={{ padding: "16px 32px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <SvgIcons.Play /> START
                </button>
              )}
              {isReplayingClue4 && !isPaused && (
                <button
                  onClick={pausePlayback}
                  style={{ padding: "16px 32px", background: "#f59e0b", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <SvgIcons.Pause /> PAUSE
                </button>
              )}
              {isReplayingClue4 && isPaused && (
                <button
                  onClick={resumePlayback}
                  style={{ padding: "16px 32px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center" }}
                >
                  <SvgIcons.Play /> RESUME
                </button>
              )}
              {makingStep === 6 && (
                <button
                  onClick={replayClue4}
                  style={{ padding: "12px 24px", background: "white", color: "#1e3a8a", border: "2px solid #1e3a8a", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SvgIcons.Play /> REPLAY EXPLANATION
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };"""
content = re.sub(r'  const renderClue4 = \(\) => \{.*?  const renderClue5 = \(\) => \{', clue4_replacement + "\n\n  const renderClue5 = () => {", content, flags=re.DOTALL)


# 4. Update renderClue5
clue5_replacement = """  const renderClue5 = () => {
    const uses = [
      { name: "POT", type: "POT", desc: "COOKING", text: "Pottery was used for cooking." },
      { name: "STORAGE JAR", type: "JAR", desc: "STORING FOOD GRAINS", text: "Storage jars were used for storing food grains." },
      { name: "CONTAINER", type: "CONTAINER", desc: "HOLDING LIQUIDS", text: "Containers were used for holding liquids." },
    ];

    const handleInvestigate = (index) => {
      if (isReplayingClue5 || completedClues.has(4)) return;
      playVoiceText(uses[index].text);
    };

    return (
      <div style={{ display: "flex", flex: 1, gap: "16px", flexDirection: "column", minHeight: 0 }}>
        <div>
          <div style={{ fontWeight: "bold", color: "#64748b", fontSize: "14px", letterSpacing: "2px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <SvgIcons.MagnifyingGlass />
            {completedClues.has(4) ? "REVIEWING CLUE 05" : "CASE CLUE 05"}
          </div>
          <h3 style={{ color: "#0f172a", margin: "0 0 16px 0", fontSize: "32px", fontWeight: "900" }}>{clues[4].title}</h3>
        </div>

        <div style={{ display: "flex", gap: "24px", minHeight: "300px" }}>
          {uses.map((use, i) => {
             const isInvestigated = investigatedUses.has(i) || completedClues.has(4);
             return (
            <div
              key={i}
              onClick={() => handleInvestigate(i)}
              style={{
                flex: 1,
                background: isInvestigated ? "#f0fdf4" : "#f8fafc",
                border: isInvestigated ? "3px solid #22c55e" : "3px dashed #cbd5e1",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: isInvestigated || isReplayingClue5 ? "default" : "pointer",
                transform: isInvestigated && isReplayingClue5 ? "scale(1.05) translateY(-10px)" : "none",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                padding: "16px",
                textAlign: "center",
                boxShadow: isInvestigated && isReplayingClue5 ? "0 20px 25px -5px rgba(34, 197, 94, 0.2)" : "none",
                position: "relative",
              }}
            >
              {!isInvestigated && (
                <div style={{ position: "absolute", top: "16px", right: "16px", color: "#cbd5e1" }}>
                  <SvgIcons.MagnifyingGlass />
                </div>
              )}
              <div style={{ marginBottom: "16px" }}>
                <ObjectIcon type={use.type} isInvestigated={isInvestigated && (!isReplayingClue5 || (isReplayingClue5 && !isPaused))} />
              </div>
              <div style={{ fontWeight: "900", color: "#1e293b", marginBottom: "8px", fontSize: "20px" }}>{use.name}</div>
              {isInvestigated && (
                <div style={{ color: "#16a34a", fontWeight: "bold", fontSize: "16px", animation: "fadeIn 0.5s" }}>
                  {use.desc}
                </div>
              )}
            </div>
          )})}
        </div>

        {(completedClues.has(4) || investigatedUses.size === 3) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", animation: "fadeIn 1s forwards", marginTop: "auto", padding: "16px", background: "#f1f5f9", borderRadius: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <div style={{ color: "#16a34a", fontWeight: "900", fontSize: "18px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                <SvgIcons.Check /> ALL USES INVESTIGATED
              </div>
              <div style={{ fontSize: "20px", color: "#0f172a", lineHeight: "1.4" }}>
                <HighlightedText phrases={["POTTERY WAS USED FOR VARIOUS PURPOSES.", " "]} activeCharIndex={highlightIndex} />
                <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "18px", color: "#1e3a8a", fontWeight: "bold" }}>
                  <HighlightedText phrases={["Cooking", ", "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. ".length} />
                  <HighlightedText phrases={["Storing food grains", ", "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, ".length} />
                  <HighlightedText phrases={["Holding liquids"]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, ".length} />
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "16px" }}>
              {isReplayingClue5 && !isPaused && (
                <button
                  onClick={pausePlayback}
                  style={{ padding: "12px 24px", background: "#f59e0b", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <SvgIcons.Pause /> PAUSE
                </button>
              )}
              {isReplayingClue5 && isPaused && (
                <button
                  onClick={resumePlayback}
                  style={{ padding: "12px 24px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <SvgIcons.Play /> RESUME
                </button>
              )}
              {!isReplayingClue5 && (
                <button
                  onClick={replayClue5}
                  style={{ padding: "12px 24px", background: "white", color: "#1e3a8a", border: "2px solid #1e3a8a", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SvgIcons.Play /> REPLAY EXPLANATION
                </button>
              )}
            </div>
          </div>
        )}
        
        {!completedClues.has(4) && investigatedUses.size === 0 && !isReplayingClue5 && (
           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "auto", padding: "16px" }}>
                <button
                  onClick={replayClue5}
                  style={{ padding: "16px 32px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                  <SvgIcons.Play /> START
                </button>
           </div>
        )}
      </div>
    );
  };"""
content = re.sub(r'  const renderClue5 = \(\) => \{.*?  const renderFinal = \(\) => \(', clue5_replacement + "\n\n  const renderFinal = () => (", content, flags=re.DOTALL)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
