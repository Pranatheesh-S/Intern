import React, { useRef, useEffect } from 'react';
import { ArrowLeft, BookOpen, Play, CheckCircle } from 'lucide-react';

export default function Chapter4Flow({ onBackToDashboard, onLaunchActivity, initialSection }) {
  // We'll use refs to allow clicking the sidebar to scroll to the item
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    if (sectionRefs.current[id]) {
      sectionRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (initialSection) {
      setTimeout(() => {
        scrollToSection(initialSection);
        // Optionally highlight it
        if (sectionRefs.current[initialSection]) {
          sectionRefs.current[initialSection].style.transition = 'box-shadow 0.3s ease';
          sectionRefs.current[initialSection].style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
          setTimeout(() => {
            sectionRefs.current[initialSection].style.boxShadow = '';
          }, 2000);
        }
      }, 100);
    }
  }, [initialSection]);

  const timelineData = [
    {
      id: 'intro-magnets',
      type: 'activity',
      num: 1,
      title: 'INTRODUCTION',
      subtitle: 'Introduction to Magnets',
      content: 'Reshma lived in a coastal town of Kerala and loved writing short stories. Since her grandmother enjoyed listening to her stories, Reshma decided to write a special story as a birthday gift for her grandmother\'s 60th birthday. Read the story to find out how a magnetic compass helps sailors navigate!',
      activityId: 'intro_magnets',
      buttonText: 'Launch Reshma\'s Story'
    },
    {
      id: 'act-4-1',
      type: 'activity',
      num: 2,
      title: 'ACTIVITY 4.1',
      subtitle: 'Magnetic and Non-magnetic Materials',
      content: 'Let us walk around the playground or a virtual island with a magnet. What materials stick to our magnet? Objects that are attracted to a magnet are magnetic materials (like iron, nickel, cobalt). Materials that are not attracted are non-magnetic (like plastic, wood, rubber).',
      activityId: 'activity_4_1',
      buttonText: 'Launch Virtual Playground Explorer'
    },
    {
      id: 'sec-4-2',
      type: 'section',
      num: 3,
      title: 'Section 4.2',
      subtitle: 'Poles of a Magnet',
      content: 'We observed that iron filings (if they are present) stick to a magnet rubbed in the soil. Did you observe any pattern? The iron filings stick more strongly near the two ends of a bar magnet. These ends are the poles of the magnet.',
      keyConcept: 'Magnetic Poles',
      keyConceptDesc: 'Every magnet has two poles: a North pole and a South pole. The magnetic force is strongest at the poles.'
    },
    {
      id: 'act-4-2',
      type: 'activity',
      num: 4,
      title: 'ACTIVITY 4.2',
      subtitle: 'Iron Filings & Magnetic Poles',
      content: 'Spread some iron filings on a sheet of paper and place a bar magnet on it. Observe how the filings arrange themselves around the ends of the magnet, proving that the magnetic pull is strongest at the poles.',
      activityId: 'magnetic_poles',
      buttonText: 'Launch Iron Filings Experiment'
    },
    {
      id: 'sec-4-3',
      type: 'section',
      num: 5,
      title: 'Section 4.3',
      subtitle: 'Finding Directions',
      content: 'In ancient times, travelers used natural magnets to find directions. A freely suspended magnet always comes to rest in a particular direction, which is the North-South direction. This property led to the invention of the compass.',
      keyConcept: 'Directive Property',
      keyConceptDesc: 'A freely suspended bar magnet always aligns itself in the North-South direction.'
    },
    {
      id: 'act-4-3',
      type: 'activity',
      num: 6,
      title: 'ACTIVITY 4.3',
      subtitle: 'Suspended Bar Magnet',
      content: 'Suspend a bar magnet using a thread and a stand. Give it a spin and observe the direction in which it comes to rest. Mark the ends to see that it always points North-South.',
      activityId: 'suspended_magnet',
      buttonText: 'Launch Suspended Magnet Lab'
    },
    {
      id: 'act-4-4',
      type: 'activity',
      num: 7,
      title: 'ACTIVITY 4.4',
      subtitle: 'Make Your Own Magnetic Compass',
      content: 'You can make your own magnet by stroking an iron needle with a bar magnet. Once magnetized, place the needle on a piece of cork floating in a cup of water to create a simple compass.',
      activityId: 'magnetic_compass',
      buttonText: 'Launch Compass Making Activity'
    },
    {
      id: 'sec-4-4',
      type: 'section',
      num: 8,
      title: 'Section 4.4',
      subtitle: 'Attraction and Repulsion Between Magnets',
      content: 'What happens when two magnets are brought close to each other? Let us play a game with two toy cars to find out! Like poles repel each other, and unlike poles attract each other.',
      keyConcept: 'Laws of Magnetism',
      keyConceptDesc: 'Unlike (opposite) poles attract each other. Like (same) poles repel each other.'
    },
    {
      id: 'act-4-5',
      type: 'activity',
      num: 9,
      title: 'ACTIVITY 4.5',
      subtitle: 'Magnet Interaction (Toy Cars)',
      content: 'Place magnets on top of toy cars with different poles facing each other. Predict and observe whether the cars pull towards each other or push away.',
      activityId: 'magnet_interaction',
      buttonText: 'Launch Toy Car Lab'
    },
    {
      id: 'act-4-6',
      type: 'activity',
      num: 10,
      title: 'ACTIVITY 4.6 & 4.7',
      subtitle: 'Compass and Bar Magnet Fields',
      content: 'Move a magnetic compass around a bar magnet. Observe how the compass needle deflects depending on which pole of the bar magnet it is near.',
      activityId: 'activity_4_6',
      buttonText: 'Launch Compass Interaction Lab'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={onBackToDashboard}
            style={{ 
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-secondary)', 
              padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Class 6 Wing
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Chapter 4: Exploring Magnets</h1>
        </div>
        <div style={{ paddingLeft: '9.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          textbook content timeline and active labs flow
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'flex', gap: '2rem', flex: 1, padding: '0 1rem', overflow: 'hidden' }}>
        
        {/* Left Sidebar (Timeline Progress) */}
        <div style={{ 
          flex: '0 0 280px', 
          background: 'rgba(15, 23, 42, 0.4)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '12px',
          padding: '1.5rem',
          height: 'fit-content',
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '1rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem' }}>
            <BookOpen size={18} /> Timeline Progress
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Connecting vertical line for sidebar */}
            <div style={{ position: 'absolute', left: '8px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>
            
            {timelineData.map((item, index) => (
              <div 
                key={item.id} 
                onClick={() => scrollToSection(item.id)}
                style={{ 
                  display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', cursor: 'pointer', position: 'relative', zIndex: 1,
                  opacity: 0.8, transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                <div style={{ 
                  background: 'var(--bg-primary)', 
                  borderRadius: '50%', padding: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {item.type !== 'activity' ? (
                    <BookOpen size={14} style={{ color: '#94a3b8' }} />
                  ) : (
                    <div style={{ background: '#10b981', borderRadius: '50%', padding: '2px' }}>
                       <CheckCircle size={10} style={{ color: '#fff' }} />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: '0.85rem', color: item.type !== 'activity' ? '#e2e8f0' : '#a7f3d0', marginTop: '2px', lineHeight: '1.4' }}>
                  {item.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content (Timeline Flow) */}
        <div style={{ flex: 1, position: 'relative', paddingLeft: '3rem', paddingRight: '2rem', overflowY: 'auto', paddingBottom: '4rem' }}>
          {/* Main vertical line */}
          <div style={{ position: 'absolute', left: '15px', top: '0', bottom: '0', width: '2px', background: '#3b82f6', zIndex: 0 }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {timelineData.map((item) => (
              <div key={item.id} ref={el => sectionRefs.current[item.id] = el} style={{ position: 'relative', zIndex: 1 }}>
                
                {/* Number Bubble */}
                <div style={{ 
                  position: 'absolute', left: '-2.4rem', top: '1rem', width: '28px', height: '28px', 
                  borderRadius: '50%', background: '#1e1b4b', border: '2px solid #6366f1', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#818cf8', fontSize: '0.85rem', fontWeight: 'bold'
                }}>
                  {item.num}
                </div>

                {/* Card Content */}
                <div style={{ 
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                  
                  {/* Card Header Label */}
                  <div style={{ 
                    fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '0.5rem',
                    color: item.type === 'activity' ? '#10b981' : item.type === 'story' ? '#f43f5e' : '#3b82f6', textTransform: 'uppercase'
                  }}>
                    {item.title}
                  </div>
                  
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', color: '#f8fafc' }}>{item.subtitle}</h2>
                  
                  {item.content && (
                    <p style={{ margin: '0 0 1.5rem 0', color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
                      {item.content}
                    </p>
                  )}

                  {/* Extras for Story */}
                  {item.type === 'story' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                      {item.scenes.map((scene, i) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <img src={scene.img} alt={scene.subtitle} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x160/1e1b4b/818cf8?text=Scene+' + (i+1) }} />
                          <div style={{ padding: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#818cf8', fontSize: '0.95rem' }}>{scene.subtitle}</h4>
                            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>{scene.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extras for Sections */}
                  {item.type === 'section' && item.keyConcept && (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '250px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginBottom: '0.5rem', fontWeight: 'bold' }}>Key Concept: {item.keyConcept}</div>
                        <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{item.keyConceptDesc}</div>
                      </div>
                      
                      {item.subBoxLabel && (
                        <div style={{ flex: 1, minWidth: '250px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', padding: '1rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#6ee7b7', marginBottom: '0.5rem', fontWeight: 'bold' }}>{item.subBoxLabel}</div>
                          <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{item.subBoxDesc}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action for Activities */}
                  {item.type === 'activity' && (
                    <button 
                      onClick={() => onLaunchActivity(item.activityId)}
                      style={{ 
                        background: '#10b981', color: '#ffffff', border: 'none', 
                        padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <Play size={16} fill="#ffffff" /> {item.buttonText}
                    </button>
                  )}
                  
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
