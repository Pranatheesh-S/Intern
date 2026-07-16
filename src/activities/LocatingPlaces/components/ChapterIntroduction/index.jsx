import React, { useState } from 'react';
import IntroBook from './IntroBook';

export default function ChapterIntroduction({ onNextActivity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBeginChapter = () => {
    // Move immediately to the next tab without the closing animation
    onNextActivity();
  };

  const handleNext = () => {
    if (currentPage < 2) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '700px',
      height: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--surface-secondary)',
      borderRadius: '24px',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.05, filter: 'blur(40px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--accent)', opacity: 0.05, filter: 'blur(60px)' }}></div>

      <IntroBook 
        isOpen={isOpen} 
        currentPage={currentPage}
        onNext={handleNext}
        onPrev={handlePrev}
        onBeginChapter={handleBeginChapter}
        onOpenBook={() => setIsOpen(true)}
      />
    </div>
  );
}
