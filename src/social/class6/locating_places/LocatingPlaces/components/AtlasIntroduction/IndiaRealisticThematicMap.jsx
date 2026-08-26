import React, { useMemo } from 'react';
import indiaPhysicalReliefImg from './assets/india_3d_physical_relief.jpg';
import indiaPlainsReliefImg from './assets/india_plains_3d_relief.jpg';
import indiaPlateausReliefImg from './assets/india_plateaus_3d_relief.jpg';
import indiaForestsReliefImg from './assets/india_forests_3d_relief.jpg';
import indiaRiversMapImg from './assets/india_rivers_3d_map.jpg';
import indiaDesertsMapImg from './assets/india_deserts_3d_map.jpg';

// Exact calibrated landmark positions on 3D Physical Relief Map (1024 x 682 viewBox)
export const MOUNTAINS_LANDMARKS = {
  'k2': { x: 315, y: 70 },
  'kullu_manali': { x: 265, y: 118 },
  'nanda_devi': { x: 350, y: 125 },
  'kanchenjunga': { x: 678, y: 165 },
  'saramati': { x: 890, y: 220 },
  'guru_shikhar': { x: 238, y: 310 },
  'dhupgarh': { x: 360, y: 360 },
  'anamudi': { x: 236, y: 565 },
  'gangetic_plain': { x: 455, y: 245 },
  'punjab_plain': { x: 232, y: 185 },
  'brahmaputra_plain': { x: 770, y: 245 },
  'konkan_coast': { x: 205, y: 435 },
  'malabar_coast': { x: 285, y: 585 },
  'coromandel_coast': { x: 380, y: 565 },
  'sundarbans': { x: 675, y: 310 },
  'western_ghats_rainforest': { x: 260, y: 430 },
  'gir_forest': { x: 145, y: 335 },
  'kaziranga': { x: 795, y: 246 },
  'kaziranga_forest': { x: 795, y: 246 },
  'deccan_plateau': { x: 350, y: 480 },
  'malwa_plateau': { x: 320, y: 345 },
  'chota_nagpur': { x: 560, y: 345 },
  'meghalaya_plateau': { x: 775, y: 285 },
  'thar_desert': { x: 180, y: 240 },
  'rann_of_kutch': { x: 155, y: 345 },
  'cold_desert_ladakh': { x: 370, y: 85 }
};

// Exact calibrated landmark positions on 3D Forest Biomes Map (1024 x 682 viewBox)
export const FORESTS_LANDMARKS = {
  'himalayan_tropical_forests': { x: 325, y: 152 },
  'indo_gangetic_forests': { x: 500, y: 218 },
  'central_indian_forests': { x: 375, y: 326 },
  'western_ghats_rainforest': { x: 260, y: 430 },
  'south_indian_forests': { x: 345, y: 540 },
  'north_east_hill_forests': { x: 795, y: 246 },
  'kaziranga_forest': { x: 795, y: 246 },
  'kaziranga': { x: 795, y: 246 },
  'sundarbans': { x: 730, y: 328 },
  'gir_forest': { x: 145, y: 335 }
};

// Exact calibrated landmark positions on 3D River Hydrology Map (1024 x 682 viewBox)
export const RIVERS_LANDMARKS = {
  'river_indus': { x: 195, y: 155 },
  'river_yamuna': { x: 340, y: 185 },
  'river_ganga': { x: 462, y: 245 },
  'river_brahmaputra': { x: 805, y: 230 },
  'sundarbans_delta': { x: 730, y: 315 },
  'sundarbans': { x: 730, y: 315 },
  'river_narmada': { x: 288, y: 310 },
  'marble_rocks': { x: 395, y: 305 },
  'river_tapi': { x: 320, y: 355 },
  'river_mahanadi': { x: 590, y: 365 },
  'river_godavari': { x: 360, y: 410 },
  'river_krishna': { x: 350, y: 460 },
  'river_kaveri': { x: 372, y: 565 },
  'jog_falls': { x: 235, y: 495 }
};

// Exact calibrated landmark positions on 3D Arid Relief Map (1024 x 682 viewBox)
export const DESERTS_LANDMARKS = {
  'thar_desert': { x: 180, y: 240 },
  'rann_of_kutch': { x: 155, y: 345 },
  'cold_desert_ladakh': { x: 370, y: 85 }
};

export const projectCoords = (lat, lon, placeId = null, category = 'mountains') => {
  if (category === 'forests') {
    if (placeId && FORESTS_LANDMARKS[placeId]) {
      return FORESTS_LANDMARKS[placeId];
    }
  }

  if (category === 'rivers') {
    if (placeId && RIVERS_LANDMARKS[placeId]) {
      return RIVERS_LANDMARKS[placeId];
    }
    const minLon = 68.0, maxLon = 97.5;
    const minLat = 6.5, maxLat = 37.5;
    const x = ((lon - minLon) / (maxLon - minLon)) * 1024;
    const y = (1 - ((lat - minLat) / (maxLat - minLat))) * 682;
    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  }

  if (category === 'deserts') {
    if (placeId && DESERTS_LANDMARKS[placeId]) {
      return DESERTS_LANDMARKS[placeId];
    }
    const minLon = 68.0, maxLon = 97.5;
    const minLat = 6.5, maxLat = 37.5;
    const x = ((lon - minLon) / (maxLon - minLon)) * 1024;
    const y = (1 - ((lat - minLat) / (maxLat - minLat))) * 682;
    return { x: +x.toFixed(1), y: +y.toFixed(1) };
  }

  if (placeId && MOUNTAINS_LANDMARKS[placeId]) {
    return MOUNTAINS_LANDMARKS[placeId];
  }
  const minLon = 68.0, maxLon = 97.5;
  const minLat = 6.5, maxLat = 37.5;
  const x = ((lon - minLon) / (maxLon - minLon)) * 1024;
  const y = (1 - ((lat - minLat) / (maxLat - minLat))) * 682;
  return { x: +x.toFixed(1), y: +y.toFixed(1) };
};

const CATEGORY_MAP_THEMES = {
  mountains: {
    badge: '🏔️ 3D Mountain Orography & Peaks Map',
    image: indiaPhysicalReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.1) saturate(1.1) brightness(1.0)',
    bgGrad: 'radial-gradient(ellipse at 50% 30%, #172554 0%, #030712 100%)',
    primaryColor: '#F59E0B'
  },
  rivers: {
    badge: '🌊 River Systems & Drainage Basins Map',
    image: indiaRiversMapImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 50% 50%, #082f49 0%, #020617 100%)',
    primaryColor: '#0284C7'
  },
  plains: {
    badge: '🏞️ Alluvial Basins & Coastal Plains Map',
    image: indiaPlainsReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 50% 40%, #064e3b 0%, #020617 100%)',
    primaryColor: '#10B981'
  },
  deserts: {
    badge: '🏜️ 3D Great Thar & Arid Relief Map',
    image: indiaPhysicalReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.08) saturate(1.15) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 35% 45%, #2d1806 0%, #0c0803 100%)',
    primaryColor: '#D97706'
  },
  forests: {
    badge: '🌳 Rainforest Canopy & Biosphere Sanctuaries Map',
    image: indiaForestsReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 45% 65%, #022c22 0%, #020617 100%)',
    primaryColor: '#059669'
  },
  plateaus: {
    badge: '⛰️ Deccan Basalt & Geological Tablelands Map',
    image: indiaPlateausReliefImg,
    aspectRatio: '1024 / 682',
    viewBox: '0 0 1024 682',
    filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
    bgGrad: 'radial-gradient(ellipse at 45% 60%, #1e1b4b 0%, #020617 100%)',
    primaryColor: '#8B5CF6'
  }
};

export default function IndiaRealisticThematicMap({
  category = 'mountains',
  places = [],
  selectedPlace = null,
  hoveredPlaceId = null,
  onSelectPlace,
  onHoverPlace,
  zoomLevel = 1
}) {
  const currentTheme = CATEGORY_MAP_THEMES[category] || CATEGORY_MAP_THEMES.mountains;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: currentTheme.bgGrad
    }}>
      {/* 2. MAIN SCALABLE 3D MAP CONTAINER (100% Fully Visible & Covers All Space) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'center center',
        transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}>
        <div style={{
          position: 'relative',
          aspectRatio: '1024 / 682',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
          display: 'grid',
          placeItems: 'center',
          objectFit: 'contain'
        }}>
          {/* Base Image strictly filling the 1024/682 container */}
          <img
            src={currentTheme.image}
            alt={currentTheme.badge}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              filter: currentTheme.filter,
              display: 'block',
              transition: 'filter 0.3s ease'
            }}
          />

          {/* 3. HIGH-PRECISION VECTOR OVERLAY MATCHING 100% OF THE IMAGE */}
          <svg
            viewBox="0 0 1024 682"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
          <defs>
            <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.85" floodColor="#020617" />
            </filter>
            <filter id="selectedGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.95" floodColor="#F59E0B" />
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.9" floodColor="#000000" />
            </filter>
            <filter id="hoverGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.85" floodColor="#38BDF8" />
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.8" floodColor="#000000" />
            </filter>
            <linearGradient id="selectedBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* INTERACTIVE PINPOINT MARKERS & ACTIVE PLACE NAME BADGE */}
          {[...places]
            .sort((a, b) => {
              const aActive = (selectedPlace && a.id === selectedPlace.id) ? 2 : (a.id === hoveredPlaceId ? 1 : 0);
              const bActive = (selectedPlace && b.id === selectedPlace.id) ? 2 : (b.id === hoveredPlaceId ? 1 : 0);
              return aActive - bActive;
            })
            .map(place => {
              const pt = projectCoords(place.lat, place.lon, place.id, category);
              const isSelected = selectedPlace && place.id === selectedPlace.id;
              const isHovered = place.id === hoveredPlaceId;
              const showLabel = isSelected || isHovered;

              const catColors = {
                mountains: '#F59E0B',
                plains: '#10B981',
                rivers: '#0284C7',
                deserts: '#D97706',
                forests: '#059669',
                plateaus: '#8B5CF6'
              };
              const markerColor = catColors[place.category] || currentTheme.primaryColor;
              const displayName = place.name.split('(')[0].trim();
              const textLen = displayName.length;
              const cardWidth = Math.max(110, textLen * 9.2 + 38);
              const cardHeight = 30;

              // Smart boundary-safe offset positioning
              let offsetX = 14;
              if (pt.x > 720) {
                offsetX = -cardWidth - 12;
              } else if (pt.x < 260) {
                offsetX = 14;
              } else {
                const isLeft = (place.labelOffsetX !== undefined && place.labelOffsetX < 0);
                offsetX = isLeft ? -cardWidth - 12 : (place.labelOffsetX || 14);
              }
              const offsetY = place.labelOffsetY !== undefined ? (place.labelOffsetY - 4) : -15;

              return (
                <g
                  key={place.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={() => onSelectPlace(place.id)}
                  onMouseEnter={() => onHoverPlace(place.id)}
                  onMouseLeave={() => onHoverPlace(null)}
                  style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {/* Pulsing Dual Radar Ring when Selected */}
                  {isSelected && (
                    <>
                      <circle
                        r={category === 'rivers' ? "28" : "22"}
                        fill="none"
                        stroke="#F59E0B"
                        strokeWidth="3"
                        opacity="0.85"
                        style={{ animation: 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                      />
                      <circle
                        r={category === 'rivers' ? "18" : "15"}
                        fill="rgba(245, 158, 11, 0.3)"
                        stroke="#FDE047"
                        strokeWidth="1.8"
                      />
                    </>
                  )}

                  {/* Hover Aura for unselected points */}
                  {isHovered && !isSelected && (
                    <circle
                      r={category === 'rivers' ? "18" : "14"}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  )}

                  {/* Center Core Marker Pin */}
                  <circle
                    r={isSelected ? (category === 'rivers' ? "9.5" : "8.5") : (isHovered ? "7.5" : "6")}
                    fill={isSelected ? '#F59E0B' : markerColor}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? "2.8" : "2"}
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.75))"
                    style={{ transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  />

                  {/* SINGLE ACTIVE HIGHLIGHTED PLACE NAME BADGE (Increased Font Size) */}
                  {showLabel && (
                    <g
                      filter={isSelected ? "url(#selectedGlow)" : "url(#hoverGlow)"}
                      style={{ transition: 'all 0.2s ease', pointerEvents: 'none' }}
                    >
                      {/* Badge Background Pill */}
                      <rect
                        x={offsetX}
                        y={offsetY}
                        width={cardWidth}
                        height={cardHeight}
                        rx="8"
                        fill="url(#selectedBadgeGrad)"
                        stroke={isSelected ? '#F59E0B' : '#38BDF8'}
                        strokeWidth={isSelected ? "2.6" : "2"}
                        opacity="0.98"
                      />

                      {/* Radiant Indicator Dot */}
                      <circle
                        cx={offsetX + 12}
                        cy={offsetY + (cardHeight / 2)}
                        r={isSelected ? 4.5 : 3.5}
                        fill={isSelected ? '#FDE047' : '#38BDF8'}
                      />

                      {/* Big Prominent Place Name Text */}
                      <text
                        x={offsetX + 22}
                        y={offsetY + (cardHeight / 2) + 5}
                        fill={isSelected ? '#FEF08A' : '#FFFFFF'}
                        fontSize="14"
                        fontWeight="900"
                        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                        letterSpacing="0.025em"
                      >
                        {displayName}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
