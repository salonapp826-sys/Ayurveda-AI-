import React, { useState } from 'react';
import { AIAdvisorRequest, AIAdvisorResponse, ExpertQAResponse, Treatment } from '../types';
import { TREATMENTS, ARTISANS } from '../data/mockData';
import { 
  Sparkles, 
  Flower2, 
  Loader2, 
  CheckCircle, 
  Calendar,
  MessageCircleQuestion,
  X,
  Send,
  Sun,
  Moon,
  RotateCcw,
  Check,
  XCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface AIConsultationViewProps {
  onBookTreatment: (treatment: Treatment) => void;
  currency: 'INR' | 'USD';
}

const QUICK_QUESTIONS = [
  {
    icon: '🌿',
    tag: 'Hair Oiling',
    shortLabel: 'Hair Oiling Frequency',
    question: 'How often should I oil my hair with Ayurvedic Bhringraj or Jasmine oil, and should I leave it overnight?',
  },
  {
    icon: '✨',
    tag: 'Skin Glow',
    shortLabel: 'AM/PM Skincare Routine',
    question: 'What is the best morning and night skincare routine for healthy glowing skin in humid Indian weather?',
  },
  {
    icon: '💆',
    tag: 'Colour vs Keratin',
    shortLabel: 'Hair Colour After Keratin?',
    question: 'Can I do hair colouring or balayage highlights right after a Keratin smoothening treatment?',
  },
  {
    icon: '❄️',
    tag: 'Scalp Health',
    shortLabel: 'Stop Dandruff & Itch',
    question: 'How to stop recurrent dandruff, itchy scalp, and hair fall caused by hard water and sweat?',
  },
  {
    icon: '👰',
    tag: 'Bridal Radiance',
    shortLabel: 'Instant Glow Facial',
    question: 'Which facial ritual gives an instant bridal glow without causing redness or sudden breakouts?',
  },
  {
    icon: '☀️',
    tag: 'Frizz Control',
    shortLabel: 'Humidity & Heat Defense',
    question: 'How should I protect curly or wavy hair from monsoon frizz and daily heat blowouts?',
  },
];

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

  // Ask Expert States
  const [expertModalOpen, setExpertModalOpen] = useState(false);
  const [expertQuestionInput, setExpertQuestionInput] = useState('');
  const [expertLoading, setExpertLoading] = useState(false);
  const [expertResult, setExpertResult] = useState<ExpertQAResponse | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleAskExpert = async (questionText: string) => {
    if (!questionText.trim()) return;
    setExpertLoading(true);
    setExpertQuestionInput(questionText);
    setExpertModalOpen(true);

    try {
      const response = await fetch('/api/expert-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          hairType,
          scalpCondition,
          skinType,
        }),
      });

      if (!response.ok) throw new Error('Expert query failed');
      const data: ExpertQAResponse = await response.json();
      setExpertResult(data);
    } catch (err) {
      // Contextual Indian Ayurvedic fallback
      const qLower = questionText.toLowerCase();
      let answer = 'For healthy hair and skin in Indian weather, consistency with natural botanical formulations and proper dosha balance is key. Always avoid excessive heat styling and harsh sulfate washes.';
      let morning = 'Rinse face with lukewarm water, apply rose water toner and lightweight sunscreen. Lightly detangle hair with neem wood comb.';
      let evening = 'Gentle oil cleansing, followed by 3-4 drops of pure Kumkumadi oil on face and temple massage with jasmine oil.';
      let weekly = 'Warm Ayurvedic oil head champi left for 45 minutes before a mild reetha/amla herbal wash.';
      let dos = [
        'Oil scalp 2 times a week with warm herbal oil',
        'Use wide-tooth neem wood comb to stimulate blood circulation',
        'Drink 2-3 liters of water infused with mint and fennel (saunf)'
      ];
      let donts = [
        'Do not wash hair with hot water—it strips natural keratin and worsens dandruff',
        'Avoid leaving oil on scalp for more than 2 hours if you have active dandruff',
        'Never sleep with damp hair as fungal build-up can weaken hair follicles'
      ];
      let ritual = 'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)';

      if (qLower.includes('oil') || qLower.includes('bhringraj') || qLower.includes('champi')) {
        answer = 'Oiling hair is an ancient Ayurvedic ritual called "Shiro Abhyanga". You should oil your scalp 2 to 3 times a week using warm, pure botanical oils like Bhringraj, Brahmi, and cold-pressed Sesame or Coconut. The ideal duration is 45 to 60 minutes before washing. If your scalp is prone to dandruff, do not leave heavy oil overnight as it traps dust and sweat.';
        morning = 'Gently massage hair tips with 1 drop of argan or jasmine serum to seal in moisture before stepping out in the sun.';
        evening = 'Spend 5 minutes gently massaging scalp pressure points (Adisthana) with fingertips to calm the nervous system.';
        weekly = 'Warm oil champi: Heat 2 tablespoons of Bhringraj oil in a bowl of warm water. Apply directly to hair roots with gentle circular strokes.';
        dos = [
          'Warm the oil gently in a double boiler before application',
          'Massage using soft circular motions with fingertips, not fingernails',
          'Wrap a warm damp towel around hair for 10 minutes to help cuticles absorb nutrients'
        ];
        donts = [
          'Do not apply boiling hot oil directly to scalp',
          'Avoid vigorously rubbing hair strands against each other',
          'Do not use synthetic mineral oils or petroleum-based scented oils'
        ];
        ritual = 'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)';
      }

      setExpertResult({
        question: questionText,
        answer,
        routineRecommendations: {
          morning,
          evening,
          weekly,
        },
        dosAndDonts: {
          dos,
          donts,
        },
        suggestedSalonRitual: ritual,
        expertName: 'Dr. Rajeshwar Sharma',
        expertTitle: 'Chief Ayurvedic Vaidya & Scalp Trichologist, Nexora'
      });
    } finally {
      setExpertLoading(false);
    }
  };

  const handleCopyRoutine = () => {
    if (!expertResult) return;
    const routineText = `Nexora Expert Care Routine for: "${expertResult.question}"\n\nExpert: ${expertResult.expertName || 'Dr. Rajeshwar Sharma'} (${expertResult.expertTitle || 'Ayurvedic Specialist'})\n\nAdvice:\n${expertResult.answer}\n\n☀️ Morning Routine:\n${expertResult.routineRecommendations.morning || 'N/A'}\n\n🌙 Evening Routine:\n${expertResult.routineRecommendations.evening || 'N/A'}\n\n🗓️ Weekly Ritual:\n${expertResult.routineRecommendations.weekly || 'N/A'}\n\nDo's:\n${expertResult.dosAndDonts.dos.map(d => `• ${d}`).join('\n')}\n\nDon'ts:\n${expertResult.dosAndDonts.donts.map(d => `• ${d}`).join('\n')}\n\nRecommended Salon Ritual: ${expertResult.suggestedSalonRitual || 'Shirodhara Head Massage'}`;

    navigator.clipboard.writeText(routineText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const matchedSalonTreatment = expertResult?.suggestedSalonRitual
    ? TREATMENTS.find((t) =>
        expertResult.suggestedSalonRitual?.toLowerCase().includes(t.title.toLowerCase().split(' ')[0].toLowerCase())
      ) || TREATMENTS[0]
    : TREATMENTS[0];

  return (
    <section className="py-12 md:py-16 bg-[#fdf8f8]" id="ai-advisor-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
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

        {/* Quick-Reply "Ask Expert" Banner & Shortcut Pills */}
        <div className="mb-10 bg-gradient-to-r from-[#FDE7F3]/70 via-white to-[#FDE7F3]/50 border border-[#ffcbd9] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-[#ffcbd9]/60">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={ARTISANS[1]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt="Dr. Rajeshwar Sharma"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#8e004b]"
                />
                <div className="absolute -bottom-1 -right-1 bg-[#8e004b] text-white p-0.5 rounded-full" title="Verified Ayurvedic Vaidya">
                  <ShieldCheck className="w-3 h-3" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-[#1c1b1b]">
                    Got Specific Hair or Skin Questions?
                  </h3>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-[#8e004b] text-white rounded">
                    Ask Expert
                  </span>
                </div>
                <p className="text-xs text-[#594047]">
                  Consult Dr. Rajeshwar Sharma & Master Stylists directly for custom daily routines.
                </p>
              </div>
            </div>

            {/* Quick-Reply Primary Button */}
            <button
              onClick={() => {
                setExpertQuestionInput('');
                setExpertResult(null);
                setExpertModalOpen(true);
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-[0.14em] font-semibold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
            >
              <MessageCircleQuestion className="w-4 h-4 text-[#ffcbd9]" />
              <span>Ask Expert</span>
            </button>
          </div>

          {/* Quick-Reply Pills Carousel */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#8e004b] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Tap a Quick Question for Instant Routine Guidance:</span>
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {QUICK_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskExpert(q.question)}
                  className="px-3 py-1.5 bg-white hover:bg-[#FDE7F3] border border-[#ffcbd9] text-[#1c1b1b] hover:text-[#8e004b] rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer flex-shrink-0"
                >
                  <span>{q.icon}</span>
                  <span className="font-semibold">{q.shortLabel}</span>
                  <ChevronRight className="w-3 h-3 text-[#594047]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Form & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Diagnostic Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E8E8] shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
                <h3 className="text-xs uppercase tracking-[0.16em] font-bold text-[#8e004b] flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Tell Us About Your Hair & Skin</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    setExpertQuestionInput(`What hair care routine do you recommend for ${hairType} with ${scalpCondition}?`);
                    handleAskExpert(`What hair care routine do you recommend for ${hairType} with ${scalpCondition}?`);
                  }}
                  className="text-[10px] uppercase font-bold text-[#8e004b] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircleQuestion className="w-3 h-3" />
                  <span>Ask Routine Expert</span>
                </button>
              </div>

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

                {/* Ask Expert Callout on Routine */}
                <div className="p-3.5 bg-gradient-to-r from-[#FDE7F3] to-[#FFF0F5] border border-[#ffcbd9] rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-[#8e004b] flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Have questions on this routine?</span>
                    </h5>
                    <p className="text-[11px] text-[#594047]">
                      Ask our Ayurvedic Vaidya how to adjust this for your work schedule or climate.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const q = `How should I follow this ${result.doshaAffinity} routine daily, and what shampoo or oil works best for ${hairType}?`;
                      handleAskExpert(q);
                    }}
                    className="px-3 py-1.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-[10px] uppercase font-bold tracking-wider rounded-md transition-colors flex-shrink-0 cursor-pointer shadow-xs"
                  >
                    Ask Expert
                  </button>
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
              <div className="bg-white p-8 sm:p-12 rounded-2xl border border-dashed border-[#E8E8E8] text-center flex flex-col items-center justify-center h-full min-h-[380px] space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FDE7F3] text-[#8e004b] flex items-center justify-center">
                  <Flower2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-display text-xl font-bold text-[#1c1b1b]">
                  Ready for Your Free Checkup?
                </h4>
                <p className="text-xs text-[#594047] max-w-sm">
                  Fill in your hair and skin details on the left, or tap any quick-reply question above to ask our Senior Vaidya & Hair Stylists directly.
                </p>

                {/* Secondary Ask Expert CTA */}
                <button
                  type="button"
                  onClick={() => {
                    setExpertQuestionInput('');
                    setExpertResult(null);
                    setExpertModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#FDE7F3] hover:bg-[#ffcbd9] text-[#8e004b] border border-[#ffcbd9] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>Ask Expert a Specific Routine Question</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ============================================================== */}
      {/* ASK EXPERT ROUTINE MODAL                                        */}
      {/* ============================================================== */}
      {expertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#ffcbd9] overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#8e004b] via-[#a80059] to-[#8e004b] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={ARTISANS[1]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt="Dr. Rajeshwar Sharma"
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/80 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" title="Doctor Online"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-display text-lg font-bold">Ask Hair & Skin Expert</h3>
                    <span className="text-[9px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Nexora Vaidya
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    Dr. Rajeshwar Sharma, BAMS & Meera Singhania (Master Stylist)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setExpertModalOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              
              {/* Question Input Box */}
              <div>
                <label className="text-[11px] uppercase font-bold tracking-wider text-[#8e004b] block mb-1.5">
                  Type Your Specific Hair or Skin Question:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={expertQuestionInput}
                    onChange={(e) => setExpertQuestionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAskExpert(expertQuestionInput);
                      }
                    }}
                    placeholder="e.g. How often should I oil my hair with Bhringraj? Can I color after keratin?"
                    className="w-full pr-24 pl-3.5 py-3 bg-[#F0EDEC] border border-[#E8E8E8] rounded-xl text-xs sm:text-sm text-[#1c1b1b] placeholder-[#594047] focus:outline-hidden focus:border-[#8e004b]"
                  />
                  <button
                    type="button"
                    disabled={expertLoading || !expertQuestionInput.trim()}
                    onClick={() => handleAskExpert(expertQuestionInput)}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {expertLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick-Reply Shortcuts */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#594047] block mb-2">
                  Or select a popular quick-reply question:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskExpert(q.question)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all flex items-center gap-1.5 cursor-pointer ${
                        expertQuestionInput === q.question
                          ? 'bg-[#8e004b] text-white border-[#8e004b]'
                          : 'bg-[#F0EDEC] hover:bg-[#FDE7F3] text-[#1c1b1b] border-[#E8E8E8] hover:border-[#ffcbd9]'
                      }`}
                    >
                      <span>{q.icon}</span>
                      <span>{q.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading State */}
              {expertLoading && (
                <div className="p-8 text-center bg-[#FDE7F3]/30 rounded-2xl border border-[#ffcbd9] space-y-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-[#8e004b]/10 text-[#8e004b] mx-auto flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <h4 className="font-serif-display text-base font-bold text-[#8e004b]">
                    Consulting Dr. Rajeshwar Sharma...
                  </h4>
                  <p className="text-xs text-[#594047] max-w-sm mx-auto">
                    Synthesizing Ayurvedic Dosha balance, hair shaft trichology, and Indian weather considerations for your custom routine.
                  </p>
                </div>
              )}

              {/* Expert Answer Presentation */}
              {!expertLoading && expertResult && (
                <div className="space-y-4 animate-fade-in">
                  
                  {/* Verified Answer Header */}
                  <div className="p-4 bg-gradient-to-br from-[#fdf8f8] to-[#FDE7F3]/40 rounded-2xl border border-[#ffcbd9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#8e004b] text-white flex items-center justify-center text-xs font-bold">
                          Rx
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#8e004b] block">
                            {expertResult.expertName || 'Dr. Rajeshwar Sharma, BAMS'}
                          </span>
                          <span className="text-[10px] text-[#594047]">
                            {expertResult.expertTitle || 'Chief Ayurvedic Vaidya, Nexora'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCopyRoutine}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#8e004b] hover:bg-white rounded-md border border-[#ffcbd9] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy routine advice"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Routine</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1c1b1b] leading-relaxed font-normal">
                      {expertResult.answer}
                    </p>
                  </div>

                  {/* 3-Part Step Routine Cards */}
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e004b] mb-2">
                      Custom Daily & Weekly Routine Breakdown:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      
                      {/* AM Routine */}
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs mb-1">
                          <Sun className="w-3.5 h-3.5 text-amber-600" />
                          <span>Morning (AM)</span>
                        </div>
                        <p className="text-[11px] text-[#594047] leading-relaxed">
                          {expertResult.routineRecommendations.morning || 'Gentle wash and protective hydration before stepping out.'}
                        </p>
                      </div>

                      {/* PM Routine */}
                      <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
                        <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs mb-1">
                          <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Evening (PM)</span>
                        </div>
                        <p className="text-[11px] text-[#594047] leading-relaxed">
                          {expertResult.routineRecommendations.evening || 'Cleansing, nighttime scalp relaxation, and repair elixir.'}
                        </p>
                      </div>

                      {/* Weekly Routine */}
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs mb-1">
                          <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Weekly Care</span>
                        </div>
                        <p className="text-[11px] text-[#594047] leading-relaxed">
                          {expertResult.routineRecommendations.weekly || 'Deep conditioning mask or warm oil Ayurvedic champi.'}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Do's & Don'ts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Do's */}
                    <div className="p-3 bg-green-50/50 border border-green-200 rounded-xl">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-green-800 flex items-center gap-1 mb-1.5">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span>Recommended Do's</span>
                      </span>
                      <ul className="space-y-1 text-xs text-[#594047]">
                        {expertResult.dosAndDonts.dos.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Don'ts */}
                    <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-red-800 flex items-center gap-1 mb-1.5">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Mistakes to Avoid (Don'ts)</span>
                      </span>
                      <ul className="space-y-1 text-xs text-[#594047]">
                        {expertResult.dosAndDonts.donts.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Suggested Nexora Ritual Match */}
                  {expertResult.suggestedSalonRitual && matchedSalonTreatment && (
                    <div className="p-3.5 bg-[#8e004b]/5 border border-[#8e004b]/20 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#8e004b] block">
                          Recommended Nexora Ritual Match:
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-[#1c1b1b]">
                          {matchedSalonTreatment.title}
                        </h5>
                        <p className="text-[11px] text-[#594047]">
                          {matchedSalonTreatment.durationMinutes} mins • ₹{matchedSalonTreatment.priceINR.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setExpertModalOpen(false);
                          onBookTreatment(matchedSalonTreatment);
                        }}
                        className="px-3.5 py-2 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase font-bold tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs flex-shrink-0"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#F0EDEC] border-t border-[#E8E8E8] flex items-center justify-between">
              <span className="text-[11px] text-[#594047]">
                Live consultation with Nexora Trichology & Ayurvedic Team
              </span>
              <button
                onClick={() => setExpertModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-[#E8E8E8] text-xs font-semibold text-[#1c1b1b] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
