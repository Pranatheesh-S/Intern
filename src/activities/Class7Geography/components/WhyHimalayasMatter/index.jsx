import React from 'react';
import LandscapeCanvas from './WaterSystemComponents/LandscapeCanvas';
import MissionCard from './WaterSystemComponents/MissionCard';
import ProgressCard from './WaterSystemComponents/ProgressCard';
import ResourceInventory from './WaterSystemComponents/ResourceInventory';
import CurrentTaskCard from './WaterSystemComponents/CurrentTaskCard';

export default function WhyHimalayasMatter() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Header */}
      <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border)' }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          THE HIMALAYAS
        </h5>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'var(--text-heading)', lineHeight: 1.1 }}>
          Why the Himalayas Matter
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '700px' }}>
          Can you build a natural water system that supplies water from the Himalayas to the people living below?
        </p>
      </div>

      {/* Main Content Area (Responsive Layout) */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
        
        {/* Left Section: Landscape Canvas (70%) */}
        <div style={{ flex: '1 1 70%', minWidth: '600px', display: 'flex', borderRight: '1px solid var(--border)', background: '#1c1917' }}>
          <LandscapeCanvas />
        </div>

        {/* Right Section: Mission Panel (30%) */}
        <div style={{ flex: '0 0 30%', minWidth: '350px', background: 'var(--card-bg)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          <MissionCard />
          <ProgressCard />
          <ResourceInventory />
          <CurrentTaskCard />
        </div>

      </div>
      
    </div>
  );
}
