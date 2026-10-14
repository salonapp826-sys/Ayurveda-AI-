import React from 'react';
import { NEXORA_ASSETS } from '../data/mockData';
import { Sparkles, ArrowRight, Flower2 } from 'lucide-react';

interface HeroEditorialProps {
  onExploreTreatments: () => void;
  onOpenBooking: () => void;
  onExploreBoutique: () => void;
  onOpenAdvisor: () => void;
}

export const HeroEditorial: React.FC<HeroEditorialProps> = ({
  onExploreTreatments,
  onOpenBooking,
  onExploreBoutique,
  onOpenAdvisor,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#fdf8f8] py-12 md:py-16 border-b border-[#E8E8E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Category Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#FDE7F3] border border-[#ffcbd9] rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8e004b]">
                Pure Ayurvedic Care • Modern Hair Styling
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#1c1b1b] font-medium leading-[1.12] tracking-tight">
              Where authentic Ayurveda meets modern <span className="italic text-[#8e004b] font-normal">hair & beauty</span>.
            </h1>

            {/* Subtext */}
            <p className="text-base text-[#594047] leading-relaxed max-w-xl font-normal">
              Salon जा रहे हो? NEXORA किया क्या? Experience royal Ayurvedic head massage (Shirodhara), precision haircuts, private AC styling rooms, and 100% original beauty products curated for Indian hair and skin.
            </p>

            {/* Key Hallmarks Grid */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-[#E8E8E8]">
              <div>
                <span className="block font-serif-display text-2xl md:text-3xl font-semibold text-[#8e004b]">100%</span>
                <span className="block text-[11px] uppercase tracking-wider text-[#594047] font-medium mt-0.5">Pure Natural Oils</span>
              </div>
              <div>
                <span className="block font-serif-display text-2xl md:text-3xl font-semibold text-[#8e004b]">Private</span>
                <span className="block text-[11px] uppercase tracking-wider text-[#594047] font-medium mt-0.5">VIP Styling Rooms</span>
              </div>
              <div>
                <span className="block font-serif-display text-2xl md:text-3xl font-semibold text-[#8e004b]">Expert</span>
                <span className="block text-[11px] uppercase tracking-wider text-[#594047] font-medium mt-0.5">Stylists & Vaidyas</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-book-btn"
                onClick={onOpenBooking}
                className="px-6 py-3.5 bg-[#8e004b] hover:bg-[#b90064] text-white rounded-lg text-xs uppercase tracking-[0.16em] font-semibold transition-all shadow-sm hover:shadow-md flex items-center space-x-2 cursor-pointer"
              >
                <span>Book Salon Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAdvisor}
                className="px-5 py-3.5 bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] border border-[#E8E8E8] rounded-lg text-xs uppercase tracking-[0.14em] font-semibold transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Flower2 className="w-4 h-4 text-[#8e004b]" />
                <span>Free Hair & Skin Check (AI)</span>
              </button>

              <button
                onClick={onExploreBoutique}
                className="text-xs uppercase tracking-[0.14em] text-[#8e004b] hover:text-[#e6007e] font-semibold underline underline-offset-4 py-2 transition-colors cursor-pointer"
              >
                Shop Salon Products & Deals
              </button>
            </div>

          </div>

          {/* Right Column: Hero Asset Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E8E8E8] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] group">
              <img 
                src={NEXORA_ASSETS.heroPlinth}
                alt="Suvarna Beauty Products"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              
              {/* Soft Gradient Overlay for Tag Badge */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit mb-2 text-white border border-white/30 text-[11px] uppercase tracking-wider font-semibold">
                  <span>100% Original Salon Products</span>
                </div>
                <h3 className="font-serif-display text-2xl md:text-3xl text-white font-medium">
                  Pure Jasmine Oils, 24K Gold Creams & Hair Serums
                </h3>
                <p className="text-xs md:text-sm text-stone-200 mt-1 max-w-md">
                  Formulated with pure natural herbs and oils for healthy hair growth, frizz control, and glowing skin.
                </p>
              </div>

              {/* Floating Logo Seal */}
              <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/90 backdrop-blur-md p-2 shadow-lg flex items-center justify-center border border-white/40">
                <img 
                  src={NEXORA_ASSETS.logo} 
                  alt="Nexora Stamp"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
