import React from 'react';
import { Treatment } from '../types';
import { 
  X, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Flower2, 
  UserCheck
} from 'lucide-react';

interface TreatmentDetailModalProps {
  treatment: Treatment | null;
  onClose: () => void;
  onBook: (treatment: Treatment) => void;
  currency: 'INR' | 'USD';
}

export const TreatmentDetailModal: React.FC<TreatmentDetailModalProps> = ({
  treatment,
  onClose,
  onBook,
  currency,
}) => {
  if (!treatment) return null;

  const displayPrice = currency === 'INR' 
    ? `₹${treatment.priceINR.toLocaleString('en-IN')}`
    : `$${treatment.priceUSD}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E8E8E8] my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#1c1b1b] flex items-center justify-center shadow-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Header */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
          <img 
            src={treatment.image} 
            alt={treatment.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-[#ffcbd9] font-semibold mb-1">
              <span>{treatment.category}</span>
              {treatment.sanskritName && (
                <>
                  <span>•</span>
                  <span className="font-serif-display text-sm text-white/90">{treatment.sanskritName}</span>
                </>
              )}
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight">
              {treatment.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-stone-200">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#ffcbd9]" />
                {treatment.durationMinutes} Minutes Duration
              </span>
              <span className="flex items-center gap-1 font-semibold text-white">
                {displayPrice} (All Taxes Included)
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Extended Description */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#8e004b] mb-2">
              About This Treatment
            </h3>
            <p className="text-sm sm:text-base text-[#594047] leading-relaxed">
              {treatment.extendedDescription}
            </p>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#8e004b] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Main Benefits & Results</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {treatment.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-[#1c1b1b] bg-[#F0EDEC] p-3 rounded-lg border border-[#E8E8E8]">
                  <CheckCircle2 className="w-4 h-4 text-[#8e004b] flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#8e004b] mb-3 flex items-center gap-1.5">
              <Flower2 className="w-3.5 h-3.5" />
              <span>Key Natural Ingredients</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {treatment.keyBotanicals.map((botanical, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-[#FDE7F3] text-[#8e004b] border border-[#ffcbd9] rounded-full text-xs font-semibold"
                >
                  {botanical}
                </span>
              ))}
            </div>
          </div>

          {/* Step-by-Step Salon Process */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] font-bold text-[#8e004b] mb-3">
              Step-by-Step Salon Process
            </h3>
            <div className="space-y-2.5">
              {treatment.ritualSteps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm p-2.5 rounded-md hover:bg-[#F0EDEC] transition-colors">
                  <span className="w-6 h-6 rounded-full bg-[#8e004b] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[#1c1b1b] font-medium pt-0.5">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Stylist Role */}
          <div className="bg-[#fdf8f8] border border-[#E8E8E8] p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE7F3] flex items-center justify-center text-[#8e004b]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-[#594047] font-semibold">Performed by</span>
                <span className="block text-sm font-semibold text-[#1c1b1b]">{treatment.recommendedArtisanRole}</span>
              </div>
            </div>
            <span className="text-xs text-[#8e004b] font-medium">Private AC Room Service</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#F0EDEC] border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-[11px] uppercase tracking-wider text-[#594047] block font-medium">Total Service Price</span>
            <span className="text-2xl font-serif-display font-bold text-[#8e004b]">{displayPrice}</span>
            <span className="text-[11px] text-[#594047] ml-2">({treatment.durationMinutes} mins • GST included)</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 border border-[#E8E8E8] hover:bg-white text-xs uppercase tracking-wider font-semibold rounded-lg text-[#1c1b1b] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(treatment);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-widest font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book This Service</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
