import { screen } from '@testing-library/react';
import BooksPage from '../books/page';
import { renderWithClient } from '@/test/msw/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('BooksPage', () => {
  it('display books list from API', async () => {
    renderWithClient(<BooksPage />);

    expect(await screen.findByText(/La saga/i)).toBeInTheDocument();
    expect(await screen.findByText(/Blood and Bone/i)).toBeInTheDocument();

    expect(await screen.findByText(/2019/i)).toBeInTheDocument();
    expect(await screen.findByText(/2021/i)).toBeInTheDocument();
  });

  it('create a book', async () => {
    renderWithClient(<BooksPage />);

    const user = userEvent.setup();

    await user.clear(screen.getByTestId(/title/i));
    await user.type(screen.getByTestId(/title/i), 'Nouveau Livre');
    await user.clear(screen.getByTestId(/year/i));
    await user.type(screen.getByTestId(/year/i), '2019');
    await user.clear(screen.getByTestId(/authors/i));
    await user.type(screen.getByTestId(/authors/i), 'Bob le bricoleur');
    await user.clear(screen.getByTestId(/genres/i));
    await user.type(screen.getByTestId(/genres/i), 'Science Fiction, Action');

    await user.click(screen.getByRole('button', { name: /Créer/i }));

    expect(await screen.findByText(/Livre créé/i)).toBeInTheDocument();
  });
});
