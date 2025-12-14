import { vi } from 'vitest';

// Global test utilities and mocks
declare global {
  const vi: typeof import('vitest').vi;
}

// Mock environment variables
vi.stubEnv('VITE_API_URL', 'http://localhost:3000');
vi.stubEnv('VITE_APP_TITLE', 'Charmss Admin');
vi.stubEnv('VITE_ENV', 'test');
