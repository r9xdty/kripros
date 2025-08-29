// =====================================
// src/components/common/TabBar.js - FIXED VERSION
// =====================================
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from './Icon';
import { styles } from '../../styles/common';

const TabBar = ({ activeTab, setActiveTab, theme }) => {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
        onPress={() => setActiveTab('dashboard')}
      >
        <Icon name="analytics" size={20} color={activeTab === 'dashboard' ? '#3b82f6' : '#6b7280'} />
        <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>
          Ana Sayfa
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
        onPress={() => setActiveTab('calendar')}
      >
        <Icon name="calendar" size={20} color={activeTab === 'calendar' ? '#3b82f6' : '#6b7280'} />
        <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
          Takvim
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
        onPress={() => setActiveTab('history')}
      >
        <Icon name="time" size={20} color={activeTab === 'history' ? '#3b82f6' : '#6b7280'} />
        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
          Geçmiş
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;