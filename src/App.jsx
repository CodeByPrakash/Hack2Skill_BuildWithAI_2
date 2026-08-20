import React, { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import WhatsAppBotSim from './components/WhatsAppBotSim';
import TelegramBotSim from './components/TelegramBotSim';
import PolicymakerCopilot from './components/PolicymakerCopilot';
import BudgetSimulator from './components/BudgetSimulator';
import CitizenTracker from './components/CitizenTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DPGStandardsView from './components/DPGStandardsView';
import CitizenIntakeModal from './components/CitizenIntakeModal';
import VideoDemoTheater from './components/VideoDemoTheater';
import { BRICS_COUNTRIES } from './data/bricsData';
import { INITIAL_CITIZEN_REQUESTS } from './data/initialRequests';
import { RECOMMENDED_PROJECTS } from './data/recommendedProjects';
import { downloadDpgJsonFile } from './services/dpgExportService';
import { Bot, MessageSquare, Smartphone, Radio } from 'lucide-react';

export default function App() {
  // Active BRICS Country ('IN', 'BR', 'RU', 'CN', 'ZA', 'AE', 'EG')
  const [activeCountryCode, setActiveCountryCode] = useState('IN');
  
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('map');
  
  // Selected Province Filter for Map & Proposals
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);

  // Dynamic Citizen Requests List
  const [citizenRequests, setCitizenRequests] = useState(INITIAL_CITIZEN_REQUESTS);

  // Dynamic Recommended Projects
  const [recommendedProjects, setRecommendedProjects] = useState(RECOMMENDED_PROJECTS);

  // Intake Modal
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  // Theater / Video Tour Mode
  const [isTheaterModeActive, setIsTheaterModeActive] = useState(false);

  // Handler for adding new citizen request from any channel
  const handleAddNewRequest = (newReq) => {
    setCitizenRequests(prev => [newReq, ...prev]);
  };

  // Switch country handler
  const handleSelectCountry = (code) => {
    setActiveCountryCode(code);
    setSelectedProvinceId(null);
  };

  // Export DPG payload
  const handleExportDpg = () => {
    const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
    downloadDpgJsonFile(country, citizenRequests, recommendedProjects);
  };

  // Navigate to Copilot from Map with highlighted request
  const handleNavigateToCopilot = (req) => {
    setActiveTab('copilot');
  };

  return (
    <div className="app-root">
      {/* Top Main Navigation */}
      <Header 
        activeCountryCode={activeCountryCode}
        onSelectCountry={handleSelectCountry}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        onExportDpg={handleExportDpg}
        citizenRequests={citizenRequests}
        isTheaterModeActive={isTheaterModeActive}
        onToggleTheaterMode={() => setIsTheaterModeActive(prev => !prev)}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="main-content">
        {activeTab === 'map' && (
          <MapView 
            activeCountryCode={activeCountryCode}
            citizenRequests={citizenRequests}
            recommendedProjects={recommendedProjects}
            onNavigateToCopilot={handleNavigateToCopilot}
            onSelectProvinceFilter={setSelectedProvinceId}
            selectedProvinceId={selectedProvinceId}
          />
        )}

        {activeTab === 'intake_channels' && (
          <div className="copilot-container animate-fade-in">
            <div className="copilot-hero">
              <div className="copilot-hero-text">
                <h1>
                  <Bot size={28} className="text-cyan-400" />
                  <span>Omnichannel Citizen Messaging Simulators</span>
                  <span className="badge badge-cyan">{BRICS_COUNTRIES[activeCountryCode]?.name}</span>
                </h1>
                <p>
                  Experience the multi-lingual, low-bandwidth, and messaging-app intake channels. 
                  Submit live reports via the WhatsApp DPI Bot or Rural SMS Gateway — the AI engine translates, 
                  clusters, and queues them into national policymaker heatmaps in real-time.
                </p>
              </div>
            </div>

            <div className="simulators-layout">
              {/* WhatsApp Smartphone Simulator */}
              <div>
                <div className="sim-section-header">
                  <h2>📱 WhatsApp DPI Citizen Bot</h2>
                  <p>Interactive smartphone simulation for urban and semi-urban smartphone users</p>
                </div>
                <WhatsAppBotSim 
                  activeCountryCode={activeCountryCode} 
                  onAddNewRequest={handleAddNewRequest} 
                />
              </div>

              {/* Telegram / Low Bandwidth SMS Simulator */}
              <div>
                <div className="sim-section-header">
                  <h2>📟 Rural 2G/3G SMS & Telegram Gateway</h2>
                  <p>Lightweight terminal for remote, offline, and feature phone environments</p>
                </div>
                <TelegramBotSim 
                  activeCountryCode={activeCountryCode} 
                  onAddNewRequest={handleAddNewRequest} 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'copilot' && (
          <PolicymakerCopilot 
            activeCountryCode={activeCountryCode}
            recommendedProjects={recommendedProjects}
            citizenRequests={citizenRequests}
            onNavigateToSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <BudgetSimulator 
            activeCountryCode={activeCountryCode}
            recommendedProjects={recommendedProjects}
          />
        )}

        {activeTab === 'tracker' && (
          <CitizenTracker 
            activeCountryCode={activeCountryCode}
            citizenRequests={citizenRequests}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            activeCountryCode={activeCountryCode}
            citizenRequests={citizenRequests}
            recommendedProjects={recommendedProjects}
          />
        )}

        {activeTab === 'dpg' && (
          <DPGStandardsView 
            activeCountryCode={activeCountryCode}
            citizenRequests={citizenRequests}
            recommendedProjects={recommendedProjects}
          />
        )}
      </main>

      {/* Omnichannel Voice & Web Intake Modal */}
      <CitizenIntakeModal 
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        activeCountryCode={activeCountryCode}
        onSubmitNewRequest={handleAddNewRequest}
      />

      {/* Interactive Scripted Video Demo Tour Theater */}
      {isTheaterModeActive && (
        <VideoDemoTheater 
          onSelectTab={setActiveTab}
          onSelectCountry={handleSelectCountry}
          activeCountryCode={activeCountryCode}
          onClose={() => setIsTheaterModeActive(false)}
        />
      )}
    </div>
  );
}
