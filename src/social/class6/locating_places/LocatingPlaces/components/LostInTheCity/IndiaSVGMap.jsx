import React, { useState, useEffect, useRef } from 'react';
import { IndiaMapData } from './IndiaMapData';
import nasaSatelliteImg from './assets/nasa_india_globe_space.jpg';
import realisticAirplaneImg from './assets/realistic_airplane_top.png';
import {
  Plane, Compass, Navigation, Sparkles, MapPin, Landmark,
  Layers, Maximize2, Minimize2, X, Eye, EyeOff, Mountain, Waves, Globe,
  Volume2, VolumeX, Sun, Moon, Radio, Wind, ShieldAlert, Ruler, Clock,
  Activity, ArrowUpRight, Check
} from 'lucide-react';

export default function IndiaSVGMap({
  activeRoute, // { to: string, showBoth: boolean }
  animating,
  missionIndex,
  missions,
  mapStyle = 'satellite', // 'satellite' | 'physical' | 'atlas'
  travelMode = 'plane', // 'plane' | 'train'
  soundEnabled = true,
  onToggleSound,
  onSelectCity
}) {
  const [localHover, setLocalHover] = useState(null);
  const [travelProgress, setTravelProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCityDetail, setSelectedCityDetail] = useState(null);
  const [radarAngle, setRadarAngle] = useState(0);

  // Cartographic layer toggles
  const [showGraticule, setShowGraticule] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showRelief, setShowRelief] = useState(true);
  const [showMeridian, setShowMeridian] = useState(false);

  // Interactive Ruler / Distance measurement tool state
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState(null);
  const [rulerEnd, setRulerEnd] = useState(null);

  // Radar sweep animation
  useEffect(() => {
    const rTimer = setInterval(() => {
      setRadarAngle(a => (a + 3) % 360);
    }, 30);
    return () => clearInterval(rTimer);
  }, []);

  // Geographic affine transformation calibrated to India map SVG coordinates
  const projectCoordinates = (lat, lon) => {
    const a = 20.6606;
    const b = 0.5652;
    const c = -1416.7303;
    const d = 0.4941;
    const e = -23.4696;
    const f = 836.2510;

    return {
      x: a * lon + b * lat + c,
      y: d * lon + e * lat + f
    };
  };

  // Adjusted offsets (dx, dy) to guarantee NO overlap between city badges
  const cityData = {
    tn: {
      lat: 13.0827, lon: 80.2707, state: "Tamil Nadu", name: "Chennai",
      anchor: "start", dx: 14, dy: -4, landmark: "Marina Beach & Coromandel Coast",
      icon: "🏖️", code: "MAA", region: "Coromandel Coastal Plain", bearing: 0, distance: 0,
      elevation: "6m", climate: "Tropical Wet & Dry", river: "Cooum & Adyar Rivers",
      desc: "Starting base camp of our voyage. Located on the Coromandel coast bordering the Bay of Bengal (13.08°N, 80.27°E).",
      landscape: "Golden coastal shores, palm groves, and deep blue Bay of Bengal waters."
    },
    ka: {
      lat: 12.9716, lon: 77.5946, state: "Karnataka", name: "Bengaluru",
      anchor: "end", dx: -108, dy: 8, landmark: "Vidhana Soudha & Silicon Plateau",
      icon: "🏛️", code: "BLR", region: "Deccan Plateau", bearing: 268, distance: 350,
      elevation: "920m (High Elevation)", climate: "Moderate Tropical Savanna", river: "Vrishabhavathi Basin",
      desc: "Situated at an elevation of over 900m on the Deccan Plateau, directly West of Chennai (12.97°N, 77.59°E).",
      landscape: "Elevated granite plateau ridges, lush Lalbagh botanical greenery, and breezy lakes."
    },
    mh: {
      lat: 19.0760, lon: 72.8777, state: "Maharashtra", name: "Mumbai",
      anchor: "end", dx: -108, dy: -12, landmark: "Gateway of India & Arabian Sea Port",
      icon: "🏙️", code: "BOM", region: "Konkan Coastal Strip", bearing: 318, distance: 1300,
      elevation: "14m", climate: "Tropical Monsoon", river: "Ulhas & Mithi Rivers",
      desc: "Financial capital facing the Arabian Sea on the western Konkan coast (19.08°N, 72.88°E).",
      landscape: "Iconic Arabian Sea skyline, Marine Drive promenade, and misty Western Ghats in the backdrop."
    },
    ap: {
      lat: 16.5417, lon: 80.5158, state: "Andhra Pradesh", name: "Amaravati",
      anchor: "start", dx: 14, dy: -8, landmark: "Amaravati Stupa & Krishna River Delta",
      icon: "☸️", code: "VGA", region: "Eastern Coastal Plains", bearing: 358, distance: 450,
      elevation: "25m", climate: "Tropical Hot & Humid", river: "Mighty Krishna River",
      desc: "Historic cultural center on the fertile southern banks of the Krishna River (16.54°N, 80.52°E).",
      landscape: "Vast fertile rice fields, wide flowing waters of the sacred Krishna River, and ancient stupas."
    },
    wb: {
      lat: 22.5726, lon: 88.3639, state: "West Bengal", name: "Kolkata",
      anchor: "start", dx: 14, dy: 6, landmark: "Howrah Bridge & Hooghly Estuary",
      icon: "🌉", code: "CCU", region: "Ganga-Brahmaputra Delta", bearing: 38, distance: 1650,
      elevation: "9m", climate: "Tropical Wet & Dry", river: "Hooghly (Ganga tributary)",
      desc: "Historic port city on the east bank of the Hooghly River in lower Bengal (22.57°N, 88.36°E).",
      landscape: "The grand cantilever Howrah Bridge spanning the busy waters of the Hooghly River."
    },
    rj: {
      lat: 26.9124, lon: 75.7873, state: "Rajasthan", name: "Jaipur",
      anchor: "end", dx: -108, dy: -14, landmark: "Hawa Mahal & Aravalli Ridges",
      icon: "🏰", code: "JAI", region: "Semi-Arid Aravalli Foothills", bearing: 338, distance: 2100,
      elevation: "431m", climate: "Semi-Arid (Thar Desert Border)", river: "Dhanuvati & Banas Basin",
      desc: "The Pink City in eastern Rajasthan surrounded by the ancient Aravalli ranges (26.91°N, 75.79°E).",
      landscape: "Golden Thar desert sands, rugged Aravalli hilltop forts, and terracotta pink palaces."
    },
    as: {
      lat: 26.1433, lon: 91.7898, state: "Assam", name: "Dispur (Assam)",
      anchor: "start", dx: 14, dy: -10, landmark: "Tea Valleys & Brahmaputra Floodplain",
      icon: "🍵", code: "GAU", region: "Brahmaputra Valley & Hills", bearing: 48, distance: 2500,
      elevation: "55m", climate: "Subtropical Monsoon", river: "Mighty Brahmaputra River",
      desc: "Capital of Assam situated in the fertile Brahmaputra River valley in the North-East (26.14°N, 91.79°E).",
      landscape: "Rolling emerald tea garden hills, morning mist, and the mighty braided Brahmaputra River."
    }
  };

  const stateCentroids = {};
  for (const id in cityData) {
    stateCentroids[id] = projectCoordinates(cityData[id].lat, cityData[id].lon);
  }

  const startNode = stateCentroids['tn'];

  const currentMission = missionIndex >= 0 && missionIndex < missions.length ? missions[missionIndex] : null;
  const currentDestinationId = currentMission ? currentMission.id : null;

  const completedMissionIds = [];
  if (missionIndex >= 0) {
    for (let i = 0; i < Math.min(missionIndex, missions.length); i++) {
      completedMissionIds.push(missions[i].id);
    }
  }

  // Smooth 60 FPS straight flight animation progress
  useEffect(() => {
    if (!animating) {
      setTravelProgress(0);
      return;
    }
    let start = performance.now();
    const duration = 2600; // Smooth 2.6s straight flight cruise
    let rafId;

    const animateFlight = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      setTravelProgress(progress);
      if (progress < 1) {
        rafId = requestAnimationFrame(animateFlight);
      }
    };

    rafId = requestAnimationFrame(animateFlight);
    return () => cancelAnimationFrame(rafId);
  }, [animating]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) setIsFullscreen(false);
        if (rulerMode) {
          setRulerStart(null);
          setRulerEnd(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, rulerMode]);

  const calculateGreatCircleDistance = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const R = 6371;
    const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
    const dLon = ((c2.lon - c1.lon) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const calculateBearing = (c1, c2) => {
    if (!c1 || !c2) return 0;
    const y = Math.sin(((c2.lon - c1.lon) * Math.PI) / 180) * Math.cos((c2.lat * Math.PI) / 180);
    const x =
      Math.cos((c1.lat * Math.PI) / 180) * Math.sin((c2.lat * Math.PI) / 180) -
      Math.sin((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.cos(((c2.lon - c1.lon) * Math.PI) / 180);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  };

  const getDirectionText = (brng) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(brng / 45) % 8];
  };

  // Straight line direct vector path from Chennai to destination
  const getDirectPath = (toId) => {
    const endNode = stateCentroids[toId];
    if (!endNode || !startNode) return { d: '', cx: 0, cy: 0, angle: 0, dist: 0 };

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Direct midpoint
    const cx = (startNode.x + endNode.x) / 2;
    const cy = (startNode.y + endNode.y) / 2;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      d: `M ${startNode.x} ${startNode.y} L ${endNode.x} ${endNode.y}`,
      cx, cy,
      angle,
      dist
    };
  };

  const getStateColor = (id) => {
    // 1. Great Himalayas & Karakoram Snow Mountains (J&K, Ladakh, Himachal, Uttarakhand, Sikkim, Arunachal)
    if (['jk', 'la', 'hp', 'ut', 'sk', 'ar'].includes(id)) {
      return { fill: 'url(#himalaya3DGrad)', stroke: '#E2E8F0', strokeWidth: 1.0 };
    }
    // 2. Thar Desert & Semi-Arid Golden Dunes (Rajasthan, Gujarat)
    if (['rj', 'gj'].includes(id)) {
      return { fill: 'url(#desert3DGrad)', stroke: '#FDE68A', strokeWidth: 1.0 };
    }
    // 3. Western Ghats & Coastal Rainforests (Kerala, Goa)
    if (['kl', 'ga'].includes(id)) {
      return { fill: 'url(#rainforest3DGrad)', stroke: '#86EFAC', strokeWidth: 1.0 };
    }
    // 4. North-East Tea Valleys & Rainforests (Assam, Meghalaya, Tripura, Mizoram, Nagaland, Manipur)
    if (['as', 'ml', 'tr', 'mz', 'nl', 'mn'].includes(id)) {
      return { fill: 'url(#rainforest3DGrad)', stroke: '#86EFAC', strokeWidth: 1.0 };
    }
    // 5. Gangetic & Coastal Plains (Punjab, Haryana, UP, Bihar, West Bengal, Odisha)
    if (['pb', 'hr', 'up', 'br', 'wb', 'or'].includes(id)) {
      return { fill: 'url(#plains3DGrad)', stroke: '#A7F3D0', strokeWidth: 0.9 };
    }
    // 6. Tamil Nadu Base (Coromandel Coast & Deccan foothills)
    if (['tn'].includes(id)) {
      return { fill: 'url(#tamilNadu3DGrad)', stroke: '#86EFAC', strokeWidth: 1.2 };
    }
    // 7. Deccan Plateau & Central Highlands (Maharashtra, Karnataka, AP, MP, Chhattisgarh, Jharkhand)
    return {
      fill: 'url(#plateau3DGrad)',
      stroke: '#FDE68A',
      strokeWidth: 0.9
    };
  };

  // Render straight vector path with perfectly aligned forward-facing airplane
  const renderFlightRoute = (toId, isExtra = false, isLiveAnimation = false) => {
    const endNode = stateCentroids[toId];
    if (!endNode) return null;

    const { d, cx, cy, dist } = getDirectPath(toId);
    const city = cityData[toId];

    const t = isLiveAnimation ? travelProgress : 1;
    // Straight linear interpolation
    const curX = (1 - t) * startNode.x + t * endNode.x;
    const curY = (1 - t) * startNode.y + t * endNode.y;

    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    // Exact forward heading angle in degrees (0° = pointing Right / East, 90° = South, -90° = North, 180° = West)
    const heading = Math.atan2(dy, dx) * (180 / Math.PI);

    const strokeColor = isExtra ? '#64748B' : (isLiveAnimation ? '#D97706' : '#2563EB');
    const glowColor = isExtra ? 'rgba(100,116,139,0.3)' : 'rgba(217,119,6,0.5)';

    return (
      <g key={`flight-route-${toId}${isExtra ? '-extra' : ''}`}>
        {/* Glow backdrop line */}
        <path
          d={d}
          fill="none"
          stroke={glowColor}
          strokeWidth={isLiveAnimation ? "8" : "4"}
          strokeLinecap="round"
          opacity={isLiveAnimation ? 0.8 : 0.35}
        />

        {/* Straight trajectory dash line */}
        <path
          d={d}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isLiveAnimation ? "3" : "2"}
          strokeDasharray="6 5"
          strokeLinecap="round"
          opacity={isLiveAnimation ? 1 : 0.85}
        />


        {/* Moving Straight Forward Airplane / Train */}
        {isLiveAnimation && (
          <g transform={`translate(${curX}, ${curY})`}>
            {/* Realistic Ground Altitude Shadow (Offset downwards for 3D cruising altitude effect) */}
            <g transform={`rotate(${heading})`}>
              <ellipse
                cx="-6"
                cy="16"
                rx="18"
                ry="5.5"
                fill="rgba(0, 0, 0, 0.38)"
                filter="blur(2.5px)"
              />
            </g>

            {/* Rotated Aircraft with Wake Turbulence Vapor Contrails */}
            <g transform={`rotate(${heading})`}>
              {/* Dual Turbofan Condensation Contrails trailing back */}
              <line x1="-12" y1="-5.5" x2="-90" y2="-9" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.2" strokeLinecap="round" filter="blur(0.8px)" />
              <line x1="-12" y1="5.5" x2="-90" y2="9" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="2.2" strokeLinecap="round" filter="blur(0.8px)" />
              <line x1="-10" y1="-5.5" x2="-45" y2="-7" stroke="rgba(186, 230, 253, 0.65)" strokeWidth="1.6" filter="blur(0.4px)" />
              <line x1="-10" y1="5.5" x2="-45" y2="7" stroke="rgba(186, 230, 253, 0.65)" strokeWidth="1.6" filter="blur(0.4px)" />

              {travelMode === 'plane' ? (
                /* Ultra-Realistic Commercial Passenger Jet (Proportional High-Altitude Scale) */
                <g transform="scale(0.48)">
                  <image
                    href={realisticAirplaneImg}
                    x="-32"
                    y="-32"
                    width="64"
                    height="64"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.55))'
                    }}
                  />
                  {/* Port Wing Red Navigation Light */}
                  <circle cx="-6" cy="-24" r="2.2" fill="#EF4444" style={{ animation: 'ping 0.8s infinite' }} />
                  {/* Starboard Wing Green Navigation Light */}
                  <circle cx="-6" cy="24" r="2.2" fill="#22C55E" style={{ animation: 'ping 0.8s infinite' }} />
                  {/* Tail White Anti-Collision Strobe */}
                  <circle cx="-28" cy="0" r="2" fill="#FFFFFF" style={{ animation: 'ping 1.1s infinite' }} />
                  {/* Top Fuselage Red Rotating Beacon */}
                  <circle cx="-2" cy="0" r="2" fill="#DC2626" opacity="0.9" />
                </g>
              ) : (
                /* High-Speed Train Cab */
                <g transform="translate(-14, -5) scale(0.75)">
                  <rect x="0" y="0" width="30" height="10" rx="5" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="1.2" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))" />
                  <rect x="4" y="2" width="18" height="6" rx="2" fill="#F8FAFC" />
                  <circle cx="25" cy="5" r="2" fill="#38BDF8" />
                  <polygon points="30,3 44,1 44,9 30,7" fill="rgba(254, 240, 138, 0.45)" />
                  <circle cx="29" cy="3" r="1.3" fill="#FEF08A" />
                  <circle cx="29" cy="7" r="1.3" fill="#FEF08A" />
                </g>
              )}
            </g>

            {/* Live Flight Telemetry Tag (Remains horizontal and readable) */}
            <g transform="translate(18, -14)" style={{ pointerEvents: 'none' }}>
              <rect
                x="-4"
                y="-9"
                width="72"
                height="16"
                rx="8"
                fill="rgba(15, 23, 42, 0.88)"
                stroke="rgba(56, 189, 248, 0.7)"
                strokeWidth="1"
                backdropFilter="blur(6px)"
                filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
              />
              <text
                x="32"
                y="2.5"
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill="#38BDF8"
                fontFamily="'Space Grotesk', sans-serif"
                letterSpacing="0.4px"
              >
                ✈️ FL380 • 850k
              </text>
            </g>
          </g>
        )}

        {/* Destination Arrival Target Beacon */}
        <g transform={`translate(${endNode.x}, ${endNode.y})`}>
          {isLiveAnimation && (
            <>
              <circle r="18" fill="none" stroke="#D97706" strokeWidth="1.8" opacity="0.7" style={{ animation: 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
              <circle r="10" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.85" />
            </>
          )}
          <circle
            r="6"
            fill={isExtra ? '#64748B' : (isLiveAnimation ? '#D97706' : '#2563EB')}
            stroke="#FFFFFF"
            strokeWidth="2"
            filter="drop-shadow(0 2px 5px rgba(0,0,0,0.3))"
          />
        </g>
      </g>
    );
  };

  const handleCityClick = (cityKey) => {
    const city = cityData[cityKey];
    if (!city) return;

    if (rulerMode) {
      if (!rulerStart || (rulerStart && rulerEnd)) {
        setRulerStart(cityKey);
        setRulerEnd(null);
      } else if (rulerStart && !rulerEnd && rulerStart !== cityKey) {
        setRulerEnd(cityKey);
      }
    } else {
      setSelectedCityDetail(city);
      if (onSelectCity) onSelectCity(cityKey);
    }
  };

  const containerStyle = isFullscreen ? {
    position: 'fixed',
    inset: 0,
    zIndex: 99999,
    width: '100vw',
    height: '100vh',
    background: mapStyle === 'satellite' ? '#030712' : '#F7F1E2',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
    padding: '12px'
  } : {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  const rulerCity1 = rulerStart ? cityData[rulerStart] : null;
  const rulerCity2 = rulerEnd ? cityData[rulerEnd] : null;
  const rulerDist = rulerCity1 && rulerCity2 ? calculateGreatCircleDistance(rulerCity1, rulerCity2) : 0;
  const rulerBearing = rulerCity1 && rulerCity2 ? calculateBearing(rulerCity1, rulerCity2) : 0;
  const rulerDir = getDirectionText(rulerBearing);

  return (
    <div style={containerStyle}>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes pulse-wave {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.05); }
        }
        @keyframes river-flow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes city-glow {
          0%, 100% { opacity: 0.65; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
      `}</style>

      {/* Top Map Context & Layer Control Bar */}
      <div style={{
        padding: '6px 10px',
        background: mapStyle === 'satellite' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.94)',
        borderBottom: '1.5px solid #F2DFBC',
        borderRadius: isFullscreen ? '14px 14px 0 0' : '0',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: '4px',
        fontSize: '11px',
        fontFamily: '"Space Grotesk", sans-serif',
        color: '#78350F',
        fontWeight: 700,
        zIndex: 5
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} color="#16A34A" />
          <span>Source: <strong>Chennai</strong> (13°N, 80°E)</span>
        </div>



        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {currentMission && cityData[currentMission.id] && (
            <span style={{ background: '#FEF3C7', padding: '2px 5px', borderRadius: '4px', border: '1px solid #FDE68A', color: '#92400E', fontWeight: 800, fontSize: '10px' }}>
              📍 {cityData[currentMission.id].name}
            </span>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "View Map in Fullscreen"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: isFullscreen ? '#EF4444' : '#0E3556',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <><Minimize2 size={11} /> Exit</> : <><Maximize2 size={10} /> Fullscreen</>}
          </button>
        </div>
      </div>

      {rulerMode && (
        <div style={{
          background: '#FFF7ED',
          borderBottom: '1.5px solid #FDBA74',
          padding: '4px 10px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#9A3412',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Ruler size={13} color="#EA580C" />
            <span>
              {!rulerStart && "Click 1st city on the map to start measuring..."}
              {rulerStart && !rulerEnd && `Point A: ${cityData[rulerStart].name}. Now click 2nd city...`}
              {rulerStart && rulerEnd && (
                <span>
                  <strong>{cityData[rulerStart].name} ➔ {cityData[rulerEnd].name}:</strong> <span style={{ color: '#15803D', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>{rulerDist} km</span> • Bearing: <span style={{ color: '#1E40AF', background: '#DBEAFE', padding: '1px 5px', borderRadius: '4px' }}>{rulerBearing}° ({rulerDir})</span> • Flight: ~{Math.round(rulerDist / 14)}m
                </span>
              )}
            </span>
          </div>

          <button
            onClick={() => {
              setRulerStart(null);
              setRulerEnd(null);
            }}
            style={{
              background: '#FED7AA',
              border: 'none',
              borderRadius: '4px',
              padding: '1px 6px',
              fontSize: '10px',
              fontWeight: 800,
              color: '#9A3412',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Main SVG Map Canvas */}
      <div style={{
        flex: 1,
        minHeight: 0,
        position: 'relative',
        overflow: 'hidden',
        background: mapStyle === 'satellite'
          ? 'radial-gradient(ellipse at 50% 50%, #0c1a30 0%, #030712 100%)'
          : (mapStyle === 'physical'
            ? 'radial-gradient(ellipse at 60% 50%, #C7EAFE 0%, #93D4FB 40%, #38BDF8 85%, #0284C7 100%)'
            : '#F8FAFC'),
        borderRadius: isFullscreen ? '0 0 14px 14px' : '0'
      }}>
        <svg
          viewBox="-10 -10 615 690"
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        >
          <defs>
            <filter id="mapShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.16" floodColor="#0F172A" />
            </filter>

            <linearGradient id="himalaya3DGrad" x1="0%" y1="0%" x2="40%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="desert3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FDE047" />
              <stop offset="75%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            <linearGradient id="rainforest3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="40%" stopColor="#16A34A" />
              <stop offset="80%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>

            <linearGradient id="plains3DGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="50%" stopColor="#86EFAC" />
              <stop offset="85%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>

            <linearGradient id="plateau3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="45%" stopColor="#FDE68A" />
              <stop offset="80%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>

            <linearGradient id="tamilNadu3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="45%" stopColor="#86EFAC" />
              <stop offset="85%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>

            <linearGradient id="destinationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>

            <linearGradient id="completedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EFF6FF" />
              <stop offset="100%" stopColor="#BFDBFE" />
            </linearGradient>

            <radialGradient id="cityGlow">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#F59E0B" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>

            <pattern id="nasaSatellitePattern" patternUnits="userSpaceOnUse" x="-10" y="-10" width="635" height="705">
              <image
                href={nasaSatelliteImg}
                x="0"
                y="0"
                width="635"
                height="705"
                preserveAspectRatio="xMidYMid slice"
                style={{ imageRendering: 'high-quality', filter: 'contrast(1.18) brightness(1.02) saturate(1.18)' }}
              />
            </pattern>
            <clipPath id="indiaLandClip">
              {IndiaMapData.locations.map(loc => (
                <path key={`clip-${loc.id}`} d={loc.path} />
              ))}
            </clipPath>
          </defs>

          {/* Photorealistic NASA Space Satellite Imagery - Precision Aligned & Clipped to India */}
          <g clipPath="url(#indiaLandClip)">
            <image
              href={nasaSatelliteImg}
              x="-106"
              y="-236"
              width="810"
              height="1130"
              preserveAspectRatio="none"
              style={{
                filter: 'contrast(1.2) brightness(1.02) saturate(1.2)',
                pointerEvents: 'none'
              }}
            />
          </g>

          {/* State Boundary Polygons Layer - Accurate Outline Tracing */}
          <g filter="url(#mapShadow)">
            {IndiaMapData.locations.map((loc) => (
              <path
                key={loc.id}
                id={`state-${loc.id}`}
                d={loc.path}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.48)"
                strokeWidth="0.85"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => handleCityClick(loc.id)}
              />
            ))}
          </g>

          {/* Trajectories & Routes Layer - Solely Current Active Flight Route */}
          <g>
            {currentDestinationId && (
              <>
                {activeRoute?.showBoth && renderFlightRoute('ka', true, false)}
                {renderFlightRoute(currentDestinationId, false, animating)}
              </>
            )}
          </g>

          {/* Dynamic Ruler Measurement Line Overlay */}
          {rulerStart && rulerEnd && stateCentroids[rulerStart] && stateCentroids[rulerEnd] && (
            <g pointerEvents="none">
              <line
                x1={stateCentroids[rulerStart].x}
                y1={stateCentroids[rulerStart].y}
                x2={stateCentroids[rulerEnd].x}
                y2={stateCentroids[rulerEnd].y}
                stroke="#EA580C"
                strokeWidth="3"
                strokeDasharray="5 3"
              />
              <g transform={`translate(${(stateCentroids[rulerStart].x + stateCentroids[rulerEnd].x) / 2}, ${(stateCentroids[rulerStart].y + stateCentroids[rulerEnd].y) / 2 - 10})`}>
                <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.25))" />
                <text x="0" y="3.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif">
                  {rulerDist} km ({rulerDir})
                </text>
              </g>
            </g>
          )}

          {/* City Labels & Landmark Badges - Exclusively Source & Current Flight Destination */}
          <g>
            {missionIndex >= 0 && (
              <g transform={`translate(${startNode.x}, ${startNode.y})`} style={{ cursor: 'pointer' }} onClick={() => handleCityClick('tn')}>
                <circle r="20" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.6" style={{ animation: 'pulse-wave 2.5s infinite' }} />
                <line
                  x1="0"
                  y1="0"
                  x2={24 * Math.cos((radarAngle * Math.PI) / 180)}
                  y2={24 * Math.sin((radarAngle * Math.PI) / 180)}
                  stroke="#16A34A"
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                <circle r="7" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.2" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))" />
                <text x="0" y="3.5" fontSize="9" textAnchor="middle" fill="#FFFFFF" fontWeight="900">★</text>

                <g transform="translate(14, -10)">
                  <rect x="0" y="-8" width="96" height="18" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.8" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.3))" />
                  <text x="6" y="4.5" fontSize="9.5" fontWeight="900" fill="#166534" fontFamily="'Space Grotesk', sans-serif">
                    Source: Chennai 📍
                  </text>
                </g>
              </g>
            )}

            {missions.map((m) => {
              const isActive = m.id === currentDestinationId;
              if (!isActive) return null; // Exclusively render the active destination

              const node = stateCentroids[m.id];
              const city = cityData[m.id];
              if (!node || !city) return null;

              const isReached = !animating;

              return (
                <g
                  key={`city-badge-${m.id}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{
                    cursor: 'pointer',
                    opacity: 1,
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCityClick(m.id)}
                >
                  <circle r="22" fill="none" stroke="#D97706" strokeWidth="2" opacity="0.85" style={{ animation: 'ping 1.6s infinite' }} />
                  <circle r="12" fill="#FEF3C7" opacity="0.85" />

                  <circle
                    r="8"
                    fill="#D97706"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    filter="drop-shadow(0 2px 6px rgba(0,0,0,0.4))"
                  />

                  {/* Reveal Destination badge once flight reaches destination */}
                  {isReached && (
                    <g transform={`translate(${city.dx}, ${city.dy})`}>
                      <rect
                        x="0"
                        y="-8"
                        width="126"
                        height="18"
                        rx="6"
                        fill="#FEF3C7"
                        stroke="#D97706"
                        strokeWidth="1.8"
                        filter="drop-shadow(0 3px 8px rgba(0,0,0,0.3))"
                      />
                      <text x="6" y="4.5" fontSize="9.5" fontWeight="900" fill="#78350F" fontFamily="'Space Grotesk', sans-serif">
                        Destination: {city.name}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Interactive 3D Compass Rose HUD */}
          <g transform="translate(540, 70)">
            <circle r="30" fill={mapStyle === 'satellite' ? '#0F172A' : '#FFFFFF'} stroke="#D97706" strokeWidth="2" filter="drop-shadow(0 3px 8px rgba(0,0,0,0.2))" />
            <circle r="25" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 3" />

            <text x="0" y="-16" fontSize="9" fontWeight="900" fill="#DC2626" textAnchor="middle">N</text>
            <text x="18" y="3" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">E</text>
            <text x="0" y="22" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">S</text>
            <text x="-18" y="3" fontSize="8" fontWeight="900" fill="#78350F" textAnchor="middle">W</text>

            {/* Standard Map North Compass Rose */}
            <g transform="rotate(0)">
              <polygon points="0,-18 3,0 0,-1.5 -3,0" fill="#DC2626" stroke="#991B1B" strokeWidth="0.5" />
              <polygon points="0,18 3,0 0,1.5 -3,0" fill="#64748B" stroke="#334155" strokeWidth="0.5" />
              <circle r="2.2" fill="#D97706" stroke="#FFFFFF" strokeWidth="0.8" />
            </g>
          </g>
        </svg>


      </div>

      {selectedCityDetail && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          zIndex: 40,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '2px solid #D97706',
          borderRadius: '12px',
          padding: '10px 12px',
          boxShadow: '0 8px 24px rgba(60,40,20,0.18)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '24px', background: '#FEF3C7', padding: '5px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
              {selectedCityDetail.icon}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#78350F' }}>
                  {selectedCityDetail.name} ({selectedCityDetail.state})
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '1px 5px', borderRadius: '4px' }}>
                  {selectedCityDetail.distance > 0 ? `${selectedCityDetail.distance} km from Chennai` : 'Starting Base'}
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#3D2E24', fontWeight: 600, marginTop: '1px' }}>
                <strong>Landmark:</strong> {selectedCityDetail.landmark} • <strong>Elevation:</strong> {selectedCityDetail.elevation}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                {selectedCityDetail.desc}
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCityDetail(null)}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
