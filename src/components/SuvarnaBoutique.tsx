import React, { useState } from 'react';
import { PRODUCTS, NEXORA_ASSETS } from '../data/mockData';
import { Product } from '../types';
import { 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Check, 
  Info, 
  X, 
  ShieldCheck, 
  Leaf,
  Gift
} from 'lucide-react';
import { DigitalGiftCardSection } from './DigitalGiftCardSection';

interface SuvarnaBoutiqueProps {
  onAddToCart: (product: Product, quantity?: number) => void;
  currency: 'INR' | 'USD';
}

export const SuvarnaBoutique: React.FC<SuvarnaBoutiqueProps> = ({
  onAddToCart,
  currency,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [addedNoticeId, setAddedNoticeId] = useState<string | null>(null);

  const categories = [
    'All',
    'Hair Oils & Serums',
    'Face Creams & Glow Packs',
    'Aroma & Scented Candles',
    'Silk Bags & Accessories',
    'Digital Gift Cards'
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    return activeCategory === 'All' || p.category === activeCategory;
  });

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'Digital Gift Cards') {
      const el = document.getElementById('gift-cards-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdd = (product: Product, qty: number = 1) => {
    onAddToCart(product, qty);
    setAddedNoticeId(product.id);
    setTimeout(() => setAddedNoticeId(null), 2000);
  };

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="boutique-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-12 border border-[#E8E8E8] bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#8e004b] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nexora Beauty Store</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#1c1b1b] font-medium leading-tight">
                100% Genuine Ayurvedic Beauty Products
              </h2>
              <p className="text-sm sm:text-base text-[#594047] leading-relaxed max-w-xl">
                Pure natural formulas made with fresh Madurai Jasmine, 24K real gold leaf, and cold-pressed herbal oils. Safe for everyday use, tested on Indian hair and skin, and delivered safely to your home.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b]">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-[#8e004b]" />
                  100% Natural Herbs
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#8e004b]" />
                  Dermatologist Approved
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('gift-cards-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-[#8e004b] hover:text-[#b90064] underline underline-offset-4 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Send Salon Gift Voucher ↓</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 h-64 lg:h-auto relative overflow-hidden bg-stone-100">
              <img 
                src={NEXORA_ASSETS.heroPlinth}
                alt="Suvarna Collection Beauty Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.14em] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-[#8e004b] text-white shadow-sm'
                  : 'bg-[#F0EDEC] text-[#594047] hover:text-[#1c1b1b] hover:bg-[#ece7e7] border border-[#E8E8E8]'
              }`}
            >
              {cat === 'Digital Gift Cards' && <Gift className="w-3.5 h-3.5" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const displayPrice = currency === 'INR'
              ? `₹${product.priceINR.toLocaleString('en-IN')}`
              : `$${product.priceUSD}`;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-stone-50 p-6 flex items-center justify-center">
                    <img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {product.isBestseller && (
                      <span className="absolute top-3 left-3 bg-[#8e004b] text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                        Top Seller
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-xs text-[#1c1b1b] hover:text-[#8e004b] rounded-full shadow-md transition-all cursor-pointer"
                      title="View Details & How to Use"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e004b]">
                        {product.category}
                      </span>
                      <div className="flex items-center text-xs text-[#1c1b1b] font-semibold gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-[10px] text-[#594047] font-normal">({product.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <div>
                      {product.sanskritName && (
                        <div className="font-serif-display text-xs text-[#8e004b] font-semibold">
                          {product.sanskritName}
                        </div>
                      )}
                      <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b] group-hover:text-[#8e004b] transition-colors leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#594047] mt-1 line-clamp-2">
                        {product.subTitle}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#594047] font-medium">
                      Net Quantity: {product.volume}
                    </div>

                    <div className="pt-2 border-t border-[#E8E8E8] flex items-center justify-between">
                      <span className="font-serif-display text-2xl font-bold text-[#8e004b]">
                        {displayPrice}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#594047]">
                        All Taxes Included (GST)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleAdd(product, 1)}
                    className={`w-full py-3 rounded-lg text-xs uppercase tracking-[0.16em] font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      addedNoticeId === product.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#8e004b] hover:bg-[#b90064] text-white shadow-xs hover:shadow-md'
                    }`}
                  >
                    {addedNoticeId === product.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital Gift Cards Section */}
        <DigitalGiftCardSection currency={currency} />

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E8E8E8] my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1c1b1b] flex items-center justify-center shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-[#E8E8E8] pb-6">
                <div className="w-36 h-36 bg-stone-50 rounded-xl p-3 flex items-center justify-center border border-[#E8E8E8] flex-shrink-0">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8e004b]">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-serif-display text-2xl font-bold text-[#1c1b1b]">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-[#594047]">
                    {selectedProduct.subTitle}
                  </p>
                  <div className="text-xl font-serif-display font-bold text-[#8e004b]">
                    {currency === 'INR' ? `₹${selectedProduct.priceINR.toLocaleString('en-IN')}` : `$${selectedProduct.priceUSD}`}
                    <span className="text-xs font-normal text-[#594047] ml-2">({selectedProduct.volume})</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2">
                  Product Description
                </h4>
                <p className="text-sm text-[#594047] leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Botanicals */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2">
                  Key Natural Ingredients
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.botanicals.map((b, idx) => (
                    <span key={idx} className="px-3 py-1 bg-[#FDE7F3] text-[#8e004b] rounded-full text-xs font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* How to use */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2">
                  How to Use
                </h4>
                <p className="text-xs sm:text-sm text-[#1c1b1b] bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8]">
                  {selectedProduct.howToUse}
                </p>
              </div>

              {/* Authenticity Guarantee */}
              <div className="flex items-center gap-3 p-3 bg-[#FDE7F3]/40 border border-[#ffcbd9] rounded-xl text-xs text-[#8e004b]">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>100% Original Authentic Product. Free Express Delivery all across India.</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    handleAdd(selectedProduct, 1);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm"
                >
                  Add to Cart ({currency === 'INR' ? `₹${selectedProduct.priceINR.toLocaleString('en-IN')}` : `$${selectedProduct.priceUSD}`})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
