import React, { useState, useEffect } from 'react';
import {
  COMPANY_INFO,
  TOUR_PACKAGES,
  TAXI_FLEET,
  TourPackage,
  BlogStory
} from '../data/travelData';
import {
  calculateExpeditionQuote,
  validateInquiryForm,
  InquiryFormInput
} from '../utils/bookingLogic';
import { CarvedMonumentLogo, DiamondStar, ResilientImage } from './CarvedLogo';

export interface SavedInquiryRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  subject: string;
  guests: number;
  travelMonth: string;
  finalTotal: number;
  createdAt: string;
  serverPersisted?: boolean;
  emailSent?: boolean;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onOpenConsultation
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { index: '01', label: 'About MyTravelExpert', href: '#about' },
    { index: '02', label: 'Where the Mountains Speak (Map)', href: '#location' },
    { index: '03', label: 'Why Choose Us (Uniqueness)', href: '#uniqueness' },
    { index: '04', label: 'Tour Packages, Hotels & Cabs', href: '#apartments' },
    { index: '05', label: 'Value & VIP Club Indicators', href: '#finance' },
    { index: '06', label: 'Himalayan Seasons', href: '#seasons' },
    { index: '07', label: 'Expedition Gallery', href: '#gallery' },
    { index: '08', label: 'Travel Stories & Guides', href: '#blog' },
    { index: '09', label: 'Answers to Key Questions (FAQ)', href: '#faq' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 theme_on-dark bg-[#2c2824]/98 backdrop-blur-md flex flex-col justify-between p-6 md:p-12 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation Menu"
    >
      {/* Top Bar inside Menu */}
      <div className="flex items-center justify-between border-b border-[#a89474]/20 pb-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-3 font-sd-body text-xs tracking-[0.14em] uppercase text-[#a89474] hover:opacity-80 cursor-pointer"
        >
          <span className="text-lg leading-none">✕</span>
          <span>Close Menu</span>
        </button>

        <CarvedMonumentLogo text="MY TRAVEL EXPERT" variant="header" />

        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenConsultation();
          }}
          className="sd-btn text-[#2c2824]"
          style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
        >
          <span>Consultation</span>
        </button>
      </div>

      {/* Center Navigation List matching sondaven.com/en .modal_menu_nav */}
      <div className="my-auto py-10 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
        {navItems.map((item) => (
          <a
            key={item.index}
            href={item.href}
            onClick={onClose}
            className="group flex items-baseline gap-5 py-3 border-b border-[#a89474]/15 hover:border-[#a89474] transition-colors"
          >
            <span className="font-sd-body text-[11px] tracking-[0.14em] text-[#a89474]/50 tabular-nums">
              {item.index}
            </span>
            <span className="font-sd-display text-3xl md:text-4xl text-[#a89474] group-hover:translate-x-2 transition-transform">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* Bottom Contact Bar */}
      <div className="border-t border-[#a89474]/20 pt-6 flex flex-wrap items-center justify-between gap-6 text-xs font-sd-body tracking-[0.1em]">
        <div>
          <span className="text-[#a89474]/55 block mb-1">CORPORATE OFFICE (BAGDOGRA, DARJEELING)</span>
          <span>{COMPANY_INFO.address}</span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <a href={`tel:${COMPANY_INFO.phoneRaw}`} className="hover:underline">
            {COMPANY_INFO.phone}
          </a>
          <a href={`mailto:${COMPANY_INFO.email}`} className="hover:underline lowercase">
            {COMPANY_INFO.email}
          </a>
        </div>
      </div>
    </div>
  );
};

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubject: string;
  initialBasePrice: number;
  savedInquiries: SavedInquiryRecord[];
  onSaveInquiry: (record: SavedInquiryRecord) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialSubject,
  initialBasePrice,
  savedInquiries,
  onSaveInquiry
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(initialSubject || TOUR_PACKAGES[1].title);
  const [basePrice, setBasePrice] = useState(initialBasePrice || 14500);
  const [travelMonth, setTravelMonth] = useState('November 2026');
  const [guests, setGuests] = useState(2);
  const [applyVipDiscount, setApplyVipDiscount] = useState(true);
  const [selectedCabFare, setSelectedCabFare] = useState(0);
  const [message, setMessage] = useState(
    'Please share the detailed customizable itinerary, hotel options, and permit checklist.'
  );
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormInput, string>>>({});
  const [submittedRecord, setSubmittedRecord] = useState<SavedInquiryRecord | null>(null);

  useEffect(() => {
    if (initialSubject) setSubject(initialSubject);
    if (initialBasePrice) setBasePrice(initialBasePrice);
    setSubmittedRecord(null);
    setErrors({});
  }, [initialSubject, initialBasePrice, isOpen]);

  if (!isOpen) return null;

  const quote = calculateExpeditionQuote({
    basePricePerUnit: basePrice,
    guestsOrUnits: guests,
    applyVipDiscount,
    cabAddOnBaseFare: selectedCabFare
  });

  const handlePackageDropdownChange = (titleVal: string) => {
    setSubject(titleVal);
    const foundPkg = TOUR_PACKAGES.find((p) => p.title === titleVal);
    if (foundPkg) {
      setBasePrice(foundPkg.price);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError('');
    const validation = validateInquiryForm({
      fullName,
      email,
      phone,
      subject,
      travelMonth,
      guests,
      message
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    let refCode = `MTE-${Math.floor(100000 + Math.random() * 900000)}`;
    let serverPersisted = false;
    let emailSent = false;

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          subject,
          travelMonth,
          guests,
          cabUpgrade:
            selectedCabFare > 0
              ? `Mountain Vehicle Upgrade (₹${selectedCabFare})`
              : 'Standard Package Transfer Included',
          vipDiscount: applyVipDiscount,
          finalTotal: quote.finalTotal,
          message: message.trim(),
          source: 'consultation_modal',
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        }
        setSubmitError(
          data?.error ||
            'Unable to process your consultation request. Please check your details or contact us directly on WhatsApp (+91 8001247778).'
        );
        setIsSubmitting(false);
        return;
      }

      if (data && data.referenceCode) {
        refCode = data.referenceCode;
      }
      serverPersisted = Boolean(data?.storage?.permanent);
      emailSent = Boolean(data?.notification?.emailSent);
    } catch {
      // Offline fallback: store locally
      serverPersisted = false;
    } finally {
      setIsSubmitting(false);
    }

    const record: SavedInquiryRecord = {
      id: `inq-${Date.now()}`,
      referenceCode: refCode,
      fullName: fullName.trim(),
      subject,
      guests,
      travelMonth,
      finalTotal: quote.finalTotal,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      serverPersisted,
      emailSent,
    };

    onSaveInquiry(record);
    setSubmittedRecord(record);
    setErrors({});
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Consultation and Expedition Booking"
    >
      <div className="theme_on-dark bg-[#2c2824] text-[#a89474] w-full max-w-2xl h-full overflow-y-auto p-6 md:p-12 border-l border-[#a89474]/25 flex flex-col justify-between">
        <div>
          {/* Modal Top Header */}
          <div className="flex items-center justify-between border-b border-[#a89474]/20 pb-5">
            <div>
              <span className="font-sd-body text-[10px] tracking-[0.15em] uppercase text-[#a89474]/60 block">
                24x7 Himalayan Concierge · Best Rate Guarantee
              </span>
              <h2 className="font-sd-display text-3xl md:text-4xl mt-1">
                Plan Your Expedition
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Consultation Modal"
              className="w-10 h-10 rounded-full border border-[#a89474]/35 flex items-center justify-center hover:bg-[#a89474] hover:text-[#2c2824] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {submittedRecord ? (
            <div className="my-10 p-8 border border-[#a89474]/40 bg-[#a89474]/10">
              <div className="flex items-center gap-2 text-xs font-sd-body tracking-[0.14em] uppercase text-[#a89474]">
                <DiamondStar className="w-2.5 h-2.5" />
                <span>EXPEDITION INQUIRY CONFIRMED · REF #{submittedRecord.referenceCode}</span>
              </div>
              <h3 className="font-sd-display text-4xl mt-4">
                Thank you, {submittedRecord.fullName}. See you in the Himalayas.
              </h3>
              <div className="mt-3 text-xs">
                {submittedRecord.serverPersisted ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded">
                    ✓ Permanently recorded in our cloud booking database (Vercel Blob)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded">
                    ⚡ Saved in local browser cache (offline mode). Please share your reference via WhatsApp below.
                  </span>
                )}
              </div>
              <p className="text-sm text-[#a89474]/85 mt-3 leading-relaxed">
                Our Bagdogra / Darjeeling travel concierge team has logged your request for{' '}
                <strong>{submittedRecord.subject}</strong> ({submittedRecord.guests} Travelers ·{' '}
                {submittedRecord.travelMonth}) with an estimated VIP package total of{' '}
                <strong>₹{submittedRecord.finalTotal.toLocaleString('en-IN')}</strong>. We typically reply within 24 hours.
              </p>

              <div className="mt-6 pt-6 border-t border-[#a89474]/20 flex flex-wrap items-center gap-4">
                <a
                  href={`https://wa.me/918001247778?text=${encodeURIComponent(
                    `Hello MyTravelExpert! My Ref is ${submittedRecord.referenceCode} for ${submittedRecord.subject} (${submittedRecord.guests} guests, ${submittedRecord.travelMonth}). Name: ${submittedRecord.fullName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sd-btn text-[#2c2824]"
                  style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
                >
                  <span>Instant WhatsApp Concierge (+91 8001247778)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmittedRecord(null)}
                  className="px-4 py-2.5 border border-[#a89474]/40 text-xs font-sd-body uppercase hover:border-[#a89474] cursor-pointer"
                >
                  Plan Another Trip
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              {/* Package / Service Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="inq-package"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Selected Package / Stay / Cab
                  </label>
                  <select
                    id="inq-package"
                    value={subject}
                    onChange={(e) => handlePackageDropdownChange(e.target.value)}
                    className="w-full bg-[#2c2824] border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] focus:outline-none focus:border-[#a89474]"
                  >
                    <option value={subject}>{subject}</option>
                    {TOUR_PACKAGES.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} — ₹{p.price.toLocaleString('en-IN')}/pers
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inq-month"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Travel Month
                  </label>
                  <select
                    id="inq-month"
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                    className="w-full bg-[#2c2824] border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] focus:outline-none focus:border-[#a89474]"
                  >
                    {[
                      'November 2026',
                      'December 2026',
                      'January 2027',
                      'February 2027',
                      'March 2027',
                      'April 2027',
                      'May 2027',
                      'June 2027',
                      'October 2027'
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests & Optional Mountain Cab Upgrade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="inq-guests"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Number of Travelers / Nights
                  </label>
                  <input
                    id="inq-guests"
                    type="number"
                    min={1}
                    max={30}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-transparent border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] focus:outline-none focus:border-[#a89474]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="inq-cab"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Dedicated Mountain Vehicle Upgrade
                  </label>
                  <select
                    id="inq-cab"
                    value={selectedCabFare}
                    onChange={(e) => setSelectedCabFare(Number(e.target.value))}
                    className="w-full bg-[#2c2824] border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] focus:outline-none focus:border-[#a89474]"
                  >
                    <option value={0}>Standard Package Transfer (Included)</option>
                    {TAXI_FLEET.slice(0, 6).map((cab) => (
                      <option key={cab.id} value={cab.baseFare}>
                        +{cab.name} ({cab.seats} Seats) — ₹{cab.baseFare}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Price Estimator Box with 10% VIP Club Toggle */}
              <div className="p-4 border border-[#a89474]/25 bg-[#a89474]/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <label className="inline-flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyVipDiscount}
                      onChange={(e) => setApplyVipDiscount(e.target.checked)}
                      className="accent-[#a89474] w-4 h-4"
                    />
                    <span className="font-sd-body text-[11px] tracking-[0.1em] uppercase">
                      Apply VIP Club 10% First-Booking Discount
                    </span>
                  </label>
                  <div className="text-xs text-[#a89474]/70 mt-1 tabular-nums">
                    Subtotal: ₹{quote.subtotal.toLocaleString('en-IN')}
                    {quote.vipDiscountAmount > 0 &&
                      ` · VIP Savings: -₹${quote.vipDiscountAmount.toLocaleString('en-IN')}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sd-body text-[10px] tracking-[0.12em] uppercase text-[#a89474]/60 block">
                    Estimated Total
                  </span>
                  <span className="font-sd-display text-3xl tabular-nums">
                    ₹{quote.finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="inq-name"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="inq-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="YOUR FULL NAME"
                    className="w-full bg-transparent border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] placeholder-[#a89474]/35 focus:outline-none focus:border-[#a89474]"
                  />
                  {errors.fullName && (
                    <p className="text-[#e23d3d] text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inq-phone"
                    className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                  >
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="inq-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] placeholder-[#a89474]/35 focus:outline-none focus:border-[#a89474]"
                  />
                  {errors.phone && (
                    <p className="text-[#e23d3d] text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="inq-email"
                  className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="inq-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOU@EXAMPLE.COM"
                  className="w-full bg-transparent border border-[#a89474]/35 px-3.5 py-2.5 text-xs font-sd-body text-[#a89474] placeholder-[#a89474]/35 focus:outline-none focus:border-[#a89474]"
                />
                {errors.email && (
                  <p className="text-[#e23d3d] text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="inq-message"
                  className="block font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/70 mb-1.5"
                >
                  Custom Requirements / Message *
                </label>
                <textarea
                  id="inq-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border border-[#a89474]/35 px-3.5 py-2.5 text-xs text-[#a89474] focus:outline-none focus:border-[#a89474]"
                />
                {errors.message && (
                  <p className="text-[#e23d3d] text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {submitError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded">
                  {submitError}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="sd-btn text-[#2c2824]"
                  style={{ '--theme-btn-bg': isSubmitting ? '#7a6c55' : '#a89474', cursor: isSubmitting ? 'wait' : 'pointer' } as React.CSSProperties}
                >
                  <span className="sd-slide-label">
                    <span>{isSubmitting ? 'Recording Enquiry...' : 'Send Message Now'}</span>
                    <span>{isSubmitting ? 'Recording Enquiry...' : 'Send Message Now'}</span>
                  </span>
                </button>
                <span className="font-sd-body text-[10px] tracking-[0.12em] text-[#a89474]/60">
                  DIRECT SUPPORT: {COMPANY_INFO.phone}
                </span>
              </div>
            </form>
          )}

          {/* Recent Session Inquiries List */}
          {savedInquiries.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#a89474]/20">
              <div className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/60 mb-3">
                Your Active Expedition Requests ({savedInquiries.length})
              </div>
              <div className="space-y-2">
                {savedInquiries.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 border border-[#a89474]/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-sd-body text-[10px] text-[#a89474]/60 block">
                        {rec.referenceCode} · {rec.travelMonth} · {rec.guests} Pax
                      </span>
                      <span className="font-sd-display text-lg">{rec.subject}</span>
                    </div>
                    <span className="font-sd-display text-xl tabular-nums">
                      ₹{rec.finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-5 border-t border-[#a89474]/15 flex items-center justify-between text-[10px] font-sd-body tracking-[0.1em] text-[#a89474]/60">
          <span>BAGDOGRA BHUJIAPANI, DARJEELING - 734014</span>
          <span>MON–SAT: 8:00 AM – 8:00 PM</span>
        </div>
      </div>
    </div>
  );
};

interface ItineraryDetailModalProps {
  pkg: TourPackage | null;
  onClose: () => void;
  onBookPackage: (pkg: TourPackage) => void;
}

export const ItineraryDetailModal: React.FC<ItineraryDetailModalProps> = ({
  pkg,
  onClose,
  onBookPackage
}) => {
  useEffect(() => {
    if (!pkg) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pkg, onClose]);

  if (!pkg) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`${pkg.title} Day-by-Day Itinerary`}
    >
      <div className="theme_on-dark bg-[#2c2824] text-[#a89474] border border-[#a89474]/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-12">
        <div className="flex items-start justify-between gap-4 border-b border-[#a89474]/20 pb-6">
          <div>
            <span className="font-sd-body text-[11px] tracking-[0.14em] uppercase text-[#a89474]/65">
              {pkg.region} · {pkg.durationText} · {pkg.discountPercent}% Special Offer
            </span>
            <h2 className="font-sd-display text-3xl md:text-5xl mt-2">{pkg.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Itinerary Modal"
            className="w-10 h-10 rounded-full border border-[#a89474]/40 flex items-center justify-center hover:bg-[#a89474] hover:text-[#2c2824] transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="md:col-span-2">
            <ResilientImage
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="border border-[#a89474]/20 p-5 flex flex-col justify-between">
            <div>
              <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/60 block">
                Package Tariff
              </span>
              <div className="font-sd-display text-4xl mt-1 tabular-nums">
                ₹{pkg.price.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-sd-body">/ person</span>
              </div>
              <span className="text-xs line-through text-[#a89474]/50 tabular-nums">
                Original: ₹{pkg.originalPrice.toLocaleString('en-IN')}
              </span>
              <ul className="mt-4 space-y-2 text-xs font-sd-body">
                <li>• Duration: {pkg.durationText}</li>
                <li>• Group Standard: {pkg.pax} Pax</li>
                <li>• Grade: {pkg.difficulty}</li>
                <li>• Pickup/Drop: IXB Airport / NJP</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookPackage(pkg);
              }}
              className="sd-btn text-[#2c2824] w-full mt-6"
              style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
            >
              <span>Book This Package</span>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-sd-display text-3xl mb-6">Day-by-Day Himalayan Itinerary</h3>
          <div className="space-y-4">
            {pkg.itinerary.map((item) => (
              <div
                key={item.day}
                className="border border-[#a89474]/20 p-5 bg-[#a89474]/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-sd-body text-xs tracking-[0.14em] uppercase bg-[#a89474] text-[#2c2824] px-2.5 py-0.5">
                    Day {String(item.day).padStart(2, '0')}
                  </span>
                  <span className="font-sd-body text-[11px] tracking-[0.1em] text-[#a89474]/75">
                    Meals: {item.meals} · Stay: {item.stay}
                  </span>
                </div>
                <h4 className="font-sd-display text-2xl mt-2">{item.title}</h4>
                <p className="text-sm text-[#a89474]/85 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlogReaderModalProps {
  story: BlogStory | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const BlogReaderModal: React.FC<BlogReaderModalProps> = ({
  story,
  onClose,
  onOpenConsultation
}) => {
  useEffect(() => {
    if (!story) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [story, onClose]);

  if (!story) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={story.title}
    >
      <div className="theme_on-dark bg-[#2c2824] text-[#a89474] border border-[#a89474]/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-12">
        <div className="flex items-start justify-between gap-4 border-b border-[#a89474]/20 pb-6">
          <div>
            <span className="font-sd-body text-[10px] tracking-[0.14em] uppercase text-[#a89474]/65">
              {story.category} · {story.date} · {story.readTime}
            </span>
            <h2 className="font-sd-display text-3xl md:text-4xl mt-2">{story.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Story Reader"
            className="w-10 h-10 rounded-full border border-[#a89474]/40 flex items-center justify-center hover:bg-[#a89474] hover:text-[#2c2824] transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        <ResilientImage
          src={story.image}
          alt={story.title}
          className="w-full h-64 object-cover my-6"
        />

        <div className="space-y-4 text-base leading-relaxed text-[#a89474]/90">
          {story.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-[#a89474]/20 flex items-center justify-between">
          <span className="font-sd-body text-xs">Author: {story.author}</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="sd-btn text-[#2c2824]"
            style={{ '--theme-btn-bg': '#a89474' } as React.CSSProperties}
          >
            <span>Plan This Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
};
