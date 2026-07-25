import React from 'react';

/*
  Realistic vector illustrations for the magnet-test objects.
  Each icon draws in a 48x48 viewBox. Usage: <ObjectIcon id="screw" size={46} />
*/

const icons = {
  // ---------- Wooden Block ----------
  wood: (
    <g>
      <polygon points="8,18 24,10 42,18 26,26" fill="#c9954f" />
      <polygon points="8,18 26,26 26,42 8,34" fill="#a97433" />
      <polygon points="26,26 42,18 42,34 26,42" fill="#8a5c25" />
      <g stroke="#8a5c25" strokeWidth="0.8" opacity="0.5">
        <line x1="12" y1="21" x2="28" y2="28" />
        <line x1="12" y1="27" x2="28" y2="34" />
        <line x1="12" y1="33" x2="28" y2="40" />
      </g>
      <g stroke="#6f4a1c" strokeWidth="0.8" opacity="0.5">
        <line x1="30" y1="27" x2="40" y2="21" />
        <line x1="30" y1="33" x2="40" y2="27" />
      </g>
    </g>
  ),

  // ---------- Screw ----------
  screw: (
    <g>
      <defs>
        <linearGradient id="mgMetal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8ecf1" />
          <stop offset="0.5" stopColor="#b7c0cc" />
          <stop offset="1" stopColor="#7d8794" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="11" rx="9" ry="4.5" fill="url(#mgMetal)" stroke="#6b7480" strokeWidth="0.8" />
      <line x1="17" y1="11" x2="31" y2="11" stroke="#5c646f" strokeWidth="1.6" />
      <path d="M18 14 L30 14 L28 20 L20 20 Z" fill="url(#mgMetal)" stroke="#7d8794" strokeWidth="0.6" />
      <path d="M20 20 L28 20 L22 40 Z" fill="url(#mgMetal)" stroke="#7d8794" strokeWidth="0.6" />
      <g stroke="#6b7480" strokeWidth="1" opacity="0.8">
        <line x1="20.5" y1="22" x2="27.5" y2="24" />
        <line x1="21" y1="26" x2="27" y2="28" />
        <line x1="21.6" y1="30" x2="26.4" y2="32" />
        <line x1="22.4" y1="34" x2="25.6" y2="36" />
      </g>
    </g>
  ),

  // ---------- Eraser ----------
  eraser: (
    <g>
      <polygon points="10,22 34,16 40,20 16,26" fill="#ffd1dc" />
      <polygon points="10,22 16,26 16,36 10,32" fill="#f4a9bd" />
      <polygon points="16,26 40,20 40,30 16,36" fill="#f79fb4" />
      <polygon points="10,22 34,16 34,20 10,26" fill="#5b6b9e" opacity="0" />
      <polygon points="16,26 16,29 40,23 40,20" fill="#e77e9a" opacity="0.6" />
    </g>
  ),

  // ---------- Paper Clip ----------
  clip: (
    <g fill="none" stroke="#9aa6b4" strokeWidth="3" strokeLinecap="round">
      <path d="M18 12 L18 34 a5 5 0 0 0 10 0 L28 16 a4 4 0 0 0 -8 0 L20 32" />
      <path d="M18 12 L18 34 a5 5 0 0 0 10 0 L28 16 a4 4 0 0 0 -8 0 L20 32" stroke="#c9d2dc" strokeWidth="1" />
    </g>
  ),

  // ---------- Copper Wire (spool) ----------
  copper: (
    <g>
      <ellipse cx="24" cy="34" rx="15" ry="6" fill="#8a5a2b" />
      <rect x="9" y="16" width="30" height="18" fill="#c8772f" />
      <ellipse cx="24" cy="16" rx="15" ry="6" fill="#a45f22" />
      <g stroke="#e2953f" strokeWidth="1.4" opacity="0.9">
        <line x1="11" y1="19" x2="37" y2="19" />
        <line x1="10" y1="23" x2="38" y2="23" />
        <line x1="10" y1="27" x2="38" y2="27" />
        <line x1="11" y1="31" x2="37" y2="31" />
      </g>
      <path d="M37 20 q6 -2 4 -8" fill="none" stroke="#c8772f" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),

  // ---------- Key ----------
  key: (
    <g>
      <defs>
        <linearGradient id="mgGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#d99a1c" />
        </linearGradient>
      </defs>
      <circle cx="15" cy="15" r="8" fill="none" stroke="url(#mgGold)" strokeWidth="4" />
      <circle cx="15" cy="15" r="3" fill="#efe4c8" />
      <rect x="20" y="20" width="18" height="4" rx="1.5" transform="rotate(45 20 20)" fill="url(#mgGold)" />
      <rect x="32" y="30" width="4" height="6" fill="url(#mgGold)" />
      <rect x="35" y="33" width="4" height="6" fill="url(#mgGold)" />
    </g>
  ),

  // ---------- Sharpener ----------
  sharpener: (
    <g>
      <polygon points="10,20 38,16 40,30 12,34" fill="#e14b8a" />
      <polygon points="10,20 12,34 12,38 10,24" fill="#b83570" />
      <polygon points="12,34 40,30 40,34 12,38" fill="#c93d79" />
      <polygon points="16,21 34,18 33,26 16,29" fill="#cfd6de" opacity="0.85" />
      <polygon points="18,22 32,19.5 24,25" fill="#9aa6b4" />
      <circle cx="24" cy="23" r="1.4" fill="#5c646f" />
    </g>
  ),

  // ---------- Nails ----------
  nails: (
    <g>
      <defs>
        <linearGradient id="mgIron" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d7dde4" />
          <stop offset="0.5" stopColor="#9aa6b4" />
          <stop offset="1" stopColor="#6b7480" />
        </linearGradient>
      </defs>
      <g transform="rotate(20 24 24)">
        <ellipse cx="24" cy="12" rx="7" ry="2.6" fill="url(#mgIron)" stroke="#6b7480" strokeWidth="0.6" />
        <path d="M20 13 L28 13 L25 38 L23 38 Z" fill="url(#mgIron)" stroke="#7d8794" strokeWidth="0.5" />
      </g>
      <g transform="rotate(-14 24 24)" opacity="0.92">
        <ellipse cx="26" cy="14" rx="6" ry="2.3" fill="url(#mgIron)" stroke="#6b7480" strokeWidth="0.6" />
        <path d="M22.5 15 L29.5 15 L27 37 L25 37 Z" fill="url(#mgIron)" stroke="#7d8794" strokeWidth="0.5" />
      </g>
    </g>
  ),

  // ---------- Mirror ----------
  mirror: (
    <g>
      <defs>
        <linearGradient id="mgGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf6ff" />
          <stop offset="0.5" stopColor="#bcdcf0" />
          <stop offset="1" stopColor="#8fb8d4" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="20" rx="14" ry="16" fill="#caa76a" />
      <ellipse cx="24" cy="20" rx="10.5" ry="12.5" fill="url(#mgGlass)" />
      <path d="M18 12 L28 26" stroke="#ffffff" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
      <path d="M22 11 L26 16" stroke="#ffffff" strokeWidth="1.6" opacity="0.6" strokeLinecap="round" />
      <rect x="21" y="35" width="6" height="9" rx="2" fill="#caa76a" />
    </g>
  ),

  // ---------- Marker ----------
  marker: (
    <g transform="rotate(45 24 24)">
      <rect x="20" y="8" width="8" height="24" rx="2" fill="#2f6fd6" />
      <rect x="20" y="8" width="3" height="24" fill="#5b93ea" opacity="0.7" />
      <rect x="19" y="30" width="10" height="4" rx="1" fill="#1f4f9e" />
      <polygon points="20,34 28,34 26,42 22,42" fill="#e9e3d2" />
      <polygon points="22,42 26,42 24,45" fill="#3a3a3a" />
    </g>
  ),

  // ---------- Glass Tumbler ----------
  glass: (
    <g>
      <defs>
        <linearGradient id="mgGlass2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf6ff" />
          <stop offset="0.5" stopColor="#bcdcf0" />
          <stop offset="1" stopColor="#8fb8d4" />
        </linearGradient>
      </defs>
      <path d="M14 12 L34 12 L31 40 L17 40 Z" fill="url(#mgGlass2)" stroke="#a9c9dd" strokeWidth="1" opacity="0.92" />
      <path d="M16 24 L32 24 L31 40 L17 40 Z" fill="#8fc7e8" opacity="0.55" />
      <path d="M18 15 L20 37" stroke="#ffffff" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
      <ellipse cx="24" cy="12" rx="10" ry="2.4" fill="#dff0fb" stroke="#a9c9dd" strokeWidth="0.8" />
    </g>
  ),

  // ---------- Scissors ----------
  scissors: (
    <g>
      <line x1="16" y1="14" x2="34" y2="30" stroke="#b7c0cc" strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="14" x2="14" y2="30" stroke="#9aa6b4" strokeWidth="4" strokeLinecap="round" />
      <circle cx="12" cy="33" r="4.5" fill="none" stroke="#e14b8a" strokeWidth="3" />
      <circle cx="36" cy="33" r="4.5" fill="none" stroke="#2f6fd6" strokeWidth="3" />
      <circle cx="24" cy="22" r="1.6" fill="#5c646f" />
    </g>
  ),

  // ---------- Candle ----------
  candle: (
    <g>
      <rect x="17" y="18" width="14" height="24" rx="2" fill="#f5e6c8" />
      <rect x="17" y="18" width="4" height="24" fill="#fff6e2" opacity="0.8" />
      <ellipse cx="24" cy="18" rx="7" ry="2.4" fill="#efdcb4" />
      <rect x="23" y="10" width="2" height="6" fill="#5c4326" />
      <path d="M24 4 C20 8 21 14 24 14 C27 14 28 9 24 4 Z" fill="#ffb020" />
      <path d="M24 7 C22 9 22.5 13 24 13 C25.5 13 26 9.5 24 7 Z" fill="#ffe07a" />
    </g>
  ),

  // ---------- Plastic Ruler ----------
  ruler: (
    <g transform="rotate(-30 24 24)">
      <rect x="4" y="20" width="40" height="10" rx="1.5" fill="#f6d34a" opacity="0.9" />
      <rect x="4" y="20" width="40" height="3.5" fill="#fff09a" opacity="0.7" />
      <g stroke="#7a6410" strokeWidth="0.9">
        <line x1="9" y1="20" x2="9" y2="26" /><line x1="14" y1="20" x2="14" y2="24" />
        <line x1="19" y1="20" x2="19" y2="26" /><line x1="24" y1="20" x2="24" y2="24" />
        <line x1="29" y1="20" x2="29" y2="26" /><line x1="34" y1="20" x2="34" y2="24" />
        <line x1="39" y1="20" x2="39" y2="26" />
      </g>
    </g>
  ),

  // ---------- Stapler ----------
  stapler: (
    <g>
      <path d="M8 30 Q8 26 12 26 L38 30 Q42 30 42 34 L42 36 L8 36 Z" fill="#3a3a3a" opacity="0.25" />
      <path d="M10 22 Q10 18 15 19 L40 25 Q43 26 43 30 L12 30 Q9 30 9 27 Z" fill="#d13b4c" />
      <path d="M10 22 Q10 18 15 19 L40 25 L40 27 L11 24 Z" fill="#ee6a78" opacity="0.8" />
      <path d="M9 30 L42 30 L42 34 Q42 37 38 37 L13 37 Q9 37 9 33 Z" fill="#4a5560" />
      <ellipse cx="26" cy="30" rx="18" ry="1.6" fill="#2c343d" />
    </g>
  ),

  // ---------- Pencil ----------
  pencil: (
    <g transform="rotate(45 24 24)">
      <rect x="20" y="10" width="8" height="22" fill="#f6b93b" />
      <rect x="20" y="10" width="3" height="22" fill="#ffd873" />
      <rect x="20" y="6" width="8" height="4" fill="#c0392b" />
      <rect x="20" y="4" width="8" height="3" fill="#cfd6de" />
      <polygon points="20,32 28,32 24,40" fill="#e0b884" />
      <polygon points="22.5,37 25.5,37 24,40" fill="#3a3a3a" />
    </g>
  ),

  // ---------- Cloth ----------
  cloth: (
    <g>
      <path d="M8 18 Q24 12 40 18 L40 34 Q24 40 8 34 Z" fill="#6aa9e0" />
      <path d="M8 18 Q24 24 40 18 L40 22 Q24 28 8 22 Z" fill="#4d8dc9" opacity="0.7" />
      <path d="M8 26 Q24 32 40 26 L40 30 Q24 36 8 30 Z" fill="#3f7cb8" opacity="0.6" />
      <path d="M8 18 Q24 12 40 18" fill="none" stroke="#8fc0ec" strokeWidth="1.4" opacity="0.8" />
    </g>
  )
};

export default function ObjectIcon({ id, size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {icons[id] || null}
    </svg>
  );
}
