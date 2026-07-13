import React from 'react';
import physicalImg from './assets/physical.png';
import politicalImg from './assets/political.png';
import rainfallImg from './assets/rainfall.png';

const PageLayout = ({ title, descriptionList, imageSrc, caption }) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0', boxSizing: 'border-box' }}>
      {/* Left Page (Text) */}
      <div style={{ flex: 1, padding: '3rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#1e3a8a', marginBottom: '2rem', fontFamily: 'serif' }}>{title}</h2>
        <div style={{ fontSize: '1.3rem', lineHeight: 1.8 }}>
          {descriptionList.map((desc, i) => (
            <p key={i} style={{ marginBottom: '1.5rem', color: '#334155' }}>{desc}</p>
          ))}
        </div>
      </div>
      {/* Right Page (Image & Caption) */}
      <div style={{ flex: 1, padding: '3rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
           <img src={imageSrc} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#64748b', fontSize: '1.1rem' }}>{caption}</p>
      </div>
    </div>
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
  />
);
