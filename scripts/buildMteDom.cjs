const fs = require('fs');
const path = require('path');

// 1. Pixel-stepped vertical slit SVG logo generator (authentic Son Daven style)
const GLYPHS = {
  M: [
    "1100011",
    "1110111",
    "1111111",
    "1101011",
    "1100011",
    "1100011",
    "1100011"
  ],
  Y: [
    "1100011",
    "1100011",
    "0110110",
    "0011100",
    "0011100",
    "0011100",
    "0011100"
  ],
  T: [
    "1111111",
    "1111111",
    "0011100",
    "0011100",
    "0011100",
    "0011100",
    "0011100"
  ],
  R: [
    "1111110",
    "1100011",
    "1100011",
    "1111110",
    "1101100",
    "1100110",
    "1100011"
  ],
  A: [
    "0011100",
    "0110110",
    "1100011",
    "1111111",
    "1100011",
    "1100011",
    "1100011"
  ],
  V: [
    "1100011",
    "1100011",
    "1100011",
    "1100011",
    "0110110",
    "0011100",
    "0001000"
  ],
  E: [
    "1111111",
    "1100000",
    "1100000",
    "1111110",
    "1100000",
    "1100000",
    "1111111"
  ],
  L: [
    "1100000",
    "1100000",
    "1100000",
    "1100000",
    "1100000",
    "1100000",
    "1111111"
  ],
  X: [
    "1100011",
    "0110110",
    "0011100",
    "0011100",
    "0011100",
    "0110110",
    "1100011"
  ],
  P: [
    "1111110",
    "1100011",
    "1100011",
    "1111110",
    "1100000",
    "1100000",
    "1100000"
  ],
  " ": [
    "0000",
    "0000",
    "0000",
    "0000",
    "0000",
    "0000",
    "0000"
  ]
};

function generateSlitSvg(text, viewW, viewH, startY = 2, rowH = 2.8, colStep = 1.6, barW = 1.1) {
  let rects = [];
  let cursorX = 2;
  for (const ch of text) {
    const g = GLYPHS[ch] || GLYPHS[" "];
    const cols = g[0].length;
    for (let c = 0; c < cols; c++) {
      // Subdivide each pixel column into 2 vertical halftone slit bars for the signature Son Daven look
      for (let sub = 0; sub < 2; sub++) {
        const x = +(cursorX + (c * 2 + sub) * (colStep / 2)).toFixed(2);
        const w = +(barW / 2).toFixed(2);
        // Merge contiguous vertical segments
        let r = 0;
        while (r < g.length) {
          if (g[r][c] === '1') {
            let rEnd = r;
            while (rEnd + 1 < g.length && g[rEnd + 1][c] === '1') rEnd++;
            // Slight serrated organic step on alternate sub-bars
            const offsetTop = (sub === 1 && r === 0) ? 0.6 : 0;
            const offsetBot = (sub === 0 && rEnd === g.length - 1) ? 0.6 : 0;
            const y = +(startY + r * rowH + offsetTop).toFixed(2);
            const h = +((rEnd - r + 1) * rowH - offsetTop - offsetBot).toFixed(2);
            rects.push(`M${x} ${y}H${+(x + w).toFixed(2)}V${+(y + h).toFixed(2)}H${x}Z`);
            r = rEnd + 1;
          } else {
            r++;
          }
        }
      }
    }
    cursorX += cols * colStep + (ch === ' ' ? 2.5 : 2.2);
  }
  const actualW = Math.ceil(cursorX + 2);
  return `<svg width="100%" height="100%" viewBox="0 0 ${actualW} ${viewH}" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${rects.join('')}" fill="currentColor"/></svg>`;
}

function generateTwoLineSlitSvg(line1, line2) {
  const svg1 = generateSlitSvg(line1, 220, 44, 4, 2.2, 1.5, 1.15);
  const svg2 = generateSlitSvg(line2, 220, 44, 24, 2.4, 1.9, 1.45);
  const path1 = (svg1.match(/d="([^"]+)"/) || [])[1] || '';
  const path2 = (svg2.match(/d="([^"]+)"/) || [])[1] || '';
  return `<svg width="100%" height="100%" viewBox="0 0 185 46" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${path1}${path2}" fill="currentColor"/></svg>`;
}

const LOGO_FULL = `<div class="logo w-embed">${generateSlitSvg("MY TRAVEL EXPERT", 224, 24, 2, 2.85, 1.45, 1.1)}</div>`;
const LOGO_SHORT = `<div class="logo-short w-embed">${generateSlitSvg("MTE", 56, 24, 2, 2.85, 2.1, 1.55)}</div>`;
const LOGO_BLAGO = `<div class="logo-blago w-embed">${generateTwoLineSlitSvg("MY TRAVEL", "EXPERT")}</div>`;

// 2. Load raw Son Daven body HTML
let html = fs.readFileSync('.playwright-cli/sondaven-body.html', 'utf8');

// Remove external Webflow/Slater script tags at the very bottom of body
html = html.replace(/<script src="https:\/\/d3e54v103j8qbb\.cloudfront\.net[^>]*><\/script>/g, '');
html = html.replace(/<script src="https:\/\/cdn\.prod\.website-files\.com[^>]*><\/script>/g, '');
html = html.replace(/<script src="https:\/\/cdn\.jsdelivr\.net[^>]*><\/script>/g, '');
html = html.replace(/<script src="https:\/\/assets\.sondaven\.com\/ActiveFrame\.js"><\/script>/g, '');
html = html.replace(/<script>[\s\S]*?slater\.app[\s\S]*?<\/script>/g, '');
// Remove <script type="text/x-wf-template"> templates so nothing leaks
html = html.replace(/<script type="text\/x-wf-template"[^>]*>[\s\S]*?<\/script>/g, '');

// Replace all srcset and sizes attributes so our custom src attributes always take effect
html = html.replace(/\s+srcset="[^"]*"/g, '');
html = html.replace(/\s+sizes="[^"]*"/g, '');

// Replace all external CDN URLs with local /assets/sondaven/ paths
html = html.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^/]+\/([^"'\s)&]+)/g, (_, fname) => {
  return `/assets/sondaven/${decodeURIComponent(fname)}`;
});
html = html.replace(/https:\/\/assets\.sondaven\.com\/scenes\/([^"'\s)&]+)/g, (_, fname) => {
  return `/assets/sondaven/scenes/${decodeURIComponent(fname)}`;
});
html = html.replace(/https:\/\/assets\.sondaven\.com\/([^"'\s)&]+)/g, (_, fname) => {
  return `/assets/sondaven/${decodeURIComponent(fname)}`;
});

// Replace SVG logos
html = html.replace(/<div class="logo w-embed">[\s\S]*?<\/svg><\/div>/g, LOGO_FULL);
html = html.replace(/<div class="logo-short w-embed">[\s\S]*?<\/svg><\/div>/g, LOGO_SHORT);
html = html.replace(/<div class="logo-blago w-embed">[\s\S]*?<\/svg><\/div>/g, `<div class="logo-mte w-embed">${generateTwoLineSlitSvg("MY TRAVEL", "EXPERT")}</div>`);
html = html.replace(/<div class="blago-mark text-dark w-embed">[\s\S]*?<\/svg><\/div>/g, '<div class="mte-mark text-dark w-embed"><svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 15.5L7.2 5.2L11.2 11.8L14.2 7.4L18.5 15.5H1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.4 8.5L7.2 5.2L9.1 8.5" fill="currentColor"/></svg></div>');
html = html.replace(/logo-blago-w/g, 'logo-mte-w');
html = html.replace(/logo-blago/g, 'logo-mte');
html = html.replace(/blago-mark/g, 'mte-mark');

// Fix language switcher link (/ -> #apartments)
html = html.replace(/<a href="\/" class="nav-item w-inline-block">/g, '<a href="#apartments" data-mte-open="catalogue" data-barba-prevent="all" class="nav-item w-inline-block">');
html = html.replace(/>UA</g, '>16 TOURS<');

// Replace Vimeo iframes with local video so Cloudflare Turnstile never fires CSP errors
html = html.replace(/<iframe[\s\S]*?player\.vimeo\.com[\s\S]*?<\/iframe>/gi, '<video src="/assets/sondaven/son-daven_short.mp4" controls muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video>');

// Hide cookie banner so it doesn't obstruct the lower-left hero on load
html = html.replace('<div fs-cc="banner" class="cookies">', '<div fs-cc="banner" class="cookies" style="display:none!important">');

// 3. Replace Preloader & Hero copy
const exactReplacements = [
  // Preloader
  ['Between the mountains and the forest', 'Between Kanchenjunga and the tea valleys'],
  ['where the Carpathians whisper', 'where the Eastern Himalayas whisper'],
  ['A legend is born', 'Your Himalayan journey begins'],

  // Header nav
  ['<div hover="text" class="p6 text-dark">About</div>', '<div hover="text" class="p6 text-dark">About Us</div>'],
  ['<div hover="text" class="p6 text-dark">Location</div>', '<div hover="text" class="p6 text-dark">Destinations</div>'],
  ['<div hover="text" class="p6 text-dark">Uniqueness</div>', '<div hover="text" class="p6 text-dark">Why Us</div>'],
  ['<div hover="text" class="p6 text-dark">Apartments</div>', '<div hover="text" class="p6 text-dark">Packages</div>'],
  ['<div hover="text" class="p6 text-dark">Gallery</div>', '<div hover="text" class="p6 text-dark">Stays &amp; Fleet</div>'],
  ['<div hover="text" class="p6 text-dark">Contact</div>', '<div hover="text" class="p6 text-dark">Contact</div>'],
  ['<div hover="text" class="p6 text-dark">Consultation</div>', '<div hover="text" class="p6 text-dark">Plan Your Trip</div>'],

  // Hero
  ['investment project', 'bespoke himalayan journeys'],
  ['expected annual return', 'vip club instant discount'],
  ['capitalisation', 'group &amp; multi-tour'],
  ['potential', 'savings'],
  ['Resort Design Hotel in Yaremche', 'Bespoke Himalayan Tours from Bagdogra'],
  ['<span class="hero-s_info_item_active text-light">Yaremche</span>', '<span class="hero-s_info_item_active text-light">Bagdogra &amp; Darjeeling</span>'],
  ['<span class="d-block">Ivano-Frankivsk</span>', '<span class="d-block">Sikkim • Bhutan • Dooars</span>'],
  ['Development by', 'Curated by'],
  ['Blago', 'MyTravelExpert'],
  ['Construction Period', '16+ Tour Packages'],
  ['2026 — 2029', 'Darjeeling • Sikkim • Bhutan'],
  ['Invest in Son Daven', 'Explore 16+ Packages'],
  ['Design hotel <br/>in the heart of Yaremche', 'Bespoke Himalayan journeys <br/>crafted from Bagdogra'],
  ['From mountain whispers to financial peaks: own a piece of a mystical hotel by blago in the heart of Yaremche', 'From Darjeeling tea estates to Sikkim alpine passes &amp; Bhutan monasteries: 16+ handcrafted expeditions by MyTravelExpert'],

  // Prolog & About
  ['“Among these mountains, where the wind becomes a voice and forests guard the wisdom of thousands of years, the Carpathian heritage comes alive—a primal force that reconnects people with their roots and empowers them to bring an ancient dream to life”', '“Among the Eastern Himalayas, where prayer flags dance in the mountain wind and emerald tea gardens meet snow-clad Kanchenjunga peaks, MyTravelExpert crafts journeys that turn every road from Bagdogra into a lifelong story”'],
  ['Download the PDF presentation', 'Browse All 16 Packages &amp; Tariffs'],
  ['<p class="p3 text-dark">by blago</p>', '<p class="p3 text-dark">Bagdogra • Darjeeling</p>'],
  ['Son Daven is a new place of power in the Carpathians, where Hutsul culture is reinterpreted through architecture, spatial design, hospitality, and contemporary art. Here, traditions take on a new form, and the ancient spirit of the Carpathians merges with modern comfort.', 'MyTravelExpert is your trusted local travel partner in the Eastern Himalayas, where Darjeeling, Sikkim, Bhutan, Silk Route, and Dooars expeditions are crafted with local care, verified mountain vehicles, and handpicked stays.'],
  ['Concept', 'Philosophy'],
  ['The architecture of the complex grows from the mountains, preserving their strength in stone and warmth in wood. Panoramic terraces open up views from which the spirit intercepts, and traditions intertwine with modernity, creating a new format of recreation: deep, meaningful, filled with the energy of nature and culture of Hutsul region.', 'Every journey begins at our Bagdogra &amp; NJP hub, connecting you to panoramic Kanchenjunga sunrises, high-altitude glacial lakes in North Sikkim, sacred Dzongs in Bhutan, and lush wildlife forests in Dooars.'],
  ['A dream of a place where legends, nature, and modern comforts come together as one', 'Where authentic Himalayan hospitality, local mountain expertise, and five-star comfort come together as one'],
  ['See you in a dream', 'See you in the mountains'],

  // Location & Map Pins & Infrastructure Slider
  ['Waterfall Breakdown', 'Darjeeling &amp; Tiger Hill'],
  ['Park of legends “Gedzo”', 'Gangtok &amp; Tsomgo Lake'],
  ['Hutsulshchyna (restaurant and architectural monument)', 'Lachung &amp; Yumthang Valley'],
  ['Dovbucha Rocks', 'Nathula Pass &amp; Silk Route'],
  ['1200 m', '14,140 ft'],
  ['Park “Carpathians in miniature”', 'Royal Bhutan (Paro &amp; Thimphu)'],
  ['3 km', '4N–7N'],
  ['Hutsul Souvenir Market', 'Pelling Skywalk &amp; Dooars'],
  ['Son Daven is located at the foothills of the Carpathian Mountains, in the very heart of Yaremche—the capital of Hutsul heritage and enchanting nature.', 'MyTravelExpert is headquartered at Bagdogra Bhujiapani (M.E.S. Colony, Darjeeling - 734014)—the gateway to Darjeeling, Sikkim, Bhutan, Silk Route, and Dooars.'],
  ['Infrastructure', 'Signature Circuits'],
  ['walk to', 'circuit to'],
  ['On foot to ', 'Direct SUV to '],
  ['Carpathians in Miniature park', 'Darjeeling Mall &amp; Tiger Hill'],
  ['Probiy waterfall', 'Gangtok, Tsomgo &amp; Nathula'],
  ['Gedzio Legend Park', 'Lachung &amp; Yumthang Valley'],
  ['Hutsul souvenir market', 'Gorumara &amp; Dooars Safari'],
  ['Str. I.Petrasha, 6/3, Yaremche, Ivano-Frankivsk region, 78503', 'Bagdogra Bhujiapani, M.E.S. Colony, Darjeeling - 734014'],
  ['Str. I.Petrasha, 6/3, Yaremche, Ivano-Frankivsk region', 'Bagdogra Bhujiapani, M.E.S. Colony, Darjeeling - 734014'],

  // Uniqueness Section & 8 Benefit Cards
  ['Why Son Daven captivate', 'Why MyTravelExpert Captivates'],
  ['Why MyTravelExpert captivate', 'Why MyTravelExpert Captivates'],
  ['Wellness &amp; SPA', '100% Tailor-Made Tours'],
  ['conceived as a place to restore body and spirit. The spacious wellness complex offers guests:', 'Every itinerary is customized around your pace, travel dates, and budget across 16+ signature circuits:'],
  ['Indoor pool.', 'Darjeeling, Kalimpong &amp; Mirik heritage tea circuits.'],
  ['A collection of saunas and baths, salt and ice rooms.', 'East, North, West &amp; South Sikkim high-altitude expeditions.'],
  ['Relaxation and sleep zones where complete harmony reigns.', 'Royal Bhutan road &amp; flight tours via Phuentsholing or Paro.'],
  ['Cosmetology and massage rooms that provide care.', 'Old Silk Route Zuluk loops &amp; Dooars wildlife jungle safaris.'],
  ['Private SPA unit for adults with a panoramic infinity pool and rooms for recovery rituals.', 'Instant 10% VIP Club discount on all customized family, honeymoon &amp; group bookings.'],

  ['Cuisine', 'Handpicked Luxury Resorts'],
  ['Is yet another language through which we tell our legend.', 'Direct B2B partner rates at the finest 5★, 4★ &amp; boutique properties in the Himalayas.'],
  ['The main restaurant offering an author’s interpretation of Hutsul and European cuisines.', 'Mayfair Spa Resort &amp; Casino (Gangtok 5★) &amp; The Elgin Heritage (Darjeeling 5★).'],
  ['A rooftop restaurant and bar with panoramic views of the Carpathians.', 'Taj Tashi (Thimphu Bhutan 5★) &amp; Sterling Park Resort (Darjeeling 4★).'],
  ['A café patisserie with freshly baked pastries and desserts.', 'Udaan Woodberry (Gangtok 4★) &amp; Summit Newa Regency (Pelling 4★).'],
  ['A lobby bar with signature cocktails and a refined atmosphere.', 'Verified mountain-view homestays in Lachung, Sillery Gaon, Zuluk &amp; Takdah.'],

  ['When even the sheep guide you to yoga...', '13+ Dedicated Mountain Fleet'],
  ['Our design hotel offers everything you need to stay active.', 'Sanitized, GPS-tracked hill vehicles driven by experienced local mountain captains.'],
  ['A fitness center with modern equipment.', 'Luxury SUVs: Toyota Innova Crysta, Mahindra Scorpio, Xylo &amp; Bolero.'],
  ['Dedicated spaces for group workouts.', 'Comfort Sedans &amp; MPVs: Maruti Ertiga, Swift Dzire &amp; WagonR.'],
  ['Yoga, and TRX training.', 'Group Coaches: 13–26 Seater Force Tempo Travellers &amp; Luxury Coasters.'],

  ['A space where ideas are born', 'Instant Permits &amp; Border Visas'],
  ['An art space for exhibitions, cultural events, festivals, and art installations.', 'Hassle-free Protected Area Permits (PAP) for Tsomgo Lake, Nathula Pass, Lachung, Yumthang &amp; Zero Point.'],
  ['A coworking area and a flexible conference venue for business meetings and events of any format.', 'Complete Bhutan Sustainable Development Fee (SDF), entry permits &amp; border assistance at Phuentsholing.'],

  ['A place where childhood flourishes among the mountains', 'Family, Honeymoon &amp; Group Specialists'],
  ['A kids&#x27; club and play areas for children of all ages.', 'Carefully paced itineraries suitable for senior citizens, children, and multi-generational families.'],
  ['A dedicated children’s menu in the restaurant, themed celebrations, and creative workshops.', 'Romantic candlelight dinners, flower bed decorations &amp; private cab upgrades for honeymooners.'],
  ['We aim to bring comfort to the little ones and their parents alike.', 'Dedicated tour managers and custom meal plans for corporate MICE &amp; college excursions.'],

  ['Honoring culture, creating legens', 'Authentic Himalayan Experiences'],
  ['Son Daven is a space where traditions come alive. We will revive Hutsul customs in a contemporary form:', 'MyTravelExpert connects you deeply with the living heritage of the Eastern Himalayas:'],
  ['MyTravelExpert is a space where traditions come alive. We will revive Hutsul customs in a contemporary form:', 'MyTravelExpert connects you deeply with the living heritage of the Eastern Himalayas:'],
  ['Caroling with the goat and the star.', 'Sunrise over Mt. Kanchenjunga from Tiger Hill &amp; UNESCO Toy Train joyride.'],
  ['Celebrating the mystical Kupala Night by the bonfire.', 'Guided monastery visits at Rumtek, Pemayangtse, Ghoom &amp; Paro Taktsang.'],
  ['And bringing back to life the ancient traditions of the Ukrainian Carpathians.', 'Private tea-plucking &amp; tasting sessions at heritage Darjeeling tea estates.'],

  ['Kids&#x27; cultural camp', 'Offbeat Hamlets &amp; Wildlife Trails'],
  ['Our little guests will discover the world through history and legends, In this way, we&#x27;ll nurture a deep connection to nature and culture from childhood.', 'Go beyond standard tourist points into untouched pine forests, alpine lakes, and jungle watchtowers.'],
  ['Learn about local plants and animals.', 'Gorumara &amp; Jaldapara one-horned rhino &amp; elephant jungle safaris.'],
  ['Practice wool weaving.', 'Sillery Gaon, Echey Gaon, Ramdhura &amp; Chatakpur eco-village stays.'],
  ['Clay painting.', '32 hairpin loops of Zuluk, Nathang Valley &amp; Kupup Elephant Lake.'],
  ['Cheese making.', 'Teesta river white-water rafting &amp; Kalimpong tandem paragliding.'],
  ['And much more...', 'Over 50+ offbeat Himalayan trails customized on request.'],

  ['Dar Daven concept store', '24/7 Bagdogra Support &amp; Best Price'],
  ['Collaborations with Ukrainian artists and brands will offer our guests collectible pieces, fashion artifacts, and meaningful keepsakes created exclusively for Son Daven.', 'Headquartered right near Bagdogra Airport (IXB), our local control desk monitors your journey round the clock.'],
  ['Collaborations with Ukrainian artists and brands will offer our guests collectible pieces, fashion artifacts, and meaningful keepsakes created exclusively for the Himalayas.', 'Headquartered right near Bagdogra Airport (IXB), our local control desk monitors your journey round the clock.'],
  ['Among these collaborations is a joint project with KOTO, a contemporary Ukrainian collectible art brand.', 'Direct local operator pricing with zero middleman commissions or hidden charges.'],
  ['Created especially for us, a limited-edition series of Hutsul warm essentials by Hutsul Authentica will bring tradition to life in a new form.', 'Real-time weather route backup, emergency oxygen cylinders for North Sikkim, and instant 10% VIP Club discount.'],

  // Commissioning -> How We Plan Your Trip
  ['<span>Construction</span><span>timeline</span>', '<span>Booking</span><span>process</span>'],
  ['<div class="h3 text-dark">‘26</div>', '<div class="h3 text-dark">01</div>'],
  ['<div class="h3 text-dark a-right">‘29</div>', '<div class="h3 text-dark a-right">03</div>'],
  ['Construction begins', 'Step 1 • Choose Route &amp; Dates'],
  ['in Q4 2025', '16+ Custom Packages'],
  ['Section 1 ready ', 'Step 2 • Lock 10% VIP Discount'],
  ['in Q4 2027', '20% Advance Hold'],
  ['Section 2 ready ', 'Step 3 • Arrive at Bagdogra / NJP'],
  ['in Q4 2028', 'Private SUV Pickup'],

  // Apartments Header
  ['<h2 class="p6 text-dark a-center">Apartments</h2>', '<h2 class="p6 text-dark a-center">Tour Packages &amp; Fleet</h2>'],
  ['One- to three-bedroom units designed for solo travelers, couples, or families. Panoramic windows, spacious terraces, and natural textures and materials elevate the experience of a Carpathian getaway.', '16 handcrafted tour packages, 6 partner 5★/4★ luxury resorts, and 13+ verified mountain vehicles designed for solo travellers, couples, families, and groups across the Eastern Himalayas.'],
  ['The design features Hutsul touches that bring genuine authenticity to the space.', 'Every package includes private Bagdogra/NJP pickup, inner-line permits, and our 10% VIP Club discount.'],
  ['<h4 class="p6 text-dark">types</h4>', '<h4 class="p6 text-dark">categories</h4>'],

  // Apartment Tabs (6 regions/categories)
  ['<h5 class="p4 text-dark">Studio</h5>', '<h5 class="p4 text-dark">Darjeeling</h5>'],
  ['<h5 class="p4 text-dark">Deluxe</h5>', '<h5 class="p4 text-dark">Sikkim</h5>'],
  ['<h5 class="p4 text-dark">Superior</h5>', '<h5 class="p4 text-dark">Bhutan</h5>'],
  ['<h5 class="p4 text-dark">Suite</h5>', '<h5 class="p4 text-dark">Silk Route</h5>'],
  ['<h5 class="p4 text-dark">Family</h5>', '<h5 class="p4 text-dark">Luxury Stays</h5>'],
  ['<h5 class="p4 text-dark">Penthouse</h5>', '<h5 class="p4 text-dark">Mountain Cabs</h5>'],

  // Replace "Inquire about pricing" and "watch the video" in Apartments
  ['<div hover="text" class="p6 text-light">Inquire about pricing</div>', '<div hover="text" class="p6 text-light">Book / View All 16 Packages</div>'],
  ['<div class="p6 text-dark">watch <br/>the video</div>', '<div class="p6 text-dark">preview <br/>experience</div>'],

  // Finance / Value Section
  ['Financial indicators', 'VIP Club &amp; Pricing'],
  ['<div class="h1 text-dark">Financial</div>', '<div class="h1 text-dark">VIP Club</div>'],
  ['<div class="h1 text-dark">indicators</div>', '<div class="h1 text-dark">&amp; Pricing</div>'],
  ['Dividend payments begin', 'Direct Local Operator Rates'],
  ['in Q4', 'Save'],
  ['>2028<', '>10%–25%<'],
  ['first quarter of 2029', 'Zero Middleman Markup'],
  ['Guaranteed annual return:', 'Exclusive VIP Club Discount:'],
  ['<p class="p3 text-dark">10%</p>', '<p class="p3 text-dark">10% OFF</p>'],
  ['Capitalization:', 'Group &amp; Early-Bird Savings:'],
  ['Increase in the value of an asset following its commissioning', 'Extra savings on combined Sikkim + Darjeeling + Bhutan circuits &amp; group bookings'],
  ['<p class="p3 text-dark">до 30%</p>', '<p class="p3 text-dark">Up to 25%</p>'],
  ['Installment plan', 'Flexible Booking Hold'],
  ['<p class="p3 text-dark">Up to 2 years</p>', '<p class="p3 text-dark">Free Date Reschedule</p>'],
  ['Down payment', 'Reservation Advance'],
  ['<p class="p3 text-dark">From 30%</p>', '<p class="p3 text-dark">From 20%</p>'],
  ['Our forecast', 'Traveller Satisfaction'],
  ['Estimated payback period:', 'Verified Guest Rating:'],
  ['<p class="p6 text-dark a-right">≈7 years</p>', '<p class="p6 text-dark a-right">4.9 ★ / 5.0</p>'],
  ['Average annual occupancy:', 'Repeat &amp; Referral Guests:'],
  ['<p class="p6 text-dark a-right">≈65%</p>', '<p class="p6 text-dark a-right">98% Happy</p>'],
  ['Additional benefits', 'Every Package Includes'],
  ['30 days of complimentary accommodation per year', 'Private AC/Non-AC SUV pickup &amp; drop at Bagdogra Airport (IXB) or NJP Station'],
  ['The complex operates year-round, thus ensuring stable occupancy and returns', 'Handpicked stays with breakfast &amp; dinner, inner-line permits, and sightseeing'],
  ['Our in-house management company, SD Management, handles your apartment professionally without any hassle', '24/7 Bagdogra dispatch support &amp; dedicated local tour coordinator throughout your trip'],

  // Seasons Section
  ['Summer turns this area into an exciting adventure map: hiking trails, mountain river rafting, cultural festivals, and culinary journeys.', 'Spring and summer blanket Darjeeling, Sikkim, and Bhutan in blooming rhododendrons, emerald tea gardens, Teesta river rafting, and wildlife safaris.'],
  ['>35<', '>15,300<'],
  ['>km<', '>ft<'],
  ['to Bukovel, ensuring a steady flow of guests in winter.', 'at Zero Point, Nathula Pass &amp; Tiger Hill—offering crystal-clear Kanchenjunga sunrises and snow expeditions in winter.'],

  // Developer -> Agency Section & Factoids
  ['>developer<', '>agency<'],
  ['A legend brought to life in the very heart of the Carpathians, uniting Past and Future', 'Your local Himalayan travel specialists in Bagdogra—uniting authentic mountain routes with seamless comfort'],
  ['urban tech developer creates a future-ready environment where real estate means more than just square meters. It’s a combination of services, infrastructure, and people-focused care, which shapes a new standard of living.', 'MyTravelExpert is a full-service Himalayan tour operator headquartered in Bagdogra, Darjeeling. We combine direct hotel contracting, an in-house mountain vehicle fleet, and instant permit processing.'],
  ['urban tech', 'Himalayan'],
  ['>20+<', '>16+<'],
  ['years of experience in the real estate market', 'signature Himalayan tour packages'],
  ['Ranked 2nd among developers in Ukraine by Forbes Ukraine', '12+ iconic destinations across Darjeeling, Sikkim, Bhutan &amp; Dooars'],
  ['>37<', '>17+<'],
  ['completed projects', 'dedicated mountain SUVs, coaches &amp; tempo travellers'],
  ['International Property Awards in London', '98% guest satisfaction &amp; 24/7 Bagdogra support desk'],

  // Gallery Section
  ['<h2 class="h2 text-dark">project</h2>', '<h2 class="h2 text-dark">destinations</h2>'],
  ['<div class="h2 text-dark">gallery</div>', '<div class="h2 text-dark">&amp; luxury stays</div>'],
  ['<div class="p6 text-dark">Invest in Son Daven</div>', '<div class="p6 text-dark">Travel with MyTravelExpert</div>'],
  ['Son Daven is designed to restore energy, deliver profit, inspire, and prove that true relaxation is not a place—it’s a state of mind. See you in Son Daven.', 'From Mayfair Spa Resort Gangtok and Elgin Darjeeling to high-altitude passes in North Sikkim and Bhutan—every frame is a real journey waiting for you.'],

  // Blog & Featured Itineraries Section
  ['<h2 class="p6 text-dark a-center">Blog</h2>', '<h2 class="p6 text-dark a-center">Travel Guides &amp; Itineraries</h2>'],
  ['<h3 class="h2 text-dark a-center">Latest News and Updates</h3>', '<h3 class="h2 text-dark a-center">Stories, Guides &amp; Top Packages</h3>'],
  ['<div class="p6 text-dark">News</div>', '<div class="p6 text-dark">Travel Guides</div>'],
  ['<div class="p6 text-dark">Construction progress</div>', '<div class="p6 text-dark">All 16 Tour Packages</div>'],

  // 3 Blog cards
  ['Яремче не Буковель. Куди інвестувати в Карпатах у 2026 році', 'Top 10 Must-Visit Places in Darjeeling for First-Time Travellers'],
  ['Буковель чи Яремче: де сьогодні більше можливостей для інвестора в туристичну нерухомість Карпат?', 'From Tiger Hill sunrise and Batasia Loop to Happy Valley Tea Estate and Peace Pagoda—your complete insider guide to the Queen of the Hills.'],
  ['Туристичний та інвестиційний потенціал Яремче', 'How to Plan the Perfect Sikkim Trip: Permits, Best Time &amp; Routes'],
  ['Чому саме тут формується новий центр прибуткової нерухомості?', 'Everything you need to know about Nathula Pass, Tsomgo Lake, Lachung, Yumthang Valley, and Pelling Skywalk permits from Bagdogra.'],
  ['«The economics are better than in residential real estate»', 'Bhutan Entry Guide for Indian Travellers via Phuentsholing'],
  ['Ivano-Frankivsk’s largest developer blago builds its first aparthotel and they’re not alone. What attracts developers to the hotel market?', 'Step-by-step guide to Sustainable Development Fee (SDF), voter ID/passport rules, Paro Taktsang hike, and best 5N/6D road itineraries.'],

  // 8 Construction progress cards -> 8 Featured Package Quick-Select Cards
  ['<div class="p4 text-dark">2/11/2026</div>', '<div class="p4 text-dark">₹7,500 • 2N/3D</div>'],
  ['Хід будівництва Son Daven у жовтні 2026', 'Darjeeling Short Escape — Tiger Hill, Batasia Loop &amp; Tea Gardens'],
  ['<div class="p4 text-dark">30/9/2026</div>', '<div class="p4 text-dark">₹12,500 • 4N/5D</div>'],
  ['Хід будівництва Son Daven у вересні 2026', 'Gangtok &amp; Darjeeling Twin-Jewel — Tsomgo Lake &amp; Toy Train'],
  ['<div class="p4 text-dark">9/9/2026</div>', '<div class="p4 text-dark">₹16,800 • 5N/6D</div>'],
  ['Хід будівництва Son Daven у серпні 2026', 'North Sikkim Lachung &amp; Yumthang Valley of Flowers Expedition'],
  ['<div class="p4 text-dark">17/8/2026</div>', '<div class="p4 text-dark">₹19,500 • 6N/7D</div>'],
  ['Хід будівництва Son Daven: підсумки липня', 'Grand Sikkim Complete — Gangtok, Lachung, Pelling Skywalk &amp; Ravangla'],
  ['<div class="p4 text-dark">4/7/2026</div>', '<div class="p4 text-dark">₹22,500 • 5N/6D</div>'],
  ['Son Daven: звіт будівництва за червень', 'Magical Bhutan — Phuentsholing, Thimphu, Punakha &amp; Paro Tiger’s Nest'],
  ['<div class="p4 text-dark">2/6/2026</div>', '<div class="p4 text-dark">₹9,800 • 3N/4D</div>'],
  ['Будівництво Son Daven у травні', 'Old Silk Route Adventure — Sillery Gaon, Zuluk Loops &amp; Nathang Valley'],
  ['<div class="p4 text-dark">11/5/2026</div>', '<div class="p4 text-dark">₹8,900 • 3N/4D</div>'],
  ['Динаміка будівництва Son Daven у квітні', 'Dooars Wildlife &amp; River Retreat — Gorumara, Jaldapara &amp; Murti'],
  ['<div class="p4 text-dark">7/4/2026</div>', '<div class="p4 text-dark">₹24,900 • 7N/8D</div>'],
  ['First phase of the hotel to open by the end of 2027', 'Himalayan Grand Odyssey — Darjeeling, Kalimpong, Gangtok &amp; Pelling'],

  // CTA Section
  ['Each investor becomes a co-owner of a premium design hotel that redefines the concept of leisure, elevating it to a level of sensations, aesthetics, and meaning.', 'Every journey with MyTravelExpert is backed by local Himalayan expertise, verified mountain vehicles, handpicked resorts, and an instant 10% VIP Club discount.'],
  ['Become part of the\u00a0legend', 'Start your Himalayan\u00a0journey'],
  ['Become part of the legend', 'Start your Himalayan journey'],

  // FAQ Section (9 items in Son Daven DOM)
  ['If the hotel is not full, who guarantees the income?', 'How do I book a tour package and claim the 10% VIP Club discount?'],
  ['Revenue depends on real workload, but our financial model is built on conservative indicators (237 days/year). In addition, there is an operating company that is responsible for marketing and booking.', 'Simply select your preferred package or click "Plan Your Trip" to send an inquiry. Every online booking receives our instant 10% VIP Club discount, and a 20% advance confirms your hotels and vehicle.'],
  ['Can I live in my apartment?', 'Can I customize any of the 16 tour packages for my family or group?'],
  ['Yes, up to 30 days a year for free. The rest of the time the apartment works as a hotel room and brings income.', 'Absolutely! 100% of our itineraries across Darjeeling, Sikkim, Bhutan, Silk Route, and Dooars are fully customizable—you can adjust hotel categories (3★ to 5★), add offbeat stays, or extend days.'],
  ['What if I want to sell an apartment?', 'What documents are required for North Sikkim, Nathula Pass, and Bhutan permits?'],
  ['You can sell it at any time. Yaremche&#x27;s market capitalization is growing by 18% every year, so resale can be profitable already at the construction stage.', 'For Tsomgo Lake, Nathula Pass, and North Sikkim (Lachung/Yumthang), Indian nationals need a valid Voter ID, Passport, or Driving License plus 2 passport photos (Aadhaar is not accepted for restricted permits). For Bhutan, Voter ID or Passport works—our team processes all permits for you.'],
  ['Why are investors paid dividends per square meter?', 'Do you provide pickup and drop-off from Bagdogra Airport (IXB) and NJP Railway Station?'],
  ['This is a fair system: the larger the area of the apartment, the higher the income. For example,37.23 m² — ≈ 13 030 $/year.', 'Yes! Because our headquarters is located right in Bagdogra (Bhujiapani, M.E.S. Colony), our driver and local representative greet you directly at Bagdogra Airport (IXB) or NJP Station with zero wait time.'],
  ['This is a fair system: the larger the area of the apartment, the higher the income. For example,37.23 m² — ≈ 13\u00a0030 $/year.', 'Yes! Because our headquarters is located right in Bagdogra (Bhujiapani, M.E.S. Colony), our driver and local representative greet you directly at Bagdogra Airport (IXB) or NJP Station with zero wait time.'],
  ['Are there any guarantees that the construction will be completed?', 'What types of vehicles do you provide for mountain roads?'],
  ['The construction is carried out in stages: section 1 — IV quarter 2027, section 2 — I sq. in 2028. There is an approved schedule, licenses, open documents and a partner construction company with experience in the implementation of large objects.', 'We operate a dedicated fleet of 13+ mountain-ready vehicles including Toyota Innova Crysta, Mahindra Scorpio, Xylo, Bolero, Maruti Ertiga, WagonR, Dzire, Force Tempo Traveller (13–26 seater), and Luxury Coasters driven by experienced hill drivers.'],
  ['Why not just buy an apartment in Yaremche and rent it yourself?', 'What is the best time of year to visit Darjeeling, Sikkim, and Bhutan?'],
  ['Because it&#x27;s a different segment. The aparthotel provides: professional service, booking through international systems, marketing and stable occupancy. Self-rental rarely exceeds 20— 30% of the load.', 'March to June offers pleasant weather and blooming rhododendrons in Yumthang Valley, while October to February brings crystal-clear Kanchenjunga views, festive Bhutan Tshechus, and high-altitude snow at Zero Point and Nathula.'],
  ['Who runs the hotel?', 'Which luxury hotels and resorts do you partner with?'],
  ['Management is carried out by a professional management company with experience in the hotel business. This is the key difference from “apartment for rent”.', 'We hold direct preferred rates with Mayfair Spa Resort &amp; Casino (Gangtok), The Elgin (Darjeeling), Taj Tashi (Thimphu), Sterling Darjeeling, Udaan Woodberry, Summit Newa Regency (Pelling), and verified boutique homestays.'],
  ['How are dividends paid?', 'Is it safe for senior citizens and young children to visit North Sikkim and Silk Route?'],
  ['Annually, in proportion to your apartment area. The first payments are from the first quarter of 2029.', 'Yes, with proper acclimatization! We pace our itineraries carefully, provide high-clearance luxury SUVs, carry portable oxygen cylinders for high-altitude passes, and have 24/7 local support on standby.'],
  ['Annually, in proportion to your apartment area. The first payments are from the Zero Middleman Markup.', 'Yes, with proper acclimatization! We pace our itineraries carefully, provide high-clearance luxury SUVs, carry portable oxygen cylinders for high-altitude passes, and have 24/7 local support on standby.'],
  ['Is it possible to buy an apartment in installments?', 'What is your payment and cancellation policy?'],
  ['So, there are different payment schemes: 100%, 50/50, phased financing.', 'You can reserve your tour with a 20%–30% booking deposit and pay the balance upon arrival or in easy stages before departure. Free date rescheduling is available up to 14 days prior to travel.'],

  // Footer & Contacts
  ['+380 63 510 1101', '+91 8001247778'],
  ['tel:+380635101101', 'tel:+918001247778'],
  ['sale@sondaven.com', 'infomytravelexpert4306@gmail.com'],
  ['mailto:sale@sondaven.com', 'mailto:infomytravelexpert4306@gmail.com'],
  ['I. Petrasha St., 6/3, Yaremche, Ivano-Frankivsk region', 'Bagdogra Bhujiapani, M.E.S. Colony, P.O. &amp; P.S. – Bagdogra, Darjeeling - 734014'],
  ['Ivano-Frankivsk 35 Konovaltsya St.', 'Bagdogra Airport (IXB) &amp; NJP Station Pickup Hub'],
  ['<h4 class="p6 text-gray">Yaremche</h4>', '<h4 class="p6 text-gray">Regional Hubs</h4>'],
  ['260 Svobody St.', 'Mall Road / Nehru Road, Darjeeling - 734101'],
  ['Svobody St., 280/1', 'MG Marg, Gangtok, Sikkim &amp; Phuentsholing Gate'],
  ['© 2026 Son Daven. All rights reserved', '© 2026 MyTravelExpert (mytravelexpert.tech). All rights reserved'],
  ['© 2026 the Himalayas. All rights reserved', '© 2026 MyTravelExpert (mytravelexpert.tech). All rights reserved'],
  ['https://www.facebook.com/blago.sondaven', 'https://mytravelexpert.co.in'],
  ['https://www.instagram.com/sondaven.hotel', 'https://mytravelexpert.co.in'],
  ['Son Daven', 'MyTravelExpert'],

  // Menu Modal
  ['About the project', 'About MyTravelExpert'],
  ['>Advantages<', '>Why Choose Us<'],
  ['>Apartments<', '>Tour Packages (16)<'],
  ['>Financial indicators<', '>VIP Club &amp; Pricing<'],
  ['>Gallery<', '>Resorts &amp; Fleet<'],
  ['>News<', '>Travel Guides<'],
  ['>Construction progress<', '>Featured Itineraries<'],
  ['>Aerotour<', '>All 16 Packages<'],
  ['>Consultation<', '>Plan Your Trip<'],
  ['>Ок<', '>OK<'],

  // CTA Modal
  ['We will provide details and answer all your questions', 'Tell us your travel dates &amp; destination—unlock 10% VIP Club discount'],
  ['Send a request', 'Get Free Custom Quote']
];

for (const [from, to] of exactReplacements) {
  html = html.split(from).join(to);
}

// 4. Customize the 6 Apartment Tabs Content (Darjeeling, Sikkim, Bhutan, Silk Route, Luxury Stays, Mountain Cabs)
const tabConfigs = [
  {
    key: 'studio',
    oldArea: '<span>37</span><div class="h2 inline"> m<sup>2</sup></div>',
    newArea: '<span>₹7,500</span><div class="h6 inline"> / person</div>',
    oldPrice: '0 UAH per m²',
    newPrice: 'Darjeeling Circuits • 2N/3D to 5N/6D (4 Packages)',
    oldGuest: '2+1 guests',
    newGuest: '10% VIP Club Discount',
    tags: [
      'Tiger Hill Golden Sunrise',
      'UNESCO Toy Train Joyride',
      'Batasia Loop & Ghoom Monastery',
      'Happy Valley Tea Estate',
      'Mirik Lake & Pashupati Market',
      'Kalimpong & Deolo Hill'
    ],
    oldDesc: 'A stylish studio apartment with a spacious panoramic living area and integrated kitchen zone.',
    newDesc: 'Explore the Queen of the Hills with our 4 curated Darjeeling packages: Short Escape (2N/3D, ₹7,500), Himalayan Explorer (3N/4D, ₹9,500), Darjeeling-Kalimpong-Mirik (4N/5D, ₹11,800), and Twin-Jewel with Gangtok (5N/6D, ₹14,500). Includes private SUV transfers from Bagdogra/NJP and handpicked mountain-view stays.',
    images: [
      '/assets/images/darjeeling.jpg',
      '/assets/images/toy_train.jpg',
      '/assets/images/tea_tasting.jpg',
      '/assets/images/pelling.jpg',
      '/assets/images/gangtok_ropeway.jpg'
    ]
  },
  {
    key: 'deluxe',
    oldArea: '<span>50</span><div class="h2 inline"> m<sup>2</sup></div>',
    newArea: '<span>₹12,500</span><div class="h6 inline"> / person</div>',
    oldPrice: '174 250 грн/м²',
    newPrice: 'Sikkim Expeditions • 4N/5D to 7N/8D (5 Packages)',
    oldGuest: '2+2 guests',
    newGuest: 'All Inner-Line Permits Included',
    tags: [
      'Gangtok MG Marg & Ropeway',
      'Tsomgo Glacial Lake & Baba Mandir',
      'Nathula Pass (14,140 ft)',
      'Lachung & Yumthang Valley',
      'Zero Point (15,300 ft)',
      'Pelling Skywalk & Buddha Park'
    ],
    oldDesc: 'A superior comfort apartment with a separate bedroom, a spacious panoramic living area, and an integrated kitchen zone.',
    newDesc: 'Discover East, North, West & South Sikkim with 5 signature itineraries: Gangtok Getaway (3N/4D, ₹9,200), Gangtok & Lachung Yumthang (4N/5D, ₹14,500), North Sikkim Zero Point (5N/6D, ₹16,800), Gangtok-Pelling-Ravangla (5N/6D, ₹15,900), and Grand Sikkim Odyssey (7N/8D, ₹21,500).',
    images: [
      '/assets/images/sikkim.jpg',
      '/assets/images/gangtok_ropeway.jpg',
      '/assets/images/pelling.jpg',
      '/assets/images/monastery.jpg',
      '/assets/images/silkroute.jpg'
    ]
  },
  {
    key: 'superior',
    oldArea: '<span>66</span><div class="h2 inline"> m<sup>2</sup></div>',
    newArea: '<span>₹18,500</span><div class="h6 inline"> / person</div>',
    oldPrice: '174 250 грн/м²',
    newPrice: 'Royal Bhutan • 4N/5D to 7N/8D (3 Packages)',
    oldGuest: '2+2 guests',
    newGuest: 'SDF & Border Entry Handled',
    tags: [
      'Paro Taktsang (Tiger’s Nest)',
      'Thimphu Buddha Dordenma',
      'Punakha Dzong & Suspension Bridge',
      'Dochula Pass (108 Chortens)',
      'Chele La Pass (13,084 ft)',
      'Phuentsholing Border Assist'
    ],
    oldDesc: 'A generously-sized apartment with a bedroom, a spacious panoramic living area, and an integrated kitchen zone.',
    newDesc: 'Journey into the Land of the Thunder Dragon from Bagdogra/NJP via Phuentsholing or direct Paro flight: Bhutan Essence Thimphu & Paro (4N/5D, ₹18,500), Magical Bhutan with Punakha (5N/6D, ₹22,500), and Royal Bhutan Complete with Haa Valley & Phobjikha (7N/8D, ₹29,500).',
    images: [
      '/assets/images/bhutan.jpg',
      '/assets/images/monastery.jpg',
      '/assets/images/luxury_resort.jpg',
      '/assets/images/sikkim.jpg',
      '/assets/images/darjeeling.jpg'
    ]
  },
  {
    key: 'suite',
    oldArea: '<span>93</span><div class="h2 inline"> m<sup>2</sup></div>',
    newArea: '<span>₹8,900</span><div class="h6 inline"> / person</div>',
    oldPrice: '174 250 грн/м²',
    newPrice: 'Silk Route & Dooars • 3N/4D to 5N/6D (4 Packages)',
    oldGuest: '4+2 guests',
    newGuest: 'Offbeat & Wildlife Circuits',
    tags: [
      'Zuluk 32 Hairpin Loops',
      'Nathang Valley & Kupup Lake',
      'Sillery Gaon & Aritar Lake',
      'Gorumara Rhino Jungle Safari',
      'Jaldapara Elephant Ride',
      'Samsing, Suntalekhola & Murti'
    ],
    oldDesc: 'A premium apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.',
    newDesc: 'Experience the historic Old Silk Route and lush Dooars rainforests: Old Silk Route Zuluk & Nathang (3N/4D, ₹9,800), Complete Silk Route with Gangtok (5N/6D, ₹14,900), Dooars Gorumara & Jaldapara Safari (3N/4D, ₹8,900), and Offbeat Darjeeling Sillery Gaon & Takdah (3N/4D, ₹8,500).',
    images: [
      '/assets/images/silkroute.jpg',
      '/assets/images/dooars.jpg',
      '/assets/images/tea_tasting.jpg',
      '/assets/images/suv_fleet.jpg',
      '/assets/images/pelling.jpg'
    ]
  },
  {
    key: 'family',
    oldArea: '<span>76</span><div class="h2 inline"> m<sup>2</sup></div>',
    newArea: '<span>₹3,800</span><div class="h6 inline"> / night</div>',
    oldPrice: '174 250 грн/м²',
    newPrice: '6 Partner Luxury Resorts & Heritage Hotels',
    oldGuest: '4 guests',
    newGuest: 'Preferred Direct Rates',
    tags: [
      'Mayfair Spa Resort (Gangtok 5★)',
      'The Elgin Heritage (Darjeeling 5★)',
      'Taj Tashi (Thimphu Bhutan 5★)',
      'Sterling Resort (Darjeeling 4★)',
      'Udaan Woodberry (Gangtok 4★)',
      'Summit Newa Regency (Pelling 4★)'
    ],
    oldDesc: 'A family-sized apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.',
    newDesc: 'Stay at the finest properties in the Eastern Himalayas with our contracted B2B tariff rates. Enjoy Kanchenjunga-facing balcony suites, heated infinity pools, heritage colonial lounges, and organic Himalayan dining.',
    images: [
      '/assets/images/luxury_resort.jpg',
      '/assets/images/tea_tasting.jpg',
      '/assets/images/pelling.jpg',
      '/assets/images/darjeeling.jpg',
      '/assets/images/monastery.jpg'
    ]
  },
  {
    key: 'penthouse',
    oldArea: '<span>₹2,800</span><div class="h6 inline"> / day</div>',
    newArea: '<span>₹2,800</span><div class="h6 inline"> / day</div>',
    oldPrice: '174 250 грн/м²',
    newPrice: '13+ Verified Mountain Cabs, SUVs & Luxury Coaches',
    oldGuest: '4+2 guests',
    newGuest: 'Hill-Certified Drivers',
    tags: [
      'Toyota Innova Crysta (6–7 Pax)',
      'Mahindra Scorpio / Xylo (7 Pax)',
      'Maruti Ertiga / Bolero (6–7 Pax)',
      'Swift Dzire / WagonR (4 Pax)',
      'Force Tempo Traveller (13–26 Pax)',
      'Luxury 27–45 Seater Coaches'
    ],
    oldDesc: 'A premium upper-level apartment with two bedrooms, a spacious panoramic living area, and an integrated kitchen zone.',
    newDesc: 'Book point-to-point Bagdogra Airport (IXB) / NJP transfers or full-circuit dedicated vehicles. All vehicles are sanitized, GPS-equipped, and driven by local hill specialists fluent in Hindi, English, Nepali, and Bengali.',
    images: [
      '/assets/images/suv_fleet.jpg',
      '/assets/images/silkroute.jpg',
      '/assets/images/darjeeling.jpg',
      '/assets/images/gangtok_ropeway.jpg',
      '/assets/images/sikkim.jpg'
    ]
  }
];

// Apply tab-by-tab replacements inside #apartments
for (const cfg of tabConfigs) {
  const marker = `data-tab-content="${cfg.key}"`;
  const start = html.indexOf(marker);
  if (start === -1) continue;
  // Find end of this tab item (next data-tab-content or id="finance")
  const nextTab = html.indexOf('data-tab-content="', start + 30);
  const financeIdx = html.indexOf('id="finance"', start);
  const end = (nextTab !== -1 && nextTab < financeIdx) ? nextTab : financeIdx;
  let block = html.slice(start, end);

  // Replace area & price
  block = block.replace(/<span class="h6">From<\/span><span>[^<]+<\/span><div class="h2 inline"> m<sup>2<\/sup><\/div>/, `<span class="h6">From </span>${cfg.newArea}`);
  block = block.replace(/<h3 class="p4 text-dark">[^<]+<\/h3>/, `<h3 class="p4 text-dark">${cfg.newPrice}</h3>`);
  block = block.replace(`<p class="p6 text-light">${cfg.oldGuest}</p>`, `<p class="p6 text-light">${cfg.newGuest}</p>`);
  block = block.replace(`<p>${cfg.oldDesc}</p>`, `<p>${cfg.newDesc}</p>`);

  // Replace tags list
  const tagItemsHtml = cfg.tags.map(t => `<div role="listitem" class="tags-cms_list_item w-dyn-item"><div class="tag sec"><p class="p6 text-dark">${t}</p></div></div>`).join('');
  block = block.replace(new RegExp(`(<div tag-list="${cfg.key}"[^>]*>)[\\s\\S]*?(<\\/div><\\/div><\\/div><div class="u-24">)`), `$1${tagItemsHtml}$2`);

  // Replace gallery slides in this tab
  let imgIdx = 0;
  block = block.replace(/<img src="[^"]+" loading="lazy" slider="img"[^>]*>/g, () => {
    const src = cfg.images[imgIdx % cfg.images.length];
    imgIdx++;
    return `<img src="${src}" loading="lazy" slider="img" alt="${cfg.newPrice}" class="img"/>`;
  });

  html = html.slice(0, start) + block + html.slice(end);
}

// 5. Replace Uniqueness (.benefits-cms_list_item) images across BOTH desktop and mobile lists with MyTravelExpert Himalayan photography
const benefitImages = [
  '/assets/images/darjeeling.jpg',
  '/assets/images/luxury_resort.jpg',
  '/assets/images/suv_fleet.jpg',
  '/assets/images/sikkim.jpg',
  '/assets/images/bhutan.jpg',
  '/assets/images/tea_tasting.jpg',
  '/assets/images/silkroute.jpg',
  '/assets/images/dooars.jpg'
];
let bIdx = 0;
const benefitsStart = html.indexOf('id="benefits"');
const commStart = html.indexOf('id="commissioning"');
if (benefitsStart !== -1 && commStart !== -1) {
  let bSlice = html.slice(benefitsStart, commStart);
  bSlice = bSlice.replace(/<img src="[^"]+" loading="eager" hover="img"/g, () => {
    const img = benefitImages[bIdx % benefitImages.length];
    bIdx++;
    return `<img src="${img}" loading="eager" hover="img"`;
  });
  html = html.slice(0, benefitsStart) + bSlice + html.slice(commStart);
}

// Replace the selected <video> inside section#about (div#w-node-_0fcb7777-77c0-90fb-6383-bc51f14dc376-a640d032 > a.video-card)
// Replace the selected <video> inside section#about (div#w-node-_0fcb7777-77c0-90fb-6383-bc51f14dc376-a640d032 > a.video-card)
// with the bespoke MyTravelExpert Interactive Himalayan Expedition Compass & Live Altitude Route Card
const compassCardHtml = `<a data-scroll-reveal="ctn" hover-nav-item="" hover-img-card="" data-mte-open="catalogue" data-barba-prevent="all" href="#apartments" class="video-card w-inline-block"><div class="video-card_c"><div class="video-card_line-l"></div><div class="video-card_line-s"></div><div class="video-card_ico text-dark theme_on-color"><div class="ico-24"><div class="ico w-embed"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5L10.2 5.8L14.5 8L10.2 10.2L8 14.5L5.8 10.2L1.5 8L5.8 5.8L8 1.5Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="1.6" fill="currentColor"/></svg></div></div></div><div class="video-card_video-w"><div hover="img" class="mte-compass-card"><img src="/assets/images/darjeeling.jpg" alt="Darjeeling Kanchenjunga Sunrise" width="280" height="180" loading="lazy" decoding="async" class="mte-compass-slide s1"/><img src="/assets/images/sikkim.jpg" alt="North Sikkim Tsomgo Glacial Lake" width="280" height="180" loading="lazy" decoding="async" class="mte-compass-slide s2"/><img src="/assets/images/bhutan.jpg" alt="Royal Bhutan Paro Taktsang" width="280" height="180" loading="lazy" decoding="async" class="mte-compass-slide s3"/><img src="/assets/images/silkroute.jpg" alt="Old Silk Route Zuluk Loops" width="280" height="180" loading="lazy" decoding="async" class="mte-compass-slide s4"/><div class="mte-compass-hud"><div class="mte-compass-top"><span>IXB BAGDOGRA • 26.68°N 88.32°E</span><span class="mte-compass-badge"><span class="mte-compass-dot"></span>LIVE HIMALAYAN CIRCUITS</span></div><svg class="mte-compass-route-svg" viewBox="0 0 280 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 38 C 42 36, 64 20, 96 22 C 128 24, 152 8, 188 12 C 220 16, 244 4, 276 6" stroke="rgba(235,231,224,0.28)" stroke-width="1" stroke-dasharray="3 3"/><path class="mte-compass-route-line" d="M4 38 C 42 36, 64 20, 96 22 C 128 24, 152 8, 188 12 C 220 16, 244 4, 276 6" stroke="#df3f14" stroke-width="1.8"/><circle cx="4" cy="38" r="2.5" fill="#ebe7e0"/><circle cx="96" cy="22" r="2.5" fill="#ebe7e0"/><circle cx="188" cy="12" r="2.5" fill="#ebe7e0"/><circle cx="276" cy="6" r="3" fill="#df3f14"/><text x="4" y="31" fill="#d0c4b0" font-size="7" letter-spacing="0.08em">IXB 126M</text><text x="76" y="16" fill="#d0c4b0" font-size="7" letter-spacing="0.08em">DARJEELING</text><text x="168" y="7" fill="#d0c4b0" font-size="7" letter-spacing="0.08em">NATHULA</text><text x="230" y="18" fill="#ebe7e0" font-size="7" letter-spacing="0.08em">ZERO PT 15,300FT</text></svg><div class="mte-compass-bot"><div><div class="mte-compass-title">Eastern Himalayan Atlas</div><div class="mte-compass-sub">Darjeeling • Sikkim • Bhutan • Silk Route • Dooars</div></div><div class="mte-compass-elev">16 TOURS<br/><span style="font-size:9px;color:#ebe7e0;font-family:KTFMetro-Roman,sans-serif">10% VIP OFF</span></div></div></div></div></div></div><div class="unit-8"></div><div hover="label" class="video-card_label"><div class="video-card_label_text"><div hover="text" class="p6 text-dark">Interactive Route &amp; 16 Packages</div></div><div class="video-card_label_text is-2"><div hover="text" class="p6 text-dark">Interactive Route &amp; 16 Packages</div></div></div></a>`;

html = html.replace(
  /<a data-scroll-reveal="ctn" hover-nav-item="" hover-img-card="" modal-media-open="video" href="#" class="video-card w-inline-block">[\s\S]*?<\/div><\/div><\/a>/,
  compassCardHtml
);

// Replace commissioning-s_img, about-s_img_img, mob_hero-w_bg_img, location-s_img, and cta building image with MyTravelExpert Himalayan photography
html = html.replace(
  /<div class="commissioning-s_img"><div class="img-w"><img src="[^"]+"[^>]*>/,
  '<div class="commissioning-s_img"><div class="img-w"><img src="/assets/images/bhutan.jpg" loading="eager" alt="MyTravelExpert Himalayan Expedition Planning" class="img"/>'
);
html = html.replace(
  /<div class="about-s_img"><div class="img-w"><img src="[^"]+"[^>]*>/,
  '<div class="about-s_img"><div class="img-w"><img src="/assets/images/darjeeling.jpg" loading="eager" alt="Eastern Himalayan Mountain Panorama — Darjeeling, Sikkim & Bhutan" class="img h-auto about-s_img_img"/>'
);
html = html.replace(
  /<div class="mob_hero-w_bg_img"><div class="img-w"><img src="[^"]+"[^>]*>/,
  '<div class="mob_hero-w_bg_img"><div class="img-w"><img src="/assets/images/darjeeling.jpg" loading="eager" alt="MyTravelExpert Himalayan Peaks" class="img"/>'
);
html = html.replace(
  /<div id="w-node-fa108e41-30f6-ba76-9105-4ad4e5a8e630-a640d032" class="location-s_img"><div class="img-w"><img src="[^"]+"[^>]*>/,
  '<div id="w-node-fa108e41-30f6-ba76-9105-4ad4e5a8e630-a640d032" class="location-s_img"><div class="img-w"><img src="/assets/images/sikkim.jpg" loading="eager" alt="Tsomgo Glacial Lake & Eastern Himalayan Valley" class="img"/>'
);
html = html.replace(
  /<img class="img-p" src="[^"]+" alt="[^"]*"[^>]*>/,
  '<img class="img-p" src="/assets/images/silkroute.jpg" alt="Himalayan Monastery & Mountain Peaks — MyTravelExpert" parallax="img-out" loading="lazy"/>'
);
// Remove preloader_sheep.mp4 video from master preloader
html = html.replace(
  /<video[^>]*poster="[^"]*preloader_sheep[^"]*"[^>]*>[\s\S]*?<\/video>/g,
  ''
);

const locImages = [
  '/assets/images/darjeeling.jpg',
  '/assets/images/sikkim.jpg',
  '/assets/images/bhutan.jpg',
  '/assets/images/tea_tasting.jpg',
  '/assets/images/silkroute.jpg',
  '/assets/images/dooars.jpg'
];
let lIdx = 0;
const locStart = html.indexOf('id="location"');
if (locStart !== -1 && benefitsStart !== -1) {
  let lSlice = html.slice(locStart, benefitsStart);
  lSlice = lSlice.replace(/<div class="location-slide_img"><img src="[^"]+"/g, () => {
    const img = locImages[lIdx % locImages.length];
    lIdx++;
    return `<div class="location-slide_img"><img src="${img}"`;
  });
  html = html.slice(0, locStart) + lSlice + html.slice(benefitsStart);
}

// 6. Replace Project Gallery (#gallery) slides with MyTravelExpert destinations, resorts & fleet
const galleryImages = [
  '/assets/images/darjeeling.jpg',
  '/assets/images/sikkim.jpg',
  '/assets/images/bhutan.jpg',
  '/assets/images/silkroute.jpg',
  '/assets/images/dooars.jpg',
  '/assets/images/luxury_resort.jpg',
  '/assets/images/toy_train.jpg',
  '/assets/images/gangtok_ropeway.jpg',
  '/assets/images/monastery.jpg',
  '/assets/images/tea_tasting.jpg',
  '/assets/images/suv_fleet.jpg',
  '/assets/images/pelling.jpg'
];
let gIdx = 0;
const galStart = html.indexOf('id="gallery"');
const blogStart = html.indexOf('id="blog"');
if (galStart !== -1 && blogStart !== -1) {
  let gSlice = html.slice(galStart, blogStart);
  gSlice = gSlice.replace(/<img src="[^"]+" loading="lazy" slider="img"[^>]*>/g, () => {
    const img = galleryImages[gIdx % galleryImages.length];
    gIdx++;
    return `<img src="${img}" loading="lazy" slider="img" alt="MyTravelExpert Gallery" class="img"/>`;
  });
  html = html.slice(0, galStart) + gSlice + html.slice(blogStart);
}

// 7. Replace Blog & Featured Package images inside #blog (both eager and lazy) and make cards open the interactive MTE Explorer
const blogImages = [
  '/assets/images/darjeeling.jpg',
  '/assets/images/sikkim.jpg',
  '/assets/images/bhutan.jpg',
  '/assets/images/silkroute.jpg',
  '/assets/images/dooars.jpg',
  '/assets/images/toy_train.jpg',
  '/assets/images/monastery.jpg',
  '/assets/images/tea_tasting.jpg',
  '/assets/images/gangtok_ropeway.jpg',
  '/assets/images/luxury_resort.jpg',
  '/assets/images/pelling.jpg'
];
let blIdx = 0;
const ctaStart = html.indexOf('id="cta"');
if (blogStart !== -1 && ctaStart !== -1) {
  let blSlice = html.slice(blogStart, ctaStart);
  blSlice = blSlice.replace(/<img[^>]*src="[^"]+"[^>]*class="img"[^>]*>/g, () => {
    const img = blogImages[blIdx % blogImages.length];
    blIdx++;
    return `<img hover="img" loading="lazy" src="${img}" alt="MyTravelExpert Himalayan Travel Guide" class="img"/>`;
  });
  // Make all blog & featured itinerary links open the interactive MTE drawer
  blSlice = blSlice.replace(/href="\/(en\/)?(news|construction-progress|progress)[^"]*"/g, 'href="#apartments" data-mte-open="catalogue" data-barba-prevent="all"');
  blSlice = blSlice.replace('>Latest News and Updates<', '>Stories, Guides &amp; Top Packages<');
  blSlice = blSlice.replace('>14/8/2026<', '>2026 Season<');
  html = html.slice(0, blogStart) + blSlice + html.slice(ctaStart);
}

// Replace Ukrainian "blago" developer logos in #developer with our custom vertical-slit MY TRAVEL EXPERT SVG wordmark
html = html.replace(
  /<div class="logo-blago w-embed">[\s\S]*?<\/svg><\/div>/g,
  LOGO_BLAGO
);
// Replace .blago-mark 20x20 icon with a Himalayan mountain peaks emblem SVG
html = html.replace(
  /<div class="blago-mark text-dark w-embed">[\s\S]*?<\/svg><\/div>/g,
  '<div class="blago-mark text-dark w-embed"><svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 15.5L7.2 5.2L11.2 11.8L14.2 7.4L18.5 15.5H1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.4 8.5L7.2 5.2L9.1 8.5" fill="currentColor"/></svg></div>'
);

// Replace any remaining yaremche references in accordion IDs and alt text
html = html.replace(/chomu-ne-kupiti-prosto-kvartiru-v-yaremche-i-samomu-zdavati-zonqa/g, 'best-season-for-darjeeling-sikkim-bhutan');
html = html.replace(/yaremche/gi, 'Darjeeling');

// Remove modal video and mob_modal_video
html = html.replace(/<video[^>]*class="[^"]*mob_modal_video[^"]*"[^>]*><\/video>/g, '');

// Wire "preview experience" buttons in #apartments to open the interactive MTE Catalogue Drawer and remove son-daven_short.mp4 modals
html = html.replace(/data-modal-vim-video-btn="[^"]+"/g, 'data-mte-open="catalogue"');
html = html.replace(/<video src="\/assets\/sondaven\/son-daven_short\.mp4"[^>]*><\/video>/g, '');

// Replace all Ukrainian Google Maps shortlinks & alt texts with authentic MyTravelExpert Bagdogra / Darjeeling / Gangtok links & descriptions
html = html.replace(/https:\/\/maps\.app\.goo\.gl\/59WcipUhsCXbKPmo7/g, 'https://maps.google.com/?q=Bagdogra+Bhujiapani+MES+Colony+Darjeeling+734014');
html = html.replace(/https:\/\/maps\.app\.goo\.gl\/gHLExBJANK4KyBLq5/g, 'https://maps.google.com/?q=Bagdogra+International+Airport+IXB');
html = html.replace(/https:\/\/maps\.app\.goo\.gl\/ba1qSfHPVeotgBLo6/g, 'https://maps.google.com/?q=Mall+Road+Darjeeling+734101');
html = html.replace(/https:\/\/maps\.app\.goo\.gl\/jgxZh3CFoL4AxUMk8/g, 'https://maps.google.com/?q=MG+Marg+Gangtok+Sikkim');
html = html.replace(/alt="Map of yaremche"/g, 'alt="Map of Eastern Himalayas — Bagdogra, Darjeeling, Sikkim & Bhutan"');

// Also prevent Barba from intercepting any remaining internal links and wire PDF/language links to the interactive catalogue drawer
html = html.replace(/href="\/en"/g, 'href="#hero" data-barba-prevent="all"');
html = html.replace(/href="\/ua"/g, 'href="#apartments" data-mte-open="catalogue" data-barba-prevent="all"');
html = html.replace(/href="\/assets\/sondaven\/[^"]+\.pdf"\s*(target="_blank")?/g, 'href="#apartments" data-mte-open="catalogue" data-barba-prevent="all"');

// Strip any remaining external script/link/noscript tags at the bottom of mteBody.html
html = html.replace(/<script[^>]*src="https:\/\/unpkg\.com\/@barba\/core"[^>]*><\/script>/g, '');
html = html.replace(/<script[^>]*src="https:\/\/cdn\.jsdelivr\.net\/npm\/@finsweet\/cookie-consent[^"]*"[^>]*><\/script>/g, '');
html = html.replace(/<link[^>]*href="https:\/\/cdn\.jsdelivr\.net\/npm\/lenis[^"]*"[^>]*\/?>/g, '');
html = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, '');

// Replace the 2 remaining missing local .webp paths with verified MyTravelExpert images
html = html.replace(/\/assets\/sondaven\/69c4e615a158d241540df74e_[^"]+\.webp/g, '/assets/images/luxury_resort.jpg');
html = html.replace(/\/assets\/sondaven\/69e73d36adf9e62d0b1999a6_[^"]+\.webp/g, '/assets/images/sikkim.jpg');

// Replace remaining virtualukraine / SonDaven links with MyTravelExpert links & interactive drawer triggers
html = html.replace(/href="https:\/\/virtualukraine\.travel\/[^"]*"\s*target="_blank"/g, 'href="#apartments" data-mte-open="catalogue" data-barba-prevent="all"');
html = html.replace(/https:\/\/www\.google\.com\/maps\/place\/SON\+DAVEN[^"]*/g, 'https://maps.google.com/?q=Bagdogra+Bhujiapani+MES+Colony+Darjeeling+734014');
html = html.replace(/https:\/\/www\.instagram\.com\/son\.daven/g, 'https://mytravelexpert.co.in');
html = html.replace(/https:\/\/www\.youtube\.com\/@SonDaven/g, 'https://mytravelexpert.co.in');

// Regex cleanups for any special-whitespace strings in FAQ & Developer Factoids
html = html.replace(
  /This is a fair system:[\s\S]*?13[\s\u00a0]*030\s*\$\/year\./g,
  'Yes! Because our headquarters is located right in Bagdogra (Bhujiapani, M.E.S. Colony), our driver and local representative greet you directly at Bagdogra Airport (IXB) or NJP Station with zero wait time.'
);
html = html.replace(
  /(<div class="factoids_i _2"[\s\S]*?<h3[^>]*class="h1 text-light">)2(<\/h3>)/,
  '$112+$2'
);
html = html.replace(
  /(<div class="factoids_i _4"[\s\S]*?<h3[^>]*class="h1 text-light">)7(<\/h3>)/,
  '$198%$2'
);

fs.writeFileSync('public/assets/sondaven/mte-body.html', html, 'utf8');
fs.writeFileSync('src/data/mteBody.html', html, 'utf8');
console.log('Wrote public/assets/sondaven/mte-body.html & src/data/mteBody.html:', html.length, 'bytes');

// 8. Build patched public/assets/sondaven/sondaven-engine.js from .playwright-cli/slater-main.js
let engine = fs.readFileSync('.playwright-cli/slater-main.js', 'utf8');

// Replace all scene video URLs with local /assets/sondaven/scenes/
engine = engine.replace(/https:\/\/assets\.sondaven\.com\/scenes\/birds_03\.hevc\.mp4/g, '/assets/sondaven/scenes/birds_02-c.mp4');
engine = engine.replace(/https:\/\/assets\.sondaven\.com\/scenes\/birds_04\.hevc\.mp4/g, '/assets/sondaven/scenes/birds_05-c.mp4');
engine = engine.replace(/https:\/\/assets\.sondaven\.com\/scenes\/footer_mountain\.hevc\.mp4/g, '/assets/sondaven/scenes/seasons_summer.mp4');
engine = engine.replace(/https:\/\/assets\.sondaven\.com\/scenes\//g, '/assets/sondaven/scenes/');
engine = engine.replace(/https:\/\/assets\.sondaven\.com\/son-daven\.MP4/g, '');

// Replace the 120 Ukrainian apartment-building frames in framesPromise & initScrollVideo with a 120-step scroll-scrubbed MyTravelExpert Himalayan panorama sequence
engine = engine.replace(
  /framesPromise=window\.innerWidth>=breakPoint\?Promise\.all\(Array\.from\(\{length:120\},\(\(e,t\)=>\{const o=`\$\{"https:\/\/assets\.sondaven\.com\/hero-video-new"\}\/\$\{String\(t\)\.padStart\(3,"0"\)\}\.webp`;return new Promise\(\(e=>\{const t=new Image;t\.src=o,t\.onload=\(\)=>e\(t\),t\.onerror=\(\)=>e\(null\)\}\)\)\}\)\)\):Promise\.resolve\(null\);/,
  `framesPromise=Promise.all(["/assets/images/darjeeling.jpg","/assets/images/sikkim.jpg","/assets/images/bhutan.jpg","/assets/images/silkroute.jpg","/assets/images/dooars.jpg","/assets/images/luxury_resort.jpg"].map((src=>new Promise((res=>{const img=new Image;img.src=src;img.onload=()=>res(img);img.onerror=()=>res(null)})))));`
);

engine = engine.replace(
  /function initScrollVideo\(\)\{ScrollTrigger\.matchMedia\(\{\[`\(min-width: \$\{breakPoint\}px\)`\]:function\(\)\{const e=document\.querySelector\("\[data-scroll-video-container\]"\);if\(!e\)return;const t=e\.querySelector\("\[data-scroll-video\]"\),o=t\.getContext\("2d"\),n=\[\],i=e=>\{t\.width=t\.offsetWidth,t\.height=t\.offsetHeight;const n=Math\.max\(t\.width\/e\.width,t\.height\/e\.height\),i=\(t\.width-e\.width\*n\)\/2,r=\(t\.height-e\.height\*n\)\/2;o\.drawImage\(e,i,r,e\.width\*n,e\.height\*n\)\};framesPromise\.then\(\(t=>\{n\.push\(\.\.\.t\.filter\(Boolean\)\),i\(n\[0\]\),gsap\.to\(\{frame:0\},\{frame:n\.length-1,snap:"frame",ease:"none",scrollTrigger:\{trigger:e,start:"top top",end:"75% bottom",scrub:\.25\},onUpdate\(\)\{i\(n\[Math\.round\(this\.targets\(\)\[0\]\.frame\)\]\)\}\}\)\}\)\)\}\}\),/,
  `function initScrollVideo(){ScrollTrigger.matchMedia({[\`(min-width: \${breakPoint}px)\`]:function(){const e=document.querySelector("[data-scroll-video-container]");if(!e)return;const t=e.querySelector("[data-scroll-video]"),o=t.getContext("2d"),n=[];let curFrame=0;const drawFrame=f=>{if(!n.length)return;t.width=t.offsetWidth||window.innerWidth;t.height=t.offsetHeight||window.innerHeight;const total=119,prog=Math.max(0,Math.min(1,f/total)),seg=prog*(n.length-1),idx=Math.min(n.length-1,Math.floor(seg)),nextIdx=Math.min(n.length-1,idx+1),alpha=seg-idx,zoom=1.04+0.14*(f/total),panX=(0.5-(f/total))*t.width*0.04,drawImg=(img,a,z)=>{if(!img)return;o.save();o.globalAlpha=a;const s=Math.max(t.width/img.width,t.height/img.height)*z,w=img.width*s,h=img.height*s,x=(t.width-w)/2+panX,y=(t.height-h)/2;o.drawImage(img,x,y,w,h);o.restore()};o.clearRect(0,0,t.width,t.height);drawImg(n[idx],1,zoom);if(alpha>0.01&&nextIdx!==idx)drawImg(n[nextIdx],alpha,zoom*0.98);const grad=o.createLinearGradient(0,0,0,t.height);grad.addColorStop(0,"rgba(235,231,224,0.62)");grad.addColorStop(0.38,"rgba(235,231,224,0.22)");grad.addColorStop(0.72,"rgba(30,27,23,0.42)");grad.addColorStop(1,"rgba(22,20,17,0.82)");o.fillStyle=grad;o.fillRect(0,0,t.width,t.height)};window.addEventListener("resize",(()=>drawFrame(curFrame)));framesPromise.then((imgs=>{n.push(...(imgs||[]).filter(Boolean));drawFrame(0);gsap.to({frame:0},{frame:119,ease:"none",scrollTrigger:{trigger:e,start:"top top",end:"75% bottom",scrub:.25},onUpdate(){curFrame=this.targets()[0].frame;drawFrame(curFrame)}})}))}}),`
);

engine = engine.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^/]+\/([^"'\s)&]+)/g, (_, fname) => {
  return `/assets/sondaven/${decodeURIComponent(fname)}`;
});

// Reduce 5000ms video load timeout to 500ms so WebGL scenes resolve swiftly even on software renderers
engine = engine.replace(/\},5e3\)/g, '},500)');

// Speed up preloader intro and prevent lockScroll from adding --scrollbar-width paddingRight
engine = engine.replace(
  /function lockScroll\(\)\{[\s\S]*?lenis\.stop\(\)\}/,
  'function lockScroll(){lenis&&lenis.stop()}'
);
engine = engine.replace(
  /function unlockScroll\(\)\{[\s\S]*?lenis\.start\(\)\}/,
  'function unlockScroll(){document.documentElement.style.removeProperty("--scrollbar-width"),document.body.style.paddingRight="",document.documentElement.style.overflow="",lenis&&lenis.start()}'
);
engine = engine.replace(
  '.fromTo(r,{opacity:0},{opacity:1,duration:durL,delay:delayReveal,ease:"Out"}).fromTo(c,{opacity:0,yPercent:25},{opacity:1,yPercent:0,duration:durL,delay:delayReveal,ease:"Out"},"<").to({},{duration:durL}).add((()=>{initAllScenes()',
  '.fromTo(r,{opacity:0},{opacity:1,duration:0.25,delay:0.05,ease:"Out"}).fromTo(c,{opacity:0,yPercent:25},{opacity:1,yPercent:0,duration:0.25,delay:0.05,ease:"Out"},"<").to({},{duration:0.05}).add((()=>{initAllScenes()'
);
engine = engine.replace(
  'Promise.all([framesPromise,globalSceneManager.ready(),document.fonts.ready]).then((()=>{s&&(s.textContent="100%"),y.resume()})),y.pause()',
  'Promise.race([Promise.all([framesPromise,globalSceneManager.ready(),document.fonts.ready]),new Promise(r=>setTimeout(r,300))]).then((()=>{s&&(s.textContent="100%"),y.resume()})),y.pause()'
);
engine = engine.replace(
  'Promise.all([framesPromise,globalSceneManager.ready(),document.fonts.ready]).then((()=>{animateTransition("out")',
  'Promise.race([Promise.all([framesPromise,globalSceneManager.ready(),document.fonts.ready]),new Promise(r=>setTimeout(r,250))]).then((()=>{animateTransition("out")'
);
engine = engine.replace(
  '.to(a,{opacity:0,duration:durM,ease:"Out"}).add((()=>{animateTransition("out")})).to({},{duration:durS}).add((()=>{e()}))',
  '.to(a,{opacity:0,duration:0.25,ease:"Out"}).add((()=>{animateTransition("out")})).to({},{duration:0.15}).add((()=>{e()}))'
);
engine = engine.replace(
  'gsap.timeline().fromTo(g,{scale:1.5},{scale:1,duration:2*durL,ease:"Out"}).add(Flip.from(u,{duration:1.5*durL,ease:"InOut"}),0).add((()=>{c.classList.remove("theme_on-dark"),c.classList.add("theme_on-light"),animateTextH(p,"reveal"),animateTextP(m,"reveal"),animateCtn(h,"reveal")}),durL).add((()=>{gsap.set(t,{display:"none"}),o.classList.remove("theme_on-dark"),initPageTransitions(),unlockScroll()}))',
  'gsap.timeline().fromTo(g,{scale:1.5},{scale:1,duration:0.6,ease:"Out"}).add(Flip.from(u,{duration:0.5,ease:"InOut",clearProps:"all"}),0).add((()=>{c.classList.remove("theme_on-dark"),c.classList.add("theme_on-light"),gsap.set(c,{clearProps:"all"}),animateTextH(p,"reveal"),animateTextP(m,"reveal"),animateCtn(h,"reveal"),gsap.set(t,{display:"none"}),o.classList.remove("theme_on-dark"),initPageTransitions(),unlockScroll()}),0.25)'
);

// Hook native form submission inside initForm() so submitting triggers the 3D rotateY flip to .modal_cta-form_success
engine = engine.replace(
  'const e=document.querySelector(".modal_cta-form_form"),t=document.querySelector(".modal_cta-form_success");if(!e||!t)return;',
  'const e=document.querySelector(".modal_cta-form_form"),t=document.querySelector(".modal_cta-form_success");if(!e||!t)return;e.addEventListener("submit",(ev=>{ev.preventDefault();setTimeout(()=>{e.style.display="none";t.style.display="flex";},250)}));'
);

// Guard initPreloader against double-invocation
engine = engine.replace(/initPreloader\(\);\s*$/, 'if(!window.__sondavenBooted){window.__sondavenBooted=true;initPreloader();}\n');

fs.writeFileSync('public/assets/sondaven/sondaven-engine.js', engine, 'utf8');
console.log('Wrote public/assets/sondaven/sondaven-engine.js:', engine.length, 'bytes');

// 9. Concatenate vendor scripts + ActiveFrame.js + sondaven-engine.js into sondaven-bundle.js
const bundleFiles = [
  'public/assets/vendor/barba.umd.js',
  'public/assets/vendor/gsap.min.js',
  'public/assets/vendor/ScrollTrigger.min.js',
  'public/assets/vendor/CustomEase.min.js',
  'public/assets/vendor/SplitText.min.js',
  'public/assets/vendor/Flip.min.js',
  'public/assets/vendor/lenis.min.js',
  'public/assets/vendor/swiper-bundle.min.js',
  'public/assets/sondaven/ActiveFrame.js',
  'public/assets/sondaven/sondaven-engine.js'
];
const bundleContent = bundleFiles.map(f => `/* === ${f} === */\n` + fs.readFileSync(f, 'utf8')).join('\n;\n');
fs.writeFileSync('public/assets/sondaven/sondaven-bundle.js', bundleContent, 'utf8');
console.log('Wrote public/assets/sondaven/sondaven-bundle.js:', bundleContent.length, 'bytes');


