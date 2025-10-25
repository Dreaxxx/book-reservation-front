'use client';

import { useEffect, useState } from 'react';
import type { Author, Book } from '../lib/types';
import { booksApi } from '../api/api';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string | ''>('');
  const [authorNames, setAuthorNames] = useState<string>('');
  const [genreNames, setGenreNames] = useState<string>('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editYear, setEditYear] = useState<string | ''>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const loadBooks = async (params?: { searchQuery?: string; author?: string; genre?: string }) => {
    setLoading(true);
    try {
      if (params && (params.searchQuery || params.author || params.genre)) {
        const res = await booksApi.search(params);
        console.log('res', res.data.items);
        setBooks(res.data.items ?? res.data);
      } else {
        const bookRes = (await booksApi.list()).data;
        setBooks(bookRes);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const submitBook = async () => {
    await booksApi.create({
      title,
      year: year === '' ? undefined : year,
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

  const startEdit = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditYear(book.year?.toString() ?? '');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditYear('');
  };

  const saveEdit = async () => {
    if (!editId) return;
    await booksApi.update(editId, {
      title: editTitle,
      year: editYear === '' ? undefined : editYear,
    });
    cancelEdit();
    await loadBooks();
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Supprimer ce livre ?')) return;
    await booksApi.remove(id);
    await loadBooks();
  };

  const handleSearch = async () => {
    await loadBooks({ searchQuery, author, genre });
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Livres</h1>

      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr 1fr 1fr auto',
          maxWidth: 860,
          marginBottom: 16,
        }}
      >
        <input
          placeholder="Rechercher (titre, auteur, genre)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          placeholder="Auteur exact (optionnel)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          placeholder="Genre exact (optionnel)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

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

      <h2>Liste</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {books.map((book: Book) => (
            <li key={book.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              {editId === book.id ? (
                <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <input
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    placeholder="Année"
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={saveEdit}>
                      Enregistrer
                    </button>
                    <button type="button" onClick={cancelEdit}>
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 600 }}>
                    {book.title} {book.year ? `(${book.year})` : ''}
                  </div>
                  <div>
                    Auteurs : {book.authors.map((author: Author) => author.name).join(', ') || '—'}
                  </div>
                  <div>Genres : {book.genres.map((g) => g).join(', ') || '—'}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={() => startEdit(book)}>
                      Modifier
                    </button>
                    <button type="button" onClick={() => deleteBook(book.id)}>
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
