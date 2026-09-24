import React from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, font, spacing } from '../theme';

export default function LoadingScreen({ message = 'Yükleniyor…' }) {
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[font.small, { marginTop: spacing.md, fontSize: 15 }]}>{message}</Text>
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
});
