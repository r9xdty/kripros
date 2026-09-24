import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const initialsOf = (name) =>
  (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase('tr'))
    .join('');

export default function Avatar({ name, url, size = 40 }) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: size / 2 };
  if (url && !failed) {
    return <Image source={{ uri: url }} style={[box, styles.image]} onError={() => setFailed(true)} />;
  }
  return (
    <View style={[box, styles.fallback]}>
      <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.divider },
  fallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  initials: { color: colors.primaryDark, fontWeight: '700' },
});
