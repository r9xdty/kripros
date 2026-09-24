import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const initialsOf = (name) =>
  (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase('tr'))
    .join('');

export default function Avatar({ name, size = 40 }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.primaryDark, fontWeight: '700' },
});
