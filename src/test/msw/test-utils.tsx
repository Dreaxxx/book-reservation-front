import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { MockAuthProvider } from '../MockAuthProveider';

export function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MockAuthProvider>{ui}</MockAuthProvider>
    </QueryClientProvider>,
  );
}
