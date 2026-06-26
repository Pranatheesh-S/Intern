import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Zap,
  FlaskConical,
  Dna,
  ArrowLeft,
  Compass,
  Play,
  ArrowRight,
  Home,
  Sun,
  Moon,
  Hammer
} from 'lucide-react';
import { useTheme } from './ThemeContext.jsx';
import ElectricSwitchActivity from './activities/ElectricSwitch';
import ElectricCircuitActivity from './activities/ElectricCircuit';
import ActivityTemplate from './activities/ActivityTemplate';
import SphericalMirrorsActivity from './activities/SphericalMirrors';
import FoodTestingActivity from './activities/FoodTesting';
import FatTestingActivity from './activities/FatTesting';
import ProteinTestingActivity from './activities/ProteinTesting';
import MaterialsPropertiesActivity from './activities/MaterialsProperties';
import MagneticPolesActivity from './activities/MagneticPoles';
import SuspendedMagnetActivity from './activities/SuspendedMagnet';
import MagneticCompassActivity from './activities/MagneticCompass';
import MagnetInteractionActivity from './activities/MagnetInteraction';
import LinearMotionActivity from './activities/LinearMotion';
import CircularMotionActivity from './activities/CircularMotion';
import './App.css';

export default function App() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [activeSubject, setActiveSubject] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('subject') || null;
  });
  const [activeActivity, setActiveActivity] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('activity') || null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const params = new URLSearchParams(window.location.hash.replace('#', '?'));
      setActiveSubject(params.get('subject') || null);
      setActiveActivity(params.get('activity') || null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (subject, activity) => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (activity) params.set('activity', activity);
    window.location.hash = params.toString();
  };

  const handleBackToSubjects = () => {
    navigateTo(null, null);
  };

  const handleBackToLabs = () => {
    navigateTo(activeSubject, null);
  };

  // Renders the main subject selector dashboard
  const renderSubjectSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid #4f46e5' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={18} style={{ color: 'var(--accent-text)' }} /> Welcome to the Interactive Science Laboratory
        </h3>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Choose a subject wing to explore. Each subject contains curriculum-aligned virtual experiments designed for active learning, interactive testing, and concept checkouts.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Subject Card 1: Class 6th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            2 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore introductory science concepts with interactive experiments designed specifically for 6th-grade students.
          </p>

          <button
            onClick={() => navigateTo('class6', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 6th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 2: Class 7th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--accent-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            3 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={22} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 7th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Dive into advanced interactive experiments including electricity, spherical mirrors, and more curriculum-aligned labs.
          </p>

          <button
            onClick={() => navigateTo('class7', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 7th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 3: Class 8th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            0 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Dna size={22} style={{ color: 'var(--success)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 8th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore food webs and ecosystems, dissect cell organelles under a virtual microscope, and model human respiratory systems.
          </p>

          <button
            onClick={() => navigateTo('class8', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 8th <ArrowRight size={14} />
          </button>
        </div>

        {/* Subject Card 4: Class 9th */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            0 CHAPTERS ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={22} style={{ color: '#db2777' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 9th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore high school science fundamentals with complex virtual labs and conceptual checkouts.
          </p>

          <button
            onClick={() => navigateTo('class9', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 9th <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const CLASS_6_CHAPTERS = [
    { num: 1, title: "The Wonderful World of Science" },
    { num: 2, title: "Diversity in the Living World" },
    { num: 3, title: "Mindful Eating: A Path to a Healthy Body" },
    { num: 4, title: "Exploring Magnets" },
    { num: 5, title: "Measurement of Length and Motion" },
    { num: 6, title: "Materials Around Us" },
    { num: 7, title: "Temperature and its Measurement" },
    { num: 8, title: "A Journey through States of Water" },
    { num: 9, title: "Methods of Separation in Everyday Life" },
    { num: 10, title: "Living Creatures: Exploring their Characteristics" },
    { num: 11, title: "Nature's Treasures" },
    { num: 12, title: "Beyond Earth" }
  ];

  // Renders Class 6th Activities List
  const renderClass6Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Subjects
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 6</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_CHAPTERS.map(chapter => {
            if (chapter.num === 3 || chapter.num === 4 || chapter.num === 5) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    {chapter.num === 3 
                      ? "Includes Activity 3.5: Testing for Starch." 
                      : chapter.num === 4 
                        ? "Includes Activity 4.1: Appearance, hardness, and effect of hammering on different materials."
                        : "Includes Activity 5.3: Linear Motion and observation of moving objects."}
                  </p>

                  <button 
                    onClick={() => navigateTo('class6', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive science concepts, virtual experiments, and quizzes for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClass6Chapter3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 3 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Starch. Learn how to identify starch in food items using dilute iodine solution.
          </p>

          <button
            onClick={() => navigateTo('class6', 'food_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 3.6 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Fats. Learn how to identify fats using the paper press test.
          </p>

          <button
            onClick={() => navigateTo('class6', 'fat_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 3.7 Card */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Testing for Proteins. Use the Biuret test to discover which foods contain protein.
          </p>

          <button
            onClick={() => navigateTo('class6', 'protein_testing')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>

        {/* Activity 4.2 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Magnetic Poles. Investigate where iron filings stick to a magnet and what happens when a magnet is broken.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnetic_poles')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.3 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            A Freely Suspended Magnet. Spin a magnet and observe which direction it always points when it comes to rest.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'suspended_magnet')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.4 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Make a Simple Magnetic Compass. Learn how to magnetize an iron needle and use it to find directions by floating it on water.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnetic_compass')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.5 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Hammer size={20} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Interaction Between Two Bar Magnets. Build the setup, predict outcomes, and explore attraction and repulsion in a sandbox.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'magnet_interaction')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass6Chapter5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => navigateTo('class6', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 6 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 5 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Linear Motion. Predict and observe which objects move in a straight line when pushed or rolled.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'linear_motion')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 5.4 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={20} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Circular Motion. Whirl an object on a thread and observe its circular path compared to a merry-go-round.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'circular_motion')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass7Chapter3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 3 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

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
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#f59e0b' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Electric Switch</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 3 (Activities 3.8 & 3.9). Learn how to build a switch, predict electrical flows, and test materials like wood, plastic, or metals.
          </p>

          <button
            onClick={() => navigateTo('class7', 'electric_switch')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Switch Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 2: Electric Circuit */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#3b82f6' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Connecting a cell to a lamp. Predict and test whether different wire arrangements will make a lamp glow.
          </p>

          <button
            onClick={() => navigateTo('class7', 'electric_circuit')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass7Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 4 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 4.1 Card */}
        <div 
          className="glass-panel" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Properties of Materials. Test the appearance, hardness, and hammering effect on various materials.
          </p>

          <button 
            onClick={() => navigateTo('class7', 'materials_properties')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass7Chapter11 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class7', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 7 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 11 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity Card 2: Spherical Mirrors */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            border: '1px solid var(--success-border)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <BookOpen size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Spherical Mirrors</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 11. Explore Image Formation using Concave and Convex Surfaces. Interactive virtual experiments and concept checks.
          </p>

          <button
            onClick={() => navigateTo('class7', 'spherical_mirrors')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Mirrors Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const CLASS_7_CHAPTERS = [
    { num: 1, title: "The Ever-Evolving World of Science" },
    { num: 2, title: "Exploring Substances: Acidic, Basic, and Neutral" },
    { num: 3, title: "Electricity: Circuits and their Components" },
    { num: 4, title: "The World of Metals and Non-metals" },
    { num: 5, title: "Changes Around Us: Physical and Chemical" },
    { num: 6, title: "Adolescence: A Stage of Growth and Change" },
    { num: 7, title: "Heat Transfer in Nature" },
    { num: 8, title: "Measurement of Time and Motion" },
    { num: 9, title: "Life Processes in Animals" },
    { num: 10, title: "Life Processes in Plants" },
    { num: 11, title: "Light: Shadows and Reflections" },
    { num: 12, title: "Earth, Moon, and the Sun" }
  ];

  // Renders Class 7th Activities List
  const renderClass7Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={handleBackToSubjects}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Subjects
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 7th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 7</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_7_CHAPTERS.map(chapter => {
            if (chapter.num === 3 || chapter.num === 4 || chapter.num === 11) {
              return (
                <div
                  key={chapter.num}
                  className="glass-panel"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--accent-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Chapter
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <BookOpen size={20} style={{ color: 'var(--accent-text)', marginTop: '0.25rem' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--accent-text)', fontWeight: '500' }}>{chapter.title}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                    {chapter.num === 3
                      ? "Includes Electric Switch. Learn about electrical flows and test materials."
                      : chapter.num === 4
                      ? "Includes Properties of Materials. Test the appearance, hardness, and hammering effect on various materials."
                      : "Includes Spherical Mirrors. Explore Image Formation using Concave and Convex Surfaces."}
                  </p>

                  <button 
                    onClick={() => navigateTo('class7', `chapter${chapter.num}`)}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={chapter.num}
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--warning-bg)', color: 'var(--warning)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Coming Soon
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: '#818cf8', marginTop: '0.25rem' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Chapter {chapter.num}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{chapter.title}</p>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
                  Interactive science concepts, virtual experiments, and quizzes for this chapter.
                </p>

                <button
                  disabled
                  className="outline"
                  style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem', opacity: 0.5, cursor: 'not-allowed' }}
                >
                  Module Locked
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renders Under Construction screen for Chemistry or Biology
  const renderUnderConstruction = (subjectName, IconComponent, colorHex) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Subjects
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{subjectName} Wing</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modules and Experiments</span>
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
        border: '1px dashed var(--border)'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'var(--neutral-bg)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colorHex
        }}>
          <IconComponent size={32} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.25rem 0' }}>{subjectName} Lab Under Construction</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-faint)', maxWidth: '420px', lineHeight: '1.5' }}>
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
              <BookOpen style={{ color: 'var(--accent)' }} size={24} />
              <h1 style={{ fontSize: '1.75rem' }}>Interactive Science Labs</h1>
            </div>
            <p className="header-subtitle">
              Active-learning simulations and concepts reviews for middle school science
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Theme Toggle */}
            <button 
              className="outline" 
              onClick={toggleTheme}
              style={{ 
                padding: '0.4rem 0.8rem', 
                fontSize: '0.85rem', 
                gap: '0.5rem', 
                borderRadius: '8px',
                borderColor: 'var(--border)'
              }}
            >
              {theme === 'dark' ? (
                <><Sun size={14} /> <span>Light Theme</span></>
              ) : (
                <><Moon size={14} /> <span>Dark Theme</span></>
              )}
            </button>
          </div>
          {activeSubject && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={handleBackToSubjects}
                title="Go back to Dashboard"
              >
                <Home size={14} />
                <span style={{ cursor: 'pointer' }}>Dashboard</span>
              </div>
              <ArrowRight size={10} />
              <span
                style={{ color: 'var(--text-secondary)', textTransform: 'capitalize', cursor: activeActivity ? 'pointer' : 'default' }}
                onClick={() => activeActivity && handleBackToLabs()}
                title={activeActivity ? "Go back to class" : ""}
              >
                {activeSubject === 'class6' ? 'Class 6th' :
                  activeSubject === 'class7' ? 'Class 7th' :
                    activeSubject === 'class8' ? 'Class 8th' : 'Class 9th'}
              </span>
              {activeActivity && (
                <>
                  <ArrowRight size={10} />
                  <span style={{ color: 'var(--accent-text)' }}>
                    {activeActivity === 'electric_switch' ? 'Electric Switch' : 
                     activeActivity === 'spherical_mirrors' ? 'Spherical Mirrors' : 
                     activeActivity === 'food_testing' ? 'Food Testing' :
                     activeActivity === 'fat_testing' ? 'Fat Testing' :
                     activeActivity === 'protein_testing' ? 'Protein Testing' :
                     activeActivity === 'materials_properties' ? 'Properties of Materials' :
                     activeActivity === 'magnetic_poles' ? 'Magnetic Poles' :
                     activeActivity === 'suspended_magnet' ? 'Suspended Magnet' :
                     activeActivity === 'magnetic_compass' ? 'Make a Compass' :
                     activeActivity === 'magnet_interaction' ? 'Magnet Interaction' :
                     activeActivity === 'linear_motion' ? 'Linear Motion' :
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
        ) : activeSubject === 'class7' ? (
          activeActivity === 'electric_switch' ? (
            <ElectricSwitchActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'electric_circuit' ? (
            <ElectricCircuitActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'spherical_mirrors' ? (
            <SphericalMirrorsActivity onBackToDashboard={() => navigateTo('class7', 'chapter11')} />
          ) : activeActivity === 'materials_properties' ? (
            <MaterialsPropertiesActivity onBackToDashboard={() => navigateTo('class7', 'chapter4')} />
          ) : activeActivity === 'boilerplate' ? (
            <ActivityTemplate onBackToDashboard={() => navigateTo('class7', null)} />
          ) : activeActivity === 'chapter3' ? (
            renderClass7Chapter3()
          ) : activeActivity === 'chapter4' ? (
            renderClass7Chapter4()
          ) : activeActivity === 'chapter11' ? (
            renderClass7Chapter11()
          ) : (
            renderClass7Wing()
          )
        ) : activeSubject === 'class6' ? (
          activeActivity === 'food_testing' ? (
            <FoodTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'fat_testing' ? (
            <FatTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'protein_testing' ? (
            <ProteinTestingActivity onBackToDashboard={() => navigateTo('class6', 'chapter3')} />
          ) : activeActivity === 'magnetic_poles' ? (
            <MagneticPolesActivity onBackToDashboard={() => navigateTo('class6', 'chapter4')} />
          ) : activeActivity === 'suspended_magnet' ? (
            <SuspendedMagnetActivity onBackToDashboard={() => navigateTo('class6', 'chapter4')} />
          ) : activeActivity === 'magnetic_compass' ? (
            <MagneticCompassActivity onBackToDashboard={() => navigateTo('class6', 'chapter4')} />
          ) : activeActivity === 'magnet_interaction' ? (
            <MagnetInteractionActivity onBackToDashboard={() => navigateTo('class6', 'chapter4')} />
          ) : activeActivity === 'linear_motion' ? (
            <LinearMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5')} />
          ) : activeActivity === 'circular_motion' ? (
            <CircularMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5')} />
          ) : activeActivity === 'chapter3' ? (
            renderClass6Chapter3()
          ) : activeActivity === 'chapter4' ? (
            renderClass6Chapter4()
          ) : activeActivity === 'chapter5' ? (
            renderClass6Chapter5()
          ) : (
            renderClass6Wing()
          )
        ) : activeSubject === 'class8' ? (
          renderUnderConstruction('Class 8th', Dna, '#10b981')
        ) : activeSubject === 'class9' ? (
          renderUnderConstruction('Class 9th', Zap, '#ec4899')
        ) : null}
      </main>
    </div>
  );
}
