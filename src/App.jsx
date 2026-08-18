import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
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
  Hammer,
  Battery,
  Flame,
  Search,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import natureForestSound from './assets/nature_forest_sound.mp3';
import { useTheme } from './ThemeContext.jsx';
import VerticalLevelMap from './components/VerticalLevelMap';
const ElectricSwitchActivity = lazy(() => import('./science/class7/chapter3/ElectricSwitch'));
const ElectricCircuitActivity = lazy(() => import('./science/class7/chapter3/ElectricCircuit'));
const ActivityTemplate = lazy(() => import('./activities/ActivityTemplate'));
const GeographyExpeditionActivity = lazy(() => import('./social/class7/chapter1/Class7Geography'));
const SphericalMirrorsActivity = lazy(() => import('./science/class7/chapter11/SphericalMirrors'));
const FoodTestingActivity = lazy(() => import('./science/class6/chapter3/FoodTesting'));
const FatTestingActivity = lazy(() => import('./science/class6/chapter3/FatTesting'));
const ProteinTestingActivity = lazy(() => import('./science/class6/chapter3/ProteinTesting'));
const MaterialsPropertiesActivity = lazy(() => import('./science/class7/chapter4/MaterialsProperties'));
const MagneticPolesActivity = lazy(() => import('./science/class6/chapter4/MagneticPoles'));
const SuspendedMagnetActivity = lazy(() => import('./science/class6/chapter4/SuspendedMagnet'));
const MagneticCompassActivity = lazy(() => import('./science/class6/chapter4/MagneticCompass'));
const MagnetInteractionActivity = lazy(() => import('./science/class6/chapter4/MagnetInteraction'));
const LinearMotionActivity = lazy(() => import('./science/class6/chapter5/LinearMotion'));
const CircularMotionActivity = lazy(() => import('./science/class6/chapter5/CircularMotion'));
const HeatingEffectActivity = lazy(() => import('./science/class8/chapter4/HeatingEffectOfCurrent'));
const LemonBatteryLabActivity = lazy(() => import('./science/class8/chapter4/LemonBatteryLab'));
const TorchExplorerActivity = lazy(() => import('./science/class7/chapter3/TorchExplorer'));
const LampExplorerActivity = lazy(() => import('./science/class7/chapter3/LampExplorer'));
const Activity3_7 = lazy(() => import('./science/class7/chapter3/Activity3_7'));
const Activity3_11 = lazy(() => import('./science/class7/chapter3/Activity3_11'));
const MagneticEffectOfCurrentActivity = lazy(() => import('./science/class8/chapter4/MagneticEffectOfCurrent'));
const ElectromagnetInvestigationActivity = lazy(() => import('./science/class8/chapter4/ElectromagnetInvestigation'));
const GrassrootsDemocracyActivity = lazy(() => import('./social/class6/chapter11/GrassrootsDemocracy'));
const LocatingPlacesActivity = lazy(() => import('./social/class6/locating_places/LocatingPlaces'));
const Activity9_1 = lazy(() => import('./science/class8/chapter9/SolutesAndSolvents'));
const LineSegmentLabActivity = lazy(() => import('./maths/class6/chapter4/LineSegmentLab'));
const ParallelIntersectingLabActivity = lazy(() => import('./maths/class6/chapter4/ParallelIntersectingLab'));
const CurvesRegionsLabActivity = lazy(() => import('./maths/class6/chapter4/CurvesRegionsLab'));
const AnglesLabActivity = lazy(() => import('./maths/class6/chapter4/AnglesLab'));
const PolygonsLabActivity = lazy(() => import('./maths/class6/chapter4/PolygonsLab'));
const CirclesLabActivity = lazy(() => import('./maths/class6/chapter4/CirclesLab'));
const VirtualBiodiversityExplorerActivity = lazy(() => import('./science/class6/chapter2/VirtualBiodiversityExplorer'));
const PlantDetectiveActivity = lazy(() => import('./science/class6/chapter2/PlantDetective'));
const AnimalHabitatExplorerActivity = lazy(() => import('./science/class6/chapter2/AnimalHabitatExplorer'));
const Activity9_2 = lazy(() => import('./science/class8/chapter9/SolubilityOfBakingSoda'));
const ForceExplorerActivity = lazy(() => import('./science/class8/chapter5/ForceExplorer'));
const MicroscopeDiscovery = lazy(() => import('./science/class6/chapter10/MicroscopeDiscovery'));
const MaterialDetectiveActivity = lazy(() => import('./science/class6/chapter6/MaterialDetective'));
const MaterialsAroundUsActivity = lazy(() => import('./science/class6/chapter6/MaterialsAroundUs'));
const MaterialsAroundUsNewActivity = lazy(() => import('./science/class6/chapter6/MaterialsAroundUsNew'));
const Activity4_1 = lazy(() => import('./science/class6/chapter4/Activity4_1'));
const Activity4_6 = lazy(() => import('./science/class6/chapter4/Activity4_6'));
const Activity4_7 = lazy(() => import('./science/class6/chapter4/Activity4_7'));
const FunWithMagnets = lazy(() => import('./science/class6/chapter4/FunWithMagnets'));
const Chapter4Flow = lazy(() => import('./science/class6/chapter4/Chapter4Flow'));
const Chapter5Flow = lazy(() => import('./science/class6/chapter5/Chapter5Flow'));
const Chapter4Quiz = lazy(() => import('./science/class6/chapter4/Chapter4Flow/Chapter4Quiz'));
const IntroMagnets = lazy(() => import('./science/class6/chapter4/IntroMagnets'));
const AppreciatingBiodiversityActivity = lazy(() => import('./science/class6/chapter2/AppreciatingBiodiversityActivity'));
const LeafVenationLab = lazy(() => import('./science/class6/chapter2/LeafVenationLab'));
const RootSystemsLab = lazy(() => import('./science/class6/chapter2/RootSystemsLab'));
const VenationRootCorrelationLab = lazy(() => import('./science/class6/chapter2/VenationRootCorrelationLab'));
const SeedDissectionLab = lazy(() => import('./science/class6/chapter2/SeedDissectionLab'));

import './App.css';
const Chapter2LearningLab = lazy(() => import('./science/class6/chapter2/Chapter2LearningLab'));
const Chapter3LearningLab = lazy(() => import('./science/class6/chapter3/Chapter3LearningLab'));
const Chapter10LearningLab = lazy(() => import('./science/class6/chapter10/Chapter10LearningLab'));
const Chapter11LearningLab = lazy(() => import('./science/class6/chapter11/Chapter11LearningLab'));
const MagneticDemoActivity = lazy(() => import('./science/class6/chapter13/MagneticDemo'));
const ExploringMagnetsLab = lazy(() => import('./science/class6/chapter13/ExploringMagnetsLab'));

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
  const [activeSection, setActiveSection] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('section') || null;
  });

  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    setHideHeader(false);
  }, [activeActivity]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.15; // Ambient background sound level
    if (activeActivity === 'chapter2' && isAudioPlaying) {
      audioRef.current.play().catch(err => {
        console.log("Audio autoplay blocked by browser, waiting for interaction", err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [activeActivity, isAudioPlaying]);


  useEffect(() => {
    const handleHashChange = () => {
      const params = new URLSearchParams(window.location.hash.replace('#', '?'));
      setActiveSubject(params.get('subject') || null);
      setActiveActivity(params.get('activity') || null);
      setActiveSection(params.get('section') || null);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Objective 2: Focus Mode (Content First Learning)
    // Automatically hide header and sidebars during immersive interactive labs
    const isOverview = !activeActivity || activeActivity.startsWith('chapter') || activeActivity === 'boilerplate';
    if (!isOverview) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }

    // Inactivity Timer for Focus Mode UI
    let timeout;
    const handleMouseMove = () => {
      // User is active, show the UI (if hovered)
      document.body.classList.remove('ui-inactive');
      clearTimeout(timeout);
      
      // If we are in an activity, start the 2.5s auto-hide countdown
      if (!isOverview) {
        timeout = setTimeout(() => {
          document.body.classList.add('ui-inactive');
        }, 2500);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [activeActivity]);

  useEffect(() => {
    let title = "FuturaX Interactive Labs";
    if (activeActivity) {
      const activityNames = {
        'electric_switch': 'Electric Switch Lab',
        'electric_circuit': 'Electric Circuit Lab',
        'lamp_explorer': 'Lamp Explorer Lab',
        'activity_3_7': 'Electric Components Lab',
        'activity_3_11': 'Conductivity Lab',
        'torch_explorer': 'Torch Explorer Lab',
        'spherical_mirrors': 'Spherical Mirrors Lab',
        'materials_properties': 'Properties of Materials Lab',
        'food_testing': 'Food Testing Lab',
        'fat_testing': 'Fat Testing Lab',
        'protein_testing': 'Protein Testing Lab',
        'magnetic_poles': 'Magnetic Poles Lab',
        'suspended_magnet': 'Suspended Magnet Lab',
        'magnetic_compass': 'Magnetic Compass Lab',
        'magnet_interaction': 'Magnet Interaction Lab',
        'activity_4_6': 'Compass and Bar Magnet Lab',
        'activity_4_7': 'Activity 4.7',
        'linear_motion': 'Linear Motion Lab',
        'circular_motion': 'Circular Motion Lab',
        'material_detective': 'Material Detective Lab',
        '5.1': 'Force Explorer Lab',
        '4.1': 'Magnetic Effect of Current Lab',
        'electromagnet_investigation': 'Electromagnet Investigation Lab',
        'heating_effect': 'Heating Effect Lab',
        'lemon_battery': 'Lemon Battery Lab',
        '9.1': 'Solutions Lab 1',
        '9.2': 'Solutions Lab 2',
        'chapter11': 'Grassroots Democracy Lab',
        'locating_places': 'Locating Places Lab',
        'chapter1': 'Geography Expedition Lab'
      };
      const name = activityNames[activeActivity] || 'Interactive Lab';
      title = `${name} | FuturaX`;
    } else if (activeSubject) {
      const subjectNames = {
        'science_lab': 'Interactive Science Lab',
        'social_lab': 'FuturaX Social Lab',
        'class6': 'Class 6th Science Wing',
        'class7': 'Class 7th Science Wing',
        'class8': 'Class 8th Science Wing',
        'class9': 'Class 9th Science Wing',
        'class6_social': 'Class 6th Social Wing',
        'class7_social': 'Class 7th Social Wing'
      };
      const name = subjectNames[activeSubject] || 'Interactive Lab';
      title = `${name} | FuturaX`;
    }
    document.title = title;
  }, [activeSubject, activeActivity]);

  const navigateTo = (subject, activity, section = null) => {
    const params = new URLSearchParams();
    if (subject) params.set('subject', subject);
    if (activity) {
      params.set('activity', activity);
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (section) params.set('section', section);
    window.location.hash = params.toString();
  };

  const handleBackToSubjects = () => {
    if (activeSubject === 'science_lab' || activeSubject === 'social_lab' || activeSubject === 'math_lab') {
      navigateTo(null, null);
    } else if (activeSubject && (activeSubject.endsWith('_social') || activeSubject.startsWith('class6_social') || activeSubject.startsWith('class7_social'))) {
      navigateTo('social_lab', null);
    } else if (activeSubject && activeSubject.endsWith('_maths')) {
      navigateTo('math_lab', null);
    } else if (activeSubject && activeSubject.startsWith('class')) {
      navigateTo('science_lab', null);
    } else {
      navigateTo(null, null);
    }
  };

  const handleBackToLabs = () => {
    navigateTo(activeSubject, null);
  };

  // Renders the main subject selector dashboard
  const renderSubjectSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Compass size={18} style={{ color: 'var(--accent-text)' }} /> Welcome to FuturaX Interactive Learning Labs
        </h3>
        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Explore curriculum-aligned active-learning simulations, virtual experiments, and conceptual checkouts across different departments.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Science Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #3b82f6', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FlaskConical size={32} style={{ color: '#3b82f6' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Science Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Physics, Chemistry, and Biology virtual labs spanning from basic concepts to advanced high school experiments.
          </p>
          <button onClick={() => navigateTo('science_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#3b82f6', borderColor: '#3b82f6' }}>
            Enter Science Wing <ArrowRight size={16} />
          </button>
        </div>

        {/* Mathematics Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #8b5cf6', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={32} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Mathematics Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Interactive geometry, coordinate mapping, algebraic visualizers, and mathematical problem-solving labs.
          </p>
          <button onClick={() => navigateTo('math_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#8b5cf6', borderColor: '#8b5cf6' }}>
            Enter Mathematics Wing <ArrowRight size={16} />
          </button>
        </div>

        {/* Social Sciences Department Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid #e11d48', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen size={32} style={{ color: '#e11d48' }} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-heading)' }}>Social Sciences Department</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore history, civics, and geography through interactive terrains, governance simulations, and more.
          </p>
          <button onClick={() => navigateTo('social_lab', null)} className="primary" style={{ width: '100%', gap: '0.5rem', justifyContent: 'center', fontSize: '0.9rem', padding: '0.75rem', background: '#e11d48', borderColor: '#e11d48' }}>
            Enter Social Sciences Wing <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Science Lab main dashboard
  const renderScienceLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Interactive Science Lab</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Science Subjects Interactively</span>
        </div>
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
            1 CHAPTER ACTIVE
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

  // Renders Math Lab main dashboard
  const renderMathLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Mathematics Department</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Mathematics Interactively</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Math Card 1: Class 6th */}
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
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px' }}>
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={22} style={{ color: '#8b5cf6' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore geometry and numbers through visual, interactive coordinate systems and measuring tools.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', null)}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 6th <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // Renders Social Lab main dashboard
  const renderSocialLabWings = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={handleBackToSubjects}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>FuturaX Social Lab</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore Social Sciences Interactively</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '0.5rem'
      }}>
        {/* Social Card 1: Class 6th */}
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
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--warning)' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 6th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore foundational social science concepts, government structures, and civic duties through interactive experiences designed for 6th-grade students.
          </p>

          <button
            onClick={() => navigateTo('class6_social', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Explore Class 6th <ArrowRight size={14} />
          </button>
        </div>

        {/* Social Card 2: Class 7th */}
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
            1 CHAPTER ACTIVE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <FlaskConical size={22} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-heading)' }}>Class 7th Wing</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Dive into advanced interactive social studies including history, geography, and political structures.
          </p>

          <button
            onClick={() => navigateTo('class7_social', null)}
            className="outline"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            Enter Class 7th <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );

  const CLASS_6_SOCIAL_CHAPTERS = [
    { num: 1, title: "Locating Places on the Earth" },
    { num: 2, title: "Diversity and Discrimination" },
    { num: 3, title: "What is Government?" },
    { num: 4, title: "Key Elements of a Democratic Government" },
    { num: 5, title: "Panchayati Raj" },
    { num: 6, title: "Rural Administration" },
    { num: 7, title: "Urban Administration" },
    { num: 8, title: "Rural Livelihoods" },
    { num: 9, title: "Urban Livelihoods" },
    { num: 10, title: "Exploring History" },
    { num: 11, title: "Grassroots Democracy" }
  ];

  const renderClass6SocialWing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('social_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Social Lab
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Wing (Social)</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 6 Social Science</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_SOCIAL_CHAPTERS.map(chapter => {
            if (chapter.num === 1) {
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
                    Introduce maps by experiencing what it's like to navigate without one. Learn how maps help locate places.
                  </p>

                  <button 
                    onClick={() => navigateTo('class6_social', 'locating_places')}
                    className="primary" 
                    style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                  >
                    Open Chapter <ArrowRight size={14} />
                  </button>
                </div>
              );
            }

            if (chapter.num === 11) {
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
                    Dive into Grassroots Democracy. Explore the Panchayati Raj system, local administration, and civic participation interactively.
                  </p>

                  <button 
                    onClick={() => navigateTo('class6_social', `chapter${chapter.num}`)}
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
                  Interactive social science concepts and virtual scenarios for this chapter.
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

  const CLASS_7_SOCIAL_CHAPTERS = [
    { num: 1, title: "Geography of India" },
    { num: 2, title: "Inside Our Earth" },
    { num: 3, title: "Our Changing Earth" },
    { num: 4, title: "Air" },
    { num: 5, title: "Water" },
    { num: 6, title: "Natural Vegetation and Wildlife" },
    { num: 7, title: "Human Environment - Settlement, Transport and Communication" },
    { num: 8, title: "Human Environment Interactions" },
    { num: 9, title: "Life in the Temperate Grasslands" },
    { num: 10, title: "Life in the Deserts" },
    { num: 11, title: "Tracing Changes Through a Thousand Years" },
    { num: 12, title: "New Kings and Kingdoms" }
  ];

  const renderClass7SocialWing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('social_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Social Lab
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 7th Wing (Social)</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 7 Social Science</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_7_SOCIAL_CHAPTERS.map(chapter => {
            if (chapter.num === 1) {
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
                    Explore the geography of India through an immersive expedition across its diverse landscapes and regions.
                  </p>

                  <button 
                    onClick={() => navigateTo('class7_social', `chapter${chapter.num}`)}
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
                  Interactive social science concepts and virtual scenarios for this chapter.
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
    { num: 12, title: "Beyond Earth" },
    { num: 13, title: "Exploring Magnets" }
  ];

  // Renders Class 6th Activities List
  const renderClass6Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('science_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Science Lab
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
            if (chapter.num === 2 || chapter.num === 3 || chapter.num === 4 || chapter.num === 5 || chapter.num === 6 || chapter.num === 10 || chapter.num === 11 || chapter.num === 13) {
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
                    {chapter.num === 2
                      ? "Virtual Biodiversity Explorer, Plant Detective, and Animal Habitat Explorer."
                      : chapter.num === 3 
                        ? "Includes Activity 3.5: Testing for Starch." 
                        : chapter.num === 4 
                          ? "Includes Activity 4.1: Appearance, hardness, and effect of hammering on different materials."
                          : chapter.num === 5
                            ? "Includes Activity 5.3: Linear Motion and observation of moving objects."
                            : chapter.num === 6
                              ? "Includes Activities 6.1, 6.2, and 6.3: Material Detective case study."
                              : chapter.num === 10
                                ? "Includes Activity 10.1: Living Creatures & life processes exploration."
                                : chapter.num === 13
                                  ? "Full interactive lab: magnetic materials, poles, compass, attraction & repulsion, and more."
                                  : "Includes Activity 11.1: Nature's treasures & resource conservation."}
                  </p>

                  {chapter.num === 6 ? (
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <button 
                        onClick={() => navigateTo('class6', 'materials_around_us')}
                        className="outline" 
                        style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                      >
                        Old <ArrowRight size={14} />
                      </button>
                      <button 
                        onClick={() => navigateTo('class6', 'materials_around_us_new')}
                        className="primary" 
                        style={{ flex: 1, gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                      >
                        New <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        if (chapter.num === 4) navigateTo('class6', 'chapter4_flow');
                        else if (chapter.num === 5) navigateTo('class6', 'chapter5_flow');
                        else navigateTo('class6', `chapter${chapter.num}`);
                      }}
                      className="primary" 
                      style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
                    >
                      Open Chapter <ArrowRight size={14} />
                    </button>
                  )}
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

  const CLASS_6_MATHS_CHAPTERS = [
    { num: 1, title: "Knowing our Numbers" },
    { num: 2, title: "Whole Numbers" },
    { num: 3, title: "Playing with Numbers" },
    { num: 4, title: "Basic Geometrical Ideas" },
    { num: 5, title: "Understanding Elementary Shapes" },
    { num: 6, title: "Integers" },
    { num: 7, title: "Fractions" },
    { num: 8, title: "Decimals" },
    { num: 9, title: "Data Handling" },
    { num: 10, title: "Mensuration" },
    { num: 11, title: "Algebra" },
    { num: 12, title: "Ratio and Proportion" },
    { num: 13, title: "Symmetry" },
    { num: 14, title: "Practical Geometry" }
  ];

  // Renders Class 6th Maths wing
  const renderClass6MathsWing = () => {
    return (
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
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 6th Mathematics Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Geometry & Arithmetic Labs for Class 6</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_6_MATHS_CHAPTERS.map(chapter => {
            if (chapter.num === 4) {
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
                    Includes Activity 2.2: Defining Line Segment. Learn the difference between segments, rays, and lines with threads and dividers.
                  </p>

                  <button
                    onClick={() => navigateTo('class6_maths', 'chapter4')}
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
                  Interactive mathematical concept simulations and exercises for this chapter.
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

  const renderClass6MathsChapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class6_maths', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Mathematics Wing
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
        {/* Activity 2.2 Card */}
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
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Line Segment Explorer. Connect endpoints with various threads and drag them to discover that the straight line segment is the shortest distance.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'line_segment_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.3 Card */}
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
            <Hammer size={20} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Intersection City & Parallel Rails. Drag nodes to build crossings and parallel train lines, and observe points of intersection vs. constant distance.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'parallel_intersecting_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.4 Card */}
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
            <Hammer size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Robo-Pen Curve Escape. Draw curves and drag items to categorize Interior, Boundary, and Exterior regions.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'curves_regions_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.5 Card */}
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
            <Compass size={20} style={{ color: '#a78bfa' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Solar Alignment Hinge. Drag tracking panels to align beams, identify Vertex/Arms, and measure solar path angles.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'angles_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.6 Card */}
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
            <Hammer size={20} style={{ color: '#60a5fa' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Geo-Truss Bridge Builder. Build structures using polygon sides, vertices, and diagonals. Run stress tests to confirm rigidity.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'polygons_lab')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 2.7 Card */}
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
            <Compass size={20} style={{ color: '#facc15' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 2.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Radar Scope Observatory. Sweeps radius and diameter circles. Map out target arcs, chords, sectors, and segments.
          </p>

          <button
            onClick={() => navigateTo('class6_maths', 'circles_lab')}
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
        {/* Activity 4.6 Card */}
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
            <Compass size={20} style={{ color: '#0ea5e9' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Compass and Bar Magnet. Explore attraction and repulsion, and see how a compass needle reacts to magnetic poles.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'activity_4_6')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 4.7 Card */}
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
            <Compass size={20} style={{ color: '#0ea5e9' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Compass and Bar Magnet. Explore attraction and repulsion, and see how a compass needle reacts to magnetic poles.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'activity_4_7')}
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

  const renderClass6Chapter6 = () => (
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
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 6 Activities</h2>
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
            <Search size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Material Detective</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Activities 6.1 - 6.3: Scan objects, classify materials based on properties, and choose suitable elements for product design.
          </p>

          <button 
            onClick={() => navigateTo('class6', 'material_detective')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Case <ArrowRight size={14} />
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
        {/* Activity Card 1: Torch Explorer */}
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
            <Zap size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.1, 3.2 & 3.3</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            NCERT Class 7 Chapter 3 (Activities 3.1, 3.2 & 3.3). Assemble a torch, explore electric cells, and build working batteries.
          </p>

          <button
            onClick={() => navigateTo('class7', 'torch_explorer')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card: Lamp Explorer */}
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
            <Zap size={20} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.4 & 3.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Lamp Explorer. Disassemble an incandescent lamp, observe its filament, and compare it with an LED.
          </p>

          <button
            onClick={() => navigateTo('class7', 'lamp_explorer')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lamp Lab <ArrowRight size={14} />
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

        {/* Activity Card 3: Activity 3.7 */}
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
            <Zap size={20} style={{ color: '#ec4899' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.7</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Test a double-cell battery and learn why an LED is a one-way street for electric current.
          </p>

          <button
            onClick={() => navigateTo('class7', 'activity_3_7')}
            className="primary"
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity Card 2: Electric Switch */}
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
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 3.8 & 3.9</h3>
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

        {/* Activity Card 4: Activity 3.11 */}
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
            <Zap size={20} style={{ color: '#eab308' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 3.11</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Conductors and Insulators. Build a tester to identify which materials allow electric current to pass through.
          </p>

          <button
            onClick={() => navigateTo('class7', 'activity_3_11')}
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
            onClick={() => navigateTo('science_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Science Lab
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
                      ? "Includes Torch Explorer and Electric Switch. Learn about electrical flows, cells, and test materials."
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

  const renderClass8Chapter4 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
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
            Magnetic Effect of Electric Current (Oersted's experiment). Observe how current affects a compass needle.
          </p>

          <button 
            onClick={() => navigateTo('class8', '4.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Electromagnet Investigation Card */}
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
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#0891b2' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activities 4.2, 4.3 & 4.4</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Electromagnet Investigation. Explore how a current-carrying coil behaves like a magnet, use an iron core, and test polarity with compasses.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'electromagnet_investigation')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
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
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Zap size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.5</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Heating Effect of Electric Current. Build a circuit with nichrome wire and observe how electrical energy converts into heat.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'heating_effect')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Lemon Battery Lab Card */}
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
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Battery size={20} style={{ color: '#eab308' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 4.6</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Lemon Battery Lab. Construct a working battery using lemons, copper strips, and iron nails to light an LED.
          </p>

          <button 
            onClick={() => navigateTo('class8', 'lemon_battery')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass8Chapter5 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
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
            <Play size={20} style={{ color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 5.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Force Explorer. Explore the four types of force: Push, Pull, Lift, and Carry in an interactive physics simulation.
          </p>

          <button 
            onClick={() => navigateTo('class8', '5.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Force Explorer <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderClass8Chapter9 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        <button
          onClick={() => navigateTo('class8', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Class 8 Wing
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Chapter 9 Activities</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select a lab to begin</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Activity 9.1 Card */}
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
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 9.1</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore the amazing world of solutes, solvents, and solutions.
          </p>

          <button 
            onClick={() => navigateTo('class8', '9.1')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>

        {/* Activity 9.2 Card */}
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
          <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-bg)', color: 'var(--accent-text)', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderBottomLeftRadius: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Lab
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Flame size={20} style={{ color: '#db2777' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-heading)' }}>Activity 9.2</h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5', flex: 1 }}>
            Explore how temperature affects the solubility of baking soda.
          </p>

          <button 
            onClick={() => navigateTo('class8', '9.2')}
            className="primary" 
            style={{ width: '100%', gap: '0.35rem', justifyContent: 'center', fontSize: '0.85rem', padding: '0.6rem' }}
          >
            <Play size={14} fill="#ffffff" /> Open Lab <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  const CLASS_8_CHAPTERS = [
    { num: 1, title: "Crop Production and Management" },
    { num: 2, title: "Microorganisms: Friend and Foe" },
    { num: 3, title: "Synthetic Fibres and Plastics" },
    { num: 4, title: "Materials: Metals and Non-Metals" },
    { num: 5, title: "Coal and Petroleum" },
    { num: 6, title: "Combustion and Flame" },
    { num: 7, title: "Conservation of Plants and Animals" },
    { num: 8, title: "Cell - Structure and Functions" },
    { num: 9, title: "The Amazing World of Solutes, Solvents, and Solutions" },
    { num: 10, title: "Reaching the Age of Adolescence" },
    { num: 11, title: "Force and Pressure" },
    { num: 12, title: "Friction" },
    { num: 13, title: "Sound" },
    { num: 14, title: "Chemical Effects of Electric Current" },
    { num: 15, title: "Some Natural Phenomena" },
    { num: 16, title: "Light" },
    { num: 17, title: "Stars and the Solar System" },
    { num: 18, title: "Pollution of Air and Water" }
  ];

  const renderClass8Wing = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Subheader Wing Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <button
            onClick={() => navigateTo('science_lab', null)}
            className="outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Back to Science Lab
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Class 8th Wing</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Interactive Demonstrations & Labs for Class 8</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {CLASS_8_CHAPTERS.map(chapter => {
            if (chapter.num === 2 || chapter.num === 4 || chapter.num === 5 || chapter.num === 9) {
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
                    {chapter.num === 2 ? "Interactive Lab 1: Discovering the Invisible World. Learn about magnification, slide preparation, and cell observation." : 
                     chapter.num === 4 ? "Includes Materials: Metals and Non-Metals. Test the appearance, hardness, and hammering effect on various materials." : 
                     chapter.num === 5 ? "Includes Activity 5.1: Force Explorer." :
                     "Includes Activity 9.1: Solutes, Solvents, and Solutions."}
                  </p>

                  <button 
                    onClick={() => navigateTo('class8', `chapter${chapter.num}`)}
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
          onClick={() => navigateTo('science_lab', null)}
          className="outline"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
        >
          <ArrowLeft size={14} /> Back to Science Lab
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
          {subjectName.toLowerCase().includes('social') ? 'Return to Social Lab' : 'Return to Science Lab'}
        </button>
      </div>
    </div>
  );

  const isFullscreen = (activeActivity && !['chapter4_flow', 'chapter5_flow', 'chapter9'].includes(activeActivity)) || hideHeader || ['chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter10', 'chapter11'].includes(activeActivity);

  return (
    <div className="app-container">
      {/* Invisible Triggers for Focus Mode Reveal */}
      <div className="focus-trigger-top" />
      <div className="focus-trigger-left" />

      {/* Page Title Header */}
      {!isFullscreen && (
        <header className="header" style={{ marginBottom: activeSubject ? '1.5rem' : '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="header-title">
                <BookOpen style={{ color: 'var(--accent)' }} size={24} />
                <h1 style={{ fontSize: '1.75rem' }}>FuturaX Interactive Labs</h1>
              </div>
              <p className="header-subtitle">
                Active-learning simulations and concept reviews for science and social science
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
                    activeSubject === 'class6_maths' ? 'Class 6th Maths' :
                    activeSubject === 'class7' ? 'Class 7th' :
                      activeSubject === 'class8' ? 'Class 8th' : 
                        activeSubject === 'class9' ? 'Class 9th' :
                          activeSubject === 'science_lab' ? 'Science Lab' :
                            activeSubject === 'social_lab' ? 'Social Lab' :
                              activeSubject === 'class6_social' ? 'Class 6th (Social)' :
                                activeSubject === 'class7_social' ? 'Class 7th (Social)' : 'Class'}
                </span>
                {activeActivity && (
                  <>
                    <ArrowRight size={10} />
                    <span style={{ color: 'var(--accent-text)' }}>
                      {activeActivity === 'electric_switch' ? 'Activities 3.8 & 3.9' : 
                       activeActivity === 'torch_explorer' ? 'Activities 3.1, 3.2 & 3.3' :
                       activeActivity === 'spherical_mirrors' ? 'Spherical Mirrors' : 
                       activeActivity === 'food_testing' ? 'Food Testing' :
                       activeActivity === 'fat_testing' ? 'Fat Testing' :
                       activeActivity === 'protein_testing' ? 'Protein Testing' :
                       activeActivity === 'materials_properties' ? 'Properties of Materials' :
                       activeActivity === 'magnetic_poles' ? 'Magnetic Poles' :
                       activeActivity === 'suspended_magnet' ? 'Suspended Magnet' :
                       activeActivity === 'magnetic_compass' ? 'Make a Compass' :
                       activeActivity === 'magnet_interaction' ? 'Magnet Interaction' :
                       activeActivity === 'activity_3_11' ? 'Activity 3.11' :
                       activeActivity === 'linear_motion' ? 'Linear Motion' :
                       activeActivity === 'magnetic_effect' ? 'Activity 4.1' :
                       activeActivity === 'electromagnet_investigation' ? 'Activities 4.2, 4.3 & 4.4' :
                       activeActivity === 'heating_effect' ? 'Activity 4.5' :
                       activeActivity === 'line_segment_lab' ? 'Activity 2.2: Line Segment Lab' :
                       activeActivity === 'parallel_intersecting_lab' ? 'Activity 2.3: Parallel & Intersecting Lines' :
                       activeActivity === 'curves_regions_lab' ? 'Activity 2.4: Curves & Closed Regions' :
                       activeActivity === 'virtual_biodiversity' ? 'Activity 2.1 — Virtual Biodiversity Explorer' :
                       activeActivity === 'plant_detective' ? 'Plant Detective Lab' :
                       activeActivity === 'animal_habitat' ? 'Animal Habitat Explorer' :
                       activeActivity === '9.2' ? 'Activity 9.2' :
                       'Template Demo'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Workspace content */}
      <main className={`content-wrapper ${isFullscreen ? 'fullscreen-lab' : ''}`} style={{ padding: isFullscreen ? 0 : undefined }}>
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--text-muted)' }}>
            Loading activity...
          </div>
        }>
        {/* HIERARCHICAL ROUTER */}
        {activeSubject === null ? (
          renderSubjectSelector()
        ) : activeSubject === 'science_lab' ? (
          renderScienceLabWings()
        ) : activeSubject === 'math_lab' ? (
          renderMathLabWings()
        ) : activeSubject === 'class7' ? (
          activeActivity === 'electric_switch' ? (
            <ElectricSwitchActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'electric_circuit' ? (
            <ElectricCircuitActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'lamp_explorer' ? (
            <LampExplorerActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'activity_3_7' ? (
            <Activity3_7 onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'activity_3_11' ? (
            <Activity3_11 onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
          ) : activeActivity === 'torch_explorer' ? (
            <TorchExplorerActivity onBackToDashboard={() => navigateTo('class7', 'chapter3')} />
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
          ) : activeActivity === 'intro_magnets' ? (
            <IntroMagnets 
              onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} 
              onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-1')}
            />
          ) : activeActivity === 'activity_4_1' ? (
            <Activity4_1 
              onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} 
              onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-2')}
            />
          ) : activeActivity === 'magnetic_poles' ? (
            <MagneticPolesActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-3')} />
          ) : activeActivity === 'suspended_magnet' ? (
            <SuspendedMagnetActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-4')} />
          ) : activeActivity === 'magnetic_compass' ? (
            <MagneticCompassActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'sec-4-4')} />
          ) : activeActivity === 'magnet_interaction' ? (
            <MagnetInteractionActivity onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-6')} />
          ) : activeActivity === 'activity_4_6' ? (
            <Activity4_6 onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow', 'act-4-7')} />
          ) : activeActivity === 'activity_4_7' ? (
            <Activity4_7 onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow')} />
          ) : activeActivity === 'sci6-ch4-sec45-fun-with-magnets' ? (
            <FunWithMagnets onBackToDashboard={() => navigateTo('class6', 'chapter4_flow')} onComplete={() => navigateTo('class6', 'chapter4_flow')} />
          ) : activeActivity === 'chapter_4_quiz' ? (
            <div style={{ height: '100vh', width: '100vw', overflowY: 'auto', background: 'var(--bg)' }}>
              <button 
                onClick={() => navigateTo('class6', 'chapter4_flow')} 
                style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                Back to Flow
              </button>
              <div style={{ paddingTop: '5rem' }}>
                <Chapter4Quiz onComplete={() => navigateTo('class6', 'chapter4_flow')} />
              </div>
            </div>
          ) : activeActivity === 'linear_motion' ? (
            <LinearMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5_flow')} />
          ) : activeActivity === 'circular_motion' ? (
            <CircularMotionActivity onBackToDashboard={() => navigateTo('class6', 'chapter5_flow')} />
          ) : activeActivity === 'virtual_biodiversity' ? (
            <VirtualBiodiversityExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'appreciating_biodiversity' ? (
            <AppreciatingBiodiversityActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'inline_sorting' ? (
            <InlineSortingActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'plant_detective' ? (
            <PlantDetectiveActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'leaf_venation_lab' ? (
            <LeafVenationLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'root_systems_lab' ? (
            <RootSystemsLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'venation_root_correlation' ? (
            <VenationRootCorrelationLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'seed_dissection_lab' ? (
            <SeedDissectionLab onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'animal_habitat' ? (
            <AnimalHabitatExplorerActivity onBackToDashboard={() => navigateTo('class6', 'chapter2')} />
          ) : activeActivity === 'chapter2' ? (
            <Chapter2LearningLab 
              onBack={() => navigateTo('class6', null)}
              onHeaderVisibilityChange={(visible) => setHideHeader(!visible)}
            />
          ) : activeActivity === 'chapter3' ? (
            <Chapter3LearningLab 
              onBack={() => navigateTo('class6', null)}
              onHeaderVisibilityChange={(visible) => setHideHeader(!visible)}
            />
          ) : activeActivity === 'chapter10' ? (
            <Chapter10LearningLab 
              onBack={() => navigateTo('class6', null)}
              onHeaderVisibilityChange={(visible) => setHideHeader(!visible)}
            />
          ) : activeActivity === 'chapter11' ? (
            <Chapter11LearningLab
              onBack={() => navigateTo('class6', null)}
              onHeaderVisibilityChange={(visible) => setHideHeader(!visible)}
            />
          ) : activeActivity === 'chapter13' ? (
            <ExploringMagnetsLab onBackToDashboard={() => navigateTo('class6', null)} />
          ) : activeActivity === 'magnetic_demo' ? (
            <MagneticDemoActivity onBackToDashboard={() => navigateTo('class6', null)} />
          ) : activeActivity === 'material_detective' ? (
            <MaterialDetectiveActivity onBackToDashboard={() => navigateTo('class6', 'chapter6')} />
          ) : activeActivity === 'materials_around_us' ? (
            <MaterialsAroundUsActivity onBackToDashboard={() => navigateTo('class6', null)} />
          ) : activeActivity === 'materials_around_us_new' ? (
            <MaterialsAroundUsNewActivity onBackToDashboard={() => navigateTo('class6', null)} />
          ) : activeActivity === 'chapter4' ? (
            renderClass6Chapter4()
          ) : activeActivity === 'chapter4_flow' ? (
            <Chapter4Flow 
              onBackToDashboard={() => navigateTo('class6', null)} 
              onLaunchActivity={(act) => navigateTo('class6', act)} 
              initialSection={activeSection}
            />
          ) : activeActivity === 'chapter5_flow' ? (
            <Chapter5Flow 
              onBackToDashboard={() => navigateTo('class6', null)}
              onLaunchActivity={(id) => navigateTo('class6', id)}
            />
          ) : activeActivity === 'chapter5' ? (
            renderClass6Chapter5()
          ) : activeActivity === 'chapter6' ? (
            renderClass6Chapter6()
          ) : (
            renderClass6Wing()
          )
        ) : activeSubject === 'class8' ? (
          activeActivity === '4.1' ? (
            <MagneticEffectOfCurrentActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'electromagnet_investigation' ? (
            <ElectromagnetInvestigationActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'heating_effect' ? (
            <HeatingEffectActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === 'lemon_battery' ? (
            <LemonBatteryLabActivity onBackToDashboard={() => navigateTo('class8', 'chapter4')} />
          ) : activeActivity === '9.1' ? (
            <Activity9_1 onBackToDashboard={() => navigateTo('class8', 'chapter9')} />
          ) : activeActivity === '9.2' ? (
            <Activity9_2 onBackToDashboard={() => navigateTo('class8', 'chapter9')} />
          ) : activeActivity === '5.1' ? (
            <ForceExplorerActivity onBackToDashboard={() => navigateTo('class8', 'chapter5')} />
          ) : activeActivity === 'chapter2' ? (
            <MicroscopeDiscovery onBackToDashboard={() => navigateTo('class8', null)} />
          ) : activeActivity === 'chapter4' ? (
            renderClass8Chapter4()
          ) : activeActivity === 'chapter5' ? (
            renderClass8Chapter5()
          ) : activeActivity === 'chapter9' ? (
            renderClass8Chapter9()
          ) : (
            renderClass8Wing()
          )
        ) : activeSubject === 'class9' ? (
          renderUnderConstruction('Class 9th', Zap, '#ec4899')
        ) : activeSubject === 'social_lab' ? (
          renderSocialLabWings()
        ) : activeSubject === 'class6_social' ? (
          activeActivity === 'chapter11' ? (
            <GrassrootsDemocracyActivity onBackToDashboard={() => navigateTo('class6_social', null)} />
          ) : activeActivity === 'locating_places' ? (
            <LocatingPlacesActivity onBackToDashboard={() => navigateTo('class6_social', null)} />
          ) : (
            renderClass6SocialWing()
          )
        ) : activeSubject === 'class7_social' ? (
          activeActivity === 'chapter1' ? (
            <GeographyExpeditionActivity onBackToDashboard={() => navigateTo('class7_social', null)} />
          ) : (
            renderClass7SocialWing()
          )
        ) : activeSubject === 'class6_maths' ? (
          activeActivity === 'line_segment_lab' ? (
            <LineSegmentLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'parallel_intersecting_lab' ? (
            <ParallelIntersectingLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'curves_regions_lab' ? (
            <CurvesRegionsLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'angles_lab' ? (
            <AnglesLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'polygons_lab' ? (
            <PolygonsLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'circles_lab' ? (
            <CirclesLabActivity onBackToDashboard={() => navigateTo('class6_maths', 'chapter4')} />
          ) : activeActivity === 'chapter4' ? (
            renderClass6MathsChapter4()
          ) : (
            renderClass6MathsWing()
          )
        ) : null}
        </Suspense>
      </main>

      {/* Ambient background music element */}
      <audio ref={audioRef} src={natureForestSound} loop />

      {/* Floating circular controls (Theme & Music) */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '2rem', 
          right: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          zIndex: 999999 
        }}
      >
        {/* Music Toggle Control (only for Chapter 2) */}
        {activeActivity === 'chapter2' && (
          <button
            onClick={() => setIsAudioPlaying(prev => !prev)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: '1px solid var(--border)',
              background: theme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              color: 'var(--text-primary)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
            title={isAudioPlaying ? 'Mute Background Nature Sounds' : 'Unmute Background Nature Sounds'}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isAudioPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        )}
      </div>

    </div>
  );
}
