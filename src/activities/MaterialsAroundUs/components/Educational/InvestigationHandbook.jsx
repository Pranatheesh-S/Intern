import React, { useState } from 'react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, Globe, Compass, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InvestigationHandbook({ data, onComplete }) {
  const [view, setView] = useState('cover'); // 'cover' or 'spread'
  const [currentSpread, setCurrentSpread] = useState(0);

  const totalSpreads = Math.ceil(data.content.length / 2);

  const handleNextSpread = () => {
    if (currentSpread < totalSpreads - 1) {
      setCurrentSpread(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevSpread = () => {
    if (currentSpread > 0) {
      setCurrentSpread(prev => prev - 1);
    } else {
      setView('cover');
    }
  };

  const BLAKE_IMG_URL = '/images/chief_detective_blake.png';

  const SpeechBubble = ({ text }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '-20px',
        right: '-20px',
        background: 'white', 
        padding: '1.25rem 1.5rem', 
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)', 
        zIndex: 20
      }}
    >
      {/* Name Badge */}
      <div style={{
        position: 'absolute',
        top: '-14px',
        left: '24px',
        background: '#64748b',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        CHIEF BLAKE
      </div>
      
      {/* Pointer Triangle */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '12px',
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '12px solid white',
        zIndex: -1
      }} />

      <p style={{ margin: 0, fontSize: '1.05rem', color: '#1e293b', lineHeight: '1.5', fontWeight: '500' }}>{text}</p>
    </motion.div>
  );

  if (view === 'cover') {
    return (
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', gap: '4rem' }}>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: '100%', maxWidth: '500px', height: '700px', maxHeight: '80vh',
            background: '#1e3a8a',
            borderRadius: '4px 16px 16px 4px',
            boxShadow: '-10px 0 20px rgba(0,0,0,0.5), inset 4px 0 10px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', padding: '3rem', position: 'relative', border: '1px solid #172554'
          }}
        >
          {/* Subtle spine line */}
          <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1.5rem', borderRadius: '20px', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3rem' }}>
            Class 6
          </div>

          <Globe size={64} style={{ opacity: 0.8, marginBottom: '2rem' }} />

          <h1 style={{ fontSize: '2.5rem', margin: '0 0 2rem 0', fontFamily: 'serif', fontWeight: 'bold' }}>
            Secret Book
          </h1>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }} />

          <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 'normal', opacity: 0.9 }}>
            Investigation
          </h2>
          <h3 style={{ fontSize: '1.4rem', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
            {data.title.replace('Investigation Handbook: ', '')}
          </h3>

          <button 
            onClick={() => setView('spread')}
            style={{ 
              marginTop: 'auto', background: 'white', color: '#1e3a8a', padding: '1rem 3rem', 
              borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
              border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Book
          </button>
        </motion.div>

        <div style={{ position: 'relative', height: '450px', width: '320px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <img 
            src={BLAKE_IMG_URL} 
            alt="Chief Detective" 
            style={{ height: '450px', objectFit: 'contain', transform: 'scaleX(-1)' }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x450.png?text=Blake'; }}
          />
          <SpeechBubble text="Study this Secret Book carefully before proceeding. The clues you need are inside!" />
        </div>
      </div>
    );
  }

  const leftPage = data.content[currentSpread * 2];
  const rightPage = data.content[currentSpread * 2 + 1];

  const renderPageContent = (page) => {
    if (!page) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', color: '#1e3a8a', fontFamily: 'serif' }}>{page.heading}</h3>
        
        {page.image && (
          <div style={{ fontSize: '6rem', textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: '12px' }}>
            {page.image}
          </div>
        )}
        
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#334155' }}>
          {page.text}
        </p>
        
        {page.highlights && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {page.highlights.map((hl, i) => (
              <div key={i} style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                {hl}
              </div>
            ))}
          </div>
        )}
        
        {page.example && (
          <div style={{ marginTop: 'auto', background: '#fef3c7', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #d97706' }}>
            <strong style={{ color: '#b45309', display: 'block', marginBottom: '0.5rem' }}>Example:</strong> 
            <span style={{ color: '#78350f' }}>{page.example}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          width: '100%', maxWidth: '1200px', height: '80vh', minHeight: '600px',
          background: 'white', borderRadius: '8px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          display: 'flex', border: '12px solid #1e3a8a',
          position: 'relative'
        }}
      >
        {/* Book Spine (Center Line) */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '4px', background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05), transparent)', transform: 'translateX(-50%)', zIndex: 10 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: '#cbd5e1', transform: 'translateX(-50%)', zIndex: 10 }} />

        {/* Left Page */}
        <div style={{ flex: 1, padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            {renderPageContent(leftPage)}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={handlePrevSpread}
              style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b' }}
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Page {currentSpread * 2 + 1}</div>
          </div>
        </div>

        {/* Right Page */}
        <div style={{ flex: 1, padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }}>
            {renderPageContent(rightPage)}
            
            {/* If it's the last page, show the Mission box */}
            {currentSpread === totalSpreads - 1 && (
              <div style={{ marginTop: '3rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Mission</h4>
                <p style={{ margin: 0, color: '#15803d', fontSize: '1rem', lineHeight: '1.5' }}>
                  By the end of this investigation, you will be able to observe objects and identify the materials they are made of. Close the book to unlock your mission!
                </p>
              </div>
            )}
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Page {currentSpread * 2 + 2}</div>
            
            {currentSpread === totalSpreads - 1 ? (
              <button 
                onClick={handleNextSpread}
                style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Start Investigation <CheckCircle size={18} />
              </button>
            ) : (
              <button 
                onClick={handleNextSpread}
                style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#64748b' }}
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
