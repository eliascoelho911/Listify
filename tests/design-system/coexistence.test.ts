/**
 * Coexistence Test
 *
 * Validates that both legacy and new Design Systems can coexist without conflicts
 */

describe('Design Systems Coexistence', () => {
  it('should import from new Design System without errors', () => {
    // Test that new DS exports are available
    const { Button, Input, Card } = require('@design-system/atoms');
    const { FormField, SearchBar } = require('@design-system/molecules');
    const { Navbar, ShoppingListCard } = require('@design-system/organisms');
    const { useTheme, ThemeProvider } = require('@design-system/theme');
    const { colors, spacing, radii } = require('@design-system/tokens');

    expect(Button).toBeDefined();
    expect(Input).toBeDefined();
    expect(Card).toBeDefined();
    expect(FormField).toBeDefined();
    expect(SearchBar).toBeDefined();
    expect(Navbar).toBeDefined();
    expect(ShoppingListCard).toBeDefined();
    expect(useTheme).toBeDefined();
    expect(ThemeProvider).toBeDefined();
    expect(colors).toBeDefined();
    expect(spacing).toBeDefined();
    expect(radii).toBeDefined();
  });

  it('should import from legacy Design System without errors', () => {
    // Test that legacy DS exports are still available
    const legacyExports = require('@legacy-design-system');

    expect(legacyExports).toBeDefined();
    // Legacy DS should have its own exports
    expect(typeof legacyExports).toBe('object');
  });

  it('should allow imports from both Design Systems simultaneously', () => {
    // Test that both can be imported at the same time without conflicts
    const newDS = require('@design-system');
    const legacyDS = require('@legacy-design-system');

    expect(newDS).toBeDefined();
    expect(legacyDS).toBeDefined();

    // They should be different objects
    expect(newDS).not.toBe(legacyDS);
  });

  it('should have correct path aliases configured', () => {
    // Test that TypeScript path aliases work correctly
    expect(() => require('@design-system')).not.toThrow();
    expect(() => require('@legacy-design-system')).not.toThrow();
    expect(() => require('@design-system/atoms')).not.toThrow();
    expect(() => require('@design-system/molecules')).not.toThrow();
    expect(() => require('@design-system/organisms')).not.toThrow();
    expect(() => require('@design-system/tokens')).not.toThrow();
    expect(() => require('@design-system/theme')).not.toThrow();
    expect(() => require('@design-system/utils')).not.toThrow();
  });

  it('should have new Design System tokens with correct structure', () => {
    const { colors, spacing, radii, typography } = require('@design-system/tokens');

    // Validate new DS has cyan theme
    expect(colors.cyan).toBeDefined();
    expect(colors.cyan[500]).toBe('#06b6d4');

    // Validate gray "chumbo" palette
    expect(colors.gray).toBeDefined();
    expect(colors.gray[600]).toBe('#6c757d');

    // Validate compact spacing
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);

    // Validate large radius
    expect(radii.lg).toBe(16);
    expect(radii.xl).toBe(24);

    // Validate Fira fonts
    expect(typography.families.body).toBe('Fira Sans');
    expect(typography.families.mono).toBe('Fira Code');
  });

  it('should have new Design System with topbar custom tokens', () => {
    const { darkTheme, lightTheme } = require('@design-system/theme/theme');

    // Validate custom topbar tokens exist in both themes
    expect(darkTheme.colors.topbar).toBeDefined();
    expect(darkTheme.colors['topbar-foreground']).toBeDefined();
    expect(darkTheme.colors['topbar-primary']).toBeDefined();
    expect(darkTheme.colors['topbar-border']).toBeDefined();

    expect(lightTheme.colors.topbar).toBeDefined();
    expect(lightTheme.colors['topbar-foreground']).toBeDefined();
    expect(lightTheme.colors['topbar-primary']).toBeDefined();
    expect(lightTheme.colors['topbar-border']).toBeDefined();
  });
});
