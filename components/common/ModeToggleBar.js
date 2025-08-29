// =====================================
// components/common/ModeToggleBar.js - APP MODE TOGGLE
// =====================================
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from './Icon';
import { styles } from '../../styles/modeToggle';

const ModeToggleBar = ({ appMode, setAppMode }) => {
  const toggleMode = () => {
    setAppMode(appMode === 'savings' ? 'spending' : 'savings');
  };

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity 
        style={[
          styles.toggleBar,
          appMode === 'spending' && styles.toggleBarSpending
        ]} 
        onPress={toggleMode}
        activeOpacity={0.8}
      >
        {/* Savings Mode */}
        <View style={[
          styles.modeSection,
          appMode === 'savings' && styles.activeModeSection
        ]}>
          <Icon 
            name="wallet" 
            size={20} 
            color={appMode === 'savings' ? '#fff' : '#10b981'} 
          />
          <Text style={[
            styles.modeText,
            appMode === 'savings' && styles.activeModeText
          ]}>
            Tasarruf
          </Text>
        </View>

        {/* Spending Mode */}
        <View style={[
          styles.modeSection,
          appMode === 'spending' && styles.activeModeSection
        ]}>
          <Icon 
            name="card" 
            size={20} 
            color={appMode === 'spending' ? '#fff' : '#ef4444'} 
          />
          <Text style={[
            styles.modeText,
            appMode === 'spending' && styles.activeModeText
          ]}>
            Harcama
          </Text>
        </View>

        {/* Sliding Indicator */}
        <View style={[
          styles.slidingIndicator,
          appMode === 'spending' && styles.slidingIndicatorSpending
        ]} />
      </TouchableOpacity>
    </View>
  );
};

export default ModeToggleBar;