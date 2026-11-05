/**
 * ============================================================================
 * MY TRAVEL EXPERT (MTE) — CLIENT EXPERIENCE & EXPEDITION EXPLORER
 * React 19 Dynamic Quoting Engine & Catalogue Drawer Suite
 * Copyright (c) 2026 MyTravelExpert. All Rights Reserved.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  COMPANY_INFO,
  LUXURY_HOTELS,
  TAXI_FLEET,
  TOUR_PACKAGES,
  TourPackage,
} from './data/travelData';
import {
  calculateExpeditionQuote,
  filterAndSortPackages,
  validateInquiryForm,
} from './utils/bookingLogic';

type DrawerTab = 'packages' | 'hotels' | 'cabs' | 'calculator';

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('packages');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(TOUR_PACKAGES[0]?.id || null);

  // Live VIP Quote Calculator & Booking State
  const [selectedPkgId, setSelectedPkgId] = useState<string>(TOUR_PACKAGES[0]?.id || '');
  const [guests, setGuests] = useState<number>(2);
  const [vipDiscount, setVipDiscount] = useState<boolean>(true);
  const [selectedCabId, setSelectedCabId] = useState<string>('included');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [travelDate, setTravelDate] = useState<string>('2026-11-15');
  const [customNotes, setCustomNotes] = useState<string>(' Bagdogra Airport (IXB) Pickup');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  // Bridge clicks from the native Son Daven DOM ([data-mte-open="catalogue"]) into the React Explorer Drawer
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest('[data-mte-open]');
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const mode = trigger.getAttribute('data-mte-open');
        if (mode === 'calculator') {
          setActiveTab('calculator');
        } else {
          setActiveTab('packages');
        }
        setDrawerOpen(true);
      }
    };
    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, []);

  // Keyboard accessibility: dismiss drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  const filteredPackages = useMemo(
    () =>
      filterAndSortPackages(TOUR_PACKAGES, {
        region: selectedRegion,
        searchQuery,
      }),
    [selectedRegion, searchQuery]
  );

  const selectedPackage: TourPackage = useMemo(
    () => TOUR_PACKAGES.find((p) => p.id === selectedPkgId) || TOUR_PACKAGES[0],
    [selectedPkgId]
  );

  const selectedCab = useMemo(
    () => TAXI_FLEET.find((c) => c.id === selectedCabId) || null,
    [selectedCabId]
  );

  const quote = useMemo(() => {
    const cabExtra = selectedCab ? selectedCab.baseFare * Math.max(1, selectedPackage.days) : 0;
    return calculateExpeditionQuote({
      basePricePerUnit: selectedPackage.price,
      guestsOrUnits: guests,
      applyVipDiscount: vipDiscount,
      cabAddOnBaseFare: cabExtra,
    });
  }, [selectedPackage, guests, vipDiscount, selectedCab]);

  const handleBookPackage = (pkg: TourPackage) => {
    setSelectedPkgId(pkg.id);
    setBookingConfirmed(false);
    setActiveTab('calculator');
    setDrawerOpen(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInquiryForm({
      fullName: customerName,
      phone: customerPhone,
      email: customerEmail || 'guest@mytravelexpert.co.in',
      subject: selectedPackage.title,
      travelMonth: travelDate,
      guests,
      message: customNotes || 'Standard itinerary booking request',
    });
    if (!validation.valid) {
      setFormErrors(validation.errors as Record<string, string>);
      return;
    }
    setFormErrors({});
    setBookingConfirmed(true);
  };

  return (
    <div className="mte-portal">
      {/* Floating Quick-Access Button to open the Full 16-Package / 6-Hotel / 13-Cab Catalogue & VIP Calculator */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 990,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab('packages');
            setDrawerOpen(true);
          }}
          style={{
            backgroundColor: '#1F261F',
            color: '#F6F4EF',
            border: '1px solid rgba(246, 244, 239, 0.22)',
            padding: '10px 16px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: '#FF4929',
              display: 'inline-block',
            }}
          />
          <span>
            All {TOUR_PACKAGES.length} Packages • {LUXURY_HOTELS.length} Resorts •{' '}
            {TAXI_FLEET.length} Cabs
          </span>
        </button>
      </div>

      {/* Full Interactive Catalogue & Live 10% VIP Quote Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expedition Catalogue and VIP Quote Builder"
          data-lenis-prevent="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(20, 26, 20, 0.82)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '960px',
              height: '100vh',
              backgroundColor: '#F6F4EF',
              color: '#1F261F',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderLeft: '1px solid rgba(31, 38, 31, 0.18)',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid rgba(31, 38, 31, 0.14)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#EFECE4',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#FF4929',
                    marginBottom: '4px',
                  }}
                >
                  MyTravelExpert • Bagdogra &amp; Darjeeling Hub ({COMPANY_INFO.phone})
                </div>
                <div
                  className="mte-display-font"
                  style={{ fontSize: '24px', fontWeight: 400, color: '#1F261F' }}
                >
                  Complete Himalayan Catalogue &amp; VIP 10% Quote Builder
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{
                  backgroundColor: '#1F261F',
                  color: '#F6F4EF',
                  border: 'none',
                  padding: '9px 16px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                [ Close × ]
              </button>
            </div>

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid rgba(31, 38, 31, 0.14)',
                backgroundColor: '#F6F4EF',
                padding: '0 28px',
                gap: '8px',
                overflowX: 'auto',
              }}
            >
              {(
                [
                  { id: 'packages', label: `Tour Packages (${TOUR_PACKAGES.length})` },
                  { id: 'hotels', label: `Luxury Stays (${LUXURY_HOTELS.length})` },
                  { id: 'cabs', label: `Mountain Fleet (${TAXI_FLEET.length})` },
                  { id: 'calculator', label: '10% VIP Quote & Booking' },
                ] as { id: DrawerTab; label: string }[]
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '14px 18px',
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderBottom: active ? '2px solid #FF4929' : '2px solid transparent',
                      backgroundColor: 'transparent',
                      color: active ? '#FF4929' : '#1F261F',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Content Body */}
            <div
              data-lenis-prevent="true"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px 48px',
              }}
            >
              {/* TAB 1: ALL 16 TOUR PACKAGES */}
              {activeTab === 'packages' && (
                <div>
                  {/* Filters */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {[
                        'All',
                        'Darjeeling',
                        'Sikkim',
                        'Bhutan',
                        'Kalimpong & Silk Route',
                        'Dooars',
                      ].map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setSelectedRegion(region)}
                          style={{
                            padding: '7px 13px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            border: '1px solid rgba(31, 38, 31, 0.25)',
                            backgroundColor:
                              selectedRegion === region ? '#1F261F' : 'transparent',
                            color: selectedRegion === region ? '#F6F4EF' : '#1F261F',
                            cursor: 'pointer',
                          }}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Search 16 packages (e.g., Lachung, Bhutan, Tiger Hill)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '13px',
                        border: '1px solid rgba(31, 38, 31, 0.25)',
                        backgroundColor: '#FFFFFF',
                        color: '#1F261F',
                        minWidth: '260px',
                      }}
                    />
                  </div>

                  {/* Package List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredPackages.map((pkg) => {
                      const isExpanded = expandedPkgId === pkg.id;
                      const vipPrice = Math.round(pkg.price * 0.9);
                      return (
                        <div
                          key={pkg.id}
                          style={{
                            border: '1px solid rgba(31, 38, 31, 0.16)',
                            backgroundColor: '#FFFFFF',
                            padding: '18px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '18px',
                              alignItems: 'start',
                            }}
                          >
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              style={{
                                width: '180px',
                                minWidth: '160px',
                                height: '125px',
                                objectFit: 'cover',
                                display: 'block',
                                flexShrink: 0,
                              }}
                            />
                            <div style={{ flex: '1 1 240px' }}>
                              <div
                                style={{
                                  fontSize: '11px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  color: '#FF4929',
                                  marginBottom: '4px',
                                }}
                              >
                                {pkg.region} • {pkg.durationText} • {pkg.locationLabel}
                              </div>
                              <div
                                style={{
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: '#1F261F',
                                  marginBottom: '6px',
                                }}
                              >
                                {pkg.title}
                              </div>
                              <p
                                style={{
                                  fontSize: '13px',
                                  color: '#485248',
                                  marginBottom: '10px',
                                }}
                              >
                                {pkg.overview}
                              </p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {pkg.highlights.map((h) => (
                                  <span
                                    key={h}
                                    style={{
                                      fontSize: '11px',
                                      padding: '3px 8px',
                                      backgroundColor: '#EFECE4',
                                      color: '#1F261F',
                                    }}
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '150px' }}>
                              <div
                                style={{
                                  fontSize: '11px',
                                  textDecoration: 'line-through',
                                  color: '#7A827A',
                                }}
                              >
                                Standard: {formatInr(pkg.originalPrice || pkg.price)}
                              </div>
                              <div
                                style={{
                                  fontSize: '20px',
                                  fontWeight: 700,
                                  color: '#1F261F',
                                }}
                              >
                                {formatInr(vipPrice)}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: '#FF4929',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.06em',
                                  marginBottom: '10px',
                                }}
                              >
                                With 10% VIP Club
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleBookPackage(pkg)}
                                  style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#FF4929',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Customize &amp; Book
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedPkgId(isExpanded ? null : pkg.id)
                                  }
                                  style={{
                                    padding: '6px 10px',
                                    backgroundColor: 'transparent',
                                    color: '#1F261F',
                                    border: '1px solid rgba(31, 38, 31, 0.25)',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {isExpanded ? 'Hide Itinerary ▲' : 'Day-by-Day Plan ▼'}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Expandable Day-by-Day Itinerary */}
                          {isExpanded && (
                            <div
                              style={{
                                marginTop: '14px',
                                paddingTop: '14px',
                                borderTop: '1px solid rgba(31, 38, 31, 0.12)',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '11px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                  color: '#1F261F',
                                  marginBottom: '8px',
                                  fontWeight: 600,
                                }}
                              >
                                Day-by-Day Itinerary ({pkg.durationText})
                              </div>
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                  gap: '10px',
                                }}
                              >
                                {pkg.itinerary.map((step) => (
                                  <div
                                    key={step.day}
                                    style={{
                                      backgroundColor: '#F6F4EF',
                                      padding: '10px 12px',
                                      fontSize: '12px',
                                    }}
                                  >
                                    <div style={{ fontWeight: 600, color: '#FF4929' }}>
                                      Day {step.day}: {step.title}
                                    </div>
                                    <div style={{ color: '#333D33', marginTop: '3px' }}>
                                      {step.description}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: '11px',
                                        color: '#666',
                                        marginTop: '4px',
                                      }}
                                    >
                                      Stay: {step.stay} • Meals: {step.meals}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: 6 LUXURY PARTNER RESORTS & HOTELS */}
              {activeTab === 'hotels' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {LUXURY_HOTELS.map((hotel) => (
                    <div
                      key={hotel.id}
                      style={{
                        border: '1px solid rgba(31, 38, 31, 0.16)',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '16px', flex: 1 }}>
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#FF4929',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {hotel.city}, {hotel.state} • {hotel.category} ({hotel.rating}★)
                        </div>
                        <div
                          style={{
                            fontSize: '17px',
                            fontWeight: 600,
                            margin: '4px 0 8px',
                          }}
                        >
                          {hotel.name}
                        </div>
                        <p style={{ fontSize: '12px', color: '#485248', marginBottom: '10px' }}>
                          {hotel.description}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '5px',
                            marginBottom: '12px',
                          }}
                        >
                          {hotel.features.map((a) => (
                            <span
                              key={a}
                              style={{
                                fontSize: '10px',
                                padding: '2px 7px',
                                backgroundColor: '#EFECE4',
                              }}
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(31,38,31,0.1)',
                            paddingTop: '10px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>
                              {formatInr(hotel.pricePerNight)}
                            </span>
                            <span style={{ fontSize: '11px', color: '#666' }}> / night</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomNotes(`Preferred Stay: ${hotel.name} (${hotel.city})`);
                              setActiveTab('calculator');
                            }}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#1F261F',
                              color: '#F6F4EF',
                              border: 'none',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                            }}
                          >
                            Include in Tour
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: 13+ MOUNTAIN FLEET & CABS */}
              {activeTab === 'cabs' && (
                <div>
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '12px 16px',
                      backgroundColor: '#EFECE4',
                      fontSize: '13px',
                    }}
                  >
                    All vehicles operate directly from our{' '}
                    <strong>Bagdogra Airport (IXB) &amp; NJP Railway Station</strong> hub with
                    hill-certified drivers, permits, and 24/7 dispatch tracking.
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {TAXI_FLEET.map((cab) => (
                      <div
                        key={cab.id}
                        style={{
                          border: '1px solid rgba(31, 38, 31, 0.16)',
                          backgroundColor: '#FFFFFF',
                          padding: '16px',
                        }}
                      >
                        <img
                          src={cab.image}
                          alt={cab.name}
                          style={{
                            width: '100%',
                            height: '140px',
                            objectFit: 'cover',
                            marginBottom: '12px',
                          }}
                        />
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#FF4929',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {cab.brand} • {cab.seats} Seats • {cab.bags} Bags
                        </div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            margin: '4px 0 6px',
                          }}
                        >
                          {cab.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#485248', marginBottom: '10px' }}>
                          Hub: {cab.location} • {cab.features.join(' • ')}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(31,38,31,0.1)',
                            paddingTop: '10px',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: '16px', fontWeight: 700 }}>
                              {formatInr(cab.baseFare)}
                            </span>
                            <span style={{ fontSize: '11px', color: '#666' }}> / day</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCabId(cab.id);
                              setActiveTab('calculator');
                            }}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#FF4929',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '11px',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                            }}
                          >
                            Select Vehicle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE 10% VIP QUOTE CALCULATOR & BOOKING FORM */}
              {activeTab === 'calculator' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {/* Left: Configurator */}
                  <form
                    onSubmit={handleConfirmBooking}
                    style={{
                      backgroundColor: '#FFFFFF',
                      padding: '22px',
                      border: '1px solid rgba(31, 38, 31, 0.16)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      1. Configure Your Himalayan Expedition
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                        Select Tour Package (All {TOUR_PACKAGES.length} Available)
                      </label>
                      <select
                        value={selectedPkgId}
                        onChange={(e) => {
                          setSelectedPkgId(e.target.value);
                          setBookingConfirmed(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                          backgroundColor: '#F6F4EF',
                        }}
                      >
                        {TOUR_PACKAGES.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.region}] {p.title} ({p.durationText}) — {formatInr(p.price)}/person
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                          Number of Travellers
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={guests}
                          onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '13px',
                            border: '1px solid rgba(31, 38, 31, 0.25)',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                          Preferred Travel Date
                        </label>
                        <input
                          type="date"
                          value={travelDate}
                          onChange={(e) => setTravelDate(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontSize: '13px',
                            border: '1px solid rgba(31, 38, 31, 0.25)',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                        Dedicated Mountain Vehicle
                      </label>
                      <select
                        value={selectedCabId}
                        onChange={(e) => setSelectedCabId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                          backgroundColor: '#F6F4EF',
                        }}
                      >
                        <option value="included">
                          Standard Package SUV/Sedan Included (₹0 extra)
                        </option>
                        {TAXI_FLEET.map((c) => (
                          <option key={c.id} value={c.id}>
                            Upgrade: {c.name} ({c.seats} seats) — {formatInr(c.baseFare)}/day
                          </option>
                        ))}
                      </select>
                    </div>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        padding: '8px 10px',
                        backgroundColor: '#EFECE4',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={vipDiscount}
                        onChange={(e) => setVipDiscount(e.target.checked)}
                      />
                      <span>
                        Apply <strong>10% VIP Club First-Booking Discount</strong>
                      </span>
                    </label>

                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginTop: '6px',
                      }}
                    >
                      2. Traveller Details
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                        }}
                      />
                      {formErrors.fullName && (
                        <div style={{ color: '#D92D20', fontSize: '11px', marginTop: '3px' }}>
                          {formErrors.fullName}
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp / Mobile Number (e.g. +91 9876543210) *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                        }}
                      />
                      {formErrors.phone && (
                        <div style={{ color: '#D92D20', fontSize: '11px', marginTop: '3px' }}>
                          {formErrors.phone}
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                        }}
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Custom hotel preference or special notes..."
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 10px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: '12px 18px',
                        backgroundColor: '#FF4929',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Lock 10% VIP Quote &amp; Request Callback
                    </button>
                  </form>

                  {/* Right: Live Quote Breakdown */}
                  <div
                    style={{
                      backgroundColor: '#1F261F',
                      color: '#F6F4EF',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#FF4929',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: '6px',
                        }}
                      >
                        Live MyTravelExpert Tariff Summary
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
                        {selectedPackage.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#B6BEB6', marginBottom: '18px' }}>
                        {selectedPackage.durationText} • {selectedPackage.locationLabel} • {guests}{' '}
                        Traveller(s)
                      </div>

                      <div
                        style={{
                          borderTop: '1px solid rgba(246,244,239,0.15)',
                          borderBottom: '1px solid rgba(246,244,239,0.15)',
                          padding: '14px 0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          fontSize: '13px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>
                            Base Package ({formatInr(selectedPackage.price)} × {guests})
                          </span>
                          <span>{formatInr(quote.subtotal)}</span>
                        </div>
                        {quote.cabAddOn > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Dedicated Vehicle Upgrade ({selectedCab?.name})</span>
                            <span>+ {formatInr(quote.cabAddOn)}</span>
                          </div>
                        )}
                        {vipDiscount && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              color: '#FF4929',
                            }}
                          >
                            <span>10% VIP Club Instant Discount</span>
                            <span>- {formatInr(quote.vipDiscountAmount)}</span>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginTop: '16px',
                        }}
                      >
                        <span style={{ fontSize: '13px', textTransform: 'uppercase' }}>
                          Estimated Total
                        </span>
                        <span style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF' }}>
                          {formatInr(quote.finalTotal)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#B6BEB6',
                          textAlign: 'right',
                          marginTop: '2px',
                        }}
                      >
                        Effective per person: {formatInr(quote.perPersonEffective)} • 20% Booking
                        Advance: {formatInr(Math.round(quote.finalTotal * 0.2))}
                      </div>

                      {bookingConfirmed && (
                        <div
                          style={{
                            marginTop: '20px',
                            padding: '14px',
                            backgroundColor: 'rgba(255, 73, 41, 0.16)',
                            border: '1px solid #FF4929',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#FF4929', marginBottom: '4px' }}>
                            ✓ Inquiry Confirmed — Reference #MTE-{Math.floor(1000 + guests * 137)}
                          </div>
                          <div>
                            Thank you, <strong>{customerName}</strong>! Our Bagdogra travel desk (
                            {COMPANY_INFO.phone}) has reserved your{' '}
                            <strong>{selectedPackage.title}</strong> VIP quote for{' '}
                            <strong>{travelDate}</strong> and will reach out on{' '}
                            <strong>{customerPhone}</strong> shortly.
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: '24px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(246,244,239,0.14)',
                        fontSize: '12px',
                        color: '#B6BEB6',
                      }}
                    >
                      <div>
                        <strong>Bagdogra HQ:</strong> {COMPANY_INFO.address}
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <strong>Direct Support:</strong> {COMPANY_INFO.phone} •{' '}
                        {COMPANY_INFO.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
