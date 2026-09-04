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
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1, height: '100%', fontFamily: '"Space Grotesk", sans-serif' }}>
      
      <div style={{
        width: '100%', 
        height: '100%',
        minHeight: '600px',
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', 
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: '20px',
        border: '2px solid #F2DFBC',
        boxShadow: '0 8px 30px rgba(60,40,20,0.06)'
      }}>
      
      {/* Top Bar for Back Button */}
      {isOpen && (
        <div style={{ padding: '0.65rem 1.75rem', borderBottom: '2px solid #F2DFBC', background: '#FFF9F0', zIndex: 20 }}>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', background: 'transparent', border: 'none', color: '#92400E', fontSize: '13px', fontWeight: '800', cursor: 'pointer', transition: 'color 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#78350F'}
            onMouseOut={(e) => e.currentTarget.style.color = '#92400E'}
          >
            <ArrowLeft size={17} color="#92400E" /> Back to Cover
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* LEFT PANEL */}
      <div style={{ 
        flex: '0 0 32%', 
        minWidth: '340px', 
        padding: 'clamp(1.25rem, 2.2vw, 1.75rem)',
        borderRight: '2px solid #F2DFBC', 
        background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 'clamp(0.7rem, 1.6vh, 1.1rem)',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(60,40,20,0.04)',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <div style={{ flexShrink: 0 }}>
        <div style={{ display: 'inline-flex', padding: '0.35rem 0.9rem', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', borderRadius: '20px', fontSize: 'clamp(0.75rem, 1.45vh, 0.88rem)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
          Understanding Maps
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 3.3vh, 2.15rem)', color: '#78350F', margin: '0 0 0.85rem 0', lineHeight: 1.15, fontFamily: '"Fraunces", serif', fontWeight: 900 }}>
          Atlas : A Collection of Maps
        </h1>

        <div style={{ fontSize: 'clamp(0.92rem, 1.9vh, 1.08rem)', lineHeight: 1.55, color: '#3D2E24' }}>
          <p style={{ margin: '0 0 0.6rem 0', color: '#3D2E24', fontWeight: 600, fontSize: 'inherit', lineHeight: 'inherit', textAlign: 'justify', textJustify: 'inter-word', hyphens: 'auto' }}>
            An Atlas is a special book that contains many different kinds of maps.
          </p>
          <p style={{ margin: 0, color: '#3D2E24', fontWeight: 600, fontSize: 'inherit', lineHeight: 'inherit', textAlign: 'justify', textJustify: 'inter-word', hyphens: 'auto' }}>
            Open the Atlas and discover how each map helps us understand the world.
          </p>
        </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: 'clamp(0.9rem, 2vh, 1.25rem)', borderRadius: '14px', border: '1.5px solid #F2DFBC', boxShadow: '0 4px 12px rgba(60,40,20,0.04)', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 0.7rem 0', color: '#92400E', fontSize: 'clamp(0.8rem, 1.6vh, 0.92rem)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, flexShrink: 0 }}>
            <Compass size={18} color="#D97706" /> Mission
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.55rem, 1.2vh, 0.8rem)', flex: 1, minHeight: 0 }}>
            {[
              { label: 'Explore the Atlas', done: isOpen },
              { label: 'Discover 3 Types of Maps', done: currentPage === 3 },
              { label: 'Complete the Journey', done: isCompleted }
            ].map(step => (
              <div
                key={step.label}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flex: '1 1 0', minHeight: 0, background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '10px', padding: 'clamp(0.5rem, 1.4vh, 0.85rem) 0.85rem' }}
              >
                <CheckCircle2 size={19} color={step.done ? '#16a34a' : '#B45309'} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 'clamp(13.5px, 1.95vh, 15.5px)', color: '#3D2E24', fontWeight: 700, lineHeight: 1.25 }}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Atlas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #F7F1E2 0%, #EFE6D2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            background: 'rgba(60,40,20,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(160deg, #FFF9F0 0%, #FBF3E3 100%)', border: '2px solid #86EFAC', padding: '2.5rem', borderRadius: '20px',
              maxWidth: '440px', textAlign: 'center', boxShadow: '0 16px 36px rgba(60,40,20,0.15)'
            }}>
              <div style={{ display: 'inline-flex', padding: '1.25rem', background: '#DCFCE7', borderRadius: '50%', marginBottom: '1.25rem', boxShadow: '0 8px 20px rgba(22, 163, 74, 0.2)' }}>
                <Compass size={40} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '2.0rem', margin: '0 0 0.75rem 0', color: '#166534', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>Excellent!</h2>
              <p style={{ fontSize: '0.98rem', color: '#3D2E24', lineHeight: 1.5, marginBottom: '1.75rem', fontWeight: 600 }}>
                You explored an Atlas and discovered three different kinds of maps. Now you're ready to learn how maps work.
              </p>
              <div style={{ background: '#FFFFFF', padding: '0.7rem 1.3rem', borderRadius: '12px', border: '1.5px solid #F2DFBC', display: 'inline-block', fontWeight: '800', color: '#92400E', fontSize: '0.98rem' }}>
                🏆 Atlas Explorer Badge
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      <ChapterBackFooter
        onBack={onBack}
        nextLabel={!isOpen ? "Open Atlas" : "Next Activity"}
        onNext={!isOpen ? () => setIsOpen(true) : onNextActivity}
        nextDisabled={false}
        nextVariant="orange"
      />
    </div>
    </div>
  );
}
