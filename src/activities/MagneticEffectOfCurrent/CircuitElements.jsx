import React from 'react';

// Cardboard switch board base
export const CardboardSwitchSVG = ({ x = 370, y = 200, width = 160, height = 210 }) => {
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
        SWITCH BOARD
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
          <circle cx={x} cy={y} r={14} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <text x={x} y={y + 4} fill="var(--accent-text)" fontSize="9" fontWeight="bold" textAnchor="middle">PIN</text>
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
export const SafetyPinSVG = ({ x, y, rotation, isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }}>
          <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
            <circle cx={0} cy={0} r={10} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1={0} y1={0} x2={0} y2={120} stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
            <rect x={-8} y={110} width={16} height={16} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeDasharray="3,3" />
          </g>
          <text x={x + 24} y={y + 60} fill="var(--accent-text)" fontSize="10" fontWeight="bold">ATTACH SAFETY PIN</text>
        </g>
      );
    }
    return null;
  }

  const strokeColor = 'var(--text-faint)';
  const claspColor = 'var(--text-faint)';

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
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

      <circle cx={0} cy={0} r={10} fill="none" stroke={`url(#pin-metal-grad)`} strokeWidth="4.5" />
      <circle cx={0} cy={0} r={5} fill="#0d131f" stroke={strokeColor} strokeWidth="1" />
      
      <line x1="-5" y1="0" x2="-8" y2="108" stroke={`url(#pin-metal-grad)`} strokeWidth="4.5" strokeLinecap="round" />
      <line x1="5" y1="0" x2="7" y2="108" stroke={`url(#pin-metal-grad)`} strokeWidth="3" />
      
      <rect x="-10" y="105" width="20" height="16" rx="4" fill={claspColor} stroke={strokeColor} strokeWidth="1.5" />
      <circle cx="0" cy="113" r="2.5" fill="#0d131f" />
    </g>
  );
};

// Battery Bare
export const BatteryBareSVG = () => {
  return (
    <g>
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
      
      <rect x={2} y={2} width={84} height={40} rx={4} fill="rgba(0,0,0,0.2)" />
      <rect x="0" y="2" width="6" height="36" rx="2" fill="url(#metal-caps-bare)" stroke="var(--text-secondary)" strokeWidth="0.5" />
      <rect x="6" y="0" width="76" height="40" rx="4" fill="url(#battery-cylinder-bare)" stroke="#b91c1c" strokeWidth="1" />
      <rect x="82" y="8" width="6" height="24" rx="2" fill="url(#metal-caps-bare)" stroke="var(--text-secondary)" strokeWidth="0.5" />
      <rect x="88" y="13" width="3" height="14" rx="1" fill="url(#metal-caps-bare)" />

      <text x="18" y="25" fill="#111827" fontSize="18" fontWeight="bold" textAnchor="middle">-</text>
      <text x="70" y="25" fill="#111827" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
      
      <rect x="29" y="6" width="30" height="28" fill="var(--text-primary)" rx="2" opacity={0.6} />
      <text x="44" y="18" fill="#fef08a" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">CELL</text>
      <text x="44" y="28" fill="var(--card-bg)" fontSize="8" fontWeight="bold" textAnchor="middle">1.5V</text>
    </g>
  );
};

// Battery Without Holder
export const BatterySVG = ({ isPlaced, isTarget, onClick }) => {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <rect x={44} y={366} width={90} height={40} rx={4} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <text x={89} y={386} fill="var(--accent-text)" fontSize="10" fontWeight="bold" textAnchor="middle">CELL</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} transform="translate(44, 366)">
      <BatteryBareSVG />
    </g>
  );
};

// Compass and Nails Cardboard
export const CompassCardboardSVG = ({ x = 120, y = 60, width = 260, height = 180 }) => {
  return (
    <g>
      <rect x={x + 4} y={y + 4} width={width} height={height} rx={12} fill="rgba(0, 0, 0, 0.4)" />
      <rect x={x} y={y} width={width} height={height} rx={12} fill="#c2a67a" stroke="#8c734b" strokeWidth={3} />
      <rect x={x + 8} y={y + 8} width={width - 16} height={height - 16} rx={8} fill="#d2b88a" stroke="#ab8e5f" strokeWidth={1} strokeDasharray="3,3" />
      <text x={x + width / 2} y={y + height - 12} fill="#705b38" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em">
        COMPASS BENCH
      </text>

      {/* Nail 1 */}
      <g transform={`translate(${x + 50}, ${y + 90})`}>
        <circle cx={0} cy={2} r={8} fill="rgba(0,0,0,0.4)" />
        <circle cx={0} cy={0} r={8} fill="#9ca3af" stroke="#4b5563" strokeWidth={1.5} />
        <circle cx={-2} cy={-2} r={3} fill="#d1d5db" opacity={0.7} />
        {/* Terminal Screw for wire connection */}
        <line x1={-15} y1={0} x2={-8} y2={0} stroke="#9ca3af" strokeWidth={2} />
        <circle cx={-15} cy={0} r={4} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
        <circle cx={-15} cy={0} r={1.5} fill="var(--warning)" />
      </g>

      {/* Nail 2 */}
      <g transform={`translate(${x + 210}, ${y + 90})`}>
        <circle cx={0} cy={2} r={8} fill="rgba(0,0,0,0.4)" />
        <circle cx={0} cy={0} r={8} fill="#9ca3af" stroke="#4b5563" strokeWidth={1.5} />
        <circle cx={-2} cy={-2} r={3} fill="#d1d5db" opacity={0.7} />
        {/* Terminal Screw for wire connection */}
        <line x1={8} y1={0} x2={15} y2={0} stroke="#9ca3af" strokeWidth={2} />
        <circle cx={15} cy={0} r={4} fill="var(--warning)" stroke="#b45309" strokeWidth={1} />
        <circle cx={15} cy={0} r={1.5} fill="var(--warning)" />
      </g>
    </g>
  );
};

// Magnetic Compass
export const CompassSVG = ({ x = 250, y = 150, isPlaced, isTarget, onClick, deflection = 0 }) => {

  if (!isPlaced) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <circle cx={x} cy={y} r={35} fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="3,3" />
          <text x={x} y={y + 4} fill="var(--accent-text)" fontSize="9" fontWeight="bold" textAnchor="middle">COMPASS</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} transform={`translate(${x}, ${y})`}>
      <defs>
        <radialGradient id="compass-glass" cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
        </radialGradient>
      </defs>
      
      {/* Shadow */}
      <circle cx={2} cy={2} r={35} fill="rgba(0,0,0,0.3)" />
      
      {/* Outer casing */}
      <circle cx={0} cy={0} r={35} fill="#1f2937" stroke="#4b5563" strokeWidth={2} />
      
      {/* Inner dial */}
      <circle cx={0} cy={0} r={31} fill="#f9fafb" />
      
      {/* Markings */}
      <text x={0} y={-21} fill="#111827" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
      <text x={0} y={27} fill="#111827" fontSize="10" fontWeight="bold" textAnchor="middle">S</text>
      <text x={24} y={3} fill="#111827" fontSize="10" fontWeight="bold" textAnchor="middle">E</text>
      <text x={-24} y={3} fill="#111827" fontSize="10" fontWeight="bold" textAnchor="middle">W</text>
      
      {/* Crosshairs */}
      <line x1={0} y1={-18} x2={0} y2={18} stroke="#d1d5db" strokeWidth={1} />
      <line x1={-18} y1={0} x2={18} y2={0} stroke="#d1d5db" strokeWidth={1} />
      
      {/* Compass Needle (rotated based on deflection) */}
      <g style={{ transform: `rotate(${deflection}deg)`, transformOrigin: '0px 0px', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        {/* Shadow */}
        <polygon points="-3,-3 0,-25 3,-3 0,25" fill="rgba(0,0,0,0.3)" />
        {/* Red North pointer */}
        <polygon points="-3,0 0,-25 3,0" fill="#ef4444" />
        {/* Blue/White South pointer */}
        <polygon points="-3,0 0,25 3,0" fill="#3b82f6" />
        {/* Center pivot */}
        <circle cx={0} cy={0} r={2.5} fill="#fbbf24" stroke="#b45309" strokeWidth={1} />
      </g>
      
      {/* Glass dome */}
      <circle cx={0} cy={0} r={33} fill="url(#compass-glass)" pointerEvents="none" />
    </g>
  );
};

// Connecting Wires for the specific Oersted setup
export const WiresSVG = ({ 
  isWireConnected, 
  isBatteryPresent, 
  isCompassPlaced, 
  arePinsPlaced,
  isCurrentFlowing, 
  isTarget = false, 
  onClick 
}) => {
  // Coordinates mapping
  const p_batteryNeg = { x: 44, y: 386 };
  const p_batteryPos = { x: 135, y: 386 };
  const p_pin1 = { x: 450, y: 250 };
  const p_pin2 = { x: 450, y: 370 };
  const p_nail1 = { x: 155, y: 150 };
  const p_nail2 = { x: 345, y: 150 };

  // Note: Battery + connects to Switch (Pin 2). Switch (Pin 1) connects to Nail 2. Nail 1 connects to Battery -.
  // And a straight wire sits between Nail 1 and Nail 2 (above the compass).

  // Path 1: Battery Positive -> Pin 2 (Yellow)
  const path1 = `M ${p_batteryPos.x},${p_batteryPos.y} C 200,420 380,420 ${p_pin2.x},${p_pin2.y}`;
  
  // Path 2: Pin 1 -> Nail 2 (Red/Orange)
  const path2 = `M ${p_pin1.x},${p_pin1.y} C 450,150 400,100 ${p_nail2.x},${p_nail2.y}`;

  // Path 3: Nail 1 -> Battery Negative (Black/Dark)
  const path3 = `M ${p_nail1.x},${p_nail1.y} C 50,100 29,200 ${p_batteryNeg.x},${p_batteryNeg.y}`;

  // Path 4: Stretched wire over the compass (between Nail 1 and Nail 2) (Copper/Thick)
  const path4 = `M ${p_nail1.x + 15},${p_nail1.y} L ${p_nail2.x - 15},${p_nail2.y}`;

  if (!isWireConnected) {
    if (isTarget) {
      return (
        <g onClick={onClick} style={{ cursor: 'pointer' }} className="pulse-target">
          <path d={path1} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={isBatteryPresent && arePinsPlaced ? 0.7 : 0.2} />
          <path d={path2} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={arePinsPlaced && isCompassPlaced ? 0.7 : 0.2} />
          <path d={path3} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={isCompassPlaced && isBatteryPresent ? 0.7 : 0.2} />
          <path d={path4} fill="none" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4,4" opacity={isCompassPlaced ? 0.7 : 0.2} />
          <text x="300" y="280" fill="var(--accent-text)" fontSize="11" fontWeight="bold" textAnchor="middle">CONNECT WIRES</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Path 1: Battery+ to Pin2 */}
      <path d={path1} fill="none" stroke="#ca8a04" strokeWidth={5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />
      <path d={path1} fill="none" stroke="#fde047" strokeWidth={2.5} strokeLinecap="round" opacity={isBatteryPresent && arePinsPlaced ? 1 : 0.4} />

      {/* Path 2: Pin1 to Nail2 */}
      <path d={path2} fill="none" stroke="#b91c1c" strokeWidth={5} strokeLinecap="round" opacity={isCompassPlaced && arePinsPlaced ? 1 : 0.4} />
      <path d={path2} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" opacity={isCompassPlaced && arePinsPlaced ? 1 : 0.4} />

      {/* Path 3: Nail1 to Battery- */}
      <path d={path3} fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" opacity={isCompassPlaced && isBatteryPresent ? 1 : 0.4} />
      <path d={path3} fill="none" stroke="#6b7280" strokeWidth={2.5} strokeLinecap="round" opacity={isCompassPlaced && isBatteryPresent ? 1 : 0.4} />

      {/* Path 4: Thick straight wire over compass */}
      <path d={path4} fill="none" stroke="#b45309" strokeWidth={6} strokeLinecap="square" opacity={isCompassPlaced ? 1 : 0.4} />
      <path d={path4} fill="none" stroke="#f59e0b" strokeWidth={3} strokeLinecap="square" opacity={isCompassPlaced ? 1 : 0.4} />

      {/* Current Flowing Overlay */}
      {isCurrentFlowing && (
        <g fill="none" strokeWidth={3} strokeLinecap="round" className="current-flow">
          {/* Current moving: Battery+ -> Pin2 -> Pin1 -> Nail2 -> Nail1 -> Battery- */}
          <path d={path1} stroke="#67e8f9" />
          <path d={path2} stroke="#67e8f9" />
          <path d={`M ${p_nail2.x - 15},${p_nail2.y} L ${p_nail1.x + 15},${p_nail1.y}`} stroke="#67e8f9" />
          <path d={path3} stroke="#67e8f9" />
        </g>
      )}
    </g>
  );
};
