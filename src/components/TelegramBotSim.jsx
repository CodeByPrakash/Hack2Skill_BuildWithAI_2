import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Radio, 
  CheckCircle, 
  Smartphone,
  Cpu
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { analyzeCitizenRequest } from '../services/aiEngine';
import '../styles/simulator.css';

export default function TelegramBotSim({ activeCountryCode, onAddNewRequest }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `[LOW-BANDWIDTH / SMS DPI GATEWAY • ${country.code}]\n\nSyntax Format:\n#REPORT [WATER | ROAD | POWER | HEALTH] [VILLAGE] [ISSUE]\n\nExample: #REPORT WATER Rampur Handpump broken 3 months 500 families`,
      time: '12:05 PM',
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    const msgText = text || inputVal;
    if (!msgText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      const province = country.provinces[0];
      const coordinates = province ? [province.center[0] + 0.1, province.center[1] - 0.1] : country.center;

      const newReq = analyzeCitizenRequest({
        text: msgText,
        language: 'en-US',
        countryCode: activeCountryCode,
        provinceId: province?.id || 'UP',
        locationName: `Remote Block, ${country.name}`,
        coordinates,
        channel: 'telegram',
      });

      onAddNewRequest(newReq);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `[SMS ACK] Ticket ${newReq.id} issued.\nCluster: ${newReq.category.toUpperCase()} | Urgency: ${newReq.urgency}/100\nGovt DPI Engine has queued your report for district planning.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botReply]);
    }, 800);
  };

  return (
    <div className="telegram-frame">
      {/* Telegram Top Header */}
      <div className="tg-top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2481cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Radio size={18} className="text-white" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {country.name} Rural SMS/Telegram Gateway
            </div>
            <div style={{ fontSize: '11px', color: '#68b3f2' }}>
              Low-Bandwidth 2G/3G & Offline Sync Protocol
            </div>
          </div>
        </div>
        <Cpu size={18} className="text-cyan-400" />
      </div>

      {/* Messages Body */}
      <div className="tg-chat-body">
        {messages.map((msg) => (
          <div key={msg.id} className={`tg-msg ${msg.sender}`}>
            <div style={{ whiteSpace: 'pre-line', fontFamily: msg.sender === 'bot' ? 'var(--font-mono)' : 'var(--font-body)', fontSize: '12px' }}>
              {msg.text}
            </div>
            <div className="msg-time">{msg.time}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Quick SMS Templates */}
      <div style={{ padding: '8px 12px', background: '#1c2733', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ fontSize: '10px', padding: '4px 8px' }}
          onClick={() => handleSend('#REPORT WATER Ward 4 Saline well needs RO filter')}
        >
          Quick: #WATER
        </button>
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ fontSize: '10px', padding: '4px 8px' }}
          onClick={() => handleSend('#REPORT ROAD River bridge washed out in flood')}
        >
          Quick: #ROAD
        </button>
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ fontSize: '10px', padding: '4px 8px' }}
          onClick={() => handleSend('#REPORT HEALTH Clinic has no vaccine power backup')}
        >
          Quick: #HEALTH
        </button>
      </div>

      {/* Input Bar */}
      <div className="tg-input-bar">
        <input 
          type="text"
          className="tg-input"
          placeholder="Send SMS syntax or plain message..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="btn btn-primary"
          style={{ padding: '8px 12px' }}
          onClick={() => handleSend()}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
