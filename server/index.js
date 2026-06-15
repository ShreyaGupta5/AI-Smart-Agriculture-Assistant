import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '8mb' }));

const diseaseLibrary = [
  {
    crop: 'Tomato',
    disease: 'Early Blight',
    confidence: 94,
    severity: 'High',
    symptoms: 'Brown concentric spots on older leaves with yellowing around infected areas.',
    treatment: [
      'Remove infected lower leaves and keep foliage dry.',
      'Apply copper-based fungicide or chlorothalonil as advised locally.',
      'Rotate tomato crops away from infected soil for at least two seasons.'
    ]
  },
  {
    crop: 'Potato',
    disease: 'Late Blight',
    confidence: 91,
    severity: 'High',
    symptoms: 'Water-soaked lesions that spread quickly during cool humid weather.',
    treatment: [
      'Destroy badly infected plants to slow spread.',
      'Use certified seed tubers and avoid overhead irrigation.',
      'Apply protective fungicide before expected wet weather.'
    ]
  },
  {
    crop: 'Rice',
    disease: 'Leaf Blast',
    confidence: 88,
    severity: 'Medium',
    symptoms: 'Diamond-shaped lesions with gray centers and brown borders.',
    treatment: [
      'Avoid excess nitrogen application.',
      'Maintain balanced water levels in the paddy.',
      'Use resistant varieties and recommended fungicide when infection expands.'
    ]
  },
  {
    crop: 'Wheat',
    disease: 'Leaf Rust',
    confidence: 86,
    severity: 'Medium',
    symptoms: 'Orange-brown pustules scattered across leaf surfaces.',
    treatment: [
      'Plant resistant varieties in the next cycle.',
      'Scout nearby fields for spreading rust pressure.',
      'Use triazole fungicide at early infection where economically justified.'
    ]
  },
  {
    crop: 'Corn',
    disease: 'Northern Corn Leaf Blight',
    confidence: 84,
    severity: 'Medium',
    symptoms: 'Long cigar-shaped gray-green lesions on leaves.',
    treatment: [
      'Improve residue management after harvest.',
      'Use hybrid varieties with resistance.',
      'Apply fungicide near tasseling if disease reaches upper leaves.'
    ]
  },
  {
    crop: 'Cotton',
    disease: 'Bacterial Blight',
    confidence: 82,
    severity: 'Medium',
    symptoms: 'Angular leaf spots and dark lesions that may spread during humid weather.',
    treatment: [
      'Use disease-free seed and resistant varieties where available.',
      'Avoid overhead irrigation during humid periods.',
      'Remove infected crop debris after harvest.'
    ]
  },
  {
    crop: 'Sugarcane',
    disease: 'Red Rot',
    confidence: 85,
    severity: 'High',
    symptoms: 'Reddening inside cane stalks with white patches and drying leaves.',
    treatment: [
      'Use healthy seed cane from disease-free fields.',
      'Remove and destroy infected clumps.',
      'Rotate with non-host crops in affected fields.'
    ]
  },
  {
    crop: 'Soybean',
    disease: 'Rust',
    confidence: 83,
    severity: 'Medium',
    symptoms: 'Small brown pustules on leaf undersides with yellowing leaves.',
    treatment: [
      'Scout lower canopy during humid weather.',
      'Use resistant varieties and timely fungicide where needed.',
      'Avoid dense planting that traps moisture.'
    ]
  },
  {
    crop: 'Groundnut',
    disease: 'Tikka Leaf Spot',
    confidence: 84,
    severity: 'Medium',
    symptoms: 'Circular brown to black spots on leaves, often with yellow halos.',
    treatment: [
      'Remove infected residues and rotate crops.',
      'Improve field airflow and avoid prolonged leaf wetness.',
      'Apply recommended fungicide when spots spread rapidly.'
    ]
  },
  {
    crop: 'Mustard',
    disease: 'Alternaria Blight',
    confidence: 81,
    severity: 'Medium',
    symptoms: 'Dark circular lesions on leaves, stems, and pods.',
    treatment: [
      'Use clean seed and avoid late sowing where disease pressure is high.',
      'Remove infected debris after harvest.',
      'Apply fungicide at early symptom appearance if needed.'
    ]
  },
  {
    crop: 'Onion',
    disease: 'Purple Blotch',
    confidence: 80,
    severity: 'Medium',
    symptoms: 'Purple sunken spots on leaves that expand in humid conditions.',
    treatment: [
      'Avoid overhead irrigation and improve spacing.',
      'Remove severely infected leaves.',
      'Use protective fungicide during wet weather.'
    ]
  },
  {
    crop: 'Chili',
    disease: 'Anthracnose',
    confidence: 86,
    severity: 'High',
    symptoms: 'Sunken dark fruit spots and leaf lesions, especially in wet weather.',
    treatment: [
      'Remove infected fruits from the field.',
      'Use disease-free seed and crop rotation.',
      'Apply recommended fungicide before heavy disease spread.'
    ]
  },
  {
    crop: 'Banana',
    disease: 'Sigatoka Leaf Spot',
    confidence: 87,
    severity: 'Medium',
    symptoms: 'Streaks and dark spots on banana leaves, reducing leaf area.',
    treatment: [
      'Remove badly infected leaves.',
      'Maintain good drainage and plant spacing.',
      'Use resistant cultivars and fungicide rotation where required.'
    ]
  },
  {
    crop: 'Mango',
    disease: 'Powdery Mildew',
    confidence: 82,
    severity: 'Medium',
    symptoms: 'White powdery growth on flowers, young leaves, and fruitlets.',
    treatment: [
      'Prune to improve airflow in the canopy.',
      'Avoid excess nitrogen during flowering.',
      'Apply sulfur or recommended fungicide at early infection.'
    ]
  },
  {
    crop: 'Apple',
    disease: 'Apple Scab',
    confidence: 84,
    severity: 'Medium',
    symptoms: 'Olive-brown leaf and fruit spots that become corky.',
    treatment: [
      'Remove fallen leaves to reduce spores.',
      'Prune for better airflow and faster drying.',
      'Apply preventive fungicide before wet infection periods.'
    ]
  }
];

const cropWaterNeeds = {
  Tomato: { base: 28, soil: 'Loamy', note: 'Keep soil evenly moist during flowering and fruiting.' },
  Potato: { base: 24, soil: 'Sandy loam', note: 'Avoid water stress during tuber initiation.' },
  Rice: { base: 45, soil: 'Clay', note: 'Maintain shallow standing water where appropriate.' },
  Wheat: { base: 18, soil: 'Well-drained loam', note: 'Prioritize crown root and grain filling stages.' },
  Corn: { base: 32, soil: 'Loam', note: 'Peak water need occurs from tasseling through grain fill.' },
  Cotton: { base: 30, soil: 'Black cotton soil', note: 'Avoid stress during flowering and boll formation.' },
  Sugarcane: { base: 48, soil: 'Deep loam', note: 'Keep consistent moisture during grand growth stage.' },
  Soybean: { base: 25, soil: 'Well-drained loam', note: 'Avoid waterlogging during pod setting.' },
  Groundnut: { base: 22, soil: 'Sandy loam', note: 'Maintain light moisture during pegging and pod development.' },
  Mustard: { base: 16, soil: 'Loam', note: 'Avoid excess irrigation during flowering.' },
  Onion: { base: 20, soil: 'Sandy loam', note: 'Use frequent light irrigation for bulb development.' },
  Chili: { base: 24, soil: 'Well-drained loam', note: 'Avoid both water stress and standing water.' },
  Banana: { base: 52, soil: 'Rich loam', note: 'Maintain steady soil moisture and mulch heavily.' },
  Mango: { base: 18, soil: 'Well-drained soil', note: 'Reduce irrigation before flowering, then support fruit development.' },
  Apple: { base: 20, soil: 'Well-drained loam', note: 'Irrigate during fruit sizing and dry spells.' }
};

const fertilizerPlans = {
  Tomato: { n: 80, p: 45, k: 60, organic: 'Compost plus calcium support to reduce blossom-end rot.' },
  Potato: { n: 100, p: 60, k: 120, organic: 'Well-rotted farmyard manure before planting.' },
  Rice: { n: 120, p: 50, k: 50, organic: 'Green manure or compost before puddling.' },
  Wheat: { n: 110, p: 55, k: 40, organic: 'Compost and zinc support in deficient soils.' },
  Corn: { n: 140, p: 65, k: 55, organic: 'Compost with split nitrogen applications.' },
  Cotton: { n: 90, p: 45, k: 45, organic: 'Farmyard manure plus micronutrient checks for boron and zinc.' },
  Sugarcane: { n: 180, p: 80, k: 90, organic: 'Press mud compost or farmyard manure before planting.' },
  Soybean: { n: 25, p: 60, k: 40, organic: 'Rhizobium seed treatment and compost for soil structure.' },
  Groundnut: { n: 20, p: 50, k: 40, organic: 'Gypsum and compost support during pegging.' },
  Mustard: { n: 80, p: 40, k: 30, organic: 'Sulfur support and compost in low organic-matter soils.' },
  Onion: { n: 100, p: 50, k: 80, organic: 'Compost before transplanting and split nitrogen doses.' },
  Chili: { n: 100, p: 50, k: 60, organic: 'Compost plus calcium and micronutrient support.' },
  Banana: { n: 200, p: 60, k: 250, organic: 'Heavy compost, mulch, and potassium-rich nutrition.' },
  Mango: { n: 75, p: 40, k: 75, organic: 'Well-rotted manure around the drip line after harvest.' },
  Apple: { n: 70, p: 35, k: 70, organic: 'Compost and calcium support for fruit quality.' }
};

const cropCatalog = [
  'Tomato', 'Potato', 'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Soybean', 'Groundnut',
  'Mustard', 'Onion', 'Chili', 'Banana', 'Mango', 'Apple', 'Pearl Millet', 'Sorghum', 'Barley',
  'Chickpea', 'Pigeon Pea', 'Green Gram', 'Black Gram', 'Lentil', 'Pea', 'Sesame', 'Sunflower',
  'Safflower', 'Castor', 'Coconut', 'Arecanut', 'Tea', 'Coffee', 'Rubber', 'Jute', 'Tobacco',
  'Turmeric', 'Ginger', 'Garlic', 'Coriander', 'Cumin', 'Fenugreek', 'Cardamom', 'Black Pepper',
  'Brinjal', 'Okra', 'Cabbage', 'Cauliflower', 'Carrot', 'Radish', 'Cucumber', 'Pumpkin',
  'Bottle Gourd', 'Bitter Gourd', 'Spinach', 'Methi', 'Watermelon', 'Muskmelon', 'Papaya',
  'Guava', 'Pomegranate', 'Orange', 'Lemon', 'Grapes', 'Litchi', 'Pineapple', 'Cashew'
].map((name) => ({
  name,
  supported: Boolean(cropWaterNeeds[name] && fertilizerPlans[name]),
  category: cropWaterNeeds[name] ? 'Recommendation ready' : 'Search catalog'
}));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AI Smart Agriculture Assistant API' });
});

app.get('/api/weather', (req, res) => {
  const location = req.query.location || 'Ludhiana';
  res.json({
    location,
    condition: 'Partly cloudy',
    temperature: 31,
    humidity: 68,
    wind: 11,
    rainfallChance: 42,
    soilMoisture: 57,
    alerts: [
      'Light rainfall is possible in the evening.',
      'Humidity is favorable for fungal disease scouting.'
    ],
    forecast: [
      { day: 'Today', temp: 31, rain: 42, humidity: 68 },
      { day: 'Tue', temp: 33, rain: 28, humidity: 62 },
      { day: 'Wed', temp: 30, rain: 55, humidity: 72 },
      { day: 'Thu', temp: 32, rain: 35, humidity: 64 },
      { day: 'Fri', temp: 34, rain: 18, humidity: 58 }
    ]
  });
});

app.get('/api/crops', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const crops = cropCatalog
    .filter((crop) => !search || crop.name.toLowerCase().includes(search))
    .sort((a, b) => Number(b.supported) - Number(a.supported) || a.name.localeCompare(b.name))
    .slice(0, 12);

  res.json({
    search,
    crops,
    total: crops.length
  });
});

app.post('/api/disease-detection', (req, res) => {
  const crop = req.body.crop || 'Tomato';
  const match = diseaseLibrary.find((item) => item.crop === crop) || {
    crop,
    disease: 'General Crop Health Review',
    confidence: 72,
    severity: 'Medium',
    symptoms: 'No crop-specific disease model is available yet, so this result uses a general crop health checklist.',
    treatment: [
      'Upload a clear image and compare symptoms with local extension guidance.',
      'Check for leaf spots, wilting, pests, nutrient deficiency, and water stress.',
      'Consult the nearest agricultural research or extension centre for crop-specific diagnosis.'
    ]
  };
  res.json({
    ...match,
    imageReceived: Boolean(req.body.imageName || req.body.imagePreview),
    prevention: [
      'Scout the crop twice per week during humid conditions.',
      'Improve spacing and airflow to reduce leaf wetness.',
      'Use clean tools and remove crop residue after harvest.'
    ]
  });
});

app.post('/api/fertilizer', (req, res) => {
  const crop = req.body.crop || 'Tomato';
  const soilPh = Number(req.body.soilPh || 6.5);
  const plan = fertilizerPlans[crop] || {
    n: 60,
    p: 40,
    k: 40,
    organic: 'Use soil-test-based fertilizer advice and add well-decomposed compost to improve soil health.'
  };
  const phAdvice =
    soilPh < 6
      ? 'Soil is acidic; consider lime after local soil testing.'
      : soilPh > 7.5
        ? 'Soil is alkaline; add organic matter and monitor micronutrients.'
        : 'Soil pH is suitable for nutrient uptake.';

  res.json({
    crop,
    npk: `${plan.n}:${plan.p}:${plan.k} kg/ha`,
    nitrogen: plan.n,
    phosphorus: plan.p,
    potassium: plan.k,
    organic: plan.organic,
    phAdvice,
    schedule: [
      'Apply full phosphorus and potassium before sowing/transplanting.',
      'Split nitrogen into 2-3 applications based on crop stage.',
      'Irrigate after fertilizer application if rain is not expected.'
    ]
  });
});

app.post('/api/irrigation', (req, res) => {
  const crop = req.body.crop || 'Tomato';
  const acreage = Number(req.body.acreage || 1);
  const moisture = Number(req.body.moisture || 55);
  const profile = cropWaterNeeds[crop] || {
    base: 24,
    soil: 'Field-specific soil',
    note: 'Use soil moisture, crop stage, and local rainfall to adjust irrigation.'
  };
  const adjustment = moisture < 40 ? 1.25 : moisture > 70 ? 0.65 : 1;
  const weeklyMm = Math.round(profile.base * adjustment);
  const liters = Math.round(weeklyMm * acreage * 4046.86);

  res.json({
    crop,
    weeklyMm,
    estimatedLiters: liters,
    bestWindow: 'Early morning between 5:30 AM and 8:00 AM',
    soilType: profile.soil,
    recommendation: profile.note,
    savingTips: [
      'Use drip irrigation or furrow irrigation to reduce evaporation.',
      'Mulch around plants where practical.',
      'Skip irrigation if more than 20 mm rainfall occurs within 24 hours.'
    ]
  });
});

app.post('/api/chat', (req, res) => {
  const message = String(req.body.message || '').toLowerCase();
  let reply = 'Share the crop, growth stage, soil condition, and visible symptoms so I can suggest a more precise action plan.';

  if (message.includes('pest')) {
    reply = 'Start with field scouting: check leaf undersides and new growth. Use pheromone traps where available, remove heavily infested parts, and choose targeted bio-pesticides before broad-spectrum sprays.';
  } else if (message.includes('water') || message.includes('irrigation')) {
    reply = 'Irrigate early in the morning, avoid wetting leaves when disease risk is high, and use soil moisture as the main trigger instead of a fixed calendar.';
  } else if (message.includes('fertilizer') || message.includes('npk')) {
    reply = 'Use soil-test-based NPK, split nitrogen applications, and add organic matter to improve nutrient retention. Tell me your crop and soil pH for a focused recommendation.';
  } else if (message.includes('disease') || message.includes('leaf')) {
    reply = 'Take a clear photo of the affected leaf, isolate badly infected plants, avoid overhead irrigation, and compare symptoms such as spots, wilting, yellowing, or powdery growth.';
  }

  res.json({ reply });
});

app.listen(port, () => {
  console.log(`Agriculture assistant API running at http://127.0.0.1:${port}`);
});
