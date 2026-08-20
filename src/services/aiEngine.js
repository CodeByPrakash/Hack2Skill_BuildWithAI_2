// AI Engine: NLP Intent Extraction, Multilingual Translation, Urgency Scoring, MCDA Prioritization, & Capital Allocation Optimizer

export const SECTOR_KEYWORDS = {
  water: ['water', 'tap', 'well', 'pump', 'pipeline', 'saline', 'sewage', 'sanitation', 'jal', 'pani', 'paani', 'fluorosis', 'água', 'poço', 'seca', 'вода', 'скважина', 'труба', '水', '水利', '蓄水池', 'amanzi', 'ithemba', 'مياه', 'صرف'],
  transport: ['road', 'bridge', 'pothole', 'highway', 'traffic', 'transit', 'bus', 'sarak', 'pul', 'sadak', 'rail', 'flyover', 'rodovia', 'estrada', 'ponte', 'дорога', 'мост', 'путепровод', '路', '公路', '桥', 'isikolo', 'inselelo', 'طريق', 'جسر'],
  energy: ['power', 'electricity', 'solar', 'grid', 'blackout', 'bijli', 'voltage', 'transformer', 'luz', 'energia', 'apagão', 'электричество', 'свет', 'котельная', 'теплосеть', '电', '电网', '光伏', 'ugetsi', 'load shedding', 'كهرباء', 'طاقة'],
  health: ['hospital', 'clinic', 'doctor', 'medicine', 'ambulance', 'maternity', 'phc', 'aspatal', 'swasthya', 'saúde', 'posto', 'vacina', 'больница', 'поликлиника', 'врач', '医院', '诊所', '卫生院', 'esibhedlela', 'impilo', 'مستشفى', 'عيادة'],
  digital: ['internet', 'wifi', '5g', 'telecom', 'fiber', 'broadband', 'network', 'tower', 'connectivity', 'नेटवर्क', 'इंटरनेट', 'fibra', 'conecta', 'связь', 'интернет', 'госуслуги', '网络', '光纤', 'ibroadband', 'إنترنت', 'اتصالات']
};

export const URGENCY_MODIFIERS = [
  { word: 'emergency', weight: 25 },
  { word: 'urgent', weight: 20 },
  { word: 'critical', weight: 22 },
  { word: 'broken', weight: 15 },
  { word: 'outbreak', weight: 30 },
  { word: 'disease', weight: 20 },
  { word: 'death', weight: 35 },
  { word: 'dying', weight: 25 },
  { word: 'flood', weight: 22 },
  { word: 'severe', weight: 18 },
  { word: 'danger', weight: 20 },
  { word: 'pregnant', word2: 'maternity', weight: 25 },
  { word: 'months', weight: 12 },
  { word: 'years', weight: 18 },
  { word: 'children', weight: 15 },
  { word: 'school', weight: 12 },
  { word: 'accident', weight: 20 },
  { word: 'खराब', weight: 15 },
  { word: 'बाढ़', weight: 20 },
  { word: 'खतरा', weight: 22 },
  { word: 'बीमारी', weight: 20 },
  { word: 'urgente', weight: 20 },
  { word: 'perigo', weight: 20 },
  { word: 'seca', weight: 18 },
  { word: 'срочно', weight: 20 },
  { word: 'авария', weight: 22 },
  { word: 'замерзаем', weight: 25 },
  { word: '紧急', weight: 25 },
  { word: '危险', weight: 20 },
  { word: '塌方', weight: 22 },
  { word: 'yaphuthuma', weight: 20 },
  { word: 'عاجل', weight: 25 },
  { word: 'كارثة', weight: 25 }
];

/**
 * Classify category based on text keywords
 */
export function classifyCategory(text) {
  const lower = (text || '').toLowerCase();
  let bestCategory = 'water';
  let maxMatches = -1;

  for (const [cat, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    let matches = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = cat;
    }
  }
  return bestCategory;
}

/**
 * Calculate AI urgency score (1 - 100)
 */
export function calculateUrgency(text, initialCategory) {
  const lower = (text || '').toLowerCase();
  let score = 50; // baseline

  // Base score boost by category severity
  if (initialCategory === 'water' || initialCategory === 'health') score += 15;
  if (initialCategory === 'energy' || initialCategory === 'transport') score += 10;

  for (const item of URGENCY_MODIFIERS) {
    if (lower.includes(item.word.toLowerCase()) || (item.word2 && lower.includes(item.word2.toLowerCase()))) {
      score += item.weight;
    }
  }

  // Length modifier (longer detailed requests indicate serious structural complaints)
  if (text && text.length > 80) score += 6;

  return Math.min(99, Math.max(35, Math.round(score)));
}

/**
 * Simulate AI multilingual translation & intent parsing
 */
export function analyzeCitizenRequest(input) {
  const { text, language, countryCode, provinceId, channel, coordinates } = input;
  const category = classifyCategory(text);
  const urgency = calculateUrgency(text, category);

  // Generate cryptographic token
  const randomHex = Math.random().toString(16).substring(2, 10);
  const dpiToken = `SHA256:${randomHex}${Date.now().toString(16).slice(-6)}`;
  const dpiId = `DPI-${countryCode}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Estimated impacted beneficiaries based on category and urgency
  const multiplier = category === 'water' ? 350 : category === 'transport' ? 600 : category === 'health' ? 500 : 300;
  const beneficiaries = Math.round((urgency / 10) * multiplier + Math.floor(Math.random() * 800));

  let sentiment = 'negative';
  if (urgency > 85) sentiment = 'critical';
  else if (urgency < 60) sentiment = 'neutral';

  return {
    id: dpiId,
    countryCode,
    provinceId: provinceId || 'UP',
    locationName: input.locationName || 'Community Cluster Area',
    coordinates: coordinates || [25.3176, 82.9739],
    channel: channel || 'web',
    language: language || 'hi-IN',
    category,
    originalText: text,
    translatedText: language === 'en-US' || language === 'en-IN' ? text : `[AI Multilingual Synthesis]: ${text}`,
    urgency,
    sentiment,
    timestamp: 'Just now',
    beneficiaries,
    status: urgency > 80 ? 'policy_prioritized' : 'clustered',
    audioDuration: input.audioDuration || null,
    dpiToken,
  };
}

/**
 * Multi-Criteria Decision Analysis (MCDA) Prioritization Model
 * Priority = 0.30 * Demand + 0.25 * Deficit + 0.20 * Vulnerability + 0.15 * SDG + 0.10 * Feasibility
 */
export function calculateMCDAPriority(demandScore, deficitScore, vulnerabilityScore, sdgMultiplier = 90, feasibility = 85) {
  const score = (
    0.30 * demandScore +
    0.25 * deficitScore +
    0.20 * vulnerabilityScore +
    0.15 * sdgMultiplier +
    0.10 * feasibility
  );
  return Math.round(score * 10) / 10;
}

/**
 * Dynamic Budget Optimization Algorithm
 * Distributes an available budget cap across candidate projects to maximize collective community impact score
 */
export function optimizeBudgetAllocation(projects, availableBudgetUsdMillions) {
  if (!projects || projects.length === 0) return { allocatedProjects: [], totalCost: 0, totalBeneficiaries: 0, coveragePct: 0 };

  // Sort projects by ROI Score * Priority Score density (Benefit-Cost Ratio)
  const sorted = [...projects].map(p => {
    const cost = p.costUsdMillions || 50;
    const efficiency = (p.priorityScore * (p.roiScore || 4.5)) / cost;
    return { ...p, efficiency };
  }).sort((a, b) => b.efficiency - a.efficiency);

  let currentBudget = availableBudgetUsdMillions;
  const allocatedProjects = [];
  let totalCost = 0;
  let totalBeneficiariesCount = 0;

  for (const proj of sorted) {
    if (proj.costUsdMillions <= currentBudget) {
      currentBudget -= proj.costUsdMillions;
      totalCost += proj.costUsdMillions;
      allocatedProjects.push({ ...proj, allocationStatus: 'Fully Funded', allocatedAmount: proj.costUsdMillions });
      
      // Parse beneficiaries
      const numMatch = (proj.beneficiaries || '').replace(/[^0-9.]/g, '');
      const isMillion = (proj.beneficiaries || '').includes('Million');
      const num = parseFloat(numMatch) || 1;
      totalBeneficiariesCount += isMillion ? num * 1000000 : num;
    } else if (currentBudget > 10) {
      // Partial Phase-1 Funding
      const partial = Math.round(currentBudget * 10) / 10;
      totalCost += partial;
      allocatedProjects.push({ ...proj, allocationStatus: 'Phase 1 Funded', allocatedAmount: partial });
      currentBudget = 0;
      break;
    }
  }

  const allProjectsCost = projects.reduce((acc, curr) => acc + (curr.costUsdMillions || 0), 0);
  const coveragePct = Math.min(100, Math.round((totalCost / (allProjectsCost || 1)) * 100));

  return {
    allocatedProjects,
    totalCost: Math.round(totalCost * 10) / 10,
    remainingBudget: Math.round(currentBudget * 10) / 10,
    totalBeneficiariesCount: Math.round(totalBeneficiariesCount),
    coveragePct,
  };
}
