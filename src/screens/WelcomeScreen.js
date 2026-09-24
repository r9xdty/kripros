import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Icon from '../components/Icon';
import { useData } from '../state/DataContext';
import { useToast } from '../components/Toast';
import { BackupError } from '../domain/backup';
import { notify } from '../lib/dialogs';
import { colors, radius, spacing } from '../theme';

const FEATURES = [
  ['pie-chart', 'Gelir, harcama ve birikimlerini grafiklerle gör'],
  ['flag', 'Hedef koy, ne kadar yaklaştığını izle'],
  ['phone-portrait', 'Veriler yalnızca bu cihazda, internet gerekmez'],
];

export default function WelcomeScreen() {
  const data = useData();
  const [busy, setBusy] = useState(null);

  const toast = useToast();

  // New phone: bring the data over from a backup file.
  const restore = async () => {
    setBusy('restore');
    try {
      const backup = await data.readBackupFile();
      if (backup) {
        await data.restoreBackup(backup);
        toast('Yedek geri yüklendi');
        return;
      }
    } catch (error) {
      notify('Yedek açılamadı', error instanceof BackupError ? error.message : 'Dosya okunamadı.');
    }
    setBusy(null);
  };

  const start = (withSamples) => {
    setBusy(withSamples ? 'sample' : 'empty');
    // Let the spinner render before the (synchronous) seeding runs.
    setTimeout(() => (withSamples ? data.startWithSampleData() : data.startEmpty()), 0);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <View style={styles.logo}>
          <Icon name="leaf" size={44} color="#fff" />
        </View>
        <Text style={styles.brand}>Kripros</Text>
        <Text style={styles.tagline}>Birikimlerini ve harcamalarını tek yerde takip et.</Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map(([icon, text]) => (
          <View key={icon} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Icon name={icon} size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <Pressable
          onPress={() => start(true)}
          disabled={Boolean(busy)}
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}
          accessibilityRole="button"
        >
          {busy === 'sample' ? (
            <ActivityIndicator color={colors.primaryDark} />
          ) : (
            <>
              <Icon name="sparkles" size={20} color={colors.primaryDark} />
              <Text style={styles.primaryText}>Örnek verilerle keşfet</Text>
            </>
          )}
        </Pressable>
        <Pressable
          onPress={() => start(false)}
          disabled={Boolean(busy)}
          style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
        >
          {busy === 'empty' ? <ActivityIndicator color="#fff" /> : <Text style={styles.secondaryText}>Boş başla</Text>}
        </Pressable>
        <Pressable onPress={restore} disabled={Boolean(busy)} style={styles.link} accessibilityRole="button" hitSlop={6}>
          {busy === 'restore' ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="folder-open-outline" size={16} color="#d1fae5" />
              <Text style={styles.linkText}>Yedeğin var mı? Geri yükle</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.fine}>Örnek verileri istediğin zaman Ayarlar → “Tüm verileri sil” ile temizleyebilirsin.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryDark, paddingHorizontal: spacing.xl },
  top: { alignItems: 'center', marginTop: spacing.xxl * 1.5 },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: '#fff', fontSize: 36, fontWeight: '800', marginTop: spacing.lg },
  tagline: { color: '#d1fae5', fontSize: 16, marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 },
  features: { marginTop: spacing.xxl, gap: spacing.md },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { color: '#fff', fontSize: 15, flex: 1, lineHeight: 20 },
  bottom: { marginTop: 'auto', paddingBottom: spacing.xl, gap: spacing.sm },
  primary: {
    minHeight: 54,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  primaryText: { fontSize: 17, fontWeight: '700', color: colors.primaryDark },
  secondary: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  link: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 36, marginTop: spacing.xs },
  linkText: { color: '#d1fae5', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  fine: { color: '#a7f3d0', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
