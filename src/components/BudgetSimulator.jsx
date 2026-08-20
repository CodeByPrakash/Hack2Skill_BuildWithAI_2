import React, { useState, useMemo } from 'react';
import { 
  Sliders, 
  DollarSign, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  PieChart,
  ShieldAlert,
  Award
} from 'lucide-react';
import { BRICS_COUNTRIES, INFRASTRUCTURE_SECTORS } from '../data/bricsData';
import { optimizeBudgetAllocation } from '../services/aiEngine';

export default function BudgetSimulator({ activeCountryCode, recommendedProjects }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  
  const countryProjects = recommendedProjects.filter(p => p.countryCode === activeCountryCode);
  const totalNeed = countryProjects.reduce((acc, p) => acc + (p.costUsdMillions || 0), 0);

  // Budget Slider State ($ Millions USD)
  const [budgetCap, setBudgetCap] = useState(Math.round(totalNeed * 0.65) || 120);

  // Run AI Optimization
  const optimizationResult = useMemo(() => {
    return optimizeBudgetAllocation(countryProjects, budgetCap);
  }, [countryProjects, budgetCap]);

  const { allocatedProjects, totalCost, remainingBudget, totalBeneficiariesCount, coveragePct } = optimizationResult;

  // Local currency equivalent
  const budgetLocal = (budgetCap * country.usdExchangeRate).toFixed(1);

  return (
    <div className="copilot-container animate-fade-in">
      {/* Hero Header */}
      <div className="copilot-hero" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="copilot-hero-text">
          <h1>
            <Sliders size={28} className="text-emerald-400" />
            <span>"What-If" Capital Budget Scenario Simulator</span>
          </h1>
          <p>
            Dynamically stress-test public capital allocations for {country.flag} {country.name}. 
            Our AI optimization algorithm distributes finite capital to maximize citizen demand resolution, 
            prioritize high-vulnerability communities, and minimize regional infrastructure deficits.
          </p>
        </div>

        <div className="copilot-hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#10b981' }}>${budgetCap}M</div>
            <div className="hero-stat-label">Allocated Budget</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#38bdf8' }}>{coveragePct}%</div>
            <div className="hero-stat-label">Demands Funded</div>
          </div>
        </div>
      </div>

      {/* Interactive Capital Slider Panel */}
      <div className="glass-panel" style={{ padding: '24px 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#10b981' }}>
              National / Provincial Infrastructure Budget Slider
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#1c1917', marginTop: '2px' }}>
              Available Capital: ${budgetCap} Million USD (~{country.currencySymbol} {budgetLocal} {country.currency.split(' ')[0]})
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setBudgetCap(50)}>$50M Cap</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setBudgetCap(100)}>$100M Cap</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setBudgetCap(Math.round(totalNeed))}>100% Need (${Math.round(totalNeed)}M)</button>
          </div>
        </div>

        <input 
          type="range"
          min="20"
          max={Math.max(250, Math.round(totalNeed * 1.2))}
          step="5"
          value={budgetCap}
          onChange={(e) => setBudgetCap(parseInt(e.target.value))}
          className="range-slider"
          style={{ width: '100%', height: '8px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#78716c', marginTop: '8px' }}>
          <span>Min: $20M USD</span>
          <span>Baseline National Pipeline: ${totalNeed.toFixed(1)}M USD</span>
          <span>Max: ${Math.max(250, Math.round(totalNeed * 1.2))}M USD</span>
        </div>
      </div>

      {/* Comparison: Traditional vs AI Allocation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Traditional Allocation Box */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '5px solid #e11d48' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <ShieldAlert size={20} className="text-rose-600" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#be123c' }}>
              Traditional Disjointed Public Allocation
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#57534e', lineHeight: 1.5, marginBottom: '14px' }}>
            Historical spending based on legacy static tenders and fragmented department silos without live citizen feedback integration.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#ffe4e6', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#9f1239' }}>
              ❌ <strong>~38% Fiscal Inefficiency:</strong> High capital deployed to low-demand administrative zones.
            </div>
            <div style={{ background: '#ffe4e6', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#9f1239' }}>
              ❌ <strong>Delayed Response Time:</strong> 18-24 months average lag between citizen complaint and project initiation.
            </div>
            <div style={{ background: '#ffe4e6', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#9f1239' }}>
              ❌ <strong>Zero Cryptographic Traceability:</strong> Citizens unable to audit allocation status.
            </div>
          </div>
        </div>

        {/* AI Demand-Driven Allocation Box */}
        <div className="glass-panel" style={{ padding: '24px', borderLeft: '5px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={20} className="text-emerald-600" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#047857' }}>
              BRICS InfraPulse AI Demand-Driven Allocation
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: '#57534e', lineHeight: 1.5, marginBottom: '14px' }}>
            Algorithmic capital distribution mathematically optimizing citizen demand density, vulnerability index, and SDG impact.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#065f46' }}>
              ✅ <strong>94.8% Community Alignment:</strong> 100% of funded capital directly resolves verified citizen hotspots.
            </div>
            <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#065f46' }}>
              ✅ <strong>~{totalBeneficiariesCount.toLocaleString()} Citizens Impacted:</strong> Maximizes collective welfare per dollar spent.
            </div>
            <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#065f46' }}>
              ✅ <strong>Verifiable DPG Auditability:</strong> Open API receipts linked to national DPI registries.
            </div>
          </div>
        </div>
      </div>

      {/* Dynamically Optimized Project Allocation Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1c1917' }}>
              AI Prioritized Capital Distribution ({allocatedProjects.length} Projects Funded)
            </h3>
            <p style={{ fontSize: '12px', color: '#78716c' }}>
              Total Deployed: ${totalCost}M USD | Unallocated Reserve: ${remainingBudget}M USD
            </p>
          </div>
          <span className="badge badge-emerald">Optimal Pareto Frontier</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {allocatedProjects.map((proj, idx) => (
            <div 
              key={proj.id}
              style={{
                background: '#fbf9f4',
                border: '1px solid rgba(220, 210, 195, 0.7)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: 'var(--clay-shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span className="badge badge-cyan" style={{ fontSize: '11px' }}>#{idx + 1}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#1c1917' }}>
                    {proj.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#78716c', marginTop: '2px' }}>
                    {proj.sectorName} • Lead Agency: {proj.leadAgency}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#0284c7' }}>
                    ${proj.allocatedAmount}M USD
                  </div>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>
                    ({proj.costLocalFormatted})
                  </div>
                </div>

                <span 
                  className={`badge ${proj.allocationStatus === 'Fully Funded' ? 'badge-emerald' : 'badge-amber'}`}
                  style={{ minWidth: '100px', textAlign: 'center', justifyContent: 'center' }}
                >
                  {proj.allocationStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
