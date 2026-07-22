import React from 'react';

export default function ResourceInventory() {
  return (
    <div style={{ flex: 1, background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', minHeight: '200px' }}>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 1rem 0' }}>
        Resource Inventory
      </h3>
      {/* Empty container ready to hold resources later */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Placeholder for future resource cards */}
      </div>
    </div>
  );
}
