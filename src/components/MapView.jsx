import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Popup, 
  Tooltip, 
  useMap 
} from 'react-leaflet';
import { 
  Layers, 
  Eye, 
  AlertTriangle, 
  Users, 
  Building2, 
  Droplets, 
  Car, 
  Zap, 
  Activity, 
  Wifi,
  Sparkles,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { BRICS_COUNTRIES, INFRASTRUCTURE_SECTORS } from '../data/bricsData';
import '../styles/map.css';

// Map Controller for smooth flyTo transitions
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  activeCountryCode, 
  citizenRequests, 
  recommendedProjects,
  onNavigateToCopilot,
  onSelectProvinceFilter,
  selectedProvinceId
}) {
  const country = BRICS_COUNTRIES[activeCountryCode] || BRICS_COUNTRIES.IN;
  
  // Layer Toggles
  const [activeLayers, setActiveLayers] = useState({
    demandHotspots: true,
    demographics: true,
    infraDeficits: true,
    activeProjects: true
  });

  // Sector Filter
  const [selectedSector, setSelectedSector] = useState('all');
  
  // Currently highlighted citizen request on map
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Filter requests for current country and active sector
  const countryRequests = citizenRequests.filter(r => {
    const matchesCountry = r.countryCode === activeCountryCode;
    const matchesSector = selectedSector === 'all' || r.category === selectedSector;
    const matchesProvince = !selectedProvinceId || r.provinceId === selectedProvinceId;
    return matchesCountry && matchesSector && matchesProvince;
  });

  // Filter projects for current country
  const countryProjects = recommendedProjects.filter(p => {
    const matchesCountry = p.countryCode === activeCountryCode;
    const matchesSector = selectedSector === 'all' || p.category === selectedSector;
    const matchesProvince = !selectedProvinceId || p.provinceId === selectedProvinceId;
    return matchesCountry && matchesSector && matchesProvince;
  });

  // Active Map Center
  const selectedProvince = country.provinces?.find(p => p.id === selectedProvinceId);
  const mapCenter = selectedProvince ? selectedProvince.center : country.center;
  const mapZoom = selectedProvince ? 7 : country.defaultZoom;

  const toggleLayer = (layerKey) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Get color by category
  const getCategoryColor = (cat) => {
    const s = INFRASTRUCTURE_SECTORS.find(sec => sec.id === cat);
    return s ? s.color : '#06b6d4';
  };

  return (
    <div className="map-view-layout">
      {/* Left Sidebar: National Demographic & Regional Deficit Summary */}
      <aside className="map-sidebar">
        <div className="map-sidebar-header">
          <div className="country-summary-card">
            <span className="country-flag-huge">{country.flag}</span>
            <div className="country-headline">
              <h2>{country.name}</h2>
              <p>{country.nativeName} • Capital: {country.capital}</p>
            </div>
          </div>

          <div className="dpi-score-badge">
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              DPI Readiness Score
            </span>
            <span className="dpi-score-val">{country.dpiReadinessScore} / 100</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="sidebar-stats-grid">
          <div className="stat-item">
            <div className="stat-label">Total Population</div>
            <div className="stat-value">{country.population}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Rural / Urban Split</div>
            <div className="stat-value" style={{ fontSize: '14px' }}>
              {country.ruralRatio} / {country.urbanRatio}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Citizen Demands</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>
              {countryRequests.length} Active
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">AI Project Proposals</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {countryProjects.length} Pipeline
            </div>
          </div>
        </div>

        {/* National Strategic Priorities */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '6px' }}>
            National Infrastructure Directives
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {country.nationalPriorities?.slice(0, 3).map((pri, idx) => (
              <div key={idx} style={{ fontSize: '11px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#06b6d4' }}>•</span>
                <span>{pri}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Deficit & Vulnerability List */}
        <div className="sidebar-section-title">
          <span>Provinces / States ({country.provinces?.length || 0})</span>
          {selectedProvinceId && (
            <button 
              className="btn btn-ghost" 
              style={{ fontSize: '10px', padding: '2px 6px' }}
              onClick={() => onSelectProvinceFilter(null)}
            >
              Reset View
            </button>
          )}
        </div>

        <div className="province-list">
          {country.provinces?.map(prov => {
            const isSelected = prov.id === selectedProvinceId;
            return (
              <div 
                key={prov.id}
                className={`province-card ${isSelected ? 'active' : ''}`}
                onClick={() => onSelectProvinceFilter(isSelected ? null : prov.id)}
              >
                <div className="province-card-top">
                  <span className="province-name">{prov.name}</span>
                  <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                    Vulnerability {prov.vulnerabilityScore}%
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Pop: {prov.population} • Active Budget: ${prov.activeAllocatedBudgetUsd}M
                </div>

                {/* Mini Deficit Bars */}
                <div className="deficit-bars">
                  <div className="deficit-mini-bar">
                    <span className="deficit-mini-label">Water</span>
                    <div className="mini-progress-bg">
                      <div className="mini-progress-fill" style={{ width: `${prov.waterDeficit}%`, background: '#06b6d4' }} />
                    </div>
                  </div>
                  <div className="deficit-mini-bar">
                    <span className="deficit-mini-label">Road</span>
                    <div className="mini-progress-bg">
                      <div className="mini-progress-fill" style={{ width: `${prov.roadDeficit}%`, background: '#f59e0b' }} />
                    </div>
                  </div>
                  <div className="deficit-mini-bar">
                    <span className="deficit-mini-label">Power</span>
                    <div className="mini-progress-bg">
                      <div className="mini-progress-fill" style={{ width: `${prov.energyDeficit}%`, background: '#eab308' }} />
                    </div>
                  </div>
                  <div className="deficit-mini-bar">
                    <span className="deficit-mini-label">Health</span>
                    <div className="mini-progress-bg">
                      <div className="mini-progress-fill" style={{ width: `${prov.healthDeficit}%`, background: '#ef4444' }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Interactive Leaflet Canvas */}
      <div className="map-canvas-wrapper">
        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          {/* Light / Cream Voyager Basemap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={18}
          />

          {/* Layer 2: Demographic & Province Centers */}
          {activeLayers.demographics && country.provinces?.map(prov => (
            <CircleMarker
              key={`prov-${prov.id}`}
              center={prov.center}
              radius={Math.max(16, prov.vulnerabilityScore / 3)}
              pathOptions={{
                color: 'rgba(99, 102, 241, 0.6)',
                fillColor: 'rgba(99, 102, 241, 0.15)',
                fillOpacity: 0.4,
                weight: 2,
                dashArray: '4, 4'
              }}
              eventHandlers={{
                click: () => onSelectProvinceFilter(prov.id)
              }}
            >
              <Tooltip direction="top" opacity={0.9} permanent={false}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>
                  {prov.name} (Vulnerability: {prov.vulnerabilityScore}%)
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Layer 1: Citizen Demand Hotspots (Multilingual incoming requests) */}
          {activeLayers.demandHotspots && countryRequests.map(req => {
            const markerColor = getCategoryColor(req.category);
            const radius = Math.max(10, Math.min(24, req.urgency / 4));

            return (
              <CircleMarker
                key={req.id}
                center={req.coordinates}
                radius={radius}
                pathOptions={{
                  color: markerColor,
                  fillColor: markerColor,
                  fillOpacity: 0.75,
                  weight: req.urgency > 85 ? 3 : 1.5,
                }}
                eventHandlers={{
                  click: () => setSelectedRequest(req)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px', padding: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge" style={{ background: `${markerColor}22`, color: markerColor, border: `1px solid ${markerColor}44` }}>
                        {req.category.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '700' }}>
                        Urgency: {req.urgency}/100
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                      {req.locationName}
                    </div>

                    <div style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic', marginBottom: '6px' }}>
                      "{req.translatedText}"
                    </div>

                    <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Channel: {req.channel.toUpperCase()}</span>
                      <span>Impact: ~{req.beneficiaries} citizens</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating Controls: Layer Toggles & Sector Filter Bar */}
        <div className="map-floating-controls">
          <div className="layer-toggle-panel">
            <div className="control-title">
              <span>GIS Multi-Layer Fusion</span>
              <Layers size={13} className="text-cyan-400" />
            </div>

            <div className="layer-buttons-grid">
              <button 
                className={`layer-btn ${activeLayers.demandHotspots ? 'active' : ''}`}
                onClick={() => toggleLayer('demandHotspots')}
              >
                <Eye size={12} />
                <span>Citizen Hotspots</span>
              </button>

              <button 
                className={`layer-btn ${activeLayers.demographics ? 'active' : ''}`}
                onClick={() => toggleLayer('demographics')}
              >
                <Users size={12} />
                <span>Demographics</span>
              </button>

              <button 
                className={`layer-btn ${activeLayers.infraDeficits ? 'active' : ''}`}
                onClick={() => toggleLayer('infraDeficits')}
              >
                <AlertTriangle size={12} />
                <span>Infra Deficits</span>
              </button>

              <button 
                className={`layer-btn ${activeLayers.activeProjects ? 'active' : ''}`}
                onClick={() => toggleLayer('activeProjects')}
              >
                <Building2 size={12} />
                <span>Active Capital</span>
              </button>
            </div>

            {/* Sector Filters */}
            <div style={{ marginTop: '10px', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <div className="control-title" style={{ marginBottom: '4px' }}>
                <span>Infrastructure Sector Filter</span>
              </div>
              <div className="sector-pills-row">
                <button 
                  className="sector-pill-btn"
                  style={{
                    background: selectedSector === 'all' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                    color: selectedSector === 'all' ? '#38bdf8' : '#94a3b8',
                    borderColor: selectedSector === 'all' ? '#38bdf8' : 'transparent'
                  }}
                  onClick={() => setSelectedSector('all')}
                >
                  All Sectors
                </button>
                {INFRASTRUCTURE_SECTORS.map(sec => (
                  <button 
                    key={sec.id}
                    className="sector-pill-btn"
                    style={{
                      background: selectedSector === sec.id ? `${sec.color}33` : 'rgba(30, 41, 59, 0.6)',
                      color: selectedSector === sec.id ? sec.color : '#94a3b8',
                      borderColor: selectedSector === sec.id ? sec.color : 'transparent'
                    }}
                    onClick={() => setSelectedSector(sec.id)}
                  >
                    {sec.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Drawer: Selected Hotspot Details */}
        {selectedRequest && (
          <div className="hotspot-floating-card animate-fade-in">
            <div className="hotspot-info-left">
              <div className="hotspot-badge-row">
                <span className="badge badge-cyan">{selectedRequest.id}</span>
                <span className="badge badge-amber">Urgency: {selectedRequest.urgency}/100</span>
                <span className="badge badge-emerald">{selectedRequest.category.toUpperCase()}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Channel: {selectedRequest.channel}</span>
              </div>
              <div className="hotspot-location-title">
                {selectedRequest.locationName}
              </div>
              <div className="hotspot-verbatim">
                "{selectedRequest.translatedText}"
              </div>
              <div className="hotspot-meta-stats">
                <span>Beneficiaries Impacted: <strong>~{selectedRequest.beneficiaries.toLocaleString()}</strong></span>
                <span>Verification: <strong>{selectedRequest.dpiToken}</strong></span>
                <span>Status: <strong style={{ color: '#10b981' }}>{selectedRequest.status.replace('_', ' ').toUpperCase()}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => onNavigateToCopilot(selectedRequest)}
              >
                <Sparkles size={16} />
                <span>View AI Project Proposal</span>
                <ArrowRight size={14} />
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedRequest(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
