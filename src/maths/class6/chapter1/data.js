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

// Complete Graphs Dataset (NCERT Class 6 Mathematics Table 3: Complete Graphs K2 to K6)
export const COMPLETE_GRAPHS_DATASET = [
  {
    n: 2,
    code: 'K2',
    symbol: 'K₂',
    name: '2 Red Pegs (1 Edge)',
    totalEdges: 1,
    formula: '2 × 1 / 2 = 1',
    triangularNumber: 'T₁ = 1',
    vertices: 2,
    perimeterEdges: 1,
    interiorDiagonals: 0,
    oddSum: '1',
    shapeName: 'Horizontal Segment',
    realLife: '2 friends: exactly 1 handshake connects them.',
    breakdown: [
      { fromPeg: 1, toPeg: 2, count: 1, note: 'Peg 1 connects to 1 remaining peg (+1)' }
    ]
  },
  {
    n: 3,
    code: 'K3',
    symbol: 'K₃',
    name: '3 Red Pegs (3 Edges)',
    totalEdges: 3,
    formula: '3 × 2 / 2 = 3',
    triangularNumber: 'T₂ = 2 + 1 = 3',
    vertices: 3,
    perimeterEdges: 3,
    interiorDiagonals: 0,
    oddSum: '2 + 1',
    shapeName: 'Equilateral Triangle',
    realLife: '3 friends: Person 1 shakes 2 hands, Person 2 shakes 1 remaining = 3 handshakes.',
    breakdown: [
      { fromPeg: 1, toPeg: '2 & 3', count: 2, note: 'Peg 1 connects to 2 remaining pegs (+2)' },
      { fromPeg: 2, toPeg: '3', count: 1, note: 'Peg 2 connects to 1 remaining peg (+1)' }
    ]
  },
  {
    n: 4,
    code: 'K4',
    symbol: 'K₄',
    name: '4 Red Pegs (6 Edges)',
    totalEdges: 6,
    formula: '4 × 3 / 2 = 6',
    triangularNumber: 'T₃ = 3 + 2 + 1 = 6',
    vertices: 4,
    perimeterEdges: 4,
    interiorDiagonals: 2,
    oddSum: '3 + 2 + 1',
    shapeName: 'Square with Cross (X)',
    realLife: '4 sports teams playing every other team once: 3 + 2 + 1 = 6 total matches.',
    breakdown: [
      { fromPeg: 1, toPeg: '2, 3, 4', count: 3, note: 'Peg 1 connects to 3 remaining pegs (+3)' },
      { fromPeg: 2, toPeg: '3, 4', count: 2, note: 'Peg 2 connects to 2 remaining pegs (+2)' },
      { fromPeg: 3, toPeg: '4', count: 1, note: 'Peg 3 connects to 1 remaining peg (+1)' }
    ]
  },
  {
    n: 5,
    code: 'K5',
    symbol: 'K₅',
    name: '5 Red Pegs (10 Edges)',
    totalEdges: 10,
    formula: '5 × 4 / 2 = 10',
    triangularNumber: 'T₄ = 4 + 3 + 2 + 1 = 10',
    vertices: 5,
    perimeterEdges: 5,
    interiorDiagonals: 5,
    oddSum: '4 + 3 + 2 + 1',
    shapeName: 'Pentagon with 5-Pointed Star',
    realLife: '5 people at a round table: 4 + 3 + 2 + 1 = 10 handshakes to greet everyone.',
    breakdown: [
      { fromPeg: 1, toPeg: '2, 3, 4, 5', count: 4, note: 'Peg 1 connects to 4 remaining pegs (+4)' },
      { fromPeg: 2, toPeg: '3, 4, 5', count: 3, note: 'Peg 2 connects to 3 remaining pegs (+3)' },
      { fromPeg: 3, toPeg: '4, 5', count: 2, note: 'Peg 3 connects to 2 remaining pegs (+2)' },
      { fromPeg: 4, toPeg: '5', count: 1, note: 'Peg 4 connects to 1 remaining peg (+1)' }
    ]
  },
  {
    n: 6,
    code: 'K6',
    symbol: 'K₆',
    name: '6 Red Pegs (15 Edges)',
    totalEdges: 15,
    formula: '6 × 5 / 2 = 15',
    triangularNumber: 'T₅ = 5 + 4 + 3 + 2 + 1 = 15',
    vertices: 6,
    perimeterEdges: 6,
    interiorDiagonals: 9,
    oddSum: '5 + 4 + 3 + 2 + 1',
    shapeName: 'Hexagon with 9 Inner Chords',
    realLife: '6 cities with direct flights between every pair: 5 + 4 + 3 + 2 + 1 = 15 routes.',
    breakdown: [
      { fromPeg: 1, toPeg: '2 to 6', count: 5, note: 'Peg 1 connects to 5 remaining pegs (+5)' },
      { fromPeg: 2, toPeg: '3 to 6', count: 4, note: 'Peg 2 connects to 4 remaining pegs (+4)' },
      { fromPeg: 3, toPeg: '4 to 6', count: 3, note: 'Peg 3 connects to 3 remaining pegs (+3)' },
      { fromPeg: 4, toPeg: '5 & 6', count: 2, note: 'Peg 4 connects to 2 remaining pegs (+2)' },
      { fromPeg: 5, toPeg: '6', count: 1, note: 'Peg 5 connects to 1 remaining peg (+1)' }
    ]
  }
];

// =======================================================================
// REAL-LIFE MATH LAB: 3x3 CALENDAR MAGIC WINDOW DATASET
// Grade 6 NCERT Curriculum - Real-Life Balance & Algebraic Invariance
// =======================================================================
export const CALENDAR_MAGIC_DATASET = [
  {
    id: 'oct-2026',
    name: 'October 2026',
    shortName: 'Oct 2026',
    season: 'Autumn Festival Month',
    icon: '🍂',
    themeColor: '#0d9488',
    headerColor: '#115e59',
    daysInMonth: 31,
    startCol: 3, // Thu (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun)
    defaultCenter: 16,
    story: 'School Autumn Festival & Diwali planning calendar! Pick any 3×3 square of 9 dates to reveal the magic balance.',
    mysteryTargets: [144, 153, 99, 189, 207],
    headers: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'jul-2026',
    name: 'July 2026',
    shortName: 'Jul 2026',
    season: 'Monsoon Science Camp',
    icon: '🌧️',
    themeColor: '#0284c7',
    headerColor: '#0369a1',
    daysInMonth: 31,
    startCol: 2, // Wed
    defaultCenter: 16,
    story: 'School Science Monsoon Camp schedule! Test how the 3×3 calendar window keeps its 9× balance in July.',
    mysteryTargets: [144, 153, 99, 162, 198],
    headers: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'mar-2026',
    name: 'March 2026',
    shortName: 'Mar 2026',
    season: 'Spring Math Challenge',
    icon: '🌱',
    themeColor: '#059669',
    headerColor: '#047857',
    daysInMonth: 31,
    startCol: 6, // Sun
    defaultCenter: 17,
    story: 'Spring Exam & Sports Month! With day 1 on Sunday, all valid 3×3 centers shift across the board.',
    mysteryTargets: [153, 162, 90, 171, 180],
    headers: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'nov-2026',
    name: 'November 2026',
    shortName: 'Nov 2026',
    season: 'Winter Athletics Month',
    icon: '🍁',
    themeColor: '#d97706',
    headerColor: '#b45309',
    daysInMonth: 30,
    startCol: 6, // Sun
    defaultCenter: 17,
    story: '30-day November calendar! Demonstrates that whether a month has 30 or 31 days, the 9×Center rule is unbreakable.',
    mysteryTargets: [153, 162, 99, 171, 180],
    headers: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
];

export function getMonthCalendarGrid(monthData) {
  const { daysInMonth, startCol } = monthData;
  const grid = [];
  for (let r = 0; r < 6; r++) {
    const row = [];
    for (let c = 0; c < 7; c++) {
      const day = r * 7 + c - startCol + 1;
      row.push(day >= 1 && day <= daysInMonth ? day : null);
    }
    grid.push(row);
  }
  return grid;
}

export function getValidCentersForMonth(monthData) {
  const grid = getMonthCalendarGrid(monthData);
  const validCenters = [];
  for (let r = 1; r < 5; r++) {
    for (let c = 1; c < 6; c++) {
      const centerDay = grid[r][c];
      if (!centerDay) continue;
      let allValid = true;
      const neighbors = [];
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const d = grid[r + dr][c + dc];
          if (!d) { allValid = false; break; }
          neighbors.push(d);
        }
        if (!allValid) break;
      }
      if (allValid) {
        const sum = neighbors.reduce((a, b) => a + b, 0);
        validCenters.push({
          day: centerDay,
          row: r,
          col: c,
          sum,
          boxValues: neighbors,
          pairs: [
            { id: 'diag1', name: 'Diagonal ↘', a: grid[r - 1][c - 1], b: grid[r + 1][c + 1], pairSum: grid[r - 1][c - 1] + grid[r + 1][c + 1], color: '#ec4899' },
            { id: 'vert',  name: 'Vertical ↕', a: grid[r - 1][c],   b: grid[r + 1][c],   pairSum: grid[r - 1][c] + grid[r + 1][c],     color: '#0284c7' },
            { id: 'diag2', name: 'Diagonal ↗', a: grid[r - 1][c + 1], b: grid[r + 1][c - 1], pairSum: grid[r - 1][c + 1] + grid[r + 1][c - 1], color: '#f59e0b' },
            { id: 'horiz', name: 'Horizontal ↔', a: grid[r][c - 1], b: grid[r][c + 1], pairSum: grid[r][c - 1] + grid[r][c + 1],   color: '#10b981' }
          ]
        });
      }
    }
  }
  return validCenters;
}

export const GROCERY_MARKET_DATASET = [
  {
    id: 'veggies',
    title: 'Daily Farm Vegetables',
    subtitle: 'Potatoes & Tomatoes Harvest',
    icon: '🥔',
    storeSection: 'PRODUCE AISLE 1 · ROOTS & VINES',
    shelfThemeColor: '#0d9488',
    item1: {
      id: 'potatoes',
      name: 'Russet Potatoes',
      shortName: 'Potatoes',
      variety: "Solanum tuberosum 'Russet Burbank'",
      origin: 'Jalandhar & Nilgiri Hills, India',
      nutrition: 'High Potassium, Vitamin B6 & Dietary Fiber',
      unitWeight: '~180g each (~5 to 6 tubers per kg)',
      emoji: '🥔',
      rate: 30, // ₹30/kg
      unit: 'kg',
      defaultKg: 3,
      color: '#8c5a24',
      accentColor: '#0d9488',
      type: 'potato',
      visualTraits: {
        skinTexture: 'earthy_dimpled_tuber',
        roughness: 0.92,
        clearcoat: 0.05,
        clearcoatRoughness: 0.8,
        metalness: 0.02,
        primaryColor: '#8c5a24',
        secondaryColor: '#5c3a1e',
        sproutEyeCount: 5
      },
      apSequence: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
      apDescription: 'Adding ₹30 for each 1 kg potato (d = ₹30)'
    },
    item2: {
      id: 'tomatoes',
      name: 'Heirloom Tomatoes',
      shortName: 'Tomatoes',
      variety: "Solanum lycopersicum 'Brandywine'",
      origin: 'Nashik Valley & Bangalore Organic Greens',
      nutrition: 'Rich in Antioxidant Lycopene, Vitamin C & K',
      unitWeight: '~125g each (~8 ripe tomatoes per kg)',
      emoji: '🍅',
      rate: 50, // ₹50/kg
      unit: 'kg',
      defaultKg: 2,
      color: '#dc2626',
      accentColor: '#ef4444',
      type: 'tomato',
      visualTraits: {
        skinTexture: 'glossy_lobed_heirloom',
        roughness: 0.12,
        clearcoat: 0.92,
        clearcoatRoughness: 0.05,
        metalness: 0.02,
        primaryColor: '#dc2626',
        secondaryColor: '#ea580c',
        calyxColor: '#16a34a',
        calyxLobes: 5
      },
      apSequence: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
      apDescription: 'Adding ₹50 for each 1 kg tomato (d = ₹50)'
    },
    mysteryTargets: [190, 240, 290, 350, 400, 450]
  },
  {
    id: 'fruits',
    title: 'Orchard Fresh Fruits',
    subtitle: 'Apples & Oranges Harvest',
    icon: '🍎',
    storeSection: 'FRUITS AISLE 2 · CITRUS & TREE FRUITS',
    shelfThemeColor: '#e11d48',
    item1: {
      id: 'apples',
      name: 'Shimla Royal Apples',
      shortName: 'Apples',
      variety: "Malus domestica 'Royal Gala'",
      origin: 'Kotgarh Valley, Shimla (H.P.), India',
      nutrition: 'High Pectin Fiber, Vitamin C & Polyphenols',
      unitWeight: '~165g each (~6 crisp apples per kg)',
      emoji: '🍎',
      rate: 80, // ₹80/kg
      unit: 'kg',
      defaultKg: 2,
      color: '#b91c1c',
      accentColor: '#e11d48',
      type: 'apple',
      visualTraits: {
        skinTexture: 'waxy_crimson_blush',
        roughness: 0.18,
        clearcoat: 0.82,
        clearcoatRoughness: 0.08,
        metalness: 0.04,
        primaryColor: '#b91c1c',
        secondaryColor: '#f59e0b',
        stemColor: '#451a03',
        leafColor: '#15803d'
      },
      apSequence: [80, 160, 240, 320, 400, 480, 560, 640, 720, 800],
      apDescription: 'Adding ₹80 for each 1 kg apple (d = ₹80)'
    },
    item2: {
      id: 'oranges',
      name: 'Nagpur Sweet Oranges',
      shortName: 'Oranges',
      variety: "Citrus sinensis 'Nagpur Mandarin'",
      origin: 'Vidarbha Citrus Orchards, Maharashtra',
      nutrition: 'Bursting with Vitamin C, Folate & Hesperidin',
      unitWeight: '~150g each (~6 to 7 juicy oranges per kg)',
      emoji: '🍊',
      rate: 40, // ₹40/kg
      unit: 'kg',
      defaultKg: 3,
      color: '#ea580c',
      accentColor: '#f97316',
      type: 'orange',
      visualTraits: {
        skinTexture: 'pebbled_oil_pores',
        roughness: 0.68,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
        metalness: 0.02,
        primaryColor: '#f97316',
        secondaryColor: '#ea580c',
        buttonCalyxColor: '#14532d'
      },
      apSequence: [40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
      apDescription: 'Adding ₹40 for each 1 kg orange (d = ₹40)'
    },
    mysteryTargets: [200, 280, 320, 360, 440, 520]
  },
  {
    id: 'kitchen_staples',
    title: 'Kitchen Pantry Roots',
    subtitle: 'Onions & Carrots Essentials',
    icon: '🧅',
    storeSection: 'PANTRY AISLE 3 · ROOTS & CRUNCH',
    shelfThemeColor: '#7c3aed',
    item1: {
      id: 'onions',
      name: 'Nashik Red Onions',
      shortName: 'Onions',
      variety: "Allium cepa 'Nashik Red Pusa'",
      origin: 'Lasalgaon Mandi, Nashik, India',
      nutrition: 'Rich in Quercetin Antioxidants & Prebiotics',
      unitWeight: '~110g each (~9 bulbs per kg)',
      emoji: '🧅',
      rate: 35, // ₹35/kg
      unit: 'kg',
      defaultKg: 4,
      color: '#701a75',
      accentColor: '#a21caf',
      type: 'onion',
      visualTraits: {
        skinTexture: 'papery_layered_striations',
        roughness: 0.28,
        clearcoat: 0.65,
        clearcoatRoughness: 0.15,
        metalness: 0.12,
        primaryColor: '#701a75',
        secondaryColor: '#86198f',
        rootColor: '#78350f',
        dryTipColor: '#e9d5ff'
      },
      apSequence: [35, 70, 105, 140, 175, 210, 245, 280, 315, 350],
      apDescription: 'Adding ₹35 for each 1 kg onion (d = ₹35)'
    },
    item2: {
      id: 'carrots',
      name: 'Ooty Crunchy Carrots',
      shortName: 'Carrots',
      variety: 'Daucus carota subsp. sativus',
      origin: 'Nilgiri Terrace Farms, Ooty, Tamil Nadu',
      nutrition: 'High Beta-Carotene (Pro-Vitamin A) & Fiber',
      unitWeight: '~90g each (~11 fresh carrots per kg)',
      emoji: '🥕',
      rate: 45, // ₹45/kg
      unit: 'kg',
      defaultKg: 2,
      color: '#ea580c',
      accentColor: '#f97316',
      type: 'carrot',
      visualTraits: {
        skinTexture: 'ridged_tapered_cone',
        roughness: 0.42,
        clearcoat: 0.35,
        clearcoatRoughness: 0.2,
        metalness: 0.05,
        primaryColor: '#ea580c',
        grooveColor: '#c2410c',
        leafCrownColor: '#15803d'
      },
      apSequence: [45, 90, 135, 180, 225, 270, 315, 360, 405, 450],
      apDescription: 'Adding ₹45 for each 1 kg carrot (d = ₹45)'
    },
    mysteryTargets: [170, 230, 265, 305, 375, 410]
  },
  {
    id: 'green_harvest',
    title: 'Garden Greens & Pods',
    subtitle: 'Sweet Corn & Green Peas',
    icon: '🌽',
    storeSection: 'GREENS AISLE 4 · SWEET KERNELS & PODS',
    shelfThemeColor: '#16a34a',
    item1: {
      id: 'corn',
      name: 'Golden Sweet Corn',
      shortName: 'Sweet Corn',
      variety: 'Zea mays var. saccharata',
      origin: 'Davangere & Pune Agricultural Valleys',
      nutrition: 'Rich in Lutein, Zeaxanthin & Complex Carbs',
      unitWeight: '~250g each (~4 fresh cobs per kg)',
      emoji: '🌽',
      rate: 25, // ₹25/kg
      unit: 'kg',
      defaultKg: 3,
      color: '#eab308',
      accentColor: '#ca8a04',
      type: 'corn',
      visualTraits: {
        skinTexture: 'beaded_golden_kernels',
        roughness: 0.45,
        clearcoat: 0.4,
        clearcoatRoughness: 0.15,
        metalness: 0.08,
        kernelColor: '#facc15',
        huskColor: '#86efac',
        innerHuskColor: '#16a34a',
        silkColor: '#92400e'
      },
      apSequence: [25, 50, 75, 100, 125, 150, 175, 200, 225, 250],
      apDescription: 'Adding ₹25 for each 1 kg corn (d = ₹25)'
    },
    item2: {
      id: 'peas',
      name: 'Tender Green Peas',
      shortName: 'Green Peas',
      variety: 'Pisum sativum var. macrocarpon',
      origin: 'Himachal Snow Valleys & Nilgiris',
      nutrition: 'Rich Plant Protein, Iron & Vitamin K1',
      unitWeight: '~8g each pod (~125 crisp pods per kg)',
      emoji: '🌿',
      rate: 60, // ₹60/kg
      unit: 'kg',
      defaultKg: 2,
      color: '#15803d',
      accentColor: '#16a34a',
      type: 'peas',
      visualTraits: {
        skinTexture: 'curved_bulging_pod',
        roughness: 0.32,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
        metalness: 0.04,
        podColor: '#16a34a',
        seamColor: '#22c55e',
        calyxStemColor: '#15803d',
        peaCountPerPod: 4
      },
      apSequence: [60, 120, 180, 240, 300, 360, 420, 480, 540, 600],
      apDescription: 'Adding ₹60 for each 1 kg peas (d = ₹60)'
    },
    mysteryTargets: [145, 195, 220, 270, 320, 395]
  }
];


