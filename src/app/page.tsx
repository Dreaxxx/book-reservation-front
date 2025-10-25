'use client';

import { useEffect, useState } from 'react';
import { Author, Book, Reservation } from './lib/types';
import { booksApi, authorsApi, reservationsApi } from './api/api';

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

  const [resaBookId, setResaBookId] = useState('');
  const [resaDueDate, setResaDueDate] = useState('');

  const loadBooks = async () => {
    setLoading(true);

    const bookRes = (await booksApi.list()).data;

    setBooks(bookRes);

    setLoading(false);
  };

  const loadAuthors = async () => {
    setLoading(true);

    const authorRes = (await authorsApi.list()).data;

    setAuthors(authorRes);

    setLoading(false);
  };

  const loadReservations = async () => {
    setLoading(true);

    const resaRes = (await reservationsApi.list()).data;

    setReservations(resaRes);

    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
    loadAuthors();
    loadReservations();
  }, []);

  const submitBook = async () => {
    await booksApi.create({
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

  const submitAuthor = async () => {
    await authorsApi.create({
      name: authorName,
    });

    setAuthorName('');

    await loadAuthors();
  };

  const submitResa = async () => {
    await reservationsApi.create({
      bookId: resaBookId,
      dueDate: resaDueDate,
    });

    await loadReservations();
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Ajoutez un livre à notre bibliothèque</h1>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Ajouter un livre</h2>
        <form
          onSubmit={submitBook}
          style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}
        >
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
        <form
          onSubmit={submitAuthor}
          style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            Nom de l'auteur :{' '}
          </label>
          <input
            placeholder="Nom et prénom"
            value={authorName}
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
          <select name="book" id="book" onChange={(e) => setResaBookId(e.target.value)} required>
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
            id="dueDate"
            name="dueDate"
            test-id="dueDate"
            placeholder="Date de retour souhaité"
            type="date"
            onChange={(e) => setResaDueDate(e.target.value)}
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
