import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Icon from '../components/Icon';
import { useAuth } from '../state/AuthContext';
import { colors, radius, spacing } from '../theme';

const FEATURES = [
  ['pie-chart', 'Gelir, harcama ve birikimlerini grafiklerle gör'],
  ['flag', 'Hedef koy, ne kadar yaklaştığını izle'],
  ['cloud-done', 'İnternet olmadan da çalışır, bağlanınca eşitlenir'],
];

export default function LoginScreen() {
  const { signInWithGoogle, signingIn, error } = useAuth();

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
        {error ? (
          <View style={styles.error}>
            <Icon name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <Pressable
          onPress={signInWithGoogle}
          disabled={signingIn}
          style={({ pressed }) => [styles.google, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Google ile devam et"
        >
          {signingIn ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <>
              <Icon name="logo-google" size={20} color="#ea4335" />
              <Text style={styles.googleText}>Google ile devam et</Text>
            </>
          )}
        </Pressable>
        <Text style={styles.fine}>
          Giriş yaparak verilerin hesabına bağlı olarak saklanır; yalnızca sen görebilirsin. Apple ile giriş yakında.
        </Text>
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
  bottom: { marginTop: 'auto', paddingBottom: spacing.xl },
  google: {
    minHeight: 54,
    borderRadius: radius.md,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  googleText: { fontSize: 17, fontWeight: '700', color: colors.text },
  fine: { color: '#a7f3d0', fontSize: 12, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
  error: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: { color: colors.danger, flex: 1, fontSize: 14 },
});
