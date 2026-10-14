import React, { useState } from 'react';
import { AIAdvisorRequest, AIAdvisorResponse, Treatment } from '../types';
import { TREATMENTS } from '../data/mockData';
import { Sparkles, Flower2, Loader2, CheckCircle, Calendar } from 'lucide-react';

interface AIConsultationViewProps {
  onBookTreatment: (treatment: Treatment) => void;
  currency: 'INR' | 'USD';
}

export const AIConsultationView: React.FC<AIConsultationViewProps> = ({
  onBookTreatment,
  currency,
}) => {
  const [hairType, setHairType] = useState('Wavy / Frizzy Hair');
  const [scalpCondition, setScalpCondition] = useState('Dry Scalp / Dandruff');
  const [primaryGoal, setPrimaryGoal] = useState('Deep Hair Hydration & Scalp Stress Relief');
  const [skinType, setSkinType] = useState('Normal to Dry');
  const [upcomingOccasion, setUpcomingOccasion] = useState('Wedding / Family Function');
  const [fragrancePreference, setFragrancePreference] = useState('Fresh Madurai Jasmine (Mogra) & Sandalwood (Chandan)');
  const [customNotes, setCustomNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAdvisorResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: AIAdvisorRequest = {
        hairType,
        scalpCondition,
        primaryGoal,
        skinType,
        upcomingOccasion,
        fragrancePreference,
        customNotes,
      };

      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Advisor request failed');
      const data: AIAdvisorResponse = await response.json();
      setResult(data);
    } catch (err) {
      // Natural Indian English Fallback
      setResult({
        ayurvedicAnalysis: 'Your hair and scalp analysis indicates high Pitta & Vata imbalance caused by daily heat and stress. This leads to dry hair tips, scalp warmth, and light dandruff.',
        doshaAffinity: 'Pitta-Vata Balancing Care',
        recommendedRituals: [
          'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)',
          'Designer Precision Haircut & Styling (60 mins)',
        ],
        homecareRegimen: [
          'Massage 6-8 drops of Pure Jasmine Hair Oil on scalp roots before sleep',
          'Rinse hair with cool water and mild amla or reetha herbal shampoo',
          'Avoid excessive blow-drying on high heat without heat protection serum'
        ],
        artisanMatchReason: 'Matched with Dr. Rajeshwar Sharma for targeted Shirodhara head massage and cooling Ayurvedic oil therapy.',
        lifestyleWellnessTip: 'Drink lukewarm water infused with fennel (saunf) and rose water in the morning to keep body and scalp cool.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="ai-advisor-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FDE7F3] border border-[#ffcbd9] rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8e004b]" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8e004b]">
              Free AI Hair & Skin Consultation
            </span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#1c1b1b] font-medium">
            Personalized Hair & Skin Checkup
          </h2>
          <p className="text-sm text-[#594047] mt-2 leading-relaxed">
            Answer a few quick questions. Our AI doctor will analyze your body type (Dosha) and recommend the best haircut, head massage, or glowing facial for you.
          </p>
        </div>

        {/* 2-Column Form & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Diagnostic Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8E8] shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#8e004b] border-b border-[#E8E8E8] pb-3 flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5" />
                <span>Tell Us About Your Hair & Skin</span>
              </h3>

              {/* Hair Type */}
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Hair Type & Texture
                </label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                >
                  <option value="Straight / Silky / Thin Hair">Straight / Silky / Thin Hair</option>
                  <option value="Wavy / Frizzy Hair">Wavy / Frizzy Hair</option>
                  <option value="Thick / Dense / Heavy Hair">Thick / Dense / Heavy Hair</option>
                  <option value="Curly / Coarse / Frizz Prone">Curly / Coarse / Frizz Prone</option>
                  <option value="Coloured / Smoothened / Chemically Treated Hair">Coloured / Smoothened / Chemically Treated Hair</option>
                </select>
              </div>

              {/* Scalp Status */}
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Scalp Condition
                </label>
                <select
                  value={scalpCondition}
                  onChange={(e) => setScalpCondition(e.target.value)}
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                >
                  <option value="Sensitive / Itchy / Red Scalp">Sensitive / Itchy / Red Scalp</option>
                  <option value="Dry Scalp / Flaking & Dandruff">Dry Scalp / Flaking & Dandruff</option>
                  <option value="Oily Scalp / Sweaty Roots">Oily Scalp / Sweaty Roots</option>
                  <option value="Normal / Healthy Scalp">Normal / Healthy Scalp</option>
                </select>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Main Goal / What Do You Need?
                </label>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                >
                  <option value="Deep Hair Hydration & Scalp Stress Relief">Deep Hair Hydration & Scalp Stress Relief (Head Massage)</option>
                  <option value="Smart Precision Haircut & Styling">Smart Precision Haircut & Styling</option>
                  <option value="Instant 24K Gold Bridal Glow Facial">Instant 24K Gold Bridal Glow Facial</option>
                  <option value="Natural Ammonia-Free Hair Highlights">Natural Ammonia-Free Hair Highlights</option>
                  <option value="Complete Wedding / Bridal Makeover">Complete Wedding / Bridal Makeover</option>
                </select>
              </div>

              {/* Fragrance Preference */}
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Preferred Scent / Aroma
                </label>
                <select
                  value={fragrancePreference}
                  onChange={(e) => setFragrancePreference(e.target.value)}
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs font-medium text-[#1c1b1b]"
                >
                  <option value="Fresh Madurai Jasmine (Mogra) & Sandalwood (Chandan)">Fresh Madurai Jasmine (Mogra) & Sandalwood (Chandan)</option>
                  <option value="Kannauj Rose (Gulab) & Kashmiri Saffron (Kesar)">Kannauj Rose (Gulab) & Kashmiri Saffron (Kesar)</option>
                  <option value="Cooling Vetiver (Khus) & Amber">Cooling Vetiver (Khus) & Amber</option>
                  <option value="Fresh Lemongrass & Mint">Fresh Lemongrass & Mint</option>
                </select>
              </div>

              {/* Custom Notes */}
              <div>
                <label className="text-[11px] uppercase font-semibold text-[#594047] block mb-1">
                  Any upcoming occasion or specific concerns?
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g. Attending a wedding next Saturday, scalp feels very dry after travelling..."
                  className="w-full p-2.5 bg-[#F0EDEC] border border-[#E8E8E8] rounded-lg text-xs text-[#1c1b1b] placeholder-[#594047]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Hair & Skin with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get Free AI Recommendation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Consultation Output Card */}
          <div className="lg:col-span-6">
            {result ? (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#ffcbd9] shadow-md space-y-6 animate-fade-in">
                
                {/* Dosha Badge */}
                <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#594047] font-semibold block">Ayurvedic Body Type (Dosha)</span>
                    <span className="font-serif-display text-xl font-bold text-[#8e004b]">{result.doshaAffinity}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FDE7F3] flex items-center justify-center text-[#8e004b]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                {/* Analysis */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-1.5">
                    Doctor's Hair & Scalp Diagnosis
                  </h4>
                  <p className="text-xs sm:text-sm text-[#594047] leading-relaxed">
                    {result.ayurvedicAnalysis}
                  </p>
                </div>

                {/* Recommended Services */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#8e004b]" />
                    <span>Recommended Salon Services</span>
                  </h4>
                  <div className="space-y-2">
                    {result.recommendedRituals.map((r, i) => {
                      const matchedTreatment = TREATMENTS.find((t) => r.toLowerCase().includes(t.title.toLowerCase().split(' ')[0].toLowerCase()));
                      return (
                        <div key={i} className="p-3 bg-[#F0EDEC] rounded-xl border border-[#E8E8E8] flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#1c1b1b]">{r}</span>
                          {matchedTreatment && (
                            <button
                              onClick={() => onBookTreatment(matchedTreatment)}
                              className="px-3 py-1 bg-[#8e004b] text-white text-[10px] uppercase font-bold rounded-md hover:bg-[#b90064] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Book</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Homecare Protocol */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2">
                    Daily Hair & Skin Care Routine at Home
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#594047]">
                    {result.homecareRegimen.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8e004b] font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stylist match note */}
                <div className="p-3.5 bg-[#FDE7F3]/40 border border-[#ffcbd9] rounded-xl text-xs text-[#594047]">
                  <span className="font-bold text-[#8e004b]">Recommended Specialist:</span> {result.artisanMatchReason}
                </div>

                {/* Lifestyle tip */}
                <div className="text-[11px] text-[#594047] italic border-t border-[#E8E8E8] pt-3">
                  🌿 <span className="font-semibold">Quick Ayurvedic Tip:</span> {result.lifestyleWellnessTip}
                </div>

              </div>
            ) : (
              <div className="bg-white p-8 sm:p-12 rounded-2xl border border-dashed border-[#E8E8E8] text-center flex flex-col items-center justify-center h-full min-h-[380px] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                  <Flower2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
                  Ready for Your Free Checkup?
                </h4>
                <p className="text-xs text-[#594047] max-w-sm">
                  Fill in your hair and skin details on the left to see your personalized Ayurvedic diagnosis and recommended treatments.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
