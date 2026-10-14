import React from 'react';
import { ARTISANS, SANCTUARIES } from '../data/mockData';
import { Artisan } from '../types';
import { Star, Calendar, Sparkles, MapPin } from 'lucide-react';

interface ArtisanCatalogProps {
  onSelectArtisanForBooking: (artisan: Artisan) => void;
}

export const ArtisanCatalog: React.FC<ArtisanCatalogProps> = ({
  onSelectArtisanForBooking,
}) => {
  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="artisans-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#8e004b] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Stylists & Ayurvedic Doctors</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1c1b1b] font-medium">
            Meet Our Expert Stylists & Doctors
          </h2>
          <p className="text-sm text-[#594047] mt-2">
            Our master hairstylists and certified Ayurvedic doctors have 9–18 years of experience. Enjoy personalized 1:1 care in your private room.
          </p>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISANS.map((artisan) => {
            const sanctuary = SANCTUARIES.find((s) => s.id === artisan.sanctuaryId);

            return (
              <div 
                key={artisan.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Avatar & Header */}
                  <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                    <img 
                      src={artisan.avatar} 
                      alt={artisan.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Experience Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-[#8e004b] shadow-xs">
                      {artisan.experienceYears} Years Experience
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{artisan.rating}</span>
                      <span className="text-[10px] text-stone-300 font-normal">({artisan.reviewCount} reviews)</span>
                    </div>

                    {/* Bottom Name & Role Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif-display text-2xl font-bold text-white">
                        {artisan.name}
                      </h3>
                      <p className="text-xs text-[#ffcbd9] font-medium tracking-wide">
                        {artisan.role}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Location */}
                    {sanctuary && (
                      <div className="flex items-center text-xs text-[#594047] gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#8e004b]" />
                        <span>Branch: {sanctuary.city} ({sanctuary.name})</span>
                      </div>
                    )}

                    {/* Bio */}
                    <p className="text-xs text-[#594047] leading-relaxed line-clamp-3">
                      {artisan.bio}
                    </p>

                    {/* Specialties */}
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#594047] font-semibold block mb-1.5">
                        Top Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {artisan.specialties.map((spec, idx) => (
                          <span 
                            key={idx}
                            className="px-2.5 py-0.5 bg-[#FDE7F3] text-[#8e004b] text-[10px] font-medium rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Signature Service Highlight */}
                    <div className="bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8]">
                      <span className="text-[10px] uppercase tracking-wider text-[#594047] block font-semibold">
                        Most Popular Service:
                      </span>
                      <span className="text-xs font-semibold text-[#1c1b1b] mt-0.5 block">
                        {artisan.signatureRitual}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectArtisanForBooking(artisan)}
                    className="w-full py-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-lg shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book with {artisan.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
