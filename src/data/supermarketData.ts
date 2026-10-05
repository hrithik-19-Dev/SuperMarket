export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  unitPriceLabel: string;
}

export interface SupermarketProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: 'Fresh Produce' | 'Staples & Grains' | 'Dairy & Ghee' | 'Artisan Bakery';
  origin: string;
  image: string;
  availability: 'In Stock' | 'Harvest Batch' | 'Freshly Baked';
  rating: string;
  reviewsCount: number;
  description: string;
  storageAdvice: string;
  nutritionalHighlights: string;
  farmerOrBatchNote: string;
  variants: ProductVariant[];
}

export interface StoreHub {
  id: string;
  city: string;
  neighborhood: string;
  pincode: string;
  deliverySlot: string;
  storeAddress: string;
}

export const HERO_PRODUCE_IMAGE = '/src/assets/images/supermarket_hero_produce_1791195683955.jpg';

export const STORE_HUBS: StoreHub[] = [
  {
    id: 'bom-worli',
    city: 'Mumbai',
    neighborhood: 'Worli Seaface Hypermarket',
    pincode: '400018',
    deliverySlot: 'Today, 45 Mins Express',
    storeAddress: 'Plot 42, Annie Besant Road, Worli, Mumbai 400018',
  },
  {
    id: 'blr-indiranagar',
    city: 'Bengaluru',
    neighborhood: 'Indiranagar 100ft Road Hub',
    pincode: '560038',
    deliverySlot: 'Today, 60 Mins Express',
    storeAddress: '712, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
  },
  {
    id: 'del-vasant',
    city: 'New Delhi',
    neighborhood: 'Vasant Kunj Signature Store',
    pincode: '110070',
    deliverySlot: 'Today, 60 Mins Express',
    storeAddress: 'Sector C, Pocket 6, Vasant Kunj, New Delhi 110070',
  },
  {
    id: 'hyd-jubilee',
    city: 'Hyderabad',
    neighborhood: 'Jubilee Hills Road No. 36',
    pincode: '500033',
    deliverySlot: 'Today, 50 Mins Express',
    storeAddress: ' Alcazar Plaza, Road No. 36, Jubilee Hills, Hyderabad 500033',
  },
];

export const SUPERMARKET_PRODUCTS: SupermarketProduct[] = [
  {
    id: 'ratnagiri-alphonso-mangoes',
    sku: 'RSB-PRD-104',
    name: 'GI-Tagged Ratnagiri Alphonso Mangoes',
    brand: 'Reliance Fresh Select',
    category: 'Fresh Produce',
    origin: 'Ratnagiri Orchards, Maharashtra',
    image: '/src/assets/images/product_alphonso_mangoes_1791195704140.jpg',
    availability: 'Harvest Batch',
    rating: '4.9',
    reviewsCount: 418,
    description:
      'Hand-harvested carbide-free Devgad and Ratnagiri Alphonso mangoes, naturally ripened in hay-lined wooden crates for rich saffron-gold pulp and floral aroma.',
    storageAdvice: 'Store at room temperature (22°C–26°C) away from direct sunlight; chill 1 hour before slicing.',
    nutritionalHighlights: '100% Carbide-Free · Rich in Vitamin A & C · Brix Sweetness > 19°',
    farmerOrBatchNote: 'Sourced directly from 42 registered Konkan coastal orchard collectives within 18 hours of picking.',
    variants: [
      {
        id: 'box-6pc',
        label: '6 Pieces (1.5 kg Box)',
        price: 549,
        mrp: 680,
        unitPriceLabel: '₹91.50 / pc',
      },
      {
        id: 'crate-12pc',
        label: '12 Pieces (3.0 kg Wooden Crate)',
        price: 1049,
        mrp: 1350,
        unitPriceLabel: '₹87.40 / pc',
      },
    ],
  },
  {
    id: 'himalayan-aged-basmati',
    sku: 'RSB-STP-209',
    name: '24-Month Aged Himalayan Basmati Rice',
    brand: 'Good Life Reserve',
    category: 'Staples & Grains',
    origin: 'Dehradun Foothills, Uttarakhand',
    image: '/src/assets/images/product_basmati_rice_1791195718045.jpg',
    availability: 'In Stock',
    rating: '4.8',
    reviewsCount: 892,
    description:
      'Extra-long slender snow-fed basmati grains matured for 24 months in temperature-controlled silos to ensure non-sticky, 2.4x elongation upon cooking.',
    storageAdvice: 'Keep in an airtight container in a cool, dry pantry with a bay leaf or dried neem.',
    nutritionalHighlights: 'Low Glycemic Index · Zero Broken Grains · Aged 24 Months',
    farmerOrBatchNote: 'Single-origin winter harvest milled in moisture-sealed batches for restaurant-grade biryani aroma.',
    variants: [
      {
        id: 'pack-1kg',
        label: '1 kg Cotton Pouch',
        price: 168,
        mrp: 210,
        unitPriceLabel: '₹168.00 / kg',
      },
      {
        id: 'sack-5kg',
        label: '5 kg Burlap Pantry Sack',
        price: 785,
        mrp: 995,
        unitPriceLabel: '₹157.00 / kg',
      },
    ],
  },
  {
    id: 'a2-gir-cow-bilona-ghee',
    sku: 'RSB-DRY-312',
    name: 'A2 Gir Cow Cultured Bilona Ghee',
    brand: 'Reliance Dairy Life Reserve',
    category: 'Dairy & Ghee',
    origin: 'Kathiawar Pastures, Gujarat',
    image: '/src/assets/images/product_organic_ghee_1791195731597.jpg',
    availability: 'In Stock',
    rating: '4.9',
    reviewsCount: 634,
    description:
      'Slow-simmered in small batches over firewood from cultured whole A2 curd churned using the traditional two-way wooden bilona method for granular texture.',
    storageAdvice: 'Requires no refrigeration; always use a clean, dry spoon to preserve natural aroma.',
    nutritionalHighlights: 'A2 Beta-Casein Protein · Rich in Butyric Acid & Omega-3 · Zero Preservatives',
    farmerOrBatchNote: '28 liters of grass-fed Gir cow milk are cultured to craft every single 1-liter glass jar.',
    variants: [
      {
        id: 'jar-500ml',
        label: '500 ml Glass Apothecary Jar',
        price: 645,
        mrp: 790,
        unitPriceLabel: '₹129.00 / 100ml',
      },
      {
        id: 'jar-1000ml',
        label: '1 Litre Family Glass Jar',
        price: 1220,
        mrp: 1520,
        unitPriceLabel: '₹122.00 / 100ml',
      },
    ],
  },
  {
    id: 'artisan-country-sourdough',
    sku: 'RSB-BKR-405',
    name: '36-Hour Fermented Country Sourdough & Croissant Pack',
    brand: 'Smart Bazaar Bakehouse',
    category: 'Artisan Bakery',
    origin: 'In-Store Stone Deck Oven',
    image: '/src/assets/images/product_artisan_bakery_1791195744981.jpg',
    availability: 'Freshly Baked',
    rating: '4.8',
    reviewsCount: 312,
    description:
      'Unbleached stone-ground wheat country boule naturally leavened with our 14-year-old wild starter and baked on hearth stones alongside Normandy-style butter croissants.',
    storageAdvice: 'Keep cut-side down on a wooden board for 48 hours, or slice and freeze for up to 3 weeks.',
    nutritionalHighlights: '36-Hour Wild Fermentation · Zero Commercial Yeast · Unbleached Stone-Milled Flour',
    farmerOrBatchNote: 'Baked in three daily hearth cycles (7:00 AM, 12:30 PM, and 5:00 PM) at every flagship store.',
    variants: [
      {
        id: 'boule-500g',
        label: '500g Sourdough Boule Only',
        price: 185,
        mrp: 230,
        unitPriceLabel: '₹37.00 / 100g',
      },
      {
        id: 'combo-pack',
        label: '500g Boule + 2 Butter Croissants',
        price: 295,
        mrp: 380,
        unitPriceLabel: 'Save ₹85 Combo',
      },
    ],
  },
  {
    id: 'hydroponic-baby-spinach-avocado',
    sku: 'RSB-PRD-118',
    name: 'Hydroponic Baby Spinach, Vine Tomatoes & Hass Crate',
    brand: 'Reliance Fresh Select',
    category: 'Fresh Produce',
    origin: 'Talegaon Climate-Controlled Farms',
    image: '/src/assets/images/supermarket_hero_produce_1791195683955.jpg',
    availability: 'Harvest Batch',
    rating: '4.9',
    reviewsCount: 520,
    description:
      'Pesticide-residue-free hydroponic baby spinach leaves paired with sweet vine-ripened heirloom cherry tomatoes and creamy ready-to-slice Hass avocados.',
    storageAdvice: 'Keep refrigerated at 4°C in the crisper drawer; wash gently in cold water just before serving.',
    nutritionalHighlights: 'Zero Pesticide Residue · Ozone-Washed · Harvest-to-Door in 14 Hours',
    farmerOrBatchNote: 'Grown using 85% less water in precision nutrient-film greenhouses outside Pune and Bengaluru.',
    variants: [
      {
        id: 'salad-box',
        label: '850g Salad & Avocado Trio Box',
        price: 329,
        mrp: 420,
        unitPriceLabel: '₹38.70 / 100g',
      },
      {
        id: 'weekly-crate',
        label: '2.2 kg Family Harvest Crate',
        price: 749,
        mrp: 960,
        unitPriceLabel: '₹34.00 / 100g',
      },
    ],
  },
  {
    id: 'cold-pressed-mustard-groundnut',
    sku: 'RSB-STP-240',
    name: 'Wood-Pressed Kachi Ghani Groundnut & Mustard Pantry Pair',
    brand: 'Good Life Reserve',
    category: 'Staples & Grains',
    origin: 'junagadh & Alwar Cooperative Mills',
    image: '/src/assets/images/product_organic_ghee_1791195731597.jpg',
    availability: 'In Stock',
    rating: '4.7',
    reviewsCount: 447,
    description:
      'First-press unrefined cooking oils extracted at ambient temperatures below 40°C in traditional wooden lakdi ghanis to retain natural antioxidants and nutty aroma.',
    storageAdvice: 'Store in a cool cupboard away from stove heat; natural sediment at the bottom is a sign of purity.',
    nutritionalHighlights: 'Cold Extracted < 40°C · Zero Hexane Solvents · Naturally Rich in MUFA',
    farmerOrBatchNote: 'Cold-filtered through triple-layer unbleached muslin cloth without chemical bleaching or deodorizing.',
    variants: [
      {
        id: 'bottle-1l',
        label: '1 Litre Cold-Pressed Groundnut',
        price: 275,
        mrp: 340,
        unitPriceLabel: '₹275.00 / L',
      },
      {
        id: 'twin-2l',
        label: '2 Litre Pantry Value Pack',
        price: 519,
        mrp: 660,
        unitPriceLabel: '₹259.50 / L',
      },
    ],
  },
];
