import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { 
  ArrowRight, Star, Heart, Shield, Baby, Hand, CheckCircle2, BookOpen, 
  Users, Droplet, Trophy, Sparkles, Building, Video, MapPin, X, History, 
  AlertTriangle, TrendingUp, Info, User, Tractor 
} from 'lucide-react';
import useSound from 'use-sound';

import dnyaneshwarImg from '../../../assets/portraits/dnyaneshwar.png';
import vandanaImg from '../../../assets/portraits/vandana.jpg';
import popatraoImg from '../../../assets/portraits/popatrao.jpg';

// --- DATA STRUCTURES ---

const heroesData = [
  {
    id: 'dnyaneshwar',
    name: 'Dnyaneshwar Kamble',
    designation: 'Sarpanch',
    state: 'Maharashtra',
    portrait: dnyaneshwarImg,
    badge: 'First Transgender Sarpanch',
    intro: 'Overcame immense social stigma to focus entirely on inclusive village development.',
    timeline: [
      { step: 'Early Life', desc: 'Faced discrimination and marginalization' },
      { step: 'Challenge Faced', desc: 'Social stigma in rural Maharashtra' },
      { step: 'Became Sarpanch', desc: 'Elected in 2017 by the Gram Sabha' },
      { step: 'Major Achievement', desc: 'Built strong community infrastructure' },
      { step: 'Village Transformation', desc: 'Inclusive environment where marginalized voices are heard' },
      { step: 'Recognition', desc: 'Symbol of progressive grassroots democracy' }
    ],
    story: "Dnyaneshwar Kamble's journey is one of immense courage. Despite facing societal prejudice for being transgender, Dnyaneshwar focused on the true spirit of local governance—serving the people. The villagers recognized this dedication and elected Dnyaneshwar as Sarpanch.",
    challenges: [
      { icon: Users, label: 'Social Stigma' },
      { icon: Building, label: 'Poor Infrastructure' }
    ],
    achievements: [
      'Inclusive Leadership',
      'Improved Basic Infrastructure',
      'Empowered Marginalized Voices'
    ],
    impact: [
      { before: 'Marginalized voices were ignored in decision-making.', after: 'An inclusive community where everyone has a say.' }
    ],
    facts: [
      { label: 'Elected', value: '2017' },
      { label: 'Motto', value: 'Service to the village is service to the public' }
    ],
    videoLink: 'https://www.youtube.com/embed/90yu81PLbuM',
  },
  {
    id: 'vandana',
    name: 'Vandana Bahadur Maida',
    designation: 'Sarpanch of Khankhandvi',
    state: 'Madhya Pradesh',
    portrait: vandanaImg,
    badge: 'First Female Sarpanch',
    intro: 'Broke traditional gender norms to lead her Panchayat and ensure clean water and education.',
    timeline: [
      { step: 'Early Life', desc: 'Lived in a traditional patriarchal setup' },
      { step: 'Challenge Faced', desc: 'Women were not allowed to lead' },
      { step: 'Became Sarpanch', desc: 'Stepped up to solve real issues' },
      { step: 'Major Achievement', desc: 'Addressed severe sanitation & education crises' },
      { step: 'Village Transformation', desc: 'Brought clean water and built schools' },
      { step: 'Recognition', desc: 'Inspiring women across the district' }
    ],
    story: "Vandana Bahadur Maida shattered traditional barriers when she became the first female Sarpanch of Khankhandvi. In a society where women's participation was limited, she took charge to address the critical needs of her village that were being ignored, especially regarding sanitation and education.",
    challenges: [
      { icon: Shield, label: 'Patriarchal Norms' },
      { icon: Droplet, label: 'Water Crisis' },
      { icon: BookOpen, label: 'Lack of Education' }
    ],
    achievements: [
      'Encouraged Women\'s Participation',
      'Built Sanitation Facilities',
      'Improved Local Schools'
    ],
    impact: [
      { before: 'Women had no voice in the Gram Sabha.', after: 'Women actively participate and lead village development.' },
      { before: 'Severe lack of clean water.', after: 'Reliable water supply for all households.' }
    ],
    facts: [
      { label: 'Village', value: 'Khankhandvi' },
      { label: 'Focus', value: 'Education & Sanitation' }
    ],
    videoLink: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D3810311239007203&show_text=0&width=560',
  },
  {
    id: 'popatrao',
    name: 'Popatrao Baguji Pawar',
    designation: 'Sarpanch of Hiware Bazar',
    state: 'Maharashtra',
    portrait: popatraoImg,
    badge: 'Visionary Leader',
    intro: 'Transformed a drought-prone village into a prosperous, green model of sustainability.',
    timeline: [
      { step: 'Early Life', desc: 'Returned to his drought-hit village' },
      { step: 'Challenge Faced', desc: 'Severe water scarcity & poverty' },
      { step: 'Became Sarpanch', desc: 'Elected unopposed in 1989' },
      { step: 'Major Achievement', desc: 'Massive rainwater harvesting' },
      { step: 'Village Transformation', desc: 'From drought to millionaire village' },
      { step: 'Recognition', desc: 'Padma Shri Awardee' }
    ],
    story: "Popatrao Pawar took charge of Hiware Bazar when it was plagued by severe drought, poverty, and social decline. Through strict discipline, community participation in rainwater harvesting, and banning water-intensive crops, he turned the village into one of the most prosperous in India.",
    challenges: [
      { icon: Droplet, label: 'Severe Drought' },
      { icon: Users, label: 'Social Decline' },
      { icon: Tractor, label: 'Failing Agriculture' }
    ],
    achievements: [
      'Improved Water Conservation',
      'Planted over 1 Million Trees',
      'Village Development Model'
    ],
    impact: [
      { before: 'Barren land and severe water shortage.', after: 'Lush green farms and rising groundwater levels.' },
      { before: 'Widespread poverty.', after: 'High standard of living and prosperity.' }
    ],
    facts: [
      { label: 'Award', value: 'Padma Shri (2020)' },
      { label: 'Village', value: 'Hiware Bazar' }
    ],
    videoLink: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D531157989280278&show_text=0&width=560',
  }
];

// --- COMPONENTS ---

function BiographyModal({ hero, onClose }) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1000, display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{ width: '100%', maxWidth: '600px', height: '100%', background: 'var(--card-bg)', overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header with image */}
        <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', padding: '4rem 2rem 2rem 2rem', color: 'white' }}>
          <button onClick={onClose} aria-label="Close modal" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0, 0, 0, 0.4)', border: '2px solid rgba(255,255,255,0.7)', color: '#ffffff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', zIndex: 10, fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
            &#x2715;
          </button>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'white', border: '4px solid rgba(255,255,255,0.3)', flexShrink: 0, overflow: 'hidden', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <img src={hero.portrait} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <User size={50} color="#0ea5e9" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }} />
            </div>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '0.8rem' }}>{hero.badge}</div>
              <h2 style={{ margin: 0, fontSize: '2.2rem', lineHeight: '1.2', fontWeight: '800' }}>{hero.name}</h2>
              <div style={{ fontSize: '1.1rem', opacity: 0.9, marginTop: '0.5rem', fontWeight: '500' }}>{hero.designation}</div>
              <div style={{ fontSize: '0.95rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}><MapPin size={16} /> {hero.state}</div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          
          {/* Timeline */}
          <section>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <History size={24} color="var(--accent)" /> Journey Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeft: '3px solid var(--border)', paddingLeft: '1.5rem', marginLeft: '0.75rem' }}>
              {hero.timeline.map((item, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-31.5px', top: '3px', width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent)', border: '3px solid var(--bg)' }} />
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.2rem' }}>{item.step}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Story */}
          <section>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <BookOpen size={24} color="var(--accent)" /> The Story
            </h3>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
              {hero.story}
            </p>
          </section>

          {/* Challenges */}
          <section>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <AlertTriangle size={24} color="#f59e0b" /> Major Challenges
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {hero.challenges.map((chal, i) => (
                <div key={i} style={{ background: 'var(--surface)', padding: '0.8rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <chal.icon size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>{chal.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <Trophy size={24} color="#10b981" /> Major Achievements
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {hero.achievements.map((ach, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle2 size={24} color="#10b981" />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{ach}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Impact */}
          <section>
            <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <TrendingUp size={24} color="#8b5cf6" /> Impact on the Village
            </h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {hero.impact.map((imp, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Before</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{imp.before}</div>
                  </div>
                  <div style={{ background: '#8b5cf6', color: 'white', padding: '0.8rem', borderRadius: '50%', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)' }}>
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>After</div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', lineHeight: '1.5' }}>{imp.after}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interesting Facts */}
          <section>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.4rem' }}>
              <Info size={24} color="#3b82f6" /> Interesting Facts
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {hero.facts.map((fact, i) => (
                <div key={i} style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1.2rem', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{fact.label}</div>
                  <div style={{ fontSize: '1.1rem', color: '#1d4ed8', fontWeight: '800' }}>{fact.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

function HeroCard({ hero, onExplore }) {
  const [showVideo, setShowVideo] = useState(false);
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '20px', transition: 'transform 0.3s', border: '1px solid var(--accent-border)' }}>
      <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--surface), var(--border))', overflow: 'hidden', position: 'relative', border: '5px solid var(--card-bg)', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
        <img src={hero.portrait} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
        <User size={60} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }} />
      </div>
      
      <div style={{ marginTop: '1.5rem', background: 'var(--accent)', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        {hero.badge}
      </div>
      
      <h3 style={{ margin: '1.5rem 0 0.5rem 0', fontSize: '1.6rem', color: 'var(--text-heading)', fontWeight: '800' }}>{hero.name}</h3>
      <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05rem' }}>{hero.designation}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        <MapPin size={16} /> {hero.state}
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 2rem 0', flex: 1 }}>
        {hero.intro}
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', width: '100%', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button onClick={() => { playClick(); onExplore(); }} className="primary" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold' }}>
            Explore Story
          </button>
          {hero.videoLink && (
            <button onClick={() => { playClick(); setShowVideo(!showVideo); }} className="outline" style={{ flex: 1, padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: '600', background: showVideo ? 'var(--surface)' : 'transparent' }}>
              <Video size={20} /> {showVideo ? 'Close Video' : 'Watch Interview'}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showVideo && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', width: '100%', marginTop: '0.5rem' }}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <iframe src={hero.videoLink} width="100%" height="100%" style={{ border: 'none', overflow: 'hidden' }} allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem', fontStyle: 'italic' }}>
                Listen to how they transformed their village.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- BAL PANCHAYAT GAME COMPONENTS ---

function DraggableComplaint({ id, text, isAssigned }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: isAssigned
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : (isAssigned ? 0 : 1),
    position: isAssigned ? 'absolute' : 'relative',
    pointerEvents: isAssigned ? 'none' : 'auto'
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        padding: '1rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--accent-border)',
        borderRadius: '12px',
        cursor: 'grab',
        boxShadow: isDragging ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
        color: 'var(--text-primary)'
      }}
    >
      <Baby size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>"{text}"</div>
    </div>
  );
}

function DroppableMinister({ id, title, icon: Icon, color, assignedComplaint, description }) {
  const { isOver, setNodeRef } = useDroppable({ id: id });

  return (
    <div
      ref={setNodeRef}
      style={{
        padding: '1.5rem',
        background: assignedComplaint ? `${color}11` : (isOver ? `${color}22` : 'var(--surface)'),
        border: `2px dashed ${assignedComplaint ? color : (isOver ? color : 'var(--border)')}`,
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        transition: 'all 0.2s',
        minHeight: '200px',
        position: 'relative'
      }}
    >
      <div style={{ background: color, color: 'white', padding: '1rem', borderRadius: '50%', boxShadow: `0 4px 15px ${color}66` }}>
        <Icon size={32} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--text-heading)', fontSize: '1.1rem' }}>{title}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{description}</div>
      </div>
      
      {assignedComplaint ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ padding: '0.8rem', background: color, color: 'white', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
          <CheckCircle2 size={18} /> Solved!
        </motion.div>
      ) : (
        <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: '8px', width: '100%', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Drop complaint here
        </div>
      )}
    </div>
  );
}

// --- MAIN STAGE 4 COMPONENT ---

export default function Stage4_DiscoverHeroes({ onComplete, addXp }) {
  const [playClick] = useSound('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', { volume: 0.5 });
  const [playSuccess] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', { volume: 0.5 });
  const [playError] = useSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', { volume: 0.5 });

  const [exploreHero, setExploreHero] = useState(null);
  
  // Bal Panchayat DnD State
  const [assignments, setAssignments] = useState({
    education: null,
    health: null,
    environment: null
  });

  const complaints = [
    { id: 'comp_edu', text: 'The school boundary wall is broken.', target: 'education' },
    { id: 'comp_health', text: 'The school toilets are dirty and lack water.', target: 'health' },
    { id: 'comp_env', text: 'We have no playground to play in!', target: 'environment' }
  ];

  const ministers = [
    { id: 'education', title: 'Education Minister', description: 'Handles school buildings & supplies', icon: BookOpen, color: '#3b82f6' },
    { id: 'health', title: 'Health & Sanitation', description: 'Handles cleanliness & water', icon: Heart, color: '#f43f5e' },
    { id: 'environment', title: 'Environment & Sports', description: 'Handles parks & trees', icon: Sparkles, color: '#10b981' }
  ];

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const complaint = complaints.find(c => c.id === active.id);
    
    if (complaint.target === over.id) {
      playSuccess();
      setAssignments(prev => ({ ...prev, [over.id]: complaint.id }));
      addXp(15);
    } else {
      playError();
    }
  };

  const allAssigned = Object.values(assignments).every(val => val !== null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      
      {/* 1. Real Changemakers Museum Gallery */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Biography Explorer
        </div>
        <h2 style={{ margin: 0, fontSize: '2.8rem', color: 'var(--text-heading)', marginBottom: '1rem', fontWeight: '800' }}>
          Exemplary Sarpanchs
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '800px', lineHeight: '1.6' }}>
          Good leadership at the village level can change thousands of lives. Discover the true stories of Sarpanchs who transformed their villages through dedication, innovation, and courage.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {heroesData.map(hero => (
            <HeroCard key={hero.id} hero={hero} onExplore={() => { playClick(); setExploreHero(hero); addXp(5); }} />
          ))}
        </div>
      </section>

      {/* 2. Child Friendly Panchayat / Bal Sabha Interactive Simulator */}
      <section>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '2px', background: 'var(--accent-text)' }} />
          Interactive Simulation
        </div>
        <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-heading)', marginBottom: '1rem', fontWeight: '800' }}>
          The Bal Panchayat
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '800px', lineHeight: '1.6' }}>
          Many villages have a <strong>Bal Sabha (Children's Parliament)</strong> where children elect their own ministers to solve issues affecting them. 
          <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}> Drag and drop the children's complaints to the correct minister to solve them!</span>
        </p>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'var(--card-bg)', display: 'flex', flexDirection: 'column', gap: '3rem', borderRadius: '24px', border: '1px solid var(--accent-border)' }}>
            
            {/* Unassigned Complaints */}
            {!allAssigned && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h3 style={{ color: '#f43f5e', fontSize: '1.3rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Baby size={28} /> Pending Complaints
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', minHeight: '100px' }}>
                  {complaints.map(comp => (
                    <DraggableComplaint 
                      key={comp.id} 
                      id={comp.id} 
                      text={comp.text} 
                      isAssigned={Object.values(assignments).includes(comp.id)} 
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Elected Ministers (Droppable Areas) */}
            <div>
              <h3 style={{ color: 'var(--text-heading)', fontSize: '1.3rem', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building size={28} color="var(--accent)" /> Elected Ministers
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {ministers.map(minister => (
                  <DroppableMinister 
                    key={minister.id}
                    id={minister.id}
                    title={minister.title}
                    description={minister.description}
                    icon={minister.icon}
                    color={minister.color}
                    assignedComplaint={assignments[minister.id]}
                  />
                ))}
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {allAssigned && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '2px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ background: '#10b981', display: 'inline-flex', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16,185,129,0.4)' }}>
                    <CheckCircle2 size={48} color="white" />
                  </div>
                  <h3 style={{ color: 'var(--text-heading)', fontSize: '2.2rem', margin: '0 0 1rem 0', fontWeight: '800' }}>All Problems Solved!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
                    Because the children organized into a Bal Panchayat and elected specific ministers, they successfully brought these issues to the adult Gram Panchayat and got them fixed!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </DndContext>
      </section>

      {/* Footer Navigation */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button 
          onClick={() => { playClick(); onComplete(); }}
          disabled={!allAssigned}
          className="primary" 
          style={{ opacity: allAssigned ? 1 : 0.5, padding: '1rem 2rem', gap: '0.8rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          Explore Block & District Levels <ArrowRight size={20} />
        </button>
      </div>

      {/* Explore Story Modal */}
      <AnimatePresence>
        {exploreHero && (
          <BiographyModal hero={exploreHero} onClose={() => { playClick(); setExploreHero(null); }} />
        )}
      </AnimatePresence>

    </div>
  );
}
