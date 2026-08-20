import React, { useState } from 'react';
import { CheckCircle2, XCircle, Star, ArrowRight, HelpCircle, RefreshCw, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following is an example of an Herb with a soft, green stem?",
    options: ["Banyan Tree", "Tulsi", "Rose Shrub", "Mango Tree"],
    correctIndex: 1,
    explanation: "Tulsi has a soft, green, non-woody stem and stays short in height, making it an herb!"
  },
  {
    id: 2,
    question: "Which animal can live BOTH in freshwater ponds and on moist land?",
    options: ["Three-Striped Squirrel", "Indian Pond Frog", "Monarch Butterfly", "House Crow"],
    correctIndex: 1,
    explanation: "Pond frogs are true amphibians! They breathe with lungs on land and through moist skin underwater."
  },
  {
    id: 3,
    question: "How are Shrubs like Hibiscus different from Trees?",
    options: [
      "Shrubs have soft non-woody stems",
      "Shrubs have multiple thin woody stems branching near ground level",
      "Shrubs only live underwater",
      "Shrubs have a single thick main trunk"
    ],
    correctIndex: 1,
    explanation: "Shrubs have hard, thin woody stems that branch near the base, unlike trees which have one thick main trunk!"
  },
  {
    id: 4,
    question: "How does a Monarch Butterfly help flowering plants in nature?",
    options: [
      "By digging up roots",
      "By blocking sunlight",
      "By carrying pollen between flowers (Pollination)",
      "By eating the tree bark"
    ],
    correctIndex: 2,
    explanation: "Butterflies sip flower nectar and accidentally transfer pollen grains, helping plants reproduce and make seeds!"
  },
  {
    id: 5,
    question: "Why do House Sparrows and Crows have light hollow bones and wings?",
    options: [
      "To help them swim in deep water",
      "To help them adapt for flying in air",
      "To burrow underground",
      "To sleep during winter"
    ],
    correctIndex: 1,
    explanation: "Birds have light, hollow bones and streamlined bodies with wings to fly easily through air!"
  }
];

export default function QuizModule({ onCompleteQuiz, onAddStars, onAddXP }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === q.correctIndex) {
      sounds.playSuccess();
      setScore((prev) => prev + 1);
      onAddStars(1);
      onAddXP(50);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedOpt(null);
    setIsAnswered(false);

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      sounds.playChestUnlock();
      onCompleteQuiz(score + (selectedOpt === q.correctIndex ? 1 : 0));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/90 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in text-white my-6">
      
      {/* Quiz Progress Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Grade 6 CBSE Quiz Challenge
          </span>
          <h3 className="text-lg font-extrabold">Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/30 px-3 py-1.5 rounded-full text-amber-300 font-bold text-xs">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{score} Stars Earned</span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-4">
        <div 
          className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Statement Card */}
      <div className="my-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-inner">
        <p className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
          {q.question}
        </p>
      </div>

      {/* MCQ Options Grid */}
      <div className="space-y-3">
        {q.options.map((optionText, idx) => {
          let btnStyle = "bg-slate-800/90 border-slate-700 hover:bg-slate-700 text-slate-200";

          if (isAnswered) {
            if (idx === q.correctIndex) {
              btnStyle = "bg-emerald-500 text-slate-950 border-emerald-300 font-extrabold shadow-lg animate-bounce";
            } else if (selectedOpt === idx) {
              btnStyle = "bg-rose-500 text-white border-rose-300 font-bold";
            } else {
              btnStyle = "bg-slate-900/40 text-slate-500 border-slate-800 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border text-left text-sm md:text-base font-semibold transition-all duration-200 flex items-center justify-between shadow-md ${btnStyle}`}
            >
              <span>{optionText}</span>
              {isAnswered && idx === q.correctIndex && (
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
              )}
              {isAnswered && selectedOpt === idx && idx !== q.correctIndex && (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Visible after answer) */}
      {isAnswered && (
        <div className="mt-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-4 animate-fade-in flex items-start gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Prof. Buddy's Explanation
            </span>
            <p className="text-xs md:text-sm text-emerald-100 mt-1 leading-relaxed">
              {q.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Next Question Button */}
      {isAnswered && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition transform active:scale-95"
          >
            <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
