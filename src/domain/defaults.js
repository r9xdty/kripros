// What the app starts with: default categories, and optionally a few
// months of sample records to explore the charts.
import { addDays, toDateKey } from '../lib/dates';

export const DEFAULT_CATEGORIES = [
  ['spending', 'Market', 'cart', '#ef4444'],
  ['spending', 'Yeme-İçme', 'restaurant', '#f97316'],
  ['spending', 'Ulaşım', 'car', '#eab308'],
  ['spending', 'Faturalar', 'receipt', '#06b6d4'],
  ['spending', 'Kira & Konut', 'home', '#8b5cf6'],
  ['spending', 'Sağlık', 'medkit', '#ec4899'],
  ['spending', 'Giyim', 'shirt', '#a855f7'],
  ['spending', 'Eğlence', 'game-controller', '#14b8a6'],
  ['spending', 'Eğitim', 'book', '#3b82f6'],
  ['spending', 'Teknoloji', 'laptop', '#6366f1'],
  ['spending', 'Abonelikler', 'repeat', '#0ea5e9'],
  ['spending', 'Diğer', 'ellipsis-horizontal', '#6b7280'],
  ['income', 'Maaş', 'briefcase', '#10b981'],
  ['income', 'Ek Gelir', 'trending-up', '#22c55e'],
  ['income', 'Yatırım', 'stats-chart', '#0ea5e9'],
  ['income', 'Hediye', 'gift', '#f59e0b'],
  ['income', 'Diğer', 'ellipsis-horizontal', '#6b7280'],
];

// Returns the new category ids keyed by "kind:name".
const addDefaultCategories = (store) => {
  const rows = store.upsertMany(
    'categories',
    DEFAULT_CATEGORIES.map(([kind, name, icon, color], index) => ({ kind, name, icon, color, sort_order: index + 1 })),
  );
  return Object.fromEntries(rows.map((row) => [`${row.kind}:${row.name}`, row.id]));
};

export const seedDefaults = (store) => {
  addDefaultCategories(store);
  store.upsert('settings', { currency: 'TRY' });
};

export const seedSampleData = (store, now = new Date()) => {
  const categories = addDefaultCategories(store);

  const coffee = store.upsert('saving_templates', { name: 'Kahve almadım', amount: 85, frequency: 'daily' });
  const metro = store.upsert('saving_templates', { name: 'Taksi yerine metro', amount: 220, frequency: 'weekly' });
  const lunch = store.upsert('saving_templates', { name: 'Evden yemek getirdim', amount: 180, frequency: 'daily' });

  const trip = store.upsert('goals', {
    name: 'Yaz tatili',
    target_amount: 40000,
    initial_amount: 5000,
    target_date: toDateKey(addDays(now, 240)),
    icon: 'airplane',
    color: '#0ea5e9',
  });
  const laptop = store.upsert('goals', { name: 'Yeni bilgisayar', target_amount: 55000, icon: 'laptop', color: '#8b5cf6' });

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = (offset) => toDateKey(addDays(today, -offset));
  const transactions = [];
  const add = (kind, amount, offset, extra) => transactions.push({ kind, amount, occurred_on: day(offset), ...extra });

  for (let month = 0; month < 6; month++) {
    const base = month * 30;
    add('income', 42000, base + 20, { title: 'Maaş', category_id: categories['income:Maaş'] });
    add('spending', 15000, base + 19, { title: 'Kira', category_id: categories['spending:Kira & Konut'] });
    add('spending', 1850 + month * 40, base + 15, { title: 'Elektrik & su', category_id: categories['spending:Faturalar'] });
    add('spending', 349, base + 12, { title: 'Dizi & müzik', category_id: categories['spending:Abonelikler'] });
    add('saving', 2500, base + 18, { title: 'Tatil birikimi', goal_id: trip.id });
    if (month % 2 === 0) add('income', 6500, base + 8, { title: 'Freelance proje', category_id: categories['income:Ek Gelir'] });
    if (month % 3 === 1) add('saving', 4000, base + 9, { title: 'Bilgisayar birikimi', goal_id: laptop.id });
  }

  const markets = [640, 1180, 420, 935, 760, 1320, 510];
  for (let offset = 0; offset < 60; offset++) {
    if (offset % 4 === 1) add('spending', markets[offset % markets.length], offset, { title: 'Market', category_id: categories['spending:Market'] });
    if (offset % 3 === 0) add('spending', 240 + (offset % 5) * 35, offset, { title: 'Dışarıda yemek', category_id: categories['spending:Yeme-İçme'] });
    if (offset % 6 === 2) add('spending', 180, offset, { title: 'Yakıt', category_id: categories['spending:Ulaşım'] });
    if (offset % 2 === 0 || offset < 5) add('saving', 85, offset, { title: coffee.name, template_id: coffee.id });
    if (offset % 7 === 3) add('saving', 220, offset, { title: metro.name, template_id: metro.id });
    if (offset % 3 === 1 && offset > 1) add('saving', 180, offset, { title: lunch.name, template_id: lunch.id });
  }
  add('spending', 2400, 26, { title: 'Mont', category_id: categories['spending:Giyim'] });
  add('spending', 950, 33, { title: 'Diş hekimi', category_id: categories['spending:Sağlık'] });
  add('spending', 600, 4, { title: 'Konser bileti', category_id: categories['spending:Eğlence'] });
  store.upsertMany('transactions', transactions);
  // Written last: its presence marks the first start as done.
  store.upsert('settings', { currency: 'TRY' });
};
