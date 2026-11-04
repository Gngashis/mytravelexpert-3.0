import React, { useState } from 'react';
import {
  COMPANY_INFO,
  DESTINATIONS,
  TOUR_PACKAGES,
  UNIQUENESS_ITEMS,
  BLOG_STORIES,
  FAQ_ITEMS,
  TourPackage,
  BlogStory
} from './data/travelData';
import {
  CarvedMonumentLogo,
  SectionKicker,
  CircleArrowButton,
  SteppedTransition,
  ResilientImage,
  DiamondStar
} from './components/CarvedLogo';
import { ShowcaseSelector } from './components/ShowcaseSelector';
import {
  MenuModal,
  ConsultationModal,
  ItineraryDetailModal,
  BlogReaderModal,
  SavedInquiryRecord
} from './components/Modals';

const GALLERY_SLIDES = [
  {
    id: 'gal-1',
    src: '/assets/mte/1787721518_8653.webp',
    title: 'Darjeeling — Queen of the Himalayas',
    tag: 'WEST BENGAL · 2,042M'
  },
  {
    id: 'gal-2',
    src: '/assets/mte/1787392935_8147.jpg',
    title: 'North Sikkim — Gurudongmar & Lachen',
    tag: 'SIKKIM · 5,430M'
  },
  {
    id: 'gal-3',
    src: '/assets/mte/1787377115_1558.jpg',
    title: 'Paro Taktsang — Kingdom of Bhutan',
    tag: 'BHUTAN · 3,120M'
  },
  {
    id: 'gal-4',
    src: '/assets/mte/1787722180_8926.webp',
    title: 'Zuluk — 32 Hairpin Old Silk Route',
    tag: 'EAST SIKKIM · 3,413M'
  },
  {
    id: 'gal-5',
    src: '/assets/mte/1787399084_3277.webp',
    title: 'Kingston Gangtok & Luxury Mountain Stays',
    tag: 'PREMIER HOSPITALITY'
  },
  {
    id: 'gal-6',
    src: '/assets/mte/1788271002_8852.jpeg',
    title: 'Dooars — Sub-Himalayan Wildlife Sanctuaries',
    tag: 'NORTH BENGAL FOOTHILLS'
  },
  {
    id: 'gal-7',
    src: '/assets/mte/1786814050_7010.webp',
    title: 'Pelling — Unobstructed Kanchenjunga Vistas',
    tag: 'WEST SIKKIM · 2,150M'
  },
  {
    id: 'gal-8',
    src: '/assets/mte/1789202791_3825.jpeg',
    title: 'Toyota Fortuner 4x4 & Himalayan Expedition Fleet',
    tag: 'BAGDOGRA (IXB) HUB'
  }
];

export default function App() {
  // Interactive Modals State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [bookingSubject, setBookingSubject] = useState<string>(TOUR_PACKAGES[1].title);
  const [bookingBasePrice, setBookingBasePrice] = useState<number>(TOUR_PACKAGES[1].price);
  const [savedInquiries, setSavedInquiries] = useState<SavedInquiryRecord[]>([]);
  const [activeItineraryPkg, setActiveItineraryPkg] = useState<TourPackage | null>(null);
  const [activeBlogStory, setActiveBlogStory] = useState<BlogStory | null>(null);

  // Interactive Section States
  const [selectedDestIndex, setSelectedDestIndex] = useState<number>(0);
  const [infraPairIndex, setInfraPairIndex] = useState<number>(0);
  const [expandedUniqId, setExpandedUniqId] = useState<string | null>('uniq-1');
  const [activeSeason, setActiveSeason] = useState<'summer' | 'winter'>('summer');
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [blogTab, setBlogTab] = useState<'All' | 'Destination Guides' | 'Trekking'>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');
  const [vipEmail, setVipEmail] = useState<string>('');
  const [vipSubscribed, setVipSubscribed] = useState<boolean>(false);
  const [vipError, setVipError] = useState<string>('');

  const handleOpenBookingWithItem = (
    title: string,
    price: number,
    _type?: 'package' | 'hotel' | 'cab'
  ) => {
    setBookingSubject(title);
    setBookingBasePrice(price);
    setIsConsultationOpen(true);
  };

  const handleVipSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vipEmail.trim())) {
      setVipError('Please enter a valid email address for your 10% VIP voucher.');
      return;
    }
    setVipError('');
    setVipSubscribed(true);
  };

  const activeDest = DESTINATIONS[selectedDestIndex] || DESTINATIONS[0];
  const totalInfraPairs = Math.ceil(DESTINATIONS.length / 2);
  const visibleInfraDestinations = DESTINATIONS.slice(
    infraPairIndex * 2,
    infraPairIndex * 2 + 2
  );

  const filteredBlogs =
    blogTab === 'All'
      ? BLOG_STORIES
      : BLOG_STORIES.filter((b) => b.category === blogTab);

  return (
    <div className="min-h-screen bg-[#2c2824] text-[#a89474] selection:bg-[#a89474] selection:text-[#2c2824]">
      {/* =====================================================================
          TOP BAR HEADER (Follows Son Daven 3-Zone Header & Top Bar Contract)
         ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-40 px-5 md:px-10 py-3.5 flex items-center justify-between gap-8 bg-[#2c2824]/90 backdrop-blur-md border-b border-[#a89474]/15 text-[#a89474]">
        {/* Zone 1: Menu Trigger & Expeditions Anchor */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="group inline-flex items-center gap-3 font-sd-body text-[11px] tracking-[0.14em] uppercase cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="flex flex-col gap-1.5 w-7">
              <span className="w-full h-[1.5px] bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="w-full h-[1.5px] bg-current transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
            <span className="sd-slide-label">
              <span>Menu</span>
              <span>Menu</span>
            </span>
          </button>

          <a
            href="#location"
            className="hidden sm:inline-block font-sd-body text-[11px] tracking-[0.14em] uppercase hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Destinations
          </a>
          <a
            href="#apartments"
            className="hidden md:inline-block font-sd-body text-[11px] tracking-[0.14em] uppercase hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            Packages (16)
          </a>
          <a
            href="#faq"
            className="hidden lg:inline-block font-sd-body text-[11px] tracking-[0.14em] uppercase hover:underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            FAQ
          </a>
        </div>

        {/* Zone 2: Single-Line Carved Brand Wordmark */}
        <a
          href="#hero"
          aria-label="MyTravelExpert Home"
          className="text-current hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <CarvedMonumentLogo text="MY TRAVEL EXPERT" variant="header" />
        </a>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsConsultationOpen(true)}
            className="sd-btn text-[#2c2824] whitespace-nowrap shrink-0"
            style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
          >
            <span className="sd-slide-label">
              <span>Consultation</span>
              <span>Consultation</span>
            </span>
          </button>
        </div>
      </header>

      <main>
        {/* ===================================================================
            SECTION 1: HERO (#hero) — Exact Clone of sondaven.com/en Hero
           =================================================================== */}
        <section
          id="hero"
          className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden pt-24 pb-10 px-5 md:px-12"
        >
          {/* Background Full-Bleed Architectural Mountain Render + Sky Gradient */}
          <div className="absolute inset-0 z-0">
            <ResilientImage
              src="/assets/sondaven/69c145dd9b0098e86a6d20ef_6940a0abd735a1e3a640d0a0_final-0.webp"
              alt="MyTravelExpert Luxury Himalayan Sanctuary in Darjeeling, Sikkim and Bhutan"
              className="w-full h-full object-cover object-center"
            />
            {/* Top warm daylight sky wash so dark carved typography matches sondaven-hero.png */}
            <div
              className="absolute inset-x-0 top-0 h-[52%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(214,204,190,0.92) 0%, rgba(214,204,190,0.72) 55%, rgba(214,204,190,0) 100%)'
              }}
            />
            {/* Bottom contrast scrim so white Resort title & location badges pop crisply */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#1f1c18]/95 via-[#2c2824]/55 to-transparent pointer-events-none" />
          </div>

          {/* Hero Top Row: Kicker + Carved Monument Title + Right Metrics */}
          <div className="relative z-10 max-w-[1440px] w-full mx-auto pt-4 md:pt-8 text-[#2c2824]">
            <h1 className="font-sd-body text-xs md:text-sm tracking-[0.16em] uppercase mb-3 md:mb-4">
              {COMPANY_INFO.tagline} · Darjeeling · Sikkim · Bhutan
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <CarvedMonumentLogo text="MY TRAVEL EXPERT" variant="hero" />
              </div>

              <div className="lg:col-span-4 grid grid-cols-2 gap-6 pb-2">
                <div>
                  <div className="font-sd-body text-xs tracking-[0.1em] uppercase">
                    UP TO{' '}
                    <span className="font-sd-display text-5xl md:text-6xl tracking-tight normal-case tabular-nums">
                      25%
                    </span>
                  </div>
                  <div className="font-sd-body text-[10px] tracking-[0.12em] uppercase mt-1 text-[#2c2824]/85">
                    Seasonal Package
                    <br />
                    Savings + 10% VIP
                  </div>
                </div>

                <div>
                  <div className="font-sd-body text-xs tracking-[0.1em] uppercase">
                    OVER{' '}
                    <span className="font-sd-display text-5xl md:text-6xl tracking-tight normal-case tabular-nums">
                      16+
                    </span>
                  </div>
                  <div className="font-sd-body text-[10px] tracking-[0.12em] uppercase mt-1 text-[#2c2824]/85">
                    Curated Himalayan
                    <br />
                    Tour Packages
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Bottom Row: White Editorial Title, Highlighted Location Pills, and Circular CTA */}
          <div className="relative z-10 max-w-[1440px] w-full mx-auto mt-36 md:mt-48 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 text-white">
            <div className="max-w-xl">
              <h2
                className="font-sd-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.94] tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                Discover Darjeeling,
                <br />
                Sikkim & Bhutan
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-8 font-sd-body text-[11px] tracking-[0.12em] uppercase">
                <div>
                  <span className="bg-white text-[#2c2824] px-2 py-0.5 inline-block mb-1 font-bold">
                    BAGDOGRA (IXB)
                  </span>
                  <span className="block text-white/90">DARJEELING, WEST BENGAL</span>
                </div>

                <div>
                  <span className="block text-white/85 mb-1">24x7 CONCIERGE & CAB FLEET</span>
                  <span className="bg-white text-[#2c2824] px-2 py-0.5 inline-block font-bold tabular-nums">
                    +91 8001247778
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Son Daven Circular Magnetic Button */}
            <button
              type="button"
              onClick={() => setIsConsultationOpen(true)}
              className="sd-circle-btn w-40 h-40 md:w-48 md:h-48 text-white hover:bg-white hover:text-[#2c2824] shrink-0 cursor-pointer p-6 text-left"
            >
              <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase leading-relaxed">
                Plan Your
                <br />
                Expedition
              </span>
            </button>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: PROLOGUE (#prolog) — theme_on-dark (#2c2824)
           =================================================================== */}
        <section
          id="prolog"
          className="theme_on-dark py-28 md:py-40 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <SectionKicker label="Prologue" />

            <h3
              className="font-sd-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] mt-10 leading-[1.08] text-[#a89474]"
              style={{ textWrap: 'balance' }}
            >
              “Among these mountains, where the wind becomes a voice and monasteries guard the wisdom of thousands of years, the Himalayan heritage comes alive—explore breathtaking peaks, peaceful valleys, emerald tea gardens, and unforgettable experiences with MyTravelExpert.”
            </h3>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <a
                href="#apartments"
                className="sd-btn text-[#2c2824]"
                style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
              >
                <span className="sd-slide-label">
                  <span>Explore All 16 Packages</span>
                  <span>Explore All 16 Packages</span>
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Stepped Pixel Transition: Dark (#2c2824) -> Light (#a89474) */}
        <SteppedTransition fromTheme="dark" toTheme="light" seed={1} />

        {/* ===================================================================
            SECTION 3: ABOUT US & CONCEPT (#about) — theme_on-light (#a89474)
           =================================================================== */}
        <section id="about" className="theme_on-light py-24 md:py-36 px-5 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            {/* Monumental Brand Heading */}
            <div className="mb-16 md:mb-24">
              <h2 className="font-sd-display text-6xl sm:text-7xl md:text-8xl lg:text-[116px] leading-[0.88] tracking-tight">
                MyTravelExpert
              </h2>
              <div className="mt-4 flex items-center gap-3 font-sd-body text-xs md:text-sm tracking-[0.14em] uppercase text-[#2c2824]/80">
                <DiamondStar className="w-3 h-3" />
                <span>Trusted Himalayan Travel Partner · Est. Bagdogra, Darjeeling</span>
              </div>
            </div>

            {/* Two-Column Asymmetric Layout (About Us & Concept) matching sondaven.com/en */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
              {/* Left Column: About Us */}
              <div className="md:col-span-5 group">
                <h3 className="font-sd-display text-4xl md:text-5xl">About Us</h3>
                <div className="sd-hairline my-6" />
                <p className="text-base leading-relaxed text-[#2c2824]/90 mb-8">
                  MyTravelExpert is a trusted regional travel partner headquartered in Bagdogra, Darjeeling (West Bengal - 734014), specializing in bespoke, customized holidays across the Eastern Himalayas. From the emerald tea slopes of Darjeeling and Kurseong to the high-altitude glacial lakes of Sikkim and the sacred Dzongs of Bhutan, here ancient mountain traditions merge with modern luxury comfort.
                </p>
                <button
                  type="button"
                  onClick={() => setIsConsultationOpen(true)}
                  className="sd-btn text-[#a89474]"
                >
                  <span className="sd-slide-label">
                    <span>Consultation</span>
                    <span>Consultation</span>
                  </span>
                </button>
              </div>

              {/* Spacer */}
              <div className="hidden md:block md:col-span-2" />

              {/* Right Column: Concept (Offset downwards like Son Daven) */}
              <div className="md:col-span-5 md:mt-24 group">
                <h3 className="font-sd-display text-4xl md:text-5xl">Concept</h3>
                <div className="sd-hairline my-6" />
                <p className="text-base leading-relaxed text-[#2c2824]/90 mb-8">
                  Every journey grows naturally from the mountains—combining 16+ handpicked tour packages, 6+ premier viewpoint resorts, and a ready fleet of 17+ verified mountain SUVs, coasters, and touring bikes. Panoramic terraces open up views of Mount Kanchenjunga, inner-line permits are handled effortlessly, and 24x7 local concierge care creates a deep, meaningful format of Himalayan exploration.
                </p>

                <a
                  href="#apartments"
                  className="inline-flex items-center gap-3 font-sd-body text-xs tracking-[0.14em] uppercase border-b border-[#2c2824] pb-1.5 group"
                >
                  <span className="sd-slide-label">
                    <span>See you in the Himalayas</span>
                    <span>See you in the Himalayas</span>
                  </span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stepped Pixel Transition: Light (#a89474) -> Dark (#2c2824) */}
        <SteppedTransition fromTheme="light" toTheme="dark" seed={2} />

        {/* ===================================================================
            SECTION 4: WHERE THE MOUNTAINS SPEAK (#location) — theme_on-dark
           =================================================================== */}
        <section id="location" className="theme_on-dark py-24 md:py-36 px-5 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            {/* Staggered 3-Row Monumental Heading */}
            <div className="mb-16 md:mb-24">
              <h2 className="font-sd-display text-6xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.86] uppercase tracking-tight">
                <span className="block">Where</span>
                <span className="block pl-8 md:pl-32">
                  <span className="font-sd-body text-lg md:text-2xl tracking-[0.15em] align-middle mr-4">
                    the
                  </span>
                  <span>Mountains</span>
                </span>
                <span className="block text-right pr-4 md:pr-24">Speak</span>
              </h2>
            </div>

            {/* Interactive Topographic Himalayan Map & Active Destination Pin Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-24">
              <div className="lg:col-span-8 relative border border-[#a89474]/20 bg-[#23201c] aspect-[16/10] overflow-hidden p-4">
                <img
                  src="/assets/sondaven/6940a0abd735a1e3a640d08e_map.svg"
                  alt="Topographic Map of Eastern Himalayas — Darjeeling, Sikkim, Bhutan & Dooars"
                  className="w-full h-full object-cover opacity-35"
                />

                {/* Bagdogra (IXB) Central Hub Marker */}
                <div
                  style={{ left: '36%', top: '86%' }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                >
                  <div className="px-2 py-0.5 bg-[#a89474] text-[#2c2824] font-sd-body text-[9px] tracking-[0.12em] uppercase whitespace-nowrap">
                    ★ Bagdogra (IXB) HQ
                  </div>
                </div>

                {/* Interactive Pins for all 12 Destinations from mytravelexpert.co.in */}
                {DESTINATIONS.map((dest, idx) => {
                  const isSelected = idx === selectedDestIndex;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => setSelectedDestIndex(idx)}
                      style={{
                        left: `${dest.mapCoords.x}%`,
                        top: `${dest.mapCoords.y}%`
                      }}
                      aria-label={`Select destination ${dest.name}`}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer group ${
                        isSelected ? 'z-30 scale-110' : 'z-20 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`px-2.5 py-1 border text-left transition-colors ${
                          isSelected
                            ? 'bg-[#a89474] text-[#2c2824] border-[#a89474]'
                            : 'bg-[#2c2824]/90 text-[#a89474] border-[#a89474]/45 hover:border-[#a89474]'
                        }`}
                      >
                        <div className="font-sd-display text-sm md:text-base leading-none whitespace-nowrap">
                          {dest.name}
                        </div>
                        <div className="font-sd-body text-[8px] tracking-[0.1em] opacity-75 mt-0.5 tabular-nums">
                          {dest.elevation}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Active Destination Detail Card */}
              <div className="lg:col-span-4 flex flex-col justify-between border border-[#a89474]/20 p-6 md:p-8 bg-[#2c2824]">
                <div>
                  <div className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/60 mb-2">
                    Destination {String(selectedDestIndex + 1).padStart(2, '0')} / {DESTINATIONS.length} · {activeDest.country}
                  </div>
                  <h3 className="font-sd-display text-4xl md:text-5xl">
                    {activeDest.name}
                  </h3>
                  <div className="font-sd-body text-xs tracking-[0.1em] text-[#a89474]/80 mt-1">
                    {activeDest.subtitle}
                  </div>

                  <div className="my-5 aspect-[16/9] overflow-hidden bg-[#1f1c18]">
                    <ResilientImage
                      src={activeDest.image}
                      alt={`${activeDest.name} - ${activeDest.subtitle}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-sm text-[#a89474]/85 leading-relaxed">
                    {activeDest.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 my-6 py-4 border-y border-[#a89474]/15 font-sd-body text-xs tabular-nums">
                    <div>
                      <span className="text-[10px] text-[#a89474]/55 block">FROM BAGDOGRA (IXB)</span>
                      <span>{activeDest.distanceFromBagdogra} ({activeDest.driveTime})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#a89474]/55 block">ELEVATION</span>
                      <span>{activeDest.elevation}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenBookingWithItem(
                      `${activeDest.name} — ${activeDest.subtitle} Custom Tour`,
                      14500,
                      'package'
                    )
                  }
                  className="sd-btn text-[#2c2824] w-full"
                  style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
                >
                  <span className="sd-slide-label">
                    <span>Consultation for {activeDest.name}</span>
                    <span>Consultation for {activeDest.name}</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Infrastructure & Route Timings + Corporate Office Card matching sondaven.com/en */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 border-t border-[#a89474]/15 items-end">
              {/* Left 6 cols: Infrastructure & Route Slider */}
              <div className="lg:col-span-6">
                <h3 className="font-sd-body text-xs tracking-[0.15em] uppercase text-[#a89474]/65 mb-8">
                  Route Infrastructure from Bagdogra (IXB) / NJP Hub
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                  {visibleInfraDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => setSelectedDestIndex(DESTINATIONS.findIndex((d) => d.id === dest.id))}
                      className="border-t border-[#a89474]/25 pt-5 cursor-pointer group"
                    >
                      <h4 className="font-sd-display text-4xl md:text-5xl tabular-nums group-hover:translate-x-1 transition-transform">
                        {dest.driveTime}
                      </h4>
                      <p className="font-sd-body text-xs tracking-[0.1em] uppercase text-[#a89474]/75 mt-2">
                        drive to <span className="text-[#a89474] underline">{dest.name}</span> ({dest.distanceFromBagdogra})
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-sd-body text-xs tracking-[0.15em] tabular-nums">
                    <span>{String(infraPairIndex + 1).padStart(2, '0')}</span>
                    <span className="w-6 h-[1px] bg-[#a89474]/40" />
                    <span>{String(totalInfraPairs).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleArrowButton
                      direction="prev"
                      ariaLabel="Previous routes"
                      onClick={() =>
                        setInfraPairIndex((p) => (p - 1 + totalInfraPairs) % totalInfraPairs)
                      }
                    />
                    <CircleArrowButton
                      direction="next"
                      ariaLabel="Next routes"
                      onClick={() =>
                        setInfraPairIndex((p) => (p + 1) % totalInfraPairs)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Right 6 cols: Location Card over Himalayan River/Forest Visual */}
              <div className="lg:col-span-6 relative overflow-hidden aspect-[16/10] bg-[#1f1c18] group">
                <ResilientImage
                  src="/assets/sondaven/698ccba4d091bac674d376b5_%D0%B2%D0%BE%D0%B4%D0%BE%D1%81%D0%BF%D0%B0%D0%B4%20%D0%BF%D1%80%D0%BE%D0%B1%D1%96%D0%B8%CC%86%201.webp"
                  alt="Teesta and Rangeet Himalayan River Valleys"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824]/90 via-[#2c2824]/35 to-transparent p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <span className="font-sd-body text-[10px] tracking-[0.15em] uppercase text-[#a89474]">
                      Corporate Office Location
                    </span>
                    <p className="font-sd-display text-2xl md:text-3xl text-white mt-2 max-w-md">
                      {COMPANY_INFO.address}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <span className="font-sd-body text-[10px] tracking-[0.12em] uppercase text-white/80">
                      {COMPANY_INFO.operatingHours}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsConsultationOpen(true)}
                      className="sd-circle-btn w-28 h-28 md:w-32 md:h-32 text-white hover:bg-white hover:text-[#2c2824] text-[10px] font-sd-body uppercase p-3 text-center cursor-pointer"
                    >
                      Plan With MyTravelExpert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: UNIQUENESS (#uniqueness) — Staggered Editorial Cards
           =================================================================== */}
        <section
          id="uniqueness"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
              <SectionKicker label="Uniqueness" />
              <h3 className="font-sd-display text-5xl sm:text-6xl md:text-7xl mt-6">
                Why MyTravelExpert captivates
              </h3>
            </div>

            {/* Staggered Asymmetric Grid matching Son Daven's 8 Uniqueness Cards */}
            <div className="space-y-16 md:space-y-24">
              {UNIQUENESS_ITEMS.map((item, idx) => {
                const isEven = idx % 2 === 0;
                const isExpanded = expandedUniqId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
                  >
                    <div
                      className={`lg:col-span-7 ${
                        isEven ? 'lg:order-1' : 'lg:order-2'
                      } relative overflow-hidden aspect-[16/10] bg-[#1f1c18] group cursor-pointer`}
                      onClick={() => setExpandedUniqId(isExpanded ? null : item.id)}
                    >
                      <ResilientImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824]/90 via-[#2c2824]/25 to-transparent p-6 md:p-10 flex flex-col justify-between text-white">
                        <div className="flex items-center justify-between">
                          <span className="font-sd-body text-xs tracking-[0.16em] text-[#a89474]">
                            {item.number} / 06
                          </span>
                          <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase border border-white/40 px-3 py-1">
                            {isExpanded ? 'Details Open' : 'Click to Expand'}
                          </span>
                        </div>
                        <h4 className="font-sd-display text-3xl sm:text-4xl md:text-5xl">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <div
                      className={`lg:col-span-5 ${
                        isEven ? 'lg:order-2 lg:pl-6' : 'lg:order-1 lg:pr-6'
                      }`}
                    >
                      <div className="font-sd-body text-[11px] tracking-[0.14em] uppercase text-[#a89474]/60 mb-3">
                        Pillar {item.number}
                      </div>
                      <h5 className="font-sd-display text-2xl md:text-3xl text-[#a89474] mb-6 leading-snug">
                        {item.subtitle}
                      </h5>

                      <ul className="space-y-3 border-y border-[#a89474]/20 py-6 mb-6">
                        {item.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#a89474]/85">
                            <DiamondStar className="w-2 h-2 mt-1.5 shrink-0" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenBookingWithItem(item.title, 15000, 'package')
                          }
                          className="sd-btn text-[#2c2824]"
                          style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
                        >
                          <span className="sd-slide-label">
                            <span>Consultation</span>
                            <span>Consultation</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stepped Pixel Transition: Dark (#2c2824) -> Light (#a89474) */}
        <SteppedTransition fromTheme="dark" toTheme="light" seed={3} />

        {/* ===================================================================
            SECTION 6: EXPEDITION TIMELINE (#commissioning) — theme_on-light
           =================================================================== */}
        <section id="commissioning" className="theme_on-light py-24 md:py-36 px-5 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-sd-display text-5xl sm:text-7xl md:text-8xl uppercase leading-[0.9] flex flex-wrap justify-between gap-4 mb-10">
              <span>Expedition</span>
              <span>Timeline</span>
            </h2>

            <div className="relative aspect-[21/9] w-full overflow-hidden bg-[#2c2824]">
              <ResilientImage
                src="/assets/sondaven/698cc94653ff8ebf3369b0ff_render-2.webp"
                alt="Himalayan Resort Courtyard & Expedition Preparation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824]/75 via-transparent to-transparent flex items-end justify-between p-6 md:p-12 text-[#a89474]">
                <span className="font-sd-display text-6xl sm:text-8xl md:text-9xl leading-none tabular-nums">
                  ‘01
                </span>
                <span className="font-sd-display text-6xl sm:text-8xl md:text-9xl leading-none tabular-nums">
                  ‘07
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-[#2c2824]/20 mt-8">
              <div>
                <p className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#2c2824]/65">
                  Phase 01 · Arrival & Permits
                </p>
                <p className="font-sd-display text-3xl md:text-4xl mt-2">
                  IXB / NJP Pickup & Inner-Line Clearances
                </p>
              </div>
              <div>
                <p className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#2c2824]/65">
                  Phase 02 · High-Altitude Ascent
                </p>
                <p className="font-sd-display text-3xl md:text-4xl mt-2">
                  Tiger Hill, Nathula, Gurudongmar & Paro
                </p>
              </div>
              <div>
                <p className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#2c2824]/65">
                  Phase 03 · Premier Stays & Return
                </p>
                <p className="font-sd-display text-3xl md:text-4xl mt-2">
                  4-Star Mountain Resorts & 24/7 Concierge
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7: APARTMENTS / PACKAGES, HOTELS & CABS SELECTOR (#apartments)
           =================================================================== */}
        <ShowcaseSelector
          onSelectForBooking={handleOpenBookingWithItem}
          onOpenItineraryModal={(pkg) => setActiveItineraryPkg(pkg)}
        />

        {/* Stepped Pixel Transition: Light (#a89474) -> Dark (#2c2824) */}
        <SteppedTransition fromTheme="light" toTheme="dark" seed={4} />

        {/* ===================================================================
            SECTION 8: VALUE & RATE INDICATORS + VIP CLUB (#finance) — theme_on-dark
           =================================================================== */}
        <section id="finance" className="theme_on-dark py-24 md:py-36 overflow-hidden">
          {/* Infinite Marquee Header matching sondaven.com/en .fin-s_title_marquee */}
          <div className="border-y border-[#a89474]/20 py-5 mb-20">
            <div className="animate-sd-marquee flex items-center gap-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-12 shrink-0">
                  <span className="font-sd-display text-4xl md:text-5xl uppercase tracking-tight">
                    Value & Rate Indicators
                  </span>
                  <DiamondStar className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-5 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pb-20 border-b border-[#a89474]/20">
              <div className="lg:col-span-4">
                <h3 className="font-sd-display text-4xl md:text-5xl leading-tight">
                  Seasonal Deals Active
                </h3>
                <h4 className="font-sd-body text-sm tracking-[0.14em] uppercase text-[#a89474]/70 mt-2">
                  2026 — 2027 Himalayan Calendar
                </h4>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="border-l border-[#a89474]/25 pl-5">
                  <h4 className="font-sd-body text-[11px] tracking-[0.12em] uppercase text-[#a89474]/65">
                    VIP Club First Booking:
                  </h4>
                  <p className="font-sd-display text-5xl md:text-6xl mt-3 tabular-nums">10% OFF</p>
                </div>

                <div className="border-l border-[#a89474]/25 pl-5">
                  <h4 className="font-sd-body text-[11px] tracking-[0.12em] uppercase text-[#a89474]/65">
                    Special Package Savings:
                  </h4>
                  <p className="font-sd-display text-5xl md:text-6xl mt-3 tabular-nums">Up to 25%</p>
                </div>

                <div className="border-l border-[#a89474]/25 pl-5">
                  <h4 className="font-sd-body text-[11px] tracking-[0.12em] uppercase text-[#a89474]/65">
                    Package Tariffs From:
                  </h4>
                  <p className="font-sd-display text-5xl md:text-6xl mt-3 tabular-nums">₹7,500</p>
                </div>

                <div className="border-l border-[#a89474]/25 pl-5">
                  <h4 className="font-sd-body text-[11px] tracking-[0.12em] uppercase text-[#a89474]/65">
                    Verified Guest Rating:
                  </h4>
                  <p className="font-sd-display text-5xl md:text-6xl mt-3 tabular-nums">4.9 / 5</p>
                </div>
              </div>
            </div>

            {/* Our Guarantee & VIP Club 10% Off Subscription from mytravelexpert.co.in */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-16 items-start">
              <div className="lg:col-span-5">
                <h3 className="font-sd-display text-3xl md:text-4xl mb-6">
                  VIP Club — Get 10% Off Your First Booking
                </h3>
                <p className="text-sm text-[#a89474]/80 mb-6 leading-relaxed">
                  Subscribe to the MyTravelExpert VIP Club newsletter and unlock an instant 10% discount voucher plus exclusive luxury travel deals for Darjeeling, Sikkim, and Bhutan.
                </p>

                {vipSubscribed ? (
                  <div className="p-4 border border-[#a89474] bg-[#a89474]/10 font-sd-body text-xs tracking-[0.1em]">
                    ✦ VIP CLUB ACTIVATED FOR {vipEmail.toUpperCase()} — USE CODE: MTEVIP10 (10% OFF)
                  </div>
                ) : (
                  <form onSubmit={handleVipSubscribe} className="flex flex-col sm:flex-row gap-3" noValidate>
                    <label htmlFor="vip-email" className="sr-only">
                      Enter your email address
                    </label>
                    <input
                      id="vip-email"
                      type="email"
                      value={vipEmail}
                      onChange={(e) => setVipEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL ADDRESS"
                      className="flex-1 bg-transparent border border-[#a89474]/40 px-4 py-3 text-xs font-sd-body text-[#a89474] placeholder-[#a89474]/40 focus:outline-none focus:border-[#a89474]"
                    />
                    <button
                      type="submit"
                      className="sd-btn text-[#2c2824]"
                      style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
                    >
                      <span>Subscribe</span>
                    </button>
                  </form>
                )}
                {vipError && <p className="text-[#e23d3d] text-xs mt-2">{vipError}</p>}
              </div>

              <div className="lg:col-span-7 lg:pl-10">
                <h3 className="font-sd-display text-3xl md:text-4xl mb-6">
                  Additional Concierge Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-5 border border-[#a89474]/20">
                    <DiamondStar className="w-3 h-3 mb-3" />
                    <p className="text-sm leading-relaxed">
                      100% Verified Local Hill Drivers & 24/7 Emergency Road Support
                    </p>
                  </div>
                  <div className="p-5 border border-[#a89474]/20">
                    <DiamondStar className="w-3 h-3 mb-3" />
                    <p className="text-sm leading-relaxed">
                      Year-round departures across Spring, Summer, Autumn & Snow Seasons
                    </p>
                  </div>
                  <div className="p-5 border border-[#a89474]/20">
                    <DiamondStar className="w-3 h-3 mb-3" />
                    <p className="text-sm leading-relaxed">
                      Zero-hassle Inner Line Permits for North Sikkim, Nathula & Bhutan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 9: SEASONS INTERACTIVE SWITCHER (#seasons) — theme_on-dark
           =================================================================== */}
        <section
          id="seasons"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col items-center text-center">
              <span className="font-sd-body text-[11px] tracking-[0.16em] uppercase text-[#a89474]/60 mb-6">
                Select Season to Explore
              </span>

              {/* Summer / Winter Interactive Circular Switcher matching sondaven.com/en */}
              <div className="inline-flex items-center gap-6 mb-14">
                <button
                  type="button"
                  onClick={() => setActiveSeason('summer')}
                  aria-pressed={activeSeason === 'summer'}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border font-sd-body text-xs tracking-[0.14em] uppercase transition-all cursor-pointer ${
                    activeSeason === 'summer'
                      ? 'bg-[#a89474] text-[#2c2824] border-[#a89474]'
                      : 'border-[#a89474]/35 text-[#a89474] hover:border-[#a89474]'
                  }`}
                >
                  <span>☀</span>
                  <span>Summer & Spring</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSeason('winter')}
                  aria-pressed={activeSeason === 'winter'}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border font-sd-body text-xs tracking-[0.14em] uppercase transition-all cursor-pointer ${
                    activeSeason === 'winter'
                      ? 'bg-[#a89474] text-[#2c2824] border-[#a89474]'
                      : 'border-[#a89474]/35 text-[#a89474] hover:border-[#a89474]'
                  }`}
                >
                  <span>❄</span>
                  <span>Winter & Autumn</span>
                </button>
              </div>

              <div className="relative w-full aspect-[21/9] overflow-hidden mb-12 bg-[#1f1c18]">
                <ResilientImage
                  src={
                    activeSeason === 'summer'
                      ? '/assets/mte/1786814082_6950.webp'
                      : '/assets/mte/1787324441_8786.webp'
                  }
                  alt={
                    activeSeason === 'summer'
                      ? 'Yumthang Valley of Flowers and Emerald Darjeeling Tea Slopes in Summer'
                      : 'Snow-Clad Gurudongmar Lake, Zero Point and Clear Kanchenjunga Peaks in Winter'
                  }
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824] via-transparent to-transparent" />
              </div>

              <h2
                className="font-sd-display text-3xl sm:text-5xl md:text-6xl max-w-4xl leading-[1.05]"
                style={{ textWrap: 'balance' }}
              >
                {activeSeason === 'summer'
                  ? 'Summer & Spring turn the Himalayas into a blooming adventure map: Yumthang Valley rhododendrons, First-Flush Darjeeling tea estates, Teesta river rafting, and Dooars wildlife safaris.'
                  : 'Autumn & Winter unveil crystal-clear golden sunrises over Mount Kanchenjunga at Tiger Hill, pristine snowfields at Zero Point & Nathula Pass, and sacred Tshechu festivals across Bhutan.'}
              </h2>

              <div className="mt-10">
                <button
                  type="button"
                  onClick={() =>
                    handleOpenBookingWithItem(
                      activeSeason === 'summer'
                        ? 'Summer Special: Sikkim Yumthang & Darjeeling Escape'
                        : 'Winter & Autumn Special: Kanchenjunga Sunrise & Zero Point Snow Tour',
                      16500,
                      'package'
                    )
                  }
                  className="sd-btn text-[#2c2824]"
                  style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
                >
                  <span className="sd-slide-label">
                    <span>Consultation</span>
                    <span>Consultation</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 10: OPERATOR & FACTOIDS (#developer & #factoids) — theme_on-dark
           =================================================================== */}
        <section
          id="developer"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <SectionKicker label="Regional Travel Authority" />
              <h3
                className="font-sd-display text-4xl sm:text-5xl md:text-6xl max-w-4xl mt-8 leading-[1.02]"
                style={{ textWrap: 'balance' }}
              >
                A Himalayan legend brought to life in the heart of Bagdogra & Darjeeling, uniting local mountain expertise and luxury comfort
              </h3>
            </div>

            <div className="max-w-2xl mx-auto text-center mb-20">
              <p className="text-sm md:text-base text-[#a89474]/80 leading-relaxed">
                MyTravelExpert creates a seamless travel ecosystem where a holiday means more than just hotel bookings—it is a combination of verified mountain drivers, inner-line permit mastery, handpicked viewpoint stays, and 24x7 people-focused concierge care.
              </p>
            </div>

            {/* 4 Monumental Factoid Cards matching sondaven.com/en #factoids */}
            <div id="factoids" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMPANY_INFO.stats.map((st, i) => (
                <div
                  key={i}
                  className={`border border-[#a89474]/20 p-8 md:p-10 flex flex-col justify-between min-h-[260px] bg-[#2c2824] ${
                    i % 2 === 1 ? 'lg:translate-y-8' : ''
                  }`}
                >
                  <h4 className="font-sd-display text-7xl md:text-8xl text-center tabular-nums">
                    {st.value}
                  </h4>
                  <p className="font-sd-body text-[11px] tracking-[0.12em] uppercase text-center text-[#a89474]/80 mt-6">
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 11: PROJECT GALLERY (#gallery) — theme_on-dark
           =================================================================== */}
        <section
          id="gallery"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <h2 className="font-sd-display text-6xl sm:text-7xl md:text-8xl uppercase leading-[0.88]">
                <span className="block">Expedition</span>
                <span className="block pl-12 md:pl-24">Gallery</span>
              </h2>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 font-sd-body text-xs tracking-[0.15em] tabular-nums">
                  <span>{String(galleryIndex + 1).padStart(2, '0')}</span>
                  <span className="w-6 h-[1px] bg-[#a89474]/40" />
                  <span>{String(GALLERY_SLIDES.length).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircleArrowButton
                    direction="prev"
                    ariaLabel="Previous gallery slide"
                    onClick={() =>
                      setGalleryIndex(
                        (i) => (i - 1 + GALLERY_SLIDES.length) % GALLERY_SLIDES.length
                      )
                    }
                  />
                  <CircleArrowButton
                    direction="next"
                    ariaLabel="Next gallery slide"
                    onClick={() =>
                      setGalleryIndex((i) => (i + 1) % GALLERY_SLIDES.length)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Active Main Gallery Frame + Thumbnail Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden bg-[#1f1c18]">
                <ResilientImage
                  src={GALLERY_SLIDES[galleryIndex].src}
                  alt={GALLERY_SLIDES[galleryIndex].title}
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824]/85 via-transparent to-transparent p-6 md:p-10 flex flex-col justify-end text-white">
                  <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]">
                    {GALLERY_SLIDES[galleryIndex].tag}
                  </span>
                  <h3 className="font-sd-display text-3xl md:text-5xl mt-1">
                    {GALLERY_SLIDES[galleryIndex].title}
                  </h3>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between border border-[#a89474]/20 p-6 md:p-8">
                <div>
                  <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/60 block mb-4">
                    Visual Archive ({GALLERY_SLIDES.length} Moments)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {GALLERY_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setGalleryIndex(idx)}
                        className={`relative aspect-[16/10] overflow-hidden border transition-all cursor-pointer ${
                          idx === galleryIndex
                            ? 'border-[#a89474] scale-[1.02]'
                            : 'border-transparent opacity-55 hover:opacity-90'
                        }`}
                      >
                        <ResilientImage
                          src={slide.src}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#a89474]/15 flex items-center justify-between gap-4">
                  <p className="text-xs text-[#a89474]/80 leading-relaxed">
                    MyTravelExpert is designed to restore energy, inspire, and prove that true Himalayan relaxation is a state of mind.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsConsultationOpen(true)}
                    className="sd-circle-btn w-24 h-24 shrink-0 text-[10px] font-sd-body uppercase text-center p-2 hover:bg-[#a89474] hover:text-[#2c2824] cursor-pointer"
                  >
                    Book Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 12: BLOG / TRAVEL STORIES & GUIDES (#blog) — theme_on-dark
           =================================================================== */}
        <section
          id="blog"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col items-center text-center mb-14">
              <SectionKicker label="Blog" />
              <h3 className="font-sd-display text-5xl sm:text-6xl md:text-7xl mt-6">
                Travel Stories and Guides
              </h3>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {(['All', 'Destination Guides', 'Trekking'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBlogTab(tab)}
                    className={`px-4 py-2 font-sd-body text-[11px] tracking-[0.12em] uppercase border transition-colors cursor-pointer ${
                      blogTab === tab
                        ? 'bg-[#a89474] text-[#2c2824] border-[#a89474]'
                        : 'border-[#a89474]/30 text-[#a89474] hover:border-[#a89474]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredBlogs.map((story) => (
                <article
                  key={story.id}
                  onClick={() => setActiveBlogStory(story)}
                  className="border border-[#a89474]/20 bg-[#2c2824] flex flex-col justify-between group cursor-pointer hover:border-[#a89474] transition-colors"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-[#1f1c18]">
                      <ResilientImage
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 font-sd-body text-[10px] tracking-[0.12em] uppercase text-[#a89474]/60">
                        <span>{story.category}</span>
                        <span>·</span>
                        <span>{story.date}</span>
                        <span>·</span>
                        <span>{story.readTime}</span>
                      </div>
                      <h4 className="font-sd-display text-2xl md:text-3xl mt-3 leading-snug group-hover:underline">
                        {story.title}
                      </h4>
                      <p className="text-sm text-[#a89474]/75 mt-3 leading-relaxed">
                        {story.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-3 border-t border-[#a89474]/15 flex items-center justify-between font-sd-body text-[11px] tracking-[0.12em] uppercase">
                    <span>Read Full Guide</span>
                    <span>→</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 13: BECOME PART OF THE LEGEND CTA (#cta) — Floating Bronze Card
           =================================================================== */}
        <section id="cta" className="relative py-28 md:py-40 px-5 md:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ResilientImage
              src="/assets/sondaven/698cca9e68d0f430d651e880_5f67ba47017f9fe81611b9dd3fc2824b_render-1.webp"
              alt="Himalayan Architectural Retreat"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#2c2824]/60" />
          </div>

          <div className="relative z-10 max-w-lg mx-auto theme_on-light bg-[#a89474] text-[#2c2824] p-8 md:p-14 text-center shadow-2xl">
            <p className="font-sd-body text-[11px] tracking-[0.12em] uppercase leading-relaxed text-[#2c2824]/85">
              Every traveler becomes part of a bespoke Himalayan expedition that redefines leisure, elevating it to a level of sensations, mountain aesthetics, and meaning.
            </p>

            <div className="flex items-center justify-center gap-2 my-6">
              <DiamondStar className="w-2.5 h-2.5" />
              <DiamondStar className="w-2.5 h-2.5" />
              <DiamondStar className="w-2.5 h-2.5" />
            </div>

            <h2 className="font-sd-display text-4xl md:text-5xl mb-8">
              Become part of the legend
            </h2>

            <button
              type="button"
              onClick={() => setIsConsultationOpen(true)}
              className="sd-btn text-[#a89474]"
            >
              <span className="sd-slide-label">
                <span>Consultation</span>
                <span>Consultation</span>
              </span>
            </button>

            <div className="mt-10 pt-6 border-t border-[#2c2824]/20 space-y-2 font-sd-body text-xs tracking-[0.1em]">
              <div>
                <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:underline">
                  {COMPANY_INFO.phone}
                </a>
              </div>
              <div>
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline lowercase">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 14: F — A — Q ACCORDION (#faq) — Exact Son Daven Layout
           =================================================================== */}
        <section
          id="faq"
          className="theme_on-dark py-24 md:py-36 px-5 md:px-12 border-t border-[#a89474]/15"
        >
          <div className="max-w-[1400px] mx-auto">
            {/* Monumental F — A — Q Header matching sondaven.com/en */}
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[#a89474]/20 pb-12 mb-12">
              <span className="font-sd-display text-7xl sm:text-8xl md:text-9xl leading-none">
                F
              </span>
              <span className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#a89474]/75">
                Answers to
                <br />
                key questions
              </span>
              <span className="font-sd-display text-7xl sm:text-8xl md:text-9xl leading-none">
                A
              </span>
              <span className="hidden sm:inline-block font-sd-body text-xs tracking-[0.14em] uppercase text-center text-[#a89474]/75">
                All you need
                <br />
                to know
              </span>
              <span className="font-sd-display text-7xl sm:text-8xl md:text-9xl leading-none">
                Q
              </span>
            </div>

            {/* Numbered Accordion List */}
            <div className="divide-y divide-[#a89474]/20">
              {FAQ_ITEMS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-6">
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                      aria-expanded={isOpen}
                      className="w-full flex items-baseline justify-between gap-6 text-left group cursor-pointer"
                    >
                      <div className="flex items-baseline gap-6 md:gap-12">
                        <span className="font-sd-body text-xs tracking-[0.14em] text-[#a89474]/55 tabular-nums">
                          {faq.index}
                        </span>
                        <h4 className="font-sd-display text-2xl sm:text-3xl md:text-4xl group-hover:translate-x-2 transition-transform">
                          {faq.question}
                        </h4>
                      </div>
                      <span className="font-sd-body text-lg shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pl-10 md:pl-20 pr-4 pt-4 max-w-3xl text-sm md:text-base text-[#a89474]/85 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          SECTION 15: FOOTER — Exact Son Daven Architectural Footer
         ===================================================================== */}
      <footer className="theme_on-dark border-t border-[#a89474]/20 pt-20 pb-12 px-5 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#a89474]/15">
            {/* Corporate Office */}
            <div className="md:col-span-5">
              <h3 className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#a89474]/60 mb-3">
                Corporate Office Location
              </h3>
              <p className="font-sd-display text-2xl md:text-3xl leading-snug max-w-md">
                {COMPANY_INFO.address}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <a
                  href={COMPANY_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#a89474]/30 font-sd-body text-[11px] tracking-[0.12em] uppercase hover:bg-[#a89474] hover:text-[#2c2824] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={COMPANY_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#a89474]/30 font-sd-body text-[11px] tracking-[0.12em] uppercase hover:bg-[#a89474] hover:text-[#2c2824] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-[#a89474]/30 font-sd-body text-[11px] tracking-[0.12em] uppercase hover:bg-[#a89474] hover:text-[#2c2824] transition-colors"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </div>

            {/* Regional Hubs & Operating Hours */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#a89474]/60 mb-3">
                  Primary Expedition Hubs
                </h3>
                <ul className="space-y-2 font-sd-display text-2xl">
                  <li>Bagdogra Airport (IXB) & NJP</li>
                  <li>Darjeeling · Kalimpong · Mirik</li>
                  <li>Gangtok · Lachung · Lachen · Pelling</li>
                  <li>Phuentsholing · Thimphu · Paro (Bhutan)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-sd-body text-xs tracking-[0.14em] uppercase text-[#a89474]/60 mb-3">
                  Operating Hours & Trust
                </h3>
                <p className="font-sd-display text-2xl">
                  Monday – Saturday: 8:00 AM – 8:00 PM
                </p>
                <p className="font-sd-body text-xs tracking-[0.1em] text-[#a89474]/70 mt-1">
                  Sunday: Closed (24x7 Active Tour Support)
                </p>
                <div className="mt-6 font-sd-body text-[11px] tracking-[0.12em] text-[#a89474]/70 space-y-1">
                  <div>✓ 100% VERIFIED LOCAL OPERATOR</div>
                  <div>✓ BEST RATE GUARANTEE · SSL ENCRYPTED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Giant Phone & Email Links matching sondaven.com/en footer */}
          <div className="py-12 border-b border-[#a89474]/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="font-sd-display text-4xl sm:text-5xl md:text-6xl hover:opacity-80 transition-opacity tabular-nums"
            >
              {COMPANY_INFO.phone}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="font-sd-display text-2xl sm:text-4xl md:text-5xl hover:opacity-80 transition-opacity break-all"
            >
              {COMPANY_INFO.email}
            </a>
          </div>

          {/* Monumental Carved Footer Logo */}
          <div className="my-12">
            <CarvedMonumentLogo text="MY TRAVEL EXPERT" variant="footer" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 font-sd-body text-[11px] tracking-[0.12em] uppercase text-[#a89474]/65">
            <span>© 2026 {COMPANY_INFO.shortName}. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#about" className="hover:text-[#a89474]">
                About Us
              </a>
              <a href="#apartments" className="hover:text-[#a89474]">
                Tour Packages (16)
              </a>
              <button
                type="button"
                onClick={() => setIsConsultationOpen(true)}
                className="hover:text-[#a89474] uppercase cursor-pointer"
              >
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          INTERACTIVE MODALS (Menu, Consultation/Booking, Itinerary, Blog)
         ===================================================================== */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialSubject={bookingSubject}
        initialBasePrice={bookingBasePrice}
        savedInquiries={savedInquiries}
        onSaveInquiry={(rec) => setSavedInquiries((prev) => [rec, ...prev])}
      />

      <ItineraryDetailModal
        pkg={activeItineraryPkg}
        onClose={() => setActiveItineraryPkg(null)}
        onBookPackage={(pkg) =>
          handleOpenBookingWithItem(pkg.title, pkg.price, 'package')
        }
      />

      <BlogReaderModal
        story={activeBlogStory}
        onClose={() => setActiveBlogStory(null)}
        onOpenConsultation={() => setIsConsultationOpen(true)}
      />
    </div>
  );
}
