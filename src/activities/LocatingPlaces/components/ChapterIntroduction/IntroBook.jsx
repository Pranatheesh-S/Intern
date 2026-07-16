import React, { useState } from 'react';
import { Compass, BookOpen, Globe2, ChevronLeft, ChevronRight } from 'lucide-react';
import AryabhataPage from './AryabhataPage';
import BigQuestionsPage from './BigQuestionsPage';

export default function IntroBook({ isOpen, currentPage, onNext, onPrev, onBeginChapter, onOpenBook }) {
  const [isMissionUnlocked, setIsMissionUnlocked] = useState(false);
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: '2500px',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1400px',
        height: '85vh',
        transform: isOpen ? 'translateX(0)' : 'translateX(-25%)',
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d'
      }}>
        
        {/* RIGHT HALF (Back cover + right pages) */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%',
          backgroundColor: '#1e3a8a', borderRadius: '0 8px 8px 0',
          boxShadow: '10px 20px 40px rgba(0,0,0,0.3)'
        }}>
          {/* Right paper */}
          <div style={{
            position: 'absolute', top: '10px', bottom: '10px', left: 0, right: '10px',
            backgroundColor: '#fdfbf7', borderRadius: '0 4px 4px 0',
            boxShadow: 'inset -5px 0 20px rgba(0,0,0,0.05)'
          }}></div>
        </div>

        {/* LEFT HALF (Back cover + left pages) - Fades in as it opens to hide weird overlapping */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          backgroundColor: '#1e3a8a', borderRadius: '8px 0 0 8px',
          opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out',
          boxShadow: '-10px 20px 40px rgba(0,0,0,0.2)'
        }}>
          {/* Left paper */}
          <div style={{
            position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: 0,
            backgroundColor: '#fdfbf7', borderRadius: '4px 0 0 4px',
            boxShadow: 'inset 5px 0 20px rgba(0,0,0,0.05)'
          }}></div>
        </div>

        {/* BOOK SPINE SHADOW */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: '40px', transform: 'translateX(-50%)',
          background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)',
          zIndex: 10, pointerEvents: 'none', opacity: isOpen ? 1 : 0, transition: 'opacity 0.6s'
        }}></div>

        {/* PAGE CONTENT CONTAINER */}
        <div style={{
          position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px',
          zIndex: 15, display: 'flex', opacity: isOpen ? 1 : 0, transition: 'opacity 0.8s 0.2s',
          pointerEvents: isOpen ? 'auto' : 'none',
          boxSizing: 'border-box'
        }}>
            
            {/* Page Rendering with Animation */}
            <div key={currentPage} style={{ width: '100%', height: '100%', animation: 'pageTurn 0.4s ease-out', position: 'relative' }}>
              {currentPage === 1 && <AryabhataPage />}
              {currentPage === 2 && <BigQuestionsPage onMissionUnlock={() => setIsMissionUnlocked(true)} />}
            </div>

            {/* Navigation Controls */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 2.5rem', zIndex: 50, pointerEvents: 'none' }}>
              <div style={{ flex: 1, pointerEvents: 'auto' }}>
                <button 
                  onClick={onPrev} 
                  disabled={currentPage === 1} 
                  style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', padding: '0.5rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0 : 1, transition: 'background 0.2s', color: '#334155', fontWeight: 'bold' }}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'bold', pointerEvents: 'none' }}>
                <BookOpen size={16} /> Page {currentPage} of 2
              </div>

              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
                {currentPage === 1 ? (
                  <button 
                    onClick={onNext} 
                    style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.3)', fontWeight: 'bold', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                ) : (
                  <div style={{ opacity: isMissionUnlocked ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: isMissionUnlocked ? 'auto' : 'none' }}>
                    <button 
                      onClick={onBeginChapter} 
                      style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '30px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Start Exploring <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
        </div>

        {/* FRONT COVER */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%',
          transformOrigin: 'left center',
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          zIndex: isOpen ? 10 : 50
        }}>
          {/* Front of the Cover */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#1e3a8a', borderRadius: '0 8px 8px 0',
            boxShadow: isOpen ? 'none' : '5px 0 15px rgba(0,0,0,0.4)',
            backfaceVisibility: 'hidden',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ border: '2px solid rgba(255,255,255,0.2)', width: '85%', height: '90%', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '2rem 0', boxSizing: 'border-box' }}>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '20px', color: 'white', fontSize: '1rem', letterSpacing: '2px', marginBottom: '2rem' }}>CLASS 6</div>
                
                <Globe2 size={80} color="#60A5FA" style={{ marginBottom: '2rem', opacity: 0.9 }} />
                
                <h1 style={{ color: 'white', fontSize: '3rem', margin: 0, fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', textAlign: 'center' }}>Social Science</h1>
                
                <div style={{ height: '2px', width: '60%', backgroundColor: 'rgba(255,255,255,0.2)', margin: '1.5rem 0' }}></div>
                
                <div style={{ color: '#93C5FD', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Chapter 1</div>
                <div style={{ color: 'white', fontSize: '1.2rem', letterSpacing: '2px', opacity: 0.9, textAlign: 'center', padding: '0 2rem' }}>LOCATING PLACES ON THE EARTH</div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onOpenBook(); }}
                style={{
                  marginTop: '1rem',
                  padding: '0.8rem 2.5rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#1e3a8a',
                  background: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  zIndex: 100
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
              >
                Open Book
              </button>
            </div>
          </div>
          
          {/* Back of the Cover (Inside Cover) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: '#1e3a8a', borderRadius: '8px 0 0 8px',
            transform: 'rotateY(180deg)', backfaceVisibility: 'hidden',
            borderRight: '1px solid rgba(0,0,0,0.2)'
          }}>
             {/* Left paper inside cover */}
             <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '0', backgroundColor: '#fdfbf7', borderRadius: '4px 0 0 4px', boxShadow: 'inset 5px 0 20px rgba(0,0,0,0.05)' }}></div>
          </div>
        </div>

      </div>

      <style>
        {`
          @keyframes pageTurn {
            0% { opacity: 0; transform: translateX(10px); filter: brightness(0.9); }
            100% { opacity: 1; transform: translateX(0); filter: brightness(1); }
          }
        `}
      </style>
    </div>
  );
}
