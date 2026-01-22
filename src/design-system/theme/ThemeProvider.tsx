/**
 * Theme Provider Component
 *
 * Provides theme context with:
 * - Dark theme as default
 * - Theme switching (dark ↔ light ↔ auto)
 * - Auto mode follows system preference
 * - AsyncStorage persistence
 * - Fira Sans/Code font loading via expo-font
 * - Splash screen management
 */

import React, { createContext, type ReactElement, useCallback, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkTheme, lightTheme, type ResolvedTheme, type Theme, type ThemeMode } from './theme';

const THEME_STORAGE_KEY = '@listify:theme';

interface ThemeContextValue {
  /** The current theme object (resolved) */
  theme: Theme;
  /** User's selected mode (dark, light, or auto) */
  mode: ThemeMode;
  /** The actual theme being displayed (dark or light) */
  resolvedTheme: ResolvedTheme;
  /** Toggle between dark and light (skips auto) */
  toggleTheme: () => void;
  /** Set specific theme mode */
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Keep splash screen visible while loading fonts (skip in tests)
if (process.env.NODE_ENV !== 'test') {
  SplashScreen.preventAutoHideAsync();
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  initialMode = 'dark',
}: ThemeProviderProps): ReactElement {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const isTestEnvironment = process.env.NODE_ENV === 'test';
  const [fontsLoaded, setFontsLoaded] = useState(isTestEnvironment);

  // Get system color scheme
  const systemColorScheme = useColorScheme();

  // Resolve the actual theme to display
  const resolvedTheme: ResolvedTheme =
    mode === 'auto' ? (systemColorScheme === 'light' ? 'light' : 'dark') : mode;

  // Load fonts and theme preference
  useEffect(() => {
    if (isTestEnvironment) {
      return;
    }

    async function loadResources() {
      try {
        // Load fonts from assets/fonts/
        await Font.loadAsync({
          'Fira Sans': require('../../../assets/fonts/FiraSans-Regular.ttf'),
          'Fira Sans Medium': require('../../../assets/fonts/FiraSans-Medium.ttf'),
          'Fira Sans SemiBold': require('../../../assets/fonts/FiraSans-SemiBold.ttf'),
          'Fira Sans Bold': require('../../../assets/fonts/FiraSans-Bold.ttf'),
          'Fira Code': require('../../../assets/fonts/FiraCode-Regular.ttf'),
          'Fira Code Medium': require('../../../assets/fonts/FiraCode-Medium.ttf'),
          'MarkaziText SemiBold': require('../../../assets/fonts/MarkaziText-SemiBold.ttf'),
        });

        // Load theme preference from AsyncStorage
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'auto') {
          setMode(storedTheme);
        }

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading theme resources:', error);
        setFontsLoaded(true); // Continue even if loading fails
      }
    }

    loadResources();
  }, [isTestEnvironment]);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Toggle between dark and light (direct toggle, not through auto)
  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  }, [resolvedTheme]);

  // Set specific theme
  const setThemeMode = useCallback(async (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  }, []);

  const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme;

  const contextValue: ThemeContextValue = {
    theme,
    mode,
    resolvedTheme,
    toggleTheme,
    setTheme: setThemeMode,
  };

  if (!fontsLoaded) {
    return <></>; // Return empty while loading (splash screen visible)
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {/* Trigger splash screen hide on layout */}
      {children}
    </ThemeContext.Provider>
  );
}
