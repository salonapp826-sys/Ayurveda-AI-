import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Ritual Advisor Consultation API
  app.post('/api/advisor', async (req, res) => {
    try {
      const { hairType, scalpCondition, primaryGoal, skinType, upcomingOccasion, fragrancePreference, customNotes } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return clear, simple Indian English fallback consultation
        return res.json({
          ayurvedicAnalysis: `Based on your ${hairType || 'normal'} hair and ${scalpCondition || 'balanced'} scalp condition, your body constitution shows high Pitta-Vata heat. Daily sun and stress cause hair dryness and scalp fatigue. Natural herbal oils and a gentle head massage will restore softness and shine.`,
          doshaAffinity: 'Pitta-Vata Balancing Care',
          recommendedRituals: [
            'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)',
            'Designer Precision Haircut & Styling (60 mins)',
            '24K Gold & Saffron Bridal Glow Facial (90 mins)'
          ],
          homecareRegimen: [
            'Massage 6-8 drops of Pure Jasmine & Bhringraj Hair Oil on scalp twice a week',
            'Use lukewarm water and mild herbal shampoo without harsh sulfates',
            'Do 5 minutes of gentle head & temple massage before sleeping for peaceful rest'
          ],
          artisanMatchReason: 'Matched with Dr. Rajeshwar Sharma for soothing Ayurvedic head massage and Meera Singhania for face-flattering haircuts.',
          lifestyleWellnessTip: 'Drink lukewarm rose water or saffron almond milk at night to cool down body heat and relieve tiredness.'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a senior Ayurvedic Doctor and Master Hair Stylist at "NEXORA" (Tagline: "Salon जा रहे हो? NEXORA किया क्या?"), India's leading luxury salon collective in Mumbai, Delhi, Bengaluru, and Udaipur.
A client needs a personalized hair and skin consultation for their salon visit.
Use simple, clear, polite Indian English. Avoid difficult medical or archaic words. Use everyday salon words that customers in India easily understand.

Client Details:
- Hair Type/Texture: ${hairType || 'Not specified'}
- Scalp Condition: ${scalpCondition || 'Balanced'}
- Main Goal: ${primaryGoal || 'Hair and scalp care'}
- Skin Type: ${skinType || 'Combination'}
- Upcoming Occasion: ${upcomingOccasion || 'Regular grooming'}
- Preferred Fragrance: ${fragrancePreference || 'Madurai Jasmine & Sandalwood'}
- Client Notes: ${customNotes || 'None'}

Please generate a warm, practical, expert recommendation in simple Indian English in strict JSON format:
{
  "ayurvedicAnalysis": "A 2-3 sentence clear diagnosis explaining hair/scalp condition in simple words (mentioning Pitta, Vata, or Kapha simply).",
  "doshaAffinity": "e.g. Pitta-Vata Balancing Care or Kapha Purifying Care",
  "recommendedRituals": ["2-3 services from: Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara), Designer Precision Haircut & Styling, 24K Gold & Saffron Bridal Glow Facial, Ammonia-Free Hair Colour & Balayage Highlights, Royal Bridal Hair & Makeup Package, or Kashmiri Saffron Keratin Hair Spa & Smoothening"],
  "homecareRegimen": ["3 practical home hair & skin care tips"],
  "artisanMatchReason": "1-2 sentence recommending our specialist (Dr. Rajeshwar Sharma, Meera Singhania, Kabir Oberoi, Ananya Roy, or Tariq Mansoor).",
  "lifestyleWellnessTip": "1 easy Ayurvedic daily wellness tip."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } else {
        throw new Error('Empty response from AI model');
      }
    } catch (error: any) {
      console.error('Error in /api/advisor:', error);
      return res.json({
        ayurvedicAnalysis: 'Your hair and scalp analysis indicates that your roots need deep natural hydration and relaxing head massage to relieve daily tension and bring back natural shine.',
        doshaAffinity: 'Pitta-Vata Balancing Care',
        recommendedRituals: [
          'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)',
          'Designer Precision Haircut & Styling (60 mins)'
        ],
        homecareRegimen: [
          'Pure Jasmine & Bhringraj Hair Oil: massage 6 drops into scalp roots before bed',
          'Use 24K Gold & Saffron Day Cream for an instant radiant glow'
        ],
        artisanMatchReason: 'Dr. Rajeshwar Sharma will provide customized cooling Ayurvedic oil therapy tailored to your scalp.',
        lifestyleWellnessTip: 'Use soothing jasmine and sandalwood aroma in your room for deep relaxing sleep.'
      });
    }
  });

  // AI Expert Routine Q&A API
  app.post('/api/expert-qa', async (req, res) => {
    try {
      const { question, hairType, scalpCondition, skinType } = req.body;
      const cleanQuestion = (question || '').trim();

      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && cleanQuestion) {
        const ai = new GoogleGenAI({ apiKey });
        const expertPrompt = `You are Dr. Rajeshwar Sharma, Chief Ayurvedic Vaidya and Senior Scalp Trichologist at "NEXORA", India's luxury salon collective (Mumbai, Delhi, Bengaluru, Udaipur).
A client is asking a specific question about their hair or skin care routine through the Nexora app.

User Question: "${cleanQuestion}"
Client Profile:
- Hair Type: ${hairType || 'Normal / Wavy'}
- Scalp Condition: ${scalpCondition || 'Balanced'}
- Skin Type: ${skinType || 'Combination'}

Respond in clear, warm, polite Indian English with practical, authentic salon and Ayurvedic wisdom. Avoid robotic corporate jargon.
Return strictly valid JSON with this structure:
{
  "question": "${cleanQuestion.replace(/"/g, '\\"')}",
  "answer": "A clear, empathetic, 2-3 paragraph explanation answering the question thoroughly with authentic hair/skincare routine advice.",
  "routineRecommendations": {
    "morning": "Specific step-by-step AM care instructions",
    "evening": "Specific PM care steps before sleeping",
    "weekly": "1-2 times weekly intensive treatment (e.g. champi, ubtan, deep conditioning)"
  },
  "dosAndDonts": {
    "dos": ["3 essential best practices"],
    "donts": ["3 common mistakes to avoid in Indian weather/water"]
  },
  "suggestedSalonRitual": "Name of 1 matching Nexora treatment (e.g. Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara) or 24K Gold & Saffron Bridal Glow Facial or Designer Precision Haircut & Styling or Kashmiri Saffron Keratin Hair Spa & Smoothening)",
  "expertName": "Dr. Rajeshwar Sharma",
  "expertTitle": "Chief Ayurvedic Vaidya & Scalp Trichologist, Nexora"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: expertPrompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });

        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      }

      // Context-aware Fallback for instant responsive UX
      const qLower = cleanQuestion.toLowerCase();
      let answer = 'For healthy hair and skin in Indian weather, consistency with natural botanical formulations and proper dosha balance is key. Always avoid excessive heat styling and harsh sulfate washes.';
      let morning = 'Rinse face with lukewarm water, apply rose water toner and lightweight sunscreen. Lightly detangle hair with neem wood comb.';
      let evening = 'Gentle oil cleansing, followed by 3-4 drops of pure Kumkumadi oil on face and temple massage with jasmine oil.';
      let weekly = 'Warm Ayurvedic oil head champi (Shirodhara oil) left for 45 minutes before a mild reetha/amla herbal wash.';
      let dos = [
        'Oil scalp at least 2 times a week with warm herbal oil',
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
        answer = 'Oiling hair is an ancient Ayurvedic ritual called "Shiro Abhyanga". You should oil your scalp 2 to 3 times a week using warm, pure botanical oils like Bhringraj, Brahmi, and cold-pressed Sesame or Coconut. The ideal duration is 45 to 60 minutes before washing. If your scalp is prone to dandruff or excess sebum, do not leave heavy oil overnight as it traps dust and sweat.';
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
      } else if (qLower.includes('skin') || qLower.includes('glow') || qLower.includes('facial') || qLower.includes('bridal')) {
        answer = 'To achieve a luminous, healthy glow without redness or breakouts, your skin requires gentle exfoliation combined with deep antioxidant nourishment. In India, pollution and UV exposure accelerate pigmentation, so combining botanical saffron (Kesar) with pure sandalwood (Chandan) calms heat while restoring radiance.';
        morning = 'Cleanse with a mild soap-free cleanser. Mist face with pure Kannauj Rose Water. Apply Saffron Day Glow cream and finish with broad-spectrum SPF 50.';
        evening = 'Double cleanse to dissolve city dust and SPF. Gently press 3 drops of pure 24K Gold Kumkumadi Night Elixir onto damp cheekbones and forehead.';
        weekly = 'Apply a freshly prepared sandalwood and turmeric ubtan mask for 15 minutes, rinsing with cold water for instant pore refinement.';
        dos = [
          'Always apply serums and facial oils onto slightly damp skin',
          'Reapply sunscreen every 3 hours when outdoors',
          'Use silk or satin pillowcases to prevent friction lines'
        ];
        donts = [
          'Never use harsh physical walnut scrubs that cause micro-tears',
          'Avoid trying new chemical peels within 10 days of a major function',
          'Do not skip moisturizer even if you have oily or combination skin'
        ];
        ritual = '24K Gold & Saffron Bridal Glow Facial (90 mins)';
      } else if (qLower.includes('color') || qLower.includes('colour') || qLower.includes('keratin') || qLower.includes('smoothen')) {
        answer = 'If you have recently undergone a Keratin smoothening or cysteine treatment, wait at least 14 to 21 days before applying global hair colour or bleach highlights. Doing both simultaneously can over-process the hair cortex, causing brittleness and wash-out of the smoothing polymers.';
        morning = 'Spray leave-in keratin thermal mist before any blow-dry or hot tool usage.';
        evening = 'Apply 2 drops of lightweight hair serum to mid-lengths and split ends; loosely braid hair before sleep.';
        weekly = 'Deep conditioning hair spa mask enriched with hydrolyzed silk and plant keratin once a week.';
        dos = [
          'Use strictly sulfate-free and sodium-chloride-free color care shampoo',
          'Wash hair in lukewarm to cool water to lock in pigment and shine',
          'Always ask your stylist for ammonia-free and bond-protecting Olaplex/K18 additives'
        ];
        donts = [
          'Do not wash hair within 48-72 hours of your chemical salon treatment',
          'Avoid swimming in chlorinated pools without a silicone swim cap',
          'Do not use clarifying or harsh anti-dandruff shampoos on freshly coloured hair'
        ];
        ritual = 'Kashmiri Saffron Keratin Hair Spa & Smoothening (90 mins)';
      } else if (qLower.includes('dandruff') || qLower.includes('itch') || qLower.includes('fall')) {
        answer = 'Dandruff and scalp itchiness in Indian climates are primarily driven by fungal overgrowth (Malassezia) fed by sweat, hard water salts, and sebum buildup. Balancing the scalp microbiome requires antifungal herbs like Neem, Tea Tree, and Camphor (Kapur) without stripping the natural lipid barrier.';
        morning = 'Spritz scalp parting with pure vetiver (Khus) & tea tree scalp tonic to keep roots fresh and sweat-free throughout the day.';
        evening = 'Gently brush scalp with clean wooden bristles to distribute sebum and dislodge loose flakes.';
        weekly = 'Apply a scalp detox mask made with neem leaf paste and cold-pressed coconut oil for 30 minutes before shampooing.';
        dos = [
          'Wash hair immediately after intense workouts or heavy sweating',
          'Disinfect your combs and pillow covers weekly with warm water',
          'Incorporate cooling foods like curd, amla, and cucumber into your diet'
        ];
        donts = [
          'Do not scratch your scalp with fingernails—it causes secondary bacterial infection',
          'Avoid applying thick unrefined castor oil directly to an active flaky scalp',
          'Never share combs, towels, or hair clips during an active flare-up'
        ];
        ritual = 'Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara - 75 mins)';
      }

      return res.json({
        question: cleanQuestion,
        answer,
        routineRecommendations: {
          morning,
          evening,
          weekly
        },
        dosAndDonts: {
          dos,
          donts
        },
        suggestedSalonRitual: ritual,
        expertName: 'Dr. Rajeshwar Sharma',
        expertTitle: 'Chief Ayurvedic Vaidya & Scalp Trichologist, Nexora'
      });
    } catch (err: any) {
      console.error('Error in /api/expert-qa:', err);
      return res.status(500).json({ error: 'Failed to process expert question' });
    }
  });

  // Vite middleware in dev mode / static files in prod mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexora Beauty Collective server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
