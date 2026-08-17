import React from 'react';

/**
 * Chapter overview plate: the three ideas the chapter covers, drawn in the
 * chapter's own navy / amber palette on paper rather than the dark console
 * styling, so it sits on the light page instead of fighting it. Vector, so it
 * stays sharp at any size and costs a few KB instead of a few MB.
 */
export default function EarthAddressArt({ style }) {
  return (
    <svg
      viewBox="0 0 1040 780"
      role="img"
      aria-label="Chapter overview: map components and scale bar, a globe showing latitude and longitude with a target at 28.6 degrees north 77.2 degrees east, and world time zones where every 15 degrees of longitude is one hour"
      fontFamily="Inter, system-ui, sans-serif"
      style={{ width: '100%', height: '100%', maxHeight: '100%', display: 'block', ...style }}
      preserveAspectRatio="xMidYMid meet"
    >

<defs>
  <radialGradient id="sea" cx="34%" cy="28%" r="82%">
    <stop offset="0%" stopColor="#4a97d0"/><stop offset="55%" stopColor="#2470a8"/><stop offset="100%" stopColor="#124b76"/>
  </radialGradient>
  <linearGradient id="sheen" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%" stopColor="#fff" stopOpacity="0.30"/><stop offset="50%" stopColor="#fff" stopOpacity="0.03"/><stop offset="100%" stopColor="#000" stopOpacity="0.20"/>
  </linearGradient>
  <clipPath id="ball"><circle cx="600" cy="300" r="152"/></clipPath>
</defs>

<rect width="1040" height="780" rx="18" fill="#FBF7EE"/>

{/* header */}
<rect x="0" y="0" width="1040" height="58" rx="18" fill="#0E3556"/>
<rect x="0" y="40" width="1040" height="18" fill="#0E3556"/>
<text x="26" y="37" fontSize="19" fontWeight="800" fill="#ffffff" letterSpacing="0.4">CHAPTER 1: LOCATING PLACES ON THE EARTH</text>
<rect x="726" y="14" width="290" height="30" rx="15" fill="none" stroke="#F5A623" strokeWidth="1.6"/>
<text x="871" y="33" fontSize="14" fontWeight="700" fill="#F5A623" textAnchor="middle" letterSpacing="0.6">GRADE 6 · SOCIAL SCIENCE (GEOGRAPHY)</text>

{/* ============ PANEL 1 ============ */}
<rect x="16" y="72" width="330" height="212" rx="14" fill="#ffffff" stroke="#d6e0ec" strokeWidth="1.6"/>
<text x="34" y="100" fontSize="14" fontWeight="800" fill="#0E3556" letterSpacing="0.5">1. MAP COMPONENTS &amp; SCALE</text>

<rect x="34" y="114" width="146" height="106" rx="8" fill="#F3F7FC" stroke="#c3d3e4" strokeWidth="1.4"/>
<path d="M46 196 L84 152 L110 178 L140 140 L168 190" fill="none" stroke="#2f6da8" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round"/>
<g transform="translate(140,152)">
  <path d="M0 12 C0 12 -9 2 -9-5 A9 9 0 1 1 9-5 C9 2 0 12 0 12z" fill="#e11d48" stroke="#fff" strokeWidth="2"/>
  <circle cy="-5" r="3.4" fill="#fff"/>
</g>
<text x="44" y="133" fontSize="14" fontWeight="700" fill="#0E3556">Location Pin</text>

<g transform="translate(262,158)">
  <circle r="40" fill="#F3F7FC" stroke="#c3d3e4" strokeWidth="1.4"/>
  <polygon points="0,-30 7,0 0,-4" fill="#0E3556"/><polygon points="0,-30 -7,0 0,-4" fill="#8aa6bd"/>
  <polygon points="0,30 7,0 0,4" fill="#8aa6bd"/><polygon points="0,30 -7,0 0,4" fill="#c3d3e4"/>
  <text y="-44" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">N</text>
  <text y="56" fontSize="14" fontWeight="700" fill="#5c6b7a" textAnchor="middle">S</text>
  <text x="-50" y="5" fontSize="14" fontWeight="700" fill="#5c6b7a" textAnchor="middle">W</text>
  <text x="50" y="5" fontSize="14" fontWeight="700" fill="#5c6b7a" textAnchor="middle">E</text>
</g>

<text x="34" y="242" fontSize="14" fill="#5c6b7a">Scale Bar:</text>
<g stroke="#0E3556" strokeWidth="2.4">
  <path d="M34 256 h178"/><path d="M34 250 v12"/><path d="M123 250 v12"/><path d="M212 250 v12"/>
</g>
<text x="34" y="276" fontSize="14" fill="#5c6b7a">0</text>
<text x="123" y="276" fontSize="14" fill="#5c6b7a" textAnchor="middle">1000 km</text>
<text x="212" y="276" fontSize="14" fill="#5c6b7a" textAnchor="end">2000 km</text>

{/* ============ PANEL 2 ============ */}
<rect x="362" y="72" width="662" height="412" rx="14" fill="#ffffff" stroke="#d6e0ec" strokeWidth="1.6"/>
<text x="380" y="100" fontSize="14" fontWeight="800" fill="#0E3556" letterSpacing="0.5">2. LATITUDE, LONGITUDE &amp; COORDINATES GRID</text>

<circle cx="600" cy="300" r="152" fill="url(#sea)"/>
<g clipPath="url(#ball)">
  <g fill="#3f8f5e" opacity="0.9">
    <path d="M498 210 q40-24 78-8 t52 18 q12 22-12 32 -30 14-60 4 -34-10-50-28z"/>
    <path d="M520 300 q32-10 46 12 t0 44 q-8 28-26 40 -18 10-26-8 -8-20-2-44z"/>
    <path d="M632 278 q46-16 72 6 t30 42 q2 24-24 28 -38 4-62-18 -22-22-16-58z"/>
  </g>
  <g stroke="#dbeafe" strokeOpacity="0.5" fill="none" strokeWidth="1.5">
    <path d="M462 234 q138 24 276 0"/><path d="M460 262 q140 26 280 0"/>
    <path d="M466 322 q134-26 268 0"/><path d="M470 350 q130-24 260 0"/>
  </g>
  <g stroke="#dbeafe" strokeOpacity="0.4" fill="none" strokeWidth="1.5">
    <ellipse cx="600" cy="300" rx="50" ry="152"/><ellipse cx="600" cy="300" rx="102" ry="152"/>
  </g>
  <path d="M448 300 h304" stroke="#F5A623" strokeWidth="3.2"/>
  <path d="M600 148 v304" stroke="#F5A623" strokeWidth="2.8"/>
  <circle cx="600" cy="300" r="152" fill="url(#sheen)"/>
</g>
<circle cx="600" cy="300" r="152" fill="none" stroke="#0E3556" strokeWidth="2.6"/>

<text x="600" y="134" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">NORTH (+)</text>
<text x="600" y="472" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">SOUTH (−)</text>
<text x="404" y="305" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">WEST (−)</text>
<text x="794" y="305" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">EAST (+)</text>

<circle cx="664" cy="248" r="7" fill="#fff" stroke="#e11d48" strokeWidth="3"/>
<g transform="translate(442,232)">
  <rect width="204" height="32" rx="9" fill="#0E3556"/>
  <text x="14" y="21" fontSize="14" fontWeight="700" fill="#ffffff">Target: 28.6° N, 77.2° E</text>
  <path d="M204 16 H216" stroke="#0E3556" strokeWidth="2.4"/>
</g>

<path d="M660 248 H452" stroke="#0E3556" strokeWidth="1.6" strokeDasharray="5 5" opacity="0.55"/>
<rect x="828" y="112" width="182" height="150" rx="10" fill="#F3F7FC" stroke="#c3d3e4" strokeWidth="1.4"/>
<text x="842" y="132" fontSize="14" fontWeight="700" fill="#0E3556">2D Coordinate Grid Map</text>
<g stroke="#c3d3e4" strokeWidth="1" opacity="0.9">
  <path d="M842 152 h156"/><path d="M842 174 h156"/><path d="M842 218 h156"/><path d="M842 240 h156"/>
  <path d="M872 144 v104"/><path d="M916 144 v104"/><path d="M964 144 v104"/>
</g>
<path d="M842 196 h156" stroke="#0E3556" strokeWidth="2"/>
<path d="M932 144 v104" stroke="#0E3556" strokeWidth="2"/>
<circle cx="964" cy="174" r="4.5" fill="#e11d48"/>
<g transform="translate(900,232)"><rect width="96" height="20" rx="6" fill="#F5A623"/>
<text x="48" y="14.5" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">30° N, 80° E</text></g>

{/* ============ PANEL 3 ============ */}
<rect x="16" y="500" width="1008" height="264" rx="14" fill="#ffffff" stroke="#d6e0ec" strokeWidth="1.6"/>
<text x="34" y="528" fontSize="14" fontWeight="800" fill="#0E3556" letterSpacing="0.5">3. LONGITUDE &amp; WORLD TIME ZONES (15° = 1 HOUR)</text>

<g id="clocks">
  <g transform="translate(120,584)"><circle r="34" fill="#F3F7FC" stroke="#0E3556" strokeWidth="2.2"/><path d="M0 0 v-22" stroke="#0E3556" strokeWidth="3" strokeLinecap="round" transform="rotate(120)"/><path d="M0 0 v-16" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" transform="rotate(30)"/><circle r="2.6" fill="#0E3556"/></g>
  <g transform="translate(320,584)"><circle r="34" fill="#F3F7FC" stroke="#0E3556" strokeWidth="2.2"/><path d="M0 0 v-22" stroke="#0E3556" strokeWidth="3" strokeLinecap="round" transform="rotate(240)"/><path d="M0 0 v-16" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" transform="rotate(180)"/><circle r="2.6" fill="#0E3556"/></g>
  <g transform="translate(520,584)"><circle r="34" fill="#FFF6E6" stroke="#F5A623" strokeWidth="2.6"/><path d="M0 0 v-22" stroke="#0E3556" strokeWidth="3" strokeLinecap="round"/><path d="M0 0 v-16" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/><circle r="2.6" fill="#0E3556"/></g>
  <g transform="translate(720,584)"><circle r="34" fill="#F3F7FC" stroke="#0E3556" strokeWidth="2.2"/><path d="M0 0 v-22" stroke="#0E3556" strokeWidth="3" strokeLinecap="round" transform="rotate(120)"/><path d="M0 0 v-16" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" transform="rotate(240)"/><circle r="2.6" fill="#0E3556"/></g>
  <g transform="translate(920,584)"><circle r="34" fill="#F3F7FC" stroke="#0E3556" strokeWidth="2.2"/><path d="M0 0 v-22" stroke="#0E3556" strokeWidth="3" strokeLinecap="round" transform="rotate(240)"/><path d="M0 0 v-16" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" transform="rotate(60)"/><circle r="2.6" fill="#0E3556"/></g>
</g>
<g textAnchor="middle" fontSize="14">
  <text x="120" y="642" fontWeight="800" fill="#0E3556">120° W</text><text x="120" y="660" fontSize="14" fill="#5c6b7a">Pacific Time</text><text x="120" y="680" fontWeight="800" fill="#20303f">4:00 AM</text>
  <text x="320" y="642" fontWeight="800" fill="#0E3556">60° W</text><text x="320" y="660" fontSize="14" fill="#5c6b7a">Atlantic Time</text><text x="320" y="680" fontWeight="800" fill="#20303f">8:00 AM</text>
  <text x="520" y="642" fontWeight="800" fill="#b8791a">0° GMT</text><text x="520" y="660" fontSize="14" fill="#5c6b7a">Greenwich (Noon)</text><text x="520" y="680" fontWeight="800" fill="#20303f">12:00 PM</text>
  <text x="720" y="642" fontWeight="800" fill="#0E3556">60° E</text><text x="720" y="660" fontSize="14" fill="#5c6b7a">Middle East</text><text x="720" y="680" fontWeight="800" fill="#20303f">4:00 PM</text>
  <text x="920" y="642" fontWeight="800" fill="#0E3556">120° E</text><text x="920" y="660" fontSize="14" fill="#5c6b7a">East Asia / Tokyo</text><text x="920" y="680" fontWeight="800" fill="#20303f">8:00 PM</text>
</g>

<rect x="36" y="700" width="968" height="46" rx="10" fill="#F3F7FC" stroke="#c3d3e4" strokeWidth="1.4"/>
<text x="56" y="722" fontSize="14" fontWeight="800" fill="#0E3556">WEST (Time is Earlier)</text>
<text x="56" y="739" fontSize="14" fill="#5c6b7a">Every 15° West = −1 Hour</text>
<rect x="446" y="700" width="148" height="46" rx="10" fill="#F5A623"/>
<text x="520" y="722" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="middle">NOON (0° GMT)</text>
<text x="520" y="739" fontSize="14" fill="#7a5a2a" textAnchor="middle">Prime Meridian</text>
<text x="984" y="722" fontSize="14" fontWeight="800" fill="#0E3556" textAnchor="end">EAST (Time is Later)</text>
<text x="984" y="739" fontSize="14" fill="#5c6b7a" textAnchor="end">Every 15° East = +1 Hour</text>
    </svg>
  );
}
