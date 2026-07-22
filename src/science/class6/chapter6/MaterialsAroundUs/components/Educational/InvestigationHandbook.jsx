import React, { useState, useEffect } from 'react';

export default function InvestigationHandbook({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false }) {
  const [bookPage, setBookPage] = useState(1);
  const [isHandbookRead, setIsHandbookRead] = useState(false);
  const [isHandbookRead2, setIsHandbookRead2] = useState(false);
  const [isHandbookRead3, setIsHandbookRead3] = useState(false);

  // Determine which barrier we are in
  // currentFlowIndex 13 is Mission 3. index >= 13 is Barrier 3.
  const isBarrier3 = currentFlowIndex >= 13;
  const isBarrier2 = currentFlowIndex >= 5 && currentFlowIndex < 13;

  // Reset page to 1 when changing barriers
  useEffect(() => {
    setBookPage(1);
  }, [isBarrier2, isBarrier3]);

  // Barrier 1 logic
  const isPhase1Done = highestUnlockedIndex > 1 || (currentFlowIndex === 1 && stageCompleted);
  const isPhase2Done = highestUnlockedIndex > 2 || (currentFlowIndex === 2 && stageCompleted);

  // Barrier 2 logic
  const isB2Phase1Done = highestUnlockedIndex > 6 || (currentFlowIndex === 6 && stageCompleted);
  const isB2Phase2Done = highestUnlockedIndex > 7 || (currentFlowIndex === 7 && stageCompleted);
  const isB2Phase3Done = highestUnlockedIndex > 8 || (currentFlowIndex === 8 && stageCompleted);
  const isB2Phase4Done = highestUnlockedIndex > 9 || (currentFlowIndex === 9 && stageCompleted);
  const isB2Phase5Done = highestUnlockedIndex > 10 || (currentFlowIndex === 10 && stageCompleted);

  // Barrier 3 logic
  const isB3Phase1Done = highestUnlockedIndex > 14 || (currentFlowIndex === 14 && stageCompleted);
  const isB3Phase2Done = highestUnlockedIndex > 15 || (currentFlowIndex === 15 && stageCompleted);
  const isB3Phase3Done = highestUnlockedIndex > 17 || (currentFlowIndex === 17 && stageCompleted);
  const isB3Phase4Done = highestUnlockedIndex > 19 || (currentFlowIndex === 19 && stageCompleted);

  return (
    <div style={{
        minHeight: 0, boxSizing: 'border-box', height: '100%',
        background: 'white', borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column', 
        border: '12px solid #1b2a4a',
        position: 'relative',
        fontFamily: 'Arial, Helvetica, sans-serif',
        overflow: 'hidden'
    }}>
      {/* Book Spine (Right Edge) */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '30px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 10 }} />

      {!isBarrier2 && !isBarrier3 ? (
        // ================= BARRIER 1 CONTENT =================
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= LEFT PAGE ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1b2a4a', fontWeight: 'bold', borderBottom: '4px solid #3b4ea0', paddingBottom: '8px', display: 'inline-block' }}>
              What are Objects Made Of?
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px', gap: '16px' }}>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: '90px', height: '90px' }} />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '32px' }}>📕</div>
                <div style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', height: '32px' }}>
                  <svg width="32" height="32" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }}>
                    <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                    <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                    <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                    <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#0284c7" />
                  </svg>
                </div>
                <div style={{ fontSize: '32px' }}>✏️</div>
                <div style={{ fontSize: '32px' }}>🪑</div>
              </div>
            </div>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0' }}>Look around you! You can see many things - a chair, a book, a water bottle, a pencil and so on.</p>
              <p style={{ margin: '0 0 16px 0' }}>These are all <strong style={{ color: '#1b2a4a' }}>objects.</strong></p>
              <p style={{ margin: '0' }}>Even though they look different, each object is made of some <strong style={{ color: '#1b2a4a' }}>material.</strong></p>
            </div>

            <div style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: '#e0e7ff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '19px', flexShrink: 0 }}>🧱</div>
                <div style={{ fontSize: '20px', color: '#1e293b' }}><strong style={{ color: '#1b2a4a' }}>Material:</strong> The substance used to make an object.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#dcfce7', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '19px', flexShrink: 0 }}>📦</div>
                <div style={{ fontSize: '20px', color: '#1e293b' }}><strong style={{ color: '#1b2a4a' }}>Object:</strong> Anything we can see or use around us.</div>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: '21px' }}>Examples:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '20px', color: '#451a03' }}>
                <div style={{ display: 'flex', gap: '8px' }}><span>🪑</span> Chair can be made of wood, plastic or steel.</div>
                <div style={{ display: 'flex', gap: '8px' }}><span>🍽️</span> A plate can be made of steel, glass or plastic.</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span>
                    <svg width="16" height="16" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }}>
                      <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                      <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                      <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                      <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#0284c7" />
                    </svg>
                  </span> 
                  A bottle can be made of plastic, glass or steel.
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '22px' }}>💡</div>
              <div style={{ fontSize: '20px', color: '#1e3a8a', lineHeight: '1.4' }}>
                <strong>Think!</strong> One object can be made from different materials. One material can be used to make many different objects.
              </div>
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 1</div>
              <button 
                onClick={() => { setBookPage(2); setIsHandbookRead(true); }}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= RIGHT PAGE ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1b2a4a', fontWeight: 'bold' }}>
              Materials Investigation
            </h2>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0' }}>Everything around us is an object.</p>
              <p style={{ margin: '0 0 12px 0' }}>But can you identify the material used to make it?</p>
              <p style={{ margin: '0' }}>Let's become a <strong style={{ color: '#16a34a' }}>Science Detective</strong> and find out!</p>
            </div>

            <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#6d28d9', fontSize: '21px' }}>Some Objects and Their Materials</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '2px' }}>📓</div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e293b' }}>Notebook</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>Paper</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '2px' }}>🥄</div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e293b' }}>Spoon</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>Steel</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', height: '36px' }}>
                    <svg width="36" height="36" viewBox="0 0 50 50" style={{ verticalAlign: 'middle' }}>
                      <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                      <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                      <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                      <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#0284c7" />
                    </svg>
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e293b' }}>Water Bottle</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>Plastic</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: '36px', marginBottom: '2px' }}>🪟</div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#1e293b' }}>Window</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: '16px', fontWeight: 'bold' }}>Glass</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0' }}>Some objects are made of only one material.</p>
              <p style={{ margin: '0 0 12px 0' }}>Some objects are made of more than one material.</p>
              <p style={{ margin: '0' }}>Look carefully and think before you answer!</p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: '19px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⭐ Example
                </h4>
                <p style={{ margin: 0, fontSize: '20px', color: '#451a03' }}>
                  A <strong>Plate</strong> can be made of steel, glass, or plastic!
                </p>
              </div>
              <div style={{ fontSize: '40px' }}>🍽️</div>
            </div>

            <div style={{ border: '2px solid #ef4444', borderRadius: '12px', padding: '16px', background: '#fef2f2' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#b91c1c', fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎯 MISSION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isHandbookRead} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Read the Handbook
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isPhase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Find objects in the classroom
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isPhase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Scan the object
                </label>
              </div>
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button 
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: '16px', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: '19px' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 2</div>
            </div>
          </div>
        )
      ) : isBarrier2 ? (
        // ================= BARRIER 2 CONTENT =================
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= LEFT PAGE B2 ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
              How Can We Group Objects?
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', borderBottom: '8px solid #b45309', paddingBottom: '4px', width: '85%', justifyContent: 'center' }}>
                <div style={{ fontSize: '48px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>📕</div>
                <div style={{ filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>
                  <svg width="48" height="48" viewBox="0 0 50 50" style={{ verticalAlign: 'middle' }}>
                    <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                    <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                    <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                    <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#0284c7" />
                  </svg>
                </div>
                <div style={{ fontSize: '48px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>⚽</div>
                <div style={{ fontSize: '48px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>🥄</div>
                <div style={{ fontSize: '48px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>📏</div>
              </div>
            </div>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '32px' }}>
              <p style={{ margin: '0 0 18px 0' }}>We see many objects around us every day, such as books, bottles, spoons and toys.</p>
              <p style={{ margin: '0 0 18px 0' }}>These objects may differ in their shape, size, colour and material.</p>
              <p style={{ margin: '0 0 18px 0' }}>To make it easier to study and compare them, we group objects that share a <strong style={{ color: '#1e3a8a' }}>common property</strong>.</p>
              <p style={{ margin: '0 0 18px 0' }}>This process is called <strong style={{ color: '#1e3a8a' }}>classification</strong>.</p>
              <p style={{ margin: '0 0 18px 0' }}>Objects can be grouped based on their material, colour, shape, hardness, softness or shine.</p>
              <p style={{ margin: '0' }}>The same object can also be grouped in different ways depending on the property we choose.</p>
            </div>

            <div style={{ background: '#eff6ff', border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '22px' }}>💡</div>
              <div style={{ fontSize: '19px', color: '#1e3a8a', lineHeight: '1.4' }}>
                <strong>Remember</strong><br/>
                Classification means arranging objects into groups based on a <strong style={{ color: '#1e3a8a' }}>common property</strong>.
              </div>
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 1</div>
              <button 
                onClick={() => { setBookPage(2); setIsHandbookRead2(true); }}
                style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(30, 58, 138, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#1e40af'}
                onMouseOut={(e) => e.target.style.background = '#1e3a8a'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= RIGHT PAGE B2 ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1e3a8a', fontWeight: 'bold' }}>
              Case File 02: Scientific Classification
            </h2>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '32px' }}>
              <p style={{ margin: '0 0 16px 0' }}>Your next case is ready!</p>
              <p style={{ margin: '0 0 16px 0' }}>Observe each object carefully and identify the material it is made of.</p>
              <p style={{ margin: '0' }}>Once you identify the material, place the object into the correct material group.</p>
            </div>

            <div style={{ border: '2px solid #ddd6fe', background: '#f5f3ff', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#6d28d9', fontSize: '21px' }}>Examples</h4>
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '56px' }}>🪑</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '6px 20px', borderRadius: '24px', fontSize: '18px', fontWeight: 'bold' }}>Chair ➔ Wood</div>
                </div>
                <div style={{ width: '2px', height: '60px', background: '#ddd6fe' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ height: '56px', display: 'flex', alignItems: 'center' }}>
                    <svg width="56" height="56" viewBox="0 0 50 50" style={{ verticalAlign: 'middle' }}>
                      <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                      <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                      <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                      <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#0284c7" />
                    </svg>
                  </div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '6px 20px', borderRadius: '24px', fontSize: '18px', fontWeight: 'bold' }}>Water Bottle ➔ Plastic</div>
                </div>
              </div>
            </div>

            <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4', display: 'flex', position: 'relative' }}>
              <div style={{ flex: 1, paddingRight: '80px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 MISSION
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isHandbookRead2} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Read the Handbook
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB2Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Organize objects by purpose
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB2Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Group objects by material
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB2Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    <span><strong>Multi-Property Insights</strong> - Inspect how the same objects fit into different groups depending on the property we look at.</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b', lineHeight: '1.4' }}>
                    <input type="checkbox" checked={isB2Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    <span><strong>Activity 6.3: Let Us Think (Material Suitability)</strong><br/><span style={{fontSize: '15px', color: '#047857'}}>Why is a window made of glass and not wood? Why is a cooking pot made of metal and not paper? We choose materials based on their properties and the purpose of the object.</span></span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b', lineHeight: '1.4' }}>
                    <input type="checkbox" checked={isB2Phase5Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    <span><strong>Investigation: Sports Equipment Properties</strong><br/><span style={{fontSize: '15px', color: '#047857'}}>Why aren't all balls made of the same material? Click each ball to analyze its properties and discover how its material matches its purpose.</span></span>
                  </label>
                </div>
              </div>
              <img 
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" 
                alt="Detective" 
                style={{ position: 'absolute', bottom: '10px', right: '10px', width: '80px', height: '80px' }} 
              />
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button 
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: '16px', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: '19px' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 2</div>
            </div>
          </div>
        )
      ) : (
        // ================= BARRIER 3 CONTENT =================
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= LEFT PAGE B3 ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
              Choosing the Right Material
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '24px', borderRadius: '12px', marginBottom: '24px', position: 'relative' }}>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: '120px', height: '120px', zIndex: 2 }} />
              <div style={{ position: 'absolute', display: 'flex', gap: '40px', bottom: '20px' }}>
                 <div style={{ fontSize: '30px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>🖋️</div>
                 <div style={{ fontSize: '30px', marginLeft: '90px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>✒️</div>
              </div>
            </div>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 16px 0' }}>Different objects are made for different purposes.</p>
              <p style={{ margin: '0 0 16px 0' }}>The material used to make an object depends on its <strong style={{ color: '#1e3a8a' }}>properties</strong> and how the object will be used.</p>
              <p style={{ margin: '0 0 16px 0' }}>For example, a pen is made of different materials such as plastic, metal and ink. Each material is chosen because it performs a specific job.</p>
              <p style={{ margin: '0' }}>Choosing the right material helps us make objects that are <strong style={{ color: '#1e3a8a' }}>safe</strong>, <strong style={{ color: '#1e3a8a' }}>useful</strong> and <strong style={{ color: '#1e3a8a' }}>long-lasting</strong>.</p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '22px' }}>💡</div>
              <div style={{ fontSize: '20px', color: '#b45309', lineHeight: '1.4' }}>
                <strong>Remember</strong><br/>
                The properties of a material help us decide where and how it should be used.
              </div>
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 1</div>
              <button 
                onClick={() => { setBookPage(2); setIsHandbookRead3(true); }}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* ================= RIGHT PAGE B3 ================= */}
            <h2 style={{ margin: '0 0 16px 0', fontSize: '32px', color: '#1e3a8a', fontWeight: 'bold' }}>
              Case File 03: Choosing the Right Material
            </h2>

            <div style={{ fontSize: '24px', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 16px 0' }}>As a Science Detective, your next challenge is to decide which material is the <strong style={{ color: '#16a34a' }}>best choice</strong> for making an object.</p>
              <p style={{ margin: '0' }}>Sometimes an object can be made from different materials, but only some materials are <strong style={{ color: '#3b82f6' }}>suitable</strong> for its purpose.</p>
            </div>

            <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', background: '#f5f3ff', position: 'relative' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#6d28d9', fontSize: '21px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🧠 Think Like a Scientist
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#334155' }}>Before making a choice, ask yourself:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '20px', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Is this material strong enough?</div>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Is it safe to use?</div>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>✔</span> Will it work well for this purpose?</div>
              </div>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '80px', height: '80px' }} />
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: '21px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⭐ Example
                </h4>
                <p style={{ margin: 0, fontSize: '20px', color: '#451a03' }}>
                  A shopping bag can be made from cloth or paper, but each material is suitable for different situations.
                </p>
              </div>
              <div style={{ fontSize: '40px', display: 'flex', gap: '8px' }}>🛍️ 🛍️</div>
            </div>

            <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4', display: 'flex', position: 'relative' }}>
              <div style={{ flex: 1, paddingRight: '80px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: '19px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🎯 MISSION
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isHandbookRead3} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Read the Handbook
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB3Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Observe carefully.
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB3Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Compare different materials.
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB3Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Think about their properties.
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '18px', color: '#064e3b' }}>
                    <input type="checkbox" checked={isB3Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                    Find the most suitable material for each object.
                  </label>
                </div>
              </div>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: '80px', height: '80px' }} />
            </div>

            {/* Page navigation */}
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <button 
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: '16px', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: '19px' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: '16px' }}>Page 2</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
