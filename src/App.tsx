/**
 * ============================================================================
 * MY TRAVEL EXPERT (MTE) — CLIENT EXPERIENCE & EXPEDITION EXPLORER
 * React 19 Dynamic Quoting Engine, Legal Policy Suite & Catalogue Drawer
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
  BLOG_STORIES,
  BlogStory,
} from './data/travelData';
import {
  calculateExpeditionQuote,
  filterAndSortPackages,
  validateInquiryForm,
} from './utils/bookingLogic';
import { ConsultationModal, BlogReaderModal } from './components/Modals';

type DrawerTab = 'packages' | 'hotels' | 'cabs' | 'calculator';
export type LegalDocType = 'privacy' | 'terms' | 'booking' | 'cancellation' | null;

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>('packages');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPkgId, setExpandedPkgId] = useState<string | null>(TOUR_PACKAGES[0]?.id || null);

  // Focus restoration & containment refs
  const lastActiveElementRef = React.useRef<HTMLElement | null>(null);
  const drawerRef = React.useRef<HTMLDivElement | null>(null);

  // Legal Policy Viewer Modal State
  const [legalModalDoc, setLegalModalDoc] = useState<LegalDocType>(null);

  // Consultation Modal State
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);

  // Travel Guide Reader Modal State
  const [activeStory, setActiveStory] = useState<BlogStory | null>(null);

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
  const [honeypotWebsite, setHoneypotWebsite] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [summaryReady, setSummaryReady] = useState<boolean>(false);
  const [enquiryReference, setEnquiryReference] = useState<string>('');

  // Bridge clicks from the Webflow DOM ([data-mte-open] and [data-mte-policy])
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const policyTrigger = target.closest('[data-mte-policy]');
      if (policyTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const doc = policyTrigger.getAttribute('data-mte-policy') as LegalDocType;
        setLegalModalDoc(doc || 'privacy');
        return;
      }

      const guideTrigger = target.closest('[data-mte-guide]');
      if (guideTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const guideId = guideTrigger.getAttribute('data-mte-guide');
        const found = BLOG_STORIES.find((s) => s.id === guideId) || BLOG_STORIES[0];
        setActiveStory(found);
        return;
      }

      const consultTrigger = target.closest(
        '[data-mte-consultation], [data-mte-open="consultation"], a[aria-label="Consultation"]'
      );
      if (consultTrigger) {
        e.preventDefault();
        e.stopPropagation();
        setIsConsultationOpen(true);
        return;
      }

      const openTrigger = target.closest('[data-mte-open]');
      if (openTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const mode = openTrigger.getAttribute('data-mte-open');
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

  // Keyboard accessibility & Focus Management
  useEffect(() => {
    if (drawerOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      // Focus drawer container
      requestAnimationFrame(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) focusable.focus();
        }
      });
    } else {
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (legalModalDoc) {
          setLegalModalDoc(null);
        } else if (activeStory) {
          setActiveStory(null);
        } else if (isConsultationOpen) {
          setIsConsultationOpen(false);
        } else if (drawerOpen) {
          setDrawerOpen(false);
        }
      }

      // Focus trap for drawer
      if (e.key === 'Tab' && drawerOpen && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, legalModalDoc, isConsultationOpen]);

  // Webflow CTA Modal (#phone-form) submission bridge to /api/enquiry
  useEffect(() => {
    let isSubmittingWebflow = false;

    const handleWebflowSubmit = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmittingWebflow) return;

      const phoneForm = document.getElementById('phone-form') as HTMLFormElement | null;
      if (!phoneForm) return;

      const nameInput = document.getElementById('Name') as HTMLInputElement | null;
      const phoneInput = document.getElementById('Phone') as HTMLInputElement | null;
      const name = (nameInput?.value || '').trim();
      const phone = (phoneInput?.value || '').trim();

      // Clear any prior error
      const existingError = phoneForm.querySelector('.mte-wf-form-error');
      if (existingError) existingError.remove();

      const showError = (msg: string) => {
        const errEl = document.createElement('div');
        errEl.className = 'mte-wf-form-error';
        errEl.setAttribute('role', 'alert');
        errEl.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 8px; font-weight: 600;';
        errEl.textContent = msg;
        const inputList = phoneForm.querySelector('.input-list');
        if (inputList) inputList.appendChild(errEl);
      };

      if (!name || name.length < 2) {
        showError('Please enter your full name (at least 2 characters).');
        nameInput?.focus();
        return;
      }

      const digits = phone.replace(/[^0-9]/g, '');
      if (digits.length < 10 || digits.length > 15) {
        showError('Please enter a valid phone number (10 to 15 digits).');
        phoneInput?.focus();
        return;
      }

      const submitBtn = phoneForm.querySelector('[data-form-btn] a') as HTMLElement | null;
      const btnText = phoneForm.querySelector('[data-form-btn] [hover="text"]') as HTMLElement | null;
      const originalText = btnText?.textContent || 'Get Free Custom Quote';

      isSubmittingWebflow = true;
      if (btnText) btnText.textContent = 'Preparing Summary...';
      if (submitBtn) submitBtn.style.pointerEvents = 'none';

      try {
        const serverRef = `MTE-${Math.floor(100000 + Math.random() * 900000)}`;

        // Send to enquiry endpoint if available for logging, but do not claim confirmed booking
        fetch('/api/enquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: name,
            phone,
            source: 'webflow_cta_modal',
            subject: 'Custom Himalayan Tour & 10% VIP Quote',
            guests: 2,
            notes: 'Enquiry via Webflow header & hero consultation modal',
          }),
        }).catch(() => {});

        saveInquiryToLocalBackup(serverRef, {
          fullName: name,
          phone,
          pkg: 'Custom Himalayan Tour & 10% VIP Quote',
          guests: 2,
        });

        // Hide form and display honest handoff screen
        phoneForm.style.display = 'none';
        const successBlock = document.querySelector('.modal_cta-form_success') as HTMLElement | null;
        if (successBlock) {
          successBlock.style.display = 'block';
          successBlock.classList.remove('w-form-done');
          const titleEl = successBlock.querySelector('.modal_cta-form_success_title .h2');
          const descEl = successBlock.querySelector('.modal_cta-form_success_desc .p6');
          if (titleEl) {
            titleEl.textContent = 'Your enquiry summary is ready.';
          }
          if (descEl) {
            const waMsg = `Hello MyTravelExpert! Inquiry Summary (#${serverRef}):\n- Package: Custom Himalayan Tour (Darjeeling/Sikkim/Bhutan)\n- Guests: 2 Travellers\n- Name: ${name}\n- Phone: ${phone}\n- Note: Requesting customized itinerary & 10% VIP quote.`;
            const waUrl = `https://wa.me/918001247778?text=${encodeURIComponent(waMsg)}`;
            const mailtoUrl = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
              `Custom Himalayan Tour Enquiry #${serverRef}`
            )}&body=${encodeURIComponent(waMsg)}`;

            descEl.innerHTML = `
              Reference Number: <strong style="color: #FF4929; font-weight: 700;">#${serverRef}</strong><br/>
              Your enquiry details have been prepared for <strong>${name}</strong> (${phone}). To deliver your request directly to our Bagdogra desk, please choose an option below:<br/><br/>
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer"
                   style="display: inline-block; padding: 12px 18px; background: #25D366; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 13px;">
                  Open WhatsApp enquiry
                </a>
                <a href="${mailtoUrl}"
                   style="display: inline-block; padding: 12px 18px; background: #EFECE4; color: #1F261F; text-decoration: none; border: 1px solid rgba(31,38,31,0.2); border-radius: 4px; font-weight: 600; font-size: 13px;">
                  Open email enquiry
                </a>
              </div>
            `;
          }
        }
      } catch (err: any) {
        showError(err.message || 'Error preparing enquiry. Please message us directly on WhatsApp (+91 8001247778).');
        if (btnText) btnText.textContent = originalText;
        if (submitBtn) submitBtn.style.pointerEvents = 'auto';
      } finally {
        isSubmittingWebflow = false;
      }
    };

    // Attach to form submit and button click
    const phoneForm = document.getElementById('phone-form');
    if (phoneForm) {
      phoneForm.addEventListener('submit', handleWebflowSubmit);
    }
    const formBtn = document.querySelector('[data-form-btn]');
    if (formBtn) {
      formBtn.addEventListener('click', handleWebflowSubmit);
    }

    return () => {
      if (phoneForm) {
        phoneForm.removeEventListener('submit', handleWebflowSubmit);
      }
      if (formBtn) {
        formBtn.removeEventListener('click', handleWebflowSubmit);
      }
    };
  }, []);

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
    setSummaryReady(false);
    setActiveTab('calculator');
    setDrawerOpen(true);
  };

  const saveInquiryToLocalBackup = (
    refCode: string,
    override?: { fullName?: string; phone?: string; email?: string; pkg?: string; travelDate?: string; guests?: number; total?: number }
  ) => {
    let resolvedRef = refCode;
    try {
      const name = override?.fullName ?? customerName;
      const phone = override?.phone ?? customerPhone;
      const email = override?.email ?? customerEmail;
      const pkgTitle = override?.pkg ?? selectedPackage.title;
      const tDate = override?.travelDate ?? travelDate;
      const gCount = override?.guests ?? guests;
      const tAmount = override?.total ?? quote.finalTotal;

      const existing = JSON.parse(localStorage.getItem('mte_inquiries') || '[]');
      const normalizedPhone = phone.replace(/[\s\-()]/g, '');
      const duplicate = existing.find(
        (item: { fullName?: string; phone?: string; pkg?: string; travelDate?: string; refCode?: string }) =>
          (item.fullName || '').trim().toLowerCase() === name.trim().toLowerCase() &&
          (item.phone || '').replace(/[\s\-()]/g, '') === normalizedPhone &&
          item.pkg === pkgTitle &&
          item.travelDate === tDate
      );
      if (duplicate && duplicate.refCode) {
        resolvedRef = duplicate.refCode;
      } else {
        existing.push({
          refCode: resolvedRef,
          fullName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          pkg: pkgTitle,
          travelDate: tDate,
          guests: gCount,
          total: tAmount,
          date: new Date().toISOString()
        });
        localStorage.setItem('mte_inquiries', JSON.stringify(existing));
      }
    } catch {
      // Storage unavailable fallback
    }
    return resolvedRef;
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitError('');
    const validation = validateInquiryForm({
      fullName: customerName,
      phone: customerPhone,
      email: customerEmail,
      subject: selectedPackage.title,
      travelMonth: travelDate,
      guests,
      message: customNotes || 'Standard itinerary booking request',
    });
    if (!validation.valid) {
      setFormErrors(validation.errors as Record<string, string>);
      setSummaryReady(false);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const generatedRef = `MTE-${Math.floor(100000 + Math.random() * 900000)}`;

      // Background telemetry/logging if endpoint available, but do not show false success if it fails
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail.trim(),
          subject: selectedPackage.title,
          travelMonth: travelDate,
          guests,
          cabUpgrade: selectedCab ? selectedCab.name : 'Standard Package SUV/Sedan Included',
          vipDiscount,
          finalTotal: quote.finalTotal,
          message: customNotes || 'Standard itinerary booking request',
          source: 'booking_modal',
          website: honeypotWebsite,
        }),
      }).catch(() => {});

      const finalRef = saveInquiryToLocalBackup(generatedRef);
      setEnquiryReference(finalRef);
      setSummaryReady(true);
    } catch {
      const fallbackRef = saveInquiryToLocalBackup(
        `MTE-${Math.floor(100000 + Math.random() * 900000)}`
      );
      setEnquiryReference(fallbackRef);
      setSummaryReady(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mte-portal">
      {/* Floating Quick-Access Bar to open the Full Catalogue & VIP Calculator */}
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
        <button
          type="button"
          onClick={() => {
            setActiveTab('calculator');
            setDrawerOpen(true);
          }}
          style={{
            backgroundColor: '#FF4929',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 16px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
          }}
        >
          10% VIP Quote &amp; Book
        </button>
        <button
          type="button"
          onClick={() => setIsConsultationOpen(true)}
          style={{
            backgroundColor: '#2c2824',
            color: '#a89474',
            border: '1px solid rgba(168, 148, 116, 0.45)',
            padding: '10px 16px',
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
          }}
        >
          Free Consultation
        </button>
      </div>

      {/* IN-APP LEGAL POLICY & TRUST MODAL DIALOG */}
      {legalModalDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="MyTravelExpert Official Legal and Trust Policy"
          data-lenis-prevent="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 18, 15, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
          onClick={() => setLegalModalDoc(null)}
        >
          <div
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '90vh',
              backgroundColor: '#262D26',
              color: '#F6F4EF',
              border: '1px solid rgba(246, 244, 239, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 28px',
                borderBottom: '1px solid rgba(246, 244, 239, 0.14)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#1F261F',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#FF4929',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  MyTravelExpert Trust &amp; Legal Transparency
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 600, margin: 0, color: '#FFFFFF' }}>
                  {legalModalDoc === 'privacy' && 'Privacy Policy'}
                  {legalModalDoc === 'terms' && 'Terms and Conditions'}
                  {legalModalDoc === 'booking' && 'Booking & Payment Policy'}
                  {legalModalDoc === 'cancellation' && 'Cancellation & Refund Policy'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setLegalModalDoc(null)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#F6F4EF',
                  border: '1px solid rgba(246, 244, 239, 0.3)',
                  padding: '8px 14px',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Close ✕
              </button>
            </div>

            {/* Quick Switcher Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid rgba(246, 244, 239, 0.12)',
                backgroundColor: '#1B211B',
                padding: '0 28px',
                gap: '8px',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'terms', label: 'Terms & Conditions' },
                { id: 'booking', label: 'Booking Policy' },
                { id: 'cancellation', label: 'Cancellation & Refunds' },
              ].map((tab) => {
                const active = legalModalDoc === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLegalModalDoc(tab.id as LegalDocType)}
                    style={{
                      padding: '12px 14px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      border: 'none',
                      borderBottom: active ? '2px solid #FF4929' : '2px solid transparent',
                      backgroundColor: 'transparent',
                      color: active ? '#FF4929' : '#B6BEB6',
                      fontWeight: active ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Modal Body Content */}
            <div
              data-lenis-prevent="true"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 28px',
                fontSize: '14px',
                lineHeight: 1.68,
                color: '#D4DDD4',
              }}
            >
              {legalModalDoc === 'privacy' && (
                <div>
                  <div
                    style={{
                      background: 'rgba(255, 73, 41, 0.1)',
                      borderLeft: '4px solid #FF4929',
                      padding: '12px 16px',
                      marginBottom: '20px',
                    }}
                  >
                    <strong>Corporate Entity:</strong> MyTravelExpert, Bagdogra Bhujiapani, M.E.S. Colony, P.O. &amp; P.S. – Bagdogra, District Darjeeling, West Bengal - 734014. Helpline: +91 8001247778.
                  </div>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>1. Scope &amp; Personal Data Handling</h3>
                  <p style={{ marginBottom: '16px' }}>
                    We collect traveler names, mobile numbers, emails, and mandatory government photo identification solely for the purpose of booking accommodations, securing dedicated mountain vehicles, and obtaining official Protected Area Permits (PAP) from Indian military checkposts and Bhutan immigration.
                  </p>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>2. Data Protection Guarantee</h3>
                  <p style={{ marginBottom: '16px' }}>
                    We never sell, rent, or trade your data to marketing third parties. Permit documentation is securely discarded following the completion of your itinerary in accordance with the Digital Personal Data Protection standards of India.
                  </p>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>3. Anti-Scam &amp; Business Distinction</h3>
                  <p style={{ marginBottom: '16px' }}>
                    MyTravelExpert operates strictly through <strong>https://www.mytravelexpert.tech</strong> and verified contact channels (+91 8001247778 / infomytravelexpert4306@gmail.com). We never request UPI passwords or unsolicited funds transfers to unauthorized third parties.
                  </p>
                  <p>
                    For the complete standalone policy document, visit our <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#FF4929', textDecoration: 'underline' }}>Privacy Policy Webpage</a>.
                  </p>
                </div>
              )}

              {legalModalDoc === 'terms' && (
                <div>
                  <div
                    style={{
                      background: 'rgba(255, 73, 41, 0.1)',
                      borderLeft: '4px solid #FF4929',
                      padding: '12px 16px',
                      marginBottom: '20px',
                    }}
                  >
                    <strong>Jurisdiction:</strong> Governed by the courts of District Darjeeling / Siliguri, West Bengal, India.
                  </div>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>1. Inclusions &amp; Pricing</h3>
                  <p style={{ marginBottom: '16px' }}>
                    All tour packages include designated private mountain transit (fuel, driver lodging, tolls, parking), hotel stays with specified meal plans, and standard permit processing. Optional vehicle upgrades or high-altitude heater surcharges are explicitly detailed prior to confirmation.
                  </p>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>2. Mountain Weather &amp; Road Advisories</h3>
                  <p style={{ marginBottom: '16px' }}>
                    Transit across high passes (Nathula at 14,140 ft, Zero Point at 15,300 ft, and Zuluk) is subject to Border Roads Organisation (BRO) clearance and weather safety. If a pass is closed by authorities, our dispatch desk immediately arranges alternative scenic circuits.
                  </p>
                  <p>
                    Full details available at <a href="/terms.html" target="_blank" rel="noopener noreferrer" style={{ color: '#FF4929', textDecoration: 'underline' }}>Terms &amp; Conditions Webpage</a>.
                  </p>
                </div>
              )}

              {legalModalDoc === 'booking' && (
                <div>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>1. Reservation Process</h3>
                  <p style={{ marginBottom: '16px' }}>
                    Trips are confirmed via formal booking vouchers bearing reference numbers (#MTE-XXXXX). A 20% advance hold secures your hotel categories and vehicle allocation.
                  </p>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>2. 10% VIP Club Benefit</h3>
                  <p style={{ marginBottom: '16px' }}>
                    The 10% VIP Club discount applies to all customized first bookings made online or through our concierge desk. Free date rescheduling is permitted up to 14 days before tour arrival.
                  </p>
                  <p>
                    Review full policy at <a href="/booking-policy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#FF4929', textDecoration: 'underline' }}>Booking Policy Webpage</a>.
                  </p>
                </div>
              )}

              {legalModalDoc === 'cancellation' && (
                <div>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Fair Refund Slabs</h3>
                  <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                    <li><strong>30+ Days Prior:</strong> 90% Refund (10% administrative retention).</li>
                    <li><strong>15–29 Days Prior:</strong> 75% Refund.</li>
                    <li><strong>7–14 Days Prior:</strong> 50% Refund.</li>
                    <li><strong>Under 7 Days:</strong> 100% retention with 12-month travel credit voucher options available.</li>
                  </ul>
                  <h3 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Refund Execution</h3>
                  <p style={{ marginBottom: '16px' }}>
                    Refunds are processed back to the original payment source within 5 to 7 banking days with official bank UTR confirmation.
                  </p>
                  <p>
                    Review the full schedule at <a href="/cancellation-refund-policy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#FF4929', textDecoration: 'underline' }}>Cancellation &amp; Refund Policy Webpage</a>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Travel Guide Reader Modal */}
      <BlogReaderModal
        story={activeStory}
        onClose={() => setActiveStory(null)}
        onOpenConsultation={() => {
          setActiveStory(null);
          setIsConsultationOpen(true);
        }}
      />

      {/* 24x7 HIMALAYAN EXPEDITION CONSULTATION MODAL */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialSubject={selectedPackage.title}
        initialBasePrice={selectedPackage.price}
        savedInquiries={[]}
        onSaveInquiry={(record) => {
          saveInquiryToLocalBackup(record.referenceCode, {
            fullName: record.fullName,
            pkg: record.subject,
            travelDate: record.travelMonth,
            guests: record.guests,
            total: record.finalTotal,
          });
        }}
      />

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
            ref={drawerRef}
            data-lenis-prevent="true"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
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
              outline: 'none',
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
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                borderBottom: '1px solid rgba(31, 38, 31, 0.14)',
                backgroundColor: '#F6F4EF',
                padding: '0 16px',
                gap: '4px',
              }}
            >
              {(
                [
                  { id: 'packages', label: `Packages (${TOUR_PACKAGES.length})` },
                  { id: 'hotels', label: `Stays (${LUXURY_HOTELS.length})` },
                  { id: 'cabs', label: `Fleet (${TAXI_FLEET.length})` },
                  { id: 'calculator', label: '★ 10% VIP Quote' },
                ] as { id: DrawerTab; label: string }[]
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 10px',
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderBottom: active ? '3px solid #FF4929' : '3px solid transparent',
                      backgroundColor: active ? 'rgba(255, 73, 41, 0.08)' : 'transparent',
                      color: active ? '#FF4929' : '#1F261F',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minHeight: '44px',
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
                    <div style={{ flex: '1 1 200px', minWidth: '180px', maxWidth: '100%' }}>
                      <input
                        type="text"
                        aria-label="Search tour packages"
                        placeholder="Search packages (e.g., Lachung, Bhutan)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          border: '1px solid rgba(31, 38, 31, 0.25)',
                          backgroundColor: '#FFFFFF',
                          color: '#1F261F',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
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
                          setSummaryReady(false);
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
                      {formErrors.email && (
                        <div style={{ color: '#D92D20', fontSize: '11px', marginTop: '3px' }}>
                          {formErrors.email}
                        </div>
                      )}
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

                    {/* Honeypot field for automated bot spam protection */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                    >
                      <label htmlFor="mte-hp-website">Website</label>
                      <input
                        id="mte-hp-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypotWebsite}
                        onChange={(e) => setHoneypotWebsite(e.target.value)}
                      />
                    </div>

                    {submitError && (
                      <div
                        role="alert"
                        style={{
                          padding: '10px 12px',
                          backgroundColor: 'rgba(217, 45, 32, 0.1)',
                          border: '1px solid #D92D20',
                          color: '#B42318',
                          fontSize: '12px',
                          lineHeight: 1.5,
                        }}
                      >
                        <div>{submitError}</div>
                        {enquiryReference && (
                          <div style={{ marginTop: '6px' }}>
                            <a
                              href={`https://wa.me/918001247778?text=${encodeURIComponent(
                                `Hello MyTravelExpert! Inquiry Summary (#${enquiryReference}) for ${selectedPackage.title} (${guests} travellers, ${travelDate}). Name: ${customerName}, Phone: ${customerPhone}. Estimated Total: ₹${quote.finalTotal.toLocaleString('en-IN')}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1F261F',
                                fontWeight: 700,
                                textDecoration: 'underline',
                              }}
                            >
                              Open WhatsApp enquiry (#{enquiryReference}) →
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ fontSize: '11px', color: '#666' }}>
                      By confirming, you agree to our{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModalDoc('terms')}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#FF4929',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '11px',
                        }}
                      >
                        Terms &amp; Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => setLegalModalDoc('privacy')}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#FF4929',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '11px',
                        }}
                      >
                        Privacy Policy
                      </button>
                      .
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 18px',
                        backgroundColor: isSubmitting ? '#7A827A' : '#FF4929',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 600,
                        cursor: isSubmitting ? 'wait' : 'pointer',
                      }}
                    >
                      {isSubmitting
                        ? 'Recording Enquiry...'
                        : 'Lock 10% VIP Quote & Request Callback'}
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

                      {summaryReady && (
                        <div
                          style={{
                            marginTop: '20px',
                            padding: '16px',
                            backgroundColor: 'rgba(255, 73, 41, 0.12)',
                            border: '1px solid #FF4929',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#FF4929', marginBottom: '6px' }}>
                            Your enquiry summary is ready. Continue in WhatsApp.
                          </div>
                          <div style={{ marginBottom: '12px', lineHeight: 1.5 }}>
                            Enquiry Ref <strong>#{enquiryReference}</strong> prepared for{' '}
                            <strong>{customerName}</strong> ({customerPhone}). Please choose a button below to open and deliver your quotation to our Bagdogra desk:
                          </div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <a
                              href={`https://wa.me/918001247778?text=${encodeURIComponent(
                                `Hello MyTravelExpert! Enquiry Summary (#${enquiryReference}):\n- Package: ${selectedPackage.title} (${selectedPackage.durationText})\n- Travel Date: ${travelDate}\n- Travellers: ${guests}\n- Vehicle: ${selectedCab ? selectedCab.name : 'Standard Included'}\n- VIP 10% Discount: ${vipDiscount ? 'Applied' : 'No'}\n- Calculated Total: ₹${quote.finalTotal.toLocaleString('en-IN')}\n- Name: ${customerName}\n- Phone: ${customerPhone}\n${customerEmail ? `- Email: ${customerEmail}\n` : ''}- Notes: ${customNotes || 'None'}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-block',
                                padding: '10px 16px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: '3px',
                              }}
                            >
                              Open WhatsApp enquiry
                            </a>
                            <a
                              href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
                                `Himalayan Tour Enquiry #${enquiryReference} — ${selectedPackage.title}`
                              )}&body=${encodeURIComponent(
                                `Hello MyTravelExpert Desk,\n\nPlease find my customized tour enquiry below:\n- Reference: #${enquiryReference}\n- Package: ${selectedPackage.title} (${selectedPackage.durationText})\n- Travel Date: ${travelDate}\n- Travellers: ${guests}\n- Vehicle Preference: ${selectedCab ? selectedCab.name : 'Standard Included'}\n- VIP 10% Discount: ${vipDiscount ? 'Yes' : 'No'}\n- Calculated Total: ₹${quote.finalTotal.toLocaleString('en-IN')}\n- Name: ${customerName}\n- Phone: ${customerPhone}\n- Email: ${customerEmail || 'Not provided'}\n- Notes: ${customNotes || 'None'}\n\nPlease share booking availability and confirmation.`
                              )}`}
                              style={{
                                display: 'inline-block',
                                padding: '10px 16px',
                                backgroundColor: '#F6F4EF',
                                color: '#1F261F',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                borderRadius: '3px',
                              }}
                            >
                              Open email enquiry
                            </a>
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
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('privacy')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF4929',
                            fontSize: '11px',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Privacy Policy
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('terms')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF4929',
                            fontSize: '11px',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Terms
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('booking')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF4929',
                            fontSize: '11px',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Booking Policy
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => setLegalModalDoc('cancellation')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#FF4929',
                            fontSize: '11px',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Refunds
                        </button>
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
