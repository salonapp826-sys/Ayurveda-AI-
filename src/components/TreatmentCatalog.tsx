import React, { useState } from 'react';
import { TREATMENTS } from '../data/mockData';
import { Treatment, TreatmentCategory } from '../types';
import { TreatmentDetailModal } from './TreatmentDetailModal';
import { 
  Clock, 
  Sparkles, 
  Search, 
  Calendar
} from 'lucide-react';

interface TreatmentCatalogProps {
  onBookTreatment: (treatment: Treatment) => void;
  currency: 'INR' | 'USD';
}

const CATEGORIES: TreatmentCategory[] = [
  'All',
  'Hair Styling & Cuts',
  'Ayurvedic Head Massage',
  'Gold & Glow Facials',
  'Hair Colour & Highlights',
  'Bridal Makeup & Styling'
];

export const TreatmentCatalog: React.FC<TreatmentCatalogProps> = ({
  onBookTreatment,
  currency,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TreatmentCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTreatment, setDetailTreatment] = useState<Treatment | null>(null);

  const filteredTreatments = TREATMENTS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyBotanicals.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="treatments-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E8E8E8] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#8e004b] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Salon Services & Rate Card</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1c1b1b] font-medium">
              Hair Styling & Ayurvedic Treatments
            </h2>
            <p className="text-sm text-[#594047] mt-1 max-w-xl">
              Every service is performed by expert stylists and Ayurvedic doctors using pure herbal oils in private AC rooms.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#594047]" />
            <input
              type="text"
              placeholder="Search haircut, facial, hair spa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs text-[#1c1b1b] placeholder-[#594047] focus:outline-none focus:border-[#8e004b] transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.14em] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8e004b] text-white shadow-sm'
                  : 'bg-[#F0EDEC] text-[#594047] hover:text-[#1c1b1b] hover:bg-[#ece7e7] border border-[#E8E8E8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Treatment Cards Grid */}
        {filteredTreatments.length === 0 ? (
          <div className="text-center py-16 bg-[#F0EDEC] rounded-2xl border border-[#E8E8E8]">
            <p className="text-base text-[#594047]">No services match your search.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-3 text-xs uppercase tracking-wider text-[#8e004b] font-semibold underline"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((treatment) => {
              const displayPrice = currency === 'INR' 
                ? `₹${treatment.priceINR.toLocaleString('en-IN')}` 
                : `$${treatment.priceUSD}`;

              return (
                <div 
                  key={treatment.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(142,0,75,0.08)] transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                    <img 
                      src={treatment.image} 
                      alt={treatment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#8e004b] text-[10px] uppercase tracking-widest font-bold rounded-full shadow-xs">
                        {treatment.category}
                      </span>
                    </div>

                    {treatment.isSignature && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-[#8e004b] text-white text-[10px] uppercase tracking-widest font-bold rounded-full shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-[#ffcbd9]" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        <Clock className="w-3.5 h-3.5 text-[#ffcbd9]" />
                        {treatment.durationMinutes} mins
                      </span>
                      <span className="font-serif-display text-lg font-bold text-white drop-shadow-sm">
                        {displayPrice}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {treatment.sanskritName && (
                        <div className="font-serif-display text-xs text-[#8e004b] tracking-wider font-semibold mb-1">
                          {treatment.sanskritName}
                        </div>
                      )}
                      <h3 className="font-serif-display text-xl font-bold text-[#1c1b1b] group-hover:text-[#8e004b] transition-colors leading-snug">
                        {treatment.title}
                      </h3>
                      <p className="text-xs text-[#594047] mt-2 line-clamp-3 leading-relaxed">
                        {treatment.description}
                      </p>
                    </div>

                    {/* Ingredients Tags */}
                    <div className="pt-2 border-t border-[#E8E8E8]">
                      <span className="text-[10px] uppercase tracking-wider text-[#594047] font-semibold block mb-1.5">
                        Key Ingredients:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {treatment.keyBotanicals.slice(0, 3).map((botanical, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-[#F0EDEC] text-[#1c1b1b] text-[10px] rounded-md"
                          >
                            {botanical}
                          </span>
                        ))}
                        {treatment.keyBotanicals.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-[#594047]">
                            +{treatment.keyBotanicals.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => setDetailTreatment(treatment)}
                        className="py-2.5 px-3 bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] text-[11px] uppercase tracking-wider font-semibold rounded-lg transition-colors text-center cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onBookTreatment(treatment)}
                        className="py-2.5 px-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-[11px] uppercase tracking-wider font-semibold rounded-lg transition-all shadow-xs hover:shadow-md flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Now</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {detailTreatment && (
        <TreatmentDetailModal
          treatment={detailTreatment}
          onClose={() => setDetailTreatment(null)}
          onBook={(t) => {
            setDetailTreatment(null);
            onBookTreatment(t);
          }}
          currency={currency}
        />
      )}
    </section>
  );
};
