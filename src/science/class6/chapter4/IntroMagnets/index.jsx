import React, { useState } from 'react';
import { ArrowLeft, Magnet, ArrowRight } from 'lucide-react';

export default function IntroMagnets({ onBackToDashboard, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenes = [
    { img: '/scene_1.png', subtitle: 'Reshma\'s Birthday Gift', text: 'Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother\'s 60th birthday.' },
    { img: '/scene_2.png', subtitle: 'The Spice Ship', text: 'Her story was about a ship carrying spices like pepper, cardamom, and cinnamon from Kerala for trade in the olden days. The sailors used the stars at night to find the right direction across the sea.' },
    { img: '/scene_3.png', subtitle: 'The Storm', text: 'Suddenly, in her story, the ship was caught in a fierce storm. Thick clouds covered the sky, and the stars disappeared. Reshma wondered how the sailors could continue their journey without seeing the stars.' },
    { img: '/scene_4.png', subtitle: 'Searching for an Answer', text: 'Unable to continue her story, Reshma searched the internet and visited her school library. She discovered that sailors used a magnetic compass to find directions even when the stars were hidden.' },
    { img: '/scene_5.png', subtitle: 'Discovering Magnets', text: 'This made Reshma curious about magnets. She remembered the magnets in her pencil box, purse, and the whiteboard duster at school. She realized that magnets were used in many everyday objects.' },
    { img: '/scene_7.png', subtitle: 'HISTORY OF MAGNET', text: <>Did you know that magnets were once mysterious rocks found in nature? Thousands of years ago, sailors used these natural magnets, called <strong>lodestones</strong>, to find their way across oceans. Later, people learned how to make stronger magnets from iron and use them in tools and machines. Today, magnets are everywhere! They help trains float above tracks, doctors look inside the human body using MRI machines, and even power devices we use every day. From guiding ancient explorers to driving modern technology, magnets have truly transformed our world!</> },
    { img: '/last_scene.png' }
  ];

  const handleNext = () => setCurrentPage(p => Math.min(scenes.length, p + 1));
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleFinish = () => setIsCompleted(true);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${scenes[currentPage - 1].img})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />

      {/* Bottom Left Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1rem', zIndex: 10 }}>
        <button
          onClick={onBackToDashboard}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          Previous
        </button>
      </div>

      {/* Bottom Right Controls */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', zIndex: 10 }}>
        {currentPage < scenes.length ? (
          <button 
            onClick={handleNext}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            style={{ padding: '0.75rem 2rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Finish Story
          </button>
        )}
      </div>

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
  );
}
