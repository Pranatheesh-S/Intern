import React from 'react';

export default function LandscapeCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1c1917' }}>
      <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="staticSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#e7e5e4" />
          </linearGradient>

          {/* Rocky gradient for mountains */}
          <linearGradient id="rockyMountain1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#57534e" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
          <linearGradient id="rockyMountain2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#44403c" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1000" height="800" fill="url(#staticSky)" />

        {/* Clouds */}
        <path d="M150,120 Q170,90 200,100 Q230,80 250,110 Q280,110 270,130 Q280,150 250,150 L150,150 Q120,150 130,130 Z" fill="#94a3b8" opacity="0.6" />
        <path d="M700,180 Q730,150 760,160 Q800,130 820,170 Q860,170 850,200 Q860,220 820,220 L700,220 Q660,220 670,190 Z" fill="#94a3b8" opacity="0.5" />

        {/* Mountains */}
        {/* Left Mountain */}
        <path d="M-100,800 L250,200 L550,800 Z" fill="url(#rockyMountain1)" />
        {/* Middle Tallest Mountain */}
        <path d="M150,800 L450,100 L800,800 Z" fill="url(#rockyMountain2)" />
        <path d="M450,100 L800,800 L500,800 Z" fill="rgba(0,0,0,0.2)" /> {/* Shadow side */}
        {/* Right Mountain */}
        <path d="M500,800 L750,280 L1100,800 Z" fill="url(#rockyMountain1)" />
        <path d="M750,280 L1100,800 L800,800 Z" fill="rgba(0,0,0,0.15)" />

        {/* Ground / Valley */}
        <path d="M0,450 Q400,450 1000,550 L1000,800 L0,800 Z" fill="#a8a29e" />

        {/* Dry River Path */}
        <path d="M380,300 Q400,450 450,500 T580,620 T750,700 T1000,750" fill="none" stroke="#78716c" strokeWidth="12" strokeDasharray="5 10" />

        {/* Village */}
        <g id="village">
          {/* Dirt Road */}
          <path d="M480,500 Q500,530 450,560" fill="none" stroke="#78716c" strokeWidth="6" />
          {/* Houses */}
          <rect x="470" y="490" width="25" height="15" fill="#78716c" />
          <polygon points="465,490 482,475 500,490" fill="#57534e" />
          <rect x="500" y="500" width="30" height="20" fill="#57534e" />
          <polygon points="495,500 515,480 535,500" fill="#44403c" />
          <rect x="450" y="520" width="20" height="15" fill="#78716c" />
          <polygon points="445,520 460,505 475,520" fill="#57534e" />
          {/* Water Tank */}
          <rect x="540" y="510" width="15" height="15" fill="#a8a29e" rx="2" />
          <line x1="540" y1="525" x2="540" y2="535" stroke="#78716c" strokeWidth="2" />
          <line x1="555" y1="525" x2="555" y2="535" stroke="#78716c" strokeWidth="2" />
        </g>

        {/* Trees scattered around (dull/muted colors) */}
        <circle cx="430" cy="480" r="8" fill="#78716c" />
        <circle cx="560" cy="510" r="10" fill="#57534e" />
        <circle cx="520" cy="470" r="7" fill="#78716c" />
        <circle cx="380" cy="530" r="9" fill="#57534e" />
        <circle cx="600" cy="540" r="12" fill="#78716c" />
        <circle cx="680" cy="520" r="14" fill="#57534e" />
        <circle cx="850" cy="580" r="10" fill="#78716c" />

        {/* Farm (Dry) */}
        <g id="farm">
          <path d="M600,600 L750,650 L650,750 L500,700 Z" fill="#8b5a2b" stroke="#5c3a21" strokeWidth="2" opacity="0.6" />
          <path d="M630,620 L730,655" fill="none" stroke="#5c3a21" strokeWidth="2" />
          <path d="M610,650 L710,685" fill="none" stroke="#5c3a21" strokeWidth="2" />
          <path d="M590,680 L690,715" fill="none" stroke="#5c3a21" strokeWidth="2" />
        </g>

        {/* Small City */}
        <g id="city">
          {/* Buildings */}
          <rect x="800" y="600" width="50" height="150" fill="#57534e" />
          <rect x="810" y="620" width="10" height="10" fill="#292524" />
          <rect x="830" y="620" width="10" height="10" fill="#292524" />
          <rect x="810" y="650" width="10" height="10" fill="#292524" />
          
          <rect x="860" y="680" width="40" height="70" fill="#44403c" />
          <rect x="730" y="650" width="60" height="100" fill="#78716c" />
          
          {/* Water Tower */}
          <rect x="710" y="630" width="8" height="30" fill="#57534e" />
          <line x1="705" y1="650" x2="725" y2="650" stroke="#44403c" strokeWidth="2" />
          <ellipse cx="714" cy="620" rx="15" ry="10" fill="#a8a29e" />
        </g>

      </svg>
    </div>
  );
}
