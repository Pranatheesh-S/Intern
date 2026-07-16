import React, { useState } from 'react';
import { ArrowLeft, Magnet, ArrowRight } from 'lucide-react';
import MagnetBook from './MagnetBook';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenes = [
    { img: '/scene-1.jpeg', subtitle: 'Scene 1: Reshma\'s Birthday Gift', text: 'Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother\'s 60th birthday.' },
    { img: '/scene-2.jpeg', subtitle: 'Scene 2: The Spice Ship', text: 'Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea.' },
    { img: '/scene-3.jpeg', subtitle: 'Scene 3: The Storm', text: 'Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars.' },
    { img: '/scene-4.jpeg', subtitle: 'Scene 4: Searching for an Answer', text: 'Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden.' },
    { img: '/scene-5.jpeg', subtitle: 'Scene 5: Discovering Magnets', text: 'This made Reshma curious about magnets. She remembered the magnets in her pencil box, purse, and the whiteboard duster at school. She realized that magnets were used in many everyday objects.' },
    { img: '/scene-6.jpeg', subtitle: 'Scene 6: A Story Completed', text: 'After learning how a magnetic compass works, Reshma completed her story. In her story, the sailors safely navigated through the storm using the compass. Her grandmother loved the story, and Reshma developed a new interest in learning about magnets and magnetism.' },
    { img: '/h_magnets.jpg', subtitle: 'Scene 7: Fun with Magnets', text: 'Reshma\'s curiosity grew as she started exploring different types of magnets, fascinated by the invisible magnetic fields they created.' }
  ];

  const handleNext = () => setCurrentPage(p => Math.min(scenes.length, p + 1));
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleFinish = () => setIsCompleted(true);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={onBackToDashboard}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.4rem', borderColor: 'var(--border)', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'transparent' }}
        >
          <ArrowLeft size={16} /> Back to Chapters
        </button>
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-heading)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Magnet style={{ color: 'var(--accent)' }} size={28} />
          Introduction to Magnets
        </h1>
      </div>

      <div style={{
        width: '100%', 
        aspectRatio: '16/9',
        minHeight: '700px',
        maxHeight: '85vh',
        display: 'flex', 
        background: 'var(--bg-primary)', 
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)'
      }}>
      
      {/* BOOK PANEL */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <MagnetBook 
          isOpen={isOpen} 
          currentPage={currentPage}
          totalPages={scenes.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onFinish={handleFinish}
          scenes={scenes}
        />

        {!isOpen && (
          <button 
            className="primary" 
            onClick={() => setIsOpen(true)}
            style={{ position: 'absolute', bottom: '3rem', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '30px', transition: 'transform 0.2s', cursor: 'pointer', background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 60 }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Storybook
          </button>
        )}

        {/* COMPLETION MODAL */}
        {isCompleted && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              background: 'var(--card-bg)', padding: '3rem', borderRadius: '24px',
              maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'inline-flex', padding: '1.5rem', background: '#ecfdf5', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
                <Magnet size={48} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Story Completed!</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Reshma learned that magnets were essential for navigation. Are you ready to explore magnets yourself?
              </p>
              <button 
                className="primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: '#fff', border: 'none' }}
                onClick={onComplete}
              >
                Continue to Activity 4.1 <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
