import React from 'react';
import { BookOpen, Clock, Book, Globe2, Star, ShieldCheck } from 'lucide-react';
import aryabhataImg from './assets/aryabhata.jpg';

export default function AryabhataPage() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      {/* LEFT PAGE */}
      <div style={{ flex: 1, padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1e3a8a', textAlign: 'center', marginBottom: '1rem', fontFamily: 'serif' }}>
          Chapter 1<br/>
          <span style={{ fontSize: '2rem' }}>Locating Places on the Earth</span>
        </h2>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '45%', height: 'auto', aspectRatio: '3/4', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', marginBottom: '1rem' }}>
            <img src={aryabhataImg} alt="Aryabhata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid #94a3b8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative', width: '95%' }}>
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
              "The globe of the Earth stands in space, made up of water, earth, fire and air and is spherical. It is surrounded by all creatures, terrestrial as well as aquatic."
            </p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0 0 0', textAlign: 'right', fontWeight: 'bold' }}>
              — Āryabhaṭa
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PAGE */}
      <div style={{ flex: 1, padding: '1.5rem 2rem', position: 'relative', paddingBottom: '5rem', backgroundColor: '#ffffff', color: '#1e293b', display: 'flex', flexDirection: 'column', borderRadius: '0 4px 4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#1e3a8a' }}>
            <BookOpen size={20} /> Historical Facts
          </div>
        </div>

        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.3rem', margin: 0, color: '#1e3a8a' }}>Who was Āryabhaṭa?</h3>
          <p style={{ fontSize: '1rem', color: '#475569', margin: 0, marginTop: '0.3rem' }}>Āryabhaṭa was a famous Indian mathematician and astronomer.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Lived Around</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Clock size={16} color="#2563eb" style={{ marginTop: '0.2rem' }} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0f172a' }}>Around 500 CE</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>About 1,500 years ago</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Famous Book</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Book size={16} color="#7c3aed" style={{ marginTop: '0.2rem' }} />
              <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#0f172a' }}>Āryabhaṭīya</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Key Discovery</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Globe2 size={16} color="#16a34a" style={{ marginTop: '0.2rem' }} />
              <div style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3, color: '#0f172a' }}>Explained that the Earth is round</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: '#d97706', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Field of Study</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Star size={16} color="#d97706" style={{ marginTop: '0.2rem' }} />
              <div style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.3, color: '#0f172a' }}>Mathematics & Astronomy</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h4 style={{ color: '#059669', fontSize: '1.1rem', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> His Contribution
          </h4>
          <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.4, margin: 0 }}>His discoveries helped people understand mathematics, astronomy, and the Earth better.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Ancient Indian Scientist
          </div>
        </div>

      </div>
    </div>
  );
}
