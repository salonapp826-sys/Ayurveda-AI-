export type SanctuaryCity = 'Mumbai' | 'Delhi' | 'Bengaluru' | 'Udaipur';

export interface SanctuaryLocation {
  id: string;
  name: string;
  city: SanctuaryCity;
  address: string;
  neighborhood: string;
  phone: string;
  openHours: string;
  suitesCount: number;
}

export type TreatmentCategory = 
  | 'All'
  | 'Hair Styling & Cuts'
  | 'Ayurvedic Head Massage'
  | 'Gold & Glow Facials'
  | 'Hair Colour & Highlights'
  | 'Bridal Makeup & Styling';

export interface Treatment {
  id: string;
  title: string;
  sanskritName?: string;
  category: TreatmentCategory;
  description: string;
  extendedDescription: string;
  durationMinutes: number;
  priceINR: number;
  priceUSD: number;
  benefits: string[];
  keyBotanicals: string[];
  ritualSteps: string[];
  image: string;
  isSignature?: boolean;
  recommendedArtisanRole: string;
}

export interface Artisan {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  specialties: string[];
  bio: string;
  sanctuaryId: string;
  avatar: string;
  signatureRitual: string;
  availableDays: string[];
}

export interface Product {
  id: string;
  name: string;
  sanskritName: string;
  subTitle: string;
  volume: string;
  priceINR: number;
  priceUSD: number;
  category: 'Hair Oils & Serums' | 'Face Creams & Glow Packs' | 'Aroma & Scented Candles' | 'Silk Bags & Accessories';
  description: string;
  botanicals: string[];
  howToUse: string;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isBestseller?: boolean;
}

export interface Booking {
  id: string;
  bookingCode: string;
  treatment: Treatment;
  artisan: Artisan;
  sanctuary: SanctuaryLocation;
  date: string;
  timeSlot: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  beverageChoice: string;
  aromaPreference: string;
  hairScalpNotes?: string;
  totalPriceINR: number;
  totalPriceUSD: number;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AIAdvisorRequest {
  hairType: string;
  scalpCondition: string;
  primaryGoal: string;
  skinType?: string;
  upcomingOccasion?: string;
  fragrancePreference?: string;
  customNotes?: string;
}

export interface AIAdvisorResponse {
  ayurvedicAnalysis: string;
  doshaAffinity: string;
  recommendedRituals: string[];
  homecareRegimen: string[];
  artisanMatchReason: string;
  lifestyleWellnessTip: string;
}

export interface ExpertQARequest {
  question: string;
  hairType?: string;
  scalpCondition?: string;
  skinType?: string;
}

export interface ExpertQAResponse {
  question: string;
  answer: string;
  routineRecommendations: {
    morning?: string;
    evening?: string;
    weekly?: string;
  };
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  suggestedSalonRitual?: string;
  expertName?: string;
  expertTitle?: string;
}

export interface GiftVoucher {
  id: string;
  voucherCode: string;
  amountINR: number;
  amountUSD: number;
  theme: 'Royal Gold' | 'Mysore Sandalwood' | 'Kannauj Rose' | 'Madurai Jasmine';
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  personalMessage: string;
  deliveryDate: string;
  status: 'Dispatched' | 'Redeemed' | 'Active';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipTier: 'Guest' | 'Nexora Circle' | 'Suvarna Circle' | 'Imperial Patrons' | 'Maharani Suite';
  loyaltyPoints: number;
  avatar?: string;
  referralCode?: string;
  referralCount?: number;
  referralBonusPoints?: number;
}

export interface LoyaltyDiscountCoupon {
  id: string;
  code: string;
  title: string;
  discountINR: number;
  discountUSD: number;
  pointsCost: number;
  description: string;
  createdAt: string;
  isUsed: boolean;
}

export interface ReferralHistoryItem {
  id: string;
  friendName: string;
  friendPhoneOrEmail: string;
  date: string;
  bonusPointsAwarded: number;
  status: 'Completed' | 'Pending First Visit';
}

export interface LoyaltyHistoryItem {
  id: string;
  type: 'earned_booking' | 'welcome_bonus' | 'redeemed_discount' | 'referral_bonus';
  title: string;
  reference?: string;
  points: number; // positive for earned, negative for redeemed
  amountSpentINR?: number;
  date: string;
  details?: string;
}
