import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../../../ThemeContext';
import darkForestBg from '../../../../assets/dark_forest_bg.jpg';

// Excavation view (plant in pot / before digging)
import mustard1Img from '../../../../assets/mustard_1.png';
import grass1Img from '../../../../assets/grass_1.png';
import hib1Img from '../../../../assets/hib_1.png';
import marigold1Img from '../../../../assets/marigold_1.png';
import wheat1Img from '../../../../assets/wheat_1.png';

// Fully dug state
import mustard2Img from '../../../../assets/mustard_2.png';
import grass2Img from '../../../../assets/grass_2.png';
import hib2Img from '../../../../assets/hib_2.png';
import marigold2Img from '../../../../assets/marigold_2.png';
import wheat2Img from '../../../../assets/wheat_2.png';

// Root close-up (washed)
import tap1Img from '../../../../assets/tap_1.png';
import fib1Img from '../../../../assets/fib_1.png';

const PLANT_IMG_1 = { mustard: mustard1Img, grass: grass1Img, hibiscus: hib1Img, marigold: marigold1Img, wheat: wheat1Img };
const PLANT_IMG_2 = { mustard: mustard2Img, grass: grass2Img, hibiscus: hib2Img, marigold: marigold2Img, wheat: wheat2Img };
const ROOT_CLOSE_IMG = { taproot: tap1Img, fibrous: fib1Img };

const PLANTS = [
  { id: 'mustard', name: 'Mustard', emoji: '🌼', rootType: 'taproot', rootColor: '#b45309', potColor: '#b45309',
    desc: 'One thick main root (taproot) going deep into the soil, with many small side roots branching from it.',
    stemColor: '#16a34a', leaves: 3 },
  { id: 'grass', name: 'Common Grass', emoji: '🌾', rootType: 'fibrous', rootColor: '#4d7c0f', potColor: '#65a30d',
    desc: 'Many thin, hair-like roots of roughly equal thickness arising from the base — called fibrous roots.',
    stemColor: '#22c55e', leaves: 5 },
  { id: 'hibiscus', name: 'Hibiscus', emoji: '🌺', rootType: 'taproot', rootColor: '#92400e', potColor: '#c2410c',
    desc: 'A clear taproot system — one dominant root going deep with many lateral (side) roots.',
    stemColor: '#15803d', leaves: 4 },
  { id: 'wheat', name: 'Wheat', emoji: '🌾', rootType: 'fibrous', rootColor: '#78350f', potColor: '#d97706',
    desc: 'Dense fibrous root system — a bunch of equally thin roots spreading out from the stem base.',
    stemColor: '#ca8a04', leaves: 4 },
  { id: 'marigold', name: 'Marigold', emoji: '🌼', rootType: 'taproot', rootColor: '#9a3412', potColor: '#ea580c',
    desc: 'Taproot system with one main root and fine lateral roots — easily visible when the plant is dug up.',
    stemColor: '#15803d', leaves: 3 },
];

const ROOT_LABELS = [
  { id: 'taproot', label: 'Taproot System', icon: '🥕', color: '#f59e0b', desc: 'One thick main root + side branches' },
  { id: 'fibrous', label: 'Fibrous Root System', icon: '🌾', color: '#84cc16', desc: 'Many thin, equal roots from base' },
];

// Custom Shoot Systems (Above ground parts)
const MustardShootSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 110">
    <path d="M50 110 Q50 60 48 30 T54 5" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 65 Q30 50 25 45" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 50 Q70 42 75 35" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 75 C10 70 8 50 25 45 C30 50 32 60 30 75 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
    <path d="M30 75 Q20 58 25 45" fill="none" stroke="#4ade80" strokeWidth="0.8" opacity="0.6" />
    <path d="M70 75 C90 70 92 50 75 45 C70 50 68 60 70 75 Z" fill="#15803d" stroke="#14532d" strokeWidth="1" />
    <path d="M70 75 Q80 58 75 45" fill="none" stroke="#4ade80" strokeWidth="0.8" opacity="0.6" />
    <path d="M35 55 C18 52 20 38 32 35 C35 40 37 48 35 55 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
    <path d="M65 55 C82 52 80 38 68 35 C65 40 63 48 65 55 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
    <circle cx="54" cy="5" r="4" fill="#eab308" />
    <circle cx="50" cy="2" r="3" fill="#fbbf24" />
    <circle cx="58" cy="8" r="3" fill="#fef08a" />
    <circle cx="48" cy="8" r="3" fill="#fef08a" />
    <circle cx="25" cy="45" r="3" fill="#eab308" />
    <circle cx="22" cy="42" r="2.5" fill="#fef08a" />
    <circle cx="75" cy="35" r="3" fill="#eab308" />
    <circle cx="78" cy="32" r="2.5" fill="#fef08a" />
  </svg>
);

const GrassShootSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 110">
    <defs>
      <linearGradient id="grassGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="100%" stopColor="#4ade80" />
      </linearGradient>
      <linearGradient id="grassGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#166534" />
        <stop offset="100%" stopColor="#22c55e" />
      </linearGradient>
    </defs>
    <path d="M50 110 Q35 60 20 20 Q35 60 50 110" fill="url(#grassGrad1)" />
    <path d="M50 110 Q65 60 80 20 Q65 60 50 110" fill="url(#grassGrad1)" />
    <path d="M48 110 Q25 70 10 40 Q30 75 48 110" fill="url(#grassGrad2)" />
    <path d="M52 110 Q75 70 90 40 Q70 75 52 110" fill="url(#grassGrad2)" />
    <path d="M50 110 Q50 50 45 10 Q52 50 50 110" fill="url(#grassGrad1)" />
    <path d="M49 110 Q40 60 30 30 Q44 65 49 110" fill="url(#grassGrad2)" />
    <path d="M51 110 Q60 60 70 30 Q56 65 51 110" fill="url(#grassGrad2)" />
  </svg>
);

const HibiscusShootSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 110">
    <path d="M50 110 Q50 65 52 40" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    <path d="M52 40 Q35 25 30 20" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M52 40 Q65 28 72 25" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35 75 C20 70 18 55 32 50 C38 52 40 62 35 75 Z" fill="#14532d" stroke="#166534" strokeWidth="1" />
    <path d="M65 75 C80 70 82 55 68 50 C62 52 60 62 65 75 Z" fill="#14532d" stroke="#166534" strokeWidth="1" />
    <path d="M28 42 C18 38 16 28 26 25 C30 27 32 34 28 42 Z" fill="#166534" />
    <path d="M72 42 C82 38 84 28 74 25 C70 27 68 34 72 42 Z" fill="#166534" />
    <g transform="translate(52, 35)">
      <circle cx="-12" cy="-6" r="13" fill="#dc2626" />
      <circle cx="12" cy="-6" r="13" fill="#dc2626" />
      <circle cx="-10" cy="10" r="13" fill="#b91c1c" />
      <circle cx="10" cy="10" r="13" fill="#b91c1c" />
      <circle cx="0" cy="-14" r="13" fill="#ef4444" />
      <circle cx="0" cy="0" r="6" fill="#7f1d1d" />
      <line x1="0" y1="0" x2="14" y2="-22" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14" cy="-22" r="1.8" fill="#eab308" />
      <circle cx="11" cy="-20" r="1.5" fill="#facc15" />
      <circle cx="15" cy="-18" r="1.5" fill="#facc15" />
      <circle cx="17" cy="-21" r="1.5" fill="#facc15" />
    </g>
  </svg>
);

const WheatShootSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 110">
    <path d="M50 110 Q50 50 48 35 T52 5" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
    <path d="M50 85 Q20 70 12 55 Q35 75 50 85" fill="#84cc16" />
    <path d="M50 85 Q80 70 88 55 Q65 75 50 85" fill="#84cc16" />
    <path d="M48 65 Q25 50 18 35 Q38 52 48 65" fill="#a3e635" opacity="0.9" />
    <path d="M52 65 Q75 50 82 35 Q62 52 52 65" fill="#a3e635" opacity="0.9" />
    <g transform="translate(50, 5)">
      <line x1="0" y1="35" x2="0" y2="0" stroke="#ca8a04" strokeWidth="2" />
      {[
        { x: -5, y: 30, r: 40 }, { x: 5, y: 25, r: -40 },
        { x: -5, y: 20, r: 40 }, { x: 5, y: 15, r: -40 },
        { x: -4, y: 10, r: 40 }, { x: 4, y: 5, r: -40 },
        { x: 0, y: -2, r: 0 }
      ].map((g, i) => (
        <g key={i} transform={`translate(${g.x}, ${g.y}) rotate(${g.r})`}>
          <ellipse cx="0" cy="0" rx="4" ry="6" fill="#fbbf24" stroke="#ca8a04" strokeWidth="0.8" />
          <line x1="0" y1="-6" x2={g.x < 0 ? -12 : 12} y2="-18" stroke="#ca8a04" strokeWidth="0.5" />
        </g>
      ))}
    </g>
  </svg>
);

const MarigoldShootSVG = () => (
  <svg width="80" height="100" viewBox="0 0 100 110">
    <path d="M50 110 Q50 65 48 40" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 65 Q30 50 25 45" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 55 Q70 42 75 35" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
    <g transform="translate(25, 45) rotate(-35)">
      <line x1="0" y1="20" x2="0" y2="-10" stroke="#14532d" strokeWidth="1.5" />
      {[-8, 0, 8].map((y) => (
        <React.Fragment key={y}>
          <line x1="0" y1={y} x2="-8" y2={y-3} stroke="#14532d" strokeWidth="1" />
          <line x1="0" y1={y} x2="8" y2={y-3} stroke="#14532d" strokeWidth="1" />
        </React.Fragment>
      ))}
    </g>
    <g transform="translate(75, 35) rotate(35)">
      <line x1="0" y1="20" x2="0" y2="-10" stroke="#14532d" strokeWidth="1.5" />
      {[-8, 0, 8].map((y) => (
        <React.Fragment key={y}>
          <line x1="0" y1={y} x2="-8" y2={y-3} stroke="#14532d" strokeWidth="1" />
          <line x1="0" y1={y} x2="8" y2={y-3} stroke="#14532d" strokeWidth="1" />
        </React.Fragment>
      ))}
    </g>
    <g transform="translate(48, 38)">
      <path d="M-8 0 Q0 8 8 0 L5 -6 L-5 -6 Z" fill="#15803d" />
      <circle cx="0" cy="-6" r="15" fill="#ea580c" />
      <circle cx="0" cy="-6" r="12" fill="#f97316" />
      <circle cx="-6" cy="-10" r="8" fill="#facc15" />
      <circle cx="6" cy="-10" r="8" fill="#facc15" />
      <circle cx="-8" cy="-3" r="8" fill="#f97316" />
      <circle cx="8" cy="-3" r="8" fill="#f97316" />
      <circle cx="0" cy="-6" r="9" fill="#facc15" />
      <circle cx="0" cy="-6" r="6" fill="#eab308" />
      <circle cx="0" cy="-6" r="3" fill="#ca8a04" />
    </g>
  </svg>
);

const PlantShootSVG = ({ plantId }) => {
  switch (plantId) {
    case 'mustard': return <MustardShootSVG />;
    case 'grass': return <GrassShootSVG />;
    case 'hibiscus': return <HibiscusShootSVG />;
    case 'wheat': return <WheatShootSVG />;
    case 'marigold': return <MarigoldShootSVG />;
    default: return null;
  }
};

// Custom Root Systems (Below ground parts)
const MustardRootSVG = ({ color, isWashed }) => {
  const rootColor = isWashed ? '#d97706' : color;
  const hairColor = isWashed ? '#fcd34d' : 'rgba(217,119,6,0.3)';
  
  return (
    <svg width="140" height="180" viewBox="0 0 140 180">
      <path d="M 70 0 Q 68 30 73 60 T 67 110 T 70 150" fill="none" stroke={rootColor} strokeWidth={isWashed ? 7 : 5} strokeLinecap="round" />
      <path d="M 69 25 Q 40 35 30 50" fill="none" stroke={rootColor} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 71 35 Q 100 45 110 60" fill="none" stroke={rootColor} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 71 55 Q 42 70 32 90" fill="none" stroke={rootColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 70 70 Q 102 85 112 105" fill="none" stroke={rootColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 68 95 Q 48 110 42 125" fill="none" stroke={rootColor} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 69 110 Q 90 125 94 140" fill="none" stroke={rootColor} strokeWidth="1.2" strokeLinecap="round" />
      {isWashed && (
        <g stroke={hairColor} strokeWidth="0.6" fill="none" opacity="0.75">
          <path d="M 68 15 Q 60 12 56 15" />
          <path d="M 72 18 Q 80 16 84 20" />
          <path d="M 68 45 Q 58 45 52 48" />
          <path d="M 72 48 Q 82 48 88 52" />
          <path d="M 69 80 Q 60 82 55 86" />
          <path d="M 70 85 Q 78 88 82 92" />
          <path d="M 40 38 Q 30 35 25 38" />
          <path d="M 33 45 Q 22 43 18 48" />
          <path d="M 98 47 Q 108 45 114 49" />
          <path d="M 103 55 Q 115 54 120 59" />
          <path d="M 45 68 Q 35 66 30 70" />
          <path d="M 35 80 Q 24 78 20 83" />
        </g>
      )}
    </svg>
  );
};

const GrassRootSVG = ({ color, isWashed }) => {
  const rootColor = isWashed ? '#84cc16' : color;
  const hairColor = isWashed ? '#bef264' : 'rgba(132,204,22,0.3)';

  return (
    <svg width="140" height="180" viewBox="0 0 140 180">
      <g stroke={rootColor} fill="none" strokeLinecap="round">
        <path d="M 70 0 Q 40 30 20 120 Q 15 145 10 160" strokeWidth="1.8" />
        <path d="M 70 0 Q 50 40 35 130 Q 30 150 25 165" strokeWidth="1.6" />
        <path d="M 70 0 Q 55 50 45 140 Q 42 155 40 170" strokeWidth="1.5" />
        <path d="M 70 0 Q 30 35 15 100 Q 10 125 5 140" strokeWidth="1.5" opacity="0.8" />
        <path d="M 70 0 Q 68 40 68 135 Q 69 155 70 175" strokeWidth="1.8" />
        <path d="M 70 0 Q 72 40 73 145 Q 72 160 72 178" strokeWidth="1.6" />
        <path d="M 70 0 Q 100 30 120 120 Q 125 145 130 160" strokeWidth="1.8" />
        <path d="M 70 0 Q 90 40 105 130 Q 110 150 115 165" strokeWidth="1.6" />
        <path d="M 70 0 Q 85 50 95 140 Q 98 155 100 170" strokeWidth="1.5" />
        <path d="M 70 0 Q 110 35 125 100 Q 130 125 135 140" strokeWidth="1.5" opacity="0.8" />
      </g>
      {isWashed && (
        <g stroke={hairColor} strokeWidth="0.6" fill="none" opacity="0.8">
          <path d="M 28 42 Q 18 55 12 70" />
          <path d="M 33 60 Q 22 75 16 90" />
          <path d="M 40 80 Q 28 98 22 115" />
          <path d="M 112 42 Q 122 55 128 70" />
          <path d="M 107 60 Q 118 75 124 90" />
          <path d="M 100 80 Q 112 98 118 115" />
          <path d="M 68 60 Q 58 80 54 100" />
          <path d="M 72 70 Q 82 90 86 110" />
        </g>
      )}
    </svg>
  );
};

const HibiscusRootSVG = ({ color, isWashed }) => {
  const rootColor = isWashed ? '#7c2d12' : color;
  const hairColor = isWashed ? '#ea580c' : 'rgba(124,45,18,0.3)';

  return (
    <svg width="140" height="180" viewBox="0 0 140 180">
      <path d="M 70 0 Q 65 35 72 70 T 66 120 T 70 160" fill="none" stroke={rootColor} strokeWidth={isWashed ? 11 : 8} strokeLinecap="round" />
      <path d="M 67 20 Q 30 30 18 55" fill="none" stroke={rootColor} strokeWidth={isWashed ? 4 : 3} strokeLinecap="round" />
      <path d="M 72 30 Q 110 40 122 65" fill="none" stroke={rootColor} strokeWidth={isWashed ? 4 : 3} strokeLinecap="round" />
      <path d="M 71 55 Q 38 72 26 98" fill="none" stroke={rootColor} strokeWidth={isWashed ? 3 : 2.2} strokeLinecap="round" />
      <path d="M 70 70 Q 105 90 118 115" fill="none" stroke={rootColor} strokeWidth={isWashed ? 3 : 2.2} strokeLinecap="round" />
      <path d="M 68 95 Q 45 115 38 135" fill="none" stroke={rootColor} strokeWidth={isWashed ? 2 : 1.5} strokeLinecap="round" />
      <path d="M 69 112 Q 95 130 102 150" fill="none" stroke={rootColor} strokeWidth={isWashed ? 2 : 1.5} strokeLinecap="round" />
      {isWashed && (
        <g stroke={hairColor} strokeWidth="0.8" fill="none" opacity="0.85">
          <path d="M 28 32 Q 18 38 10 45" />
          <path d="M 22 45 Q 12 55 5 65" />
          <path d="M 110 42 Q 120 48 128 55" />
          <path d="M 115 55 Q 125 65 132 75" />
          <path d="M 33 80 Q 22 90 15 105" />
          <path d="M 108 100 Q 118 112 122 125" />
        </g>
      )}
    </svg>
  );
};

const WheatRootSVG = ({ color, isWashed }) => {
  const rootColor = isWashed ? '#d97706' : color;
  const hairColor = isWashed ? '#fde68a' : 'rgba(217,119,6,0.3)';

  return (
    <svg width="140" height="180" viewBox="0 0 140 180">
      <g stroke={rootColor} fill="none" strokeLinecap="round">
        <path d="M 70 0 Q 55 35 40 110 T 30 165" strokeWidth="1.8" />
        <path d="M 70 0 Q 60 40 50 120 T 45 175" strokeWidth="1.6" />
        <path d="M 70 0 Q 66 45 60 130 T 58 178" strokeWidth="1.5" />
        <path d="M 70 0 Q 74 45 80 130 T 82 178" strokeWidth="1.5" />
        <path d="M 70 0 Q 80 40 90 120 T 95 175" strokeWidth="1.6" />
        <path d="M 70 0 Q 85 35 100 110 T 110 165" strokeWidth="1.8" />
        <path d="M 70 0 Q 45 25 25 90 T 15 145" strokeWidth="1.5" opacity="0.85" />
        <path d="M 70 0 Q 95 25 115 90 T 125 145" strokeWidth="1.5" opacity="0.85" />
      </g>
      {isWashed && (
        <g stroke={hairColor} strokeWidth="0.6" fill="none" opacity="0.75">
          <path d="M 46 65 Q 36 80 30 95" />
          <path d="M 52 80 Q 42 100 36 120" />
          <path d="M 94 65 Q 104 80 110 95" />
          <path d="M 88 80 Q 98 100 104 120" />
          <path d="M 33 45 Q 22 60 15 75" />
          <path d="M 107 45 Q 118 60 125 75" />
        </g>
      )}
    </svg>
  );
};

const MarigoldRootSVG = ({ color, isWashed }) => {
  const rootColor = isWashed ? '#b45309' : color;
  const hairColor = isWashed ? '#ffedd5' : 'rgba(180,83,9,0.3)';

  return (
    <svg width="140" height="180" viewBox="0 0 140 180">
      <path d="M 70 0 Q 68 35 71 70 T 67 125 T 70 155" fill="none" stroke={rootColor} strokeWidth={isWashed ? 8 : 6} strokeLinecap="round" />
      <g stroke={rootColor} fill="none" strokeLinecap="round">
        <path d="M 68 15 Q 38 25 25 40" strokeWidth="2.2" />
        <path d="M 72 20 Q 102 30 115 45" strokeWidth="2.2" />
        <path d="M 69 35 Q 40 48 28 65" strokeWidth="2.0" />
        <path d="M 71 40 Q 100 52 112 70" strokeWidth="2.0" />
        <path d="M 70 58 Q 42 75 30 95" strokeWidth="1.6" />
        <path d="M 70 65 Q 98 80 110 100" strokeWidth="1.6" />
        <path d="M 69 85 Q 48 102 40 120" strokeWidth="1.2" />
        <path d="M 70 95 Q 92 112 98 130" strokeWidth="1.2" />
      </g>
      {isWashed && (
        <g stroke={hairColor} strokeWidth="0.75" fill="none" opacity="0.85">
          <path d="M 32 30 Q 22 35 15 42" />
          <path d="M 36 33 Q 28 42 22 50" />
          <path d="M 30 52 Q 20 60 12 70" />
          <path d="M 34 56 Q 25 68 18 80" />
          <path d="M 108 35 Q 118 40 125 47" />
          <path d="M 104 38 Q 112 48 118 58" />
          <path d="M 110 58 Q 120 66 128 76" />
          <path d="M 106 63 Q 115 75 122 88" />
        </g>
      )}
    </svg>
  );
};

const PlantRootSVG = ({ plantId, color, isWashed }) => {
  switch (plantId) {
    case 'mustard': return <MustardRootSVG color={color} isWashed={isWashed} />;
    case 'grass': return <GrassRootSVG color={color} isWashed={isWashed} />;
    case 'hibiscus': return <HibiscusRootSVG color={color} isWashed={isWashed} />;
    case 'wheat': return <WheatRootSVG color={color} isWashed={isWashed} />;
    case 'marigold': return <MarigoldRootSVG color={color} isWashed={isWashed} />;
    default: return null;
  }
};

export default function RootSystemsLab({ onBackToDashboard }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [digProgress, setDigProgress] = useState({});
  const [digging, setDigging] = useState(null);
  const [washed, setWashed] = useState({});
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [allDone, setAllDone] = useState(false);

  const plant = PLANTS.find(p => p.id === selectedPlant);
  const progress = digProgress[selectedPlant] || 0;
  const isFullyDug = progress >= 100;
  const isWashed = washed[selectedPlant];
  const doneCount = Object.keys(checked).filter(k => checked[k]).length;

  const containerBg = `url(${darkForestBg}) center/cover no-repeat fixed`;
  const textColor = isLight ? '#0f172a' : '#fef3c7';
  const textMuted = isLight ? '#334155' : '#cbd5e1';
  const textFaint = isLight ? '#475569' : '#94a3b8';
  
  const sidebarBg = isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(18, 11, 3, 0.88)';
  const sidebarBorder = isLight ? '#fed7aa' : 'rgba(180,83,9,0.3)';
  const resetBtnBorder = isLight ? '#f97316' : 'rgba(255,255,255,0.1)';
  const resetBtnColor = isLight ? '#ea580c' : '#78350f';
  
  const mainBg = isLight ? '#fdfaf6' : '#1a0f05';
  const cardBg = isLight ? '#ffffff' : '#120b03';
  const cardBorder = isLight ? '#fed7aa' : 'rgba(180,83,9,0.3)';
  
  const excavationViewBg = isLight ? '#fdf6ee' : '#1c0e05';
  const soilGradient = isLight 
    ? 'linear-gradient(180deg, #b45309 0%, #7c2d12 50%, #451a03 100%)'
    : 'linear-gradient(180deg, #3d1c0a 0%, #2d1408 50%, #1a0b04 100%)';
  const soilBorder = isLight ? '#b45309' : '#5c2d0f';
  
  const progressTrackBg = isLight ? '#ffedd5' : '#2a1608';
  
  const buttonDugBg = isLight ? '#ffedd5' : '#2a1608';
  const buttonDugText = isLight ? '#b45309' : '#78350f';
  
  const closeUpDescBg = isLight ? '#fff7ed' : '#1c0e05';
  const closeUpDescText = isLight ? '#7c2d12' : '#fde68a';
  
  const classificationAlertText = isLight ? '#7c2d12' : '#fde68a';
  const optBg = isLight ? '#fffaf5' : 'rgba(255,255,255,0.03)';
  const optBorder = isLight ? '#ffedd5' : 'rgba(255,255,255,0.08)';
  const optText = isLight ? '#ea580c' : '#92400e';
  
  const doneOverlayBg = isLight ? 'rgba(253, 250, 246, 0.98)' : 'rgba(26,15,5,0.96)';
  const doneOverlaySub = isLight ? '#7c2d12' : '#92400e';
  const doneRedoBg = isLight ? '#ffedd5' : '#2a1608';
  const doneRedoText = isLight ? '#ea580c' : '#fef3c7';

  useEffect(() => {
    if (!digging) return;

    let timer;
    const tick = () => {
      setDigProgress(prev => {
        const cur = prev[digging] || 0;
        if (cur >= 100) {
          setDigging(null);
          return prev;
        }
        timer = setTimeout(tick, 80);
        return { ...prev, [digging]: Math.min(100, cur + 4) };
      });
    };

    timer = setTimeout(tick, 80);
    return () => clearTimeout(timer);
  }, [digging]);

  const handleDig = () => {
    if (!selectedPlant || isFullyDug) return;
    setDigging(selectedPlant);
  };

  const handleWash = () => {
    if (!isFullyDug) return;
    setWashed(prev => ({ ...prev, [selectedPlant]: true }));
  };

  const handleCheck = (plantId) => {
    const correct = PLANTS.find(p => p.id === plantId).rootType;
    const isRight = answers[plantId] === correct;
    setChecked(prev => ({ ...prev, [plantId]: isRight }));
    if (isRight) {
      const newChecked = { ...checked, [plantId]: true };
      if (Object.keys(newChecked).filter(k => newChecked[k]).length === PLANTS.length) {
        setAllDone(true);
        confetti({ particleCount: 160, spread: 85, origin: { y: 0.5 } });
      }
    }
  };

  const handleReset = () => {
    setSelectedPlant(null); setDigProgress({}); setDigging(null);
    setWashed({}); setAnswers({}); setChecked({}); setAllDone(false);
  };


  return (
    <div style={{ display: 'flex', height: '100%', background: containerBg, color: textColor, fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>
      {/* Left — Plant list */}
      <aside style={{ width: 280, background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.9rem', overflowY: 'auto' }}>
        <button onClick={onBackToDashboard} style={{ background: 'none', border: 'none', color: isLight ? '#0f172a' : '#cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: '800', padding: 0 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <div style={{ fontSize: '0.95rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '900', letterSpacing: '0.06em', background: 'rgba(14, 165, 233, 0.18)', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1.5px solid rgba(56, 189, 248, 0.4)', display: 'inline-block', marginBottom: '0.4rem', boxShadow: '0 2px 10px rgba(14, 165, 233, 0.25)' }}>Activity 2.6</div>
          <div style={{ fontSize: '1.45rem', fontWeight: '900', color: textColor, lineHeight: '1.25' }}>⛏️ Root Excavation Station</div>
          <div style={{ fontSize: '1rem', color: isLight ? '#0f172a' : '#fef3c7', marginTop: '0.35rem', fontWeight: '800' }}>{doneCount}/{PLANTS.length} identified</div>
        </div>
        <div style={{ height: 7, background: progressTrackBg, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #84cc16)', width: `${(doneCount / PLANTS.length) * 100}%`, transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontSize: '1.02rem', color: isLight ? '#0f172a' : '#e2e8f0', fontStyle: 'italic', fontWeight: '700', lineHeight: '1.45' }}>Select a plant → dig it up → wash roots → classify!</div>
        {PLANTS.map(p => (
          <button key={p.id} onClick={() => setSelectedPlant(p.id)} style={{ background: selectedPlant === p.id ? (isLight ? '#fed7aa' : 'rgba(180,83,9,0.3)') : (isLight ? '#ffffff' : 'rgba(255,255,255,0.08)'), border: `2.5px solid ${checked[p.id] === true ? '#22c55e' : checked[p.id] === false ? '#ef4444' : selectedPlant === p.id ? '#f59e0b' : (isLight ? '#fed7aa' : 'rgba(255,255,255,0.18)')}`, borderRadius: '12px', padding: '0.85rem 1rem', cursor: 'pointer', color: textColor, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', boxShadow: selectedPlant === p.id ? '0 4px 14px rgba(245,158,11,0.25)' : 'none' }}>
            <span style={{ fontSize: '1.65rem' }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.18rem', fontWeight: 900, color: isLight ? '#0f172a' : '#f8fafc' }}>{p.name}</div>
              {checked[p.id] === true && <div style={{ fontSize: '0.92rem', color: isLight ? '#15803d' : '#4ade80', fontWeight: '800', marginTop: '0.15rem' }}>✅ {p.rootType === 'taproot' ? 'Taproot' : 'Fibrous'}</div>}
              {digProgress[p.id] >= 100 && !checked[p.id] && <div style={{ fontSize: '0.92rem', color: isLight ? '#ea580c' : '#f59e0b', fontWeight: '800', marginTop: '0.15rem' }}>⛏️ Dug up</div>}
            </div>
          </button>
        ))}
        <button onClick={handleReset} style={{ marginTop: 'auto', background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)', border: `2px solid ${resetBtnBorder}`, color: isLight ? '#0f172a' : '#fef3c7', padding: '0.65rem', borderRadius: '10px', cursor: 'pointer', fontSize: '1.02rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '800' }}>
          <RefreshCw size={16} /> Reset Lab
        </button>
      </aside>

      {/* Main workbench */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {!selectedPlant ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: '#0f172a', border: '2.5px solid #0284c7', boxShadow: '0 8px 32px rgba(2, 132, 199, 0.35)', padding: '2.2rem 3rem', borderRadius: '24px', maxWidth: '560px', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>⛏️</div>
              <div style={{ fontSize: '1.45rem', color: '#facc15', fontWeight: '900', letterSpacing: '0.01em', lineHeight: '1.3' }}>Select a potted plant from the left panel</div>
              <div style={{ fontSize: '1.15rem', color: '#fef08a', fontWeight: '800', lineHeight: '1.5' }}>You'll dig it up, wash the roots, and classify them!</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.4rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>{plant.emoji}</span>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.55rem', color: textColor }}>{plant.name}</div>
                <div style={{ fontSize: '1.02rem', color: isLight ? '#0f172a' : '#e2e8f0', fontWeight: '700' }}>Potted Herb Specimen</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Dig Scene */}
              <div style={{ background: cardBg, borderRadius: '18px', padding: '1.4rem', border: `2px solid ${cardBorder}`, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: '1.02rem', color: isLight ? '#ea580c' : '#f59e0b', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>⛏️ Excavation View</div>
                <div style={{ position: 'relative', height: 210, background: excavationViewBg, borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Plant above ground — realistic asset */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '0.25rem', zIndex: 4, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.35))' }}>
                    {isFullyDug
                      ? <img src={PLANT_IMG_2[selectedPlant]} alt={plant.name + ' fully dug'} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'center bottom' }} />
                      : <img src={PLANT_IMG_1[selectedPlant]} alt={plant.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', objectPosition: 'center bottom' }} />
                    }
                  </div>
                  {/* Soil layers */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${100 - progress}%`, background: soilGradient, transition: 'height 0.15s', borderTop: `3px solid ${soilBorder}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '0.35rem', fontSize: '0.85rem', color: '#ffedd5', fontWeight: '900', zIndex: 2 }}>
                    {progress < 100 && progress > 0 && '🪱 Soil...'}
                  </div>
                </div>
                {/* Dig progress */}
                <div style={{ height: 8, background: progressTrackBg, borderRadius: 4, overflow: 'hidden', margin: '0.9rem 0' }}>
                  <div style={{ height: '100%', background: 'linear-gradient(90deg, #f59e0b, #84cc16)', width: `${progress}%`, transition: 'width 0.1s', borderRadius: 4 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  <button onClick={handleDig} disabled={isFullyDug || digging === selectedPlant} style={{ flex: 1, background: isFullyDug ? buttonDugBg : '#f59e0b', border: 'none', color: isFullyDug ? buttonDugText : '#1a0f05', padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: isFullyDug ? 'default' : 'pointer', fontSize: '1.08rem', fontWeight: '900', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
                    {isFullyDug ? '✅ Fully Dug!' : digging === selectedPlant ? '⛏️ Digging...' : '⛏️ Dig!'}
                  </button>
                  {isFullyDug && !isWashed && (
                    <button onClick={handleWash} style={{ flex: 1, background: '#0ea5e9', border: 'none', color: '#fff', padding: '0.75rem 1.25rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1.08rem', fontWeight: '900', boxShadow: '0 4px 14px rgba(14,165,233,0.4)' }}>
                      💧 Wash Roots
                    </button>
                  )}
                </div>
              </div>

              {/* Root Close-up */}
              <div style={{ background: cardBg, borderRadius: '18px', padding: '1.4rem', border: `2px solid ${isWashed ? 'rgba(132,204,22,0.5)' : cardBorder}`, display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: '1.02rem', color: isWashed ? '#16a34a' : textFaint, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isWashed ? '🔬 Root Close-Up (Washed)' : '🪣 Wash the roots to examine'}
                </div>
                {!isFullyDug && <div style={{ color: textFaint, fontSize: '1.02rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>Dig up the plant first!</div>}
                {isFullyDug && !isWashed && <div style={{ color: isLight ? '#0f172a' : '#f8fafc', fontSize: '1.02rem', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>Click "Wash Roots" to clean them for examination.</div>}
                {isWashed && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45))' }}>
                      <img
                        src={ROOT_CLOSE_IMG[plant.rootType]}
                        alt={plant.rootType === 'taproot' ? 'Taproot close-up' : 'Fibrous root close-up'}
                        style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ background: closeUpDescBg, borderRadius: '12px', padding: '0.9rem 1.1rem', fontSize: '1.12rem', color: closeUpDescText, lineHeight: 1.6, border: `2px solid ${sidebarBorder}`, fontWeight: '700' }}>{plant.desc}</div>
                  </>
                )}
              </div>
            </div>

            {/* Classification */}
            {isWashed && (
              <div style={{ background: cardBg, borderRadius: '16px', padding: '1.5rem', border: `2px solid ${sidebarBorder}`, boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
                <div style={{ fontSize: '1.15rem', color: classificationAlertText, marginBottom: '0.95rem', fontWeight: '800' }}>
                  Based on what you observed — classify the root system of <strong style={{ fontSize: '1.25rem', fontWeight: '900' }}>{plant.name}</strong>:
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ROOT_LABELS.map(opt => (
                    <button key={opt.id} onClick={() => !checked[selectedPlant] && setAnswers(a => ({ ...a, [selectedPlant]: opt.id }))} style={{ background: answers[selectedPlant] === opt.id ? `${opt.color}25` : optBg, border: `3px solid ${answers[selectedPlant] === opt.id ? opt.color : optBorder}`, color: answers[selectedPlant] === opt.id ? opt.color : optText, padding: '0.75rem 1.4rem', borderRadius: '14px', cursor: checked[selectedPlant] ? 'default' : 'pointer', fontSize: '1.12rem', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'all 0.2s', fontWeight: '800' }}>
                      {opt.icon} {opt.label}
                      <span style={{ fontSize: '0.95rem', opacity: 0.85, fontWeight: '700' }}>— {opt.desc}</span>
                    </button>
                  ))}
                  {answers[selectedPlant] && !checked[selectedPlant] && (
                    <button onClick={() => handleCheck(selectedPlant)} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.75rem 1.75rem', borderRadius: '12px', cursor: 'pointer', fontSize: '1.15rem', fontWeight: '900', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
                      Verify ✓
                    </button>
                  )}
                  {checked[selectedPlant] === true && <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '1.15rem' }}>✅ Correct!</span>}
                  {checked[selectedPlant] === false && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: '#dc2626', fontWeight: '900', fontSize: '1.15rem' }}>❌ Look at the root diagram again.</span>
                      <button onClick={() => { setAnswers(a => ({ ...a, [selectedPlant]: null })); setChecked(c => { const n = { ...c }; delete n[selectedPlant]; return n; }); }} style={{ background: 'rgba(220,38,38,0.15)', border: '2px solid #dc2626', color: '#dc2626', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '800' }}>Retry</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* All done overlay */}
      {allDone && (
        <div style={{ position: 'absolute', inset: 0, background: doneOverlayBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', zIndex: 50, textAlign: 'center', padding: '2rem' }}>
          <Award size={56} color="#f59e0b" style={{ filter: 'drop-shadow(0 4px 12px rgba(245,158,11,0.2))' }} />
          <h2 style={{ color: isLight ? '#ea580c' : '#f59e0b', margin: 0, fontWeight: '800' }}>Root Explorer Badge!</h2>
          <p style={{ color: doneOverlaySub, maxWidth: 420, lineHeight: 1.6, fontSize: '0.95rem', fontWeight: '500' }}>
            You correctly identified all 5 root systems!<br />
            <strong style={{ color: isLight ? '#c2410c' : '#f59e0b' }}>Mustard, Hibiscus, Marigold</strong> → Taproot System<br />
            <strong style={{ color: '#16a34a' }}>Grass, Wheat</strong> → Fibrous Root System<br /><br />
            <span style={{ fontSize: '0.85rem', color: textFaint }}>Notice the pattern? Continue to Activity 2.7 to discover how this connects to leaf venation!</span>
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} style={{ background: doneRedoBg, border: 'none', color: doneRedoText, padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Redo</button>
            <button onClick={() => onBackToDashboard('next_activity')} style={{ background: '#f59e0b', border: 'none', color: '#1a0f05', padding: '0.6rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Next: Relate & Analyse ➜</button>
          </div>
        </div>
      )}
    </div>
  );
}
