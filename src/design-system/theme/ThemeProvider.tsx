/**
 * Theme Provider Component
 *
 * Provides theme context with:
 * - Dark theme as default
 * - Theme switching (dark ↔ light)
 * - AsyncStorage persistence
 * - Fira Sans/Code font loading via expo-font
 * - Splash screen management
 */

import React, { createContext, type ReactElement, useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkTheme, lightTheme, type Theme, type ThemeMode } from './theme';

const THEME_STORAGE_KEY = '@listify:theme';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({
  children,
  initialMode = 'dark',
}: ThemeProviderProps): ReactElement {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts and theme preference
  useEffect(() => {
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
        });

        // Load theme preference from AsyncStorage
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setMode(storedTheme);
        }

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading theme resources:', error);
        setFontsLoaded(true); // Continue even if loading fails
      }
    }

    loadResources();
  }, []);

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Toggle between dark and light
  const toggleTheme = useCallback(async () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  }, [mode]);

  // Set specific theme
  const setThemeMode = useCallback(async (newMode: ThemeMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  }, []);

  const theme = mode === 'dark' ? darkTheme : lightTheme;

  const contextValue: ThemeContextValue = {
    theme,
    mode,
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
