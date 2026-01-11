import { type ReactElement, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { Text } from '@design-system/atoms';

import { theme } from '../theme/theme';

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value?: string | null;
  placeholder?: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

export function Dropdown({
  options,
  value,
  placeholder,
  disabled = false,
  onValueChange,
  style,
  testID,
  accessibilityLabel,
}: DropdownProps): ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const displayLabel = value ? (selectedOption?.label ?? value) : (placeholder ?? '');
  const displayColor = value ? theme.colors.content.primary : theme.colors.content.muted;

  const handleOpen = (): void => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  const handleSelect = (nextValue: string): void => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [
          styles.trigger,
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.triggerDisabled,
          style,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        testID={testID}
      >
        <Text style={[styles.valueText, { color: displayColor }]} numberOfLines={1}>
          {displayLabel}
        </Text>
        <View style={styles.caret} />
      </Pressable>

      <Modal transparent visible={isOpen} animationType="fade" onRequestClose={handleClose}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />
          <View style={styles.sheet}>
            <ScrollView contentContainerStyle={styles.options}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.muted,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  triggerPressed: {
    backgroundColor: theme.colors.background.muted,
  },
  triggerDisabled: {
    backgroundColor: theme.colors.background.muted,
    borderColor: theme.colors.border.subtle,
  },
  valueText: {
    flex: 1,
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
  },
  caret: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRightWidth: theme.spacing.xxs / 2,
    borderBottomWidth: theme.spacing.xxs / 2,
    borderColor: theme.colors.content.muted,
    transform: [{ rotate: '45deg' }],
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background.overlay,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: theme.colors.background.raised,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    padding: theme.spacing.md,
    ...theme.shadows.overlay,
  },
  options: {
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
  },
  option: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.surface,
  },
  optionPressed: {
    backgroundColor: theme.colors.background.muted,
  },
  optionSelected: {
    backgroundColor: theme.colors.brand[50],
    borderColor: theme.colors.brand[300],
  },
  optionLabel: {
    fontFamily: theme.typography.families.body,
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.normal,
    color: theme.colors.content.primary,
  },
  optionLabelSelected: {
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.brand[700],
  },
});
