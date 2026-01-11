import type { PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

export type IconButtonVariant = 'ghost' | 'outline' | 'filled' | 'accent';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  icon: LucideIcon;
  onPress: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  isActive?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
}
