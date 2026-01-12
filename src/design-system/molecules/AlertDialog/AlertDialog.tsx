/**
 * AlertDialog Molecule Component
 *
 * Diálogo de confirmação. Baseado no AlertDialog do Shadcn.
 */

import React, { type ReactElement } from 'react';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';

import { Text } from '../../atoms';
import { useTheme } from '../../theme';
import { createAlertDialogStyles } from './AlertDialog.styles';
import type { AlertDialogProps } from './AlertDialog.types';

export function AlertDialog({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  ...viewProps
}: AlertDialogProps): ReactElement {
  const { theme } = useTheme();
  const styles = createAlertDialogStyles(theme);

  const isDestructive = variant === 'destructive';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container} {...viewProps}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && { opacity: 0.8 },
                isLoading && styles.buttonDisabled,
              ]}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.button,
                isDestructive ? styles.destructiveButton : styles.confirmButton,
                pressed && { opacity: 0.8 },
                isLoading && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={
                    isDestructive
                      ? theme.colors.destructiveForeground
                      : theme.colors.primaryForeground
                  }
                />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    isDestructive ? styles.destructiveButtonText : styles.confirmButtonText,
                  ]}
                >
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
