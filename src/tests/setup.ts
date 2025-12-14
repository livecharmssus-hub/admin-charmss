import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Run cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.location for navigation tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    assign: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
});
