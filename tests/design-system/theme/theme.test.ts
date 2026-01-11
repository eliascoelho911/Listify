/**
 * Tests for Theme Objects
 *
 * Validates:
 * - Dark theme structure
 * - Light theme structure
 * - Both use cyan/gray palettes
 * - Both have all token categories
 */

import { darkTheme, lightTheme } from '@design-system/theme';
import { cyan, gray } from '@design-system/tokens';

describe('Theme Objects', () => {
  describe('Dark Theme', () => {
    it('should have all token categories', () => {
      expect(darkTheme).toHaveProperty('colors');
      expect(darkTheme).toHaveProperty('typography');
      expect(darkTheme).toHaveProperty('spacing');
      expect(darkTheme).toHaveProperty('radii');
      expect(darkTheme).toHaveProperty('shadows');
    });

    it('should use cyan for primary color', () => {
      expect(darkTheme.colors.primary).toBe(cyan[500]);
    });

    it('should use gray chumbo for background', () => {
      expect(darkTheme.colors.background).toBe(gray[950]);
    });

    it('should have Fira Sans/Code typography', () => {
      expect(darkTheme.typography.families.body).toBe('Fira Sans');
      expect(darkTheme.typography.families.mono).toBe('Fira Code');
    });

    it('should have compact spacing', () => {
      expect(darkTheme.spacing.md).toBe(12);
      expect(darkTheme.spacing.lg).toBe(16);
    });

    it('should have large radius', () => {
      expect(darkTheme.radii.lg).toBe(16);
      expect(darkTheme.radii.xl).toBe(24);
    });

    it('should have shadow elevation levels', () => {
      expect(darkTheme.shadows).toHaveProperty('none');
      expect(darkTheme.shadows).toHaveProperty('sm');
      expect(darkTheme.shadows).toHaveProperty('md');
      expect(darkTheme.shadows).toHaveProperty('lg');
      expect(darkTheme.shadows).toHaveProperty('xl');
    });
  });

  describe('Light Theme', () => {
    it('should have all token categories', () => {
      expect(lightTheme).toHaveProperty('colors');
      expect(lightTheme).toHaveProperty('typography');
      expect(lightTheme).toHaveProperty('spacing');
      expect(lightTheme).toHaveProperty('radii');
      expect(lightTheme).toHaveProperty('shadows');
    });

    it('should use cyan for primary color', () => {
      expect(lightTheme.colors.primary).toBe(cyan[600]);
    });

    it('should use light gray for background', () => {
      expect(lightTheme.colors.background).toBe(gray[50]);
    });

    it('should have same typography as dark theme', () => {
      expect(lightTheme.typography.families.body).toBe('Fira Sans');
      expect(lightTheme.typography.families.mono).toBe('Fira Code');
    });

    it('should have same spacing as dark theme', () => {
      expect(lightTheme.spacing.md).toBe(darkTheme.spacing.md);
      expect(lightTheme.spacing.lg).toBe(darkTheme.spacing.lg);
    });

    it('should have same radii as dark theme', () => {
      expect(lightTheme.radii.lg).toBe(darkTheme.radii.lg);
      expect(lightTheme.radii.xl).toBe(darkTheme.radii.xl);
    });

    it('should have same shadows as dark theme', () => {
      expect(lightTheme.shadows.md).toEqual(darkTheme.shadows.md);
      expect(lightTheme.shadows.lg).toEqual(darkTheme.shadows.lg);
    });
  });

  describe('Dark vs Light differences', () => {
    it('should have different background colors', () => {
      expect(darkTheme.colors.background).not.toBe(lightTheme.colors.background);
    });

    it('should have different foreground colors', () => {
      expect(darkTheme.colors.foreground).not.toBe(lightTheme.colors.foreground);
    });

    it('should have different primary shades (dark uses 500, light uses 600)', () => {
      expect(darkTheme.colors.primary).toBe(cyan[500]);
      expect(lightTheme.colors.primary).toBe(cyan[600]);
    });

    it('should maintain cyan/gray palette in both themes', () => {
      expect(darkTheme.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
      expect(lightTheme.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
