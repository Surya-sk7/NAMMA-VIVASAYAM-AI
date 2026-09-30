// 🌾 Pesu (Conversational AI) Routes
import { Router } from 'express';
import { adapters } from '../adapters';
export const pesuRouter = Router();

const PATTERN_RESPONSES: Record<string, { ta: string; en: string }> = {
  irrigation: {
    ta: 'இன்றைய நிலவரப்படி, மழை வருவதற்கான வாய்ப்பு 68% ஆக உள்ளது. உங்கள் நிலத்தின் ஈரப்பதம் 31% ஆக உள்ளது. நாளை வரை காத்திருப்பது நல்லது.',
    en: "Rain probability is 68%. Soil moisture at 31% is adequate. Better to wait until tomorrow.",
  },
  yellowLeaves: {
    ta: 'நெல்லின் கீழ் இலைகள் மஞ்சளாவது பூக்கும் நிலையில் இயற்கையானது. மேல் இலைகளும் பாதிக்கப்பட்டால், நைட்ரஜன் பற்றாக்குறையாக இருக்கலாம்.',
    en: 'Lower leaf yellowing during flowering can be natural. If upper leaves affected, it may indicate nitrogen deficiency.',
  },
  rain: {
    ta: 'இன்று மாலை மழை வருவதற்கான வாய்ப்பு 68%. எதிர்பார்க்கப்படும் மழையளவு சுமார் 4 மி.மீ. வடிகால் சரியாக இருக்கிறதா பாருங்கள்.',
    en: "68% chance of rain this evening. Expected ~4mm. Check drainage channels.",
  },
  whatToDo: {
    ta: 'உங்கள் நெல் பூக்கும் நிலையில் உள்ளது:\n1. 💧 இன்று தண்ணீர் பாய்ச்ச வேண்டாம்\n2. 🌡 வெப்பநிலை 34°C — கவனமாக கண்காணியுங்கள்\n3. 🌾 தண்ணீர் மேலாண்மை மிக முக்கியம்',
    en: "Your paddy is at flowering stage:\n1. 💧 Don't irrigate today\n2. 🌡 Temperature at 34°C — monitor closely\n3. 🌾 Water management is critical",
  },
};

function matchPattern(query: string): string | null {
  const q = query.toLowerCase();
  if (/தண்ணி|தண்ணீர்|irrigat|நீர்|water|पानी|सिंचाई/.test(q)) return 'irrigation';
  if (/மஞ்சள|yellow|இலை|leaf|disease|நோய்/.test(q)) return 'yellowLeaves';
  if (/மழை|rain|weather|forecast|बारिश/.test(q)) return 'rain';
  if (/என்ன செய்|what.*do|செய்யணும்|action|क्या कर/.test(q)) return 'whatToDo';
  return null;
}

// POST /api/pesu/chat
pesuRouter.post('/chat', (req, res) => {
  const { message, language = 'ta', farmId } = req.body;
  if (!message) { res.status(400).json({ error: 'Message is required' }); return; }

  const patternKey = matchPattern(message);
  let response: string;

  if (patternKey && PATTERN_RESPONSES[patternKey]) {
    const resp = PATTERN_RESPONSES[patternKey];
    response = language === 'ta' ? resp.ta : resp.en;
  } else {
    response = language === 'ta'
      ? 'உங்கள் பண்ணை பற்றிய தகவல் தேவைப்படுகிறது. தண்ணீர், மழை, பயிர் நிலை, அல்லது நோய் பற்றி கேளுங்கள்.'
      : 'I need more context about your farm. Ask me about irrigation, weather, crop health, or diseases.';
  }

  res.json({
    response,
    context: { farmId, language, isDemoData: true },
    suggestions: language === 'ta'
      ? ['இன்று தண்ணி பாய்ச்சலாமா?', 'மழை வருமா?', 'இலை மஞ்சளாகிறது']
      : ['Should I irrigate today?', 'Will it rain?', 'Leaves turning yellow'],
  });
});

// POST /api/pesu/voice
pesuRouter.post('/voice', async (req, res) => {
  try {
    const { language = 'ta' } = req.body;
    const transcript = await adapters.speech.speechToText(Buffer.from(''), language);
    res.json({ transcript, isDemoData: true });
  } catch { res.status(500).json({ error: 'Voice processing failed' }); }
});
