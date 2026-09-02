import React, { useState, useRef, useEffect, useCallback } from 'react';
import cityExplorerRealisticMap from './assets/city_explorer_realistic_map.jpg';

import person3d from './assets/person_3d.png';

/* ═══════════════════════════════════════════════════════════════════════
   CITY EXPLORER MAP — Exact 3D Coordinate Grounding Update
   
   Grounding & Realism Features:
   1. 100% Accurate Grid Alignment:
      - Intersections mapped exactly to the visual roads in the 3D map.
      - X coords: 305, 530, 750, 1045
      - Y coords: 355, 575, 745
   2. Ground-Locked Road Vehicles (Zero Floating):
      - Cars drive exactly on the visible asphalt lane centerlines.
      - Blue Sedan: Eastbound lane at Y = 363.
      - Yellow Taxi: Westbound lane at Y = 567.
      - Proper ground-contact tire shadows.
   3. Accurate Airport Runway 09/27 Landing:
      - Lands precisely on the X = 110 vertical runway strip.
      - Touchdown at Y = 130, rollout to Y = 260.
   ═══════════════════════════════════════════════════════════════════════ */

const VIEW_W = 1400;
const VIEW_H = 760;

/* ── 1. EXACT ROAD CORRIDOR COORDINATES (100% ASPHALT ROAD-LOCKED) ── */
const ROAD_X = {
  AIRPORT: 180,   // Airport Terminal Concourse Driveway on Northern Blvd
  PARK:    250,   // Botanical Park Main Entrance Gate on Grand Ave
  WEST:    405,   // West Avenue (marked 'WEST AVE' with yellow car)
  MUSEUM:  560,   // Heritage Museum Portico Entrance Steps on Crossway
  CINEMA:  560,   // Star Cinema Marquee Entrance on Grand Ave
  CENTRAL: 690,   // Central Avenue (marked 'CENTRAL AVE' with white dash lines)
  MALL:    870,   // City Mall Main Glass Entrance on Crossway
  HOSPITAL:870,   // Metropolitan Hospital Roundabout Entrance on Grand Ave
  EAST:    1045,  // East Avenue (between Mall/Hospital and Hotel/Bus Station)
  HOTEL:   1170,  // Luxury Hotel Resort Driveway on Northern Blvd
  PIER:    1225,  // Sunset Beach Boardwalk & Wooden Ocean Pier
};

const ROAD_Y = {
  NORTH: 115,  // Northern Boulevard (marked 'NORTHERN BLVD' with cars)
  MID:   325,  // Central Crossway (Asphalt crossroad between Museum/Mall and Cinema/Hospital)
  SOUTH: 560,  // Grand Avenue (marked 'GRAND AVE' with cars, ON ASPHALT above beach sand)
  PIER:  715,  // Sunset Beach Pier Dock (Wooden Boardwalk over water)
};

/* ── 2. CLEAN ROAD-LOCKED PLACES WITH DEDICATED BUILDING ENTRANCE PATHS ── */
const PLACES = [
  // ── ROW 1: Northern Boulevard (Y = 115) ──
  {
    id: 'AIRPORT',
    name: 'Skyline Airport', full: 'Skyline International Airport Terminal Concourse',
    x: ROAD_X.AIRPORT, y: ROAD_Y.NORTH,
    icon: '✈️', type: 'airport', start: true,
    blurb: 'International passenger terminal entrance driveway on Northern Boulevard.'
  },
  {
    id: 'WEST_N',
    name: 'West Avenue North', full: 'Northern Boulevard & West Avenue Junction',
    x: ROAD_X.WEST, y: ROAD_Y.NORTH,
    icon: '🧭', type: 'junction',
    blurb: 'Main intersection connecting the Airport to West Avenue.'
  },
  {
    id: 'MUSEUM_N',
    name: 'Heritage Plaza North', full: 'Heritage Museum North Plaza & Central Avenue',
    x: ROAD_X.CENTRAL, y: ROAD_Y.NORTH,
    icon: '🏛️', type: 'junction',
    blurb: 'Museum north garden intersection at Northern Blvd & Central Ave.'
  },
  {
    id: 'MALL_N',
    name: 'City Mall North', full: 'City Shopping Mall North Plaza & East Avenue',
    x: ROAD_X.EAST, y: ROAD_Y.NORTH,
    icon: '🛍️', type: 'junction',
    blurb: 'Mall north concourse at Northern Blvd & East Ave.'
  },
  {
    id: 'HOTEL_N',
    name: 'Luxury Hotel Driveway', full: 'The Grand Luxury Hotel Resort Entrance',
    x: ROAD_X.HOTEL, y: ROAD_Y.NORTH,
    icon: '🏨', type: 'hotel',
    blurb: '5-star skyscraper resort canopy entrance on Northern Boulevard.'
  },

  // ── ROW 2: Central Crossway (Y = 325) ──
  {
    id: 'STADIUM',
    name: 'Olympic Stadium', full: 'Olympic Champions Stadium Main Entrance',
    x: ROAD_X.WEST, y: ROAD_Y.MID,
    icon: '🏟️', type: 'stadium',
    blurb: 'Championship athletic arena entrance on West Avenue & Central Crossway.'
  },
  {
    id: 'MUSEUM',
    name: 'Heritage Museum', full: 'Royal Heritage Fine Arts Museum Main Steps',
    x: ROAD_X.MUSEUM, y: ROAD_Y.MID,
    icon: '🏛️', type: 'museum',
    blurb: 'Classical museum grand entrance steps and plaza on Central Crossway.'
  },
  {
    id: 'CENTRAL_M',
    name: 'Central Plaza', full: 'Central Avenue & Crossway Junction',
    x: ROAD_X.CENTRAL, y: ROAD_Y.MID,
    icon: '🧭', type: 'junction',
    blurb: 'Central city crossroads between Museum, Cinema, Mall, and Hospital.'
  },
  {
    id: 'MALL',
    name: 'City Mall', full: 'City Centre Shopping Mall Main Glass Entrance',
    x: ROAD_X.MALL, y: ROAD_Y.MID,
    icon: '🛍️', type: 'mall',
    blurb: 'Retail shopping galleria grand glass doors on Central Crossway.'
  },
  {
    id: 'HOTEL',
    name: 'Resort Concourse', full: 'Luxury Hotel & Bus Station Concourse',
    x: ROAD_X.EAST, y: ROAD_Y.MID,
    icon: '🧭', type: 'junction',
    blurb: 'Resort boulevard junction on East Avenue & Central Crossway.'
  },

  // ── ROW 3: Grand Avenue (Y = 560) & Sunset Beach Pier (Y = 715) ──
  {
    id: 'PARK',
    name: 'Botanical Park', full: 'Greenfield Botanical Greenhouse Park Gate',
    x: ROAD_X.PARK, y: ROAD_Y.SOUTH,
    icon: '🌳', type: 'park',
    blurb: 'Botanical greenhouse palm promenade entrance on Grand Avenue.'
  },
  {
    id: 'WEST_S',
    name: 'West Avenue South', full: 'Grand Avenue & West Avenue Junction',
    x: ROAD_X.WEST, y: ROAD_Y.SOUTH,
    icon: '🧭', type: 'junction',
    blurb: 'Southwest boulevard junction connecting Stadium and Botanical Park.'
  },
  {
    id: 'CINEMA',
    name: 'Star Cinema', full: 'Star Cinema Theatre Marquee Entrance',
    x: ROAD_X.CINEMA, y: ROAD_Y.SOUTH,
    icon: '🎬', type: 'cinema',
    blurb: 'Art-deco IMAX theatre box office & marquee entrance on Grand Avenue.'
  },
  {
    id: 'CENTRAL_S',
    name: 'Central Beach Walk', full: 'Central Avenue & Grand Avenue Promenade',
    x: ROAD_X.CENTRAL, y: ROAD_Y.SOUTH,
    icon: '🧭', type: 'junction',
    blurb: 'Beachfront central promenade crosswalk along Grand Avenue.'
  },
  {
    id: 'HOSPITAL',
    name: 'City Hospital', full: 'Metropolitan Hospital Emergency & Main Entrance',
    x: ROAD_X.HOSPITAL, y: ROAD_Y.SOUTH,
    icon: '🏥', type: 'hospital',
    blurb: '24/7 trauma medical center circular entrance driveway on Grand Avenue.'
  },
  {
    id: 'BUS_TERMINAL',
    name: 'Bus Station', full: 'Central Transit Bus Terminal Entrance',
    x: ROAD_X.EAST, y: ROAD_Y.SOUTH,
    icon: '🚌', type: 'busstop',
    blurb: 'Regional transit bus passenger concourse on Grand Avenue.'
  },
  {
    id: 'PIER_GATE',
    name: 'Boardwalk Entrance', full: 'Sunset Beach Boardwalk Entrance Gate',
    x: ROAD_X.PIER, y: ROAD_Y.SOUTH,
    icon: '🌊', type: 'junction',
    blurb: 'Entrance gate leading onto the scenic wooden ocean boardwalk pier.'
  },
  {
    id: 'BEACH',
    name: 'Sunset Beach Pier', full: 'Sunset Beach Ocean Boardwalk & Boat Dock',
    x: ROAD_X.PIER, y: ROAD_Y.PIER,
    icon: '🏖️', type: 'beach', goal: true,
    blurb: 'Golden shoreline sands and wooden ocean boardwalk pier dock.'
  },

  // ── LEFT & RIGHT CORNER ROAD DEAD END NODES (Shows "Wrong Direction" Popup) ──
  // Left Side 3 Road Ends:
  { id: 'DEAD_NW', name: 'Airport Runway West', full: 'Airport Tarmac (Dead End)', x: 35, y: ROAD_Y.NORTH, icon: '🛑', type: 'empty', blurb: 'Restricted airport tarmac perimeter.' },
  { id: 'DEAD_MW', name: 'Stadium West Gate', full: 'Stadium West Concourse (Dead End)', x: 300, y: ROAD_Y.MID, icon: '🛑', type: 'empty', blurb: 'Stadium arena parking boundary.' },
  { id: 'DEAD_SW', name: 'Botanical West Fence', full: 'Botanical Park Boundary (Dead End)', x: 35, y: ROAD_Y.SOUTH, icon: '🛑', type: 'empty', blurb: 'Botanical garden west fence perimeter.' },

  // Right Side 3 Road Ends:
  { id: 'DEAD_NE', name: 'East Coast Highway', full: 'East Coast Highway (Dead End)', x: 1365, y: ROAD_Y.NORTH, icon: '🛑', type: 'empty', blurb: 'Coastal expressway perimeter.' },
  { id: 'DEAD_ME', name: 'East Commercial Alley', full: 'East Commercial Alley (Dead End)', x: 1365, y: ROAD_Y.MID, icon: '🛑', type: 'empty', blurb: 'Eastern commercial zone boundary.' },
  { id: 'DEAD_SE', name: 'Ocean Shoreline East', full: 'Ocean Coastline (Dead End)', x: 1365, y: ROAD_Y.SOUTH, icon: '🛑', type: 'empty', blurb: 'Open ocean coastline east of beach.' },
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

/* ── 3. STRICT ROAD & ENTRANCE-LOCKED ADJACENCY WITH DEAD ENDS ─────── */
const ADJ = {
  // Row 1 (Northern Blvd Y = 115)
  DEAD_NW:        { E: 'AIRPORT' },
  AIRPORT:        { W: 'DEAD_NW', E: 'WEST_N' },
  WEST_N:         { W: 'AIRPORT', E: 'MUSEUM_N', S: 'STADIUM' },
  MUSEUM_N:       { W: 'WEST_N', E: 'MALL_N', S: 'CENTRAL_M' },
  MALL_N:         { W: 'MUSEUM_N', E: 'HOTEL_N', S: 'HOTEL' },
  HOTEL_N:        { W: 'MALL_N', E: 'DEAD_NE' },
  DEAD_NE:        { W: 'HOTEL_N' },

  // Row 2 (Central Crossway Y = 325)
  DEAD_MW:        { E: 'STADIUM' },
  STADIUM:        { W: 'DEAD_MW', N: 'WEST_N', E: 'MUSEUM', S: 'WEST_S' },
  MUSEUM:         { W: 'STADIUM', E: 'CENTRAL_M' },
  CENTRAL_M:      { W: 'MUSEUM', N: 'MUSEUM_N', E: 'MALL', S: 'CENTRAL_S' },
  MALL:           { W: 'CENTRAL_M', E: 'HOTEL' },
  HOTEL:          { W: 'MALL', N: 'MALL_N', E: 'DEAD_ME', S: 'BUS_TERMINAL' },
  DEAD_ME:        { W: 'HOTEL' },

  // Row 3 (Grand Ave Y = 560) & Pier Boardwalk
  DEAD_SW:        { E: 'PARK' },
  PARK:           { W: 'DEAD_SW', E: 'WEST_S' },
  WEST_S:         { W: 'PARK', N: 'STADIUM', E: 'CINEMA' },
  CINEMA:         { W: 'WEST_S', E: 'CENTRAL_S' },
  CENTRAL_S:      { W: 'CINEMA', N: 'CENTRAL_M', E: 'HOSPITAL' },
  HOSPITAL:       { W: 'CENTRAL_S', E: 'BUS_TERMINAL' },
  BUS_TERMINAL:   { W: 'HOSPITAL', N: 'HOTEL', E: 'PIER_GATE' },
  PIER_GATE:      { W: 'BUS_TERMINAL', E: 'DEAD_SE', S: 'BEACH' },
  DEAD_SE:        { W: 'PIER_GATE' },
  BEACH:          { N: 'PIER_GATE' },
};

function getRoadPathPoints(a, b) {
  const pa = BY_ID[a], pb = BY_ID[b];
  if (pa && pb) {
    return [[pa.x, pa.y], [pb.x, pb.y]];
  }
  return [[ROAD_X.WEST, ROAD_Y.NORTH], [ROAD_X.CENTRAL, ROAD_Y.NORTH]];
}

const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };

function streetBetween(aId, bId) {
  const pa = BY_ID[aId], pb = BY_ID[bId];
  if (!pa || !pb) return 'the street';
  if (Math.abs(pa.y - pb.y) < 15) {
    if (Math.abs(pa.y - 115) < 25) return 'Northern Boulevard';
    if (Math.abs(pa.y - 325) < 25) return 'Central Crossway';
    if (Math.abs(pa.y - 560) < 25) return 'Grand Avenue';
  }
  if (Math.abs(pa.x - pb.x) < 15) {
    if (Math.abs(pa.x - 405) < 25) return 'West Avenue';
    if (Math.abs(pa.x - 690) < 25) return 'Central Avenue';
    if (Math.abs(pa.x - 1045) < 25) return 'East Avenue';
    if (Math.abs(pa.x - 1225) < 25) return 'Sunset Pier Boardwalk';
  }
  return 'the avenue';
}

/* ── 5. REALISTIC ARTICULATED 3D HUMAN EXPLORER (NATURAL BIPEDAL WALK) ── */
const Realistic3DPerson = ({ x, y, angle, isWalking }) => {
  const facingLeft = angle === 'W' || angle === 270;
  
  return (
    <g transform={`translate(${x},${y})`} pointerEvents="none">
      {/* 1. Dynamic Dual Foot Shadows */}
      <g opacity="0.85">
        {/* Main Ambient Ground Shadow */}
        <ellipse cx="0" cy="3" rx="20" ry="7" fill="rgba(0,0,0,0.35)" style={{ filter: 'blur(3px)' }} />
        {/* Left Foot Contact Shadow */}
        <ellipse
          cx="-8"
          cy="3"
          rx="9"
          ry="4"
          fill="rgba(0,0,0,0.75)"
          style={{
            filter: 'blur(1px)',
            animation: isWalking ? 'leftFootShadow 0.65s infinite ease-in-out' : 'none'
          }}
        />
        {/* Right Foot Contact Shadow */}
        <ellipse
          cx="8"
          cy="3"
          rx="9"
          ry="4"
          fill="rgba(0,0,0,0.75)"
          style={{
            filter: 'blur(1px)',
            animation: isWalking ? 'rightFootShadow 0.65s infinite ease-in-out' : 'none'
          }}
        />
      </g>

      {/* 2. Asphalt Footstep Dust / Stepping Ripples */}
      {isWalking && (
        <g opacity="0.6">
          <circle cx="-10" cy="3" r="5" fill="#E2E8F0" style={{ filter: 'blur(1.5px)', animation: 'stepDustLeft 0.65s infinite ease-out' }} />
          <circle cx="10" cy="3" r="5" fill="#E2E8F0" style={{ filter: 'blur(1.5px)', animation: 'stepDustRight 0.65s infinite ease-out' }} />
        </g>
      )}

      {/* 3. GPS Location Beacon / Target Ground Ring */}
      {!isWalking && (
        <circle
          cx="0"
          cy="0"
          r="22"
          fill="none"
          stroke="#38BDF8"
          style={{ animation: 'pulseRing 1.8s infinite cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        />
      )}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="1.8"
        opacity="0.8"
        strokeDasharray={isWalking ? '4 2' : 'none'}
      />
      <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[angle] || 0})`}>
        <polygon
          points="0,-26 5,-18 -5,-18"
          fill="#38BDF8"
          style={{
            filter: 'drop-shadow(0 0 5px #38BDF8)',
            animation: isWalking ? 'dirArrowBob 0.3s infinite ease-in-out' : 'none'
          }}
        />
      </g>

      {/* 4. Articulated Skeletal Animated Human Character */}
      <g
        transform={`translate(0, 2) scale(${facingLeft ? -1 : 1}, 1)`}
        style={{
          transformOrigin: '0 0',
        }}
      >
        <svg
          x="-35"
          y="-85"
          width="70"
          height="90"
          viewBox="-35 -85 70 90"
          overflow="visible"
        >
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5C381E" />
              <stop offset="100%" stopColor="#2E1B0E" />
            </linearGradient>
            <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="60%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="jacketInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="70%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="backpackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>

          {/* ── BACK ARM ── */}
          <g
            style={{
              transformOrigin: '-5px -52px',
              animation: isWalking ? 'backArmSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="-10" y="-52" width="7" height="15" rx="3.5" fill="url(#jacketGrad)" />
            <g style={{ transformOrigin: '-7px -38px', animation: isWalking ? 'backForearmBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="-9.5" y="-38" width="6" height="14" rx="3" fill="#1D4ED8" />
              <circle cx="-6.5" cy="-23" r="3.5" fill="url(#skinGrad)" />
            </g>
          </g>

          {/* ── BACKPACK ── */}
          <g style={{ animation: isWalking ? 'torsoBob 0.65s infinite ease-in-out' : 'idleBreathing 2s infinite ease-in-out' }}>
            <rect x="-17" y="-62" width="10" height="24" rx="4" fill="url(#backpackGrad)" stroke="#064E3B" strokeWidth="0.8" />
            <rect x="-19" y="-65" width="12" height="7" rx="3" fill="#047857" />
            <rect x="-16" y="-52" width="4" height="11" rx="2" fill="#38BDF8" opacity="0.9" />
          </g>

          {/* ── BACK / LEFT LEG ── */}
          <g
            style={{
              transformOrigin: '-3px -30px',
              animation: isWalking ? 'leftLegSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="-6" y="-30" width="7" height="16" rx="3.5" fill="url(#pantsGrad)" />
            <g style={{ transformOrigin: '-2.5px -15px', animation: isWalking ? 'leftKneeBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="-5.5" y="-15" width="6" height="15" rx="3" fill="#1E293B" />
              <g transform="translate(-6.5, -2)">
                <path d="M 0 0 L 11 0 Q 14 0 14 -3 L 13 -6 Q 10 -6 8 -4 L 2 -4 Z" fill="url(#shoeGrad)" />
                <rect x="-1" y="-1" width="16" height="2.5" rx="1" fill="#FFFFFF" />
                <line x1="5" y1="-4" x2="8" y2="-4" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ── FRONT / RIGHT LEG ── */}
          <g
            style={{
              transformOrigin: '4px -30px',
              animation: isWalking ? 'rightLegSwing 0.65s infinite ease-in-out' : 'none'
            }}
          >
            <rect x="1" y="-30" width="7.5" height="16" rx="3.5" fill="url(#pantsGrad)" />
            <g style={{ transformOrigin: '4.5px -15px', animation: isWalking ? 'rightKneeBend 0.65s infinite ease-in-out' : 'none' }}>
              <rect x="1.5" y="-15" width="6.5" height="15" rx="3" fill="#1E293B" />
              <g transform="translate(0.5, -2)">
                <path d="M 0 0 L 11 0 Q 14 0 14 -3 L 13 -6 Q 10 -6 8 -4 L 2 -4 Z" fill="url(#shoeGrad)" />
                <rect x="-1" y="-1" width="16" height="2.5" rx="1" fill="#FFFFFF" />
                <line x1="5" y1="-4" x2="8" y2="-4" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ── TORSO & HEAD ── */}
          <g
            style={{
              transformOrigin: '0 -30px',
              animation: isWalking
                ? 'torsoBob 0.65s infinite ease-in-out'
                : 'idleBreathing 2.2s infinite ease-in-out'
            }}
          >
            {/* Belt */}
            <rect x="-8" y="-33" width="16" height="6" rx="2" fill="#0F172A" />
            <rect x="-2" y="-33" width="4" height="4" rx="1" fill="#F59E0B" />

            {/* Jacket Body */}
            <path
              d="M -9 -33 L -11 -56 Q -11 -60 -6 -61 L 6 -61 Q 11 -60 11 -56 L 9 -33 Z"
              fill="url(#jacketGrad)"
              stroke="#1E3A8A"
              strokeWidth="0.8"
            />
            <path d="M -3 -61 L 0 -33 L 3 -61 Z" fill="url(#jacketInner)" />
            <line x1="0" y1="-61" x2="0" y2="-33" stroke="#F59E0B" strokeWidth="1" />
            <polygon points="-6,-61 0,-54 6,-61 8,-64 -8,-64" fill="#1D4ED8" />

            {/* Neck */}
            <rect x="-3" y="-66" width="6" height="6" rx="2" fill="url(#skinGrad)" />

            {/* 3D Head */}
            <g transform="translate(0, -68)">
              <circle cx="0" cy="-6" r="9.5" fill="url(#skinGrad)" />
              <circle cx="-9" cy="-6" r="2.5" fill="url(#skinGrad)" />
              <circle cx="9" cy="-6" r="2.5" fill="url(#skinGrad)" />

              <ellipse cx="3.5" cy="-6.5" rx="1.5" ry="2.2" fill="#1E293B" />
              <circle cx="4.2" cy="-7.2" r="0.6" fill="#FFFFFF" />
              <path d="M 1.5 -10 Q 4 -11.5 6.5 -10" fill="none" stroke="#5C381E" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 2 -3.5 Q 4.5 -1.5 7 -3.5" fill="none" stroke="#C2410C" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="5" cy="-3.8" rx="2" ry="1.2" fill="#FCA5A5" opacity="0.6" />

              <path
                d="M -10 -7 C -11 -16 -4 -19 3 -18 C 9 -17 12 -12 11 -7 C 9 -8 7 -6 7 -4 C 5 -10 0 -10 -2 -8 C -4 -11 -9 -9 -10 -7 Z"
                fill="url(#hairGrad)"
              />
              <path d="M 3 -18 Q 8 -19 11 -13 Q 8 -13 6 -11 Z" fill="#78350F" />
            </g>

            {/* ── FRONT ARM ── */}
            <g
              style={{
                transformOrigin: '7px -52px',
                animation: isWalking ? 'frontArmSwing 0.65s infinite ease-in-out' : 'none'
              }}
            >
              <rect x="3.5" y="-52" width="7.5" height="15" rx="3.75" fill="url(#jacketGrad)" />
              <g style={{ transformOrigin: '7px -38px', animation: isWalking ? 'frontForearmBend 0.65s infinite ease-in-out' : 'none' }}>
                <rect x="4" y="-38" width="6.5" height="14" rx="3.2" fill="#2563EB" />
                <circle cx="7.2" cy="-23" r="3.8" fill="url(#skinGrad)" />
                <g transform="translate(6, -24) rotate(-15)">
                  <rect x="-3" y="-3" width="7" height="9" rx="1.5" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
                  <rect x="-2" y="-2" width="5" height="5" fill="#38BDF8" opacity="0.9" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </g>
    </g>
  );
};



/* ── 8. WRONG DIRECTION POPUP ──────────────────────────────────────── */
const WrongDirPopup = ({ show, direction }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, rgba(30,41,59,0.96), rgba(15,23,42,0.98))',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 28px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 24px rgba(239,68,68,0.35)',
      textAlign: 'center',
      minWidth: '260px',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: '26px', marginBottom: '4px' }}>🛑</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.5px' }}>
        WRONG DIRECTION!
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>
        No road leading {direction?.toUpperCase() || 'this way'}.
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
        You cannot walk over buildings. Follow the asphalt roads!
      </div>
    </div>
  );
};

const EmptyRoadPopup = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: '28%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, #1E293B, #0F172A)',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 24px rgba(239,68,68,0.4)',
      textAlign: 'center',
      minWidth: '280px',
      pointerEvents: 'none'
    }}>
      <div style={{ fontSize: '26px', marginBottom: '4px' }}>🛑</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.03em' }}>
        DEAD END — WRONG DIRECTION!
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>
        This road leads to a dead end outside the city.
      </div>
      <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>
        Turn around to navigate toward Sunset Beach!
      </div>
    </div>
  );
};

/* ── CITY MAP ACTIVITY QUESTIONS (4 QUESTIONS WITH 3 OPTIONS EACH) ── */
const CITY_MAP_QUESTIONS = [
  {
    id: 'cq1',
    tag: 'Directions & Spatial',
    question: '1. In which general direction is Sunset Beach located from the City Airport?',
    options: [
      'South-East (SE)',
      'North-West (NW)',
      'Due North'
    ],
    answer: 'South-East (SE)',
    right: 'Correct! Sunset Beach is located in the South-Eastern sector of the city map.',
    wrong: 'Look at the map compass: Sunset Beach is to the South and East of the Airport.'
  },
  {
    id: 'cq2',
    tag: 'City Landmarks',
    question: '2. Which landmark is situated along Central Avenue between the Police Station and City Library?',
    options: [
      'City Museum',
      'Luxury Grand Hotel',
      'Underground Metro'
    ],
    answer: 'City Museum',
    right: 'Correct! The City Museum is located centrally along Central Avenue.',
    wrong: 'Check the Central Avenue corridor on the left to identify the central museum.'
  },
  {
    id: 'cq3',
    tag: 'Routes & Proximity',
    question: '3. If you travel along Palm Boulevard from Sunset Beach, which major facility is nearest?',
    options: [
      'City Shopping Mall',
      'Airport Terminal',
      'Botanical Park'
    ],
    answer: 'City Shopping Mall',
    right: 'Correct! City Mall is right along Palm Boulevard directly connected from the Beach.',
    wrong: 'Trace the connected road north-east from the beach to find City Mall.'
  },
  {
    id: 'cq4',
    tag: 'Map Understanding',
    question: '4. What is the primary purpose of street symbols, road lines, and landmark icons on this city map?',
    options: [
      'To help locate places, find routes, and understand spatial directions',
      'Only to decorate the screen with colorful drawings',
      'To show live weather forecasts for each building'
    ],
    answer: 'To help locate places, find routes, and understand spatial directions',
    right: 'Correct! Maps use standardized symbols and landmarks to enable accurate spatial navigation.',
    wrong: 'Maps are designed to represent physical spatial relationships and directions.'
  }
];

/* ── 9. MAIN CITY EXPLORER COMPONENT ────────────────────────────────── */
const CityExplorerMap = ({ onComplete, onNext }) => {
  const START = 'AIRPORT';
  const GOAL = 'BEACH';

  const [cur, setCur] = useState(START);
  const [personPos, setPersonPos] = useState({ x: BY_ID[START].x, y: BY_ID[START].y });
  const [isWalking, setIsWalking] = useState(false);
  const [heading, setHeading] = useState('E');
  const [activeStreet, setActiveStreet] = useState('Central Avenue');
  const [trail, setTrail] = useState([{ x: BY_ID[START].x, y: BY_ID[START].y }]);
  const [visited, setVisited] = useState({ [START]: true });
  const [log, setLog] = useState([{ text: `Ready at ${BY_ID[START].name}. Walk to ${BY_ID[GOAL].name}!`, ok: true }]);
  const [won, setWon] = useState(false);
  const [wrongDir, setWrongDir] = useState(null);
  const [emptyWarn, setEmptyWarn] = useState(false);

  /* ── CITY MAP QUIZ STATE ── */
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizPage, setQuizPage] = useState(0);

  /* ── ZOOM, PAN & MAP-ALONE FULLSCREEN STATE ── */
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMapOnlyFullscreen, setIsMapOnlyFullscreen] = useState(false);

  /* ── DRAGGABLE & MINIMIZABLE DIRECTION CONTROLS STATE ── */
  const viewportRef = useRef(null);
  const [visitedSequence, setVisitedSequence] = useState([START]);
  const [dpadPos, setDpadPos] = useState(null);
  const [isDpadDragging, setIsDpadDragging] = useState(false);
  const [dpadDragOffset, setDpadDragOffset] = useState({ x: 0, y: 0 });
  const [isDpadMinimized, setIsDpadMinimized] = useState(false);
  const [isSidebarDpadMinimized, setIsSidebarDpadMinimized] = useState(false);

  const handleZoomIn = () => setZoom(z => Math.min(3.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => {
    setZoom(z => {
      const next = Math.max(0.65, +(z - 0.25).toFixed(2));
      return next;
    });
  };
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const toggleMapOnlyFullscreen = () => {
    setIsMapOnlyFullscreen(v => !v);
  };

  const startDpadDrag = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const vp = viewportRef.current;
    if (!vp) return;
    const rect = vp.getBoundingClientRect();
    const currentX = dpadPos ? dpadPos.x : (rect.width - 205);
    const currentY = dpadPos ? dpadPos.y : (rect.height - (isDpadMinimized ? 65 : 225));
    setIsDpadDragging(true);
    setDpadDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY
    });
  };

  const handleMouseMove = (e) => {
    if (isDpadDragging && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const rawX = e.clientX - rect.left - dpadDragOffset.x;
      const rawY = e.clientY - rect.top - dpadDragOffset.y;
      const dpadW = isDpadMinimized ? 170 : 190;
      const dpadH = isDpadMinimized ? 50 : 230;
      const clampedX = Math.max(10, Math.min(rect.width - dpadW - 10, rawX));
      const clampedY = Math.max(10, Math.min(rect.height - dpadH - 10, rawY));
      setDpadPos({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setIsDpadDragging(false);
  };

  const logRef = useRef(null);
  const walkRafRef = useRef(null);



  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  useEffect(() => {
    return () => {
      if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    };
  }, []);

  /* ── KEYBOARD ARROW CONTROLS (FULLSCREEN & NORMAL) ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        walkTo('N');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        walkTo('S');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        walkTo('W');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        walkTo('E');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cur, isWalking, won]);

  const walkTo = (dir) => {
    if (isWalking || won) return;
    const targetId = ADJ[cur] && ADJ[cur][dir];
    if (!targetId) {
      setWrongDir(DIR_WORD[dir]);
      setTimeout(() => setWrongDir(null), 1400);
      return;
    }

    const target = BY_ID[targetId];
    const street = streetBetween(cur, targetId);
    const waypoints = getRoadPathPoints(cur, targetId);

    setIsWalking(true);
    setHeading(dir);
    setActiveStreet(street);
    setWrongDir(null);

    const startPos = { ...personPos };
    const endPos = { x: waypoints[waypoints.length - 1][0], y: waypoints[waypoints.length - 1][1] };
    const duration = 1100;
    const startT = performance.now();

    const step = (now) => {
      const elapsed = now - startT;
      const t = Math.min(1, elapsed / duration);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      if (waypoints.length === 2) {
        const cx = waypoints[0][0] + (waypoints[1][0] - waypoints[0][0]) * ease;
        const cy = waypoints[0][1] + (waypoints[1][1] - waypoints[0][1]) * ease;
        setPersonPos({ x: cx, y: cy });
      } else {
        const midIdx = ease < 0.5 ? 0 : 1;
        const subT = ease < 0.5 ? ease * 2 : (ease - 0.5) * 2;
        const p0 = waypoints[midIdx];
        const p1 = waypoints[midIdx + 1];
        const cx = p0[0] + (p1[0] - p0[0]) * subT;
        const cy = p0[1] + (p1[1] - p0[1]) * subT;
        setPersonPos({ x: cx, y: cy });
      }

      if (t < 1) {
        walkRafRef.current = requestAnimationFrame(step);
      } else {
        setPersonPos(endPos);
        setIsWalking(false);
        setCur(targetId);
        setTrail(tr => [...tr, endPos]);
        setVisited(v => ({ ...v, [targetId]: true }));
        if (target.type !== 'empty') {
          setVisitedSequence(seq => seq.includes(targetId) ? seq : [...seq, targetId]);
        }
        setLog(l => [...l, { text: `Walked ${DIR_WORD[dir]} along ${street} to ${target.name}.`, ok: true }]);

        if (target.type === 'empty') {
          setEmptyWarn(true);
          setTimeout(() => setEmptyWarn(false), 2800);
          setLog(l => [...l, { text: `⚠️ Wrong Direction! No buildings nearby on this road. Turn back or navigate toward a landmark!`, ok: false }]);
        }

        if (targetId === GOAL) {
          setWon(true);
          setLog(l => [...l, { text: `🎉 Reached ${BY_ID[GOAL].name}! Navigation successfully completed.`, ok: true }]);
          const finalVisited = target.type !== 'empty' && !visitedSequence.includes(targetId)
            ? [...visitedSequence, targetId]
            : visitedSequence;
          if (onComplete) onComplete({ steps: trail.length, visitedPlaces: finalVisited });
        }
      }
    };

    walkRafRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (walkRafRef.current) cancelAnimationFrame(walkRafRef.current);
    setCur(START);
    setPersonPos({ x: BY_ID[START].x, y: BY_ID[START].y });
    setIsWalking(false);
    setHeading('E');
    setActiveStreet('Central Avenue');
    setTrail([{ x: BY_ID[START].x, y: BY_ID[START].y }]);
    setVisited({ [START]: true });
    setVisitedSequence([START]);
    setWon(false);
    setWrongDir(null);
    setEmptyWarn(false);
    setLog([{ text: `Returned to ${BY_ID[START].name}. Walk to ${BY_ID[GOAL].name}!`, ok: true }]);
  };

  const curPlace = BY_ID[cur];
  const available = {
    N: ADJ[cur]?.N ? BY_ID[ADJ[cur].N] : null,
    S: ADJ[cur]?.S ? BY_ID[ADJ[cur].S] : null,
    E: ADJ[cur]?.E ? BY_ID[ADJ[cur].E] : null,
    W: ADJ[cur]?.W ? BY_ID[ADJ[cur].W] : null,
  };

  const DirBtn = ({ dir, label, arrow, gridArea, isCompact }) => {
    const nb = available[dir];
    const off = !nb || isWalking || won;
    return (
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          walkTo(dir);
        }}
        disabled={off}
        title={nb ? `Walk ${DIR_WORD[dir]} to ${nb.name}` : `No road going ${DIR_WORD[dir]}`}
        style={{
          gridArea,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: isCompact ? '0px' : '2px',
          border: off ? '1.5px dashed #CBD5E1' : 'none',
          background: off
            ? '#F8FAFC'
            : 'linear-gradient(145deg, #0284C7 0%, #0369A1 100%)',
          color: off ? '#94A3B8' : '#FFFFFF',
          opacity: off ? 0.45 : 1,
          borderRadius: '12px',
          padding: isCompact ? '6px 2px' : '10px 4px',
          cursor: off ? 'not-allowed' : 'pointer',
          pointerEvents: off ? 'none' : 'auto',
          fontWeight: 800,
          transition: 'all 0.15s ease',
          boxShadow: off ? 'none' : '0 4px 14px rgba(2,132,199,0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ fontSize: isCompact ? '11px' : '13px', lineHeight: 1 }}>{arrow}</span>
          <span style={{ fontSize: isCompact ? '13px' : '15px', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
        </div>
        {!isCompact && (
          <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.9, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {nb ? nb.name : '—'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: isMapOnlyFullscreen ? 'fixed' : 'relative',
        inset: isMapOnlyFullscreen ? 0 : 'auto',
        zIndex: isMapOnlyFullscreen ? 99999 : 1,
        width: isMapOnlyFullscreen ? '100vw' : '100%',
        height: isMapOnlyFullscreen ? '100vh' : '100%',
        display: 'flex',
        padding: isMapOnlyFullscreen ? 0 : '14px',
        gap: isMapOnlyFullscreen ? 0 : '14px',
        overflow: 'hidden',
        background: isMapOnlyFullscreen ? '#FFFDF7' : '#F7F1E2',
        fontFamily: '"Space Grotesk", sans-serif',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        /* 1. Torso Bob */
        @keyframes torsoBob {
          0%   { transform: translateY(0px) scale(1, 1); }
          25%  { transform: translateY(-3.5px) scale(0.98, 1.02); }
          50%  { transform: translateY(0.5px) scale(1.02, 0.98); }
          75%  { transform: translateY(-3.5px) scale(0.98, 1.02); }
          100% { transform: translateY(0px) scale(1, 1); }
        }

        /* 2. Left Leg Hip Swing */
        @keyframes leftLegSwing {
          0%   { transform: rotate(-26deg); }
          50%  { transform: rotate(26deg); }
          100% { transform: rotate(-26deg); }
        }

        /* 3. Left Knee Bend */
        @keyframes leftKneeBend {
          0%   { transform: rotate(8deg); }
          25%  { transform: rotate(38deg); }
          50%  { transform: rotate(5deg); }
          75%  { transform: rotate(0deg); }
          100% { transform: rotate(8deg); }
        }

        /* 4. Right Leg Hip Swing */
        @keyframes rightLegSwing {
          0%   { transform: rotate(26deg); }
          50%  { transform: rotate(-26deg); }
          100% { transform: rotate(26deg); }
        }

        /* 5. Right Knee Bend */
        @keyframes rightKneeBend {
          0%   { transform: rotate(5deg); }
          25%  { transform: rotate(0deg); }
          50%  { transform: rotate(8deg); }
          75%  { transform: rotate(38deg); }
          100% { transform: rotate(5deg); }
        }

        /* 6. Front Arm Swing */
        @keyframes frontArmSwing {
          0%   { transform: rotate(-28deg); }
          50%  { transform: rotate(28deg); }
          100% { transform: rotate(-28deg); }
        }
        @keyframes frontForearmBend {
          0%   { transform: rotate(-10deg); }
          50%  { transform: rotate(-32deg); }
          100% { transform: rotate(-10deg); }
        }

        /* 7. Back Arm Swing */
        @keyframes backArmSwing {
          0%   { transform: rotate(28deg); }
          50%  { transform: rotate(-28deg); }
          100% { transform: rotate(28deg); }
        }
        @keyframes backForearmBend {
          0%   { transform: rotate(-32deg); }
          50%  { transform: rotate(-10deg); }
          100% { transform: rotate(-32deg); }
        }

        /* 8. Foot Shadow Pulsing with Step Contact */
        @keyframes leftFootShadow {
          0%   { transform: scale(0.65); opacity: 0.35; }
          50%  { transform: scale(1.15); opacity: 0.85; }
          100% { transform: scale(0.65); opacity: 0.35; }
        }
        @keyframes rightFootShadow {
          0%   { transform: scale(1.15); opacity: 0.85; }
          50%  { transform: scale(0.65); opacity: 0.35; }
          100% { transform: scale(1.15); opacity: 0.85; }
        }

        /* 9. Footstep Dust Ripples */
        @keyframes stepDustLeft {
          0%, 45% { r: 2px; opacity: 0; }
          50%     { r: 5px; opacity: 0.8; }
          75%     { r: 14px; opacity: 0; }
          100%    { r: 2px; opacity: 0; }
        }
        @keyframes stepDustRight {
          0%      { r: 5px; opacity: 0.8; }
          25%     { r: 14px; opacity: 0; }
          50%, 95%{ r: 2px; opacity: 0; }
          100%    { r: 5px; opacity: 0.8; }
        }

        /* 10. Idle Breathing */
        @keyframes idleBreathing {
          0%   { transform: translateY(0px) scale(1, 1); }
          50%  { transform: translateY(-2.5px) scale(0.99, 1.015); }
          100% { transform: translateY(0px) scale(1, 1); }
        }

        @keyframes pulseRing {
          0% { r: 16px; opacity: 0.85; stroke-width: 2.5px; }
          100% { r: 36px; opacity: 0; stroke-width: 0.5px; }
        }

        @keyframes dirArrowBob {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* ══════════ BOX 1: 3D MAP VIEWPORT (STANDALONE BOX) ══════════ */}
      <div
        ref={viewportRef}
        style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          minWidth: 0,
          background: '#FFFBEB',
          borderRadius: isMapOnlyFullscreen ? 0 : '18px',
          border: isMapOnlyFullscreen ? 'none' : '2px solid #FDE68A',
          boxShadow: isMapOnlyFullscreen ? 'none' : '0 6px 24px rgba(180, 83, 9, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
          overflow: 'hidden',
          cursor: 'default'
        }}
      >

        <WrongDirPopup show={!!wrongDir} direction={wrongDir} />
        <EmptyRoadPopup show={emptyWarn} />

        {/* ── TOP RIGHT TOOLBAR (ZOOM CONTROLS & FULLSCREEN TOGGLE) ── */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1.5px solid #FDE68A',
          borderRadius: '12px',
          padding: '4px 6px',
          boxShadow: '0 4px 16px rgba(60,40,20,0.08)'
        }}>
          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (−)"
            style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              color: '#0284C7',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              fontSize: '15px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            −
          </button>

          {/* Zoom Level Indicator */}
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#78350F', minWidth: '38px', textAlign: 'center', userSelect: 'none' }}>
            {Math.round(zoom * 100)}%
          </span>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+)"
            style={{
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              color: '#0284C7',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              fontSize: '15px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            +
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            title="Reset View"
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              color: '#78350F',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              fontSize: '13px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            ⟲
          </button>

          <div style={{ width: '1px', height: '18px', background: 'rgba(217,119,6,0.2)', margin: '0 2px' }} />

          {/* Fullscreen Toggle Symbol Button */}
          <button
            type="button"
            onClick={toggleMapOnlyFullscreen}
            title={isMapOnlyFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            style={{
              background: isMapOnlyFullscreen ? '#EF4444' : '#0284C7',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              fontSize: isMapOnlyFullscreen ? '14px' : '15px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.15s'
            }}
          >
            {isMapOnlyFullscreen ? '✕' : '⛶'}
          </button>
        </div>

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <g
            transform={zoom === 1 ? undefined : `scale(${zoom})`}
            style={{
              transformOrigin: `${VIEW_W / 2}px ${VIEW_H / 2}px`,
              transition: 'transform 0.15s ease-out'
            }}
          >
            <defs>
              <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ---------- 1. Exact 3D Architectural City Model Background ---------- */}
            <image
              href={cityExplorerRealisticMap}
              xlinkHref={cityExplorerRealisticMap}
              x="0"
              y="0"
              width={VIEW_W}
              height={VIEW_H}
              preserveAspectRatio="none"
            />



            {/* ---------- 3. Clean Route Trail Ribbon ---------- */}
            {trail.length > 1 && (
              <>
                <polyline
                  points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                />
                <polyline
                  points={trail.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
              </>
            )}

            {/* ---------- 4. Clean Waypoints on Asphalt & Perimeter Ends ---------- */}
            {PLACES.map(p => {
              const isCur = cur === p.id;
              const isGoal = p.id === GOAL;
              const isSeen = visited[p.id];
              const isEmpty = p.type === 'empty';
              return (
                <g key={p.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
                  <circle
                    cx="0"
                    cy="0"
                    r={isCur ? 13 : isGoal ? 12 : isEmpty ? 8 : 7}
                    fill={isCur ? '#0284C7' : isGoal ? '#10B981' : isEmpty ? (isSeen ? '#EF4444' : '#7F1D1D') : isSeen ? '#334155' : '#1E293B'}
                    stroke={isEmpty ? '#EF4444' : '#FFFFFF'}
                    strokeWidth={isCur ? 2.5 : isEmpty ? 1.8 : 1.5}
                    opacity={isCur || isGoal || isEmpty ? 1 : 0.75}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  {isEmpty ? (
                    <text x="0" y="3.5" textAnchor="middle" fontSize="8.5" fill="#FCA5A5">🛑</text>
                  ) : (
                    <circle cx="0" cy="0" r={isCur ? 4.5 : 2.5} fill="#FFFFFF" />
                  )}
                </g>
              );
            })}

            {/* ---------- 7. Realistic 3D Person Walker (Player Directions) ---------- */}
            <Realistic3DPerson
              x={personPos.x}
              y={personPos.y}
              angle={heading}
              isWalking={isWalking}
            />
          </g>
        </svg>

        {/* ── DRAGGABLE & MINIMIZABLE FLOATING DIRECTION CONTROLS (FULLSCREEN) ── */}
        {isMapOnlyFullscreen && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: dpadPos ? `${dpadPos.x}px` : 'auto',
              top: dpadPos ? `${dpadPos.y}px` : 'auto',
              right: dpadPos ? 'auto' : '20px',
              bottom: dpadPos ? 'auto' : '20px',
              zIndex: 160,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(14px)',
              border: '2px solid rgba(56, 189, 248, 0.45)',
              borderRadius: isDpadMinimized ? '999px' : '20px',
              padding: isDpadMinimized ? '8px 14px' : '10px 14px 12px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(2, 132, 199, 0.3)',
              display: 'flex',
              flexDirection: isDpadMinimized ? 'row' : 'column',
              alignItems: 'center',
              gap: isDpadMinimized ? '10px' : '8px',
              userSelect: 'none',
              cursor: isDpadDragging ? 'grabbing' : 'default',
              transition: isDpadDragging ? 'none' : 'box-shadow 0.2s ease, border-radius 0.2s ease'
            }}
          >
            {/* Drag Handle & Header */}
            <div
              onMouseDown={startDpadDrag}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: isDpadMinimized ? 'auto' : '100%',
                gap: '8px',
                cursor: 'grab',
                padding: '2px 0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', cursor: 'grab', letterSpacing: '-1px' }}>⋮⋮</span>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.6px' }}>
                  🧭 {isDpadMinimized ? 'CONTROLS' : 'DIRECTION CONTROLS'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {!isDpadMinimized && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); reset(); }}
                    title="Reset Position"
                    style={{
                      background: 'transparent',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      color: '#94A3B8',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      cursor: 'pointer'
                    }}
                  >
                    ↺
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsDpadMinimized(v => !v); }}
                  title={isDpadMinimized ? 'Expand Direction Controls' : 'Minimize Direction Controls'}
                  style={{
                    background: '#1E293B',
                    border: '1px solid #475569',
                    borderRadius: '6px',
                    color: '#E2E8F0',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '2px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isDpadMinimized ? '➕' : '➖'}
                </button>
              </div>
            </div>

            {/* Expanded D-Pad Content */}
            {!isDpadMinimized && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 48px)',
                  gridTemplateRows: 'repeat(3, 44px)',
                  gridTemplateAreas: `
                    ". N ."
                    "W . E"
                    ". S ."
                  `,
                  gap: '6px'
                }}>
                  <DirBtn dir="N" label="N" arrow="▲" gridArea="N" isCompact />
                  <DirBtn dir="W" label="W" arrow="◀" gridArea="W" isCompact />
                  <DirBtn dir="E" label="E" arrow="▶" gridArea="E" isCompact />
                  <DirBtn dir="S" label="S" arrow="▼" gridArea="S" isCompact />
                </div>
              </>
            )}
          </div>
        )}

        {/* Bottom-Left Compass & Corridor HUD */}
        <div style={{
          position: 'absolute',
          bottom: isMapOnlyFullscreen ? '20px' : '14px',
          left: isMapOnlyFullscreen ? '20px' : '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '8px 16px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 6px 20px rgba(60, 40, 20, 0.1)',
          zIndex: 110
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="34" height="34" viewBox="-20 -20 40 40">
              <circle r="18" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1.5" />
              <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[heading]})`} style={{ transition: 'transform 0.25s ease' }}>
                <polygon points="0,-14 4,0 0,-1" fill="#EF4444" />
                <polygon points="0,-14 -4,0 0,-1" fill="#F87171" />
                <polygon points="0,14 4,0 0,1" fill="#94A3B8" />
                <polygon points="0,14 -4,0 0,1" fill="#CBD5E1" />
              </g>
            </svg>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', letterSpacing: '1px' }}>HEADING</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#B45309' }}>{DIR_WORD[heading].toUpperCase()}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: '#FDE68A' }} />

          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', letterSpacing: '1px' }}>CORRIDOR</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>{activeStreet}</div>
          </div>
        </div>
      </div>

      {/* ══════════ BOX 2: RIGHT STATION (PARALLEL SIDE-BY-SIDE ALIGNMENT) ══════════ */}
      {showQuizModal ? (
        <div style={{
          width: 'clamp(340px, 26vw, 390px)',
          flexShrink: 0,
          height: '100%',
          background: 'linear-gradient(165deg, #FFFDF8 0%, #FEF3C7 100%)',
          borderRadius: '16px',
          border: '2px solid #FDE68A',
          boxShadow: '0 8px 24px rgba(180, 83, 9, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          display: isMapOnlyFullscreen ? 'none' : 'flex',
          flexDirection: 'column',
          padding: '10px 12px',
          gap: '6px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FDE68A',
            borderRadius: '10px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(60,40,20,0.04)'
          }}>
            <div>
              <div style={{ fontSize: '8.5px', fontWeight: 900, color: '#B45309', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                📝 MAP ACTIVITY QUESTIONS
              </div>
              <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#1E293B', marginTop: '1px' }}>
                Question {quizPage + 1} of {CITY_MAP_QUESTIONS.length}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowQuizModal(false)}
              title="Return to Direction Controls"
              style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                borderRadius: '7px',
                padding: '3px 8px',
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#92400E',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🧭 Walk Mode
            </button>
          </div>

          {/* 4 Step Progress Bar */}
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {CITY_MAP_QUESTIONS.map((q, idx) => {
              const isAnswered = !!quizAnswers[q.id];
              const isCurrent = idx === quizPage;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuizPage(idx)}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '3px',
                    background: isCurrent
                      ? '#0284C7'
                      : isAnswered
                      ? '#10B981'
                      : '#E2E8F0',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  title={`Go to Question ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Active Question Card */}
          {(() => {
            const q = CITY_MAP_QUESTIONS[quizPage] || CITY_MAP_QUESTIONS[0];
            const picked = quizAnswers[q.id] || null;
            const isCorrect = picked === q.answer;
            const optionLabels = ['A', 'B', 'C'];

            return (
              <div style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#FFFFFF',
                border: `1.5px solid ${isCorrect ? '#10B981' : picked ? '#EF4444' : '#FDE68A'}`,
                borderRadius: '12px',
                padding: '9px 11px',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(60,40,20,0.05)',
                overflow: 'hidden'
              }}>
                {/* Question Header & Category */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{
                        background: '#E0F2FE',
                        color: '#0369A1',
                        border: '1px solid #BAE6FD',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: '5px',
                        letterSpacing: '0.4px'
                      }}>
                        Q{quizPage + 1}
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: '#78350F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {q.tag}
                      </span>
                    </div>
                    {picked && (
                      <span style={{
                        background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                        border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                        color: isCorrect ? '#065F46' : '#991B1B',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '1px 7px',
                        borderRadius: '999px'
                      }}>
                        {isCorrect ? '✓ Correct' : '✗ Try Again'}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#1E293B', lineHeight: 1.35 }}>
                    {q.question}
                  </div>
                </div>

                {/* 3 Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {q.options.map((opt, oIdx) => {
                    const isOptionPicked = picked === opt;
                    const isOptionCorrect = opt === q.answer;
                    let bg = '#FFFBEB';
                    let border = '#FDE68A';
                    let color = '#78350F';
                    let badgeBg = '#FEF3C7';
                    let badgeColor = '#92400E';

                    if (picked !== null) {
                      if (isOptionCorrect) {
                        bg = '#ECFDF5';
                        border = '#10B981';
                        color = '#065F46';
                        badgeBg = '#10B981';
                        badgeColor = '#FFFFFF';
                      } else if (isOptionPicked) {
                        bg = '#FEF2F2';
                        border = '#EF4444';
                        color = '#991B1B';
                        badgeBg = '#EF4444';
                        badgeColor = '#FFFFFF';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQuizAnswers(a => ({ ...a, [q.id]: opt }))}
                        style={{
                          textAlign: 'left',
                          padding: '7px 10px',
                          background: bg,
                          border: `1.5px solid ${border}`,
                          borderRadius: '8px',
                          color: color,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: '"Space Grotesk", sans-serif',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          lineHeight: 1.3
                        }}
                      >
                        <span style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: badgeBg,
                          color: badgeColor,
                          fontSize: '9.5px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {optionLabels[oIdx]}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {picked ? (
                  <div style={{
                    padding: '6px 9px',
                    borderRadius: '7px',
                    background: isCorrect ? '#ECFDF5' : '#FEF2F2',
                    border: `1px solid ${isCorrect ? '#10B981' : '#EF4444'}`,
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isCorrect ? '#065F46' : '#991B1B',
                    lineHeight: 1.35
                  }}>
                    {isCorrect ? `✓ ${q.right}` : `✗ ${q.wrong}`}
                  </div>
                ) : (
                  <div style={{
                    background: '#FFFBEB',
                    border: '1px dashed #FDE68A',
                    borderRadius: '7px',
                    padding: '5px 8px',
                    fontSize: '9.5px',
                    color: '#78350F',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>💡</span>
                    <span>Observe the City Map on the left to find the correct answer.</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Footer Controls & Paging */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            borderTop: '1px solid #FDE68A',
            paddingTop: '6px',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={() => setQuizPage(p => Math.max(0, p - 1))}
              disabled={quizPage === 0}
              style={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: '10px',
                background: '#FEF3C7',
                color: '#78350F',
                border: '1px solid #FDE68A',
                borderRadius: '7px',
                padding: '5px 10px',
                cursor: quizPage === 0 ? 'not-allowed' : 'pointer',
                opacity: quizPage === 0 ? 0.35 : 1
              }}
            >
              ◀ Back
            </button>

            <div style={{ display: 'flex', gap: '4px' }}>
              {CITY_MAP_QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i === quizPage ? '#0284C7' : '#E2E8F0',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>

            {quizPage < CITY_MAP_QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => setQuizPage(p => p + 1)}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 800,
                  fontSize: '10px',
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
                }}
              >
                Next ▶
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onNext) onNext();
                  else if (onComplete) onComplete();
                }}
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 900,
                  fontSize: '10px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}
              >
                Next Activity ➔
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          width: 'clamp(340px, 26vw, 390px)',
          flexShrink: 0,
          height: '100%',
          background: 'linear-gradient(165deg, #FFFDF8 0%, #FEF3C7 100%)',
          borderRadius: '16px',
          border: '2px solid #FDE68A',
          boxShadow: '0 8px 24px rgba(180, 83, 9, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          display: isMapOnlyFullscreen ? 'none' : 'flex',
          flexDirection: 'column',
          padding: '8px 10px',
          gap: '6px',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          {/* 1. Mission Card */}
          <div style={{
            background: won ? '#ECFDF5' : '#FFFFFF',
            border: `1.5px solid ${won ? '#10B981' : '#FDE68A'}`,
            borderRadius: '10px',
            padding: '6px 8px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(60, 40, 20, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8.5px', fontWeight: 900, color: won ? '#065F46' : '#B45309', letterSpacing: '0.8px' }}>
                🎯 NAVIGATION MISSION
              </span>
              <span style={{
                fontSize: '8.5px',
                fontWeight: 800,
                color: won ? '#065F46' : '#92400E',
                background: won ? '#D1FAE5' : '#FEF3C7',
                border: `1px solid ${won ? '#A7F3D0' : '#FDE68A'}`,
                padding: '1px 5px',
                borderRadius: '4px'
              }}>
                {won ? 'COMPLETED ✓' : 'IN PROGRESS'}
              </span>
            </div>

            <div style={{ fontSize: '11px', fontWeight: 700, color: '#3D2E24', marginTop: '2px', lineHeight: 1.3 }}>
              {won
                ? '🎉 Mission Complete! You reached Sunset Beach.'
                : <>Walk from <b style={{ color: '#78350F' }}>Skyline Airport</b> to <b style={{ color: '#78350F' }}>Sunset Beach</b>.</>}
            </div>

            {won && (
              <button
                type="button"
                onClick={() => setShowQuizModal(true)}
                style={{
                  marginTop: '5px',
                  width: '100%',
                  background: 'linear-gradient(145deg, #10B981, #059669)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 8px',
                  fontSize: '11px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.45)',
                  transition: 'all 0.2s ease'
                }}
              >
                Continue to Map Questions ➔
              </button>
            )}
          </div>

          {/* 2. Current Location Card */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FDE68A',
            borderRadius: '10px',
            padding: '5px 8px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(60, 40, 20, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '8.5px', fontWeight: 900, color: '#92400E', letterSpacing: '0.8px' }}>📍 CURRENT LOCATION</span>
              <span style={{ fontSize: '8.5px', fontWeight: 800, color: '#0369A1', background: '#E0F2FE', border: '1px solid #BAE6FD', padding: '1px 5px', borderRadius: '4px' }}>
                {activeStreet}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '17px', flexShrink: 0 }}>{curPlace.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 900, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {curPlace.name}
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {curPlace.full}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Direction Controls (D-pad) */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FDE68A',
            borderRadius: '10px',
            padding: '5px 8px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(60, 40, 20, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSidebarDpadMinimized ? '0' : '3px' }}>
              <span style={{ fontSize: '8.5px', fontWeight: 900, color: '#92400E', letterSpacing: '0.8px' }}>🧭 DIRECTION CONTROLS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '4px',
                    color: '#92400E', fontSize: '8.5px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
                  }}
                >
                  ↺ Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsSidebarDpadMinimized(v => !v)}
                  title={isSidebarDpadMinimized ? "Expand Controls" : "Minimize Controls"}
                  style={{
                    background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '4px',
                    color: '#92400E', fontSize: '8.5px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
                  }}
                >
                  {isSidebarDpadMinimized ? '➕' : '➖'}
                </button>
              </div>
            </div>

            {!isSidebarDpadMinimized && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 25px)',
                gridTemplateAreas: `
                  ". N ."
                  "W . E"
                  ". S ."
                `,
                gap: '3px',
                maxWidth: '200px',
                margin: '0 auto'
              }}>
                <DirBtn dir="N" label="N" arrow="▲" gridArea="N" isCompact />
                <DirBtn dir="W" label="W" arrow="◀" gridArea="W" isCompact />
                <DirBtn dir="E" label="E" arrow="▶" gridArea="E" isCompact />
                <DirBtn dir="S" label="S" arrow="▼" gridArea="S" isCompact />
              </div>
            )}
          </div>

          {/* 4. Places Visited Grid */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FDE68A',
            borderRadius: '10px',
            padding: '5px 8px',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(60, 40, 20, 0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#B45309', letterSpacing: '0.8px' }}>
                📍 PLACES VISITED
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: [
                  'AIRPORT', 'MUSEUM', 'MALL', 'HOTEL_N', 'STADIUM', 'CINEMA', 'HOSPITAL', 'BUS_TERMINAL', 'PARK', 'BEACH'
                ].filter(id => visited[id]).length === 10 ? '#065F46' : '#92400E',
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                padding: '1px 5px',
                borderRadius: '4px'
              }}>
                {[
                  'AIRPORT', 'MUSEUM', 'MALL', 'HOTEL_N', 'STADIUM', 'CINEMA', 'HOSPITAL', 'BUS_TERMINAL', 'PARK', 'BEACH'
                ].filter(id => visited[id]).length} / 10
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '3px', background: '#FEF3C7', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
              <div style={{
                width: `${([
                  'AIRPORT', 'MUSEUM', 'MALL', 'HOTEL_N', 'STADIUM', 'CINEMA', 'HOSPITAL', 'BUS_TERMINAL', 'PARK', 'BEACH'
                ].filter(id => visited[id]).length / 10) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284C7, #10B981)',
                borderRadius: '2px',
                transition: 'width 0.35s ease'
              }} />
            </div>

            {/* 2-column Grid of Place Chips */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '4px',
              flex: 1,
              minHeight: 0
            }}>
              {[
                { id: 'AIRPORT', name: 'Airport', icon: '✈️' },
                { id: 'MUSEUM', name: 'Museum', icon: '🏛️' },
                { id: 'MALL', name: 'City Mall', icon: '🛍️' },
                { id: 'HOTEL_N', name: 'Luxury Hotel', icon: '🏨' },
                { id: 'STADIUM', name: 'Stadium', icon: '🏟️' },
                { id: 'CINEMA', name: 'Cinema', icon: '🎬' },
                { id: 'HOSPITAL', name: 'Hospital', icon: '🏥' },
                { id: 'BUS_TERMINAL', name: 'Bus Station', icon: '🚌' },
                { id: 'PARK', name: 'Botanical Park', icon: '🌳' },
                { id: 'BEACH', name: 'Sunset Beach', icon: '🏖️' },
              ].map(lm => {
                const isVisited = !!visited[lm.id];
                const isCurrent = cur === lm.id;
                return (
                  <div
                    key={lm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: isVisited || isCurrent ? 800 : 600,
                      background: isCurrent
                        ? '#FEF3C7'
                        : isVisited
                        ? '#ECFDF5'
                        : '#F8FAFC',
                      border: `1.5px solid ${
                        isCurrent
                          ? '#F59E0B'
                          : isVisited
                          ? '#A7F3D0'
                          : '#E2E8F0'
                      }`,
                      boxShadow: isCurrent ? '0 0 8px rgba(245, 158, 11, 0.4)' : 'none',
                      color: isCurrent
                        ? '#92400E'
                        : isVisited
                        ? '#065F46'
                        : '#64748B',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    <span style={{ fontSize: '13px', flexShrink: 0 }}>{lm.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {lm.name}
                    </span>
                    {isVisited && (
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 900, flexShrink: 0 }}>
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityExplorerMap;
