import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortPackages,
  filterHotels,
  filterCabs,
  calculateExpeditionQuote,
  validateInquiryForm
} from './bookingLogic';
import { TOUR_PACKAGES, LUXURY_HOTELS, TAXI_FLEET } from '../data/travelData';

test('filterAndSortPackages filters by region and sorts by price ascending', () => {
  const bhutanPackages = filterAndSortPackages(TOUR_PACKAGES, {
    region: 'Bhutan',
    sortBy: 'price-asc'
  });
  assert.equal(bhutanPackages.length, 3);
  assert.equal(bhutanPackages[0].price, 15000);
  assert.equal(bhutanPackages[2].price, 27500);
});

test('filterAndSortPackages filters by duration range and search query', () => {
  const shortTrips = filterAndSortPackages(TOUR_PACKAGES, {
    durationRange: '1-3',
    searchQuery: 'Sikkim'
  });
  assert.equal(shortTrips.length, 1);
  assert.equal(shortTrips[0].slug, 'sikkim-2n-3d');
});

test('filterHotels filters by city correctly', () => {
  const gangtokHotels = filterHotels(LUXURY_HOTELS, 'Gangtok');
  assert.equal(gangtokHotels.length, 3);
});

test('filterCabs filters by seat category and location', () => {
  const largeCabs = filterCabs(TAXI_FLEET, '8+');
  assert.equal(largeCabs.length, 3);
  const bagdograCabs = filterCabs(TAXI_FLEET, '6-7', 'BAGDOGRA');
  assert.equal(bagdograCabs.length, 2);
});

test('calculateExpeditionQuote applies 10% VIP discount accurately', () => {
  const quote = calculateExpeditionQuote({
    basePricePerUnit: 14500,
    guestsOrUnits: 4,
    applyVipDiscount: true,
    cabAddOnBaseFare: 6000
  });
  // subtotal = 58000, cab = 6000, raw = 64000, 10% discount = 6400, final = 57600
  assert.equal(quote.subtotal, 58000);
  assert.equal(quote.vipDiscountAmount, 6400);
  assert.equal(quote.finalTotal, 57600);
  assert.equal(quote.perPersonEffective, 14400);
});

test('validateInquiryForm rejects invalid inputs and accepts valid details', () => {
  const invalid = validateInquiryForm({
    fullName: 'A',
    email: 'not-an-email',
    phone: '123',
    subject: 'Darjeeling Tour',
    travelMonth: 'November 2026',
    guests: 2,
    message: 'Hi'
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.message);

  const valid = validateInquiryForm({
    fullName: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 9876543210',
    subject: 'Sikkim 6N/7D Expedition',
    travelMonth: 'December 2026',
    guests: 4,
    message: 'Looking for a customized 6N/7D Gangtok Lachung Lachen tour with Innova Crysta.'
  });
  assert.equal(valid.valid, true);
});
