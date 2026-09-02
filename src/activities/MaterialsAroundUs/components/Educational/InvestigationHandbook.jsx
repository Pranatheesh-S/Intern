import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function InvestigationHandbook({ highestUnlockedIndex = 0, currentFlowIndex = 0, stageCompleted = false, onNext, onComplete }) {
  const handleProceed = onNext || onComplete;

  // Determine which barrier we are in
  // currentFlowIndex 13 is Mission 3. index >= 13 is Barrier 3.
  const isBarrier3 = currentFlowIndex >= 13;
  const isBarrier2 = currentFlowIndex >= 5 && currentFlowIndex < 13;

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
      width: '100%',
      height: '100%',
      minHeight: 0,
      boxSizing: 'border-box',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.14)',
      display: 'flex',
      flexDirection: 'column',
      border: '8px solid #D9C9A3',
      position: 'relative',
      fontFamily: 'Arial, Helvetica, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Central Book Spine Divider */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: '56px',
        left: '50%',
        width: '1px',
        background: '#FFFFFF',
        zIndex: 5,
        pointerEvents: 'none'
      }} />

      {/* TWO PAGES SPREAD CONTAINER */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden'
      }}>
        {!isBarrier2 && !isBarrier3 ? (
          // ================= BARRIER 1 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#3B2A1F', fontWeight: 'bold', borderBottom: '4px solid #3B2A1F', paddingBottom: '8px', display: 'inline-block' }}>
                What are Objects Made Of?
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', background: '#FFFFFF', padding: '16px', borderRadius: '12px', marginBottom: '16px', gap: '16px' }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: 'clamp(63px, 9vw, 135px)', height: 'clamp(63px, 9vw, 135px)' }} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 'var(--text-2xl)' }}>📕</div>
                  <div style={{ marginBottom: '2px', display: 'flex', alignItems: 'center', height: '32px' }}>
                    <svg width="32" height="32" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }}>
                      <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                      <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                      <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                      <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#3B2A1F" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 'var(--text-2xl)' }}>✏️</div>
                  <div style={{ fontSize: 'var(--text-2xl)' }}>🪑</div>
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 12px 0' }}>Look around you! You can see many things - a chair, a book, a water bottle, a pencil and so on.</p>
                <p style={{ margin: '0 0 16px 0' }}>These are all <strong style={{ color: '#3B2A1F' }}>objects.</strong></p>
                <p style={{ margin: '0' }}>Even though they look different, each object is made of some <strong style={{ color: '#3B2A1F' }}>material.</strong></p>
              </div>

              <div style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ background: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'var(--text-lg)', flexShrink: 0 }}>🧱</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b' }}><strong style={{ color: '#3B2A1F' }}>Material:</strong> The substance used to make an object.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'var(--text-lg)', flexShrink: 0 }}>📦</div>
                  <div style={{ fontSize: 'var(--text-xl)', color: '#1e293b' }}><strong style={{ color: '#3B2A1F' }}>Object:</strong> Anything we can see or use around us.</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '3px solid #D9C9A3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#3B2A1F', fontSize: 'var(--text-xl)', fontWeight: '900' }}>Examples:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', fontWeight: '700', color: '#3b2818' }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span>🪑</span> Chair can be made of wood, plastic or steel.</div>
                  <div style={{ display: 'flex', gap: '8px' }}><span>🍽️</span> A plate can be made of steel, glass or plastic.</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span>
                      <svg width="16" height="16" viewBox="0 0 50 50" style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }}>
                        <rect x="15" y="15" width="20" height="32" rx="3" fill="#38bdf8" />
                        <rect x="17" y="17" width="3" height="28" fill="rgba(255,255,255,0.6)" rx="1" />
                        <rect x="18.5" y="8" width="13" height="7" fill="#0ea5e9" />
                        <rect x="20.5" y="2" width="9" height="6" rx="1" fill="#3B2A1F" />
                      </svg>
                    </span> 
                    A bottle can be made of plastic, glass or steel.
                  </div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', border: '2px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'var(--text-xl)' }}>💡</div>
                <div style={{ fontSize: 'var(--text-xl)', color: '#3b2818', lineHeight: '1.4', fontWeight: '700' }}>
                  <strong style={{ color: '#3B2A1F', fontWeight: '900' }}>Think!</strong> One object can be made from different materials. One material can be used to make many different objects.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#3B2A1F', fontWeight: 'bold', borderBottom: '4px solid #3B2A1F', paddingBottom: '8px', display: 'inline-block' }}>
                Historical Spotlight: Pottery
              </h2>

              <div style={{ background: '#FFFFFF', border: '3px solid #D9C9A3', borderRadius: '12px', padding: '16px', marginBottom: '16px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '20px', background: '#FFFFFF', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Do you know?</div>
                <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#3b2818', lineHeight: '1.5' }}>
                  The earliest pottery found in the Indian subcontinent dates back to <strong>7,000 to 8,000 years</strong> in the Ganga plains (Lahuradewa) and in Baluchistan (Mehrgarh). 
                </p>
                <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#3b2818', lineHeight: '1.5' }}>
                  About <strong>4000 BCE onwards</strong>, Sindhu-Sarasvati developed techniques of wheel-turned pottery production, pigmentation, application of protective or decorative coats (called 'slips') of multiple colours, decorative painting, etc. 
                </p>
                <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-lg)', color: '#3b2818', lineHeight: '1.5' }}>
                  These techniques became further sophisticated during the <strong>Sindhu-Sarasvati (also known as 'Harappan') Civilisation (2600-1900 BCE)</strong>, with a bright red surface painted with black-coloured designs displaying geometric patterns, and aquatic and terrestrial animals.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#3B2A1F', fontSize: 'var(--text-lg)' }}>How Pottery is Made</h4>
                <p style={{ margin: '0', fontSize: 'var(--text-lg)', color: '#3b2818', lineHeight: '1.5' }}>
                  The clay used for making pots, dishes, bowls and other items was carefully selected and cleaned, sieved, kneaded, turned over a wheel and finally baked in kilns (baked clay is called <strong>'terracotta'</strong>).
                </p>
              </div>

              <div style={{ fontSize: 'var(--text-lg)', color: '#3b2818', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 8px 0' }}>Pots were used for various purposes, from cooking to storage of food grains, oil, ghee, and so on.</p>
                <p style={{ margin: '0' }}>Some very large storage jars and other pottery items are exhibited at the <strong>National Museum, New Delhi</strong>.</p>
              </div>
            </div>
          </>
        ) : isBarrier2 ? (
          // ================= BARRIER 2 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE B2 (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'hidden', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'calc(var(--text-2xl) * 1.25)', color: '#3B2A1F', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '6px', display: 'inline-block' }}>
                How Can We Group Objects?
              </h2>

              <div style={{ fontSize: '28px', color: '#334155', lineHeight: '1.6', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>We see many objects around us, such as books, bottles, spoons and toys.</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>Objects can be grouped based on a common property, such as material, colour, shape or hardness.</p>
                <p style={{ margin: '0 0 16px 0', fontSize: '28px', lineHeight: '1.6' }}>This process is called classification.</p>
                <p style={{ margin: '0', fontSize: '28px', lineHeight: '1.6' }}>The same object can belong to different groups depending on the property we choose.</p>
              </div>

              <div style={{ marginTop: '6px', background: '#FFFFFF', border: '2px dashed #bfdbfe', borderRadius: '12px', padding: '12px 18px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'calc(var(--text-xl) * 1.3)' }}>💡</div>
                <div style={{ fontSize: 'calc(var(--text-lg) * 1.3)', color: '#3B2A1F', lineHeight: '1.35' }}>
                  <strong>Remember</strong><br/>
                  Classification means grouping objects based on a common property.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE B2 (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '20px 28px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: 'calc(var(--text-2xl) * 1.15)', color: '#3B2A1F', fontWeight: 'bold' }}>
                Case File 02: Scientific Classification
              </h2>

              <div style={{ fontSize: '26px', color: '#334155', lineHeight: '1.55', marginBottom: '22px' }}>
                <p style={{ margin: '0 0 14px 0', fontSize: '26px', lineHeight: '1.55' }}>Your next case is ready!</p>
                <p style={{ margin: '0 0 14px 0', fontSize: '26px', lineHeight: '1.55' }}>Observe each object and identify the material it is made of.</p>
                <p style={{ margin: '0', fontSize: '26px', lineHeight: '1.55' }}>Then place each object into the correct material group.</p>
              </div>

              <div style={{ border: '2px solid #D9C9A3', borderRadius: '12px', padding: '12px 18px', background: '#FFFFFF', display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#3B2A1F', fontSize: 'calc(var(--text-lg) * 1.22)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    🎯 MISSION
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={true} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>Read the Handbook</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={isB2Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>Organize objects by purpose</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', fontWeight: '600' }}>
                      <input type="checkbox" checked={isB2Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>Group objects by material</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Multi-Property Insights</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#3B2A1F', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          Inspect how the same objects fit into different groups depending on the property we look at.
                        </span>
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Activity 6.3: Material Suitability</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#3B2A1F', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          We choose materials based on their properties and the purpose of the object.
                        </span>
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'calc(var(--text-lg) * 1.15)', color: '#064e3b', lineHeight: '1.4' }}>
                      <input type="checkbox" checked={isB2Phase5Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '3px' }} />
                      <span>
                        <strong style={{ display: 'block', fontWeight: '600', color: '#064e3b' }}>Investigation: Sports Equipment Properties</strong>
                        <span style={{ fontSize: 'calc(var(--text-base) * 1.18)', color: '#3B2A1F', display: 'block', marginTop: '2px', lineHeight: '1.35' }}>
                          Click each ball to analyze its properties and discover how its material matches its purpose.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // ================= BARRIER 3 TWO-PAGE SPREAD =================
          <>
            {/* ================= LEFT PAGE B3 (PAGE 1) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#3B2A1F', fontWeight: 'bold', borderBottom: '4px solid #3b82f6', paddingBottom: '8px', display: 'inline-block' }}>
                Choosing the Right Material
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#FFFFFF', padding: '24px', borderRadius: '12px', marginBottom: '24px', position: 'relative' }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ width: 'clamp(84px, 12vw, 180px)', height: 'clamp(84px, 12vw, 180px)', zIndex: 2 }} />
                <div style={{ position: 'absolute', display: 'flex', gap: '40px', bottom: '20px' }}>
                   <div style={{ fontSize: 'var(--text-2xl)', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>🖋️</div>
                   <div style={{ fontSize: 'var(--text-2xl)', marginLeft: '90px', filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.2))' }}>✒️</div>
                </div>
              </div>

              <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 16px 0' }}>Different objects are made for different purposes.</p>
                <p style={{ margin: '0 0 16px 0' }}>The material used to make an object depends on its <strong style={{ color: '#3B2A1F' }}>properties</strong> and how the object will be used.</p>
                <p style={{ margin: '0 0 16px 0' }}>For example, a pen is made of different materials such as plastic, metal and ink. Each material is chosen because it performs a specific job.</p>
                <p style={{ margin: '0' }}>Choosing the right material helps us make objects that are <strong style={{ color: '#3B2A1F' }}>safe</strong>, <strong style={{ color: '#3B2A1F' }}>useful</strong> and <strong style={{ color: '#3B2A1F' }}>long-lasting</strong>.</p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 'var(--text-xl)' }}>💡</div>
                <div style={{ fontSize: 'var(--text-xl)', color: '#b45309', lineHeight: '1.4' }}>
                  <strong>Remember</strong><br/>
                  The properties of a material help us decide where and how it should be used.
                </div>
              </div>
            </div>

            {/* ================= RIGHT PAGE B3 (PAGE 2) ================= */}
            <div style={{ flex: 1, minHeight: 0, padding: '24px 32px', position: 'relative', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 'var(--text-2xl)', color: '#3B2A1F', fontWeight: 'bold' }}>
                Case File 03: Choosing the Right Material
              </h2>

              <div style={{ fontSize: 'var(--text-xl)', color: '#334155', lineHeight: '1.6', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 16px 0' }}>As a Science Detective, your next challenge is to decide which material is the <strong style={{ color: '#16a34a' }}>best choice</strong> for making an object.</p>
                <p style={{ margin: '0' }}>Sometimes an object can be made from different materials, but only some materials are <strong style={{ color: '#3b82f6' }}>suitable</strong> for its purpose.</p>
              </div>

              <div style={{ border: '2px dashed #c4b5fd', borderRadius: '12px', padding: '16px', marginBottom: '16px', background: '#FFFFFF', position: 'relative' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#3B2A1F', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🧠 Think Like a Scientist
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: 'var(--text-xl)', color: '#334155' }}>Before making a choice, ask yourself:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xl)', color: '#334155' }}>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B2A1F', fontWeight: 'bold' }}>✔</span> Is this material strong enough?</div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B2A1F', fontWeight: 'bold' }}>✔</span> Is it safe to use?</div>
                  <div style={{ display: 'flex', gap: '8px' }}><span style={{ color: '#3B2A1F', fontWeight: 'bold' }}>✔</span> Will it work well for this purpose?</div>
                </div>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)' }} />
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #D9C9A3', borderRadius: '12px', padding: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#d97706', fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⭐ Example
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-xl)', color: '#451a03' }}>
                    A shopping bag can be made from cloth or paper, but each material is suitable for different situations.
                  </p>
                </div>
                <div style={{ fontSize: 'var(--text-3xl)', display: 'flex', gap: '8px' }}>🛍️ 🛍️</div>
              </div>

              <div style={{ border: '2px solid #D9C9A3', borderRadius: '12px', padding: '16px', background: '#FFFFFF', display: 'flex', position: 'relative' }}>
                <div style={{ flex: 1, paddingRight: '80px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#3B2A1F', fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 MISSION
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={true} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '4px' }} />
                      Read the Handbook
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase1Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '4px' }} />
                      Observe carefully.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase2Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '4px' }} />
                      Compare different materials.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase3Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '4px' }} />
                      Think about their properties.
                    </label>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: 'var(--text-lg)', color: '#064e3b' }}>
                      <input type="checkbox" checked={isB3Phase4Done} readOnly style={{ width: '18px', height: '18px', accentColor: '#3B2A1F', marginTop: '4px' }} />
                      Find the most suitable material for each object.
                    </label>
                  </div>
                </div>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Detective" style={{ position: 'absolute', bottom: '10px', right: '10px', width: 'clamp(56px, 8vw, 120px)', height: 'clamp(56px, 8vw, 120px)' }} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER BAR WITH BOTTOM-RIGHT NEXT BUTTON */}
      <div style={{
        height: '56px',
        background: '#FFFFFF',
        borderTop: '1px solid #e2e8f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 10
      }}>
        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📖</span> Investigation Handbook
        </div>
      </div>
    </div>
  );
}
