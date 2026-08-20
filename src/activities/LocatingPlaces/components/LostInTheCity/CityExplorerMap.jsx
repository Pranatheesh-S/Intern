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

/* ── 1. EXACT ROAD CORRIDOR COORDINATES (100% ROAD-LOCKED) ────────── */
const ROAD_X = {
  WEST: 310,       // West Avenue between Airport/Stadium and Cinema/Fire Station
  CENTER_L: 510,   // Civic Way between Cinema/Fire Station and City Hospital/Offices
  CENTER_R: 735,   // Grand Avenue between Hospital/Offices and Hotel/Bus Station
  EAST: 1040,      // Port Lane east of Hotel/Bus Station
};

const ROAD_Y = {
  TOP: 255,        // Northern Boulevard running across the top road corridor
  MID: 505,        // Central Avenue running across the middle road corridor
  BOT: 735,        // Coastal Drive running along the shoreline
};

/* ── 2. PLACES CONFIGURATION (STRICTLY ON ASPHALT INTERSECTIONS) ─────── */
const PLACES = [
  // Row 0 (Y = 255: Northern Boulevard)
  {
    id: 'AIRPORT',
    name: 'Skyline Airport', full: 'Skyline International Airport',
    x: ROAD_X.WEST, y: ROAD_Y.TOP,
    icon: '✈️', type: 'airport', start: true,
    blurb: 'International runway terminal concourse at Northern Blvd.'
  },
  {
    id: 'CINEMA',
    name: 'Star Cineplex', full: 'Star Cineplex Theatre',
    x: ROAD_X.CENTER_L, y: ROAD_Y.TOP,
    icon: '🎬', type: 'cinema',
    blurb: 'Art deco premiere cinema junction at Northern Blvd & Civic Way.'
  },
  {
    id: 'MALL',
    name: 'City Centre Mall', full: 'City Centre Shopping Mall',
    x: ROAD_X.CENTER_R, y: ROAD_Y.TOP,
    icon: '🛍️', type: 'mall',
    blurb: 'Glass retail atrium at Northern Blvd & Grand Avenue.'
  },
  {
    id: 'HOTEL',
    name: 'Grand Hotel', full: 'The Coastal Grand Luxury Hotel',
    x: ROAD_X.EAST, y: ROAD_Y.TOP,
    icon: '🏨', type: 'hotel',
    blurb: 'Modern skyscraper hotel junction at Northern Blvd & Port Lane.'
  },

  // Row 1 (Y = 505: Central Avenue)
  {
    id: 'PARK',
    name: 'Greenfield Park', full: 'Greenfield Botanical City Park',
    x: ROAD_X.WEST, y: ROAD_Y.MID,
    icon: '🌳', type: 'park',
    blurb: 'Botanical freshwater park crossroads at Central Ave & West Ave.'
  },
  {
    id: 'LIBRARY',
    name: 'Public Library', full: 'Civic Public Heritage Library',
    x: ROAD_X.CENTER_L, y: ROAD_Y.MID,
    icon: '📚', type: 'library',
    blurb: 'Civic library town hall crossroads at Central Ave & Civic Way.'
  },
  {
    id: 'HOSPITAL',
    name: 'Central Hospital', full: 'Metropolitan Central Hospital',
    x: ROAD_X.CENTER_R, y: ROAD_Y.MID,
    icon: '🏥', type: 'hospital',
    blurb: '24/7 emergency trauma center at Central Ave & Grand Avenue.'
  },
  {
    id: 'BUSSTOP',
    name: 'Bus Terminal', full: 'Central Transit Bus Terminal',
    x: ROAD_X.EAST, y: ROAD_Y.MID,
    icon: '🚌', type: 'busstop',
    blurb: 'Regional transit bus concourse at Central Ave & Port Lane.'
  },

  // Row 2 (Y = 735: Coastal Drive)
  {
    id: 'STADIUM',
    name: 'Victory Stadium', full: 'Victory Arena Sports Stadium',
    x: ROAD_X.WEST, y: ROAD_Y.BOT,
    icon: '⚽', type: 'stadium',
    blurb: 'Championship athletic arena junction at Coastal Drive & West Ave.'
  },
  {
    id: 'FIRE',
    name: 'Fire Station', full: 'Municipal Fire & Rescue Station No. 1',
    x: ROAD_X.CENTER_L, y: ROAD_Y.BOT,
    icon: '🚒', type: 'fire',
    blurb: 'Emergency tender bay junction at Coastal Drive & Civic Way.'
  },
  {
    id: 'POLICE',
    name: 'Police HQ', full: 'Metropolitan Police Headquarters',
    x: ROAD_X.CENTER_R, y: ROAD_Y.BOT,
    icon: '🚓', type: 'police',
    blurb: 'Civic police precinct junction at Coastal Drive & Grand Avenue.'
  },
  {
    id: 'BEACH',
    name: 'Sunset Beach', full: 'Sunset Bay Golden Sand Beach',
    x: ROAD_X.EAST, y: ROAD_Y.BOT,
    icon: '🏖️', type: 'beach', goal: true,
    blurb: 'Golden shoreline promenade at Coastal Drive & Ocean Promenade.'
  },

  // Perimeter Road Corridors (No Buildings Nearby)
  { id: 'W_AIRPORT', name: 'West Runway Road', full: 'West Road Corridor', x: 120, y: ROAD_Y.TOP, icon: '🛣️', type: 'empty', blurb: 'Outer road perimeter near runway.' },
  { id: 'E_HOTEL', name: 'East Port Perimeter', full: 'East Road Corridor', x: 1240, y: ROAD_Y.TOP, icon: '🛣️', type: 'empty', blurb: 'Outer perimeter road near east hills.' },
  { id: 'W_PARK', name: 'West Forest Road', full: 'West Road Corridor', x: 120, y: ROAD_Y.MID, icon: '🛣️', type: 'empty', blurb: 'Outer road perimeter near forest.' },
  { id: 'E_BUSSTOP', name: 'East Coastal Access', full: 'East Road Corridor', x: 1240, y: ROAD_Y.MID, icon: '🛣️', type: 'empty', blurb: 'Outer road overlooking coastline.' },
  { id: 'W_STADIUM', name: 'West Stadium Road', full: 'West Road Corridor', x: 120, y: ROAD_Y.BOT, icon: '🛣️', type: 'empty', blurb: 'Outer perimeter near sports complex parking.' },
  { id: 'E_BEACH', name: 'East Promenade End', full: 'East Road Corridor', x: 1240, y: ROAD_Y.BOT, icon: '🛣️', type: 'empty', blurb: 'Outer coastline walkway end.' },
  { id: 'N_AIRPORT', name: 'North West Ave', full: 'North Road Corridor', x: ROAD_X.WEST, y: 110, icon: '🛣️', type: 'empty', blurb: 'North end of West Avenue.' },
  { id: 'N_CINEMA', name: 'North Civic Way', full: 'North Road Corridor', x: ROAD_X.CENTER_L, y: 110, icon: '🛣️', type: 'empty', blurb: 'North end of Civic Way.' },
  { id: 'N_MALL', name: 'North Grand Ave', full: 'North Road Corridor', x: ROAD_X.CENTER_R, y: 110, icon: '🛣️', type: 'empty', blurb: 'North end of Grand Avenue.' },
  { id: 'N_HOTEL', name: 'North Port Lane', full: 'North Road Corridor', x: ROAD_X.EAST, y: 110, icon: '🛣️', type: 'empty', blurb: 'North end of Port Lane.' },
  { id: 'S_STADIUM', name: 'South Stadium Bay', full: 'South Road Corridor', x: ROAD_X.WEST, y: 755, icon: '🛣️', type: 'empty', blurb: 'South coastline overlook.' },
  { id: 'S_FIRE', name: 'South Marina Pier', full: 'South Road Corridor', x: ROAD_X.CENTER_L, y: 755, icon: '🛣️', type: 'empty', blurb: 'South harbor dock.' },
  { id: 'S_POLICE', name: 'South Police Dock', full: 'South Road Corridor', x: ROAD_X.CENTER_R, y: 755, icon: '🛣️', type: 'empty', blurb: 'Precinct patrol dock access.' },
  { id: 'S_BEACH', name: 'South Sunset Deck', full: 'South Road Corridor', x: ROAD_X.EAST, y: 755, icon: '🛣️', type: 'empty', blurb: 'Beach wooden walkway extension.' },
];

const BY_ID = {};
PLACES.forEach(p => { BY_ID[p.id] = p; });

/* ── 3. STRICT ROAD-LOCKED ADJACENCY (ALL 4 DIRECTIONS ENABLED) ─────── */
const ADJ = {
  AIRPORT:  { N: 'N_AIRPORT', W: 'W_AIRPORT', E: 'CINEMA',    S: 'PARK' },
  CINEMA:   { N: 'N_CINEMA',  W: 'AIRPORT',   E: 'MALL',      S: 'LIBRARY' },
  MALL:     { N: 'N_MALL',    W: 'CINEMA',    E: 'HOTEL',     S: 'HOSPITAL' },
  HOTEL:    { N: 'N_HOTEL',   W: 'MALL',      E: 'E_HOTEL',   S: 'BUSSTOP' },
  PARK:     { N: 'AIRPORT',   W: 'W_PARK',    E: 'LIBRARY',   S: 'STADIUM' },
  LIBRARY:  { N: 'CINEMA',    W: 'PARK',      E: 'HOSPITAL',  S: 'FIRE' },
  HOSPITAL: { N: 'MALL',      W: 'LIBRARY',   E: 'BUSSTOP',   S: 'POLICE' },
  BUSSTOP:  { N: 'HOTEL',     W: 'HOSPITAL',  E: 'E_BUSSTOP', S: 'BEACH' },
  STADIUM:  { N: 'PARK',      W: 'W_STADIUM', E: 'FIRE',      S: 'S_STADIUM' },
  FIRE:     { N: 'LIBRARY',   W: 'STADIUM',   E: 'POLICE',    S: 'S_FIRE' },
  POLICE:   { N: 'HOSPITAL',  W: 'FIRE',      E: 'BEACH',     S: 'S_POLICE' },
  BEACH:    { N: 'BUSSTOP',   W: 'POLICE',    E: 'E_BEACH',   S: 'S_BEACH' },

  // Empty Perimeter Nodes (can always turn back)
  W_AIRPORT: { E: 'AIRPORT' },
  E_HOTEL:   { W: 'HOTEL' },
  W_PARK:    { E: 'PARK' },
  E_BUSSTOP: { W: 'BUSSTOP' },
  W_STADIUM: { E: 'STADIUM' },
  E_BEACH:   { W: 'BEACH' },
  N_AIRPORT: { S: 'AIRPORT' },
  N_CINEMA:  { S: 'CINEMA' },
  N_MALL:    { S: 'MALL' },
  N_HOTEL:   { S: 'HOTEL' },
  S_STADIUM: { N: 'STADIUM' },
  S_FIRE:    { N: 'FIRE' },
  S_POLICE:  { N: 'POLICE' },
  S_BEACH:   { N: 'BEACH' },
};

function getRoadPathPoints(a, b) {
  const pa = BY_ID[a], pb = BY_ID[b];
  if (pa && pb) {
    return [[pa.x, pa.y], [pb.x, pb.y]];
  }
  return [[ROAD_X.WEST, ROAD_Y.TOP], [ROAD_X.CENTER_L, ROAD_Y.TOP]];
}

const DIR_WORD = { N: 'North', S: 'South', E: 'East', W: 'West' };

/* ── 4. STREET SIGN LABELS (POSITIONED ON ROAD MEDIANS) ─────────────── */
const STREETS = [
  { id: 's_northern', name: 'NORTHERN BOULEVARD', x: 410, y: 255, angle: 0 },
  { id: 's_express',  name: 'METRO EXPRESSWAY',   x: 885, y: 255, angle: 0 },
  { id: 's_central',  name: 'CENTRAL AVENUE',     x: 410, y: 505, angle: 0 },
  { id: 's_hospital', name: 'HOSPITAL WAY',       x: 885, y: 505, angle: 0 },
  { id: 's_coastal',  name: 'COASTAL DRIVE',      x: 410, y: 735, angle: 0 },
  { id: 's_sunset',   name: 'SUNSET PROMENADE',   x: 885, y: 735, angle: 0 },
  { id: 's_west',     name: 'WEST AVENUE',        x: 310, y: 380, angle: -90 },
  { id: 's_civic',    name: 'CIVIC WAY',          x: 510, y: 380, angle: -90 },
  { id: 's_grand',    name: 'GRAND AVENUE',       x: 735, y: 380, angle: -90 },
  { id: 's_port',     name: 'PORT LANE',          x: 1040, y: 380, angle: -90 },
  { id: 's_stadium',  name: 'STADIUM ROAD',       x: 310, y: 620, angle: -90 },
  { id: 's_fire',     name: 'STATION WAY',        x: 510, y: 620, angle: -90 },
  { id: 's_police',   name: 'PRECINCT AVE',       x: 735, y: 620, angle: -90 },
  { id: 's_beach',    name: 'OCEAN DRIVE',        x: 1040, y: 620, angle: -90 },
];

function streetBetween(aId, bId) {
  const pa = BY_ID[aId], pb = BY_ID[bId];
  if (!pa || !pb) return 'the street';
  if (Math.abs(pa.y - pb.y) < 15) {
    if (Math.abs(pa.y - 255) < 20) return 'Northern Boulevard';
    if (Math.abs(pa.y - 505) < 20) return 'Central Avenue';
    if (Math.abs(pa.y - 735) < 20) return 'Coastal Drive';
  }
  if (Math.abs(pa.x - pb.x) < 15) {
    if (Math.abs(pa.x - 310) < 20) return 'West Avenue';
    if (Math.abs(pa.x - 510) < 20) return 'Civic Way';
    if (Math.abs(pa.x - 735) < 20) return 'Grand Avenue';
    if (Math.abs(pa.x - 1040) < 20) return 'Port Lane';
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
      top: '50%',
      left: 'calc(50% - 155px)',
      transform: 'translate(-50%, -50%)',
      zIndex: 999,
      background: 'linear-gradient(145deg, #1E293B, #0F172A)',
      border: '2px solid #EF4444',
      borderRadius: '16px',
      padding: '16px 24px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(239,68,68,0.25)',
      textAlign: 'center',
      minWidth: '220px',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        NO ROAD {direction.toUpperCase()}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#CBD5E1', marginTop: '4px' }}>
        You must walk along asphalt road corridors and sidewalks.
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
      padding: '16px 22px',
      boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 20px rgba(239,68,68,0.3)',
      textAlign: 'center',
      minWidth: '260px',
      pointerEvents: 'none'
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚠️</div>
      <div style={{ fontSize: '15px', fontWeight: 900, color: '#FCA5A5', fontFamily: 'Space Grotesk, sans-serif' }}>
        WRONG DIRECTION!
      </div>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>
        No buildings nearby on this road.
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
        Turn back and navigate toward a landmark!
      </div>
    </div>
  );
};

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
  const centerOnPlayer = () => {
    setPan({
      x: (VIEW_W / 2 - personPos.x) * 0.85,
      y: (VIEW_H / 2 - personPos.y) * 0.85
    });
  };
  const toggleMapOnlyFullscreen = () => {
    setIsMapOnlyFullscreen(v => !v);
  };

  const handleMouseDown = (e) => {
    if (!isDpadDragging) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && !isDpadDragging) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };

  const handleWheel = (e) => {
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom(z => Math.max(0.65, Math.min(3.5, +(z * zoomFactor).toFixed(2))));
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
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
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

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
          border: off ? '1.5px dashed #334155' : '2px solid #38BDF8',
          background: off
            ? 'rgba(15,23,42,0.6)'
            : 'linear-gradient(145deg, #0284C7 0%, #0369A1 100%)',
          color: off ? '#64748B' : '#FFFFFF',
          opacity: off ? 0.35 : 1,
          borderRadius: '12px',
          padding: isCompact ? '6px 2px' : '10px 4px',
          cursor: off ? 'not-allowed' : 'pointer',
          pointerEvents: off ? 'none' : 'auto',
          fontWeight: 800,
          transition: 'all 0.15s ease',
          boxShadow: off ? 'none' : '0 4px 14px rgba(2,132,199,0.4)',
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
        background: isMapOnlyFullscreen ? '#090D16' : '#0B1120',
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

      {/* ══════════ BOX 1: 3D PHOTOREALISTIC MAP VIEWPORT (STANDALONE BOX) ══════════ */}
      <div
        ref={viewportRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
        style={{
          flex: 1,
          position: 'relative',
          minWidth: 0,
          background: '#090D16',
          borderRadius: isMapOnlyFullscreen ? 0 : '18px',
          border: isMapOnlyFullscreen ? 'none' : '2px solid rgba(56, 189, 248, 0.28)',
          boxShadow: isMapOnlyFullscreen ? 'none' : '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >

        <WrongDirPopup show={!!wrongDir} direction={wrongDir} />
        <EmptyRoadPopup show={emptyWarn} />

        {/* ── FLOATING ZOOM & FULLSCREEN TOOLBAR (MAP INSPECTION) ── */}
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 120,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          padding: '6px 10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#38BDF8',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            +
          </button>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#F1F5F9', minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#38BDF8',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            -
          </button>
          <button
            type="button"
            onClick={handleResetView}
            title="Reset Zoom & Pan (Fit to Viewport)"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#94A3B8',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            ⟲
          </button>

          <button
            type="button"
            onClick={centerOnPlayer}
            title="Focus & Center Map on Player"
            style={{
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#38BDF8',
              cursor: 'pointer',
              padding: '0 8px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s'
            }}
          >
            📍 Focus
          </button>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />

          {/* Fullscreen Map Toggle (Shows Map Alone) */}
          <button
            type="button"
            onClick={toggleMapOnlyFullscreen}
            title={isMapOnlyFullscreen ? "Exit Map Full Screen" : "View Map Alone in Full Screen"}
            style={{
              background: isMapOnlyFullscreen ? '#EF4444' : '#0284C7',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'all 0.15s'
            }}
          >
            {isMapOnlyFullscreen ? '✕ Exit Fullscreen' : '⛶ Fullscreen Map'}
          </button>
        </div>

        {/* ── PLACES VISITED BREADCRUMB BAR (TOP BAR WITHOUT OVERLAP) ── */}
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.94)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '5px 12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            maxWidth: 'calc(100% - 410px)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
            <span style={{ fontSize: '11px' }}>📍</span>
            <span style={{ fontSize: '9.5px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              VISITED ({visitedSequence.filter(id => BY_ID[id] && BY_ID[id].type !== 'empty').length})
            </span>
            <span style={{ color: '#475569', fontSize: '11px' }}>|</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {visitedSequence.filter(id => BY_ID[id] && BY_ID[id].type !== 'empty').map((id, idx, arr) => {
              const p = BY_ID[id];
              const isLatest = id === cur;
              const isGoalNode = id === GOAL;
              return (
                <React.Fragment key={id}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: isLatest
                      ? 'linear-gradient(135deg, rgba(56,189,248,0.3) 0%, rgba(2,132,199,0.15) 100%)'
                      : 'rgba(30, 41, 59, 0.8)',
                    border: isLatest
                      ? '1.5px solid #38BDF8'
                      : (isGoalNode ? '1.5px solid #10B981' : '1px solid #334155'),
                    borderRadius: '7px',
                    padding: '2px 7px',
                    color: isLatest ? '#7DD3FC' : (isGoalNode ? '#6EE7B7' : '#E2E8F0'),
                    fontSize: '10.5px',
                    fontWeight: 800
                  }}>
                    <span style={{ fontSize: '12px' }}>{p.icon}</span>
                    <span>{p.name}</span>
                  </div>
                  {idx < arr.length - 1 && (
                    <span style={{ color: '#38BDF8', fontSize: '8.5px', fontWeight: 900 }}>➔</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <g
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{
              transformOrigin: `${VIEW_W / 2}px ${VIEW_H / 2}px`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
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
              x="0"
              y="0"
              width={VIEW_W}
              height={VIEW_H}
              preserveAspectRatio="none"
            />

            {/* ---------- 2. Subtle Street Name Badges ---------- */}
            <g id="street-signs" pointerEvents="none">
              {STREETS.map(s => {
                const isHot = activeStreet.toUpperCase() === s.name.toUpperCase();
                const wdt = s.name.length * 6.8 + 20;
                return (
                  <g key={s.id} transform={`translate(${s.x},${s.y}) rotate(${s.angle})`}>
                    <rect
                      x={-wdt / 2}
                      y="-10"
                      width={wdt}
                      height="20"
                      rx="6"
                      fill={isHot ? '#38BDF8' : 'rgba(15,23,42,0.85)'}
                      stroke={isHot ? '#FFFFFF' : '#475569'}
                      strokeWidth="1.2"
                      style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.6))' }}
                    />
                    <text
                      x="0"
                      y="4.5"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill={isHot ? '#0F172A' : '#E2E8F0'}
                      fontFamily="Space Grotesk, sans-serif"
                      letterSpacing="0.6px"
                    >
                      {s.name}
                    </text>
                  </g>
                );
              })}
            </g>

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

            {/* ---------- 4. Clean Waypoints on Asphalt ---------- */}
            {PLACES.map(p => {
              const isCur = cur === p.id;
              const isGoal = p.id === GOAL;
              const isSeen = visited[p.id];
              return (
                <g key={p.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
                  <circle
                    cx="0"
                    cy="0"
                    r={isCur ? 13 : isGoal ? 12 : 7}
                    fill={isCur ? '#0284C7' : isGoal ? '#10B981' : isSeen ? '#334155' : '#1E293B'}
                    stroke="#FFFFFF"
                    strokeWidth={isCur ? 2.5 : 1.5}
                    opacity={isCur || isGoal ? 1 : 0.75}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                  />
                  <circle cx="0" cy="0" r={isCur ? 4.5 : 2.5} fill="#FFFFFF" />
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

                <div style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#F1F5F9',
                  textAlign: 'center',
                  background: 'rgba(30, 41, 59, 0.9)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  maxWidth: '160px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  📍 {curPlace.name}
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
          background: 'rgba(15,23,42,0.92)',
          border: '1px solid rgba(56,189,248,0.4)',
          borderRadius: '14px',
          padding: '8px 16px',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          zIndex: 110
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="34" height="34" viewBox="-20 -20 40 40">
              <circle r="18" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <g transform={`rotate(${{ N: 0, E: 90, S: 180, W: 270 }[heading]})`} style={{ transition: 'transform 0.25s ease' }}>
                <polygon points="0,-14 4,0 0,-1" fill="#EF4444" />
                <polygon points="0,-14 -4,0 0,-1" fill="#F87171" />
                <polygon points="0,14 4,0 0,1" fill="#94A3B8" />
                <polygon points="0,14 -4,0 0,1" fill="#CBD5E1" />
              </g>
            </svg>
            <div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>HEADING</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#38BDF8' }}>{DIR_WORD[heading].toUpperCase()}</div>
            </div>
          </div>

          <div style={{ width: '1px', height: '24px', background: '#334155' }} />

          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>CORRIDOR</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#F1F5F9' }}>{activeStreet}</div>
          </div>
        </div>
      </div>

      {/* ══════════ BOX 2: DIRECTION & NAVIGATION CONTROL STATION (STANDALONE BOX) ══════════ */}
      <div style={{
        width: '300px',
        flexShrink: 0,
        height: '100%',
        background: 'linear-gradient(165deg, #1E293B 0%, #0F172A 100%)',
        borderRadius: '18px',
        border: '2px solid rgba(56, 189, 248, 0.22)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        display: isMapOnlyFullscreen ? 'none' : 'flex',
        flexDirection: 'column',
        padding: '10px 12px',
        gap: '8px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: won ? 'linear-gradient(145deg, #064E3B, #065F46)' : 'linear-gradient(145deg, #1E293B, #0F172A)',
          border: `1.5px solid ${won ? '#10B981' : '#0284C7'}`, borderRadius: '12px', padding: '8px 10px'
        }}>
          <div style={{ fontSize: '9.5px', fontWeight: 900, color: won ? '#6EE7B7' : '#38BDF8', letterSpacing: '0.8px' }}>
            🎯 NAVIGATION MISSION
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC', marginTop: '3px', lineHeight: 1.35 }}>
            {won
              ? '🎉 Mission Complete! You reached Sunset Beach.'
              : <>Walk from <b>Skyline Airport</b> to <b>Sunset Beach</b>.</>}
          </div>

          {won && onNext && (
            <button
              type="button"
              onClick={onNext}
              style={{
                marginTop: '8px',
                width: '100%',
                background: '#10B981',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
              }}
            >
              Continue to Map Questions ➔
            </button>
          )}
        </div>

        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.8px' }}>📍 CURRENT LOCATION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '20px' }}>{curPlace.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curPlace.name}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{curPlace.full}</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '8px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSidebarDpadMinimized ? '0' : '6px' }}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.8px' }}>🧭 DIRECTION CONTROLS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  background: 'transparent', border: '1px solid #475569', borderRadius: '5px',
                  color: '#94A3B8', fontSize: '9px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
                }}
              >
                ↺ Reset
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarDpadMinimized(v => !v)}
                title={isSidebarDpadMinimized ? "Expand Controls" : "Minimize Controls"}
                style={{
                  background: '#0F172A', border: '1px solid #475569', borderRadius: '5px',
                  color: '#CBD5E1', fontSize: '9px', fontWeight: 700, padding: '1px 5px', cursor: 'pointer'
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
              gridTemplateRows: 'repeat(3, 38px)',
              gridTemplateAreas: `
                ". N ."
                "W . E"
                ". S ."
              `,
              gap: '5px'
            }}>
              <DirBtn dir="N" label="N" arrow="▲" gridArea="N" isCompact />
              <DirBtn dir="W" label="W" arrow="◀" gridArea="W" isCompact />
              <DirBtn dir="E" label="E" arrow="▶" gridArea="E" isCompact />
              <DirBtn dir="S" label="S" arrow="▼" gridArea="S" isCompact />
            </div>
          )}
        </div>

        <div style={{ background: '#090D16', border: '1px solid #1E293B', borderRadius: '12px', padding: '8px 10px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.8px', marginBottom: '4px' }}>📋 GPS TRAVEL LOG</div>
          <div ref={logRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px', scrollbarWidth: 'none' }}>
            {log.map((l, i) => (
              <div key={i} style={{
                fontSize: '10.5px', lineHeight: 1.3, padding: '4px 6px', borderRadius: '5px',
                background: l.ok ? 'rgba(56,189,248,0.1)' : 'rgba(239,68,68,0.15)',
                color: l.ok ? '#E2E8F0' : '#FCA5A5',
                borderLeft: `2.5px solid ${l.ok ? '#38BDF8' : '#EF4444'}`
              }}>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityExplorerMap;
