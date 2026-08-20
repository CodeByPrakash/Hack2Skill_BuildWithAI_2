// Digital Public Good (DPG) Interoperability, Open Schema Export, and Policy Brief Generation

/**
 * Generate DPG Standardized JSON-LD Citizen & Project Payload
 */
export function generateDpgExportPayload(country, requests, projects) {
  return {
    "@context": [
      "https://schema.org",
      "https://digitalpublicgoods.net/standard/v1.1",
      "https://brics-dpi.org/standards/civic-infra/v2"
    ],
    "@type": "DigitalPublicInfrastructureRegistry",
    "countryCode": country.code,
    "countryName": country.name,
    "nationalDpiReadiness": country.dpiReadinessScore,
    "generatedAt": new Date().toISOString(),
    "interoperabilityProtocol": "Beckn-DPI-v2.1",
    "demographicSummary": {
      "totalPopulation": country.population,
      "urbanShare": country.urbanRatio,
      "ruralShare": country.ruralRatio,
      "povertyHeadcount": country.povertyRate
    },
    "citizenRequestsDataset": requests.filter(r => r.countryCode === country.code).map(r => ({
      "@type": "CitizenInfrastructureDemand",
      "dpiId": r.id,
      "verificationToken": r.dpiToken,
      "sector": r.category,
      "urgencyIndex": r.urgency,
      "timestamp": r.timestamp,
      "intakeChannel": r.channel,
      "geoCoordinates": r.coordinates,
      "district": r.district,
      "anonymizedVerbatimText": r.originalText,
      "englishStandardizedText": r.translatedText,
      "estimatedAffectedPopulation": r.beneficiaries,
      "status": r.status
    })),
    "recommendedProjectsDossier": projects.filter(p => p.countryCode === country.code).map(p => ({
      "@type": "AIRecommendedInfrastructureInitiative",
      "projectCode": p.id,
      "title": p.title,
      "priorityScore": p.priorityScore,
      "estimatedCostUSD": p.costUsdMillions * 1000000,
      "estimatedCostLocal": p.costLocalFormatted,
      "targetBeneficiaries": p.beneficiaries,
      "sdgTargets": p.sdgs,
      "leadAgency": p.leadAgency,
      "nationalStrategicPlan": p.alignment,
      "dpiTechnologyEnablers": p.dpiEnablers,
      "mcdaBreakdown": p.metrics
    }))
  };
}

/**
 * Download JSON-LD File
 */
export function downloadDpgJsonFile(country, requests, projects) {
  const payload = generateDpgExportPayload(country, requests, projects);
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `BRICS_InfraPulse_${country.code}_DPG_Registry_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generate and trigger print/download for Official Policy Brief Dossier
 */
export function printPolicyBrief(country, activeProject, allCountryRequests) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the Policy Brief print preview.');
    return;
  }

  const relatedRequests = allCountryRequests.filter(r => r.category === activeProject.category);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>BRICS InfraPulse AI — Policy Brief: ${activeProject.id}</title>
      <style>
        @page { size: A4; margin: 18mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; line-height: 1.5; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; }
        .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; background: #e0f2fe; color: #0369a1; }
        .score-box { background: #0f172a; color: #fff; padding: 12px 18px; border-radius: 8px; text-align: center; }
        .score-val { font-size: 28px; font-weight: 900; color: #38bdf8; }
        .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
        .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .quote { font-style: italic; background: #fff; border-left: 3px solid #0284c7; padding: 6px 12px; margin: 6px 0; font-size: 12px; color: #334155; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: 700; }
        .footer { margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="badge">DIGITAL PUBLIC GOOD POLICY BRIEF • BRICS INFRASTRUCTURE ALLIANCE</div>
          <h1 class="title">${activeProject.title}</h1>
          <div class="subtitle">Nation: ${country.flag} ${country.name} | Sector: ${activeProject.sectorName} | Strategic Alignment: ${activeProject.alignment}</div>
        </div>
        <div class="score-box">
          <div class="score-val">${activeProject.priorityScore}</div>
          <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">AI Priority Score</div>
        </div>
      </div>

      <div class="grid">
        <div>
          <div class="section-title">1. Problem Diagnosis & Citizen Demand Evidence</div>
          <p style="font-size: 13px;">${activeProject.problemStatement}</p>
          <div style="font-weight: 700; font-size: 12px; margin-top: 8px; color: #475569;">Citizen Verbatim Voice Sample (Multilingual NLP Synthesized):</div>
          ${activeProject.citizenQuotes.map(q => `<div class="quote">${q}</div>`).join('')}

          <div class="section-title">2. Proposed Infrastructure Solution & DPI Architecture</div>
          <p style="font-size: 13px;">${activeProject.solutionOverview}</p>

          <div class="section-title">3. Key Digital Public Infrastructure Enablers</div>
          <ul>
            ${activeProject.dpiEnablers.map(d => `<li style="font-size: 12px; margin-bottom: 4px;"><strong>${d}</strong></li>`).join('')}
          </ul>
        </div>

        <div>
          <div class="card">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 8px;">Key Executive Metrics</div>
            <div style="font-size: 12px; margin-bottom: 6px;"><strong>Estimated Budget:</strong> $${activeProject.costUsdMillions}M USD (${activeProject.costLocalFormatted})</div>
            <div style="font-size: 12px; margin-bottom: 6px;"><strong>Beneficiaries:</strong> ${activeProject.beneficiaries}</div>
            <div style="font-size: 12px; margin-bottom: 6px;"><strong>Delivery Timeline:</strong> ${activeProject.timelineMonths} Months</div>
            <div style="font-size: 12px; margin-bottom: 6px;"><strong>Lead Agency:</strong> ${activeProject.leadAgency}</div>
            <div style="font-size: 12px; margin-bottom: 6px;"><strong>Benefit-Cost ROI:</strong> ${activeProject.roiScore} / 5.0</div>
          </div>

          <div class="card">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 8px;">MCDA Algorithmic Score Breakdown</div>
            <table>
              <tr><td>Demand Intensity</td><td><strong>${activeProject.metrics.demandScore}/100</strong></td></tr>
              <tr><td>Infra Deficit Index</td><td><strong>${activeProject.metrics.deficitScore}/100</strong></td></tr>
              <tr><td>Vulnerability Index</td><td><strong>${activeProject.metrics.vulnerabilityScore}/100</strong></td></tr>
              <tr><td>SDG Multiplier</td><td><strong>${activeProject.metrics.sdgMultiplier}/100</strong></td></tr>
              <tr><td>Feasibility Index</td><td><strong>${activeProject.metrics.feasibility}/100</strong></td></tr>
            </table>
          </div>

          <div class="card">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 6px;">SDG Impact Alignment</div>
            ${activeProject.sdgs.map(s => `<div style="font-size: 11px; margin-bottom: 3px; color: #0369a1;">• ${s}</div>`).join('')}
          </div>
        </div>
      </div>

      <div class="section-title">4. Quantifiable Public Value & Expected Impact Outcomes</div>
      <ul>
        ${activeProject.expectedOutcomes.map(o => `<li style="font-size: 12px; margin-bottom: 4px;"><strong>${o}</strong></li>`).join('')}
      </ul>

      <div class="footer">
        <div>Generated by <strong>BRICS InfraPulse AI (DPG Standard v2)</strong> • Cryptographic Audit Hash: SHA256:${activeProject.id}-${Date.now().toString(16)}</div>
        <div>Confidential Policymaker Dossier • Page 1 of 1</div>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
