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
    image: '/mountains/maps/india_rivers_3d_relief.jpg',
    filter: 'contrast(1.06) brightness(1.02) saturate(1.12)',
    tint: 'rgba(2, 132, 199, 0.08)',
    badge: '🌊 3D River Systems & Hydrology Drainage Map',
    legendTitle: 'Perennial & Peninsular Rivers'
  },
  forests: {
    id: 'forests',
    name: 'Forests & Vegetation Canopy',
    image: '/mountains/maps/india_forests_3d_relief.jpg',
    filter: 'contrast(1.06) brightness(1.02) saturate(1.12)',
    tint: 'rgba(5, 150, 105, 0.08)',
    badge: '🌳 3D Natural Vegetation & Forest Biomes Map',
    legendTitle: 'Forest Biomes & Wildlife Sanctuaries'
  },
  plateaus: {
    id: 'plateaus',
    name: 'Plateaus & Geological Tablelands',
    image: '/mountains/maps/india_plateaus_3d_relief.jpg',
    filter: 'contrast(1.06) brightness(1.02) saturate(1.12)',
    tint: 'rgba(139, 92, 246, 0.08)',
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
    map3dX: 39.8, map3dY: 9.0,
    alt: '8,611 m',
    type: 'World\'s 2nd Highest Peak',
    imageEmoji: '🏔️',
    realImage: '/mountains/k2.jpg',
    imageCaption: 'K2 — a huge mountain of rock and ice in the Karakoram Range',
    description: 'K2 is the second tallest mountain in the whole world! It is very steep and covered with ice. It is part of the Karakoram Range in the far north.',
    highlight: 'It is the 2nd tallest mountain on Earth, just after Mt. Everest!',
    labelOffsetX: 10, labelOffsetY: -8
  },
  {
    id: 'kullu_manali',
    name: 'Kullu-Manali Valley',
    hindiName: 'कुल्लू-मनाली घाटी',
    category: 'mountains',
    rangeId: 'lesser_himalayas',
    lat: 32.24, lon: 77.19,
    map3dX: 41.5, map3dY: 19.1,
    alt: '2,050 m',
    type: 'Lesser Himalayan Valley',
    imageEmoji: '🌲',
    realImage: '/mountains/kullu_manali.jpg',
    imageCaption: 'The beautiful Beas River valley with snowy mountains on both sides',
    description: 'Kullu-Manali is a beautiful valley where the Beas River flows. It has tall snow-covered mountains, apple gardens, and pine trees all around.',
    highlight: 'A famous hill station with snow, rivers, and apple orchards!',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'nanda_devi',
    name: 'Nanda Devi Peak',
    hindiName: 'नंदा देवी',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 30.37, lon: 79.97,
    map3dX: 48.6, map3dY: 24.4,
    alt: '7,816 m',
    type: 'Highest Peak Entirely in India',
    imageEmoji: '🏔️',
    realImage: '/mountains/nanda_devi.jpg',
    imageCaption: 'The tall twin peaks of Nanda Devi surrounded by mountains and glaciers',
    description: 'Nanda Devi is the tallest mountain that is fully inside India! It is in Uttarakhand and is surrounded by a beautiful national park.',
    highlight: 'The highest mountain peak that lies completely inside India!',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'mount_everest',
    name: 'Mount Everest (Sagarmatha)',
    hindiName: 'माउंट एवरेस्ट (सगरमाथा)',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 27.98, lon: 86.92,
    map3dX: 66.5, map3dY: 30.9,
    alt: '8,848.86 m',
    type: 'Highest Peak in the World',
    imageEmoji: '🏔️',
    realImage: '/mountains/mount_everest.jpg',
    imageCaption: 'Mount Everest — the tallest mountain in the whole world!',
    description: 'Mount Everest is the tallest mountain on Earth! It is 8,849 metres high. It sits on the border of Nepal and Tibet in the Great Himalayas.',
    highlight: 'The tallest mountain in the world! It is part of the Great Himalayas (Himadri).',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'nanga_parbat',
    name: 'Nanga Parbat',
    hindiName: 'नंगा परबत',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 35.23, lon: 74.58,
    map3dX: 34.8, map3dY: 10.8,
    alt: '8,126 m',
    type: 'Western Anchor of Himalayas',
    imageEmoji: '🏔️',
    realImage: '/mountains/nanga_parbat.jpg',
    imageCaption: 'Nanga Parbat — the giant mountain at the western end of the Himalayas.',
    description: 'Nanga Parbat is the big mountain where the Himalayas begin in the west. The Indus River flows around it in a deep valley.',
    highlight: 'It marks the starting point of the Himalayas in the west!',
    labelOffsetX: -110, labelOffsetY: 10
  },
  {
    id: 'namcha_barwa',
    name: 'Namcha Barwa',
    hindiName: 'नामचा बरवा',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 29.62, lon: 95.05,
    map3dX: 87.3, map3dY: 26.3,
    alt: '7,782 m',
    type: 'Eastern Anchor of Himalayas',
    imageEmoji: '🏔️',
    realImage: '/mountains/namcha_barwa.jpg',
    imageCaption: 'Namcha Barwa — where the Brahmaputra River takes a sharp turn.',
    description: 'Namcha Barwa is the mountain where the Himalayas end in the east. The Brahmaputra River makes a big U-turn around this peak to enter India.',
    highlight: 'The Brahmaputra River bends around this peak to flow into Arunachal Pradesh!',
    labelOffsetX: -110, labelOffsetY: -6
  },
  {
    id: 'dodabetta',
    name: 'Dodabetta Peak',
    hindiName: 'दोड्डाबेट्टा (नीलगिरि)',
    category: 'mountains',
    rangeId: 'western_ghats',
    lat: 11.40, lon: 76.73,
    map3dX: 40.3, map3dY: 77.1,
    alt: '2,637 m',
    type: 'Highest Peak in Nilgiris',
    imageEmoji: '⛰️',
    realImage: '/mountains/dodabetta.jpg',
    imageCaption: 'Dodabetta — the tallest point in the Nilgiri (Blue Mountains) hills.',
    description: 'Dodabetta is the tallest peak in the Nilgiri Hills. This is the place where the Western Ghats and Eastern Ghats come close together.',
    highlight: 'The Kurinji flowers here bloom only once in 12 years!',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'mahendragiri',
    name: 'Mahendragiri Peak',
    hindiName: 'महेंद्रगिरि',
    category: 'mountains',
    rangeId: 'eastern_ghats',
    lat: 18.96, lon: 84.36,
    map3dX: 59.9, map3dY: 56.0,
    alt: '1,501 m',
    type: 'Major Peak of Eastern Ghats',
    imageEmoji: '⛰️',
    realImage: '/mountains/mahendragiri.jpg',
    imageCaption: 'Mahendragiri — a tall peak in the Eastern Ghats of Odisha.',
    description: 'Mahendragiri is an important peak in the Eastern Ghats. The Eastern Ghats are not one long line like the Western Ghats — they are broken into many parts.',
    highlight: 'The Eastern Ghats are broken and lower than the Western Ghats!',
    labelOffsetX: 10, labelOffsetY: 10
  },
  {
    id: 'kanchenjunga',
    name: 'Mt. Kanchenjunga',
    hindiName: 'कंचनजंघा (सिक्किम)',
    category: 'mountains',
    rangeId: 'greater_himalayas',
    lat: 27.70, lon: 88.14,
    map3dX: 69.6, map3dY: 31.7,
    alt: '8,586 m',
    type: '3rd Highest Peak on Earth',
    imageEmoji: '🏔️',
    realImage: '/mountains/kanchenjunga.jpg',
    imageCaption: 'Kanchenjunga shining golden at sunrise, seen from Sikkim',
    description: 'Kanchenjunga is the tallest mountain in India and the 3rd tallest in the world! It is on the border of Sikkim and Nepal.',
    highlight: 'Its name means "Five Treasures of Snow" because it has five peaks!',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'guru_shikhar',
    name: 'Guru Shikhar (Mt. Abu)',
    hindiName: 'गुरु शिखर (माउंट आबू)',
    category: 'mountains',
    rangeId: 'aravalli',
    lat: 24.65, lon: 72.78,
    map3dX: 30.2, map3dY: 40.2,
    alt: '1,722 m',
    type: 'Highest Peak of Aravalli Range',
    imageEmoji: '⛰️',
    realImage: '/mountains/guru_shikhar.jpg',
    imageCaption: 'Guru Shikhar — the tallest point of the Aravalli mountains in Rajasthan',
    description: 'Guru Shikhar is the tallest peak of the Aravalli Range. It is at Mount Abu, which is the only hill station in the desert state of Rajasthan!',
    highlight: 'Mount Abu is the only hill station in Rajasthan!',
    labelOffsetX: -145, labelOffsetY: 4
  },
  {
    id: 'dhupgarh',
    name: 'Pachmarhi & Dhupgarh',
    hindiName: 'पचमढ़ी एवं धूपगढ़ (१,३५० मी)',
    category: 'mountains',
    rangeId: 'satpura',
    lat: 22.45, lon: 78.37,
    map3dX: 44.5, map3dY: 46.3,
    alt: '1,350 m',
    type: 'Highest Peak of Satpura Range',
    imageEmoji: '🌄',
    realImage: '/mountains/dhupgarh.jpg',
    imageCaption: 'A beautiful sunset over the green Satpura hills and forests',
    description: 'Dhupgarh is the tallest point in Madhya Pradesh. It is in the Satpura Range and is surrounded by thick forests and waterfalls.',
    highlight: 'You can see amazing sunsets from the top of Dhupgarh!',
    labelOffsetX: 10, labelOffsetY: 8
  },
  {
    id: 'anamudi',
    name: 'Anamudi Peak (Munnar)',
    hindiName: 'अनामुडी (२,६९५ मी - केरल)',
    category: 'mountains',
    rangeId: 'western_ghats',
    lat: 10.17, lon: 77.06,
    map3dX: 41.2, map3dY: 80.5,
    alt: '2,695 m',
    type: 'Highest Peak in South India',
    imageEmoji: '🏔️',
    realImage: '/mountains/anamudi.jpg',
    imageCaption: 'Anamudi — the tallest mountain in South India, surrounded by green tea gardens',
    description: 'Anamudi is the tallest mountain in all of South India! It is in Kerala and is surrounded by beautiful tea gardens and wild animals like the Nilgiri Tahr.',
    highlight: 'The tallest mountain peak in the whole of South India!',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'saramati',
    name: 'Mt. Saramati',
    hindiName: 'माउंट सारामती (नागालैंड)',
    category: 'mountains',
    rangeId: 'purvanchal',
    lat: 25.74, lon: 95.03,
    map3dX: 87.2, map3dY: 37.2,
    alt: '3,841 m',
    type: 'Highest Peak of Purvanchal',
    imageEmoji: '🏔️',
    realImage: '/mountains/saramati.jpg',
    imageCaption: 'Mount Saramati — the tallest peak in north-east India, always covered in clouds',
    description: 'Mount Saramati is the tallest mountain in the Purvanchal hills of north-east India. It is on the border of Nagaland and Myanmar, and is often covered in clouds and snow.',
    highlight: 'The tallest peak in the north-eastern hills of India!',
    labelOffsetX: 10, labelOffsetY: -6
  },

  // 2. PLAINS & BASINS
  {
    id: 'gangetic_plain',
    name: 'The Great Gangetic Plain',
    hindiName: 'विशाल गंगा का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 26.00, lon: 81.00,
    map3dX: 50.9, map3dY: 40.7,
    alt: '75 - 200 m',
    type: 'Vast Alluvial River Plain',
    imageEmoji: '🌾',
    realImage: '/mountains/gangetic_plain.jpg',
    imageCaption: 'The beautiful green fields and rivers of the Gangetic Plain',
    description: 'This is a huge, flat, and very fertile land. It is made by rich soil brought down by rivers like the Ganga and Yamuna. Many people live and farm here!',
    highlight: 'The most fertile and crowded farming area in all of India!',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'punjab_plain',
    name: 'Punjab-Haryana Plain',
    hindiName: 'पंजाब-हरियाणा का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 30.73, lon: 76.77,
    map3dX: 30.5, map3dY: 22.0,
    alt: '215 m',
    type: 'Granary of India',
    imageEmoji: '🚜',
    realImage: '/mountains/punjab_plain.jpg',
    imageCaption: 'Golden wheat fields shining bright in the sun',
    description: 'This fertile land is formed by five rivers. It grows so much wheat and food that it is called the "breadbasket of India"!',
    highlight: 'It grows most of the wheat for India!',
    labelOffsetX: -140, labelOffsetY: -6
  },
  {
    id: 'brahmaputra_plain',
    name: 'Brahmaputra Valley Plain',
    hindiName: 'ब्रह्मपुत्र घाटी का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 26.50, lon: 93.00,
    map3dX: 84.7, map3dY: 38.4,
    alt: '100 m',
    type: 'Lush Green River Valley',
    imageEmoji: '🌱',
    realImage: '/mountains/brahmaputra_plain.jpg',
    imageCaption: 'Beautiful green tea gardens next to the huge Brahmaputra river',
    description: 'A low flat valley in Assam where the big Brahmaputra river flows. This place is famous all over the world for its tasty Assam tea!',
    highlight: 'This valley makes the world-famous Assam tea!',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'rajasthan_plains',
    name: 'Rajasthan Plains',
    hindiName: 'राजस्थान का मैदान',
    category: 'plains',
    rangeId: 'northern_plains',
    lat: 26.23, lon: 73.02,
    map3dX: 0, map3dY: 0,
    alt: '150 - 300 m',
    type: 'Semi-Arid Desert Plains',
    imageEmoji: '🐪',
    realImage: '/mountains/thar_desert.jpg',
    imageCaption: 'Dry, sandy plains where camels walk across the scrubland',
    description: 'These are dry, sandy plains near the Great Indian Desert. Not much rain falls here, so only tough plants and bushes can grow.',
    highlight: 'These dry plains slowly turn into the big Thar Desert!',
    labelOffsetX: -120, labelOffsetY: 10
  },
  {
    id: 'gujarat_plains',
    name: 'Gujarat Plains',
    hindiName: 'गुजरात का मैदान',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 22.30, lon: 73.18,
    map3dX: 0, map3dY: 0,
    alt: '10 - 50 m',
    type: 'Fertile Coastal Plains',
    imageEmoji: '🌿',
    realImage: '/mountains/punjab_plain.jpg',
    imageCaption: 'Flat farming lands in Gujarat growing lots of cotton',
    description: 'A flat and fertile land near the ocean in Gujarat. The soil here is very good for growing crops like cotton and groundnuts.',
    highlight: 'The dark soil here is perfect for growing cotton!',
    labelOffsetX: -120, labelOffsetY: 0
  },
  {
    id: 'konkan_coast',
    name: 'Konkan Coastal Plain',
    hindiName: 'कोंकण तटीय मैदान',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 16.50, lon: 73.30,
    map3dX: 17.5, map3dY: 69.7,
    alt: '0 - 50 m',
    type: 'Western Coastal Strip',
    imageEmoji: '🥥',
    realImage: '/mountains/konkan_coast.jpg',
    imageCaption: 'A lovely beach with tall coconut trees and hills in the back',
    description: 'A beautiful narrow strip of land between the Western Ghats and the Arabian Sea. It is full of sweet mangoes, coconuts, and pretty beaches.',
    highlight: 'Famous for tasty Alphonso mangoes and clean beaches!',
    labelOffsetX: -130, labelOffsetY: -6
  },
  {
    id: 'malabar_coast',
    name: 'Malabar Coast',
    hindiName: 'मालाबार तट (केरल)',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 9.93, lon: 76.26,
    map3dX: 26.9, map3dY: 92.1,
    alt: '0 - 30 m',
    type: 'Backwaters & Lagoons',
    imageEmoji: '🛶',
    realImage: '/mountains/malabar_coast.jpg',
    imageCaption: 'Peaceful green backwaters with traditional wooden houseboats',
    description: 'This southern coast in Kerala is famous for its backwaters — a beautiful maze of lakes and canals. People also grow lots of spices here.',
    highlight: 'It has interconnected lakes called Kayals and big spice gardens!',
    labelOffsetX: -130, labelOffsetY: 6
  },
  {
    id: 'coromandel_coast',
    name: 'Coromandel Coastal Plain',
    hindiName: 'कोरोमंडल तटीय मैदान',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 13.00, lon: 80.25,
    map3dX: 39.0, map3dY: 85.6,
    alt: '0 - 40 m',
    type: 'Eastern Coastal Plain',
    imageEmoji: '🏖️',
    realImage: '/mountains/coromandel_coast.jpg',
    imageCaption: 'Wide sandy beaches on the east coast with fishing boats',
    description: 'A wide coastal plain in Tamil Nadu next to the Bay of Bengal. Unlike other places, this coast gets its heavy rains in the winter months!',
    highlight: 'This wide coast gets most of its rain in November and December!',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'northern_circars',
    name: 'Northern Circars Plain',
    hindiName: 'उत्तरी सरकार तट',
    category: 'plains',
    rangeId: 'coastal_plains',
    lat: 17.70, lon: 83.30,
    map3dX: 0, map3dY: 0,
    alt: '0 - 60 m',
    type: 'Rich River Delta Plain',
    imageEmoji: '🌊',
    realImage: '/mountains/coromandel_coast.jpg',
    imageCaption: 'Green river deltas where big rivers meet the salty ocean',
    description: 'The northern part of the east coast between the Mahanadi and Krishna rivers. The rivers make wide, muddy deltas here that are great for farming.',
    highlight: 'Big rivers create huge, rich farming deltas here before entering the sea!',
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
    realImage: '/mountains/river_ganga_varanasi_new.jpg',
    imageCaption: 'The sacred Ganga river at Varanasi with ancient ghats, boats and flower offerings',
    description: 'The longest river in India (2,525 km). It starts at the Gaumukh glacier in the Himalayas and flows east into the Bay of Bengal.',
    highlight: 'Starts from Gangotri glacier and joins Alaknanda to form the mighty Ganga!',
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
    realImage: '/mountains/river_yamuna_new.jpg',
    imageCaption: 'The serene Yamuna river flowing past ancient ghats with morning mist',
    description: 'It starts from the Yamunotri glacier in the Himalayas. It flows next to the Ganga until they meet at Prayagraj.',
    highlight: 'A major river that joins the Ganga at the famous Triveni Sangam!',
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
    realImage: '/mountains/river_indus_new.jpg',
    imageCaption: 'Stunning turquoise Indus river cutting through barren Ladakh mountain canyon',
    description: 'One of the greatest rivers in Asia. It starts in Tibet and flows through the high mountains of Ladakh.',
    highlight: 'The cradle of the ancient Indus Valley Civilisation!',
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
    realImage: '/mountains/river_brahmaputra_new.jpg',
    imageCaption: 'Aerial view of the mighty braided Brahmaputra river in Assam with green tea hills',
    description: 'It enters India through Arunachal Pradesh and flows through Assam. It creates Majuli, the world\'s largest river island.',
    highlight: 'Joins the Ganga to form the world\'s largest river delta!',
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
    imageCaption: 'Tidal mangrove channels and coastal islands of the Sundarbans',
    description: 'Formed where the Ganga and Brahmaputra rivers meet the sea. It is named after the beautiful Sundari mangrove trees.',
    highlight: 'A huge triangular delta famous for its mangrove forests and Royal Bengal Tigers!',
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
    imageCaption: 'Narmada River cutting a deep gorge through pure white marble cliffs',
    description: 'It starts in Madhya Pradesh and flows west through a deep valley between two mountain ranges. It creates beautiful waterfalls.',
    highlight: 'A major west-flowing river that drains into the Arabian Sea!',
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
    imageCaption: 'Tapi River meandering through the valley towards the sea',
    description: 'It flows parallel to the Narmada river towards the west, emptying into the Arabian Sea near Surat.',
    highlight: 'One of the two major west-flowing rivers in India!',
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
    type: 'Major East-Flowing River',
    imageEmoji: '🌊',
    realImage: '/mountains/river_mahanadi.jpg',
    imageCaption: 'Wide, shimmering expanse of the Mahanadi River in Odisha',
    description: 'It flows east through Odisha to form a rich farming delta on the Bay of Bengal. The famous Hirakud Dam is built here.',
    highlight: 'A very important river draining into the Bay of Bengal!',
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
    type: 'Longest Peninsular River',
    imageEmoji: '🌊',
    realImage: '/mountains/river_godavari_new.jpg',
    imageCaption: 'The wide flowing Godavari river with fishing boats and palm-lined banks',
    description: 'It is the longest river in southern India. It starts in Maharashtra and flows east into the Bay of Bengal.',
    highlight: 'Also known as the Dakshin Ganga because of its large size and importance!',
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
    imageCaption: 'Krishna River winding through green valleys and farming basins',
    description: 'It starts near Mahabaleshwar in the Western Ghats and flows through many states before reaching the sea.',
    highlight: 'A major east-flowing river fed by important tributaries like Tungabhadra!',
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
    type: 'Sacred River of Southern India',
    imageEmoji: '🌾',
    realImage: '/mountains/river_kaveri.jpg',
    imageCaption: 'Kaveri River flowing past lush emerald green paddy fields',
    description: 'It flows across Karnataka and Tamil Nadu. It creates a very fertile delta known as the Rice Bowl of the south.',
    highlight: 'A beautiful river that has water all year round from monsoon rains!',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'river_sutlej',
    name: 'Sutlej River',
    hindiName: 'सतलज नदी (पंजाब)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 31.33, lon: 76.43,
    map3dX: 35.0, map3dY: 18.0,
    alt: '400 m',
    type: 'Major Indus Tributary',
    imageEmoji: '🌊',
    realImage: '/mountains/river_sutlej_new.jpg',
    imageCaption: 'The fast-flowing Sutlej river cutting through a dramatic Himalayan gorge',
    description: 'The longest of the five rivers that flow through Punjab. It provides water for the famous Bhakra Nangal Dam.',
    highlight: 'An ancient river that helps turn the Punjab plains into rich farm land!',
    labelOffsetX: -100, labelOffsetY: -6
  },
  {
    id: 'river_chenab',
    name: 'Chenab River',
    hindiName: 'चिनाब नदी (जम्मू और कश्मीर)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 33.15, lon: 74.92,
    map3dX: 34.0, map3dY: 16.0,
    alt: '1,200 m',
    type: 'Himalayan River',
    imageEmoji: '🏔️',
    realImage: '/mountains/river_chenab_new.jpg',
    imageCaption: 'The Chenab river winding through lush green Kashmir valley with snow peaks',
    description: 'Formed by the joining of two smaller rivers in the high Himalayas. It flows through Jammu and Kashmir before entering Punjab.',
    highlight: 'A huge, powerful river famous for its massive bridges and deep gorges!',
    labelOffsetX: -110, labelOffsetY: -6
  },
  {
    id: 'river_luni',
    name: 'Luni River',
    hindiName: 'लूनी नदी (राजस्थान)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 25.75, lon: 72.10,
    map3dX: 31.0, map3dY: 29.0,
    alt: '150 m',
    type: 'Desert River',
    imageEmoji: '🐪',
    realImage: '/mountains/river_luni_new.jpg',
    imageCaption: 'The Luni river meandering through the golden Thar Desert at sunset',
    description: 'The largest river in the Thar desert. It flows during the rainy season and slowly disappears into the salty Rann of Kutch.',
    highlight: 'A unique inland river that never reaches the open ocean!',
    labelOffsetX: -110, labelOffsetY: 6
  },
  {
    id: 'river_chambal',
    name: 'Chambal River',
    hindiName: 'चंबल नदी',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 25.85, lon: 76.55,
    map3dX: 41.0, map3dY: 29.0,
    alt: '250 m',
    type: 'Cleanest Major River',
    imageEmoji: '🐊',
    realImage: '/mountains/river_chambal_new.jpg',
    imageCaption: 'The Chambal river flowing through deep rocky ravines and badlands',
    description: 'A major tributary of the Yamuna river. It is famous for its clean water, deep ravines, and as a home for crocodiles.',
    highlight: 'Known for its rugged badlands and incredible wildlife sanctuaries!',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_kosi',
    name: 'Kosi River',
    hindiName: 'कोसी नदी (बिहार का शोक)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 25.42, lon: 87.25,
    map3dX: 61.0, map3dY: 25.0,
    alt: '50 m',
    type: 'Himalayan Tributary',
    imageEmoji: '🌊',
    realImage: '/mountains/river_kosi_new.jpg',
    imageCaption: 'The braided Kosi river flooding across Bihar\'s green floodplains',
    description: 'A powerful river flowing down from Nepal into Bihar. It brings a lot of water and sand from the mountains.',
    highlight: 'Known as the "Sorrow of Bihar" because it changes its path and causes floods.',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_tungabhadra',
    name: 'Tungabhadra River',
    hindiName: 'तुंगभद्रा नदी',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 15.88, lon: 78.16,
    map3dX: 43.0, map3dY: 47.0,
    alt: '350 m',
    type: 'Peninsular Tributary',
    imageEmoji: '🛕',
    realImage: '/mountains/river_tungabhadra_new.jpg',
    imageCaption: 'The Tungabhadra river flowing past massive boulders and temples at Hampi',
    description: 'A major river in southern India that joins the Krishna river. It flows through rocky landscapes and historical cities.',
    highlight: 'The magnificent ruins of the Vijayanagara Empire at Hampi sit on its banks!',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'river_vaigai',
    name: 'Vaigai River',
    hindiName: 'वईगई नदी (मदुरै)',
    category: 'rivers',
    rangeId: 'river_basins',
    lat: 9.85, lon: 78.98,
    map3dX: 45.0, map3dY: 57.0,
    alt: '20 m',
    type: 'Southern River',
    imageEmoji: '🌸',
    realImage: '/mountains/river_vaigai_new.jpg',
    imageCaption: 'The Vaigai river flowing through Madurai with Meenakshi temple towers',
    description: 'A river in Tamil Nadu that flows from the Western Ghats to the sea. It passes through the ancient temple city of Madurai.',
    highlight: 'A river that has supported Tamil civilization for thousands of years!',
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
    type: '2nd Highest Plunge Waterfall',
    imageEmoji: '🌊',
    realImage: '/mountains/jog_falls.jpg',
    imageCaption: 'The dramatic 253 m plunge of cascades in the lush Western Ghats',
    description: 'The Sharavathi River drops steeply down the Western Ghats mountains, creating a huge and beautiful waterfall.',
    highlight: 'A spectacular 253 m waterfall where the river plunges off a steep cliff!',
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
    map3dX: 26.8, map3dY: 36.6, // Relative to map bounds
    alt: '225 m',
    type: 'Great Sand Dune Desert',
    imageEmoji: '🐪',
    realImage: '/mountains/thar_desert_new.jpg',
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
    map3dX: 25.4, map3dY: 45.4, // Relative to map bounds
    alt: '10 m',
    type: 'Endless White Salt Desert',
    imageEmoji: '🧂',
    realImage: '/mountains/rann_of_kutch_new.jpg',
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
    map3dX: 34.1, map3dY: 16.1, // Relative to map bounds
    alt: '3,500 m',
    type: 'High-Altitude Rain-Shadow Desert',
    imageEmoji: '❄️',
    realImage: '/mountains/cold_desert_ladakh_new.jpg',
    imageCaption: 'Barren rocky mountains, a deep blue high-altitude sky, and a crystal clear mountain river carving through the Ladakh valley',
    description: 'A high-altitude arid plateau lying in the rain-shadow of the Great Himalayas, experiencing freezing winter temperatures and minimal rainfall.',
    highlight: 'High-altitude cold desert cut off from monsoon by the Himalayas',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'cold_desert_spiti',
    name: 'Spiti Valley Cold Desert',
    hindiName: 'स्पीति घाटी शीत मरुस्थल',
    category: 'deserts',
    rangeId: 'arid_regions',
    lat: 32.22, lon: 78.03,
    map3dX: 37.1, map3dY: 22.0, // Relative to map bounds
    alt: '3,800 m',
    type: 'High-Altitude Cold Desert',
    imageEmoji: '🏔️',
    realImage: '/mountains/spiti_valley_new.jpg',
    imageCaption: 'Stunning barren valleys of Spiti surrounded by snow-capped Himalayan peaks',
    description: 'Located in Himachal Pradesh, this is another major cold desert region of India, cut off from the main monsoon path by the towering Pir Panjal ranges.',
    highlight: 'One of the most rugged and remote cold deserts in the world!',
    labelOffsetX: 10, labelOffsetY: 6
  },

  // 5. FORESTS & BIOSPHERES
  {
    id: 'himalayan_tropical_forests',
    name: 'Himalayan Tropical Forests (Tarai & Shiwalik)',
    hindiName: 'हिमालयी तराई एवं उष्णकटिबंधीय वन',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 29.50, lon: 79.00,
    map3dX: 36.1, map3dY: 25.7,
    alt: '400 m - 1,200 m',
    type: 'Sub-Himalayan Sal & Mixed Broadleaf Forest',
    imageEmoji: '🌲',
    realImage: '/mountains/himalayan_tropical_forest.jpg',
    imageCaption: 'Dense moist Sal trees and mixed subtropical foothill forests along the Shiwalik and Tarai belt',
    description: 'Lush sub-Himalayan foothill forests stretching along the Tarai and Bhabhar belts, rich in tall Sal timber trees, bamboo thickets, wild elephants, and Bengal tigers.',
    highlight: 'Class 6 NCERT: Sub-Himalayan foothills feature rich natural vegetation and dense Sal forests',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'indo_gangetic_forests',
    name: 'Indo-Gangetic Plain Forests',
    hindiName: 'सिंधु-गंगा मैदान के नदीय एवं शुष्क पर्णपाती वन',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 26.80, lon: 81.50,
    map3dX: 51.8, map3dY: 35.9,
    alt: '120 m',
    type: 'Alluvial Riverine & Tropical Dry Forest',
    imageEmoji: '🌾',
    realImage: '/mountains/indo_gangetic_woodland.jpg',
    imageCaption: 'Riverine woodlands and agricultural plains interspersed with native Shisham, Neem, and Peepal groves',
    description: 'Extensive alluvial forest and riverine woodlands of the northern fertile plains, characterized by Neem, Shisham, Babul, and sacred Peepal trees flanking the Ganga river basin.',
    highlight: 'Densely populated agricultural heartland interspersed with native riverine forest groves',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'central_indian_forests',
    name: 'Central Indian Deciduous Forests',
    hindiName: 'मध्य भारतीय पर्णपाती वन (कान्हा एवं सतपुड़ा)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 22.33, lon: 80.60,
    map3dX: 39.1, map3dY: 50.6,
    alt: '600 m',
    type: 'Tropical Moist & Dry Deciduous Teak Woodland',
    imageEmoji: '🐅',
    realImage: '/mountains/central_indian_deciduous.jpg',
    imageCaption: 'Sunlight filtering through dense teak and sal canopies in the rolling Satpura-Maikal tiger highlands',
    description: 'The vast heartland of India\'s forest cover across Madhya Pradesh and Chhattisgarh, dominated by valuable Teak and Sal trees, forming prime habitats for tigers, leopards, and gaur.',
    highlight: 'Class 6 NCERT: Tropical Deciduous forests (Monsoon forests) shed their leaves during the dry summer season',
    labelOffsetX: 10, labelOffsetY: 6
  },
  {
    id: 'western_ghats_rainforest',
    name: 'Western Ghats Tropical Forests',
    hindiName: 'पश्चिमी घाट उष्णकटिबंधीय वर्षावन',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 14.50, lon: 74.80,
    map3dX: 28.8, map3dY: 63.0,
    alt: '1,100 m',
    type: 'Tropical Evergreen & Semi-Evergreen Rainforest',
    imageEmoji: '🌴',
    realImage: '/mountains/western_ghats_rainforest.jpg',
    imageCaption: 'Dense multi-layered canopy of tropical evergreen rainforests receiving over 2,500 mm annual monsoon rainfall',
    description: 'A UNESCO World Heritage biodiversity hotspot featuring dense multi-tiered evergreen rain forests that remain green year-round due to torrential monsoon rainfall from the Arabian Sea.',
    highlight: 'Class 6 NCERT: Tropical Evergreen Forests are so dense that sunlight cannot reach the ground; trees shed leaves at different times',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'south_indian_forests',
    name: 'South Indian Tropical Forests (Nilgiris & Sholas)',
    hindiName: 'दक्षिण भारतीय उष्णकटिबंधीय वन एवं शोला (नीलगिरि)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 11.40, lon: 76.70,
    map3dX: 32.2, map3dY: 82.1,
    alt: '1,800 m',
    type: 'Montane Wet Temperate Shola-Grassland Mosaic',
    imageEmoji: '🌺',
    realImage: '/mountains/south_indian_shola.jpg',
    imageCaption: 'Misty montane Shola forest patches nestled amidst undulating high-altitude Nilgiri grasslands',
    description: 'Unique high-altitude stunted evergreen Shola forests and moist deciduous reserves spanning the Nilgiri Biosphere, Bandipur, Mudumalai, and Silent Valley.',
    highlight: 'Class 6 NCERT: Nilgiri Hills where Western & Eastern Ghats meet, famous for Shola forest biomes and Kurinji blooms',
    labelOffsetX: 10, labelOffsetY: -6
  },
  {
    id: 'north_east_hill_forests',
    name: 'North East Hill Forests & Kaziranga',
    hindiName: 'उत्तर-पूर्व पर्वतीय वर्षावन एवं काजीरंगा',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 26.57, lon: 93.17,
    map3dX: 75.2, map3dY: 38.9,
    alt: '65 m - 1,500 m',
    type: 'Subtropical Wet Hill & Swamp Jungle',
    imageEmoji: '🦏',
    realImage: '/mountains/kaziranga.jpg',
    imageCaption: 'Lush subtropical hill jungle and tall elephant grass swamps along the Brahmaputra valley',
    description: 'Densely forested hill slopes in Assam, Meghalaya, and Arunachal receiving extreme monsoon precipitation, home to two-thirds of the world\'s Great One-horned Rhinoceroses.',
    highlight: 'One of the richest floral and faunal biodiversity zones in the world',
    labelOffsetX: -140, labelOffsetY: -6
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangrove Delta Forest',
    hindiName: 'सुंदरवन मैंग्रोव डेल्टा वन (पश्चिम बंगाल)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 21.94, lon: 88.90,
    map3dX: 68.4, map3dY: 46.9,
    alt: '5 m',
    type: 'Tidal Halophytic Mangrove Ecosystem',
    imageEmoji: '🐅',
    realImage: '/mountains/sundarbans_mangrove.jpg',
    imageCaption: 'Dense stilt-rooted Sundari mangrove waterways at the meeting of Ganga, Brahmaputra, and Bay of Bengal',
    description: 'The world\'s largest halophytic tidal mangrove delta forest formed by the Ganga and Brahmaputra rivers, home to the iconic Royal Bengal Tiger.',
    highlight: 'Class 6 NCERT: Mangrove forests can survive in saline water. Sundari is a well-known species of trees in mangrove forests after which Sundarbans is named',
    labelOffsetX: -140, labelOffsetY: 6
  },
  {
    id: 'gir_forest',
    name: 'Gir Dry Deciduous Forest & Lion Sanctuary',
    hindiName: 'गीर शुष्क पर्णपाती वन एवं अभयारण्य (गुजरात)',
    category: 'forests',
    rangeId: 'biosphere_forests',
    lat: 21.12, lon: 70.82,
    map3dX: 20.5, map3dY: 48.4,
    alt: '150 m',
    type: 'Dry Deciduous Teak & Thorn Scrub',
    imageEmoji: '🦁',
    realImage: '/mountains/gir_forest.jpg',
    imageCaption: 'Majestic Asiatic Lion roaming freely in its natural dry deciduous teak forest habitat at Gir Wildlife Sanctuary, Gujarat',
    description: 'The sole and exclusive home of the Asiatic Lion (Panthera leo persica) in the wild, characterized by rugged dry deciduous teak woodlands and thorn scrub in the Kathiawar peninsula.',
    highlight: 'Class 6 NCERT: Gir National Park in Gujarat is the only natural home in the world for wild Asiatic Lions',
    labelOffsetX: -140, labelOffsetY: 6
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
    labelOffsetX: 10, labelOffsetY: -6
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


                {/* BODY CONTENT (Full-Height Immersive Display) */}
                <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* PAGE 1: ENLARGED REALISTIC FIELD PHOTO & RICH STATS */}
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', gap: '8px' }}>

                      {/* ENLARGED REALISTIC FEATURE IMAGE BANNER */}
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: 'clamp(200px, 32vh, 280px)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '2px solid #F2DFBC',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
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
                            🏔️ Height
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
                            🗺️ Region
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



    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
