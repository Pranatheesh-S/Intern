// Shared Data & Constants for Class 6 Maths Chapter 1: Patterns in Mathematics
// Based directly on NCERT Ganita Prakash Grade 6 Curriculum & Official Solutions

export const PASTEL_THEMES = [
  { id: 'periwinkle', name: '🌌 Soft Sky & Pastel Periwinkle', primary: '#6366f1', bg: '#f0f4ff', border: '#c7d2fe', badge: '#e0e7ff', text: '#3730a3', desc: 'Serene pastel blue-violet & tranquil sky' },
  { id: 'lavender', name: '☁️ Soft Lavender', primary: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', badge: '#ede9fe', text: '#5b21b6', desc: 'Calming lavender and bright violet' },
  { id: 'deepviolet', name: '🌿 Deep Violet', primary: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', badge: '#ddd6fe', text: '#4c1d95', desc: 'Rich velvet purple and soft violet' },
  { id: 'amethyst', name: '🍑 Soft Amethyst', primary: '#9333ea', bg: '#f3e8ff', border: '#d8b4fe', badge: '#f3e8ff', text: '#581c87', desc: 'Vibrant amethyst and crystal light' },
  { id: 'wisteria', name: '🍯 Wisteria Purple', primary: '#a855f7', bg: '#faf5ff', border: '#e9d5ff', badge: '#f3e8ff', text: '#6b21a8', desc: 'Warm wisteria and floral purple' },
];

export const SEQUENCES = [
  { id: 'ones', name: "All 1's", formula: 'a_n = 1', rule: 'Every single term is constant 1.', terms: [1, 1, 1, 1, 1, 1, 1, 1], calc: () => 1 },
  { id: 'counting', name: 'Counting Numbers', formula: 'a_n = n', rule: 'Start at 1, add 1 each step (+1).', terms: [1, 2, 3, 4, 5, 6, 7, 8], calc: (n) => n },
  { id: 'odd', name: 'Odd Numbers', formula: 'a_n = 2n - 1', rule: 'Start at 1, add 2 each step (+2).', terms: [1, 3, 5, 7, 9, 11, 13, 15], calc: (n) => 2 * n - 1 },
  { id: 'even', name: 'Even Numbers', formula: 'a_n = 2n', rule: 'Start at 2, add 2 each step (+2).', terms: [2, 4, 6, 8, 10, 12, 14, 16], calc: (n) => 2 * n },
  { id: 'triangular', name: 'Triangular Numbers', formula: 'a_n = n(n+1)/2', rule: 'Add consecutive integers: 1, 1+2, 1+2+3, 1+2+3+4...', terms: [1, 3, 6, 10, 15, 21, 28, 36], calc: (n) => (n * (n + 1)) / 2 },
  { id: 'squares', name: 'Square Numbers', formula: 'a_n = n^2', rule: 'Multiply a number by itself (n × n).', terms: [1, 4, 9, 16, 25, 36, 49, 64], calc: (n) => n * n },
  { id: 'cubes', name: 'Cube Numbers', formula: 'a_n = n^3', rule: 'Multiply a number three times (n × n × n).', terms: [1, 8, 27, 64, 125, 216, 343, 512], calc: (n) => n * n * n },
  { id: 'virahanka', name: 'Virahānka (Fibonacci)', formula: 'a_n = a_{n-1} + a_{n-2}', rule: 'Start with 1, 2. Each term is sum of previous two.', terms: [1, 2, 3, 5, 8, 13, 21, 34], calc: (n) => {
    let a = 1, b = 2;
    if (n === 1) return 1;
    if (n === 2) return 2;
    for (let i = 3; i <= n; i++) {
      let temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }},
  { id: 'powers2', name: 'Powers of 2', formula: 'a_n = 2^{n-1}', rule: 'Start at 1, multiply by 2 at each step.', terms: [1, 2, 4, 8, 16, 32, 64, 128], calc: (n) => Math.pow(2, n - 1) },
  { id: 'powers3', name: 'Powers of 3', formula: 'a_n = 3^{n-1}', rule: 'Start at 1, multiply by 3 at each step.', terms: [1, 3, 9, 27, 81, 243, 729, 2187], calc: (n) => Math.pow(3, n - 1) }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    section: '1.1',
    pageRef: 'Page 2',
    question: 'How did discovering patterns in planetary and celestial motions propel human civilisation forward?',
    options: [
      'It only helped artists paint pictures of the night sky',
      'It led to the law of gravitation, satellite navigation, and interplanetary space missions',
      'It made clocks completely unnecessary for daily life',
      'It showed that the stars never move in any fixed pattern'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.1: Understanding planetary patterns led directly to the theory of gravitation, orbital mechanics, GPS satellites, and landing lunar probes.'
  },
  {
    id: 2,
    section: '1.2',
    pageRef: 'Page 3',
    question: 'Who first discovered the sequence (1, 2, 3, 5, 8, 13...) while analyzing Sanskrit poetic syllable rhythms?',
    options: [
      'Isaac Newton in 1687 CE',
      'Acharya Virahānka (c. 700 CE)',
      'Euclid of Alexandria in 300 BCE',
      'Pythagoras of Samos'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.2: Acharya Virahānka discovered this sequence centuries before Fibonacci while measuring short (Laghu=1 beat) and long (Guru=2 beats) poetic meters.'
  },
  {
    id: 3,
    section: '1.3',
    pageRef: 'Page 5',
    question: 'Why does the number 36 hold a celebrated dual identity in mathematics?',
    options: [
      'It is both the 8th triangular number (T₈) and the 6th square number (6²)',
      'It is divisible only by odd numbers',
      'It can only be formed into a straight line of dots',
      'It is the smallest cube number in Table 1'
    ],
    correct: 0,
    explanation: 'NCERT Sec 1.3: 36 dots arrange into an equilateral stepped triangle (1+2+...+8=36) and a 6×6 square grid (6×6=36).'
  },
  {
    id: 4,
    section: '1.3',
    pageRef: 'Page 5',
    question: 'In the hexagonal number sequence (1, 7, 19, 37...), what is the next number and its expansion rule?',
    options: [
      '48 (Add 11)',
      '61 (Add 24, as consecutive ring differences increase by multiples of 6)',
      '55 (Add 18)',
      '64 (Add 27)'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.3 Q4: 1 (+6) → 7 (+12) → 19 (+18) → 37 (+24) → 61. Hexagonal ring layers grow in exact multiples of 6.'
  },
  {
    id: 5,
    section: '1.4',
    pageRef: 'Page 7',
    question: 'According to the visual proof of L-shaped gnomons, what is the sum of the first 100 consecutive odd numbers?',
    options: [
      '5,050',
      '10,000 (100²)',
      '1,000',
      '20,000'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.4: Sum of first n odd numbers equals n². For n = 100: 1 + 3 + 5 + ... + 199 = 100² = 10,000.'
  },
  {
    id: 6,
    section: '1.4',
    pageRef: 'Page 8',
    question: 'What is the exact sum of the counting numbers up and down: 1 + 2 + 3 + ... + 99 + 100 + 99 + ... + 2 + 1?',
    options: [
      '10,000 (100²)',
      '5,050',
      '9,900',
      '10,100'
    ],
    correct: 0,
    explanation: 'NCERT Sec 1.4 Q2: Diagonal decomposition of a 100×100 square grid gives lines of lengths 1, 2, ..., 100, ..., 1. Sum = 100² = 10,000.'
  },
  {
    id: 7,
    section: '1.4',
    pageRef: 'Page 8',
    question: 'What sequence do you obtain when you add up pairs of consecutive triangular numbers: (1+3), (3+6), (6+10), (10+15)...?',
    options: [
      'Cube numbers (1, 8, 27, 64)',
      'Square numbers (4, 9, 16, 25)',
      'Powers of 2 (2, 4, 8, 16)',
      'Odd numbers (3, 5, 7, 9)'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.4 Q5: Two adjacent triangular arrays interlock along their hypotenuse to build a perfect square: T_{n-1} + T_n = n².'
  },
  {
    id: 8,
    section: '1.4',
    pageRef: 'Page 9',
    question: 'What sequence is generated when you calculate: (Triangular Number × 6) + 1 for T₁=1, T₂=3, T₃=6, T₄=10...?',
    options: [
      'Square numbers (4, 9, 16, 25)',
      'Hexagonal numbers (7, 19, 37, 61, 91...)',
      'Powers of 3 (3, 9, 27, 81)',
      'Virahānka numbers'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.4 Q7: (1×6)+1=7, (3×6)+1=19, (6×6)+1=37, (10×6)+1=61. 6 triangular sectors plus 1 central dot create regular hexagonal rings.'
  },
  {
    id: 9,
    section: '1.4',
    pageRef: 'Page 9',
    question: 'What sequence do you get when you sum the hexagonal numbers: 1, (1+7), (1+7+19), (1+7+19+37)...?',
    options: [
      'Cube numbers: 1, 8, 27, 64 (n³)',
      'Counting numbers',
      'Odd numbers',
      'Powers of 2'
    ],
    correct: 0,
    explanation: 'NCERT Sec 1.4 Q8: Packing concentric hexagonal layers around a central unit cube forms solid 3D cubes of dimension 1³, 2³, 3³, 4³.'
  },
  {
    id: 10,
    section: '1.5',
    pageRef: 'Page 11',
    question: 'In any closed 2D Regular Polygon, what is the geometric relationship between the number of sides (E) and vertices (V)?',
    options: [
      'Number of sides is always twice the corners',
      'Number of sides strictly equals the number of corners (V = E)',
      'Corners are always 1 less than sides',
      'There is no fixed relationship'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.6 Q1: In any closed polygon, each vertex is the intersection of exactly two bounding edges, so V = E (3, 4, 5, 6, 7, 8...).'
  },
  {
    id: 11,
    section: '1.6',
    pageRef: 'Page 11',
    question: 'How many total connection chords exist in a Complete Graph K₅ (5 vertices), and what number sequence does this follow?',
    options: [
      '5 chords (Counting numbers)',
      '10 chords (The 4th triangular number T₄ = 5×4/2)',
      '15 chords (Square numbers)',
      '20 chords (Powers of 2)'
    ],
    correct: 1,
    explanation: 'NCERT Sec 1.6 Q2: Total handshakes/chords in complete graph K_n equals the triangular number T_{n-1} = n(n-1)/2. For K₅: 5×4/2 = 10.'
  },
  {
    id: 12,
    section: '1.6',
    pageRef: 'Page 12',
    question: 'In the Koch Snowflake fractal, replacing each segment with a peaked speed bump multiplies segments by 4. What is the segment formula for depth k?',
    options: [
      '3 × 4^k (giving 3, 12, 48, 192, 768...)',
      '3 + 4k (giving 3, 7, 11, 15...)',
      '4^k (giving 1, 4, 16, 64...)',
      '3^k (giving 3, 9, 27, 81...)'
    ],
    correct: 0,
    explanation: 'NCERT Sec 1.6 Q5: The initial triangle has 3 sides. Each iteration replaces 1 segment with 4 segments, generating 3 × 4^k (3, 12, 48, 192, 768).'
  }
];

export const NCERT_SOLUTIONS_GUIDE = [
  {
    section: '1.1',
    title: 'What is Mathematics? (Everyday Life & Human Progress)',
    pageRef: 'NCERT Page 2',
    items: [
      {
        q: 'Q1. Can you think of other examples where mathematics helps us in our everyday lives?',
        ans: 'Everyday applications include: computing total grocery and produce receipts, calculating vehicle speeds and fuel mileage, designing interlocking brick and tile tessellations in buildings, estimating apartment carpet areas, and scaling culinary baking ingredients proportionally.'
      },
      {
        q: 'Q2. How has mathematics helped propel humanity forward?',
        ans: 'Mathematical patterns enabled Newton and Kepler to formulate gravitation, allowing satellite orbits, weather forecasting, GPS navigation, and Mars rovers. In medicine, statistical pattern recognition in genomics enables targeted therapies and disease diagnostics.'
      }
    ]
  },
  {
    section: '1.2',
    title: 'Patterns in Numbers (Table 1 Fundamental Sequences)',
    pageRef: 'NCERT Page 3',
    items: [
      {
        q: 'Q1. Can you recognise the pattern and algebraic rule in each of the 10 sequences in Table 1?',
        ans: '1. All 1s: a_n = 1\n2. Counting: a_n = n (+1)\n3. Odd: a_n = 2n - 1 (+2)\n4. Even: a_n = 2n (+2)\n5. Triangular: a_n = n(n+1)/2 (Sum of first n counting numbers)\n6. Squares: a_n = n² (n × n)\n7. Cubes: a_n = n³ (n × n × n)\n8. Virahānka: a_n = a_{n-1} + a_{n-2} (Sanskrit prosody)\n9. Powers of 2: a_n = 2^{n-1} (×2)\n10. Powers of 3: a_n = 3^{n-1} (×3).'
      }
    ]
  },
  {
    section: '1.3',
    title: 'Visualising Number Sequences (Table 2 Dot Arrays & 3D Cubes)',
    pageRef: 'NCERT Page 5',
    items: [
      {
        q: 'Q2. Why are 1, 3, 6, 10, 15... called triangular, 1, 4, 9, 16... square, and 1, 8, 27... cubes?',
        ans: 'Because their physical dot representations assemble naturally into equilateral stepped triangles, square quadratic lattices, and 3D volumetric cubic voxel prisms.'
      },
      {
        q: 'Q3. Why is 36 both a triangular number and a square number?',
        ans: '36 dots can be arranged as the 8th triangular number (1+2+3+4+5+6+7+8 = 36) and simultaneously partitioned into a 6×6 square grid (6 × 6 = 36).'
      },
      {
        q: 'Q4. What is the next hexagonal number after 1, 7, 19, 37...?',
        ans: 'Next term is 61. The differences between successive concentric hexagonal rings grow in arithmetic progression of multiples of 6: +6, +12, +18, +24 (37 + 24 = 61).'
      }
    ]
  },
  {
    section: '1.4',
    title: 'Relations Among Number Sequences (Visual Proofs Without Words)',
    pageRef: 'NCERT Pages 7–9',
    items: [
      {
        q: 'Sum of Odd Numbers: What is the sum of the first 10 and first 100 odd numbers?',
        ans: 'Sum of first n odd numbers = n². First 10: 10² = 100. First 100: 100² = 10,000. Proven visually by L-shaped gnomons wrapping around squares.'
      },
      {
        q: 'Counting Up & Down: What is 1 + 2 + ... + 100 + ... + 2 + 1?',
        ans: 'Value is 10,000 (100²). Diagonal lines across a 100×100 square grid have lengths 1, 2, ..., 100, ..., 1.'
      },
      {
        q: 'Consecutive Triangular Numbers: What sequence is obtained by T_{n-1} + T_n?',
        ans: 'Square numbers: 1+3=4 (2²), 3+6=9 (3²), 6+10=16 (4²), 10+15=25 (5²). Two adjacent stepped triangles fuse along their hypotenuse to tile an n×n square.'
      },
      {
        q: 'Powers of 2: What happens when you sum 1 + 2 + 4 + ... + 2^{n-1} and add 1?',
        ans: 'You get 2^n. (1 + 2 + 4 + 8) = 15; 15 + 1 = 16 = 2⁴. Each binary sum fills all smaller bits, so adding 1 carries over to the next power of 2.'
      },
      {
        q: 'Hexagonal to Cube Numbers: What happens when you sum 1 + 7 + 19 + 37...?',
        ans: 'Summing hexagonal numbers yields cube numbers: 1=1³, 1+7=8=2³, 1+7+19=27=3³, 1+7+19+37=64=4³.'
      }
    ]
  },
  {
    section: '1.5 & 1.6',
    title: 'Shape Sequences ⟷ Number Sequences (The Geometry-Algebra Bridge)',
    pageRef: 'NCERT Pages 10–12',
    items: [
      {
        q: 'Regular Polygons: Sides and Corners sequence',
        ans: 'Counting numbers starting at 3 (3, 4, 5, 6, 7, 8, 9, 10...). In any closed 2D polygon, vertices equals edges (V = E).'
      },
      {
        q: 'Complete Graphs (K_n): Line segment sequence',
        ans: 'Triangular numbers T_{n-1} = n(n-1)/2 (1, 3, 6, 10, 15...). Models handshakes between n people.'
      },
      {
        q: 'Stacked Triangles: Triangle count per tier',
        ans: 'Each row contains consecutive odd numbers: 1, 3, 5, 7... Summing rows yields square numbers: 1, 4, 9, 16, 25 (n²).'
      },
      {
        q: 'Koch Snowflake Fractal: Total segment sequence',
        ans: '3 × 4^k = 3, 12, 48, 192, 768... (Powers of 4 multiplied by initial 3 triangle sides).'
      }
    ]
  }
];
