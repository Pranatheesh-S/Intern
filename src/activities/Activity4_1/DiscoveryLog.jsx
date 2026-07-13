import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DiscoveryLog({ discoveredItems, totalItems }) {
  return (
    <div className="glass-panel" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Discovery Log
        <span style={{ fontSize: '0.8rem', background: 'var(--accent)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
          {discoveredItems.length} / {totalItems} Found
        </span>
      </h3>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {discoveredItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
            <p>No items discovered yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Use the Locate controls to move around the island and find materials.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {discoveredItems.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '0.75rem', 
                  background: 'var(--surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Found at ({item.x}, {item.y})</div>
                </div>
                <div>
                  {item.type === 'magnetic' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <CheckCircle size={14} /> Magnetic
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <XCircle size={14} /> Non-Magnetic
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
