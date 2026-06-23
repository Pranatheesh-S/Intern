import React from 'react';

// Cardboard board base
export const CardboardSVG = ({ x = 370, y = 200, width = 160, height = 210 }) => {
  return (
    <g>
      {/* Shadow */}
      <rect x={x + 4} y={y + 4} width={width} height={height} rx={12} fill="rgba(0, 0, 0, 0.4)" />
      {/* Outer cardboard base */}
      <rect x={x} y={y} width={width} height={height} rx={12} fill="#c2a67a" stroke="#8c734b" strokeWidth={3} />
      {/* Inner texture boundary */}
      <rect x={x + 8} y={y + 8} width={width - 16} height={height - 16} rx={8} fill="#d2b88a" stroke="#ab8e5f" strokeWidth={1} strokeDasharray="3,3" />
      {/* Cardboard label */}
      <text x={x + width / 2} y={y + height - 12} fill="#705b38" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">
        CARDBOARD SWITCHBOARD
      </text>
    </g>
  );
};

// Drawing Pin
export const DrawingPinSVG = ({ x, y, label, isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <circle cx={x} cy={y} r={14} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth={2} strokeDasharray="3,3" />
          <text x={x} y={y + 4} fill="#818cf8" fontSize="9" fontWeight="bold" textAnchor="middle">PIN</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <defs>
        <radialGradient id="brass-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
      </defs>
      {/* Outer shadow */}
      <circle cx={x + 2} cy={y + 2} r={14} fill="rgba(0, 0, 0, 0.3)" />
      {/* Outer flange */}
      <circle cx={x} cy={y} r={14} fill="url(#brass-grad)" stroke="#a16207" strokeWidth={1.5} />
      {/* Inner cap */}
      <circle cx={x} cy={y} r={8} fill="url(#brass-grad)" />
      {/* Center tip reflection */}
      <circle cx={x - 3} cy={y - 3} r={3} fill="#fef9c3" opacity={0.8} />
      {label && (
        <text x={x} y={y - 18} fill="#ca8a04" fontSize="10" fontWeight="bold" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
};

// Safety Pin
export const SafetyPinSVG = ({ x, y, rotation, material = 'metal', isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }}>
          {/* Target Outline */}
          <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
            <circle cx={0} cy={0} r={10} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1={0} y1={0} x2={0} y2={120} stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3,3" />
            <rect x={-8} y={110} width={16} height={16} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3,3" />
          </g>
          <text x={x + 24} y={y + 60} fill="#818cf8" fontSize="10" fontWeight="bold">ATTACH SAFETY PIN</text>
        </g>
      );
    }
    return null;
  }

  // Determine material styling
  let strokeColor = '#94a3b8'; // metal
  let claspColor = '#cbd5e1';
  let label = "Safety Pin (Metal)";
  
  if (material === 'plastic') {
    strokeColor = '#06b6d4'; // bright cyan
    claspColor = '#22d3ee';
    label = "Plastic Pin (Insulator)";
  } else if (material === 'wood') {
    strokeColor = '#b45309'; // wood brown
    claspColor = '#d97706';
    label = "Wooden Pin (Insulator)";
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <defs>
        <linearGradient id="pin-metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={strokeColor} />
        </linearGradient>
      </defs>
      
      {/* Drop shadow */}
      <g opacity={0.25} transform="translate(2, 2)">
        <circle cx={0} cy={0} r={10} fill="#000000" />
        <line x1={-5} y1={0} x2={-8} y2={110} stroke="#000000" strokeWidth={4} />
        <line x1={5} y1={0} x2={8} y2={110} stroke="#000000" strokeWidth={4} />
        <rect x={-10} y={105} width={20} height={16} rx={3} fill="#000000" />
      </g>

      {/* Spring coil at (0,0) */}
      <circle cx={0} cy={0} r={10} fill="none" stroke={`url(#pin-metal-grad)`} strokeWidth="4.5" />
      <circle cx={0} cy={0} r={5} fill="#0d131f" stroke={strokeColor} strokeWidth="1" />
      
      {/* Back bar */}
      <line x1="-5" y1="0" x2="-8" y2="108" stroke={`url(#pin-metal-grad)`} strokeWidth="4.5" strokeLinecap="round" />
      
      {/* Sharp needle bar (inside) */}
      <line x1="5" y1="0" x2="7" y2="108" stroke={`url(#pin-metal-grad)`} strokeWidth="3" />
      
      {/* Clasp holder guard */}
      <rect x="-10" y="105" width="20" height="16" rx="4" fill={claspColor} stroke={strokeColor} strokeWidth="1.5" />
      
      {/* A tiny hole in clasp */}
      <circle cx="0" cy="113" r="2.5" fill="#0d131f" />
    </g>
  );
};

// Bulb
export const BulbSVG = ({ isOn, isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <rect x={260} y={80} width={80} height={20} rx={4} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth={2} strokeDasharray="3,3" />
          <circle cx={300} cy={45} r={22} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3,3" />
          <text x={300} y={49} fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">BULB</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <defs>
        <radialGradient id="bulb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
          <stop offset="40%" stopColor="#eab308" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ca8a04" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
        </radialGradient>
        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Holder base */}
      <rect x="256" y="90" width="88" height="24" rx="6" fill="#1e3a8a" stroke="#2563eb" strokeWidth={2} />
      <rect x="270" y="114" width="60" height="4" fill="#172554" />
      
      {/* Terminals screws */}
      <circle cx="270" cy="102" r="5" fill="#d97706" stroke="#b45309" strokeWidth={1} />
      <circle cx="270" cy="102" r="2" fill="#f59e0b" />
      <circle cx="330" cy="102" r="5" fill="#d97706" stroke="#b45309" strokeWidth={1} />
      <circle cx="330" cy="102" r="2" fill="#f59e0b" />

      {/* Screw brass sleeve */}
      <rect x="288" y="70" width="24" height="20" fill="#854d0e" stroke="#a16207" strokeWidth={1} />
      <line x1="288" y1="76" x2="312" y2="76" stroke="#713f12" strokeWidth={2} />
      <line x1="288" y1="82" x2="312" y2="82" stroke="#713f12" strokeWidth={2} />
      
      {/* Bulb glow overlay */}
      {isOn && (
        <circle cx="300" cy="45" r="45" fill="url(#bulb-glow)" pointerEvents="none" className="bulb-glowing" />
      )}
      
      {/* Glass globe */}
      <circle cx="300" cy="45" r="22" 
              fill={isOn ? '#fef08a' : 'rgba(255,255,255,0.05)'} 
              stroke={isOn ? '#f59e0b' : '#64748b'} 
              strokeWidth="2.5" />
      {/* Glass highlight reflection */}
      <path d="M 284,40 A 16,16 0 0,1 306,26" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity={isOn ? 0.8 : 0.2} />
      
      {/* Filament */}
      {/* Left lead */}
      <line x1="293" y1="70" x2="293" y2="52" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Right lead */}
      <line x1="307" y1="70" x2="307" y2="52" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Filament loop */}
      <path d="M 293,52 C 293,44 297,44 300,47 C 303,44 307,44 307,52" 
            fill="none" 
            stroke={isOn ? '#ea580c' : '#475569'} 
            strokeWidth="2" 
            strokeLinecap="round" />

      {/* Ray flares when lit */}
      {isOn && (
        <g stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity={0.9}>
          <line x1="300" y1="12" x2="300" y2="2" />
          <line x1="277" y1="22" x2="269" y2="14" />
          <line x1="323" y1="22" x2="331" y2="14" />
          <line x1="268" y1="45" x2="258" y2="45" />
          <line x1="332" y1="45" x2="342" y2="45" />
        </g>
      )}
    </g>
  );
};

// Battery
export const BatterySVG = ({ isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <rect x={104} y={366} width={92} height={48} rx={6} fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth={2} strokeDasharray="3,3" />
          <text x={150} y={394} fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">BATTERY</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <defs>
        <linearGradient id="battery-cylinder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#dc2626" />
          <stop offset="70%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="metal-caps" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      
      {/* Battery body shadow */}
      <rect x={108 + 2} y={370 + 2} width={84} height={40} rx={4} fill="rgba(0,0,0,0.3)" />

      {/* Negative Flat End (Left) */}
      <rect x="104" y="372" width="6" height="36" rx="2" fill="url(#metal-caps)" stroke="#475569" strokeWidth="0.5" />
      
      {/* Cylinder body */}
      <rect x="110" y="370" width="76" height="40" rx="4" fill="url(#battery-cylinder)" stroke="#b91c1c" strokeWidth="1" />
      
      {/* Positive Cap (Right) */}
      <rect x="186" y="378" width="6" height="24" rx="2" fill="url(#metal-caps)" stroke="#475569" strokeWidth="0.5" />
      {/* Positive Pip */}
      <rect x="192" y="383" width="3" height="14" rx="1" fill="url(#metal-caps)" />

      {/* Label and Symbols */}
      <text x="122" y="395" fill="#fca5a5" fontSize="18" fontWeight="bold" textAnchor="middle">-</text>
      <text x="174" y="395" fill="#fca5a5" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
      
      <rect x="133" y="376" width="30" height="28" fill="#1e293b" rx="2" opacity={0.6} />
      <text x="148" y="388" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">CELL</text>
      <text x="148" y="398" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">1.5V</text>
    </g>
  );
};

// Wires
export const WiresSVG = ({ 
  isWireConnected, 
  isBatteryPresent, 
  isBulbPresent, 
  arePinsPlaced,
  isCurrentFlowing, 
  isBroken = false, // specific sandbox option
  isTarget = false, 
  onClick 
}) => {
  // Coordinates
  // Bulb Left Terminal: (270, 102)
  // Bulb Right Terminal: (330, 102)
  // Battery Negative (Left): (104, 390)
  // Battery Positive (Right): (192, 390)
  // Pin 1 (Pivot, Top): (450, 250)
  // Pin 2 (Contact, Bottom): (450, 370)

  // Paths
  // Wire 1: Bulb Left -> Battery Negative
  const path1 = "M 270,102 C 180,102 80,240 104,390";
  // Wire 2: Battery Positive -> Pin 2
  const path2 = "M 192,390 C 260,430 380,410 450,370";
  // Wire 3: Pin 1 -> Bulb Right
  const path3 = "M 450,250 C 450,150 400,102 330,102";

  if (!isWireConnected) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          {/* Wire placeholders */}
          <path d={path1} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="4,4" opacity={isBulbPresent && isBatteryPresent ? 0.7 : 0.2} />
          <path d={path2} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="4,4" opacity={isBatteryPresent && arePinsPlaced ? 0.7 : 0.2} />
          <path d={path3} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="4,4" opacity={arePinsPlaced && isBulbPresent ? 0.7 : 0.2} />
          <text x="300" y="220" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle">CONNECT WIRES</text>
        </g>
      );
    }
    return null;
  }

  // If wire is broken in sandbox, we render separate parts or cut it
  if (isBroken) {
    // Cut Wire 2 (Battery Positive to Pin 2) to show "broken wire"
    const path2PartA = "M 192,390 C 220,405 250,405 270,395";
    const path2PartB = "M 320,380 C 360,375 410,372 450,370";
    
    return (
      <g>
        {/* Wire 1: Red */}
        <path d={path1} fill="none" stroke="#dc2626" strokeWidth={4} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
        <path d={path1} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
        
        {/* Wire 3: Yellow */}
        <path d={path3} fill="none" stroke="#eab308" strokeWidth={4} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
        <path d={path3} fill="none" stroke="#fde047" strokeWidth={2} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
        
        {/* Wire 2 broken pieces */}
        <g stroke="#d97706" strokeWidth={4} strokeLinecap="round" fill="none">
          <path d={path2PartA} />
          <path d={path2PartB} />
        </g>
        <g stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" fill="none">
          <path d={path2PartA} />
          <path d={path2PartB} />
        </g>
        
        {/* Sparkles or exclamation at cut */}
        <circle cx="295" cy="387" r="3" fill="#ef4444" className="bulb-glowing" />
        <text x="295" y="375" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">WIRE CUT</text>
      </g>
    );
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Wire 1 (Bulb Left -> Battery Negative) - Red Wire */}
      <path d={path1} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
      <path d={path1} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />

      {/* Wire 2 (Battery Positive -> Pin 2) - Yellow Wire */}
      <path d={path2} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />
      <path d={path2} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />

      {/* Wire 3 (Pin 1 -> Bulb Right) - Red/Orange Wire */}
      <path d={path3} fill="none" stroke="#9a3412" strokeWidth={5} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
      <path d={path3} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />

      {/* Current Flowing Overlay */}
      {isCurrentFlowing && (
        <g fill="none" strokeWidth={3} strokeLinecap="round" className="current-flow">
          {/* Wire 1 current (moving right-to-left: Bulb to Negative terminal) */}
          <path d={path1} stroke="#67e8f9" />
          
          {/* Wire 2 current (moving left-to-right: Positive terminal to Pin 2) */}
          <path d={path2} stroke="#67e8f9" />
          
          {/* Wire 3 current (moving right-to-left: Pin 1 to Bulb) */}
          <path d={path3} stroke="#67e8f9" />
        </g>
      )}
    </g>
  );
};
