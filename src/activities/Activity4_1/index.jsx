import React, { useState } from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import ClassroomScene from './ClassroomScene';
import MagneticTest from './MagneticTest';
import Quiz from './Quiz';
import DidYouKnow from './DidYouKnow';

export default function Activity4_1({ onBackToDashboard, onComplete, onNext }) {
  const [stage, setStage] = useState('classroom'); // 'classroom', 'test', 'quiz'
  const [collectedObjects, setCollectedObjects] = useState([]);

  const handleClassroomComplete = (objects) => {
    setCollectedObjects(objects);
    setStage('test');
  };

  const handleTestComplete = () => {
    setStage('quiz');
  };

  if (stage === 'quiz') {
    return <Quiz onComplete={onComplete} onBack={() => setStage('test')} />;
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onBackToDashboard} 
            className="outline" 
            style={{ 
              padding: '0.4rem 0.8rem', 
              fontSize: '0.8rem', 
              gap: '0.35rem',
              borderColor: 'var(--border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Chapters
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} style={{ color: 'var(--accent)' }} />
              Activity 4.1: Magnetic and Non-Magnetic Materials
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Class 6 Science: Chapter 4 — Find and test materials</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          {stage === 'classroom' && (
            <ClassroomScene onComplete={handleClassroomComplete} />
          )}
          
          {stage === 'test' && (
            <MagneticTest objects={collectedObjects} onComplete={handleTestComplete} />
          )}
        </main>

        <aside style={{ width: '300px', flexShrink: 0 }}>
          <DidYouKnow />
        </aside>
      </div>
    </div>
  );
}
