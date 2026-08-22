import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Mountain, X, Sparkles, Compass, Layers, Info, CheckCircle2, 
  HelpCircle, ChevronRight, Award, Eye, ArrowUpRight, MapPin
} from 'lucide-react';
import { IndiaMapData } from '../LostInTheCity/IndiaMapData';

// Coordinate projection calibrated to IndiaMapData SVG coordinates (612 x 696 viewBox)
const projectCoords = (lat, lon) => {
  const a = 20.6606;
  const b = 0.5652;
  const c = -1416.7303;
  const d = 0.4941;
  const e = -23.4696;
  const f = 836.2510;
  return {
    x: +(a * lon + b * lat + c).toFixed(1),
    y: +(d * lon + e * lat + f).toFixed(1)
  };
};

export const PLACE_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: '🗺️' },
  { id: 'peaks', label: 'Mountain Peaks', icon: '🏔️' },
  { id: 'hill_stations', label: 'Hill Stations & Valleys', icon: '🌲' },
  { id: 'nature', label: 'Waterfalls & Glaciers', icon: '🌊' },
  { id: 'heritage', label: 'Landmarks & Passes', icon: '🏛️' }
];

export const ATTRACTIVE_PLACES = [
  // HIMALAYAS & KARAKORAM
  {
    id: 'k2',
    name: 'K2 (Godwin-Austen)',
    hindiName: 'के२ (गॉडविन-ऑस्टिन)',
    category: 'peaks',
    rangeId: 'karakoram',
    lat: 35.88, lon: 76.51,
    alt: '8,611 m',
    type: 'World\'s 2nd Highest Peak',
    imageEmoji: '🏔️',
    description: 'The second highest mountain on Earth. Known as the Savage Mountain for its steep and treacherous ice walls in the Karakoram Range.',
    highlight: 'Steep pyramid of rock & ice; second only to Mt. Everest',
    labelOffsetX: 10, labelOffsetY: -8
  },
  {
    id: 'siachen',
    name: 'Siachen Glacier',
    hindiName: 'सियाचिन ग्लेशियर',
    category: 'nature',
    rangeId: 'karakoram',
    lat: 35.42, lon: 77.11,
    alt: '5,400 m',
    type: 'Longest Non-Polar Glacier in India',
    imageEmoji: '❄️',
    description: 'A 76 km long glacier in the eastern Karakoram, the highest battleground and freshwater reserve in the subcontinent.',
    highlight: 'Origin of Nubra River; World\'s highest helipad',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'manali',
    name: 'Kullu-Manali Valley',
    hindiName: 'कुल्लू-मनाली घाटी',
    category: 'hill_stations',
    rangeId: 'lesser_himalayas',
    lat: 32.24, lon: 77.19,
    alt: '2,050 m',
    type: 'Picturesque Himalayan Valley',
    imageEmoji: '🌲',
    description: 'Nestled along the Beas River between the Pir Panjal and Great Himalayan ranges, known for snow peaks, apple orchards, and pine forests.',
    highlight: 'Gateway to Solang Valley and Rohtang Pass',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'shimla',
    name: 'Shimla',
    hindiName: 'शिमला (क्वीन ऑफ हिल्स)',
    category: 'hill_stations',
    rangeId: 'lesser_himalayas',
    lat: 31.10, lon: 77.17,
    alt: '2,276 m',
    type: 'Colonial Hill Station',
    imageEmoji: '🏡',
    description: 'The Queen of Hills in Himachal Pradesh, famous for its historic ridge, pine-covered mountain slopes, and the UNESCO Kalka-Shimla Toy Train.',
    highlight: 'Former summer capital of India with panoramic Himalayan views',
    labelOffsetX: -75, labelOffsetY: 14
  },
  {
    id: 'gangotri',
    name: 'Gangotri Glacier',
    hindiName: 'गंगोत्री हिमनद',
    category: 'nature',
    rangeId: 'greater_himalayas',
    lat: 30.98, lon: 79.08,
    alt: '4,100 m',
    type: 'Origin of River Ganga',
    imageEmoji: '🌊',
    description: 'The sacred source of the Bhagirathi River (Ganga) emerging from Gaumukh in the Garhwal Himalayas of Uttarakhand.',
    highlight: 'Spans 30 km; origin of India\'s most sacred river',
    labelOffsetX: 10, labelOffsetY: -8
  },
  {
    id: 'nanda_devi',
    name: 'Nanda Devi Peak',
    hindiName: 'नंदा देवी',
    category: 'peaks',
    rangeId: 'greater_himalayas',
    lat: 30.37, lon: 79.97,
    alt: '7,816 m',
    type: 'Highest Peak Entirely in India',
    imageEmoji: '🏔️',
    description: 'A sacred, majestic peak surrounded by the Nanda Devi National Park and UNESCO Biosphere Reserve in Uttarakhand.',
    highlight: 'Two-peaked mountain surrounded by a ring of high glaciers',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'dehradun',
    name: 'Dehradun & Mussoorie',
    hindiName: 'देहरादून एवं मसूरी',
    category: 'hill_stations',
    rangeId: 'shiwalik',
    lat: 30.32, lon: 78.03,
    alt: '680 m - 2,005 m',
    type: 'Longitudinal Dun Valley',
    imageEmoji: '🏞️',
    description: 'Located in the longitudinal "Dun" valley between the Lesser Himalayas and the Shiwalik foothill ridges.',
    highlight: 'Class 6 NCERT: Famous example of a longitudinal "Dun" valley',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'kanchenjunga',
    name: 'Mt. Kanchenjunga',
    hindiName: 'कंचनजंघा (सिक्किम)',
    category: 'peaks',
    rangeId: 'greater_himalayas',
    lat: 27.70, lon: 88.14,
    alt: '8,586 m',
    type: '3rd Highest Peak on Earth',
    imageEmoji: '🏔️',
    description: 'The highest peak in India and 3rd highest in the world, located on the border between Sikkim and Nepal.',
    highlight: 'Name means "Five Treasures of Snow" in Tibetan',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // ARAVALLI & NORTH-WEST
  {
    id: 'guru_shikhar',
    name: 'Guru Shikhar (Mt. Abu)',
    hindiName: 'गुरु शिखर (माउंट आबू)',
    category: 'peaks',
    rangeId: 'aravalli',
    lat: 24.65, lon: 72.78,
    alt: '1,722 m',
    type: 'Highest Peak of Aravalli Range',
    imageEmoji: '⛰️',
    description: 'The highest summit in Rajasthan and the entire Aravalli mountain system, offering views of the surrounding desert plateau.',
    highlight: 'Located at Mount Abu, the only hill station in Rajasthan',
    labelOffsetX: -145, labelOffsetY: 4
  },
  {
    id: 'raisina',
    name: 'Raisina Hill (Delhi)',
    hindiName: 'रायसीना हिल (नई दिल्ली)',
    category: 'heritage',
    rangeId: 'aravalli',
    lat: 28.61, lon: 77.20,
    alt: '265 m',
    type: 'Northern Tip of Aravalli',
    imageEmoji: '🏛️',
    description: 'The seat of the Government of India and Rashtrapati Bhavan, standing on the northernmost extension of the ancient Aravalli Range.',
    highlight: 'Ancient metamorphic rock ridge running right into the national capital',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // CENTRAL INDIA (VINDHYA & SATPURA)
  {
    id: 'sanchi',
    name: 'Sanchi Stupa (Vindhya Range)',
    hindiName: 'सांची स्तूप (विंध्याचल)',
    category: 'heritage',
    rangeId: 'vindhya',
    lat: 23.48, lon: 77.74,
    alt: '430 m',
    type: 'Ancient UNESCO World Heritage Site',
    imageEmoji: '🛕',
    description: 'Famous 3rd century BCE Buddhist monuments built from the durable red and yellow sandstone of the Vindhya range.',
    highlight: 'Built by Emperor Ashoka atop a sandstone hill in Madhya Pradesh',
    labelOffsetX: -150, labelOffsetY: -8
  },
  {
    id: 'pachmarhi',
    name: 'Pachmarhi & Dhupgarh',
    hindiName: 'पचमढ़ी एवं धूपगढ़ (१,३५० मी)',
    category: 'peaks',
    rangeId: 'satpura',
    lat: 22.45, lon: 78.37,
    alt: '1,350 m',
    type: 'Highest Peak of Satpura (Queen of Satpura)',
    imageEmoji: '🌄',
    description: 'Dhupgarh is the highest point in Madhya Pradesh, located in the lush Satpura Biosphere Reserve with cascading waterfalls.',
    highlight: 'Famous for spectacular sunset views across the central Indian plateau',
    labelOffsetX: 10, labelOffsetY: 8
  },
  {
    id: 'bhedaghat',
    name: 'Marble Rocks & Dhuandhar Falls',
    hindiName: 'भेड़ाघाट एवं धुआंधार जलप्रपात',
    category: 'nature',
    rangeId: 'satpura',
    lat: 23.13, lon: 79.80,
    alt: '380 m',
    type: 'Narmada River Gorge',
    imageEmoji: '🌊',
    description: 'A 3 km gorge where the Narmada River carves through towering pure marble rock cliffs between the Vindhyas and Satpuras.',
    highlight: 'The Narmada plunges 30 m in a misty roar called Dhuandhar ("Smoke Cascade")',
    labelOffsetX: 10, labelOffsetY: -8
  },

  // WESTERN GHATS & SOUTH INDIA
  {
    id: 'mahabaleshwar',
    name: 'Mahabaleshwar',
    hindiName: 'महाबलेश्वर (महाराष्ट्र)',
    category: 'hill_stations',
    rangeId: 'western_ghats',
    lat: 17.92, lon: 73.66,
    alt: '1,353 m',
    type: 'Western Ghats Plateau & Krishna River Origin',
    imageEmoji: '🍓',
    description: 'A misty hill station in Maharashtra\'s Sahyadri range, known for high plateau viewpoints and strawberry valleys.',
    highlight: 'Origin point of the sacred Krishna River flowing to the east coast',
    labelOffsetX: -125, labelOffsetY: 4
  },
  {
    id: 'jog_falls',
    name: 'Jog Falls (Gerosoppa)',
    hindiName: 'जोग जलप्रपात (कर्नाटक)',
    category: 'nature',
    rangeId: 'western_ghats',
    lat: 14.23, lon: 74.81,
    alt: '480 m',
    type: '2nd Highest Plunge Waterfall in India',
    imageEmoji: '🌊',
    description: 'The Sharavathi River drops 253 meters in four distinct cascades (Raja, Roarer, Rocket, and Rani) down the Western Ghats escarpment.',
    highlight: 'Massive orographic waterfalls powered by southwest monsoon rains',
    labelOffsetX: -95, labelOffsetY: -8
  },
  {
    id: 'ooty',
    name: 'Ooty & Nilgiri Hills',
    hindiName: 'ऊटी (नीलगिरि पर्वत)',
    category: 'hill_stations',
    rangeId: 'western_ghats',
    lat: 11.40, lon: 76.73,
    alt: '2,240 m',
    type: 'Junction of Western & Eastern Ghats',
    imageEmoji: '🚂',
    description: 'Located in the Blue Mountains (Nilgiris) where the Western Ghats and Eastern Ghats meet. Home to Doddabetta Peak (2,637 m).',
    highlight: 'NCERT Key Fact: The point where Western and Eastern Ghats converge!',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'anamudi',
    name: 'Anamudi Peak (Munnar)',
    hindiName: 'अनामुडी (२,६९५ मी - केरल)',
    category: 'peaks',
    rangeId: 'western_ghats',
    lat: 10.17, lon: 77.06,
    alt: '2,695 m',
    type: 'Highest Peak in South India',
    imageEmoji: '🏔️',
    description: 'The "Everest of South India", located in Eravikulam National Park, Kerala. Home to Nilgiri Tahr and rolling emerald tea plantations.',
    highlight: 'Class 6 NCERT: Highest mountain summit in Peninsular India',
    labelOffsetX: 10, labelOffsetY: 6
  },

  // EASTERN GHATS
  {
    id: 'araku',
    name: 'Araku Valley & Borra Caves',
    hindiName: 'अराकू घाटी एवं बोरा गुफाएं',
    category: 'hill_stations',
    rangeId: 'eastern_ghats',
    lat: 18.33, lon: 82.88,
    alt: '911 m',
    type: 'Eastern Ghats Hill Station',
    imageEmoji: '☕',
    description: 'A picturesque valley in Andhra Pradesh surrounded by Galikonda and Raktakonda hills, famous for organic coffee and 150-million-year-old limestone caves.',
    highlight: 'Borra Caves have spectacular million-year stalactites and stalagmites',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'mahendragiri',
    name: 'Mahendragiri Peak',
    hindiName: 'महेंद्रगिरि (ओडिशा)',
    category: 'peaks',
    rangeId: 'eastern_ghats',
    lat: 18.96, lon: 84.36,
    alt: '1,501 m',
    type: 'Historic Peak of Eastern Ghats',
    imageEmoji: '⛰️',
    description: 'A prominent peak in the Gajapati district of Odisha with ancient temples and rich medicinal plant biodiversity.',
    highlight: 'Mentioned in ancient Indian epics; overlooks the Bay of Bengal',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // PURVANCHAL & NORTH-EAST
  {
    id: 'cherrapunji',
    name: 'Mawsynram & Cherrapunji',
    hindiName: 'मौसिनराम एवं चेरापूंजी',
    category: 'nature',
    rangeId: 'purvanchal',
    lat: 25.30, lon: 91.58,
    alt: '1,430 m',
    type: 'Wettest Places on Earth',
    imageEmoji: '🌧️',
    description: 'Located on the southern slopes of the Khasi Hills in Meghalaya, receiving over 11,800 mm of annual rainfall due to trapped monsoon clouds.',
    highlight: 'World record holder for highest annual rainfall on Earth',
    labelOffsetX: -140, labelOffsetY: 10
  },
  {
    id: 'root_bridges',
    name: 'Living Root Bridges',
    hindiName: 'जीवित जड़ पुल (मेघालय)',
    category: 'heritage',
    rangeId: 'purvanchal',
    lat: 25.25, lon: 91.67,
    alt: '1,100 m',
    type: 'Bio-Engineering Wonder',
    imageEmoji: '🌿',
    description: 'Trained aerial roots of Ficus elastica trees grown across fast-flowing mountain streams by the indigenous Khasi and Jaintia tribes.',
    highlight: 'Over 500 years old, self-strengthening suspension bridges in dense rain forests',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'saramati',
    name: 'Mt. Saramati',
    hindiName: 'माउंट सारामती (नागालैंड)',
    category: 'peaks',
    rangeId: 'purvanchal',
    lat: 25.74, lon: 95.03,
    alt: '3,841 m',
    type: 'Highest Peak of Purvanchal',
    imageEmoji: '🏔️',
    description: 'Rising on the Nagaland-Myanmar border in the Naga Hills, permanently draped in clouds and winter snow.',
    highlight: 'Highest summit in the Purvanchal (North-Eastern) fold belt',
    labelOffsetX: 10, labelOffsetY: -6
  }
];

export const MOUNTAIN_RANGES = [
  {
    id: 'greater_himalayas',
    name: 'The Great Himalayas (Himadri)',
    hindiName: 'वृहत हिमालय / हिमाद्रि',
    category: 'young_fold',
    type: 'Young Fold Mountains',
    avgElevation: '6,000 m+',
    highestPeak: 'Kanchenjunga (8,586 m) / Mt. Everest (8,848 m)',
    states: ['Ladakh', 'Jammu & Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh'],
    rivers: ['Ganga', 'Yamuna', 'Indus', 'Brahmaputra'],
    description: 'The highest, continuous northern mountain wall on Earth. Formed by the tectonic collision of the Indian and Eurasian plates. Permanently snow-covered with massive glaciers.',
    ncertFact: 'Class 6 NCERT: "The northernmost range is known as the Great Himalaya or Himadri. The world\'s highest peaks are located in this range."',
    didYouKnow: 'The Himalayas are the youngest mountain range on Earth and are still rising around 5 cm taller every year due to tectonic plate movement!',
    features: ['Permanently snow-clad crests', 'Origin of Perennial Rivers', 'Youngest & highest mountain system']
  },
  {
    id: 'karakoram',
    name: 'Karakoram & Ladakh Ranges',
    hindiName: 'काराकोरम एवं लद्दाख श्रेणी (Trans-Himalayas)',
    category: 'young_fold',
    type: 'Trans-Himalayan Fold System',
    avgElevation: '5,500 m - 8,000 m',
    highestPeak: 'K2 / Godwin-Austen (8,611 m - 2nd Highest in World)',
    states: ['Ladakh', 'Gilgit-Baltistan'],
    rivers: ['Shyok', 'Nubra', 'Indus River Gorge', 'Siachen Glacier'],
    description: 'Lies north of the Great Himalayas. Home to Siachen Glacier (second longest non-polar glacier) and K2, the second highest peak on Earth.',
    ncertFact: 'Forms the northern frontier of India in Ladakh. High cold desert with steep rock and ice peaks.',
    didYouKnow: 'K2 is called the "Savage Mountain" because it is one of the most difficult and steepest peaks in the world to climb!',
    features: ['Home to K2 (8,611m)', 'Siachen Glacier', 'High-altitude cold desert terrain']
  },
  {
    id: 'lesser_himalayas',
    name: 'Lesser Himalayas (Himachal)',
    hindiName: 'लघु हिमालय / हिमाचल',
    category: 'young_fold',
    type: 'Young Fold Mountains',
    avgElevation: '3,700 m - 4,500 m',
    highestPeak: 'Pir Panjal & Dhauladhar Ridges (~5,000 m)',
    states: ['Jammu & Kashmir', 'Himachal Pradesh', 'Uttarakhand'],
    rivers: ['Beas', 'Ravi', 'Chenab', 'Alaknanda'],
    description: 'Located south of the Himadri. Known for famous picturesque hill stations including Shimla, Kullu-Manali, Mussoorie, Nainital, and lush coniferous pine and deodar forests.',
    ncertFact: 'Class 6 NCERT: "Himachal or lesser Himalaya lies to the south of Himadri. Many popular hill stations are situated here."',
    didYouKnow: 'The famous valleys of Kashmir, Kangra, and Kullu are nestled between the Great Himalayas and the Lesser Himalayas!',
    features: ['Famous Hill Stations', 'Valleys of Kashmir, Kangra & Kullu', 'Dense Deodar & Oak Forests']
  },
  {
    id: 'shiwalik',
    name: 'Outer Himalayas (Shiwalik Range)',
    hindiName: 'शिवालिक श्रेणी',
    category: 'young_fold',
    type: 'Young Fold Foothills',
    avgElevation: '900 m - 1,100 m',
    highestPeak: 'Shiwalik Foothill Ridges (~1,200 m)',
    states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Assam'],
    rivers: ['Ghaggar', 'Giri', 'Kosi', 'Teesta'],
    description: 'The outermost and lowest range of the Himalayas, composed of loose unconsolidated sediments brought down by Himalayan rivers. Separated from Himachal by longitudinal valleys called "Duns" (e.g., Dehradun).',
    ncertFact: 'Class 6 NCERT: "The Shiwalik is the southernmost range of the Himalayas."',
    didYouKnow: 'Dehradun is located in a longitudinal valley ("Dun") between the Lesser Himalayas and the Shiwalik range!',
    features: ['Longitudinal Duns (Dehradun)', 'Loose river gravels & silt', 'Prone to landslides & earthquakes']
  },
  {
    id: 'aravalli',
    name: 'Aravalli Range',
    hindiName: 'अरावली पर्वतमाला',
    category: 'old_fold',
    type: 'Old Fold Mountains (Relict/Eroded)',
    avgElevation: '400 m - 900 m',
    highestPeak: 'Guru Shikhar (1,722 m) at Mount Abu',
    states: ['Rajasthan', 'Haryana', 'Delhi (Raisina Hill)', 'Gujarat'],
    rivers: ['Banas', 'Luni', 'Sabarmati', 'Sahibi'],
    description: 'One of the oldest fold mountain systems in the world! Severely eroded over billions of years. Runs southwest to northeast, acting as a natural shield preventing the Thar Desert from expanding eastward.',
    ncertFact: 'Class 6 NCERT: "The Aravalli range is one of the oldest fold mountain systems in the world. The range has considerably worn down due to erosion."',
    didYouKnow: 'The Rashtrapati Bhavan in New Delhi is built on Raisina Hill, which is the northernmost tip of the ancient Aravalli Range!',
    features: ['Oldest mountain range in India & Earth', 'Prevents desertification of North India', 'Guru Shikhar (1,722 m)']
  },
  {
    id: 'vindhya',
    name: 'Vindhya Range',
    hindiName: 'विंध्याचल पर्वतमाला',
    category: 'block',
    type: 'Block / Relict Escarpment',
    avgElevation: '450 m - 600 m',
    highestPeak: 'Sadbhawna Shikhar / Kalumar (752 m)',
    states: ['Madhya Pradesh', 'Uttar Pradesh', 'Gujarat', 'Bihar'],
    rivers: ['Chambal', 'Betwa', 'Ken', 'Son'],
    description: 'Forms the traditional geographical boundary dividing Northern India (Gangetic Plains) from Southern India (Deccan Plateau). Sandstone and limestone plateaus.',
    ncertFact: 'Class 6 NCERT: "The Vindhyas and the Satpuras are important ranges. The rivers Narmada and Tapi flow through these ranges."',
    didYouKnow: 'Famous historic monuments like the Sanchi Stupa and the Red Fort were built using red sandstone quarried from the Vindhya Range!',
    features: ['Divides North and South India', 'North of Narmada rift valley', 'Rich in Sandstone & Minerals']
  },
  {
    id: 'satpura',
    name: 'Satpura Range',
    hindiName: 'सतपुड़ा पर्वतमाला',
    category: 'block',
    type: 'Horst Block Mountain System',
    avgElevation: '600 m - 1,000 m',
    highestPeak: 'Dhupgarh (1,350 m) near Pachmarhi',
    states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat', 'Chhattisgarh'],
    rivers: ['Narmada (North Valley)', 'Tapi (South Valley)'],
    description: 'A true block mountain (Horst) bounded by two famous fault-trough rift valleys: Narmada River to the north and Tapi River to the south, both flowing west into the Arabian Sea.',
    ncertFact: 'Class 6 NCERT: "Rivers Narmada and Tapi are west-flowing rivers that drain into the Arabian Sea, flowing between the Vindhyas and Satpuras."',
    didYouKnow: '"Satpura" in Sanskrit means "Seven Folds"! Pachmarhi is the highest hill station in central India.',
    features: ['Horst block mountain structure', 'Flanked by Narmada and Tapi rift valleys', 'Highest Peak: Dhupgarh (1,350 m)']
  },
  {
    id: 'western_ghats',
    name: 'Western Ghats (Sahyadri)',
    hindiName: 'पश्चिमी घाट / सह्याद्रि',
    category: 'coastal',
    type: 'Continuous Escarpment & Highland',
    avgElevation: '1,000 m - 2,695 m',
    highestPeak: 'Anamudi (2,695 m) - Highest Peak in South India',
    states: ['Gujarat', 'Maharashtra', 'Goa', 'Karnataka', 'Kerala', 'Tamil Nadu'],
    rivers: ['Godavari', 'Krishna', 'Kaveri', 'Periyar'],
    description: 'A continuous, unbroken mountain barrier running parallel to the west coast for 1,600 km. Causes heavy orographic rainfall. Major global biodiversity hotspot.',
    ncertFact: 'Class 6 NCERT: "The Western Ghats or Sahyadris border the Deccan plateau in the west. The Western Ghats are continuous."',
    didYouKnow: 'Anamudi in Kerala (2,695 m) is the highest peak in South India—often called the "Everest of South India"!',
    features: ['Continuous unbroken mountain wall', 'Anamudi (2,695 m): Highest in South India', 'UNESCO World Heritage Biodiversity Hotspot']
  },
  {
    id: 'eastern_ghats',
    name: 'Eastern Ghats',
    hindiName: 'पूर्वी घाट',
    category: 'coastal',
    type: 'Discontinuous / Dissected Hills',
    avgElevation: '600 m - 1,500 m',
    highestPeak: 'Jindhagada Peak (1,690 m) / Mahendragiri (1,501 m)',
    states: ['Odisha', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    rivers: ['Mahanadi', 'Godavari', 'Krishna', 'Kaveri'],
    description: 'An irregular, eroded, and discontinuous chain of hills along the east coast. Heavily dissected by major eastward-flowing peninsular rivers draining into the Bay of Bengal.',
    ncertFact: 'Class 6 NCERT: "The Eastern Ghats border the Deccan plateau in the east. The Eastern Ghats are discontinuous and uneven."',
    didYouKnow: 'The Western Ghats and Eastern Ghats meet and join together at the beautiful blue Nilgiri Hills in Tamil Nadu/Kerala!',
    features: ['Discontinuous & broken by large river deltas', 'Meets Western Ghats at Nilgiri Hills', 'Mahendragiri / Jindhagada Peaks']
  },
  {
    id: 'purvanchal',
    name: 'Purvanchal (North-Eastern Hills)',
    hindiName: 'पूर्वांचल पर्वत श्रेणियां',
    category: 'purvanchal',
    type: 'Sedimentary Fold Hills',
    avgElevation: '1,500 m - 3,800 m',
    highestPeak: 'Mt. Saramati (3,841 m, Nagaland) / Phawngpui (Blue Mountain)',
    states: ['Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Meghalaya'],
    rivers: ['Barak', 'Surma', 'Subansiri', 'Lohit'],
    description: 'The sharp southward bend of the Himalayas beyond the Dihang gorge. Composed of Patkai Bum, Naga Hills, Manipur Hills, Mizo Hills, and Garo, Khasi, Jaintia Hills.',
    ncertFact: 'Class 6 NCERT: Beyond the Brahmaputra gorge, the Himalayas bend sharply to the south and spread along the eastern boundary of India as the Purvanchal.',
    didYouKnow: 'Mawsynram and Cherrapunji in the Khasi Hills receive the highest annual rainfall in the world (over 11,000 mm)!',
    features: ['Garo, Khasi & Jaintia Hills (World\'s highest rainfall at Mawsynram)', 'Dense evergreen rainforests', 'Saramati (3,841m)']
  }
];

export const MOUNTAIN_QUIZ = [
  {
    question: 'Which is the oldest fold mountain range in India and the world?',
    options: ['The Himalayas', 'Aravalli Range', 'Western Ghats', 'Satpura Range'],
    answer: 'Aravalli Range',
    rangeId: 'aravalli',
    explanation: 'The Aravalli Range in Rajasthan is one of the oldest fold mountain systems in the world, worn down by millions of years of erosion.'
  },
  {
    question: 'Which mountain range has Anamudi (2,695 m), the highest peak in South India?',
    options: ['Eastern Ghats', 'Vindhya Range', 'Western Ghats (Sahyadri)', 'Shiwalik Range'],
    answer: 'Western Ghats (Sahyadri)',
    rangeId: 'western_ghats',
    explanation: 'Anamudi in Kerala (2,695 m) is the highest peak in Peninsular / South India, located in the Western Ghats.'
  },
  {
    question: 'The Narmada and Tapi rivers flow in rift valleys between which two mountain ranges?',
    options: ['Aravalli and Himalayas', 'Vindhya and Satpura Ranges', 'Western and Eastern Ghats', 'Himadri and Himachal'],
    answer: 'Vindhya and Satpura Ranges',
    rangeId: 'satpura',
    explanation: 'The Narmada and Tapi rivers flow westward through rift valleys bounded by the Vindhya Range to the north and the Satpura Range to the south.'
  },
  {
    question: 'Why are the Eastern Ghats described as "discontinuous and irregular"?',
    options: ['They were eroded by wind', 'Major east-flowing rivers (Godavari, Krishna, Mahanadi) cut through them', 'They are volcanic craters', 'They have no peaks'],
    answer: 'Major east-flowing rivers (Godavari, Krishna, Mahanadi) cut through them',
    rangeId: 'eastern_ghats',
    explanation: 'Major rivers flowing into the Bay of Bengal have dissected and eroded the Eastern Ghats into broken segments.'
  }
];

export default function IndiaMountainsMapExplorer({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlaceId, setSelectedPlaceId] = useState('k2');
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'quiz'
  const [detailPage, setDetailPage] = useState(1); // 1 | 2

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  const selectedPlace = useMemo(() => {
    return ATTRACTIVE_PLACES.find(p => p.id === selectedPlaceId) || ATTRACTIVE_PLACES[0];
  }, [selectedPlaceId]);

  const selectedRange = useMemo(() => {
    return MOUNTAIN_RANGES.find(r => r.id === selectedPlace.rangeId) || MOUNTAIN_RANGES[0];
  }, [selectedPlace]);

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === 'all') return ATTRACTIVE_PLACES;
    return ATTRACTIVE_PLACES.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const placeIndex = filteredPlaces.findIndex(p => p.id === selectedPlaceId);

  const handleNextPlace = () => {
    const nextIdx = (placeIndex + 1) % filteredPlaces.length;
    setSelectedPlaceId(filteredPlaces[nextIdx].id);
    setDetailPage(1);
  };

  const handlePrevPlace = () => {
    const prevIdx = (placeIndex - 1 + filteredPlaces.length) % filteredPlaces.length;
    setSelectedPlaceId(filteredPlaces[prevIdx].id);
    setDetailPage(1);
  };

  const modalContent = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999999,
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(6px, 1.2vw, 14px)',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: 'min(1440px, 98vw)',
        height: 'min(860px, 95vh)',
        maxHeight: '95vh',
        background: '#FFFDF9',
        borderRadius: '20px',
        border: '2px solid #E2D4B7',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* 1. TOP NAVBAR */}
        <div style={{
          height: '50px',
          flexShrink: 0,
          background: 'linear-gradient(90deg, #1C1917 0%, #292524 40%, #1E293B 100%)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '2px solid #D97706'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#D97706', display: 'grid', placeItems: 'center',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)'
            }}>
              <Mountain size={18} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Mountains & Famous Places of India: Physical Atlas
                <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#92400E', padding: '1px 7px', borderRadius: '5px', fontWeight: 800 }}>
                  NCERT CLASS 6
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.12)', padding: '2px', borderRadius: '8px' }}>
              <button
                onClick={() => setActiveTab('explore')}
                style={{
                  border: 'none',
                  background: activeTab === 'explore' ? '#D97706' : 'transparent',
                  color: '#FFF',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🗺️ Interactive Map
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                style={{
                  border: 'none',
                  background: activeTab === 'quiz' ? '#10B981' : 'transparent',
                  color: '#FFF',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                🎯 Mountain Quiz
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.75)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. CATEGORY FILTER STRIP (Strict 38px, Zero horizontal scroll) */}
        <div style={{
          height: '38px',
          flexShrink: 0,
          background: '#FFF9F0',
          borderBottom: '1.5px solid #E2D4B7',
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflow: 'hidden' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#78350F', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              Explore:
            </span>
            {PLACE_CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'all') {
                      const first = ATTRACTIVE_PLACES.find(p => p.category === cat.id);
                      if (first) setSelectedPlaceId(first.id);
                    }
                  }}
                  style={{
                    border: active ? '1.5px solid #D97706' : '1px solid #E2D4B7',
                    background: active ? '#FEF3C7' : '#FFFFFF',
                    color: active ? '#78350F' : '#475569',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 1px 4px rgba(217, 119, 6, 0.15)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '10.5px', color: '#92400E', fontWeight: 800, whiteSpace: 'nowrap' }}>
            📍 Click any Pinpoint to Explore
          </div>
        </div>

        {/* 3. MAIN SPLIT BODY */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
          
          {/* LEFT PANEL: REALISTIC PHYSICAL RELIEF SVG MAP WITH PINPOINTS (58%) */}
          <div style={{
            flex: '1 1 58%',
            minWidth: 0,
            background: 'radial-gradient(ellipse at 50% 50%, #F5EEDA 0%, #E6D8BE 55%, #D4C3A3 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRight: '2px solid #E2D4B7',
            overflow: 'hidden'
          }}>
            <svg
              viewBox="0 0 612 696"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: '100%',
                display: 'block',
                filter: 'drop-shadow(0 6px 16px rgba(45, 26, 14, 0.15))'
              }}
            >
              <defs>
                {/* Pin Pulse Glow */}
                <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Ocean Bathymetry Gradients */}
                <linearGradient id="oceanGradArabian" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0369A1" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="oceanGradBay" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0D9488" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Realistic Ocean Water Layer */}
              <rect x="0" y="320" width="160" height="376" fill="url(#oceanGradArabian)" />
              <rect x="390" y="320" width="222" height="376" fill="url(#oceanGradBay)" />

              {/* India Base States Layer */}
              <g id="india-states-base">
                {IndiaMapData.locations.map(loc => (
                  <path
                    key={loc.id}
                    d={loc.path}
                    fill="#FAF5EB"
                    stroke="#D6C5A2"
                    strokeWidth="0.75"
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Realistic Topographical Terrain Relief (No artificial wire lines!) */}
              {/* 1. Himalayan Alpine Snow & Mountain Shading */}
              <path
                d="M 125,25 Q 165,45 220,68 T 330,165 T 450,225 T 575,190 L 565,230 Q 445,250 320,205 T 140,85 Z"
                fill="#78350F"
                opacity="0.18"
              />
              <path
                d="M 130,40 Q 220,100 320,170 T 445,225 T 565,200"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.45"
                style={{ filter: 'blur(3px)' }}
              />

              {/* 2. Indo-Gangetic Fertile Alluvial Plains */}
              <path
                d="M 175,200 Q 270,240 420,260 T 480,300 L 440,320 Q 300,280 185,250 Z"
                fill="#86EFAC"
                opacity="0.35"
              />

              {/* 3. Thar Desert Sand Dunes */}
              <path
                d="M 80,220 Q 140,240 130,310 T 70,300 Z"
                fill="#FDE047"
                opacity="0.35"
              />

              {/* 4. Deccan Plateau Highlands */}
              <path
                d="M 120,400 Q 200,380 280,410 T 260,540 T 170,610 T 130,500 Z"
                fill="#FEF08A"
                opacity="0.4"
              />

              {/* 5. Western Ghats Emerald Mountain Ridge */}
              <path
                d="M 100,405 Q 115,480 135,550 T 175,640"
                fill="none"
                stroke="#15803D"
                strokeWidth="14"
                strokeLinecap="round"
                opacity="0.25"
                style={{ filter: 'blur(4px)' }}
              />

              {/* 6. Eastern Ghats Mountain Highlands */}
              <path
                d="M 345,430 Q 305,485 270,540 T 215,610"
                fill="none"
                stroke="#0D9488"
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.2"
                style={{ filter: 'blur(4px)' }}
              />

              {/* Realistic River Networks */}
              <g id="natural-rivers" pointerEvents="none" opacity="0.65">
                {/* Ganga */}
                <path d="M 210,135 Q 260,190 320,230 T 430,265 T 480,285" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
                {/* Indus */}
                <path d="M 190,75 Q 150,85 130,120 T 100,165" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
                {/* Brahmaputra */}
                <path d="M 450,185 Q 520,180 570,215 T 510,260 T 475,285" fill="none" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
                {/* Narmada (Rift Valley) */}
                <path d="M 285,348 Q 200,355 125,360" fill="none" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" />
                {/* Tapi */}
                <path d="M 270,378 Q 200,385 120,388" fill="none" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
                {/* Godavari */}
                <path d="M 140,430 Q 220,445 320,475" fill="none" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
                {/* Krishna */}
                <path d="M 145,490 Q 210,510 290,530" fill="none" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
                {/* Kaveri */}
                <path d="M 150,570 Q 180,580 230,590" fill="none" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
              </g>

              {/* ATTRACTIVE PINPOINTS & FAMOUS PLACES (ZERO WIRE LINES!) */}
              <g id="interactive-pinpoints">
                {filteredPlaces.map(place => {
                  const coords = projectCoords(place.lat, place.lon);
                  const isSelected = selectedPlaceId === place.id;
                  const isHovered = hoveredPlaceId === place.id;

                  // Dynamic marker styling based on category
                  const pinColor = isSelected ? '#D97706' : (place.category === 'peaks' ? '#B45309' : place.category === 'hill_stations' ? '#15803D' : place.category === 'nature' ? '#0284C7' : '#7C3AED');

                  return (
                    <g
                      key={place.id}
                      transform={`translate(${coords.x}, ${coords.y})`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaceId(place.id);
                        setDetailPage(1);
                        if (activeTab === 'quiz' && MOUNTAIN_QUIZ[quizIdx].rangeId === place.rangeId) {
                          setSelectedQuizAnswer(place.name);
                        }
                      }}
                      onMouseEnter={() => setHoveredPlaceId(place.id)}
                      onMouseLeave={() => setHoveredPlaceId(null)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {/* Selected Pulse Rings */}
                      {isSelected && (
                        <>
                          <circle r="14" fill="none" stroke="#D97706" strokeWidth="1.5" opacity="0.6">
                            <animate attributeName="r" values="6;16;6" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                          </circle>
                          <circle r="20" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3">
                            <animate attributeName="r" values="10;22;10" dur="2.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.5;0.05;0.5" dur="2.5s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}

                      {/* Pin Drop Shadow */}
                      <ellipse cx="0" cy="2" rx="4" ry="2" fill="rgba(0,0,0,0.3)" />

                      {/* Map Pin Marker */}
                      <g transform={isSelected ? 'scale(1.25) translate(0, -3)' : isHovered ? 'scale(1.15) translate(0, -2)' : 'scale(1)'} style={{ transition: 'transform 0.15s ease' }}>
                        {/* Pin Head Bubble */}
                        <circle
                          r={isSelected ? "7" : "5.5"}
                          fill={pinColor}
                          stroke="#FFFFFF"
                          strokeWidth={isSelected ? "1.8" : "1.2"}
                          style={{ filter: isSelected ? 'drop-shadow(0 2px 5px rgba(217,119,6,0.5))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}
                        />
                        {/* Pin Inner Core Dot */}
                        <circle
                          r={isSelected ? "2.5" : "1.8"}
                          fill="#FFFFFF"
                        />
                      </g>

                      {/* Elegant Non-Overlapping Place Tag */}
                      <g transform={`translate(${place.labelOffsetX || 10}, ${place.labelOffsetY || -6})`}>
                        <rect
                          x="0"
                          y="-8"
                          width={place.name.length * 6 + 18}
                          height="16"
                          rx="4"
                          fill={isSelected ? '#1E293B' : 'rgba(255,255,255,0.94)'}
                          stroke={isSelected ? '#D97706' : '#CBD5E1'}
                          strokeWidth={isSelected ? 1.5 : 0.75}
                          style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.12))' }}
                        />
                        <text
                          x="4"
                          y="3.5"
                          fill={isSelected ? '#FDE68A' : '#451A03'}
                          fontSize="8.5"
                          fontWeight={isSelected ? '900' : '700'}
                          style={{ pointerEvents: 'none', fontFamily: '"Space Grotesk", sans-serif' }}
                        >
                          {place.imageEmoji} {place.name.split('(')[0]}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Water Body Labels */}
              <text x="35" y="470" fill="#0369A1" fontSize="9.5" fontWeight="800" opacity="0.6" style={{ letterSpacing: '1px' }}>ARABIAN SEA</text>
              <text x="440" y="470" fill="#0F766E" fontSize="9.5" fontWeight="800" opacity="0.6" style={{ letterSpacing: '1px' }}>BAY OF BENGAL</text>
              <text x="240" y="665" fill="#1E3A8A" fontSize="9" fontWeight="800" opacity="0.6" style={{ letterSpacing: '1px' }}>INDIAN OCEAN</text>

              {/* MAP COMPASS ROSE */}
              <g transform="translate(45, 620)">
                <circle r="16" fill="rgba(255,255,255,0.92)" stroke="#CBD5E1" strokeWidth="1" />
                <polygon points="0,-12 3.5,0 0,2.5 -3.5,0" fill="#DC2626" />
                <polygon points="0,12 3.5,0 0,-2.5 -3.5,0" fill="#475569" />
                <text x="0" y="-5" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900">N</text>
                <text x="0" y="22" textAnchor="middle" fill="#475569" fontSize="7" fontWeight="800">PHYSICAL ATLAS</text>
              </g>
            </svg>

            {/* Map Key / Legend */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #E2D4B7',
              borderRadius: '6px',
              padding: '5px 8px',
              boxShadow: '0 2px 6px rgba(60,40,20,0.08)',
              fontSize: '9.5px',
              color: '#451A03',
              lineHeight: 1.3
            }}>
              <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '8.5px', color: '#92400E', marginBottom: '2px' }}>
                Key:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', background: '#B45309', borderRadius: '50%' }} /> 🏔️ High Peaks
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', background: '#15803D', borderRadius: '50%' }} /> 🌲 Hill Stations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', background: '#0284C7', borderRadius: '50%' }} /> 🌊 Waterfalls/Glaciers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', background: '#7C3AED', borderRadius: '50%' }} /> 🏛️ Heritage/Passes
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: ZERO-SCROLL PAGINATED LEARNING CONSOLE (42%) */}
          <div style={{
            flex: '1 1 42%',
            minWidth: 0,
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {activeTab === 'explore' ? (
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '10px 14px', overflow: 'hidden', justifyContent: 'space-between' }}>
                
                {/* 1. TOP TITLE & PLACE CYCLE SWITCHER */}
                <div style={{ flexShrink: 0, borderBottom: '1.5px solid #F1E5D1', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#FEF3C7',
                      color: '#92400E',
                      border: '1px solid #FDE68A'
                    }}>
                      {selectedPlace.type}
                    </span>

                    {/* Cycle Through All Places */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button
                        onClick={handlePrevPlace}
                        title="Previous Attraction"
                        style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: '1px solid #E2E8F0', background: '#F8FAFC',
                          color: '#475569', fontWeight: 900, fontSize: '11px',
                          cursor: 'pointer', display: 'grid', placeItems: 'center'
                        }}
                      >
                        ‹
                      </button>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                        {placeIndex + 1} / {filteredPlaces.length}
                      </span>
                      <button
                        onClick={handleNextPlace}
                        title="Next Attraction"
                        style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          border: '1px solid #E2E8F0', background: '#F8FAFC',
                          color: '#475569', fontWeight: 900, fontSize: '11px',
                          cursor: 'pointer', display: 'grid', placeItems: 'center'
                        }}
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: 'clamp(16px, 1.9vw, 20px)', fontWeight: 900, color: '#451A03', fontFamily: '"Fraunces", Georgia, serif', lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{selectedPlace.imageEmoji}</span> {selectedPlace.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 700 }}>
                    {selectedPlace.hindiName} • Part of {selectedRange.name}
                  </div>
                </div>

                {/* 2. PAGINATED BODY CONTENT (ZERO VERTICAL SCROLL) */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '4px 0' }}>
                  {detailPage === 1 ? (
                    /* PAGE 1: OVERVIEW & 4 QUICK STATS */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '5px' }}>
                      <p style={{ fontSize: '11.5px', color: '#334155', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                        {selectedPlace.description}
                      </p>

                      {/* Quick 4-Box Stats Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '8px', padding: '5px 7px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🏔️ Altitude / Elevation
                          </div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#451A03', marginTop: '1px' }}>
                            {selectedPlace.alt}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '8px', padding: '5px 7px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🏷️ Feature Type
                          </div>
                          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#D97706', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedPlace.type.split('(')[0]}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '8px', padding: '5px 7px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🗺️ Mountain Range
                          </div>
                          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#451A03', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedRange.name.split('(')[0]}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '8px', padding: '5px 7px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🌊 Range Rivers
                          </div>
                          <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#451A03', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedRange.rivers.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '5px 8px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '2px' }}>
                          Key Attraction Highlight:
                        </div>
                        <div style={{ fontSize: '11px', color: '#1E293B', fontWeight: 600, lineHeight: 1.35 }}>
                          ✨ {selectedPlace.highlight}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PAGE 2: NCERT 6TH GRADE CONCEPTS & MOUNTAIN SYSTEM NOTES */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '5px' }}>
                      {/* NCERT 6th Grade Textbook Core Fact */}
                      <div style={{
                        background: 'linear-gradient(140deg, #FEF3C7 0%, #FDE68A 100%)',
                        border: '1.5px solid #F59E0B',
                        borderRadius: '8px',
                        padding: '7px 9px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '9.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                          <Sparkles size={12} color="#D97706" /> NCERT Class 6 Concept:
                        </div>
                        <div style={{ fontSize: '11px', color: '#78350F', fontWeight: 600, marginTop: '2px', lineHeight: 1.35 }}>
                          {selectedRange.ncertFact}
                        </div>
                      </div>

                      {/* States Covered */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '5px 7px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '3px' }}>
                          🗺️ Range States Covered:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                          {selectedRange.states.map(st => (
                            <span key={st} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '1px 5px', borderRadius: '4px', fontSize: '9.5px', fontWeight: 700, color: '#1E293B' }}>
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Did You Know? */}
                      <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '8px', padding: '6px 8px' }}>
                        <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                          💡 Did You Know?
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#1E3A8A', fontWeight: 600, marginTop: '2px', lineHeight: 1.3 }}>
                          {selectedRange.didYouKnow}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SUB-PAGE CONTROLS & "NEXT PLACE" BUTTON */}
                <div style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1.5px solid #F1E5D1',
                  paddingTop: '5px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                      onClick={() => setDetailPage(p => Math.max(1, p - 1))}
                      disabled={detailPage === 1}
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 800,
                        fontSize: '10.5px',
                        background: '#FFF9F0',
                        color: '#78350F',
                        border: '1.5px solid #F2DFBC',
                        borderRadius: '999px',
                        padding: '3px 9px',
                        cursor: detailPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: detailPage === 1 ? 0.35 : 1
                      }}
                    >
                      ◀ Back
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        onClick={() => setDetailPage(1)}
                        style={{
                          width: detailPage === 1 ? '12px' : '5px',
                          height: '5px',
                          borderRadius: '999px',
                          background: detailPage === 1 ? '#D97706' : '#E2D4B7',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      />
                      <span
                        onClick={() => setDetailPage(2)}
                        style={{
                          width: detailPage === 2 ? '12px' : '5px',
                          height: '5px',
                          borderRadius: '999px',
                          background: detailPage === 2 ? '#D97706' : '#E2D4B7',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      />
                    </div>

                    <button
                      onClick={() => setDetailPage(p => Math.min(2, p + 1))}
                      disabled={detailPage === 2}
                      style={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 800,
                        fontSize: '10.5px',
                        background: detailPage === 2 ? '#F7F1E2' : '#F59E0B',
                        color: detailPage === 2 ? '#78350F' : '#FFFFFF',
                        border: `1.5px solid ${detailPage === 2 ? '#F2DFBC' : '#F59E0B'}`,
                        borderRadius: '999px',
                        padding: '3px 9px',
                        cursor: detailPage === 2 ? 'not-allowed' : 'pointer',
                        opacity: detailPage === 2 ? 0.35 : 1
                      }}
                    >
                      Next ▶
                    </button>
                  </div>

                  <button
                    onClick={handleNextPlace}
                    style={{
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 800,
                      fontSize: '10.5px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    Next Place ➔
                  </button>
                </div>

              </div>
            ) : (
              /* QUIZ MODE */
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 14px', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 800 }}>
                    QUESTION {quizIdx + 1} OF {MOUNTAIN_QUIZ.length}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534' }}>
                    Score: {quizScore} / {MOUNTAIN_QUIZ.length}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B', lineHeight: 1.35, margin: '4px 0' }}>
                  {MOUNTAIN_QUIZ[quizIdx].question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {MOUNTAIN_QUIZ[quizIdx].options.map(opt => {
                    const isPicked = selectedQuizAnswer === opt;
                    const isCorrect = opt === MOUNTAIN_QUIZ[quizIdx].answer;
                    let btnBg = '#FFF9F0', btnBorder = '#F2DFBC', btnColor = '#3D2E24';

                    if (selectedQuizAnswer !== null) {
                      if (isCorrect) { btnBg = '#DCFCE7'; btnBorder = '#16A34A'; btnColor = '#166534'; }
                      else if (isPicked) { btnBg = '#FEE2E2'; btnBorder = '#EF4444'; btnColor = '#991B1B'; }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (selectedQuizAnswer !== null) return;
                          setSelectedQuizAnswer(opt);
                          const targetPlace = ATTRACTIVE_PLACES.find(p => p.rangeId === MOUNTAIN_QUIZ[quizIdx].rangeId);
                          if (targetPlace) setSelectedPlaceId(targetPlace.id);
                          setDetailPage(1);
                          if (opt === MOUNTAIN_QUIZ[quizIdx].answer) {
                            setQuizScore(s => s + 1);
                          }
                        }}
                        style={{
                          padding: '6px 9px',
                          background: btnBg,
                          border: `1.5px solid ${btnBorder}`,
                          borderRadius: '7px',
                          color: btnColor,
                          fontSize: '11px',
                          fontWeight: 700,
                          textAlign: 'left',
                          cursor: selectedQuizAnswer ? 'default' : 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedQuizAnswer && (
                  <div style={{
                    background: selectedQuizAnswer === MOUNTAIN_QUIZ[quizIdx].answer ? '#DCFCE7' : '#FEF3C7',
                    border: `1px solid ${selectedQuizAnswer === MOUNTAIN_QUIZ[quizIdx].answer ? '#86EFAC' : '#FDE68A'}`,
                    borderRadius: '7px',
                    padding: '6px 8px',
                    marginTop: '2px'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '10.5px', color: selectedQuizAnswer === MOUNTAIN_QUIZ[quizIdx].answer ? '#166534' : '#92400E' }}>
                      {selectedQuizAnswer === MOUNTAIN_QUIZ[quizIdx].answer ? '✓ Correct Answer!' : 'ℹ️ Note:'}
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#334155', marginTop: '1px', lineHeight: 1.25 }}>
                      {MOUNTAIN_QUIZ[quizIdx].explanation}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '5px', marginTop: '4px' }}>
                  <button
                    onClick={() => {
                      setQuizIdx(i => Math.max(0, i - 1));
                      setSelectedQuizAnswer(null);
                    }}
                    disabled={quizIdx === 0}
                    style={{
                      padding: '4px 10px', borderRadius: '5px', border: '1px solid #CBD5E1',
                      background: '#FFF', color: '#475569', fontWeight: 800, fontSize: '10.5px',
                      cursor: quizIdx === 0 ? 'not-allowed' : 'pointer', opacity: quizIdx === 0 ? 0.4 : 1
                    }}
                  >
                    ◀ Previous
                  </button>

                  {quizIdx < MOUNTAIN_QUIZ.length - 1 ? (
                    <button
                      onClick={() => {
                        setQuizIdx(i => i + 1);
                        setSelectedQuizAnswer(null);
                      }}
                      disabled={selectedQuizAnswer === null}
                      style={{
                        padding: '4px 12px', borderRadius: '5px', border: 'none',
                        background: '#D97706', color: '#FFF', fontWeight: 800, fontSize: '10.5px',
                        cursor: selectedQuizAnswer === null ? 'not-allowed' : 'pointer',
                        opacity: selectedQuizAnswer === null ? 0.4 : 1
                      }}
                    >
                      Next Question ▶
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizIdx(0);
                        setSelectedQuizAnswer(null);
                        setQuizScore(0);
                      }}
                      style={{
                        padding: '4px 12px', borderRadius: '5px', border: 'none',
                        background: '#10B981', color: '#FFF', fontWeight: 800, fontSize: '10.5px',
                        cursor: 'pointer'
                      }}
                    >
                      ↺ Restart Quiz
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
