import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowLeft } from 'lucide-react';
import AtlasBook from './AtlasBook';
import ChapterBackFooter from '../ChapterBackFooter';

export default function AtlasIntroduction({ onNextActivity, onBack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleNext = () => setCurrentPage(p => Math.min(3, p + 1));
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleFinish = () => setIsCompleted(true);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      
      <div style={{
        width: '100%', 
        height: '100%',
        minHeight: '600px',
        display: 'flex', 
        flexDirection: 'column',
        background: '#ffffff', 
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid #d6e0ec',
        boxShadow: '0 8px 30px rgba(14,42,69,0.08)'
      }}>
      
      {/* Top Bar for Back Button */}
      {isOpen && (
        <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid #d6e0ec', background: '#ffffff', zIndex: 20 }}>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: '#5c6b7a', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#20303f'}
            onMouseOut={(e) => e.currentTarget.style.color = '#5c6b7a'}
          >
            <ArrowLeft size={18} /> Back to Cover
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* LEFT PANEL */}
      <div style={{ 
        flex: '0 0 32%', 
        minWidth: '350px', 
        padding: 'clamp(1.5rem, 2.5vw, 2rem)',
        borderRight: '1px solid #d6e0ec', 
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <div>
        <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: '#eef2ff', color: '#4338ca', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
          Understanding Maps
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 2.2vw, 2.25rem)', color: '#0E3556', margin: '0 0 1rem 0', lineHeight: 1.15 }}>
          Atlas : A Collection of Maps
        </h1>

        <div style={{ color: '#47586b', fontSize: 'clamp(0.95rem, 1.05vw, 1.05rem)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>An Atlas is a special book that contains many different kinds of maps.</p>
          <p style={{ margin: 0 }}>Open the Atlas and discover how each map helps us understand the world.</p>
        </div>
        </div>

        <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '16px', border: '1px solid #d6e0ec' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', color: '#5c6b7a', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} /> Mission
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={isOpen ? "#10b981" : "#5c6b7a"} />
              <div style={{ fontSize: '1rem', color: isOpen ? '#0E3556' : '#5c6b7a', fontWeight: isOpen ? 'bold' : 'normal' }}>Explore the Atlas</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={currentPage === 3 ? "#10b981" : "#5c6b7a"} />
              <div style={{ fontSize: '1rem', color: currentPage === 3 ? '#0E3556' : '#5c6b7a', fontWeight: currentPage === 3 ? 'bold' : 'normal' }}>Discover 3 Types of Maps</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={isCompleted ? "#10b981" : "#5c6b7a"} />
              <div style={{ fontSize: '1rem', color: isCompleted ? '#0E3556' : '#5c6b7a', fontWeight: isCompleted ? 'bold' : 'normal' }}>Complete the Journey</div>
            </div>
          </div>
        </div>

        {!isOpen && (
          <button 
            className="primary" 
            onClick={() => setIsOpen(true)}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer', marginTop: '1rem' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Atlas
          </button>
        )}
      </div>

      {/* RIGHT PANEL - Atlas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AtlasBook 
          isOpen={isOpen} 
          currentPage={currentPage}
          onNext={handleNext}
          onPrev={handlePrev}
          onFinish={handleFinish}
        />

        {/* COMPLETION MODAL */}
        {isCompleted && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              background: '#ffffff', padding: '3rem', borderRadius: '24px',
              maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'inline-flex', padding: '1.5rem', background: '#ecfdf5', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
                <Compass size={48} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: '#0E3556' }}>Excellent!</h2>
              <p style={{ fontSize: '1.15rem', color: '#47586b', lineHeight: 1.6, marginBottom: '2rem' }}>
                You explored an Atlas and discovered three different kinds of maps. Now you're ready to learn how maps work.
              </p>
              <div style={{ background: '#ffffff', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid #d6e0ec', display: 'inline-block', fontWeight: 'bold', color: '#6366f1', fontSize: '1.1rem' }}>
                🏆 Atlas Explorer Badge
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={isCompleted ? 'Continue' : undefined}
        onNext={isCompleted ? onNextActivity : undefined}
        nextVariant="green"
      />
    </div>
    </div>
  );
}
