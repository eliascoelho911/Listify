/**
 * Card Atom Types
 */

import type { TextProps, ViewProps } from 'react-native';

export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
}

export interface CardHeaderProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
}

export interface CardTitleProps extends Omit<TextProps, 'style'> {
  children: React.ReactNode;
}

export interface CardDescriptionProps extends Omit<TextProps, 'style'> {
  children: React.ReactNode;
}

export interface CardContentProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
}

export interface CardFooterProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
}
