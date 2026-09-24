import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from './ui';
import { useSheets } from '../navigation/sheets';
import { colors, spacing } from '../theme';

export default function SheetLayout({ title, right, children, footer, scroll = true, contentStyle }) {
  const { pop, depth } = useSheets();
  const Body = scroll ? ScrollView : View;
  const bodyProps = scroll
    ? { contentContainerStyle: [styles.content, contentStyle], keyboardShouldPersistTaps: 'handled', showsVerticalScrollIndicator: false }
    : { style: [styles.fill, contentStyle] };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <IconButton icon={depth > 1 ? 'chevron-back' : 'close'} onPress={pop} label={depth > 1 ? 'Geri' : 'Kapat'} />
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.right}>{right}</View>
        </View>
        <Body {...bodyProps}>{children}</Body>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  right: { minWidth: 36, alignItems: 'flex-end' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
});
