import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import physicalImg from './assets/physical-map-simple.jpg';
import politicalImg from './assets/political.png';
import rainfallImg from './assets/rainfall.png';

const PageLayout = ({ title, descriptionList, imageSrc, caption, funFact }) => {
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0', boxSizing: 'border-box' }}>
      {/* Left Page (Text) */}
      <div style={{ flex: 1, padding: '2rem 3rem 4.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '2.8rem', color: '#1e3a8a', marginBottom: '1.5rem', fontFamily: 'serif', textAlign: 'center', marginTop: 0 }}>{title}</h2>
        
        <div style={{ fontSize: '1.3rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column' }}>
          {descriptionList.map((desc, i) => (
            <p key={i} style={{ marginBottom: '1.2rem', color: '#334155', marginTop: 0 }}>{desc}</p>
          ))}
        </div>

        {funFact && (
          <div style={{ background: '#fef3c7', padding: '1.25rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b', marginTop: 'auto' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>
              <Lightbulb size={18} /> Did You Know?
            </h4>
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.95rem', lineHeight: 1.5 }}>{funFact}</p>
          </div>
        )}
      </div>
      {/* Right Page (Image) */}
      <div style={{ flex: 1, padding: '2rem 3rem 4.5rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div 
          onClick={() => setIsImageOpen(true)}
          style={{ cursor: 'pointer', width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
           <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span style={{ marginTop: '0.75rem', color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Click the image to expand
        </span>
      </div>
    </div>

    {/* Image Modal */}
    {isImageOpen && (
      <div 
        onClick={() => setIsImageOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <button 
          onClick={() => setIsImageOpen(false)}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={32} />
        </button>
        <div 
          onClick={(e) => e.stopPropagation()} 
          style={{ position: 'relative', background: 'white', padding: '0.5rem', borderRadius: '12px', cursor: 'default', display: 'inline-block' }}
        >
          <img src={imageSrc} alt={title} style={{ maxWidth: '70vw', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', display: 'block' }} />
        </div>
      </div>
    )}
    </>
  );
};

export const PhysicalMapPage = () => (
  <PageLayout 
    title="Physical Maps"
    descriptionList={[
      "Physical maps show the natural features of the Earth.",
      "They help us identify mountains, rivers, forests, deserts, plains and oceans."
    ]}
    imageSrc={physicalImg}
    caption="Shows natural features."
    funFact="The colours on a physical map have special meanings! Brown usually shows high mountains, green shows low plains, and blue shows water bodies."
  />
);

export const PoliticalMapPage = () => (
  <PageLayout 
    title="Political Maps"
    descriptionList={[
      "Political maps show countries, states, cities and boundaries.",
      "They help us understand administrative regions."
    ]}
    imageSrc={politicalImg}
    caption="Shows countries and states."
    funFact="Borders between countries are made up by humans. You won't actually see these lines if you look at the Earth from space!"
  />
);

export const ThematicMapPage = () => (
  <PageLayout 
    title="Thematic Maps"
    descriptionList={[
      "Thematic maps show one special kind of information.",
      "Examples include rainfall, temperature, population and forests."
    ]}
    imageSrc={rainfallImg}
    caption="Shows one specific topic."
    funFact="A thematic map can be about almost anything! You could even make a thematic map showing the most popular ice cream flavour in every state."
  />
);
