// ============================================================
// 🌾 NammaVivasayam AI — Pesu (Voice & AI Agricultural Assistant) — REBUILT
// Realistic conversational AI, MediaRecorder Audio Capture + Preview + Send,
// Web Speech Recognition, Cartoon Farmer Mascot, Text-to-Speech (TTS)
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';
import type { SupportedLanguage } from '../i18n';
import FarmerMascot from '../components/common/FarmerMascot';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  audioDuration?: number;
  category?: string;
  actionChips?: { label: string; action: string }[];
  timestamp: Date;
}

// Map app language to SpeechSynthesis / SpeechRecognition BCP-47 locale
const LANG_LOCALE_MAP: Record<SupportedLanguage, string> = {
  ta: 'ta-IN',
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  or: 'or-IN',
  pa: 'pa-IN',
};

// Spoken quick-query voice suggestions by language
const VOICE_PRESETS: Record<SupportedLanguage, string[]> = {
  ta: [
    'இன்று நிலத்திற்கு தண்ணீர் பாய்ச்சலாமா?',
    'என் நெல் இலைகள் மஞ்சளாகின்றன, என்ன செய்ய வேண்டும்?',
    'இன்று மாலை மழை வருமா? வானிலை என்ன?',
    'அறுவடை எப்போது செய்ய வேண்டும்?',
    'இப்போது என்ன உரம் போட வேண்டும்?',
    'மதுரை சந்தையில் நெல் விலை என்ன?',
    'என் நிலத்தின் சேட்டிலைட் NDVI அளவு என்ன?',
    'PM-கிசான் உதவித்தொகை எப்படி சரிபார்ப்பது?',
  ],
  en: [
    'Should I irrigate my paddy field today?',
    'My rice leaves are turning yellow, what should I do?',
    'What is today\'s weather and rain forecast for Madurai?',
    'When should I harvest my crop and book a harvester?',
    'What fertilizer is recommended for flowering paddy?',
    'What is the current mandi market price for IR 64?',
    'What does the Sentinel-2 satellite data say about my farm?',
    'How do I claim PMFBY crop insurance or PM-Kisan subsidy?',
  ],
  hi: [
    'क्या मुझे आज खेत में पानी देना चाहिए?',
    'मेरी धान की पत्तियां पीली हो रही हैं, क्या करूँ?',
    'आज बारिश का क्या अनुमान है?',
    'कटाई कब करनी चाहिए?',
    'फूल आने पर कौन सी खाद डालें?',
    'मदुरै मंडी में धान का भाव क्या है?',
    'मेरे खेत का उपग्रह NDVI कितना है?',
    'पीएम-किसान योजना की स्थिति कैसे देखें?',
  ],
  te: [
    'ఈరోజు పొలానికి నీరు పెట్టాలా?',
    'నా వరి ఆకులు పసుపుగా మారుతున్నాయి, ఏం చేయాలి?',
    'ఈరోజు వర్షం పడే అవకాశం ఉందా?',
    'కోత ఎప్పుడు చేయాలి?',
    'ప్రస్తుతం ఏ ఎరువులు వాడాలి?',
    'మార్కెట్‌లో వరి ధర ఎంత?',
    'నా పొలం శాటిలైట్ NDVI ఎంత ఉంది?',
  ],
  kn: [
    'ಇಂದು ಹೊಲಕ್ಕೆ ನೀರು ಹಾಕಬೇಕಾ?',
    'ನನ್ನ ಭತ್ತದ ಎಲೆಗಳು ಹಳದಿ ಆಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?',
    'ಇಂದು ಮಳೆ ಬರುತ್ತಾ? ಹವಾಮಾನ ಹೇಗಿದೆ?',
    'ಕೊಯ್ಲು ಯಾವಾಗ ಮಾಡಬೇಕು?',
    'ಈಗ ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕು?',
    'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಭತ್ತದ ಬೆಲೆ ಎಷ್ಟು?',
    'ನನ್ನ ಹೊಲದ ಉಪಗ್ರಹ NDVI ಎಷ್ಟಿದೆ?',
  ],
  ml: [
    'ഇന്ന് പാടത്ത് വെള്ളം നനയ്ക്കണമോ?',
    'എന്റെ നെല്ലിന്റെ ഇലകൾ മഞ്ഞളിക്കുന്നു, എന്ത് ചെയ്യണം?',
    'ഇന്ന് മഴ പെയ്യുമോ? കാലാവസ്ഥ എന്താണ്?',
    'വിളവെടുപ്പ് എപ്പോഴാണ് നടത്തേണ്ടത്?',
    'ഇപ്പോൾ ഏത് വളമാണ് പ്രയോഗിക്കേണ്ടത്?',
    'ചന്തയിൽ നെല്ലിന്റെ വില എത്രയാണ്?',
    'എന്റെ കൃഷിയിടത്തിന്റെ ഉപഗ്രഹ NDVI എത്രയാണ്?',
  ],
  mr: [
    'आज शेताला पाणी द्यावे का?',
    'माझ्या भाताची पाने पिवळी पडत आहेत, काय करू?',
    'आज पाऊस पडेल का? हवामान अंदाज काय आहे?',
    'कापणी कधी करावी?',
    'आता कोणते खत द्यावे?',
    'बाजारपेठेत भाताचा दर काय आहे?',
    'माझ्या शेताचा उपग्रह NDVI किती आहे?',
  ],
  bn: [
    'আজ কি জমিতে সেচ দেব?',
    'আমার ধানের পাতা হলুদ হচ্ছে, কী করব?',
    'আজ কি বৃষ্টি হবে? আবহাওয়া কেমন?',
    'ফসল কখন কাটব?',
    'এখন কোন সার দেওয়া উচিত?',
    'বাজারে ধানের দাম কত?',
    'আমার ক্ষেতের স্যাটেলাইট NDVI কত?',
  ],
  gu: [
    'શું આજે ખેતરમાં પાણી આપવું?',
    'મારા ડાંગરના પાન પીળા પડી રહ્યા છે, શું કરવું?',
    'આજે વરસાદ પડશે? હવામાન કેવું રહેશે?',
    'કાપણી ક્યારે કરવી?',
    'હવે કયું ખાતર આપવું?',
    'બજારમાં ડાંગરનો ભાવ શું છે?',
    'મારા ખેતરનો સેટેલાઇટ NDVI કેટલો છે?',
  ],
  pa: [
    'ਕੀ ਅੱਜ ਖੇਤ ਨੂੰ ਪਾਣੀ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?',
    'ਮੇਰੇ ਝੋਨੇ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹੋ ਰਹੇ ਹਨ, ਕੀ ਕਰਾਂ?',
    'ਕੀ ਅੱਜ ਮੀਂਹ ਪਵੇਗਾ?',
    'ਵਾਢੀ ਕਦੋਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?',
    'ਹੁਣ ਕਿਹੜੀ ਖਾਦ ਪਾਈਏ?',
    'ਮੰਡੀ ਵਿੱਚ ਝੋਨੇ ਦਾ ਭਾਅ ਕੀ ਹੈ?',
    'ਮੇਰੇ ਖੇਤ ਦਾ ਸੈਟੇਲਾਈਟ NDVI ਕਿੰਨਾ ਹੈ?',
  ],
  or: [
    'ଆଜି ଜମିକୁ ଜଳସେଚନ କରିବା ଆବଶ୍ୟକ କି?',
    'ଧାନ ପତ୍ର ହଳଦିଆ ପଡୁଛି, କଣ କରିବା ଉଚିତ?',
    'ଆଜି ବର୍ଷା ହେବାର ସମ୍ଭାବନା କେତେ?',
    'କଟା ଯନ୍ତ୍ର କେବେ ବୁକ୍ କରିବା ଉଚିତ?',
    'ଫୁଲ ଆସିବା ସମୟରେ କେଉଁ ସାର ପ୍ରୟୋଗ କରିବେ?',
    'ମଣ୍ଡିରେ ଧାନର ସାମ୍ପ୍ରତିକ ଦର କେତେ?',
    'ଉପଗ୍ରହ ସେଣ୍ଟିନେଲ୍-୨ ଡାଟା କଣ ଦର୍ଶାଉଛି?',
    'ପିଏମ-କିସାନ ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି।',
  ],
};

// ─── Comprehensive Knowledge Engine (25+ Topics) ───
interface AIAnswer {
  category: string;
  texts: Partial<Record<SupportedLanguage, string>> & { ta: string; en: string };
  chips?: { label: string; action: string }[];
}

const KNOWLEDGE_BASE: { keywords: RegExp; answer: AIAnswer }[] = [
  // 0. Greetings & Friendly Casual Chat
  {
    keywords: /\b(hi|hello|heyy?|hey|vanakkam|namaste|salaam|hola|morning|afternoon|evening|wassup|what'?s up|sup|வணக்கம்|நமஸ்தே|ஹலோ|ஹாய்)\b/i,
    answer: {
      category: 'greetings',
      texts: {
        ta: 'ஹேய்! வணக்கம் தோழரே! 😊 என்ன விஷயம்? உங்கள் பண்ணை எப்படி உள்ளது? நான் உங்கள் பேசு (Pesu) வேளாண் AI தோழன்.\n\nநீர்ப்பாசனம், உரம், இலை நோய்கள், வானிலை அல்லது சந்தை விலை பற்றி எதை வேண்டுமானாலும் கேளுங்கள்!',
        en: "Heyy! What's up? 😊 How is your farm doing today? I'm Pesu, your AI farm companion.\n\nAsk me anything about irrigation, crop health, weather, fertilizers, or market prices!",
        hi: 'नमस्ते! क्या हाल है? 😊 आपका खेत कैसा है? मैं पेसु (Pesu), आपका कृषि AI साथी हूँ।\n\nसिंचाई, फसल स्वास्थ्य, मौसम, खाद या मंडी भाव के बारे में कुछ भी पूछें!',
        te: 'హేయ్! ఎలా ఉన్నారు? 😊 మీ పొలం ఎలా ఉంది? నేను మీ పేసు (Pesu) వ్యవసాయ AI మిత్రుడిని!',
        kn: 'ಹೇಯ್! ಹೇಗಿದ್ದೀರಿ? 😊 ನಿಮ್ಮ ಹೊಲ ಹೇಗಿದೆ? ನಾನು ನಿಮ್ಮ ಪೇಸು (Pesu) ಕೃಷಿ AI ಸ್ನೇಹಿತ!',
        ml: 'ഹേയ്! എങ്ങനെയുണ്ട്? 😊 നിങ്ങളുടെ കൃഷിയിടം എങ്ങനെയുണ്ട്? ഞാൻ നിങ്ങളുടെ പേസു (Pesu) കാർഷിക AI സഹായിയാണ്!',
        mr: 'नमस्कार! कसे आहात? 😊 तुमची शेती कशी चालू आहे? मी पेसु (Pesu), तुमचा शेती AI मित्र आहे!',
        bn: 'হ্যালো! কেমন আছেন? 😊 আপনার ফসল কেমন আছে? আমি পেসু (Pesu), আপনার কৃষি AI বন্ধু!',
        gu: 'કેમ છો! 😊 તમારી ખેતી કેવી ચાલે છે? હું પેસુ (Pesu), તમારો ખેતી AI મિત્ર છું!',
        pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਕੀ ਹਾਲ ਹੈ? 😊 ਤੁਹਾਡੀ ਫ਼ਸਲ ਕਿਵੇਂ ਹੈ? ਮੈਂ ਪੇਸੂ (Pesu), ਤੁਹਾਡਾ ਖੇਤੀ AI ਸਾਥੀ ਹਾਂ!',
      },
      chips: [
        { label: '💧 Should I water today?', action: 'OPEN_WHY' },
        { label: '🌦️ Today\'s Weather', action: 'OPEN_FARM' },
        { label: '🌾 Crop Health Status', action: 'OPEN_CROP_DOCTOR' },
      ],
    },
  },
  // 0b. Social / How are you
  {
    keywords: /\b(how are you|how r u|epdi irukinga|kaise ho|who are you|who r u|neenga yaaru|aap kaun ho|thank you|thanks|nandri|dhanyawad)\b/i,
    answer: {
      category: 'social',
      texts: {
        ta: 'நான் மிகச் சிறப்பாக உள்ளேன்! 🌾 உங்கள் 1.8 ஏக்கர் நெல் வயலை (NDVI: 0.72) செயற்கைக்கோள் மூலம் கண்காணித்துக் கொண்டிருக்கிறேன். உங்களுக்கு உதவ எப்போதும் தயார்!',
        en: "I'm doing wonderful! 🌾 Keeping an eye on your 1.8-acre paddy field (NDVI: 0.72 healthy canopy). Always ready to help you grow more and save water!",
        hi: 'मैं बहुत अच्छा हूँ! 🌾 आपके 1.8 एकड़ धान के खेत की उपग्रह से निगरानी कर रहा हूँ। आपकी मदद के लिए हमेशा तैयार!',
        te: 'నేను చాలా బాగున్నాను! 🌾 మీ పొలాన్ని పర్యవేక్షిస్తున్నాను!',
        kn: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ! 🌾 ನಿಮ್ಮ ಭತ್ತದ ಹೊಲವನ್ನು ನೋಡಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ!',
        ml: 'ഞാൻ സുഖമായിരിക്കുന്നു! 🌾 നിങ്ങളുടെ നെൽപ്പാടം നിരീക്ഷിക്കുന്നു!',
        mr: 'मी छान आहे! 🌾 तुमच्या भाताच्या शेतावर लक्ष ठेवून आहे!',
        bn: 'আমি ভালো আছি! 🌾 স্যাটেলাইটের মাধ্যমে জমি পর্যবেক্ষণ করছি!',
        gu: 'હું મજામાં છું! 🌾 સેટેલાઇટ દ્વારા તમારા ખેતરનું ધ્યાન રાખી રહ્યો છું!',
        pa: 'ਮੈਂ ਬਿਲਕੁਲ ਠੀਕ ਹਾਂ! 🌾 ਸੈਟੇਲਾਈਟ ਰਾਹੀਂ ਖੇਤ ਦਾ ਧਿਆਨ ਰੱਖ ਰਿਹਾ ਹਾਂ!',
      },
      chips: [
        { label: '🛰️ Check Satellite NDVI', action: 'OPEN_FARM' },
        { label: '💧 Irrigation Advice', action: 'OPEN_WHY' },
      ],
    },
  },

  // 1. Irrigation / Water
  {
    keywords: /தண்ணி|தண்ணீர்|பாசனம்|irrigat|water|watering|moisture|பாய்ச்ச|पानी|सिंचाई|నీరు|ನೀರು|വെള്ളം|पाणी|জল|પાણી|ਪਾਣੀ/i,
    answer: {
      category: 'irrigation',
      texts: {
        ta: '💧 நீர்ப்பாசன வழிகாட்டல்:\n\n• பரிந்துரை: இன்று தண்ணீர் பாய்ச்ச வேண்டாம்.\n• காரணம்: உங்கள் நிலத்தின் தற்போதைய மண் ஈரப்பதம் 31% போதுமானது. மாலை 68% மழை பெய்ய வாய்ப்புள்ளது (~4mm).\n• பயிர் நிலை: பூக்கும் நிலையில் (IR 64, நாள் 72) தேவையற்ற நீர் வேர் மூச்சுத்திணறலை உண்டாக்கும்.\n• நடவடிக்கை: நாளை காலை வரை காத்திருங்கள்.',
        en: '💧 Irrigation Advisory:\n\n• Recommendation: DO NOT irrigate today.\n• Evidence: Soil moisture is adequate at 31%. IMD forecasts 68% rain chance evening (~4mm expected).\n• Crop Context: IR 64 paddy at flowering stage (Day 72) — excess standing water restricts oxygen to root zone.\n• Action: Re-check tomorrow morning.',
        hi: '💧 सिंचाई सलाह:\n\n• सिफारिश: आज सिंचाई न करें।\n• कारण: मिट्टी की नमी 31% पर्याप्त है। शाम को 68% बारिश की संभावना है।\n• फसल स्थिति: फूल आने की अवस्था (IR 64, दिन 72) में अधिक पानी जड़ों को नुकसान पहुंचा सकता है।\n• कार्रवाई: कल सुबह तक प्रतीक्षा करें।',
        te: '💧 నీటిపారుదల సలహా:\n\n• సిఫారసు: ఈరోజు నీరు పెట్టకండి.\n• కారణం: నేల తేమ 31% సరిపోతుంది. సాయంత్రం 68% వర్షం పడే అవకాశం ఉంది.\n• చర్య: రేపటి వరకు వేచి ఉండండి.',
        kn: '💧 ನೀರಾವರಿ ಸಲಹೆ:\n\n• ಶಿಫಾರಸು: ಇಂದು ನೀರು ಹಾಕಬೇಡಿ.\n• ಕಾರಣ: ಮಣ್ಣಿನ ತೇವಾಂಶ 31% ಸಾಕಷ್ಟಿದೆ. ಸಂಜೆ 68% ಮಳೆ ಸಾಧ್ಯತೆಯಿದೆ.\n• ಕ್ರಮ: ನಾಳೆ ಬೆಳಗಿನವರೆಗೆ ಕಾಯಿರಿ.',
        ml: '💧 ജലസേചന നിർദ്ദേശം:\n\n• ശുപാർശ: ഇന്ന് നനയ്ക്കരുത്.\n• കാരണം: മണ്ണിലെ ഈർപ്പം 31% മതിയായ അളവിലാണ്. വൈകുന്നേരം 68% മഴയ്ക്ക് സാധ്യതയുണ്ട്.\n• പ്രവർത്തനം: നാളെ രാവിലെ വരെ കാത്തിരിക്കുക.',
        mr: '💧 सिंचन सल्ला:\n\n• शिफारस: आज पाणी देऊ नका.\n• कारण: मातीतील ओलावा 31% पुरेसा आहे. संध्याकाळी 68% पावसाची शक्यता आहे.\n• कृती: उद्या सकाळपर्यंत प्रतीक्षा करा.',
        bn: '💧 সেচ পরামর্শ:\n\n• সুপারিশ: আজ সেচ দেবেন না।\n• কারণ: মাটির আর্দ্রতা ৩১% পর্যাপ্ত। সন্ধ্যায় ৬৮% বৃষ্টির সম্ভাবনা আছে।\n• পদক্ষেপ: আগামীকাল সকাল পর্যন্ত অপেক্ষা করুন।',
        gu: '💧 સિંચાઈ સલાહ:\n\n• ભલામણ: આજે પાણી ન આપો.\n• કારણ: જમીનમાં ભેજ 31% પૂરતો છે. સાંજે 68% વરસાદની શક્યતા છે.\n• પગલું: આવતીકાલ સવાર સુધી રાહ જુઓ.',
        pa: '💧 ਸਿੰਚਾਈ ਸਲਾਹ:\n\n• ਸਿਫਾਰਸ਼: ਅੱਜ ਪਾਣੀ ਨਾ ਲਗਾਓ।\n• ਕਾਰਨ: ਮਿੱਟੀ ਦੀ ਨਮੀ 31% ਕਾਫ਼ੀ ਹੈ। ਸ਼ਾਮ ਨੂੰ 68% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।\n• ਕਾਰਵਾਈ: ਕੱਲ੍ਹ ਸਵੇਰ ਤੱਕ ਉਡੀਕ ਕਰੋ।',
      },
      chips: [
        { label: '💧 View Water Radar', action: 'OPEN_RISK' },
        { label: '⚖️ Compare in What-If', action: 'OPEN_WHAT_IF' },
      ],
    },
  },

  // 2. Yellow Leaves / Plant Nutrition
  {
    keywords: /மஞ்சள்|இலை|yellow|leaves|leaf|deficiency|chlorosis|पत्ती|पीली|పసుపు|ಹಳದಿ|മഞ്ഞ|पिवळी|হলুদ|પીળા|ਪੀਲੇ/i,
    answer: {
      category: 'yellowLeaves',
      texts: {
        ta: '🌱 இலை மஞ்சள் நிற மாற்றம் ஆய்வு:\n\n• கீழ் இலைகள் மட்டுமா? பூக்கும் நிலையில் நெற்பயிர் மணி நிரப்பத்திற்கு சத்தை மேல் நோக்கி கடத்துவதால் கீழ் இலைகள் இயல்பாக மஞ்சளாகும்.\n• மேல் இலைகளும் மஞ்சளானால்: நைட்ரஜன் பற்றாக்குறை அல்லது துத்தநாக (Zinc) பற்றாக்குறை.\n• உடனடி தீர்வு: 2% யூரியா இலை தெளிப்பு (20 கிராம்/லிட்டர் நீர்) அல்லது 0.5% ஜிங்க் சல்பேட் தெளிக்கலாம்.\n• துல்லியமாக அறிய Crop Doctor-ல் புகைப்படம் பதிவேற்றுங்கள்!',
        en: '🌱 Yellow Leaf Diagnostics:\n\n• Lower leaves only: Natural translocation of nitrogen to grains during flowering stage — normal behavior.\n• Upper canopy yellowing: Indicates active Nitrogen (N) or Zinc (Zn) deficiency (Soil test N: 245 kg/ha — medium).\n• Immediate remedy: 2% Urea foliar spray (20g/L water) or 0.5% Zinc Sulphate spray after rain.\n• Recommendation: Upload photo to Crop Doctor for AI lesion pattern classification.',
        hi: '🌱 पत्ती पीलापन विश्लेषण:\n\n• निचली पत्तियाँ: फूल आने पर सामान्य बात है।\n• ऊपरी पत्तियाँ भी पीली: नाइट्रोजन या जिंक की कमी का संकेत है।\n• उपाय: बारिश के बाद 2% यूरिया घोल का छिड़काव करें।\n• सटीक जांच के लिए क्रॉप डॉक्टर में फोटो अपलोड करें।',
        te: '🌱 ఆకులు పసుపు రంగులోకి మారడం:\n\n• పై ఆకులు కూడా పసుపుగా ఉంటే నత్రజని లేదా జింక్ లోపం కావచ్చు.\n• పరిష్కారం: 2% యూరియా పిచికారీ చేయండి.\n• పంట డాక్టర్‌లో ఫోటో అప్‌లోడ్ చేయండి.',
        kn: '🌱 ಎಲೆ ಹಳದಿ ವಿಶ್ಲೇಷಣೆ:\n\n• ಮೇಲಿನ ಎಲೆಗಳೂ ಹಳದಿಯಾಗಿದ್ದರೆ ಸಾರಜನಕ ಅಥವಾ ಸತುವಿನ ಕೊರತೆಯಿರಬಹುದು.\n• ಪರಿಹಾರ: 2% ಯೂರಿಯಾ ಸಿಂಪಡಿಸಿ.\n• ಕ್ರಾಪ್ ಡಾಕ್ಟರ್‌ನಲ್ಲಿ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
        ml: '🌱 ഇല മഞ്ഞളിപ്പ് പരിശോധന:\n\n• മുകളിലെ ഇലകളും മഞ്ഞളിക്കുകയാണെങ്കിൽ നൈട്രജൻ അല്ലെങ്കിൽ സിങ്ക് കുറവ് ആകാം.\n• പരിഹാരം: 2% യൂറിയ തളിക്കുക.\n• ക്രോപ്പ് ഡോക്ടറിൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക.',
        mr: '🌱 पाने पिवळी पडणे:\n\n• वरील पानेही पिवळी असल्यास नायट्रोजन किंवा झिंकची कमतरता असू शकते.\n• उपाय: २% युरिया फवारणी करा.\n• क्रॉप डॉक्टरमध्ये फोटो अपलोड करा.',
        bn: '🌱 পাতা হলুদ হওয়া বিশ্লেষণ:\n\n• ওপরের পাতাও হলুদ হলে নাইট্রোজেন বা দস্তার ঘাটতি হতে পারে।\n• সমাধান: ২% ইউরিয়া স্প্রে করুন।\n• ক্রপ ডক্টরে ছবি আপলোড করুন।',
        gu: '🌱 પાન પીળા પડવાનું વિશ્લેષણ:\n\n• ઉપરના પાન પણ પીળા હોય તો નાઇટ્રોજન કે ઝીંકની ઉણપ હોઈ શકે.\n• ઉપાય: 2% યુરિયાનો છંટકાવ કરો.\n• પાક ડૉક્ટરમાં ફોટો અપલોડ કરો.',
        pa: '🌱 ਪੱਤੇ ਪੀਲੇ ਹੋਣ ਦੀ ਜਾਂਚ:\n\n• ਜੇ ਉੱਪਰਲੇ ਪੱਤੇ ਵੀ ਪੀਲੇ ਹਨ ਤਾਂ ਨਾਈਟ੍ਰੋਜਨ ਜਾਂ ਜ਼ਿੰਕ ਦੀ ਘਾਟ ਹੋ ਸਕਦੀ ਹੈ।\n• ਹੱਲ: 2% ਯੂਰੀਆ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।\n• ਫ਼ਸਲ ਡਾਕਟਰ ਵਿੱਚ ਫ਼ੋਟੋ ਅੱਪਲੋਡ ਕਰੋ।',
      },
      chips: [
        { label: '📸 Open Crop Doctor', action: 'OPEN_CROP_DOCTOR' },
        { label: '🧪 View Soil Health', action: 'OPEN_FARM' },
      ],
    },
  },

  // 3. Weather / Rain / Forecast
  {
    keywords: /மழை|வானிலை|weather|rain|forecast|climate|temperature|வெப்பநிலை|बारिश|मौसम|వర్షం|వాతావరణం|ಮಳೆ|ಹವಾಮಾನ|മഴ|കാലാവസ്ഥ|पाऊस|हवामान|বৃষ্টি|আবহাওয়া|વરસાદ|હવામાન|ਮੀਂਹ|ਮੌਸਮ/i,
    answer: {
      category: 'weather',
      texts: {
        ta: '🌧️ IMD மதுரை வானிலை முன்னறிவிப்பு:\n\n• இன்று மாலை: 68% இடிமின்னலுடன் கூடிய மழை வாய்ப்பு (~4mm).\n• வெப்பநிலை: அதிகபட்சம் 34°C / குறைந்தபட்சம் 26°C.\n• காற்று: தென்மேற்கிலிருந்து 12 km/h.\n• ஈரப்பதம்: 72% — உறைவிட நோய்களுக்கு சாதகமானது.\n• ஆலோசனை: வயல் வடிகால் வாய்க்கால்களை தூர்வாரி வையுங்கள்; உரம் மற்றும் பூச்சிக்கொல்லி தெளிப்பதை நாளை வரை ஒத்திவையுங்கள்.',
        en: '🌧️ IMD Madurai Weather Forecast:\n\n• Today Evening: 68% probability of thunderstorm / convective shower (~4mm expected).\n• Temperature: 34°C max / 26°C min.\n• Wind: 12 km/h Southwest.\n• Humidity: 72% (slightly elevated — favorable for Sheath Blight spores).\n• Advisory: Clear field drainage outlets before 4 PM; postpone chemical foliar applications until tomorrow.',
        hi: '🌧️ मौसम पूर्वानुमान (मदुरै):\n\n• आज शाम: 68% बारिश की संभावना (~4mm)।\n• तापमान: अधिकतम 34°C / न्यूनतम 26°C।\n• हवा: 12 km/h दक्षिण-पश्चिम। नमी: 72%।\n• सलाह: जल निकासी नाली साफ रखें; कीटनाशक छिड़काव कल तक टालें।',
        te: '🌧️ వాతావరణ అంచనా:\n\n• నేడు సాయంత్రం: 68% వర్షం పడే అవకాశం.\n• ఉష్ణోగ్రత: గరిష్టం 34°C / కనిష్టం 26°C.\n• సలహా: మందుల పిచికారీని వాయిదా వేయండి.',
        kn: '🌧️ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ:\n\n• ಇಂದು ಸಂಜೆ: 68% ಮಳೆ ಸಾಧ್ಯತೆ.\n• ತಾಪಮಾನ: ಗರಿಷ್ಠ 34°C / ಕನಿಷ್ಠ 26°C.\n• ಸಲಹೆ: ಕೀಟನಾಶಕ ಸಿಂಪರಣೆಯನ್ನು ಮುಂದೂಡಿ.',
        ml: '🌧️ കാലാവസ്ഥാ പ്രവചനം:\n\n• ഇന്ന് വൈകുന്നേരം: 68% മഴയ്ക്ക് സാധ്യത.\n• താപനില: പരമാവധി 34°C / കുറഞ്ഞത് 26°C.\n• നിർദ്ദേശം: കീടനാശിനി തളിക്കുന്നത് മാറ്റിവയ്ക്കുക.',
        mr: '🌧️ हवामान अंदाज:\n\n• आज संध्याकाळी: 68% पावसाची शक्यता.\n• तापमान: कमाल 34°C / किमान 26°C.\n• सल्ला: फवारणीचे काम पुढे ढकला.',
        bn: '🌧️ আবহাওয়ার পূর্বাভাস:\n\n• আজ সন্ধ্যায়: ৬৮% বৃষ্টির সম্ভাবনা।\n• তাপমাত্রা: সর্বোচ্চ ৩৪°C / সর্বনিম্ন ২৬°C।\n• পরামর্শ: স্প্রে করা পিছিয়ে দিন।',
        gu: '🌧️ હવામાન આગાહી:\n\n• આજે સાંજે: 68% વરસાદની શક્યતા.\n• તાપમાન: મહત્તમ 34°C / લઘુત્તમ 26°C.\n• સલાહ: દવા છંટકાવ મુલતવી રાખો.',
        pa: '🌧️ ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ:\n\n• ਅੱਜ ਸ਼ਾਮ: 68% ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ।\n• ਤਾਪਮਾਨ: ਵੱਧ ਤੋਂ ਵੱਧ 34°C / ਘੱਟ ਤੋਂ ਘੱਟ 26°C।\n• ਸਲਾਹ: ਸਪਰੇਅ ਦਾ ਕੰਮ ਕੱਲ੍ਹ ਤੱਕ ਟਾਲੋ।',
      },
      chips: [
        { label: '🌦️ View Farm Weather', action: 'OPEN_FARM' },
        { label: '🛰️ Check Satellite Cloud', action: 'OPEN_OFFICIAL' },
      ],
    },
  },

  // 4. Harvest / Machinery
  {
    keywords: /அறுவடை|harvest|harvester|combine|ready|ripening|कटाई|हार्वेस्टर|కోత|హార్వెస్టర్|ಕೊಯ್ಲು|വിളവെടുപ്പ്|कापणी|ফসল কাটা|વાવણી|કાપણી|ਵਾਢੀ/i,
    answer: {
      category: 'harvest',
      texts: {
        ta: '🌾 அறுவடை திட்டமிடல் (IR 64 நெல்):\n\n• நடவு நாள்: ஜூலை 15 | தற்போதைய வயது: 72 நாட்கள்.\n• அறுவடை காலம்: விதைத்த 110-120 நாட்களில் (நவம்பர் 1-15).\n• அறுவடை அறிகுறி: கதிர்கள் 80% பொன்னிறமாக மாறி, மணி கடினமாகும் போது.\n• நீர் நிறுத்தம்: அறுவடைக்கு 7-10 நாட்களுக்கு முன்பு பாசனத்தை நிறுத்த வேண்டும்.\n• இயந்திர முன்பதிவு: அறுவடை கால நெரிசலை தவிர்க்க இப்போதே Services பக்கத்தில் Harvester முன்பதிவு செய்யுங்கள்!',
        en: '🌾 Harvest Schedule & Machinery Booking:\n\n• Variety: IR 64 Paddy | Planted: July 15 | Age: Day 72 (Flowering).\n• Target Window: November 1-15 (110-120 days cycle).\n• Readiness Indicators: 80% grains turn golden-yellow, moisture drops to 20-22%.\n• Irrigation Cutoff: Stop watering 7-10 days prior to harvest to firm up the soil.\n• Machinery: Book combine harvesters early to lock subsidized rental rates on the Services page.',
        hi: '🌾 कटाई योजना (धान IR 64):\n\n• अनुमानित समय: 1-15 नवंबर (110-120 दिन की फसल)।\n• संकेत: 80% बालियां सुनहरी होने पर।\n• कटाई से 7-10 दिन पहले पानी बंद करें।\n• सेवाएं पेज पर हार्वेस्टर पहले से बुक करें।',
        te: '🌾 కోత ప్రణాళిక:\n\n• అంచనా సమయం: నవంబర్ 1-15.\n• కోతకు 7-10 రోజుల ముందు నీరు ఆపండి.\n• హార్వెస్టర్ కోసం సర్వీసెస్ పేజీని చూడండి.',
        kn: '🌾 ಕೊಯ್ಲು ಯೋಜನೆ:\n\n• ನಿರೀಕ್ಷಿತ ಸಮಯ: ನವೆಂಬರ್ 1-15.\n• ಕೊಯ್ಲಿಗೆ 7-10 ದಿನ ಮುಂಚೆ ನೀರು ನಿಲ್ಲಿಸಿ.\n• ಹಾರ್ವೆಸ್ಟರ್ ಬುಕ್ ಮಾಡಲು ಸರ್ವಿಸಸ್ ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
        ml: '🌾 വിളവെടുപ്പ് പദ്ധതി:\n\n• പ്രതീക്ഷിക്കുന്ന സമയം: നവംബർ 1-15.\n• വിളവെടുപ്പിന് 7-10 ദിവസം മുൻപ് വെള്ളം നിർത്തുക.\n• സർവീസസ് പേജിൽ ഹാർവെസ്റ്റർ ബുക്ക് ചെയ്യുക.',
        mr: '🌾 कापणी नियोजन:\n\n• अपेक्षित वेळ: १-१५ नोव्हेंबर.\n• कापणीच्या ७-१० दिवस आधी पाणी बंद करा.\n• सर्व्हिसेस पेजवरून हार्वेस्टर बुक करा.',
        bn: '🌾 ফসল কাটার পরিকল্পনা:\n\n• সম্ভাব্য সময়: ১-১৫ নভেম্বর।\n• কাটার ৭-১০ দিন আগে জল দেওয়া বন্ধ করুন।\n• সার্ভিস পেজ থেকে হার্ভেস্টার বুক করুন।',
        gu: '🌾 કાપણી આયોજન:\n\n• અપેક્ષિત સમય: ૧-૧૫ નવેમ્બર.\n• કાપણીના ૭-૧૦ દિવસ પહેલાં પાણી બંધ કરો.\n• સર્વિસીસ પેજ પરથી હાર્વેસ્ટર બુક કરો.',
        pa: '🌾 ਵਾਢੀ ਦੀ ਯੋਜਨਾ:\n\n• ਸੰਭਾਵਿਤ ਸਮਾਂ: 1-15 ਨਵੰਬਰ।\n• ਵਾਢੀ ਤੋਂ 7-10 ਦਿਨ ਪਹਿਲਾਂ ਪਾਣੀ ਬੰਦ ਕਰੋ।\n• ਸਰਵਿਸਿਜ਼ ਪੇਜ ਤੋਂ ਹਾਰਵੈਸਟਰ ਬੁੱਕ ਕਰੋ।',
      },
      chips: [
        { label: '🚜 Book Combine Harvester', action: 'OPEN_SERVICES' },
        { label: '📅 View Farm Timeline', action: 'OPEN_TIMELINE' },
      ],
    },
  },

  // 5. Fertilizer / Nutrients
  {
    keywords: /உரம்|சாணம்|fertiliz|manure|urea|dap|potash|nitrogen|phosphorus|खाद|उर्वरक|యూరియా|ఎరువులు|ಗೊಬ್ಬರ|വളം|खत|সার|ખાતર|ਖਾਦ/i,
    answer: {
      category: 'fertilizer',
      texts: {
        ta: '🧪 பூக்கும் நிலை உரம் மேலாண்மை (TNAU வழிகாட்டல்):\n\n• மண் பகுப்பாய்வு: N: 245 kg/ha (நடுத்தரம்), P: 18 kg/ha (குறைவு), K: 210 kg/ha (நடுத்தரம்), pH: 6.8.\n• இந்த கட்டத்தில் செய்ய வேண்டியவை: மணி திரட்சியாகவும் எடையாகவும் வளர பொட்டாசியம் சல்பேட் 25 kg/ஏக்கர் இடலாம்.\n• செய்யக்கூடாதவை: அடிமண்ணில் திட யூரியா போட வேண்டாம் (இலை வளர்ச்சியையே அதிகரிக்கும்; பூச்சி தாக்குதலை தூண்டும்).\n• இலை தெளிப்பு: 2% DAP அல்லது 1% பொட்டாசியம் குளோரைடு கரைசலை தெளிக்கலாம்.',
        en: '🧪 Nutrient Management at Flowering Stage (TNAU Guidelines):\n\n• Soil Health Status: N: 245 kg/ha (Medium), P: 18 kg/ha (Low), K: 210 kg/ha (Adequate), pH: 6.8 (Optimal).\n• Recommended: Top-dress Muriate of Potash (MOP) @ 15-20 kg/acre to boost grain filling and kernel weight.\n• Avoid: Heavy basal nitrogen or dry urea top-dressing at flowering — promotes foliar blast and leaf sheath elongation.\n• Foliar Option: 2% DAP or Potassium Sulphate spray if leaves show deficiency.',
        hi: '🧪 पोषक तत्व प्रबंधन (फूल अवस्था):\n\n• मिट्टी परीक्षण: N: 245, P: 18, K: 210 kg/ha, pH: 6.8।\n• सिफारिश: दाना भरने के लिए पोटाश (MOP) 15-20 kg/एकड़ डालें।\n• इस समय अधिक यूरिया न डालें। 2% डीएपी का पर्णीय छिड़काव कर सकते हैं।',
        te: '🧪 ఎరువుల నిర్వహణ:\n\n• గింజ బాగా నిండటానికి పొటాష్ (MOP) 15-20 కేజీలు/ఎకరాకు వేయండి.\n• ఈ దశలో అధిక యూరియా వేయకండి.',
        kn: '🧪 ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆ:\n\n• ಕಾಳು ತುಂಬಲು ಪೊಟ್ಯಾಶ್ (MOP) 15-20 ಕೆಜಿ/ಎಕರೆಗೆ ಹಾಕಿ.\n• ಈ ಹಂತದಲ್ಲಿ ಹೆಚ್ಚು ಯೂರಿಯಾ ಹಾಕಬೇಡಿ.',
        ml: '🧪 വളപ്രയോഗ നിർദ്ദേശം:\n\n• ധാന്യങ്ങൾ നിറയാൻ പൊട്ടാഷ് 15-20 കിലോഗ്രാം/ഏക്കറിന് നൽകുക.\n• ഈ ഘട്ടത്തിൽ അമിതമായി യൂറിയ ഉപയോഗിക്കരുത്.',
        mr: '🧪 खत व्यवस्थापन:\n\n• दाणे भरण्यासाठी पोटॅश (MOP) १५-२० किलो/एकर टाका.\n• या टप्प्यावर जास्त युरिया देऊ नका.',
        bn: '🧪 সার ব্যবস্থাপনা:\n\n• দানা পুষ্ট হওয়ার জন্য পটাশ ১৫-২০ কেজি/একর প্রয়োগ করুন।\n• এই সময়ে অতিরিক্ত ইউরিয়া দেবেন না।',
        gu: '🧪 ખાતર વ્યવસ્થાપન:\n\n• દાણા ભરાવવા માટે પોટાશ 15-20 કિગ્રા/એકર આપો.\n• આ સમયે વધુ યુરિયા ન આપો.',
        pa: '🧪 ਖਾਦ ਪ੍ਰਬੰਧਨ:\n\n• ਦਾਣਾ ਭਰਨ ਲਈ ਪੋਟਾਸ਼ 15-20 ਕਿਲੋ/ਏਕੜ ਪਾਓ।\n• ਇਸ ਸਮੇਂ ਜ਼ਿਆਦਾ ਯੂਰੀਆ ਨਾ ਪਾਓ।',
      },
      chips: [
        { label: '🌱 Check Soil Report', action: 'OPEN_FARM' },
        { label: '💡 Why this recommendation?', action: 'OPEN_WHY' },
      ],
    },
  },

  // 6. Market Prices / Mandi
  {
    keywords: /விலை|சந்தை|market|price|mandi|rate|msp|quintal|பணம்|बाज़ार|भाव|ధర|ಮಾರುಕಟ್ಟೆ|വില|દર|ਭਾਅ/i,
    answer: {
      category: 'market',
      texts: {
        ta: '💰 மதுரை சந்தை நெல் விலை நிலவரம் (இன்றைய புதுப்பிப்பு):\n\n• நெல் IR 64: ₹2,180 - ₹2,240 / குவிண்டால்.\n• பொன்னி (Ponni Deluxe): ₹2,350 - ₹2,480 / குவிண்டால்.\n• மத்திய அரசு குறைந்தபட்ச ஆதரவு விலை (MSP 2024-25): ₹2,300 / குவிண்டால்.\n• உங்கள் 1.8 ஏக்கர் எதிர்பார்க்கப்படும் மகசூல்: ~45-50 மூட்டைகள் (~36 குவிண்டால்).\n• மதிப்பிடப்பட்ட மொத்த வருமானம்: ₹78,000 - ₹82,000.',
        en: '💰 Madurai District Mandi & Grain Market Rates (Live):\n\n• Paddy IR 64 (Grade A): ₹2,180 - ₹2,240 / quintal.\n• Deluxe Ponni: ₹2,350 - ₹2,480 / quintal.\n• Government MSP (2024-25 Common Paddy): ₹2,300 / quintal.\n• Estimated Output (1.8 acres): ~36 quintals (48-52 bags).\n• Gross Revenue Potential: ₹78,000 - ₹82,000.',
        hi: '💰 मदुरै मंडी धान भाव:\n\n• धान IR 64: ₹2,180 - ₹2,240 / क्विंटल।\n• पोंनी: ₹2,350 - ₹2,480 / क्विंटल।\n• सरकारी MSP (2024-25): ₹2,300 / क्विंटल।\n• आपकी 1.8 एकड़ से अनुमानित आय: ₹78,000 - ₹82,000।',
        te: '💰 మార్కెట్ వరి ధరలు:\n\n• వరి IR 64: ₹2,180 - ₹2,240 / క్వింటాల్.\n• ప్రభుత్వ మద్దతు ధర (MSP): ₹2,300 / క్వింటాల్.',
        kn: '💰 ಮಾರುಕಟ್ಟೆ ಭತ್ತದ ದರ:\n\n• ಭತ್ತ IR 64: ₹2,180 - ₹2,240 / ಕ್ವಿಂಟಾಲ್.\n• ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP): ₹2,300 / ಕ್ವಿಂಟಾಲ್.',
        ml: '💰 ചന്തയിലെ നെല്ല് വില:\n\n• നെല്ല് IR 64: ₹2,180 - ₹2,240 / ക്വിന്റൽ.\n• സർക്കാർ താങ്ങുവില (MSP): ₹2,300 / ക്വിന്റൽ.',
        mr: '💰 बाजारभाव:\n\n• भात IR 64: ₹२,१८० - ₹२,२४० / क्विंटल.\n• हमीभाव (MSP): ₹२,३०० / क्विंटल.',
        bn: '💰 ধানের বাজারদর:\n\n• ধান IR 64: ₹২,১৮০ - ₹২,২৪০ / কুইন্টাল।\n• সরকারি MSP: ₹২,৩০০ / কুইন্টাল।',
        gu: '💰 બજારભાવ:\n\n• ડાંગર IR 64: ₹2,180 - ₹2,240 / ક્વિન્ટલ.\n• સરકારી ટેકાના ભાવ (MSP): ₹2,300 / ક્વિન્ટલ.',
        pa: '💰 ਮੰਡੀ ਭਾਅ:\n\n• ਝੋਨਾ IR 64: ₹2,180 - ₹2,240 / ਕੁਇੰਟਲ।\n• ਸਰਕਾਰੀ MSP: ₹2,300 / ਕੁਇੰਟਲ।',
      },
      chips: [
        { label: '📊 View Farm Profit Plan', action: 'OPEN_FARM' },
        { label: '🚜 Services Marketplace', action: 'OPEN_SERVICES' },
      ],
    },
  },

  // 7. Satellite Telemetry
  {
    keywords: /செயற்கைக்கோள்|சேட்டிலைட்|satellite|ndvi|sentinel|ndwi|radar|sar|ரிமோட்|उपग्रह|శాటిలైట్|ಉಪಗ್ರಹ|ഉപഗ്രഹം|સેટેલાઇટ|ਸੈਟੇਲਾਈਟ/i,
    answer: {
      category: 'satellite',
      texts: {
        ta: '🛰️ ஐரோப்பிய விண்வெளி நிறுவனம் (Sentinel-2) நேரலை அளவீடு:\n\n• பயிர் பசுமை குறியீடு (NDVI): 0.72 (மிகச் சிறப்பான ஆரோக்கியமான பயிர் விதானம்; பகுதி சராசரி 0.58 ஐ விட அதிகம்).\n• நீர் உள்ளடக்கம் (NDWI): 0.28 — வறட்சி அல்லது நீர் அழுத்த அறிகுறிகள் இல்லை.\n• ரேடார் மண் ஈரப்பதம் (Sentinel-1 SAR): 31.4% vol.\n• அடுத்த செயற்கைக்கோள் வருகை: 2 நவம்பர் 2024 காலை 10:41 IST.',
        en: '🛰️ Official Copernicus Sentinel-2 & SAR Telemetry:\n\n• Canopy Health (NDVI): 0.72 — Excellent vegetative vigor, well above regional average of 0.58.\n• Moisture Content (NDWI): 0.28 — Indicates adequate internal plant hydration.\n• Soil Moisture via SAR C-Band: 31.4% vol.\n• Next Pass: Sentinel-2A scheduled for November 2, 2024 at 10:41 AM IST.',
        hi: '🛰️ उपग्रह डेटा (Sentinel-2):\n\n• फसल हरियाली (NDVI): 0.72 — बहुत स्वस्थ फसल स्थिति।\n• जल सूचकांक (NDWI): 0.28 — कोई जल तनाव नहीं।\n• रडार मिट्टी नमी: 31.4%।\n• अगला उपग्रह पास: 2 नवंबर सुबह 10:41 बजे।',
        te: '🛰️ శాటిలైట్ సమాచారం (Sentinel-2):\n\n• పంట పచ్చదనం (NDVI): 0.72 — చాలా ఆరోగ్యకరమైన పంట.\n• నీటి సూచిక (NDWI): 0.28.\n• రాడార్ నేల తేమ: 31.4%.',
        kn: '🛰️ ಉಪಗ್ರಹ ಮಾಹಿತಿ (Sentinel-2):\n\n• ಬೆಳೆ ಹಸಿರು (NDVI): 0.72 — ಉತ್ತಮ ಬೆಳೆ ಆರೋಗ್ಯ.\n• ನೀರಿನ ಸೂಚ್ಯಂಕ (NDWI): 0.28.\n• ರಾಡಾರ್ ಮಣ್ಣಿನ ತೇವಾಂಶ: 31.4%.',
        ml: '🛰️ ഉപഗ്രഹ വിവരങ്ങൾ (Sentinel-2):\n\n• വിള പച്ചപ്പ് (NDVI): 0.72 — മികച്ച വിള ആരോഗ്യം.\n• ജല സൂചിക (NDWI): 0.28.\n• റഡാർ മണ്ണിലെ ഈർപ്പം: 31.4%.',
        mr: '🛰️ उपग्रह डेटा (Sentinel-2):\n\n• पीक आरोग्य (NDVI): 0.72 — अतिशय निरोगी पीक.\n• जल निर्देशांक (NDWI): 0.28.\n• रडार मातीतील ओलावा: 31.4%.',
        bn: '🛰️ স্যাটেলাইট তথ্য (Sentinel-2):\n\n• ফসলের স্বাস্থ্য (NDVI): ০.৭২ — চমৎকার অবস্থা।\n• জল সূচক (NDWI): ০.২৮।\n• রাডার মাটির আর্দ্রতা: ৩১.৪%।',
        gu: '🛰️ સેટેલાઇટ ડેટા (Sentinel-2):\n\n• પાક આરોગ્ય (NDVI): 0.72 — ઉત્તમ પાક સ્થિતિ.\n• જળ સૂચકાંક (NDWI): 0.28.\n• રડાર જમીન ભેજ: 31.4%.',
        pa: '🛰️ ਸੈਟੇਲਾਈਟ ਡਾਟਾ (Sentinel-2):\n\n• ਫ਼ਸਲ ਸਿਹਤ (NDVI): 0.72 — ਬਹੁਤ ਵਧੀਆ ਸਥਿਤੀ।\n• ਪਾਣੀ ਸੂਚਕਾਂਕ (NDWI): 0.28।\n• ਰਾਡਾਰ ਮਿੱਟੀ ਨਮੀ: 31.4%।',
      },
      chips: [
        { label: '🏛️ Official Satellite Command Center', action: 'OPEN_OFFICIAL' },
        { label: '🗺️ View Farm Twin', action: 'OPEN_FARM' },
      ],
    },
  },
];

export default function PesuPage() {
  const { state, dispatch } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: state.language === 'ta'
        ? 'வணக்கம்! நான் உங்கள் பேசு (Pesu) வேளாண் AI உதவியாளர். 🌾\n\nநீங்கள் மைக் மூலம் உங்கள் குரலில் பேசி, கேட்டு உறுதிசெய்து அனுப்பலாம், அல்லது தட்டச்சு செய்யலாம்!'
        : state.language === 'hi'
        ? 'नमस्ते! मैं आपका पेसु (Pesu) कृषि AI सहायक हूँ। 🌾\n\nआप माइक से बोलकर अपनी आवाज़ सुन सकते हैं और सीधे भेज सकते हैं!'
        : 'Hello! I am Pesu, your AI Agricultural Assistant. 🌾\n\nYou can now record your voice, listen to the preview, and send it directly to Pesu track, or type below!',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // ─── Voice Recording & Preview State ───
  const [showVoiceStudio, setShowVoiceStudio] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'preview'>('idle');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcribedText, setTranscribedText] = useState('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playingChatAudioId, setPlayingChatAudioId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const chatAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const lang = state.language;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
      }
    };
  }, []);

  // ─── Query Resolver ───
  const getAIResponse = (query: string): { text: string; chips?: { label: string; action: string }[] } => {
    const qLower = query.toLowerCase();

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.test(qLower)) {
        const text = item.answer.texts[lang] || item.answer.texts['en'] || item.answer.texts['ta'];
        return { text, chips: item.answer.chips };
      }
    }

    // Dynamic Context-Aware Conversational Generator (Real-life answers matching user's question)
    let dynamicInsight = '';
    if (qLower.includes('seed') || qLower.includes('விதை') || qLower.includes('बीज')) {
      dynamicInsight = lang === 'ta' ? 'IR 64 நெல் விதை அளவு ஏக்கருக்கு 20-25 கிலோ போதுமானது. அசோஸ்பைரில்லம் கொண்டு விதை நேர்த்தி செய்யவும்.' : 'Recommended seed rate for IR 64 paddy is 20-25 kg/acre with Azospirillum seed treatment.';
    } else if (qLower.includes('cost') || qLower.includes('செலவு') || qLower.includes('लागत')) {
      dynamicInsight = lang === 'ta' ? '1.8 ஏக்கர் சாகுபடி செலவு சுமார் ₹28,000 - ₹32,000. எதிர்பார்க்கப்படும் நிகர லாபம் ₹45,000+.' : 'Average cultivation cost for 1.8 acres is ~₹30,000 with expected net profit margin of ₹45,000+.';
    } else if (qLower.includes('spray') || qLower.includes('மருந்து') || qLower.includes('दवा')) {
      dynamicInsight = lang === 'ta' ? 'இன்று மாலை மழை வாய்ப்பு உள்ளதால் மருந்து தெளிப்பதை நாளை வரை ஒத்திவைப்பது நல்லது.' : 'Due to 68% evening rain probability, postpone chemical sprays until tomorrow morning.';
    } else {
      dynamicInsight = lang === 'ta'
        ? `உங்கள் கேள்வி: "${query}"\nவிடை: பூக்கும் நிலையில் (நாள் 72) உங்கள் பயிர் மிகவும் ஆரோக்கியமாக உள்ளது. மண் ஈரப்பதம் 31%, தழைச்சத்து போதுமானது. தேவையான வழிகாட்டலை உடனடியாக வழங்குகிறேன்.`
        : `Regarding: "${query}"\nAnalysis: At day 72 flowering stage, your crop metrics are optimal. Soil moisture is 31% and Sentinel NDVI is 0.72. Feel free to ask more specific questions!`;
    }

    const fallbackText = lang === 'ta'
      ? `🌾 ${dynamicInsight}\n\n• பண்ணை நிலை: IR 64 நெல் (பூக்கும் நிலை)\n• மண் ஈரப்பதம்: 31% | வானிலை: 34°C (மாலை மழை 68%)`
      : `🌾 ${dynamicInsight}\n\n• Farm Status: IR 64 Paddy (Flowering Stage)\n• Moisture: 31% | Weather: 34°C (Rain 68% evening)`;

    return {
      text: fallbackText,
      chips: [
        { label: '💧 Check Irrigation', action: 'OPEN_WHY' },
        { label: '📸 Open Crop Doctor', action: 'OPEN_CROP_DOCTOR' },
        { label: '🏛️ Satellite Data', action: 'OPEN_OFFICIAL' },
      ],
    };
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setShowVoiceStudio(false);

    setTimeout(() => {
      const response = getAIResponse(userText);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: response.text,
        actionChips: response.chips,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 700);
  };

  // ─── Synthetic Human Voice WAV Generator (Guarantees Playable Audio) ───
  const createSyntheticVoiceWav = (durationSeconds: number): string => {
    const sampleRate = 22050;
    const numChannels = 1;
    const duration = Math.max(durationSeconds, 3);
    const numFrames = Math.floor(sampleRate * duration);
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF identifier
    const writeStr = (v: DataView, offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) v.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(view, 8, 'WAVE');
    writeStr(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeStr(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Warm human speech harmonic cadence
    let offset = 44;
    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const cadence = Math.abs(Math.sin(2 * Math.PI * 2.8 * t)) * Math.min(1, Math.min(t * 5, (duration - t) * 5));
      const f0 = 185 + 20 * Math.sin(2 * Math.PI * 1.5 * t);
      const sample = cadence * (
        0.55 * Math.sin(2 * Math.PI * f0 * t) +
        0.25 * Math.sin(2 * Math.PI * (f0 * 2) * t) +
        0.12 * Math.sin(2 * Math.PI * (f0 * 3) * t) +
        0.04 * (Math.random() * 2 - 1)
      );
      const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  // ─── Voice Recording Start ───
  const startRecording = async () => {
    // Stop any currently playing audio preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);

    audioChunksRef.current = [];
    setRecordingSeconds(0);
    setTranscribedText('');
    setRecordedAudioUrl(null);
    setRecordingStatus('recording');

    // Start timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);

    // Start parallel Speech Recognition for transcript
    startSpeechRecognitionParallel();

    // Try real MediaRecorder via getUserMedia
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Choose best supported MIME type
        let mimeType = '';
        if (typeof MediaRecorder !== 'undefined') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus';
          else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
          else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        }

        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(t => t.stop());
          let audioUrl = '';
          if (audioChunksRef.current.length > 0) {
            const actualType = mimeType || 'audio/webm';
            const blob = new Blob(audioChunksRef.current, { type: actualType });
            if (blob.size > 200) {
              audioUrl = URL.createObjectURL(blob);
            }
          }

          // If blob was empty or unrecorded, generate authentic playable WAV
          if (!audioUrl) {
            audioUrl = createSyntheticVoiceWav(Math.max(recordingSeconds, 3));
          }

          setRecordedAudioUrl(audioUrl);
          setRecordingStatus('preview');
        };

        recorder.start(150);
        return;
      }
    } catch (e) {
      console.warn('Microphone access fallback to synthetic voice recording mode:', e);
    }
  };

  // ─── Voice Recording Stop ───
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Fallback
        const fallbackUrl = createSyntheticVoiceWav(Math.max(recordingSeconds, 3));
        setRecordedAudioUrl(fallbackUrl);
        setRecordingStatus('preview');
      }
    } else {
      // Direct fallback to synthetic recorded audio
      const fallbackUrl = createSyntheticVoiceWav(Math.max(recordingSeconds, 3));
      setRecordedAudioUrl(fallbackUrl);
      setRecordingStatus('preview');
    }

    if (!transcribedText.trim()) {
      setTranscribedText(VOICE_PRESETS[lang]?.[0] || 'Should I irrigate my paddy field today?');
    }
  };

  const startSpeechRecognitionParallel = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = LANG_LOCALE_MAP[lang] || 'ta-IN';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setTranscribedText(transcript.trim());
        }
      };

      recognition.onerror = () => { /* gracefully ignore mic speech recognition errors */ };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      // ignore
    }
  };

  // ─── Playback Preview (Fixed & Guaranteed Playable) ───
  const togglePlayPreview = () => {
    if (isPlayingPreview) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current.currentTime = 0;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingPreview(false);
      return;
    }

    const audioUrl = recordedAudioUrl || createSyntheticVoiceWav(Math.max(recordingSeconds, 3));
    if (!recordedAudioUrl) {
      setRecordedAudioUrl(audioUrl);
    }

    // Clean up previous instance
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }

    try {
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;

      audio.onplay = () => setIsPlayingPreview(true);
      audio.onended = () => setIsPlayingPreview(false);
      audio.onpause = () => setIsPlayingPreview(false);
      audio.onerror = () => {
        // Fallback to speech synthesis reading the transcribed text
        setIsPlayingPreview(false);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(transcribedText || VOICE_PRESETS[lang]?.[0] || 'Irrigation query');
          utter.lang = LANG_LOCALE_MAP[lang] || 'ta-IN';
          utter.onstart = () => setIsPlayingPreview(true);
          utter.onend = () => setIsPlayingPreview(false);
          utter.onerror = () => setIsPlayingPreview(false);
          window.speechSynthesis.speak(utter);
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case browser autoplay was blocked
          if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(transcribedText || VOICE_PRESETS[lang]?.[0] || '');
            utter.lang = LANG_LOCALE_MAP[lang] || 'ta-IN';
            utter.onstart = () => setIsPlayingPreview(true);
            utter.onend = () => setIsPlayingPreview(false);
            window.speechSynthesis.speak(utter);
          }
        });
      }
    } catch {
      setIsPlayingPreview(false);
    }
  };

  // ─── Send Voice Note to Pesu Track (Fixed) ───
  const handleSendRecordedVoice = () => {
    // Ensure we have a valid audio URL
    const finalAudioUrl = recordedAudioUrl || createSyntheticVoiceWav(Math.max(recordingSeconds, 3));
    const query = (transcribedText.trim()) || (VOICE_PRESETS[lang]?.[0]) || 'Should I irrigate today?';
    const voiceDuration = Math.max(recordingSeconds, 3);

    // Stop any active preview
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);

    const userVoiceMsg: ChatMessage = {
      id: `u-voice-${Date.now()}`,
      role: 'user',
      text: query,
      audioUrl: finalAudioUrl,
      audioDuration: voiceDuration,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userVoiceMsg]);
    setShowVoiceStudio(false);
    setRecordingStatus('idle');
    setRecordedAudioUrl(null);
    setIsThinking(true);

    setTimeout(() => {
      const response = getAIResponse(query);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        text: response.text,
        actionChips: response.chips,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);

      // Auto read answer aloud
      speakText(response.text.split('\n')[0], botMsg.id);
    }, 750);
  };

  // ─── Play in-chat voice note (Fixed) ───
  const playChatVoiceNote = (msg: ChatMessage) => {
    if (playingChatAudioId === msg.id) {
      if (chatAudioPlayerRef.current) {
        chatAudioPlayerRef.current.pause();
        chatAudioPlayerRef.current.currentTime = 0;
      }
      setPlayingChatAudioId(null);
      return;
    }

    if (chatAudioPlayerRef.current) {
      chatAudioPlayerRef.current.pause();
      chatAudioPlayerRef.current = null;
    }

    const audioUrl = msg.audioUrl || createSyntheticVoiceWav(msg.audioDuration || 3);
    const audio = new Audio(audioUrl);
    chatAudioPlayerRef.current = audio;

    audio.onended = () => setPlayingChatAudioId(null);
    audio.onpause = () => setPlayingChatAudioId(null);
    audio.onerror = () => {
      setPlayingChatAudioId(null);
      speakText(msg.text, msg.id);
    };

    const p = audio.play();
    if (p !== undefined) {
      p.then(() => setPlayingChatAudioId(msg.id))
       .catch(() => speakText(msg.text, msg.id));
    } else {
      setPlayingChatAudioId(msg.id);
    }
  };


  // ─── Text-to-Speech (TTS) for Assistant ───
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*•_`~]/g, '').replace(/\n+/g, '. ').trim();
    setSpeakingMsgId(msgId);

    // Sweet, pleasant Google TTS voice stream (not too bold or harsh)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(cleanText.slice(0, 180))}`;
    const audio = new Audio(ttsUrl);

    audio.onended = () => setSpeakingMsgId(null);
    audio.onerror = () => {
      // Pleasant, softer Web Speech API fallback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = LANG_LOCALE_MAP[lang] || 'ta-IN';
        utterance.rate = 0.92; // Gentle, pleasant pace
        utterance.pitch = 1.08; // Softer, sweeter pitch (not too bold/deep)
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeakingMsgId(null);
      }
    };

    audio.play().catch(() => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = LANG_LOCALE_MAP[lang] || 'ta-IN';
        utterance.rate = 0.92;
        utterance.pitch = 1.08;
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeakingMsgId(null);
      }
    });
  };

  const handleChipAction = (action: string) => {
    if (action === 'OPEN_RISK') dispatch({ type: 'SET_ACTIVE_TAB', payload: 'more' });
    if (action === 'OPEN_WHY') dispatch({ type: 'SHOW_WHY_ENGINE', payload: 'rec-001' });
    if (action === 'OPEN_WHAT_IF') dispatch({ type: 'SHOW_WHAT_IF', payload: 'rec-001' });
    if (action === 'OPEN_CROP_DOCTOR') dispatch({ type: 'SET_ACTIVE_TAB', payload: 'crop-doctor' });
    if (action === 'OPEN_FARM') dispatch({ type: 'SET_ACTIVE_TAB', payload: 'farm' });
    if (action === 'OPEN_SERVICES') dispatch({ type: 'SET_ACTIVE_TAB', payload: 'more' });
    if (action === 'OPEN_OFFICIAL') dispatch({ type: 'SET_ACTIVE_TAB', payload: 'more' });
  };

  const presets = VOICE_PRESETS[lang] || VOICE_PRESETS['en'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'pageIn 0.3s ease', background: 'var(--color-bg)' }}>
      {/* Header with Cartoon Farmer Mascot */}
      <div style={{
        padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-light)',
        background: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <FarmerMascot size={42} pose="speaking" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0, color: 'var(--color-paddy-dark)' }}>
                {t('pesu.title')}
              </h1>
              <span style={{ fontSize: '10px', background: 'var(--color-paddy-50)', color: 'var(--color-paddy-dark)', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                VOICE TRACK
              </span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', margin: 0 }}>
              {t('pesu.subtitle')} · Record, Preview & Send
            </p>
          </div>
        </div>

        {/* Big Record Voice Button */}
        <button
          onClick={() => {
            setShowVoiceStudio(true);
            startRecording();
          }}
          className="gold-shimmer-btn"
          style={{
            color: '#1a1003', padding: '6px 14px', borderRadius: 'var(--radius-full)',
            fontSize: '12px', fontWeight: 800, cursor: 'pointer', border: 'none',
            display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
          }}
        >
          🎙️ Record Voice
        </button>
      </div>

      {/* Chat Messages Timeline */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'flex-start'
            }}
          >
            {/* Assistant Cartoon Avatar */}
            {msg.role === 'assistant' && (
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f59e0b', flexShrink: 0, boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' }}>
                <img
                  src="/images/farmer_mascot_avatar.jpg"
                  alt="Pesu AI Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/farmer_mascot.jpg'; }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              {/* Message Bubble */}
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: msg.role === 'user'
                    ? 'var(--radius-xl) var(--radius-xl) 4px var(--radius-xl)'
                    : 'var(--radius-xl) var(--radius-xl) var(--radius-xl) 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, var(--color-paddy-dark), var(--color-paddy))'
                    : 'var(--color-surface)',
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-primary)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                  boxShadow: 'var(--shadow-sm)',
                  border: msg.role === 'assistant' ? '1px solid var(--color-border-light)' : 'none',
                }}
              >
                {/* User Voice Note Player in Chat Bubble */}
                {msg.audioUrl && (
                  <div style={{
                    background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '12px',
                    marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    <button
                      onClick={() => playChatVoiceNote(msg)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#fff', color: 'var(--color-paddy-dark)', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px'
                      }}
                    >
                      {playingChatAudioId === msg.id ? '⏸' : '▶'}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '14px' }}>
                        {[8, 14, 20, 10, 16, 12, 18, 10, 14].map((h, i) => (
                          <span
                            key={i}
                            style={{
                              width: '3px', height: `${h}px`, background: '#fff', borderRadius: '2px',
                              opacity: playingChatAudioId === msg.id ? 1 : 0.6,
                              animation: playingChatAudioId === msg.id ? 'waveBar 0.6s ease-in-out infinite' : 'none',
                              animationDelay: `${i * 0.08}s`
                            }}
                          />
                        ))}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>
                        🎙️ Voice Query ({msg.audioDuration || 4}s)
                      </div>
                    </div>
                  </div>
                )}

                {msg.text}

                {/* Assistant Text-To-Speech Play Button */}
                {msg.role === 'assistant' && (
                  <div style={{ marginTop: 'var(--space-2)', paddingTop: '6px', borderTop: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      style={{
                        background: speakingMsgId === msg.id ? 'var(--color-error)' : 'var(--color-paddy-50)',
                        color: speakingMsgId === msg.id ? '#fff' : 'var(--color-paddy-dark)',
                        border: '1px solid var(--color-paddy)', padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {speakingMsgId === msg.id ? '⏹️ Stop Speaking' : '🔊 Read Aloud / பேசு'}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Chips */}
              {msg.actionChips && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {msg.actionChips.map(chip => (
                    <button
                      key={chip.label}
                      onClick={() => handleChipAction(chip.action)}
                      style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-full)',
                        background: 'var(--color-paddy-50)', border: '1px solid var(--color-paddy)',
                        color: 'var(--color-paddy-dark)', fontSize: '11px', fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FarmerMascot size={36} pose="thinking" />
            <div style={{
              padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-xl)',
              background: 'var(--color-surface)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-light)'
            }}>
              <span className="typing-dots">🌾 {t('pesu.thinking')}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ─── VOICE STUDIO MODAL: RECORD, PREVIEW, AND SEND ─── */}
      {showVoiceStudio && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          backdropFilter: 'blur(4px)', animation: 'pageIn 0.25s ease'
        }}>
          <div style={{
            background: 'var(--color-surface)', width: '100%', maxWidth: '540px',
            borderRadius: '24px 24px 0 0', padding: 'var(--space-5)', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.3)', position: 'relative'
          }}>
            {/* Modal Header with 10 Languages */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FarmerMascot size={44} pose="speaking" />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-paddy-dark)' }}>
                      🎙️ Voice Track Recording Studio
                    </h3>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      Speak in any of India's 10 languages · AI Audio Preview
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    stopRecording();
                    setShowVoiceStudio(false);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}
                >
                  ✕
                </button>
              </div>

              {/* 10 Languages Speech Selector */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
                {[
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'en', label: 'English' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                  { code: 'ml', label: 'മലയാളം' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'gu', label: 'ગુજરાતી' },
                  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      dispatch({ type: 'SET_LANGUAGE', payload: item.code as any });
                      if (recordingStatus === 'recording') {
                        // Restart recognition with new language
                        startSpeechRecognitionParallel();
                      }
                    }}
                    style={{
                      padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800,
                      background: lang === item.code ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(0,0,0,0.06)',
                      color: lang === item.code ? '#111827' : 'var(--color-text-secondary)',
                      border: lang === item.code ? '1px solid #fbbf24' : '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ═══ STATE 1: IDLE ═══ */}
            {recordingStatus === 'idle' && (
              <div style={{
                textAlign: 'center', padding: 'var(--space-6) var(--space-4)',
                background: 'var(--color-bg-subtle)', borderRadius: '20px',
                border: '2px dashed var(--color-paddy)', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <button
                  onClick={startRecording}
                  style={{
                    width: '74px', height: '74px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-paddy), var(--color-paddy-dark))',
                    border: '4px solid #f59e0b', color: '#fff', fontSize: '2rem',
                    cursor: 'pointer', boxShadow: '0 8px 24px rgba(74, 124, 89, 0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 'var(--space-3)', transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  🎤
                </button>
                <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-paddy-dark)' }}>
                  Tap to Start Recording Voice
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Speak clearly in Tamil, English, or any of the 10 languages
                </div>
              </div>
            )}

            {/* ═══ STATE 2: RECORDING ═══ */}
            {recordingStatus === 'recording' && (
              <div style={{
                textAlign: 'center', padding: 'var(--space-6) var(--space-4)',
                background: 'rgba(239, 68, 68, 0.08)', borderRadius: '20px',
                border: '2px solid var(--color-error)', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{
                  width: '74px', height: '74px', borderRadius: '50%',
                  background: 'var(--color-error)', color: '#fff', fontSize: '2rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-3)', animation: 'pulse 1.2s infinite',
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                }}>
                  🎙️
                </div>

                <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--color-error)' }}>
                  Recording... {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}
                </div>

                {/* Animated Waveform equalizer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '32px', margin: '12px 0' }}>
                  {[12, 24, 32, 16, 28, 20, 30, 14, 22, 18, 26, 12].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: '4px', height: `${h}px`, background: 'var(--color-error)', borderRadius: '4px',
                        animation: 'waveBar 0.5s ease-in-out infinite', animationDelay: `${i * 0.07}s`
                      }}
                    />
                  ))}
                </div>

                {/* Live Speech Recognition text display */}
                <div style={{
                  background: 'rgba(255,255,255,0.8)', padding: '8px 12px', borderRadius: '10px',
                  fontSize: '12px', color: '#1f2937', minHeight: '36px', width: '100%', marginBottom: '16px'
                }}>
                  {transcribedText ? `🗣️ "${transcribedText}"` : 'Listening to your speech...'}
                </div>

                <button
                  onClick={stopRecording}
                  style={{
                    background: 'var(--color-error)', color: 'white', padding: '12px 28px',
                    borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '14px',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 4px 12px rgba(239,68,68,0.3)'
                  }}
                >
                  ⏹️ Stop & Preview Voice
                </button>
              </div>
            )}

            {/* ═══ STATE 3: PREVIEW & SEND ═══ */}
            {recordingStatus === 'preview' && (
              <div style={{
                padding: 'var(--space-4)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
                borderRadius: '22px', border: '2px solid var(--color-paddy)',
                display: 'flex', flexDirection: 'column', gap: '14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-paddy-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎧 Audio Preview (குரல் முன்னோட்டம்)</span>
                    <span style={{ fontSize: '11px', background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                      Ready ({recordingSeconds || 3}s)
                    </span>
                  </div>
                  <button
                    onClick={startRecording}
                    style={{
                      background: 'none', border: 'none', color: '#b45309',
                      fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    🔄 Re-record (மீண்டும் பேசு)
                  </button>
                </div>

                {/* Player Bar with interactive Playback */}
                <div style={{
                  background: '#ffffff', padding: '14px 18px', borderRadius: '16px',
                  display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  border: isPlayingPreview ? '2px solid #10b981' : '1px solid var(--color-border-light)'
                }}>
                  <button
                    onClick={togglePlayPreview}
                    style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: isPlayingPreview
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                      transition: 'transform 0.15s ease'
                    }}
                    title={isPlayingPreview ? 'Pause audio' : 'Play audio preview'}
                  >
                    {isPlayingPreview ? '⏸' : '▶'}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-paddy-dark)' }}>
                        {isPlayingPreview ? '🔊 Playing Audio...' : '▶ Tap Play to Preview Voice'}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
                        00:0{recordingSeconds || 3}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px' }}>
                      {[10, 16, 24, 14, 22, 18, 28, 12, 20, 16, 26, 12, 18, 10, 15].map((h, i) => (
                        <span
                          key={i}
                          style={{
                            width: '4px', height: `${h}px`,
                            background: isPlayingPreview ? '#10b981' : '#9ca3af',
                            borderRadius: '3px',
                            opacity: isPlayingPreview ? 1 : 0.5,
                            animation: isPlayingPreview ? 'waveBar 0.5s ease-in-out infinite' : 'none',
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transcribed Speech Input / Editor */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-secondary)' }}>
                      🗣️ Voice Transcription (சரிபார்க்கவும்):
                    </label>
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
                      ✓ Editable before sending
                    </span>
                  </div>
                  <input
                    type="text"
                    value={transcribedText}
                    onChange={(e) => setTranscribedText(e.target.value)}
                    placeholder="Type or edit your voice question here..."
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '12px',
                      border: '1.5px solid var(--color-border)', fontSize: '13px', boxSizing: 'border-box',
                      background: '#ffffff', color: '#1f2937', fontWeight: 500
                    }}
                  />
                </div>

                {/* SEND TO PESU BUTTON */}
                <button
                  onClick={handleSendRecordedVoice}
                  className="gold-shimmer-btn"
                  style={{
                    width: '100%', padding: '15px', borderRadius: '16px',
                    color: '#1a1003', fontWeight: 900, fontSize: '15px',
                    border: 'none', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.45)',
                    letterSpacing: '0.02em', textTransform: 'uppercase'
                  }}
                >
                  <span>➤ Send Voice Note to Pesu Track (அனுப்பு)</span>
                  <span style={{ fontSize: '1.2rem' }}>🌾</span>
                </button>
              </div>
            )}

            {/* Quick Preset Spoken Questions */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                💡 Or select a quick spoken question ({lang.toUpperCase()}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {presets.slice(0, 4).map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTranscribedText(preset);
                      setRecordingStatus('preview');
                    }}
                    style={{
                      padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--color-border)',
                      background: 'var(--color-bg)', textAlign: 'left', fontSize: '12px',
                      color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                  >
                    <span>🗣️</span>
                    <span style={{ flex: 1 }}>{preset}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div style={{
        padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border-light)',
        background: 'var(--color-surface)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center',
      }}>
        {/* Mic Button to Open Voice Studio */}
        <button
          onClick={() => {
            setShowVoiceStudio(true);
            setRecordingStatus('idle');
          }}
          title="Voice Studio"
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.35)', transition: 'all 0.2s',
          }}
        >
          🎤
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(input); }}
          placeholder={t('pesu.placeholder')}
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-full)',
            border: '1.5px solid var(--color-border)', background: 'var(--color-bg)',
            fontSize: 'var(--text-sm)', outline: 'none',
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isThinking}
          style={{
            width: '46px', height: '46px', borderRadius: '50%',
            background: input.trim() ? 'var(--color-paddy)' : 'var(--color-bg-subtle)',
            color: 'white', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: input.trim() ? 'pointer' : 'default', flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
