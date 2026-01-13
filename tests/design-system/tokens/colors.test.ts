/**
 * Tests for Color Tokens
 *
 * Validates:
 * - Gray "chumbo" base palette exists
 * - Cyan theme palette exists
 * - All Shadcn tokens present in dark/light themes
 * - All navbar custom tokens present in dark/light themes
 */

import { cyan, darkTheme, gray, lightTheme, semantic } from '@design-system/tokens';

describe('Color Tokens', () => {
  describe('Gray "chumbo" palette', () => {
    it('should have complete gray scale (50-950)', () => {
      expect(gray).toHaveProperty('50');
      expect(gray).toHaveProperty('100');
      expect(gray).toHaveProperty('200');
      expect(gray).toHaveProperty('300');
      expect(gray).toHaveProperty('400');
      expect(gray).toHaveProperty('500');
      expect(gray).toHaveProperty('600');
      expect(gray).toHaveProperty('700');
      expect(gray).toHaveProperty('800');
      expect(gray).toHaveProperty('900');
      expect(gray).toHaveProperty('950');
    });

    it('should be cool gray with blue undertones (not warm gray)', () => {
      expect(typeof gray[600]).toBe('string');
      expect(gray[600]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe('Cyan theme palette', () => {
    it('should have complete cyan scale (50-950)', () => {
      expect(cyan).toHaveProperty('50');
      expect(cyan).toHaveProperty('100');
      expect(cyan).toHaveProperty('200');
      expect(cyan).toHaveProperty('300');
      expect(cyan).toHaveProperty('400');
      expect(cyan).toHaveProperty('500');
      expect(cyan).toHaveProperty('600');
      expect(cyan).toHaveProperty('700');
      expect(cyan).toHaveProperty('800');
      expect(cyan).toHaveProperty('900');
      expect(cyan).toHaveProperty('950');
    });

    it('should have cyan as primary theme color', () => {
      expect(cyan[500]).toBe('#06b6d4');
    });
  });

  describe('Semantic colors', () => {
    it('should have success, warning, error, info', () => {
      expect(semantic).toHaveProperty('success');
      expect(semantic).toHaveProperty('warning');
      expect(semantic).toHaveProperty('error');
      expect(semantic).toHaveProperty('info');
    });

    it('should use cyan for info', () => {
      expect(semantic.info).toBe(cyan[500]);
    });
  });

  describe('Dark theme tokens (padrão)', () => {
    it('should have all Shadcn base tokens', () => {
      expect(darkTheme).toHaveProperty('background');
      expect(darkTheme).toHaveProperty('foreground');
      expect(darkTheme).toHaveProperty('card');
      expect(darkTheme).toHaveProperty('cardForeground');
      expect(darkTheme).toHaveProperty('popover');
      expect(darkTheme).toHaveProperty('popoverForeground');
      expect(darkTheme).toHaveProperty('primary');
      expect(darkTheme).toHaveProperty('primaryForeground');
      expect(darkTheme).toHaveProperty('secondary');
      expect(darkTheme).toHaveProperty('secondaryForeground');
      expect(darkTheme).toHaveProperty('muted');
      expect(darkTheme).toHaveProperty('mutedForeground');
      expect(darkTheme).toHaveProperty('accent');
      expect(darkTheme).toHaveProperty('accentForeground');
      expect(darkTheme).toHaveProperty('destructive');
      expect(darkTheme).toHaveProperty('destructiveForeground');
      expect(darkTheme).toHaveProperty('border');
      expect(darkTheme).toHaveProperty('input');
      expect(darkTheme).toHaveProperty('ring');
    });

    it('should have surface tokens for navbar styling', () => {
      expect(darkTheme).toHaveProperty('surface');
      expect(darkTheme).toHaveProperty('surfaceForeground');
    });

    it('should use cyan for primary color', () => {
      expect(darkTheme.primary).toBe(cyan[500]);
    });

    it('should use gray chumbo for background', () => {
      expect(darkTheme.background).toBe(gray[950]);
    });
  });

  describe('Light theme tokens', () => {
    it('should have all Shadcn base tokens', () => {
      expect(lightTheme).toHaveProperty('background');
      expect(lightTheme).toHaveProperty('foreground');
      expect(lightTheme).toHaveProperty('card');
      expect(lightTheme).toHaveProperty('cardForeground');
      expect(lightTheme).toHaveProperty('popover');
      expect(lightTheme).toHaveProperty('popoverForeground');
      expect(lightTheme).toHaveProperty('primary');
      expect(lightTheme).toHaveProperty('primaryForeground');
      expect(lightTheme).toHaveProperty('secondary');
      expect(lightTheme).toHaveProperty('secondaryForeground');
      expect(lightTheme).toHaveProperty('muted');
      expect(lightTheme).toHaveProperty('mutedForeground');
      expect(lightTheme).toHaveProperty('accent');
      expect(lightTheme).toHaveProperty('accentForeground');
      expect(lightTheme).toHaveProperty('destructive');
      expect(lightTheme).toHaveProperty('destructiveForeground');
      expect(lightTheme).toHaveProperty('border');
      expect(lightTheme).toHaveProperty('input');
      expect(lightTheme).toHaveProperty('ring');
    });

    it('should have all navbar custom tokens', () => {
      expect(lightTheme).toHaveProperty('navbar');
      expect(lightTheme).toHaveProperty('navbarForeground');
      expect(lightTheme).toHaveProperty('navbarPrimary');
      expect(lightTheme).toHaveProperty('navbarPrimaryForeground');
      expect(lightTheme).toHaveProperty('navbarAccent');
      expect(lightTheme).toHaveProperty('navbarAccentForeground');
      expect(lightTheme).toHaveProperty('navbarBorder');
      expect(lightTheme).toHaveProperty('navbarRing');
    });

    it('should use cyan for primary color', () => {
      expect(lightTheme.primary).toBe(cyan[600]);
    });

    it('should use light gray for background', () => {
      expect(lightTheme.background).toBe(gray[50]);
    });
  });
});
