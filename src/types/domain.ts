export type MenuCategory = 'Snacks' | 'Raw' | 'Sea' | 'From the Garden' | 'Fire' | 'Sides' | 'Desserts & Cheese' | 'Bar';
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Settled';
export type TableState = 'available' | 'reserved';
export type PrivateInquiryStatus = 'New' | 'Contacted' | 'Closed';
export type RestaurantFloor = 'Ground floor' | 'First floor';
export type RestaurantZone = 'Bar Lounge' | 'Chef’s Counter' | 'Main Dining Room' | 'Courtyard' | 'Window Salon' | 'Stone Room' | 'Gallery' | 'Balcony' | 'Library Dining Room' | 'Private Salon';

export type BoutiqueCategory = 'Wine cellar' | 'Desserts' | 'Pantry & keepsakes';

export interface BoutiqueItem {
  id: number;
  name: string;
  category: BoutiqueCategory;
  price: number;
  description: string;
  note: string;
  image: string;
  position?: string;
}

export interface GuestProfile {
  name: string;
  email: string;
  memberId: string;
  serviceWord: string;
  lifetimeSpend: number;
  membershipThreshold: number;
}

export interface StoryChapter {
  year: string;
  title: string;
  text: string;
}

export interface SitePageCopy {
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    houseTitle: string;
    houseText: string;
    kitchenTitle: string;
    kitchenText: string;
    boutiqueTitle: string;
    boutiqueText: string;
  };
  story: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    introTitle: string;
    introText: string;
    featureTitle: string;
    featureText: string;
    teamTitle: string;
    teamText: string;
    musicTitle: string;
    musicText: string;
    timeline: StoryChapter[];
  };
  menu: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    bookTitle: string;
    bookHelp: string;
    tastingTitle: string;
    tastingText: string;
  };
  boutique: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    introTitle: string;
    introText: string;
    featureTitle: string;
    featureText: string;
    catalogueTitle: string;
    catalogueText: string;
  };
  reservations: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
  };
  visit: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
    neighbourhoodTitle: string;
    neighbourhoodText: string;
  };
  account: {
    heroEyebrow: string;
    heroTitle: string;
    heroText: string;
  };
}

export interface MenuItem {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  desc: string;
  ingredients: string[];
  tags: string[];
  featured: boolean;
  dishOfDay?: boolean;
  status?: 'live' | 'sold';
  img: string;
}

export interface RestaurantTable {
  id: number;
  cap: number;
  floor: RestaurantFloor;
  zone: RestaurantZone;
  x: number;
  y: number;
  shape: 'round' | 'square' | 'long';
}

export interface MusicEntry {
  day: string;
  title: string;
  artist: string;
  time: string;
  note: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  img: string;
}

export interface SiteContent {
  hero: string;
  announcement: string;
  phone: string;
  email: string;
  address: string;
  mapLat: number;
  mapLng: number;
  pages: SitePageCopy;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  note: string;
  date: string;
  time: string;
  guests: number;
  table: number;
  status: ReservationStatus;
  createdAt: number;
}


export interface SettledCheck {
  id: string;
  email: string;
  guestName: string;
  reservationId?: string;
  date: string;
  time: string;
  table?: number;
  guests?: number;
  amount: number;
  summary: string;
  createdAt: number;
}

export interface PrivateInquiry {
  id: string;
  kind: 'Private dining' | 'Callback';
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  eventType: string;
  note: string;
  status: PrivateInquiryStatus;
  createdAt: number;
}

export interface DemoSandbox {
  createdAt: number;
  expiresAt: number;
  menu: MenuItem[];
  boutique: BoutiqueItem[];
  music: MusicEntry[];
  team: TeamMember[];
  content: SiteContent;
  guestProfile: GuestProfile;
  tableOverrides: Record<string, TableState>;
}
