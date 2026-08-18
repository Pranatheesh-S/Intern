import React, { useState, useEffect, useRef } from "react";

const SvgIcons = {
  MagnifyingGlass: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Play: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  Pause: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  Check: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
};

// --- LARGE 3D-STYLE SVGS ---

const SoilLayer = ({ isRevealed }) => (
  <svg
    viewBox="0 0 400 350"
    width="100%"
    height="100%"
    style={{ overflow: "visible", maxWidth: "400px" }}
  >
    <defs>
      <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="6"
          floodColor="#000"
          floodOpacity="0.4"
        />
      </filter>
    </defs>

    {/* Base Pit */}
    <path
      d="M 20 220 Q 200 250 380 220 L 360 300 Q 200 330 40 300 Z"
      fill="url(#soilGrad)"
      filter="url(#dropShadow)"
    />

    {/* 3D Pottery Fragment */}
    <g
      style={{
        transform: isRevealed
          ? "translateY(-80px) scale(1.1)"
          : "translateY(10px) scale(0.9)",
        transition: "all 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        opacity: isRevealed ? 1 : 0.2,
      }}
    >
      {/* Shadow */}
      <ellipse
        cx="200"
        cy="220"
        rx="40"
        ry="15"
        fill="rgba(0,0,0,0.5)"
        style={{
          transform: isRevealed ? "scale(0.8) translateY(80px)" : "scale(1)",
          transition: "all 2.5s",
        }}
      />
      {/* Fragment Body */}
      <path
        d="M 160 190 C 170 240 230 240 240 190 C 230 180 210 160 170 170 Z"
        fill="#D2691E"
        stroke="#8B4513"
        strokeWidth="2"
        filter="url(#dropShadow)"
      />
      {/* Highlight for 3D effect */}
      <path
        d="M 160 190 C 170 240 230 240 240 190 C 230 180 210 160 170 170 Z"
        fill="url(#highlightGrad)"
      />
      {/* Texture lines */}
      <path
        d="M 175 195 Q 190 215 215 190"
        fill="none"
        stroke="#A0522D"
        strokeWidth="2"
      />
      <path
        d="M 180 210 Q 195 225 210 205"
        fill="none"
        stroke="#A0522D"
        strokeWidth="2"
      />

      {/* Scanning Box Effect */}
      <rect
        x="140"
        y="140"
        width="120"
        height="110"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeDasharray="8,8"
        rx="8"
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: "opacity 1s ease-in-out 2s",
        }}
      />
      <path
        d="M 140 160 L 140 140 L 160 140 M 240 140 L 260 140 L 260 160 M 260 230 L 260 250 L 240 250 M 160 250 L 140 250 L 140 230"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="4"
        style={{
          opacity: isRevealed ? 1 : 0,
          transition: "opacity 1s ease-in-out 2s",
        }}
      />
    </g>

    {/* Top Soil sliding away */}
    <g
      style={{
        transform: isRevealed
          ? "translateX(120px) translateY(40px)"
          : "translateX(0)",
        opacity: isRevealed ? 0 : 1,
        transition: "all 2.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <path
        d="M 120 190 Q 200 160 280 190 Q 250 240 160 230 Z"
        fill="#8B5A2B"
        filter="url(#dropShadow)"
      />
      <path d="M 140 180 Q 200 150 260 180 Z" fill="#A0522D" />
    </g>
  </svg>
);

const Wheel = ({ isSpinning, phase }) => (
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
        <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Wheel Base (Stationary) */}
    <g filter="url(#shadow3d)">
      <rect x="155" y="260" width="40" height="60" fill="#334155" rx="4" />
      <path d="M 125 310 L 225 310 L 245 330 L 105 330 Z" fill="#1e293b" />
    </g>

    {/* Rotating Wheel Top (Perspective) */}
    <g>
      {/* Wheel Thickness */}
      <path d="M 65 240 A 110 30 0 0 0 285 240 L 285 260 A 110 30 0 0 1 65 260 Z" fill="#475569" />
      {/* Wheel Top Surface */}
      <ellipse cx="175" cy="240" rx="110" ry="30" fill="url(#wheelGrad)" stroke="#cbd5e1" strokeWidth="2" />
      
      {/* Animated Spin Rings (flattened horizontally) */}
      <ellipse
        cx="175"
        cy="240"
        rx="80"
        ry="22"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="3"
        strokeDasharray="30 15"
        strokeDashoffset="0"
        style={{
          animation: isSpinning ? "spinDash 1s linear infinite" : "none",
        }}
      />
      <ellipse
        cx="175"
        cy="240"
        rx="45"
        ry="12"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeDasharray="15 10"
        strokeDashoffset="0"
        style={{
          animation: isSpinning ? "spinDash 0.6s linear infinite reverse" : "none",
        }}
      />
      {/* Center Pin */}
      <circle cx="175" cy="240" r="4" fill="#cbd5e1" />
    </g>

    {/* Clay Morphing - kept perfectly centered on vertical axis */}
    <g>
      {/* Phase 0: Lump */}
      <path
        d="M 135 235 Q 175 160 215 235 C 215 250 135 250 135 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 0 ? 1 : 0,
        }}
      />
      {/* Phase 1: Cylinder/Stretching */}
      <path
        d="M 145 235 Q 135 150 175 130 Q 215 150 205 235 C 205 250 145 250 145 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 1 ? 1 : 0,
        }}
      />
      {/* Phase 2: Pot */}
      <path
        d="M 145 235 C 130 190 120 140 150 120 L 200 120 C 230 140 220 190 205 235 C 205 250 145 250 145 235 Z"
        fill="url(#clayGrad)"
        style={{
          transition: "all 1s ease-in-out",
          opacity: phase === 2 ? 1 : 0,
        }}
      />
      {/* Pot opening */}
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
    </g>
  </svg>
);

const PlainPot = ({ showDecoration }) => (
  <svg
    viewBox="0 0 350 350"
    width="100%"
    height="100%"
    style={{ overflow: "visible", maxWidth: "350px" }}
  >
    <defs>
      <linearGradient id="potGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A0522D" />
        <stop offset="30%" stopColor="#D2691E" />
        <stop offset="80%" stopColor="#CD853F" />
        <stop offset="100%" stopColor="#8B4513" />
      </linearGradient>
      <filter id="shadow3dPot" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="15"
          stdDeviation="15"
          floodColor="#000"
          floodOpacity="0.3"
        />
      </filter>
    </defs>

    {/* Floor shadow */}
    <ellipse cx="175" cy="300" rx="70" ry="15" fill="rgba(0,0,0,0.2)" />

    <g
      style={{
        transformOrigin: "175px 175px",
        transform: showDecoration ? "rotateY(360deg)" : "none",
        transition: "transform 3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Body */}
      <path
        d="M 120 290 C 70 220 90 120 140 100 L 210 100 C 260 120 280 220 230 290 Z"
        fill="url(#potGrad3)"
        filter="url(#shadow3dPot)"
      />

      {/* Rim */}
      <ellipse cx="175" cy="100" rx="38" ry="12" fill="#A0522D" />
      <ellipse cx="175" cy="100" rx="30" ry="8" fill="#5C3A21" />

      {/* Decorations */}
      <g
        style={{
          opacity: showDecoration ? 1 : 0,
          transition: "opacity 2s ease-in-out 1.5s",
        }}
      >
        <path
          d="M 98 170 C 130 190 220 190 252 170"
          fill="none"
          stroke="#3e2723"
          strokeWidth="6"
          strokeDasharray="15,8"
        />
        <path
          d="M 90 220 C 140 240 210 240 260 220"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
        />
        <path
          d="M 115 130 C 145 140 205 140 235 130"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
        />

        {/* Geometric Motifs */}
        <circle
          cx="175"
          cy="145"
          r="18"
          fill="none"
          stroke="#3e2723"
          strokeWidth="4"
        />
        <circle cx="175" cy="145" r="6" fill="#3e2723" />

        <circle
          cx="125"
          cy="138"
          r="12"
          fill="none"
          stroke="#3e2723"
          strokeWidth="4"
        />
        <circle cx="125" cy="138" r="4" fill="#3e2723" />

        <circle
          cx="225"
          cy="138"
          r="12"
          fill="none"
          stroke="#3e2723"
          strokeWidth="4"
        />
        <circle cx="225" cy="138" r="4" fill="#3e2723" />

        {/* Leaf Motifs */}
        <path
          d="M 150 200 Q 175 180 200 200 Q 175 220 150 200 Z"
          fill="#3e2723"
        />
        <path
          d="M 110 190 Q 130 175 150 190 Q 130 205 110 190 Z"
          fill="#3e2723"
        />
        <path
          d="M 190 190 Q 210 175 230 190 Q 210 205 190 190 Z"
          fill="#3e2723"
        />
      </g>
    </g>
  </svg>
);

const Kiln = ({ isBaking }) => (
  <svg
    viewBox="0 0 350 350"
    width="100%"
    height="100%"
    style={{ overflow: "visible", maxWidth: "350px" }}
  >
    <defs>
      <radialGradient id="fireGlow" cx="50%" cy="80%" r="70%">
        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
        <stop offset="50%" stopColor="rgba(245, 158, 11, 0.4)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
      <linearGradient id="brickGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#78350f" />
        <stop offset="50%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#451a03" />
      </linearGradient>
      <pattern id="bricks" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect
          width="40"
          height="20"
          fill="none"
          stroke="#451a03"
          strokeWidth="2"
        />
        <line x1="20" y1="0" x2="20" y2="10" stroke="#451a03" strokeWidth="2" />
        <line x1="0" y1="10" x2="40" y2="10" stroke="#451a03" strokeWidth="2" />
        <line
          x1="40"
          y1="10"
          x2="40"
          y2="20"
          stroke="#451a03"
          strokeWidth="2"
        />
        <line x1="0" y1="10" x2="0" y2="20" stroke="#451a03" strokeWidth="2" />
      </pattern>
    </defs>

    {/* Background Glow */}
    <circle
      cx="175"
      cy="220"
      r="120"
      fill="url(#fireGlow)"
      style={{
        opacity: isBaking ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    />

    {/* Kiln Body */}
    <path
      d="M 50 300 L 50 150 C 50 50 300 50 300 150 L 300 300 Z"
      fill="url(#brickGrad)"
      filter="url(#shadow3dPot)"
    />
    <path
      d="M 50 300 L 50 150 C 50 50 300 50 300 150 L 300 300 Z"
      fill="url(#bricks)"
      opacity="0.4"
    />

    {/* Kiln Opening */}
    <path
      d="M 100 300 L 100 200 C 100 150 250 150 250 200 L 250 300 Z"
      fill="#1c1917"
    />

    {/* Inner Fire */}
    <g
      style={{
        opacity: isBaking ? 1 : 0,
        transition: "opacity 1s ease-in-out",
        transformOrigin: "175px 280px",
        animation: isBaking ? "flicker 0.2s infinite alternate" : "none",
      }}
    >
      <path
        d="M 110 300 Q 140 220 175 250 Q 210 200 240 300 Z"
        fill="#ef4444"
      />
      <path
        d="M 130 300 Q 150 240 175 270 Q 200 230 220 300 Z"
        fill="#f59e0b"
      />
      <path
        d="M 150 300 Q 160 260 175 280 Q 190 250 200 300 Z"
        fill="#fef08a"
      />
    </g>

    {/* Pot Moving In */}
    <g
      style={{
        transform: isBaking
          ? "translate(175px, 230px) scale(0.6)"
          : "translate(30px, 280px) scale(0.7)",
        transition: "all 2.5s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <path
        d="M -40 30 C -80 -20 -60 -100 -20 -120 L 20 -120 C 60 -100 80 -20 40 30 Z"
        fill={isBaking ? "#b45309" : "#D2691E"}
        style={{ transition: "fill 3s ease-in-out 1s" }}
      />
      <ellipse
        cx="0"
        cy="-120"
        rx="22"
        ry="6"
        fill={isBaking ? "#78350f" : "#A0522D"}
        style={{ transition: "fill 3s ease-in-out 1s" }}
      />
    </g>

    <style>{`
      @keyframes flicker {
        0% { transform: scale(1); opacity: 0.9; }
        100% { transform: scale(1.05); opacity: 1; }
      }
    `}</style>
  </svg>
);

const ObjectIcon = ({ type, isInvestigated }) => {
  const commonStyle = {
    transform: isInvestigated ? "scale(1.1) rotate(5deg)" : "scale(1)",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  if (type === "POT") {
    return (
      <svg
        viewBox="0 0 150 150"
        width="100px"
        height="100px"
        style={commonStyle}
      >
        <defs>
          <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B85D19" />
            <stop offset="50%" stopColor="#D2691E" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
        </defs>
        <path
          d="M 30 110 C 10 70 30 40 75 40 C 120 40 140 70 120 110 C 100 140 50 140 30 110 Z"
          fill="url(#pGrad)"
          stroke="#5C3A21"
          strokeWidth="4"
        />
        <ellipse
          cx="75"
          cy="40"
          rx="35"
          ry="12"
          fill="#A0522D"
          stroke="#5C3A21"
          strokeWidth="3"
        />
        <ellipse cx="75" cy="40" rx="25" ry="7" fill="#5C3A21" />
      </svg>
    );
  } else if (type === "JAR") {
    return (
      <svg
        viewBox="0 0 150 150"
        width="100px"
        height="100px"
        style={commonStyle}
      >
        <defs>
          <linearGradient id="jGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#5C3A21" />
          </linearGradient>
        </defs>
        <path
          d="M 40 130 L 40 50 C 40 20 110 20 110 50 L 110 130 C 110 145 40 145 40 130 Z"
          fill="url(#jGrad)"
          stroke="#451a03"
          strokeWidth="4"
        />
        <path
          d="M 35 40 L 115 40 L 115 50 L 35 50 Z"
          fill="#8B4513"
          stroke="#451a03"
          strokeWidth="3"
        />
        <ellipse
          cx="75"
          cy="35"
          rx="35"
          ry="8"
          fill="#D2691E"
          stroke="#451a03"
          strokeWidth="3"
        />
        <path
          d="M 40 80 L 110 80"
          fill="none"
          stroke="#451a03"
          strokeWidth="3"
          strokeDasharray="10,5"
        />
      </svg>
    );
  } else {
    // CONTAINER
    return (
      <svg
        viewBox="0 0 150 150"
        width="100px"
        height="100px"
        style={commonStyle}
      >
        <defs>
          <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CD853F" />
            <stop offset="50%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
        </defs>
        <path
          d="M 50 120 L 35 60 C 30 30 120 30 115 60 L 100 120 C 95 140 55 140 50 120 Z"
          fill="url(#cGrad)"
          stroke="#5C3A21"
          strokeWidth="4"
        />
        <path
          d="M 50 45 Q 20 70 50 90"
          fill="none"
          stroke="#5C3A21"
          strokeWidth="6"
        />{" "}
        {/* Handle */}
        <ellipse
          cx="75"
          cy="45"
          rx="28"
          ry="8"
          fill="#CD853F"
          stroke="#5C3A21"
          strokeWidth="3"
        />
      </svg>
    );
  }
};

// --- TIMELINE ICONS ---
const IconCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const IconCurrent = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
const IconLocked = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
  >
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

const PotterySpotlight = () => {
  const [clueIndex, setClueIndex] = useState(0);
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
  }, [clueIndex]);

  const handleAction = () => {
    if (isRevealed) return;
    setIsRevealed(true);

    const animationDurations = [3000, 3000, 3500, 0, 0];

    if (clueIndex < 3) {
      setTimeout(() => {
        setCompletedClues((prev) => new Set(prev).add(clueIndex));
        if (!completedClues.has(clueIndex)) {
          const texts = [
            "7,000 to 8,000 YEARS. Some of the earliest pottery in the Indian subcontinent dates back this far. Important sites include Lahuradewa and Mehrgarh.",
            "WHEEL-TURNED POTTERY. Around 4000 BCE, people developed clever ways to shape clay using a rotating wheel.",
            "Ancient pottery from the Sindhu-Sarasvati civilization was decorated with colourful designs, including geometric patterns and nature motifs.",
          ];
          playVoice(texts[clueIndex], 400); // 400ms delay after text reveal
        }
      }, animationDurations[clueIndex]);
    }
  };

  const handleNextClue = () => {
    if (clueIndex < clues.length) {
      stopPlayback();
      const nextIndex = clueIndex + 1;
      setClueIndex(nextIndex);
      setIsRevealed(completedClues.has(nextIndex));
      if (nextIndex === 3) setMakingStep(completedClues.has(nextIndex) ? 6 : 0);
      if (nextIndex === 4)
        setInvestigatedUses(
          completedClues.has(nextIndex) ? new Set([0, 1, 2]) : new Set(),
        );
    }
  };

  const handleTimelineClick = (index) => {
    const isCompleted = completedClues.has(index);
    const isUnlocked =
      isCompleted ||
      (index > 0 && completedClues.has(index - 1)) ||
      index === 0;

    if (isUnlocked && index !== clueIndex) {
      stopPlayback();
      setClueIndex(index);
      setIsRevealed(completedClues.has(index));
      if (index === 3) setMakingStep(completedClues.has(index) ? 6 : 0);
      if (index === 4)
        setInvestigatedUses(
          completedClues.has(index) ? new Set([0, 1, 2]) : new Set(),
        );
    }
  };

  const replayClue4 = () => {
    const sequence = [
      { step: 1, delay: 500, text: "First, clean the clay." },
      { step: 2, delay: 5000, text: "Then, knead the clay to make it soft." },
      { step: 3, delay: 10000, text: "Next, shape the clay." },
      { step: 4, delay: 15000, text: "Use a rotating wheel to form the pot." },
      { step: 5, delay: 21000, text: "Finally, bake the pot in a kiln." },
      { step: 6, delay: 27000, text: "TERRACOTTA. Baked clay is called terracotta." },
      { delay: 33000, action: "finish" }
    ];
    startPlayback(4, sequence);
  };

  const replayClue5 = () => {
    const sequence = [
      { id: 0, delay: 500, text: "Pottery was used for cooking." },
      { id: 1, delay: 4000, text: "Storage jars were used for storing food grains." },
      { id: 2, delay: 8000, text: "Containers were used for holding liquids." },
      { id: 3, delay: 13000, text: "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, Holding liquids." },
      { delay: 21000, action: "finish" }
    ];
    startPlayback(5, sequence);
  };

  const HighlightedText = ({ phrases, activeCharIndex }) => {
    let currentIdx = 0;
    const phraseRanges = phrases.map((p) => {
      const start = currentIdx;
      const end = start + p.length;
      currentIdx = end;
      return { text: p, start, end };
    });

    return (
      <span style={{ display: "inline-block" }}>
        {phraseRanges.map((p, i) => {
          const isActive =
            activeCharIndex >= p.start && activeCharIndex < p.end;
          return (
            <span
              key={i}
              style={{
                fontWeight: isActive ? "bold" : "normal",
                backgroundColor: isActive ? "#fef08a" : "transparent",
                transition: "background-color 0.2s, font-weight 0.2s",
                borderRadius: "4px",
                padding: "2px 0",
              }}
            >
              {p.text}
            </span>
          );
        })}
      </span>
    );
  };

  const renderTimeline = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        padding: "12px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        width: "100%",
        boxSizing: "border-box",
        gap: "4px",
      }}
    >
      {clues.map((clue, idx) => {
        const isCompleted = completedClues.has(idx);
        const isCurrent = idx === clueIndex;
        const isUnlocked = isCompleted || (idx > 0 && completedClues.has(idx - 1)) || idx === 0;
        const isLocked = !isUnlocked;
        return (
          <React.Fragment key={idx}>
            <div
              onClick={() => handleTimelineClick(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.5 : 1,
                transition: "all 0.2s",
                padding: "6px 10px",
                borderRadius: "8px",
                background: isCurrent ? "white" : "transparent",
                boxShadow: isCurrent ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: isCompleted ? "#22c55e" : isCurrent ? "#1e3a8a" : "#cbd5e1",
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {isCompleted ? <IconCheck /> : isCurrent ? <IconCurrent /> : <IconLocked />}
              </div>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  color: isCompleted ? "#16a34a" : isCurrent ? "#1e3a8a" : "#64748b",
                  whiteSpace: "nowrap",
                }}
              >
                {clue.label}
              </span>
            </div>
            {idx < clues.length - 1 && (
              <div
                style={{
                  height: "2px",
                  flex: "1 1 12px",
                  minWidth: "8px",
                  maxWidth: "24px",
                  background: completedClues.has(idx) ? "#22c55e" : "#cbd5e1",
                  opacity: 0.5,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // --- CLUE RENDERERS ---

  const renderClue1 = () => (
    <div style={{ display: "flex", flex: 1, gap: "32px" }}>
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
        }}
      >
        <SoilLayer isRevealed={isRevealed} />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
          {completedClues.has(0) ? "REVIEWING CLUE 01" : "CASE CLUE 01"}
        </div>
        <h3
          style={{
            color: "#0f172a",
            margin: "0 0 24px 0",
            fontSize: "32px",
            fontWeight: "900",
          }}
        >
          {clues[0].title}
        </h3>

        {!isRevealed ? (
          <button
            onClick={handleAction}
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
              transition: "transform 0.2s, background 0.2s",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <SvgIcons.MagnifyingGlass />
            INVESTIGATE
          </button>
        ) : (
          <div
            style={{
              animation: "fadeIn 1s ease-in-out forwards",
              opacity: 0,
              animationDelay: completedClues.has(0) ? "0s" : "2.5s",
            }}
          >
            <div
              style={{
                color: "#16a34a",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "8px",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SvgIcons.Check />
              POTTERY DISCOVERED
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#1e3a8a",
                marginBottom: "16px",
              }}
            >
              <HighlightedText
                phrases={["7,000 to 8,000 YEARS. "]}
                activeCharIndex={highlightIndex}
              />
            </div>
            <p
              style={{
                fontSize: "20px",
                color: "#475569",
                lineHeight: "1.5",
                marginBottom: "16px",
              }}
            >
              <HighlightedText
                phrases={[
                  "Some of the earliest pottery in the Indian subcontinent dates back this far. ",
                  "Important sites include Lahuradewa and Mehrgarh.",
                ]}
                activeCharIndex={
                  highlightIndex - "7,000 to 8,000 YEARS. ".length
                }
              />
            </p>

            <button
              onClick={() =>
                playVoice(
                  "7,000 to 8,000 YEARS. Some of the earliest pottery in the Indian subcontinent dates back this far. Important sites include Lahuradewa and Mehrgarh.",
                  0,
                )
              }
              style={{
                marginTop: "24px",
                padding: "12px 24px",
                background: isPlayingVoice ? "#dbeafe" : "white",
                color: "#1e3a8a",
                border: "2px solid #1e3a8a",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SvgIcons.Play />
              {isPlayingVoice ? "PLAYING..." : "REPLAY EXPLANATION"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderClue2 = () => {
    const phase = isRevealed ? 2 : 0;

    return (
      <div style={{ display: "flex", flex: 1, gap: "32px" }}>
        <div
          style={{
            flex: "0 0 50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
          }}
        >
          <Wheel
            isSpinning={isRevealed && !completedClues.has(1)}
            phase={phase}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
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
            {completedClues.has(1) ? "REVIEWING CLUE 02" : "CASE CLUE 02"}
          </div>
          <h3
            style={{
              color: "#0f172a",
              margin: "0 0 24px 0",
              fontSize: "32px",
              fontWeight: "900",
            }}
          >
            {clues[1].title}
          </h3>

          {!isRevealed ? (
            <button
              onClick={handleAction}
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
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <SvgIcons.Play />
              START WHEEL
            </button>
          ) : (
            <div
              style={{
                animation: "fadeIn 1s ease-in-out forwards",
                opacity: 0,
                animationDelay: completedClues.has(1) ? "0s" : "2.5s",
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
                  phrases={["WHEEL-TURNED POTTERY. "]}
                  activeCharIndex={highlightIndex}
                />
              </div>
              <p
                style={{
                  fontSize: "20px",
                  color: "#475569",
                  lineHeight: "1.5",
                  marginBottom: "16px",
                }}
              >
                <HighlightedText
                  phrases={[
                    "Around 4000 BCE, ",
                    "people developed clever ways ",
                    "to shape clay ",
                    "using a rotating wheel.",
                  ]}
                  activeCharIndex={
                    highlightIndex - "WHEEL-TURNED POTTERY. ".length
                  }
                />
              </p>

              <button
                onClick={() =>
                  playVoice(
                    "WHEEL-TURNED POTTERY. Around 4000 BCE, people developed clever ways to shape clay using a rotating wheel.",
                  )
                }
                style={{
                  marginTop: "24px",
                  padding: "12px 24px",
                  background: isPlayingVoice ? "#dbeafe" : "white",
                  color: "#1e3a8a",
                  border: "2px solid #1e3a8a",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SvgIcons.Play />
                {isPlayingVoice ? "PLAYING..." : "REPLAY EXPLANATION"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderClue3 = () => (
    <div style={{ display: "flex", flex: 1, gap: "32px" }}>
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
        }}
      >
        <PlainPot showDecoration={isRevealed} />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
          {completedClues.has(2) ? "REVIEWING CLUE 03" : "CASE CLUE 03"}
        </div>
        <h3
          style={{
            color: "#0f172a",
            margin: "0 0 24px 0",
            fontSize: "32px",
            fontWeight: "900",
          }}
        >
          {clues[2].title}
        </h3>

        {!isRevealed ? (
          <button
            onClick={handleAction}
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
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <SvgIcons.MagnifyingGlass />
            EXAMINE POT
          </button>
        ) : (
          <div
            style={{
              animation: "fadeIn 1s ease-in-out forwards",
              opacity: 0,
              animationDelay: completedClues.has(2) ? "0s" : "3s",
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
              DECORATIVE DESIGNS
            </div>
            <p
              style={{
                fontSize: "20px",
                color: "#475569",
                lineHeight: "1.5",
                marginBottom: "16px",
              }}
            >
              <HighlightedText
                phrases={[
                  "Ancient pottery from the Sindhu-Sarasvati civilization ",
                  "was decorated with colourful designs, ",
                  "including geometric patterns ",
                  "and nature motifs.",
                ]}
                activeCharIndex={highlightIndex}
              />
            </p>

            <button
              onClick={() =>
                playVoice(
                  "Ancient pottery from the Sindhu-Sarasvati civilization was decorated with colourful designs, including geometric patterns and nature motifs.",
                )
              }
              style={{
                marginTop: "24px",
                padding: "12px 24px",
                background: isPlayingVoice ? "#dbeafe" : "white",
                color: "#1e3a8a",
                border: "2px solid #1e3a8a",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <SvgIcons.Play />
              {isPlayingVoice ? "PLAYING..." : "REPLAY EXPLANATION"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderClue4 = () => {
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
                  style={{ padding: "16px 32px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center", transition: "transform 0.2s", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <SvgIcons.Play /> START MAKING
                </button>
              )}
              {isReplayingClue4 && !isPaused && (
                <button
                  onClick={pausePlayback}
                  style={{ padding: "16px 32px", background: "#f59e0b", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center", transition: "transform 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <SvgIcons.Pause /> PAUSE
                </button>
              )}
              {isReplayingClue4 && isPaused && (
                <button
                  onClick={resumePlayback}
                  style={{ padding: "16px 32px", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center", transition: "transform 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <SvgIcons.Play /> RESUME
                </button>
              )}
              {makingStep === 6 && (
                <button
                  onClick={replayClue4}
                  style={{ padding: "12px 24px", background: "white", color: "#1e3a8a", border: "2px solid #1e3a8a", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SvgIcons.Play /> REPLAY MAKING PROCESS
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClue5 = () => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <div style={{ fontWeight: "bold", color: "#64748b", fontSize: "14px", letterSpacing: "2px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
            <SvgIcons.MagnifyingGlass />
            {completedClues.has(4) ? "REVIEWING CLUE 05" : "CASE CLUE 05"}
          </div>
          <h3 style={{ color: "#0f172a", margin: "0 0 16px 0", fontSize: "32px", fontWeight: "900" }}>{clues[4].title}</h3>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
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
                padding: "12px",
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

        {renderTimeline()}

        {(completedClues.has(4) || investigatedUses.size === 3) && (
          <div className="explanationArea" style={{ display: "flex", flexDirection: "column", gap: "12px", animation: "fadeIn 1s forwards", padding: "12px", background: "#f1f5f9", borderRadius: "12px" }}>
            <div className="explanationText" style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%", minWidth: 0 }}>
              <div style={{ color: "#16a34a", fontWeight: "900", fontSize: "18px", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "8px" }}>
                <SvgIcons.Check /> ALL USES INVESTIGATED
              </div>
              <div style={{ fontSize: "20px", color: "#0f172a", lineHeight: "1.4" }}>
                <HighlightedText phrases={["POTTERY WAS USED FOR VARIOUS PURPOSES.", " "]} activeCharIndex={highlightIndex} />
                <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "18px", color: "#1e3a8a", fontWeight: "bold", flexWrap: "wrap" }}>
                  <HighlightedText phrases={["Cooking", " • "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. ".length} />
                  <HighlightedText phrases={["Storing food grains", " • "]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, ".length} />
                  <HighlightedText phrases={["Holding liquids"]} activeCharIndex={highlightIndex - "POTTERY WAS USED FOR VARIOUS PURPOSES. Cooking, Storing food grains, ".length} />
                </div>
              </div>
            </div>
            
            <div className="replayControls" style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
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
           <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px" }}>
                <button
                  onClick={replayClue5}
                  style={{ padding: "16px 32px", background: "#1e3a8a", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "bold", cursor: "pointer", display: "flex", gap: "12px", alignItems: "center", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", transition: "transform 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <SvgIcons.Play /> PLAY EXPLANATION
                </button>
           </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleNextClue}
            disabled={!completedClues.has(4)}
            style={{
              padding: "12px 24px",
              background: completedClues.has(4) ? "#1e3a8a" : "#cbd5e1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: completedClues.has(4) ? "pointer" : "not-allowed",
              transition: "background 0.3s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            NEXT CLUE
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    );
  };

  const renderFinal = () => (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        animation: "fadeIn 1s",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <PlainPot showDecoration={true} />
      </div>
      <h2
        style={{
          fontSize: "40px",
          color: "#1e3a8a",
          marginBottom: "16px",
          fontWeight: "900",
        }}
      >
        INVESTIGATION COMPLETE
      </h2>
      <p
        style={{
          fontSize: "20px",
          color: "#475569",
          maxWidth: "700px",
          lineHeight: "1.6",
          marginBottom: "32px",
        }}
      >
        All pottery clues have been uncovered. Pottery can tell us about the
        materials, skills and everyday life of people in the past.
      </p>
      <div style={{ display: "flex", gap: "16px" }}>
        <button
          onClick={() => {
            setClueIndex(0);
            setIsRevealed(true);
          }}
          style={{
            padding: "16px 32px",
            background: "white",
            color: "#1e3a8a",
            border: "2px solid #1e3a8a",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseOut={(e) => (e.currentTarget.style.background = "white")}
        >
          REVIEW INVESTIGATION
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "white",
        padding: "32px",
        boxSizing: "border-box",
        position: "relative",
        overflowY: "hidden",
      }}
    >
      {/* Main Clue Area */}
      <div
        style={{ display: "flex", flexDirection: "column", marginBottom: "24px" }}
      >
        {clueIndex === 0 && renderClue1()}
        {clueIndex === 1 && renderClue2()}
        {clueIndex === 2 && renderClue3()}
        {clueIndex === 3 && renderClue4()}
        {clueIndex === 4 && renderClue5()}
        {clueIndex === 5 && renderFinal()}
      </div>

      {/* Persistent Timeline */}
      {clueIndex < 4 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {renderTimeline()}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleNextClue}
              disabled={!completedClues.has(clueIndex)}
              style={{
                padding: "16px 32px",
                background: completedClues.has(clueIndex) ? "#1e3a8a" : "#cbd5e1",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: completedClues.has(clueIndex) ? "pointer" : "not-allowed",
                transition: "background 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              NEXT CLUE
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinDash {
          to { stroke-dashoffset: 100; }
        }
      `}</style>
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
                  Chair — Wood
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
                  Water Bottle — Plastic
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
                    •
                  </span>{" "}
                  Is this material strong enough?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "#6d28d9", fontWeight: "bold" }}>
                    •
                  </span>{" "}
                  Is it safe to use?
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "#6d28d9", fontWeight: "bold" }}>
                    •
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
            Next ➔
          </button>
        </div>
      )}
    </div>
  );
}
