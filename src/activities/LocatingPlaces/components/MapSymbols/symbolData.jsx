import React from 'react';

// Common SVG Wrapper to ensure consistency
const SvgIcon = ({ children, viewBox = '0 0 100 54' }) => (
  <svg viewBox={viewBox} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', overflow: 'visible' }}>
    {children}
  </svg>
);

export function SymbolDisplay({ Icon, width = 120, height = 52 }) {
  if (!Icon) return null;
  return (
    <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Icon />
      </div>
    </div>
  );
}

export const SVGSymbols = {
  // Transport
  RailwayLine: () => (
    <SvgIcon>
      <line x1="10" y1="18" x2="90" y2="18" stroke="#555555" strokeWidth="1.5" />
      <line x1="10" y1="22" x2="90" y2="22" stroke="#555555" strokeWidth="1.5" />
      <path d="M 20 15 L 20 25 M 30 15 L 30 25 M 40 15 L 40 25 M 50 15 L 50 25 M 60 15 L 60 25 M 70 15 L 70 25 M 80 15 L 80 25" stroke="#8D6E63" strokeWidth="2" />
    </SvgIcon>
  ),
  Road: () => (
    <SvgIcon>
      <line x1="10" y1="20" x2="90" y2="20" stroke="#9E9E9E" strokeWidth="6" />
      <line x1="10" y1="20" x2="90" y2="20" stroke="#FDD835" strokeWidth="1.5" strokeDasharray="6 4" />
    </SvgIcon>
  ),
  NationalHighway: () => (
    <SvgIcon>
      <line x1="10" y1="18" x2="90" y2="18" stroke="#9E9E9E" strokeWidth="2.5" />
      <line x1="10" y1="22" x2="90" y2="22" stroke="#9E9E9E" strokeWidth="2.5" />
    </SvgIcon>
  ),
  Bridge: () => (
    <SvgIcon viewBox="0 0 100 54">
      <path d="M 50 8 L 50 38" stroke="#2F80ED" strokeWidth="3" />
      <line x1="10" y1="20" x2="90" y2="20" stroke="#9E9E9E" strokeWidth="2" />
      <line x1="10" y1="24" x2="90" y2="24" stroke="#9E9E9E" strokeWidth="2" />
      <path d="M 35 14 L 45 20 L 55 20 L 65 14" fill="none" stroke="#555555" strokeWidth="1.5" />
      <path d="M 35 30 L 45 24 L 55 24 L 65 30" fill="none" stroke="#555555" strokeWidth="1.5" />
    </SvgIcon>
  ),
  Airport: () => (
    <SvgIcon>
      <g transform="translate(50 20) scale(0.7) translate(-50 -20)">
        <path d="M50,12 L50,28 M40,18 L60,18 M46,25 L54,25" stroke="#424242" strokeWidth="2" fill="none" />
        <polygon points="50,10 47,15 53,15" fill="#424242" />
      </g>
    </SvgIcon>
  ),
  BusStand: () => (
    <SvgIcon>
      <rect x="42" y="12" width="16" height="16" rx="2" fill="none" stroke="#424242" strokeWidth="1.5" />
      <text x="50" y="24" fontSize="14" fill="#424242" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">B</text>
    </SvgIcon>
  ),

  // Water Features
  River: () => (
    <SvgIcon>
      <path d="M 10 25 Q 30 10 50 25 T 90 25" fill="none" stroke="#2F80ED" strokeWidth="3" strokeLinecap="round" />
    </SvgIcon>
  ),
  Lake: () => (
    <SvgIcon>
      <path d="M40,15 C20,15 30,30 50,30 C70,30 80,15 60,15 Z" fill="#2F80ED" stroke="#1B5EAB" strokeWidth="1.5" />
    </SvgIcon>
  ),
  Canal: () => (
    <SvgIcon>
      <line x1="10" y1="20" x2="90" y2="20" stroke="#2F80ED" strokeWidth="2" />
    </SvgIcon>
  ),

  // Important Places
  Temple: () => (
    <SvgIcon>
      <g transform="translate(50 24) scale(1.2) translate(-50 -20)">
        <rect x="42" y="22" width="16" height="12" fill="#D32F2F" />
        <polygon points="42,22 50,10 58,22" fill="#D32F2F" />
        <line x1="50" y1="10" x2="50" y2="4" stroke="#D32F2F" strokeWidth="1.5" />
        <polygon points="50,4 56,6 50,8" fill="#F9A825" />
      </g>
    </SvgIcon>
  ),
  PostOffice: () => (
    <SvgIcon>
      <g transform="translate(50 24) scale(1.2) translate(-50 -20)">
        <rect x="40" y="10" width="20" height="20" rx="2" fill="#C62828" />
        <path d="M44,14 L50,18 L56,14" fill="none" stroke="#FFF" strokeWidth="1" />
        <text x="50" y="27" fontSize="14" fill="#FFF" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P.O</text>
      </g>
    </SvgIcon>
  ),
  PoliceStation: () => (
    <SvgIcon>
      <g transform="translate(50 24) scale(1.2) translate(-50 -20)">
        <rect x="40" y="10" width="20" height="20" rx="2" fill="#1565C0" />
        <path d="M46,14 L54,14 L54,17 C54,19 50,21 50,21 C50,21 46,19 46,17 Z" fill="#FFF" />
        <text x="50" y="27" fontSize="14" fill="#FFF" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">P.S</text>
      </g>
    </SvgIcon>
  ),
  Hospital: () => (
    <SvgIcon>
      <g transform="translate(50 24) scale(1.2) translate(-50 -20)">
        <path d="M45,12 L55,12 L55,17 L60,17 L60,23 L55,23 L55,28 L45,28 L45,23 L40,23 L40,17 L45,17 Z" fill="#E53935" />
      </g>
    </SvgIcon>
  ),
  School: () => (
    <SvgIcon>
      <g transform="translate(50 24) scale(1.2) translate(-50 -20)">
        <rect x="40" y="10" width="20" height="20" rx="2" fill="#F9A825" />
        <text x="50" y="25" fontSize="14" fill="#FFF" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">S</text>
      </g>
    </SvgIcon>
  ),

  // Boundaries
  BoundaryInternational: () => (
    <SvgIcon>
      <line x1="10" y1="20" x2="90" y2="20" stroke="#424242" strokeWidth="2" strokeDasharray="12 4" />
    </SvgIcon>
  ),
  BoundaryState: () => (
    <SvgIcon>
      <line x1="10" y1="20" x2="90" y2="20" stroke="#424242" strokeWidth="1.5" strokeDasharray="12 4 2 4" />
    </SvgIcon>
  ),

  // Nature / Landscape
  Trees: () => (
    <SvgIcon>
      <circle cx="50" cy="14" r="7" fill="#43A047" stroke="#2E7D32" strokeWidth="1.5" />
      <line x1="50" y1="21" x2="50" y2="32" stroke="#6D4C41" strokeWidth="2" />
    </SvgIcon>
  ),
  Grass: () => (
    <SvgIcon>
      <path d="M 20 15 Q 23 23 25 15 M 35 15 Q 38 23 40 15 M 50 15 Q 53 23 55 15 M 65 15 Q 68 23 70 15 M 80 15 Q 83 23 85 15" fill="none" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 27 30 Q 30 38 32 30 M 42 30 Q 45 38 47 30 M 57 30 Q 60 38 62 30 M 72 30 Q 75 38 77 30" fill="none" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" />
    </SvgIcon>
  ),
  Forest: () => (
    <SvgIcon viewBox="0 0 100 54">
      {[[30, 12], [50, 12], [70, 12], [40, 22], [60, 22], [30, 32], [50, 32], [70, 32]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#43A047" stroke="#2E7D32" strokeWidth="1" />
          <line x1={x} y1={y + 5} x2={x} y2={y + 11} stroke="#6D4C41" strokeWidth="1.5" />
        </g>
      ))}
    </SvgIcon>
  ),
  Settlement: () => (
    <SvgIcon>
      <rect x="35" y="12" width="8" height="8" rx="1" fill="#C62828" />
      <rect x="47" y="12" width="8" height="8" rx="1" fill="#C62828" />
      <rect x="59" y="12" width="8" height="8" rx="1" fill="#C62828" />
      <rect x="41" y="24" width="8" height="8" rx="1" fill="#C62828" />
      <rect x="53" y="24" width="8" height="8" rx="1" fill="#C62828" />
    </SvgIcon>
  ),
  Mountain: () => (
    <SvgIcon>
      <polygon points="25,12 15,28 35,28" fill="#A86A2C" stroke="#6D4C41" strokeWidth="1.5" />
      <polygon points="50,12 40,28 60,28" fill="#A86A2C" stroke="#6D4C41" strokeWidth="1.5" />
      <polygon points="75,12 65,28 85,28" fill="#A86A2C" stroke="#6D4C41" strokeWidth="1.5" />
    </SvgIcon>
  ),
  Peak: () => (
    <SvgIcon>
      <polygon points="50,10 38,30 62,30" fill="#A86A2C" stroke="#6D4C41" strokeWidth="1.5" />
      <circle cx="50" cy="16" r="2" fill="#000" />
    </SvgIcon>
  ),
};

export const SYMBOL_GROUPS = [
  {
    title: 'Transport',
    items: [
      { id: 'railway', name: 'Railway Line', Icon: SVGSymbols.RailwayLine, desc: 'Used to show railway tracks for trains.' },
      { id: 'road', name: 'Road', Icon: SVGSymbols.Road, desc: 'Represents a standard metalled road.' },
      { id: 'nh', name: 'National Highway', Icon: SVGSymbols.NationalHighway, desc: 'Major roads connecting big cities.' },
      { id: 'airport', name: 'Airport', Icon: SVGSymbols.Airport, desc: 'Shows where an airport is located.' },
      { id: 'busstand', name: 'Bus Stand', Icon: SVGSymbols.BusStand, desc: 'A major bus terminal or stop.' },
    ]
  },
  {
    title: 'Water Features',
    items: [
      { id: 'river', name: 'River', Icon: SVGSymbols.River, desc: 'Shows natural flowing water.' },
      { id: 'lake', name: 'Lake', Icon: SVGSymbols.Lake, desc: 'A large body of still water.' },
      { id: 'canal', name: 'Canal', Icon: SVGSymbols.Canal, desc: 'A man-made water channel.' },
      { id: 'bridge', name: 'Bridge', Icon: SVGSymbols.Bridge, desc: 'A road or track crossing water.' },
    ]
  },
  {
    title: 'Public Places',
    items: [
      { id: 'temple', name: 'Temple', Icon: SVGSymbols.Temple, desc: 'A place of worship.' },
      { id: 'hospital', name: 'Hospital', Icon: SVGSymbols.Hospital, desc: 'A medical facility.' },
      { id: 'school', name: 'School', Icon: SVGSymbols.School, desc: 'An educational institution.' },
      { id: 'postoffice', name: 'Post Office', Icon: SVGSymbols.PostOffice, desc: 'A facility for sending mail.' },
      { id: 'police', name: 'Police Station', Icon: SVGSymbols.PoliceStation, desc: 'A local police headquarters.' },
    ]
  },
  {
    title: 'Nature & Settlements',
    items: [
      { id: 'settlement', name: 'Settlement', Icon: SVGSymbols.Settlement, desc: 'A village, town or city.' },
      { id: 'forest', name: 'Forest', Icon: SVGSymbols.Forest, desc: 'A large area covered with trees.' },
      { id: 'trees', name: 'Trees', Icon: SVGSymbols.Trees, desc: 'Scattered trees or a small grove.' },
      { id: 'grass', name: 'Grass', Icon: SVGSymbols.Grass, desc: 'Grasslands or pastures.' },
      { id: 'mountain', name: 'Mountain', Icon: SVGSymbols.Mountain, desc: 'A large natural elevation of earth.' },
      { id: 'peak', name: 'Peak', Icon: SVGSymbols.Peak, desc: 'The pointed top of a mountain.' },
    ]
  },
  {
    title: 'Boundaries',
    items: [
      { id: 'int_boundary', name: 'International Boundary', Icon: SVGSymbols.BoundaryInternational, desc: 'Border between two countries.' },
      { id: 'state_boundary', name: 'State Boundary', Icon: SVGSymbols.BoundaryState, desc: 'Border between states.' },
    ]
  }
];

export const ALL_SYMBOLS = SYMBOL_GROUPS.flatMap(group => group.items);
