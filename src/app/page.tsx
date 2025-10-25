'use client';

import { useEffect, useState } from 'react';
import { api } from './api/api';
import { Author, Book, Reservation } from './lib/types';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string | ''>('');
  const [authorNames, setAuthorNames] = useState<string>('');

  const [authorName, setAuthorName] = useState('');

  const [genreNames, setGenreNames] = useState<string>('');

  const loadBooks = async () => {
    setLoading(true);

    const bookRes = await api.get<Book[]>('/books');

    setBooks(bookRes.data);

    setLoading(false);
  };

  const loadAuthors = async () => {
    setLoading(true);

    const authorRes = await api.get<Author[]>('/authors');

    setAuthors(authorRes.data);

    setLoading(false);
  };

  const loadReservations = async () => {
    setLoading(true);

    const resaRes = await api.get<Reservation[]>('/reservations');

    setReservations(resaRes.data);

    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
    loadAuthors();
    loadReservations();
  }, []);

  const submitBook = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post('/books', {
      title,
      year: year === '' ? undefined : Number(year),
      authorNames: authorNames
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      genreNames: genreNames
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });

    setTitle('');
    setYear('');
    setAuthorNames('');
    setGenreNames('');

    await loadBooks();
  };

  const submitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post('/authors', {
      name: authorName,
    });

    setAuthorName('');

    await loadAuthors();
  };

  const submitResa = async (e: React.FormEvent) => {
    e.preventDefault();

    const dueDate = (e.target as any).dueDate.value;

    const bookId = Number((e.target as any).book.value);

    await api.post('/reservations', {
      bookId,
      dueDate,
    });

    await loadReservations();
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Ajoutez un livre à notre bibliothèque</h1>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Ajouter un livre</h2>
        <form onSubmit={submitBook} style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}>
          <input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Année (optionnel)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            placeholder="Auteurs (séparés par des virgules)"
            value={authorNames}
            onChange={(e) => setAuthorNames(e.target.value)}
            required
          />
          <input
            placeholder="Genres (séparés par des virgules)"
            value={genreNames}
            onChange={(e) => setGenreNames(e.target.value)}
            required
          />
          <button type="submit">Créer</button>
        </form>
      </section>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Ajouter un auteur</h2>
        <form onSubmit={submitAuthor} style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            Nom de l'auteur :{' '}
          </label>
          <input
            placeholder="Nom et prénom"
            value={title}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <button type="submit">Créer</button>
        </form>
      </section>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Faire une réservation</h2>
        <form onSubmit={submitResa} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            Livre :
          </label>
          <select>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            Date de retour souhaitée :
          </label>
          <input
            required
            id=""
            test-id="dueDate"
            placeholder="Date de retour souhaité"
            type="date"
          />
          <button type="submit">Créer</button>
        </form>
      </section>

      <h2>Livres</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {books.map((b) => (
            <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>
                {b.title} {b.year ? `(${b.year})` : ''}
              </div>
              <div>Auteurs : {b.authors.map((a) => a.name).join(', ') || '—'}</div>
              <div>Genres : {b.genres.map((g) => g).join(', ') || '—'}</div>
            </li>
          ))}
        </ul>
      )}

      <h2>Auteurs</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {authors.map((b) => (
            <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <div>Auteurs : {b.name} </div>
            </li>
          ))}
        </ul>
      )}

      <h2>Les réservations</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {reservations.map((b) => (
            <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <div>Livre : {b.book.title} </div>
              <div>Date d'emprunt : {b.reservedAt} </div>
              <div>Date de retour : {b.dueDate} </div>
              <div>Personne : {b.reservedBy.name} </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
