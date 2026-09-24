import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from '../components/Icon';
import { colors, spacing } from '../theme';

const BAR_WIDTH = 96;
const SEGMENT_WIDTH = 38;
const NATIVE_DRIVER = Platform.OS !== 'web';

// Shown while the saved data loads. It matches the web loading screen in
// public/index.html and follows the native splash screen (same green), so the
// start feels like one screen.
export default function LoadingScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease = Easing.inOut(Easing.ease);
    const animation = Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.06, duration: 800, easing: ease, useNativeDriver: NATIVE_DRIVER }),
          Animated.timing(scale, { toValue: 1, duration: 800, easing: ease, useNativeDriver: NATIVE_DRIVER }),
        ]),
      ),
      Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1100, easing: ease, useNativeDriver: NATIVE_DRIVER })),
    ]);
    animation.start();
    return () => animation.stop();
  }, [scale, slide]);

  const translateX = slide.interpolate({ inputRange: [0, 1], outputRange: [-SEGMENT_WIDTH, BAR_WIDTH] });

  return (
    <View style={styles.screen} accessibilityRole="progressbar" accessibilityLabel="Kripros yükleniyor">
      <StatusBar style="light" />
      <Animated.View style={[styles.logo, { transform: [{ scale }] }]}>
        <Icon name="leaf" size={44} color="#fff" />
      </Animated.View>
      <Text style={styles.name}>Kripros</Text>
      <View style={styles.bar}>
        <Animated.View style={[styles.segment, { transform: [{ translateX }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: spacing.lg },
  bar: {
    width: BAR_WIDTH,
    height: 4,
    borderRadius: 2,
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  segment: { width: SEGMENT_WIDTH, height: 4, borderRadius: 2, backgroundColor: '#fff' },
});
