/**
 * Card Atom Components
 *
 * A set of composable card components:
 * - Card: Container
 * - CardHeader: Header section
 * - CardTitle: Title text
 * - CardDescription: Description text
 * - CardContent: Main content section
 * - CardFooter: Footer section
 */

import React, { type ReactElement } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../theme';
import { createCardStyles } from './Card.styles';
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from './Card.types';

export function Card({ children, ...viewProps }: CardProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <View style={styles.card} {...viewProps}>
      {children}
    </View>
  );
}

export function CardHeader({ children, ...viewProps }: CardHeaderProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <View style={styles.header} {...viewProps}>
      {children}
    </View>
  );
}

export function CardTitle({ children, ...textProps }: CardTitleProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <Text style={styles.title} {...textProps}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, ...textProps }: CardDescriptionProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <Text style={styles.description} {...textProps}>
      {children}
    </Text>
  );
}

export function CardContent({ children, ...viewProps }: CardContentProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <View style={styles.content} {...viewProps}>
      {children}
    </View>
  );
}

export function CardFooter({ children, ...viewProps }: CardFooterProps): ReactElement {
  const { theme } = useTheme();
  const styles = createCardStyles(theme);

  return (
    <View style={styles.footer} {...viewProps}>
      {children}
    </View>
  );
}
