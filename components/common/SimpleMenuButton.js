// =====================================
// components/common/SimpleMenuButton.js - SIMPLE MENU BUTTON
// =====================================
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const SimpleMenuButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={{
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 100,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={{
        width: 24,
        height: 20,
        justifyContent: 'space-between',
      }}>
        <View style={{
          width: 24,
          height: 3,
          backgroundColor: '#374151',
          borderRadius: 2,
        }} />
        <View style={{
          width: 20,
          height: 3,
          backgroundColor: '#374151',
          borderRadius: 2,
        }} />
        <View style={{
          width: 16,
          height: 3,
          backgroundColor: '#374151',
          borderRadius: 2,
        }} />
      </View>
    </TouchableOpacity>
  );
};

export default SimpleMenuButton;