import React, { useState } from 'react';

export default function Handbook_Matter({ stageCompleted = false }) {
  const [bookPage, setBookPage] = useState(1);
  const [isHandbookRead, setIsHandbookRead] = useState(false);

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', 
        border: 'clamp(6px, 1.5vw, 18px) solid #064e3b',
        position: 'relative',
        overflow: 'hidden'
    }}>
      {/* Book Spine (Right Edge) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '30px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 10 }} />

      {bookPage === 1 ? (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* ================= LEFT PAGE ================= */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#064e3b', fontWeight: 'bold', borderBottom: '4px solid #10b981', paddingBottom: '8px', display: 'inline-block' }}>
            What is Matter?
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginBottom: '24px', gap: '16px' }}>
            <div style={{ fontSize: 'clamp(44.8px, 6.4vw, 96px)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>🌍</div>
          </div>

          <div style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '24px' }}>
            <p style={{ margin: '0 0 16px 0' }}>Mass and volume are the two properties possessed by all materials.</p>
            <p style={{ margin: '0 0 16px 0' }}>Can we give a general name to anything that possesses these two properties?</p>
            <p style={{ margin: '0 0 16px 0' }}>Anything that <strong style={{ color: '#047857' }}>occupies space</strong> and has <strong style={{ color: '#047857' }}>mass</strong> is called <strong style={{ color: '#064e3b' }}>matter</strong>.</p>
          </div>

          <div style={{ background: '#ecfdf5', border: '2px dashed #6ee7b7', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 'var(--text-xl)' }}>💡</div>
            <div style={{ fontSize: 'var(--text-lg)', color: '#064e3b', lineHeight: '1.4' }}>
              <strong>Fact</strong><br/>
              The mass gives the quantity of matter, while the volume gives the amount of space occupied by it.
            </div>
          </div>

          {/* Page navigation */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>Page 1</div>
            <button 
              onClick={() => { setBookPage(2); setIsHandbookRead(true); }}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-base)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)' }}
              onMouseOver={(e) => e.target.style.background = '#059669'}
              onMouseOut={(e) => e.target.style.background = '#10b981'}
            >
              Next Page ➔
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* ================= RIGHT PAGE ================= */}
          <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#064e3b', fontWeight: 'bold' }}>
            Defining Matter
          </h2>

          <div style={{ fontSize: 'var(--text-xl)', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '32px' }}>
            <p style={{ margin: '0 0 16px 0' }}>Your final case is to classify matter!</p>
            <p style={{ margin: '0' }}>We need to analyze strange cases, like invisible air and modern plastics, to determine how they fit into the world of matter.</p>
          </div>

          <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4', display: 'flex', position: 'relative' }}>
            <div style={{ flex: 1, paddingRight: '80px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 MISSION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isHandbookRead} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Read the Handbook
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={stageCompleted} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Investigate Air
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={stageCompleted} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Analyze the properties of Plastic
                </label>
              </div>
            </div>
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" 
              alt="Detective" 
              style={{ position: 'absolute', bottom: '10px', right: '10px', width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)' }} 
            />
          </div>

          {/* Page navigation */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
            <button 
              onClick={() => setBookPage(1)}
              style={{ background: 'white', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
              onMouseOver={(e) => e.target.style.background = 'var(--surface)'}
              onMouseOut={(e) => e.target.style.background = 'white'}
            >
              <span style={{ fontSize: 'var(--text-lg)' }}>←</span> Previous
            </button>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)' }}>Page 2</div>
          </div>
        </div>
      )}
    </div>
  );
}
