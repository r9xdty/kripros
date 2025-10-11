// =====================================
// components/common/HamburgerMenu.js - FIXED VERSION
// =====================================
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const HamburgerMenu = ({ isOpen, onPress }) => {
  return (
    <TouchableOpacity 
      style={{
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 1000,
        elevation: 1000,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      }}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={{
        width: 24,
        height: 20,
        justifyContent: 'space-between',
      }}>
        {/* Top Line */}
        <View style={{
          width: isOpen ? 24 : 24,
          height: 3,
          backgroundColor: '#374151',
          borderRadius: 2,
          transform: isOpen ? [
            { rotate: '45deg' },
            { translateY: 8.5 }
          ] : []
        }} />
        
        {/* Middle Line */}
        {!isOpen && (
          <View style={{
            width: 20,
            height: 3,
            backgroundColor: '#374151',
            borderRadius: 2,
          }} />
        )}
        
        {/* Bottom Line */}
        <View style={{
          width: isOpen ? 24 : 16,
          height: 3,
          backgroundColor: '#374151',
          borderRadius: 2,
          transform: isOpen ? [
            { rotate: '-45deg' },
            { translateY: -8.5 }
          ] : []
        }} />
      </View>
    </TouchableOpacity>
  );
};

export default HamburgerMenu;