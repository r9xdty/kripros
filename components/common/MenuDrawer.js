// =====================================
// components/common/MenuDrawer.js - FIXED VERSION
// =====================================
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated,
  Dimensions,
  Platform,
  BackHandler,
  Alert
} from 'react-native';
import Icon from './Icon';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75; // Drawer %75 genişliğinde

const MenuDrawer = ({ 
  isOpen, 
  onClose, 
  appSettings = {},
  setAppSettings = () => {},
  onClearData = () => {} 
}) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Android back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isOpen) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isOpen, onClose]);

  // Animasyon kontrolü
  useEffect(() => {
    if (isOpen) {
      // Açılma animasyonu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Kapanma animasyonu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isOpen]);

  const handleAbout = () => {
    Alert.alert(
      'Kripros v1.0.0',
      'Tasarruf takip uygulamanız.\n\n© 2025 Kripros\nTüm hakları saklıdır.',
      [{ text: 'Tamam' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Yardım',
      'Tasarruflarınızı ekleyin ve günlük takip edin.\n\nSorunuz varsa: destek@kripros.com',
      [{ text: 'Tamam' }]
    );
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      statusBarTranslucent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay - Drawer dışına tıklandığında kapansın */}
      <TouchableOpacity 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent'
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View 
          style={{
            flex: 1,
            backgroundColor: '#000',
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5]
            })
          }}
        />
      </TouchableOpacity>

      {/* Drawer Content */}
      <Animated.View 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          backgroundColor: '#fff',
          transform: [{ translateX: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 20,
        }}
      >
        {/* Header */}
        <View style={{
          paddingTop: Platform.OS === 'ios' ? 60 : 40,
          paddingHorizontal: 20,
          paddingBottom: 30,
          backgroundColor: '#10b981',
        }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: Platform.OS === 'ios' ? 50 : 30,
              right: 16,
              padding: 8,
              zIndex: 1,
            }}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon name="wallet" size={28} color="#fff" />
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }}>
                Kripros
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
                Tasarruf Takipçiniz
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ flex: 1, paddingTop: 20 }}>
          {/* Ana Özellikler */}
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingHorizontal: 4
            }}>
              Özellikler
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                marginBottom: 8
              }}
              onPress={() => {
                Alert.alert(
                  'İstatistikler',
                  `Toplam Tasarruf Sayısı: ${appSettings.totalSavings || 0}\nBu Ay: ₺${appSettings.monthlyTotal || 0}`,
                  [{ text: 'Tamam' }]
                );
              }}
            >
              <Icon name="stats-chart" size={20} color="#3b82f6" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#374151',
                marginLeft: 12 
              }}>
                İstatistikler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                marginBottom: 8
              }}
              onPress={() => {
                Alert.alert(
                  'Hedefler',
                  'Hedef belirleme özelliği yakında eklenecek!',
                  [{ text: 'Tamam' }]
                );
              }}
            >
              <Icon name="flag" size={20} color="#3b82f6" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#374151',
                marginLeft: 12 
              }}>
                Hedefler
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ayarlar */}
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingHorizontal: 4
            }}>
              Ayarlar
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                marginBottom: 8
              }}
              onPress={() => {
                Alert.alert(
                  'Bildirimler',
                  'Bildirim ayarları yakında eklenecek!',
                  [{ text: 'Tamam' }]
                );
              }}
            >
              <Icon name="notifications" size={20} color="#6b7280" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#374151',
                marginLeft: 12 
              }}>
                Bildirimler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                marginBottom: 8
              }}
              onPress={onClearData}
            >
              <Icon name="trash" size={20} color="#ef4444" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#ef4444',
                marginLeft: 12 
              }}>
                Verileri Temizle
              </Text>
            </TouchableOpacity>
          </View>

          {/* Yardım */}
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#9ca3af',
              textTransform: 'uppercase',
              marginBottom: 12,
              paddingHorizontal: 4
            }}>
              Destek
            </Text>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb',
                marginBottom: 8
              }}
              onPress={handleHelp}
            >
              <Icon name="help-circle" size={20} color="#6b7280" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#374151',
                marginLeft: 12 
              }}>
                Yardım
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: '#f9fafb'
              }}
              onPress={handleAbout}
            >
              <Icon name="information-circle" size={20} color="#6b7280" />
              <Text style={{ 
                fontSize: 16, 
                fontWeight: '500', 
                color: '#374151',
                marginLeft: 12 
              }}>
                Hakkında
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 12, color: '#9ca3af' }}>
            Versiyon 1.0.0
          </Text>
          <Text style={{ fontSize: 11, color: '#d1d5db', marginTop: 4 }}>
            © 2025 Kripros
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default MenuDrawer;