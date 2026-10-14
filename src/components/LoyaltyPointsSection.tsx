import React, { useState } from 'react';
import { Booking, LoyaltyDiscountCoupon, User } from '../types';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Crown, 
  Gift, 
  Award, 
  ArrowRight, 
  Check, 
  Copy, 
  History, 
  ChevronRight, 
  ShieldCheck, 
  Coins, 
  Tag, 
  Percent,
  Calendar,
  AlertCircle,
  Users
} from 'lucide-react';

interface LoyaltyPointsSectionProps {
  currentUser: User | null;
  bookings: Booking[];
  redeemedCoupons: LoyaltyDiscountCoupon[];
  onRedeemPoints: (pointsCost: number, discountINR: number, discountUSD: number, title: string) => void;
  onApplyCouponToBooking?: (coupon: LoyaltyDiscountCoupon) => void;
  currency: 'INR' | 'USD';
  onOpenInviteFriends?: () => void;
}

export const LoyaltyPointsSection: React.FC<LoyaltyPointsSectionProps> = ({
  currentUser,
  bookings,
  redeemedCoupons,
  onRedeemPoints,
  onApplyCouponToBooking,
  currency,
  onOpenInviteFriends,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [customPointsInput, setCustomPointsInput] = useState<number>(300);
  const [redeemSuccessMessage, setRedeemSuccessMessage] = useState<string | null>(null);

  // 1. Calculate points earned strictly from booking history + welcome bonus + referral bonus
  // Rule: 10% of booking amount (in INR) is awarded as Loyalty Points (e.g. ₹6,800 booking = 680 points)
  const welcomeBonusPoints = 500;
  const referralBonusPoints = currentUser?.referralBonusPoints || 0;
  const bookingHistoryPoints = bookings.reduce((sum, b) => {
    // Both confirmed and completed bookings generate loyalty points
    if (b.status === 'Cancelled') return sum;
    return sum + Math.round(b.totalPriceINR * 0.10);
  }, 0);

  const totalLifetimeEarnedPoints = welcomeBonusPoints + bookingHistoryPoints + referralBonusPoints;
  const totalRedeemedPoints = redeemedCoupons.reduce((sum, c) => sum + c.pointsCost, 0);
  const availablePoints = Math.max(0, totalLifetimeEarnedPoints - totalRedeemedPoints);

  // 2. Total money spent across bookings
  const totalSpentINR = bookings
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalPriceINR, 0);

  // 3. Determine Tier & Progression
  let currentTier: 'Nexora Circle' | 'Suvarna Circle' | 'Imperial Patrons' = 'Nexora Circle';
  let nextTier = 'Suvarna Circle';
  let tierProgressPercent = 0;
  let pointsToNextTier = 0;

  if (totalLifetimeEarnedPoints >= 2500) {
    currentTier = 'Imperial Patrons';
    nextTier = 'Highest Tier (Maharani Suite VIP)';
    tierProgressPercent = 100;
    pointsToNextTier = 0;
  } else if (totalLifetimeEarnedPoints >= 1000) {
    currentTier = 'Suvarna Circle';
    nextTier = 'Imperial Patrons';
    tierProgressPercent = Math.min(100, Math.round(((totalLifetimeEarnedPoints - 1000) / 1500) * 100));
    pointsToNextTier = 2500 - totalLifetimeEarnedPoints;
  } else {
    currentTier = 'Nexora Circle';
    nextTier = 'Suvarna Circle';
    tierProgressPercent = Math.min(100, Math.round((totalLifetimeEarnedPoints / 1000) * 100));
    pointsToNextTier = 1000 - totalLifetimeEarnedPoints;
  }

  // Pre-configured discount options for quick redemption
  const redemptionOptions = [
    {
      id: 'opt-200',
      pointsCost: 200,
      discountINR: 200,
      discountUSD: 2.5,
      title: '₹200 Instant Discount',
      description: 'Valid on any haircut, styling, or blow-dry appointment.',
      badge: 'Popular',
    },
    {
      id: 'opt-500',
      pointsCost: 500,
      discountINR: 500,
      discountUSD: 6,
      title: '₹500 Luxury Spa Discount',
      description: 'Valid on Ayurvedic head massages, hair spas, and glowing facials.',
      badge: 'Best Value',
    },
    {
      id: 'opt-1000',
      pointsCost: 1000,
      discountINR: 1000,
      discountUSD: 12,
      title: '₹1,000 Royal Makeover Discount',
      description: 'Valid on luxury bridal styling, hair coloring, and gold facials.',
      badge: 'VIP Perk',
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeemPreset = (option: typeof redemptionOptions[0]) => {
    if (availablePoints < option.pointsCost) {
      alert(`You need ${option.pointsCost - availablePoints} more points to redeem this voucher. Book an appointment to earn more points!`);
      return;
    }

    onRedeemPoints(option.pointsCost, option.discountINR, option.discountUSD, option.title);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8e004b', '#d4af37', '#ffd700', '#b90064'],
      });
    } catch (e) {
      // ignore
    }

    setRedeemSuccessMessage(`Congratulations! You redeemed ${option.pointsCost} points for a ₹${option.discountINR} discount voucher.`);
    setTimeout(() => setRedeemSuccessMessage(null), 5000);
  };

  const handleRedeemCustom = () => {
    const points = Number(customPointsInput);
    if (isNaN(points) || points < 100) {
      alert('Minimum 100 points required to redeem a discount voucher.');
      return;
    }
    if (points > availablePoints) {
      alert(`You only have ${availablePoints} points available. Please enter a lower amount.`);
      return;
    }

    const discountAmount = points; // 1 point = 1 rupee discount
    const discountUSD = Math.round((discountAmount / 83) * 10) / 10;
    const title = `₹${discountAmount} Custom Discount`;

    onRedeemPoints(points, discountAmount, discountUSD, title);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#8e004b', '#d4af37', '#ffd700'],
      });
    } catch (e) {
      // ignore
    }

    setRedeemSuccessMessage(`Success! You converted ${points} points into an instant ₹${discountAmount} discount coupon.`);
    setTimeout(() => setRedeemSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#1c1b1b]" id="loyalty-points-section">
      
      {/* Success Notification Banner */}
      {redeemSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1 font-medium">{redeemSuccessMessage}</div>
        </div>
      )}

      {/* Main Loyalty Points Overview Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8e004b] via-[#a30056] to-[#4a0026] text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#d4af37]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-[#ffcbd9] text-xs uppercase tracking-wider font-semibold backdrop-blur-xs">
              <Crown className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>Nexora Club • {currentTier}</span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold tracking-wide">
              Your Salon Loyalty Points
            </h3>
            <p className="text-xs sm:text-sm text-white/85 max-w-lg leading-relaxed">
              Earn 10 points for every ₹100 spent on any haircut, Ayurvedic hair spa, or glowing facial. 
              <strong> 1 Point = ₹1 Salon Discount!</strong>
            </p>
          </div>

          {/* Points Counter Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-5 text-center sm:text-right min-w-[200px]">
            <span className="text-[11px] uppercase tracking-wider text-[#ffcbd9] block font-medium">
              Available Balance
            </span>
            <div className="flex items-center justify-center sm:justify-end space-x-1.5 my-1">
              <Coins className="w-6 h-6 text-[#ffd700] animate-bounce" />
              <span className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white">
                {availablePoints.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-[#ffcbd9] uppercase">PTS</span>
            </div>
            <span className="text-[11px] text-white/80 block">
              Worth <strong>₹{availablePoints.toLocaleString('en-IN')}</strong> in salon discounts
            </span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/20">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-white/90 font-medium">
              Current Tier: <strong className="text-[#ffd700]">{currentTier}</strong>
            </span>
            <span className="text-[#ffcbd9]">
              {pointsToNextTier > 0 
                ? `${pointsToNextTier} more points to reach ${nextTier}` 
                : 'Top VIP Tier Achieved!'}
            </span>
          </div>
          <div className="w-full bg-black/25 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#ffd700] to-[#ffcbd9] h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${tierProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center space-x-2 text-[#594047] text-xs mb-1">
            <Calendar className="w-4 h-4 text-[#8e004b]" />
            <span>Total Bookings</span>
          </div>
          <span className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
            {bookings.length}
          </span>
          <span className="text-[10px] text-[#594047] block mt-0.5">Salon visits in history</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center space-x-2 text-[#594047] text-xs mb-1">
            <Coins className="w-4 h-4 text-[#8e004b]" />
            <span>Total Spent</span>
          </div>
          <span className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
            ₹{totalSpentINR.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#594047] block mt-0.5">Across all appointments</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center space-x-2 text-[#594047] text-xs mb-1">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Lifetime Earned</span>
          </div>
          <span className="font-serif-display text-2xl font-bold text-[#8e004b]">
            {totalLifetimeEarnedPoints.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#594047] block mt-0.5">Bookings + Welcome bonus</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E8E8] shadow-xs">
          <div className="flex items-center space-x-2 text-[#594047] text-xs mb-1">
            <Tag className="w-4 h-4 text-emerald-700" />
            <span>Points Redeemed</span>
          </div>
          <span className="font-serif-display text-2xl font-bold text-emerald-700">
            {totalRedeemedPoints.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#594047] block mt-0.5">Used for discounts</span>
        </div>
      </div>

      {/* SECTION: Redeem Points for Discounts */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E8E8] pb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8e004b] font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>Redeem Points for Salon Discounts</span>
            </div>
            <h4 className="font-serif-display text-xl sm:text-2xl font-bold text-[#1c1b1b]">
              Convert Your Points into Instant Money-Off Vouchers
            </h4>
          </div>
          <div className="text-xs text-[#594047]">
            Available to spend: <strong className="text-[#8e004b]">{availablePoints} Points</strong>
          </div>
        </div>

        {/* 3 Preset Voucher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {redemptionOptions.map((opt) => {
            const canAfford = availablePoints >= opt.pointsCost;
            return (
              <div 
                key={opt.id}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  canAfford 
                    ? 'border-[#ffcbd9] bg-gradient-to-b from-[#FCF9F8] to-[#FDE7F3]/30 hover:border-[#8e004b] hover:shadow-md' 
                    : 'border-[#E8E8E8] bg-stone-50/70 opacity-75'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#8e004b]/10 text-[#8e004b]">
                      {opt.badge}
                    </span>
                    <span className="text-xs font-bold text-[#8e004b] flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-[#d4af37]" />
                      {opt.pointsCost} PTS
                    </span>
                  </div>

                  <h5 className="font-serif-display text-lg font-bold text-[#1c1b1b]">
                    {opt.title}
                  </h5>

                  <p className="text-xs text-[#594047] leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E8E8E8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1c1b1b]">
                    Save ₹{opt.discountINR}
                  </span>
                  <button
                    onClick={() => handleRedeemPreset(opt)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-[#8e004b] hover:bg-[#b90064] text-white shadow-xs'
                        : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher' : `Need ${opt.pointsCost - availablePoints} PTS`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Point Converter */}
        <div className="bg-[#F0EDEC] p-5 rounded-xl border border-[#E8E8E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8e004b] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              <span>Custom Amount Redemption</span>
            </span>
            <p className="text-xs text-[#594047]">
              Want a specific discount? Type any points amount (1 Point = ₹1 instant discount).
            </p>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative">
              <input
                type="number"
                min="100"
                max={availablePoints || 100}
                step="50"
                value={customPointsInput}
                onChange={(e) => setCustomPointsInput(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-28 sm:w-32 px-3 py-2 bg-white border border-[#E8E8E8] rounded-lg text-xs font-bold text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                placeholder="e.g. 300"
              />
              <span className="absolute right-2 top-2 text-[10px] text-[#594047] font-semibold">PTS</span>
            </div>

            <button
              onClick={handleRedeemCustom}
              disabled={availablePoints < 100 || customPointsInput > availablePoints}
              className="px-4 py-2 bg-[#8e004b] hover:bg-[#b90064] disabled:bg-stone-300 disabled:text-stone-500 text-white text-xs uppercase tracking-wider font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer"
            >
              Convert to ₹{customPointsInput || 0} OFF
            </button>
          </div>
        </div>
      </div>

      {/* SECTION: Active Redeemed Discount Coupons Wallet */}
      {redeemedCoupons.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8e004b] font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>My Active Discount Vouchers ({redeemedCoupons.length})</span>
            </div>
            <span className="text-[11px] text-[#594047]">Ready to use at checkout or salon counter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {redeemedCoupons.map((coupon) => (
              <div 
                key={coupon.id}
                className="bg-[#FCF9F8] border border-[#ffcbd9] rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Voucher
                    </span>
                    <h5 className="font-serif-display text-base font-bold text-[#1c1b1b] mt-1">
                      {coupon.title}
                    </h5>
                    <p className="text-xs text-[#594047]">
                      {coupon.description}
                    </p>
                  </div>
                  <span className="font-serif-display text-xl font-bold text-[#8e004b]">
                    -₹{coupon.discountINR}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E8E8] gap-2">
                  <div className="flex items-center space-x-1.5 bg-white border border-[#E8E8E8] px-2.5 py-1.5 rounded-lg">
                    <span className="font-mono text-xs font-bold text-[#8e004b] tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="text-[#594047] hover:text-[#8e004b] p-0.5 cursor-pointer"
                      title="Copy Coupon Code"
                    >
                      {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {onApplyCouponToBooking && (
                    <button
                      onClick={() => onApplyCouponToBooking(coupon)}
                      className="px-3 py-1.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-[11px] font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Apply to Booking</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Detailed Points Earned from Booking History */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E8E8E8] pb-3">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8e004b] font-bold">
            <History className="w-3.5 h-3.5" />
            <span>Booking History Points Ledger</span>
          </div>
          <span className="text-[11px] text-[#594047]">
            Earned based on each confirmed & completed appointment
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8E8E8] text-[#594047] uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Salon Service / Activity</th>
                <th className="py-2.5 px-3">Booking Code</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3 text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {/* Row 1: Welcome Joining Bonus */}
              <tr className="hover:bg-[#FDE7F3]/20 transition-colors">
                <td className="py-3 px-3 text-[#594047]">Member Join Date</td>
                <td className="py-3 px-3 font-semibold text-[#1c1b1b] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Nexora Club Welcome Bonus</span>
                </td>
                <td className="py-3 px-3 text-[#594047] font-mono">NX-WELCOME</td>
                <td className="py-3 px-3 text-[#594047]">Free Perk</td>
                <td className="py-3 px-3 text-right font-bold text-emerald-700">
                  +{welcomeBonusPoints} PTS
                </td>
              </tr>

              {/* Row for Referral Bonus */}
              {referralBonusPoints > 0 && (
                <tr className="hover:bg-[#FDE7F3]/20 transition-colors bg-[#FDE7F3]/20">
                  <td className="py-3 px-3 text-[#594047] whitespace-nowrap">Recent</td>
                  <td className="py-3 px-3 font-semibold text-[#1c1b1b] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#8e004b]" />
                    <div>
                      <span>Friend Referral Bonuses</span>
                      <span className="text-[10px] text-[#594047] block font-normal">
                        {currentUser?.referralCount || 2} friends joined with code {currentUser?.referralCode || 'RIYA500'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#8e004b] font-mono font-semibold">
                    {currentUser?.referralCode || 'RIYA500'}
                  </td>
                  <td className="py-3 px-3 text-[#594047]">Free Perk</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">
                    +{referralBonusPoints} PTS
                  </td>
                </tr>
              )}

              {/* Rows from Bookings */}
              {bookings.map((b) => {
                const points = Math.round(b.totalPriceINR * 0.10);
                const isCancelled = b.status === 'Cancelled';
                return (
                  <tr key={b.id} className="hover:bg-[#FDE7F3]/20 transition-colors">
                    <td className="py-3 px-3 text-[#594047] whitespace-nowrap">{b.date}</td>
                    <td className="py-3 px-3 font-medium text-[#1c1b1b]">
                      <div>{b.treatment.title}</div>
                      <span className="text-[10px] text-[#594047] block">
                        {b.sanctuary.city} Branch • Stylist: {b.artisan.name.split(' ')[0]}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#8e004b] font-mono font-semibold whitespace-nowrap">
                      {b.bookingCode}
                    </td>
                    <td className="py-3 px-3 text-[#1c1b1b] font-semibold whitespace-nowrap">
                      ₹{b.totalPriceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold whitespace-nowrap">
                      {isCancelled ? (
                        <span className="text-stone-400">Cancelled (0 PTS)</span>
                      ) : (
                        <span className="text-emerald-700">+{points} PTS</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparent FAQ / Terms in Simple Indian English */}
      <div className="bg-[#F0EDEC] p-6 rounded-2xl border border-[#E8E8E8] space-y-3 text-xs text-[#594047]">
        <div className="flex items-center space-x-2 text-[#8e004b] font-bold uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4" />
          <span>Nexora Club Loyalty Rules & Benefits</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <strong className="text-[#1c1b1b] block">1. Earn on Every Visit</strong>
            <p>Every time you book an appointment, 10% of your bill is credited back as loyalty points within 24 hours.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-[#1c1b1b] block">2. Simple 1 Point = 1 Rupee</strong>
            <p>No complicated math or hidden conditions. 500 points gets you a straight ₹500 discount on your bill.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-[#1c1b1b] block">3. No Expiry for Active Members</strong>
            <p>Your points remain safe and active as long as you visit any Nexora salon once every 12 months.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
