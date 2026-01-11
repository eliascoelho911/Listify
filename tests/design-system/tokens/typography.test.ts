/**
 * Tests for Typography Tokens
 *
 * Validates:
 * - Fira Sans as body font family
 * - Fira Code as monospace font family
 * - Complete weights scale
 * - Complete sizes scale
 * - Complete line heights scale
 */

import { families, lineHeights, sizes, weights } from '@design-system/tokens';

describe('Typography Tokens', () => {
  describe('Font families', () => {
    it('should use Fira Sans for body', () => {
      expect(families.body).toBe('Fira Sans');
    });

    it('should use Fira Code for monospace', () => {
      expect(families.mono).toBe('Fira Code');
    });
  });

  describe('Font weights', () => {
    it('should have regular, medium, semibold, bold', () => {
      expect(weights).toHaveProperty('regular');
      expect(weights).toHaveProperty('medium');
      expect(weights).toHaveProperty('semibold');
      expect(weights).toHaveProperty('bold');
    });

    it('should use correct weight values', () => {
      expect(weights.regular).toBe('400');
      expect(weights.medium).toBe('500');
      expect(weights.semibold).toBe('600');
      expect(weights.bold).toBe('700');
    });
  });

  describe('Font sizes', () => {
    it('should have complete scale (xs to 4xl)', () => {
      expect(sizes).toHaveProperty('xs');
      expect(sizes).toHaveProperty('sm');
      expect(sizes).toHaveProperty('base');
      expect(sizes).toHaveProperty('md');
      expect(sizes).toHaveProperty('lg');
      expect(sizes).toHaveProperty('xl');
      expect(sizes).toHaveProperty('2xl');
      expect(sizes).toHaveProperty('3xl');
      expect(sizes).toHaveProperty('4xl');
    });

    it('should have correct size values in pixels', () => {
      expect(sizes.xs).toBe(12);
      expect(sizes.sm).toBe(14);
      expect(sizes.base).toBe(16);
      expect(sizes.md).toBe(18);
      expect(sizes.lg).toBe(20);
      expect(sizes.xl).toBe(24);
      expect(sizes['2xl']).toBe(30);
      expect(sizes['3xl']).toBe(36);
      expect(sizes['4xl']).toBe(48);
    });
  });

  describe('Line heights', () => {
    it('should have tight, normal, relaxed', () => {
      expect(lineHeights).toHaveProperty('tight');
      expect(lineHeights).toHaveProperty('normal');
      expect(lineHeights).toHaveProperty('relaxed');
    });

    it('should use correct relative values', () => {
      expect(lineHeights.tight).toBe(1.2);
      expect(lineHeights.normal).toBe(1.5);
      expect(lineHeights.relaxed).toBe(1.75);
    });
  });
});
