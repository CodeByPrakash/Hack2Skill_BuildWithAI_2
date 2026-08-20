import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Mic, 
  Bot, 
  Sliders, 
  Search, 
  BarChart3, 
  Layers, 
  DownloadCloud, 
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import '../styles/header.css';

export default function Header({ 
  activeCountryCode, 
  onSelectCountry, 
  activeTab, 
  onSelectTab, 
  onOpenIntakeModal,
  onExportDpg,
  citizenRequests
}) {
  const currentCountry = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  const recentRequest = citizenRequests[0];

  return (
    <header className="app-header">
      {/* Top Main Navigation Bar */}
      <div className="header-container">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-logo-glow">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="brand-title">
              BRICS InfraPulse AI
              <span className="brand-badge">DPG Standard v2</span>
            </div>
            <div className="brand-subtitle">
              Digital Public Infrastructure & AI Policymaker Co-Pilot
            </div>
          </div>
        </div>

        {/* BRICS Member State Pills */}
        <div className="header-center-controls">
          <div className="country-selector-pills">
            {Object.values(BRICS_COUNTRIES).map((country) => {
              const isSelected = country.code === activeCountryCode;
              return (
                <button
                  key={country.code}
                  className={`country-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectCountry(country.code)}
                  title={`${country.name} (${country.nativeName})`}
                >
                  <span>{country.flag}</span>
                  <span>{country.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="header-actions">
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onExportDpg}
            title="Download Standardized DPG JSON-LD Payload"
          >
            <DownloadCloud size={16} className="text-cyan-400" />
            <span>DPG Export</span>
          </button>

          <button 
            className="btn btn-primary"
            onClick={onOpenIntakeModal}
          >
            <Mic size={16} />
            <span>+ Voice / Report Request</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs & Live Demand Feed Ticker */}
      <div className="sub-nav-bar">
        <div className="sub-nav-container">
          <div className="nav-tabs">
            <button 
              className={`nav-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => onSelectTab('map')}
            >
              <MapPin size={16} />
              <span>Geospatial Intelligence Map</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'intake_channels' ? 'active' : ''}`}
              onClick={() => onSelectTab('intake_channels')}
            >
              <Bot size={16} />
              <span>Omnichannel Simulators (WhatsApp / Voice / SMS)</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'copilot' ? 'active' : ''}`}
              onClick={() => onSelectTab('copilot')}
            >
              <Sparkles size={16} />
              <span>Policymaker AI Co-Pilot & Proposals</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => onSelectTab('simulator')}
            >
              <Sliders size={16} />
              <span>What-If Budget Simulator</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
              onClick={() => onSelectTab('tracker')}
            >
              <Search size={16} />
              <span>Citizen Request Tracker</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => onSelectTab('analytics')}
            >
              <BarChart3 size={16} />
              <span>Demographic & Deficit Analytics</span>
            </button>

            <button 
              className={`nav-tab-btn ${activeTab === 'dpg' ? 'active' : ''}`}
              onClick={() => onSelectTab('dpg')}
            >
              <ShieldCheck size={16} />
              <span>DPG Standards & API Schema</span>
            </button>
          </div>

          {/* Live Incoming Demand Ticker */}
          {recentRequest && (
            <div className="ticker-strip">
              <div className="ticker-label">
                <span className="live-pulse-dot"></span>
                <span>Live Feed:</span>
              </div>
              <div className="ticker-content" title={recentRequest.translatedText}>
                [{recentRequest.countryCode} • {recentRequest.category.toUpperCase()}] {recentRequest.translatedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
