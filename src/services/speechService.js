// Speech Service: Real-Time Multilingual Speech-to-Text & Enhanced Realistic Female Voice TTS Synthesis

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    this.voices = [];
    this.selectedFemaleVoice = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.selectedFemaleVoice = this.findBestFemaleVoice();
  }

  findBestFemaleVoice(lang = 'en') {
    if (!this.voices || this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }

    // High Priority Natural / Neural Female Voices across Edge, Chrome, Mac, Windows
    const preferredFemaleNames = [
      'Microsoft Jenny Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Sonia Online (Natural)',
      'Microsoft Libby Online (Natural)',
      'Google US English',
      'Google UK English Female',
      'Samantha',
      'Karen',
      'Victoria',
      'Microsoft Zira',
      'Microsoft Hazel',
      'Microsoft Susan'
    ];

    // 1. Check exact preferred neural names
    for (const name of preferredFemaleNames) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (match) return match;
    }

    // 2. Search for English female/natural voice keywords
    const femaleMatch = this.voices.find(v => {
      const vName = v.name.toLowerCase();
      const vLang = v.lang.toLowerCase();
      const isEnglish = vLang.startsWith('en');
      const isFemaleKeyword = vName.includes('female') || vName.includes('natural') || vName.includes('neural') || vName.includes('jenny') || vName.includes('aria') || vName.includes('samantha') || vName.includes('zira');
      return isEnglish && isFemaleKeyword;
    });
    if (femaleMatch) return femaleMatch;

    // 3. Fallback to any English voice
    const englishFallback = this.voices.find(v => v.lang.toLowerCase().startsWith('en-us') || v.lang.toLowerCase().startsWith('en'));
    if (englishFallback) return englishFallback;

    return this.voices[0] || null;
  }

  initRecognition(lang = 'hi-IN', onResult, onEnd, onError) {
    if (!this.isSupported) {
      if (onError) onError('Speech recognition is not natively supported in this browser environment.');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = lang;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({ finalTranscript, interimTranscript });
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech Recognition Event Error:', event.error);
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    return true;
  }

  start(lang = 'hi-IN', onResult, onEnd, onError) {
    if (this.isListening) {
      this.stop();
    }
    const ready = this.initRecognition(lang, onResult, onEnd, onError);
    if (!ready) return false;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.isListening = false;
      if (onError) onError(err);
      return false;
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Stop error:', e);
      }
      this.isListening = false;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text, lang = 'en-US', onStart, onEnd) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    try {
      window.speechSynthesis.cancel(); // Cancel any existing queue

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      // Fine-tuned acoustics for smooth, professional, realistic female tone
      utterance.rate = 1.0;     // Natural speaking speed
      utterance.pitch = 1.06;   // Clean, pleasant, natural female inflection
      utterance.volume = 1.0;

      const bestVoice = this.findBestFemaleVoice(lang);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      if (onStart) utterance.onstart = onStart;
      if (onEnd) utterance.onend = onEnd;

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('TTS error:', err);
      return false;
    }
  }
}

export const speechService = new SpeechService();
