export const DESTINATIONS = [
  { id: 'all', name: 'All Destinations', country: 'Global' },
  { id: 'bali', name: 'Bali, Indonesia', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { id: 'maldives', name: 'Malé Atoll, Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80' },
  { id: 'paris', name: 'Paris, France', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' },
  { id: 'swiss-alps', name: 'Zermatt, Switzerland', country: 'Switzerland', image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80' },
  { id: 'tokyo', name: 'Tokyo, Japan', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
  { id: 'santorini', name: 'Santorini, Greece', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80' },
  { id: 'new-york', name: 'Manhattan, New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' }
];

export const ROOMS_DATA = [
  {
    id: 'room-1',
    name: 'Presidential Oceanfront Villa',
    category: 'Villas',
    destinationId: 'maldives',
    destinationName: 'Malé Atoll, Maldives',
    stars: 5,
    rating: 4.98,
    reviewsCount: 142,
    pricePerNight: 890,
    originalPrice: 1100,
    discountBadge: 'Save 20%',
    featured: true,
    badge: 'Luxury Pick',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    sizeSqM: 185,
    bedType: '2 King Beds',
    view: 'Unobstructed Panoramic Ocean View',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Perched over crystalline turquoise waters with direct lagoon access, this villa features an expansive private infinity pool, sunset sun-deck, personal butler service, and an outdoor rain shower.',
    amenities: [
      'Private Infinity Pool',
      'Free High-speed Wi-Fi',
      'Ocean View',
      'Complimentary Gourmet Breakfast',
      '24/7 Butler Service',
      'Spa Tub / Jacuzzi',
      'Airport Speedboat Transfer',
      'Mini Bar & Wine Cellar',
      'Air Conditioning',
      'Espresso Machine'
    ],
    highlights: ['Direct Lagoon Staircase', 'Floating Breakfast Included', 'Private Sunset Deck']
  },
  {
    id: 'room-2',
    name: 'Grand Royal Eiffel Suite',
    category: 'Luxury Suite',
    destinationId: 'paris',
    destinationName: 'Paris, France',
    stars: 5,
    rating: 4.95,
    reviewsCount: 118,
    pricePerNight: 720,
    originalPrice: 850,
    discountBadge: 'Save 15%',
    featured: true,
    badge: 'Most Romantic',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqM: 95,
    bedType: '1 Emperor King Bed',
    view: 'Direct Eiffel Tower View',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Overlooking the iconic Champ de Mars, this classical Parisian suite boasts high ceilings, Versailles-style parquet floors, velvet furnishings, and a private stone balcony with front-row views of the Eiffel Tower sparkle.',
    amenities: [
      'Balcony with Monument View',
      'Free High-speed Wi-Fi',
      'Complimentary Gourmet Breakfast',
      'Marble Bath & Soaking Tub',
      'Champagne Welcome Bottle',
      'Valet Parking',
      'Hermès Bath Amenities',
      'Air Conditioning'
    ],
    highlights: ['Direct Eiffel Tower View', 'Evening Turn-down Service', 'Chilled Vintage Champagne']
  },
  {
    id: 'room-3',
    name: 'Santorini Cliffside Cave Sanctuary',
    category: 'Villas',
    destinationId: 'santorini',
    destinationName: 'Santorini, Greece',
    stars: 5,
    rating: 4.97,
    reviewsCount: 96,
    pricePerNight: 640,
    originalPrice: 750,
    discountBadge: 'Popular',
    featured: true,
    badge: 'Breathtaking View',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqM: 80,
    bedType: '1 King Bed + 1 Daybed',
    view: 'Caldera Sunset & Aegean Sea',
    images: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Chiseled into the dramatic caldera cliff of Oia, this whitewashed sanctuary provides an outdoor heated jacuzzi overlooking the volcano and world-famous Aegean sunsets.',
    amenities: [
      'Heated Cliffside Jacuzzi',
      'Free High-speed Wi-Fi',
      'Ocean View',
      'Complimentary Gourmet Breakfast',
      'Greek Wine Tasting Platter',
      'Air Conditioning',
      'Espresso Machine'
    ],
    highlights: ['Heated Caldera Jacuzzi', 'Oia Sunset Front-row', 'Traditional Architecture']
  },
  {
    id: 'room-4',
    name: 'Alpine Matterhorn Panorama Chalet',
    category: 'Mountain Chalet',
    destinationId: 'swiss-alps',
    destinationName: 'Zermatt, Switzerland',
    stars: 5,
    rating: 4.96,
    reviewsCount: 88,
    pricePerNight: 820,
    originalPrice: 980,
    discountBadge: 'Save 16%',
    featured: false,
    badge: 'Ski-in / Ski-out',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    sizeSqM: 210,
    bedType: '3 King Beds',
    view: 'Direct Matterhorn Peak View',
    images: [
      'https://images.unsplash.com/photo-1517840905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A genuine luxury timber chalet situated at the base of the Matterhorn. Includes a private wood-burning fireplace, Finnish cedar sauna, outdoor heated hot tub, and ski-in / ski-out access.',
    amenities: [
      'Private Cedar Sauna',
      'Outdoor Hot Tub',
      'Ski Storage & Boot Warmers',
      'Wood-Burning Fireplace',
      'Free High-speed Wi-Fi',
      'Mountain View',
      'Complimentary Gourmet Breakfast',
      'Airport Helicopter Shuttle Available'
    ],
    highlights: ['Matterhorn Facing Terrace', 'Private In-Chalet Sauna', 'Log Fireplace']
  },
  {
    id: 'room-5',
    name: 'Ubud Rainforest Zen Retreat',
    category: 'Villas',
    destinationId: 'bali',
    destinationName: 'Bali, Indonesia',
    stars: 5,
    rating: 4.93,
    reviewsCount: 164,
    pricePerNight: 430,
    originalPrice: 520,
    discountBadge: 'Best Value',
    featured: true,
    badge: 'Wellness Retreat',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqM: 120,
    bedType: '1 Four-Poster King Bed',
    view: 'Lush Ayung River Jungle Valley',
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Immerse in tranquility among the mist and lush jungle canopy of Ubud. Highlights include a private plunge pool cantilevered over the ravine, open-concept marble bath, and daily private yoga sessions.',
    amenities: [
      'Private Plunge Pool',
      'Daily Sunrise Yoga Classes',
      'Free High-speed Wi-Fi',
      'Complimentary Gourmet Breakfast',
      'Holistic Spa Access',
      'Ayurvedic Afternoon Tea',
      'Free Shuttle to Ubud Center'
    ],
    highlights: ['Jungle Plunge Pool', 'Flower Bath Experience', 'Daily Sound Healing']
  },
  {
    id: 'room-6',
    name: 'Tokyo Sky Tower Executive Suite',
    category: 'Luxury Suite',
    destinationId: 'tokyo',
    destinationName: 'Tokyo, Japan',
    stars: 5,
    rating: 4.94,
    reviewsCount: 103,
    pricePerNight: 580,
    originalPrice: 650,
    discountBadge: 'Exclusive',
    featured: false,
    badge: 'Skyline Panorama',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1.5,
    sizeSqM: 110,
    bedType: '1 King Bed + Tatami Lounge',
    view: 'Tokyo Tower & Mt. Fuji Skyline',
    images: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Located on the 48th floor in Roppongi, featuring floor-to-ceiling glass wrapping around the sparkling metropolis. Blends minimalist Japanese craftsmanship with high-tech acoustic isolation.',
    amenities: [
      'Floor-to-Ceiling Skyline Views',
      'Hinoki Cypress Deep Soak Tub',
      'Free High-speed Wi-Fi',
      'Club Lounge Access & Cocktails',
      'Complimentary Gourmet Breakfast',
      'Smart Room Automation',
      'Nespresso & Premium Matcha Bar'
    ],
    highlights: ['48th Floor Horizon View', 'Japanese Onsen Style Bath', 'Executive Club Privileges']
  },
  {
    id: 'room-7',
    name: 'Manhattan Central Park Penthouse',
    category: 'Penthouse',
    destinationId: 'new-york',
    destinationName: 'Manhattan, New York',
    stars: 5,
    rating: 4.91,
    reviewsCount: 79,
    pricePerNight: 950,
    originalPrice: 1200,
    discountBadge: 'Save 21%',
    featured: true,
    badge: 'Celebrity Choice',
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2.5,
    sizeSqM: 230,
    bedType: '2 King Beds',
    view: 'Central Park & 5th Avenue',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An architectural marvel above Central Park. Features a wraparound private terrace, grand piano, curated modern art, private elevator access, and a master bathroom clad in Calacatta marble.',
    amenities: [
      'Wraparound Park Terrace',
      'Private Direct Elevator',
      'Free High-speed Wi-Fi',
      'Complimentary Gourmet Breakfast',
      'Chauffeur Mercedes S-Class Service',
      'Wine Cellar & Wet Bar',
      'Pet Friendly'
    ],
    highlights: ['Central Park Birds-Eye View', 'Private Concierge Team', 'Calacatta Marble Bath']
  },
  {
    id: 'room-8',
    name: 'Seminyak Azure Beachfront Suite',
    category: 'Luxury Suite',
    destinationId: 'bali',
    destinationName: 'Bali, Indonesia',
    stars: 4,
    rating: 4.88,
    reviewsCount: 135,
    pricePerNight: 320,
    originalPrice: 390,
    discountBadge: 'Special Offer',
    featured: false,
    badge: 'Beachfront',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    sizeSqM: 75,
    bedType: '1 King Bed',
    view: 'Seminyak Beach & Surf',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Step directly from your sun terrace onto warm golden sands. Close to Seminyak’s premier culinary scene, this chic suite offers tropical modern decor and unobstructed Indian Ocean sunsets.',
    amenities: [
      'Direct Beach Access',
      'Free High-speed Wi-Fi',
      'Complimentary Gourmet Breakfast',
      'Infinity Pool Access',
      'Sunset Cocktail Bar Voucher',
      'Air Conditioning'
    ],
    highlights: ['Direct Sand Access', 'Cocktails at Sunset', 'Rain Shower']
  }
];

export const CATEGORIES = [
  'All',
  'Luxury Suite',
  'Villas',
  'Penthouse',
  'Mountain Chalet'
];

export const ALL_AMENITIES = [
  'Free High-speed Wi-Fi',
  'Ocean View',
  'Complimentary Gourmet Breakfast',
  'Private Infinity Pool',
  'Private Plunge Pool',
  'Balcony with Monument View',
  'Heated Cliffside Jacuzzi',
  'Private Cedar Sauna',
  'Outdoor Hot Tub',
  '24/7 Butler Service',
  'Pet Friendly',
  'Valet Parking'
];

export const LUXURY_ADDONS = [
  {
    id: 'addon-vip-transfer',
    name: 'VIP Private Chauffeur / Speedboat Transfer',
    description: 'Round-trip private luxury vehicle or executive speedboat transfer with champagne greet.',
    price: 95
  },
  {
    id: 'addon-spa-treatment',
    name: 'Couples Holistic Spa & Aromatherapy (90 Min)',
    description: 'Deep relaxation massage, organic botanical facials, and private steam suite access.',
    price: 180
  },
  {
    id: 'addon-romantic-dinner',
    name: '5-Course Candlelit Beachfront / Terrace Dinner',
    description: 'Curated tasting menu prepared by our Executive Chef with sommelier wine pairing.',
    price: 150
  },
  {
    id: 'addon-early-late',
    name: 'Guaranteed Early Check-in & Late 4 PM Check-out',
    description: 'Arrive early at 10 AM and stay relaxed up to 4 PM on your day of departure.',
    price: 50
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sophia Montgomery',
    title: 'Verified Luxury Guest',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    hotelStayed: 'Presidential Oceanfront Villa, Maldives',
    rating: 5,
    date: 'February 2026',
    comment: 'The most extraordinary resort experience of our lives. From the personal butler greeting us on the speedboat to the unforgettable sunset over our private infinity pool, LuxeHaven delivered sheer perfection.'
  },
  {
    id: 2,
    name: 'Alexander & Elena Vance',
    title: 'Honeymooners',
    location: 'Geneva, Switzerland',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    hotelStayed: 'Grand Royal Eiffel Suite, Paris',
    rating: 5,
    date: 'January 2026',
    comment: 'Having breakfast on the private balcony while watching the Eiffel Tower shimmer was pure magic. The concierge team secured reservations at three Michelin-starred spots with zero hassle.'
  },
  {
    id: 3,
    name: 'Hiroshi Tanaka',
    title: 'Architectural Designer',
    location: 'Tokyo, Japan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    hotelStayed: 'Santorini Cliffside Cave Sanctuary',
    rating: 5,
    date: 'March 2026',
    comment: 'The attention to craftsmanship, acoustic silence inside the cave structure, and the unobstructed Caldera sunset jacuzzi make this an architectural triumph. Will return every year.'
  }
];

export const EXPERIENCES = [
  {
    id: 'exp-1',
    title: 'Michelin-Star Gastronomy',
    subtitle: 'Culinary Artistry',
    description: 'Dine in world-renowned establishments helmed by multi-star chefs, featuring farm-to-table organic produce and rare vintage wine pairings.',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    tag: 'Signature Dining'
  },
  {
    id: 'exp-2',
    title: 'Holistic Ayurvedic Wellness & Spa',
    subtitle: 'Rejuvenation Sanctuary',
    description: 'Immerse in ancient thermal water circuits, Himalayan salt caves, Tibetan singing bowl meditations, and custom botanical therapies.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    tag: 'Wellness & Vitality'
  },
  {
    id: 'exp-3',
    title: 'Private Yacht & Helicopter Expeditions',
    subtitle: 'Bespoke Journeys',
    description: 'Sail into secluded turquoise lagoons on our 80-foot Sunseeker yacht or take a scenic alpine helicopter flight over glaciers.',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&w=800&q=80',
    tag: 'Exclusive Excursions'
  },
  {
    id: 'exp-4',
    title: 'Infinity Sunset Pools & Lounges',
    subtitle: 'Architectural Wonder',
    description: 'Float suspended above turquoise oceans and vibrant city skylines with handcrafted artisanal mixology and ambient sunset sessions.',
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    tag: 'Rooftop Serenity'
  }
];

export const SPECIAL_OFFERS = [
  {
    id: 'offer-1',
    code: 'HONEYMOON25',
    title: 'The Romantic Haven Escape',
    discount: '25% OFF + Champagne',
    description: 'Complimentary vintage champagne upon arrival, candlelit beach dinner, and daily breakfast in bed.',
    validUntil: 'Valid through 2026',
    accent: 'from-amber-600 to-rose-600'
  },
  {
    id: 'offer-2',
    code: 'EXTENDSTAY',
    title: 'Stay 5 Nights, Pay For 4',
    discount: '1 Complimentary Night',
    description: 'Extend your relaxation. Enjoy a free night on stays of 5 nights or more, plus $150 resort spa credit.',
    validUntil: 'All Year Round',
    accent: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'offer-3',
    code: 'EARLYBIRD',
    title: 'Early Bird Prestige Privilege',
    discount: '20% OFF Advance Booking',
    description: 'Book at least 30 days ahead and unlock complimentary round-trip VIP airport transfer & room upgrade.',
    validUntil: 'Limited Availability',
    accent: 'from-emerald-600 to-teal-700'
  }
];

export const FAQS = [
  {
    question: 'What is LuxeHaven’s cancellation & refund policy?',
    answer: 'We provide full flexible cancellation up to 48 hours before your scheduled arrival date on all standard and flexible rates. For non-refundable promotional rates, bookings can be rescheduled once without penalty.'
  },
  {
    question: 'Are taxes and resort service fees included in the price?',
    answer: 'The rate displayed during search reflects the room charge per night. Detailed local hospitality taxes (typically 10-12%) and service charges are clearly itemized in Step 1 of your reservation checkout before payment.'
  },
  {
    question: 'Can I request early check-in or late check-out?',
    answer: 'Yes! You can choose our guaranteed Early Check-in (10:00 AM) or Late Check-out (4:00 PM) add-on during reservation. If not selected, standard check-in begins at 3:00 PM and check-out is 11:00 AM, with complimentary luggage storage available anytime.'
  },
  {
    question: 'What payment methods are supported on LuxeHaven?',
    answer: 'We accept all major international credit/debit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and offer a Pay Upon Arrival option for select rooms.'
  },
  {
    question: 'How do I access and manage my reservation after booking?',
    answer: 'Your reservation is immediately stored in your "My Bookings" dashboard and available for instant viewing or PDF voucher printing. You also receive an instant confirmation number and summary.'
  }
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 155.0 },
  { code: 'AUD', symbol: 'A$', rate: 1.52 }
];
