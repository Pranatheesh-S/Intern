import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const scenes = [
    { img: '/scene-1.jpeg', subtitle: 'Scene 1: Reshma\'s Birthday Gift', text: 'Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother\'s 60th birthday.' },
    { img: '/scene-2.jpeg', subtitle: 'Scene 2: The Spice Ship', text: 'Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea.' },
    { img: '/scene-3.jpeg', subtitle: 'Scene 3: The Storm', text: 'Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars.' },
    { img: '/scene-4.jpeg', subtitle: 'Scene 4: Searching for an Answer', text: 'Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden.' },
    { img: '/scene-5.jpeg', subtitle: 'Scene 5: Discovering Magnets', text: 'This made Reshma curious about magnets. She remembered the magnets in her pencil box, purse, and the whiteboard duster at school. She realized that magnets were used in many everyday objects.' },
    { img: '/scene-6.jpeg', subtitle: 'Scene 6: A Story Completed', text: 'After learning how a magnetic compass works, Reshma completed her story. In her story, the sailors safely navigated through the storm using the compass. Her grandmother loved the story, and Reshma developed a new interest in learning about magnets and magnetism.' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)', fontFamily: 'system-ui, sans-serif', height: '100%', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <button 
          onClick={onBackToDashboard}
          style={{ 
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', 
            padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Chapters
        </button>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>Introduction to Magnets: Reshma's Story</h1>
      </div>

      {/* Story Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {scenes.map((scene, i) => (
          <div key={i} style={{ 
            background: 'var(--surface)', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ width: '100%', height: '220px', overflow: 'hidden', background: '#1e293b' }}>
              <img 
                src={scene.img} 
                alt={scene.subtitle} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x220/1e1b4b/818cf8?text=Scene+' + (i+1) }} 
              />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#818cf8', fontSize: '1.2rem' }}>{scene.subtitle}</h3>
              <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6' }}>{scene.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer space with Complete Button */}
      <div style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {onComplete && (
          <button 
            onClick={onComplete}
            style={{
              background: '#10b981', color: '#fff', border: 'none', padding: '0.8rem 2rem', 
              borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            Complete Story & Continue
          </button>
        )}
      </div>
    </div>
  );
}
