import React from 'react';

/**
 * BASE WORKSPACE BOARD
 * Shared canvas background coordinates. Standard size is 600x480.
 */
export function BoardBaseSVG() {
  return (
    <g id="board-base">
      {/* Wooden/Plastic Board Border */}
      <rect x={10} y={10} width={580} height={460} rx={16} fill="#0d1527" stroke="var(--text-primary)" strokeWidth={4} />
      {/* Inner panel area */}
      <rect x={20} y={20} width={560} height={440} rx={12} fill="#111a2e" />
      {/* Decorative corner rivets */}
      <circle cx={35} cy={35} r={5} fill="var(--text-secondary)" />
      <circle cx={565} cy={35} r={5} fill="var(--text-secondary)" />
      <circle cx={35} cy={445} r={5} fill="var(--text-secondary)" />
      <circle cx={565} cy={445} r={5} fill="var(--text-secondary)" />
      {/* Label Text */}
      <text x={300} y={40} fill="var(--text-secondary)" fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">
        VIRTUAL TESTING ENVIRONMENT
      </text>
    </g>
  );
}

/**
 * GENERIC COMPONENT 1: CELL/BATTERY
 * Renders at fixed coordinates (e.g. 150, 390)
 */
export function GenericCellSVG({ isPlaced, isTarget, onClick }) {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g id="cell-target" onClick={onClick} style={{ cursor: 'pointer' }}>
          <rect x={70} y={350} width={160} height={80} rx={8} fill="rgba(99, 102, 241, 0.05)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6,4" className="pulse-target" />
          <text x={150} y={395} fill="var(--accent-text)" fontSize="11" textAnchor="middle" fontWeight="bold">
            + Place Power Cell
          </text>
        </g>
      );
    }
    return null;
  }

  return (
    <g id="power-cell" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Battery body */}
      <rect x={80} y={360} width={130} height={60} rx={6} fill="var(--text-primary)" stroke="var(--text-faint)" strokeWidth={2} />
      {/* positive terminal cap */}
      <rect x={210} y={375} width={10} height={30} rx={3} fill="var(--warning)" />
      {/* negative terminal label */}
      <text x={95} y={395} fill="var(--danger)" fontSize="16" fontWeight="bold" textAnchor="middle">-</text>
      {/* positive terminal label */}
      <text x={195} y={395} fill="var(--success)" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>
      {/* Body label */}
      <text x={145} y={395} fill="var(--text-faint)" fontSize="11" fontWeight="bold" textAnchor="middle">1.5V CELL</text>
    </g>
  );
}

/**
 * GENERIC COMPONENT 2: TEST LOAD (e.g., Bulb, Resistor, Motor)
 * Renders at fixed coordinates (e.g. 300, 90)
 */
export function GenericLoadSVG({ isPlaced, isTarget, isActive, onClick }) {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g id="load-target" onClick={onClick} style={{ cursor: 'pointer' }}>
          <circle cx={300} cy={100} r={45} fill="rgba(99, 102, 241, 0.05)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6,4" className="pulse-target" />
          <text x={300} y={104} fill="var(--accent-text)" fontSize="11" textAnchor="middle" fontWeight="bold">
            + Place Load
          </text>
        </g>
      );
    }
    return null;
  }

  return (
    <g id="test-load" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Base holder */}
      <rect x={250} y={120} width={100} height={25} rx={4} fill="var(--text-secondary)" stroke="var(--text-secondary)" strokeWidth={1} />
      {/* Glass Bulb Sphere */}
      <circle cx={300} cy={85} r={35} fill={isActive ? 'rgba(253, 224, 71, 0.2)' : 'var(--surface)'} stroke={isActive ? 'var(--warning)' : 'var(--text-muted)'} strokeWidth={2} className={isActive ? 'bulb-glowing' : ''} />
      {/* Filament lines */}
      <path d="M 285,95 L 295,75 L 305,75 L 315,95" fill="none" stroke={isActive ? 'var(--warning)' : 'var(--text-secondary)'} strokeWidth={2} />
      {/* Rays */}
      {isActive && (
        <g stroke="var(--warning)" strokeWidth={2} strokeLinecap="round">
          <line x1={300} y1={40} x2={300} y2={25} />
          <line x1={260} y1={65} x2={245} y2={55} />
          <line x1={340} y1={65} x2={355} y2={55} />
        </g>
      )}
    </g>
  );
}

/**
 * GENERIC WIRES WITH CURRENT FLOW ANIMATION
 * Wires connecting Bulb -> Battery -> Test point.
 */
export function GenericWiresSVG({ isPlaced, isActive, isBroken, onClick }) {
  if (!isPlaced) return null;

  // Render broken wire representation if cut
  if (isBroken) {
    return (
      <g id="broken-wires" onClick={onClick} style={{ cursor: 'pointer' }}>
        {/* Left Segment */}
        <path d="M 250,132 C 160,132 80,240 100,340" fill="none" stroke="var(--text-muted)" strokeWidth={4} />
        {/* Right Segment - Cut Gap */}
        <path d="M 200,390 C 250,420 380,410 440,360" fill="none" stroke="var(--text-muted)" strokeWidth={4} />
        <circle cx={440} cy={360} r={4} fill="var(--danger)" />
        <circle cx={447} cy={353} r={4} fill="var(--danger)" />
      </g>
    );
  }

  // Path equations
  const wire1 = "M 250,132 C 160,132 80,240 100,390";
  const wire2 = "M 210,390 C 270,420 380,410 450,370";
  const wire3 = "M 450,250 C 450,150 400,132 350,132";

  return (
    <g id="connecting-wires" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Background core wires */}
      <path d={wire1} fill="none" stroke="#b91c1c" strokeWidth={4} strokeLinecap="round" />
      <path d={wire2} fill="none" stroke="#1e3a8a" strokeWidth={4} strokeLinecap="round" />
      <path d={wire3} fill="none" stroke="var(--text-secondary)" strokeWidth={4} strokeLinecap="round" />

      {/* Charge particles moving on active circuit */}
      {isActive && (
        <g fill="none" strokeWidth={2} strokeLinecap="round">
          <path d={wire1} stroke="var(--danger)" className="current-flow" />
          <path d={wire2} stroke="#60a5fa" className="current-flow" />
          <path d={wire3} stroke="var(--text-faint)" className="current-flow" />
        </g>
      )}
    </g>
  );
}

/**
 * CONTACT POINTS (e.g. Nails, Terminals)
 */
export function GenericTerminalSVG({ x, y, label, isPlaced, isTarget, onClick }) {
  if (!isPlaced) {
    if (isTarget) {
      return (
        <g id={`terminal-target-${x}`} onClick={onClick} style={{ cursor: 'pointer' }}>
          <circle cx={x} cy={y} r={16} fill="rgba(99, 102, 241, 0.05)" stroke="var(--accent)" strokeWidth={2} strokeDasharray="6,4" className="pulse-target" />
          <text x={x} y={y + 5} fill="var(--accent-text)" fontSize="9" textAnchor="middle" fontWeight="bold">Pin</text>
        </g>
      );
    }
    return null;
  }

  return (
    <g id={`terminal-${x}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {/* Metal Base cap */}
      <circle cx={x} cy={y} r={12} fill="url(#metal-gradient-gray)" stroke="var(--text-secondary)" strokeWidth={1} />
      {/* Center Pin pin head */}
      <circle cx={x} cy={y} r={6} fill="var(--text-faint)" stroke="var(--text-faint)" strokeWidth={1} />
      <circle cx={x - 2} cy={y - 2} r={2} fill="var(--card-bg)" opacity={0.5} />
      
      {/* Helper label */}
      <text x={x} y={y + 25} fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontWeight="bold">{label}</text>

      {/* Radial Gradient helper definitions */}
      <defs>
        <radialGradient id="metal-gradient-gray" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--border)" />
          <stop offset="70%" stopColor="var(--text-secondary)" />
          <stop offset="100%" stopColor="var(--text-secondary)" />
        </radialGradient>
      </defs>
    </g>
  );
}
