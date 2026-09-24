import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

// In a desktop browser the app is shown as a phone-width column instead of
// stretching across the whole screen. Native apps render children as is.
export default function WebFrame({ children }) {
  if (Platform.OS !== 'web') return children;
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: 'center', backgroundColor: '#dfe8e3' },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    overflow: 'hidden',
    backgroundColor: colors.background,
    boxShadow: '0 0 24px rgba(15, 23, 42, 0.12)',
  },
});
