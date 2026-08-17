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
        <BigQuestionsPage 
          onBack={() => setCurrentPage(1)}
          onBeginChapter={onNextActivity} 
          onMissionUnlock={() => {}} 
        />
      )}
    </div>
  );
}
