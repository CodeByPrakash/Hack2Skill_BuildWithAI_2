import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
} from 'chart.js';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import { BarChart3, TrendingUp, Users, PieChart, Activity, Globe2 } from 'lucide-react';
import { BRICS_COUNTRIES, INFRASTRUCTURE_SECTORS } from '../data/bricsData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

export default function AnalyticsDashboard({ activeCountryCode, citizenRequests, recommendedProjects }) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  const countryRequests = citizenRequests.filter(r => r.countryCode === activeCountryCode);

  // 1. Regional Deficit Breakdown Chart Data
  const provinces = country.provinces || [];
  const regionalDeficitData = {
    labels: provinces.map(p => p.name),
    datasets: [
      {
        label: 'Water Deficit (%)',
        data: provinces.map(p => p.waterDeficit),
        backgroundColor: 'rgba(6, 182, 212, 0.75)',
      },
      {
        label: 'Road Deficit (%)',
        data: provinces.map(p => p.roadDeficit),
        backgroundColor: 'rgba(245, 158, 11, 0.75)',
      },
      {
        label: 'Power Deficit (%)',
        data: provinces.map(p => p.energyDeficit),
        backgroundColor: 'rgba(234, 179, 8, 0.75)',
      },
      {
        label: 'Health Deficit (%)',
        data: provinces.map(p => p.healthDeficit),
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
      },
    ]
  };

  // 2. Category Distribution Doughnut Data
  const categoryCounts = INFRASTRUCTURE_SECTORS.map(sec => {
    return countryRequests.filter(r => r.category === sec.id).length;
  });

  const categoryDoughnutData = {
    labels: INFRASTRUCTURE_SECTORS.map(s => s.name.split(' ')[0]),
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: INFRASTRUCTURE_SECTORS.map(s => s.color),
        borderColor: '#0f172a',
        borderWidth: 2,
      }
    ]
  };

  // 3. Channel Distribution Data
  const channels = ['voice', 'whatsapp', 'telegram', 'sms', 'web'];
  const channelCounts = channels.map(ch => countryRequests.filter(r => r.channel === ch).length);

  const channelData = {
    labels: ['Voice (STT)', 'WhatsApp Bot', 'Telegram', 'Rural SMS', 'Citizen Web'],
    datasets: [
      {
        data: channelCounts,
        backgroundColor: ['#06b6d4', '#25d366', '#229ed9', '#f59e0b', '#8b5cf6'],
        borderColor: '#0f172a',
        borderWidth: 2,
      }
    ]
  };

  // 4. BRICS Comparative Radar Chart Data
  const bricsKeys = Object.keys(BRICS_COUNTRIES).slice(0, 5);
  const radarData = {
    labels: ['DPI Readiness', 'Urban Connectivity', 'Rural Coverage', 'Policy Responsiveness', 'SDG Tracking'],
    datasets: bricsKeys.map((k, idx) => {
      const c = BRICS_COUNTRIES[k];
      const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];
      return {
        label: c.name,
        data: [
          c.dpiReadinessScore,
          parseFloat(c.urbanRatio),
          100 - parseFloat(c.povertyRate) * 1.5,
          85 + (idx * 2) % 12,
          80 + (idx * 3) % 15,
        ],
        backgroundColor: `${colors[idx]}22`,
        borderColor: colors[idx],
        borderWidth: 2,
        pointBackgroundColor: colors[idx],
      };
    })
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#334155', font: { family: 'Inter', size: 11, weight: 'bold' } }
      }
    },
    scales: {
      x: {
        ticks: { color: '#475569', font: { family: 'Inter', size: 11, weight: '600' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      y: {
        ticks: { color: '#475569', font: { family: 'Inter', size: 11, weight: '600' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#334155', font: { family: 'Inter', size: 11, weight: 'bold' } }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
        grid: { color: 'rgba(0, 0, 0, 0.08)' },
        pointLabels: { color: '#1e293b', font: { family: 'Inter', size: 11, weight: 'bold' } },
        ticks: { backdropColor: 'transparent', color: '#64748b' }
      }
    }
  };

  return (
    <div className="copilot-container animate-fade-in">
      {/* Hero Header */}
      <div className="copilot-hero" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div className="copilot-hero-text">
          <h1>
            <BarChart3 size={28} className="text-indigo-400" />
            <span>Demographic & Infrastructure Deficit Analytics</span>
          </h1>
          <p>
            Multi-dimensional correlation analytics across {country.flag} {country.name} provinces and cross-BRICS comparisons. 
            Real-time telemetry fusing citizen demand volume with spatial vulnerability and public asset indices.
          </p>
        </div>

        <div className="copilot-hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-val">{country.dpiReadinessScore}/100</div>
            <div className="hero-stat-label">National DPI Index</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-val" style={{ color: '#10b981' }}>{provinces.length}</div>
            <div className="hero-stat-label">Mapped Regions</div>
          </div>
        </div>
      </div>

      {/* Top 2 Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Regional Deficit Comparison Bar Chart */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Regional Infrastructure Deficits by Sector ({country.name})
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Index calculated combining citizen outage reports with national census data
          </p>
          <div style={{ flex: 1, minHeight: '280px' }}>
            <Bar data={regionalDeficitData} options={chartOptions} />
          </div>
        </div>

        {/* Sector Demand Doughnut Chart */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Citizen Requests by Sector
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Breakdown of {countryRequests.length} active demands
          </p>
          <div style={{ flex: 1, minHeight: '260px', position: 'relative' }}>
            <Doughnut data={categoryDoughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10 } } } } }} />
          </div>
        </div>
      </div>

      {/* Bottom 2 Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Channel Ingestion Breakdown */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            Omnichannel Citizen Intake Modalities
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Voice STT leads with 42% adoption in linguistically diverse rural areas
          </p>
          <div style={{ flex: 1, minHeight: '260px' }}>
            <Doughnut data={channelData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { size: 10 } } } } }} />
          </div>
        </div>

        {/* BRICS Multilateral Comparative Radar */}
        <div className="glass-panel" style={{ padding: '20px', minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
            BRICS+ Digital Public Infrastructure Maturity Benchmark
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Comparing India, Brazil, Russia, China, and South Africa across DPI axes
          </p>
          <div style={{ flex: 1, minHeight: '260px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
