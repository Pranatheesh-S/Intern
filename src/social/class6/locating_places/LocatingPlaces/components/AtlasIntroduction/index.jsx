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
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', background: 'transparent', border: 'none', color: '#92400E', fontSize: '14px', fontWeight: '800', cursor: 'pointer', transition: 'color 0.2s', fontFamily: '"Space Grotesk", sans-serif' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#78350F'}
            onMouseOut={(e) => e.currentTarget.style.color = '#92400E'}
          >
            <ArrowLeft size={18} color="#92400E" /> Back to Cover
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
        justifyContent: 'space-between',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(60,40,20,0.04)',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <div>
        <div style={{ display: 'inline-flex', padding: '0.35rem 0.9rem', background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
          Understanding Maps
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 2vw, 2rem)', color: '#78350F', margin: '0 0 0.85rem 0', lineHeight: 1.15, fontFamily: '"Fraunces", serif', fontWeight: 900 }}>
          Atlas : A Collection of Maps
        </h1>

        <div style={{ fontSize: 'clamp(0.92rem, 1vw, 1rem)', lineHeight: 1.5, marginBottom: '1rem', color: '#3D2E24' }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#3D2E24', fontWeight: 600, fontSize: 'inherit', lineHeight: 'inherit' }}>
            An Atlas is a special book that contains many different kinds of maps.
          </p>
          <p style={{ margin: 0, color: '#3D2E24', fontWeight: 600, fontSize: 'inherit', lineHeight: 'inherit' }}>
            Open the Atlas and discover how each map helps us understand the world.
          </p>
        </div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.15rem', borderRadius: '14px', border: '1.5px solid #F2DFBC', boxShadow: '0 4px 12px rgba(60,40,20,0.04)' }}>
          <h3 style={{ margin: '0 0 0.65rem 0', color: '#92400E', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900 }}>
            <Compass size={17} color="#D97706" /> Mission
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color={isOpen ? "#16a34a" : "#B45309"} />
              <div style={{ fontSize: '13.5px', color: '#3D2E24', fontWeight: 700 }}>Explore the Atlas</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color={currentPage === 3 ? "#16a34a" : "#B45309"} />
              <div style={{ fontSize: '13.5px', color: '#3D2E24', fontWeight: 700 }}>Discover 3 Types of Maps</div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={18} color={isCompleted ? "#16a34a" : "#B45309"} />
              <div style={{ fontSize: '13.5px', color: '#3D2E24', fontWeight: 700 }}>Complete the Journey</div>
            </div>
          </div>
        </div>

        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            style={{ width: '100%', padding: '0.85rem', fontSize: '14px', borderRadius: '12px', background: '#16A34A', color: '#FFFFFF', border: 'none', fontWeight: 800, transition: 'transform 0.2s', cursor: 'pointer', marginTop: '0.85rem', boxShadow: '0 4px 14px rgba(22,163,74,0.35)', fontFamily: '"Space Grotesk", sans-serif' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Atlas
          </button>
        )}
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
                <Compass size={42} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '2.2rem', margin: '0 0 0.75rem 0', color: '#166534', fontFamily: '"Fraunces", serif', fontWeight: 900 }}>Excellent!</h2>
              <p style={{ fontSize: '1.05rem', color: '#3D2E24', lineHeight: 1.5, marginBottom: '1.75rem', fontWeight: 600 }}>
                You explored an Atlas and discovered three different kinds of maps. Now you're ready to learn how maps work.
              </p>
              <div style={{ background: '#FFFFFF', padding: '0.75rem 1.4rem', borderRadius: '12px', border: '1.5px solid #F2DFBC', display: 'inline-block', fontWeight: '800', color: '#92400E', fontSize: '1.05rem' }}>
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
