import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Globe2, 
  Droplets, 
  Car, 
  Zap, 
  Activity, 
  Wifi,
  Radio,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BRICS_COUNTRIES, INFRASTRUCTURE_SECTORS } from '../data/bricsData';
import { speechService } from '../services/speechService';
import { analyzeCitizenRequest } from '../services/aiEngine';
import '../styles/intake.css';

export default function CitizenIntakeModal({ 
  isOpen, 
  onClose, 
  activeCountryCode, 
  onSubmitNewRequest 
}) {
  if (!isOpen) return null;

  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;

  // Form State
  const [selectedLanguage, setSelectedLanguage] = useState(country.languages[0]?.code || 'en-US');
  const [category, setCategory] = useState('water');
  const [textInput, setTextInput] = useState('');
  const [district, setDistrict] = useState(country.provinces[0]?.keyDistricts[0] || 'Central District');
  const [locationName, setLocationName] = useState('');
  const [urgency, setUrgency] = useState(75);
  const [isRecording, setIsRecording] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Quick preset voice prompts for testing multi-language intake
  const PRESET_PROMPTS = [
    {
      lang: 'hi-IN',
      label: '🇮🇳 Hindi: खराब हैंडपंप व खारा पानी',
      text: 'हमारे गांव में 4 महीने से हैंडपंप खराब हैं और नल से खारा पानी आ रहा है। 800 से ज्यादा परिवार परेशान हैं। तुरंत जल जीवन मिशन का नया बोरवेल लगाएं।'
    },
    {
      lang: 'pt-BR',
      label: '🇧🇷 Portuguese: Seca e poços rurais',
      text: 'A seca severa secou os poços artesianos comunitários. A comunidade rural de pequenos agricultores precisa de canal de irrigação e dessalinizador solar urgente.'
    },
    {
      lang: 'ru-RU',
      label: '🇷🇺 Russian: Авария котельной в мороз',
      text: 'В поселке постоянные отключения тепла и электроэнергии при температуре -35°C. Старая котельная на угле не справляется. Требуется срочная модернизация теплосети.'
    },
    {
      lang: 'zh-CN',
      label: '🇨🇳 Mandarin: 山区农产品公路塌方',
      text: '高山彝族村落的山区公路遭遇落石和滑坡，冷链物流车辆无法进山收购高山苹果。急需修建防崩塌挡土墙和硬化路面。'
    },
    {
      lang: 'en-ZA',
      label: '🇿🇦 English: Clinic power & maternity backup',
      text: 'Rural clinic serves 15 villages but has no maternity backup generator or solar battery. Women in labor are turned away during load shedding.'
    }
  ];

  // Handle Speech-to-Text toggle
  const toggleSpeechRecording = () => {
    if (isRecording) {
      speechService.stop();
      setIsRecording(false);
    } else {
      const started = speechService.start(
        selectedLanguage,
        (res) => {
          if (res.finalTranscript) {
            setTextInput(prev => `${prev} ${res.finalTranscript}`.trim());
          }
        },
        () => setIsRecording(false),
        (err) => {
          console.warn('Speech Error:', err);
          setIsRecording(false);
        }
      );
      if (started) setIsRecording(true);
    }
  };

  const handleApplyPreset = (preset) => {
    setTextInput(preset.text);
    setSelectedLanguage(preset.lang);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    // Pick province center coordinates as fallback
    const province = country.provinces[0];
    const coordinates = province ? [province.center[0] + (Math.random() - 0.5) * 0.4, province.center[1] + (Math.random() - 0.5) * 0.4] : country.center;

    const requestPayload = analyzeCitizenRequest({
      text: textInput,
      language: selectedLanguage,
      countryCode: activeCountryCode,
      provinceId: province?.id || 'UP',
      locationName: locationName || `${district}, ${province?.name || country.name}`,
      coordinates,
      channel: isRecording ? 'voice' : 'web',
      audioDuration: isRecording ? '18s' : null,
    });

    // Override manual urgency slider
    requestPayload.urgency = Math.max(requestPayload.urgency, urgency);

    // Trigger Confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Voice feedback to confirm
    speechService.speak(`Citizen demand registered successfully. Cryptographic Ticket ID: ${requestPayload.id}`, 'en-US');

    setSubmittedReceipt(requestPayload);
    onSubmitNewRequest(requestPayload);
  };

  const handleCopyReceipt = () => {
    if (submittedReceipt) {
      navigator.clipboard.writeText(submittedReceipt.id);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleResetForm = () => {
    setSubmittedReceipt(null);
    setTextInput('');
    setLocationName('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <div className="brand-logo-glow" style={{ width: '32px', height: '32px' }}>
              <Radio size={16} className="text-white" />
            </div>
            <div>
              <h3>Citizen Infrastructure Intake</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Target Nation: {country.flag} {country.name} • Multilingual DPI Gateway
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {submittedReceipt ? (
            /* Success Cryptographic Token Card */
            <div className="receipt-token-card animate-fade-in">
              <CheckCircle2 size={44} className="text-emerald-400 mx-auto" style={{ margin: '0 auto 10px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>
                Citizen Demand Cryptographically Verified!
              </h3>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
                Your request has been ingested into the {country.name} Digital Public Infrastructure (DPI) Registry.
              </p>

              <div className="ticket-dpi-id">
                {submittedReceipt.id}
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', wordBreak: 'break-all', marginBottom: '16px' }}>
                Audit Hash: <code>{submittedReceipt.dpiToken}</code>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>SECTOR</div>
                  <div style={{ fontWeight: '700', color: '#38bdf8' }}>{submittedReceipt.category.toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>AI URGENCY</div>
                  <div style={{ fontWeight: '700', color: '#f59e0b' }}>{submittedReceipt.urgency}/100</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>STATUS</div>
                  <div style={{ fontWeight: '700', color: '#10b981' }}>POLICY PRIORITIZED</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={handleCopyReceipt}>
                  <Copy size={15} />
                  <span>{copiedToken ? 'Copied to Clipboard!' : 'Copy Ticket ID'}</span>
                </button>
                <button className="btn btn-emerald" onClick={handleResetForm}>
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Voice Ingestion Card */}
              <div className="voice-intake-card">
                <button 
                  type="button"
                  className={`mic-pulse-button ${isRecording ? 'recording' : ''}`}
                  onClick={toggleSpeechRecording}
                  title={isRecording ? 'Click to stop recording' : 'Click to speak'}
                >
                  {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                </button>

                <div style={{ fontWeight: '700', fontSize: '14px', color: '#fff' }}>
                  {isRecording ? '🎙️ Listening... Speak in your native language' : 'Tap Microphone to Speak / Dictate'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  AI Automatic Speech-to-Text & Dialect Normalization
                </div>

                {isRecording && (
                  <div className="audio-waveform-bar-container">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                )}

                {/* Multilingual Presets for Quick Testing */}
                <div className="voice-presets-row">
                  <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '4px' }}>Quick Presets:</span>
                  {PRESET_PROMPTS.map((p, idx) => (
                    <button 
                      key={idx} 
                      type="button" 
                      className="preset-chip"
                      onClick={() => handleApplyPreset(p)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="form-group">
                <label className="form-label">
                  <span>Intake Dialect & Language</span>
                  <Globe2 size={14} className="text-cyan-400" />
                </label>
                <select 
                  className="form-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  {country.languages?.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Picker */}
              <div className="form-group">
                <label className="form-label">Infrastructure Category</label>
                <div className="category-picker-grid">
                  {INFRASTRUCTURE_SECTORS.map((sec) => {
                    const isSelected = category === sec.id;
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        className={`category-card-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setCategory(sec.id)}
                      >
                        <span style={{ color: sec.color, fontWeight: '700', fontSize: '12px' }}>
                          {sec.name.split(' ')[0]}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{sec.sdg}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Description */}
              <div className="form-group">
                <label className="form-label">
                  <span>Citizen Request / Development Need (Voice Transcribed or Typed)</span>
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="Describe the broken infrastructure, water shortage, unpaved road, or clinic deficit..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  required
                />
              </div>

              {/* Location & District */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Key District</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Varanasi Rural"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specific Village / Ward / Landmark</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Ward 12, High School Crossing"
                  />
                </div>
              </div>

              {/* Urgency Slider */}
              <div className="form-group">
                <label className="form-label">
                  <span>Citizen Urgency Level</span>
                  <span style={{ color: urgency > 80 ? '#ef4444' : urgency > 50 ? '#f59e0b' : '#10b981', fontWeight: '800' }}>
                    {urgency} / 100 ({urgency > 85 ? 'Critical Emergency' : urgency > 60 ? 'High Priority' : 'Standard Demand'})
                  </span>
                </label>
                <div className="urgency-slider-container">
                  <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={urgency} 
                    onChange={(e) => setUrgency(parseInt(e.target.value))}
                    className="range-slider"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '15px', marginTop: '6px' }}
                disabled={!textInput.trim()}
              >
                <Send size={18} />
                <span>Submit & Generate DPI Cryptographic Token</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
