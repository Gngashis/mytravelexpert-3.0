import React, { useState, useMemo } from 'react';
import {
  TOUR_PACKAGES,
  LUXURY_HOTELS,
  TAXI_FLEET,
  TourPackage,
  LuxuryHotel,
  TaxiCab
} from '../data/travelData';
import {
  filterAndSortPackages,
  filterHotels,
  filterCabs,
  SortOption
} from '../utils/bookingLogic';
import { SectionKicker, CircleArrowButton, ResilientImage, DiamondStar } from './CarvedLogo';

type ShowcaseCategory =
  | 'Darjeeling'
  | 'Sikkim'
  | 'Bhutan'
  | 'Kalimpong & Silk Route'
  | 'Dooars'
  | 'Luxury Stays'
  | 'Taxi & Cabs';

const CATEGORIES: { id: ShowcaseCategory; label: string; countLabel: string }[] = [
  { id: 'Darjeeling', label: 'Darjeeling', countLabel: '04 Packages' },
  { id: 'Sikkim', label: 'Sikkim', countLabel: '06 Packages' },
  { id: 'Bhutan', label: 'Bhutan', countLabel: '03 Packages' },
  { id: 'Kalimpong & Silk Route', label: 'Silk Route', countLabel: '02 Packages' },
  { id: 'Dooars', label: 'Dooars', countLabel: '01 Package' },
  { id: 'Luxury Stays', label: 'Luxury Stays', countLabel: '06 Hotels' },
  { id: 'Taxi & Cabs', label: 'Mountain Cabs', countLabel: '13+ Fleet' }
];

interface ShowcaseSelectorProps {
  onSelectForBooking: (itemTitle: string, basePrice: number, itemType: 'package' | 'hotel' | 'cab') => void;
  onOpenItineraryModal: (pkg: TourPackage) => void;
}

export const ShowcaseSelector: React.FC<ShowcaseSelectorProps> = ({
  onSelectForBooking,
  onOpenItineraryModal
}) => {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory>('Darjeeling');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [durationFilter, setDurationFilter] = useState<'all' | '1-3' | '4-5' | '6+'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showAllPackagesGrid, setShowAllPackagesGrid] = useState<boolean>(false);

  // Filtered items based on active category
  const currentPackages = useMemo(() => {
    if (activeCategory === 'Luxury Stays' || activeCategory === 'Taxi & Cabs') return [];
    const regionFilter = showAllPackagesGrid ? 'All' : activeCategory;
    return filterAndSortPackages(TOUR_PACKAGES, {
      region: regionFilter,
      searchQuery,
      durationRange: durationFilter,
      sortBy
    });
  }, [activeCategory, showAllPackagesGrid, searchQuery, durationFilter, sortBy]);

  const currentHotels = useMemo(() => {
    return filterHotels(LUXURY_HOTELS, 'All', searchQuery);
  }, [searchQuery]);

  const currentCabs = useMemo(() => {
    return filterCabs(TAXI_FLEET, 'All', 'All').filter((c) =>
      searchQuery
        ? `${c.name} ${c.brand} ${c.location}`.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );
  }, [searchQuery]);

  const activeListLength =
    activeCategory === 'Luxury Stays'
      ? currentHotels.length
      : activeCategory === 'Taxi & Cabs'
      ? currentCabs.length
      : currentPackages.length;

  const safeIndex = activeListLength > 0 ? Math.min(selectedIndex, activeListLength - 1) : 0;

  const handleCategoryChange = (cat: ShowcaseCategory) => {
    setActiveCategory(cat);
    setSelectedIndex(0);
    setShowAllPackagesGrid(false);
  };

  const handlePrev = () => {
    if (activeListLength === 0) return;
    setSelectedIndex((prev) => (prev - 1 + activeListLength) % activeListLength);
  };

  const handleNext = () => {
    if (activeListLength === 0) return;
    setSelectedIndex((prev) => (prev + 1) % activeListLength);
  };

  const selectedPackage: TourPackage | undefined =
    activeCategory !== 'Luxury Stays' && activeCategory !== 'Taxi & Cabs'
      ? currentPackages[safeIndex] || TOUR_PACKAGES[0]
      : undefined;

  const selectedHotel: LuxuryHotel | undefined =
    activeCategory === 'Luxury Stays' ? currentHotels[safeIndex] || LUXURY_HOTELS[0] : undefined;

  const selectedCab: TaxiCab | undefined =
    activeCategory === 'Taxi & Cabs' ? currentCabs[safeIndex] || TAXI_FLEET[0] : undefined;

  return (
    <section
      id="apartments"
      className="theme_on-light py-24 md:py-36 px-5 md:px-12 border-t border-[#2c2824]/15"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section Header (Matches Son Daven's Apartments intro) */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionKicker label="Curated Expeditions, Stays & Fleet" />
          <h2
            className="font-sd-display text-3xl sm:text-5xl md:text-6xl max-w-5xl mt-8 leading-[1.02] tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            Two- to seven-day bespoke Himalayan itineraries, premier viewpoint resorts, and 4x4 mountain transfers designed for solo travelers, couples, or families.
          </h2>
          <p className="font-sd-body text-xs md:text-sm tracking-[0.12em] uppercase text-[#2c2824]/75 mt-8 max-w-2xl">
            Every journey features trusted local expertise from Bagdogra (IXB) & NJP with up to 25% seasonal savings.
          </p>
        </div>

        {/* Filter & Search Bar for Instant Package/Stay Discovery */}
        <div className="mb-12 pb-6 border-b border-[#2c2824]/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pkg-search" className="sr-only">
              Search packages, stays, or cabs
            </label>
            <input
              id="pkg-search"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="SEARCH DARJEELING, SIKKIM, BHUTAN, HOTELS..."
              className="bg-[#2c2824]/10 border border-[#2c2824]/25 px-4 py-2.5 text-xs font-sd-body tracking-[0.08em] text-[#2c2824] placeholder-[#2c2824]/50 focus:outline-none focus:border-[#2c2824] w-64 sm:w-80"
            />
            {activeCategory !== 'Luxury Stays' && activeCategory !== 'Taxi & Cabs' && (
              <>
                <select
                  aria-label="Filter by duration"
                  value={durationFilter}
                  onChange={(e) => {
                    setDurationFilter(e.target.value as 'all' | '1-3' | '4-5' | '6+');
                    setSelectedIndex(0);
                  }}
                  className="bg-[#2c2824]/10 border border-[#2c2824]/25 px-3 py-2.5 text-xs font-sd-body tracking-[0.08em] text-[#2c2824] focus:outline-none cursor-pointer"
                >
                  <option value="all">ALL DURATIONS</option>
                  <option value="1-3">1 – 3 DAYS</option>
                  <option value="4-5">4 – 5 DAYS</option>
                  <option value="6+">6 – 7 DAYS</option>
                </select>
                <select
                  aria-label="Sort packages"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as SortOption);
                    setSelectedIndex(0);
                  }}
                  className="bg-[#2c2824]/10 border border-[#2c2824]/25 px-3 py-2.5 text-xs font-sd-body tracking-[0.08em] text-[#2c2824] focus:outline-none cursor-pointer"
                >
                  <option value="featured">SORT: FEATURED</option>
                  <option value="price-asc">PRICE: LOW TO HIGH</option>
                  <option value="price-desc">PRICE: HIGH TO LOW</option>
                  <option value="duration-asc">DURATION: SHORT TO LONG</option>
                </select>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (activeCategory === 'Luxury Stays' || activeCategory === 'Taxi & Cabs') {
                  setActiveCategory('Darjeeling');
                }
                setShowAllPackagesGrid((prev) => !prev);
              }}
              className="px-4 py-2.5 border border-[#2c2824] text-xs font-sd-body tracking-[0.1em] uppercase hover:bg-[#2c2824] hover:text-[#a89474] transition-colors cursor-pointer whitespace-nowrap"
            >
              {showAllPackagesGrid ? 'Focus Single View' : `View All ${TOUR_PACKAGES.length} Packages Grid`}
            </button>
          </div>
        </div>

        {/* Main 12-Column Son Daven Apartments Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Column 1 (3 cols): "TYPES" Vertical Navigation matching sondaven.com/en */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#2c2824]/20 pb-8 lg:pb-0 lg:pr-6">
            <div className="font-sd-body text-[11px] tracking-[0.16em] uppercase text-[#2c2824]/60 mb-6">
              Categories
            </div>
            <ul className="space-y-2" role="tablist" aria-label="Travel Categories">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id && !showAllPackagesGrid;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left py-2.5 flex items-baseline justify-between gap-3 group cursor-pointer transition-all ${
                        isActive
                          ? 'text-[#2c2824] translate-x-1.5'
                          : 'text-[#2c2824]/45 hover:text-[#2c2824]/80'
                      }`}
                    >
                      <span className="font-sd-display text-2xl xl:text-3xl tracking-tight whitespace-nowrap">
                        {cat.label}
                      </span>
                      <span className="font-sd-body text-[10px] tracking-[0.08em] opacity-75 whitespace-nowrap shrink-0">
                        {cat.countLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Sub-item selector pills inside the active category */}
            <div className="mt-8 pt-6 border-t border-[#2c2824]/15">
              <div className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#2c2824]/60 mb-3">
                Select {activeCategory} Item ({ safeIndex + 1 } / { Math.max(1, activeListLength) })
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {activeCategory !== 'Luxury Stays' &&
                  activeCategory !== 'Taxi & Cabs' &&
                  currentPackages.map((pkg, idx) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2 text-xs font-sd-body tracking-[0.06em] transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        idx === safeIndex
                          ? 'bg-[#2c2824] text-[#a89474]'
                          : 'bg-[#2c2824]/5 text-[#2c2824] hover:bg-[#2c2824]/15'
                      }`}
                    >
                      <span className="truncate">{pkg.title}</span>
                      <span className="shrink-0 tabular-nums">₹{pkg.price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}

                {activeCategory === 'Luxury Stays' &&
                  currentHotels.map((hotel, idx) => (
                    <button
                      key={hotel.id}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2 text-xs font-sd-body tracking-[0.06em] transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        idx === safeIndex
                          ? 'bg-[#2c2824] text-[#a89474]'
                          : 'bg-[#2c2824]/5 text-[#2c2824] hover:bg-[#2c2824]/15'
                      }`}
                    >
                      <span className="truncate">{hotel.name}</span>
                      <span className="shrink-0 tabular-nums">₹{hotel.pricePerNight}/nt</span>
                    </button>
                  ))}

                {activeCategory === 'Taxi & Cabs' &&
                  currentCabs.map((cab, idx) => (
                    <button
                      key={cab.id}
                      type="button"
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2 text-xs font-sd-body tracking-[0.06em] transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        idx === safeIndex
                          ? 'bg-[#2c2824] text-[#a89474]'
                          : 'bg-[#2c2824]/5 text-[#2c2824] hover:bg-[#2c2824]/15'
                      }`}
                    >
                      <span className="truncate">{cab.name}</span>
                      <span className="shrink-0 tabular-nums">₹{cab.baseFare}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Column 2 (4 cols): Detailed Specification Panel (Matches Son Daven's From 37 m2 / Price / Specs) */}
          <div className="lg:col-span-4 flex flex-col justify-between min-h-[480px]">
            {selectedPackage && (
              <>
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#2c2824]/20 pb-5">
                    <div className="shrink-0">
                      <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase text-[#2c2824]/65 block">
                        Duration · {selectedPackage.region}
                      </span>
                      <h3 className="font-sd-display text-3xl xl:text-4xl mt-1 tabular-nums whitespace-nowrap">
                        {selectedPackage.nights}N / {selectedPackage.days}D
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-sd-body text-[11px] tracking-[0.12em] line-through text-[#2c2824]/55 tabular-nums block whitespace-nowrap">
                        ₹{selectedPackage.originalPrice.toLocaleString('en-IN')} ({selectedPackage.discountPercent}% OFF)
                      </span>
                      <div className="font-sd-display text-2xl xl:text-3xl tabular-nums whitespace-nowrap">
                        ₹{selectedPackage.price.toLocaleString('en-IN')}{' '}
                        <span className="font-sd-body text-[10px] tracking-[0.08em] uppercase">/ person</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="font-sd-body text-xs tracking-[0.12em] uppercase text-[#2c2824]/70 mb-4">
                      {selectedPackage.pax} Pax Standard · {selectedPackage.difficulty} Grade · {selectedPackage.rating}★ Verified
                    </div>
                    <h4 className="font-sd-display text-2xl md:text-3xl mb-4">
                      {selectedPackage.title}
                    </h4>
                    <ul className="space-y-2.5 border-y border-[#2c2824]/15 py-5">
                      {selectedPackage.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-sd-body tracking-[0.04em] normal-case">
                          <DiamondStar className="w-2 h-2 mt-1.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <p className="text-sm leading-relaxed text-[#2c2824]/85 mb-6">
                    {selectedPackage.overview}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        onSelectForBooking(selectedPackage.title, selectedPackage.price, 'package')
                      }
                      className="sd-btn text-[#a89474]"
                    >
                      <span className="sd-slide-label">
                        <span>Inquire / Book Now</span>
                        <span>Inquire / Book Now</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenItineraryModal(selectedPackage)}
                      className="inline-flex items-center gap-3 group cursor-pointer"
                    >
                      <span className="w-10 h-10 rounded-full border border-[#2c2824] flex items-center justify-center group-hover:bg-[#2c2824] group-hover:text-[#a89474] transition-colors">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
                          <path d="M5 3L12 8L5 13V3Z" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="font-sd-body text-[11px] tracking-[0.12em] uppercase underline underline-offset-4">
                        Day-by-Day Itinerary ({selectedPackage.itinerary.length} Days)
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedHotel && (
              <>
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#2c2824]/20 pb-5">
                    <div>
                      <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase text-[#2c2824]/65 block">
                        {selectedHotel.category}
                      </span>
                      <h3 className="font-sd-display text-3xl md:text-4xl mt-1">
                        {selectedHotel.city}, {selectedHotel.state}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-sd-body text-[11px] tracking-[0.12em] text-[#2c2824]/60 block">
                        {selectedHotel.rating}★ RATED STAY
                      </span>
                      <div className="font-sd-display text-3xl md:text-4xl tabular-nums">
                        ₹{selectedHotel.pricePerNight.toLocaleString('en-IN')}{' '}
                        <span className="font-sd-body text-[10px] tracking-[0.1em] uppercase">/ night</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-sd-display text-2xl md:text-3xl mb-4">
                      {selectedHotel.name}
                    </h4>
                    <ul className="space-y-2.5 border-y border-[#2c2824]/15 py-5">
                      {selectedHotel.features.map((ft, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-sd-body tracking-[0.04em] normal-case">
                          <DiamondStar className="w-2 h-2 mt-1.5 shrink-0" />
                          <span>{ft}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <p className="text-sm leading-relaxed text-[#2c2824]/85 mb-6">
                    {selectedHotel.description}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectForBooking(
                        `${selectedHotel.name} (${selectedHotel.city})`,
                        selectedHotel.pricePerNight,
                        'hotel'
                      )
                    }
                    className="sd-btn text-[#a89474]"
                  >
                    <span className="sd-slide-label">
                      <span>Reserve Luxury Stay</span>
                      <span>Reserve Luxury Stay</span>
                    </span>
                  </button>
                </div>
              </>
            )}

            {selectedCab && (
              <>
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-[#2c2824]/20 pb-5">
                    <div>
                      <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase text-[#2c2824]/65 block">
                        {selectedCab.brand} · {selectedCab.year} Model
                      </span>
                      <h3 className="font-sd-display text-3xl md:text-4xl mt-1 tabular-nums">
                        {selectedCab.seats} Seats · {selectedCab.bags} Bags
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-sd-body text-[11px] tracking-[0.12em] text-[#2c2824]/60 block">
                        HUB: {selectedCab.location}
                      </span>
                      <div className="font-sd-display text-3xl md:text-4xl tabular-nums">
                        ₹{selectedCab.baseFare.toLocaleString('en-IN')}{' '}
                        <span className="font-sd-body text-[10px] tracking-[0.1em] uppercase">base fare</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-sd-display text-2xl md:text-3xl mb-4">
                      {selectedCab.name} {selectedCab.ac ? '(AC)' : '(Touring)'}
                    </h4>
                    <ul className="space-y-2.5 border-y border-[#2c2824]/15 py-5">
                      {selectedCab.features.map((ft, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-sd-body tracking-[0.04em] normal-case">
                          <DiamondStar className="w-2 h-2 mt-1.5 shrink-0" />
                          <span>{ft}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <p className="text-sm leading-relaxed text-[#2c2824]/85 mb-6">
                    24/7 hill-certified local driver service across Bagdogra (IXB), NJP, Siliguri, Darjeeling, Gangtok, and Thimphu.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      onSelectForBooking(
                        `Taxi: ${selectedCab.name} (${selectedCab.seats} Seats, ${selectedCab.location})`,
                        selectedCab.baseFare,
                        'cab'
                      )
                    }
                    className="sd-btn text-[#a89474]"
                  >
                    <span className="sd-slide-label">
                      <span>Book Mountain Cab</span>
                      <span>Book Mountain Cab</span>
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Column 3 (5 cols): Visual Slider & Pagination Counter matching sondaven.com/en */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 font-sd-body text-xs tracking-[0.15em] tabular-nums">
                <span>{String(safeIndex + 1).padStart(2, '0')}</span>
                <span className="w-6 h-[1px] bg-[#2c2824]/40" />
                <span>{String(Math.max(1, activeListLength)).padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleArrowButton
                  direction="prev"
                  onClick={handlePrev}
                  ariaLabel="Previous package or stay"
                />
                <CircleArrowButton
                  direction="next"
                  onClick={handleNext}
                  ariaLabel="Next package or stay"
                />
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2c2824] group">
              <ResilientImage
                src={
                  selectedPackage?.image ||
                  selectedHotel?.image ||
                  selectedCab?.image ||
                  '/assets/images/darjeeling.jpg'
                }
                alt={
                  selectedPackage?.title ||
                  selectedHotel?.name ||
                  selectedCab?.name ||
                  'Himalayan Expedition'
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c2824]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[#ffffff]">
                <div>
                  <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase opacity-80 block">
                    {selectedPackage?.destinationTag ||
                      selectedHotel?.category ||
                      selectedCab?.location}
                  </span>
                  <span className="font-sd-display text-2xl md:text-3xl mt-0.5 block">
                    {selectedPackage?.locationLabel ||
                      selectedHotel?.name ||
                      selectedCab?.name}
                  </span>
                </div>
                {selectedPackage && (
                  <span className="font-sd-body text-[11px] tracking-[0.12em] uppercase bg-[#2c2824]/90 text-[#a89474] px-3 py-1.5">
                    {selectedPackage.discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Complete Catalogue Grid (All 16 Packages / 6 Hotels / 13+ Cabs) */}
        {showAllPackagesGrid && (
          <div className="mt-20 pt-16 border-t border-[#2c2824]/25">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-sd-display text-3xl md:text-4xl">
                Complete MyTravelExpert Catalogue ({currentPackages.length} Tour Packages)
              </h3>
              <span className="font-sd-body text-xs tracking-[0.12em] uppercase">
                Click any package to inspect or book
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="border border-[#2c2824]/20 bg-[#2c2824]/5 flex flex-col justify-between group hover:border-[#2c2824] transition-colors"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#2c2824]">
                      <ResilientImage
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#2c2824] text-[#a89474] px-2.5 py-1 font-sd-body text-[10px] tracking-[0.1em]">
                        {pkg.discountPercent}% OFF · {pkg.durationText}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="font-sd-body text-[10px] tracking-[0.1em] text-[#2c2824]/65 uppercase">
                        {pkg.region} · {pkg.pax} Pax · {pkg.difficulty}
                      </div>
                      <h4 className="font-sd-display text-2xl mt-1.5 leading-snug">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-[#2c2824]/75 mt-2 line-clamp-2">
                        {pkg.overview}
                      </p>
                    </div>
                  </div>
                  <div className="p-5 pt-0 flex items-center justify-between border-t border-[#2c2824]/10 mt-2">
                    <div>
                      <span className="text-[10px] line-through text-[#2c2824]/50 block tabular-nums">
                        ₹{pkg.originalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="font-sd-display text-2xl tabular-nums">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenItineraryModal(pkg)}
                        className="px-2.5 py-1.5 border border-[#2c2824]/40 text-[10px] font-sd-body uppercase hover:bg-[#2c2824] hover:text-[#a89474] transition-colors cursor-pointer"
                      >
                        Itinerary
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectForBooking(pkg.title, pkg.price, 'package')}
                        className="px-3 py-1.5 bg-[#2c2824] text-[#a89474] text-[10px] font-sd-body uppercase hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
