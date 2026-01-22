/**
 * ConfirmationDialog Molecule Component
 *
 * Dialog de confirmação para ações destrutivas. Inspirado no AlertDialog do Shadcn.
 */

import React, { type ReactElement } from 'react';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createConfirmationDialogStyles } from './ConfirmationDialog.styles';
import type { ConfirmationDialogProps } from './ConfirmationDialog.types';

export function ConfirmationDialog({
  visible,
  title,
  description,
  confirmButton,
  cancelButton,
  onConfirm,
  onCancel,
  isLoading = false,
  testID,
  ...viewProps
}: ConfirmationDialogProps): ReactElement {
  const { theme } = useTheme();
  const styles = createConfirmationDialogStyles(theme);

  const isConfirmDisabled = confirmButton.disabled || isLoading;
  const isCancelDisabled = cancelButton?.disabled || isLoading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      testID={testID}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <View style={styles.container} onStartShouldSetResponder={() => true} {...viewProps}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.buttonContainer}>
            {cancelButton && (
              <Pressable
                onPress={onCancel}
                disabled={isCancelDisabled}
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.buttonPressed,
                  isCancelDisabled && styles.buttonDisabled,
                ]}
                testID={testID ? `${testID}-cancel` : undefined}
              >
                <Text style={[styles.buttonLabel, styles.cancelButtonLabel]}>
                  {cancelButton.label}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={onConfirm}
              disabled={isConfirmDisabled}
              style={({ pressed }) => [
                styles.button,
                confirmButton.destructive ? styles.destructiveButton : styles.confirmButton,
                pressed && styles.buttonPressed,
                isConfirmDisabled && styles.buttonDisabled,
              ]}
              testID={testID ? `${testID}-confirm` : undefined}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={
                    confirmButton.destructive
                      ? theme.colors.destructiveForeground
                      : theme.colors.primaryForeground
                  }
                />
              ) : (
                <Text
                  style={[
                    styles.buttonLabel,
                    confirmButton.destructive
                      ? styles.destructiveButtonLabel
                      : styles.confirmButtonLabel,
                  ]}
                >
                  {confirmButton.label}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
