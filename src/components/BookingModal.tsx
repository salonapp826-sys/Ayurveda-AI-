import React, { useState } from 'react';
import { TREATMENTS, ARTISANS, SANCTUARIES, BEVERAGES, AROMAS, NEXORA_ASSETS } from '../data/mockData';
import { Treatment, Artisan, SanctuaryLocation, Booking, User, LoyaltyDiscountCoupon } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Coffee, 
  Flower2, 
  ArrowRight, 
  ArrowLeft,
  Gift,
  Tag,
  Percent
} from 'lucide-react';

interface BookingModalProps {
  initialTreatment?: Treatment | null;
  initialArtisan?: Artisan | null;
  selectedSanctuary: SanctuaryLocation;
  onClose: () => void;
  onSaveBooking: (booking: Booking) => void;
  currency: 'INR' | 'USD';
  currentUser?: User | null;
  redeemedCoupons?: LoyaltyDiscountCoupon[];
  onUseCoupon?: (couponId: string) => void;
  initialAppliedCoupon?: LoyaltyDiscountCoupon | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  initialTreatment,
  initialArtisan,
  selectedSanctuary,
  onClose,
  onSaveBooking,
  currency,
  currentUser,
  redeemedCoupons = [],
  onUseCoupon,
  initialAppliedCoupon,
}) => {
  const [step, setStep] = useState<number>(1);
  const [treatment, setTreatment] = useState<Treatment>(initialTreatment || TREATMENTS[0]);
  const [artisan, setArtisan] = useState<Artisan>(initialArtisan || ARTISANS[0]);
  const [sanctuary, setSanctuary] = useState<SanctuaryLocation>(selectedSanctuary);
  
  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');

  // Hospitality & Sensory Customization
  const [beverage, setBeverage] = useState<string>(BEVERAGES[0].name);
  const [aroma, setAroma] = useState<string>(AROMAS[0].name);
  const [notes, setNotes] = useState<string>('');

  // Guest Details
  const [guestName, setGuestName] = useState<string>(currentUser ? currentUser.name : 'Riya Sharma');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser?.phone || '+91 98201 45890');
  const [guestEmail, setGuestEmail] = useState<string>(currentUser ? currentUser.email : 'riya.sharma@example.com');

  // Applied Loyalty Discount Coupon
  const [appliedCoupon, setAppliedCoupon] = useState<LoyaltyDiscountCoupon | null>(initialAppliedCoupon || null);

  // Discount calculation
  const discountINR = appliedCoupon ? appliedCoupon.discountINR : 0;
  const discountUSD = appliedCoupon ? appliedCoupon.discountUSD : 0;
  const finalPriceINR = Math.max(0, treatment.priceINR - discountINR);
  const finalPriceUSD = Math.max(0, Math.round((treatment.priceUSD - discountUSD) * 10) / 10);

  // Created Booking Record
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const timeSlots = [
    '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'
  ];

  const handleCompleteBooking = () => {
    const randomCode = 'NX-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      bookingCode: randomCode,
      treatment,
      artisan,
      sanctuary,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      guestName,
      guestPhone,
      guestEmail,
      beverageChoice: beverage,
      aromaPreference: aroma,
      hairScalpNotes: notes,
      totalPriceINR: finalPriceINR,
      totalPriceUSD: finalPriceUSD,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    if (appliedCoupon && onUseCoupon) {
      onUseCoupon(appliedCoupon.id);
    }

    setConfirmedBooking(newBooking);
    onSaveBooking(newBooking);
    setStep(5);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8e004b', '#E6007E', '#ffd9e2', '#d4af37'],
      });
    } catch (e) {
      // ignore
    }
  };

  const displayPrice = currency === 'INR' 
    ? (appliedCoupon ? `₹${finalPriceINR.toLocaleString('en-IN')}` : `₹${treatment.priceINR.toLocaleString('en-IN')}`)
    : (appliedCoupon ? `$${finalPriceUSD}` : `$${treatment.priceUSD}`);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8E8E8] my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#fdf8f8] border-b border-[#E8E8E8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#8e004b] text-white flex items-center justify-center font-bold text-xs">
              NX
            </div>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-[#1c1b1b]">
                Book Salon Appointment
              </h3>
              <span className="text-[10px] uppercase tracking-widest text-[#594047]">
                Salon जा रहे हो? NEXORA किया क्या? • Private AC Room
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 py-3 bg-[#F0EDEC] border-b border-[#E8E8E8] flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar">
              {[
                { num: 1, label: 'Service & Branch' },
                { num: 2, label: 'Select Stylist' },
                { num: 3, label: 'Date & Time' },
                { num: 4, label: 'Drinks & Details' },
              ].map((s) => (
                <div 
                  key={s.num}
                  className={`flex items-center space-x-1.5 whitespace-nowrap ${
                    step === s.num 
                      ? 'text-[#8e004b]' 
                      : step > s.num 
                        ? 'text-emerald-700' 
                        : 'text-[#594047]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                    step === s.num
                      ? 'bg-[#8e004b] text-white'
                      : step > s.num
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#d4c7ca] text-white'
                  }`}>
                    {step > s.num ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
            <span className="text-[11px] text-[#594047] hidden sm:inline">Step {step} of 4</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Treatment & Salon Location */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] block mb-2">
                  Select Salon Branch
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SANCTUARIES.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSanctuary(s)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        sanctuary.id === s.id
                          ? 'border-[#8e004b] bg-[#FDE7F3]/40 shadow-xs'
                          : 'border-[#E8E8E8] bg-white hover:bg-[#F0EDEC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#1c1b1b]">{s.city}</span>
                        {sanctuary.id === s.id && <Check className="w-4 h-4 text-[#8e004b]" />}
                      </div>
                      <span className="text-xs text-[#594047] block mt-0.5">{s.name}</span>
                      <span className="text-[10px] text-[#594047] block mt-1">{s.address}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] block mb-2">
                  Choose Salon Service or Treatment
                </label>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {TREATMENTS.map((t) => {
                    const price = currency === 'INR' ? `₹${t.priceINR.toLocaleString('en-IN')}` : `$${t.priceUSD}`;
                    const isSelected = treatment.id === t.id;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setTreatment(t)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#8e004b] bg-[#FDE7F3]/40 shadow-xs'
                            : 'border-[#E8E8E8] bg-white hover:bg-[#F0EDEC]'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img 
                            src={t.image} 
                            alt={t.title} 
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e004b] block">
                              {t.category}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-[#1c1b1b] block">
                              {t.title}
                            </span>
                            <span className="text-[11px] text-[#594047]">
                              {t.durationMinutes} mins • {t.keyBotanicals.slice(0, 2).join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 pl-2">
                          <span className="font-serif-display text-base font-bold text-[#8e004b] block">
                            {price}
                          </span>
                          {isSelected && <span className="text-[10px] font-bold text-emerald-700 uppercase">Selected</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Stylist Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-1">
                  Select Stylist or Ayurvedic Doctor
                </h4>
                <p className="text-xs text-[#594047] mb-3">
                  All stylists at Nexora have 10+ years of salon experience and provide dedicated 1:1 attention in your room.
                </p>
              </div>

              <div className="space-y-3">
                {ARTISANS.map((a) => {
                  const isSelected = artisan.id === a.id;
                  return (
                    <div
                      key={a.id}
                      onClick={() => setArtisan(a)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-[#8e004b] bg-[#FDE7F3]/40 shadow-xs'
                          : 'border-[#E8E8E8] bg-white hover:bg-[#F0EDEC]'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <img 
                          src={a.avatar} 
                          alt={a.name} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif-display text-base font-bold text-[#1c1b1b]">{a.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-[#F0EDEC] text-[#594047] rounded-full font-medium">
                              ★ {a.rating}
                            </span>
                          </div>
                          <span className="text-xs text-[#8e004b] font-medium block">{a.role}</span>
                          <span className="text-[11px] text-[#594047] block mt-1">
                            {a.experienceYears} Yrs Experience • Specialty: {a.specialties[0]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#8e004b] bg-[#8e004b] text-white' : 'border-[#d4c7ca]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Date & Time Slot */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] block mb-2">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-sm font-medium text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] block mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-[#8e004b] bg-[#8e004b] text-white shadow-xs'
                            : 'border-[#E8E8E8] bg-white text-[#1c1b1b] hover:bg-[#F0EDEC]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 opacity-80" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 bg-[#FDE7F3]/40 border border-[#ffcbd9] rounded-xl text-xs text-[#594047]">
                <span className="font-bold text-[#8e004b]">Hygiene Guarantee:</span> We keep 15 minutes between appointments to sanitize the styling room and sterilize all scissors, combs, and towels.
              </div>
            </div>
          )}

          {/* STEP 4: Hospitality & Guest Details */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              {/* Beverage Choice */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] flex items-center gap-1.5 mb-2">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Free Welcome Drink (Choose One)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BEVERAGES.map((bev) => (
                    <div
                      key={bev.id}
                      onClick={() => setBeverage(bev.name)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        beverage === bev.name 
                          ? 'border-[#8e004b] bg-[#FDE7F3]/40 font-semibold text-[#8e004b]' 
                          : 'border-[#E8E8E8] bg-white text-[#1c1b1b] hover:bg-[#F0EDEC]'
                      }`}
                    >
                      <div className="font-medium">{bev.name}</div>
                      <div className="text-[10px] text-[#594047] font-normal">{bev.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aromatherapy Ambient Note */}
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] flex items-center gap-1.5 mb-2">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Room Scent & Aroma</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AROMAS.map((aro) => (
                    <div
                      key={aro.id}
                      onClick={() => setAroma(aro.name)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        aroma === aro.name 
                          ? 'border-[#8e004b] bg-[#FDE7F3]/40 font-semibold text-[#8e004b]' 
                          : 'border-[#E8E8E8] bg-white text-[#1c1b1b] hover:bg-[#F0EDEC]'
                      }`}
                    >
                      <div className="font-medium">{aro.name}</div>
                      <div className="text-[10px] text-[#594047] font-normal">{aro.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Details */}
              <div className="pt-2 border-t border-[#E8E8E8] space-y-3">
                <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] block">
                  Guest Contact Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#594047] block mb-1">Your Full Name</span>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#594047] block mb-1">Mobile Number (SMS / WhatsApp)</span>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#594047] block mb-1">Email ID (for booking receipt)</span>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                  />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#594047] block mb-1">Any Hair or Scalp Concerns? (Optional)</span>
                  <textarea
                    rows={2}
                    value={notes}
                    placeholder="e.g. Scalp feels sensitive, prefer lukewarm water rinse, attending wedding next week..."
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs text-[#1c1b1b] placeholder-[#594047]"
                  />
                </div>

                {/* Loyalty Discount Voucher Section */}
                <div className="pt-3 border-t border-[#E8E8E8] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-bold text-[#8e004b] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Redeemed Loyalty Points Discount</span>
                    </label>
                    {appliedCoupon && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ₹{appliedCoupon.discountINR} Discount Active
                      </span>
                    )}
                  </div>

                  {redeemedCoupons.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#594047]">
                        Choose from your redeemed loyalty vouchers:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {redeemedCoupons.map((c) => {
                          const isSelected = appliedCoupon?.id === c.id;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setAppliedCoupon(isSelected ? null : c)}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'border-[#8e004b] bg-[#FDE7F3]/50 shadow-xs'
                                  : 'border-[#E8E8E8] bg-white hover:bg-[#F0EDEC]'
                              }`}
                            >
                              <div>
                                <span className="font-mono text-xs font-bold text-[#8e004b] block">{c.code}</span>
                                <span className="text-[11px] font-semibold text-[#1c1b1b]">{c.title}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-emerald-700 text-sm block">-₹{c.discountINR}</span>
                                <span className="text-[10px] text-[#8e004b] underline">
                                  {isSelected ? 'Remove' : 'Apply'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-[#F0EDEC] rounded-xl border border-[#E8E8E8] text-xs text-[#594047] flex items-center justify-between">
                      <span>No active discount vouchers right now.</span>
                      <span className="text-[11px] text-[#8e004b] font-semibold">
                        Redeem points in your Profile for discounts
                      </span>
                    </div>
                  )}

                  {/* Price Summary Breakdown */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-[#E8E8E8] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#594047]">
                      <span>Service Price:</span>
                      <span>₹{treatment.priceINR.toLocaleString('en-IN')}</span>
                    </div>
                    {discountINR > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Loyalty Points Voucher ({appliedCoupon?.code}):</span>
                        <span>-₹{discountINR.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-[#1c1b1b] pt-1.5 border-t border-[#E8E8E8]">
                      <span>Final Payable at Salon:</span>
                      <span className="text-[#8e004b]">
                        {currency === 'INR' ? `₹${finalPriceINR.toLocaleString('en-IN')}` : `$${finalPriceUSD}`}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#594047] pt-0.5">
                      ⭐ You will also earn <strong className="text-emerald-700">+{Math.round(finalPriceINR * 0.10)} new Loyalty Points</strong> from this appointment!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Boarding Pass */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Salon Appointment Confirmed!</span>
              </div>

              {/* Boarding Card */}
              <div className="bg-gradient-to-br from-[#FCF9F8] to-[#F0EDEC] border-2 border-[#8e004b]/30 rounded-2xl p-6 text-left shadow-lg relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#8e004b]/5 pointer-events-none" />
                
                {/* Pass Top */}
                <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <img src={NEXORA_ASSETS.logo} alt="Nexora" className="w-8 h-8 object-contain" />
                    <div>
                      <span className="font-serif-display text-lg font-bold text-[#8e004b]">NEXORA SALON PASS</span>
                      <span className="text-[10px] block text-[#594047] uppercase tracking-wider">{confirmedBooking.sanctuary.city} Branch</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#594047] block">Booking Ref</span>
                    <span className="font-mono text-sm font-bold text-[#8e004b]">{confirmedBooking.bookingCode}</span>
                  </div>
                </div>

                {/* Pass Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#594047] uppercase block">Guest Name</span>
                    <span className="font-bold text-[#1c1b1b]">{confirmedBooking.guestName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#594047] uppercase block">Date & Time</span>
                    <span className="font-bold text-[#1c1b1b]">{confirmedBooking.date} • {confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#594047] uppercase block">Specialist</span>
                    <span className="font-bold text-[#8e004b]">{confirmedBooking.artisan.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#594047] uppercase block">Styling Room</span>
                    <span className="font-bold text-[#1c1b1b]">Royal Suite #1</span>
                  </div>
                </div>

                {/* Service Title */}
                <div className="mt-4 pt-3 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#594047] uppercase block">Booked Service</span>
                    <span className="font-serif-display text-lg font-bold text-[#1c1b1b]">{confirmedBooking.treatment.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#594047] uppercase block">Total Price</span>
                    <span className="font-serif-display text-xl font-bold text-[#8e004b]">
                      {currency === 'INR' ? `₹${confirmedBooking.totalPriceINR.toLocaleString('en-IN')}` : `$${confirmedBooking.totalPriceUSD}`}
                    </span>
                  </div>
                </div>

                {/* Hospitality Note */}
                <div className="mt-3 pt-2 text-[11px] text-[#594047] flex items-center justify-between">
                  <span>Welcome Drink: {confirmedBooking.beverageChoice} • {confirmedBooking.aromaPreference}</span>
                  <span className="font-bold text-emerald-700">✓ Reserved</span>
                </div>
              </div>

              <p className="text-xs text-[#594047] max-w-md mx-auto">
                A confirmation SMS and WhatsApp message with Google Maps directions to <span className="font-semibold text-[#1c1b1b]">{confirmedBooking.sanctuary.address}</span> has been sent to {confirmedBooking.guestPhone}.
              </p>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-[#fdf8f8] border-t border-[#E8E8E8] p-4 sm:p-6 flex items-center justify-between">
          {step < 5 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 border border-[#E8E8E8] hover:bg-white text-xs uppercase tracking-wider font-semibold rounded-lg text-[#1c1b1b] flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-3">
                <span className="text-xs text-[#594047] font-serif-display font-semibold hidden sm:inline">
                  {treatment.title} • {displayPrice}
                </span>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteBooking}
                    className="px-8 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Salon Booking</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Done & Close
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
