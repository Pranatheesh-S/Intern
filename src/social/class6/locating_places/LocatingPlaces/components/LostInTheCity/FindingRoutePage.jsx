import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Map, MapPin, Compass, ArrowLeft, Maximize2, Minimize2, Navigation, ZoomIn, ZoomOut, Move, RotateCcw, CheckCircle, HelpCircle } from 'lucide-react';
import ChapterBackFooter from '../ChapterBackFooter';
import { ScrollableWithNav } from '../ContentScrollNav';
import townMapFig from './assets/town_map_fig1.jpg';
import townMapStraightFig from './assets/town_map_straight_3d.jpg';
import CityExplorerMap from './CityExplorerMap';
import TownMap3DExplorer from './TownMap3DExplorer';

/* ── 1. CLASSIC GRID MAP CONFIG (Fig. 1.1) ─────────────────────── */
const N_CLASSIC = {
  RS: { x: 150, y: 360, label: 'Railway Station', uniqueName: 'Central Junction Station', sub: 'Express Rail Terminal', type: 'station', start: true, icon: '🚂' },
  HO: { x: 350, y: 360, label: 'Hospital', uniqueName: 'City Care Hospital', sub: '24/7 Emergency & Trauma', type: 'hospital', icon: '🏥' },
  NP: { x: 550, y: 360, label: 'Nagar Panchayat', uniqueName: 'Civic Town Hall', sub: 'Municipal Council', type: 'civic', icon: '🏛️' },
  BK: { x: 740, y: 560, label: 'Bank', uniqueName: 'Apex National Bank', sub: 'Treasury & Forex', type: 'bank', goal: true, icon: '🏦' },
  SC: { x: 150, y: 560, label: 'School', uniqueName: 'Greenwood Public School', sub: 'Primary & High School', type: 'school', icon: '🏫' },
  MK: { x: 350, y: 560, label: 'Market', uniqueName: 'Janata Central Bazaar', sub: 'Daily Fresh Market', type: 'market', icon: '🛍️' },
  JT: { x: 550, y: 560, label: 'Junction', uniqueName: 'Central Crossroads', sub: 'Town Crossroads', type: 'junction', icon: '🚦' },
  MU: { x: 740, y: 360, label: 'Museum', uniqueName: 'Heritage Museum', sub: 'Antiquities & History', type: 'museum', icon: '🏛️' },
  AP: { x: 350, y: 165, label: 'Apartments', uniqueName: 'Sunview Heights', sub: 'Skyline Residency', type: 'apartment', icon: '🏢' },
  PG: { x: 740, y: 165, label: 'Public Garden', uniqueName: 'Rosewood Botanical Garden', sub: 'Flora & Eco Park', type: 'garden', icon: '🌳' },
};

const EDGES_CLASSIC = [
  ['RS', 'HO'], ['HO', 'NP'], ['NP', 'MU'], ['SC', 'MK'], ['MK', 'JT'], ['JT', 'BK'],
  ['RS', 'SC'], ['AP', 'HO'], ['HO', 'MK'], ['NP', 'JT'], ['PG', 'MU'], ['MU', 'BK']
];

// Classic straight road names
const CLASSIC_ROAD_NAMES = [
  { id: 'c_station_marg', name: 'STATION MARG', x: 250, y: 360, angle: 0 },
  { id: 'c_mg_road', name: 'M.G. ROAD', x: 450, y: 360, angle: 0 },
  { id: 'c_museum_road', name: 'MUSEUM ROAD', x: 645, y: 360, angle: 0 },
  { id: 'c_school_lane_h', name: 'VIDYA MARG', x: 250, y: 560, angle: 0 },
  { id: 'c_bazaar_road', name: 'BAZAAR ROAD', x: 450, y: 560, angle: 0 },
  { id: 'c_bank_street', name: 'BANK STREET', x: 645, y: 560, angle: 0 },
  { id: 'c_station_lane_v', name: 'STATION LANE', x: 150, y: 460, angle: -90 },
  { id: 'c_apartment_dr', name: 'APARTMENT DRIVE', x: 350, y: 260, angle: -90 },
  { id: 'c_hospital_ave', name: 'HOSPITAL AVENUE', x: 350, y: 460, angle: -90 },
  { id: 'c_panchayat_rd', name: 'PANCHAYAT ROAD', x: 550, y: 460, angle: -90 },
  { id: 'c_garden_way', name: 'GARDEN WAY', x: 740, y: 260, angle: -90 },
  { id: 'c_heritage_blvd', name: 'HERITAGE BOULEVARD', x: 740, y: 460, angle: -90 },
];

/* ── 2. 3D MODEL MAP CONFIG (Precision 1024 x 571 Straight Road Alignment) ──
   
   ROAD INTERSECTION GRID:
   Nodes are placed directly on the ASPHALT ROAD CORRIDORS (crossroads & street stops)
   where roads run between buildings. The walker travels strictly along the asphalt lines,
   NEVER crossing over any building structure.
   
   Asphalt Road Lines on 1024 x 571:
   - Horizontal Top Road (M.G. Road / Station Marg): Y = 196
   - Horizontal Bottom Road (Vidya Marg / Bazaar Road / Bank Street): Y = 368
   - Vertical West Road (Station Marg / Station Lane): X = 320
   - Vertical Center Road (Panchayat Road / Apartment Drive): X = 570
   - Vertical East Road (Heritage Blvd / Garden Way): X = 744
*/
const N_3D = {
  RS: { x: 320, y: 196, label: 'Railway Station', uniqueName: 'Central Junction Station', sub: 'Express Rail Terminal', type: 'station', start: true, icon: '🚂' },
  HO: { x: 320, y: 282, label: 'Hospital', uniqueName: 'City Care Hospital', sub: '24/7 Emergency & Trauma', type: 'hospital', icon: '🏥' },
  NP: { x: 570, y: 282, label: 'Nagar Panchayat', uniqueName: 'Civic Town Hall', sub: 'Municipal Council', type: 'civic', icon: '🏛️' },
  BK: { x: 657, y: 368, label: 'Bank', uniqueName: 'Apex National Bank', sub: 'Treasury & Forex', type: 'bank', goal: true, icon: '🏦' },
  SC: { x: 320, y: 368, label: 'School', uniqueName: 'Greenwood Public School', sub: 'Primary & High School', type: 'school', icon: '🏫' },
  MK: { x: 445, y: 368, label: 'Market', uniqueName: 'Janata Central Bazaar', sub: 'Daily Fresh Market', type: 'market', icon: '🛍️' },
  JT: { x: 570, y: 368, label: 'Junction', uniqueName: 'Central Crossroads', sub: 'Town Crossroads', type: 'junction', icon: '🚦' },
  MU: { x: 744, y: 368, label: 'Museum', uniqueName: 'Heritage Museum', sub: 'Antiquities & History', type: 'museum', icon: '🏛️' },
  AP: { x: 570, y: 196, label: 'Apartments', uniqueName: 'Sunview Heights', sub: 'Skyline Residency', type: 'apartment', icon: '🏢' },
  PG: { x: 744, y: 196, label: 'Public Garden', uniqueName: 'Rosewood Botanical Garden', sub: 'Flora & Eco Park', type: 'garden', icon: '🌳' },
};

// Road centre-line coordinates along straight asphalt corridors (1024 x 571)
// All paths follow road corridors — walker stays strictly on roads, never crosses buildings
const RAW_PATHS_3D = {
  'RS|HO': [[320, 196], [320, 282]],                                   // West Road down to Hospital
  'HO|SC': [[320, 282], [320, 368]],                                   // West Road down to School
  'RS|SC': [[320, 196], [320, 282], [320, 368]],                       // West Road down
  'HO|NP': [[320, 282], [320, 196], [570, 196], [570, 282]],           // West Road up, Top Road right, Center Road down
  'NP|BK': [[570, 282], [570, 368], [657, 368]],                       // Center Road down, Bottom Road right to Bank
  'AP|NP': [[570, 196], [570, 282]],                                   // Center Road down
  'BK|PG': [[657, 368], [744, 368], [744, 196]],                       // Bottom Road right, East Road up to Garden
  'BK|MU': [[657, 368], [744, 368]],                                   // Bottom Road right to Museum
  'JT|BK': [[570, 368], [657, 368]],                                   // Bottom Road right to Bank
  'JT|MU': [[570, 368], [657, 368], [744, 368]],                       // Bottom Road right to Museum
  'MK|JT': [[445, 368], [570, 368]],                                   // Bottom Road right to Junction
  'SC|MK': [[320, 368], [445, 368]],                                   // Bottom Road right to Market
  'NP|MK': [[570, 282], [570, 368], [445, 368]],                       // Center Road down, Bottom Road left
  'HO|MK': [[320, 282], [320, 368], [445, 368]],                       // West Road down, Bottom Road right
  'NP|JT': [[570, 282], [570, 368]],                                   // Center Road down to Junction
  'PG|AP': [[744, 196], [570, 196]],                                   // Top Road left to Apartments
  'AP|HO': [[570, 196], [320, 196], [320, 282]],                       // Top Road left, West Road down
  'RS|AP': [[320, 196], [570, 196]],                                   // Top Road right to Apartments
  'AP|PG': [[570, 196], [744, 196]],                                   // Top Road right to Garden
};

// Generate straight road step points
const PATHS_3D = {};
Object.entries(RAW_PATHS_3D).forEach(([key, rawPts]) => {
  const result = [];
  for (let i = 0; i < rawPts.length - 1; i++) {
    const [x1, y1] = rawPts[i];
    const [x2, y2] = rawPts[i + 1];
    const steps = 16;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      result.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
    }
  }
  PATHS_3D[key] = result;
});

// Road name labels positioned directly along the asphalt road corridors
const ROAD_NAMES = [
  { id: 'station_rd', name: 'STATION MARG', x: 320, y: 239, angle: -90, edge: 'RS|HO' },
  { id: 'station_lane', name: 'STATION LANE', x: 320, y: 325, angle: -90, edge: 'HO|SC' },
  { id: 'mg_road', name: 'M.G. ROAD', x: 445, y: 196, angle: 0, edge: 'RS|AP' },
  { id: 'top_road', name: 'PARK BOULEVARD', x: 657, y: 196, angle: 0, edge: 'AP|PG' },
  { id: 'bank_street', name: 'BANK STREET', x: 613, y: 368, angle: 0, edge: 'JT|BK' },
  { id: 'apartment_dr', name: 'APARTMENT DRIVE', x: 570, y: 239, angle: -90, edge: 'AP|NP' },
  { id: 'panchayat_marg', name: 'PANCHAYAT ROAD', x: 570, y: 325, angle: -90, edge: 'NP|JT' },
  { id: 'garden_way', name: 'GARDEN WAY', x: 744, y: 282, angle: -90, edge: 'BK|PG' },
  { id: 'vidya_marg', name: 'VIDYA MARG', x: 382, y: 368, angle: 0, edge: 'SC|MK' },
  { id: 'bazaar_rd', name: 'BAZAAR ROAD', x: 507, y: 368, angle: 0, edge: 'MK|JT' },
  { id: 'museum_st', name: 'MUSEUM STREET', x: 700, y: 368, angle: 0, edge: 'JT|MU' },
];

// Building badges positioned cleanly on the roof facade of each building
const BUILDING_BADGES_3D = [
  { id: 'b_rs', type: 'station', name: 'Central Junction Station', icon: '🚂', x: 185, y: 65 },
  { id: 'b_lk', type: 'lake', name: 'Scenic Lake', icon: '🏞️', x: 440, y: 100 },
  { id: 'b_ap', type: 'apartment', name: 'Sunview Heights', icon: '🏢', x: 655, y: 45 },
  { id: 'b_pg', type: 'garden', name: 'Rosewood Botanical Garden', icon: '🌳', x: 860, y: 70 },
  { id: 'b_ho', type: 'hospital', name: 'City Care Hospital', icon: '🏥', x: 210, y: 235 },
  { id: 'b_np', type: 'civic', name: 'Civic Town Hall', icon: '🏛️', x: 485, y: 235 },
  { id: 'b_bk', type: 'bank', name: 'Apex National Bank', icon: '🏦', x: 660, y: 235 },
  { id: 'b_sc', type: 'school', name: 'Greenwood Public School', icon: '🏫', x: 185, y: 440 },
  { id: 'b_mk', type: 'market', name: 'Janata Central Bazaar', icon: '🛍️', x: 450, y: 440 },
  { id: 'b_mu', type: 'museum', name: 'Heritage Museum', icon: '🏛️', x: 860, y: 440 },
];

function get3DRoadPoints(a, b) {
  const fwd = PATHS_3D[`${a}|${b}`];
  if (fwd) return fwd;
  const back = PATHS_3D[`${b}|${a}`];
  if (back) return [...back].reverse();
  
  // FALLBACK: Route through road corridors (L-shaped path via intersections)
  // NEVER cut diagonally through buildings — go horizontal first, then vertical
  console.warn(`[3D Map] Missing path for ${a}→${b}, using road-corridor fallback`);
  const ax = N_3D[a].x, ay = N_3D[a].y;
  const bx = N_3D[b].x, by = N_3D[b].y;
  if (ax === bx || ay === by) {
    // Already on same road (horizontal or vertical) — straight line is safe
    return [[ax, ay], [bx, by]];
  }
  // L-shaped routing: go horizontal along current road, then vertical
  return [[ax, ay], [bx, ay], [bx, by]];
}

const ptsAttr = pts => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

function pathLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
}

function pointAlong(pts, dist) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    if (acc + seg >= dist || i === pts.length - 1) {
      const t = seg > 0 ? (dist - acc) / seg : 0;
      const clampedT = Math.max(0, Math.min(1, t));
      return { x: x0 + (x1 - x0) * clampedT, y: y0 + (y1 - y0) * clampedT };
    }
    acc += seg;
  }
  return { x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] };
}

/* ── 3. GRAPH ADJACENCY & NAVIGATION ────────────────────────────── */
// Classic Map Adjacency (NCERT Fig 1.1)
const ADJ_CLASSIC = {};
Object.keys(N_CLASSIC).forEach(k => ADJ_CLASSIC[k] = {});
function dirOfClassic(a, b) {
  const dx = N_CLASSIC[b].x - N_CLASSIC[a].x, dy = N_CLASSIC[b].y - N_CLASSIC[a].y;
  return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : (dy > 0 ? 'S' : 'N');
}
EDGES_CLASSIC.forEach(([a, b]) => {
  ADJ_CLASSIC[a][dirOfClassic(a, b)] = b;
  ADJ_CLASSIC[b][dirOfClassic(b, a)] = a;
});

// 3D Illustrated Map Adjacency — road connections along the grid
const EDGES_3D = [
  ['RS', 'HO'], // left vertical: RS ↔ HO
  ['HO', 'SC'], // left vertical: HO ↔ SC
  ['RS', 'AP'], // top horizontal: RS ↔ AP
  ['AP', 'PG'], // top horizontal: AP ↔ PG (via Park Blvd)
  ['HO', 'NP'], // middle horizontal: HO ↔ NP
  ['NP', 'BK'], // middle horizontal: NP ↔ BK
  ['SC', 'MK'], // bottom horizontal: SC ↔ MK
  ['MK', 'JT'], // bottom horizontal: MK ↔ JT
  ['JT', 'MU'], // bottom horizontal: JT ↔ MU
  ['AP', 'NP'], // center-left vertical: AP ↔ NP
  ['NP', 'MK'], // center-left vertical: NP ↔ MK
  ['BK', 'JT'], // center-right vertical: BK ↔ JT
];

const ADJ_3D = {};
Object.keys(N_3D).forEach(k => ADJ_3D[k] = {});

// Exact direction mapping for 3D Illustrated Map (based on road intersection grid)
ADJ_3D['RS'] = { S: 'HO', E: 'AP' };
ADJ_3D['AP'] = { W: 'RS', S: 'NP', E: 'PG' };
ADJ_3D['PG'] = { W: 'AP' };
ADJ_3D['HO'] = { N: 'RS', E: 'NP', S: 'SC' };
ADJ_3D['NP'] = { W: 'HO', N: 'AP', E: 'BK', S: 'MK' };
ADJ_3D['BK'] = { W: 'NP', S: 'JT' };
ADJ_3D['SC'] = { N: 'HO', E: 'MK' };
ADJ_3D['MK'] = { W: 'SC', N: 'NP', E: 'JT' };
ADJ_3D['JT'] = { W: 'MK', N: 'BK', E: 'MU' };
ADJ_3D['MU'] = { W: 'JT' };

function bfs3D(start, goal) {
  const q = [[start]], seen = { [start]: 1 };
  while (q.length) {
    const p = q.shift(), last = p[p.length - 1];
    if (last === goal) return p;
    for (const d in ADJ_3D[last]) {
      const nx = ADJ_3D[last][d];
      if (nx && !seen[nx]) { seen[nx] = 1; q.push([...p, nx]); }
    }
  }
  return null;
}

function bfsClassic(start, goal) {
  const q = [[start]], seen = { [start]: 1 };
  while (q.length) {
    const p = q.shift(), last = p[p.length - 1];
    if (last === goal) return p;
    for (const d in ADJ_CLASSIC[last]) {
      const nx = ADJ_CLASSIC[last][d];
      if (nx && !seen[nx]) { seen[nx] = 1; q.push([...p, nx]); }
    }
  }
  return null;
}

/* ── MAP ACTIVITY QUESTION BANK (8 NCERT & City Explorer Questions × 3 Options) ───── */
const MAP_QUIZ = [
  {
    id: 'q1',
    tag: 'Cardinal Directions',
    question: 'When you stand facing North, which direction is directly to your right-hand side?',
    options: ['East', 'West', 'South'],
    answer: 'East',
    right: 'Correct! When facing North, East is always to your right and West is to your left.',
    wrong: 'Remember: When you face North, East is to your right and West is to your left.'
  },
  {
    id: 'q2',
    tag: 'City Explorer Route',
    question: 'In City Explorer, starting from Skyline Airport, which direction do you walk along Northern Boulevard to reach Star Cineplex?',
    options: ['East', 'South', 'West'],
    answer: 'East',
    right: 'Correct! Walking along Northern Boulevard from Airport to Star Cineplex heads directly East.',
    wrong: 'Check the compass: Moving rightwards towards Star Cineplex goes East.'
  },
  {
    id: 'q3',
    tag: 'City Explorer Route',
    question: 'Starting from Skyline Airport, in which direction is Greenfield Park located?',
    options: ['South', 'North', 'West'],
    answer: 'South',
    right: 'Correct! Walking down West Avenue from Skyline Airport takes you directly South to Greenfield Park.',
    wrong: 'Look at the vertical road: Moving down from Skyline Airport to Greenfield Park goes South.'
  },
  {
    id: 'q4',
    tag: 'Intermediate Directions',
    question: 'On the City Explorer map, in which overall direction is the destination Sunset Beach located from Skyline Airport?',
    options: ['South-East (SE)', 'North-West (NW)', 'South-West (SW)'],
    answer: 'South-East (SE)',
    right: 'Correct! Sunset Beach is in the bottom-right corner, which is South-East (SE) from the Airport.',
    wrong: 'The bottom-right corner between South and East is South-East (SE).'
  },
  {
    id: 'q5',
    tag: 'Intermediate Directions',
    question: 'Which intermediate direction lies midway between North and East on a compass rose?',
    options: ['North-East (NE)', 'North-West (NW)', 'South-East (SE)'],
    answer: 'North-East (NE)',
    right: 'Correct! North-East (NE) lies exactly halfway between North and East.',
    wrong: 'The intermediate direction midway between North and East is North-East (NE).'
  },
  {
    id: 'q6',
    tag: 'Map Symbols',
    question: 'What conventional colour is universally used on maps to represent water bodies like oceans and lakes?',
    options: ['Blue', 'Green', 'Brown'],
    answer: 'Blue',
    right: 'Correct! Blue is the universal map symbol colour for all water bodies.',
    wrong: 'Standard cartography uses Blue for water bodies like rivers, lakes, and seas.'
  },
  {
    id: 'q7',
    tag: 'Map Components',
    question: 'What are the three essential components of any standard geographical map?',
    options: ['Distance, Direction, and Symbols', 'Colours, Borders, and Pictures', 'Latitude, Longitude, and Weather'],
    answer: 'Distance, Direction, and Symbols',
    right: 'Correct! Distance (scale), Direction (North arrow), and Symbols are the three core components of a map.',
    wrong: 'The three fundamental components of any map are Distance, Direction, and Symbols.'
  },
  {
    id: 'q8',
    tag: 'Map Scale',
    question: 'What is the primary purpose of a scale on a map?',
    options: ['To show the ratio between map distance and actual ground distance', 'To indicate the direction of the wind', 'To decorate the map borders'],
    answer: 'To show the ratio between map distance and actual ground distance',
    right: 'Correct! A map scale gives the proportional ratio between map distance and actual ground distance.',
    wrong: 'A scale shows the proportional relationship between distance on paper and actual ground distance.'
  }
];

const short = { RS: 'RS', HO: 'Hosp', NP: 'NP', BK: 'Bank', SC: 'Sch', MK: 'Mkt', JT: 'Jn', MU: 'Mus', AP: 'Apt', PG: 'PG' };

const IMAGE_MAP = {
  station: 'railway_station', hospital: 'hospital', civic: 'nagar_panchayat',
  bank: 'bank', school: 'school', market: 'market', museum: 'museum',
  apartment: 'apartments', garden: 'public_garden'
};

const BUILDING_THEMES = {
  station: { bg: '#991B1B', border: '#F87171', text: '#FFFFFF', sub: '#FECACA' }, // Deep Crimson
  hospital: { bg: '#DC2626', border: '#FCA5A5', text: '#FFFFFF', sub: '#FEE2E2' }, // Medical Red
  civic: { bg: '#4338CA', border: '#A5B4FC', text: '#FFFFFF', sub: '#E0E7FF' }, // Civic Royal Indigo
  bank: { bg: '#047857', border: '#6EE7B7', text: '#FFFFFF', sub: '#D1FAE5' }, // Emerald Bank
  school: { bg: '#B45309', border: '#FCD34D', text: '#FFFFFF', sub: '#FEF3C7' }, // Amber Gold School
  market: { bg: '#C2410C', border: '#FDBA74', text: '#FFFFFF', sub: '#FFEDD5' }, // Bazaar Vibrant Orange
  junction: { bg: '#0F172A', border: '#F59E0B', text: '#FEF08A', sub: '#CBD5E1' }, // Junction Midnight Gold
  museum: { bg: '#854D0E', border: '#FDE047', text: '#FFFFFF', sub: '#FEF9C3' }, // Heritage Antique Bronze
  apartment: { bg: '#0284C7', border: '#7DD3FC', text: '#FFFFFF', sub: '#E0F2FE' }, // Modern Sky Blue
  garden: { bg: '#15803D', border: '#86EFAC', text: '#FFFFFF', sub: '#DCFCE7' }, // Botanical Forest Green
  lake: { bg: '#0369A1', border: '#93C5FD', text: '#FFFFFF', sub: '#E0F2FE' }, // Azure Lake
};

/* ── 4. CLASSIC 3D BUILDING COMPONENT ───────────────────────────── */
const MapBuilding = ({ id, onClick, isPulsing }) => {
  const n = N_CLASSIC[id];
  const { x, y, type, label, uniqueName, sub, icon: buildingIcon } = n;
  const theme = BUILDING_THEMES[type] || BUILDING_THEMES.civic;

  let icon = null;
  if (type === 'junction') {
    icon = (
      <g>
        <circle cx={x} cy={y} r={10} fill="#F8FAFC" stroke="#0E3556" strokeWidth={3} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' }} />
        <circle cx={x} cy={y} r={4.5} fill="#D97706" />
      </g>
    );
  } else {
    const imgName = IMAGE_MAP[type];
    const isStation = type === 'station';
    const imgWidth = isStation ? 115 : 62;
    const imgHeight = isStation ? 64 : 60;
    const imgX = x - imgWidth / 2;
    const imgY = y - (isStation ? 42 : 36);
    icon = (
      <g>
        {/* Soft realistic ground building shadow */}
        <ellipse cx={x} cy={y + 8} rx={imgWidth * 0.45} ry={12} fill="rgba(15,23,42,0.38)" style={{ filter: 'blur(3px)' }} />
        <image
          href={`/buildings/${imgName}.png?v=6`}
          x={imgX}
          y={imgY}
          width={imgWidth}
          height={imgHeight}
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'drop-shadow(0px 6px 12px rgba(0,0,0,0.35))' }}
        />
      </g>
    );
  }

  const badgeWidth = Math.max(108, (uniqueName || label).length * 6.6 + 26);
  const badgeYOffset = -54;

  return (
    <g style={{ cursor: 'pointer' }} onClick={() => onClick(id)}>
      {icon}

      {/* Building Badge Container with High-Visibility Colors (Placed at the top of each building) */}
      <g transform={`translate(${x}, ${y + badgeYOffset})`}>
        <rect
          x={-badgeWidth / 2}
          y="0"
          width={badgeWidth}
          height={sub ? 29 : 19}
          rx="6"
          fill={theme.bg}
          stroke={theme.border}
          strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}
        />
        {/* Primary Unique Name */}
        <text
          x="0"
          y="12"
          textAnchor="middle"
          fontFamily="Space Grotesk, system-ui, sans-serif"
          fontSize="9.5"
          fontWeight="900"
          fill={theme.text}
          letterSpacing="0.3"
        >
          {buildingIcon ? `${buildingIcon} ` : ''}{uniqueName || label}
        </text>
        {/* Standard Label / Subtitle */}
        {sub && (
          <text
            x="0"
            y="23"
            textAnchor="middle"
            fontFamily="Space Grotesk, system-ui, sans-serif"
            fontSize="7.5"
            fontWeight="800"
            fill={theme.sub}
            letterSpacing="0.2"
          >
            {label} • {sub}
          </text>
        )}
      </g>

      {isPulsing && (
        <circle cx={x} cy={y} r={40} fill="none" stroke="#E11D48" strokeWidth={3}>
          <animate attributeName="r" from="40" to="24" dur="0.6s" repeatCount="2" />
        </circle>
      )}
    </g>
  );
};

/* ── 5. REALISTIC ANIMATED PERSON (PROPORTIONAL TO 1024x571 ROAD) ── */
const RealisticWalker = ({ pos, isWalking, walkProgress, angle, currentRoadName }) => {
  const isMovingLeft = angle < -90 || angle > 90;
  const strideCycle = isWalking ? Math.sin(walkProgress * Math.PI * 14) : 0;
  const legAngle = strideCycle * 26;
  const armAngle = -strideCycle * 22;
  const bodyBob = isWalking ? Math.abs(Math.sin(walkProgress * Math.PI * 14)) * 2.2 : 0;

  return (
    <g transform={`translate(${pos.x}, ${pos.y})`}>
      {/* Radar Pulse Beacon on asphalt */}
      <circle cx="0" cy="0" r="16" fill="#3B82F6" opacity="0.25">
        <animate attributeName="r" from="6" to="22" dur="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="0" r="4.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />

      {/* Floating Road Status Badge */}
      {currentRoadName && (
        <g transform="translate(0, -42)">
          <rect x="-54" y="-9" width="108" height="18" rx="5" fill="#0F172A" stroke="#F5A623" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }} />
          <text x="0" y="3.5" textAnchor="middle" fill="#FEF08A" fontFamily="Space Grotesk, sans-serif" fontWeight="900" fontSize="9" letterSpacing="0.4">
            🚶 {currentRoadName}
          </text>
        </g>
      )}

      {/* Ground Footstep Shadow */}
      <ellipse cx="0" cy="2" rx="8" ry="3" fill="rgba(15,23,42,0.45)" style={{ filter: 'blur(1px)' }} />

      {/* Realistic 3D Human Person Scaled to Road Dimensions */}
      <g transform={`translate(0, ${-16 - bodyBob}) scale(0.62) scale(${isMovingLeft ? -1 : 1}, 1)`}>
        {/* BACKPACK */}
        <rect x="-7" y="5" width="4.5" height="12" rx="2" fill="#D97706" stroke="#B45309" strokeWidth="0.8" />

        {/* BACK ARM */}
        <g transform={`translate(4, 7) rotate(${armAngle})`}>
          <rect x="-1.6" y="0" width="3.2" height="11" rx="1.6" fill="#F59E0B" stroke="#D97706" strokeWidth="0.6" />
          <circle cx="0" cy="11" r="1.8" fill="#FCD34D" />
        </g>

        {/* BACK LEG */}
        <g transform={`translate(-2.8, 16) rotate(${-legAngle})`}>
          <rect x="-1.8" y="0" width="3.6" height="13" rx="1.4" fill="#1E293B" />
          <rect x="-1.8" y="11" width="5.2" height="3.5" rx="1.2" fill="#DC2626" />
        </g>

        {/* FRONT LEG */}
        <g transform={`translate(2.8, 16) rotate(${legAngle})`}>
          <rect x="-1.8" y="0" width="3.6" height="13" rx="1.4" fill="#334155" />
          <rect x="-1.8" y="11" width="5.2" height="3.5" rx="1.2" fill="#DC2626" />
        </g>

        {/* TORSO / JACKET */}
        <rect x="-5" y="4" width="10" height="13.5" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.9" />
        {/* Zipper */}
        <line x1="0" y1="4" x2="0" y2="17.5" stroke="#FFFFFF" strokeWidth="0.7" />

        {/* FRONT ARM */}
        <g transform={`translate(-4, 7) rotate(${-armAngle})`}>
          <rect x="-1.6" y="0" width="3.2" height="11" rx="1.6" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.6" />
          <circle cx="0" cy="11" r="1.8" fill="#FCD34D" />
        </g>

        {/* HEAD */}
        <circle cx="0" cy="-3.5" r="5.5" fill="#FCD34D" stroke="#D97706" strokeWidth="0.7" />
        {/* Cap / Visor */}
        <path d="M -5 -4 Q 0 -8 5 -4 L 6.5 -3 L 3 -2.5 Z" fill="#DC2626" />

        {/* EYES */}
        <circle cx="1.8" cy="-3.5" r="0.9" fill="#1E293B" />
      </g>
    </g>
  );
};

/* ── 6. LIVE COMPASS WITH HIGHLIGHTED CARDINAL WORD (FOR 3D MAP ONLY) ── */
const LiveCompassHUD = ({ angle = 0, currentDir = 'N' }) => {
  const norm = (angle % 360 + 360) % 360;
  let activeCardinal = currentDir || 'N';
  if (norm >= 315 || norm < 45) activeCardinal = 'N';
  else if (norm >= 45 && norm < 135) activeCardinal = 'E';
  else if (norm >= 135 && norm < 225) activeCardinal = 'S';
  else if (norm >= 225 && norm < 315) activeCardinal = 'W';

  const dirFullNames = { N: 'NORTH', E: 'EAST', S: 'SOUTH', W: 'WEST' };

  return (
    <div style={{
      position: 'absolute',
      top: '14px',
      right: '68px',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(15, 23, 42, 0.94)',
      backdropFilter: 'blur(8px)',
      border: '2px solid #F5A623',
      borderRadius: '16px',
      padding: '6px 14px 6px 10px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
    }}>
      <svg width="44" height="44" viewBox="-24 -24 48 48" style={{ display: 'block', overflow: 'visible' }}>
        <circle r="21" fill="#1E293B" stroke="#475569" strokeWidth="2" />

        <g transform={`rotate(${angle})`} style={{ transition: 'transform 0.25s ease-out' }}>
          <polygon points="0,-18 4.5,0 0,-2" fill="#EF4444" />
          <polygon points="0,-18 -4.5,0 0,-2" fill="#F87171" />
          <polygon points="0,18 4.5,0 0,2" fill="#94A3B8" />
          <polygon points="0,18 -4.5,0 0,2" fill="#CBD5E1" />
          <circle r="3.5" fill="#F5A623" stroke="#0F172A" strokeWidth="1" />
        </g>

        <text
          x="0" y="-12"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fill={activeCardinal === 'N' ? '#FEF08A' : '#EF4444'}
          style={activeCardinal === 'N' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          N
        </text>
        <text
          x="0" y="18"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fill={activeCardinal === 'S' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'S' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          S
        </text>
        <text
          x="-14" y="3"
          textAnchor="middle"
          fontSize="7"
          fontWeight="900"
          fill={activeCardinal === 'W' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'W' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          W
        </text>
        <text
          x="14" y="3"
          textAnchor="middle"
          fontSize="7"
          fontWeight="900"
          fill={activeCardinal === 'E' ? '#FEF08A' : '#94A3B8'}
          style={activeCardinal === 'E' ? { filter: 'drop-shadow(0 0 4px #FEF08A)' } : {}}
        >
          E
        </text>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Live Compass
        </div>
        <div style={{
          fontSize: '13px',
          fontWeight: 900,
          color: '#FEF08A',
          letterSpacing: '0.08em',
          textShadow: '0 0 10px rgba(254, 240, 138, 0.6)'
        }}>
          HEADING: {dirFullNames[activeCardinal]}
        </div>
      </div>
    </div>
  );
};

/* ── 7. DRAGGABLE & ZOOMABLE DIRECTION CARD HUD ─────────────────── */
const DraggableDirectionHUD = ({
  cur,
  short,
  ADJ,
  isMoving,
  hintDir,
  handleMove,
  giveHint,
  handleBack,
  pathLength,
  onExitFullScreen,
  isFullScreen,
  mapTitle = "Direction Controls"
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0, isCustom: false });
  const [scale, setScale] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, initX: 0, initY: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    if (!coords.isCustom) {
      setCoords({
        x: window.innerWidth - 240,
        y: window.innerHeight - 340,
        isCustom: true
      });
    }
  }, []);

  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    dragStart.current = {
      x: clientX,
      y: clientY,
      initX: coords.x,
      initY: coords.y
    };
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = clientX - dragStart.current.x;
      const dy = clientY - dragStart.current.y;

      const newX = Math.max(10, Math.min(window.innerWidth - 200, dragStart.current.initX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 200, dragStart.current.initY + dy));
      setCoords({ x: newX, y: newY, isCustom: true });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging]);

  const zoomIn = (e) => {
    e.stopPropagation();
    setScale(s => Math.min(1.6, +(s + 0.15).toFixed(2)));
  };

  const zoomOut = (e) => {
    e.stopPropagation();
    setScale(s => Math.max(0.7, +(s - 0.15).toFixed(2)));
  };

  const resetZoom = (e) => {
    e.stopPropagation();
    setScale(1.0);
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      style={{
        position: 'fixed',
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        zIndex: 99999,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        background: '#1A2338',
        border: '3px solid #F5A623',
        borderRadius: '24px',
        padding: '12px 14px 14px',
        boxShadow: '0 20px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1)',
        userSelect: 'none',
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
        minWidth: '190px'
      }}
    >
      {/* Top Drag Handle & Zoom Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#CBD5E1', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          <Move size={13} style={{ color: '#F5A623' }} /> {mapTitle}
        </div>

        {/* Zoom In & Out Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={zoomOut}
            title="Zoom Out Card"
            style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 900 }}
          >
            −
          </button>
          <span onClick={resetZoom} title="Click to Reset 100%" style={{ fontSize: '10px', fontWeight: 800, color: '#F5A623', cursor: 'pointer', padding: '0 3px' }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            title="Zoom In Card"
            style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: 900 }}
          >
            +
          </button>
        </div>
      </div>

      {/* D-Pad Buttons Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 56px)', gridTemplateRows: 'repeat(3, 56px)', gap: '8px', margin: '0 auto', justifyContent: 'center', opacity: isMoving ? 0.6 : 1 }}>

        {/* NORTH */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'N' ? 'hint' : ''}`}
          style={{ gridColumn: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['N']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['N']}
          onClick={() => handleMove('N')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▲</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>N</span>
        </button>

        {/* WEST */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'W' ? 'hint' : ''}`}
          style={{ gridColumn: 1, gridRow: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['W']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['W']}
          onClick={() => handleMove('W')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>◀</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>W</span>
        </button>

        {/* CENTER NODE */}
        <div style={{ gridColumn: 2, gridRow: 2, background: '#FFFFFF', borderRadius: '16px', display: 'grid', placeItems: 'center', fontSize: '14px', fontWeight: 900, color: '#0E3556', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.25)' }}>
          {short[cur]}
        </div>

        {/* EAST */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'E' ? 'hint' : ''}`}
          style={{ gridColumn: 3, gridRow: 2, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['E']) ? 'not-allowed' : 'pointer', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['E']}
          onClick={() => handleMove('E')}
        >
          {ADJ[cur]['E'] && (
            <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#2563EB', color: '#fff', fontSize: '9px', fontWeight: 900, padding: '1px 4px', borderRadius: '4px' }}>E</span>
          )}
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▶</span>
        </button>

        {/* SOUTH */}
        <button
          type="button"
          className={`dpad-btn ${hintDir === 'S' ? 'hint' : ''}`}
          style={{ gridColumn: 2, gridRow: 3, background: '#25334E', color: '#fff', border: '2px solid #3B4E74', borderRadius: '16px', fontSize: '15px', fontWeight: 900, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: (isMoving || !ADJ[cur]['S']) ? 'not-allowed' : 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
          disabled={isMoving || !ADJ[cur]['S']}
          onClick={() => handleMove('S')}
        >
          <span style={{ fontSize: '12px', lineHeight: 1 }}>▼</span>
          <span style={{ fontSize: '14px', lineHeight: 1, marginTop: '2px' }}>S</span>
        </button>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '12px' }}>
        <button
          type="button"
          onClick={giveHint}
          disabled={isMoving}
          style={{ background: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#0E3556', fontWeight: 800, cursor: isMoving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
        >
          💡 Hint
        </button>
        <button
          type="button"
          onClick={handleBack}
          disabled={isMoving || pathLength <= 1}
          style={{ background: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#0E3556', fontWeight: 800, cursor: isMoving || pathLength <= 1 ? 'not-allowed' : 'pointer', opacity: isMoving || pathLength <= 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
        >
          ↩ Back
        </button>
        {isFullScreen && (
          <button
            type="button"
            onClick={onExitFullScreen}
            style={{ background: '#EF4444', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', color: '#FFFFFF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          >
            ✕ Exit
          </button>
        )}
      </div>
    </div>
  );
};

/* ── 8. MAIN ROUTE ACTIVITY COMPONENT ───────────────────────────── */
export default function FindingRoutePage({ onMissionUnlock, onBeginChapter, onBack }) {
  const [mapMode, setMapMode] = useState('3d');
  const [mapFull, setMapFull] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [winCity, setWinCity] = useState(false);
  const [townCompletion, setTownCompletion] = useState(null);

  /* ── 8A. SEPARATE STATE FOR 3D ILLUSTRATED MAP ── */
  const [cur3D, setCur3D] = useState('RS');
  const [path3D, setPath3D] = useState(['RS']);
  const [logs3D, setLogs3D] = useState([{ html: 'Departed from <b>Railway Station</b> on 3D Map', ok: true }]);
  const [win3D, setWin3D] = useState(false);
  const [hintDir3D, setHintDir3D] = useState(null);
  const [isWalking3D, setIsWalking3D] = useState(false);
  const [walkerPos3D, setWalkerPos3D] = useState({ x: N_3D.RS.x, y: N_3D.RS.y });
  const [walkProgress3D, setWalkProgress3D] = useState(0);
  const [walkerAngle3D, setWalkerAngle3D] = useState(0);
  const [activeRoadName3D, setActiveRoadName3D] = useState(null);
  const [currentHeadingDir3D, setCurrentHeadingDir3D] = useState('N');
  const [activeWalkSegmentPts3D, setActiveWalkSegmentPts3D] = useState([]);

  /* ── 8B. SEPARATE STATE FOR CLASSIC TOWN MAP (FIG 1.1) ── */
  const [curClassic, setCurClassic] = useState('RS');
  const [pathClassic, setPathClassic] = useState(['RS']);
  const [logsClassic, setLogsClassic] = useState([{ html: 'Started at <b>Railway Station</b> (Fig 1.1)', ok: true }]);
  const [winClassic, setWinClassic] = useState(false);
  const [hintDirClassic, setHintDirClassic] = useState(null);
  const [isMovingClassic, setIsMovingClassic] = useState(false);
  const [walkerPosClassic, setWalkerPosClassic] = useState({ x: N_CLASSIC.RS.x, y: N_CLASSIC.RS.y });
  const [walkerAngleClassic, setWalkerAngleClassic] = useState(0);
  const [walkProgressClassic, setWalkProgressClassic] = useState(0);
  const [isWalkingClassic, setIsWalkingClassic] = useState(false);
  const [activeRoadNameClassic, setActiveRoadNameClassic] = useState(null);

  /* ── 8C. 3-QUESTION QUIZ STATE (FOR CLASS 6 STUDENTS) ── */
  const [answers, setAnswers] = useState({});   // { q1: 'South', ... }
  const [quizPage, setQuizPage] = useState(0); // question pages first, map basics last
  const quizBodyRef = useRef(null);
  const [quizH, setQuizH] = useState(560);      // measured height of the question area

  const logRef = useRef(null);
  const elementsRef = useRef(null);

  // Keyboard shortcut: Esc to exit full screen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mapFull) {
        setMapFull(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mapFull]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs3D, logsClassic, mapMode]);

  /* ── 9. SEPARATE 3D MAP MOVEMENT LOGIC ──────────────────────────── */
  const getRoadName = (from, to) => {
    const key1 = `${from}|${to}`, key2 = `${to}|${from}`;
    const road = ROAD_NAMES.find(r => r.edge === key1 || r.edge === key2);
    return road ? road.name : 'ROAD';
  };

  const animateWalkAlong3DRoad = (fromNode, toNode, dir) => {
    const pts = get3DRoadPoints(fromNode, toNode);
    const totalDist = pathLength(pts);
    const roadName = getRoadName(fromNode, toNode);
    setActiveRoadName3D(roadName);
    setActiveWalkSegmentPts3D(pts);
    if (dir) setCurrentHeadingDir3D(dir);

    const DURATION = 2600; // 2.6 seconds realistic human walk
    const startTime = performance.now();
    setIsWalking3D(true);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      const easeT = -(Math.cos(Math.PI * progress) - 1) / 2;
      const currentPt = pointAlong(pts, easeT * totalDist);
      const aheadPt = pointAlong(pts, Math.min(totalDist, easeT * totalDist + 6));
      const headingAngle = Math.atan2(aheadPt.y - currentPt.y, aheadPt.x - currentPt.x) * (180 / Math.PI);

      setWalkerPos3D(currentPt);
      setWalkProgress3D(progress);
      setWalkerAngle3D(headingAngle);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsWalking3D(false);
        setWalkerPos3D({ x: N_3D[toNode].x, y: N_3D[toNode].y });
        setWalkProgress3D(0);
        setTimeout(() => {
          setActiveRoadName3D(null);
          setActiveWalkSegmentPts3D([]);
        }, 1200);
      }
    };

    requestAnimationFrame(step);
  };

  const handleMove3D = (dir) => {
    if (isWalking3D) return;
    const next = ADJ_3D[cur3D][dir];
    if (!next) return;

    const fromNode = cur3D;
    const dirNames = { N: 'North', S: 'South', E: 'East', W: 'West' };
    const nextLabel = N_3D[next].label;
    const roadName = getRoadName(fromNode, next);
    const newLogs = [...logs3D, { html: `3D Walk: <b>${dirNames[dir]}</b> along <b>${roadName}</b> to <b>${nextLabel}</b>`, ok: true }];
    const newPath = [...path3D, next];

    setCur3D(next);
    setPath3D(newPath);
    setLogs3D(newLogs);
    setHintDir3D(null);
    setCurrentHeadingDir3D(dir);

    animateWalkAlong3DRoad(fromNode, next, dir);

    if (next === 'BK') {
      setTimeout(() => {
        setWin3D(true);
        if (onMissionUnlock) onMissionUnlock();
      }, 2700);
    }
  };

  const handleBack3D = () => {
    if (isWalking3D || path3D.length <= 1) return;
    const newPath = path3D.slice(0, -1);
    const prev = newPath[newPath.length - 1];
    const fromNode = cur3D;
    setCur3D(prev);
    setPath3D(newPath);
    setLogs3D([...logs3D, { html: `Walked back to <b>${N_3D[prev].label}</b>`, ok: false }]);
    setWin3D(false);
    setHintDir3D(null);

    animateWalkAlong3DRoad(fromNode, prev);
  };

  const resetGame3D = () => {
    if (isWalking3D) return;
    setCur3D('RS');
    setPath3D(['RS']);
    setLogs3D([{ html: 'Restarted at <b>Railway Station</b> on 3D Map', ok: true }]);
    setWin3D(false);
    setHintDir3D(null);
    setWalkerPos3D({ x: N_3D.RS.x, y: N_3D.RS.y });
    setActiveRoadName3D(null);
    setActiveWalkSegmentPts3D([]);
    setCurrentHeadingDir3D('N');
  };

  useEffect(() => {
    const el = quizBodyRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let lastH = 0;
    const ro = new ResizeObserver(entries => {
      const h = entries[0].contentRect.height;
      if (Math.abs(h - lastH) < 4) return;
      lastH = h;
      setQuizH(h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [showQuiz]);

  const giveHint3D = () => {
    const route = bfs3D(cur3D, 'BK');
    if (!route || route.length < 2) return;
    const next = route[1];
    for (const d in ADJ_3D[cur3D]) {
      if (ADJ_3D[cur3D][d] === next) {
        setHintDir3D(d);
        break;
      }
    }
  };

  /* ── 10. SEPARATE CLASSIC TOWN MAP MOVEMENT LOGIC ──────────────── */
  const getClassicRoadName = (a, b) => {
    const pair = [a, b].sort().join('|');
    const roadMap = {
      'HO|RS': 'STATION MARG',
      'HO|NP': 'MAHATMA GANDHI ROAD',
      'MU|NP': 'MUSEUM ROAD',
      'MK|SC': 'VIDYA MARG',
      'JT|MK': 'GRAND BAZAAR ROAD',
      'BK|JT': 'BANK STREET',
      'RS|SC': 'STATION LANE',
      'AP|HO': 'LAKEVIEW DRIVE',
      'HO|MK': 'HOSPITAL AVENUE',
      'JT|NP': 'PANCHAYAT ROAD',
      'MU|PG': 'GARDEN WAY',
      'BK|MU': 'HERITAGE BOULEVARD'
    };
    return roadMap[pair] || 'TOWN ROAD';
  };

  const animateWalkAlongClassicRoad = (fromNode, toNode) => {
    const p1 = N_CLASSIC[fromNode];
    const p2 = N_CLASSIC[toNode];
    const roadName = getClassicRoadName(fromNode, toNode);
    setActiveRoadNameClassic(roadName);
    setIsWalkingClassic(true);
    setIsMovingClassic(true);

    const headingAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    setWalkerAngleClassic(headingAngle);

    const DURATION = 800;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      const easeT = -(Math.cos(Math.PI * progress) - 1) / 2;

      const currentX = p1.x + (p2.x - p1.x) * easeT;
      const currentY = p1.y + (p2.y - p1.y) * easeT;

      setWalkerPosClassic({ x: currentX, y: currentY });
      setWalkProgressClassic(progress);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsWalkingClassic(false);
        setIsMovingClassic(false);
        setWalkerPosClassic({ x: p2.x, y: p2.y });
        setWalkProgressClassic(0);
        setTimeout(() => {
          setActiveRoadNameClassic(null);
        }, 1000);
      }
    };
    requestAnimationFrame(step);
  };

  const handleMoveClassic = (dir) => {
    if (isMovingClassic || isWalkingClassic) return;
    const next = ADJ_CLASSIC[curClassic][dir];
    if (!next) return;

    const fromNode = curClassic;
    const dirNames = { N: 'North', S: 'South', E: 'East', W: 'West' };
    const nextLabel = N_CLASSIC[next].label;
    const roadName = getClassicRoadName(fromNode, next);
    const newLogs = [...logsClassic, { html: `Town Map: Walked <b>${dirNames[dir]}</b> on <b>${roadName}</b> to <b>${nextLabel}</b>`, ok: true }];
    const newPath = [...pathClassic, next];

    setCurClassic(next);
    setPathClassic(newPath);
    setLogsClassic(newLogs);
    setHintDirClassic(null);

    animateWalkAlongClassicRoad(fromNode, next);

    if (next === 'BK') {
      setTimeout(() => {
        setWinClassic(true);
        if (onMissionUnlock) onMissionUnlock();
      }, 1200);
    }
  };

  const handleBackClassic = () => {
    if (isMovingClassic || isWalkingClassic || pathClassic.length <= 1) return;
    const newPath = pathClassic.slice(0, -1);
    const prev = newPath[newPath.length - 1];
    const fromNode = curClassic;
    setCurClassic(prev);
    setPathClassic(newPath);
    setLogsClassic([...logsClassic, { html: `Stepped back to <b>${N_CLASSIC[prev].label}</b>`, ok: false }]);
    setWinClassic(false);
    setHintDirClassic(null);

    animateWalkAlongClassicRoad(fromNode, prev);
  };

  const resetGameClassic = () => {
    if (isMovingClassic || isWalkingClassic) return;
    setCurClassic('RS');
    setPathClassic(['RS']);
    setLogsClassic([{ html: 'Restarted at <b>Railway Station</b> (Fig 1.1)', ok: true }]);
    setWinClassic(false);
    setHintDirClassic(null);
    setWalkerPosClassic({ x: N_CLASSIC.RS.x, y: N_CLASSIC.RS.y });
    setActiveRoadNameClassic(null);
  };

  const giveHintClassic = () => {
    const route = bfsClassic(curClassic, 'BK');
    if (!route || route.length < 2) return;
    const next = route[1];
    for (const d in ADJ_CLASSIC[curClassic]) {
      if (ADJ_CLASSIC[curClassic][d] === next) {
        setHintDirClassic(d);
        break;
      }
    }
  };

  // Build smooth curve points for 3D travelled history
  const full3DTravelledPoints = [];
  for (let i = 1; i < path3D.length; i++) {
    const seg = get3DRoadPoints(path3D[i - 1], path3D[i]);
    if (full3DTravelledPoints.length > 0) {
      full3DTravelledPoints.push(...seg.slice(1));
    } else {
      full3DTravelledPoints.push(...seg);
    }
  }

  const currentEdgeKey1_3D = path3D.length > 1 ? `${path3D[path3D.length - 2]}|${path3D[path3D.length - 1]}` : null;
  const currentEdgeKey2_3D = path3D.length > 1 ? `${path3D[path3D.length - 1]}|${path3D[path3D.length - 2]}` : null;

  const correctCount = MAP_QUIZ.filter(q => answers[q.id] === q.answer).length;
  const isQuizComplete = correctCount === MAP_QUIZ.length;

  // Fit as many questions on a page as the panel can actually hold, so a tall
  // screen shows fewer, fuller pages instead of half-empty ones.
  const perQuizPage = quizH >= 700 ? 3 : 2;
  const questionPages = Math.ceil(MAP_QUIZ.length / perQuizPage);
  const quizPages = questionPages + 1;          // + the map-basics page

  useEffect(() => {
    if (quizPage > quizPages - 1) setQuizPage(quizPages - 1);
  }, [quizPage, quizPages]);

  const hasWonAny = win3D || winCity || winClassic;

  // Active Map Specific Variables
  const is3DActive = mapMode === '3d';
  const activeADJ = is3DActive ? ADJ_3D : ADJ_CLASSIC;
  const activeCur = is3DActive ? cur3D : curClassic;
  const activePath = is3DActive ? path3D : pathClassic;
  const activeLogs = is3DActive ? logs3D : logsClassic;
  const activeIsMoving = is3DActive ? isWalking3D : isMovingClassic;
  const activeHintDir = is3DActive ? hintDir3D : hintDirClassic;
  const activeWin = is3DActive ? win3D : winClassic;
  const activeMoveHandler = is3DActive ? handleMove3D : handleMoveClassic;
  const activeBackHandler = is3DActive ? handleBack3D : handleBackClassic;
  const activeResetHandler = is3DActive ? resetGame3D : resetGameClassic;
  const activeHintHandler = is3DActive ? giveHint3D : giveHintClassic;

  const optTook = (is3DActive ? bfs3D('RS', 'BK') : bfsClassic('RS', 'BK')).length - 1;
  const userTook = activePath.length - 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', fontFamily: '"Space Grotesk", system-ui, sans-serif', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)' }}>

      {/* Quiz Top Action Bar */}
      {showQuiz && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1.5rem', background: '#FFF9F0', borderBottom: '2px solid #F2DFBC' }}>
          <button
            onClick={() => setShowQuiz(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#92400E', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'color 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#78350F'}
            onMouseOut={(e) => e.currentTarget.style.color = '#92400E'}
          >
            <ArrowLeft size={18} color="#92400E" /> Back to {is3DActive ? '3D Map' : 'Town Map'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: isQuizComplete ? '#16A34A' : '#D97706' }}>
            {isQuizComplete ? `🎉 All ${MAP_QUIZ.length} Questions Correct!` : `${correctCount} of ${MAP_QUIZ.length} correct — solve them all to complete`}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* LEFT PAGE - MAP CONTAINER */}
        <div style={{ flex: 1, padding: mapFull ? 0 : '12px', display: 'flex', flexDirection: 'column', borderRight: showQuiz ? '2px solid #F2DFBC' : 'none', position: 'relative', overflow: 'hidden', height: '100%', background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)' }}>

          {/* The Map Frame (Expands to Fullscreen when mapFull is true) */}
          <div style={{
            position: mapFull ? 'fixed' : 'relative',
            inset: mapFull ? 0 : 'auto',
            width: mapFull ? '100vw' : '100%',
            height: mapFull ? '100vh' : '100%',
            zIndex: mapFull ? 9999 : 1,
            background: '#FFF9F0',
            border: mapFull ? 'none' : '2px solid #F2DFBC',
            borderRadius: mapFull ? 0 : '18px',
            overflow: 'hidden',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: mapFull ? 'none' : '0 8px 30px rgba(60,40,20,0.06)'
          }}>

            {/* Top Bar Controls — Mode Switcher & Map Activity Questions Tab */}
            <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(255,249,240,0.95)', backdropFilter: 'blur(6px)', padding: '5px 8px', borderRadius: '12px', border: '1.5px solid #F2DFBC', boxShadow: '0 4px 14px rgba(60,40,20,0.08)' }}>
              <button
                type="button"
                onClick={() => { setMapMode('3d'); setShowQuiz(false); }}
                style={{
                  border: 'none',
                  background: (mapMode === '3d' && !showQuiz) ? '#92400E' : 'transparent',
                  color: (mapMode === '3d' && !showQuiz) ? '#ffffff' : '#78350F',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🏡 Town Map
              </button>
              <button
                type="button"
                onClick={() => { setMapMode('city'); setShowQuiz(false); }}
                style={{
                  border: 'none',
                  background: (mapMode === 'city' && !showQuiz) ? '#0E7490' : 'transparent',
                  color: (mapMode === 'city' && !showQuiz) ? '#ffffff' : '#0F5666',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🏙️ City Explorer
              </button>
              <button
                type="button"
                onClick={() => { setShowQuiz(true); }}
                style={{
                  border: 'none',
                  background: showQuiz ? '#16A34A' : '#FEF3C7',
                  color: showQuiz ? '#ffffff' : '#92400E',
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: showQuiz ? '0 2px 8px rgba(22,163,74,0.35)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <span>📝</span> Map Activity Questions
                <span style={{
                  background: showQuiz ? 'rgba(255,255,255,0.25)' : '#FDE68A',
                  color: showQuiz ? '#fff' : '#78350F',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 900
                }}>
                  {correctCount}/{MAP_QUIZ.length}
                </span>
              </button>
            </div>

            {/* LIVE COMPASS HUD: DISPLAYED ONLY ON 3D ILLUSTRATED MAP */}
            {mapMode === '3d' && (
              <LiveCompassHUD angle={walkerAngle3D} currentDir={currentHeadingDir3D} />
            )}



            {/* ── MODE 1: 3D ILLUSTRATED MAP ── */}
            {mapMode === '3d' && (
              <div style={{ position: 'absolute', inset: 0, paddingTop: '58px', background: '#F7F1E2' }}>
                <TownMap3DExplorer
                  onComplete={(stats) => {
                    setWin3D(true);
                    setTownCompletion(stats);
                    if (onMissionUnlock) onMissionUnlock();
                  }}
                  onNext={() => {
                    setShowQuiz(true);
                  }}
                />
              </div>
            )}

            {/* ── MODE 2: CITY EXPLORER ── */}
            {mapMode === 'city' && (
              <div style={{ position: 'absolute', inset: 0, paddingTop: '58px', background: '#F7F1E2' }}>
                <CityExplorerMap
                  onComplete={() => {
                    setWinCity(true);
                    if (onMissionUnlock) onMissionUnlock();
                  }}
                  onNext={() => {
                    setShowQuiz(true);
                  }}
                />
              </div>
            )}

            {/* ── MODE 2: CLASSIC TOWN MAP (FIG 1.1) ── */}
            {mapMode === 'classic' && (
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1E3A5F', overflow: 'hidden' }}>
                <svg viewBox="50 90 790 560" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
                  <defs>
                    <filter id="cRoadShadow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.35" floodColor="#0F172A" />
                    </filter>
                    <filter id="cTreeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.28" floodColor="#064E3B" />
                    </filter>
                    <linearGradient id="cTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4A7C2C" />
                      <stop offset="40%" stopColor="#568F33" />
                      <stop offset="70%" stopColor="#437227" />
                      <stop offset="100%" stopColor="#37601F" />
                    </linearGradient>
                    <linearGradient id="cLakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="40%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>
                    <linearGradient id="cRiverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#0369A1" />
                    </linearGradient>
                  </defs>

                  {/* 1. Realistic Base Nature Background */}
                  <image href="/buildings/background_map.jpg" x="0" y="0" width="880" height="720" preserveAspectRatio="xMidYMid slice" opacity="0.92" />

                  {/* 2. Scenic Lake Details */}
                  <g pointerEvents="none">
                    <ellipse cx="270" cy="205" rx="46" ry="32" fill="url(#cLakeGrad)" stroke="#BAE6FD" strokeWidth="2" style={{ filter: 'drop-shadow(0 4px 10px rgba(2,132,199,0.4))' }} />
                    <ellipse cx="255" cy="198" rx="20" ry="10" fill="#E0F2FE" opacity="0.4" />
                    {/* Water lilies */}
                    <circle cx="280" cy="215" r="4" fill="#22C55E" opacity="0.8" />
                    <circle cx="282" cy="214" r="1.5" fill="#F472B6" />
                    <circle cx="250" cy="210" r="3.5" fill="#22C55E" opacity="0.8" />
                    {/* Lake badge */}
                    <rect x="238" y="195" width="64" height="16" rx="4" fill="#FFFFFF" opacity="0.9" stroke="#93C5FD" strokeWidth="1" />
                    <text x="270" y="206.5" textAnchor="middle" fontSize="8" fontWeight="900" fill="#0369A1" fontFamily="'Space Grotesk', sans-serif">
                      🏞️ LAKE
                    </text>
                  </g>

                  {/* 3. Curving Railway Track to Station */}
                  <g pointerEvents="none">
                    {/* Ballast Gravel */}
                    <path d="M 60 90 Q 90 200 150 310" fill="none" stroke="#78350F" strokeWidth="14" strokeLinecap="round" opacity="0.75" />
                    {/* Wooden Sleepers */}
                    <path d="M 60 90 Q 90 200 150 310" fill="none" stroke="#451A03" strokeWidth="16" strokeDasharray="3 7" strokeLinecap="butt" />
                    {/* Steel Rails */}
                    <path d="M 57 90 Q 87 200 147 310" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                    <path d="M 63 90 Q 93 200 153 310" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                  </g>

                  {/* 4. Exact Straight High-Fidelity Asphalt Roads */}
                  <g filter="url(#cRoadShadow)">
                    {EDGES_CLASSIC.map(([a, b], idx) => {
                      const A = N_CLASSIC[a], B = N_CLASSIC[b];
                      return (
                        <g key={`classic-road-segment-${idx}`}>
                          {/* Dark Asphalt Foundation Curb */}
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#0F172A" strokeWidth={30} strokeLinecap="round" />
                          {/* Smooth Road Surface */}
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#334155" strokeWidth={26} strokeLinecap="round" />
                          {/* White Edge Lines */}
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#64748B" strokeWidth={24} strokeLinecap="round" />
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#1E293B" strokeWidth={22} strokeLinecap="round" />
                          {/* Bright Yellow Dashed Centerline */}
                          <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#FACC15" strokeWidth={2.2} strokeDasharray="8 6" strokeLinecap="butt" />
                        </g>
                      );
                    })}
                  </g>

                  {/* 5. Zebra Crossings at Street Intersections */}
                  <g pointerEvents="none">
                    {/* RS (150, 360) */}
                    <g transform="translate(150, 360)">
                      <rect x="-14" y="-4" width="28" height="8" rx="1" fill="#FFFFFF" opacity="0.9" />
                      <line x1="-10" y1="-4" x2="-10" y2="4" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="-4" y1="-4" x2="-4" y2="4" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="2" y1="-4" x2="2" y2="4" stroke="#1E293B" strokeWidth="1.5" />
                      <line x1="8" y1="-4" x2="8" y2="4" stroke="#1E293B" strokeWidth="1.5" />
                    </g>
                    {/* Hospital (350, 360) */}
                    <g transform="translate(350, 360)">
                      <rect x="-14" y="-14" width="28" height="28" rx="2" fill="#1E293B" opacity="0.4" />
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                    {/* Nagar Panchayat (550, 360) */}
                    <g transform="translate(550, 360)">
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                    {/* Museum (740, 360) */}
                    <g transform="translate(740, 360)">
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                    {/* School (150, 560) */}
                    <g transform="translate(150, 560)">
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                    {/* Market (350, 560) */}
                    <g transform="translate(350, 560)">
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                    {/* Central Junction (550, 560) */}
                    <g transform="translate(550, 560)">
                      <circle cx="0" cy="0" r="12" fill="#1E293B" />
                      <circle cx="0" cy="0" r="6" fill="#FACC15" />
                    </g>
                    {/* Bank (740, 560) */}
                    <g transform="translate(740, 560)">
                      <circle cx="0" cy="0" r="10" fill="#334155" />
                      <circle cx="0" cy="0" r="3" fill="#FACC15" />
                    </g>
                  </g>

                  {/* 6. Realistic Road Name Signboards */}
                  <g id="classic-road-names-layer" pointerEvents="none">
                    {CLASSIC_ROAD_NAMES.map(r => {
                      const badgeW = r.name.length * 5.6 + 12;
                      return (
                        <g key={r.id} transform={`translate(${r.x}, ${r.y}) rotate(${r.angle})`}>
                          <rect
                            x={-badgeW / 2}
                            y="-7.5"
                            width={badgeW}
                            height="15"
                            rx="4"
                            fill="#FEF08A"
                            opacity="0.96"
                            stroke="#D97706"
                            strokeWidth="1"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fontFamily="Space Grotesk, sans-serif"
                            fontSize="8"
                            fontWeight="900"
                            fill="#0F172A"
                            letterSpacing="0.4"
                          >
                            {r.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>

                  {/* 7. Travelled Route with Glowing Highway Dash */}
                  {pathClassic.length > 1 && (
                    <g pointerEvents="none">
                      <polyline
                        points={pathClassic.map(n => `${N_CLASSIC[n].x},${N_CLASSIC[n].y}`).join(' ')}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth={14}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.45"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.9))' }}
                      />
                      <polyline
                        points={pathClassic.map(n => `${N_CLASSIC[n].x},${N_CLASSIC[n].y}`).join(' ')}
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points={pathClassic.map(n => `${N_CLASSIC[n].x},${N_CLASSIC[n].y}`).join(' ')}
                        fill="none"
                        stroke="#FEF08A"
                        strokeWidth={2.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="10 8"
                      />
                    </g>
                  )}

                  {/* 8. Realistic Buildings & Unique Name Cards */}
                  {Object.keys(N_CLASSIC).map(k => (
                    <MapBuilding key={k} id={k} onClick={() => { }} isPulsing={false} />
                  ))}

                  {/* 9. Classic Compass Rose */}
                  <g transform="translate(818,64)">
                    <circle r={26} fill="#fff" opacity={0.95} stroke="#CBD5E1" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }} />
                    <polygon points="0,-22 5,0 0,0" fill="#c0392b" /><polygon points="0,-22 -5,0 0,0" fill="#e88b80" />
                    <polygon points="0,22 5,0 0,0" fill="#334" /><polygon points="0,22 -5,0 0,0" fill="#889" />
                    <text x={0} y={-28} textAnchor="middle" fontSize={9} fontWeight={900} fill="#DC2626">N</text>
                    <text x={0} y={36} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#5c6b7a">S</text>
                    <text x={-34} y={4} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#5c6b7a">W</text>
                    <text x={34} y={4} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#5c6b7a">E</text>
                  </g>

                  {/* 10. Realistic Animated Traveler Person Walking on Straight Asphalt Road */}
                  <RealisticWalker
                    pos={isWalkingClassic ? walkerPosClassic : N_CLASSIC[curClassic]}
                    isWalking={isWalkingClassic}
                    walkProgress={walkProgressClassic}
                    angle={walkerAngleClassic}
                    currentRoadName={activeRoadNameClassic}
                  />
                </svg>
              </div>
            )}

            {/* DRAGGABLE & ZOOMABLE FLOATING DIRECTION CARD (ACTIVE MAP SPECIFIC) */}
            {mapFull && (
              <DraggableDirectionHUD
                cur={activeCur}
                short={short}
                ADJ={activeADJ}
                isMoving={activeIsMoving}
                hintDir={activeHintDir}
                handleMove={activeMoveHandler}
                giveHint={activeHintHandler}
                handleBack={activeBackHandler}
                pathLength={activePath.length}
                onExitFullScreen={() => setMapFull(false)}
                isFullScreen={true}
                mapTitle={is3DActive ? "3D Walker" : "Town Map"}
              />
            )}

            {/* Win Overlay */}
            {(activeWin && !showQuiz && mapMode !== 'city') && (
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(9,26,44,0.65)', backdropFilter: 'blur(4px)', zIndex: 999, animation: 'fadeIn 0.3s ease' }}>
                <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '28px 32px', textAlign: 'center', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', border: '1.5px solid #E2E8F0' }}>
                  <div style={{ fontSize: '42px', marginBottom: '4px' }}>🎉</div>
                  <h3 style={{ fontFamily: '"Space Grotesk", sans-serif', color: '#10B981', fontSize: '24px', fontWeight: 900, margin: '6px 0 8px' }}>
                    You reached the Bank!
                  </h3>
                  <div style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.55, marginBottom: '20px' }}>
                    <div>
                      You completed the journey in <b>{townCompletion?.steps || activePath.length - 1 || 3} moves</b> across the town road network.
                    </div>
                    {townCompletion?.visitedPlaces && townCompletion.visitedPlaces.length > 1 && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#334155', background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexWrap: 'wrap' }}>
                        <span>📍 Route:</span>
                        {townCompletion.visitedPlaces.map((id, i) => (
                          <span key={id}>
                            {N_3D[id]?.label || id}
                            {i < townCompletion.visitedPlaces.length - 1 && ' ➔ '}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setWin3D(false);
                        setTownCompletion(null);
                        if (activeResetHandler) activeResetHandler();
                      }}
                      style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, border: '1.5px solid #CBD5E1', cursor: 'pointer', background: '#F8FAFC', color: '#475569', padding: '10px 20px', borderRadius: '12px', fontSize: '13.5px' }}
                    >
                      Play again
                    </button>
                    <button
                      onClick={() => {
                        setWin3D(false);
                        setShowQuiz(true);
                      }}
                      style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, border: 'none', cursor: 'pointer', background: '#10B981', color: '#FFFFFF', padding: '10px 22px', borderRadius: '12px', fontSize: '13.5px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
                    >
                      Next Activity →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PAGE - MAP ACTIVITY QUIZ (Displayed when Questions tab is active) */}
        <div style={{
          flex: 1,
          minHeight: 0,
          padding: 'clamp(16px, 2vw, 28px) clamp(16px, 2vw, 28px) 10px clamp(16px, 2vw, 28px)',
          position: 'relative',
          background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
          color: '#3D2E24',
          display: !showQuiz ? 'none' : 'flex',
          flexDirection: 'column',
          borderRadius: '0 18px 18px 0',
          borderLeft: '2px solid #F2DFBC',
          overflow: 'hidden'
        }}>

          {!showQuiz && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '999px', color: '#92400E', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start' }}>
                ◎ Let's play a game
              </div>
              <div style={{ fontFamily: '"Fraunces", serif', fontWeight: 900, color: '#78350F', fontSize: 'clamp(20px, 2.2vw, 26px)', margin: '6px 0 2px' }}>
                Reach the Bank
              </div>
              <div style={{ color: '#3D2E24', fontSize: '13.5px', lineHeight: 1.45, fontWeight: 600 }}>
                {is3DActive ? (
                  <>Walk the realistic curved asphalt roads on the <b>Town Map</b> from the <b>Railway Station</b> to the <b>Bank</b>.</>
                ) : (
                  <>Move the player pin along the grid roads on <b>Town Map (Fig. 1.1)</b> from the <b>Railway Station</b> to the <b>Bank</b>.</>
                )}
              </div>

              <ScrollableWithNav containerStyle={{ flex: 1, minHeight: 0, marginTop: '12px' }} scrollStyle={{ paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* Controls Box (Dedicated functionality per active map) */}
                <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800 }}>
                      {is3DActive ? (isWalking3D ? `🚶 Walking on ${activeRoadName3D || 'road'}...` : '🎨 3D Walker Controls') : (isMovingClassic ? '🧭 Moving Pin...' : '🗺️ Town Map Controls')}
                    </span>
                    <span style={{ fontSize: '11px', background: is3DActive ? '#FEF3C7' : '#DCFCE7', color: is3DActive ? '#92400E' : '#166534', border: is3DActive ? '1px solid #FDE68A' : '1px solid #86EFAC', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                      {is3DActive ? '3D Active' : 'Fig. 1.1 Active'}
                    </span>
                  </div>

                  {/* D-Pad Buttons Matrix */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)', gap: '7px', maxWidth: '220px', margin: '0 auto', opacity: activeIsMoving ? 0.6 : 1 }}>
                    <button className={`dpad-btn ${activeHintDir === 'N' ? 'hint' : ''}`} style={{ gridColumn: 2 }} disabled={activeIsMoving || !activeADJ[activeCur]['N']} onClick={() => activeMoveHandler('N')}>▲ N</button>
                    <button className={`dpad-btn ${activeHintDir === 'W' ? 'hint' : ''}`} style={{ gridColumn: 1, gridRow: 2 }} disabled={activeIsMoving || !activeADJ[activeCur]['W']} onClick={() => activeMoveHandler('W')}>◀ W</button>
                    <div style={{ gridColumn: 2, gridRow: 2, background: '#FFF9F0', borderRadius: '10px', border: '1.5px solid #F2DFBC', display: 'grid', placeItems: 'center', fontSize: '12.5px', fontWeight: 800, color: '#78350F' }}>{short[activeCur]}</div>
                    <button className={`dpad-btn ${activeHintDir === 'E' ? 'hint' : ''}`} style={{ gridColumn: 3, gridRow: 2 }} disabled={activeIsMoving || !activeADJ[activeCur]['E']} onClick={() => activeMoveHandler('E')}>E ▶</button>
                    <button className={`dpad-btn ${activeHintDir === 'S' ? 'hint' : ''}`} style={{ gridColumn: 2, gridRow: 3 }} disabled={activeIsMoving || !activeADJ[activeCur]['S']} onClick={() => activeMoveHandler('S')}>▼ S</button>
                  </div>

                  {/* Bottom Helper Buttons */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                    <button onClick={activeHintHandler} disabled={activeIsMoving} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>💡 Hint</button>
                    <button onClick={activeBackHandler} disabled={activeIsMoving || activePath.length <= 1} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving || activePath.length <= 1 ? 'not-allowed' : 'pointer', opacity: activeIsMoving || activePath.length <= 1 ? 0.4 : 1, fontWeight: 700 }}>↩ Back</button>
                    <button onClick={activeResetHandler} disabled={activeIsMoving} style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#78350F', cursor: activeIsMoving ? 'not-allowed' : 'pointer', fontWeight: 700 }}>↺ Restart</button>
                  </div>
                </div>

                {/* Breadcrumbs */}
                <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800, marginBottom: '8px' }}>
                    Progress ({is3DActive ? '3D Map' : 'Town Map'})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', fontSize: '13px' }}>
                    {activePath.map((p, i) => (
                      <React.Fragment key={i}>
                        <span style={{ fontWeight: 800, color: i === activePath.length - 1 ? '#D97706' : '#166534' }}>{N_CLASSIC[p].label}</span>
                        <span style={{ color: '#B45309', fontWeight: 900 }}>→</span>
                      </React.Fragment>
                    ))}
                    <span style={{ color: '#92400E', fontWeight: 800, border: '1.5px dashed #D97706', padding: '2px 8px', borderRadius: '6px', background: '#FEF3C7' }}>🏦 Bank</span>
                  </div>
                </div>

                {/* Journey Log */}
                <div style={{ background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: '12px 14px', boxShadow: '0 2px 8px rgba(60,40,20,0.03)' }}>
                  <div style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#92400E', fontWeight: 800, marginBottom: '8px' }}>
                    Journey log ({is3DActive ? '3D Map' : 'Town Map'})
                  </div>
                  <div ref={logRef} style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', maxHeight: '90px', overflowY: 'auto' }}>
                    {activeLogs.map((log, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#3D2E24', fontWeight: 600 }}>
                        <span style={{ color: log.ok ? '#166534' : '#991B1B', flex: '0 0 auto', fontWeight: 900 }}>{log.ok ? '✓' : '✗'}</span>
                        <span dangerouslySetInnerHTML={{ __html: log.html }}></span>
                      </div>
                    ))}
                  </div>
                </div>

              </ScrollableWithNav>
            </>
          )}

          {showQuiz && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)', overflow: 'hidden' }}>

              {/* Header — compact, never grows */}
              <div style={{ flexShrink: 0, background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: 'clamp(8px, 1.5vh, 13px) 14px', boxShadow: '0 4px 14px rgba(60,40,20,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(10px, 1.7vh, 11.5px)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800 }}>
                  <HelpCircle size={15} color="#D97706" /> Map Activity Questions (Class 6)
                </div>
                <div style={{ color: '#78350F', fontSize: 'clamp(15px, 2.6vh, 18px)', fontWeight: 900, fontFamily: '"Fraunces", serif', marginTop: '2px' }}>
                  Explore the Map Features
                </div>
              </div>

              {/* Page body — exactly what fits, no scrolling */}
              <div ref={quizBodyRef} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.2vh, 10px)' }}>

                {quizPage < questionPages && MAP_QUIZ.slice(quizPage * perQuizPage, quizPage * perQuizPage + perQuizPage).map((q, idx) => {
                  const picked = answers[q.id] || null;
                  const number = quizPage * perQuizPage + idx + 1;
                  return (
                    <div key={q.id} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: 'clamp(8px, 1.5vh, 14px)', boxShadow: '0 4px 12px rgba(60,40,20,0.03)' }}>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 'clamp(9.5px, 1.6vh, 11px)', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A', whiteSpace: 'nowrap' }}>
                          QUESTION {number}
                        </span>
                        <span style={{ color: '#92400E', fontSize: 'clamp(9.5px, 1.6vh, 11px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{q.tag}</span>
                        {picked === q.answer && <CheckCircle size={15} color="#16A34A" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                      </div>

                      <p style={{ fontSize: 'clamp(12.5px, 2.15vh, 15px)', color: '#3D2E24', fontWeight: 700, margin: 'clamp(4px, 0.9vh, 8px) 0 clamp(5px, 1.1vh, 9px) 0', lineHeight: 1.35, overflowWrap: 'anywhere' }}>
                        {q.question}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(104px, 1fr))', gap: 'clamp(5px, 1vh, 8px)', flexShrink: 0 }}>
                        {q.options.map(opt => {
                          const isPicked = picked === opt;
                          const isCorrect = opt === q.answer;
                          let btnBg = '#FFF9F0', btnBorder = '#F2DFBC', btnColor = '#3D2E24';
                          if (picked !== null) {
                            if (isCorrect) { btnBg = '#DCFCE7'; btnBorder = '#16A34A'; btnColor = '#166534'; }
                            else if (isPicked) { btnBg = '#FEE2E2'; btnBorder = '#EF4444'; btnColor = '#991B1B'; }
                          }
                          return (
                            <button
                              key={opt}
                              onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                              style={{
                                padding: 'clamp(6px, 1.2vh, 10px) 8px',
                                background: btnBg,
                                border: `2px solid ${btnBorder}`,
                                borderRadius: '10px',
                                color: btnColor,
                                fontSize: 'clamp(11.5px, 1.95vh, 13.5px)',
                                fontWeight: 800,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                fontFamily: '"Space Grotesk", sans-serif',
                                lineHeight: 1.2,
                                minWidth: 0,
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* fixed-height slot so answering never shifts the layout */}
                      <div style={{ flexShrink: 0, minHeight: 'clamp(26px, 4.4vh, 36px)', display: 'flex', alignItems: 'center', marginTop: 'clamp(3px, 0.7vh, 6px)' }}>
                        {picked && (
                          <div style={{ fontSize: 'clamp(10.5px, 1.8vh, 12.5px)', color: picked === q.answer ? '#166534' : '#991B1B', fontWeight: 700, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                            {picked === q.answer ? `✓ ${q.right}` : `✗ ${q.wrong}`}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

                {quizPage === questionPages && (
                  <div ref={elementsRef} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '14px', padding: 'clamp(10px, 1.8vh, 16px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontFamily: '"Space Grotesk", sans-serif', fontSize: 'clamp(10px, 1.7vh, 11.5px)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 800, marginBottom: 'clamp(6px, 1.3vh, 10px)', flexShrink: 0 }}>
                      <Compass size={15} color="#D97706" /> Key Elements of a Map
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.4vh, 12px)' }}>
                      <div>
                        <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: 'clamp(12.5px, 2.1vh, 14.5px)', fontWeight: 800 }}>1. Directions &amp; Compass</h4>
                        <p style={{ margin: 0, fontSize: 'clamp(11.5px, 1.95vh, 13px)', color: '#3D2E24', lineHeight: 1.4, fontWeight: 600 }}>
                          The compass shows North (top), South (bottom), East (right) and West (left).
                        </p>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: 'clamp(12.5px, 2.1vh, 14.5px)', fontWeight: 800 }}>2. Conventional Colours &amp; Symbols</h4>
                        <p style={{ margin: 0, fontSize: 'clamp(11.5px, 1.95vh, 13px)', color: '#3D2E24', lineHeight: 1.4, fontWeight: 600 }}>
                          Blue marks water bodies, green marks gardens and trees, and yellow or red marks civic landmarks.
                        </p>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 3px 0', color: '#78350F', fontSize: 'clamp(12.5px, 2.1vh, 14.5px)', fontWeight: 800 }}>3. Distance &amp; Road Routes</h4>
                        <p style={{ margin: 0, fontSize: 'clamp(11.5px, 1.95vh, 13px)', color: '#3D2E24', lineHeight: 1.4, fontWeight: 600 }}>
                          Roads connect landmarks across distances and guide travellers to their destination.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Pager — always pinned, never overlapped */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderTop: '1.5px solid #F2DFBC', paddingTop: 'clamp(5px, 1.1vh, 9px)' }}>
                <button
                  onClick={() => setQuizPage(p => Math.max(0, p - 1))}
                  disabled={quizPage === 0}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 'clamp(11.5px, 1.95vh, 13px)',
                    background: '#FFF9F0', color: '#78350F', border: '1.5px solid #F2DFBC', borderRadius: '999px',
                    padding: 'clamp(5px, 1vh, 8px) clamp(11px, 1.6vw, 16px)', cursor: quizPage === 0 ? 'not-allowed' : 'pointer',
                    opacity: quizPage === 0 ? 0.35 : 1, whiteSpace: 'nowrap'
                  }}
                >
                  ◀ Back
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78350F', fontSize: 'clamp(11px, 1.9vh, 13px)', fontWeight: 800, minWidth: 0 }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {quizPage < questionPages
                      ? `Questions ${quizPage * perQuizPage + 1}–${Math.min((quizPage + 1) * perQuizPage, MAP_QUIZ.length)} of ${MAP_QUIZ.length}`
                      : 'Map Basics'}
                  </span>
                  <span style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    {Array.from({ length: quizPages }).map((_, i) => (
                      <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === quizPage ? '#F59E0B' : '#F2DFBC' }} />
                    ))}
                  </span>
                </div>

                <button
                  onClick={() => setQuizPage(p => Math.min(quizPages - 1, p + 1))}
                  disabled={quizPage === quizPages - 1}
                  style={{
                    fontFamily: '"Space Grotesk", sans-serif', fontWeight: 800, fontSize: 'clamp(11.5px, 1.95vh, 13px)',
                    background: quizPage === quizPages - 1 ? '#F7F1E2' : '#F59E0B',
                    color: quizPage === quizPages - 1 ? '#78350F' : '#FFFFFF',
                    border: `1.5px solid ${quizPage === quizPages - 1 ? '#F2DFBC' : '#F59E0B'}`, borderRadius: '999px',
                    padding: 'clamp(5px, 1vh, 8px) clamp(11px, 1.6vw, 16px)', cursor: quizPage === quizPages - 1 ? 'not-allowed' : 'pointer',
                    opacity: quizPage === quizPages - 1 ? 0.35 : 1, whiteSpace: 'nowrap'
                  }}
                >
                  Next ▶
                </button>
              </div>

            </div>
          )}
          {/* Bottom Footer Area */}
          <div style={{ marginTop: 'auto', paddingTop: '8px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', borderTop: '1.5px solid #F2DFBC', paddingTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E', fontWeight: 800, fontSize: '12.5px' }}>
                <MapPin size={16} color="#D97706" />
                Interactive {is3DActive ? 'Town Map' : 'Town Map'} Activity
              </div>
            </div>
          </div>

        </div>
      </div>
      <ChapterBackFooter
        onBack={onBack}
        nextLabel={hasWonAny ? 'Next Activity' : 'Reach the Bank to unlock'}
        onNext={onBeginChapter}
        nextDisabled={!hasWonAny}
        nextVariant="green"
      />
    </div>
  );
}
