// =====================================
// components/common/HamburgerMenu.js - HAMBURGER MENU BUTTON
// =====================================
import React from 'react';
import { TouchableOpacity, View, Animated } from 'react-native';
import { styles } from '../../styles/hamburgerMenu';

const HamburgerMenu = ({ isOpen, onPress }) => {
  const rotateValue = isOpen ? '45deg' : '0deg';
  const rotateValueReverse = isOpen ? '-45deg' : '0deg';
  const scaleValue = isOpen ? 0 : 1;

  return (
    <TouchableOpacity 
      style={styles.hamburgerButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.hamburgerContainer}>
        <Animated.View 
          style={[
            styles.hamburgerLine,
            styles.hamburgerLineTop,
            {
              transform: [
                { rotate: rotateValue },
                { translateY: isOpen ? 8 : 0 }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.hamburgerLine,
            styles.hamburgerLineMiddle,
            {
              transform: [{ scaleX: scaleValue }],
              opacity: isOpen ? 0 : 1
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.hamburgerLine,
            styles.hamburgerLineBottom,
            {
              transform: [
                { rotate: rotateValueReverse },
                { translateY: isOpen ? -8 : 0 }
              ]
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

export default HamburgerMenu;