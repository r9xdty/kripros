// =====================================
// utils/recommendationUtils.js - NEW FILE
// =====================================
import { formatDate } from './dateUtils';

// Frequency types
export const FREQUENCY_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const FREQUENCY_LABELS = {
  [FREQUENCY_TYPES.DAILY]: 'Günlük',
  [FREQUENCY_TYPES.WEEKLY]: 'Haftalık',
  [FREQUENCY_TYPES.MONTHLY]: 'Aylık',
  [FREQUENCY_TYPES.YEARLY]: 'Yıllık'
};

// Calculate days since last addition
const daysSinceLastAdded = (savingId, dailySavings, currentDate) => {
  let lastAddedDate = null;
  
  // Search through all daily savings to find the most recent addition
  Object.entries(dailySavings).forEach(([dateStr, savingsArray]) => {
    if (!dateStr.includes('_removed')) {
      const hasThisSaving = savingsArray.some(s => s.id === savingId);
      if (hasThisSaving) {
        const date = new Date(dateStr);
        if (!lastAddedDate || date > lastAddedDate) {
          lastAddedDate = date;
        }
      }
    }
  });
  
  if (!lastAddedDate) return Infinity;
  
  const diffTime = Math.abs(currentDate - lastAddedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Count how many times a saving was added in a period
const countAdditionsInPeriod = (savingId, dailySavings, startDate, endDate) => {
  let count = 0;
  
  Object.entries(dailySavings).forEach(([dateStr, savingsArray]) => {
    if (!dateStr.includes('_removed')) {
      const date = new Date(dateStr);
      if (date >= startDate && date <= endDate) {
        count += savingsArray.filter(s => s.id === savingId).length;
      }
    }
  });
  
  return count;
};

// Calculate recommendation score for a saving
const calculateRecommendationScore = (saving, dailySavings, currentDate) => {
  const daysSince = daysSinceLastAdded(saving.id, dailySavings, currentDate);
  
  // Base score based on frequency
  let baseScore = 0;
  let shouldRecommend = false;
  
  switch (saving.frequency) {
    case FREQUENCY_TYPES.DAILY:
      shouldRecommend = daysSince >= 1;
      baseScore = daysSince >= 1 ? 100 - (daysSince - 1) * 20 : 0;
      break;
    case FREQUENCY_TYPES.WEEKLY:
      shouldRecommend = daysSince >= 7;
      baseScore = daysSince >= 7 ? 100 - (daysSince - 7) * 10 : 0;
      break;
    case FREQUENCY_TYPES.MONTHLY:
      shouldRecommend = daysSince >= 30;
      baseScore = daysSince >= 30 ? 100 - (daysSince - 30) * 3 : 0;
      break;
    case FREQUENCY_TYPES.YEARLY:
      shouldRecommend = daysSince >= 365;
      baseScore = daysSince >= 365 ? 100 : 0;
      break;
    default:
      baseScore = 50; // Default score for savings without frequency
  }
  
  // Bonus score based on actual usage pattern
  const last30Days = new Date(currentDate);
  last30Days.setDate(last30Days.getDate() - 30);
  const recentAdditions = countAdditionsInPeriod(saving.id, dailySavings, last30Days, currentDate);
  
  // If user adds this saving frequently, boost the score
  const usageBonus = Math.min(recentAdditions * 5, 30);
  
  // Check if already added today
  const todayStr = formatDate(currentDate);
  const addedToday = dailySavings[todayStr]?.some(s => s.id === saving.id) || false;
  
  // If already added today and it's not a daily saving, reduce score significantly
  if (addedToday && saving.frequency !== FREQUENCY_TYPES.DAILY) {
    return 0;
  }
  
  return {
    score: Math.max(0, baseScore + usageBonus),
    shouldRecommend,
    daysSince,
    recentAdditions,
    reason: getRecommendationReason(saving, daysSince, shouldRecommend)
  };
};

// Get human-readable recommendation reason
const getRecommendationReason = (saving, daysSince, shouldRecommend) => {
  if (!shouldRecommend && saving.frequency) {
    return null;
  }
  
  if (daysSince === Infinity) {
    return 'Henüz hiç eklenmemiş';
  }
  
  switch (saving.frequency) {
    case FREQUENCY_TYPES.DAILY:
      if (daysSince === 1) return 'Bugün eklenebilir';
      if (daysSince > 1) return `${daysSince} gündür eklenmemiş`;
      break;
    case FREQUENCY_TYPES.WEEKLY:
      if (daysSince >= 7) return `${Math.floor(daysSince / 7)} haftadır eklenmemiş`;
      break;
    case FREQUENCY_TYPES.MONTHLY:
      if (daysSince >= 30) return `${Math.floor(daysSince / 30)} aydır eklenmemiş`;
      break;
    case FREQUENCY_TYPES.YEARLY:
      if (daysSince >= 365) return 'Yıllık tasarruf zamanı';
      break;
  }
  
  return `${daysSince} gün önce eklendi`;
};

// Main recommendation function
export const getRecommendedSavings = (savings, dailySavings, selectedDate) => {
  if (!savings || savings.length === 0) return [];
  
  const recommendations = savings.map(saving => {
    const analysis = calculateRecommendationScore(saving, dailySavings, selectedDate);
    return {
      ...saving,
      ...analysis
    };
  });
  
  // Filter and sort recommendations
  return recommendations
    .filter(r => r.score > 20) // Only show recommendations with decent scores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 recommendations
};

// Analyze saving patterns for insights
export const analyzeSavingPatterns = (savingId, dailySavings) => {
  const now = new Date();
  const last30Days = new Date(now);
  last30Days.setDate(last30Days.getDate() - 30);
  
  const last7Days = new Date(now);
  last7Days.setDate(last7Days.getDate() - 7);
  
  return {
    weeklyCount: countAdditionsInPeriod(savingId, dailySavings, last7Days, now),
    monthlyCount: countAdditionsInPeriod(savingId, dailySavings, last30Days, now),
    lastAdded: daysSinceLastAdded(savingId, dailySavings, now)
  };
};