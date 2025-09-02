// =====================================
// components/modals/MenuModal.js - SIMPLE MODAL MENU
// =====================================
import React from 'react';
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from '../common/Icon';
import { styles } from '../../styles/modals';

const MenuModal = ({ visible, onClose, appMode, setAppMode }) => {
  
  const handleModeChange = (mode) => {
    setAppMode(mode);
    setTimeout(onClose, 150); // Close menu after selection
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { 
              maxHeight: '70%', 
              margin: 20,
              borderRadius: 24,
              marginBottom: 'auto',
              marginTop: 100
            }]}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Menü</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Icon name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Mode Selection Section */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '600', 
                    color: '#9ca3af', 
                    textTransform: 'uppercase', 
                    marginBottom: 12 
                  }}>
                    Uygulama Modu
                  </Text>
                  
                  {/* Savings Mode */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: appMode === 'savings' ? '#f0fdf4' : '#f9fafb',
                      borderRadius: 12,
                      marginBottom: 8,
                      borderWidth: appMode === 'savings' ? 2 : 1,
                      borderColor: appMode === 'savings' ? '#10b981' : '#e5e7eb'
                    }}
                    onPress={() => handleModeChange('savings')}
                  >
                    <Icon name="wallet" size={24} color={appMode === 'savings' ? '#10b981' : '#6b7280'} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: appMode === 'savings' ? '#10b981' : '#374151' 
                      }}>
                        Tasarruf Takibi
                      </Text>
                      <Text style={{ fontSize: 13, color: '#9ca3af' }}>
                        Biriktirdiklerinizi takip edin
                      </Text>
                    </View>
                    {appMode === 'savings' && (
                      <Icon name="checkmark-circle" size={20} color="#10b981" />
                    )}
                  </TouchableOpacity>

                  {/* Spending Mode */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: appMode === 'spending' ? '#fef2f2' : '#f9fafb',
                      borderRadius: 12,
                      borderWidth: appMode === 'spending' ? 2 : 1,
                      borderColor: appMode === 'spending' ? '#ef4444' : '#e5e7eb'
                    }}
                    onPress={() => handleModeChange('spending')}
                  >
                    <Icon name="card" size={24} color={appMode === 'spending' ? '#ef4444' : '#6b7280'} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: appMode === 'spending' ? '#ef4444' : '#374151' 
                      }}>
                        Harcama Takibi
                      </Text>
                      <Text style={{ fontSize: 13, color: '#9ca3af' }}>
                        Harcamalarınızı kontrol edin
                      </Text>
                    </View>
                    {appMode === 'spending' && (
                      <Icon name="checkmark-circle" size={20} color="#ef4444" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Other Options */}
                <View>
                  <Text style={{ 
                    fontSize: 12, 
                    fontWeight: '600', 
                    color: '#9ca3af', 
                    textTransform: 'uppercase', 
                    marginBottom: 12 
                  }}>
                    Diğer
                  </Text>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#f9fafb',
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <Icon name="settings" size={24} color="#6b7280" />
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#374151', marginLeft: 12 }}>
                      Ayarlar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#f9fafb',
                      borderRadius: 12,
                      marginBottom: 8
                    }}
                  >
                    <Icon name="stats-chart" size={24} color="#6b7280" />
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#374151', marginLeft: 12 }}>
                      İstatistikler
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: '#f9fafb',
                      borderRadius: 12
                    }}
                  >
                    <Icon name="information-circle" size={24} color="#6b7280" />
                    <Text style={{ fontSize: 16, fontWeight: '500', color: '#374151', marginLeft: 12 }}>
                      Hakkında (v1.0.0)
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MenuModal;