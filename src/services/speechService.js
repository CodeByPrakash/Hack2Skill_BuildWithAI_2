// Speech Service: Real-Time Multilingual Speech-to-Text & Text-to-Speech synthesis

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
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
  }

  speak(text, lang = 'en-US') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }
    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('TTS error:', err);
      return false;
    }
  }
}

export const speechService = new SpeechService();
