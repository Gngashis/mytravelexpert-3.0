export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  region: 'Darjeeling' | 'Sikkim' | 'Bhutan' | 'Dooars' | 'Kalimpong & Silk Route';
  locationLabel: string;
  destinationTag: string;
  country: 'India' | 'Bhutan';
  days: number;
  nights: number;
  durationText: string;
  pax: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  rating: number;
  originalPrice: number;
  price: number;
  discountPercent: number;
  featured: boolean;
  bestSeller: boolean;
  image: string;
  gallery: string[];
  overview: string;
  highlights: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals: string;
    stay: string;
  }[];
}

export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  country: 'India' | 'Bhutan';
  region: string;
  rating: number;
  packagesCount: number;
  distanceFromBagdogra: string;
  driveTime: string;
  elevation: string;
  mapCoords: { x: number; y: number }; // percentage on custom Himalayan SVG map
  image: string;
  description: string;
}

export interface LuxuryHotel {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  pricePerNight: number;
  rating: number;
  image: string;
  features: string[];
  description: string;
}

export interface TaxiCab {
  id: string;
  name: string;
  brand: string;
  year: number;
  location: string;
  seats: number;
  bags: number;
  ac: boolean;
  baseFare: number;
  hourlyRate: number;
  image: string;
  features: string[];
}

export interface UniquenessItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  points: string[];
  image: string;
  secondaryImage: string;
  layoutVariant: 'right-wide' | 'left-wide' | 'right-tall' | 'left-tall';
}

export interface BlogStory {
  id: string;
  slug: string;
  title: string;
  category: 'Destination Guides' | 'Travel Tips' | 'Trekking';
  date: string;
  readTime: string;
  author: string;
  reads: number;
  excerpt: string;
  image: string;
  content: string[];
}

export interface FaqItem {
  id: string;
  index: string;
  question: string;
  answer: string;
}

export const COMPANY_INFO = {
  brandName: 'MY TRAVEL EXPERT',
  shortName: 'mytravelexpert',
  tagline: 'Unforgettable Himalayan Journeys',
  heroHeading: 'Discover Darjeeling & Sikkim Travel',
  heroDescription:
    'Explore breathtaking mountains, peaceful valleys, tea gardens and unforgettable experiences with MyTravelExpert. Plan your perfect Darjeeling, Sikkim & Bhutan holiday with trusted local travel experts.',
  phone: '+91 8001247778',
  phoneRaw: '+918001247778',
  whatsappUrl: 'https://wa.me/918001247778?text=Hello!%20I%20want%20to%20explore%20bespoke%20travel%20packages.',
  email: 'infomytravelexpert4306@gmail.com',
  address: 'Bagdogra Bhujiapani, M.E.S. Colony, P.O. & P.S. – Bagdogra, Darjeeling, West Bengal - 734014',
  shortAddress: 'Bagdogra Bhujiapani, M.E.S. Colony, Darjeeling - 734014',
  operatingHours: 'Mon–Sat: 8:00 AM – 8:00 PM · Sunday: Closed',
  socials: {
    facebook: 'https://www.facebook.com/profile.php?id=61587508877978',
    instagram: 'https://www.instagram.com/mytravelexpert.in/',
    whatsapp: 'https://wa.me/918001247778'
  },
  stats: [
    { value: '12+', label: 'Curated Himalayan Destinations across India & Bhutan' },
    { value: '16+', label: 'Handpicked Tour Packages with Verified Local Guides' },
    { value: '13+', label: 'Mountain Cabs, Luxury 4x4 SUVs & Touring Bikes Ready' },
    { value: '6+', label: 'Premier Himalayan Resorts & Boutique Viewpoint Stays' }
  ]
};

export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'darjeeling',
    slug: 'darjeeling-queen-of-the-himalayas',
    name: 'Darjeeling',
    subtitle: 'Queen of the Himalayas',
    country: 'India',
    region: 'West Bengal',
    rating: 4.9,
    packagesCount: 5,
    distanceFromBagdogra: '68 km',
    driveTime: '2 hr 45 min',
    elevation: '2,042 m',
    mapCoords: { x: 34, y: 64 },
    image: '/assets/images/darjeeling.jpg',
    description:
      'World-renowned emerald tea estates, the UNESCO Darjeeling Himalayan Railway Toy Train, colonial heritage, and golden Kanchenjunga sunrises from Tiger Hill.'
  },
  {
    id: 'sikkim',
    slug: 'gangtok-nathula-lachung-lachen-pelling-zuluk',
    name: 'Sikkim',
    subtitle: 'The Himalayan Paradise',
    country: 'India',
    region: 'Gangtok & East Sikkim',
    rating: 4.9,
    packagesCount: 6,
    distanceFromBagdogra: '124 km',
    driveTime: '4 hr 15 min',
    elevation: '1,650 m – 4,310 m',
    mapCoords: { x: 52, y: 42 },
    image: '/assets/images/sikkim.jpg',
    description:
      'Vibrant Gangtok promenades, glacial Tsomgo Lake, historic Nathula Pass, ancient Buddhist monasteries, and pristine alpine valleys.'
  },
  {
    id: 'bhutan',
    slug: 'thimphu-paro-punakha',
    name: 'Bhutan',
    subtitle: 'The Last Himalayan Kingdom',
    country: 'Bhutan',
    region: 'Phuentsholing · Thimphu · Paro',
    rating: 4.9,
    packagesCount: 3,
    distanceFromBagdogra: '165 km to Phuentsholing',
    driveTime: '3 hr 50 min',
    elevation: '2,200 m – 3,120 m',
    mapCoords: { x: 82, y: 52 },
    image: '/assets/images/bhutan.jpg',
    description:
      'Majestic fortresses (Dzongs), peaceful valleys, Buddha Dordenma, Punakha Suspension Bridge, and the cliffside Tiger’s Nest Monastery in Paro.'
  },
  {
    id: 'kurseong',
    slug: 'darjeeling-kurseong',
    name: 'Kurseong',
    subtitle: 'Where the Hills Meet the Clouds',
    country: 'India',
    region: 'Darjeeling Hills',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '42 km',
    driveTime: '1 hr 35 min',
    elevation: '1,482 m',
    mapCoords: { x: 31, y: 74 },
    image: '/assets/images/tea_tasting.jpg',
    description:
      'The Land of White Orchids featuring Eagle’s Crag viewpoints, Makaibari & Castleton tea estates, misty pine forests, and tranquil colonial charm.'
  },
  {
    id: 'zuluk',
    slug: 'zuluk-silk-route-advanture-amp-himalayan-views',
    name: 'Zuluk',
    subtitle: 'Silk Route Adventure & Himalayan Views',
    country: 'India',
    region: 'East Sikkim Old Silk Route',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '145 km',
    driveTime: '4 hr 50 min',
    elevation: '2,865 m – 3,413 m',
    mapCoords: { x: 64, y: 48 },
    image: '/assets/images/silkroute.jpg',
    description:
      'Iconic 32-hairpin Thambi View Point loop on the historic Old Silk Route, Kupup Elephant Lake, Nathang Valley, and sweeping eastern Kanchenjunga panoramas.'
  },
  {
    id: 'dooars',
    slug: 'dooars-the-gateway-to-wildlife',
    name: 'Dooars',
    subtitle: 'The Gateway to Wildlife',
    country: 'India',
    region: 'North Bengal Foothills',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '72 km',
    driveTime: '1 hr 50 min',
    elevation: '180 m – 650 m',
    mapCoords: { x: 60, y: 80 },
    image: '/assets/images/dooars.jpg',
    description:
      'Lush sub-Himalayan floodplains, Gorumara & Jaldapara wildlife sanctuaries, river valleys of Murti and Jayanti, and sprawling tea gardens.'
  },
  {
    id: 'lachen',
    slug: 'lachen-a-hidden-gem-of-sikkim',
    name: 'Lachen',
    subtitle: 'A Hidden Gem of Sikkim',
    country: 'India',
    region: 'North Sikkim',
    rating: 4.9,
    packagesCount: 2,
    distanceFromBagdogra: '230 km',
    driveTime: '7 hr 30 min',
    elevation: '2,750 m – 5,430 m',
    mapCoords: { x: 48, y: 18 },
    image: '/assets/images/sikkim.jpg',
    description:
      'High-altitude mountain village and basecamp to the sacred turquoise waters of Gurudongmar Lake (17,800 ft) and Chopta Valley.'
  },
  {
    id: 'kalimpong',
    slug: 'kalimpong-the-orchid-paradise',
    name: 'Kalimpong',
    subtitle: 'The Orchid Paradise',
    country: 'India',
    region: 'West Bengal Hills',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '75 km',
    driveTime: '2 hr 30 min',
    elevation: '1,250 m',
    mapCoords: { x: 46, y: 62 },
    image: '/assets/images/gangtok_ropeway.jpg',
    description:
      'Panoramic Deolo Hill ridge, Durpin Dara monastery views over the Teesta River confluence, rare Himalayan orchid nurseries, and heritage bungalows.'
  },
  {
    id: 'ravangla',
    slug: 'ravangla-land-of-peace-spirituality',
    name: 'Ravangla',
    subtitle: 'Land of Peace & Spirituality',
    country: 'India',
    region: 'South Sikkim',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '120 km',
    driveTime: '4 hr 00 min',
    elevation: '2,100 m',
    mapCoords: { x: 41, y: 46 },
    image: '/assets/images/monastery.jpg',
    description:
      'Home to the monumental 130-foot Tathagata Tsal Buddha Park framed by snow-clad Maenam and Kabru peaks in serene South Sikkim.'
  },
  {
    id: 'mirik',
    slug: 'mirik-a-perfect-mountain-getaway',
    name: 'Mirik',
    subtitle: 'A Perfect Mountain Getaway',
    country: 'India',
    region: 'Darjeeling District',
    rating: 4.8,
    packagesCount: 2,
    distanceFromBagdogra: '49 km',
    driveTime: '1 hr 45 min',
    elevation: '1,495 m',
    mapCoords: { x: 22, y: 70 },
    image: '/assets/images/toy_train.jpg',
    description:
      'Tranquil Sumendu Lake spanned by an arching footbridge, ringed by Dhupi pine forests, orange orchards, and Indo-Nepal Pashupati border viewpoints.'
  },
  {
    id: 'pelling',
    slug: 'pelling-the-kanchenjunga-viewpoint',
    name: 'Pelling',
    subtitle: 'The Kanchenjunga Viewpoint',
    country: 'India',
    region: 'West Sikkim',
    rating: 4.9,
    packagesCount: 4,
    distanceFromBagdogra: '136 km',
    driveTime: '4 hr 40 min',
    elevation: '2,150 m',
    mapCoords: { x: 32, y: 38 },
    image: '/assets/images/pelling.jpg',
    description:
      'Closest dramatic vantage point to Mount Kanchenjunga, Pemayangtse Monastery, Skywalk at Chenrezig, Rabdentse ruins, and Khecheopalri sacred lake.'
  },
  {
    id: 'lachung',
    slug: 'lachung-gateway-to-the-valley-of-flowers',
    name: 'Lachung',
    subtitle: 'Gateway to the Valley of Flowers',
    country: 'India',
    region: 'North Sikkim',
    rating: 4.9,
    packagesCount: 3,
    distanceFromBagdogra: '225 km',
    driveTime: '7 hr 15 min',
    elevation: '2,700 m – 4,660 m',
    mapCoords: { x: 58, y: 22 },
    image: '/assets/images/sikkim.jpg',
    description:
      'Picturesque Tibetan-Sikkimese riverside village leading to Yumthang Valley of Rhododendrons and the snowfields of Zero Point (Yumesamdong).'
  }
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 'pkg-dooars-3n4d',
    slug: 'dooars-tour-package-3n-4d',
    title: 'DOOARS TOUR PACKAGE – 3N/4D',
    region: 'Dooars',
    locationLabel: 'Siliguri · Lataguri · Jaldapara',
    destinationTag: 'Dooars - The Gateway to Wildlife',
    country: 'India',
    days: 4,
    nights: 3,
    durationText: '3 Nights / 4 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 11000,
    price: 9500,
    discountPercent: 14,
    featured: true,
    bestSeller: true,
    image: '/assets/images/dooars.jpg',
    gallery: [
      '/assets/images/dooars.jpg',
      '/assets/images/dooars.jpg',
      '/assets/images/gangtok_ropeway.jpg'
    ],
    overview:
      'Explore the lush emerald forests, river valleys, tea gardens, and wildlife sanctuaries of North Bengal on this curated 3 Nights / 4 Days Dooars expedition.',
    highlights: [
      'Gorumara National Park Jeep Safari & Watchtowers',
      'Murti Riverfront, Samsing, Suntalekhola & Rocky Island',
      'Jhalong, Bindu Indo-Bhutan Dam & Seven Points Excursion',
      'Private AC SUV Transfers from Bagdogra (IXB) / NJP'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at NJP / Bagdogra (IXB) – Transfer to Lataguri (Dooars)',
        description:
          'Meet our representative at Bagdogra Airport or NJP Station and drive through Gajoldoba Teesta Barrage and lush sal forests to Lataguri. Evening leisure walk by the forest edge.',
        meals: 'Dinner',
        stay: 'Deluxe Forest Resort, Lataguri'
      },
      {
        day: 2,
        title: 'Gorumara Jungle Safari & Samsing – Suntalekhola – Murti Excursion',
        description:
          'Early morning jeep safari inside Gorumara National Park to spot one-horned rhinos, bison, and peacocks. Post breakfast visit Samsing tea estates, Suntalekhola hanging bridge, Rocky Island, and Murti River.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Forest Resort, Lataguri'
      },
      {
        day: 3,
        title: 'Jhalong, Bindu & Chapramari Wildlife Viewpoint',
        description:
          'Full-day scenic excursion along the Jaldhaka River to Jhalong hydro project and Bindu near the Bhutan border, followed by evening tribal cultural showcase.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Forest Resort, Lataguri'
      },
      {
        day: 4,
        title: 'Morning Tea Garden Walk & Departure Transfer to IXB / NJP',
        description:
          'After breakfast, check out and drive back to Bagdogra Airport / NJP Railway Station via Coronation Bridge with unforgettable memories of the Dooars.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-darjeeling-4n5d',
    slug: 'darjeeling-4n-5d',
    title: 'DARJEELING 4N-5D',
    region: 'Darjeeling',
    locationLabel: 'Kalimpong · Darjeeling · Kurseong',
    destinationTag: 'Kurseong – Where the Hills Meet the Clouds',
    country: 'India',
    days: 5,
    nights: 4,
    durationText: '4 Nights / 5 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 18000,
    price: 14500,
    discountPercent: 19,
    featured: true,
    bestSeller: true,
    image: '/assets/images/darjeeling.jpg',
    gallery: [
      '/assets/images/darjeeling.jpg',
      '/assets/images/darjeeling.jpg',
      '/assets/images/tea_tasting.jpg'
    ],
    overview:
      'A quintessential 4 Nights / 5 Days Himalayan heritage tour blending Kalimpong orchid viewpoints, Darjeeling’s iconic Tiger Hill sunrise and Toy Train, and misty Kurseong tea gardens.',
    highlights: [
      'Himalayan Sunrise over Mount Kanchenjunga at Tiger Hill',
      'Panoramic Views from Deolo Hill & Durpin Dara in Kalimpong',
      'UNESCO Darjeeling Toy Train Experience & Batasia Loop',
      'Explore Emerald Tea Gardens, Peace Pagoda & Chowrasta Mall'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at NJP/IXB – Scenic Transfer to Kalimpong',
        description:
          'Arrive at NJP Railway Station or Bagdogra Airport (IXB) and drive along the Teesta River gorge to Kalimpong. Evening walk around Kalimpong heritage market.',
        meals: 'Breakfast',
        stay: 'Standard / Deluxe Room, Kalimpong'
      },
      {
        day: 2,
        title: 'Kalimpong Sightseeing – Transfer to Darjeeling',
        description:
          'Visit Deolo Hill, Durpin Dara Hill, Zang Dhok Palri Phodang Monastery, and Pine View Cactus Nursery. Afternoon drive through Peshok Tea Garden road to Darjeeling.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 3,
        title: 'Darjeeling Full-Day Heritage Sightseeing',
        description:
          'Early dawn excursion to Tiger Hill for sunrise over Kanchenjunga, Ghoom Monastery, and Batasia Loop. After breakfast visit Himalayan Mountaineering Institute, Padmaja Naidu Zoological Park, Tenzing Rock, Japanese Peace Pagoda, and Tea Estate.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 4,
        title: 'Darjeeling to Kurseong & Mirik Excursion',
        description:
          'Explore Eagle’s Crag viewpoint, Dow Hill, and Makaibari Tea Estate in Kurseong along with Mirik’s tranquil Sumendu Lake and pine forests.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling / Kurseong'
      },
      {
        day: 5,
        title: 'Departure Transfer to Bagdogra Airport (IXB) / NJP',
        description:
          'After breakfast, check out and proceed down the scenic hill highway to Bagdogra Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-6n7d',
    slug: 'gangtok-lachung-lachen',
    title: 'SIKKIM 6N-7D (Gangtok-Lachung-Lachen)',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Lachen · Gurudongmar · Lachung · Yumthang',
    destinationTag: 'Lachen – A Hidden Gem of Sikkim',
    country: 'India',
    days: 6,
    nights: 6,
    durationText: '6 Nights / 7 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 28000,
    price: 22000,
    discountPercent: 21,
    featured: true,
    bestSeller: true,
    image: '/assets/images/sikkim.jpg',
    gallery: [
      '/assets/images/sikkim.jpg',
      '/assets/images/sikkim.jpg',
      '/assets/images/sikkim.jpg'
    ],
    overview:
      'Our flagship North & East Sikkim expedition covering Gangtok, Tsomgo Lake, Nathula Pass, Lachen, sacred Gurudongmar Lake (17,800 ft), Lachung, and Yumthang Valley of Flowers.',
    highlights: [
      'Excursion to Sacred Gurudongmar Lake (17,800 ft) from Lachen',
      'Yumthang Valley of Flowers & High-Altitude Zero Point',
      'Tsomgo Glacial Lake, Baba Mandir & Nathula Pass Excursion',
      'Gangtok Sightseeing: Tashi View Point, Banjhakri Falls & MG Marg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at NJP/IXB – Transfer to Gangtok',
        description:
          'Meet our representative at Bagdogra Airport or NJP Station and drive along the Teesta River valley to Gangtok. Evening stroll at MG Marg promenade.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Gangtok – Tsomgo Lake, Baba Mandir & Nathula Pass',
        description:
          'Full-day high-altitude excursion to glacial Tsomgo Lake (12,400 ft), Baba Harbhajan Singh Mandir, and optional Nathula Pass on the Indo-China border.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok to Lachen via Seven Sisters Waterfalls & Singhik',
        description:
          'Scenic North Sikkim drive along mountain waterfalls, Chungthang confluence, and alpine forests to the high-altitude village of Lachen.',
        meals: 'Breakfast, Lunch & Dinner',
        stay: 'Mountain Lodge, Lachen'
      },
      {
        day: 4,
        title: 'Lachen – Gurudongmar Lake Excursion – Transfer to Lachung',
        description:
          'Early dawn drive through Thangu and Chopta Valley to breathtaking Gurudongmar Lake. Return to Lachen for lunch and transfer to Lachung village.',
        meals: 'Breakfast, Lunch & Dinner',
        stay: 'Premium Mountain Resort, Lachung'
      },
      {
        day: 5,
        title: 'Lachung – Yumthang Valley & Zero Point – Return to Gangtok',
        description:
          'Morning excursion to Yumthang Valley (Valley of Flowers) and hot springs, with optional visit to snow-clad Zero Point before returning to Gangtok.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 6,
        title: 'Gangtok Monasteries, Ropeway & Local Sightseeing',
        description:
          'Visit Tashi View Point, Enchey Monastery, Do Drul Chorten, Namgyal Institute of Tibetology, Directorate of Handicrafts, and Banjhakri Falls.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 7,
        title: 'Gangtok to Bagdogra Airport (IXB) / NJP Departure',
        description:
          'After breakfast, check out and drive back to IXB Airport or NJP Station for your onward journey.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-bhutan-5n6d',
    slug: 'bhutan-phuentsholing-thimphu-paro-5n-6d',
    title: 'Bhutan (Phuentsholing –Thimphu–Paro) 5N/6D',
    region: 'Bhutan',
    locationLabel: 'Phuentsholing · Thimphu · Paro',
    destinationTag: 'Bhutan - The Last Himalayan Kingdom',
    country: 'Bhutan',
    days: 6,
    nights: 5,
    durationText: '5 Nights / 6 Days',
    pax: 6,
    difficulty: 'Hard',
    rating: 4.8,
    originalPrice: 32500,
    price: 27500,
    discountPercent: 15,
    featured: true,
    bestSeller: true,
    image: '/assets/images/bhutan.jpg',
    gallery: [
      '/assets/images/bhutan.jpg',
      '/assets/images/bhutan.jpg',
      '/assets/images/bhutan.jpg'
    ],
    overview:
      'Experience the magical beauty of Bhutan on a memorable 5 Nights & 6 Days journey covering 1 Night in Phuentsholing, 2 Nights in Thimphu, and 2 Nights in Paro with full permit assistance.',
    highlights: [
      'Iconic Hike to Tiger’s Nest Monastery (Paro Taktsang)',
      'Thimphu: Buddha Dordenma, Tashichho Dzong & Memorial Chorten',
      'Paro Rinpung Dzong, National Museum (Ta Dzong) & Kyichu Lhakhang',
      'Seamless IXB/NJP Pickup & Bhutan Immigration Permit Assistance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pickup from IXB/NJP – Scenic Drive to Phuentsholing',
        description:
          'Meet our representative at Bagdogra Airport (IXB) or NJP and drive through lush Dooars tea gardens to Phuentsholing, the gateway border town of Bhutan.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Phuentsholing'
      },
      {
        day: 2,
        title: 'Immigration Permits & Phuentsholing to Thimphu Transfer',
        description:
          'Complete entry permit formalities and ascend the scenic mountain highway past Chukha Dam and waterfalls to Bhutan’s capital, Thimphu.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Thimphu'
      },
      {
        day: 3,
        title: 'Thimphu Cultural & Valley Sightseeing',
        description:
          'Visit the towering golden Buddha Dordenma Statue, National Memorial Chorten, Tashichho Dzong fortress, Motithang Takin Preserve, and Simply Bhutan.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Thimphu'
      },
      {
        day: 4,
        title: 'Thimphu to Paro via Chuzom Confluence & Rinpung Dzong',
        description:
          'Drive to Paro valley, stopping at Tamchog Lhakhang iron chain bridge, Ta Dzong National Museum, Paro Rinpung Dzong, and ancient Kyichu Lhakhang.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Resort, Paro'
      },
      {
        day: 5,
        title: 'Paro Tiger’s Nest Monastery (Taktsang) Trek & Hot Stone Bath',
        description:
          'Embark on the unforgettable forest trail hike to Taktsang Palphug (Tiger’s Nest Monastery) perched 900m above Paro Valley. Evening leisure in Paro town.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Resort, Paro'
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing – Departure at IXB / NJP',
        description:
          'Early breakfast and scenic return drive via Phuentsholing border to Bagdogra Airport (IXB) or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-darjeeling-zuluk-4n5d',
    slug: 'sikkim-darjeeling-via-zuluk-4n-5d',
    title: 'SIKKIM-DARJEELING(via Zuluk) 4N-5D',
    region: 'Kalimpong & Silk Route',
    locationLabel: 'Zuluk · Nathang · Gangtok · Darjeeling',
    destinationTag: 'Zuluk – Silk Route Adventure & Himalayan Views',
    country: 'India',
    days: 5,
    nights: 4,
    durationText: '4 Nights / 5 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 21000,
    price: 17000,
    discountPercent: 19,
    featured: false,
    bestSeller: true,
    image: '/assets/images/silkroute.jpg',
    gallery: [
      '/assets/images/silkroute.jpg',
      '/assets/images/silkroute.jpg',
      '/assets/images/darjeeling.jpg'
    ],
    overview:
      'Traverse the legendary Old Silk Route through Zuluk’s 32 hairpin bends, Thambi View Point, Kupup Lake, and combine it with classic Darjeeling views.',
    highlights: [
      '32-Hairpin Loop at Thambi View Point (11,200 ft) on Old Silk Route',
      'Kupup Elephant Lake, Old Baba Mandir & Tukla Valley',
      'Aritar Lampokhari Lake & Mankhim Viewpoint',
      'Darjeeling Mall Road, Batasia Loop & Tea Gardens'
    ],
    itinerary: [
      {
        day: 1,
        title: 'NJP/IXB to Sillery Gaon / Aritar (Silk Route Foothills)',
        description: 'Pickup from IXB/NJP and drive via Rongli permit checkpost to Aritar / Sillery Gaon amidst pine forests.',
        meals: 'Breakfast & Dinner',
        stay: 'Heritage Mountain Homestay'
      },
      {
        day: 2,
        title: 'Aritar to Zuluk via Lingtam & Kuekhola Falls',
        description: 'Ascend the historic Silk Route to Zuluk with panoramic views of Eastern Himalayas.',
        meals: 'Breakfast & Dinner',
        stay: 'Alpine Lodge, Zuluk'
      },
      {
        day: 3,
        title: 'Zuluk – Thambi View Point – Kupup Lake – Transfer to Darjeeling',
        description: 'Witness sunrise at Thambi View Point over the 32 hairpin bends, visit Nathang Valley and Kupup Lake, then drive to Darjeeling.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 4,
        title: 'Darjeeling Tiger Hill Sunrise & Heritage Sightseeing',
        description: 'Early morning Tiger Hill sunrise, Ghoom Monastery, Batasia Loop, Peace Pagoda, HMI, and Tea Estates.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 5,
        title: 'Darjeeling to IXB / NJP Departure via Mirik',
        description: 'Scenic return drive to Bagdogra Airport or NJP Railway Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-darjeeling-pelling-zuluk-5n6d',
    slug: 'darjeeling-5n-6d-darjeeling-pelling-zuluk',
    title: 'DARJEELING 5N-6D(Darjeeling-Pelling-Zuluk)',
    region: 'Darjeeling',
    locationLabel: 'Darjeeling · Pelling · Zuluk',
    destinationTag: 'Darjeeling - Queen of the Himalayas',
    country: 'India',
    days: 6,
    nights: 5,
    durationText: '5 Nights / 6 Days',
    pax: 6,
    difficulty: 'Moderate',
    rating: 4.8,
    originalPrice: 21000,
    price: 19000,
    discountPercent: 10,
    featured: false,
    bestSeller: true,
    image: '/assets/images/pelling.jpg',
    gallery: ['/assets/images/pelling.jpg', '/assets/images/pelling.jpg'],
    overview:
      'A grand tri-circuit combining Darjeeling tea heritage, Pelling’s Skywalk and Kanchenjunga viewpoints, and the thrilling Zuluk Silk Route.',
    highlights: [
      'Darjeeling Tiger Hill Sunrise & Toy Train Batasia Loop',
      'Pelling Glass Skywalk, Chenrezig Statue & Pemayangtse Monastery',
      'Khecheopalri Sacred Wishing Lake & Rimbi Waterfalls',
      'Zuluk Thambi View Point & Silk Route Hairpin Loops'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at IXB/NJP – Transfer to Darjeeling',
        description: 'Scenic uphill drive through Kurseong tea gardens to Darjeeling. Evening at Chowrasta Mall.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 2,
        title: 'Darjeeling Full-Day Sightseeing',
        description: 'Tiger Hill sunrise, Ghoom Monastery, Batasia Loop, Zoological Park, HMI, and Happy Valley Tea Estate.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 3,
        title: 'Darjeeling to Pelling Transfer & Skywalk',
        description: 'Cross the Teesta and Rangeet rivers into West Sikkim to Pelling. Visit Pemayangtse Monastery and Pelling Skywalk.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique View Hotel, Pelling'
      },
      {
        day: 4,
        title: 'Pelling to Ravangla Buddha Park & Zuluk',
        description: 'Visit Khecheopalri Lake and Ravangla Buddha Park before ascending to East Sikkim’s Silk Route at Zuluk.',
        meals: 'Breakfast & Dinner',
        stay: 'Silk Route Lodge, Zuluk'
      },
      {
        day: 5,
        title: 'Zuluk Sunrise – Kupup Lake – Kalimpong',
        description: 'Explore Thambi View Point, Nathang Valley, and Kupup Lake before descending to Kalimpong.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Kalimpong'
      },
      {
        day: 6,
        title: 'Departure Transfer to IXB / NJP',
        description: 'Morning visit to Deolo Hill and transfer to Bagdogra Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-darjeeling-kalimpong-4n5d',
    slug: 'kalimpong-darjeeling-mirik',
    title: 'DARJEELING(via Kalimpong) 4N-5D',
    region: 'Kalimpong & Silk Route',
    locationLabel: 'Kalimpong · Darjeeling · Mirik',
    destinationTag: 'Kalimpong - The Orchid Paradise',
    country: 'India',
    days: 5,
    nights: 4,
    durationText: '4 Nights / 5 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 15500,
    price: 12500,
    discountPercent: 19,
    featured: true,
    bestSeller: false,
    image: '/assets/images/tea_tasting.jpg',
    gallery: ['/assets/images/tea_tasting.jpg', '/assets/images/gangtok_ropeway.jpg'],
    overview:
      'Discover the serene orchid nurseries and monasteries of Kalimpong paired with Darjeeling’s mountain vistas and Mirik Lake.',
    highlights: [
      'Kalimpong Deolo Hill, Durpin Monastery & Pine View Cactus Nursery',
      'Peshok Tea Estate & Lovers Meet Confluence Viewpoint',
      'Darjeeling Tiger Hill Sunrise & Heritage Sightseeing',
      'Mirik Sumendu Lake, Pine Forest & Gopaldhara Tea Estate'
    ],
    itinerary: [
      {
        day: 1,
        title: 'NJP/IXB Pickup – Transfer to Kalimpong',
        description: 'Scenic drive along the Teesta River to Kalimpong (1,250m). Check in and evening leisure.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Kalimpong'
      },
      {
        day: 2,
        title: 'Kalimpong Sightseeing – Transfer to Darjeeling',
        description: 'Visit Deolo Hill, Durpin Dara, Dr. Graham’s Homes, and orchid nurseries, then drive to Darjeeling.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 3,
        title: 'Darjeeling Tiger Hill & 7-Point Sightseeing',
        description: 'Sunrise over Kanchenjunga at Tiger Hill, Ghoom Monastery, Batasia Loop, Peace Pagoda, HMI, and Ropeway.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 4,
        title: 'Lepchajagat, Simana Viewpoint & Pashupati Excursion',
        description: 'Day excursion through pine forests of Lepchajagat and Nepal border market.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 5,
        title: 'Darjeeling to IXB/NJP via Mirik Lake',
        description: 'Stop at Gopaldhara Tea Estate and Mirik Sumendu Lake on the way to IXB Airport / NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-bhutan-paro-thimphu-4n5d',
    slug: 'paro-tigers-nest-trekking-tour',
    title: 'BHUTAN (PARO-THIMPU)4N-5D',
    region: 'Bhutan',
    locationLabel: 'Thimphu · Paro · Tiger’s Nest',
    destinationTag: 'Bhutan - The Last Himalayan Kingdom',
    country: 'Bhutan',
    days: 5,
    nights: 4,
    durationText: '4 Nights / 5 Days',
    pax: 6,
    difficulty: 'Moderate',
    rating: 4.8,
    originalPrice: 25000,
    price: 20000,
    discountPercent: 20,
    featured: true,
    bestSeller: false,
    image: '/assets/images/bhutan.jpg',
    gallery: ['/assets/images/bhutan.jpg', '/assets/images/bhutan.jpg'],
    overview:
      'Focused 4 Nights / 5 Days cultural & trekking tour of Bhutan’s Paro and Thimphu valleys culminating at the cliffside Tiger’s Nest Monastery.',
    highlights: [
      'Guided Hike to Paro Taktsang (Tiger’s Nest Monastery)',
      'Thimphu Buddha Dordenma & Tashichho Dzong',
      'Chele La Pass (13,084 ft) Panoramic Himalayan Views',
      'Traditional Bhutanese Architecture & Cultural Immersion'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at Paro / Phuentsholing – Transfer to Thimphu',
        description: 'Welcome by our Bhutan guide and scenic drive along the Paro and Wangchu rivers to Thimphu.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Thimphu'
      },
      {
        day: 2,
        title: 'Thimphu Heritage & Punakha / Dochula Pass Viewpoint',
        description: 'Visit Buddha Dordenma, Memorial Chorten, Folk Heritage Museum, and Tashichho Dzong.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Thimphu'
      },
      {
        day: 3,
        title: 'Thimphu to Paro Sightseeing',
        description: 'Explore National Museum (Ta Dzong), Rinpung Dzong, and Kyichu Lhakhang in Paro Valley.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Resort, Paro'
      },
      {
        day: 4,
        title: 'Tiger’s Nest Monastery Trek',
        description: 'Full-day guided trek to the sacred cliffside Taktsang Monastery and evening cultural walk.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Resort, Paro'
      },
      {
        day: 5,
        title: 'Departure from Paro / Phuentsholing to IXB',
        description: 'Morning transfer for your onward journey with lifelong Bhutan memories.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-bhutan-3n4d',
    slug: 'bhutan-3n-4d-oct',
    title: 'BHUTAN 3N-4D OCT',
    region: 'Bhutan',
    locationLabel: 'Phuentsholing · Thimphu · Paro',
    destinationTag: 'Bhutan - The Last Himalayan Kingdom',
    country: 'Bhutan',
    days: 4,
    nights: 3,
    durationText: '3 Nights / 4 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 20000,
    price: 15000,
    discountPercent: 25,
    featured: true,
    bestSeller: true,
    image: '/assets/images/bhutan.jpg',
    gallery: ['/assets/images/bhutan.jpg', '/assets/images/bhutan.jpg'],
    overview:
      'A compact 3 Nights / 4 Days Bhutan getaway ideal for long weekends, covering Thimphu and Paro’s most iconic landmarks.',
    highlights: [
      '25% Special Seasonal Offer for Short Bhutan Escapes',
      'Thimphu Buddha Point, Simply Bhutan & Tashichho Dzong',
      'Paro Valley Viewpoints, Rinpung Dzong & Riverside Walk',
      'Private AC Transfers & Fast-Track Border Assistance'
    ],
    itinerary: [
      {
        day: 1,
        title: 'IXB/NJP to Phuentsholing & Thimphu Ascent',
        description: 'Early pickup and border permit processing, followed by scenic drive to Thimphu.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Thimphu'
      },
      {
        day: 2,
        title: 'Thimphu Sightseeing & Transfer to Paro',
        description: 'Explore Buddha Dordenma, Memorial Chorten, and drive to picturesque Paro Valley.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Paro'
      },
      {
        day: 3,
        title: 'Paro Sightseeing & Chele La Pass / Taktsang Base',
        description: 'Visit Paro Dzong, Ta Dzong Museum, Kyichu Lhakhang, and Taktsang viewpoint.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Paro / Phuentsholing'
      },
      {
        day: 4,
        title: 'Return Transfer to Bagdogra (IXB) / NJP',
        description: 'Scenic drive back through the Dooars tea corridor to IXB/NJP.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-darjeeling-4n5d',
    slug: 'sikkim-darjeeling-4n-5d',
    title: 'SIKKIM-DARJEELING 4N-5D',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Tsomgo · Darjeeling',
    destinationTag: 'Sikkim - The Himalayan Paradise',
    country: 'India',
    days: 5,
    nights: 4,
    durationText: '4 Nights / 5 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 18000,
    price: 15000,
    discountPercent: 17,
    featured: false,
    bestSeller: true,
    image: '/assets/images/gangtok_ropeway.jpg',
    gallery: ['/assets/images/gangtok_ropeway.jpg', '/assets/images/sikkim.jpg'],
    overview:
      'Combine the best of East Sikkim (Gangtok & Tsomgo Lake) and the Queen of the Hills (Darjeeling) in a seamless 4 Nights / 5 Days itinerary.',
    highlights: [
      '2 Nights Gangtok + 2 Nights Darjeeling Twin-Hill Classic',
      'Tsomgo Glacial Lake & Baba Mandir Excursion',
      'Tiger Hill Kanchenjunga Sunrise & Batasia Loop',
      'Private Point-to-Point Luxury SUV / Cab Transfers'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at IXB/NJP – Transfer to Gangtok',
        description: 'Drive along the emerald Teesta River to Gangtok. Evening stroll on MG Marg.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Tsomgo Lake & Baba Mandir Excursion',
        description: 'Ascend to 12,400 ft Tsomgo Lake and Baba Mandir with optional Nathula Pass.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok Local Sightseeing – Transfer to Darjeeling',
        description: 'Morning visit to Tashi Viewpoint and Rumtek/Enchey Monastery, then scenic drive to Darjeeling.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 4,
        title: 'Darjeeling Tiger Hill Sunrise & Heritage Tour',
        description: 'Dawn Tiger Hill sunrise, Ghoom Monastery, Batasia Loop, Zoo, HMI, and Tea Garden.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 5,
        title: 'Darjeeling to IXB / NJP Departure',
        description: 'After breakfast, transfer to Bagdogra Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-darjeeling-tiger-hill-3n4d',
    slug: 'darjeeling-tiger-hill-sunrise-3n-4d',
    title: 'DARJEELING (TIGER HILL SUNRISE)3N-4D',
    region: 'Darjeeling',
    locationLabel: 'Darjeeling · Tiger Hill · Mirik',
    destinationTag: 'Darjeeling - Queen of the Himalayas',
    country: 'India',
    days: 4,
    nights: 3,
    durationText: '3 Nights / 4 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 12000,
    price: 10000,
    discountPercent: 17,
    featured: true,
    bestSeller: true,
    image: '/assets/images/darjeeling.jpg',
    gallery: ['/assets/images/darjeeling.jpg', '/assets/images/darjeeling.jpg'],
    overview:
      'A crisp 3 Nights / 4 Days Darjeeling escape centered around the legendary golden sunrise over Mount Kanchenjunga from Tiger Hill.',
    highlights: [
      'Guaranteed Early Dawn Tiger Hill Sunrise Transfer',
      'Batasia Loop, Ghoom Monastery & Toy Train Joyride Option',
      'Happy Valley Tea Estate & Tibetan Refugee Self-Help Centre',
      'Return via Mirik Lake & Gopaldhara Tea Gardens'
    ],
    itinerary: [
      {
        day: 1,
        title: 'IXB/NJP Pickup – Ascend to Darjeeling via Kurseong',
        description: 'Scenic mountain drive past Rohini and Kurseong viewpoints to Darjeeling.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 2,
        title: 'Tiger Hill Sunrise & Full-Day Darjeeling Sightseeing',
        description: '4:00 AM departure for Tiger Hill sunrise over Kanchenjunga, followed by 7-point heritage sightseeing.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 3,
        title: 'Rock Garden, Peace Pagoda & Chowrasta Promenade',
        description: 'Visit Rock Garden, Ganga Maya Park, Peace Pagoda, and enjoy leisurely tea tasting at Mall Road.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 4,
        title: 'Darjeeling to IXB/NJP via Mirik Lake',
        description: 'Drive down via Simana viewpoint, Pashupati market, and Mirik Lake to IXB/NJP.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-gangtok-lachung-pelling-5n6d',
    slug: 'sikkim-gangtok-lachung-pelling-5n-6d',
    title: 'SIKKIM (GANGTOK-LACHUNG-PELLING) 5N-6D',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Lachung · Yumthang · Pelling',
    destinationTag: 'Sikkim - The Himalayan Paradise',
    country: 'India',
    days: 6,
    nights: 5,
    durationText: '5 Nights / 6 Days',
    pax: 6,
    difficulty: 'Moderate',
    rating: 4.8,
    originalPrice: 20000,
    price: 18000,
    discountPercent: 10,
    featured: true,
    bestSeller: true,
    image: '/assets/images/pelling.jpg',
    gallery: ['/assets/images/pelling.jpg', '/assets/images/sikkim.jpg'],
    overview:
      'Comprehensive East, North & West Sikkim circuit featuring Gangtok, Tsomgo Lake, Lachung’s Yumthang Valley of Flowers, Ravangla, and Pelling.',
    highlights: [
      'Yumthang Valley of Flowers & Lachung Alpine Village Stay',
      'Tsomgo Lake & Baba Mandir High-Altitude Excursion',
      'Ravangla Buddha Park & Namchi Char Dham En Route to Pelling',
      'Pelling Skywalk, Pemayangtse Monastery & Kanchenjunga Falls'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at IXB/NJP – Transfer to Gangtok',
        description: 'Welcome pickup and scenic drive along Teesta River to Gangtok.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Tsomgo Lake & Baba Mandir – Transfer to Lachung',
        description: 'Morning visit to Tsomgo Lake, followed by afternoon scenic drive to Lachung in North Sikkim.',
        meals: 'Breakfast & Dinner',
        stay: 'Mountain Resort, Lachung'
      },
      {
        day: 3,
        title: 'Yumthang Valley Excursion – Return to Gangtok',
        description: 'Explore Yumthang Valley of Rhododendrons and hot springs, then return to Gangtok.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 4,
        title: 'Gangtok to Pelling via Ravangla Buddha Park',
        description: 'Drive through South Sikkim visiting the 130-ft Buddha Park in Ravangla before checking in at Pelling.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique View Hotel, Pelling'
      },
      {
        day: 5,
        title: 'Pelling Full-Day Sightseeing (Skywalk & Sacred Lakes)',
        description: 'Visit Chenrezig Skywalk, Pemayangtse Monastery, Khecheopalri Lake, and Kanchenjunga Waterfalls.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique View Hotel, Pelling'
      },
      {
        day: 6,
        title: 'Pelling to IXB / NJP Departure',
        description: 'Scenic drive along the Rangeet and Teesta rivers back to IXB Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-nathula-3n4d',
    slug: 'sikkim-nathula-3n-4d',
    title: 'SIKKIM (NATHULA) 3N-4D',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Tsomgo Lake · Nathula Pass',
    destinationTag: 'Sikkim - The Himalayan Paradise',
    country: 'India',
    days: 4,
    nights: 3,
    durationText: '3 Nights / 4 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 14000,
    price: 10500,
    discountPercent: 25,
    featured: true,
    bestSeller: true,
    image: '/assets/images/sikkim.jpg',
    gallery: ['/assets/images/sikkim.jpg', '/assets/images/sikkim.jpg'],
    overview:
      '25% OFF Best-Seller! A 3 Nights / 4 Days Gangtok and East Sikkim escape featuring Tsomgo Lake, Baba Mandir, and the historic Nathula Pass.',
    highlights: [
      'Nathula Pass (14,140 ft) Indo-China Border Excursion',
      'Glacial Tsomgo (Changu) Lake & Baba Harbhajan Singh Mandir',
      'Gangtok Ropeway, Rumtek Monastery & Banjhakri Waterfalls',
      'Evening Café & Shopping Strolls at MG Marg'
    ],
    itinerary: [
      {
        day: 1,
        title: 'IXB/NJP to Gangtok Scenic Transfer',
        description: 'Pickup from Bagdogra Airport or NJP Station and drive to Gangtok.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Tsomgo Lake, Baba Mandir & Nathula Pass Excursion',
        description: 'Full-day high-altitude drive along the Old Silk Route to Tsomgo Lake, Baba Mandir, and Nathula Pass.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok Full-Day 7-Point Sightseeing',
        description: 'Visit Tashi Viewpoint, Ganesh Tok, Hanuman Tok, Enchey Monastery, Chorten, Tibetology, and Cable Car.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 4,
        title: 'Gangtok to IXB / NJP Departure',
        description: 'Morning checkout and smooth transfer back to IXB/NJP.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-2n3d',
    slug: 'sikkim-2n-3d',
    title: 'SIKKIM 2N-3D',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Tsomgo Lake',
    destinationTag: 'Sikkim - The Himalayan Paradise',
    country: 'India',
    days: 3,
    nights: 2,
    durationText: '2 Nights / 3 Days',
    pax: 6,
    difficulty: 'Easy',
    rating: 4.8,
    originalPrice: 9500,
    price: 7500,
    discountPercent: 21,
    featured: true,
    bestSeller: false,
    image: '/assets/images/gangtok_ropeway.jpg',
    gallery: ['/assets/images/gangtok_ropeway.jpg'],
    overview:
      'Quick 2 Nights / 3 Days weekend Himalayan retreat to Gangtok and Tsomgo Lake with private transfers and curated stays.',
    highlights: [
      'Ideal 3-Day Weekend Mountain Getaway from Bagdogra / NJP',
      'Tsomgo Glacial Lake & Baba Mandir Full-Day Excursion',
      'Gangtok MG Marg & Viewpoints Tour',
      'Most Affordable Luxury-Supported Sikkim Package'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at IXB/NJP – Drive to Gangtok',
        description: 'Fast-track pickup and scenic ascent to Gangtok. Evening at MG Marg.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Tsomgo Lake & Baba Mandir Excursion',
        description: 'Full-day trip to Tsomgo Lake (12,400 ft) and Baba Mandir.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok Viewpoints & Departure to IXB/NJP',
        description: 'Morning visit to Tashi Viewpoint and Hanuman Tok before driving back to IXB/NJP.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-sikkim-darjeeling-pelling-5n6d',
    slug: 'sikkim-darjeeling-via-pelling-5n-6d',
    title: 'SIKKIM- DARJEELING (via PELLING) 5N-6D',
    region: 'Sikkim',
    locationLabel: 'Gangtok · Pelling · Darjeeling',
    destinationTag: 'Sikkim - The Himalayan Paradise',
    country: 'India',
    days: 6,
    nights: 5,
    durationText: '5 Nights / 6 Days',
    pax: 6,
    difficulty: 'Moderate',
    rating: 4.8,
    originalPrice: 25000,
    price: 20000,
    discountPercent: 20,
    featured: true,
    bestSeller: true,
    image: '/assets/images/pelling.jpg',
    gallery: ['/assets/images/pelling.jpg', '/assets/images/pelling.jpg'],
    overview:
      'The Golden Triangle of the Eastern Himalayas: 2 Nights Gangtok, 1 Night Pelling, and 2 Nights Darjeeling in a single panoramic journey.',
    highlights: [
      'East Sikkim (Gangtok & Tsomgo) + West Sikkim (Pelling) + Darjeeling',
      'Ravangla Buddha Park & Pelling Glass Skywalk',
      'Tiger Hill Sunrise, Batasia Loop & Tea Estates',
      'Handpicked 3-Star / 4-Star Viewpoint Resorts'
    ],
    itinerary: [
      {
        day: 1,
        title: 'IXB/NJP to Gangtok Transfer',
        description: 'Meet & greet at airport/station and drive to Gangtok.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 2,
        title: 'Gangtok – Tsomgo Lake & Baba Mandir',
        description: 'Excursion to Tsomgo Lake and Baba Mandir.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 3,
        title: 'Gangtok to Pelling via Ravangla Buddha Park',
        description: 'Scenic transfer to West Sikkim visiting Buddha Park en route.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique Hotel, Pelling'
      },
      {
        day: 4,
        title: 'Pelling Skywalk & Sightseeing – Transfer to Darjeeling',
        description: 'Morning visit to Pelling Skywalk, Pemayangtse Monastery, and Khecheopalri Lake, then drive to Darjeeling.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 5,
        title: 'Darjeeling Tiger Hill Sunrise & City Tour',
        description: 'Tiger Hill sunrise, Ghoom Monastery, Batasia Loop, HMI, Zoo, and Peace Pagoda.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 6,
        title: 'Darjeeling to IXB / NJP Departure',
        description: 'Return drive to Bagdogra Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  },
  {
    id: 'pkg-darjeeling-sikkim-pelling-5n6d',
    slug: 'darjeeling-sikkim-via-pelling-5n-6d',
    title: 'DARJEELING-SIKKIM (VIA PELLING) 5N-6D',
    region: 'Darjeeling',
    locationLabel: 'Darjeeling · Pelling · Gangtok',
    destinationTag: 'Darjeeling - Queen of the Himalayas',
    country: 'India',
    days: 6,
    nights: 5,
    durationText: '5 Nights / 6 Days',
    pax: 6,
    difficulty: 'Moderate',
    rating: 4.8,
    originalPrice: 25000,
    price: 20500,
    discountPercent: 18,
    featured: false,
    bestSeller: true,
    image: '/assets/images/darjeeling.jpg',
    gallery: ['/assets/images/darjeeling.jpg', '/assets/images/darjeeling.jpg'],
    overview:
      'Begin in the colonial tea hills of Darjeeling, ascend to Pelling’s Kanchenjunga viewpoints, and conclude in vibrant Gangtok & Tsomgo Lake.',
    highlights: [
      'Start in Darjeeling for Immediate Acclimatization & Tea Views',
      'Pelling Chenrezig Skywalk, Rabdentse Ruins & Waterfalls',
      'Gangtok Monasteries, Ropeway & Tsomgo Glacial Lake',
      'All Inter-State Transfers & Permit Formalities Included'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival at IXB/NJP – Transfer to Darjeeling',
        description: 'Scenic ascent via Kurseong to Darjeeling.',
        meals: 'Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 2,
        title: 'Darjeeling Tiger Hill Sunrise & Heritage Tour',
        description: 'Full-day exploration of Darjeeling’s colonial and Himalayan landmarks.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Darjeeling'
      },
      {
        day: 3,
        title: 'Darjeeling to Pelling Transfer & Sightseeing',
        description: 'Drive through Jorethang valley to Pelling. Visit Pemayangtse Monastery and Skywalk.',
        meals: 'Breakfast & Dinner',
        stay: 'Boutique Hotel, Pelling'
      },
      {
        day: 4,
        title: 'Pelling to Gangtok via Ravangla & Namchi',
        description: 'Visit Ravangla Buddha Park and Siddhesvara Dham en route to Gangtok.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 5,
        title: 'Gangtok – Tsomgo Lake & Baba Mandir Excursion',
        description: 'High-altitude excursion to Tsomgo Lake and Baba Mandir.',
        meals: 'Breakfast & Dinner',
        stay: 'Deluxe Hotel, Gangtok'
      },
      {
        day: 6,
        title: 'Gangtok to IXB / NJP Departure',
        description: 'Transfer to Bagdogra Airport or NJP Station.',
        meals: 'Breakfast',
        stay: 'Departure'
      }
    ]
  }
];

export const LUXURY_HOTELS: LuxuryHotel[] = [
  {
    id: 'hotel-kingston',
    name: 'KINGSTON GANGTOK',
    category: 'DELUXE 4STAR GANGTOK',
    city: 'Gangtok',
    state: 'Sikkim',
    pricePerNight: 4000,
    rating: 4.9,
    image: '/assets/images/luxury_resort.jpg',
    features: ['Panoramic Mountain Backdrops', 'Pure-Vegetarian Fine Dining', 'Quiet Chongeytar Setting', 'Luxury Suites & Spa'],
    description:
      'Situated in the peaceful Chongeytar area slightly away from the noisy city centre, offering panoramic Himalayan views, spotless cleanliness, and upscale dining.'
  },
  {
    id: 'hotel-kava',
    name: 'KAVA SUITES',
    category: 'DELUXE 3STAR NAMCHI',
    city: 'Namchi',
    state: 'Sikkim',
    pricePerNight: 3000,
    rating: 4.8,
    image: '/assets/images/luxury_resort.jpg',
    features: ['South Sikkim Valley Views', 'Bespoke Wood Interiors', 'Proximity to Char Dham & Ravangla', '24x7 Room Concierge'],
    description:
      'Contemporary mountain suites in Namchi designed for peaceful spiritual and leisure retreats across South Sikkim.'
  },
  {
    id: 'hotel-pinasa',
    name: 'RUFINA PINASA RESIDENCY',
    category: 'DELUXE 3STAR GANGTOK',
    city: 'Gangtok',
    state: 'Sikkim',
    pricePerNight: 3500,
    rating: 4.8,
    image: '/assets/images/monastery.jpg',
    features: ['Easy Access to MG Marg', 'Warm Sikkimese Hospitality', 'Mountain Balcony Rooms', 'Multi-Cuisine Restaurant'],
    description:
      'Premier hotel branding providing spotless rooms, warm local hospitality, smooth check-in, and convenient access to MG Marg.'
  },
  {
    id: 'hotel-divine-himalayan',
    name: 'DIVINE HIMALAYAN RESORT',
    category: 'DELUXE 3STAR DARJEELING',
    city: 'Darjeeling',
    state: 'West Bengal',
    pricePerNight: 3800,
    rating: 4.9,
    image: '/assets/images/tea_tasting.jpg',
    features: ['Kanchenjunga View Terraces', 'Colonial Timber Aesthetics', 'Tea Lounge & Bonfire', 'Heated Mountain Rooms'],
    description:
      'An atmospheric Darjeeling sanctuary overlooking misty pine ridges and tea gardens with classic Himalayan warmth.'
  },
  {
    id: 'hotel-celeste',
    name: 'DIVINE THE CELESTE',
    category: 'BOUTIQUE PELLING',
    city: 'Pelling',
    state: 'Sikkim',
    pricePerNight: 4000,
    rating: 4.9,
    image: '/assets/images/pelling.jpg',
    features: ['Direct Kanchenjunga Frontage', 'Boutique Luxury Interiors', 'Near Pelling Skywalk', 'Organic Sikkim Dining'],
    description:
      'Boutique luxury retreat in Upper Pelling crafted for unobstructed sunrise views over the Kanchenjunga massif.'
  },
  {
    id: 'hotel-rufina-premiere',
    name: 'Rufina Premiere Hotels & Resorts',
    category: 'RESORT GANGTOK',
    city: 'Gangtok',
    state: 'Sikkim',
    pricePerNight: 4000,
    rating: 4.9,
    image: '/assets/images/luxury_resort.jpg',
    features: ['Rejuvenating Wellness Spa', 'Cultural Architecture', 'Private Valley Decks', 'Executive Banquet & Lounge'],
    description:
      'Flagship luxury resort in Gangtok blending traditional Himalayan architectural motifs with contemporary resort wellness.'
  }
];

export const TAXI_FLEET: TaxiCab[] = [
  {
    id: 'cab-fortuner',
    name: 'Toyota Fortuner 4x4',
    brand: 'Toyota',
    year: 2024,
    location: 'BAGDOGRA (IXB)',
    seats: 7,
    bags: 5,
    ac: true,
    baseFare: 9000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['4x4 Mountain Drive', 'Premium Sound System', '360 Camera & Leather Cabin']
  },
  {
    id: 'cab-innova-crysta',
    name: 'Innova Crysta',
    brand: 'Toyota',
    year: 2025,
    location: 'Siliguri / IXB',
    seats: 6,
    bags: 4,
    ac: true,
    baseFare: 6000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Captain Leather Seats', 'GPS Navigation', 'Smooth Hill Suspension']
  },
  {
    id: 'cab-hiace-thimphu',
    name: 'HIACE Luxury Coaster',
    brand: 'Toyota',
    year: 2023,
    location: 'Thimphu / Bhutan',
    seats: 12,
    bags: 10,
    ac: true,
    baseFare: 7000,
    hourlyRate: 500,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Spacious 12-Seat Cabin', '10-Bag Expedition Capacity', 'Air-Conditioned Comfort']
  },
  {
    id: 'cab-tempo-traveller',
    name: 'TEMPO TRAVELLER',
    brand: 'Force Motors',
    year: 2024,
    location: 'Darjeeling / Sikkim',
    seats: 10,
    bags: 12,
    ac: true,
    baseFare: 10000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Flexible Pushback Seats', 'Monocoque Hill Body', '12-Bag Group Capacity']
  },
  {
    id: 'cab-rumion',
    name: 'Toyota Rumion',
    brand: 'Toyota',
    year: 2023,
    location: 'BAGDOGRA (IXB)',
    seats: 7,
    bags: 3,
    ac: true,
    baseFare: 5500,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['AC 7-Seater MPV', 'Bluetooth Connectivity', 'Hill Assist Control']
  },
  {
    id: 'cab-innova',
    name: 'Toyota Innova',
    brand: 'Toyota',
    year: 2018,
    location: 'Siliguri',
    seats: 7,
    bags: 4,
    ac: true,
    baseFare: 5000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Leather Seats', 'GPS Navigation', 'Trusted Sikkim-Darjeeling Cruiser']
  },
  {
    id: 'cab-sumo-gold',
    name: 'Tata Sumo Gold',
    brand: 'Tata',
    year: 2023,
    location: 'Gangtok / North Sikkim',
    seats: 8,
    bags: 3,
    ac: true,
    baseFare: 5000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['High Ground Clearance', 'Expedition Roof Carrier', 'North Sikkim rugged specialist']
  },
  {
    id: 'cab-creta',
    name: 'Hyundai Creta',
    brand: 'Hyundai',
    year: 2024,
    location: 'Darjeeling',
    seats: 4,
    bags: 2,
    ac: true,
    baseFare: 4500,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Panoramic Sunroof', 'Bose Sound System', 'Wireless Charging']
  },
  {
    id: 'cab-xylo',
    name: 'Mahindra Xylo',
    brand: 'Mahindra',
    year: 2023,
    location: 'Siliguri',
    seats: 7,
    bags: 6,
    ac: true,
    baseFare: 4500,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['6-Bag Luggage Space', 'AC Cabin', 'High-Torque Hill Engine']
  },
  {
    id: 'cab-wagonr',
    name: 'Maruti Suzuki Wagon R',
    brand: 'Maruti Suzuki',
    year: 2023,
    location: 'Darjeeling',
    seats: 4,
    bags: 3,
    ac: true,
    baseFare: 4500,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Tall-Boy Spacious Cabin', 'Agile Hill Town Navigation', '3-Bag Capacity']
  },
  {
    id: 'cab-swift',
    name: 'Maruti Suzuki Swift',
    brand: 'Maruti Suzuki',
    year: 2023,
    location: 'Siliguri',
    seats: 4,
    bags: 2,
    ac: true,
    baseFare: 4000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['Compact Couples Transfer', 'AC & Bluetooth', 'Bagdogra-Darjeeling Direct']
  },
  {
    id: 'cab-hunter-350',
    name: 'Royal Enfield Hunter 350',
    brand: 'Royal Enfield',
    year: 2024,
    location: 'Darjeeling',
    seats: 2,
    bags: 0,
    ac: false,
    baseFare: 1200,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['349cc J-Series Engine', 'Dual-Channel ABS', 'Classic Himalayan Touring']
  },
  {
    id: 'cab-yamaha-rayzr',
    name: 'Yamaha RayZR Street Rally 125 Fi Hybrid',
    brand: 'Yamaha',
    year: 2026,
    location: 'Siliguri / Local',
    seats: 2,
    bags: 1,
    ac: false,
    baseFare: 1000,
    hourlyRate: 0,
    image: '/assets/images/suv_fleet.jpg',
    features: ['125cc Hybrid Assist', 'Agile Local Exploration', 'Instant Self-Ride Booking']
  }
];

export const UNIQUENESS_ITEMS: UniquenessItem[] = [
  {
    id: 'uniq-1',
    number: '01',
    title: 'Darjeeling & Tea Estates',
    subtitle: 'Conceived as a timeless journey into the Queen of the Himalayas. Our curated Darjeeling experiences offer guests:',
    points: [
      'Dawn excursions to Tiger Hill for golden sunrises over Mount Kanchenjunga.',
      'Heritage joyrides aboard the UNESCO World Heritage Darjeeling Himalayan Toy Train.',
      'Guided walks and tastings across emerald slopes of Happy Valley, Makaibari & Gopaldhara estates.',
      'Peace Pagoda, Batasia Loop, Ghoom Monastery, and leisurely evenings at Chowrasta Mall.'
    ],
    image: '/assets/images/darjeeling.jpg',
    secondaryImage: '/assets/images/darjeeling.jpg',
    layoutVariant: 'right-wide'
  },
  {
    id: 'uniq-2',
    number: '02',
    title: 'Sikkim Alpine Expeditions',
    subtitle: 'Another sacred language through which the Eastern Himalayas reveal their power:',
    points: [
      'High-altitude expeditions to glacial Tsomgo Lake (12,400 ft) and historic Nathula Pass (14,140 ft).',
      'North Sikkim journeys to Lachen and the sacred turquoise waters of Gurudongmar Lake (17,800 ft).',
      'Lachung riverside stays opening into Yumthang Valley of Flowers and snow-clad Zero Point.',
      'West Sikkim’s Pelling Glass Skywalk, Pemayangtse Monastery, and Ravangla’s 130-ft Buddha Park.'
    ],
    image: '/assets/images/sikkim.jpg',
    secondaryImage: '/assets/images/sikkim.jpg',
    layoutVariant: 'left-wide'
  },
  {
    id: 'uniq-3',
    number: '03',
    title: 'When the prayer flags guide you to Bhutan...',
    subtitle: 'Our cross-border Kingdom of Bhutan expeditions handle every permit and detail seamlessly:',
    points: [
      'End-to-end Immigration & Sustainable Development Fee (SDF) permit processing at Phuentsholing.',
      'Guided trek through misty pine forests to the cliffside Tiger’s Nest Monastery (Paro Taktsang).',
      'Architectural immersion at Tashichho Dzong, Paro Rinpung Dzong, and the towering Buddha Dordenma.'
    ],
    image: '/assets/images/bhutan.jpg',
    secondaryImage: '/assets/images/bhutan.jpg',
    layoutVariant: 'right-tall'
  },
  {
    id: 'uniq-4',
    number: '04',
    title: 'Luxury Mountain Stays & Sanctuaries',
    subtitle: 'Handpicked 3-star, 4-star, and boutique viewpoint resorts across Sikkim and Darjeeling:',
    points: [
      'Kingston Gangtok, Rufina Premiere Resorts, and Divine The Celeste in Upper Pelling.',
      'Panoramic mountain backdrops, quiet settings away from urban noise, and rejuvenating spas.',
      'Spotless rooms, pure-vegetarian and local Himalayan fine dining, and warm regional hospitality.'
    ],
    image: '/assets/images/luxury_resort.jpg',
    secondaryImage: '/assets/images/luxury_resort.jpg',
    layoutVariant: 'left-tall'
  },
  {
    id: 'uniq-5',
    number: '05',
    title: '13+ Verified Mountain Cabs & 4x4 Fleet',
    subtitle: 'Every mountain curve navigated with seasoned local hill drivers and dedicated vehicles:',
    points: [
      'From luxury Toyota Fortuner 4x4s and Innova Crystas to 12-seater Toyota Hiace coasters.',
      'Direct pickups and drops at Bagdogra Airport (IXB), NJP Railway Station, Siliguri, and Thimphu.',
      'Royal Enfield Hunter 350 touring motorcycles and scooties for independent mountain riders.'
    ],
    image: '/assets/images/suv_fleet.jpg',
    secondaryImage: '/assets/images/suv_fleet.jpg',
    layoutVariant: 'right-wide'
  },
  {
    id: 'uniq-6',
    number: '06',
    title: 'The Old Silk Route & Dooars Wilderness',
    subtitle: 'Where ancient trade routes and sub-Himalayan jungle sanctuaries converge:',
    points: [
      'Zuluk’s iconic 32-hairpin Thambi View Point, Nathang Valley, and Kupup Elephant Lake.',
      'Gorumara and Jaldapara wildlife safaris in the lush green foothills of Dooars.',
      'Kalimpong’s Deolo Hill, Kurseong’s white orchid slopes, and Mirik’s Sumendu Lake.'
    ],
    image: '/assets/images/silkroute.jpg',
    secondaryImage: '/assets/images/dooars.jpg',
    layoutVariant: 'left-wide'
  }
];

export const BLOG_STORIES: BlogStory[] = [
  {
    id: 'blog-sikkim-2026',
    slug: 'sikkim-travel-guide-2026-land-of-the-gods',
    title: 'Sikkim Travel Guide 2026: Land of the Gods - Best Places, Monasteries & Himalayan Beauty',
    category: 'Destination Guides',
    date: '15/08/2026',
    readTime: '4 min read',
    author: 'MyTravelExpert Concierge',
    reads: 342,
    excerpt:
      'Discover Sikkim, the Land of the Gods. Explore Gangtok, Pelling, Lachung, Tsomgo Lake, and ancient monasteries with complete inner-line permit guidance.',
    image: '/assets/images/sikkim.jpg',
    content: [
      'Nestled between Nepal, Bhutan, and Tibet, Sikkim is an alpine sanctuary where prayer flags flutter against 8,000-meter Himalayan giants. In 2026, improved mountain highways and curated boutique stays make exploring East, North, and West Sikkim more rewarding than ever.',
      'In East Sikkim, begin at Gangtok’s pedestrian-only MG Marg before ascending the historic Silk Route to glacial Tsomgo Lake (12,400 ft), Baba Mandir, and Nathula Pass. Our team arranges all Protected Area Permits (PAP) 24 hours in advance.',
      'Venturing north into Lachen and Lachung reveals the raw majesty of Gurudongmar Lake (17,800 ft) and Yumthang Valley of Flowers, while West Sikkim’s Pelling offers the closest unobstructed sunrise vistas of Mount Kanchenjunga.'
    ]
  },
  {
    id: 'blog-darjeeling-2026',
    slug: 'darjeeling-travel-guide-2026-queen-of-the-himalayas',
    title: 'Darjeeling Travel Guide 2026: Queen of the Himalayas - Best Places, Toy Train & Tea Gardens',
    category: 'Destination Guides',
    date: '15/08/2026',
    readTime: '5 min read',
    author: 'MyTravelExpert Concierge',
    reads: 518,
    excerpt:
      'Discover the timeless charm of Darjeeling, the Queen of the Himalayas. Explore Tiger Hill, ride the UNESCO Toy Train, and walk through emerald tea gardens.',
    image: '/assets/images/darjeeling.jpg',
    content: [
      'Darjeeling remains the crown jewel of the Eastern Himalayas—a ridge-top sanctuary of colonial heritage, aromatic First Flush tea estates, and sweeping panoramas of the Kanchenjunga massif.',
      'Every classic MyTravelExpert Darjeeling itinerary begins before dawn at Tiger Hill (2,590m), where the first amber rays of sunlight ignite the snow peaks of Kanchenjunga, Kabru, and Jannu.',
      'Pair your stay with a steam or diesel joyride from Darjeeling to Ghoom via the spiral Batasia Loop, followed by afternoon tea tastings at Happy Valley or Gopaldhara and a peaceful detour to Kurseong and Mirik Lake.'
    ]
  },
  {
    id: 'blog-bhutan-silk-route',
    slug: 'bhutan-and-old-silk-route-expedition-planning',
    title: 'Cross-Border Horizons: Combining Bhutan’s Paro Taktsang with the Zuluk Old Silk Route',
    category: 'Trekking',
    date: '02/09/2026',
    readTime: '6 min read',
    author: 'MyTravelExpert Concierge',
    reads: 289,
    excerpt:
      'How to plan a seamless overland expedition from Bagdogra (IXB) through Phuentsholing, Thimphu, and Paro Tiger’s Nest alongside East Sikkim’s 32 hairpin bends.',
    image: '/assets/images/bhutan.jpg',
    content: [
      'Starting from our corporate hub in Bagdogra (IXB), travelers are uniquely positioned at the crossroads of Darjeeling, Sikkim, Dooars, and the Kingdom of Bhutan.',
      'Within a 4-hour drive through the lush tea corridors of the Dooars lies Phuentsholing—the overland gateway to Bhutan. With MyTravelExpert handling your immigration permits, vehicle clearances, and licensed Bhutanese guides, ascending to Thimphu and trekking to Tiger’s Nest in Paro becomes effortless.',
      'For high-altitude road enthusiasts, the Old Silk Route via Zuluk and Thambi View Point delivers 32 dramatic hairpin turns carved directly into the Eastern Himalayan mountainside.'
    ]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    index: '01',
    question: 'Are Bagdogra Airport (IXB) and NJP Railway Station transfers included in all packages?',
    answer:
      'Yes. Every MyTravelExpert tour package includes dedicated private pickup and drop-off from Bagdogra Airport (IXB), New Jalpaiguri Railway Station (NJP), or Siliguri, operated by our verified hill drivers.'
  },
  {
    id: 'faq-2',
    index: '02',
    question: 'Who handles inner-line permits for Nathula Pass, North Sikkim (Lachen/Lachung), Zuluk, and Bhutan?',
    answer:
      'Our in-house operations team handles 100% of Protected Area Permits (PAP) for Tsomgo Lake, Nathula Pass, Gurudongmar Lake, Yumthang Valley, Zuluk Silk Route, and Bhutan Immigration formalities at Phuentsholing/Paro.'
  },
  {
    id: 'faq-3',
    index: '03',
    question: 'Can I customize the duration, hotel category, or vehicle type for my family or group?',
    answer:
      'Absolutely. While our 16 featured packages are priced for standard 6-pax comfort, every itinerary can be tailored for solo travelers, couples, or large groups—upgrading to 4-star resorts (like Kingston Gangtok or Divine The Celeste) or Toyota Fortuner / Innova Crysta SUVs.'
  },
  {
    id: 'faq-4',
    index: '04',
    question: 'How does the VIP Club 10% First-Booking Discount work?',
    answer:
      'When you subscribe to the MyTravelExpert VIP Club or toggle the First Booking VIP offer in our Consultation & Booking drawer, an instant 10% discount is applied on top of our seasonal package deals.'
  },
  {
    id: 'faq-5',
    index: '05',
    question: 'What is the best season to visit Darjeeling, Sikkim, and Bhutan?',
    answer:
      'March to June (Spring/Summer) offers blooming rhododendrons in Yumthang Valley, pleasant hill weather, and emerald tea flushes. October to February (Autumn/Winter) brings crystal-clear Kanchenjunga views from Tiger Hill and Pelling, snow at Zero Point and Nathula, and vibrant festivals in Bhutan.'
  },
  {
    id: 'faq-6',
    index: '06',
    question: 'Can I book only a luxury mountain hotel or a private taxi/cab without a full tour package?',
    answer:
      'Yes. We offer standalone bookings across our 6 curated mountain hotels (starting from ₹3,000/night) and our 13+ strong fleet of SUVs, Tempo Travellers, Toyota Hiace coasters, and Royal Enfield motorcycles.'
  },
  {
    id: 'faq-7',
    index: '07',
    question: 'Where is MyTravelExpert’s corporate office located and what are your support hours?',
    answer:
      'Our corporate office is located right near Bagdogra Airport at Bagdogra Bhujiapani, M.E.S. Colony, P.O. & P.S. – Bagdogra, Darjeeling, West Bengal - 734014. Office hours are Mon–Sat 8:00 AM – 8:00 PM, with 24x7 emergency concierge support for active travelers.'
  }
];
