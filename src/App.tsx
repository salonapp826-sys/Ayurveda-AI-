import React, { useState, useEffect } from 'react';
import { 
  SANCTUARIES, 
  TREATMENTS, 
  ARTISANS, 
  PRODUCTS, 
  BEVERAGES, 
  AROMAS 
} from './data/mockData';
import { SanctuaryLocation, Treatment, Artisan, Product, Booking, CartItem, User, LoyaltyDiscountCoupon } from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { HeroEditorial } from './components/HeroEditorial';
import { TreatmentCatalog } from './components/TreatmentCatalog';
import { ArtisanCatalog } from './components/ArtisanCatalog';
import { SuvarnaBoutique } from './components/SuvarnaBoutique';
import { AIConsultationView } from './components/AIConsultationView';
import { MyBookingsView } from './components/MyBookingsView';
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { AndroidAppInspectorModal } from './components/AndroidAppInspectorModal';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [androidModalOpen, setAndroidModalOpen] = useState<boolean>(false);

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'treatments' | 'artisans' | 'boutique' | 'advisor' | 'bookings'>('treatments');

  // Sanctuary & Currency
  const [selectedSanctuary, setSelectedSanctuary] = useState<SanctuaryLocation>(SANCTUARIES[0]);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // User Authentication State (Default demo member: Riya Sharma with Suvarna Circle tier)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'usr-riya-01',
      name: 'Riya Sharma',
      email: 'riya.sharma@example.com',
      phone: '+91 98201 45890',
      membershipTier: 'Suvarna Circle',
      loyaltyPoints: 2260,
      referralCode: 'RIYA500',
      referralCount: 2,
      referralBonusPoints: 1000,
    };
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (tab: 'login' | 'signup' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexora_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('nexora_user');
  };

  // Redeemed Discount Coupons Wallet
  const [redeemedCoupons, setRedeemedCoupons] = useState<LoyaltyDiscountCoupon[]>(() => {
    const saved = localStorage.getItem('nexora_redeemed_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'coup-init-01',
        code: 'NEXORA200',
        title: '₹200 Instant Discount',
        discountINR: 200,
        discountUSD: 2.5,
        pointsCost: 200,
        description: 'Valid on any haircut, styling, or blow-dry appointment.',
        createdAt: new Date().toISOString(),
        isUsed: false,
      }
    ];
  });

  const [selectedCouponForBooking, setSelectedCouponForBooking] = useState<LoyaltyDiscountCoupon | null>(null);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      quantity: 1,
    }
  ]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [selectedTreatmentForBooking, setSelectedTreatmentForBooking] = useState<Treatment | null>(null);
  const [selectedArtisanForBooking, setSelectedArtisanForBooking] = useState<Artisan | null>(null);

  // Confirmed Bookings History (Includes past completed visits and upcoming appointment)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book-init-01',
      bookingCode: 'NX-892410',
      treatment: TREATMENTS[0],
      artisan: ARTISANS[1],
      sanctuary: SANCTUARIES[0],
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timeSlot: '02:30 PM',
      guestName: 'Riya Sharma',
      guestPhone: '+91 98201 45890',
      guestEmail: 'riya.sharma@example.com',
      beverageChoice: BEVERAGES[0].name,
      aromaPreference: AROMAS[1].name,
      hairScalpNotes: 'Preference for warm herbal rinse and scalp tension release.',
      totalPriceINR: TREATMENTS[0].priceINR,
      totalPriceUSD: TREATMENTS[0].priceUSD,
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'book-past-02',
      bookingCode: 'NX-741920',
      treatment: TREATMENTS[2] || TREATMENTS[0],
      artisan: ARTISANS[0],
      sanctuary: SANCTUARIES[0],
      date: new Date(Date.now() - 86400000 * 18).toISOString().split('T')[0],
      timeSlot: '11:00 AM',
      guestName: 'Riya Sharma',
      guestPhone: '+91 98201 45890',
      guestEmail: 'riya.sharma@example.com',
      beverageChoice: BEVERAGES[1].name,
      aromaPreference: AROMAS[0].name,
      hairScalpNotes: 'Pre-wedding facial with 24K gold foil and rose toner.',
      totalPriceINR: 7800,
      totalPriceUSD: 94,
      status: 'Completed',
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    }
  ]);

  // Points calculation based on total booking history + referral bonuses
  const referralBonusTotal = (currentUser?.referralBonusPoints || 0);
  const bookingHistoryPoints = bookings.reduce((sum, b) => {
    if (b.status === 'Cancelled') return sum;
    return sum + Math.round(b.totalPriceINR * 0.10);
  }, 0);
  const totalLifetimeEarnedPoints = 500 + bookingHistoryPoints + referralBonusTotal;
  const totalRedeemedPoints = redeemedCoupons.reduce((sum, c) => sum + c.pointsCost, 0);
  const availableLoyaltyPoints = Math.max(0, totalLifetimeEarnedPoints - totalRedeemedPoints);

  const handleUpdateUserPoints = (pointsToAdd: number, reason?: string) => {
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        loyaltyPoints: currentUser.loyaltyPoints + pointsToAdd,
        referralCount: (currentUser.referralCount || 0) + 1,
        referralBonusPoints: (currentUser.referralBonusPoints || 0) + pointsToAdd,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('nexora_user', JSON.stringify(updatedUser));
    }
  };

  const handleRedeemPoints = (pointsCost: number, discountINR: number, discountUSD: number, title: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCoupon: LoyaltyDiscountCoupon = {
      id: 'coup-' + Date.now(),
      code: `NX-${discountINR}-${randomSuffix}`,
      title,
      discountINR,
      discountUSD,
      pointsCost,
      description: `Redeemed using ${pointsCost} points. Valid across all salon branches.`,
      createdAt: new Date().toISOString(),
      isUsed: false,
    };

    setRedeemedCoupons(prev => {
      const updated = [newCoupon, ...prev];
      localStorage.setItem('nexora_redeemed_coupons', JSON.stringify(updated));
      return updated;
    });

    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        loyaltyPoints: Math.max(0, currentUser.loyaltyPoints - pointsCost),
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('nexora_user', JSON.stringify(updatedUser));
    }
  };

  const handleUseCoupon = (couponId: string) => {
    setRedeemedCoupons(prev => {
      const updated = prev.filter(c => c.id !== couponId);
      localStorage.setItem('nexora_redeemed_coupons', JSON.stringify(updated));
      return updated;
    });
    setSelectedCouponForBooking(null);
  };

  const handleApplyCouponToBooking = (coupon: LoyaltyDiscountCoupon) => {
    setSelectedCouponForBooking(coupon);
    setBookingModalOpen(true);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Booking Initiation Handlers
  const handleOpenBookingWithTreatment = (treatment: Treatment) => {
    setSelectedTreatmentForBooking(treatment);
    setSelectedArtisanForBooking(null);
    setBookingModalOpen(true);
  };

  const handleOpenBookingWithArtisan = (artisan: Artisan) => {
    setSelectedArtisanForBooking(artisan);
    // Find matching signature treatment if available
    const matched = TREATMENTS.find((t) => t.title === artisan.signatureRitual) || TREATMENTS[0];
    setSelectedTreatmentForBooking(matched);
    setBookingModalOpen(true);
  };

  const handleSaveBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f8] text-[#1c1b1b] font-sans antialiased">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen 
          onEnter={() => setShowSplash(false)} 
          autoAdvance={true}
        />
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSanctuary={selectedSanctuary}
        setSelectedSanctuary={setSelectedSanctuary}
        currency={currency}
        setCurrency={setCurrency}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenBooking={() => {
          setSelectedTreatmentForBooking(null);
          setSelectedArtisanForBooking(null);
          setBookingModalOpen(true);
        }}
        onReplaySplash={() => setShowSplash(true)}
        currentUser={currentUser}
        loyaltyPoints={availableLoyaltyPoints}
        onOpenAuth={handleOpenAuth}
        onOpenAndroidInspector={() => setAndroidModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* Editorial Hero (Displayed on Treatments / Artisans / Boutique views) */}
        {activeTab === 'treatments' && (
          <HeroEditorial
            onExploreTreatments={() => {
              const el = document.getElementById('treatments-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenBooking={() => {
              setSelectedTreatmentForBooking(null);
              setSelectedArtisanForBooking(null);
              setBookingModalOpen(true);
            }}
            onExploreBoutique={() => setActiveTab('boutique')}
            onOpenAdvisor={() => setActiveTab('advisor')}
          />
        )}

        {/* Tab 1: Treatments & Rituals */}
        {activeTab === 'treatments' && (
          <TreatmentCatalog
            onBookTreatment={handleOpenBookingWithTreatment}
            currency={currency}
          />
        )}

        {/* Tab 2: Master Artisans */}
        {activeTab === 'artisans' && (
          <ArtisanCatalog
            onSelectArtisanForBooking={handleOpenBookingWithArtisan}
          />
        )}

        {/* Tab 3: Suvarna Boutique */}
        {activeTab === 'boutique' && (
          <SuvarnaBoutique
            onAddToCart={handleAddToCart}
            currency={currency}
          />
        )}

        {/* Tab 4: AI Ritual Advisor */}
        {activeTab === 'advisor' && (
          <AIConsultationView
            onBookTreatment={handleOpenBookingWithTreatment}
            currency={currency}
          />
        )}

        {/* Tab 5: My Bookings & Digital Passports */}
        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onBookNew={() => {
              setSelectedTreatmentForBooking(null);
              setSelectedArtisanForBooking(null);
              setBookingModalOpen(true);
            }}
            currency={currency}
            currentUser={currentUser}
            redeemedCoupons={redeemedCoupons}
            onRedeemPoints={handleRedeemPoints}
            onApplyCouponToBooking={handleApplyCouponToBooking}
            onOpenAuth={handleOpenAuth}
            onUpdateUserPoints={handleUpdateUserPoints}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          initialTreatment={selectedTreatmentForBooking}
          initialArtisan={selectedArtisanForBooking}
          selectedSanctuary={selectedSanctuary}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedTreatmentForBooking(null);
            setSelectedArtisanForBooking(null);
            setSelectedCouponForBooking(null);
          }}
          onSaveBooking={handleSaveBooking}
          currency={currency}
          currentUser={currentUser}
          redeemedCoupons={redeemedCoupons}
          onUseCoupon={handleUseCoupon}
          initialAppliedCoupon={selectedCouponForBooking}
        />
      )}

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currency={currency}
      />

      {/* Luxury Authentication & User Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        initialTab={authInitialTab}
        bookings={bookings}
        redeemedCoupons={redeemedCoupons}
        onRedeemPoints={handleRedeemPoints}
        onApplyCouponToBooking={handleApplyCouponToBooking}
        currency={currency}
        onUpdateUserPoints={handleUpdateUserPoints}
      />

      {/* Floating WhatsApp Button to +91 98201 45890 */}
      <WhatsAppFloatingButton phoneNumber="+91 98201 45890" />

      {/* Android Native Jetpack Compose Architecture Modal */}
      <AndroidAppInspectorModal
        isOpen={androidModalOpen}
        onClose={() => setAndroidModalOpen(false)}
      />
    </div>
  );
}
