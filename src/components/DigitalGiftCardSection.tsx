import React, { useState } from 'react';
import { GiftVoucher } from '../types';
import { NEXORA_ASSETS } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  Gift, 
  Sparkles, 
  Send, 
  Check, 
  Copy, 
  Mail, 
  RefreshCw
} from 'lucide-react';

interface DigitalGiftCardSectionProps {
  currency: 'INR' | 'USD';
}

const PRESET_AMOUNTS = [
  { inr: 5000, usd: 70, label: 'Head Massage & Hair Spa' },
  { inr: 10000, usd: 140, label: 'Designer Haircut & Styling' },
  { inr: 25000, usd: 350, label: 'Full Day Luxury Salon Package' },
  { inr: 50000, usd: 700, label: 'Royal 24K Gold & Spa Package' },
  { inr: 100000, usd: 1400, label: 'Complete Bridal Makeover Package' },
];

const THEMES: { id: GiftVoucher['theme']; name: string; bgGradient: string; borderCol: string; accentCol: string; badgeCol: string }[] = [
  {
    id: 'Royal Gold',
    name: '24K Royal Gold',
    bgGradient: 'from-[#2b1e16] via-[#1f1510] to-[#120d0a]',
    borderCol: 'border-[#d4af37]/60',
    accentCol: 'text-[#ffd980]',
    badgeCol: 'bg-[#d4af37]/20 text-[#ffd980] border-[#d4af37]/40',
  },
  {
    id: 'Mysore Sandalwood',
    name: 'Mysore Sandalwood',
    bgGradient: 'from-[#38261e] via-[#241712] to-[#140b08]',
    borderCol: 'border-[#d29b76]/60',
    accentCol: 'text-[#f5c7a9]',
    badgeCol: 'bg-[#d29b76]/20 text-[#f5c7a9] border-[#d29b76]/40',
  },
  {
    id: 'Kannauj Rose',
    name: 'Kannauj Rose',
    bgGradient: 'from-[#3b1222] via-[#260814] to-[#14020a]',
    borderCol: 'border-[#ff9eb5]/60',
    accentCol: 'text-[#ffd1dc]',
    badgeCol: 'bg-[#8e004b]/40 text-[#ffd1dc] border-[#ff9eb5]/40',
  },
  {
    id: 'Madurai Jasmine',
    name: 'Madurai Jasmine',
    bgGradient: 'from-[#1b2b2b] via-[#101c1c] to-[#081010]',
    borderCol: 'border-[#a3e5d0]/60',
    accentCol: 'text-[#d1fae5]',
    badgeCol: 'bg-emerald-900/40 text-[#a3e5d0] border-[#a3e5d0]/40',
  },
];

export const DigitalGiftCardSection: React.FC<DigitalGiftCardSectionProps> = ({ currency }) => {
  // Amount Selection
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(1);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);
  const [customAmountINR, setCustomAmountINR] = useState<number>(15000);

  // Theme
  const [selectedTheme, setSelectedTheme] = useState<GiftVoucher['theme']>('Royal Gold');

  // Form Details
  const [recipientName, setRecipientName] = useState<string>('Sunita Devi');
  const [recipientEmail, setRecipientEmail] = useState<string>('sunita.devi@example.com');
  const [senderName, setSenderName] = useState<string>('Aarav Singhania');
  const [personalMessage, setPersonalMessage] = useState<string>(
    'Wishing you a wonderful relaxing day of head massage, haircut, and 24K gold facial at Nexora Salon!'
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Dispatched State
  const [isSending, setIsSending] = useState<boolean>(false);
  const [dispatchedVoucher, setDispatchedVoucher] = useState<GiftVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // History of issued vouchers in current session
  const [voucherHistory, setVoucherHistory] = useState<GiftVoucher[]>([
    {
      id: 'vch-init-01',
      voucherCode: 'NX-GOLD-8921-ROYAL',
      amountINR: 25000,
      amountUSD: 350,
      theme: 'Royal Gold',
      recipientName: 'Kavya Mehra',
      recipientEmail: 'kavya.mehra@example.com',
      senderName: 'Aarav Singhania',
      personalMessage: 'Enjoy the Royal Head Massage and Gold Facial at Delhi Salon.',
      deliveryDate: '2026-08-10',
      status: 'Dispatched',
      createdAt: '2026-08-10T10:30:00.000Z',
    },
  ]);

  const currentAmountINR = isCustomAmount ? customAmountINR : PRESET_AMOUNTS[selectedPresetIndex].inr;
  const currentAmountUSD = isCustomAmount 
    ? Math.round(customAmountINR / 72) 
    : PRESET_AMOUNTS[selectedPresetIndex].usd;

  const activeThemeConfig = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];

  const handleSendGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientName) return;

    setIsSending(true);

    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const prefix = selectedTheme.toUpperCase().replace(/\s+/g, '').slice(0, 4);
      const generatedCode = `NX-${prefix}-${randomSuffix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const newVoucher: GiftVoucher = {
        id: 'vch-' + Date.now(),
        voucherCode: generatedCode,
        amountINR: currentAmountINR,
        amountUSD: currentAmountUSD,
        theme: selectedTheme,
        recipientName,
        recipientEmail,
        senderName,
        personalMessage,
        deliveryDate,
        status: 'Dispatched',
        createdAt: new Date().toISOString(),
      };

      setDispatchedVoucher(newVoucher);
      setVoucherHistory((prev) => [newVoucher, ...prev]);
      setIsSending(false);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#ffd700', '#8e004b', '#E6007E'],
        });
      } catch (err) {
        // ignore
      }
    }, 900);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2200);
  };

  const displayAmount = currency === 'INR'
    ? `₹${currentAmountINR.toLocaleString('en-IN')}`
    : `$${currentAmountUSD}`;

  return (
    <div className="mt-20 pt-12 border-t border-[#E8E8E8]" id="gift-cards-section">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#FDE7F3] border border-[#ffcbd9] rounded-full mb-3">
          <Gift className="w-3.5 h-3.5 text-[#8e004b]" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8e004b]">
            Digital Salon Gift Voucher
          </span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1c1b1b] font-medium">
          Gift a Salon Voucher to Your Loved Ones
        </h2>
        <p className="text-sm text-[#594047] mt-2 leading-relaxed">
          Gift an unforgettable pampering day of hair styling, head massage, and glowing facials. Delivered instantly to their email with your personal message and redeemable at any Nexora salon branch across India.
        </p>
      </div>

      {/* Main Gifting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Customization & Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-6">
            <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#8e004b] border-b border-[#E8E8E8] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Select Gift Voucher Amount</span>
              </span>
              <span className="text-[10px] text-[#594047] font-normal lowercase">valid on all salon services & products</span>
            </h3>

            {/* Preset Amount Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_AMOUNTS.map((preset, idx) => {
                const isSelected = !isCustomAmount && selectedPresetIndex === idx;
                const formattedPrice = currency === 'INR'
                  ? `₹${preset.inr.toLocaleString('en-IN')}`
                  : `$${preset.usd}`;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsCustomAmount(false);
                      setSelectedPresetIndex(idx);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#8e004b] bg-[#FDE7F3]/40 shadow-xs ring-1 ring-[#8e004b]'
                        : 'border-[#E8E8E8] bg-[#F0EDEC] hover:bg-[#ece7e7]'
                    }`}
                  >
                    <span className="font-serif-display text-lg font-bold text-[#1c1b1b]">
                      {formattedPrice}
                    </span>
                    <span className="text-[10px] text-[#594047] line-clamp-1 mt-1">
                      {preset.label}
                    </span>
                  </button>
                );
              })}

              {/* Custom Value Button */}
              <button
                type="button"
                onClick={() => setIsCustomAmount(true)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCustomAmount
                    ? 'border-[#8e004b] bg-[#FDE7F3]/40 shadow-xs ring-1 ring-[#8e004b]'
                    : 'border-[#E8E8E8] bg-[#F0EDEC] hover:bg-[#ece7e7]'
                }`}
              >
                <span className="font-serif-display text-base font-bold text-[#1c1b1b]">
                  Custom Amount
                </span>
                <span className="text-[10px] text-[#8e004b] mt-1 font-semibold">
                  Enter your own amount
                </span>
              </button>
            </div>

            {/* Custom Amount Input */}
            {isCustomAmount && (
              <div className="p-4 bg-[#fdf8f8] border border-[#ffcbd9] rounded-xl space-y-2 animate-fade-in">
                <label className="text-[11px] uppercase font-semibold text-[#8e004b] block">
                  Enter Voucher Amount ({currency === 'INR' ? 'INR ₹' : 'USD $'})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={customAmountINR}
                    onChange={(e) => setCustomAmountINR(Math.max(1000, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-[#E8E8E8] rounded-lg text-sm font-bold text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                  />
                  <span className="text-xs text-[#594047] whitespace-nowrap">
                    ≈ {currency === 'INR' ? `$${Math.round(customAmountINR / 72)} USD` : `₹${(customAmountINR * 72).toLocaleString('en-IN')} INR`}
                  </span>
                </div>
              </div>
            )}

            {/* Theme Selector */}
            <div className="pt-2">
              <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-2">
                Choose Card Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#8e004b] bg-white shadow-xs ring-2 ring-[#8e004b]'
                          : 'border-[#E8E8E8] bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#594047]'
                      }`}
                    >
                      <span className="truncate">{theme.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8e004b] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form: Recipient Details */}
          <form onSubmit={handleSendGiftCard} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-4">
            <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#8e004b] border-b border-[#E8E8E8] pb-3 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>2. Recipient & Delivery Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Recipient Name (Whom to Gift?) *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Recipient Email ID *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@gmail.com"
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Your Name (Sender)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. With Love, Aarav"
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b] focus:outline-none focus:border-[#8e004b]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                Personal Message / Greetings
              </label>
              <textarea
                rows={3}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Write your birthday wishes, blessings, or loving message..."
                className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs text-[#1c1b1b] placeholder-[#594047] focus:outline-none focus:border-[#8e004b]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Digital Gift Card...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Gift Card Now ({displayAmount})</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right Column: Live Card Preview & History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Card Preview Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-[#8e004b] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Voucher Preview</span>
            </span>
            <span className="text-[10px] text-[#594047] uppercase tracking-wider font-semibold">
              Instant Email Pass
            </span>
          </div>

          {/* Digital Card Element */}
          <div className={`rounded-2xl p-6 bg-gradient-to-br ${activeThemeConfig.bgGradient} border-2 ${activeThemeConfig.borderCol} shadow-xl text-white relative overflow-hidden transition-all duration-500 min-h-[360px] flex flex-col justify-between`}>
            
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-xl" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none blur-lg" />
            
            {/* Card Top Row */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center">
                  <img src={NEXORA_ASSETS.logo} alt="Nexora" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-serif-display text-base tracking-[0.14em] font-bold text-white block">
                    NEXORA
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/60 block">
                    Salon जा रहे हो? NEXORA किया क्या?
                  </span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-widest border ${activeThemeConfig.badgeCol}`}>
                {activeThemeConfig.name}
              </div>
            </div>

            {/* Card Middle: Amount & Recipient */}
            <div className="py-5 space-y-3 relative z-10">
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/60 block">
                  Gift Voucher Value
                </span>
                <div className={`font-serif-display text-3xl sm:text-4xl font-bold ${activeThemeConfig.accentCol}`}>
                  {displayAmount}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-white/80">
                  Gifted to: <strong className="text-white font-serif-display text-sm tracking-wide">{recipientName || 'Dear Guest'}</strong>
                </div>
                {personalMessage && (
                  <p className="text-[11px] text-white/70 italic line-clamp-3 leading-relaxed border-l border-white/20 pl-2">
                    "{personalMessage}"
                  </p>
                )}
              </div>
            </div>

            {/* Card Bottom Row: Code & Sender */}
            <div className="border-t border-white/10 pt-3 flex items-center justify-between relative z-10">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-white/50 block">Redemption Code</span>
                <span className="font-mono text-xs font-bold tracking-wider text-white">
                  {dispatchedVoucher ? dispatchedVoucher.voucherCode : `NX-${activeThemeConfig.id.toUpperCase().slice(0, 4)}-8924-XXXX`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase tracking-widest text-white/50 block">From</span>
                <span className="text-xs font-semibold text-white/90">{senderName || 'Anonymous Well-Wisher'}</span>
              </div>
            </div>

          </div>

          {/* Confirmation Notice upon Sending */}
          {dispatchedVoucher && (
            <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Gift Card Sent Successfully!</span>
              </div>
              <p className="text-xs text-[#594047]">
                A digital voucher with voucher code has been emailed to <strong className="text-[#1c1b1b]">{dispatchedVoucher.recipientEmail}</strong>.
              </p>
              
              <div className="p-3 bg-[#F0EDEC] rounded-xl flex items-center justify-between border border-[#E8E8E8]">
                <div className="min-w-0">
                  <span className="text-[9px] uppercase tracking-wider text-[#594047] block">Voucher Code</span>
                  <span className="font-mono text-xs font-bold text-[#8e004b] truncate block">
                    {dispatchedVoucher.voucherCode}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(dispatchedVoucher.voucherCode)}
                  className="px-3 py-1.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-[10px] uppercase font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 ml-2"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* History of Issued Vouchers */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] flex items-center justify-between">
              <span>Recently Issued Vouchers ({voucherHistory.length})</span>
              <span className="text-[10px] text-[#594047] font-normal">Active & Ready to Use</span>
            </h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {voucherHistory.map((item) => (
                <div key={item.id} className="p-3 bg-[#F0EDEC] rounded-xl border border-[#E8E8E8] text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#1c1b1b]">{item.recipientName}</div>
                    <div className="font-mono text-[10px] text-[#8e004b]">{item.voucherCode}</div>
                    <div className="text-[9px] text-[#594047]">{item.recipientEmail}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif-display font-bold text-sm text-[#8e004b] block">
                      {currency === 'INR' ? `₹${item.amountINR.toLocaleString('en-IN')}` : `$${item.amountUSD}`}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
