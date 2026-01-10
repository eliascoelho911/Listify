/**
 * Tests for Spacing Tokens
 *
 * Validates:
 * - Complete compact spacing scale
 * - Values are smaller than Shadcn defaults (compact)
 */

import { spacing } from '@design-system/tokens';

describe('Spacing Tokens', () => {
  it('should have complete spacing scale', () => {
    expect(spacing).toHaveProperty('none');
    expect(spacing).toHaveProperty('xs');
    expect(spacing).toHaveProperty('sm');
    expect(spacing).toHaveProperty('md');
    expect(spacing).toHaveProperty('lg');
    expect(spacing).toHaveProperty('xl');
    expect(spacing).toHaveProperty('xxl');
    expect(spacing).toHaveProperty('3xl');
    expect(spacing).toHaveProperty('4xl');
  });

  it('should have compact values (smaller than Shadcn defaults)', () => {
    expect(spacing.none).toBe(0);
    expect(spacing.xs).toBe(4);
    expect(spacing.sm).toBe(8);
    expect(spacing.md).toBe(12);
    expect(spacing.lg).toBe(16);
    expect(spacing.xl).toBe(24);
    expect(spacing.xxl).toBe(32);
    expect(spacing['3xl']).toBe(48);
    expect(spacing['4xl']).toBe(64);
  });

  it('should be more compact than Shadcn defaults', () => {
    // Shadcn defaults: sm=8, md=16, lg=24
    // Our compact: sm=8, md=12, lg=16
    expect(spacing.md).toBeLessThan(16); // More compact
    expect(spacing.lg).toBeLessThan(24); // More compact
  });

  it('should have consistent scale progression', () => {
    expect(spacing.xs).toBeLessThan(spacing.sm);
    expect(spacing.sm).toBeLessThan(spacing.md);
    expect(spacing.md).toBeLessThan(spacing.lg);
    expect(spacing.lg).toBeLessThan(spacing.xl);
    expect(spacing.xl).toBeLessThan(spacing.xxl);
    expect(spacing.xxl).toBeLessThan(spacing['3xl']);
    expect(spacing['3xl']).toBeLessThan(spacing['4xl']);
  });
});
