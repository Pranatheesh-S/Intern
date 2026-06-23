import React, { useState } from 'react';
import { 
  BookOpen, 
  Zap, 
  FlaskConical, 
  Dna, 
  ArrowLeft, 
  Compass, 
  Play, 
  ArrowRight,
  Home
} from 'lucide-react';
import ElectricSwitchActivity from './activities/ElectricSwitch';
import ActivityTemplate from './activities/ActivityTemplate';
import SphericalMirrorsActivity from './activities/SphericalMirrors';
import './App.css';

export default function App() {
  const [activeSubject, setActiveSubject] = useState(null); // null | 'physics' | 'chemistry' | 'biology'
  const [activeActivity, setActiveActivity] = useState(null); // null | 'electric_switch' | 'boilerplate' | 'spherical_mirrors'

  const handleBackToSubjects = () => {
    setActiveSubject(null);
    setActiveActivity(null);
  };

  const handleBackToLabs = () => {
    setActiveActivity(null);
  };

  // Renders the main subject selector dashboard
  const renderSubjectSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #6366f1' }}>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={18} style={{ color: '#818cf8' }} /> Welcome to the Interactive Science Laboratory
        </h3>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
          Choose a subject wing to explore. Each subject contains curriculum-aligned virtual experiments designed for active learning, interactive testing, and concept checkouts.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Subject Card 1: Physics */}
        <div 
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            3 LABS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={22} style={{ color: '#fbbf24' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Physics Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore electricity, simple switch circuits, conductors and insulators, and electromagnetism through step-by-step assembly and parameter sandboxing.
          </p>

          <button 
            onClick={() => setActiveSubject('physics')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Physics Wing <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 2: Chemistry */}
        <div 
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            COMING SOON
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={22} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Chemistry Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Practice acid-base titration, balance chemical equations, and inspect periodic properties within virtual chemical test tubes safely.
          </p>

          <button 
            onClick={() => setActiveSubject('chemistry')}
            className="outline" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Chemistry Wing <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 3: Biology */}
        <div 
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            COMING SOON
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Dna size={22} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Biology Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore food webs and ecosystems, dissect cell organelles under a virtual microscope, and model human respiratory systems.
          </p>

          <button 
            onClick={() => setActiveSubject('biology')}
            className="outline" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Biology Wing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Physics Activities List
  const renderPhysicsWing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Subheader Wing Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
        <button 
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={14} /> Back to Subjects
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Physics Wing</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Interactive Physics Demonstrations & Labs</span>
        </div>
      </div>

      {/* Physics Activities Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity Card 1: Electric Switch */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Electric Switch</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 6 Chapter 3 (Activities 3.8 & 3.9). Learn how to build a switch, predict electrical flows, and test materials like wood, plastic, or metals.
          </p>

          <button 
            onClick={() => setActiveActivity('electric_switch')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Switch Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 2: Spherical Mirrors */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <BookOpen size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Spherical Mirrors</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 15. Explore Image Formation using Concave and Convex Surfaces. Interactive virtual experiments and concept checks.
          </p>

          <button 
            onClick={() => setActiveActivity('spherical_mirrors')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Mirrors Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 3: Boilerplate Template */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Boilerplate
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <BookOpen size={20} style={{ color: '#818cf8' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Activity Template</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: '1.5', flex: 1 }}>
            A ready-to-copy code blueprint designed with the exact same structure and styling. Duplicate this folder to build new science activities.
          </p>

          <button 
            onClick={() => setActiveActivity('boilerplate')}
            className="outline" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            View Template Demo <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Under Construction screen for Chemistry or Biology
  const renderUnderConstruction = (subjectName, IconComponent, colorHex) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>
        <button 
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft size={14} /> Back to Subjects
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>{subjectName} Wing</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Modules and Experiments</span>
        </div>
      </div>

      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 2rem',
        gap: '1rem',
        border: '1px dashed rgba(255,255,255,0.08)'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colorHex
        }}>
          <IconComponent size={32} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: '#ffffff' }}>{subjectName} Lab Under Construction</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', maxWidth: '420px', lineHeight: '1.5' }}>
            We are designing beautiful, interactive molecular and genetic experiments for the {subjectName} curriculum. Check back soon!
          </p>
        </div>
        <button 
          onClick={handleBackToSubjects} 
          className="outline" 
          style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', marginTop: '0.5rem' }}
        >
          Return to Subjects
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Page Title Header */}
      <header className="header" style={{ marginBottom: activeSubject ? '1.5rem' : '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="header-title">
              <BookOpen style={{ color: '#6366f1' }} size={24} />
              <h1 style={{ fontSize: '1.75rem' }}>Interactive Science Labs</h1>
            </div>
            <p className="header-subtitle">
              Active-learning simulations and concepts reviews for middle school science
            </p>
          </div>
          {activeSubject && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
              <Home size={14} />
              <span>Dashboard</span>
              <ArrowRight size={10} />
              <span style={{ color: '#cbd5e1', textTransform: 'capitalize' }}>{activeSubject}</span>
              {activeActivity && (
                <>
                  <ArrowRight size={10} />
                  <span style={{ color: '#818cf8' }}>
                    {activeActivity === 'electric_switch' ? 'Electric Switch' : 
                     activeActivity === 'spherical_mirrors' ? 'Spherical Mirrors' : 
                     'Template Demo'}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace content */}
      <main style={{ minHeight: '520px', marginBottom: '2rem' }}>
        {/* HIERARCHICAL ROUTER */}
        {activeSubject === null ? (
          renderSubjectSelector()
        ) : activeSubject === 'physics' ? (
          activeActivity === 'electric_switch' ? (
            <ElectricSwitchActivity onBackToDashboard={handleBackToLabs} />
          ) : activeActivity === 'spherical_mirrors' ? (
            <SphericalMirrorsActivity onBackToDashboard={handleBackToLabs} />
          ) : activeActivity === 'boilerplate' ? (
            <ActivityTemplate onBackToDashboard={handleBackToLabs} />
          ) : (
            renderPhysicsWing()
          )
        ) : activeSubject === 'chemistry' ? (
          renderUnderConstruction('Chemistry', FlaskConical, '#06b6d4')
        ) : activeSubject === 'biology' ? (
          renderUnderConstruction('Biology', Dna, '#10b981')
        ) : null}
      </main>
    </div>
  );
}
