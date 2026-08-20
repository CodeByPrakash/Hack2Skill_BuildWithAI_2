import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Radio, 
  Layers, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../data/bricsData';

export default function CitizenTracker({ activeCountryCode, citizenRequests }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  const countryRequests = citizenRequests.filter(r => r.countryCode === activeCountryCode);

  const [searchId, setSearchId] = useState(countryRequests[0]?.id || '');
  const [activeRequest, setActiveRequest] = useState(countryRequests[0] || null);

  const handleSearch = (e) => {
    e?.preventDefault();
    const found = citizenRequests.find(r => 
      r.id.toLowerCase() === searchId.trim().toLowerCase() ||
      (r.dpiToken && r.dpiToken.toLowerCase().includes(searchId.trim().toLowerCase()))
    );
    if (found) {
      setActiveRequest(found);
    } else {
      alert(`No record found matching Ticket ID "${searchId}". Please check the ID or select one from the recent registry.`);
    }
  };

  const selectRequest = (req) => {
    setSearchId(req.id);
    setActiveRequest(req);
  };

  const PIPELINE_STAGES = [
    { key: 'submitted', label: '1. Ingested & Normalized', desc: 'Voice/Text processed via Multilingual DPI NLU' },
    { key: 'clustered', label: '2. Clustered & Deduplicated', desc: 'Synthesized with regional community demand density' },
    { key: 'policy_prioritized', label: '3. Policy Prioritized', desc: 'Ranked in National Master Plan by Policymaker AI Co-Pilot' },
    { key: 'budget_allocated', label: '4. Budget Allocated', desc: 'Fiscal capital provisioned via Ministry Master Budget' },
    { key: 'under_construction', label: '5. Under Construction', desc: 'Contractor deployed with IoT telemetry tracking' },
    { key: 'completed', label: '6. Completed & Verified', desc: 'DPI digital receipt verified by citizen community' },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'submitted': return 0;
      case 'clustered': return 1;
      case 'policy_prioritized': return 2;
      case 'budget_allocated': return 3;
      case 'under_construction': return 4;
      case 'completed': return 5;
      default: return 2;
    }
  };

  const currentStageIdx = activeRequest ? getStageIndex(activeRequest.status) : 0;

  return (
    <div className="copilot-container animate-fade-in">
      {/* Hero Header */}
      <div className="copilot-hero" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="copilot-hero-text">
          <h1>
            <ShieldCheck size={28} className="text-cyan-400" />
            <span>DPI Citizen Request Tracking & Cryptographic Audit</span>
          </h1>
          <p>
            Digital Public Goods (DPG) provide transparent, end-to-end auditability. 
            Citizens can track any voice or text infrastructure complaint from initial ingestion to RFP tender, 
            budget allocation, and field construction.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px' }}>
          <div className="search-input-wrapper" style={{ flex: 1 }}>
            <Search size={18} className="text-cyan-400" />
            <input 
              type="text"
              placeholder="Enter DPI Ticket ID (e.g. DPI-IN-2026-1001 or SHA256 Token)..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            <span>Track Status</span>
          </button>
        </form>

        {/* Quick Clickable Suggestions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quick Select:</span>
          {countryRequests.slice(0, 5).map(req => (
            <button
              key={req.id}
              className="badge badge-cyan"
              style={{ cursor: 'pointer', border: activeRequest?.id === req.id ? '1px solid #38bdf8' : '1px solid transparent' }}
              onClick={() => selectRequest(req)}
            >
              {req.id} ({req.category})
            </button>
          ))}
        </div>
      </div>

      {/* Active Request Audit Pipeline */}
      {activeRequest && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(220, 210, 195, 0.7)', paddingBottom: '18px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-emerald" style={{ fontSize: '13px' }}>
                  {activeRequest.id}
                </span>
                <span className="badge badge-cyan">
                  {activeRequest.category.toUpperCase()}
                </span>
                <span className="badge badge-amber">
                  Urgency: {activeRequest.urgency}/100
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1c1917', marginTop: '8px' }}>
                {activeRequest.locationName}
              </h2>
              <div style={{ fontSize: '13px', color: '#78716c', marginTop: '2px' }}>
                Logged via {activeRequest.channel.toUpperCase()} Channel • {activeRequest.timestamp}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#78716c', textTransform: 'uppercase', fontWeight: '700' }}>Cryptographic Verification</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#0284c7', marginTop: '2px', fontWeight: '700' }}>
                {activeRequest.dpiToken}
              </div>
            </div>
          </div>

          {/* Original Text vs Standardized English Text */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#fbf9f4', padding: '16px', borderRadius: '12px', border: '1px solid rgba(220, 210, 195, 0.8)', boxShadow: 'var(--clay-shadow-sm)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#78716c', textTransform: 'uppercase', marginBottom: '6px' }}>
                Citizen Original Voice / Text Intake
              </div>
              <div style={{ fontSize: '13px', color: '#1c1917', fontStyle: 'italic', lineHeight: 1.45 }}>
                "{activeRequest.originalText}"
              </div>
            </div>

            <div style={{ background: '#fbf9f4', padding: '16px', borderRadius: '12px', border: '1px solid rgba(220, 210, 195, 0.8)', boxShadow: 'var(--clay-shadow-sm)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', marginBottom: '6px' }}>
                AI Standardized Interoperable Translation
              </div>
              <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45 }}>
                "{activeRequest.translatedText}"
              </div>
            </div>
          </div>

          {/* 6-Stage Tracking Stepper */}
          <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', color: '#0284c7', marginBottom: '16px' }}>
            DPI End-to-End Governance Lifecycle
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {PIPELINE_STAGES.map((stage, idx) => {
              const isCompleted = idx <= currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div 
                  key={stage.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: isCurrent 
                      ? '#e0f2fe' 
                      : isCompleted 
                        ? '#d1fae5' 
                        : '#fbf9f4',
                    border: isCurrent 
                      ? '2px solid #0284c7' 
                      : isCompleted 
                        ? '1px solid rgba(5, 150, 105, 0.3)' 
                        : '1px solid rgba(220, 210, 195, 0.7)',
                    boxShadow: isCurrent ? 'var(--clay-shadow-md)' : 'var(--clay-shadow-sm)'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: isCompleted ? '#059669' : isCurrent ? '#0284c7' : '#e7e2d6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '14px',
                    boxShadow: '1px 2px 4px rgba(0,0,0,0.15)'
                  }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : (idx + 1)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: isCompleted || isCurrent ? '#1c1917' : '#78716c' }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#57534e' }}>
                      {stage.desc}
                    </div>
                  </div>

                  <span className={`badge ${isCurrent ? 'badge-cyan' : isCompleted ? 'badge-emerald' : 'badge-ghost'}`}>
                    {isCurrent ? 'Active Stage' : isCompleted ? 'Verified' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
