/**
 * CONTRATO PÚBLICO: Theme & Theme Provider
 *
 * Define as interfaces públicas para o sistema de temas (dark/light)
 * e o ThemeProvider que gerencia switching e persistência.
 *
 * @module @design-system/theme
 */

import type { DesignTokens } from './tokens.contract';

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Modos de tema disponíveis
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme completo
 * Combina modo + valores de tokens específicos do tema
 */
export interface Theme extends DesignTokens {
  mode: ThemeMode;
}

// ============================================================================
// THEME PROVIDER
// ============================================================================

/**
 * Props do ThemeProvider
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Contexto do Theme Provider
 * Disponibilizado via useTheme() hook
 */
export interface ThemeContextValue {
  /** Theme atual (dark ou light com tokens resolvidos) */
  theme: Theme;

  /** Modo atual */
  mode: ThemeMode;

  /** Alterar modo do tema */
  setMode: (mode: ThemeMode) => void;

  /** Toggle entre dark e light */
  toggleMode: () => void;

  /** Indica se theme está carregando (fonts, preferência salva) */
  isLoading: boolean;
}

/**
 * ThemeProvider component
 * Deve envolver toda a aplicação
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@design-system/theme';
 *
 * export default function App() {
 *   return (
 *     <ThemeProvider>
 *       <NavigationContainer>
 *         <RootNavigator />
 *       </NavigationContainer>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps>;

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook para consumir theme context
 *
 * @returns Contexto do theme com theme atual e funções de controle
 *
 * @throws Error se usado fora do ThemeProvider
 *
 * @example
 * ```tsx
 * import { useTheme } from '@design-system/theme';
 *
 * function MyComponent() {
 *   const { theme, mode, toggleMode } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: theme.colors.background }}>
 *       <Text style={{ color: theme.colors.foreground }}>
 *         Current mode: {mode}
 *       </Text>
 *       <Button onPress={toggleMode}>Toggle Theme</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue;

// ============================================================================
// THEME PERSISTENCE
// ============================================================================

/**
 * Estrutura de preferência de tema salva
 */
export interface ThemePreference {
  mode: ThemeMode;
  lastUpdated: number; // timestamp
}

/**
 * AsyncStorage key para preferência de tema
 */
export const THEME_STORAGE_KEY = '@listify:theme-preference';

/**
 * Tema padrão (dark)
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'dark';

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Resolver tema baseado em modo
 * Usado internamente pelo ThemeProvider
 *
 * @param mode - Modo do tema (light ou dark)
 * @returns Theme completo com tokens resolvidos
 */
export function resolveTheme(mode: ThemeMode): Theme;

/**
 * Carregar preferência de tema do storage
 *
 * @returns Preferência salva ou null se não existir
 */
export function loadThemePreference(): Promise<ThemePreference | null>;

/**
 * Salvar preferência de tema no storage
 *
 * @param mode - Modo a ser salvo
 */
export function saveThemePreference(mode: ThemeMode): Promise<void>;

// ============================================================================
// THEME CONSTANTS
// ============================================================================

/**
 * Dark theme (padrão)
 */
export const darkTheme: Theme;

/**
 * Light theme
 */
export const lightTheme: Theme;
