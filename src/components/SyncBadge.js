import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { colors } from '../theme';

const minutesAgo = (iso) => {
  if (!iso) return null;
  const minutes = Math.floor((Date.now() - Date.parse(iso)) / 60000);
  if (minutes < 1) return 'az önce';
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
};

// Human readable sync state, shared by the badge and the profile screen.
export const describeSync = (sync) => {
  if (!sync.online) {
    return {
      icon: 'cloud-offline',
      color: colors.textMuted,
      short: 'Çevrimdışı',
      long: sync.pending
        ? `Çevrimdışısın. ${sync.pending} değişiklik bağlantı gelince gönderilecek.`
        : 'Çevrimdışısın. Kayıt eklemeye devam edebilirsin.',
    };
  }
  if (sync.state === 'syncing') {
    return { icon: 'sync', color: colors.income, short: 'Eşitleniyor', long: 'Veriler eşitleniyor…' };
  }
  if (sync.failed) {
    return {
      icon: 'alert-circle',
      color: colors.danger,
      short: 'Sorun var',
      long: `${sync.failed} kayıt sunucu tarafından kabul edilmedi.`,
    };
  }
  if (sync.state === 'error') {
    return { icon: 'alert-circle', color: colors.warning, short: 'Bekliyor', long: `Eşitleme hatası: ${sync.lastError}` };
  }
  if (sync.pending) {
    return { icon: 'cloud-upload', color: colors.warning, short: `${sync.pending} bekliyor`, long: `${sync.pending} değişiklik gönderilmeyi bekliyor.` };
  }
  const ago = minutesAgo(sync.lastSyncedAt);
  return {
    icon: 'cloud-done',
    color: colors.primary,
    short: 'Eşitlendi',
    long: ago ? `Tüm veriler eşitlendi (${ago}).` : 'Tüm veriler eşitlendi.',
  };
};

export default function SyncBadge({ sync }) {
  const info = describeSync(sync);
  return (
    <View style={styles.badge} accessibilityLabel={info.long}>
      <Icon name={info.icon} size={14} color={info.color} />
      <Text style={[styles.text, { color: info.color }]}>{info.short}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontSize: 12, fontWeight: '600' },
});
