/**
 * Container Tests
 *
 * Tests for the DI container buildDependencies function.
 */

import { buildDependencies } from '@app/di/container';

describe('buildDependencies', () => {
  it('should build all required dependencies', async () => {
    const dependencies = await buildDependencies();

    expect(dependencies).toBeDefined();
  });
});
