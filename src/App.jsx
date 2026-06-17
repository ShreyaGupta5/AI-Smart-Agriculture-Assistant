import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  CloudSun,
  Droplets,
  ExternalLink,
  FlaskConical,
  Gauge,
  ImageUp,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Mic,
  MicOff,
  Microscope,
  Phone,
  Ruler,
  Search,
  Send,
  ShieldCheck,
  Sprout,
  TrendingUp,
  User,
  Volume2,
  Wallet,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const API_BASE = '/api';

const researchCentre = {
  name: 'Indian Council of Agricultural Research',
  shortName: 'ICAR',
  url: 'https://icar.org.in/',
  text: 'Access official Indian crop research, agriculture technologies, farmer advisories, institutes, and extension resources.'
};

const cropThemes = [
  {
    keys: ['tomato', 'brinjal', 'chili', 'chilli', 'pepper', 'capsicum'],
    label: 'Vegetable Crop',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1400&q=80',
    accent: '#c2410c',
    secondary: '#f97316',
    pattern: 'radial-gradient(circle at 18% 28%, rgba(248, 113, 113, 0.65), transparent 24%), radial-gradient(circle at 78% 30%, rgba(251, 146, 60, 0.55), transparent 22%)',
    text: 'Vegetable crops need frequent scouting, balanced nutrition, and careful moisture control.'
  },
  {
    keys: ['rice', 'paddy'],
    label: 'Rice Paddy',
    image: 'https://images.unsplash.com/photo-1536054670607-3dc7d8698cc8?auto=format&fit=crop&w=1400&q=80',
    accent: '#0f766e',
    secondary: '#14b8a6',
    pattern: 'linear-gradient(135deg, rgba(20, 184, 166, 0.45), transparent 34%), repeating-linear-gradient(90deg, rgba(240, 253, 250, 0.18) 0 2px, transparent 2px 16px)',
    text: 'Rice decisions depend heavily on water level, humidity, and disease pressure.'
  },
  {
    keys: ['wheat', 'barley', 'sorghum', 'millet', 'pearl millet', 'corn', 'maize'],
    label: 'Cereal Crop',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1400&q=80',
    accent: '#a16207',
    secondary: '#eab308',
    pattern: 'linear-gradient(135deg, rgba(250, 204, 21, 0.48), transparent 32%), repeating-linear-gradient(115deg, rgba(254, 243, 199, 0.22) 0 3px, transparent 3px 18px)',
    text: 'Cereal crops respond strongly to stage-based irrigation and split nutrient application.'
  },
  {
    keys: ['cotton', 'jute'],
    label: 'Fiber Crop',
    image: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?auto=format&fit=crop&w=1400&q=80',
    accent: '#334155',
    secondary: '#94a3b8',
    pattern: 'radial-gradient(circle at 24% 24%, rgba(226, 232, 240, 0.75), transparent 18%), radial-gradient(circle at 72% 44%, rgba(148, 163, 184, 0.55), transparent 20%)',
    text: 'Fiber crops benefit from pest scouting, soil moisture tracking, and growth-stage alerts.'
  },
  {
    keys: ['banana', 'papaya', 'pineapple'],
    label: 'Tropical Fruit Crop',
    image: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&w=1400&q=80',
    accent: '#15803d',
    secondary: '#84cc16',
    pattern: 'radial-gradient(circle at 22% 30%, rgba(132, 204, 22, 0.55), transparent 25%), linear-gradient(135deg, rgba(21, 128, 61, 0.45), transparent 40%)',
    text: 'Tropical fruit crops need steady moisture, mulch, and strong potassium management.'
  },
  {
    keys: ['mango', 'apple', 'guava', 'pomegranate', 'orange', 'lemon', 'grapes', 'litchi', 'cashew'],
    label: 'Orchard Crop',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=1400&q=80',
    accent: '#ca8a04',
    secondary: '#facc15',
    pattern: 'radial-gradient(circle at 20% 22%, rgba(250, 204, 21, 0.55), transparent 22%), radial-gradient(circle at 78% 48%, rgba(34, 197, 94, 0.42), transparent 24%)',
    text: 'Orchard crop advisories change around flowering, fruiting, pruning, and canopy disease risk.'
  },
  {
    keys: ['chickpea', 'pigeon pea', 'green gram', 'black gram', 'lentil', 'pea', 'soybean'],
    label: 'Pulse And Legume Crop',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1400&q=80',
    accent: '#7c3aed',
    secondary: '#22c55e',
    pattern: 'radial-gradient(circle at 30% 28%, rgba(124, 58, 237, 0.36), transparent 20%), radial-gradient(circle at 70% 55%, rgba(34, 197, 94, 0.45), transparent 25%)',
    text: 'Pulse crops need drainage care, seed treatment, and flowering-stage disease monitoring.'
  },
  {
    keys: ['groundnut', 'mustard', 'sesame', 'sunflower', 'safflower', 'castor'],
    label: 'Oilseed Crop',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1400&q=80',
    accent: '#d97706',
    secondary: '#f59e0b',
    pattern: 'radial-gradient(circle at 24% 28%, rgba(245, 158, 11, 0.58), transparent 22%), repeating-linear-gradient(45deg, rgba(254, 243, 199, 0.18) 0 4px, transparent 4px 18px)',
    text: 'Oilseed crops need moisture balance, sulfur or micronutrient checks, and timely pest scouting.'
  },
  {
    keys: ['turmeric', 'ginger', 'garlic', 'coriander', 'cumin', 'fenugreek', 'cardamom', 'black pepper'],
    label: 'Spice Crop',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1400&q=80',
    accent: '#b45309',
    secondary: '#dc2626',
    pattern: 'radial-gradient(circle at 26% 28%, rgba(220, 38, 38, 0.4), transparent 22%), radial-gradient(circle at 74% 38%, rgba(245, 158, 11, 0.48), transparent 24%)',
    text: 'Spice crops need drainage, disease prevention, and careful nutrient timing for quality produce.'
  },
  {
    keys: ['sugarcane', 'coconut', 'arecanut', 'tea', 'coffee', 'rubber', 'tobacco'],
    label: 'Plantation Crop',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1400&q=80',
    accent: '#166534',
    secondary: '#22c55e',
    pattern: 'linear-gradient(135deg, rgba(34, 197, 94, 0.42), transparent 32%), radial-gradient(circle at 76% 38%, rgba(20, 83, 45, 0.45), transparent 24%)',
    text: 'Plantation crops need long-term soil health, irrigation planning, and recurring pest surveillance.'
  }
];

const cropVisuals = {
  tomato: { name: 'Tomato', fruit: '#dc2626', leaf: '#15803d', field: '#7f1d1d' },
  banana: { name: 'Banana', fruit: '#facc15', leaf: '#15803d', field: '#365314' },
  rice: { name: 'Rice Paddy', fruit: '#bbf7d0', leaf: '#0f766e', field: '#14532d' },
  paddy: { name: 'Rice Paddy', fruit: '#bbf7d0', leaf: '#0f766e', field: '#14532d' },
  wheat: { name: 'Wheat', fruit: '#fbbf24', leaf: '#a16207', field: '#713f12' },
  barley: { name: 'Barley', fruit: '#facc15', leaf: '#a16207', field: '#713f12' },
  corn: { name: 'Corn', fruit: '#fde047', leaf: '#65a30d', field: '#365314' },
  maize: { name: 'Maize', fruit: '#fde047', leaf: '#65a30d', field: '#365314' },
  cotton: { name: 'Cotton', fruit: '#f8fafc', leaf: '#64748b', field: '#334155' },
  sugarcane: { name: 'Sugarcane', fruit: '#84cc16', leaf: '#166534', field: '#14532d' },
  soybean: { name: 'Soybean', fruit: '#86efac', leaf: '#16a34a', field: '#14532d' },
  groundnut: { name: 'Groundnut', fruit: '#d97706', leaf: '#65a30d', field: '#713f12' },
  mustard: { name: 'Mustard', fruit: '#fde047', leaf: '#4d7c0f', field: '#713f12' },
  sunflower: { name: 'Sunflower', fruit: '#facc15', leaf: '#15803d', field: '#854d0e' },
  onion: { name: 'Onion', fruit: '#e9d5ff', leaf: '#16a34a', field: '#581c87' },
  chili: { name: 'Chili', fruit: '#dc2626', leaf: '#15803d', field: '#7f1d1d' },
  chilli: { name: 'Chili', fruit: '#dc2626', leaf: '#15803d', field: '#7f1d1d' },
  mango: { name: 'Mango', fruit: '#f59e0b', leaf: '#15803d', field: '#713f12' },
  apple: { name: 'Apple', fruit: '#dc2626', leaf: '#166534', field: '#7f1d1d' },
  guava: { name: 'Guava', fruit: '#bbf7d0', leaf: '#15803d', field: '#14532d' },
  pomegranate: { name: 'Pomegranate', fruit: '#be123c', leaf: '#15803d', field: '#881337' },
  orange: { name: 'Orange', fruit: '#f97316', leaf: '#15803d', field: '#9a3412' },
  lemon: { name: 'Lemon', fruit: '#fde047', leaf: '#15803d', field: '#365314' },
  grapes: { name: 'Grapes', fruit: '#7c3aed', leaf: '#15803d', field: '#3b0764' },
  chickpea: { name: 'Chickpea', fruit: '#d9a441', leaf: '#65a30d', field: '#713f12' },
  turmeric: { name: 'Turmeric', fruit: '#f59e0b', leaf: '#15803d', field: '#7c2d12' },
  ginger: { name: 'Ginger', fruit: '#d97706', leaf: '#65a30d', field: '#713f12' },
  garlic: { name: 'Garlic', fruit: '#f5f5f4', leaf: '#65a30d', field: '#44403c' },
  tea: { name: 'Tea', fruit: '#86efac', leaf: '#166534', field: '#14532d' },
  coffee: { name: 'Coffee', fruit: '#92400e', leaf: '#166534', field: '#451a03' },
  coconut: { name: 'Coconut', fruit: '#a16207', leaf: '#15803d', field: '#365314' }
};

const cropPhotoUrls = {
  tomato: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
  banana: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
  rice: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg',
  paddy: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg',
  wheat: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/3840px-Vehn%C3%A4pelto_6.jpg',
  barley: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/3840px-Vehn%C3%A4pelto_6.jpg',
  corn: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg',
  maize: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg',
  cotton: 'https://upload.wikimedia.org/wikipedia/commons/6/68/CottonPlant.JPG',
  sugarcane: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sugarcane%20field.jpg',
  soybean: 'https://commons.wikimedia.org/wiki/Special:FilePath/Soybean.USDA.jpg',
  groundnut: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arachis%20hypogaea%20003.JPG',
  peanut: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arachis%20hypogaea%20003.JPG',
  mustard: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mustard%20Field.jpg',
  mango: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mangos_-_single_and_halved.jpg/3840px-Mangos_-_single_and_halved.jpg',
  apple: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
  guava: 'https://commons.wikimedia.org/wiki/Special:FilePath/Guava%20ID.jpg',
  pomegranate: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pomegranate%20fruit%20-%20whole%20and%20piece%20with%20arils.jpg',
  orange: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg',
  lemon: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Lemon.jpg',
  grapes: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Table_grapes_on_white.jpg',
  sunflower: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Sunflower_sky_backdrop.jpg',
  onion: 'https://commons.wikimedia.org/wiki/Special:FilePath/Onions.jpg',
  chili: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chilli%20peppers.jpg',
  chilli: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chilli%20peppers.jpg',
  chickpea: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chickpea%20pods.jpg',
  turmeric: 'https://commons.wikimedia.org/wiki/Special:FilePath/Turmeric%20rhizome.jpg',
  ginger: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ginger%20rhizome.jpg',
  garlic: 'https://commons.wikimedia.org/wiki/Special:FilePath/Garlic%20bulbs.jpg',
  tea: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Tea_plantation_in_Munnar.jpg',
  coffee: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_coffee_beans.jpg',
  coconut: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Coconut_on_tree.jpg'
};

const categoryPhotoUrls = {
  vegetable: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=85',
  cereal: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=85',
  fruit: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1600&q=85',
  pulse: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=85',
  oilseed: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1600&q=85',
  spice: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=85',
  plantation: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=85',
  fallback: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1600&q=85'
};

function normalizeCropName(crop = '') {
  return crop.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getCropHash(value = 'crop') {
  let hash = 0;
  for (const char of value || 'crop') {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  return hash;
}

function getCropVisualKey(crop = '', fallbackKey = 'crop') {
  const normalized = normalizeCropName(crop || fallbackKey);
  return Object.keys(cropVisuals).find((key) => normalized.includes(key)) || '';
}

function getCropPhotoUrl(crop = '', theme) {
  const normalized = normalizeCropName(crop);
  const matchedKey = Object.keys(cropPhotoUrls).find((key) => normalized.includes(key));
  if (matchedKey) return cropPhotoUrls[matchedKey];

  const label = theme?.label?.toLowerCase() || '';
  if (label.includes('vegetable')) return categoryPhotoUrls.vegetable;
  if (label.includes('cereal')) return categoryPhotoUrls.cereal;
  if (label.includes('fruit') || label.includes('orchard')) return categoryPhotoUrls.fruit;
  if (label.includes('pulse') || label.includes('legume')) return categoryPhotoUrls.pulse;
  if (label.includes('oilseed')) return categoryPhotoUrls.oilseed;
  if (label.includes('spice')) return categoryPhotoUrls.spice;
  if (label.includes('plantation')) return categoryPhotoUrls.plantation;
  return categoryPhotoUrls.fallback;
}

function getCropVisual(crop = '', fallbackKey = 'crop') {
  const normalized = normalizeCropName(crop || fallbackKey);
  const matchedKey = getCropVisualKey(normalized, fallbackKey);
  if (matchedKey) return cropVisuals[matchedKey];

  const hash = getCropHash(normalized || fallbackKey) % 360;
  return {
    name: crop || fallbackKey,
    fruit: `hsl(${hash}, 72%, 55%)`,
    leaf: `hsl(${(hash + 92) % 360}, 60%, 34%)`,
    field: `hsl(${(hash + 180) % 360}, 48%, 24%)`
  };
}

function escapeSvgText(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cropMotifSvg(key, visual) {
  const leaf = visual.leaf;
  const fruit = visual.fruit;
  const field = visual.field;

  if (['tomato', 'chili', 'chilli'].includes(key)) {
    return Array.from({ length: 10 }).map((_, index) => {
      const x = 170 + index * 130;
      const y = 520 + (index % 3) * 38;
      return `<g>
        <path d="M${x} 760 C${x - 35} 650 ${x - 22} 575 ${x} ${y}" stroke="${leaf}" stroke-width="18" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x - 34}" cy="${y + 10}" rx="42" ry="18" fill="${leaf}" transform="rotate(-28 ${x - 34} ${y + 10})"/>
        <ellipse cx="${x + 34}" cy="${y - 4}" rx="42" ry="18" fill="${leaf}" transform="rotate(28 ${x + 34} ${y - 4})"/>
        <circle cx="${x}" cy="${y}" r="36" fill="${fruit}"/>
        <path d="M${x - 17} ${y - 34} L${x} ${y - 52} L${x + 17} ${y - 34}" stroke="${leaf}" stroke-width="8" fill="none" stroke-linecap="round"/>
      </g>`;
    }).join('');
  }

  if (key === 'banana') {
    return Array.from({ length: 9 }).map((_, index) => {
      const x = 170 + index * 145;
      const y = 565 + (index % 2) * 34;
      return `<g>
        <path d="M${x} 760 C${x - 22} 660 ${x - 8} 580 ${x + 16} ${y}" stroke="${leaf}" stroke-width="20" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x - 52}" cy="${y - 24}" rx="92" ry="26" fill="${leaf}" transform="rotate(-24 ${x - 52} ${y - 24})"/>
        <ellipse cx="${x + 58}" cy="${y - 18}" rx="92" ry="26" fill="${leaf}" transform="rotate(26 ${x + 58} ${y - 18})"/>
        <path d="M${x - 24} ${y + 12} C${x + 22} ${y + 64} ${x + 100} ${y + 48} ${x + 128} ${y - 8}" stroke="${fruit}" stroke-width="24" fill="none" stroke-linecap="round"/>
        <path d="M${x - 10} ${y - 8} C${x + 36} ${y + 40} ${x + 92} ${y + 24} ${x + 114} ${y - 18}" stroke="#fde68a" stroke-width="8" fill="none" stroke-linecap="round"/>
      </g>`;
    }).join('');
  }

  if (['rice', 'paddy', 'wheat', 'barley', 'sorghum', 'millet'].includes(key)) {
    return Array.from({ length: 28 }).map((_, index) => {
      const x = 70 + index * 56;
      const y = 735 - (index % 5) * 16;
      const grain = ['rice', 'paddy'].includes(key) ? '#dcfce7' : fruit;
      return `<g>
        <path d="M${x} 790 C${x + 18} 700 ${x - 10} 610 ${x + 28} 520" stroke="${leaf}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M${x + 28} 520 C${x + 56} 560 ${x + 44} 618 ${x + 12} ${y}" stroke="${grain}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x + 44}" cy="565" rx="8" ry="18" fill="${grain}" transform="rotate(-25 ${x + 44} 565)"/>
        <ellipse cx="${x + 34}" cy="610" rx="8" ry="18" fill="${grain}" transform="rotate(22 ${x + 34} 610)"/>
      </g>`;
    }).join('');
  }

  if (['corn', 'maize'].includes(key)) {
    return Array.from({ length: 9 }).map((_, index) => {
      const x = 140 + index * 150;
      return `<g>
        <path d="M${x} 790 C${x - 20} 670 ${x - 5} 560 ${x + 10} 455" stroke="${leaf}" stroke-width="20" fill="none" stroke-linecap="round"/>
        <ellipse cx="${x - 45}" cy="620" rx="82" ry="24" fill="${leaf}" transform="rotate(-35 ${x - 45} 620)"/>
        <ellipse cx="${x + 56}" cy="585" rx="82" ry="24" fill="${leaf}" transform="rotate(34 ${x + 56} 585)"/>
        <rect x="${x - 20}" y="500" width="52" height="128" rx="26" fill="${fruit}"/>
        <path d="M${x - 10} 512 H${x + 22} M${x - 10} 542 H${x + 22} M${x - 10} 572 H${x + 22} M${x - 10} 602 H${x + 22}" stroke="#fef3c7" stroke-width="5"/>
      </g>`;
    }).join('');
  }

  if (key === 'cotton') {
    return Array.from({ length: 10 }).map((_, index) => {
      const x = 150 + index * 135;
      const y = 540 + (index % 2) * 42;
      return `<g>
        <path d="M${x} 780 C${x - 25} 690 ${x - 8} 600 ${x} ${y}" stroke="${leaf}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <circle cx="${x - 22}" cy="${y}" r="28" fill="${fruit}"/>
        <circle cx="${x + 20}" cy="${y - 6}" r="30" fill="${fruit}"/>
        <circle cx="${x}" cy="${y - 28}" r="28" fill="${fruit}"/>
        <path d="M${x - 42} ${y + 28} L${x} ${y + 58} L${x + 42} ${y + 28}" stroke="${field}" stroke-width="8" fill="none"/>
      </g>`;
    }).join('');
  }

  if (key === 'sugarcane') {
    return Array.from({ length: 13 }).map((_, index) => {
      const x = 95 + index * 115;
      return `<g>
        <path d="M${x} 800 L${x + 28} 420" stroke="${fruit}" stroke-width="22" stroke-linecap="round"/>
        <path d="M${x + 8} 690 L${x + 36} 690 M${x + 16} 585 L${x + 45} 585 M${x + 23} 485 L${x + 52} 485" stroke="#ecfccb" stroke-width="5"/>
        <path d="M${x + 20} 520 C${x - 50} 500 ${x - 60} 440 ${x - 10} 390" stroke="${leaf}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <path d="M${x + 30} 500 C${x + 95} 470 ${x + 105} 420 ${x + 70} 370" stroke="${leaf}" stroke-width="13" fill="none" stroke-linecap="round"/>
      </g>`;
    }).join('');
  }

  if (['mango', 'apple', 'guava', 'orange', 'lemon', 'pomegranate'].includes(key)) {
    return Array.from({ length: 8 }).map((_, index) => {
      const x = 150 + index * 170;
      const y = 548 + (index % 2) * 32;
      return `<g>
        <path d="M${x} 790 C${x - 10} 700 ${x + 18} 610 ${x} 520" stroke="#78350f" stroke-width="24" fill="none" stroke-linecap="round"/>
        <circle cx="${x}" cy="${y}" r="86" fill="${leaf}"/>
        <circle cx="${x - 38}" cy="${y + 18}" r="26" fill="${fruit}"/>
        <circle cx="${x + 18}" cy="${y - 18}" r="24" fill="${fruit}"/>
        <circle cx="${x + 44}" cy="${y + 24}" r="22" fill="${fruit}"/>
      </g>`;
    }).join('');
  }

  return Array.from({ length: 14 }).map((_, index) => {
    const x = 95 + index * 105;
    const y = 565 + (index % 4) * 25;
    return `<g>
      <path d="M${x} 780 C${x - 26} 685 ${x - 14} 610 ${x} ${y}" stroke="${leaf}" stroke-width="14" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x - 28}" cy="${y + 10}" rx="46" ry="17" fill="${leaf}" transform="rotate(-28 ${x - 28} ${y + 10})"/>
      <ellipse cx="${x + 28}" cy="${y - 6}" rx="46" ry="17" fill="${leaf}" transform="rotate(28 ${x + 28} ${y - 6})"/>
      <circle cx="${x}" cy="${y - 12}" r="24" fill="${fruit}"/>
    </g>`;
  }).join('');
}

function buildCropImageUrl(crop = '', fallbackKey = 'crop') {
  const visual = getCropVisual(crop, fallbackKey);
  const key = getCropVisualKey(crop, fallbackKey);
  const displayName = (crop || visual.name || fallbackKey)
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const safeDisplayName = escapeSvgText(displayName);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${visual.leaf}"/>
          <stop offset="100%" stop-color="${visual.field}"/>
        </linearGradient>
        <linearGradient id="field" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${visual.field}"/>
          <stop offset="100%" stop-color="${visual.leaf}"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sky)"/>
      <circle cx="1280" cy="190" r="120" fill="${visual.fruit}" opacity="0.82"/>
      <path d="M0 610 C260 520 430 680 710 590 C980 505 1190 650 1600 560 L1600 900 L0 900 Z" fill="url(#field)" opacity="0.92"/>
      <g opacity="0.92">${cropMotifSvg(key, visual)}</g>
      <rect x="70" y="70" width="760" height="210" rx="32" fill="rgba(0,0,0,0.28)"/>
      <text x="110" y="158" fill="white" font-family="Arial, sans-serif" font-size="58" font-weight="800">${safeDisplayName}</text>
      <text x="112" y="222" fill="rgba(255,255,255,0.82)" font-family="Arial, sans-serif" font-size="30">verified crop visual for advisory screen</text>
    </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getCropTheme(crop = '') {
  const normalized = normalizeCropName(crop);
  const theme = cropThemes.find((item) => item.keys.some((key) => normalized.includes(key)));
  if (theme) {
    return {
      ...theme,
      image: getCropPhotoUrl(normalized, theme),
      visualFallback: buildCropImageUrl(normalized, theme.keys[0]),
      label: normalized ? `${theme.label} Theme` : theme.label
    };
  }

  const hash = getCropHash(normalized || 'crop') % 360;

  const accent = `hsl(${hash}, 68%, 34%)`;
  const secondary = `hsl(${(hash + 48) % 360}, 72%, 48%)`;
  return {
    keys: [],
    label: normalized ? 'Custom Crop Theme' : 'Smart Crop Advisory',
    image: getCropPhotoUrl(normalized),
    visualFallback: buildCropImageUrl(normalized, 'crop'),
    accent,
    secondary,
    pattern: `radial-gradient(circle at 24% 28%, hsla(${hash}, 72%, 56%, 0.48), transparent 24%), radial-gradient(circle at 76% 48%, hsla(${(hash + 76) % 360}, 72%, 48%, 0.38), transparent 25%)`,
    text: normalized
      ? `The ${crop} background is generated from the crop search, so even catalog-only crops get a unique visual theme.`
      : 'Search any crop to personalize the background, advisory context, and recommendation flow.'
  };
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'detect', label: 'Disease Detection', icon: Microscope },
  { id: 'fertilizer', label: 'Fertilizer', icon: FlaskConical },
  { id: 'chatbot', label: 'Chatbot', icon: Bot },
  { id: 'profile', label: 'Profile', icon: User }
];

const diseaseHistory = [
  { crop: 'Tomato', issue: 'Early Blight', confidence: 94, date: '12 Jun', status: 'Treatment started' },
  { crop: 'Rice', issue: 'Leaf Blast', confidence: 88, date: '10 Jun', status: 'Monitoring' },
  { crop: 'Corn', issue: 'Healthy', confidence: 97, date: '08 Jun', status: 'No action' }
];

function getFarmerWeatherLocation(farmerProfile) {
  const parts = [farmerProfile?.district, farmerProfile?.state]
    .map((part) => String(part || '').trim())
    .filter(Boolean);

  return parts.join(', ') || String(farmerProfile?.village || '').trim() || 'Ludhiana, Punjab';
}

function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('agriSession')) || null;
      if (session) return session;
      const oldUser = JSON.parse(localStorage.getItem('agriUser')) || null;
      if (oldUser) {
        localStorage.setItem('agriAccount', JSON.stringify(oldUser));
      }
      return null;
    } catch {
      return null;
    }
  });
  const [active, setActive] = useState('dashboard');
  const [weather, setWeather] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);

  const weatherLocation = getFarmerWeatherLocation(authUser);

  useEffect(() => {
    fetch(`${API_BASE}/weather?location=${encodeURIComponent(weatherLocation)}`)
      .then((res) => res.json())
      .then(setWeather)
      .catch(() => setWeather(null));
  }, [weatherLocation]);

  const ActivePage = {
    dashboard: Dashboard,
    detect: DiseaseDetection,
    fertilizer: FertilizerAdvisor,
    chatbot: Chatbot,
    profile: Profile
  }[active];

  function handleAuth(user) {
    localStorage.setItem('agriAccount', JSON.stringify(user));
    localStorage.setItem('agriSession', JSON.stringify(user));
    setAuthUser(user);
    setActive('dashboard');
  }

  function logout() {
    localStorage.removeItem('agriSession');
    setAuthUser(null);
    setActive('dashboard');
  }

  if (!authUser) {
    return <AuthPage onAuth={handleAuth} />;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Leaf size={25} /></span>
          <div>
            <strong>AgriAI</strong>
            <small>Smart farm assistant</small>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? 'nav-button active' : 'nav-button'}
                onClick={() => {
                  setActive(item.id);
                  setMobileNav(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-card">
          <ShieldCheck size={22} />
          <strong>{authUser.farmName || 'AI model ready'}</strong>
          <span>{authUser.district || 'Farm profile'} · {authUser.primaryCrop || 'Crop advisory'} · {authUser.farmSize || 'Smart farm'}</span>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setMobileNav(true)} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div>
            <p className="eyebrow">AI Smart Agriculture Assistant</p>
            <h1>{navItems.find((item) => item.id === active)?.label}</h1>
          </div>
          <div className="topbar-actions">
            <span className="weather-pill"><MapPin size={16} /> {weather?.location || 'Farm'}</span>
            <button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>
          </div>
        </header>
        {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
        <ActivePage weather={weather} farmerProfile={authUser} />
      </main>
    </div>
  );
}

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('register');
  const [form, setForm] = useState({
    ownerName: 'Shreya Gupta',
    farmName: 'Shreya Farm',
    phone: '+91 98765 43210',
    email: 'shreya.farm@example.com',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Model Farm Village',
    farmSize: '5.2 acres',
    soilType: 'Loamy soil',
    irrigation: 'Drip + canal support',
    primaryCrop: 'Tomato',
    secondaryCrops: 'Wheat, Rice, Cotton',
    season: 'Kharif 2026',
    password: 'farmer123'
  });
  const [login, setLogin] = useState({ email: 'shreya.farm@example.com', password: 'farmer123' });
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function createAccount(event) {
    event.preventDefault();
    if (!form.ownerName || !form.farmName || !form.email || !form.password) {
      setError('Please complete name, farm name, email, and password.');
      return;
    }
    setError('');
    const account = {
      ...form,
      crops: [form.primaryCrop, ...form.secondaryCrops.split(',').map((crop) => crop.trim()).filter(Boolean)]
    };
    localStorage.setItem('agriAccount', JSON.stringify(account));
    setLogin({ email: account.email, password: account.password });
    setMode('login');
    setError('Account created. Login with your email and password.');
  }

  function loginAccount(event) {
    event.preventDefault();
    const saved = localStorage.getItem('agriAccount');
    if (!saved) {
      setError('No account found. Create a farmer account first.');
      setMode('register');
      return;
    }
    let user;
    try {
      user = JSON.parse(saved);
    } catch {
      setError('Saved account is corrupted. Please create the account again.');
      localStorage.removeItem('agriAccount');
      setMode('register');
      return;
    }
    if (login.email.trim().toLowerCase() !== user.email.trim().toLowerCase() || login.password !== user.password) {
      setError('Email or password is incorrect.');
      return;
    }
    setError('');
    onAuth(user);
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand auth-brand">
          <span className="brand-mark"><Leaf size={25} /></span>
          <div>
            <strong>AgriAI</strong>
            <small>Smart farm assistant</small>
          </div>
        </div>
        <div>
          <span className="tag"><ShieldCheck size={16} /> Farmer account</span>
          <h1>Manage crop health, farm records, and AI advisories from one secure profile.</h1>
          <p>Create a detailed farmer account once, then use the dashboard, disease detector, fertilizer advisor, chatbot, and profile sections with your own farm information.</p>
        </div>
        <div className="auth-metrics">
          <Metric icon={Leaf} label="Crop records" value="Multi" />
          <Metric icon={Droplets} label="Irrigation" value="Smart" />
          <Metric icon={Bot} label="AI support" value="24/7" />
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-tabs">
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Create Account</button>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
        </div>

        {error && <div className={error.includes('created') ? 'form-alert success' : 'form-alert'}>{error}</div>}

        {mode === 'register' ? (
          <form className="auth-form" onSubmit={createAccount}>
            <FormSection title="Farmer Details">
              <label>Owner name<input value={form.ownerName} onChange={(event) => update('ownerName', event.target.value)} /></label>
              <label>Farm name<input value={form.farmName} onChange={(event) => update('farmName', event.target.value)} /></label>
              <label>Phone<input value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
              <label>Email<input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} /></label>
            </FormSection>

            <FormSection title="Location Details">
              <label>State<input value={form.state} onChange={(event) => update('state', event.target.value)} /></label>
              <label>District<input value={form.district} onChange={(event) => update('district', event.target.value)} /></label>
              <label>Village<input value={form.village} onChange={(event) => update('village', event.target.value)} /></label>
              <label>Farm size<input value={form.farmSize} onChange={(event) => update('farmSize', event.target.value)} /></label>
            </FormSection>

            <FormSection title="Crop And Farm Details">
              <label>Primary crop<input value={form.primaryCrop} onChange={(event) => update('primaryCrop', event.target.value)} /></label>
              <label>Other crops<input value={form.secondaryCrops} onChange={(event) => update('secondaryCrops', event.target.value)} /></label>
              <label>Soil type<input value={form.soilType} onChange={(event) => update('soilType', event.target.value)} /></label>
              <label>Irrigation method<input value={form.irrigation} onChange={(event) => update('irrigation', event.target.value)} /></label>
              <label>Season<input value={form.season} onChange={(event) => update('season', event.target.value)} /></label>
              <label>Password<input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label>
            </FormSection>

            <button className="primary-button" type="submit"><User size={18} /> Create Farmer Account</button>
          </form>
        ) : (
          <form className="auth-form compact" onSubmit={loginAccount}>
            <label>Email<input type="email" value={login.email} onChange={(event) => setLogin({ ...login, email: event.target.value })} /></label>
            <label>Password<input type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label>
            <button className="primary-button" type="submit"><ShieldCheck size={18} /> Login</button>
          </form>
        )}
      </section>
    </main>
  );
}

function FormSection({ title, children }) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="form-section-grid">{children}</div>
    </fieldset>
  );
}

function Dashboard({ weather }) {
  const lineData = useMemo(() => ({
    labels: weather?.forecast?.map((item) => item.day) || [],
    datasets: [
      {
        label: 'Rain chance',
        data: weather?.forecast?.map((item) => item.rain) || [],
        borderColor: '#087f5b',
        backgroundColor: 'rgba(8, 127, 91, 0.14)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Humidity',
        data: weather?.forecast?.map((item) => item.humidity) || [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        tension: 0.4
      }
    ]
  }), [weather]);

  const doughnutData = {
    labels: ['Healthy', 'At risk', 'Treating'],
    datasets: [{ data: [64, 22, 14], backgroundColor: ['#0f9f6e', '#f59e0b', '#ef4444'], borderWidth: 0 }]
  };

  return (
    <section className="page-grid">
      <motion.div className="hero-band" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="tag"><Sprout size={16} /> Farm intelligence</span>
          <h2>Detect problems earlier and plan field work with AI-backed recommendations.</h2>
          <p>Upload leaf images, watch weather risk, estimate irrigation, and ask crop questions from one practical dashboard.</p>
        </div>
        <div className="hero-metrics">
          <Metric icon={Gauge} label="Crop health" value="86%" />
          <Metric icon={Droplets} label="Water saved" value="18%" />
          <Metric icon={TrendingUp} label="Yield outlook" value="+9%" />
        </div>
      </motion.div>

      <div className="stat-row">
        <InfoCard icon={CloudSun} title={`${weather?.temperature ?? '--'}°C`} text={`${weather?.condition || 'Loading weather'} · ${weather?.humidity ?? '--'}% humidity`} />
        <InfoCard icon={Droplets} title={`${weather?.soilMoisture ?? '--'}%`} text="Estimated soil moisture" />
        <InfoCard icon={Bell} title={`${weather?.rainfallChance ?? '--'}%`} text="Rainfall probability" />
      </div>

      <div className="content-grid two">
        <Panel title="Weather Risk Forecast">
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
        </Panel>
        <Panel title="Crop Health Mix">
          <div className="chart-short">
            <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } }, cutout: '65%' }} />
          </div>
        </Panel>
      </div>

      <Panel title="Indian Crop Research Centre">
        <div className="research-card">
          <span className="research-icon"><Building2 size={28} /></span>
          <div>
            <strong>{researchCentre.shortName} - {researchCentre.name}</strong>
            <p>{researchCentre.text}</p>
          </div>
          <a className="secondary-button" href={researchCentre.url} target="_blank" rel="noreferrer">
            <ExternalLink size={18} /> Open ICAR
          </a>
        </div>
      </Panel>

      <Panel title="Disease History">
        <div className="table">
          {diseaseHistory.map((row) => (
            <div className="table-row" key={`${row.crop}-${row.date}`}>
              <span>{row.crop}</span>
              <strong>{row.issue}</strong>
              <span>{row.confidence}% confidence</span>
              <span>{row.date}</span>
              <em>{row.status}</em>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function DiseaseDetection() {
  const [crop, setCrop] = useState('Tomato');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = getCropTheme(crop);

  async function analyze() {
    setLoading(true);
    const response = await fetch(`${API_BASE}/disease-detection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop, imageName: file?.name })
    });
    setResult(await response.json());
    setLoading(false);
  }

  return (
    <CropToolShell
      crop={crop}
      theme={theme}
      icon={Microscope}
      title="Crop Disease Detection"
      subtitle="Upload a leaf image and let the AI assistant prepare a crop-aware disease checklist."
    >
      <section className="content-grid two crop-tool-grid">
        <Panel title="Upload Leaf Image">
          <div className="form-stack">
            <CropSearch value={crop} onChange={setCrop} />
            <label className="upload-box">
              <ImageUp size={36} />
              <strong>{file ? file.name : 'Choose a clear leaf photo'}</strong>
              <span>JPG or PNG images work best with good light and visible symptoms.</span>
              <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            </label>
            <button className="primary-button" onClick={analyze} disabled={loading}>
              <Microscope size={18} /> {loading ? 'Analyzing...' : 'Run AI Analysis'}
            </button>
          </div>
        </Panel>
        <Panel title="AI Result">
          {result ? (
            <div className="result-card">
              <span className={`severity ${result.severity.toLowerCase()}`}>{result.severity} risk</span>
              <h2>{result.disease}</h2>
              <p>{result.symptoms}</p>
              <div className="confidence"><span style={{ width: `${result.confidence}%` }} /></div>
              <strong>{result.confidence}% confidence</strong>
              <h3>Treatment recommendations</h3>
              <ul>{result.treatment.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ) : (
            <EmptyState icon={Leaf} title="No analysis yet" text="Upload a crop image and run the AI detector." />
          )}
        </Panel>
      </section>
    </CropToolShell>
  );
}

function FertilizerAdvisor() {
  const [form, setForm] = useState({ crop: 'Tomato', soilPh: 6.5, moisture: 55, acreage: 1 });
  const [fertilizer, setFertilizer] = useState(null);
  const [irrigation, setIrrigation] = useState(null);
  const theme = getCropTheme(form.crop);

  async function submit() {
    const [fertRes, irrRes] = await Promise.all([
      fetch(`${API_BASE}/fertilizer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }),
      fetch(`${API_BASE}/irrigation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    ]);
    setFertilizer(await fertRes.json());
    setIrrigation(await irrRes.json());
  }

  const barData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [{ label: 'kg/ha', data: [fertilizer?.nitrogen || 0, fertilizer?.phosphorus || 0, fertilizer?.potassium || 0], backgroundColor: ['#087f5b', '#2563eb', '#f59e0b'] }]
  };

  return (
    <CropToolShell
      crop={form.crop}
      theme={theme}
      icon={FlaskConical}
      title="Fertilizer And Irrigation Advisor"
      subtitle="Search a crop, enter soil details, and generate nutrition plus watering guidance."
    >
      <section className="content-grid two crop-tool-grid">
        <Panel title="Crop And Soil Inputs">
          <div className="form-stack">
            <CropSearch value={form.crop} onChange={(crop) => setForm({ ...form, crop })} />
            <label>Soil pH<input type="number" step="0.1" value={form.soilPh} onChange={(event) => setForm({ ...form, soilPh: event.target.value })} /></label>
            <label>Soil moisture (%)<input type="number" value={form.moisture} onChange={(event) => setForm({ ...form, moisture: event.target.value })} /></label>
            <label>Farm size (acre)<input type="number" step="0.1" value={form.acreage} onChange={(event) => setForm({ ...form, acreage: event.target.value })} /></label>
            <button className="primary-button" onClick={submit}><FlaskConical size={18} /> Generate Plan</button>
          </div>
        </Panel>
        <Panel title="Recommendation Report">
          {fertilizer && irrigation ? (
            <div className="report">
              <h2>{fertilizer.crop} Plan</h2>
              <p><strong>NPK:</strong> {fertilizer.npk}</p>
              <p>{fertilizer.phAdvice}</p>
              <p><strong>Organic support:</strong> {fertilizer.organic}</p>
              <div className="chart-short"><Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} /></div>
              <h3>Irrigation</h3>
              <p>{irrigation.weeklyMm} mm/week · about {irrigation.estimatedLiters.toLocaleString()} liters</p>
              <p>{irrigation.bestWindow}</p>
            </div>
          ) : (
            <EmptyState icon={FlaskConical} title="Ready to calculate" text="Enter soil and crop details to generate fertilizer and irrigation advice." />
          )}
        </Panel>
      </section>
    </CropToolShell>
  );
}

function CropToolShell({ crop, theme, icon: Icon, title, subtitle, children }) {
  return (
    <section
      className="crop-tool-shell"
      style={{
        '--crop-image': `url("${theme.image}")`,
        '--crop-fallback-image': `url("${theme.visualFallback}")`,
        '--crop-accent': theme.accent,
        '--crop-secondary': theme.secondary,
        '--crop-pattern': theme.pattern
      }}
    >
      <div className="crop-tool-hero">
        <div>
          <span className="tag"><Icon size={16} /> {theme.label}</span>
          <h2>{crop || title}</h2>
          <p>{subtitle}</p>
          <small className="crop-image-note">Real crop photo: {crop || 'general crop'}</small>
        </div>
        <div className="crop-context-card">
          <strong>{crop || 'Search crop'}</strong>
          <span>{theme.text}</span>
        </div>
      </div>
      {children}
    </section>
  );
}

function Chatbot({ farmerProfile }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste. Ask me about disease symptoms, irrigation, fertilizer, pests, or seasonal crop planning.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceStatus, setVoiceStatus] = useState('Use the mic to ask a question. Spoken replies are enabled by default.');
  const recognitionRef = useRef(null);

  function speak(text) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }

  function addAssistantMessage(text) {
    setMessages((current) => [...current, { role: 'assistant', text }]);
  }

  async function requestMicrophoneAccess() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Your browser does not expose microphone permissions to this page.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
  }

  async function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const text = 'Voice input is not supported in this browser. Open the app in Chrome or Edge, or type your question.';
      setVoiceStatus(text);
      addAssistantMessage(text);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setVoiceStatus('Mic stopped. You can click it again to ask another question.');
      return;
    }

    try {
      setVoiceStatus('Requesting microphone permission...');
      await requestMicrophoneAccess();

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
      setListening(true);
      setVoiceStatus('Listening... speak your farming question now.');

      let finalTranscript = '';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim();

        if (transcript) {
          setInput(transcript);
        }

        finalTranscript = Array.from(event.results)
          .filter((result) => result.isFinal)
          .map((result) => result[0]?.transcript || '')
          .join(' ')
          .trim();

        if (finalTranscript) {
          recognition.stop();
          send(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        const reason = event.error === 'not-allowed'
          ? 'Microphone permission was blocked. Allow microphone access in the browser and try again.'
          : event.error === 'no-speech'
            ? 'I did not hear speech. Click the mic and speak a little closer to the microphone.'
            : `Voice input stopped: ${event.error || 'unknown error'}.`;
        setVoiceStatus(reason);
        addAssistantMessage(reason);
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        if (!finalTranscript) {
          setVoiceStatus('Mic is ready. Click it again and ask your question.');
        }
      };

      recognition.start();
    } catch (error) {
      const text = error?.name === 'NotAllowedError'
        ? 'Microphone permission was denied. Click the browser permission icon and allow microphone access.'
        : 'Microphone could not start. Check that a microphone is connected and allowed for this browser.';
      setVoiceStatus(text);
      addAssistantMessage(text);
      setListening(false);
    }
  }

  async function send(promptOverride) {
    const prompt = (promptOverride ?? input).trim();
    if (!prompt || sending) return;

    const nextMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          history: nextMessages.slice(-8),
          farmerProfile
        })
      });

      if (!response.ok) {
        throw new Error(`Chat API returned ${response.status}`);
      }

      const data = await response.json();
      setMessages([...nextMessages, { role: 'assistant', text: data.reply }]);
      setVoiceStatus('Reply ready. Click the mic to ask another question.');
      speak(data.reply);
    } catch {
      const fallback = 'I could not reach the chat service. Please make sure the backend is running on port 8091, then try again.';
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          text: fallback
        }
      ]);
      setVoiceStatus('Chat service error. Type another question or try again after checking the backend.');
      speak(fallback);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat-page">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <button className={listening ? 'voice-button listening' : 'voice-button'} onClick={startListening} aria-label={listening ? 'Stop listening' : 'Ask with microphone'}>
          {listening ? <MicOff size={19} /> : <Mic size={19} />}
        </button>
        <input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder="Ask about leaf spots, pests, irrigation, fertilizer..." />
        <button className={voiceEnabled ? 'voice-button active' : 'voice-button'} onClick={() => setVoiceEnabled(!voiceEnabled)} aria-label="Toggle spoken answers">
          <Volume2 size={19} />
        </button>
        <button className="primary-button" onClick={() => send()} disabled={sending}>
          <Send size={18} /> {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
      <p className={listening ? 'voice-note listening' : 'voice-note'}>{voiceStatus}</p>
    </section>
  );
}

function CropSearch({ value, onChange }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`${API_BASE}/crops?search=${encodeURIComponent(query)}`, {
          signal: controller.signal
        });
        const data = await response.json();
        setResults(data.crops || []);
      } catch {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  function selectCrop(cropName) {
    setQuery(cropName);
    onChange(cropName);
  }

  return (
    <label>
      Crop Search
      <div className="search-field">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(event.target.value);
          }}
          placeholder="Search Indian crops, e.g. cotton, mango, chickpea"
        />
      </div>
      <div className="crop-results">
        {searching && <span className="crop-result muted">Searching crops...</span>}
        {!searching && results.map((crop) => (
          <button type="button" className="crop-result" key={crop.name} onClick={() => selectCrop(crop.name)}>
            <span>{crop.name}</span>
            <small>{crop.category}</small>
          </button>
        ))}
        {!searching && results.length === 0 && (
          <span className="crop-result muted">No exact match. You can still type the crop name manually.</span>
        )}
      </div>
    </label>
  );
}

function Profile({ farmerProfile }) {
  const farmer = {
    name: farmerProfile?.farmName || 'Shreya Farm',
    owner: farmerProfile?.ownerName || 'Shreya Gupta',
    location: [farmerProfile?.village, farmerProfile?.district, farmerProfile?.state].filter(Boolean).join(', ') || 'Ludhiana, Punjab',
    phone: farmerProfile?.phone || '+91 98765 43210',
    email: farmerProfile?.email || 'shreya.farm@example.com',
    farmSize: farmerProfile?.farmSize || '5.2 acres',
    soilType: farmerProfile?.soilType || 'Loamy soil',
    irrigation: farmerProfile?.irrigation || 'Drip + canal support',
    season: farmerProfile?.season || 'Kharif 2026',
    crops: farmerProfile?.crops?.length ? farmerProfile.crops : ['Tomato', 'Wheat', 'Rice', 'Cotton']
  };

  const cropRecords = farmer.crops.slice(0, 5).map((crop, index) => ({
    crop,
    plot: ['Block A', 'North Field', 'Nursery', 'West Strip', 'South Plot'][index] || `Plot ${index + 1}`,
    stage: ['Flowering', 'Grain filling', 'Vegetative', 'Boll formation', 'Monitoring'][index] || 'Monitoring',
    status: ['Disease watch', 'Irrigation due', 'Healthy', 'Pest scouting', 'AI monitoring'][index] || 'AI monitoring',
    area: index === 0 ? farmer.farmSize : `${Math.max(0.4, 1.8 - index * 0.3).toFixed(1)} acres`
  }));

  const activities = [
    'Tomato disease scan completed with 94% confidence',
    'Irrigation plan updated after rainfall alert',
    'Fertilizer report generated for wheat field',
    'ICAR research link opened from dashboard'
  ];

  const reports = [
    { title: 'Crop Health Summary', meta: '4 crops monitored' },
    { title: 'Fertilizer Plan', meta: 'Last updated today' },
    { title: 'Irrigation Schedule', meta: 'Next watering: tomorrow morning' }
  ];

  return (
    <section className="page-grid">
      <Panel title="Farmer Profile">
        <div className="profile-hero">
          <div className="profile-identity">
            <div className="avatar">SG</div>
            <div>
              <span className="tag"><ShieldCheck size={16} /> Verified farmer</span>
              <h2>{farmer.name}</h2>
              <p>{farmer.owner} manages {farmer.farmSize} in {farmer.location}.</p>
            </div>
          </div>
          <div className="profile-stats">
            <Metric icon={Leaf} label="Active crops" value={String(farmer.crops.length)} />
            <Metric icon={Microscope} label="AI scans" value="21" />
            <Metric icon={Bell} label="Alerts" value="4" />
            <Metric icon={TrendingUp} label="Yield outlook" value="+9%" />
          </div>
        </div>
      </Panel>

      <div className="content-grid two">
        <Panel title="Farm Details">
          <div className="detail-grid">
            <Detail icon={MapPin} label="Location" value={farmer.location} />
            <Detail icon={Phone} label="Phone" value={farmer.phone} />
            <Detail icon={Mail} label="Email" value={farmer.email} />
            <Detail icon={Ruler} label="Farm size" value={farmer.farmSize} />
            <Detail icon={Sprout} label="Soil type" value={farmer.soilType} />
            <Detail icon={Droplets} label="Irrigation" value={farmer.irrigation} />
            <Detail icon={CalendarDays} label="Season" value={farmer.season} />
            <Detail icon={Wallet} label="Plan" value="Smart advisory" />
          </div>
        </Panel>

        <Panel title="Recent Activity">
          <div className="timeline">
            {activities.map((item) => (
              <div className="timeline-item" key={item}>
                <span />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Crop Records">
        <div className="profile-table">
          <div className="profile-table-head">
            <span>Crop</span>
            <span>Plot</span>
            <span>Stage</span>
            <span>Status</span>
            <span>Area</span>
          </div>
          {cropRecords.map((record) => (
            <div className="profile-table-row" key={`${record.crop}-${record.plot}`}>
              <strong>{record.crop}</strong>
              <span>{record.plot}</span>
              <span>{record.stage}</span>
              <em>{record.status}</em>
              <span>{record.area}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Saved Reports">
        <div className="report-list">
          {reports.map((report) => (
            <div className="report-card" key={report.title}>
              <Activity size={20} />
              <strong>{report.title}</strong>
              <span>{report.meta}</span>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="detail-item">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function InfoCard({ icon: Icon, title, text }) {
  return (
    <div className="info-card">
      <Icon size={22} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="empty">
      <Icon size={34} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export default App;
