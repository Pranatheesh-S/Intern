import React, { useState, useEffect } from 'react';

export default function InvestigationHandbook({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false }) {
  const [bookPage, setBookPage] = useState(1);
  const [isHandbookRead, setIsHandbookRead] = useState(false);
  const [isHandbookRead2, setIsHandbookRead2] = useState(false);
  const [isHandbookRead3, setIsHandbookRead3] = useState(false);

  const isBarrier3 = currentFlowIndex >= 13;
  const isBarrier2 = currentFlowIndex >= 5 && currentFlowIndex < 13;

  useEffect(() => {
    setBookPage(1);
  }, [isBarrier2, isBarrier3]);

  const isPhase1Done = highestUnlockedIndex > 1 || (currentFlowIndex === 1 && stageCompleted);
  const isPhase2Done = highestUnlockedIndex > 2 || (currentFlowIndex === 2 && stageCompleted);

  const isB2Phase1Done = highestUnlockedIndex > 6 || (currentFlowIndex === 6 && stageCompleted);
  const isB2Phase2Done = highestUnlockedIndex > 7 || (currentFlowIndex === 7 && stageCompleted);
  const isB2Phase3Done = highestUnlockedIndex > 8 || (currentFlowIndex === 8 && stageCompleted);
  const isB2Phase4Done = highestUnlockedIndex > 9 || (currentFlowIndex === 9 && stageCompleted);
  const isB2Phase5Done = highestUnlockedIndex > 10 || (currentFlowIndex === 10 && stageCompleted);

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
      border: 'clamp(6px, 1.5vw, 18px) solid #1b2a4a',
      position: 'relative',
      fontFamily: 'Arial, Helvetica, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '30px', background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))', pointerEvents: 'none', zIndex: 10 }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'rgba(0,0,0,0.1)', zIndex: 10 }} />

      {!isBarrier2 && !isBarrier3 ? (
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1b2a4a', fontWeight: 'bold', borderBottom: '4px solid #3b4ea0', paddingBottom: '8px', display: 'inline-block' }}>
              What are Objects Made Of?
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0' }}>Look around you! You can see many things - a chair, a book, a water bottle, a pencil and so on. These are all <strong style={{ color: '#1b2a4a' }}>objects.</strong> Even though they look different, each object is made of some <strong style={{ color: '#1b2a4a' }}>material.</strong></p>
            </div>

            <div style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b', marginBottom: '8px' }}>
                <strong style={{ color: '#1b2a4a' }}>Material:</strong> The substance used to make an object.
              </div>
              <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b' }}>
                <strong style={{ color: '#1b2a4a' }}>Object:</strong> Anything we can see or use around us.
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#d97706', fontSize: 'var(--text-xl)' }}>Examples:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', color: '#451a03' }}>
                <div>Chair can be made of wood, plastic or steel.</div>
                <div>A plate can be made of steel, glass or plastic.</div>
                <div>A bottle can be made of plastic, glass or steel.</div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: 'var(--text-xl)', color: '#1e3a8a', lineHeight: '1.4' }}>
                <strong>Think!</strong> One object can be made from different materials. One material can be used to make many different objects.
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 1</div>
              <button
                onClick={() => setBookPage(2)}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-base)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : bookPage === 2 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1b2a4a', fontWeight: 'bold', borderBottom: '4px solid #3b4ea0', paddingBottom: '8px', display: 'inline-block' }}>
              Historical Spotlight: Pottery
            </h2>

            <div style={{ background: '#fdf6e3', border: '2px solid #eab308', borderRadius: '12px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '20px', background: '#eab308', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Do you know?</div>
              <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#451a03', lineHeight: '1.5' }}>
                The earliest pottery found in the Indian subcontinent dates back to <strong>7,000 to 8,000 years</strong> in the Ganga plains (Lahuradewa) and in Baluchistan (Mehrgarh).
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#451a03', lineHeight: '1.5' }}>
                About <strong>4000 BCE onwards</strong>, Sindhu-Sarasvati developed techniques of wheel-turned pottery production, pigmentation, application of protective or decorative coats (called 'slips') of multiple colours, decorative painting, etc.
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#451a03', lineHeight: '1.5' }}>
                These techniques became further sophisticated during the <strong>Sindhu-Sarasvati (also known as 'Harappan') Civilisation (2600-1900 BCE)</strong>, with a bright red surface painted with black-coloured designs displaying geometric patterns, and aquatic and terrestrial animals.
              </p>
            </div>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: 'var(--text-lg)' }}>How Pottery is Made</h4>
              <p style={{ margin: '0', fontSize: 'var(--text-lg)', color: '#475569', lineHeight: '1.5' }}>
                The clay used for making pots, dishes, bowls and other items was carefully selected and cleaned, sieved, kneaded, turned over a wheel and finally baked in kilns (baked clay is called <strong>'terracotta'</strong>).
              </p>
            </div>

            <div style={{ fontSize: 'var(--text-lg)', color: '#334155', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 8px 0' }}>Pots were used for various purposes, from cooking to storage of food grains, oil, ghee, and so on.</p>
              <p style={{ margin: '0' }}>Some very large storage jars and other pottery items are exhibited at the <strong>National Museum, New Delhi</strong>.</p>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <button
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: 'var(--text-lg)' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 2</div>
              <button
                onClick={() => { setBookPage(3); setIsHandbookRead(true); }}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-base)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1b2a4a', fontWeight: 'bold' }}>
              Materials Investigation
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0' }}>Everything around us is an object.</p>
              <p style={{ margin: '0 0 12px 0' }}>But can you identify the material used to make it?</p>
              <p style={{ margin: '0' }}>Let's find out!</p>
            </div>

            <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#6d28d9', fontSize: 'var(--text-xl)' }}>Some Objects and Their Materials</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1e293b' }}>Notebook</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Paper</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1e293b' }}>Spoon</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Steel</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1e293b' }}>Water Bottle</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Plastic</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: '#1e293b' }}>Window</div>
                  <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Glass</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0' }}>Some objects are made of only one material.</p>
              <p style={{ margin: '0 0 12px 0' }}>Some objects are made of more than one material.</p>
              <p style={{ margin: '0' }}>Look carefully and think before you answer!</p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: 'var(--text-lg)' }}>
                Example
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#451a03' }}>
                A <strong>Plate</strong> can be made of steel, glass, or plastic!
              </p>
            </div>

            <div style={{ border: '2px solid #ef4444', borderRadius: '12px', padding: '16px', background: '#fef2f2' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#b91c1c', fontSize: 'var(--text-lg)' }}>
                MISSION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-xl)', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isHandbookRead} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Read the Handbook
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-xl)', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isPhase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Find objects in the classroom
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-xl)', color: '#7f1d1d' }}>
                  <input type="checkbox" checked={isPhase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#ef4444' }} />
                  Scan the object
                </label>
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <button
                onClick={() => setBookPage(2)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: 'var(--text-lg)' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 3</div>
            </div>
          </div>
        )
      ) : isBarrier2 ? (
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
              How Can We Group Objects?
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '32px' }}>
              <p style={{ margin: '0 0 18px 0' }}>We see many objects around us every day, such as books, bottles, spoons and toys.</p>
              <p style={{ margin: '0 0 18px 0' }}>These objects may differ in their shape, size, colour and material.</p>
              <p style={{ margin: '0 0 18px 0' }}>To make it easier to study and compare them, we group objects that share a <strong style={{ color: '#1e3a8a' }}>common property</strong>.</p>
              <p style={{ margin: '0 0 18px 0' }}>This process is called <strong style={{ color: '#1e3a8a' }}>classification</strong>.</p>
              <p style={{ margin: '0 0 18px 0' }}>Objects can be grouped based on their material, colour, shape, hardness, softness or shine.</p>
              <p style={{ margin: '0' }}>The same object can also be grouped in different ways depending on the property we choose.</p>
            </div>

            <div style={{ background: '#eff6ff', border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: 'var(--text-lg)', color: '#1e3a8a', lineHeight: '1.4' }}>
                <strong>Remember</strong><br />
                Classification means arranging objects into groups based on a <strong style={{ color: '#1e3a8a' }}>common property</strong>.
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 1</div>
              <button
                onClick={() => { setBookPage(2); setIsHandbookRead2(true); }}
                style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-base)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(30, 58, 138, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#1e40af'}
                onMouseOut={(e) => e.target.style.background = '#1e3a8a'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold' }}>
              Case File 02: Scientific Classification
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '32px' }}>
              <p style={{ margin: '0 0 16px 0' }}>Your next case is ready!</p>
              <p style={{ margin: '0 0 16px 0' }}>Observe each object carefully and identify the material it is made of.</p>
              <p style={{ margin: '0' }}>Once you identify the material, place the object into the correct material group.</p>
            </div>

            <div style={{ border: '2px solid #ddd6fe', background: '#f5f3ff', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#6d28d9', fontSize: 'var(--text-xl)' }}>Examples</h4>
              <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '6px 20px', borderRadius: '24px', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Chair — Wood</div>
                <div style={{ width: '2px', height: 'clamp(42px, 6vw, 90px)', background: '#ddd6fe' }}></div>
                <div style={{ background: '#ede9fe', color: '#6d28d9', padding: '6px 20px', borderRadius: '24px', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Water Bottle — Plastic</div>
              </div>
            </div>

            <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: 'var(--text-lg)' }}>
                MISSION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isHandbookRead2} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Read the Handbook
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB2Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Organize objects by purpose
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB2Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Group objects by material
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB2Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  <span><strong>Multi-Property Insights</strong> - Inspect how the same objects fit into different groups depending on the property we look at.</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b', lineHeight: '1.4' }}>
                  <input type="checkbox" checked={isB2Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  <span><strong>Activity 6.3: Let Us Think (Material Suitability)</strong><br /><span style={{ fontSize: 'var(--text-base)', color: '#047857' }}>Why is a window made of glass and not wood? Why is a cooking pot made of metal and not paper? We choose materials based on their properties and the purpose of the object.</span></span>
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b', lineHeight: '1.4' }}>
                  <input type="checkbox" checked={isB2Phase5Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  <span><strong>Investigation: Sports Equipment Properties</strong><br /><span style={{ fontSize: 'var(--text-base)', color: '#047857' }}>Why aren't all balls made of the same material? Click each ball to analyze its properties and discover how its material matches its purpose.</span></span>
                </label>
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <button
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: 'var(--text-lg)' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 2</div>
            </div>
          </div>
        )
      ) : (
        bookPage === 1 ? (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
              Choosing the Right Material
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 16px 0' }}>Different objects are made for different purposes.</p>
              <p style={{ margin: '0 0 16px 0' }}>The material used to make an object depends on its <strong style={{ color: '#1e3a8a' }}>properties</strong> and how the object will be used.</p>
              <p style={{ margin: '0 0 16px 0' }}>For example, a pen is made of different materials such as plastic, metal and ink. Each material is chosen because it performs a specific job.</p>
              <p style={{ margin: '0' }}>Choosing the right material helps us make objects that are <strong style={{ color: '#1e3a8a' }}>safe</strong>, <strong style={{ color: '#1e3a8a' }}>useful</strong> and <strong style={{ color: '#1e3a8a' }}>long-lasting</strong>.</p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: 'var(--text-xl)', color: '#b45309', lineHeight: '1.4' }}>
                <strong>Remember</strong><br />
                The properties of a material help us decide where and how it should be used.
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 1</div>
              <button
                onClick={() => { setBookPage(2); setIsHandbookRead3(true); }}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-base)', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)' }}
                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
              >
                Next Page ➔
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, padding: '24px 32px 64px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#1e3a8a', fontWeight: 'bold' }}>
              Case File 03: Choosing the Right Material
            </h2>

            <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 16px 0' }}>Your next challenge is to decide which material is the <strong style={{ color: '#16a34a' }}>best choice</strong> for making an object.</p>
              <p style={{ margin: '0' }}>Sometimes an object can be made from different materials, but only some materials are <strong style={{ color: '#3b82f6' }}>suitable</strong> for its purpose.</p>
            </div>

            <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', background: '#f5f3ff' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#6d28d9', fontSize: 'var(--text-xl)' }}>
                Think Like a Scientist
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-xl)', color: '#334155' }}>Before making a choice, ask yourself:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', color: '#334155' }}>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>•</span> Is this material strong enough?</div>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>•</span> Is it safe to use?</div>
                <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#6d28d9', fontWeight: 'bold' }}>•</span> Will it work well for this purpose?</div>
              </div>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: 'var(--text-xl)' }}>
                Example
              </h4>
              <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#451a03' }}>
                A shopping bag can be made from cloth or paper, but each material is suitable for different situations.
              </p>
            </div>

            <div style={{ border: '2px solid #10b981', borderRadius: '12px', padding: '16px', background: '#f0fdf4' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#047857', fontSize: 'var(--text-lg)' }}>
                MISSION
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isHandbookRead3} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Read the Handbook
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB3Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Observe carefully.
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB3Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Compare different materials.
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB3Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Think about their properties.
                </label>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                  <input type="checkbox" checked={isB3Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#10b981', marginTop: '4px' }} />
                  Find the most suitable material for each object.
                </label>
              </div>
            </div>

            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 32px' }}>
              <button
                onClick={() => setBookPage(1)}
                style={{ background: 'white', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#64748b', fontSize: 'var(--text-base)', fontWeight: 'bold' }}
                onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                <span style={{ fontSize: 'var(--text-lg)' }}>←</span> Previous
              </button>
              <div style={{ color: '#94a3b8', fontSize: 'var(--text-base)' }}>Page 2</div>
            </div>
          </div>
        )
      )}
    </div>
  );
}