import React, { useState } from 'react';
import AryabhataPage from './AryabhataPage';
import BigQuestionsPage from './BigQuestionsPage';

export default function ChapterIntroduction({ onNextActivity }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div style={{
      width: '100%',
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface, #ffffff)',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
    }}>
      {currentPage === 1 && (
        <AryabhataPage 
          onNext={() => setCurrentPage(2)} 
          isNextEnabled={true} 
        />
      )}
      {currentPage === 2 && (
        <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>
          <button 
            onClick={() => setCurrentPage(1)} 
            style={{ 
              position: 'absolute', 
              top: '16px', 
              left: '16px', 
              background: '#fff', 
              border: '1px solid #e2e8f0', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              cursor: 'pointer', 
              fontWeight: 600, 
              color: '#334155', 
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg> Back
          </button>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <BigQuestionsPage 
              onBeginChapter={onNextActivity} 
              onMissionUnlock={() => {}} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
