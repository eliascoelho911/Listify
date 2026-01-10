/**
 * CONTRATO PÚBLICO: Design System Components
 *
 * Define as interfaces públicas para todos os componentes atoms do DS.
 * Estes são os building blocks fundamentais usados em toda a aplicação.
 *
 * @module @design-system/atoms
 */

import type { PressableProps, TextInputProps, TextProps, ViewProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

// ============================================================================
// BUTTON ATOM
// ============================================================================

/**
 * Variantes visuais do Button
 */
export type ButtonVariant =
  | 'default'      // Filled com primary color
  | 'destructive'  // Filled com destructive color
  | 'outline'      // Border com background transparente
  | 'ghost'        // Apenas text, sem border/background
  | 'link';        // Text underlined, comportamento de link

/**
 * Tamanhos do Button
 */
export type ButtonSize =
  | 'sm'    // Small - height 32px
  | 'md'    // Medium - height 40px (padrão)
  | 'lg'    // Large - height 48px
  | 'icon'; // Square - 40x40px para icon-only

/**
 * Props do Button atom
 *
 * @example
 * ```tsx
 * import { Button } from '@design-system/atoms';
 *
 * <Button variant="default" size="md" onPress={handlePress}>
 *   Click me
 * </Button>
 *
 * <Button variant="destructive" disabled>
 *   Delete
 * </Button>
 *
 * <Button variant="outline" loading>
 *   Save
 * </Button>
 * ```
 */
export interface ButtonProps extends Omit<PressableProps, 'children'> {
  /** Variante visual (default: 'default') */
  variant?: ButtonVariant;

  /** Tamanho (default: 'md') */
  size?: ButtonSize;

  /** Se desabilitado (opacity 0.5, onPress desabilitado) */
  disabled?: boolean;

  /** Se em loading (mostra spinner, onPress desabilitado) */
  loading?: boolean;

  /** Callback quando pressionado */
  onPress: () => void;

  /** Conteúdo do botão (texto ou componentes) */
  children: React.ReactNode;
}

/**
 * Button component
 */
export const Button: React.FC<ButtonProps>;

// ============================================================================
// INPUT ATOM
// ============================================================================

/**
 * Estados visuais do Input
 */
export type InputState =
  | 'default'  // Estado padrão
  | 'focus'    // Focado (border accent)
  | 'error'    // Erro (border destructive)
  | 'disabled';// Desabilitado (opacity 0.5)

/**
 * Props do Input atom
 *
 * @example
 * ```tsx
 * import { Input } from '@design-system/atoms';
 *
 * <Input
 *   state="default"
 *   placeholder="Enter text"
 *   value={value}
 *   onChangeText={setValue}
 * />
 *
 * <Input
 *   state="error"
 *   error="Required field"
 *   value={value}
 *   onChangeText={setValue}
 * />
 * ```
 */
export interface InputProps extends TextInputProps {
  /** Estado visual (default: 'default') */
  state?: InputState;

  /** Mensagem de erro (quando state='error') */
  error?: string;
}

/**
 * Input component
 */
export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<TextInput>>;

// ============================================================================
// LABEL ATOM
// ============================================================================

/**
 * Props do Label atom
 *
 * @example
 * ```tsx
 * import { Label } from '@design-system/atoms';
 *
 * <Label required>Email</Label>
 * <Input ... />
 *
 * <Label disabled>Disabled field</Label>
 * <Input disabled ... />
 * ```
 */
export interface LabelProps extends TextProps {
  /** Se campo é obrigatório (mostra asterisco *) */
  required?: boolean;

  /** Se label é para campo desabilitado (opacity 0.5) */
  disabled?: boolean;

  /** Texto do label */
  children: React.ReactNode;
}

/**
 * Label component
 */
export const Label: React.FC<LabelProps>;

// ============================================================================
// BADGE ATOM
// ============================================================================

/**
 * Variantes visuais do Badge
 */
export type BadgeVariant =
  | 'default'      // Filled com secondary color
  | 'secondary'    // Filled com muted color
  | 'destructive'  // Filled com destructive color
  | 'outline';     // Border apenas

/**
 * Props do Badge atom
 *
 * @example
 * ```tsx
 * import { Badge } from '@design-system/atoms';
 *
 * <Badge variant="default">New</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Draft</Badge>
 * ```
 */
export interface BadgeProps extends ViewProps {
  /** Variante visual (default: 'default') */
  variant?: BadgeVariant;

  /** Conteúdo do badge (texto ou componentes) */
  children: React.ReactNode;
}

/**
 * Badge component
 */
export const Badge: React.FC<BadgeProps>;

// ============================================================================
// ICON ATOM
// ============================================================================

/**
 * Tamanhos de ícone
 */
export type IconSize = 16 | 20 | 24 | 32 | 40;

/**
 * Props do Icon atom (wrapper para Lucide)
 *
 * @example
 * ```tsx
 * import { Icon } from '@design-system/atoms';
 * import { ShoppingCart, Check, X } from 'lucide-react-native';
 *
 * <Icon icon={ShoppingCart} size={24} />
 * <Icon icon={Check} size={20} color={theme.colors.primary} />
 * <Icon icon={X} size={16} strokeWidth={2} />
 * ```
 */
export interface IconProps {
  /** Ícone do Lucide */
  icon: LucideIcon;

  /** Tamanho (default: 24) */
  size?: IconSize;

  /** Cor (default: theme.colors.foreground) */
  color?: string;

  /** Espessura do stroke (default: 2) */
  strokeWidth?: number;
}

/**
 * Icon component
 */
export const Icon: React.FC<IconProps>;

// ============================================================================
// CARD ATOM (Composite)
// ============================================================================

/**
 * Props do Card atom
 */
export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * Card component base
 */
export const Card: React.FC<CardProps>;

/**
 * Props do CardHeader
 */
export interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * CardHeader component
 */
export const CardHeader: React.FC<CardHeaderProps>;

/**
 * Props do CardTitle
 */
export interface CardTitleProps extends TextProps {
  children: React.ReactNode;
}

/**
 * CardTitle component
 */
export const CardTitle: React.FC<CardTitleProps>;

/**
 * Props do CardDescription
 */
export interface CardDescriptionProps extends TextProps {
  children: React.ReactNode;
}

/**
 * CardDescription component
 */
export const CardDescription: React.FC<CardDescriptionProps>;

/**
 * Props do CardContent
 */
export interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * CardContent component
 */
export const CardContent: React.FC<CardContentProps>;

/**
 * Props do CardFooter
 */
export interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * CardFooter component
 */
export const CardFooter: React.FC<CardFooterProps>;

// ============================================================================
// COMPONENT METADATA (For ESLint rules)
// ============================================================================

/**
 * Atomic Design level
 */
export type AtomicLevel =
  | 'atom'
  | 'molecule'
  | 'organism'
  | 'template'
  | 'page';

/**
 * Component metadata (usado por ESLint rules)
 */
export interface ComponentMetadata {
  level: AtomicLevel;
  name: string;
  description: string;
  dependencies: string[];
}

/**
 * Regras de import por nível Atomic Design
 * Enforçadas por ESLint customizado
 */
export const IMPORT_RULES: Record<AtomicLevel, string[]>;
