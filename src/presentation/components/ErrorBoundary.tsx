/**
 * ErrorBoundary Component
 *
 * React error boundary for catching and displaying JavaScript errors
 * that occur in the component tree below it.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import { Button, Text } from '@design-system/atoms';
import { darkTheme } from '@design-system/theme/theme';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <AlertTriangle size={48} color={darkTheme.colors.destructive} />
          <Text variant="h3" style={styles.title}>
            Something went wrong
          </Text>
          <Text variant="body" color="muted" style={styles.message}>
            An unexpected error occurred. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text variant="caption" color="muted" style={styles.errorMessage}>
              {this.state.error.message}
            </Text>
          )}
          <Button variant="primary" onPress={this.handleRetry} style={styles.button}>
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: darkTheme.spacing.xl,
    backgroundColor: darkTheme.colors.background,
  },
  title: {
    marginTop: darkTheme.spacing.lg,
    marginBottom: darkTheme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: darkTheme.spacing.lg,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: darkTheme.spacing.lg,
    fontFamily: darkTheme.typography.families.mono,
  },
  button: {
    minWidth: 120,
  },
});
