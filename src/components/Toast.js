import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from './Icon';
import { colors } from '../theme';

const ToastContext = createContext(() => {});
const NATIVE_DRIVER = Platform.OS !== 'web';

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const insets = useSafeAreaInsets();

  const show = useCallback(
    (message, { icon = 'checkmark-circle' } = {}) => {
      clearTimeout(timer.current);
      setToast({ message, icon, key: Date.now() });
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: NATIVE_DRIVER }).start();
      timer.current = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: NATIVE_DRIVER }).start(() => setToast(null));
      }, 2200);
    },
    [opacity],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast ? (
        <Animated.View style={[styles.toast, { opacity, top: insets.top + 12 }]}>
          <Icon name={toast.icon} size={18} color="#fff" />
          <Text style={styles.text}>{toast.message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    maxWidth: '90%',
    zIndex: 1000,
    elevation: 10,
    pointerEvents: 'none',
  },
  text: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
