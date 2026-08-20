// Geographic Data Store for 3D Globe Web Application
// Contains Physical Features, Political Entities (World & India States/UTs), and Thematic Datasets

const GEO_DATA = {
  // Physical Features
  physical: {
    mountains: [
      { name: "Mount Everest", alt: "8,848 m", range: "Himalayas", lat: 27.9881, lng: 86.9250, desc: "Highest peak on Earth above sea level, located on the border of Nepal and China." },
      { name: "K2 (Mount Godwin-Austen)", alt: "8,611 m", range: "Karakoram", lat: 35.8808, lng: 76.5158, desc: "Second-highest mountain on Earth, notorious for extreme weather and technical difficulty." },
      { name: "Kangchenjunga", alt: "8,586 m", range: "Himalayas", lat: 27.7025, lng: 88.1475, desc: "Third highest mountain in the world, lying between Nepal and Sikkim, India." },
      { name: "Nanga Parbat", alt: "8,126 m", range: "Himalayas", lat: 35.2375, lng: 74.5892, desc: "Ninth highest mountain in the world, western anchor of the Himalayas." },
      { name: "Mount Aconcagua", alt: "6,961 m", range: "Andes", lat: -32.6532, lng: -70.0109, desc: "Highest peak in both the Southern and Western Hemispheres, located in Argentina." },
      { name: "Mount Denali", alt: "6,190 m", range: "Alaska Range", lat: 63.0692, lng: -151.0070, desc: "Highest mountain peak in North America, renowned for extreme cold weather." },
      { name: "Mount Kilimanjaro", alt: "5,895 m", range: "Eastern Rift", lat: -3.0674, lng: 37.3556, desc: "Dormant volcano in Tanzania, the highest single free-standing mountain in the world." },
      { name: "Mount Elbrus", alt: "5,642 m", range: "Caucasus", lat: 43.3499, lng: 42.4453, desc: "Highest peak in Europe, located in the Caucasus Mountains of Russia." },
      { name: "Mont Blanc", alt: "4,808 m", range: "Alps", lat: 45.8326, lng: 6.8652, desc: "Highest peak in Western Europe, straddling the border between France and Italy." },
      { name: "Mount Fuji", alt: "3,776 m", range: "Japanese Alps", lat: 35.3606, lng: 138.7274, desc: "Active stratovolcano and sacred national symbol of Japan." },
      { name: "Anamudi", alt: "2,695 m", range: "Western Ghats", lat: 10.1690, lng: 77.0600, desc: "Highest peak in South India and the Western Ghats, located in Kerala." }
    ],
    rivers: [
      { name: "Nile River", length: "6,650 km", continent: "Africa", lat: 24.0889, lng: 32.8998, desc: "Longest river system in the world, flowing north into the Mediterranean Sea." },
      { name: "Amazon River", length: "6,400 km", continent: "South America", lat: -3.4653, lng: -62.2159, desc: "Largest river in the world by discharge volume of water, carrying 20% of global river flow." },
      { name: "Yangtze River (Chang Jiang)", length: "6,300 km", continent: "Asia", lat: 30.6586, lng: 114.3055, desc: "Longest river in Asia, originating in the Tibetan Plateau and flowing to the East China Sea." },
      { name: "Mississippi-Missouri River", length: "6,275 km", continent: "North America", lat: 35.1495, lng: -90.0490, desc: "Major river of North America, draining most of the US central plains." },
      { name: "Ganges River (Ganga)", length: "2,525 km", continent: "Asia", lat: 25.3176, lng: 83.0061, desc: "Sacred river of India, rising in the western Himalayas and forming a massive delta in Bengal." },
      { name: "Indus River", length: "3,180 km", continent: "Asia", lat: 29.8000, lng: 70.8000, desc: "Major trans-boundary river of Asia, key cradle of ancient civilization." },
      { name: "Brahmaputra River", length: "3,848 km", continent: "Asia", lat: 26.1445, lng: 91.7362, desc: "Transboundary river originating in Tibet (Yarlung Tsangpo) and entering Assam, India." },
      { name: "Danube River", length: "2,850 km", continent: "Europe", lat: 48.2082, lng: 16.3738, desc: "Europe's second longest river, passing through 10 European nations." },
      { name: "Volga River", length: "3,530 km", continent: "Europe", lat: 51.5332, lng: 46.0342, desc: "Longest river in Europe, discharging into the Caspian Sea." },
      { name: "Congo River", length: "4,700 km", continent: "Africa", lat: -4.3224, lng: 15.3070, desc: "Deepest recorded river in the world, second largest by discharge volume." }
    ],
    oceans: [
      { name: "Pacific Ocean", area: "165.2M sq km", maxDepth: "10,994 m (Mariana Trench)", lat: 0.0, lng: -160.0, desc: "Largest and deepest ocean basin on Earth, covering more than 30% of planet surface." },
      { name: "Atlantic Ocean", area: "106.5M sq km", maxDepth: "8,376 m (Puerto Rico Trench)", lat: 0.0, lng: -30.0, desc: "Second-largest ocean, separating the Americas from Europe and Africa." },
      { name: "Indian Ocean", area: "70.56M sq km", maxDepth: "7,290 m (Java Trench)", lat: -20.0, lng: 80.0, desc: "Third-largest ocean, bounded by Asia to the north, Africa to the west, and Australia to the east." },
      { name: "Southern Ocean (Antarctic)", area: "20.3M sq km", maxDepth: "7,236 m (South Sandwich Trench)", lat: -65.0, lng: 0.0, desc: "Encircles Antarctica and plays a critical role in global ocean conveyor belt circulation." },
      { name: "Arctic Ocean", area: "14.06M sq km", maxDepth: "5,550 m (Molloy Hole)", lat: 85.0, lng: 0.0, desc: "Smallest and shallowest ocean, largely covered by sea ice year-round." }
    ],
    deserts: [
      { name: "Sahara Desert", area: "9.2M sq km", continent: "Africa", lat: 23.4162, lng: 25.6628, desc: "Largest hot desert in the world, spanning North Africa." },
      { name: "Gobi Desert", area: "1.3M sq km", continent: "Asia", lat: 42.5900, lng: 103.4300, desc: "Cold desert in East Asia, stretching across northern China and southern Mongolia." },
      { name: "Thar Desert (Great Indian Desert)", area: "200,000 sq km", continent: "Asia", lat: 26.9157, lng: 70.9083, desc: "Arid region in northwestern India and eastern Pakistan." },
      { name: "Atacama Desert", area: "105,000 sq km", continent: "South America", lat: -23.8634, lng: -69.1328, desc: "Driest non-polar desert in the world, located in northern Chile." }
    ]
  },

  // Political Features: World Countries + Detailed India States/UTs
  political: {
    indiaDetail: {
      country: "India (Republic of India)",
      capital: "New Delhi",
      statesCount: 28,
      utCount: 8,
      states: [
        { name: "Andhra Pradesh", capital: "Amaravati", lat: 15.9129, lng: 79.7400, type: "State", pop: "49.5 Million" },
        { name: "Arunachal Pradesh", capital: "Itanagar", lat: 28.2180, lng: 94.7278, type: "State", pop: "1.38 Million" },
        { name: "Assam", capital: "Dispur", lat: 26.2006, lng: 92.9376, type: "State", pop: "31.2 Million" },
        { name: "Bihar", capital: "Patna", lat: 25.0961, lng: 85.3131, type: "State", pop: "104.1 Million" },
        { name: "Chhattisgarh", capital: "Raipur", lat: 21.2787, lng: 81.8661, type: "State", pop: "25.5 Million" },
        { name: "Goa", capital: "Panaji", lat: 15.2993, lng: 74.1240, type: "State", pop: "1.45 Million" },
        { name: "Gujarat", capital: "Gandhinagar", lat: 22.2587, lng: 71.1924, type: "State", pop: "60.4 Million" },
        { name: "Haryana", capital: "Chandigarh", lat: 29.0588, lng: 76.0856, type: "State", pop: "25.3 Million" },
        { name: "Himachal Pradesh", capital: "Shimla", lat: 31.1048, lng: 77.1734, type: "State", pop: "6.86 Million" },
        { name: "Jharkhand", capital: "Ranchi", lat: 23.6102, lng: 85.2799, type: "State", pop: "32.9 Million" },
        { name: "Karnataka", capital: "Bengaluru", lat: 15.3173, lng: 75.7139, type: "State", pop: "61.1 Million" },
        { name: "Kerala", capital: "Thiruvananthapuram", lat: 10.8505, lng: 76.2711, type: "State", pop: "33.4 Million" },
        { name: "Madhya Pradesh", capital: "Bhopal", lat: 22.9734, lng: 78.6569, type: "State", pop: "72.6 Million" },
        { name: "Maharashtra", capital: "Mumbai", lat: 19.7515, lng: 75.7139, type: "State", pop: "112.3 Million" },
        { name: "Manipur", capital: "Imphal", lat: 24.6637, lng: 93.9063, type: "State", pop: "2.85 Million" },
        { name: "Meghalaya", capital: "Shillong", lat: 25.4670, lng: 91.3662, type: "State", pop: "2.96 Million" },
        { name: "Mizoram", capital: "Aizawl", lat: 23.1645, lng: 92.9376, type: "State", pop: "1.09 Million" },
        { name: "Nagaland", capital: "Kohima", lat: 26.1584, lng: 94.5624, type: "State", pop: "1.98 Million" },
        { name: "Odisha", capital: "Bhubaneswar", lat: 20.9517, lng: 85.0985, type: "State", pop: "41.9 Million" },
        { name: "Punjab", capital: "Chandigarh", lat: 31.1471, lng: 75.3412, type: "State", pop: "27.7 Million" },
        { name: "Rajasthan", capital: "Jaipur", lat: 27.0238, lng: 74.2179, type: "State", pop: "68.5 Million" },
        { name: "Sikkim", capital: "Gangtok", lat: 27.5330, lng: 88.5122, type: "State", pop: "0.61 Million" },
        { name: "Tamil Nadu", capital: "Chennai", lat: 11.1271, lng: 78.6569, type: "State", pop: "72.1 Million" },
        { name: "Telangana", capital: "Hyderabad", lat: 18.1124, lng: 79.0193, type: "State", pop: "35.0 Million" },
        { name: "Tripura", capital: "Agartala", lat: 23.9408, lng: 91.9882, type: "State", pop: "3.67 Million" },
        { name: "Uttar Pradesh", capital: "Lucknow", lat: 26.8467, lng: 80.9462, type: "State", pop: "199.8 Million" },
        { name: "Uttarakhand", capital: "Dehradun", lat: 30.0668, lng: 79.0193, type: "State", pop: "10.08 Million" },
        { name: "West Bengal", capital: "Kolkata", lat: 22.9868, lng: 87.8550, type: "State", pop: "91.2 Million" },
        
        // Union Territories
        { name: "Andaman and Nicobar Islands", capital: "Port Blair", lat: 11.7401, lng: 92.6586, type: "Union Territory", pop: "0.38 Million" },
        { name: "Chandigarh", capital: "Chandigarh", lat: 30.7333, lng: 76.7794, type: "Union Territory", pop: "1.05 Million" },
        { name: "Dadra & Nagar Haveli and Daman & Diu", capital: "Daman", lat: 20.4283, lng: 72.8397, type: "Union Territory", pop: "0.58 Million" },
        { name: "Delhi (NCT)", capital: "New Delhi", lat: 28.6139, lng: 77.2090, type: "Union Territory", pop: "16.7 Million" },
        { name: "Jammu & Kashmir", capital: "Srinagar (Summer) / Jammu (Winter)", lat: 33.7782, lng: 76.5762, type: "Union Territory", pop: "12.2 Million" },
        { name: "Ladakh", capital: "Leh", lat: 34.1526, lng: 77.5771, type: "Union Territory", pop: "0.27 Million" },
        { name: "Lakshadweep", capital: "Kavaratti", lat: 10.5667, lng: 72.6417, type: "Union Territory", pop: "0.06 Million" },
        { name: "Puducherry", capital: "Puducherry", lat: 11.9416, lng: 79.8083, type: "Union Territory", pop: "1.24 Million" }
      ]
    },

    worldCapitals: [
      { country: "India", capital: "New Delhi", lat: 28.6139, lng: 77.2090, region: "Asia", pop: "1.4 Billion" },
      { country: "United States", capital: "Washington, D.C.", lat: 38.9072, lng: -77.0369, region: "North America", pop: "331 Million" },
      { country: "China", capital: "Beijing", lat: 39.9042, lng: 116.4074, region: "Asia", pop: "1.41 Billion" },
      { country: "United Kingdom", capital: "London", lat: 51.5074, lng: -0.1278, region: "Europe", pop: "67 Million" },
      { country: "France", capital: "Paris", lat: 48.8566, lng: 2.3522, region: "Europe", pop: "65 Million" },
      { country: "Germany", capital: "Berlin", lat: 52.5200, lng: 13.4050, region: "Europe", pop: "83 Million" },
      { country: "Japan", capital: "Tokyo", lat: 35.6762, lng: 139.6503, region: "Asia", pop: "125 Million" },
      { country: "Brazil", capital: "Brasília", lat: -15.7975, lng: -47.8919, region: "South America", pop: "214 Million" },
      { country: "Australia", capital: "Canberra", lat: -35.2809, lng: 149.1300, region: "Oceania", pop: "26 Million" },
      { country: "Russia", capital: "Moscow", lat: 55.7558, lng: 37.6173, region: "Europe/Asia", pop: "144 Million" },
      { country: "Egypt", capital: "Cairo", lat: 30.0444, lng: 31.2357, region: "Africa", pop: "104 Million" },
      { country: "South Africa", capital: "Pretoria", lat: -25.7479, lng: 28.2293, region: "Africa", pop: "60 Million" },
      { country: "Canada", capital: "Ottawa", lat: 45.4215, lng: -75.6972, region: "North America", pop: "38 Million" },
      { country: "Argentina", capital: "Buenos Aires", lat: -34.6037, lng: -58.3816, region: "South America", pop: "45 Million" },
      { country: "Saudi Arabia", capital: "Riyadh", lat: 24.7136, lng: 46.6753, region: "Asia", pop: "35 Million" }
    ]
  },

  // Thematic Map Data
  thematic: {
    climateZones: [
      { name: "Tropical Rainforest / Monsoon", code: "Af/Am", color: "#00b050", desc: "Warm year-round, abundant rainfall, dense rainforest biomes (Amazon, Congo, Western Ghats, SE Asia)." },
      { name: "Arid & Semi-Arid (Desert/Steppe)", code: "BWh/BSk", color: "#e6b800", desc: "Low precipitation, high temperature variance (Sahara, Gobi, Australian Outback, Thar)." },
      { name: "Mediterranean & Subtropical", code: "Csa/Cfa", color: "#70ad47", desc: "Mild winters, warm dry summers (Mediterranean basin, Coastal California, Coastal Chile)." },
      { name: "Continental / Temperate", code: "Dfb/Dfa", color: "#2e75b6", desc: "Warm summers, cold snow-covered winters (Central North America, Eastern Europe, Northeast Asia)." },
      { name: "Polar & Tundra Ice Cap", code: "ET/EF", color: "#a6a6a6", desc: "Extremely cold temperatures, permafrost, ice sheets (Greenland, Antarctica, Arctic tundra)." }
    ],
    populationDensity: [
      { name: "South Asia (Ganges-Brahmaputra)", density: "High (>500/km²)", lat: 25.5, lng: 85.0, val: 95 },
      { name: "East China Plain", density: "High (>450/km²)", lat: 34.0, lng: 116.0, val: 90 },
      { name: "Java, Indonesia", density: "Very High (>1100/km²)", lat: -7.5, lng: 110.0, val: 100 },
      { name: "Western Europe (Rhein-Ruhr)", density: "Medium-High (>250/km²)", lat: 51.0, lng: 6.5, val: 75 },
      { name: "Northeast Megalopolis US", density: "Medium-High (>300/km²)", lat: 40.7, lng: -74.0, val: 70 },
      { name: "Nile River Delta", density: "Very High (>1000/km²)", lat: 30.5, lng: 31.2, val: 98 },
      { name: "Amazon Basin", density: "Sparse (<5/km²)", lat: -4.0, lng: -65.0, val: 5 },
      { name: "Sahara Desert", density: "Sparse (<1/km²)", lat: 23.0, lng: 12.0, val: 2 },
      { name: "Siberian Taiga", density: "Sparse (<3/km²)", lat: 60.0, lng: 90.0, val: 3 }
    ],
    tectonicPlates: [
      { name: "Pacific Ring of Fire", type: "Subduction Zone", lat: 35.0, lng: 140.0, desc: "Zone of frequent earthquakes and volcanic eruptions surrounding the basin of the Pacific Ocean." },
      { name: "Himalayan Collision Front", type: "Continental Collision", lat: 28.0, lng: 84.0, desc: "Active collision line between the Indian Plate and Eurasian Plate, raising the Himalayas." },
      { name: "Mid-Atlantic Ridge", type: "Divergent Boundary", lat: 20.0, lng: -45.0, desc: "Underwater mountain system formed by plate tectonics separating Eurasia/Africa from Americas." },
      { name: "San Andreas Fault System", type: "Transform Boundary", lat: 35.0, lng: -119.5, desc: "Major continental transform fault extending roughly 1,200 km through California." }
    ]
  }
};
