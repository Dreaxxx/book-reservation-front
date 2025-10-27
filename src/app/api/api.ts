import { persistAuth } from '../lib/auth';
import { http } from '../lib/central';
import type {
  Author,
  AuthResponse,
  Book,
  CreateAuthorPayload,
  CreateBookPayload,
  CreateReservationPayload,
  LoginPayload,
  RegisterPayload,
  Reservation,
} from '../lib/types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>('/auth/login', payload);
    const data = res.data;

    persistAuth(data);

    return data;
  },
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>('/auth/signup', payload);
    const data = res.data;

    persistAuth(data);

    return data;
  },
};

export const booksApi = {
  list: () => http.get<Book[]>('/books'),
  get: (id: string) => http.get<Book>(`/books/${id}`),
  search: (params: { searchQuery?: string; author?: string; genre?: string }) =>
    http.get('/books/search', {
      params: {
        querySting: params.searchQuery,
        autor: params.author,
        genre: params.genre,
      },
    }),
  create: (payload: CreateBookPayload) => http.post<Book>('/books', payload),
  update: (id: string, patchPayload: Partial<CreateBookPayload>) =>
    http.patch<Book>(`/books/${id}`, patchPayload),
  remove: (id: string) => http.delete<void>(`/books/${id}`),
};

export const authorsApi = {
  list: () => http.get<Author[]>('/authors'),
  get: (id: string) => http.get<Author>(`/authors/${id}`),
  create: (payload: CreateAuthorPayload) => http.post<Author>('/authors', payload),
  update: (id: string, patchPayload: Partial<CreateAuthorPayload>) =>
    http.patch<Author>(`/authors/${id}`, patchPayload),
  remove: (id: string) => http.delete<void>(`/authors/${id}`),
};

export const reservationsApi = {
  list: () => http.get<Reservation[]>('/reservations'),
  get: (id: string) => http.get<Reservation>(`/reservations/${id}`),
  create: (payload: CreateReservationPayload) => http.post<Reservation>('/reservations', payload),
  update: (id: string, patchPayload: Partial<CreateReservationPayload>) =>
    http.patch<Reservation>(`/reservations/${id}`, patchPayload),
  remove: (id: string) => http.delete<void>(`/reservations/${id}`),
};
