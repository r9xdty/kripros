// Small building blocks shared by every screen.
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from './Icon';
import { colors, font, radius, shadow, spacing } from '../theme';

export function Card({ children, style, padded = true }) {
  return <View style={[styles.card, padded && styles.cardPadded, style]}>{children}</View>;
}

export function SectionHeader({ title, actionLabel, onAction, style }) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={font.heading}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const BUTTON_VARIANTS = {
  primary: { bg: colors.primary, fg: '#fff', border: colors.primary },
  secondary: { bg: colors.card, fg: colors.text, border: colors.border },
  ghost: { bg: 'transparent', fg: colors.primaryDark, border: 'transparent' },
  danger: { bg: colors.card, fg: colors.danger, border: '#fecaca' },
};

export function Button({ title, onPress, icon, variant = 'primary', color, loading, disabled, style, compact }) {
  const v = BUTTON_VARIANTS[variant];
  const bg = color && variant === 'primary' ? color : v.bg;
  const border = color && variant === 'primary' ? color : v.border;
  const fg = color && variant !== 'primary' ? color : v.fg;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        { backgroundColor: bg, borderColor: border },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={compact ? 16 : 18} color={fg} /> : null}
          <Text style={[styles.buttonText, compact && styles.buttonTextCompact, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, color = colors.text, size = 22, style, label }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed, style]}
    >
      <Icon name={icon} size={size} color={color} />
    </Pressable>
  );
}

export function IconCircle({ icon, color, size = 40, soft }) {
  return (
    <View style={[styles.iconCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: soft || `${color}1f` }]}>
      <Icon name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

export function Segmented({ options, value, onChange, style }) {
  return (
    <View style={[styles.segmented, style]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.segment, active && styles.segmentActive, active && option.color && { backgroundColor: option.color }]}
          >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({ label, icon, color = colors.primary, selected, onPress, style, trailing }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: `${color}1f`, borderColor: color },
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={color} /> : null}
      <Text style={[styles.chipText, selected && { color, fontWeight: '700' }]} numberOfLines={1}>
        {label}
      </Text>
      {trailing}
    </Pressable>
  );
}

export function Field({ label, hint, error, style, inputStyle, ...inputProps }) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput placeholderTextColor={colors.textFaint} style={[styles.input, error && styles.inputError, inputStyle]} {...inputProps} />
      {error ? <Text style={styles.errorText}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function ProgressBar({ ratio, color = colors.primary, height = 10, style }) {
  const width = `${Math.round(Math.max(0, Math.min(1, ratio || 0)) * 100)}%`;
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View style={{ width, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

export function EmptyState({ icon, title, message, actionLabel, onAction, style }) {
  return (
    <View style={[styles.empty, style]}>
      <IconCircle icon={icon} color={colors.textFaint} soft={colors.divider} size={56} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMessage}>{message}</Text> : null}
      {actionLabel ? <Button title={actionLabel} onPress={onAction} compact style={{ marginTop: spacing.md }} /> : null}
    </View>
  );
}

export function Banner({ icon = 'information-circle', color = colors.warning, soft = colors.warningSoft, title, message, children }) {
  return (
    <View style={[styles.banner, { backgroundColor: soft, borderColor: `${color}55` }]}>
      <Icon name={icon} size={22} color={color} />
      <View style={{ flex: 1 }}>
        {title ? <Text style={styles.bannerTitle}>{title}</Text> : null}
        {message ? <Text style={styles.bannerMessage}>{message}</Text> : null}
        {children}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    ...shadow,
  },
  cardPadded: { padding: spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionAction: { color: colors.primaryDark, fontWeight: '600', fontSize: 14 },
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonCompact: { minHeight: 38, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  buttonText: { fontSize: 16, fontWeight: '700' },
  buttonTextCompact: { fontSize: 14 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
  iconButton: { padding: 6, borderRadius: radius.pill },
  iconCircle: { alignItems: 'center', justifyContent: 'center' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.divider,
    borderRadius: radius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentActive: { backgroundColor: colors.text },
  segmentText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  segmentTextActive: { color: '#fff' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    maxWidth: '100%',
  },
  chipText: { fontSize: 14, color: colors.text, flexShrink: 1 },
  field: { marginBottom: spacing.lg },
  fieldLabel: { ...font.label, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: 13, marginTop: 6 },
  hint: { ...font.small, marginTop: 6 },
  progressTrack: { backgroundColor: colors.divider, overflow: 'hidden' },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  emptyTitle: { ...font.heading, marginTop: spacing.md, textAlign: 'center' },
  emptyMessage: { ...font.small, fontSize: 14, marginTop: 6, textAlign: 'center', lineHeight: 20 },
  banner: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bannerTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  bannerMessage: { fontSize: 14, color: colors.text, marginTop: 2, lineHeight: 20 },
});
