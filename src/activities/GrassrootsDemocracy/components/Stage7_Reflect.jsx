import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function Stage7_Reflect({ onComplete, addXp }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', textAlign: 'center', padding: '2rem 0' }}>
      <CheckCircle size={60} color="#10b981" />
      <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)' }}>
        Chapter Completed!
      </h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px' }}>
        You have successfully managed Lakshmanpur village, explored the three-tier system, learned about inspiring Sarpanchs, and discovered the ancient roots of democracy.
      </p>

      {!done ? (
        <button 
          onClick={() => { addXp(50); setDone(true); }}
          className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}
        >
          Claim Chapter Reward (+50 XP)
        </button>
      ) : (
        <div style={{ color: '#eab308', fontSize: '1.2rem', fontWeight: 'bold' }}>
          XP Claimed! You are a Democracy Champion.
        </div>
      )}
    </div>
  );
}
