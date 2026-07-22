import React from "react";

export const CardboardBaseSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-90" y="-40" width="180" height="80" rx="4" fill="#d2b48c" stroke="#8b4513" strokeWidth="2" />
      <circle cx="-60" cy="-20" r="2" fill="#8b4513" />
      <circle cx="60" cy="20" r="2" fill="#8b4513" />
    </g>
  );
};

export const NailSVG = ({ x = 0, y = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-2" y="-15" width="4" height="25" fill="#94a3b8" />
      <path d="M-2,10 L0,15 L2,10 Z" fill="#94a3b8" />
      <ellipse cx="0" cy="-15" rx="5" ry="2" fill="#64748b" />
    </g>
  );
};

export const NichromeWireSVG = ({ x1 = -50, y1 = 0, x2 = 50, y2 = 0, isPlaced }) => {
  if (!isPlaced) return null;
  return (
    <g>
      <path d={`M${x1},${y1} L${x2},${y2}`} fill="none" stroke="#6b7280" strokeWidth="3" />
    </g>
  );
};
