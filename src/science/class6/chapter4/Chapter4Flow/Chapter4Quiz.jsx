import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const quizData = [
  {
    id: 1,
    title: "Quiz 1",
    question: "Which of the following groups contains only magnetic materials?",
    options: [
      "Wood, rubber, glass",
      "Iron, nickel, cobalt",
      "Plastic, paper, cloth",
      "Copper, aluminium, brass"
    ],
    correctIndex: 1,
    explanation: "Magnetic materials are those that get attracted towards a magnet. Iron, nickel, and cobalt are metals that show this property strongly, so they are called magnetic materials. Wood, rubber, glass, plastic, paper, and cloth are non-magnetic and are never attracted to a magnet. Copper, aluminium, and brass are metals but they are not attracted to ordinary magnets, so they are non-magnetic too. This is why option B is the only group made entirely of magnetic materials."
  },
  {
    id: 2,
    title: "Quiz 2",
    question: "Sailors in ancient times used a naturally occurring magnetic stone to find directions at sea. What is this stone called?",
    options: [
      "Iron ore",
      "Quartz stone",
      "Granite stone",
      "Lodestone"
    ],
    correctIndex: 3,
    explanation: "A lodestone is a naturally occurring magnet that was discovered in ancient times and used by early travellers and sailors. It has the natural property of attracting iron objects and aligning in the north-south direction when suspended freely. Iron ore is a general term for rock containing iron, but it is not automatically magnetic like a lodestone. Quartz and granite are ordinary rocks with no magnetic property at all, so they could never help sailors find directions."
  },
  {
    id: 3,
    title: "Quiz 3",
    question: "When a bar magnet is freely suspended by a thread and allowed to rest, why does it always settle in the north-south direction?",
    options: [
      "Because the Earth itself behaves like a giant magnet",
      "Because the thread naturally twists towards the north",
      "Because air currents push the magnet towards the north",
      "Because gravity pulls the magnet's north pole down"
    ],
    correctIndex: 0,
    explanation: "The Earth behaves like a huge magnet with its own north and south magnetic poles. When a bar magnet is suspended freely, its own poles interact with the Earth's magnetic field and align with it, so the magnet always comes to rest along the north-south direction. This has nothing to do with air currents, thread twisting, or gravity, since gravity affects weight and not magnetic alignment. This natural behaviour is the basic principle behind how a magnetic compass works."
  },
  {
    id: 4,
    title: "Quiz 4",
    question: "Iron filings are sprinkled on a sheet of paper and a bar magnet is placed over them. Where will the maximum number of iron filings stick, and what does this tell us?",
    options: [
      "They stick equally everywhere, showing the magnet is uniform",
      "They stick only in the middle, showing the centre is strongest",
      "They stick mostly near the two ends, showing poles are strongest there",
      "They stick randomly, showing magnetism has no fixed pattern"
    ],
    correctIndex: 2,
    explanation: "When iron filings are sprinkled around a bar magnet, most of them cling near the two ends of the magnet, with very few sticking to the middle portion. This shows that the magnetic force is strongest at the two ends, which are called the poles of the magnet. The middle region has very weak magnetic attraction compared to the ends. This simple activity helps us understand that every magnet, no matter its shape, has two regions of strongest attraction called its poles."
  },
  {
    id: 5,
    title: "Quiz 5",
    question: "In a typical magnetic compass, the needle has one end painted red. What does this red end represent, and how is the compass used to find directions?",
    options: [
      "It marks the heaviest end, used to balance the needle only",
      "It marks the north-seeking pole, and the dial is rotated to match it with the marked north",
      "It marks the south-seeking pole, so it should be pointed away from north",
      "It is purely decorative and has no role in direction finding"
    ],
    correctIndex: 1,
    explanation: "The red end of a compass needle is usually its North pole, also called the north-seeking pole, because it always points towards the Earth's north direction. To use the compass, it is placed on a flat surface and the needle is allowed to settle, then the box is gently rotated until the north and south marks on the dial line up with the needle. Once aligned, all the other directions on the dial become correct too. This system lets travellers, sailors, and hikers find their way even without seeing the sun or stars."
  },
  {
    id: 6,
    title: "Quiz 6",
    question: "A mechanic repairing a gadget keeps dropping small steel screws while working, which wastes time. Based on what you know about magnets, what is the best solution?",
    options: [
      "Rub a magnet on the tip of the screwdriver so it holds the steel screws in place",
      "Wrap the screwdriver tip with cloth to increase grip",
      "Heat the screwdriver tip slightly before using it",
      "Use a longer screwdriver so screws do not slip as easily"
    ],
    correctIndex: 0,
    explanation: "Steel screws contain iron, which is a magnetic material and gets attracted to a magnet. If the mechanic strokes a magnet along the screwdriver tip, the tip itself becomes slightly magnetized and can hold the steel screws firmly while working. Wrapping the tip with cloth or using a longer screwdriver would not solve the actual problem of screws falling. Heating the tip is actually harmful because heat can reduce or destroy the magnetic property of a magnet, so it would never help in this situation."
  },
  {
    id: 7,
    title: "Quiz 7",
    question: "A steel paper clip has fallen into a glass of water. You want to remove it without wetting your fingers or the magnet. What should you do?",
    options: [
      "Pour out the water first and then pick up the clip with bare hands",
      "Stir the water quickly so the clip floats to the top on its own",
      "Heat the glass so the clip rises with the steam",
      "Hold a magnet against the outside wall of the glass and move it to draw the clip up"
    ],
    correctIndex: 3,
    explanation: "A magnetic effect can pass through non-magnetic materials like glass without losing much strength, so a magnet held against the outside of the glass can still attract the steel clip inside. By slowly moving the magnet along the outer wall of the glass, the clip can be guided upward and out of the water without ever touching the water. Pouring out the water or stirring it would be messy and unreliable, and heating the glass would not help since heat does not lift a metal object out of liquid. This trick works because the magnetic force does not need direct contact to act on magnetic materials."
  },
  {
    id: 8,
    title: "Quiz 8",
    question: "Reshma has three identical-looking metal bars. Two of them are magnets and one is a plain iron bar. She is not allowed to use any other object. How can she reliably tell which two are magnets?",
    options: [
      "Weigh each bar since magnets are always heavier than iron",
      "Check the colour of each bar since magnets are always painted red",
      "Bring the ends of each pair close together and see which pair shows repulsion, since only two real magnets can repel each other",
      "Drop each bar and see which one bounces higher"
    ],
    correctIndex: 2,
    explanation: "A plain iron bar will always be attracted to a magnet, no matter which end is brought close, but two real magnets will repel each other when their like poles face one another. This means repulsion is proof that both bars are magnets, since an iron bar can never repel a magnet. Attraction alone is not proof because a magnet attracting an iron bar looks the same as two magnets attracting through unlike poles. Weighing, checking colour, or dropping the bars will not reveal which ones are truly magnetic, since these features do not depend on magnetism at all."
  },
  {
    id: 9,
    title: "Quiz 9",
    question: "A student places a piece of wood, then a cardboard sheet, and then a thin glass sheet between a bar magnet and a compass needle, one at a time. What is observed in the deflection of the needle each time?",
    options: [
      "The needle deflects the same way in all three cases, showing magnetism passes through them",
      "The needle stops deflecting completely once wood is placed",
      "The needle deflects only when glass is used, not wood or cardboard",
      "The needle spins continuously due to the extra materials"
    ],
    correctIndex: 0,
    explanation: "Wood, cardboard, and glass are all non-magnetic materials, and the activity shows that the compass needle deflects in the same way whether or not these sheets are placed between the magnet and the needle. This proves that the magnetic effect of a magnet can act through non-magnetic materials without losing its strength. If the materials blocked magnetism, the needle would stop moving once they were placed in between, which is not what happens. This is the same reason a magnet can attract a paper clip inside a glass of water or through a thin cardboard tray."
  },
  {
    id: 10,
    title: "Quiz 10",
    question: "Atharv rolls a bar magnet over a heap of steel U-clips and marks three positions: A (one end), B (middle), and C (other end). Which set of readings best matches what he is likely to observe?",
    options: [
      "Position A: 2, Position B: 10, Position C: 10",
      "Position A: 10, Position B: 10, Position C: 2",
      "Position A: 2, Position B: 2, Position C: 10",
      "Position A: 10, Position B: 2, Position C: 10"
    ],
    correctIndex: 3,
    explanation: "Since the poles of a magnet are located at its two ends, the maximum number of steel clips will be attracted and stuck near positions A and C, which are the ends of the bar magnet. Position B is the middle of the magnet, where the magnetic force is weakest, so very few clips will stick there. Option D correctly shows high numbers of ten at both ends and a low number of two in the middle, matching the pattern seen in the iron filings activity earlier in the chapter. The other options wrongly show high attraction at only one end or in the middle, which does not match how magnetic poles behave."
  },
  {
    id: 11,
    title: "Quiz 11",
    question: "Two ring magnets X and Y are placed on a vertical wooden rod. Magnet X floats above magnet Y without touching it. What is the most likely explanation, and how can X be made to touch Y without pushing either magnet?",
    options: [
      "X is heavier than air, so it naturally floats; nothing more is needed",
      "The facing poles of X and Y are alike, causing repulsion; flipping magnet X so unlike poles face each other will let them attract and touch",
      "The rod is magnetic and pushes X upward on its own",
      "X is not a real magnet, so it cannot fall onto Y"
    ],
    correctIndex: 1,
    explanation: "When two magnets are placed with their like poles facing each other, such as North facing North, they repel and push apart, which is why ring magnet X stays suspended above Y instead of falling. If magnet X is turned over so that its pole facing Y is now unlike Y's pole, for example North facing South, the two ring magnets will attract each other and come together. The wooden rod itself has no magnetic property and only serves to keep the magnets aligned vertically. This activity is the same basic idea used in maglev trains, where repulsion between magnets is used to make objects float."
  },
  {
    id: 12,
    title: "Quiz 12",
    question: "A \"More to know\" box in the chapter explains how magnets should be stored safely. Which storage method described is correct and why?",
    options: [
      "Keep magnets loose and separated in a drawer so they do not touch",
      "Store magnets near mobile phones so their fields balance each other",
      "Store magnets in pairs with unlike poles together, with a piece of wood in between and soft iron pieces placed across the ends",
      "Store magnets standing upright without any keeper pieces"
    ],
    correctIndex: 2,
    explanation: "The chapter explains that magnets should be stored in pairs with unlike poles kept on the same side, with a small piece of wood placed between them and soft iron pieces, called keepers, placed across the ends. This arrangement forms a closed loop for the magnetic field, which helps the magnets retain their strength for a longer time. Storing magnets loosely, near mobile phones, or without keeper pieces can actually weaken their magnetism or damage nearby electronic devices. This careful storage method is important because magnets can also lose their strength if they are heated, dropped, or hammered."
  },
  {
    id: 13,
    title: "Quiz 13",
    question: "You are given an unmarked magnet and a second magnet whose poles are already labelled N and S. Using only these two magnets, how can you reliably find the poles of the unmarked one?",
    options: [
      "Bring any end of the unmarked magnet near the labelled North pole; if it is attracted, that end must be the labelled magnet's South pole",
      "Weigh both magnets, since the heavier end is always North",
      "Hold the unmarked magnet near a mobile phone and see which end pulls harder",
      "Suspend the unmarked magnet freely by a thread first to note which end points north, and confirm using repulsion, since only two true magnets can repel each other, unlike attraction which does not prove magnet identity"
    ],
    correctIndex: 3,
    explanation: "The most reliable method is to freely suspend the unmarked magnet by a thread and observe which end always comes to rest pointing towards the north, since this end is its North pole. To confirm the poles further, repulsion should be used because only two genuine magnets repel each other, so bringing the labelled North pole near the suspected North end of the unmarked magnet should cause repulsion. Simple attraction is not reliable proof because even a plain iron bar would be attracted to a labelled magnet, making it impossible to know for certain which pole is which. Weighing the magnet or testing it near a mobile phone gives no accurate information about polarity and could even damage the phone."
  },
  {
    id: 14,
    title: "Quiz 14",
    question: "What is the North pole of a magnet, as defined in the chapter?",
    options: [
      "The end of a freely suspended magnet that points towards the north direction",
      "The end that is always painted blue",
      "The heavier end of the magnet",
      "The end that always repels a compass needle"
    ],
    correctIndex: 0,
    explanation: "The North pole, also called the north-seeking pole, is the end of a freely suspended magnet that comes to rest pointing towards the Earth's north direction. This happens because the Earth behaves like a giant magnet, and the magnet aligns with the Earth's magnetic field. The North pole is usually painted red in most magnets, not blue, and its identity has nothing to do with weight. Also, the North pole of a magnet actually attracts the South pole of a compass needle rather than always repelling it, since compass needles have both a north and a south end."
  },
  {
    id: 15,
    title: "Quiz 15",
    question: "If a bar magnet is broken into two smaller pieces, what will be true about the poles of each new piece?",
    options: [
      "Only the original North pole piece will have a pole; the other piece becomes non-magnetic",
      "Both pieces lose their magnetism completely",
      "Each broken piece will have its own North and South pole, since a single pole cannot exist alone",
      "One piece will have two North poles and the other will have two South poles"
    ],
    correctIndex: 2,
    explanation: "The chapter explains that it is not possible to obtain a magnet with a single pole, because North and South poles always exist together in pairs, even in the smallest piece of a broken magnet. So when a bar magnet is broken into two pieces, each new smaller piece will develop its own complete North pole and South pole. The pieces do not lose their magnetism, and it is impossible for a piece to end up with two poles of the same kind only. This property shows that magnetic poles are always found as a pair, no matter how many times a magnet is divided."
  },
  {
    id: 16,
    title: "Quiz 16",
    question: "Two toy cars are fitted with bar magnets, arranged so their facing ends are both North poles, as shown in the chapter's matchbox car activity. What will happen when the cars are pushed towards each other?",
    options: [
      "The cars will stick together immediately",
      "The cars will push apart and move away from each other due to repulsion",
      "The cars will spin in circles",
      "Nothing will happen since cars cannot be affected by magnets"
    ],
    correctIndex: 1,
    explanation: "When the facing poles of both magnets are the same, in this case both North poles, the like poles repel each other rather than attract. As the cars are pushed closer, the repelling force between the two North poles pushes the cars apart, making them move away from each other instead of colliding. If the facing poles had been unlike, such as North facing South, the cars would have attracted and moved towards each other instead. This activity is a fun way to directly observe the rule that like poles repel while unlike poles attract."
  },
  {
    id: 17,
    title: "Quiz 17",
    question: "Three bar magnets are joined together on a table in an L-shaped arrangement. End 5 is marked as North (N). If the magnets are arranged so that opposite ends of each joined magnet carry opposite polarity, what is the polarity of end 1 at the far end of the arrangement?",
    options: [
      "South (S), since polarity alternates consistently along the connected magnets from the marked end",
      "North (N), same as end 5",
      "It cannot have a fixed polarity since it is a joint of three magnets",
      "It has no polarity because it is in the middle of the shape"
    ],
    correctIndex: 0,
    explanation: "In a magnet, opposite ends always carry opposite polarity, so if one end is South, the connected end of that same magnet piece will be North, and this pattern continues along each joined magnet. Starting from end 5 marked North and tracing through each bar magnet in the L-shaped arrangement, the polarity keeps switching consistently at each magnet's far end. Following this logic through the three joined magnets, end 1, which is at the farthest point from end 5, works out to be South. Every point along a magnet has one fixed polarity based on which pole it belongs to, so options claiming no polarity or an unclear polarity are incorrect."
  },
  {
    id: 18,
    title: "Quiz 18",
    question: "A Maglev train is designed to travel without touching the tracks. Based on what you have learned about attraction and repulsion, how does this most likely work?",
    options: [
      "The train uses fans to blow air beneath it, unrelated to magnetism",
      "The train's wheels spin so fast that friction disappears",
      "Magnets on the train and the track are arranged so like poles face each other, creating repulsion that lifts the train above the track",
      "The train uses only attraction between unlike poles to pull itself forward along the ground"
    ],
    correctIndex: 2,
    explanation: "A Maglev, or magnetic levitation, train uses powerful magnets placed on both the train and the track so that their like poles face one another. This arrangement creates a strong repulsive force, similar to the ring magnets floating experiment in the chapter, which lifts the train slightly above the track and allows it to move without touching the rails. Since there is no direct contact between the train and track, friction is greatly reduced, allowing very high speeds, but this has nothing to do with air fans or spinning wheels. Attraction between unlike poles is sometimes used elsewhere in the system, but the key idea behind levitation itself is repulsion between like poles, not attraction."
  },
  {
    id: 19,
    title: "Quiz 19",
    question: "Long before the modern magnetic compass became common, Indian sailors used a fish-shaped magnetized device floating in a vessel of oil to navigate at sea. What was this device called?",
    options: [
      "Dishakoop",
      "Matsya-yantra",
      "Chumbak-yantra",
      "Uttar-yantra"
    ],
    correctIndex: 1,
    explanation: "The chapter describes an ancient Indian navigation device called the matsya-yantra, also known as machchh-yantra, which used a magnetized fish-shaped piece of iron floating in a vessel of oil. Just like a modern compass needle, this fish-shaped piece would align itself along the north-south direction, allowing sailors to find their way at sea. This shows that magnetic navigation methods were developed and used in India long before the widespread use of the modern circular compass box. The other names given in the options are not the actual historical term used for this traditional Indian navigation tool."
  },
  {
    id: 20,
    title: "Quiz 20",
    question: "You are given a magnet and an identical-looking plain iron bar, but you are not allowed to use any other material or a second magnet. How can you find out which one is the magnet?",
    options: [
      "Check which bar is shinier, since magnets are always more polished",
      "Bring both bars near a wall, and the one that sticks to the wall is the magnet",
      "Measure the length of both bars, since magnets are always shorter",
      "Suspend each bar freely by a thread at its middle; only the true magnet will consistently come to rest in the north-south direction, while the iron bar will settle in any random direction"
    ],
    correctIndex: 3,
    explanation: "Only a true magnet has the special property of aligning itself along the Earth's north-south direction when it is freely suspended and allowed to rotate to rest. A plain iron bar does not have this property and will simply stop at any random direction, since it is not influenced by the Earth's magnetic field in the same organized way. This test does not require touching the bars together or using any other magnet, which makes it perfect for this situation. Checking shininess, sticking to a wall, or measuring length are not valid tests, since none of these features are related to whether an object is magnetic."
  }
];

export default function Chapter4Quiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === quizData[currentQuestion].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };


  const currentQ = quizData[currentQuestion];
  const isFinished = currentQuestion >= quizData.length - 1 && showResult;



  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 3rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-heading)', fontSize: '1.85rem', fontWeight: 800 }}>Test Your Knowledge</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>
          Question {currentQuestion + 1} of {quizData.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', marginBottom: '2.25rem', overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          background: 'var(--accent)', 
          width: `${((currentQuestion) / quizData.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>

      <div className="glass-panel" style={{ background: 'var(--surface)', padding: '2.75rem 3.5rem', borderRadius: '24px', boxShadow: '0 15px 40px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin: '0 0 1.25rem 0', color: 'var(--accent)', fontSize: '1.65rem', fontWeight: 800 }}>{currentQ.title}</h3>
        <p style={{ fontSize: '1.35rem', marginBottom: '2.25rem', lineHeight: '1.65', color: 'var(--text)', fontWeight: 600 }}>{currentQ.question}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {currentQ.options.map((option, index) => {
            let bgColor = 'var(--bg)';
            let borderColor = 'var(--border)';
            let icon = null;

            if (showResult) {
              if (index === currentQ.correctIndex) {
                bgColor = 'rgba(16, 185, 129, 0.1)';
                borderColor = '#10b981';
                icon = <CheckCircle size={24} color="#10b981" />;
              } else if (index === selectedOption) {
                bgColor = 'rgba(239, 68, 68, 0.1)';
                borderColor = '#ef4444';
                icon = <XCircle size={24} color="#ef4444" />;
              }
            } else if (index === selectedOption) {
              borderColor = 'var(--accent)';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.35rem 1.75rem',
                  borderRadius: '14px',
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: 'var(--text)',
                  cursor: showResult ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  opacity: showResult && index !== currentQ.correctIndex && index !== selectedOption ? 0.6 : 1
                }}
              >
                <span style={{ paddingRight: '1rem', lineHeight: '1.5' }}>{option}</span>
                <div style={{ minWidth: '24px' }}>{icon}</div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div style={{ marginTop: '2.5rem', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ padding: '1.75rem 2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', borderLeft: '5px solid var(--accent)' }}>
              <h4 style={{ margin: '0 0 0.65rem 0', color: 'var(--text-heading)', fontSize: '1.3rem', fontWeight: 800 }}>Explanation</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.65', fontSize: '1.2rem' }}>{currentQ.explanation}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.25rem' }}>
              <button
                onClick={handleNext}
                style={{
                  padding: '0.9rem 3rem',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                }}
              >
                {isFinished ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Completion Popup Modal */}
      <AnimatePresence>
        {quizFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               style={{
                 width: '100%', maxWidth: '680px', background: 'var(--surface)',
                 border: '2px solid var(--accent)', borderRadius: '28px',
                 overflow: 'hidden', display: 'flex', flexDirection: 'column',
                 boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7)',
                 padding: '3.5rem 4rem',
                 textAlign: 'center'
               }}
             >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                  <CheckCircle size={80} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 15px rgba(156, 39, 176, 0.6))' }} />
                </div>
                <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Quiz Completed!
                </h2>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid var(--accent)',
                  borderRadius: '20px',
                  padding: '2rem 2.5rem',
                  marginBottom: '2.5rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                  <p style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-heading)', fontWeight: '600' }}>
                    You scored <strong style={{ color: 'var(--accent)', fontSize: '2.4rem' }}>{score}</strong> out of {quizData.length}
                  </p>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {score >= 16 ? "🎉 Outstanding performance! You've mastered Magnets!" : score >= 10 ? "👍 Good effort! Keep practicing to get a perfect score!" : "💪 Keep learning! Review the chapter and try again!"}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                  <button 
                    onClick={resetQuiz}
                    style={{
                      padding: '1.1rem 2rem',
                      background: 'transparent',
                      border: '2px solid var(--border)',
                      color: 'var(--text)',
                      borderRadius: '14px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Restart
                  </button>
                  <button 
                    onClick={() => { if (onComplete) onComplete(score); }}
                    style={{
                      padding: '1.1rem 2rem',
                      background: 'var(--accent)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '14px',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      flex: 1,
                      boxShadow: '0 6px 18px rgba(156, 39, 176, 0.4)'
                    }}
                  >
                    Finish
                  </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
