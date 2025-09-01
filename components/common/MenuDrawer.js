// =====================================
// components/common/MenuDrawer.js - FIXED BLOCKING ISSUE
// =====================================
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform
} from 'react-native';
import Icon from './Icon';
import { styles } from '../../styles/menuDrawer';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75; // 75% of screen width

const MenuDrawer = ({ isOpen, onClose, appMode, setAppMode }) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      // Open animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Close animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const handleModeChange = (mode) => {
    setAppMode(mode);
    setTimeout(onClose, 150); // Close menu after selection
  };

  // IMPORTANT: Don't render anything when closed
  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Dark Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            }
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Sliding Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
            width: DRAWER_WIDTH,
          }
        ]}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.drawerContent}
        >
          {/* Header */}
          <View style={styles.drawerHeader}>
            <Icon name="wallet" size={32} color="#10b981" />
            <Text style={styles.drawerTitle}>Tasarruf Takipçim</Text>
            <Text style={styles.drawerSubtitle}>Paranızı kontrol altında tutun</Text>
          </View>

          {/* Mode Selection Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uygulama Modu</Text>
            
            {/* Savings Mode Option */}
            <TouchableOpacity 
              style={[
                styles.menuItem,
                appMode === 'savings' && styles.activeMenuItem
              ]}
              onPress={() => handleModeChange('savings')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Icon 
                  name="wallet" 
                  size={24} 
                  color={appMode === 'savings' ? '#10b981' : '#6b7280'} 
                />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[
                  styles.menuItemTitle,
                  appMode === 'savings' && styles.activeMenuItemTitle
                ]}>
                  Tasarruf Takibi
                </Text>
                <Text style={styles.menuItemDescription}>
                  Biriktirdiklerinizi takip edin
                </Text>
              </View>
              {appMode === 'savings' && (
                <Icon name="checkmark-circle" size={20} color="#10b981" />
              )}
            </TouchableOpacity>

            {/* Spending Mode Option */}
            <TouchableOpacity 
              style={[
                styles.menuItem,
                appMode === 'spending' && styles.activeMenuItem
              ]}
              onPress={() => handleModeChange('spending')}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemIcon}>
                <Icon 
                  name="card" 
                  size={24} 
                  color={appMode === 'spending' ? '#ef4444' : '#6b7280'} 
                />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={[
                  styles.menuItemTitle,
                  appMode === 'spending' && styles.activeMenuItemTitle
                ]}>
                  Harcama Takibi
                </Text>
                <Text style={styles.menuItemDescription}>
                  Harcamalarınızı kontrol edin
                </Text>
              </View>
              {appMode === 'spending' && (
                <Icon name="checkmark-circle" size={20} color="#ef4444" />
              )}
            </TouchableOpacity>
          </View>

          {/* Additional Menu Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diğer</Text>
            
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemIcon}>
                <Icon name="settings" size={24} color="#6b7280" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Ayarlar</Text>
                <Text style={styles.menuItemDescription}>Uygulama ayarları</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemIcon}>
                <Icon name="stats-chart" size={24} color="#6b7280" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>İstatistikler</Text>
                <Text style={styles.menuItemDescription}>Detaylı raporlar</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemIcon}>
                <Icon name="information-circle" size={24} color="#6b7280" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Hakkında</Text>
                <Text style={styles.menuItemDescription}>Versiyon 1.0.0</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

export default MenuDrawer;