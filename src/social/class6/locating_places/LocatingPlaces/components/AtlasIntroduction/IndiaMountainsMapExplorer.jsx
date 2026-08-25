import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Mountain, X, Sparkles, Compass, Layers, Info, CheckCircle2,
  HelpCircle, ChevronRight, Award, Eye, ArrowUpRight, MapPin,
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Radio, Activity, Navigation, Thermometer, ShieldCheck
} from 'lucide-react';
import { IndiaMapData } from '../LostInTheCity/IndiaMapData';
import IndiaRealisticThematicMap, { projectCoords } from './IndiaRealisticThematicMap';

export const PLACE_CATEGORIES = [
  { id: 'all', label: 'All Natural Features', icon: '🗺️' },
  { id: 'mountains', label: 'Mountains & Peaks', icon: '🏔️' },
  { id: 'plains', label: 'Plains & Basins', icon: '🏞️' },
  { id: 'rivers', label: 'Rivers & Waterways', icon: '🌊' },
  { id: 'deserts', label: 'Deserts & Salt Flats', icon: '🏜️' },
  { id: 'forests', label: 'Forests & Biospheres', icon: '🌳' },
  { id: 'plateaus', label: 'Plateaus & Highlands', icon: '⛰️' }
];

export const MAP_THEMES = {
  all: {
    id: 'all',
    name: '3D Physical Relief',
    image: '/mountains/maps/map_mountains_3d.png',
    filter: 'none',
    tint: 'transparent',
    badge: '🛰️ Master 3D Physical Relief Map',
    legendTitle: 'Master Physical Features'
  },
  mountains: {
    id: 'mountains',
    name: 'Mountain Orography & Peaks',
    image: '/mountains/maps/map_mountains_realistic.png',
    filter: 'contrast(1.15) brightness(1.02) saturate(1.15)',
    tint: 'rgba(217, 119, 6, 0.06)',
    badge: '🏔️ 3D Mountain Orography & Peaks Map',
    legendTitle: 'High Ranges & Peaks'
  },
  rivers: {
    id: 'rivers',
    name: 'Hydrology & River Drainage',
    image: '/mountains/maps/map_rivers_3d.jpg',
    filter: 'contrast(1.12) brightness(0.98) saturate(1.25)',
    tint: 'rgba(2, 132, 199, 0.12)',
    badge: '🌊 River Systems & Hydrology Drainage Map',
    legendTitle: 'Perennial & Peninsular Rivers'
  },
  forests: {
    id: 'forests',
    name: 'Forests & Vegetation Canopy',
    image: '/mountains/maps/map_forests_ref.png',
    filter: 'contrast(1.15) brightness(0.98) saturate(1.25)',
    tint: 'rgba(5, 150, 105, 0.12)',
    badge: '🌳 Realistic Vegetation Canopy & Biosphere Map',
    legendTitle: 'Rainforests & Mangroves'
  },
  plateaus: {
    id: 'plateaus',
    name: 'Plateaus & Geological Tablelands',
    image: '/mountains/maps/map_plateaus_ref.png',
    filter: 'contrast(1.18) brightness(0.98) saturate(1.2)',
    tint: 'rgba(139, 92, 246, 0.1)',
    badge: '⛰️ Peninsular Deccan & Tableland Geology Map',
    legendTitle: 'Volcanic Basalt & Mineral Plateaus'
  },
  plains: {
    id: 'plains',
    name: 'Alluvial Plains & Farming Basins',
    image: '/mountains/maps/india_plains_3d_relief.jpg',
    filter: 'contrast(1.06) brightness(1.02) saturate(1.12)',
    tint: 'rgba(16, 185, 129, 0.06)',
    badge: '🏞️ Indo-Gangetic & Coastal Alluvial Basins Map',
    legendTitle: 'Alluvial Farming Granary'
  },
  deserts: {
    id: 'deserts',
    name: 'Deserts & Arid Landscapes',
    image: '/mountains/maps/map_deserts_3d.jpg',
    filter: 'contrast(1.18) brightness(1.05) saturate(1.25)',
    tint: 'rgba(217, 119, 6, 0.12)',
    badge: '🏜️ Great Thar Desert & Salt Flats Map',
    legendTitle: 'Sand Dunes & Salt Marshes'
  }
};

export const ATTRACTIVE_PLACES = [
  // 1. MOUNTAINS & PEAKS
  {
    id: 'k2',
    name: 'K2 (Godwin-Austen)',
    hindiName: 'के२ (गॉडविन-ऑस्टिन)',
    category: 'mountains',
    rangeId: 'karakoram',
    lat: 35.88, lon: 76.51,
    map3dX: 30.1, map3dY: 4.6,
    alt: '8,611 m',
    type: 'World\'s 2nd Highest Peak',
    imageEmoji: '🏔️',
    realImage: '/mountains/k2.jpg',
    imageCaption: 'The Savage Mountain — colossal pyramid of rock and ice in the Karakoram Range',
    description: 'The second highest mountain on Earth. Known as the Savage Mountain for its steep and treacherous ice walls in the Karakoram Range.',
    highlight: 'Steep pyramid of rock & ice; second only to Mt. Everest',
    labelOffsetX: 10, labelOffsetY: -8
  },
  {
    id: 'kullu_manali',
    name: 'Kullu-Manali Valley',
    hindiName: 'कुल्लू-मनाली घाटी',
    category: 'mountains',
    rangeId: 'lesser_himalayas',
    lat: 32.24, lon: 77.19,
    map3dX: 32.1, map3dY: 16.9,
    alt: '2,050 m',
    type: 'Lesser Himalayan Valley',
    imageEmoji: '🌲',
    realImage: '/mountains/kullu_manali.jpg',
    imageCaption: 'Beas River valley flanked by snow-clad Pir Panjal and Dhauladhar ranges',
    description: 'Nestled along the Beas River between the Pir Panjal and Great Himalayan ranges, known for snow peaks, apple orchards, and pine forests.',
    highlight: 'Gateway to Solang Valley and Rohtang Pass',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'nanda_devi',
    name: 'Nanda Devi Peak',
    hindiName: 'नंदा देवी',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 30.37, lon: 79.97,
    map3dX: 41.3, map3dY: 23.4,
    alt: '7,816 m',
    type: 'Highest Peak Entirely in India',
    imageEmoji: '🏔️',
    realImage: '/mountains/nanda_devi.jpg',
    imageCaption: 'The majestic twin summits of Nanda Devi surrounded by an impenetrable mountain ring',
    description: 'A sacred, majestic peak surrounded by the Nanda Devi National Park and UNESCO Biosphere Reserve in Uttarakhand.',
    highlight: 'Two-peaked mountain surrounded by a ring of high glaciers',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'kanchenjunga',
    name: 'Mt. Kanchenjunga',
    hindiName: 'कंचनजंघा (सिक्किम)',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 27.70, lon: 88.14,
    map3dX: 68.6, map3dY: 33.0,
    alt: '8,586 m',
    type: '3rd Highest Peak on Earth',
    imageEmoji: '🏔️',
    realImage: '/mountains/kanchenjunga.jpg',
    imageCaption: 'The Five Treasures of Snow glowing in golden sunrise over Sikkim rhododendron hills',
    description: 'The highest peak in India and 3rd highest in the world, located on the border between Sikkim and Nepal.',
    highlight: 'Name means "Five Treasures of Snow" in Tibetan',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'guru_shikhar',
    name: 'Guru Shikhar (Mt. Abu)',
    hindiName: 'गुरु शिखर (माउंट आबू)',
    category: 'mountains',
    rangeId: 'aravalli',
    lat: 24.65, lon: 72.78,
    map3dX: 16.5, map3dY: 42.2,
    alt: '1,722 m',
    type: 'Highest Peak of Aravalli Range',
    imageEmoji: '⛰️',
    realImage: '/mountains/guru_shikhar.jpg',
    imageCaption: 'Granite tor peak of Guru Shikhar crowned by the Mount Abu Infrared Observatory',
    description: 'The highest summit in Rajasthan and the entire Aravalli mountain system, offering views of the surrounding desert plateau.',
    highlight: 'Located at Mount Abu, the only hill station in Rajasthan',
    labelOffsetX: -145, labelOffsetY: 4
  },
  {
    id: 'dhupgarh',
    name: 'Pachmarhi & Dhupgarh',
    hindiName: 'पचमढ़ी एवं धूपगढ़ (१,३५० मी)',
    category: 'mountains',
    rangeId: 'satpura',
    lat: 22.45, lon: 78.37,
    map3dX: 35.1, map3dY: 50.0,
    alt: '1,350 m',
    type: 'Highest Peak of Satpura Range',
    imageEmoji: '🌄',
    realImage: '/mountains/dhupgarh.jpg',
    imageCaption: 'Spectacular sunset over the jagged sandstone cliffs and sal forests of Satpura',
    description: 'Dhupgarh is the highest point in Madhya Pradesh, located in the lush Satpura Biosphere Reserve with cascading waterfalls.',
    highlight: 'Famous for spectacular sunset views across the central Indian plateau',
    labelOffsetX: 10, labelOffsetY: 8
  },
  {
    id: 'anamudi',
    name: 'Anamudi Peak (Munnar)',
    hindiName: 'अनामुडी (२,६९५ मी - केरल)',
    category: 'mountains',
    rangeId: 'western_ghats',
    lat: 10.17, lon: 77.06,
    map3dX: 29.6, map3dY: 91.3,
    alt: '2,695 m',
    type: 'Highest Peak in South India',
    imageEmoji: '🏔️',
    realImage: '/mountains/anamudi.jpg',
    imageCaption: 'The Everest of South India rising above the emerald tea carpets of Munnar',
    description: 'The "Everest of South India", located in Eravikulam National Park, Kerala. Home to Nilgiri Tahr and rolling emerald tea plantations.',
    highlight: 'Class 6 NCERT: Highest mountain summit in Peninsular India',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'saramati',
    name: 'Mt. Saramati',
    hindiName: 'माउंट सारामती (नागालैंड)',
    category: 'mountains',
    rangeId: 'purvanchal',
    lat: 25.74, lon: 95.03,
    map3dX: 91.7, map3dY: 40.1,
    alt: '3,841 m',
    type: 'Highest Peak of Purvanchal',
    imageEmoji: '🏔️',
    realImage: '/mountains/saramati.jpg',
    imageCaption: 'The snow-capped summit of Mount Saramati on the Nagaland-Myanmar Purvanchal border',
    description: 'Rising on the Nagaland-Myanmar border in the Naga Hills, permanently draped in clouds and winter snow.',
    highlight: 'Highest summit in the Purvanchal (North-Eastern) fold belt',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // 2. PLAINS & BASINS
  {
    id: 'gangetic_plain',
    name: 'The Great Gangetic Plain',
    hindiName: 'विशाल गंगा का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 25.31, lon: 82.97,
    map3dX: 50.9, map3dY: 40.7,
    alt: '75 - 200 m',
    type: 'Vast Alluvial River Plain',
    imageEmoji: '🌾',
    realImage: '/mountains/gangetic_plain.jpg',
    imageCaption: 'Vast fertile alluvial paddy fields and sunset reflections across the Ganga River basin',
    description: 'A vast, level and extremely fertile plain formed by the deposition of rich alluvial silt brought down by the Ganga, Yamuna, and Himalayan rivers.',
    highlight: 'Class 6 NCERT: Most fertile, level, and densely populated agricultural plain in India',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'punjab_plain',
    name: 'Punjab-Haryana Alluvial Plain',
    hindiName: 'पंजाब-हरियाणा का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 30.73, lon: 76.77,
    map3dX: 30.5, map3dY: 22.0,
    alt: '215 m',
    type: 'Granary of India (Five Rivers)',
    imageEmoji: '🚜',
    realImage: '/mountains/punjab_plain.jpg',
    imageCaption: 'Endless golden wheat and mustard fields irrigated by perennial Himalayan canals',
    description: 'Formed by the Indus river system (Ravi, Beas, Sutlej), this fertile plain is known as the breadbasket of India.',
    highlight: 'Formed by the Indus river tributaries; India\'s primary wheat granary',
    labelOffsetX: -140, labelOffsetY: -6
  },
  {
    id: 'brahmaputra_plain',
    name: 'Brahmaputra Valley Plain',
    hindiName: 'ब्रह्मपुत्र घाटी का मैदान (असम)',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 26.20, lon: 92.93,
    map3dX: 84.7, map3dY: 38.4,
    alt: '100 m',
    type: 'Lush North-Eastern Alluvial Plain',
    imageEmoji: '🌱',
    realImage: '/mountains/brahmaputra_plain.jpg',
    imageCaption: 'Lush green tea gardens and fertile lowlands along the sweeping Brahmaputra river',
    description: 'A low-lying alluvial corridor in Assam flanked by the Himalayas and Meghalaya plateau, known for world-famous Assam tea.',
    highlight: 'Alluvial valley famous for world-famous Assam tea estates',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'konkan_coast',
    name: 'Konkan Coastal Plain',
    hindiName: 'कोंकण तटीय मैदान (महाराष्ट्र-गोवा)',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 16.50, lon: 73.30,
    map3dX: 17.5, map3dY: 69.7,
    alt: '0 - 50 m',
    type: 'Western Coastal Strip',
    imageEmoji: '🥥',
    realImage: '/mountains/konkan_coast.jpg',
    imageCaption: 'Golden palm-fringed coastlines between the Western Ghats and Arabian Sea',
    description: 'A rugged and picturesque western coastal plain between the Sahyadri mountains and the Arabian Sea, rich in mango and coconut orchards.',
    highlight: 'Narrow coastal plain famous for Alphonso mangoes and pristine beaches',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'malabar_coast',
    name: 'Malabar Coast & Backwaters',
    hindiName: 'मालाबार तट एवं बैकवाटर्स (केरल)',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 9.93, lon: 76.26,
    map3dX: 26.9, map3dY: 92.1,
    alt: '0 - 30 m',
    type: 'South-Western Lagoon Coast',
    imageEmoji: '🛶',
    realImage: '/mountains/malabar_coast.jpg',
    imageCaption: 'Network of tranquil backwaters and interconnected lagoons along the Arabian Sea',
    description: 'Famous for its interconnected coastal lagoons (Kayals), spice gardens, and backwater networks along Kerala.',
    highlight: 'Class 6 NCERT: Famous for coastal lagoons (Kayals) and spice trade',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'coromandel_coast',
    name: 'Coromandel Coastal Plain',
    hindiName: 'कोरोमंडल तटीय मैदान (तमिलनाडु)',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 11.94, lon: 79.80,
    map3dX: 39.0, map3dY: 85.6,
    alt: '0 - 40 m',
    type: 'Eastern Coastal Plain',
    imageEmoji: '🏖️',
    realImage: '/mountains/coromandel_coast.jpg',
    imageCaption: 'Traditional fishing catamarans and sandy shores along the Coromandel Coast (Tamil Nadu)',
    description: 'A broad eastern coastal plain along the Bay of Bengal in Tamil Nadu, known for its sandy beaches and retreating winter northeast monsoon.',
    highlight: 'Receives retreating northeast monsoon rains in October-November; broad eastern coastal plain',
    labelOffsetX: 10, labelOffsetY: 6
  },

  // 3. RIVERS & WATERWAYS
  {
    id: 'river_ganga',
    name: 'Ganges River (Ganga)',
    hindiName: 'गंगा नदी (२,५२५ किमी)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 25.30, lon: 83.00,
    map3dX: 51.0, map3dY: 40.7,
    alt: '80 m',
    type: 'Sacred Lifeline of India',
    imageEmoji: '🌊',
    realImage: '/mountains/ganga_holy_river.jpg',
    imageCaption: 'The sacred river Ganga flowing past the ancient river ghats and sunrise waters at Varanasi',
    description: 'The longest river in India (2,525 km), originating as Bhagirathi at Gaumukh glacier in the Himalayas, flowing east into the Bay of Bengal.',
    highlight: 'Class 6 NCERT: Originates as Bhagirathi from Gangotri glacier; joins Alaknanda at Devprayag to form Ganga; 2,525 km long',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_yamuna',
    name: 'Yamuna River',
    hindiName: 'यमुना नदी (१,३७६ किमी)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 28.61, lon: 77.20,
    map3dX: 35.0, map3dY: 28.0,
    alt: '210 m',
    type: 'Largest Tributary of the Ganga',
    imageEmoji: '🌊',
    realImage: '/mountains/river_yamuna.jpg',
    imageCaption: 'Serene Yamuna river flowing peacefully through the northern plains during golden hour',
    description: 'Originates from the Yamunotri glacier in the Lower Himalayas, flowing parallel to the Ganga before meeting it at the Triveni Sangam in Prayagraj.',
    highlight: 'Class 6 NCERT: Originates from Yamunotri glacier; major right-bank tributary joining Ganga at Prayagraj (Allahabad)',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_indus',
    name: 'Indus River (Sindhu)',
    hindiName: 'सिंधु नदी (लद्दाख)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 34.15, lon: 77.57,
    map3dX: 33.5, map3dY: 10.5,
    alt: '3,200 m',
    type: 'Trans-Himalayan River System',
    imageEmoji: '🏞️',
    realImage: '/mountains/river_indus.jpg',
    imageCaption: 'Turquoise glacial waters of the Indus carving through steep rocky Ladakh canyons',
    description: 'One of the greatest rivers of Asia (3,180 km), originating near Lake Mansarovar in Tibet and flowing through Ladakh between the Ladakh and Zanskar mountain ranges.',
    highlight: 'Class 6 NCERT: Originates in Tibet near Mansarovar; cradle of the Indus Valley Civilisation',
    labelOffsetX: -110, labelOffsetY: -6
  },
  {
    id: 'river_brahmaputra',
    name: 'Brahmaputra River',
    hindiName: 'ब्रह्मपुत्र नदी (असम)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 26.18, lon: 91.75,
    map3dX: 80.7, map3dY: 38.4,
    alt: '55 m',
    type: 'Mighty Red River of North-East',
    imageEmoji: '🚢',
    realImage: '/mountains/river_brahmaputra.jpg',
    imageCaption: 'Vast expanse of the braided Brahmaputra river channel during monsoon season in Assam',
    description: 'Known as Tsangpo in Tibet, enters India through Arunachal Pradesh as Dihang, flows through Assam valley and forms Majuli, the world\'s largest river island.',
    highlight: 'Class 6 NCERT: Known as Tsangpo in Tibet; creates Majuli island; joins Ganga in Bangladesh to form the world\'s largest delta',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'sundarbans_delta',
    name: 'Sundarbans (Ganga-Brahmaputra Delta)',
    hindiName: 'सुंदरवन डेल्टा (विश्व का सबसे बड़ा डेल्टा)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 21.94, lon: 89.18,
    map3dX: 70.0, map3dY: 48.0,
    alt: '0 - 5 m',
    type: 'World\'s Largest River Delta',
    imageEmoji: '🐅',
    realImage: '/mountains/sundarbans.jpg',
    imageCaption: 'Tidal mangrove channels and coastal islands of the vast Sundarbans delta',
    description: 'Formed by the confluence of the Ganga, Brahmaputra, and Meghna rivers entering the Bay of Bengal. Named after the Sundari mangrove tree.',
    highlight: 'Class 6 NCERT: The Ganga and Brahmaputra form the largest delta in the world, the Sundarbans delta, triangular in shape',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'river_narmada',
    name: 'Narmada River & Marble Rocks',
    hindiName: 'नर्मदा नदी एवं भेड़ाघाट',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 23.13, lon: 79.80,
    map3dX: 40.0, map3dY: 47.8,
    alt: '380 m',
    type: 'West-Flowing Rift Valley River',
    imageEmoji: '🌊',
    realImage: '/mountains/marble_rocks.jpg',
    imageCaption: 'Narmada River cutting a deep 3 km gorge through towering pure white marble cliffs at Bhedaghat',
    description: 'Originates at Amarkantak plateau in Madhya Pradesh and flows west in a tectonic rift valley between the Vindhya and Satpura ranges, plunging at Dhuandhar Falls.',
    highlight: 'Class 6 NCERT: The Narmada is a west-flowing river that flows through a rift valley into the Arabian Sea',
    labelOffsetX: 10, labelOffsetY: -8
  },
  {
    id: 'river_tapi',
    name: 'Tapi River (Tapti)',
    hindiName: 'तापी नदी (सूरत, गुजरात)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 21.17, lon: 72.83,
    map3dX: 25.0, map3dY: 52.0,
    alt: '13 m',
    type: 'West-Flowing Peninsular River',
    imageEmoji: '🌊',
    realImage: '/mountains/river_tapi.jpg',
    imageCaption: 'Tapi River meandering through the Satpura valley towards the Gulf of Khambhat',
    description: 'Originates in the Satpura range in Betul district, Madhya Pradesh, flowing parallel south of Narmada into the Arabian Sea near Surat.',
    highlight: 'Class 6 NCERT: Rivers Narmada and Tapi are the two major west-flowing rivers in India that drain into the Arabian Sea',
    labelOffsetX: -110, labelOffsetY: 6
  },
  {
    id: 'river_mahanadi',
    name: 'Mahanadi River',
    hindiName: 'महानदी (ओडिशा, हीराकुड)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 20.46, lon: 85.88,
    map3dX: 60.0, map3dY: 52.0,
    alt: '30 m',
    type: 'Major East-Flowing River (858 km)',
    imageEmoji: '🌊',
    realImage: '/mountains/river_mahanadi.jpg',
    imageCaption: 'Wide, shimmering expanse of the Mahanadi River flanked by dense green Odisha hills',
    description: 'Originates in the highlands of Chhattisgarh, flowing 858 km east through Odisha to form a rich agricultural delta on the Bay of Bengal. Home to the historic Hirakud Dam.',
    highlight: 'Class 6 NCERT: Major east-flowing peninsular river draining into the Bay of Bengal, forming a fertile delta',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_godavari',
    name: 'Godavari River (Dakshin Ganga)',
    hindiName: 'गोदावरी नदी (दक्षिण गंगा)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 19.99, lon: 73.78,
    map3dX: 19.4, map3dY: 58.0,
    alt: '250 m',
    type: 'Longest Peninsular River (1,465 km)',
    imageEmoji: '🌊',
    realImage: '/mountains/river_godavari.jpg',
    imageCaption: 'The wide flowing waters of the Godavari river flowing across the Deccan Plateau',
    description: 'Originates at Trimbakeshwar in the Western Ghats (Nashik, Maharashtra) and flows 1,465 km east across the Deccan Plateau into the Bay of Bengal.',
    highlight: 'Class 6 NCERT: Godavari is the longest river in Peninsular India (1,465 km), famously called the Dakshin Ganga',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'river_krishna',
    name: 'Krishna River',
    hindiName: 'कृष्णा नदी (१,४०० किमी)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 16.51, lon: 80.64,
    map3dX: 38.0, map3dY: 68.0,
    alt: '20 m',
    type: '2nd Longest Peninsular River',
    imageEmoji: '🌊',
    realImage: '/mountains/river_krishna.jpg',
    imageCaption: 'Krishna River winding through dramatic lush green Deccan canyons and agricultural basins',
    description: 'Originates near Mahabaleshwar in the Western Ghats of Maharashtra, flowing 1,400 km through Karnataka, Telangana, and Andhra Pradesh to the Bay of Bengal.',
    highlight: 'Class 6 NCERT: Major east-flowing river fed by Koyna, Tungabhadra, and Bhima tributaries, draining into the Bay of Bengal',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'river_kaveri',
    name: 'Kaveri River (Cauvery)',
    hindiName: 'कावेरी नदी (दक्षिण भारत की गंगा)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 10.79, lon: 79.13,
    map3dX: 34.0, map3dY: 82.0,
    alt: '15 m',
    type: 'Sacred River of Southern India (800 km)',
    imageEmoji: '🌾',
    realImage: '/mountains/river_kaveri.jpg',
    imageCaption: 'Kaveri River flowing past lush emerald green paddy fields and palm groves in Tamil Nadu',
    description: 'Originates at Talakaveri in the Brahmagiri Range (Kodagu, Karnataka), flowing 800 km southeast across Karnataka and Tamil Nadu to create the fertile Rice Bowl delta.',
    highlight: 'Class 6 NCERT: Originates in the Western Ghats; perennial water flow throughout the year due to both SW and NE monsoon rains',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'jog_falls',
    name: 'Jog Falls (Sharavathi River)',
    hindiName: 'जोग जलप्रपात (कर्नाटक)',
    category: 'rivers',
    rangeId: 'western_ghats',
    lat: 14.23, lon: 74.81,
    map3dX: 22.4, map3dY: 77.5,
    alt: '480 m',
    type: '2nd Highest Plunge Waterfall in India',
    imageEmoji: '🌊',
    realImage: '/mountains/jog_falls.jpg',
    imageCaption: 'The dramatic 253 m plunge of Raja, Roarer, Rocket, and Rani cascades in lush Western Ghats',
    description: 'The Sharavathi River drops 253 meters in four distinct cascades (Raja, Roarer, Rocket, and Rani) down the Western Ghats escarpment.',
    highlight: 'Class 6 NCERT: Spectacular 253 m waterfall created where west-flowing peninsular rivers plunge down the steep Western Ghats',
    labelOffsetX: -110, labelOffsetY: -8
  },

  // 4. DESERTS & ARID REGIONS
  {
    id: 'thar_desert',
    name: 'Thar Desert (Great Indian Desert)',
    hindiName: 'थार का मरुस्थल (जैसलमेर)',
    category: 'deserts',
    rangeId: 'arid_regions',
    lat: 26.91, lon: 70.90,
    map3dX: 10.3, map3dY: 34.4,
    alt: '225 m',
    type: 'Great Sand Dune Desert',
    imageEmoji: '🐪',
    realImage: '/mountains/thar_desert.jpg',
    imageCaption: 'Golden shifting sand dunes (barchans) under blazing desert sun in Jaisalmer',
    description: 'A vast arid landscape in western Rajasthan characterized by shifting sand dunes, sparse thorny vegetation, and extreme diurnal temperatures.',
    highlight: 'Class 6 NCERT: "In the western part of India lies the Great Indian Desert. It is a dry, hot and sandy stretch of land."',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'rann_of_kutch',
    name: 'Great Rann of Kutch',
    hindiName: 'कच्छ का रण (श्वेत मरुस्थल)',
    category: 'deserts',
    rangeId: 'arid_regions',
    lat: 23.83, lon: 70.21,
    map3dX: 7.7, map3dY: 44.8,
    alt: '10 m',
    type: 'Endless White Salt Desert',
    imageEmoji: '🧂',
    realImage: '/mountains/rann_of_kutch.jpg',
    imageCaption: 'Glistening white salt crystal crust stretching to the horizon under moonlit skies',
    description: 'One of the largest seasonal salt marsh deserts in the world, turning into an endless pure white salt crust after the monsoon waters evaporate.',
    highlight: 'World\'s largest seasonal salt desert & sanctuary of the Indian Wild Ass',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'cold_desert_ladakh',
    name: 'Cold Desert of Ladakh & Spiti',
    hindiName: 'लद्दाख का शीत मरुस्थल',
    category: 'deserts',
    rangeId: 'arid_regions',
    lat: 34.15, lon: 77.58,
    map3dX: 33.6, map3dY: 10.5,
    alt: '3,500 m',
    type: 'High-Altitude Rain-Shadow Desert',
    imageEmoji: '❄️',
    realImage: '/mountains/cold_desert_ladakh.jpg',
    imageCaption: 'Barren snow-dusted high altitude mountains and azure high lakes under crystal clear skies',
    description: 'A high-altitude arid plateau lying in the rain-shadow of the Great Himalayas, experiencing freezing winter temperatures and minimal rainfall.',
    highlight: 'High-altitude cold desert cut off from monsoon by the Himalayas',
    labelOffsetX: 10, labelOffsetY: 6
  },

  // 5. FORESTS & BIOSPHERES
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangrove Delta',
    hindiName: 'सुंदरवन मैंग्रोव डेльта (पश्चिम बंगाल)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 21.94, lon: 88.90,
    map3dX: 70.7, map3dY: 52.5,
    alt: '5 m',
    type: 'World\'s Largest Mangrove Forest',
    imageEmoji: '🐅',
    realImage: '/mountains/sundarbans_mangrove.jpg',
    imageCaption: 'Tidal mangrove waterways and dense Sundari tree forests in the Ganga-Brahmaputra delta',
    description: 'The world\'s largest river delta and mangrove forest formed by the Ganga and Brahmaputra rivers, home to the iconic Royal Bengal Tiger.',
    highlight: 'Class 6 NCERT: World\'s largest delta (Sundarbans Delta) formed by Ganga & Brahmaputra',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'western_ghats_rainforest',
    name: 'Western Ghats Evergreen Rainforest',
    hindiName: 'पश्चिमी घाट वर्षावन (केरल-कर्नाटक)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 12.00, lon: 75.50,
    map3dX: 24.5, map3dY: 85.0,
    alt: '1,100 m',
    type: 'Tropical Evergreen Biosphere',
    imageEmoji: '🌴',
    realImage: '/mountains/western_ghats_rainforest.jpg',
    imageCaption: 'Dense multi-layered canopy of tropical evergreen rainforests receiving heavy monsoon rains',
    description: 'One of the world\'s top 8 biodiversity hotspots, covered with dense tropical evergreen and semi-evergreen rain forests.',
    highlight: 'Global biodiversity hotspot older than the Himalayas',
    labelOffsetX: -145, labelOffsetY: -6
  },
  {
    id: 'gir_forest',
    name: 'Gir Forest & Wildlife Sanctuary',
    hindiName: 'गीर राष्ट्रीय उद्यान एवं अभयारण्य (गुजरात)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 21.12, lon: 70.82,
    map3dX: 9.5, map3dY: 54.0,
    alt: '150 m',
    type: 'Dry Deciduous Teak Forest & Sanctuary',
    imageEmoji: '🦁',
    realImage: '/mountains/gir_forest.jpg',
    imageCaption: 'Majestic Asiatic Lion roaming freely in its natural dry deciduous teak forest habitat at Gir Wildlife Sanctuary, Gujarat',
    description: 'The sole and exclusive home of the Asiatic Lion (Panthera leo persica) in the wild, characterized by rugged dry deciduous teak woodlands and thorn scrub in the Kathiawar peninsula.',
    highlight: 'Class 6 NCERT: Gir National Park in Gujarat is the only natural home in the world for wild Asiatic Lions',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'kaziranga_forest',
    name: 'Kaziranga National Park',
    hindiName: 'काजीरंगा राष्ट्रीय उद्यान (असम)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 26.57, lon: 93.17,
    map3dX: 85.5, map3dY: 37.2,
    alt: '65 m',
    type: 'Wetland & Elephant Grass Jungle',
    imageEmoji: '🦏',
    realImage: '/mountains/kaziranga.jpg',
    imageCaption: 'Tall elephant grass and marshy swamps in the Brahmaputra floodplain, home to the One-horned Rhinoceros',
    description: 'A UNESCO World Heritage sanctuary in Assam home to two-thirds of the world\'s great One-horned Rhinoceroses.',
    highlight: 'World\'s primary sanctuary for the Great Indian One-horned Rhinoceros',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // 6. PLATEAUS & TABLELANDS
  {
    id: 'deccan_plateau',
    name: 'The Deccan Plateau',
    hindiName: 'दक्कन का पठार (प्रायद्वीपीय भारत)',
    category: 'plateaus',
    rangeId: 'peninsular_plateaus',
    lat: 17.50, lon: 77.00,
    map3dX: 30.1, map3dY: 66.6,
    alt: '600 m',
    type: 'Triangular Volcanic Tableland',
    imageEmoji: '⛰️',
    realImage: '/mountains/deccan_plateau.jpg',
    imageCaption: 'Vast elevated tablelands of ancient volcanic basalt rock rich in black soil',
    description: 'A massive triangular plateau of ancient volcanic basalt lava (Deccan Traps), bounded by the Western Ghats to the west and Eastern Ghats to the east.',
    highlight: 'Class 6 NCERT: "South of northern plains lies the Peninsular plateau. It is triangular in shape. The relief is highly uneven."',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'malwa_plateau',
    name: 'Malwa Plateau',
    hindiName: 'मालवा का पठार (मध्य प्रदेश)',
    category: 'plateaus',
    rangeId: 'peninsular_plateaus',
    lat: 23.50, lon: 75.50,
    map3dX: 25.6, map3dY: 46.3,
    alt: '500 m',
    type: 'Central Volcanic Highland',
    imageEmoji: '🌄',
    realImage: '/mountains/malwa_plateau.jpg',
    imageCaption: 'Gentle rolling hills and fertile black soil plateaus of Central India',
    description: 'A high plateau of volcanic origin in western Madhya Pradesh, gently sloping north toward the Chambal and Yamuna river valleys.',
    highlight: 'Central plateau of volcanic origin drained by Chambal & Betwa',
    labelOffsetX: -120, labelOffsetY: -6
  },
  {
    id: 'chota_nagpur',
    name: 'Chota Nagpur Plateau',
    hindiName: 'छोटा नागपुर पठार (झारखंड)',
    category: 'plateaus',
    rangeId: 'peninsular_plateaus',
    lat: 23.35, lon: 85.33,
    map3dX: 58.7, map3dY: 47.5,
    alt: '650 m',
    type: 'Mineral Storehouse of India',
    imageEmoji: '⛏️',
    realImage: '/mountains/chota_nagpur.jpg',
    imageCaption: 'Ancient rocky plateau plateau intersected by deep river valleys and sal forests',
    description: 'An ancient crystalline plateau in eastern India containing rich reserves of iron ore, coal, mica, and bauxite.',
    highlight: 'Known as the "Ruhr of India" for its vast iron ore and coal reserves',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'meghalaya_plateau',
    name: 'Meghalaya (Shillong) Plateau',
    hindiName: 'मेघालय का पठार (शिलांग)',
    category: 'plateaus',
    rangeId: 'peninsular_plateaus',
    lat: 25.57, lon: 91.88,
    map3dX: 81.0, map3dY: 40.4,
    alt: '1,500 m',
    type: 'High-Altitude Tableland',
    imageEmoji: '🌧️',
    realImage: '/mountains/meghalaya_plateau.jpg',
    imageCaption: 'Elevated tableland crowned by deep green gorges and misty pine forests',
    description: 'An elevated plateau detached from the main Peninsular block, crowned by Garo, Khasi, and Jaintia hills, receiving world-record rainfall.',
    highlight: 'The "Abode of Clouds" receiving world-record rainfall',
    labelOffsetX: -140, labelOffsetY: 10
  }
];

export const MOUNTAIN_RANGES = [
  {
    id: 'greater_himalayas',
    name: 'The Great Himalayas (Himadri)',
    hindiName: 'वृहत हिमालय / हिमाद्रि',
    category: 'fold',
    type: 'Young Fold Mountains',
    avgElevation: '6,000 m',
    highestPeak: 'Mt. Everest (8,848.86 m) / Kanchenjunga (8,586 m)',
    states: ['Jammu & Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh'],
    rivers: ['Ganga', 'Yamuna', 'Indus', 'Brahmaputra'],
    description: 'The northernmost range of the Himalayas, permanently covered in snow and ice. Contains the highest peaks on Earth.',
    ncertFact: 'Class 6 NCERT: "The northernmost range is the Great Himalaya or Himadri. The world\'s highest peaks are located in this range."',
    didYouKnow: 'The Himalayas are young fold mountains that are still rising by about 5 mm every year due to tectonic plate movement!',
    features: ['Permanently snow-covered peaks', 'Origin of perennial rivers', 'Average height over 6,000 meters']
  },
  {
    id: 'lesser_himalayas',
    name: 'Lesser Himalayas (Himachal)',
    hindiName: 'लघु हिमालय / हिमाचल',
    category: 'fold',
    type: 'Middle Himalayan Range',
    avgElevation: '3,700 m - 4,500 m',
    highestPeak: 'Pir Panjal / Dhauladhar Ridges',
    states: ['Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir'],
    rivers: ['Beas', 'Ravi', 'Chenab', 'Jhelum'],
    description: 'Lies south of the Himadri. Known for famous hill stations like Shimla, Kullu, Manali, and Mussoorie with dense pine forests.',
    ncertFact: 'Class 6 NCERT: "Middle Himalaya or Himachal lies to the south of Himadri. Many popular hill stations are situated here."',
    didYouKnow: 'The famous Pir Panjal and Dhauladhar ranges are part of the Lesser Himalayas!',
    features: ['Popular hill stations', 'Dense pine and oak forests', 'V-shaped mountain valleys']
  },
  {
    id: 'shiwalik',
    name: 'Shiwalik Range',
    hindiName: 'शिवालिक श्रेणी',
    category: 'fold',
    type: 'Outer Foothill Ridge',
    avgElevation: '900 m - 1,200 m',
    highestPeak: 'Foothill Ridges',
    states: ['Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand'],
    rivers: ['Ganga', 'Yamuna (Tributaries)'],
    description: 'The southernmost outer range of the Himalayas. Composed of loose sediments brought down by rivers. Forms famous longitudinal "Dun" valleys.',
    ncertFact: 'Class 6 NCERT: "The Shiwalik is the southernmost range of the Himalayas. Longitudinal valleys known as Duns lie between Lesser Himalayas and Shiwaliks."',
    didYouKnow: 'Dehradun, Kotli Dun, and Patli Dun are classic examples of longitudinal valleys formed behind the Shiwaliks!',
    features: ['Southernmost Himalayan foothills', 'Longitudinal "Dun" valleys', 'Unconsolidated sedimentary rocks']
  },
  {
    id: 'karakoram',
    name: 'Karakoram & Ladakh Ranges',
    hindiName: 'काराकोरम एवं लद्दाख पर्वत श्रेणी',
    category: 'trans_himalayan',
    type: 'Trans-Himalayan Fold System',
    avgElevation: '5,000 m - 8,000 m',
    highestPeak: 'K2 (Godwin-Austen, 8,611 m)',
    states: ['Ladakh (UT)'],
    rivers: ['Indus', 'Shyok', 'Nubra', 'Gilgit'],
    description: 'Lies north of the Great Himalayas. Houses K2 (the 2nd highest peak in the world) and the world\'s largest non-polar glaciers like Siachen (76 km).',
    ncertFact: 'Class 6 NCERT: Cold desert plateau of Ladakh is enclosed between the Karakoram Range in the north and Zanskar mountains in the south.',
    didYouKnow: 'Siachen Glacier in the Karakoram is the world\'s highest battlefield at over 5,400 meters!',
    features: ['World\'s 2nd highest peak (K2)', 'Siachen Glacier (76 km long)', 'High altitude cold desert landscape']
  },
  {
    id: 'aravalli',
    name: 'Aravalli Range',
    hindiName: 'अरावली पर्वतमाला',
    category: 'relict',
    type: 'Old Fold Mountain (Relict)',
    avgElevation: '300 m - 900 m',
    highestPeak: 'Guru Shikhar (1,722 m) at Mount Abu',
    states: ['Gujarat', 'Rajasthan', 'Haryana', 'Delhi'],
    rivers: ['Banas', 'Luni', 'Sabarmati', 'Sahibi'],
    description: 'One of the oldest fold mountain systems in the world, now worn down to low hills and ridges by millions of years of erosion.',
    ncertFact: 'Class 6 NCERT: "The Aravalli hills is one of the oldest ranges of the world. The range has considerably worn down due to the processes of erosion."',
    didYouKnow: 'Raisina Hill in New Delhi, where the Rashtrapati Bhavan stands, is the northernmost tip of the ancient Aravalli Range!',
    features: ['Oldest mountain range in India', 'Extends from Gujarat to Delhi (800 km)', 'Highest Peak: Guru Shikhar (1,722 m)']
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
    didYouKnow: 'Mawsynram in the Khasi Hills of Meghalaya receives the highest annual rainfall in the world (~11,872 mm)!',
    features: ['Sharp southward syntaxial bend', 'Patkai, Naga, Mizo & Khasi Hills', 'Highest Rainfall on Earth (Mawsynram)']
  },
  {
    id: 'northern_plains',
    name: 'The Northern Great Plains',
    hindiName: 'उत्तर का विशाल मैदान',
    category: 'plains',
    type: 'Alluvial River Depositional Plain',
    avgElevation: '75 m - 250 m',
    highestPeak: 'Alluvial River Basins',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal', 'Assam'],
    rivers: ['Indus', 'Ganga', 'Brahmaputra', 'Yamuna', 'Ghaghara', 'Kosi'],
    description: 'A level and vast expanse formed by the deposition of alluvium brought down by the Himalayan and Peninsular rivers.',
    ncertFact: 'Class 6 NCERT: "The Northern Indian plains lie to the south of the Himalayas. They are generally level and flat. These are formed by the alluvial deposits."',
    didYouKnow: 'The Northern Plains are so flat that from Delhi to Kolkata (over 1,400 km), the elevation drops by less than 200 meters!',
    features: ['Flat and level terrain', 'Formed by rich alluvial soil', 'Highest agricultural density in India']
  },
  {
    id: 'coastal_plains',
    name: 'Coastal Plains of India',
    hindiName: 'भारत के तटीय मैदान',
    category: 'coastal',
    type: 'Western & Eastern Coastal Margins',
    avgElevation: '0 m - 50 m',
    highestPeak: 'Sea-level coastal plains',
    states: ['Gujarat', 'Maharashtra', 'Goa', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal'],
    rivers: ['Narmada', 'Tapi', 'Mahanadi', 'Godavari', 'Krishna', 'Kaveri'],
    description: 'Flanking the Peninsular plateau are narrow western coastal plains (Konkan, Kanara, Malabar) and much broader eastern coastal plains (Northern Circars, Coromandel).',
    ncertFact: 'Class 6 NCERT: "To the West of the Western Ghats and that East of Eastern Ghats lie the Coastal plains. The western coastal plains are very narrow. The eastern Coastal plains are much broader."',
    didYouKnow: 'The western coastal rivers like Narmada and Tapi form estuaries, while the eastern rivers like Godavari and Krishna form massive fertile deltas!',
    features: ['Narrow Western Coastal Plain', 'Broad Eastern Coastal Plain with Deltas', 'Famous for ports, fishing, and agriculture']
  },
  {
    id: 'river_basins',
    name: 'Major River Systems of India',
    hindiName: 'भारत की प्रमुख नदी प्रणालियां',
    category: 'rivers',
    type: 'Himalayan & Peninsular Drainage',
    avgElevation: '0 m - 4,500 m',
    highestPeak: 'Origin Glaciers & Springs',
    states: ['All States of India'],
    rivers: ['Ganga', 'Indus', 'Brahmaputra', 'Godavari', 'Narmada', 'Krishna', 'Kaveri', 'Mahanadi'],
    description: 'India is drained by perennial Himalayan snow-fed rivers and seasonal rain-fed Peninsular rivers creating rich civilizations and fertile deltas.',
    ncertFact: 'Class 6 NCERT: "The Ganga and the Brahmaputra form the world\'s largest delta, the Sundarbans delta. The delta is triangular in shape."',
    didYouKnow: 'The word "India" is derived from the River Indus (Sindhu), which flows across northern Ladakh and the subcontinent!',
    features: ['Perennial Himalayan snow-fed rivers', 'Peninsular rain-fed rivers', 'World\'s largest delta (Sundarbans)']
  },
  {
    id: 'arid_regions',
    name: 'The Great Indian Desert (Thar)',
    hindiName: 'थार का मरुस्थल एवं कच्छ',
    category: 'deserts',
    type: 'Subtropical Sand & Salt Desert',
    avgElevation: '10 m - 300 m',
    highestPeak: 'Shifting Barchan Sand Dunes',
    states: ['Rajasthan', 'Gujarat', 'Punjab', 'Haryana'],
    rivers: ['Luni (Inland Drainage)'],
    description: 'Occupies western India with hot dry sand dunes in Rajasthan and white salt flats in Kutch. Receives very low rainfall (under 150 mm/year).',
    ncertFact: 'Class 6 NCERT: "In the western part of India lies the Great Indian Desert. It is a dry, hot and sandy stretch of land. It has very little vegetation."',
    didYouKnow: 'The Luni River in the Thar Desert is the only major river in the region, and it evaporates without reaching the ocean!',
    features: ['Shifting sand dunes (barchans)', 'Sparse thorny xerophytic vegetation', 'Extreme day and night temperature contrast']
  },
  {
    id: 'biosphere_forests',
    name: 'Natural Forests & Biospheres',
    hindiName: 'प्राकृतिक वन एवं जैवमंडल',
    category: 'forests',
    type: 'Tropical Evergreen, Mangrove & Deciduous',
    avgElevation: '0 m - 1,500 m',
    highestPeak: 'Multi-layered Forest Canopy',
    states: ['West Bengal', 'Kerala', 'Assam', 'Gujarat', 'Uttarakhand', 'Madhya Pradesh'],
    rivers: ['Ganga', 'Brahmaputra', 'Periyar', 'Ramganga'],
    description: 'Diverse forest ecosystems ranging from Sundarbans tidal mangroves to Western Ghats rainforests, Gir dry woodlands, and Kaziranga wetlands.',
    ncertFact: 'Class 6 NCERT: Natural vegetation grows without human interference, shaped by climate, temperature, and relief of the land.',
    didYouKnow: 'Sundarbans gets its name from the "Sundari" mangrove trees which can survive in salty tidal sea water!',
    features: ['Sundarbans: World\'s largest mangrove delta', 'Western Ghats: Rainforest biodiversity hotspot', 'Habitats for Tigers, Rhinos, and Asiatic Lions']
  },
  {
    id: 'peninsular_plateaus',
    name: 'The Peninsular Plateaus',
    hindiName: 'प्रायद्वीपीय पठारी क्षेत्र',
    category: 'plateaus',
    type: 'Ancient Crystalline Tablelands',
    avgElevation: '300 m - 900 m',
    highestPeak: 'Anamudi / Volcanic Deccan Basalt',
    states: ['Maharashtra', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Madhya Pradesh', 'Jharkhand'],
    rivers: ['Narmada', 'Tapi', 'Mahanadi', 'Godavari', 'Krishna', 'Kaveri'],
    description: 'An ancient triangular block composed of old crystalline, igneous, and metamorphic rocks. Rich in black cotton soil and mineral reserves.',
    ncertFact: 'Class 6 NCERT: "South of northern plains lies the Peninsular plateau. It is triangular in shape. It has broad and shallow valleys and rounded hills."',
    didYouKnow: 'The Deccan Plateau was formed by massive volcanic lava eruptions over 65 million years ago, creating deep fertile black soil!',
    features: ['Ancient volcanic basalt Deccan Traps', 'Triangular tableland sloping eastward', 'Rich in iron ore, coal, and black cotton soil']
  }
];

export const MOUNTAIN_QUIZ = [
  {
    id: 'q1',
    question: 'Which is the oldest fold mountain system in India and one of the oldest in the world?',
    options: ['The Himalayas', 'Aravalli Range', 'Western Ghats', 'Satpura Range'],
    answer: 'Aravalli Range',
    explanation: 'Class 6 NCERT: The Aravalli Range is one of the oldest fold mountain systems in the world, worn down over billions of years.',
    rangeId: 'aravalli'
  },
  {
    id: 'q2',
    question: 'Which peak is the highest mountain summit in South (Peninsular) India?',
    options: ['Guru Shikhar', 'Anamudi (2,695 m)', 'Dhupgarh', 'Mahendragiri'],
    answer: 'Anamudi (2,695 m)',
    explanation: 'Anamudi in Kerala (Western Ghats) is 2,695 m high and is the highest peak in South India.',
    rangeId: 'western_ghats'
  },
  {
    id: 'q3',
    question: 'Where do the Western Ghats and Eastern Ghats meet and join together?',
    options: ['Aravalli Hills', 'Nilgiri Hills', 'Satpura Range', 'Garo Hills'],
    answer: 'Nilgiri Hills',
    explanation: 'The Western Ghats and Eastern Ghats meet at the Nilgiri Hills (Blue Mountains) in Tamil Nadu/Kerala.',
    rangeId: 'western_ghats'
  },
  {
    id: 'q4',
    question: 'Which of the following mountain ranges is continuous and unbroken along the coast?',
    options: ['Eastern Ghats', 'Western Ghats (Sahyadri)', 'Vindhya Range', 'Shiwalik Range'],
    answer: 'Western Ghats (Sahyadri)',
    explanation: 'Class 6 NCERT: The Western Ghats are continuous and can be crossed only through passes like Thal Ghat and Pal Ghat.',
    rangeId: 'western_ghats'
  },
  {
    id: 'q5',
    question: 'What type of landform is formed by the deposition of silt along the Ganga and Brahmaputra?',
    options: ['Volcanic Plateau', 'Northern Alluvial Plains & Deltas', 'Block Mountain', 'Relict Ridge'],
    answer: 'Northern Alluvial Plains & Deltas',
    explanation: 'Class 6 NCERT: The Northern Plains and the Sundarbans Delta are formed by rich alluvial silt deposited by rivers.',
    rangeId: 'northern_plains'
  },
  {
    id: 'q6',
    question: 'What is the characteristic of the Great Indian Desert (Thar) in western India?',
    options: ['Dense evergreen rainforest', 'Dry, hot, and sandy stretch of land', 'Perennial snow cover', 'Volcanic lava plateau'],
    answer: 'Dry, hot, and sandy stretch of land',
    explanation: 'Class 6 NCERT: In the western part of India lies the Great Indian Desert, a dry, hot, and sandy stretch of land.',
    rangeId: 'arid_regions'
  }
];

const CATEGORY_META = {
  mountains: { title: 'Mountains & Peaks of India: 3D Relief Atlas', icon: '🏔️' },
  plains: { title: 'Plains & Basins of India: Physical Geography', icon: '🏞️' },
  rivers: { title: 'River Systems & Waterways of India', icon: '🌊' },
  deserts: { title: 'Deserts & Salt Flats of India', icon: '🏜️' },
  forests: { title: 'Forests & Biosphere Sanctuaries of India', icon: '🌳' },
  plateaus: { title: 'Plateaus & Geological Highlands of India', icon: '⛰️' }
};

export default function IndiaMountainsMapExplorer({ onClose, initialCategory = 'mountains' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'mountains');

  const filteredPlaces = useMemo(() => {
    const matched = ATTRACTIVE_PLACES.filter(p => p.category === selectedCategory);
    return matched.length > 0 ? matched : ATTRACTIVE_PLACES.filter(p => p.category === 'mountains');
  }, [selectedCategory]);

  const [selectedPlaceId, setSelectedPlaceId] = useState(filteredPlaces[0]?.id || 'k2');
  const [hoveredPlaceId, setHoveredPlaceId] = useState(null);
  const [mapMode, setMapMode] = useState('3d_relief'); // '3d_relief' | 'vector_atlas'
  const [detailPage, setDetailPage] = useState(1); // 1: Overview & Real Photo, 2: 2026 Live Data, 3: Range Deep-Dive
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const selectedPlace = useMemo(() => {
    return filteredPlaces.find(p => p.id === selectedPlaceId) || filteredPlaces[0] || ATTRACTIVE_PLACES[0];
  }, [filteredPlaces, selectedPlaceId]);

  const selectedRange = useMemo(() => {
    return MOUNTAIN_RANGES.find(r => r.id === selectedPlace.rangeId) || MOUNTAIN_RANGES[0];
  }, [selectedPlace.rangeId]);

  const placeIndex = useMemo(() => {
    return filteredPlaces.findIndex(p => p.id === selectedPlace.id);
  }, [filteredPlaces, selectedPlace.id]);

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

  const currentMeta = CATEGORY_META[selectedCategory] || CATEGORY_META.mountains;

  const modalContent = (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ZERO-SCROLL STRICT 100% CONTAINER */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        height: '95vh',
        maxHeight: '840px',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>

        {/* Floating Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '14px',
            zIndex: 100,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            color: '#FFF',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            transition: 'background 0.15s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)'}
          title="Close (Esc)"
        >
          <X size={16} />
        </button>

        {/* 2. MAIN SPLIT BODY (Separated into 2 Distinct Parallel Card Boxes) */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '10px 14px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}>

          {/* LEFT BOX: REALISTIC 3D THEMATIC PHYSICAL MAP OF INDIA */}
          <div style={{
            height: '100%',
            background: '#0B132B',
            borderRadius: '16px',
            border: '2px solid #334155',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>

            <IndiaRealisticThematicMap
              category={selectedCategory}
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              hoveredPlaceId={hoveredPlaceId}
              onSelectPlace={(id) => {
                setSelectedPlaceId(id);
                setDetailPage(1);
              }}
              onHoverPlace={(id) => setHoveredPlaceId(id)}
              zoomLevel={zoomLevel}
            />

            {/* MAP ZOOM & CONTROLS */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 60
            }}>
              <button
                onClick={() => setZoomLevel(z => Math.min(2.0, +(z + 0.25).toFixed(2)))}
                title="Zoom In"
                style={{
                  width: '30px', height: '30px', borderRadius: '7px',
                  background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer'
                }}
              >
                <ZoomIn size={15} />
              </button>
              <button
                onClick={() => setZoomLevel(z => Math.max(1.0, +(z - 0.25).toFixed(2)))}
                title="Zoom Out"
                style={{
                  width: '30px', height: '30px', borderRadius: '7px',
                  background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer'
                }}
              >
                <ZoomOut size={15} />
              </button>
              <button
                onClick={() => setZoomLevel(1.0)}
                title="Reset Zoom"
                style={{
                  width: '30px', height: '30px', borderRadius: '7px',
                  background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF', display: 'grid', placeItems: 'center', cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* RIGHT BOX: ZERO-SCROLL PAGINATED LEARNING CONSOLE */}
          <div style={{
            height: '100%',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #F2DFBC',
            boxShadow: '0 6px 20px rgba(60,40,20,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '12px 16px', overflow: 'hidden', justifyContent: 'space-between', gap: '6px' }}>

                {/* 1. TOP TITLE & PLACE CYCLE SWITCHER */}
                <div style={{ flexShrink: 0, borderBottom: '2px solid #F1E5D1', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '3px 12px',
                      borderRadius: '999px',
                      background: '#FEF3C7',
                      color: '#92400E',
                      border: '1.5px solid #FDE68A'
                    }}>
                      {selectedPlace.type}
                    </span>

                    {/* Cycle Through Places */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={handlePrevPlace}
                        title="Previous Attraction"
                        style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                          color: '#334155', fontWeight: 900, fontSize: '13px',
                          cursor: 'pointer', display: 'grid', placeItems: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                      >
                        ‹
                      </button>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>
                        {placeIndex + 1} / {filteredPlaces.length}
                      </span>
                      <button
                        onClick={handleNextPlace}
                        title="Next Attraction"
                        style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                          color: '#334155', fontWeight: 900, fontSize: '13px',
                          cursor: 'pointer', display: 'grid', placeItems: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: 'clamp(19px, 2.2vw, 24px)', fontWeight: 900, color: '#451A03', fontFamily: '"Fraunces", Georgia, serif', lineHeight: 1.2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{selectedPlace.imageEmoji}</span> {selectedPlace.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#92400E', fontWeight: 700, marginTop: '2px' }}>
                    {selectedPlace.hindiName} • Part of {selectedRange.name}
                  </div>
                </div>

                {/* 2. SUB-PAGE TABS SELECTOR (1: PHOTO & DETAILS | 2: PHYSICAL REGION GEOGRAPHY) */}
                <div style={{
                  display: 'flex',
                  background: '#F1F5F9',
                  borderRadius: '10px',
                  padding: '3px',
                  border: '1.5px solid #E2E8F0',
                  flexShrink: 0
                }}>
                  <button
                    onClick={() => setDetailPage(1)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: detailPage === 1 ? '#D97706' : 'transparent',
                      color: detailPage === 1 ? '#FFF' : '#334155',
                      padding: '7px 0',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s',
                      boxShadow: detailPage === 1 ? '0 2px 6px rgba(217, 119, 6, 0.3)' : 'none'
                    }}
                  >
                    <span>📸 Photo & Feature Details</span>
                  </button>

                  <button
                    onClick={() => setDetailPage(2)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: detailPage === 2 ? '#059669' : 'transparent',
                      color: detailPage === 2 ? '#FFF' : '#334155',
                      padding: '7px 0',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s',
                      boxShadow: detailPage === 2 ? '0 2px 6px rgba(5, 150, 105, 0.3)' : 'none'
                    }}
                  >
                    <span>🧭 Physical Region & NCERT</span>
                  </button>
                </div>

                {/* 3. PAGINATED BODY CONTENT (Full-Height Immersive Display) */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {detailPage === 1 ? (
                    /* PAGE 1: ENLARGED REALISTIC FIELD PHOTO & RICH STATS */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '8px' }}>

                      {/* ENLARGED REALISTIC FEATURE IMAGE BANNER */}
                      <div
                        onClick={() => setShowPhotoModal(true)}
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: 'clamp(170px, 24vh, 220px)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '2px solid #F2DFBC',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={selectedPlace.realImage}
                          alt={selectedPlace.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.35s ease'
                          }}
                          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseOut={e => e.currentTarget.style.transform = 'scale(1.0)'}
                          onError={e => {
                            const catFallbacks = {
                              forests: '/mountains/sundarbans.jpg',
                              rivers: '/mountains/river_ganga.jpg',
                              plains: '/mountains/gangetic_plain.jpg',
                              deserts: '/mountains/thar_desert.jpg',
                              plateaus: '/mountains/deccan_plateau.jpg',
                              mountains: '/mountains/nanda_devi.jpg'
                            };
                            e.currentTarget.src = catFallbacks[selectedPlace.category] || '/mountains/nanda_devi.jpg';
                          }}
                        />
                        {/* Overlay Badges */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: 'rgba(15, 23, 42, 0.9)',
                          color: '#FDE68A',
                          fontSize: '10px',
                          fontWeight: 900,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                          📸 REALISTIC FIELD PHOTO
                        </div>

                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.85)',
                          color: '#FFF',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}>
                          <Maximize2 size={12} /> Full Photo
                        </div>

                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                          padding: '24px 12px 8px 12px',
                          color: '#FFF',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {selectedPlace.imageCaption || selectedPlace.highlight}
                        </div>
                      </div>

                      {/* Description with Enlarged Font */}
                      <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.45, margin: 0, fontWeight: 500, textAlign: 'justify', textJustify: 'inter-word' }}>
                        {selectedPlace.description}
                      </p>

                      {/* Quick 4-Box Stats Grid (Enlarged Fonts & Padding) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '10px', padding: '8px 12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🏔️ Altitude / Elevation
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#451A03', marginTop: '2px' }}>
                            {selectedPlace.alt}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '10px', padding: '8px 12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🏷️ Feature Type
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#D97706', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedPlace.type.split('(')[0]}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '10px', padding: '8px 12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🗺️ Physical Region
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#451A03', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedRange.name.split('(')[0]}
                          </div>
                        </div>

                        <div style={{ background: '#FFF9F0', border: '1.5px solid #F2DFBC', borderRadius: '10px', padding: '8px 12px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            🌊 Regional Rivers
                          </div>
                          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#451A03', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedRange.rivers.slice(0, 2).join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Key Highlights Card (Enlarged Fonts) */}
                      <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                          Key Attraction Highlight:
                        </div>
                        <div style={{ fontSize: '13px', color: '#1E293B', fontWeight: 700, lineHeight: 1.4, marginTop: '2px', textAlign: 'justify', textJustify: 'inter-word' }}>
                          ✨ {selectedPlace.highlight}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PAGE 2: PHYSICAL REGION DEEP-DIVE & NCERT CORE FACTS (Space Covering with Large Typography) */
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '10px' }}>
                      {/* NCERT 6th Grade Textbook Core Fact */}
                      <div style={{
                        background: 'linear-gradient(140deg, #FEF3C7 0%, #FDE68A 100%)',
                        border: '2px solid #F59E0B',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.15)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, color: '#92400E', textTransform: 'uppercase' }}>
                          <Sparkles size={14} color="#D97706" /> NCERT Class 6 Core Concept:
                        </div>
                        <div style={{ fontSize: '13.5px', color: '#78350F', fontWeight: 700, marginTop: '5px', lineHeight: 1.45, textAlign: 'justify', textJustify: 'inter-word' }}>
                          {selectedRange.ncertFact}
                        </div>
                      </div>

                      {/* States Covered */}
                      <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                          🗺️ States Spanned by {selectedRange.name.split('(')[0]}:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {selectedRange.states.map(st => (
                            <span key={st} style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', padding: '5px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 700, color: '#1E293B', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Geological Characteristics */}
                      <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '10px', padding: '10px 12px', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
                          ⛰️ Key Characteristics:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {selectedRange.features.map(f => (
                            <span key={f} style={{ background: '#FFFFFF', border: '1.5px solid #86EFAC', padding: '5px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 700, color: '#166534', boxShadow: '0 1px 3px rgba(22,163,74,0.08)' }}>
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Did You Know? */}
                      <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '10.5px', fontWeight: 900, color: '#1E40AF', textTransform: 'uppercase' }}>
                          💡 Did You Know?
                        </div>
                        <div style={{ fontSize: '12.5px', color: '#1E3A8A', fontWeight: 600, marginTop: '3px', lineHeight: 1.4, textAlign: 'justify', textJustify: 'inter-word' }}>
                          {selectedRange.didYouKnow || selectedPlace.highlight}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. BOTTOM ACTION BAR */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '2px solid #F1E5D1',
                  paddingTop: '8px',
                  flexShrink: 0
                }}>
                  <button
                    onClick={handlePrevPlace}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#F1F5F9',
                      border: '1.5px solid #CBD5E1',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '6px 14px',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    ◀ Back
                  </button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {filteredPlaces.map((p, idx) => (
                      <span
                        key={p.id}
                        onClick={() => {
                          setSelectedPlaceId(p.id);
                          setDetailPage(1);
                        }}
                        style={{
                          width: idx === placeIndex ? '18px' : '7px',
                          height: '7px',
                          borderRadius: '4px',
                          background: idx === placeIndex ? '#D97706' : '#CBD5E1',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextPlace}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '6px 16px',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)'
                    }}
                  >
                    Next ▶
                  </button>
                </div>

              </div>
          </div>

        </div>

      </div>

      {/* FULLSCREEN REALISTIC MOUNTAIN PHOTO MODAL */}
      {showPhotoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '85vh',
            background: '#1E293B',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              height: '46px',
              background: '#0F172A',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFF',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{selectedPlace.imageEmoji}</span> {selectedPlace.name} — Realistic Field Photograph
                <span style={{ fontSize: '10px', background: '#D97706', padding: '2px 6px', borderRadius: '4px' }}>
                  {selectedPlace.alt}
                </span>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#FFF',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, minHeight: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={selectedPlace.realImage}
                alt={selectedPlace.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div style={{
              background: '#0F172A',
              padding: '10px 16px',
              color: '#CBD5E1',
              fontSize: '11.5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>{selectedPlace.imageCaption || selectedPlace.highlight}</div>
              <div style={{ color: '#F59E0B', fontWeight: 800 }}>NCERT Physical Geography Atlas</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
