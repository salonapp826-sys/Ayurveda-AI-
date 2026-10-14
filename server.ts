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
        model: 'gemini-3.7-flash',
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
