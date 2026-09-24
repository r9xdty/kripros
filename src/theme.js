import { Platform } from 'react-native';

export const colors = {
  background: '#f3f6f4',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  border: '#e2e8f0',
  divider: '#eef2f0',

  primary: '#10b981',
  primaryDark: '#047857',
  primarySoft: '#d1fae5',

  income: '#2563eb',
  incomeSoft: '#dbeafe',
  spending: '#ef4444',
  spendingSoft: '#fee2e2',
  saving: '#10b981',
  savingSoft: '#d1fae5',

  warning: '#f59e0b',
  warningSoft: '#fef3c7',
  danger: '#dc2626',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

export const font = {
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  heading: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  small: { fontSize: 12, color: colors.textMuted },
};

export const shadow = Platform.select({
  web: { boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' },
  default: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
