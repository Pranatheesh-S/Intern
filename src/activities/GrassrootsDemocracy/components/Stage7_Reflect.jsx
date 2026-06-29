import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Brain, Map as MapIcon, Users, Building, Shield, Home } from 'lucide-react';
import useSound from 'use-sound';

export default function Stage7_Reflect({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [done, setDone] = useState(false);
  const [activeConcept, setActiveConcept] = useState(null);

  const concepts = [
    { id: '1', title: 'Gram Sabha', icon: Users, color: '#f43f5e', text: 'All adult villagers who vote. The foundation of local democracy.' },
    { id: '2', title: 'Gram Panchayat', icon: Home, color: '#84cc16', text: 'Elected body (Sarpanch + Panchs) that solves daily village issues.' },
    { id: '3', title: 'Panchayat Samiti', icon: Building, color: '#f97316', text: 'Block level. Links many villages to the district.' },
    { id: '4', title: 'Zila Parishad', icon: MapIcon, color: '#0ea5e9', text: 'District level. Distributes funds and plans for the whole district.' },
    { id: '5', title: 'Key Officials', icon: Shield, color: '#8b5cf6', text: 'Secretary (meetings) and Patwari (land records) - government appointed.' }
  ];



  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem', alignItems: 'center' }}>
      
      <section style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Chapter Summary
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '2rem', textAlign: 'center' }}>
          Concept Map
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {concepts.map(c => {
            const isActive = activeConcept === c.id;
            return (
              <motion.button
                key={c.id}
                onClick={() => { playClick(); setActiveConcept(isActive ? null : c.id); }}
                style={{
                  padding: '1rem 1.5rem', borderRadius: '30px', border: 'none',
                  background: isActive ? c.color : 'var(--surface)',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                  boxShadow: isActive ? `0 4px 15px ${c.color}66` : 'none',
                  transition: 'all 0.3s'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <c.icon size={20} />
                <span style={{ fontWeight: 'bold' }}>{c.title}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeConcept && (
            <motion.div
              key={activeConcept}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '12px', marginTop: '2rem', textAlign: 'center', border: `2px solid ${concepts.find(c => c.id === activeConcept).color}` }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: concepts.find(c => c.id === activeConcept).color }}>
                {concepts.find(c => c.id === activeConcept).title}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                {concepts.find(c => c.id === activeConcept).text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '2rem 0' }}></div>

      <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <Trophy size={80} color="#eab308" />
        <div>
          <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)' }}>
            Chapter Completed!
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
            You have successfully explored the Panchayati Raj system, managed Lakshmanpur village, discovered the three-tier system, learned about inspiring Sarpanchs, and found the ancient roots of democracy.
          </p>
        </div>

        {!done ? (
          <button 
            onClick={() => { playSuccess(); addXp(50); setDone(true); }}
            className="primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '12px' }}
          >
            Claim Chapter Reward (+50 XP)
          </button>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#eab308', fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={28} /> XP Claimed! You are a Democracy Champion.
          </motion.div>
        )}
      </section>
    </div>
  );
}
