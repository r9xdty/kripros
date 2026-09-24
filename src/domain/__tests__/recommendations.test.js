import { recommendTemplates } from '../recommendations';

const templates = [
  { id: 'coffee', name: 'Kahve almadım', amount: 45, frequency: 'daily' },
  { id: 'taxi', name: 'Taksi yerine metro', amount: 150, frequency: 'weekly' },
  { id: 'gym', name: 'Spor salonu iptali', amount: 800, frequency: 'monthly' },
  { id: 'new', name: 'Yeni alışkanlık', amount: 10, frequency: 'daily' },
];

const saving = (template_id, occurred_on) => ({ kind: 'saving', template_id, occurred_on, amount: 1 });

describe('recommendTemplates', () => {
  test('suggests habits that are due, most relevant first', () => {
    const txs = [
      saving('coffee', '2026-09-23'),
      saving('coffee', '2026-09-22'),
      saving('taxi', '2026-09-10'),
      saving('gym', '2026-09-20'),
    ];
    const recs = recommendTemplates(templates, txs, '2026-09-24');
    expect(recs.map((r) => r.template.id)).toEqual(['coffee', 'taxi', 'new']);
    expect(recs[0].reason).toBe('Dün de eklemiştin');
    expect(recs[1].reason).toBe('2 haftadır eklenmedi');
    expect(recs[2].reason).toBe('Henüz hiç eklenmedi');
  });

  test('skips habits already recorded that day and ignores future records', () => {
    const txs = [saving('coffee', '2026-09-24'), saving('taxi', '2026-09-30')];
    const recs = recommendTemplates(templates, txs, '2026-09-24', { limit: 10 });
    expect(recs.map((r) => r.template.id)).not.toContain('coffee');
    expect(recs.map((r) => r.template.id)).toContain('taxi');
  });

  test('long-abandoned habits drop out', () => {
    const recs = recommendTemplates(templates, [saving('coffee', '2026-01-01')], '2026-09-24', { limit: 10 });
    expect(recs.map((r) => r.template.id)).not.toContain('coffee');
  });
});
