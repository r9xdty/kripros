// =====================================
// src/components/common/Icon.js
// =====================================
import React from 'react';
import { Text } from 'react-native';
import { ICON_MAP } from '../../constants';

const Icon = ({ name, size = 20, color = '#000' }) => {
  return (
    <Text style={{ fontSize: size, color }}>
      {ICON_MAP[name] || '•'}
    </Text>
  );
};

export default Icon;