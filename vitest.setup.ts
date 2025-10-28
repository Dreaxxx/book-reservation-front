import { beforeAll, afterAll, afterEach, vi, Mock } from 'vitest';
import { server } from '@/test/msw/server';
import '@testing-library/jest-dom';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Stub de la popup confirm globale pour les tests
beforeAll(() => {
  vi.stubGlobal(
    'confirm',
    vi.fn(() => true),
  );
});

// Effacer le stub apres chaque test
afterEach(() => {
  (globalThis.confirm as unknown as Mock).mockClear();
});
