import React from 'react';

// SVG definitions for textbook symbols
export const SVGSymbols = {
  // Transport
  RailwayBroad: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="4" />
      {[20, 35, 50, 65, 80].map(x => (
        <line key={x} x1={x} y1="12" x2={x} y2="28" stroke="currentColor" strokeWidth="3" />
      ))}
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
      <line x1="10" y1="15" x2="90" y2="15" stroke="#ef4444" strokeWidth="2" />
      <line x1="10" y1="25" x2="90" y2="25" stroke="#ef4444" strokeWidth="2" />
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
      <path d="M10,20 Q25,5 40,20 T70,20 T90,20" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <path d="M10,25 Q25,10 40,25 T70,25 T90,25" fill="none" stroke="#3b82f6" strokeWidth="3" />
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
      <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="2" />
      <path d="M40,10 C45,10 45,30 40,30 M60,10 C55,10 55,30 60,30" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),

  // Important Places
  Temple: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="40" y="20" width="20" height="15" fill="#ef4444" />
      <polygon points="40,20 60,20 50,5" fill="#ef4444" />
      <line x1="50" y1="5" x2="50" y2="0" stroke="#ef4444" strokeWidth="1.5" />
      <polygon points="50,0 55,2 50,4" fill="#ef4444" />
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
      <text x="50" y="25" fontSize="16" fill="currentColor" fontWeight="bold" textAnchor="middle">PO</text>
    </svg>
  ),
  PTO: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <text x="50" y="25" fontSize="16" fill="currentColor" fontWeight="bold" textAnchor="middle">PTO</text>
    </svg>
  ),
  PoliceStation: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <text x="50" y="25" fontSize="16" fill="currentColor" fontWeight="bold" textAnchor="middle">PS</text>
    </svg>
  ),

  // Settlements & Nature
  Settlement: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <rect x="30" y="15" width="10" height="10" fill="#ef4444" />
      <rect x="42" y="22" width="10" height="10" fill="#ef4444" />
      <rect x="54" y="10" width="10" height="10" fill="#ef4444" />
      <rect x="62" y="25" width="10" height="10" fill="#ef4444" />
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
      <line x1="40" y1="35" x2="40" y2="25" stroke="currentColor" strokeWidth="2" />
      <circle cx="40" cy="20" r="6" fill="#10b981" />
      <line x1="60" y1="35" x2="60" y2="25" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="18" r="7" fill="#10b981" />
    </svg>
  ),
  Grass: () => (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <path d="M45,30 Q50,20 50,30 Q50,15 50,30 Q50,20 55,30" fill="none" stroke="#10b981" strokeWidth="2" />
      <path d="M65,30 Q70,20 70,30 Q70,15 70,30 Q70,20 75,30" fill="none" stroke="#10b981" strokeWidth="2" />
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
