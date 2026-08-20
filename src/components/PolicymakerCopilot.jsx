import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Printer, 
  Volume2, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Target, 
  Users, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { BRICS_COUNTRIES, INFRASTRUCTURE_SECTORS } from '../data/bricsData';
import { speechService } from '../services/speechService';
import { printPolicyBrief } from '../services/dpgExportService';
import '../styles/copilot.css';

export default function PolicymakerCopilot({ 
  activeCountryCode, 
  recommendedProjects, 
  citizenRequests,
  onNavigateToSimulator
}) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [activeDossierModal, setActiveDossierModal] = useState(null);

  // Filter projects for current country
  const countryProjects = recommendedProjects.filter(p => {
    const matchesCountry = p.countryCode === activeCountryCode;
    const matchesSector = selectedSector === 'all' || p.category === selectedSector;
    const matchesSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.problemStatement.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSector && matchesSearch;
  });

  // Calculate totals
  const totalInvestment = countryProjects.reduce((acc, p) => acc + (p.costUsdMillions || 0), 0);
  const avgPriority = countryProjects.length > 0 
    ? (countryProjects.reduce((acc, p) => acc + p.priorityScore, 0) / countryProjects.length).toFixed(1)
    : '0';

  const handleSpeakQuote = (quoteText) => {
    speechService.speak(quoteText, 'en-US');
  };

  const handleGenerateBrief = (project) => {
    printPolicyBrief(country, project, citizenRequests);
  };

  return (
    <div className="copilot-container animate-fade-in">
      {/* Copilot Hero Header */}
      <div className="copilot-hero">
        <div className="copilot-hero-text">
          <h1>
            <Sparkles size={28} className="text-cyan-400" />
            <span>National Infrastructure AI Co-Pilot</span>
            <span className="badge badge-cyan">{country.flag} {country.name}</span>
          </h1>
          <p>
            Synthesizing {citizenRequests.filter(r => r.countryCode === activeCountryCode).length}+ citizen voice & messaging requests 
            with national demographic indices and capital investment master plans to surface high-priority, bankable Digital Public Infrastructure initiatives.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="copilot-hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-val">{countryProjects.length}</div>
            <div className="hero-stat-label">Actionable Proposals</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val">${totalInvestment.toFixed(1)}M</div>
            <div className="hero-stat-label">Total Capital Required</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#10b981' }}>{avgPriority}</div>
            <div className="hero-stat-label">Avg AI Priority Score</div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Sector Filters */}
      <div className="copilot-controls-row">
        <div className="search-input-wrapper">
          <Search size={16} className="text-cyan-400" />
          <input 
            type="text"
            placeholder="Search proposals by keyword, district, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${selectedSector === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedSector('all')}
          >
            All Sectors ({recommendedProjects.filter(p => p.countryCode === activeCountryCode).length})
          </button>
          {INFRASTRUCTURE_SECTORS.map(sec => {
            const count = recommendedProjects.filter(p => p.countryCode === activeCountryCode && p.category === sec.id).length;
            return (
              <button
                key={sec.id}
                className={`btn btn-sm ${selectedSector === sec.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedSector(sec.id)}
              >
                <span>{sec.name.split(' ')[0]}</span>
                <span className="badge" style={{ padding: '2px 5px', fontSize: '9px' }}>{count}</span>
              </button>
            );
          })}
        </div>

        <button 
          className="btn btn-emerald btn-sm"
          onClick={onNavigateToSimulator}
        >
          <TrendingUp size={15} />
          <span>Launch What-If Budget Allocator</span>
        </button>
      </div>

      {/* Project Proposals Grid */}
      <div className="proposals-grid">
        {countryProjects.map(proj => {
          return (
            <div key={proj.id} className="project-dossier-card">
              {/* Top Header */}
              <div className="card-top-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-cyan">{proj.id}</span>
                    <span className="badge badge-emerald">{proj.sectorName}</span>
                    <span className="badge badge-purple">{proj.status}</span>
                  </div>
                  <h3 className="project-title">{proj.title}</h3>
                </div>

                <div className="priority-score-badge">
                  <div className="priority-score-number">{proj.priorityScore}</div>
                  <div className="priority-score-caption">MCDA Rank</div>
                </div>
              </div>

              {/* Problem Diagnosis */}
              <div className="dossier-problem-box">
                {proj.problemStatement}
              </div>

              {/* Citizen Verbatim Voice Sample */}
              {proj.citizenQuotes && proj.citizenQuotes[0] && (
                <div className="citizen-quote-box">
                  <span className="quote-text">{proj.citizenQuotes[0]}</span>
                  <button 
                    className="btn btn-ghost" 
                    style={{ padding: '4px' }}
                    onClick={() => handleSpeakQuote(proj.citizenQuotes[0])}
                    title="Play synthesized audio quote"
                  >
                    <Volume2 size={16} className="text-cyan-400" />
                  </button>
                </div>
              )}

              {/* MCDA Algorithmic Score Breakdown */}
              <div className="mcda-bars-grid">
                <div className="mcda-item">
                  <span className="mcda-label">Demand</span>
                  <span className="mcda-val" style={{ color: '#38bdf8' }}>{proj.metrics.demandScore}%</span>
                </div>
                <div className="mcda-item">
                  <span className="mcda-label">Deficit</span>
                  <span className="mcda-val" style={{ color: '#f59e0b' }}>{proj.metrics.deficitScore}%</span>
                </div>
                <div className="mcda-item">
                  <span className="mcda-label">Vulnerability</span>
                  <span className="mcda-val" style={{ color: '#ef4444' }}>{proj.metrics.vulnerabilityScore}%</span>
                </div>
                <div className="mcda-item">
                  <span className="mcda-label">SDG Impact</span>
                  <span className="mcda-val" style={{ color: '#10b981' }}>{proj.metrics.sdgMultiplier}%</span>
                </div>
                <div className="mcda-item">
                  <span className="mcda-label">Feasibility</span>
                  <span className="mcda-val" style={{ color: '#a855f7' }}>{proj.metrics.feasibility}%</span>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="dossier-metrics-strip">
                <div className="metric-col">
                  <span className="metric-col-title">Est. Budget</span>
                  <span className="metric-col-value">${proj.costUsdMillions}M ({proj.costLocalFormatted})</span>
                </div>
                <div className="metric-col">
                  <span className="metric-col-title">Beneficiaries</span>
                  <span className="metric-col-value" style={{ color: '#38bdf8' }}>{proj.beneficiaries}</span>
                </div>
                <div className="metric-col">
                  <span className="metric-col-title">Timeline</span>
                  <span className="metric-col-value">{proj.timelineMonths} Mos</span>
                </div>
                <div className="metric-col">
                  <span className="metric-col-title">Benefit ROI</span>
                  <span className="metric-col-value" style={{ color: '#10b981' }}>★ {proj.roiScore}/5.0</span>
                </div>
              </div>

              {/* DPI Technology Enablers */}
              <div className="dpi-tags-row">
                {proj.dpiEnablers?.map((enabler, idx) => (
                  <span key={idx} className="dpi-tag">⚙️ {enabler}</span>
                ))}
              </div>

              {/* Action Buttons Footer */}
              <div className="dossier-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleGenerateBrief(proj)}
                >
                  <Printer size={15} />
                  <span>Export Policy Brief (PDF)</span>
                </button>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveDossierModal(proj)}
                >
                  <span>Full Project Dossier</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Full Detail Modal */}
      {activeDossierModal && (
        <div className="modal-backdrop" onClick={() => setActiveDossierModal(null)}>
          <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '840px' }}>
            <div className="modal-header">
              <div>
                <span className="badge badge-cyan">{activeDossierModal.id} • {activeDossierModal.sectorName}</span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginTop: '4px' }}>
                  {activeDossierModal.title}
                </h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setActiveDossierModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Summary */}
              <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '13px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Solution Architecture Overview
                </h4>
                <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {activeDossierModal.solutionOverview}
                </p>
              </div>

              {/* Strategic Alignment */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Lead Public Agency</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginTop: '2px' }}>{activeDossierModal.leadAgency}</div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>National Master Plan Alignment</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', marginTop: '2px' }}>{activeDossierModal.alignment}</div>
                </div>
              </div>

              {/* Expected Public Outcomes */}
              <div>
                <h4 style={{ fontSize: '13px', color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Target Quantifiable Community Outcomes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeDossierModal.expectedOutcomes?.map((outcome, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SDG Badges */}
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  UN Sustainable Development Goals (SDGs)
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeDossierModal.sdgs?.map((sdg, idx) => (
                    <span key={idx} className="badge badge-purple" style={{ padding: '6px 12px', fontSize: '12px' }}>
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleGenerateBrief(activeDossierModal)}
                >
                  <Printer size={16} />
                  <span>Print Formal Policy Brief</span>
                </button>
                <button 
                  className="btn btn-emerald"
                  onClick={() => {
                    alert(`Initiated automated DPG RFP dispatch for ${activeDossierModal.id} to ${activeDossierModal.leadAgency}.`);
                    setActiveDossierModal(null);
                  }}
                >
                  Approve for RFP & Fast-Track
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
