import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NEXORA_ASSETS, SANCTUARIES, TREATMENTS, ARTISANS, PRODUCTS } from '../data/mockData';
import { SanctuaryLocation, User, Treatment, Artisan, Product } from '../types';
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
  Crown,
  Search,
  Star,
  Scissors,
  Flower2,
  ArrowRight,
  Plus,
  Check
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
  onSelectTreatmentForBooking?: (treatment: Treatment) => void;
  onSelectArtisanForBooking?: (artisan: Artisan) => void;
  onAddToCart?: (product: Product) => void;
}

const POPULAR_SEARCH_TERMS = [
  'Shirodhara',
  '24K Gold Facial',
  'Meera Singhania',
  'Jasmine Hair Oil',
  'Keratin Spa',
  'Balayage Highlights',
  'Bridal Makeover',
  'Dr. Rajeshwar'
];

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
  onSelectTreatmentForBooking,
  onSelectArtisanForBooking,
  onAddToCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<'all' | 'treatments' | 'artisans' | 'products'>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K / slash)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        desktopInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  // Compute Search Matches
  const { matchedTreatments, matchedArtisans, matchedProducts, totalMatches } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return {
        matchedTreatments: [],
        matchedArtisans: [],
        matchedProducts: [],
        totalMatches: 0,
      };
    }

    const treatments = TREATMENTS.filter((t) => 
      t.title.toLowerCase().includes(q) ||
      (t.sanskritName && t.sanskritName.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.extendedDescription.toLowerCase().includes(q) ||
      t.benefits.some((b) => b.toLowerCase().includes(q)) ||
      t.keyBotanicals.some((k) => k.toLowerCase().includes(q))
    );

    const artisans = ARTISANS.filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.signatureRitual.toLowerCase().includes(q) ||
      a.bio.toLowerCase().includes(q) ||
      a.specialties.some((s) => s.toLowerCase().includes(q))
    );

    const products = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.sanskritName.toLowerCase().includes(q) ||
      p.subTitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.botanicals.some((b) => b.toLowerCase().includes(q))
    );

    return {
      matchedTreatments: treatments,
      matchedArtisans: artisans,
      matchedProducts: products,
      totalMatches: treatments.length + artisans.length + products.length,
    };
  }, [searchQuery]);

  const handleSelectTreatment = (treatment: Treatment) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    if (onSelectTreatmentForBooking) {
      onSelectTreatmentForBooking(treatment);
    } else {
      setActiveTab('treatments');
      onOpenBooking();
    }
  };

  const handleSelectArtisan = (artisan: Artisan) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    if (onSelectArtisanForBooking) {
      onSelectArtisanForBooking(artisan);
    } else {
      setActiveTab('artisans');
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSearchOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
    setActiveTab('boutique');
  };

  const handleAddProductFromSearch = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1800);
    }
  };

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
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Brand Cluster */}
          <div className="flex items-center space-x-3 cursor-pointer flex-shrink-0" onClick={() => setActiveTab('treatments')}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border border-[#E8E8E8] p-1.5 shadow-sm flex items-center justify-center flex-shrink-0">
              <img 
                src={NEXORA_ASSETS.logo} 
                alt="Nexora Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-serif-display text-xl sm:text-2xl tracking-[0.08em] font-bold text-[#8e004b] leading-tight">
                NEXORA
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-[#594047] font-semibold">
                Salon जा रहे हो? NEXORA किया क्या?
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('treatments')}
              className={`px-3 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'treatments'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Services & Menu
            </button>

            <button
              onClick={() => setActiveTab('artisans')}
              className={`px-3 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'artisans'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Expert Stylists
            </button>

            <button
              onClick={() => setActiveTab('boutique')}
              className={`px-3 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'boutique'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              Beauty Store & Deals
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-3 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'advisor'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
              <span>AI Doctor</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 text-xs uppercase tracking-[0.14em] font-semibold transition-all rounded-md cursor-pointer ${
                activeTab === 'bookings'
                  ? 'text-[#8e004b] bg-[#FDE7F3]'
                  : 'text-[#1c1b1b] hover:text-[#8e004b] hover:bg-[#F0EDEC]'
              }`}
            >
              My Bookings
            </button>
          </nav>

          {/* Global Search Bar (Desktop / Tablet) */}
          <div ref={desktopSearchRef} className="hidden md:block relative flex-1 max-w-xs lg:max-w-sm">
            <div className={`relative flex items-center rounded-xl border transition-all ${
              searchOpen 
                ? 'bg-white border-[#8e004b] ring-2 ring-[#8e004b]/15 shadow-md' 
                : 'bg-[#F0EDEC] hover:bg-[#ece7e7] border-[#E8E8E8]'
            }`}>
              <Search className={`w-4 h-4 ml-3 transition-colors ${searchOpen ? 'text-[#8e004b]' : 'text-[#594047]'}`} />
              <input
                ref={desktopInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!searchOpen) setSearchOpen(true);
                }}
                placeholder="Search treatments, stylists, products..."
                className="w-full py-2 pl-2.5 pr-14 text-xs font-medium text-[#1c1b1b] placeholder-[#594047] bg-transparent focus:outline-hidden"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    desktopInputRef.current?.focus();
                  }}
                  className="p-1 mr-1.5 text-[#594047] hover:text-[#1c1b1b] rounded-full hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className="hidden lg:inline-flex items-center gap-0.5 mr-2.5 px-1.5 py-0.5 text-[9px] font-mono text-[#594047] bg-white border border-[#E8E8E8] rounded shadow-2xs select-none">
                  ⌘K
                </kbd>
              )}
            </div>

            {/* Desktop Search Dropdown Results Popover */}
            {searchOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#ffcbd9] overflow-hidden z-50 animate-fade-in max-h-[75vh] flex flex-col">
                
                {/* Search Header / Category Filter Tabs */}
                <div className="p-3 bg-[#fdf8f8] border-b border-[#E8E8E8] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1 overflow-x-auto text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('all')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        searchCategoryFilter === 'all'
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'text-[#594047] hover:text-[#1c1b1b] hover:bg-white'
                      }`}
                    >
                      All ({totalMatches})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('treatments')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        searchCategoryFilter === 'treatments'
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'text-[#594047] hover:text-[#1c1b1b] hover:bg-white'
                      }`}
                    >
                      Treatments ({matchedTreatments.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('artisans')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        searchCategoryFilter === 'artisans'
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'text-[#594047] hover:text-[#1c1b1b] hover:bg-white'
                      }`}
                    >
                      Stylists ({matchedArtisans.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchCategoryFilter('products')}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        searchCategoryFilter === 'products'
                          ? 'bg-[#8e004b] text-white shadow-xs'
                          : 'text-[#594047] hover:text-[#1c1b1b] hover:bg-white'
                      }`}
                    >
                      Products ({matchedProducts.length})
                    </button>
                  </div>

                  <button
                    onClick={() => setSearchOpen(false)}
                    className="p-1 text-[#594047] hover:text-[#1c1b1b] rounded-full hover:bg-black/5 cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown Content Area */}
                <div className="overflow-y-auto p-3 space-y-4 divide-y divide-[#E8E8E8]/70">
                  
                  {/* Empty Query: Suggested terms */}
                  {!searchQuery.trim() && (
                    <div className="py-2 space-y-3">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[#8e004b]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Popular Searches across Nexora:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_SEARCH_TERMS.map((term, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              desktopInputRef.current?.focus();
                            }}
                            className="px-2.5 py-1 text-xs bg-[#F0EDEC] hover:bg-[#FDE7F3] hover:text-[#8e004b] text-[#1c1b1b] rounded-lg border border-[#E8E8E8] transition-colors cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Matches Found */}
                  {searchQuery.trim() && totalMatches === 0 && (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-[#FDE7F3] text-[#8e004b] mx-auto flex items-center justify-center">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-[#1c1b1b]">
                        No matches found for "{searchQuery}"
                      </p>
                      <p className="text-xs text-[#594047]">
                        Try searching for haircut, facial, head massage, hair oil, or stylist name.
                      </p>
                    </div>
                  )}

                  {/* Section 1: Treatments */}
                  {(searchCategoryFilter === 'all' || searchCategoryFilter === 'treatments') && matchedTreatments.length > 0 && (
                    <div className="pt-2 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#8e004b]">
                        <span className="flex items-center gap-1">
                          <Flower2 className="w-3 h-3" />
                          <span>Salon Treatments & Rituals ({matchedTreatments.length})</span>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {matchedTreatments.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleSelectTreatment(t)}
                            className="p-2 hover:bg-[#FDE7F3]/40 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer group border border-transparent hover:border-[#ffcbd9]"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img
                                src={t.image}
                                alt={t.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#E8E8E8]"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#1c1b1b] group-hover:text-[#8e004b] truncate">
                                  {t.title}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-[#594047]">
                                  <span>{t.durationMinutes} mins</span>
                                  <span>•</span>
                                  <span className="font-semibold text-[#8e004b]">₹{t.priceINR.toLocaleString('en-IN')}</span>
                                  <span>•</span>
                                  <span className="truncate">{t.category}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTreatment(t);
                              }}
                              className="px-2.5 py-1 bg-[#8e004b] hover:bg-[#b90064] text-white text-[10px] uppercase font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Book</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 2: Artisans & Stylists */}
                  {(searchCategoryFilter === 'all' || searchCategoryFilter === 'artisans') && matchedArtisans.length > 0 && (
                    <div className="pt-2 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#8e004b]">
                        <span className="flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          <span>Expert Stylists & Specialists ({matchedArtisans.length})</span>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {matchedArtisans.map((a) => (
                          <div
                            key={a.id}
                            onClick={() => handleSelectArtisan(a)}
                            className="p-2 hover:bg-[#FDE7F3]/40 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer group border border-transparent hover:border-[#ffcbd9]"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img
                                src={a.avatar}
                                alt={a.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-[#8e004b]/30"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-[#1c1b1b] group-hover:text-[#8e004b] truncate">
                                    {a.name}
                                  </h4>
                                  <span className="flex items-center text-[10px] text-amber-600 font-bold">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500 mr-0.5" />
                                    {a.rating}
                                  </span>
                                </div>
                                <p className="text-[10px] text-[#594047] truncate">
                                  {a.role} • {a.specialties.slice(0, 2).join(', ')}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectArtisan(a);
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-[#FDE7F3] border border-[#ffcbd9] text-[#8e004b] text-[10px] uppercase font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                            >
                              <span>View Stylist</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 3: Boutique Products */}
                  {(searchCategoryFilter === 'all' || searchCategoryFilter === 'products') && matchedProducts.length > 0 && (
                    <div className="pt-2 first:pt-0 space-y-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#8e004b]">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          <span>Boutique Beauty Products ({matchedProducts.length})</span>
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {matchedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleSelectProduct(p)}
                            className="p-2 hover:bg-[#FDE7F3]/40 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer group border border-transparent hover:border-[#ffcbd9]"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#E8E8E8]"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#1c1b1b] group-hover:text-[#8e004b] truncate">
                                  {p.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-[#594047]">
                                  <span>{p.volume}</span>
                                  <span>•</span>
                                  <span className="font-semibold text-[#8e004b]">₹{p.priceINR.toLocaleString('en-IN')}</span>
                                  <span>•</span>
                                  <span className="truncate">{p.category}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleAddProductFromSearch(e, p)}
                              className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                                addedProductId === p.id
                                  ? 'bg-green-600 text-white'
                                  : 'bg-[#8e004b] hover:bg-[#b90064] text-white'
                              }`}
                            >
                              {addedProductId === p.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Added!</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" />
                                  <span>Add to Bag</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Popover Footer */}
                <div className="p-2.5 bg-[#fdf8f8] border-t border-[#E8E8E8] text-[10px] text-[#594047] flex items-center justify-between">
                  <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-[#E8E8E8]">ESC</kbd> to exit</span>
                  <span className="text-[#8e004b] font-medium">Instant real-time catalog search</span>
                </div>

              </div>
            )}
          </div>

          {/* Right Action Tools: Sanctuary Picker, Cart, Auth, Booking Button */}
          <div className="hidden sm:flex items-center space-x-2.5 flex-shrink-0">
            
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
              className="px-3.5 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-md transition-all shadow-sm hover:shadow-md flex items-center space-x-1.5 cursor-pointer flex-shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile Menu & Search Controls */}
          <div className="flex items-center space-x-1 lg:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-[#1c1b1b] hover:text-[#8e004b]"
              title="Search"
            >
              <Search className="w-5 h-5 text-[#8e004b]" />
            </button>

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

      {/* Mobile Search Overlay Drawer */}
      {mobileSearchOpen && (
        <div className="lg:hidden bg-white border-b border-[#ffcbd9] p-4 shadow-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#8e004b]" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments, stylists, products..."
                className="w-full py-2.5 pl-9 pr-9 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-xs font-medium text-[#1c1b1b] focus:outline-hidden focus:border-[#8e004b]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-[#594047] hover:text-[#1c1b1b]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-[#594047] hover:text-[#1c1b1b]"
            >
              Cancel
            </button>
          </div>

          {/* Quick suggestions when query is empty on mobile */}
          {!searchQuery.trim() && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e004b] block">
                Popular Searches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_TERMS.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(term)}
                    className="px-2.5 py-1 text-xs bg-[#F0EDEC] rounded-lg border border-[#E8E8E8] text-[#1c1b1b]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Search Matches List */}
          {searchQuery.trim() && (
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pt-2">
              {totalMatches === 0 ? (
                <p className="text-xs text-[#594047] text-center py-4">
                  No treatments, stylists, or products found for "{searchQuery}".
                </p>
              ) : (
                <>
                  {/* Treatments */}
                  {matchedTreatments.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8e004b] block">
                        Treatments ({matchedTreatments.length})
                      </span>
                      {matchedTreatments.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTreatment(t)}
                          className="p-2 bg-[#fdf8f8] rounded-xl flex items-center justify-between border border-[#E8E8E8]"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="text-xs font-bold text-[#1c1b1b] truncate">{t.title}</h4>
                            <p className="text-[10px] text-[#594047]">
                              {t.durationMinutes} mins • ₹{t.priceINR.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTreatment(t);
                            }}
                            className="px-2.5 py-1 bg-[#8e004b] text-white text-[10px] font-bold rounded-md"
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Artisans */}
                  {matchedArtisans.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8e004b] block">
                        Stylists ({matchedArtisans.length})
                      </span>
                      {matchedArtisans.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => handleSelectArtisan(a)}
                          className="p-2 bg-[#fdf8f8] rounded-xl flex items-center justify-between border border-[#E8E8E8]"
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#1c1b1b] truncate">{a.name}</h4>
                              <p className="text-[10px] text-[#594047] truncate">{a.role}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#8e004b] font-bold flex items-center">
                            ★ {a.rating}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {matchedProducts.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8e004b] block">
                        Products ({matchedProducts.length})
                      </span>
                      {matchedProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className="p-2 bg-[#fdf8f8] rounded-xl flex items-center justify-between border border-[#E8E8E8]"
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#1c1b1b] truncate">{p.name}</h4>
                              <p className="text-[10px] text-[#594047]">₹{p.priceINR.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleAddProductFromSearch(e, p)}
                            className="px-2 py-1 bg-[#8e004b] text-white text-[10px] font-bold rounded-md"
                          >
                            + Bag
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fdf8f8] border-b border-[#E8E8E8] px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          
          {/* Mobile Drawer Quick Search Input */}
          <div className="pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(true);
              }}
              className="w-full py-2.5 px-3 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-xs text-[#594047] flex items-center justify-between"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3.5 h-3.5 text-[#8e004b]" />
                <span>Search treatments, stylists, products...</span>
              </div>
              <span className="text-[9px] uppercase font-bold text-[#8e004b] bg-white px-1.5 py-0.5 rounded">Search</span>
            </button>
          </div>

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
