import type { ReactElement } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '../theme/theme';

type SnackBarTone = 'info' | 'success' | 'warning' | 'danger';

type ToneStyle = {
  containerBackground: string;
  borderColor: string;
  accent: string;
  text: string;
  actionBackground: string;
  actionBackgroundPressed: string;
  actionText: string;
};

const toneStyles: Record<SnackBarTone, ToneStyle> = {
  info: {
    containerBackground: theme.colors.brand[50],
    borderColor: theme.colors.brand[200],
    accent: theme.colors.brand[500],
    text: theme.colors.content.primary,
    actionBackground: theme.colors.brand[600],
    actionBackgroundPressed: theme.colors.brand[700],
    actionText: theme.colors.content.inverse,
  },
  success: {
    containerBackground: theme.colors.success[50],
    borderColor: theme.colors.success[200],
    accent: theme.colors.success[500],
    text: theme.colors.success[800],
    actionBackground: theme.colors.success[600],
    actionBackgroundPressed: theme.colors.success[700],
    actionText: theme.colors.content.inverse,
  },
  warning: {
    containerBackground: theme.colors.warning[50],
    borderColor: theme.colors.warning[200],
    accent: theme.colors.warning[500],
    text: theme.colors.warning[800],
    actionBackground: theme.colors.warning[600],
    actionBackgroundPressed: theme.colors.warning[700],
    actionText: theme.colors.content.inverse,
  },
  danger: {
    containerBackground: theme.colors.danger[50],
    borderColor: theme.colors.danger[200],
    accent: theme.colors.danger[500],
    text: theme.colors.danger[800],
    actionBackground: theme.colors.danger[600],
    actionBackgroundPressed: theme.colors.danger[700],
    actionText: theme.colors.content.inverse,
  },
};

type SnackBarProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: SnackBarTone;
  icon?: ReactElement;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  autoDismissMs?: number;
  onDismiss?: () => void;
  closeLabel?: string;
  onClose?: () => void;
};

export function SnackBar({
  message,
  actionLabel,
  onAction,
  tone = 'info',
  icon,
  style,
  testID,
  autoDismissMs = 3000,
  onDismiss,
  closeLabel,
  onClose,
}: SnackBarProps): ReactElement {
  const palette = toneStyles[tone];
  const progress = useRef(new Animated.Value(1)).current;
  const hasAutoDismiss = autoDismissMs > 0 && typeof onDismiss === 'function';

  const progressInterpolation = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    [progress],
  );

  useEffect(() => {
    if (!hasAutoDismiss) {
      return;
    }

    progress.setValue(1);
    const animation = Animated.timing(progress, {
      toValue: 0,
      duration: autoDismissMs,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onDismiss?.();
      }
    });

    return () => {
      animation.stop();
    };
  }, [autoDismissMs, hasAutoDismiss, message, onDismiss, progress]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: palette.containerBackground,
          borderColor: palette.borderColor,
        },
        style,
      ]}
      testID={testID}
    >
      <View style={[styles.accent, { backgroundColor: palette.accent }]} />
      {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
      <Text style={[styles.message, { color: palette.text }]} numberOfLines={2}>
        {message}
      </Text>
      <View style={styles.actions}>
        {actionLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
            style={({ pressed }) => [
              styles.action,
              {
                backgroundColor: pressed
                  ? palette.actionBackgroundPressed
                  : palette.actionBackground,
              },
            ]}
            onPress={onAction}
            disabled={!onAction}
          >
            <Text style={[styles.actionLabel, { color: palette.actionText }]}>{actionLabel}</Text>
          </Pressable>
        ) : null}
        {onClose && closeLabel ? (
          <Pressable
            accessibilityRole='button'
            accessibilityLabel={closeLabel}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: pressed ? palette.actionBackgroundPressed : palette.actionBackground,
              },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.closeLabel, { color: palette.actionText }]}>{'x'}</Text>
          </Pressable>
        ) : null}
      </View>
      {hasAutoDismiss ? (
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressInterpolation,
                backgroundColor: palette.accent,
              },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    ...theme.shadows.soft,
  },
  accent: {
    width: 10,
    height: 10,
    borderRadius: theme.radii.pill,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.surface,
  },
  message: {
    flex: 1,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  action: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.md,
  },
  actionLabel: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.sm,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    fontFamily: theme.typography.families.heading,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
  progressTrack: {
    position: 'absolute',
    left: theme.spacing.md,
    right: theme.spacing.md,
    bottom: theme.spacing.xs,
    height: 4,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.background.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radii.pill,
  },
});
