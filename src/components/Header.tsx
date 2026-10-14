import React, { useState } from 'react';
import { NEXORA_ASSETS, SANCTUARIES } from '../data/mockData';
import { SanctuaryLocation, User } from '../types';
import { 
  MapPin, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  Menu, 
  X, 
  Play, 
  ChevronDown, 
  Phone,
  User as UserIcon,
  Crown
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'treatments' | 'artisans' | 'boutique' | 'advisor' | 'bookings';
  setActiveTab: (tab: 'treatments' | 'artisans' | 'boutique' | 'advisor' | 'bookings') => void;
  selectedSanctuary: SanctuaryLocation;
  setSelectedSanctuary: (sanctuary: SanctuaryLocation) => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenBooking: () => void;
  onReplaySplash: () => void;
  currentUser: User | null;
  loyaltyPoints?: number;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  onOpenAndroidInspector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedSanctuary,
  setSelectedSanctuary,
  currency,
  setCurrency,
  cartCount,
  onOpenCart,
  onOpenBooking,
  onReplaySplash,
  currentUser,
  loyaltyPoints,
  onOpenAuth,
  onOpenAndroidInspector,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdf8f8]/95 backdrop-blur-md border-b border-[#E8E8E8] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#8e004b] text-white text-[11px] uppercase tracking-[0.2em] py-1.5 px-4 text-center flex items-center justify-between font-medium">
        <div className="hidden md:flex items-center space-x-2">
          <Sparkles className="w-3 h-3 text-[#ffcbd9]" />
          <span>Free Ayurvedic Hair Oil with every Head Massage & Facial booking</span>
        </div>
        <div className="mx-auto md:mx-0 flex items-center space-x-4">
          {onOpenAndroidInspector && (
            <button
              onClick={onOpenAndroidInspector}
              className="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-[10px] tracking-wider font-bold text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Android App (Compose)</span>
            </button>
          )}
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Salon Helpline: {selectedSanctuary.phone}
          </span>
          <button
            onClick={onReplaySplash}
            className="text-[10px] uppercase tracking-widest text-[#ffcbd9] hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
            title="Watch intro video"
          >
            <Play className="w-2.5 h-2.5" />
            <span>Watch Intro</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Cluster */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('treatments')}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-[#E8E8E8] p-1.5 shadow-sm flex items-center justify-center flex-shrink-0">
              <img 
                src={NEXORA_ASSETS.logo} 
                alt="Nexora Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-serif-display text-2xl tracking-[0.08em] font-bold text-[#8e004b] leading-tight">
                NEXORA
              </span>
              <span className="block text-[9px] uppercase tracking-[0.22em] text-[#594047] font-semibold">
                Salon जा रहे हो? NEXORA किया क्या?
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('treatments')}
              className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'treatments'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Services & Menu
            </button>

            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'artisans'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Expert Stylists
            </button>

            <button
              onClick={() => setActiveTab('boutique')}
              className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'boutique'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Beauty Store & Deals
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'advisor'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
              <span>Hair & Skin Doctor (AI)</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'bookings'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              My Bookings
            </button>
          </nav>

          {/* Right Action Tools: Sanctuary Picker, Currency, Cart, Booking Button */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Sanctuary Location Selector */}
            <div className="relative">
              <button
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] rounded-md transition-colors border border-[#E8E8E8] cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#8e004b]" />
                <span className="font-medium">{selectedSanctuary.city}</span>
                <ChevronDown className="w-3 h-3 text-[#594047]" />
              </button>

              {locationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-[#E8E8E8] py-2 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#594047] border-b border-[#E8E8E8]">
                    Choose Salon Branch
                  </div>
                  {SANCTUARIES.map((sanctuary) => (
                    <button
                      key={sanctuary.id}
                      onClick={() => {
                        setSelectedSanctuary(sanctuary);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-xs hover:bg-[#FDE7F3] transition-colors flex flex-col cursor-pointer ${
                        selectedSanctuary.id === sanctuary.id ? 'bg-[#FDE7F3]/50 text-[#8e004b] font-semibold' : 'text-[#1c1b1b]'
                      }`}
                    >
                      <span className="font-medium text-sm">{sanctuary.name}</span>
                      <span className="text-[11px] text-[#594047]">{sanctuary.neighborhood}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Bag Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC] rounded-md transition-colors cursor-pointer"
              title="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8e004b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            <button
              onClick={() => onOpenAuth('login')}
              className={`p-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold ${
                currentUser
                  ? 'bg-[#FDE7F3] text-[#8e004b] border border-[#ffcbd9] shadow-xs'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
              title={currentUser ? `Logged in as ${currentUser.name} • ${loyaltyPoints || 0} Loyalty Points` : 'Login / Member Sign In'}
            >
              <div className="w-5 h-5 rounded-full bg-[#8e004b]/10 text-[#8e004b] flex items-center justify-center">
                {currentUser ? <Crown className="w-3.5 h-3.5 text-[#8e004b]" /> : <UserIcon className="w-3.5 h-3.5 text-[#8e004b]" />}
              </div>
              <span className="hidden md:inline max-w-[90px] truncate font-bold">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
              {currentUser && loyaltyPoints !== undefined && (
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#8e004b] text-white">
                  {loyaltyPoints} PTS
                </span>
              )}
            </button>

            {/* Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-md transition-all shadow-sm hover:shadow-md flex items-center space-x-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            <button
              onClick={() => onOpenAuth('login')}
              className="p-2 text-[#1c1b1b] hover:text-[#8e004b]"
              title="Sign In / Register"
            >
              <UserIcon className="w-5 h-5 text-[#8e004b]" />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#1c1b1b] hover:text-[#8e004b]"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8e004b] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1c1b1b] hover:text-[#8e004b]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fdf8f8] border-b border-[#E8E8E8] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E8E8E8]">
            {/* Mobile Salon Selector */}
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-semibold text-[#594047] block mb-1">Select Salon Branch</label>
              <select
                value={selectedSanctuary.id}
                onChange={(e) => {
                  const s = SANCTUARIES.find((item) => item.id === e.target.value);
                  if (s) setSelectedSanctuary(s);
                }}
                className="w-full text-xs p-2 bg-[#F0EDEC] rounded-md border border-[#E8E8E8] text-[#1c1b1b] font-medium"
              >
                {SANCTUARIES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.city} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => { setActiveTab('treatments'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold ${
                activeTab === 'treatments' ? 'bg-[#FDE7F3] text-[#8e004b]' : 'text-[#1c1b1b]'
              }`}
            >
              Services & Menu
            </button>
            <button
              onClick={() => { setActiveTab('artisans'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold ${
                activeTab === 'artisans' ? 'bg-[#FDE7F3] text-[#8e004b]' : 'text-[#1c1b1b]'
              }`}
            >
              Expert Stylists
            </button>
            <button
              onClick={() => { setActiveTab('boutique'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold ${
                activeTab === 'boutique' ? 'bg-[#FDE7F3] text-[#8e004b]' : 'text-[#1c1b1b]'
              }`}
            >
              Beauty Store & Deals
            </button>
            <button
              onClick={() => { setActiveTab('advisor'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold flex items-center gap-2 ${
                activeTab === 'advisor' ? 'bg-[#FDE7F3] text-[#8e004b]' : 'text-[#1c1b1b]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
              <span>Hair & Skin Doctor (AI)</span>
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold ${
                activeTab === 'bookings' ? 'bg-[#FDE7F3] text-[#8e004b]' : 'text-[#1c1b1b]'
              }`}
            >
              My Bookings
            </button>
          </div>

          <button
            onClick={() => { onOpenBooking(); setMobileMenuOpen(false); }}
            className="w-full py-3 bg-[#8e004b] text-white text-xs uppercase tracking-widest font-semibold rounded-md shadow-md text-center"
          >
            Book Salon Appointment
          </button>
        </div>
      )}
    </header>
  );
};
