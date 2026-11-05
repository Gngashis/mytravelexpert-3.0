/**
 * ============================================================================
 * MY TRAVEL EXPERT (MTE) — COMMERCIAL PRICING & TELEMETRY ENGINE
 * ============================================================================
 * Lead Systems Architect: Senior Principal Creative Technologist
 * Module: Expedition Quoting, Fleet Allocation & Filter Invariant Matrix
 * Pure TypeScript Domain Logic
 * Bespoke Himalayan Quoting & Transit Logic
 * Copyright (c) 2026 MyTravelExpert. All Rights Reserved.
 * ============================================================================
 */

import { TourPackage, LuxuryHotel, TaxiCab } from '../data/travelData';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'duration-asc';

export interface PackageFilterCriteria {
  region?: string;
  searchQuery?: string;
  durationRange?: 'all' | '1-3' | '4-5' | '6+';
  sortBy?: SortOption;
}

export interface QuoteCalculationInput {
  basePricePerUnit: number;
  guestsOrUnits: number;
  applyVipDiscount: boolean;
  cabAddOnBaseFare?: number;
}

export interface QuoteCalculationResult {
  subtotal: number;
  vipDiscountAmount: number;
  cabAddOn: number;
  finalTotal: number;
  perPersonEffective: number;
}

export interface InquiryFormInput {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  travelMonth: string;
  guests: number;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof InquiryFormInput, string>>;
}

export function filterAndSortPackages(
  packages: TourPackage[],
  criteria: PackageFilterCriteria
): TourPackage[] {
  const { region = 'All', searchQuery = '', durationRange = 'all', sortBy = 'featured' } = criteria;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = packages.filter((pkg) => {
    if (region && region !== 'All' && pkg.region !== region) {
      return false;
    }
    if (durationRange === '1-3' && pkg.days > 3) return false;
    if (durationRange === '4-5' && (pkg.days < 4 || pkg.days > 5)) return false;
    if (durationRange === '6+' && pkg.days < 6) return false;

    if (normalizedQuery) {
      const haystack = `${pkg.title} ${pkg.region} ${pkg.locationLabel} ${pkg.destinationTag} ${pkg.overview}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'duration-asc') {
    sorted.sort((a, b) => a.days - b.days || a.price - b.price);
  } else {
    sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.bestSeller) - Number(a.bestSeller));
  }

  return sorted;
}

export function filterHotels(hotels: LuxuryHotel[], cityFilter: string, searchQuery = ''): LuxuryHotel[] {
  const q = searchQuery.trim().toLowerCase();
  return hotels.filter((h) => {
    if (cityFilter && cityFilter !== 'All' && h.city.toLowerCase() !== cityFilter.toLowerCase()) {
      return false;
    }
    if (q) {
      const hay = `${h.name} ${h.category} ${h.city} ${h.state} ${h.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function filterCabs(cabs: TaxiCab[], seatFilter: 'All' | '2' | '4' | '6-7' | '8+', locationFilter = 'All'): TaxiCab[] {
  return cabs.filter((c) => {
    if (seatFilter === '2' && c.seats !== 2) return false;
    if (seatFilter === '4' && c.seats !== 4) return false;
    if (seatFilter === '6-7' && (c.seats < 6 || c.seats > 7)) return false;
    if (seatFilter === '8+' && c.seats < 8) return false;
    if (locationFilter !== 'All' && !c.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    return true;
  });
}

export function calculateExpeditionQuote(input: QuoteCalculationInput): QuoteCalculationResult {
  const safeGuests = Math.max(1, Math.round(input.guestsOrUnits));
  const subtotal = Math.max(0, input.basePricePerUnit) * safeGuests;
  const cabAddOn = Math.max(0, input.cabAddOnBaseFare || 0);
  const rawTotal = subtotal + cabAddOn;
  const vipDiscountAmount = input.applyVipDiscount ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - vipDiscountAmount;
  const perPersonEffective = Math.round(finalTotal / safeGuests);

  return {
    subtotal,
    vipDiscountAmount,
    cabAddOn,
    finalTotal,
    perPersonEffective
  };
}

export function validateInquiryForm(input: InquiryFormInput): ValidationResult {
  const errors: Partial<Record<keyof InquiryFormInput, string>> = {};

  if (!input.fullName || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const cleanedPhone = (input.phone || '').replace(/[\s\-()]/g, '');
  if (!cleanedPhone || !/^\+?[0-9]{10,14}$/.test(cleanedPhone)) {
    errors.phone = 'Please enter a valid 10-digit phone or WhatsApp number.';
  }

  if (!input.message || input.message.trim().length < 5) {
    errors.message = 'Please enter a brief message or itinerary preference.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
