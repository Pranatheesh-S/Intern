import React from 'react';
import FindingRoutePage from './FindingRoutePage';

export default function LostInTheCity({ onComplete, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, minHeight: '600px', height: '100%' }}>
        {/* Interactive Map Journey */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <FindingRoutePage onBeginChapter={onComplete} onBack={onBack} onMissionUnlock={() => {}} />
        </div>
      </div>
    </div>
  );
}
