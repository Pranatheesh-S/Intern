import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, Lightbulb, MessageSquare, Map, Layers, Home, BookOpen, Calendar, Award, FileText, Shield, CheckCircle } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage2_Discover({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [activeTier, setActiveTier] = useState('village');
  const [thoughtShared, setThoughtShared] = useState(false);

  const tiers = [
    { 
      id: 'district', 
      level: 'District Level',
      name: 'District Panchayat / Zila Parishad', 
      color: '#0ea5e9', 
      desc: 'Works at the highest tier, the district level. It reviews plans from all Panchayat Samitis and presents them to the State government. It ensures funds are properly distributed and makes special rules so disadvantaged sections and women get fair representation (one-third of seats are reserved for women!).',
      icon: Map
    },
    { 
      id: 'block', 
      level: 'Block Level',
      name: 'Block Panchayat / Panchayat Samiti', 
      color: '#f97316', 
      desc: 'Works at the block level, acting as a crucial link between villages and the district. It collects development plans from all Gram Panchayats and helps allot funds for government schemes like the Pradhan Mantri Gram Sadak Yojana (for building all-weather roads).',
      icon: Layers
    },
    { 
      id: 'village', 
      level: 'Village Level',
      name: 'Gram Panchayat', 
      color: '#84cc16', 
      desc: 'Works at the village level. Its members are elected directly by the Gram Sabha (all adult voters in the area). Headed by a Sarpanch, it solves daily village issues like water supply and roads. It is also assisted by a Panchayat Secretary and a Patwari (who maintains land records).',
      icon: Home
    }
  ];

  return (
    <div style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <style>{`
        @keyframes kenBurnsEffect {
          0% { transform: scale(1.0); }
          50% { transform: scale(1.04) translate(-0.8%, -0.4%); }
          100% { transform: scale(1.0); }
        }
      `}</style>
      
      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            DISCOVER - THREE-TIER SYSTEM
          </div>
          
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', lineHeight: '1.2' }}>
            The Panchayati Raj System
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
            Like every village in India, Lakshmanpur has a local government called a 'Panchayat'. It brings governance closer to the people so they can participate in decision-making. The system works at <strong>three levels</strong>.
          </p>

          {/* Accordion List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {tiers.map((tier) => {
              const isActive = activeTier === tier.id;
              return (
                <div 
                  key={tier.id}
                  onClick={() => { playClick(); setActiveTier(isActive ? null : tier.id); addXp(2); }}
                  style={{
                    background: isActive ? `${tier.color}11` : 'var(--surface)',
                    border: '1px solid',
                    borderColor: isActive ? `${tier.color}33` : 'var(--border)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '1rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ 
                    width: '50px', height: '50px', borderRadius: '12px', 
                    background: `${tier.color}22`, color: tier.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <tier.icon size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: tier.color, fontSize: '1.1rem' }}>{tier.name}</strong>
                      <ChevronDown size={20} style={{ color: tier.color, transform: isActive ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                    </div>
                    <AnimatePresence>
                      {isActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
                            {tier.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <strong style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>What is Panchayati Raj?</strong>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare size={20} />
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Panchayati Raj means self-government. It ensures people's participation, addresses local issues and helps benefits of government schemes reach everyone.
                </p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <strong style={{ color: 'var(--text-heading)', fontSize: '1.1rem' }}>Why is it important?</strong>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Home size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Check size={14} color="#10b981" /> Brings governance closer</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Check size={14} color="#10b981" /> Encourages participation</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Check size={14} color="#10b981" /> Promotes local development</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Visual) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-heading)' }}>Three-tier system</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>From bottom up – village, block and district.</p>

          <div style={{ 
            flex: 1, minHeight: '400px', borderRadius: '16px', position: 'relative', overflow: 'hidden',
            border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            {/* Animated Background Image */}
            <img 
              src="/village_gram_sabha.png" 
              alt="Gram Sabha Meeting" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                position: 'absolute',
                animation: 'kenBurnsEffect 30s ease-in-out infinite',
                pointerEvents: 'none'
              }} 
            />

            {/* Dark Vignette Overlay for readability */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.2)',
              pointerEvents: 'none'
            }} />
            
            {/* Centered Pyramid Layout with Absolute Labels */}
            <div style={{ 
              position: 'absolute', 
              top: '2.5rem', 
              left: '1.5rem', 
              width: '360px', 
              height: '220px' 
            }}>
              
              {/* Centered shapes column */}
              <div style={{
                position: 'absolute',
                left: '20px',
                width: '220px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                {/* Top Tier (District) */}
                <div 
                  onClick={() => { playClick(); setActiveTier('district'); addXp(1); }}
                  style={{ 
                    width: '100px', height: '65px', 
                    background: activeTier === 'district' ? 'rgba(14, 165, 233, 1)' : 'rgba(14, 165, 233, 0.85)', 
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', 
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    transform: activeTier === 'district' ? 'scale(1.04)' : 'none',
                    boxShadow: activeTier === 'district' ? '0 8px 24px rgba(14, 165, 233, 0.4)' : 'none'
                  }}
                >
                  <Map size={22} color="white" />
                </div>

                {/* Middle Tier (Block) */}
                <div 
                  onClick={() => { playClick(); setActiveTier('block'); addXp(1); }}
                  style={{ 
                    width: '160px', height: '65px', 
                    background: activeTier === 'block' ? 'rgba(249, 115, 22, 1)' : 'rgba(249, 115, 22, 0.85)', 
                    clipPath: 'polygon(18.75% 0%, 81.25% 0%, 100% 100%, 0% 100%)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    transform: activeTier === 'block' ? 'scale(1.04)' : 'none',
                    boxShadow: activeTier === 'block' ? '0 8px 24px rgba(249, 115, 22, 0.4)' : 'none'
                  }}
                >
                  <Layers size={24} color="white" />
                </div>

                {/* Bottom Tier (Village) */}
                <div 
                  onClick={() => { playClick(); setActiveTier('village'); addXp(1); }}
                  style={{ 
                    width: '220px', height: '65px', 
                    background: activeTier === 'village' ? 'rgba(132, 204, 22, 1)' : 'rgba(132, 204, 22, 0.85)', 
                    clipPath: 'polygon(13.6% 0%, 86.4% 0%, 100% 100%, 0% 100%)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    transform: activeTier === 'village' ? 'scale(1.04)' : 'none',
                    boxShadow: activeTier === 'village' ? '0 8px 24px rgba(132, 204, 22, 0.4)' : 'none'
                  }}
                >
                  <Home size={28} color="white" />
                </div>
              </div>

              {/* Staggered Absolute Labels on the Right */}
              {/* District Label */}
              <div 
                onClick={() => { playClick(); setActiveTier('district'); }}
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '190px',
                  color: '#0ea5e9',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  boxShadow: activeTier === 'district' ? '0 6px 15px rgba(14, 165, 233, 0.2)' : '0 3px 8px rgba(0,0,0,0.1)',
                  border: `1.5px solid ${activeTier === 'district' ? '#0ea5e9' : 'rgba(14, 165, 233, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                District Level
              </div>

              {/* Block Label */}
              <div 
                onClick={() => { playClick(); setActiveTier('block'); }}
                style={{
                  position: 'absolute',
                  top: '84px',
                  left: '220px',
                  color: '#f97316',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  boxShadow: activeTier === 'block' ? '0 6px 15px rgba(249, 115, 22, 0.2)' : '0 3px 8px rgba(0,0,0,0.1)',
                  border: `1.5px solid ${activeTier === 'block' ? '#f97316' : 'rgba(249, 115, 22, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                Block Level
              </div>

              {/* Village Label */}
              <div 
                onClick={() => { playClick(); setActiveTier('village'); }}
                style={{
                  position: 'absolute',
                  top: '153px',
                  left: '250px',
                  color: '#84cc16',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  boxShadow: activeTier === 'village' ? '0 6px 15px rgba(132, 204, 22, 0.2)' : '0 3px 8px rgba(0,0,0,0.1)',
                  border: `1.5px solid ${activeTier === 'village' ? '#84cc16' : 'rgba(132, 204, 22, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                Village Level
              </div>

            </div>

            {/* Quote Banner (Forced slate dark color to fix dark mode contrast) */}
            <div style={{ 
              position: 'absolute', 
              bottom: '1.5rem', 
              left: '1.5rem', 
              right: '1.5rem', 
              background: 'rgba(255, 255, 255, 0.95)', 
              padding: '1rem', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              backdropFilter: 'blur(12px)', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.8)'
            }}>
              <Lightbulb size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: '#1e293b', fontSize: '0.92rem', lineHeight: '1.5', fontWeight: '500' }}>
                Together, these institutions cover almost all aspects of life in the district – agriculture, roads, water, education, health care, social welfare and more.
              </p>
            </div>
          </div>

          {/* Constitutional Facts Card */}
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', border: '1px solid #4338ca', borderRadius: '16px', padding: '1.5rem', marginTop: '1rem', color: 'white', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                  <BookOpen size={24} color="#60a5fa" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#e0e7ff', letterSpacing: '0.5px' }}>
                  Constitutional Facts
                </h3>
              </div>
              <button 
                onClick={() => { playClick(); setThoughtShared(true); addXp(5); }}
                disabled={thoughtShared}
                style={{ 
                  background: thoughtShared ? 'rgba(255,255,255,0.1)' : '#4f46e5', color: thoughtShared ? '#a5b4fc' : '#ffffff', border: 'none', 
                  padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: thoughtShared ? 'default' : 'pointer', fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'
                }}
              >
                {thoughtShared ? <><CheckCircle size={16} /> Reviewed</> : 'Mark as Read'}
              </button>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', borderLeft: '4px solid #60a5fa' }}>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#93c5fd', marginBottom: '0.5rem' }}>
                73rd Amendment Act
              </strong>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#c7d2fe', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(96, 165, 250, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}><Calendar size={14} color="#60a5fa" /> Passed: 1992</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(96, 165, 250, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}><Award size={14} color="#60a5fa" /> Enforced: 24 Apr 1993</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 'bold', letterSpacing: '0.5px' }}>Added to Constitution</span>
                <span style={{ fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={14} color="#a78bfa" /> Part IX</span>
                <span style={{ fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={14} color="#a78bfa" /> Eleventh Schedule</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#818cf8', fontWeight: 'bold', letterSpacing: '0.5px' }}>Special Day</span>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <Calendar size={16} color="#f472b6" style={{ marginTop: '2px', flexShrink: 0 }} /> 
                  <span style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: '1.3' }}>
                    National Panchayati Raj Day<br/> <strong style={{ color: '#fbcfe8', fontSize: '1rem' }}>24 April</strong>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '10px', fontSize: '0.9rem', lineHeight: '1.5', color: '#e0e7ff' }}>
              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                <Shield size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong style={{ color: '#6ee7b7' }}>Purpose:</strong> Gave constitutional status to Panchayati Raj Institutions.</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Shield size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong style={{ color: '#6ee7b7' }}>Objective:</strong> Strengthen local self-government in rural India.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button 
          onClick={onComplete}
          className="primary" 
          style={{ padding: '0.8rem 1.5rem', gap: '0.5rem', borderRadius: '8px' }}
        >
          Next: Enter the Gram Sabha <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
