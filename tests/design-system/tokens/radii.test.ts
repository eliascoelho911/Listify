/**
 * Tests for Border Radius Tokens
 *
 * Validates:
 * - Complete "large" radius scale
 * - Values are larger than medium (large radius padrão)
 */

import { radii } from '@design-system/tokens';

describe('Border Radius Tokens', () => {
  it('should have complete radius scale', () => {
    expect(radii).toHaveProperty('none');
    expect(radii).toHaveProperty('sm');
    expect(radii).toHaveProperty('md');
    expect(radii).toHaveProperty('lg');
    expect(radii).toHaveProperty('xl');
    expect(radii).toHaveProperty('full');
  });

  it('should have large radius values', () => {
    expect(radii.none).toBe(0);
    expect(radii.sm).toBe(8);
    expect(radii.md).toBe(12);
    expect(radii.lg).toBe(16);
    expect(radii.xl).toBe(24);
    expect(radii.full).toBe(9999);
  });

  it('should be larger than typical medium radius', () => {
    // Typical medium radius: sm=4, md=8, lg=12
    // Our large radius: sm=8, md=12, lg=16
    expect(radii.sm).toBeGreaterThanOrEqual(8); // Larger than typical
    expect(radii.md).toBeGreaterThanOrEqual(12); // Larger than typical
    expect(radii.lg).toBeGreaterThanOrEqual(16); // Larger than typical
  });

  it('should have consistent scale progression', () => {
    expect(radii.none).toBeLessThan(radii.sm);
    expect(radii.sm).toBeLessThan(radii.md);
    expect(radii.md).toBeLessThan(radii.lg);
    expect(radii.lg).toBeLessThan(radii.xl);
    expect(radii.xl).toBeLessThan(radii.full);
  });

  it('should have full radius for pills/circles', () => {
    expect(radii.full).toBe(9999);
  });
});
