import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { Button } from '../components/ui';
import { colors, font, radius, spacing } from '../theme';

export function LoadingScreen({ message = 'Yükleniyor…' }) {
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[font.small, { marginTop: spacing.md, fontSize: 15 }]}>{message}</Text>
    </SafeAreaView>
  );
}

// Shown on a new device when the first download could not finish.
export function FirstSyncScreen({ sync, onRetry, onSignOut }) {
  const offline = !sync.online || sync.state === 'offline';
  if (!offline && (sync.state === 'syncing' || (sync.state === 'idle' && !sync.lastError))) {
    return <LoadingScreen message="Verilerin hazırlanıyor…" />;
  }
  return (
    <SafeAreaView style={styles.center}>
      <Icon name={offline ? 'cloud-offline' : 'alert-circle'} size={48} color={offline ? colors.textMuted : colors.warning} />
      <Text style={[font.heading, styles.title]}>{offline ? 'İnternet bağlantısı yok' : 'Veriler indirilemedi'}</Text>
      <Text style={styles.message}>
        {offline
          ? 'Bu cihazda ilk kez giriş yaptın. Verilerini indirebilmemiz için bir kez internete bağlanman gerekiyor; sonrasında çevrimdışı da kullanabilirsin.'
          : sync.lastError}
      </Text>
      <Button title="Tekrar dene" icon="refresh" onPress={onRetry} style={{ marginTop: spacing.xl, alignSelf: 'stretch' }} />
      <Button title="Çıkış yap" variant="ghost" onPress={onSignOut} style={{ marginTop: spacing.sm }} />
    </SafeAreaView>
  );
}

// Developer-facing: the .env file with the Supabase keys is missing.
export function SetupScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        <Icon name="construct" size={40} color={colors.warning} />
        <Text style={[font.title, { marginTop: spacing.md }]}>Supabase bağlantısı eksik</Text>
        <Text style={styles.message}>
          Uygulama bir Supabase projesine bağlanmak için iki değere ihtiyaç duyuyor. Proje klasöründe .env dosyası oluşturup şunları
          yaz, ardından Expo’yu yeniden başlat (npx expo start -c):
        </Text>
        <View style={styles.code}>
          <Text style={styles.codeText}>EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co</Text>
          <Text style={styles.codeText}>EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...</Text>
        </View>
        <Text style={styles.message}>Adım adım kurulum README.md dosyasında.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: { marginTop: spacing.lg, textAlign: 'center' },
  message: { ...font.small, fontSize: 15, lineHeight: 22, marginTop: spacing.md, textAlign: 'left' },
  code: { backgroundColor: colors.text, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  codeText: { color: '#a7f3d0', fontFamily: 'monospace', fontSize: 12 },
});
