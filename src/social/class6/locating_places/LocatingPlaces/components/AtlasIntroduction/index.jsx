import React, { useState } from 'react';
import { Compass, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
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
        background: 'var(--bg-primary)', 
        overflow: 'hidden', 
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)'
      }}>
      
      {/* Top Bar for Back Button */}
      {isOpen && (
        <div style={{ padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)', zIndex: 20 }}>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
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
        padding: '2.5rem', 
        borderRight: '1px solid var(--border)', 
        background: 'linear-gradient(160deg, #F7F1E2, #EFE6D2)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        boxShadow: '4px 0 20px rgba(0,0,0,0.05)',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: 'var(--accent-bg)', color: 'var(--accent-text)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'flex-start', marginBottom: '1.5rem' }}>
          Understanding Maps
        </div>

        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-heading)', margin: '0 0 1.5rem 0', lineHeight: 1.1 }}>
          Atlas : A Collection of Maps
        </h1>

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.75rem 0' }}>An Atlas is a special book that contains many different kinds of maps.</p>
          <p style={{ margin: 0 }}>Open the Atlas and discover how each map helps us understand the world.</p>
        </div>

        <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: 'auto' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} /> Mission
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={isOpen ? "#10b981" : "var(--text-muted)"} />
              <div style={{ fontSize: '1.05rem', color: isOpen ? 'var(--text-heading)' : 'var(--text-muted)', fontWeight: isOpen ? 'bold' : 'normal' }}>Explore the Atlas</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={currentPage === 3 ? "#10b981" : "var(--text-muted)"} />
              <div style={{ fontSize: '1.05rem', color: currentPage === 3 ? 'var(--text-heading)' : 'var(--text-muted)', fontWeight: currentPage === 3 ? 'bold' : 'normal' }}>Discover 3 Types of Maps</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <CheckCircle2 size={20} color={isCompleted ? "#10b981" : "var(--text-muted)"} />
              <div style={{ fontSize: '1.05rem', color: isCompleted ? 'var(--text-heading)' : 'var(--text-muted)', fontWeight: isCompleted ? 'bold' : 'normal' }}>Complete the Journey</div>
            </div>
          </div>
        </div>

        <div style={{ height: '60px', marginTop: '1.5rem', display: 'flex', alignItems: 'center' }}>
          {!isOpen && (
            <button 
              className="primary" 
              onClick={() => setIsOpen(true)}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '12px', transition: 'transform 0.2s', cursor: 'pointer' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Open Atlas
            </button>
          )}
        </div>
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
              background: 'var(--card-bg)', padding: '3rem', borderRadius: '24px',
              maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'inline-flex', padding: '1.5rem', background: '#ecfdf5', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>
                <Compass size={48} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'var(--text-heading)' }}>Excellent!</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                You explored an Atlas and discovered three different kinds of maps. Now you're ready to learn how maps work.
              </p>
              <div style={{ background: 'var(--bg-primary)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'inline-block', fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.1rem' }}>
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
