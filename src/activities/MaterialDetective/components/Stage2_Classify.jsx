import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import AIMentor from './AIMentor';

const CATEGORIES = {
  lustre: {
    title: 'Lustre (Shine)',
    description: 'Group objects based on whether they shine (lustrous) or look dull.',
    bin1: { name: 'Shiny / Lustrous', id: 'shiny', color: 'rgba(234, 179, 8, 0.1)', borderColor: '#eab308' },
    bin2: { name: 'Dull Appearance', id: 'dull', color: 'rgba(100, 116, 139, 0.1)', borderColor: '#64748b' },
    items: [
      { id: 'gold_ring', name: 'Gold Ring', correctBin: 'shiny', reason: 'Gold is a metal that naturally shines and has a brilliant golden lustre.', icon: '💍' },
      { id: 'wooden_block', name: 'Wooden Block', correctBin: 'dull', reason: 'Wood has a dull appearance and does not reflect light with metallic shine.', icon: '🪵' },
      { id: 'copper_wire', name: 'Copper Wire', correctBin: 'shiny', reason: 'Copper is a metal. When clean, it shows a bright, reddish-metallic lustre.', icon: '🔌' },
      { id: 'eraser', name: 'Rubber Eraser', correctBin: 'dull', reason: 'Rubber has a matte finish that absorbs light, making it look dull.', icon: '🧽' },
      { id: 'steel_key', name: 'Steel Key', correctBin: 'shiny', reason: 'Steel is a polished metal alloy that reflects light brightly.', icon: '🔑' },
      { id: 'clay_pot', name: 'Clay Pot', correctBin: 'dull', reason: 'Clay is earthy and has a rough, non-reflective surface.', icon: '🏺' }
    ]
  },
  hardness: {
    title: 'Hardness',
    description: 'Group objects based on whether they can be easily compressed/scratched (soft) or not (hard).',
    bin1: { name: 'Hard Materials', id: 'hard', color: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' },
    bin2: { name: 'Soft Materials', id: 'soft', color: 'rgba(59, 130, 246, 0.1)', borderColor: '#3b82f6' },
    items: [
      { id: 'iron_nail', name: 'Iron Nail', correctBin: 'hard', reason: 'Iron is a very hard metal; it cannot be scratched or compressed by hand.', icon: '📌' },
      { id: 'sponge', name: 'Sponge', correctBin: 'soft', reason: 'A sponge has holes filled with air and can be easily squeezed and compressed.', icon: '🧽' },
      { id: 'stone', name: 'Granite Stone', correctBin: 'hard', reason: 'Stone consists of tightly packed minerals that make it extremely rigid.', icon: '🪨' },
      { id: 'cotton_ball', name: 'Cotton Ball', correctBin: 'soft', reason: 'Cotton fibers are loose and fluffy, allowing you to compress them easily.', icon: '☁️' },
      { id: 'glass_marble', name: 'Glass Marble', correctBin: 'hard', reason: 'Glass is rigid and resists scratching, meaning it is classified as hard.', icon: '🔮' },
      { id: 'silk_scarf', name: 'Silk Scarf', correctBin: 'soft', reason: 'Silk is a flexible fabric that is very soft to touch and has no rigidity.', icon: '🧣' }
    ]
  }
};

export default function Stage2_Classify({ onComplete }) {
  const [selectedCatId, setSelectedCatId] = useState('lustre');
  const [itemsLeft, setItemsLeft] = useState(CATEGORIES.lustre.items);
  const [bin1Items, setBin1Items] = useState([]);
  const [bin2Items, setBin2Items] = useState([]);
  const [currentSelectedCard, setCurrentSelectedCard] = useState(null);
  const [mentorState, setMentorState] = useState('idle');
  const [mentorText, setMentorText] = useState(
    "Welcome to the Sorting Warehouse! 📦 Classification means grouping items based on common properties. Choose a property category to sort first."
  );
  const [completedCategories, setCompletedCategories] = useState({});

  const activeCategory = CATEGORIES[selectedCatId];

  const handleSwitchCategory = (catId) => {
    setSelectedCatId(catId);
    setItemsLeft(CATEGORIES[catId].items);
    setBin1Items([]);
    setBin2Items([]);
    setCurrentSelectedCard(null);
    setMentorState('idle');
    setMentorText(`You are now sorting by ${CATEGORIES[catId].title}. ${CATEGORIES[catId].description}`);
  };

  const handleSortItem = (item, targetBinId) => {
    if (item.correctBin === targetBinId) {
      // Remove from pool
      setItemsLeft(prev => prev.filter(i => i.id !== item.id));
      
      // Add to corresponding bin list
      if (targetBinId === activeCategory.bin1.id) {
        setBin1Items(prev => [...prev, item]);
      } else {
        setBin2Items(prev => [...prev, item]);
      }

      setMentorState('success');
      setMentorText(`Correct! ${item.reason}`);
      setCurrentSelectedCard(null);

      // Check if all items in active category are sorted
      const remaining = itemsLeft.filter(i => i.id !== item.id).length;
      if (remaining === 0) {
        setCompletedCategories(prev => ({ ...prev, [selectedCatId]: true }));
        setMentorText(`Spectacular! You have completed sorting by ${activeCategory.title}! Feel free to try another property or proceed to Stage 3.`);
      }
    } else {
      setMentorState('error');
      setMentorText(`Hmm, the ${item.name} does not seem to fit there. Let's think about its properties!`);
    }
  };

  const resetActiveCategory = () => {
    setItemsLeft(activeCategory.items);
    setBin1Items([]);
    setBin2Items([]);
    setCurrentSelectedCard(null);
    setMentorState('idle');
    setMentorText(`Reset complete! Let's sort the ${activeCategory.title} list again.`);
  };

  const totalCompleted = Object.keys(completedCategories).length;
  const isEligibleToProceed = totalCompleted > 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
      {/* Sorting Workspace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Category selector panel */}
        <div className="glass-panel" style={{ padding: '1rem', background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Layers size={18} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Choose Property:</span>
            {Object.keys(CATEGORIES).map((catId) => (
              <button
                key={catId}
                onClick={() => handleSwitchCategory(catId)}
                className={`outline ${selectedCatId === catId ? 'active' : ''}`}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px'
                }}
              >
                {CATEGORIES[catId].title}
                {completedCategories[catId] && (
                  <CheckCircle size={10} style={{ color: 'var(--success)', marginLeft: '0.25rem' }} />
                )}
              </button>
            ))}
          </div>

          <button 
            onClick={resetActiveCategory}
            className="outline" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '6px', gap: '0.25rem' }}
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>

        {/* Sorting Deck */}
        <div className="glass-panel" style={{ 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          minHeight: '340px',
          justifyContent: 'space-between'
        }}>
          {/* Unsorted Items Pile */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-heading)' }}>
                Objects to Classify ({itemsLeft.length} left)
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click a card, then choose a destination bin below.
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', minHeight: '80px', padding: '0.5rem', background: 'var(--canvas-bg)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
              {itemsLeft.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  🎉 All objects sorted successfully in this category!
                </div>
              ) : (
                itemsLeft.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentSelectedCard(item)}
                    layoutId={item.id}
                    whileHover={{ scale: 1.05 }}
                    style={{
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: currentSelectedCard?.id === item.id 
                        ? '2px solid var(--accent)' 
                        : '1px solid var(--border)',
                      background: currentSelectedCard?.id === item.id 
                        ? 'var(--accent-bg)' 
                        : 'var(--btn-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      cursor: 'pointer',
                      boxShadow: currentSelectedCard?.id === item.id 
                        ? '0 0 10px rgba(99,102,241,0.2)' 
                        : 'none'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontWeight: '500' }}>{item.name}</span>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Bins Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Bin 1 */}
            <div 
              style={{
                background: activeCategory.bin1.color,
                border: `2px dashed ${activeCategory.bin1.borderColor}`,
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                  {activeCategory.bin1.name}
                </span>
                {currentSelectedCard && (
                  <button 
                    onClick={() => handleSortItem(currentSelectedCard, activeCategory.bin1.id)}
                    className="success"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}
                  >
                    Place Here
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {bin1Items.map((item) => (
                  <span 
                    key={item.id} 
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {item.icon} {item.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Bin 2 */}
            <div 
              style={{
                background: activeCategory.bin2.color,
                border: `2px dashed ${activeCategory.bin2.borderColor}`,
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                  {activeCategory.bin2.name}
                </span>
                {currentSelectedCard && (
                  <button 
                    onClick={() => handleSortItem(currentSelectedCard, activeCategory.bin2.id)}
                    className="success"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}
                  >
                    Place Here
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {bin2Items.map((item) => (
                  <span 
                    key={item.id} 
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border)',
                      padding: '0.35rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    {item.icon} {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Area with AI Mentor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Progress Card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-heading)' }}>
            Case 2 Progress
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>Lustre Sorter</span>
              <span style={{ fontWeight: 'bold', color: completedCategories.lustre ? 'var(--success)' : 'var(--text-secondary)' }}>
                {completedCategories.lustre ? 'Completed ✓' : 'In Progress'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span>Hardness Sorter</span>
              <span style={{ fontWeight: 'bold', color: completedCategories.hardness ? 'var(--success)' : 'var(--text-secondary)' }}>
                {completedCategories.hardness ? 'Completed ✓' : 'In Progress'}
              </span>
            </div>
          </div>

          {isEligibleToProceed && (
            <motion.button
              onClick={onComplete}
              className="success"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                marginTop: '1.25rem',
                fontSize: '0.85rem',
                padding: '0.6rem',
                gap: '0.35rem'
              }}
            >
              Solve Case & Proceed <ArrowRight size={14} />
            </motion.button>
          )}
        </div>

        {/* AI Mentor */}
        <AIMentor 
          state={mentorState} 
          text={mentorText} 
        />
      </div>
    </div>
  );
}
