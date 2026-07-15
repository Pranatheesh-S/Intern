import React from 'react';
import { Compass, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PhysicalMapPage, PoliticalMapPage, ThematicMapPage } from './MapPages';

export default function AtlasBook({ isOpen, currentPage, onNext, onPrev, onFinish }) {
  
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: '2000px',
      padding: '1rem'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '1.4 / 1',
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
        
        {/* BOOKMARK RIBBON */}
        <div style={{
          position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '80px',
          backgroundColor: '#b91c1c', zIndex: 12, boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
          opacity: isOpen ? 1 : 0, transition: 'opacity 0.6s'
        }}></div>

        {/* PAGE CONTENT CONTAINER */}
        <div style={{
          position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px',
          zIndex: 15, display: 'flex', opacity: isOpen ? 1 : 0, transition: 'opacity 0.8s 0.2s',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}>
            {/* The page turn animation is handled internally by a simple keyframe fade */}
            <div key={currentPage} style={{ width: '100%', height: '100%', animation: 'pageTurn 0.4s ease-out' }}>
              {currentPage === 1 && <PhysicalMapPage />}
              {currentPage === 2 && <PoliticalMapPage />}
              {currentPage === 3 && <ThematicMapPage />}
            </div>

            {/* Navigation Controls */}
            <div style={{ position: 'absolute', bottom: '1rem', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 2rem' }}>
              <button onClick={onPrev} disabled={currentPage === 1} style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: currentPage === 1 ? 'default' : 'pointer', opacity: currentPage === 1 ? 0 : 1, transition: 'background 0.2s', color: '#334155' }}>
                <ChevronLeft size={18} /> Previous
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                <Compass size={16} /> Page {currentPage} of 3
              </div>

              {currentPage < 3 ? (
                <button onClick={onNext} style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '0.4rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <button onClick={onFinish} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.4rem 1.2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                  Finish <CheckCircle2 size={18} />
                </button>
              )}
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
            <div style={{ border: '2px solid #fbbf24', width: '85%', height: '90%', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Compass size={64} color="#fbbf24" style={{ marginBottom: '2rem', opacity: 0.9 }} />
              <h1 style={{ color: '#fbbf24', fontSize: '3.5rem', letterSpacing: '6px', margin: 0, fontFamily: 'serif', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>ATLAS</h1>
              <div style={{ height: '2px', width: '60%', backgroundColor: '#fbbf24', margin: '1.5rem 0', opacity: 0.7 }}></div>
              <div style={{ color: '#fbbf24', fontSize: '1.2rem', letterSpacing: '4px', opacity: 0.8 }}>A COLLECTION OF MAPS</div>
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
