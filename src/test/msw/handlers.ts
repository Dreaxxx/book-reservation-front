import {
  Author,
  AuthResponse,
  Book,
  CreateAuthorPayload,
  CreateBookPayload,
  CreateReservationPayload,
  Reservation,
} from './../../app/lib/types';
import { http, HttpResponse } from 'msw';

type CustomDataForTest =
  | string
  | number
  | boolean
  | Book
  | Book[]
  | CreateBookPayload
  | Reservation
  | Reservation[]
  | CreateReservationPayload
  | Author
  | Author[]
  | CreateAuthorPayload
  | AuthResponse
  | null
  | undefined;

const json = <T extends CustomDataForTest>(data: T, init?: number | ResponseInit) =>
  HttpResponse.json(data, typeof init === 'number' ? { status: init } : init);

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === ' ' || body.password === ' ') {
      return json(null, 401);
    }

    return json(
      { accessToken: 'token', user: { id: 'U1', name: 'User One', email: 'a@b.com' } },
      200,
    );
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };

    if (body.email === ' ' || body.password === ' ' || body.name === ' ') {
      return json(null, 400);
    }

    return json(
      { accessToken: 'token', user: { id: 'U1', name: 'User One', email: 'a@b.com' } },
      201,
    );
  }),

  http.get('/api/books', () =>
    json([
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

  http.post('/api/books', async ({ request }) => {
    const body = (await request.json()) as CreateBookPayload;
    const newBook: Book = {
      id: 'new-id',
      title: body.title,
      year: body.year,
      genres: body.genreNames,
      authors: body.authorNames.map((n, i) => ({ id: `N${i}`, name: n })),
    };

    return json<Book>(newBook, 201);
  }),

  http.delete('/api/books/:id', () => json(null, 204)),

  http.get('/api/authors', ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const searchQuery = searchParams.get('searchQuery') || '';

    const authors: Author[] = [
      { id: 'A', name: 'Author A' },
      { id: 'B', name: 'Author B' },
      { id: 'C', name: 'Author C' },
    ];

    const filteredAuthors = authors.filter((author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return json(filteredAuthors);
  }),

  http.post('/api/authors', async ({ request }) => {
    const body = (await request.json()) as CreateAuthorPayload;
    return json<Author>({ id: 'new-id', ...body }, 201);
  }),

  http.delete('/api/authors/:id', () => json(null, 204)),

  http.get('/api/reservations', () => {
    const reservations: Reservation[] = [
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
        reservedAt: '2023-01-01',
        dueDate: '2023-01-15',
      },
    ];
    return json(reservations);
  }),

  http.post('/api/reservations', async ({ request }) => {
    const body = (await request.json()) as CreateReservationPayload;
    const newReservation: Reservation = {
      id: 'new-id',
      book: {
        id: body.bookId,
        title: 'Book',
        genres: [],
        authors: [],
        year: '2020',
      },
      reservedBy: {
        id: 'new-user-id',
        name: 'User',
        email: 'a@b.com',
      },
      reservedAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
    };

    return json<Reservation>(newReservation, 201);
  }),

  http.delete('/api/reservations/:id', () => json(null, 204)),
];
