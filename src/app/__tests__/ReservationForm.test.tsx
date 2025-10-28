import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationsPage from '@/app/reservations/page';
import { renderWithClient } from '@/test/msw/test-utils';
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

describe('ReservationForm', () => {
  beforeEach(() => {
    server.use(
      http.get('/api/books', () =>
        HttpResponse.json([
          {
            id: 'A',
            title: 'La saga',
            genres: ['Science Fiction', 'Thriller'],
            authors: [{ id: 'A', name: 'Author A' }],
            year: '2019',
          },
          {
            id: 'B',
            title: 'Blood and Bone',
            genres: ['Thriller', 'Dystopian'],
            authors: [{ id: 'B', name: 'Author B' }],
            year: '2021',
          },
        ]),
      ),
      http.get('/api/reservations', () =>
        HttpResponse.json([
          {
            id: 'R1',
            book: {
              id: 'A',
              title: 'La saga',
              genres: ['Science Fiction', 'Thriller'],
              authors: [{ id: 'A', name: 'Author A' }],
              year: '2019',
            },
            reservedBy: { id: 'U1', name: 'User One', email: 'a@b.com' },
            reservedAt: '2025-12-01',
            dueDate: '2025-12-24',
          },
        ]),
      ),
    );
  });

  it('validate fields and create a reservation', async () => {
    server.use(
      http.post('/api/reservations', async () =>
        HttpResponse.json(
          {
            id: 'new-id',
            book: {
              id: 'B',
              title: 'Blood and Bone',
              genres: ['Thriller', 'Dystopian'],
              authors: [{ id: 'B', name: 'Author B' }],
              year: 2021,
            },
            reservedBy: { id: 'U3', name: 'User Three', email: 'e@f.com' },
            reservedAt: '2023-03-01',
            dueDate: '2025-09-26',
          },
          { status: 201 },
        ),
      ),
    );

    const user = userEvent.setup();
    renderWithClient(<ReservationsPage />);

    await screen.findByRole('option', { name: 'Blood and Bone' });

    const bookSelect = screen.getByRole('combobox');
    await user.selectOptions(bookSelect, 'B');

    const dueDate = screen.getByPlaceholderText(/date de retour souhaitée/i);
    await user.clear(dueDate);
    await user.type(dueDate, '2025-12-26');

    await user.click(screen.getByRole('button', { name: /réserver/i }));

    expect(await screen.findByText(/réservation créée avec succès/i)).toBeInTheDocument();

    // Le formlaire a bien ete reset pres le post
    expect((bookSelect as HTMLSelectElement).value).toBe('');
    expect((dueDate as HTMLInputElement).value).toBe('');
  });

  it('display an error if API rejects the reservation', async () => {
    server.use(
      http.post('/api/reservations', async () =>
        HttpResponse.json({ message: 'endsAt must be after startsAt' }, { status: 400 }),
      ),
    );

    const user = userEvent.setup();
    renderWithClient(<ReservationsPage />);

    await screen.findByRole('option', { name: 'Blood and Bone' });

    const bookSelect = screen.getByRole('combobox');
    await user.selectOptions(bookSelect, 'B');

    const dueDate = screen.getByPlaceholderText(/date de retour souhaitée/i);
    await user.clear(dueDate);
    await user.type(dueDate, '2025-09-26');

    await user.click(screen.getByRole('button', { name: /réserver/i }));

    expect(
      await screen.findByText(/erreur lors de la création de la réservation/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/endsAt.*after.*startsAt/i)).toBeInTheDocument();

    expect(screen.queryByText(/réservation créée/i)).not.toBeInTheDocument();
  });

  it('should delete a reservation', async () => {
    renderWithClient(<ReservationsPage />);

    expect(await screen.findByText(/Livre : La saga/i)).toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(screen.getByTestId(/removeBook/i));

    expect(await screen.findByText(/Réservation supprimée/i)).toBeInTheDocument();
  });
});
