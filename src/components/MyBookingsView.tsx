import React, { useState } from 'react';
import { Booking, LoyaltyDiscountCoupon, User as UserType } from '../types';
import { LoyaltyPointsSection } from './LoyaltyPointsSection';
import { InviteFriendsSection } from './InviteFriendsSection';
import { NEXORA_ASSETS } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  QrCode, 
  Coffee, 
  Flower2, 
  Coins, 
  Gift, 
  Crown, 
  ArrowRight,
  Users
} from 'lucide-react';

interface MyBookingsViewProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onBookNew: () => void;
  currency: 'INR' | 'USD';
  currentUser: UserType | null;
  redeemedCoupons: LoyaltyDiscountCoupon[];
  onRedeemPoints: (pointsCost: number, discountINR: number, discountUSD: number, title: string) => void;
  onApplyCouponToBooking?: (coupon: LoyaltyDiscountCoupon) => void;
  onOpenAuth?: (tab?: 'login' | 'signup') => void;
  onUpdateUserPoints?: (pointsToAdd: number, reason: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onCancelBooking,
  onBookNew,
  currency,
  currentUser,
  redeemedCoupons,
  onRedeemPoints,
  onApplyCouponToBooking,
  onOpenAuth,
  onUpdateUserPoints,
}) => {
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'loyalty' | 'invite'>('bookings');

  // Calculate points earned from booking history + referral bonus
  const referralBonusTotal = (currentUser?.referralBonusPoints || 0);
  const bookingHistoryPoints = bookings.reduce((sum, b) => {
    if (b.status === 'Cancelled') return sum;
    return sum + Math.round(b.totalPriceINR * 0.10);
  }, 0);
  const totalLifetimeEarnedPoints = 500 + bookingHistoryPoints + referralBonusTotal;
  const totalRedeemedPoints = redeemedCoupons.reduce((sum, c) => sum + c.pointsCost, 0);
  const availablePoints = Math.max(0, totalLifetimeEarnedPoints - totalRedeemedPoints);

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="my-bookings-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E8E8] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#8e004b] font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salon Pass & Loyalty Rewards</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1c1b1b] font-medium">
              My Salon Appointments & Profile
            </h2>
            <p className="text-xs sm:text-sm text-[#594047] mt-1">
              Check your confirmed appointments, digital passes, and redeem earned loyalty points for instant discounts.
            </p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-[#8e004b] text-white shadow-xs'
                  : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('loyalty')}
              className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'loyalty'
                  ? 'bg-[#8e004b] text-white shadow-xs'
                  : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
              }`}
            >
              <Coins className="w-4 h-4 text-[#ffd700]" />
              <span>Loyalty Points ({availablePoints} PTS)</span>
            </button>

            <button
              onClick={() => setActiveTab('invite')}
              className={`px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'invite'
                  ? 'bg-[#8e004b] text-white shadow-xs'
                  : 'bg-white text-[#594047] hover:bg-[#F0EDEC] border border-[#E8E8E8]'
              }`}
            >
              <Users className="w-4 h-4 text-[#ffd700]" />
              <span>Invite Friends</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#ffd700] text-[#1c1b1b] text-[9px] font-black uppercase tracking-tight">
                +500 PTS
              </span>
            </button>
          </div>
        </div>

        {/* Highlight Banner when in Bookings View */}
        {activeTab === 'bookings' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FDE7F3] via-white to-[#FDE7F3] border border-[#ffcbd9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#8e004b] text-white flex items-center justify-center shadow-xs flex-shrink-0">
                <Crown className="w-6 h-6 text-[#ffd700]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#8e004b] uppercase tracking-wider">Nexora Club Rewards</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8e004b]/10 text-[#8e004b] font-bold">1 Point = ₹1</span>
                </div>
                <h4 className="font-serif-display text-lg font-bold text-[#1c1b1b]">
                  You have <span className="text-[#8e004b]">{availablePoints.toLocaleString('en-IN')} Loyalty Points</span> available
                </h4>
                <p className="text-xs text-[#594047]">
                  Earned from your salon booking history. Redeem for instant discount vouchers or invite friends for 500 bonus points each!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('invite')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-[#FDE7F3] border border-[#8e004b] text-[#8e004b] text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Invite Friends (+500)</span>
              </button>

              <button
                onClick={() => setActiveTab('loyalty')}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Redeem Discounts</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Bookings List */}
        {activeTab === 'bookings' && (
          <>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E8E8] p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
              No Upcoming Appointments
            </h3>
            <p className="text-xs sm:text-sm text-[#594047] mt-2 mb-6">
              You haven't booked any salon appointments yet. Explore our haircuts, Ayurvedic hair spas, and glowing facials.
            </p>
            <button
              onClick={onBookNew}
              className="px-6 py-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Browse Salon Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const displayPrice = currency === 'INR' 
                ? `₹${booking.totalPriceINR.toLocaleString('en-IN')}` 
                : `$${booking.totalPriceUSD}`;

              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div className="bg-[#F0EDEC] px-6 py-3.5 border-b border-[#E8E8E8] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        {booking.status}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#8e004b]">
                      Ref: {booking.bookingCode}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e004b] block">
                          {booking.treatment.category}
                        </span>
                        <h4 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
                          {booking.treatment.title}
                        </h4>
                      </div>
                      <span className="font-serif-display text-xl font-bold text-[#8e004b]">
                        {displayPrice}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="flex items-center space-x-2 text-[#594047]">
                        <Calendar className="w-4 h-4 text-[#8e004b]" />
                        <span className="font-semibold text-[#1c1b1b]">{booking.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#594047]">
                        <Clock className="w-4 h-4 text-[#8e004b]" />
                        <span className="font-semibold text-[#1c1b1b]">{booking.timeSlot} ({booking.treatment.durationMinutes}m)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#594047]">
                        <MapPin className="w-4 h-4 text-[#8e004b]" />
                        <span>{booking.sanctuary.city} ({booking.sanctuary.name})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[#594047]">
                        <User className="w-4 h-4 text-[#8e004b]" />
                        <span>Stylist: <strong className="text-[#1c1b1b]">{booking.artisan.name.split(' ')[0]}</strong></span>
                      </div>
                    </div>

                    {/* Hospitality Notes */}
                    <div className="bg-[#fdf8f8] p-3 rounded-lg border border-[#E8E8E8] text-[11px] text-[#594047] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-[#8e004b]" />
                        <span>Welcome Drink: <strong className="text-[#1c1b1b]">{booking.beverageChoice}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flower2 className="w-3.5 h-3.5 text-[#8e004b]" />
                        <span>Room Fragrance: <strong className="text-[#1c1b1b]">{booking.aromaPreference}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-6 py-4 bg-[#F0EDEC] border-t border-[#E8E8E8] flex items-center justify-between gap-3">
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-xs text-[#594047] hover:text-red-700 font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>

                    <button
                      onClick={() => setSelectedBookingForPass(booking)}
                      className="px-4 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Salon Pass</span>
                    </button>
                  </div>
                </div>
            );
          })}
        </div>
      )}
    </>
  )}

        {/* View 2: Loyalty Points Section */}
        {activeTab === 'loyalty' && (
          <LoyaltyPointsSection
            currentUser={currentUser}
            bookings={bookings}
            redeemedCoupons={redeemedCoupons}
            onRedeemPoints={onRedeemPoints}
            onApplyCouponToBooking={onApplyCouponToBooking}
            currency={currency}
          />
        )}

        {/* View 3: Invite Friends Section */}
        {activeTab === 'invite' && (
          <InviteFriendsSection
            currentUser={currentUser}
            onUpdateUserPoints={onUpdateUserPoints}
            onNavigateToBookings={() => setActiveTab('bookings')}
          />
        )}

      </div>

      {/* Digital Pass Modal */}
      {selectedBookingForPass && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E8E8E8] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
              <div className="flex items-center space-x-2">
                <img src={NEXORA_ASSETS.logo} alt="Nexora" className="w-8 h-8 object-contain" />
                <span className="font-serif-display text-lg font-bold text-[#8e004b]">NEXORA SALON PASS</span>
              </div>
              <button
                onClick={() => setSelectedBookingForPass(null)}
                className="text-xs font-semibold text-[#594047] hover:text-[#1c1b1b] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="text-center space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8e004b]">
                {selectedBookingForPass.sanctuary.name}
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
                {selectedBookingForPass.treatment.title}
              </h3>
              <p className="text-xs text-[#594047]">
                Guest: <strong className="text-[#1c1b1b]">{selectedBookingForPass.guestName}</strong>
              </p>
            </div>

            {/* Simulated QR Code Box */}
            <div className="bg-[#F0EDEC] p-6 rounded-xl border border-[#E8E8E8] flex flex-col items-center justify-center space-y-3">
              <div className="w-36 h-36 bg-white p-3 rounded-lg shadow-inner flex items-center justify-center border border-[#E8E8E8]">
                <QrCode className="w-28 h-28 text-[#8e004b]" />
              </div>
              <span className="font-mono text-xs font-bold tracking-widest text-[#8e004b]">
                {selectedBookingForPass.bookingCode}
              </span>
              <span className="text-[10px] text-[#594047]">Show this QR code at the salon reception</span>
            </div>

            <div className="text-xs text-[#594047] space-y-1 bg-[#FDE7F3]/40 p-3 rounded-lg border border-[#ffcbd9]">
              <div><strong>Date & Time:</strong> {selectedBookingForPass.date} at {selectedBookingForPass.timeSlot}</div>
              <div><strong>Stylist:</strong> {selectedBookingForPass.artisan.name}</div>
              <div><strong>Salon Address:</strong> {selectedBookingForPass.sanctuary.address}</div>
            </div>

            <button
              onClick={() => setSelectedBookingForPass(null)}
              className="w-full py-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-bold rounded-lg cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
