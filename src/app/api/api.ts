import { http } from '../lib/central';
import type { Author, Book, Reservation } from '../lib/types';

export const booksApi = {
    list: () => http.get<Book[]>('/books'),
    get: (id: string) => http.get<Book>(`/books/${id}`),
    create: (payload: {
        title: string;
        year?: string;
        authorNames: string[];
        genreNames: string[];
    }) => http.post<Book>('/books', payload),
    update: (id: string, patch: Partial<Book>) => http.patch<Book>(`/books/${id}`, patch),
    remove: (id: string) => http.delete<void>(`/books/${id}`),
};

export const authorsApi = {
    list: () => http.get<Author[]>('/authors'),
    get: (id: string) => http.get<Author>(`/authors/${id}`),
    create: (payload: { name: string }) => http.post<Author>('/authors', payload),
    update: (id: string, patch: Partial<Author>) => http.patch<Author>(`/authors/${id}`, patch),
    remove: (id: string) => http.delete<void>(`/authors/${id}`),
};

export const reservationsApi = {
    list: () => http.get<Reservation[]>('/reservations'),
    get: (id: string) => http.get<Reservation>(`/reservations/${id}`),
    create: (payload: { bookId: string; dueDate: string }) =>
        http.post<Reservation>('/reservations', payload),
    update: (id: string, patch: Partial<Reservation>) =>
        http.patch<Reservation>(`/reservations/${id}`, patch),
    remove: (id: string) => http.delete<void>(`/reservations/${id}`),
};
