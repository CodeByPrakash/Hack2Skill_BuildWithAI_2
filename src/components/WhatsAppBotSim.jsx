import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MapPin, 
  CheckCheck, 
  Paperclip, 
  Smile, 
  Sparkles,
  Bot,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { analyzeCitizenRequest } from '../services/aiEngine';
import '../styles/simulator.css';

export default function WhatsAppBotSim({ activeCountryCode, onAddNewRequest }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Namaste! Welcome to ${country.name} Digital Public Infrastructure (DPI) Citizen Gov-Bot. 🏛️\n\nYou can report broken roads, water shortages, power cuts, or clinic issues in any native language via text, voice note, or location pin.`,
      time: '12:00 PM',
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const QUICK_REPLIES = [
    { label: '💧 Water Problem', text: 'Our community tap is supplying brackish saline water for 2 months. Over 600 families need clean tap connection.' },
    { label: '🚧 Broken Road', text: 'Heavy rains broke the main bridge connecting our village to the district hospital. Ambulances cannot enter.' },
    { label: '⚡ Power Outage', text: 'Frequent load shedding and burnt transformer. Clinics and small shops have had no power for 4 days.' },
    { label: '🏥 Clinic Doctor Shortage', text: 'Local primary health center has no resident doctor or medicines. Pregnant women must travel 45km.' }
  ];

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI Processing & DPI Registration
    setTimeout(() => {
      const province = country.provinces[0];
      const coordinates = province ? [province.center[0] + (Math.random() - 0.5) * 0.2, province.center[1] + (Math.random() - 0.5) * 0.2] : country.center;

      const newReq = analyzeCitizenRequest({
        text,
        language: country.languages[0]?.code || 'hi-IN',
        countryCode: activeCountryCode,
        provinceId: province?.id || 'UP',
        locationName: `${province?.keyDistricts[0] || 'District Center'}, ${country.name}`,
        coordinates,
        channel: 'whatsapp',
      });

      onAddNewRequest(newReq);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `✅ Request Ingested & Cryptographically Verified!\n\n📋 Category: ${newReq.category.toUpperCase()}\n🚨 Urgency Index: ${newReq.urgency}/100\n🎫 DPI Ticket: ${newReq.id}\n🔒 Token: ${newReq.dpiToken.slice(0, 18)}...\n\nYour issue has been clustered and dispatched to the National Policymaker Co-Pilot for capital allocation.`,
        dpiData: newReq,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botReply]);
    }, 1100);
  };

  return (
    <div className="smartphone-frame">
      {/* Notch */}
      <div className="phone-notch-bar">
        <div className="phone-speaker-notch"></div>
      </div>

      {/* WhatsApp Top Header */}
      <div className="whatsapp-top-header">
        <div className="wa-bot-profile">
          <div className="wa-avatar">
            🏛️
          </div>
          <div>
            <div className="wa-name">{country.name} Citizen DPI Bot</div>
            <div className="wa-status">● Official Verified Govt DPG</div>
          </div>
        </div>
        <ShieldCheck size={20} className="text-emerald-300" />
      </div>

      {/* WhatsApp Chat Messages */}
      <div className="whatsapp-chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-msg ${msg.sender}`}>
            <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
            
            {msg.dpiData && (
              <div className="dpi-card-wa">
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '800' }}>
                  BRICS DPI REGISTRY RECORD
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                  Impact: ~{msg.dpiData.beneficiaries} citizens • Status: Prioritized
                </div>
              </div>
            )}

            <div className="msg-time">
              {msg.time} {msg.sender === 'user' && '✓✓'}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-msg bot" style={{ fontStyle: 'italic', color: '#94a3b8' }}>
            Gov-Bot AI is analyzing demand & verifying geolocation...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="wa-quick-replies">
        {QUICK_REPLIES.map((qr, idx) => (
          <button 
            key={idx} 
            className="wa-chip"
            onClick={() => handleSendMessage(qr.text)}
          >
            {qr.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="whatsapp-input-bar">
        <input 
          type="text"
          className="wa-input"
          placeholder="Type message in your language..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className="wa-btn-icon"
          onClick={() => handleSendMessage()}
        >
          {inputVal.trim() ? <Send size={16} /> : <Mic size={16} />}
        </button>
      </div>
    </div>
  );
}
