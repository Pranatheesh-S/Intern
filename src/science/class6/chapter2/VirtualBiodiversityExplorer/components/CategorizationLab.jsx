import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, RefreshCw, Sparkles, HelpCircle, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function CategorizationLab({
  discoveredOrganisms,
  onCompleteLab,
  onAddXP
}) {
  const [activeTab, setActiveTab] = useState('plants'); // 'plants' or 'animals'
  
  // State for Table 2.1 (Plants)
  const [plantAnswers, setPlantAnswers] = useState({
    tulsi: '',
    rose_plants: '',
    tree: ''
  });
  
  // State for Table 2.2 (Animals)
  const [animalAnswers, setAnimalAnswers] = useState({
    frog: '',
    squirrel: '',
    butterfly: '',
    monkey: '',
    sparrow: '',
    crow: ''
  });

  const [completedPlantTable, setCompletedPlantTable] = useState(false);
  const [completedAnimalTable, setCompletedAnimalTable] = useState(false);

  // Correct Answer Key
  const plantKeys = {
    tulsi: 'herb',
    rose_plants: 'shrub',
    tree: 'tree'
  };

  const animalKeys = {
    frog: 'both',
    squirrel: 'land',
    butterfly: 'air',
    monkey: 'land',
    sparrow: 'air',
    crow: 'air'
  };

  const handlePlantSelect = (plantId, category) => {
    sounds.playPop();
    const updated = { ...plantAnswers, [plantId]: category };
    setPlantAnswers(updated);

    // Check if table complete
    const isAllCorrect = Object.keys(plantKeys).every(id => updated[id] === plantKeys[id]);
    if (isAllCorrect && !completedPlantTable) {
      setCompletedPlantTable(true);
      sounds.playSuccess();
      onAddXP(75);
    }
  };

  const handleAnimalSelect = (animalId, habitat) => {
    sounds.playPop();
    const updated = { ...animalAnswers, [animalId]: habitat };
    setAnimalAnswers(updated);

    // Check if table complete
    const isAllCorrect = Object.keys(animalKeys).every(id => updated[id] === animalKeys[id]);
    if (isAllCorrect && !completedAnimalTable) {
      setCompletedAnimalTable(true);
      sounds.playSuccess();
      onAddXP(75);
    }
  };

  const handleProceedToQuiz = () => {
    sounds.playStar();
    onCompleteLab();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in text-white my-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> CBSE Class 6 Table 2.1 & 2.2 Lab
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Categorize Nature Discoveries 📊
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Help Prof. Buddy fill the observation tables by classifying stems, heights, and habitats.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('plants');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 ${
              activeTab === 'plants'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🌿 Table 2.1: Plants</span>
            {completedPlantTable && <CheckCircle2 className="w-4 h-4 text-emerald-950" />}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('animals');
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition flex items-center gap-2 ${
              activeTab === 'animals'
                ? 'bg-emerald-500 text-slate-950 shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🐾 Table 2.2: Animals</span>
            {completedAnimalTable && <CheckCircle2 className="w-4 h-4 text-emerald-950" />}
          </button>
        </div>
      </div>

      {/* Tab 1: Table 2.1 Plants */}
      {activeTab === 'plants' && (
        <div className="py-6 space-y-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl text-xs md:text-sm text-emerald-200">
            💡 <strong>Guide:</strong> Classify each plant into <strong>Herb</strong> (soft stem), <strong>Shrub</strong> (woody, multiple stems), or <strong>Tree</strong> (thick trunk).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tulsi */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-center pb-3 border-b border-slate-700">
                <span className="text-4xl">🌿</span>
                <h3 className="font-bold text-base mt-2">Tulsi & Soft Herbs</h3>
                <p className="text-xs text-slate-400 mt-0.5">Stem: Soft & tender green stem</p>
              </div>

              <div className="mt-4 space-y-2">
                {['herb', 'shrub', 'tree'].map((cat) => {
                  const selected = plantAnswers.tulsi === cat;
                  const isCorrect = cat === 'herb';
                  return (
                    <button
                      key={cat}
                      onClick={() => handlePlantSelect('tulsi', cat)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold capitalize border transition ${
                        selected
                          ? isCorrect
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                            : 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'herb' ? '🌱 Herb (Soft)' : cat === 'shrub' ? '🌳 Shrub (Bushy)' : '🌲 Tree (Trunk)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hibiscus / Rose */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-center pb-3 border-b border-slate-700">
                <span className="text-4xl">🌺</span>
                <h3 className="font-bold text-base mt-2">Rose & Hibiscus</h3>
                <p className="text-xs text-slate-400 mt-0.5">Stem: Hard woody stems branching near ground</p>
              </div>

              <div className="mt-4 space-y-2">
                {['herb', 'shrub', 'tree'].map((cat) => {
                  const selected = plantAnswers.rose_plants === cat;
                  const isCorrect = cat === 'shrub';
                  return (
                    <button
                      key={cat}
                      onClick={() => handlePlantSelect('rose_plants', cat)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold capitalize border transition ${
                        selected
                          ? isCorrect
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                            : 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'herb' ? '🌱 Herb (Soft)' : cat === 'shrub' ? '🌳 Shrub (Bushy)' : '🌲 Tree (Trunk)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tree */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-center pb-3 border-b border-slate-700">
                <span className="text-4xl">🌳</span>
                <h3 className="font-bold text-base mt-2">Banyan & Mango</h3>
                <p className="text-xs text-slate-400 mt-0.5">Stem: Very thick main brown trunk</p>
              </div>

              <div className="mt-4 space-y-2">
                {['herb', 'shrub', 'tree'].map((cat) => {
                  const selected = plantAnswers.tree === cat;
                  const isCorrect = cat === 'tree';
                  return (
                    <button
                      key={cat}
                      onClick={() => handlePlantSelect('tree', cat)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold capitalize border transition ${
                        selected
                          ? isCorrect
                            ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-md'
                            : 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {cat === 'herb' ? '🌱 Herb (Soft)' : cat === 'shrub' ? '🌳 Shrub (Bushy)' : '🌲 Tree (Trunk)'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Table 2.2 Animals */}
      {activeTab === 'animals' && (
        <div className="py-6 space-y-6">
          <div className="bg-teal-950/40 border border-teal-500/30 p-4 rounded-2xl text-xs md:text-sm text-teal-200">
            💡 <strong>Guide:</strong> Classify animal habitats into <strong>Land</strong>, <strong>Water</strong>, <strong>Both (Amphibian)</strong>, or <strong>Air (Flying)</strong>.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'frog', name: 'Indian Pond Frog', emoji: '🐸', hint: 'Jumps & swims near pond' },
              { id: 'squirrel', name: 'Palm Squirrel', emoji: '🐿️', hint: 'Climbs tree trunks & land' },
              { id: 'butterfly', name: 'Monarch Butterfly', emoji: '🦋', hint: 'Flies between flowers' },
              { id: 'monkey', name: 'Rhesus Monkey', emoji: '🐒', hint: 'Treetops & forest land' },
              { id: 'sparrow', name: 'House Sparrow', emoji: '🐦', hint: 'Perches & flies' },
              { id: 'crow', name: 'House Crow', emoji: '🐦‍⬛', hint: 'Soars in clear sky' }
            ].map((anim) => (
              <div key={anim.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                <div className="text-center pb-2 border-b border-slate-700">
                  <span className="text-3xl">{anim.emoji}</span>
                  <h4 className="font-bold text-sm mt-1">{anim.name}</h4>
                  <p className="text-[11px] text-slate-400">{anim.hint}</p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'land', label: '🏞️ Land' },
                    { id: 'water', label: '🌊 Water' },
                    { id: 'both', label: '🐸 Both' },
                    { id: 'air', label: '🪶 Air' }
                  ].map((hab) => {
                    const selected = animalAnswers[anim.id] === hab.id;
                    const isCorrect = animalKeys[anim.id] === hab.id;
                    return (
                      <button
                        key={hab.id}
                        onClick={() => handleAnimalSelect(anim.id, hab.id)}
                        className={`py-2 px-1.5 rounded-lg text-[11px] font-bold border transition ${
                          selected
                            ? isCorrect
                              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
                              : 'bg-rose-500 text-white border-rose-300'
                            : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {hab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Earn 75 XP per table completed!</span>
        </div>

        <button
          onClick={handleProceedToQuiz}
          disabled={!completedPlantTable && !completedAnimalTable}
          className={`px-6 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition shadow-xl ${
            completedPlantTable || completedAnimalTable
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:from-emerald-400 hover:to-teal-300 active:scale-95 shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          <span>Proceed to Science Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
