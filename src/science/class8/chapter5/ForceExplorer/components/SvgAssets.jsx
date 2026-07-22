import React from 'react';

// Common cartoon styling constants
const colors = {
  wood: "#d4a373",
  woodDark: "#bc6c25",
  woodLight: "#faedcd",
  rope: "#e9c46a",
  sky: "#87CEEB",
  grass: "#7cb518",
  grassDark: "#5c8a11",
  childSkin: "#ffb5a7",
  childShirt: "#4cc9f0",
  childPants: "#4361ee",
  airplaneWhite: "#f8f9fa",
  airplaneRed: "#ef233c",
  targetBase: "#b7e4c7",
  targetRing: "#40916c",
  obstacleStone: "#6c757d",
  obstaclePuddle: "#48cae4",
  arrowPull: "#f72585",
  arrowPush: "#4361ee",
  arrowLift: "#fca311"
};

export const CrateSVG = ({ width = 100, height = 100, style }) => (
  <svg width={width} height={height} viewBox="0 0 100 100" style={style}>
    {/* Base box */}
    <rect x="10" y="10" width="80" height="80" fill={colors.wood} rx="4" />
    
    {/* Planks */}
    <rect x="15" y="15" width="70" height="20" fill={colors.woodLight} opacity="0.6" />
    <rect x="15" y="40" width="70" height="20" fill={colors.woodLight} opacity="0.6" />
    <rect x="15" y="65" width="70" height="20" fill={colors.woodLight} opacity="0.6" />
    
    {/* Borders */}
    <rect x="10" y="10" width="80" height="80" fill="none" stroke={colors.woodDark} strokeWidth="4" rx="4" />
    <line x1="25" y1="10" x2="25" y2="90" stroke={colors.woodDark} strokeWidth="3" />
    <line x1="75" y1="10" x2="75" y2="90" stroke={colors.woodDark} strokeWidth="3" />
    <line x1="10" y1="25" x2="90" y2="25" stroke={colors.woodDark} strokeWidth="3" />
    <line x1="10" y1="75" x2="90" y2="75" stroke={colors.woodDark} strokeWidth="3" />
    
    {/* Cross pattern */}
    <line x1="15" y1="15" x2="85" y2="85" stroke={colors.woodDark} strokeWidth="3" />
    <line x1="85" y1="15" x2="15" y2="85" stroke={colors.woodDark} strokeWidth="3" />
    
    {/* Nails */}
    <circle cx="17.5" cy="17.5" r="2" fill="#555" />
    <circle cx="82.5" cy="17.5" r="2" fill="#555" />
    <circle cx="17.5" cy="82.5" r="2" fill="#555" />
    <circle cx="82.5" cy="82.5" r="2" fill="#555" />
  </svg>
);

export const TargetSVG = ({ width = 120, height = 40, style }) => (
  <svg width={width} height={height} viewBox="0 0 120 40" style={style}>
    <ellipse cx="60" cy="20" rx="50" ry="15" fill={colors.targetRing} />
    <ellipse cx="60" cy="20" rx="40" ry="10" fill={colors.targetBase} />
    <ellipse cx="60" cy="20" rx="20" ry="5" fill="white" opacity="0.8" />
    <text x="60" y="24" fontSize="12" fontWeight="bold" fill={colors.targetRing} textAnchor="middle">TARGET</text>
  </svg>
);

export const ChildSideSVG = ({ width = 80, height = 150, style, pose = 'idle', isWalking = false }) => {
  // Poses: idle, pulling, pushing, carrying

  // Pastel Color Palette
  const skin = "#ffe5d9"; // soft pastel skin
  const skinDark = "#f4c2c2"; // shaded skin for back limbs
  const shirt = "#a8dadc"; // pastel blue/teal
  const pants = "#457b9d"; // soft dark blue
  const hair = "#e07a5f"; // soft terracotta/ginger

  let backArm, frontArm;
  if (pose === 'pulling') {
    // Facing left
    backArm = { path: "M 42,65 L 28,65 L 5,75", hX: 5, hY: 75 };
    frontArm = { path: "M 38,65 L 22,70 L 5,80", hX: 5, hY: 80 };
  } else if (pose === 'pushing') {
    // Facing right
    backArm = { path: "M 38,65 L 58,60 L 78,70", hX: 78, hY: 70 };
    frontArm = { path: "M 42,65 L 62,70 L 78,80", hX: 78, hY: 80 };
  } else if (pose === 'carrying') {
    // Facing right, arms stretched out
    backArm = { path: "M 38,65 L 75,60", hX: 75, hY: 60 };
    frontArm = { path: "M 42,65 L 80,65", hX: 80, hY: 65 };
  } else {
    // idle
    backArm = { path: "M 38,65 L 38,80 L 43,95", hX: 43, hY: 95 };
    frontArm = { path: "M 42,65 L 47,85 L 42,100", hX: 42, hY: 100 };
  }

  let backLeg, frontLeg;
  if (pose === 'pulling') { 
    backLeg = "M 40,85 L 25,135";
    frontLeg = "M 40,85 L 55,125 L 65,135";
  } else if (pose === 'pushing') { 
    backLeg = "M 40,85 L 55,135";
    frontLeg = "M 40,85 L 25,125 L 15,135";
  } else {
    backLeg = "M 40,85 L 35,135";
    frontLeg = "M 40,85 L 45,135";
  }

  const isFacingLeft = pose === 'pulling';
  const eyeX = isFacingLeft ? 26 : 54;
  const eyeY = 32;
  const cheekX = isFacingLeft ? 20 : 60;
  const smilePath = isFacingLeft ? "M 20,42 Q 24,48 28,42" : "M 52,42 Q 56,48 60,42";

  return (
    <svg width={width} height={height} viewBox="0 0 80 150" style={style}>
      <style>
        {`
          @keyframes walk1 {
            0% { transform: rotate(-20deg); }
            50% { transform: rotate(20deg); }
            100% { transform: rotate(-20deg); }
          }
          @keyframes walk2 {
            0% { transform: rotate(20deg); }
            50% { transform: rotate(-20deg); }
            100% { transform: rotate(20deg); }
          }
          .leg-walk-1 { animation: walk1 0.6s infinite ease-in-out; }
          .leg-walk-2 { animation: walk2 0.6s infinite ease-in-out; }
        `}
      </style>
      
      {/* Back Arm (Behind body) */}
      <path d={backArm.path} stroke={skinDark} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={backArm.hX} cy={backArm.hY} r="7" fill={skinDark} /> {/* Oversized Hand */}

      {/* Back leg */}
      <path 
        className={isWalking ? 'leg-walk-1' : ''}
        style={{ transformOrigin: '40px 85px' }}
        d={backLeg} 
        stroke="#2e5975" 
        strokeWidth="11" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Small Torso */}
      <rect x="32" y="55" width="16" height="35" rx="8" fill={shirt} />
      
      {/* Front leg */}
      <path 
        className={isWalking ? 'leg-walk-2' : ''}
        style={{ transformOrigin: '40px 85px' }}
        d={frontLeg} 
        stroke={pants} 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Large Round Head (35-40% of body) */}
      {/* Base Hair (Behind Head) */}
      <circle cx={isFacingLeft ? 48 : 32} cy="32" r="24" fill={hair} />
      {/* Face */}
      <circle cx="40" cy="34" r="26" fill={skin} />
      
      {/* Cute Hair Tuft */}
      <path d="M 30,12 Q 40,0 50,12 Q 45,4 40, -2 Q 35,4 30,12 Z" fill={hair} />
      {/* Front Bangs */}
      <path d={isFacingLeft ? "M 20,20 Q 30,10 50,15 Q 40,15 20,20 Z" : "M 60,20 Q 50,10 30,15 Q 40,15 60,20 Z"} fill={hair} />
      
      {/* Cheek Blush */}
      <circle cx={cheekX} cy="38" r="4.5" fill="#ffb5a7" opacity="0.6" />

      {/* Big Smiling Eye */}
      <circle cx={eyeX} cy={eyeY} r="5" fill="#2b2d42" />
      <circle cx={eyeX + (isFacingLeft ? -1.5 : 1.5)} cy={eyeY - 1.5} r="1.5" fill="white" />
      
      {/* Warm Smile */}
      <path d={smilePath} stroke="#2b2d42" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Front Arm (In front of body) */}
      <path d={frontArm.path} stroke={skin} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={frontArm.hX} cy={frontArm.hY} r="8" fill={skin} /> {/* Oversized Hand */}
    </svg>
  );
};

export const AirplaneSVG = ({ width = 300, height = 150, style }) => (
  <svg width={width} height={height} viewBox="0 0 300 150" style={style}>
    {/* Tail */}
    <path d="M 230,70 L 280,20 L 290,20 L 290,70 Z" fill={colors.airplaneRed} />
    
    {/* Main Body */}
    <path d="M 30,70 Q 10,70 10,90 Q 10,110 30,110 L 280,110 L 290,70 Z" fill={colors.airplaneWhite} />
    
    {/* Cockpit window */}
    <path d="M 25,80 Q 35,75 50,75 L 50,90 L 25,90 Z" fill="#48cae4" opacity="0.7" />
    
    {/* Wing */}
    <path d="M 120,95 L 200,95 L 220,130 L 100,130 Z" fill="#e9ecef" stroke="#ced4da" strokeWidth="2" />
    
    {/* Cargo Door Outline */}
    <rect x="80" y="75" width="50" height="35" rx="5" fill="none" stroke="#adb5bd" strokeWidth="2" strokeDasharray="4 4" />
    <text x="105" y="98" fontSize="14" fontWeight="bold" fill="#adb5bd" textAnchor="middle">CARGO</text>

    {/* Details */}
    <circle cx="160" cy="85" r="4" fill="#ced4da" />
    <circle cx="180" cy="85" r="4" fill="#ced4da" />
    <circle cx="200" cy="85" r="4" fill="#ced4da" />
    <circle cx="220" cy="85" r="4" fill="#ced4da" />
  </svg>
);

export const CloudSVG = ({ width = 100, height = 60, style }) => (
  <svg width={width} height={height} viewBox="0 0 100 60" style={style}>
    <path d="M 25,45 a 15,15 0 0,1 0,-30 a 20,20 0 0,1 35,-10 a 20,20 0 0,1 25,15 a 15,15 0 0,1 0,30 z" fill="white" opacity="0.9" />
  </svg>
);

export const TreeSVG = ({ width = 80, height = 120, style }) => (
  <svg width={width} height={height} viewBox="0 0 80 120" style={style}>
    <rect x="30" y="60" width="20" height="60" fill={colors.woodDark} />
    <circle cx="40" cy="40" r="35" fill={colors.grassDark} />
    <circle cx="25" cy="50" r="25" fill={colors.grass} />
    <circle cx="55" cy="50" r="25" fill={colors.grass} />
    <circle cx="40" cy="20" r="20" fill={colors.grass} />
  </svg>
);

export const ForceArrowSVG = ({ direction = "right", width = 80, height = 40, style, label="FORCE" }) => {
  let transform = "rotate(0)";
  if (direction === "left") transform = "rotate(180, 40, 20)";
  if (direction === "up") transform = "rotate(-90, 40, 20)";
  if (direction === "down") transform = "rotate(90, 40, 20)";
  
  return (
    <svg width={width} height={height} viewBox="0 0 80 40" style={style}>
      <g transform={transform}>
        <path d="M 10,15 L 50,15 L 50,5 L 75,20 L 50,35 L 50,25 L 10,25 Z" fill={colors.arrowPush} />
        {label && <text x="35" y="24" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">{label}</text>}
      </g>
    </svg>
  );
};
