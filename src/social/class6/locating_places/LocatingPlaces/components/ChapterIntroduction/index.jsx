import React, { useState } from 'react';
import AryabhataPage from './AryabhataPage';
import BigQuestionsPage from './BigQuestionsPage';

export default function ChapterIntroduction({ onNextActivity }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="edu-slide-surface" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
