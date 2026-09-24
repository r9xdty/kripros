import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, spacing } from '../theme';

export const TAB_BAR_HEIGHT = 64;

export function ScreenHeader({ title, subtitle, right }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={font.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

// Scrollable tab screen that respects the notch and leaves room for the tab bar.
export default function Screen({ children, scroll = true, contentStyle }) {
  const insets = useSafeAreaInsets();
  const padding = { paddingTop: insets.top + spacing.md, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xl };
  if (!scroll) return <View style={[styles.fill, padding, contentStyle]}>{children}</View>;
  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.content, padding, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg, gap: spacing.md },
  subtitle: { ...font.small, fontSize: 14, marginTop: 2 },
});
