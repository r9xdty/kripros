import { colors } from '../theme';

export const KINDS = {
  income: {
    label: 'Gelir',
    plural: 'Gelirler',
    color: colors.income,
    soft: colors.incomeSoft,
    icon: 'arrow-down-circle',
    sign: '+',
  },
  spending: {
    label: 'Harcama',
    plural: 'Harcamalar',
    color: colors.spending,
    soft: colors.spendingSoft,
    icon: 'arrow-up-circle',
    sign: '-',
  },
  saving: {
    label: 'Birikim',
    plural: 'Birikimler',
    color: colors.saving,
    soft: colors.savingSoft,
    icon: 'leaf',
    sign: '+',
  },
};

export const KIND_ORDER = ['spending', 'income', 'saving'];

export const FREQUENCIES = {
  daily: { label: 'Günlük', days: 1 },
  weekly: { label: 'Haftalık', days: 7 },
  monthly: { label: 'Aylık', days: 30 },
  yearly: { label: 'Yıllık', days: 365 },
};

export const PALETTE = [
  '#10b981', '#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6b7280',
];

export const CATEGORY_ICONS = [
  'cart', 'restaurant', 'cafe', 'car', 'bus', 'receipt', 'home', 'medkit', 'shirt',
  'game-controller', 'book', 'laptop', 'phone-portrait', 'repeat', 'airplane', 'paw',
  'fitness', 'gift', 'briefcase', 'trending-up', 'stats-chart', 'cash', 'school', 'ellipsis-horizontal',
];

export const GOAL_ICONS = [
  'flag', 'airplane', 'car', 'home', 'school', 'laptop', 'phone-portrait', 'heart',
  'diamond', 'gift', 'umbrella', 'bicycle',
];
