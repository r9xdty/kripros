// =====================================
// src/components/dashboard/ActionButtons.js - FIXED DYNAMIC VERSION
// =====================================
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';

const ActionButtons = ({ onAddPress, onListPress, appMode = 'savings' }) => {
  // Dynamic text and colors based on mode
  const isSpendingMode = appMode === 'spending';
  const addButtonText = isSpendingMode ? 'Harcama Ekle' : 'Tasarruf Ekle';
  const listButtonText = isSpendingMode ? 'Harcamalarım' : 'Tasarruflarım';
  const addButtonColor = isSpendingMode ? '#ef4444' : '#3b82f6'; // Red for spending, blue for savings
  const listButtonColor = isSpendingMode ? '#f97316' : '#10b981'; // Orange for spending, green for savings
  
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: addButtonColor }]}
        onPress={onAddPress}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>{addButtonText}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: listButtonColor }]}
        onPress={onListPress}
      >
        <Icon name="list" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>{listButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;