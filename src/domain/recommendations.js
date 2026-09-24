// Suggests which saving templates ("Kahve almadım", "Taksi yerine metro"…)
// are due on a given day, based on how often each one is expected to happen
// and when it was last recorded.
import { FREQUENCIES } from './constants';
import { addDaysToKey, daysBetween } from '../lib/dates';

const reasonFor = (frequency, daysSince) => {
  if (daysSince === Infinity) return 'Henüz hiç eklenmedi';
  switch (frequency) {
    case 'weekly':
      return `${Math.floor(daysSince / 7)} haftadır eklenmedi`;
    case 'monthly':
      return `${Math.floor(daysSince / 30)} aydır eklenmedi`;
    case 'yearly':
      return 'Yıllık birikim zamanı';
    default:
      return daysSince === 1 ? 'Dün de eklemiştin' : `${daysSince} gündür eklenmedi`;
  }
};

export const recommendTemplates = (templates, transactions, dateKey, { limit = 3 } = {}) => {
  const lastUsed = {};
  const recentUses = {};
  const usedThatDay = new Set();
  const windowStart = addDaysToKey(dateKey, -30);

  for (const tx of transactions) {
    if (tx.kind !== 'saving' || !tx.template_id || tx.occurred_on > dateKey) continue;
    if (!lastUsed[tx.template_id] || tx.occurred_on > lastUsed[tx.template_id]) lastUsed[tx.template_id] = tx.occurred_on;
    if (tx.occurred_on >= windowStart) recentUses[tx.template_id] = (recentUses[tx.template_id] || 0) + 1;
    if (tx.occurred_on === dateKey) usedThatDay.add(tx.template_id);
  }

  const scored = [];
  for (const template of templates) {
    if (usedThatDay.has(template.id)) continue;
    const period = (FREQUENCIES[template.frequency] || FREQUENCIES.daily).days;
    const daysSince = lastUsed[template.id] ? daysBetween(lastUsed[template.id], dateKey) : Infinity;
    if (daysSince < period) continue;

    // Due items score highest; the longer a habit has lapsed, the less
    // likely it still applies. Habits used often recently get a boost.
    const base = daysSince === Infinity ? 50 : 100 - ((daysSince - period) / period) * 20;
    const score = base + Math.min((recentUses[template.id] || 0) * 5, 30);
    if (score <= 20) continue;
    scored.push({ template, score, daysSince, reason: reasonFor(template.frequency, daysSince) });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
};
