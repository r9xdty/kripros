// =====================================
// components/common/MenuDrawer.js - SAVINGS ONLY VERSION
// =====================================
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import Icon from './Icon';
import { StyleSheet } from 'react-native';

const MenuDrawer = ({ isOpen, onClose }) => {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View style={styles.drawer}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerContent}>
              <Icon name="wallet" size={28} color="#10b981" />
              <Text style={styles.appName}>Tasarruf Takipçim</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Icon name="information-circle" size={20} color="#3b82f6" />
              <Text style={styles.menuItemText}>Hakkında</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="help-circle" size={20} color="#3b82f6" />
              <Text style={styles.menuItemText}>Yardım</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Icon name="settings" size={20} color="#3b82f6" />
              <Text style={styles.menuItemText}>Ayarlar</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.versionText}>Versiyon 1.0.0</Text>
            <Text style={styles.copyrightText}>© 2025 Tasarruf Takipçim</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  drawer: {
    backgroundColor: '#fff',
    width: 280,
    height: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  appInfo: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
    color: '#d1d5db',
  },
});

export default MenuDrawer;