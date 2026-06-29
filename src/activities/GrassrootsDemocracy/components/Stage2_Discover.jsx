import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, Lightbulb, MessageSquare, Map, Layers, Home } from 'lucide-react';
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
      desc: 'Works at the district level and looks after planning, development and coordination of schemes across blocks and villages.',
      icon: Map
    },
    { 
      id: 'block', 
      level: 'Block Level',
      name: 'Block Panchayat / Panchayat Samiti', 
      color: '#f97316', 
      desc: 'Works at the block level and coordinates between the district administration and Gram Panchayats.',
      icon: Layers
    },
    { 
      id: 'village', 
      level: 'Village Level',
      name: 'Gram Panchayat', 
      color: '#84cc16', 
      desc: 'Works at the village level. Elected by the Gram Sabha and responsible for local issues and development.',
      icon: Home
    }
  ];

  return (
    <div style={{ paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Navigation Row placeholder if needed, but the main app handles tabs */}

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
            <img src="/village_gram_sabha.png" alt="Gram Sabha Meeting" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
            
            {/* Pyramid Overlay */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', width: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              
              {/* Top Tier (District) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', transform: 'translateX(30px)' }}>
                <div style={{ 
                  width: '100px', height: '70px', background: 'rgba(14, 165, 233, 0.9)', 
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10px'
                }}>
                  <Map size={24} color="white" />
                </div>
                <div style={{ color: '#0ea5e9', fontWeight: 'bold', fontSize: '0.85rem', background: 'rgba(255,255,255,0.9)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>District<br/>Level</div>
              </div>

              {/* Middle Tier (Block) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', transform: 'translateX(30px)' }}>
                <div style={{ 
                  width: '160px', height: '70px', background: 'rgba(249, 115, 22, 0.9)', 
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Layers size={28} color="white" />
                </div>
                <div style={{ color: '#f97316', fontWeight: 'bold', fontSize: '0.85rem', background: 'rgba(255,255,255,0.9)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Block<br/>Level</div>
              </div>

              {/* Bottom Tier (Village) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', transform: 'translateX(30px)' }}>
                <div style={{ 
                  width: '220px', height: '70px', background: 'rgba(132, 204, 22, 0.9)', 
                  clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Home size={32} color="white" />
                </div>
                <div style={{ color: '#84cc16', fontWeight: 'bold', fontSize: '0.85rem', background: 'rgba(255,255,255,0.9)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Village<br/>Level</div>
              </div>

            </div>

            {/* Quote Banner */}
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', background: 'rgba(255, 255, 255, 0.95)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(10px)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <Lightbulb size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Together, these institutions cover almost all aspects of life in the district – agriculture, roads, water, education, health care, social welfare and more.
              </p>
            </div>
          </div>

          {/* Think About It Card */}
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Think About It
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#92400e', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Old maps kept by the Patwari are generations old! How do you think they can be helpful for us? Can they tell us something about the past and the present?
            </p>
            <button 
              onClick={() => { playClick(); setThoughtShared(true); addXp(5); }}
              disabled={thoughtShared}
              style={{ 
                background: thoughtShared ? 'transparent' : 'white', color: thoughtShared ? '#b45309' : '#d97706', border: thoughtShared ? 'none' : '1px solid #d97706', 
                padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', cursor: thoughtShared ? 'default' : 'pointer', fontWeight: 'bold'
              }}
            >
              {thoughtShared ? '✓ Thought Shared' : '✎ Share your thoughts'}
            </button>
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
