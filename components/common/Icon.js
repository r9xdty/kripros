// =====================================
// src/components/common/Icon.js - FIXED VERSION
// =====================================
import React from 'react';
import { Text } from 'react-native';
import { ICON_MAP } from '../../constants';

const Icon = ({ name, size = 20, color = '#000' }) => {
  // Ensure all values are valid
  const iconSize = size || 20;
  const iconColor = color || '#000';
  const iconChar = ICON_MAP[name] || '•';
  
  return (
    <Text style={{ fontSize: iconSize, color: iconColor }}>
      {iconChar}
    </Text>
  );
};

export default Icon;