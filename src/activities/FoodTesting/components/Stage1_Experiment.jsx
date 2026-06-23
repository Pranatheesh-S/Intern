import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, CheckCircle2, FlaskConical, RotateCcw } from 'lucide-react';

const FOOD_ITEMS = [
  { id: 'potato', name: 'Slice of Potato', hasStarch: true, baseColor: '#fef08a' },
  { id: 'cucumber', name: 'Cucumber', hasStarch: false, baseColor: '#bbf7d0' },
  { id: 'bread', name: 'Bread', hasStarch: true, baseColor: '#fed7aa' },
  { id: 'rice', name: 'Boiled Rice', hasStarch: true, baseColor: '#f8fafc' },
  { id: 'gram', name: 'Boiled Gram', hasStarch: false, baseColor: '#fcd34d' },
  { id: 'peanuts', name: 'Crushed Peanuts', hasStarch: false, baseColor: '#d6d3d1' },
  { id: 'oil', name: 'Oil', hasStarch: false, baseColor: '#fef08a' },
  { id: 'butter', name: 'Butter', hasStarch: false, baseColor: '#fef3c7' },
  { id: 'coconut', name: 'Crushed Coconut', hasStarch: false, baseColor: '#f1f5f9' },
];

export default function Stage1_Experiment({ onComplete }) {
  const [testedItems, setTestedItems] = useState({});
  const [selectedTool, setSelectedTool] = useState(null); // null or 'iodine'

  const handleTestItem = (itemId) => {
    if (selectedTool !== 'iodine') return;
    setTestedItems(prev => {
      const next = { ...prev, [itemId]: true };
      // Check if all tested
      const newCount = Object.keys(next).length;
      if (newCount === FOOD_ITEMS.length) {
        setTimeout(onComplete, 1000);
      }
      return next;
    });
  };

  const handleReset = () => {
    setTestedItems({});
    setSelectedTool(null);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
      
      {/* Left Panel: Lab Area */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FlaskConical size={20} style={{ color: '#06b6d4' }} /> Virtual Lab Bench
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              1. Select the Iodine Dropper.<br/>
              2. Click on each food item to drop iodine on it.<br/>
              3. Observe the colour change.
            </p>
          </div>
          <button 
            onClick={handleReset}
            className="outline"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Reset Activity
          </button>
        </div>

        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '1rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <button 
            onClick={() => setSelectedTool(selectedTool === 'iodine' ? null : 'iodine')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.5rem',
              background: selectedTool === 'iodine' ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
              border: `2px solid ${selectedTool === 'iodine' ? '#eab308' : 'rgba(255,255,255,0.1)'}`,
              padding: '1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#ffffff',
              transition: 'all 0.2s'
            }}
          >
            <Droplet size={32} style={{ color: '#eab308' }} fill={selectedTool === 'iodine' ? '#eab308' : 'none'} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Diluted Iodine Solution</span>
          </button>
        </div>

        {/* Food Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          flex: 1
        }}>
          {FOOD_ITEMS.map((item) => {
            const isTested = testedItems[item.id];
            
            // If tested, starch turns blue-black (#1e1b4b), else yellowish (#ca8a04)
            const activeColor = isTested 
              ? (item.hasStarch ? '#1e1b4b' : '#ca8a04') 
              : item.baseColor;

            return (
              <motion.div
                key={item.id}
                onClick={() => handleTestItem(item.id)}
                whileHover={{ scale: selectedTool === 'iodine' && !isTested ? 1.05 : 1 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `2px solid ${isTested ? (item.hasStarch ? '#6366f1' : '#eab308') : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: selectedTool === 'iodine' && !isTested ? 'pointer' : 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Dish */}
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {/* Food representation */}
                  <motion.div 
                    animate={{ backgroundColor: activeColor }}
                    transition={{ duration: 0.8 }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: item.id.includes('oil') || item.id.includes('butter') ? '10px' : '40% 60% 70% 30% / 40% 50% 60% 50%',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: '500' }}>{item.name}</span>
                </div>

                {/* Drop animation overlay */}
                <AnimatePresence>
                  {isTested && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1, top: 0 }}
                      animate={{ scale: 1.5, opacity: 0, top: '40%' }}
                      transition={{ duration: 0.8 }}
                      style={{
                        position: 'absolute',
                        color: '#eab308',
                        pointerEvents: 'none',
                        left: '42%'
                      }}
                    >
                      <Droplet fill="#eab308" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Observation Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#ffffff' }}>Observation Table 3.3</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 'bold' }}>
            <span>Food Item</span>
            <span>Blue-Black?</span>
          </div>

          {/* Table Rows */}
          {FOOD_ITEMS.map((item) => {
            const isTested = testedItems[item.id];
            return (
              <div 
                key={item.id} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto', 
                  padding: '0.5rem', 
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  alignItems: 'center',
                  opacity: isTested ? 1 : 0.4
                }}
              >
                <span style={{ color: '#f8fafc' }}>{item.name}</span>
                <span style={{ 
                  color: isTested ? (item.hasStarch ? '#818cf8' : '#fb7185') : '#64748b',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center',
                  width: '60px'
                }}>
                  {isTested ? (item.hasStarch ? 'Yes' : 'No') : '-'}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} style={{ color: '#34d399' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#34d399' }}>Conclusion</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
            A blue-black colour indicates the presence of starch. Potato, bread, and boiled rice contain starch.
          </p>
        </div>
      </div>
    </div>
  );
}
