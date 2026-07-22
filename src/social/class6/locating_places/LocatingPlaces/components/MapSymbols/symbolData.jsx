import React from 'react';

// SVG definitions for textbook symbols
export const SVGSymbols = {
  // Transport
  RailwayBroad: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="10" y="16" width="80" height="8" fill="#475569" rx="1" />
      {[20, 35, 50, 65, 80].map(x => (
        <rect key={x} x={x-2} y="12" width="4" height="16" fill="#8B4513" rx="1" />
      ))}
      <line x1="10" y1="17" x2="90" y2="17" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="10" y1="23" x2="90" y2="23" stroke="#cbd5e1" strokeWidth="1" />
    </svg>
  ),
  RailwayMetre: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="1.5" />
      {[20, 35, 50, 65, 80].map(x => (
        <line key={x} x1={x} y1="14" x2={x} y2="26" stroke="currentColor" strokeWidth="1.5" />
      ))}
    </svg>
  ),
  RailwayStation: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="3" />
      {[20, 35, 50].map(x => (
        <line key={x} x1={x} y1="12" x2={x} y2="28" stroke="currentColor" strokeWidth="2.5" />
      ))}
      <rect x="55" y="5" width="20" height="12" fill="#ef4444" />
      <text x="78" y="15" fontSize="10" fill="currentColor" fontWeight="bold">RS</text>
    </svg>
  ),
  RoadMetalled: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="10" y="14" width="80" height="12" fill="#94a3b8" />
      <line x1="10" y1="20" x2="90" y2="20" stroke="#fef08a" strokeWidth="2" strokeDasharray="6 4" />
      <line x1="10" y1="14" x2="90" y2="14" stroke="#475569" strokeWidth="1" />
      <line x1="10" y1="26" x2="90" y2="26" stroke="#475569" strokeWidth="1" />
    </svg>
  ),
  RoadUnmetalled: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="15" x2="90" y2="15" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="10" y1="25" x2="90" y2="25" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  ),

  // Boundaries
  BoundaryInternational: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="36" cy="20" r="2" fill="currentColor" />
      <line x1="42" y1="20" x2="62" y2="20" stroke="currentColor" strokeWidth="3" />
      <circle cx="68" cy="20" r="2" fill="currentColor" />
      <line x1="74" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="3" />
    </svg>
  ),
  BoundaryState: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1" />
      <circle cx="36" cy="20" r="1.5" fill="currentColor" />
      <line x1="42" y1="20" x2="62" y2="20" stroke="currentColor" strokeWidth="1" />
      <circle cx="68" cy="20" r="1.5" fill="currentColor" />
      <line x1="74" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  BoundaryDistrict: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
    </svg>
  ),

  // Water Features
  River: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M5,20 C 20,5 30,35 50,20 C 70,5 80,35 95,20" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      <path d="M5,20 C 20,5 30,35 50,20 C 70,5 80,35 95,20" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <path d="M15,25 C 25,15 35,35 50,25 C 65,15 75,35 85,25" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Well: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <circle cx="50" cy="20" r="8" fill="#3b82f6" />
    </svg>
  ),
  Tank: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M40,15 C40,5 60,5 60,15 C70,15 70,30 60,30 C60,40 40,40 40,30 C30,30 30,15 40,15 Z" fill="#3b82f6" />
    </svg>
  ),
  Canal: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M10,20 L50,20 L90,10 M50,20 L90,30" fill="none" stroke="#3b82f6" strokeWidth="2" />
    </svg>
  ),
  Bridge: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="10" y="17" width="80" height="6" fill="#94a3b8" />
      <line x1="10" y1="17" x2="90" y2="17" stroke="#475569" strokeWidth="1" />
      <line x1="10" y1="23" x2="90" y2="23" stroke="#475569" strokeWidth="1" />
      <path d="M25,23 C 25,10 45,10 45,23" fill="none" stroke="#dc2626" strokeWidth="3" />
      <path d="M55,23 C 55,10 75,10 75,23" fill="none" stroke="#dc2626" strokeWidth="3" />
      <rect x="23" y="23" width="4" height="12" fill="#64748b" />
      <rect x="43" y="23" width="4" height="12" fill="#64748b" />
      <rect x="53" y="23" width="4" height="12" fill="#64748b" />
      <rect x="73" y="23" width="4" height="12" fill="#64748b" />
    </svg>
  ),

  // Important Places
  Temple: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="40" y="25" width="20" height="10" fill="#f87171" rx="1" />
      <rect x="36" y="35" width="28" height="3" fill="#b91c1c" rx="1" />
      <path d="M40,25 L45,10 L50,10 L50,5 L50,10 L55,10 L60,25 Z" fill="#ef4444" />
      <path d="M46,35 L46,28 C46,26 54,26 54,28 L54,35 Z" fill="#7f1d1d" />
      <line x1="50" y1="10" x2="50" y2="2" stroke="#b91c1c" strokeWidth="1.5" />
      <polygon points="50,2 58,4 50,6" fill="#facc15" />
    </svg>
  ),
  Church: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="42" y="15" width="16" height="20" fill="currentColor" />
      <line x1="50" y1="15" x2="50" y2="5" stroke="currentColor" strokeWidth="2" />
      <line x1="46" y1="9" x2="54" y2="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Mosque: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="35" y="25" width="30" height="10" fill="currentColor" />
      <path d="M40,25 C40,15 60,15 60,25" fill="currentColor" />
      <rect x="32" y="10" width="3" height="25" fill="currentColor" />
      <rect x="65" y="10" width="3" height="25" fill="currentColor" />
    </svg>
  ),
  Chhatri: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="42" y="20" width="2" height="15" fill="currentColor" />
      <rect x="56" y="20" width="2" height="15" fill="currentColor" />
      <path d="M38,20 C38,10 62,10 62,20 Z" fill="currentColor" />
    </svg>
  ),
  PostOffice: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="35" y="15" width="30" height="20" fill="#dc2626" rx="2" />
      <rect x="30" y="35" width="40" height="3" fill="#991b1b" rx="1" />
      <rect x="40" y="20" width="20" height="12" fill="#ffffff" rx="1" />
      <path d="M40,20 L50,26 L60,20" fill="none" stroke="#dc2626" strokeWidth="1.5" />
      <text x="50" y="12" fontSize="10" fill="#dc2626" fontWeight="bold" textAnchor="middle">PO</text>
    </svg>
  ),
  PTO: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <text x="50" y="25" fontSize="16" fill="currentColor" fontWeight="bold" textAnchor="middle">PTO</text>
    </svg>
  ),
  PoliceStation: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="35" y="15" width="30" height="20" fill="#3b82f6" rx="2" />
      <rect x="30" y="35" width="40" height="3" fill="#1d4ed8" rx="1" />
      <path d="M45,20 L55,20 L55,26 C55,30 50,33 50,33 C50,33 45,30 45,26 Z" fill="#facc15" />
      <circle cx="50" cy="24" r="2" fill="#1d4ed8" />
      <text x="50" y="12" fontSize="10" fill="#3b82f6" fontWeight="bold" textAnchor="middle">PS</text>
    </svg>
  ),

  // Settlements & Nature
  Settlement: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M30,22 L36,16 L42,22 L42,30 L30,30 Z" fill="#ef4444" />
      <polygon points="30,22 36,16 42,22" fill="#b91c1c" />
      <rect x="34" y="24" width="4" height="6" fill="#f87171" />
      
      <path d="M45,26 L50,21 L55,26 L55,32 L45,32 Z" fill="#ef4444" />
      <polygon points="45,26 50,21 55,26" fill="#b91c1c" />
      
      <path d="M58,18 L65,11 L72,18 L72,28 L58,28 Z" fill="#ef4444" />
      <polygon points="58,18 65,11 72,18" fill="#b91c1c" />
      <rect x="63" y="22" width="4" height="6" fill="#f87171" />
    </svg>
  ),
  Graveyard: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M40,30 C40,20 50,20 50,30" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M60,30 C60,20 70,20 70,30" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Trees: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M38,35 C 38,25 40,20 40,20" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62,35 C 62,25 60,20 60,20" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="16" r="8" fill="#22c55e" />
      <circle cx="36" cy="18" r="6" fill="#16a34a" />
      <circle cx="44" cy="18" r="6" fill="#15803d" />
      <circle cx="60" cy="18" r="7" fill="#4ade80" />
      <circle cx="56" cy="20" r="5" fill="#22c55e" />
      <circle cx="64" cy="20" r="5" fill="#16a34a" />
    </svg>
  ),
  Grass: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M30,35 Q 35,20 40,35" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      <path d="M35,35 Q 37,25 40,25" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55,35 Q 60,18 65,35" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M60,35 Q 63,22 66,24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M45,35 Q 48,25 50,35" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export const SYMBOL_GROUPS = [
  {
    title: 'Transport',
    items: [
      { name: 'Railway Line (Broad Gauge)', Icon: SVGSymbols.RailwayBroad },
      { name: 'Railway Line (Metre Gauge)', Icon: SVGSymbols.RailwayMetre },
      { name: 'Railway Station', Icon: SVGSymbols.RailwayStation },
      { name: 'Road (Metalled)', Icon: SVGSymbols.RoadMetalled },
      { name: 'Road (Unmetalled)', Icon: SVGSymbols.RoadUnmetalled },
    ]
  },
  {
    title: 'Boundaries',
    items: [
      { name: 'International Boundary', Icon: SVGSymbols.BoundaryInternational },
      { name: 'State Boundary', Icon: SVGSymbols.BoundaryState },
      { name: 'District Boundary', Icon: SVGSymbols.BoundaryDistrict },
    ]
  },
  {
    title: 'Water Features',
    items: [
      { name: 'River', Icon: SVGSymbols.River },
      { name: 'Well', Icon: SVGSymbols.Well },
      { name: 'Tank', Icon: SVGSymbols.Tank },
      { name: 'Canal', Icon: SVGSymbols.Canal },
      { name: 'Bridge', Icon: SVGSymbols.Bridge },
    ]
  },
  {
    title: 'Public Places',
    items: [
      { name: 'Temple', Icon: SVGSymbols.Temple },
      { name: 'Church', Icon: SVGSymbols.Church },
      { name: 'Mosque', Icon: SVGSymbols.Mosque },
      { name: 'Chhatri', Icon: SVGSymbols.Chhatri },
      { name: 'Post Office', Icon: SVGSymbols.PostOffice },
      { name: 'Post & Telegraph Office', Icon: SVGSymbols.PTO },
      { name: 'Police Station', Icon: SVGSymbols.PoliceStation },
    ]
  },
  {
    title: 'Settlements & Nature',
    items: [
      { name: 'Settlement', Icon: SVGSymbols.Settlement },
      { name: 'Graveyard', Icon: SVGSymbols.Graveyard },
      { name: 'Trees', Icon: SVGSymbols.Trees },
      { name: 'Grass', Icon: SVGSymbols.Grass },
    ]
  }
];
