import { type ReactElement, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';

import { FALLBACK_LOCALE } from '@domain/shopping/constants';

import { theme } from '../theme/theme';

type NumberPickerProps = {
  value: number;
  onValueChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  locale?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  decrementLabel?: string;
  incrementLabel?: string;
};

const TRACK_HEIGHT = theme.spacing.xxxl + theme.spacing.md;
const BUTTON_SIZE = theme.spacing.xxl + theme.spacing.xs;
const CENTER_SIZE = theme.spacing.xxxl;
const ICON_SIZE = theme.spacing.lg;
const ICON_STROKE = theme.spacing.xxs / 2;

export function NumberPicker({
  value,
  onValueChange,
  step = 1,
  min,
  max,
  locale,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
  decrementLabel,
  incrementLabel,
}: NumberPickerProps): ReactElement {
  const formatterLocale = locale ?? FALLBACK_LOCALE;
  const stepPrecision = useMemo(() => resolvePrecision(step), [step]);
  const { decimalSeparator, groupSeparator } = useMemo(
    () => resolveNumberSeparators(formatterLocale),
    [formatterLocale],
  );
  const [isEditing, setIsEditing] = useState(false);

  const valuePrecision = resolveValuePrecision(value);
  const displayPrecision = Math.max(stepPrecision, valuePrecision);
  const normalizedValue = roundToPrecision(value, displayPrecision);
  const minValue = min ?? Number.NEGATIVE_INFINITY;
  const maxValue = max ?? Number.POSITIVE_INFINITY;
  const epsilon = Math.pow(10, -displayPrecision) / 2;
  const canDecrease = !disabled && normalizedValue - step >= minValue - epsilon;
  const canIncrease = !disabled && normalizedValue + step <= maxValue + epsilon;

  const displayValue = useMemo(
    () => formatValue(normalizedValue, formatterLocale, displayPrecision),
    [formatterLocale, normalizedValue, displayPrecision],
  );
  const [inputValue, setInputValue] = useState(displayValue);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(displayValue);
    }
  }, [displayValue, isEditing]);

  const handleChange = (delta: number): void => {
    if (disabled) {
      return;
    }
    setIsEditing(false);
    const nextValue = roundToPrecision(normalizedValue + delta, displayPrecision);
    const clamped = clampValue(nextValue, minValue, maxValue);
    if (clamped !== normalizedValue) {
      onValueChange(clamped);
    }
  };

  const handleTextChange = (text: string): void => {
    const masked = applyDecimalMask(text, decimalSeparator, groupSeparator);
    setInputValue(masked);
    const parsed = parseInputValue(masked, decimalSeparator, groupSeparator);
    if (parsed === null) {
      return;
    }
    const inputPrecision = resolveInputPrecision(masked, decimalSeparator);
    const nextPrecision = Math.max(stepPrecision, inputPrecision);
    const nextValue = roundToPrecision(parsed, nextPrecision);
    const clamped = clampValue(nextValue, minValue, maxValue);
    if (clamped !== normalizedValue) {
      onValueChange(clamped);
    }
  };

  const handleBlur = (): void => {
    setIsEditing(false);
    const parsed = parseInputValue(inputValue, decimalSeparator, groupSeparator);
    if (parsed === null) {
      if (inputValue.trim()) {
        console.debug('number_picker.parse_failed', {
          input: inputValue,
          locale: formatterLocale,
        });
      }
      setInputValue(displayValue);
      return;
    }
    const inputPrecision = resolveInputPrecision(inputValue, decimalSeparator);
    const nextPrecision = Math.max(stepPrecision, inputPrecision);
    const nextValue = roundToPrecision(parsed, nextPrecision);
    const clamped = clampValue(nextValue, minValue, maxValue);
    if (clamped !== normalizedValue) {
      onValueChange(clamped);
    }
    const nextDisplayPrecision = Math.max(stepPrecision, resolveValuePrecision(clamped));
    setInputValue(formatValue(clamped, formatterLocale, nextDisplayPrecision));
  };

  return (
    <View
      style={[styles.container, disabled && styles.containerDisabled, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ now: normalizedValue }}
      testID={testID}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={decrementLabel}
        style={({ pressed }) => [
          styles.button,
          pressed && canDecrease && styles.buttonPressed,
          !canDecrease && styles.buttonDisabled,
        ]}
        onPress={() => handleChange(-step)}
        disabled={!canDecrease}
      >
        <View style={styles.iconMinus} />
      </Pressable>

      <View style={styles.valuePill}>
        <TextInput
          value={inputValue}
          onChangeText={handleTextChange}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          keyboardType="decimal-pad"
          style={styles.valueInput}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={incrementLabel}
        style={({ pressed }) => [
          styles.button,
          pressed && canIncrease && styles.buttonPressed,
          !canIncrease && styles.buttonDisabled,
        ]}
        onPress={() => handleChange(step)}
        disabled={!canIncrease}
      >
        <View style={styles.iconPlus}>
          <View style={styles.iconLine} />
          <View style={[styles.iconLine, styles.iconLineVertical]} />
        </View>
      </Pressable>
    </View>
  );
}

function resolvePrecision(step: number): number {
  if (!Number.isFinite(step) || step <= 0) {
    return 0;
  }
  const stepString = step.toString();
  const decimalIndex = stepString.indexOf('.');
  if (decimalIndex === -1) {
    return 0;
  }
  return stepString.length - decimalIndex - 1;
}

function resolveValuePrecision(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const text = value.toString();
  if (text.includes('e') || text.includes('E')) {
    return 0;
  }
  const decimalIndex = text.indexOf('.');
  if (decimalIndex === -1) {
    return 0;
  }
  return text.length - decimalIndex - 1;
}

function resolveInputPrecision(input: string, decimalSeparator: string): number {
  const separatorIndex = input.indexOf(decimalSeparator);
  if (separatorIndex === -1) {
    return 0;
  }
  return Math.max(0, input.length - separatorIndex - 1);
}

function resolveNumberSeparators(locale: string): {
  groupSeparator: string;
  decimalSeparator: string;
} {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1000.1);
    const groupSeparator = parts.find((part) => part.type === 'group')?.value ?? ',';
    const decimalSeparator = parts.find((part) => part.type === 'decimal')?.value ?? '.';
    return { groupSeparator, decimalSeparator };
  } catch {
    if (locale !== FALLBACK_LOCALE) {
      return resolveNumberSeparators(FALLBACK_LOCALE);
    }
    return { groupSeparator: '.', decimalSeparator: ',' };
  }
}

function formatValue(value: number, locale: string, precision: number): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    }).format(value);
  } catch {
    return value.toFixed(precision);
  }
}

function applyDecimalMask(input: string, decimalSeparator: string, groupSeparator: string): string {
  if (!input) {
    return '';
  }

  const normalized = input.replace(/\s/g, '');
  const decimalCandidates = new Set([decimalSeparator, '.', ',']);
  let result = '';
  let hasDecimal = false;
  let hasSign = false;

  for (const char of normalized) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }
    if (char === '-' && !hasSign && result.length === 0) {
      result += char;
      hasSign = true;
      continue;
    }
    if (decimalCandidates.has(char)) {
      if (!hasDecimal) {
        result += decimalSeparator;
        hasDecimal = true;
      }
      continue;
    }
    if (char === groupSeparator) {
      continue;
    }
  }

  return result;
}

function parseInputValue(
  input: string,
  decimalSeparator: string,
  groupSeparator: string,
): number | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.replace(/\s/g, '');
  const isNegative = normalized.startsWith('-');
  const withoutSign = isNegative ? normalized.slice(1) : normalized;
  const withoutGroups =
    groupSeparator && groupSeparator !== decimalSeparator
      ? withoutSign.split(groupSeparator).join('')
      : withoutSign;
  const decimalIndex = withoutGroups.indexOf(decimalSeparator);
  let numericText: string;

  if (decimalIndex >= 0) {
    const integerPart = withoutGroups.slice(0, decimalIndex);
    const fractionPart = withoutGroups.slice(decimalIndex + 1);
    numericText = `${integerPart}.${fractionPart}`;
  } else {
    numericText = withoutGroups;
  }

  const value = Number(numericText);
  if (!Number.isFinite(value)) {
    return null;
  }

  return isNegative ? -value : value;
}

function roundToPrecision(value: number, precision: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (precision <= 0) {
    return Math.round(value);
  }
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clampValue(value: number, minValue: number, maxValue: number): number {
  if (value < minValue) {
    return minValue;
  }
  if (value > maxValue) {
    return maxValue;
  }
  return value;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: TRACK_HEIGHT,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.surface,
    ...theme.shadows.soft,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: theme.colors.background.muted,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  valuePill: {
    width: CENTER_SIZE,
    height: CENTER_SIZE,
    borderRadius: CENTER_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.brand[50],
    ...theme.shadows.soft,
  },
  valueInput: {
    textAlign: 'center',
    fontFamily: theme.typography.families.heading,
    fontSize: theme.typography.sizes.lg,
    lineHeight: theme.typography.sizes.lg * theme.typography.lineHeights.tight,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand[800],
    padding: theme.spacing.none,
  },
  iconMinus: {
    width: ICON_SIZE,
    height: ICON_STROKE,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.content.primary,
  },
  iconPlus: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLine: {
    width: ICON_SIZE,
    height: ICON_STROKE,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.content.primary,
  },
  iconLineVertical: {
    position: 'absolute',
    width: ICON_STROKE,
    height: ICON_SIZE,
  },
});
