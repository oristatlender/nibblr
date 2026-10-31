// Reusable building blocks (buttons, cards, progress bars) so every screen looks and behaves the same.

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../theme';
import { Icon, IconName } from './Icon';

// A full screen with safe-area padding. On a wide web window it stays phone-width and centered.
export function Screen({
  children,
  scroll = true,
  bg = colors.bg,
  footer,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
  footer?: React.ReactNode;
}) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top', 'left', 'right']}>
      <View style={styles.column}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollBody} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.scrollBody, { flex: 1 }]}>{children}</View>
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

type Variant = 'primary' | 'secondary' | 'success' | 'warn' | 'ghost';

const variantStyle: Record<Variant, { bg: string; edge: string; text: string; border?: string }> = {
  primary: { bg: colors.primary, edge: colors.primaryDark, text: '#FFFFFF' },
  secondary: { bg: colors.primarySoft, edge: colors.primary, text: colors.primaryDark, border: colors.primary },
  success: { bg: colors.success, edge: colors.successDark, text: '#FFFFFF' },
  warn: { bg: colors.warn, edge: colors.warnDark, text: '#FFFFFF' },
  ghost: { bg: 'transparent', edge: 'transparent', text: colors.primaryDark },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = variantStyle[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? colors.lineSoft : v.bg,
          borderBottomColor: disabled ? colors.line : v.edge,
          borderBottomWidth: variant === 'ghost' ? 0 : pressed ? 2 : 5,
          borderColor: v.border ?? 'transparent',
          borderWidth: v.border ? 2 : 0,
          transform: [{ translateY: pressed && variant !== 'ghost' ? 3 : 0 }],
        },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: disabled ? colors.faint : v.text }]}>{label}</Text>
    </Pressable>
  );
}

// A selectable answer: checkbox-style for multi-select, plain for single choice.
export function Option({
  label,
  detail,
  selected,
  onPress,
  multi,
  state,
  right,
}: {
  label: string;
  detail?: string;
  selected?: boolean;
  onPress?: () => void;
  multi?: boolean;
  state?: 'correct' | 'wrong' | 'dim';
  right?: React.ReactNode;
}) {
  const border = state === 'correct' ? colors.success : state === 'wrong' ? colors.warn : selected ? colors.primary : colors.line;
  const bg = state === 'correct' ? colors.successSoft : state === 'wrong' ? colors.warnSoft : selected ? colors.primarySoft : '#FFFFFF';
  return (
    <Pressable
      accessibilityRole={multi ? 'checkbox' : 'button'}
      accessibilityState={multi ? { checked: !!selected } : { selected: !!selected }}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.option, { borderColor: border, backgroundColor: bg, opacity: state === 'dim' ? 0.6 : 1 }]}
    >
      {multi ? (
        <View style={[styles.checkbox, selected ? { backgroundColor: colors.primary, borderColor: colors.primary } : null]}>
          {selected ? <Icon name="check" size={16} color="#FFFFFF" stroke={4} /> : null}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.optionLabel}>{label}</Text>
        {detail ? <Text style={[type.small, { marginTop: 2 }]}>{detail}</Text> : null}
      </View>
      {state === 'correct' ? <Icon name="check" color={colors.successText} stroke={3} /> : null}
      {state === 'wrong' ? <Icon name="close" color={colors.warn} stroke={3} /> : null}
      {right}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function ProgressBar({ value, color = colors.primary }: { value: number; color?: string }) {
  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
    >
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

// Top row of a flow: back or close button, then a progress bar and an optional label.
export function FlowHeader({
  onBack,
  icon = 'back',
  progress,
  label,
  color,
}: {
  onBack?: () => void;
  icon?: IconName;
  progress?: number;
  label?: string;
  color?: string;
}) {
  return (
    <View style={styles.flowHeader}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel={icon === 'close' ? 'Close' : 'Back'} onPress={onBack} style={styles.iconBtn}>
          <Icon name={icon} color={colors.faint} stroke={3} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <View style={{ flex: 1 }}>{progress !== undefined ? <ProgressBar value={progress} color={color} /> : null}</View>
      {label ? <Text style={[type.small, { minWidth: 44, textAlign: 'right' }]}>{label}</Text> : <View style={{ width: 44 }} />}
    </View>
  );
}

export function IconTile({ name, color, bg, size = 44 }: { name: IconName; color: string; bg: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: 14, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={name} color={color} size={size * 0.55} />
    </View>
  );
}

export function Pill({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
      <Text style={{ color, fontSize: 13, fontWeight: '800', letterSpacing: 0.5 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, alignItems: 'center' },
  column: { flex: 1, width: '100%', maxWidth: 480 },
  scrollBody: { padding: space.xl, paddingBottom: space.xxl, gap: space.lg, flexGrow: 1 },
  footer: { paddingHorizontal: space.xl, paddingBottom: space.xl, paddingTop: space.sm, gap: space.sm },
  button: { minHeight: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg },
  buttonText: { fontSize: 17, fontWeight: '900', letterSpacing: 0.5 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: space.lg,
    minHeight: 56,
  },
  optionLabel: { fontSize: 16, fontWeight: '700', color: colors.ink },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C9C3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, borderWidth: 2, borderColor: colors.line, borderBottomWidth: 4, padding: space.lg, gap: space.sm },
  track: { height: 10, borderRadius: radius.pill, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: 10, borderRadius: radius.pill },
  flowHeader: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
