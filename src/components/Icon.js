import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

// Icon names are Ionicons names (https://icons.expo.fyi). Unknown names
// (e.g. from an older app version) fall back to a neutral dot.
export default function Icon({ name, size = 20, color = '#0f172a', style }) {
  const glyph = Ionicons.glyphMap[name] ? name : 'ellipse';
  return <Ionicons name={glyph} size={size} color={color} style={style} />;
}
