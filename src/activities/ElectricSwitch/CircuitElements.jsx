import React from 'react';

// Cardboard board base
export const CardboardSVG = ({ x = 370, y = 200, width = 160, height = 210 }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all', cursor: 'grab' }}>
      {/* Shadow */}
      <rect x={x + 4} y={y + 4} width={width} height={height} rx={12} fill="rgba(0, 0, 0, 0.4)" style={{ pointerEvents: 'none' }} />
      {/* Outer cardboard base */}
      <rect x={x} y={y} width={width} height={height} rx={12} fill="#c2a67a" stroke="#8c734b" strokeWidth={3} style={{ pointerEvents: 'all' }} />
      {/* Inner texture boundary */}
      <rect x={x + 8} y={y + 8} width={width - 16} height={height - 16} rx={8} fill="#d2b88a" stroke="#ab8e5f" strokeWidth={1} strokeDasharray="3,3" style={{ pointerEvents: 'all' }} />
      {/* Cardboard label */}
      <text x={x + width / 2} y={y + height - 12} fill="#705b38" fontSize="10" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>
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
        <g onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }} className="pulse-target">
          <circle cx={x} cy={y} r={14} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <text x={x} y={y + 4} fill="var(--accent-text)" fontSize="9" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>PIN</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <defs>
        <radialGradient id="brass-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
      </defs>
      {/* Outer shadow */}
      <circle cx={x + 2} cy={y + 2} r={14} fill="rgba(0, 0, 0, 0.3)" style={{ pointerEvents: 'none' }} />
      {/* Outer flange */}
      <circle cx={x} cy={y} r={14} fill="url(#brass-grad)" stroke="#a16207" strokeWidth={1.5} style={{ pointerEvents: 'all' }} />
      {/* Inner cap */}
      <circle cx={x} cy={y} r={8} fill="url(#brass-grad)" style={{ pointerEvents: 'all' }} />
      {/* Center tip reflection */}
      <circle cx={x - 3} cy={y - 3} r={3} fill="#fef9c3" opacity={0.8} style={{ pointerEvents: 'none' }} />
      {label && (
        <text x={x} y={y - 18} fill="#ca8a04" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>
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
        <g onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
          {/* Target Outline */}
          <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
            <circle cx={0} cy={0} r={10} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1={0} y1={0} x2={0} y2={120} stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
            <rect x={-8} y={110} width={16} height={16} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
          </g>
          <text x={x + 24} y={y + 60} fill="var(--accent-text)" fontSize="10" fontWeight="bold" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>ATTACH SAFETY PIN</text>
        </g>
      );
    }
    return null;
  }

  // Determine material styling
  let strokeColor = 'var(--text-faint)'; // metal
  let claspColor = 'var(--text-faint)';
  let label = "Safety Pin (Metal)";
  
  if (material === 'plastic') {
    strokeColor = '#06b6d4'; // bright cyan
    claspColor = '#22d3ee';
    label = "Plastic Pin (Insulator)";
  } else if (material === 'wood') {
    strokeColor = '#b45309'; // wood brown
    claspColor = 'var(--warning)';
    label = "Wooden Pin (Insulator)";
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <defs>
        <linearGradient id="pin-metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={strokeColor} />
          <stop offset="40%" stopColor="var(--card-bg)" />
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
        <g onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }} className="pulse-target">
          <rect x={260} y={80} width={80} height={20} rx={4} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <circle cx={300} cy={45} r={22} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
          <text x={300} y={49} fill="var(--accent-text)" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>BULB</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
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
      <rect x="256" y="90" width="88" height="24" rx="6" fill="#1e3a8a" stroke="#2563eb" strokeWidth={2} style={{ pointerEvents: 'all' }} />
      <rect x="270" y="114" width="60" height="4" fill="#172554" style={{ pointerEvents: 'all' }} />
      
      {/* Terminals screws */}
      <circle cx="270" cy="102" r="5" fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx="270" cy="102" r="2" fill="var(--warning)" />
      <circle cx="330" cy="102" r="5" fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx="330" cy="102" r="2" fill="var(--warning)" />

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
              fill={isOn ? '#fef08a' : 'var(--border)'} 
              stroke={isOn ? 'var(--warning)' : 'var(--text-muted)'} 
              strokeWidth="2.5" 
              style={{ pointerEvents: 'all' }} />
      {/* Glass highlight reflection */}
      <path d="M 284,40 A 16,16 0 0,1 306,26" fill="none" stroke="var(--card-bg)" strokeWidth="1.5" opacity={isOn ? 0.8 : 0.2} />
      
      {/* Filament */}
      {/* Left lead */}
      <line x1="293" y1="70" x2="293" y2="52" stroke="var(--text-faint)" strokeWidth="1.5" />
      {/* Right lead */}
      <line x1="307" y1="70" x2="307" y2="52" stroke="var(--text-faint)" strokeWidth="1.5" />
      {/* Filament loop */}
      <path d="M 293,52 C 293,44 297,44 300,47 C 303,44 307,44 307,52" 
            fill="none" 
            stroke={isOn ? '#ea580c' : 'var(--text-secondary)'} 
            strokeWidth="2" 
            strokeLinecap="round" />

      {/* Ray flares when lit */}
      {isOn && (
        <g stroke="var(--warning)" strokeWidth="2.5" strokeLinecap="round" opacity={0.9}>
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
        <g onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }} className="pulse-target">
          <rect x={104} y={366} width={92} height={48} rx={6} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <text x={150} y={394} fill="var(--accent-text)" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>BATTERY</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'grab', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <defs>
        <linearGradient id="battery-cylinder" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--danger)" />
          <stop offset="40%" stopColor="var(--danger)" />
          <stop offset="70%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="metal-caps" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--neutral-bg)" />
          <stop offset="50%" stopColor="var(--text-faint)" />
          <stop offset="100%" stopColor="var(--text-secondary)" />
        </linearGradient>
      </defs>
      
      {/* Battery body shadow */}
      <rect x={108 + 2} y={370 + 2} width={84} height={40} rx={4} fill="var(--border)" style={{ pointerEvents: 'none' }} />

      {/* Negative Flat End (Left) */}
      <rect x="104" y="372" width="6" height="36" rx="2" fill="url(#metal-caps)" stroke="var(--text-secondary)" strokeWidth="0.5" style={{ pointerEvents: 'all' }} />
      
      {/* Cylinder body */}
      <rect x="110" y="370" width="76" height="40" rx="4" fill="url(#battery-cylinder)" stroke="#b91c1c" strokeWidth="1" style={{ pointerEvents: 'all' }} />
      
      {/* Positive Cap (Right) */}
      <rect x="186" y="378" width="6" height="24" rx="2" fill="url(#metal-caps)" stroke="var(--text-secondary)" strokeWidth="0.5" style={{ pointerEvents: 'all' }} />
      {/* Positive Pip */}
      <rect x="192" y="383" width="3" height="14" rx="1" fill="url(#metal-caps)" style={{ pointerEvents: 'all' }} />

      {/* Label and Symbols */}
      <text x="122" y="395" fill="#fca5a5" fontSize="18" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>-</text>
      <text x="174" y="395" fill="#fca5a5" fontSize="16" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>+</text>
      
      <rect x="133" y="376" width="30" height="28" fill="var(--text-primary)" rx="2" opacity={0.6} style={{ pointerEvents: 'none' }} />
      <text x="148" y="388" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>CELL</text>
      <text x="148" y="398" fill="var(--card-bg)" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>1.5V</text>
    </g>
  );
};

// BatteryBareSVG (Just the cell itself)
export const BatteryBareSVG = () => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <defs>
        <linearGradient id="battery-cylinder-bare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--danger)" />
          <stop offset="40%" stopColor="var(--danger)" />
          <stop offset="70%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="metal-caps-bare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--neutral-bg)" />
          <stop offset="50%" stopColor="var(--text-faint)" />
          <stop offset="100%" stopColor="var(--text-secondary)" />
        </linearGradient>
      </defs>
      
      {/* Battery body shadow */}
      <rect x={2} y={2} width={84} height={40} rx={4} fill="rgba(0,0,0,0.2)" />

      {/* Negative Flat End (Left) */}
      <rect x="0" y="2" width="6" height="36" rx="2" fill="url(#metal-caps-bare)" stroke="var(--text-secondary)" strokeWidth="0.5" />
      
      {/* Cylinder body */}
      <rect x="6" y="0" width="76" height="40" rx="4" fill="url(#battery-cylinder-bare)" stroke="#b91c1c" strokeWidth="1" />
      
      {/* Positive Cap (Right) */}
      <rect x="82" y="8" width="6" height="24" rx="2" fill="url(#metal-caps-bare)" stroke="var(--text-secondary)" strokeWidth="0.5" />
      {/* Positive Pip */}
      <rect x="88" y="13" width="3" height="14" rx="1" fill="url(#metal-caps-bare)" />

      {/* Label and Symbols */}
      <text x="18" y="25" fill="#111827" fontSize="18" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>-</text>
      <text x="70" y="25" fill="#111827" fontSize="16" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>+</text>
      
      <rect x="29" y="6" width="30" height="28" fill="var(--text-primary)" rx="2" opacity={0.6} />
      <text x="44" y="18" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>CELL</text>
      <text x="44" y="28" fill="var(--card-bg)" fontSize="8" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>1.5V</text>
    </g>
  );
};

// BatteryHolderSVG (The plastic case holding the cell, with terminals)
export const BatteryHolderSVG = ({ hasCell }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      {/* Plastic case bottom */}
      <rect x={0} y={0} width={100} height={48} rx={6} fill="#374151" stroke="#1f2937" strokeWidth={2} />
      {/* Inner compartment */}
      <rect x={4} y={4} width={92} height={40} rx={4} fill="#111827" />
      
      {/* Left terminal spring (negative) */}
      <path d="M 12 8 Q 18 24 12 40" fill="none" stroke="#9ca3af" strokeWidth={2} />
      
      {/* Right terminal contact (positive) */}
      <rect x={90} y={14} width={4} height={20} fill="#9ca3af" />

      {/* If cell is inserted, render it inside */}
      {hasCell && (
        <g transform="translate(6, 4)">
          <BatteryBareSVG />
        </g>
      )}

      {/* Case clamps / top part */}
      <rect x={20} y={-4} width={10} height={12} rx={2} fill="#374151" />
      <rect x={160} y={-4} width={10} height={12} rx={2} fill="#374151" />
      <rect x={20} y={40} width={10} height={12} rx={2} fill="#374151" />
      <rect x={70} y={40} width={10} height={12} rx={2} fill="#374151" />

      {/* Wiring Terminals (Screws on the outside) */}
      <line x1={-15} y1={24} x2={0} y2={24} stroke="#9ca3af" strokeWidth={3} />
      <line x1={100} y1={24} x2={115} y2={24} stroke="#9ca3af" strokeWidth={3} />
      
      {/* Screw Heads */}
      <circle cx={-15} cy={24} r={5} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx={-15} cy={24} r={2} fill="var(--warning)" />
      
      <circle cx={115} cy={24} r={5} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx={115} cy={24} r={2} fill="var(--warning)" />

      {/* Labels */}
      <text x={-15} y={14} fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>-</text>
      <text x={115} y={14} fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>+</text>
    </g>
  );
};

// BulbBareSVG (Just the glass and filament)
export const BulbBareSVG = ({ isOn }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      {/* Screw brass sleeve */}
      <rect x="-12" y="25" width="24" height="20" fill="#854d0e" stroke="#a16207" strokeWidth={1} />
      <line x1="-12" y1="31" x2="12" y2="31" stroke="#713f12" strokeWidth={2} />
      <line x1="-12" y1="37" x2="12" y2="37" stroke="#713f12" strokeWidth={2} />
      
      {/* Bulb glow overlay */}
      {isOn && (
        <circle cx="0" cy="0" r="45" fill="url(#bulb-glow)" pointerEvents="none" className="bulb-glowing" />
      )}
      
      {/* Glass globe */}
      <circle cx="0" cy="0" r="22" 
              fill={isOn ? '#fef08a' : 'var(--border)'} 
              stroke={isOn ? 'var(--warning)' : 'var(--text-muted)'} 
              strokeWidth="2.5" />
      {/* Glass highlight */}
      <path d="M -16,-5 A 16,16 0 0,1 6,-19" fill="none" stroke="var(--card-bg)" strokeWidth="1.5" opacity={isOn ? 0.8 : 0.2} />
      
      {/* Left lead */}
      <line x1="-7" y1="25" x2="-7" y2="7" stroke="var(--text-faint)" strokeWidth="1.5" />
      {/* Right lead */}
      <line x1="7" y1="25" x2="7" y2="7" stroke="var(--text-faint)" strokeWidth="1.5" />
      {/* Filament loop */}
      <path d="M -7,7 C -7,-1 -3,-1 0,2 C 3,-1 7,-1 7,7" 
            fill="none" 
            stroke={isOn ? '#ea580c' : 'var(--text-secondary)'} 
            strokeWidth="2" 
            strokeLinecap="round" />
            
      {/* Ray flares when lit */}
      {isOn && (
        <g stroke="var(--warning)" strokeWidth="2.5" strokeLinecap="round" opacity={0.9}>
          <line x1="0" y1="-33" x2="0" y2="-43" />
          <line x1="-23" y1="-23" x2="-31" y2="-31" />
          <line x1="23" y1="-23" x2="31" y2="-31" />
          <line x1="-32" y1="0" x2="-42" y2="0" />
          <line x1="32" y1="0" x2="42" y2="0" />
        </g>
      )}
    </g>
  );
};

// BulbHolderSVG (The base with terminals)
export const BulbHolderSVG = ({ hasBulb, isOn }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      {/* Holder base */}
      <rect x="-44" y="45" width="88" height="24" rx="6" fill="#1e3a8a" stroke="#2563eb" strokeWidth={2} />
      <rect x="-30" y="69" width="60" height="4" fill="#172554" />
      
      {/* Terminals screws */}
      <circle cx="-30" cy="57" r="5" fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx="-30" cy="57" r="2" fill="var(--warning)" />
      <circle cx="30" cy="57" r="5" fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx="30" cy="57" r="2" fill="var(--warning)" />

      {/* Socket opening (dark inside) */}
      {!hasBulb && (
        <rect x="-14" y="32" width="28" height="13" fill="#111827" stroke="#374151" strokeWidth={1} />
      )}

      {/* If bulb is inserted, render it */}
      {hasBulb && (
        <g transform="translate(0, 0)">
          <BulbBareSVG isOn={isOn} />
        </g>
      )}
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
  const path1 = "M 270,102 C 180,102 80,240 104,390";
  const path2 = "M 192,390 C 260,430 380,410 450,370";
  const path3 = "M 450,250 C 450,150 400,102 330,102";

  if (!isWireConnected) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }} className="pulse-target">
          <path d={path1} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={isBulbPresent && isBatteryPresent ? 0.7 : 0.2} />
          <path d={path2} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={isBatteryPresent && arePinsPlaced ? 0.7 : 0.2} />
          <path d={path3} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={arePinsPlaced && isBulbPresent ? 0.7 : 0.2} />
          <text x="300" y="220" fill="var(--accent-text)" fontSize="11" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>CONNECT WIRES</text>
        </g>
      );
    }
    return null;
  }

  if (isBroken) {
    const path2PartA = "M 192,390 C 220,405 250,405 270,395";
    const path2PartB = "M 320,380 C 360,375 410,372 450,370";
    
    return (
      <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
        <path d={path1} fill="none" stroke="var(--danger)" strokeWidth={4} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
        <path d={path1} fill="none" stroke="var(--danger)" strokeWidth={2} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
        
        <path d={path3} fill="none" stroke="#eab308" strokeWidth={4} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
        <path d={path3} fill="none" stroke="#fde047" strokeWidth={2} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
        
        <g stroke="var(--warning)" strokeWidth={4} strokeLinecap="round" fill="none">
          <path d={path2PartA} />
          <path d={path2PartB} />
        </g>
        <g stroke="var(--warning)" strokeWidth={2} strokeLinecap="round" fill="none">
          <path d={path2PartA} />
          <path d={path2PartB} />
        </g>
        
        <circle cx="295" cy="387" r="3" fill="var(--danger)" className="bulb-glowing" />
        <text x="295" y="375" fill="var(--danger)" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>WIRE CUT</text>
      </g>
    );
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <path d={path1} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />
      <path d={path1} fill="none" stroke="var(--danger)" strokeWidth={2.5} strokeLinecap="round" opacity={isBatteryPresent && isBulbPresent ? 1 : 0.4} />

      <path d={path2} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />
      <path d={path2} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />

      <path d={path3} fill="none" stroke="#9a3412" strokeWidth={5} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />
      <path d={path3} fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinecap="round" opacity={isBulbPresent && arePinsPlaced ? 1 : 0.4} />

      {isCurrentFlowing && (
        <g fill="none" strokeWidth={3} strokeLinecap="round" className="current-flow">
          <path d={path1} stroke="#67e8f9" />
          <path d={path2} stroke="#67e8f9" />
          <path d={path3} stroke="#67e8f9" />
        </g>
      )}
    </g>
  );
};

// DoubleBatteryHolderSVG
export const DoubleBatteryHolderSVG = ({ cellsCount }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <rect x={0} y={0} width={192} height={48} rx={6} fill="#374151" stroke="#1f2937" strokeWidth={2} />
      <rect x={4} y={4} width={184} height={40} rx={4} fill="#111827" />

      <path d="M 12 8 Q 18 24 12 40" fill="none" stroke="#9ca3af" strokeWidth={2} />
      <rect x={96} y={14} width={2} height={20} fill="#9ca3af" />
      <rect x={184} y={14} width={4} height={20} fill="#9ca3af" />

      {cellsCount >= 1 && (
        <g transform="translate(6, 4)">
          <BatteryBareSVG />
        </g>
      )}
      {cellsCount >= 2 && (
        <g transform="translate(98, 4)">
          <BatteryBareSVG />
        </g>
      )}

      <rect x={20} y={-4} width={10} height={12} rx={2} fill="#374151" />
      <rect x={160} y={-4} width={10} height={12} rx={2} fill="#374151" />
      <rect x={20} y={40} width={10} height={12} rx={2} fill="#374151" />
      <rect x={160} y={40} width={10} height={12} rx={2} fill="#374151" />

      <line x1={-15} y1={24} x2={0} y2={24} stroke="#9ca3af" strokeWidth={3} />
      <line x1={192} y1={24} x2={207} y2={24} stroke="#9ca3af" strokeWidth={3} />
      
      <circle cx={-15} cy={24} r={5} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx={-15} cy={24} r={2} fill="var(--warning)" />
      
      <circle cx={207} cy={24} r={5} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
      <circle cx={207} cy={24} r={2} fill="var(--warning)" />

      <text x={-15} y={14} fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>-</text>
      <text x={207} y={14} fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>+</text>
    </g>
  );
};

// LEDSVG
export const LEDSVG = ({ isOn, color = '#ef4444' }) => {
  return (
    <g style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'all' }}>
      <line x1="-15" y1="20" x2="-15" y2="45" stroke="#9ca3af" strokeWidth="3" />
      <line x1="15" y1="20" x2="15" y2="55" stroke="#9ca3af" strokeWidth={3} />
      
      <circle cx="-15" cy="45" r="4" fill="none" stroke="#9ca3af" strokeWidth={2} />
      <circle cx="15" cy="55" r="4" fill="none" stroke="#9ca3af" strokeWidth={2} />

      <rect x="-18" y="10" width="36" height="10" rx="3" fill="#6b7280" />
      <polygon points="-5,10 0,-5 5,10" fill="#4b5563" />

      {isOn && (
        <circle cx="0" cy="-5" r="30" fill={color} opacity="0.4" pointerEvents="none" className="bulb-glowing" />
      )}
      <path d="M -15,10 C -15,-20 15,-20 15,10 Z" fill={color} opacity={isOn ? 0.9 : 0.6} stroke={isOn ? '#fca5a5' : '#7f1d1d'} strokeWidth={1} />
      <path d="M -8,5 C -8,-10 0,-10 0,5 Z" fill="#ffffff" opacity="0.4" />

      <text x="-30" y="48" fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>-</text>
      <text x="30" y="58" fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle" style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}>+</text>
    </g>
  );
};
