// =====================================
// src/components/dashboard/ActionButtons.js
// =====================================
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/dashboard';

const ActionButtons = ({ onAddPress, onListPress }) => {
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}
        onPress={onAddPress}
      >
        <Icon name="add" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Tasarruf Ekle</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#10b981' }]}
        onPress={onListPress}
      >
        <Icon name="list" size={20} color="#fff" />
        <Text style={styles.actionButtonText}>Tasarruflarım</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;