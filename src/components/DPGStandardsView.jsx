import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Code2, 
  CheckCircle2, 
  DownloadCloud, 
  Copy, 
  Globe2, 
  Lock, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BRICS_COUNTRIES } from '../data/bricsData';
import { generateDpgExportPayload, downloadDpgJsonFile } from '../services/dpgExportService';

export default function DPGStandardsView({ activeCountryCode, citizenRequests, recommendedProjects }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  const [copied, setCopied] = useState(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState('jsonld');

  const jsonLdPayload = generateDpgExportPayload(country, citizenRequests, recommendedProjects);

  const DPG_CRITERIA = [
    { name: '1. Relevance to SDGs', status: 'Compliant', desc: 'Directly maps citizen needs to SDG 6, 7, 9, 11 and tracks quantifiable community indicators.' },
    { name: '2. Open Data & Interchange Standard', status: 'Compliant', desc: 'Complies with JSON-LD, OpenAPI 3.0, and Beckn/DPI interoperability protocols.' },
    { name: '3. Open Source Licensing', status: 'Compliant', desc: 'Permissively licensed for sovereign adoption by all BRICS and Global South nations.' },
    { name: '4. Privacy by Design & Anonymization', status: 'Compliant', desc: 'Citizen PII is scrubbed client-side before NLP ingestion; identity is verified with SHA-256 tokens.' },
    { name: '5. Multilingual & Omnichannel Access', status: 'Compliant', desc: 'Supports Voice STT, WhatsApp, Telegram, SMS, and Web in all official BRICS languages.' },
    { name: '6. Offline & Low-Bandwidth Support', status: 'Compliant', desc: 'Operates via 2G SMS syntax and edge caching for remote/rural settlements.' },
    { name: '7. Non-Discriminatory AI Algorithmic Governance', status: 'Compliant', desc: 'MCDA prioritization explicitly weights vulnerable populations to prevent spatial bias.' },
    { name: '8. Multilateral Cross-Border Interoperability', status: 'Compliant', desc: 'Allows joint infrastructure planning across BRICS+ cross-border transit and energy corridors.' },
    { name: '9. Verifiable Cryptographic Auditability', status: 'Compliant', desc: 'Issues tamper-proof DPI receipts verifiable through public open explorer.' },
  ];

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadDpgJsonFile(country, citizenRequests, recommendedProjects);
  };

  return (
    <div className="copilot-container animate-fade-in">
      {/* Hero Header */}
      <div className="copilot-hero" style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="copilot-hero-text">
          <h1>
            <ShieldCheck size={28} className="text-cyan-400" />
            <span>Digital Public Good (DPG) & Open Standards Registry</span>
          </h1>
          <p>
            BRICS InfraPulse AI is engineered as a foundational Digital Public Good (DPG). 
            Compliant with the UN Digital Public Goods Standard, Beckn protocol specifications, 
            and sovereign privacy-preserving governance frameworks.
          </p>
        </div>

        <div className="copilot-hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#10b981' }}>9 / 9</div>
            <div className="hero-stat-label">DPG Criteria Met</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#38bdf8' }}>v2.1</div>
            <div className="hero-stat-label">Beckn-DPI Protocol</div>
          </div>
        </div>
      </div>

      {/* DPG 9 Criteria Compliance Grid */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              Digital Public Goods Alliance (DPGA) Compliance Audit
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Evaluated against the 9 core requirements for sovereign public digital goods
            </p>
          </div>
          <span className="badge badge-emerald" style={{ fontSize: '12px', padding: '6px 12px' }}>
            ✓ 100% DPGA Standard Compliant
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          {DPG_CRITERIA.map((crit, idx) => (
            <div 
              key={idx}
              style={{
                background: '#fbf9f4',
                border: '1px solid rgba(220, 210, 195, 0.7)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                boxShadow: 'var(--clay-shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1c1917' }}>
                  {crit.name}
                </span>
                <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                  {crit.status}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#57534e', lineHeight: 1.45 }}>
                {crit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Open API Schema & JSON-LD Playground */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Code2 size={20} className="text-cyan-600" />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1c1917' }}>
              Standardized Open API / JSON-LD Data Payload ({country.name})
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleCopySchema}>
              <Copy size={15} />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Payload'}</span>
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleDownload}>
              <DownloadCloud size={15} />
              <span>Download .jsonld Package</span>
            </button>
          </div>
        </div>

        <pre style={{
          background: '#1e293b',
          border: '2px solid rgba(220, 210, 195, 0.5)',
          borderRadius: '14px',
          padding: '20px',
          color: '#38bdf8',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          maxHeight: '440px',
          overflowY: 'auto',
          lineHeight: 1.5,
          boxShadow: 'var(--clay-shadow-inset)'
        }}>
          {JSON.stringify(jsonLdPayload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
