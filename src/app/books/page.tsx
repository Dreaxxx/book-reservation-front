'use client';

import { useEffect, useState } from 'react';
import type { Author, Book, GoogleBook } from '../lib/types';
import { booksApi } from '../api/api';
import { searchBooksByTitleGoogle } from '../api/book-public-api';
import { useDebounce } from 'use-debounce';
import { useErrorMessage } from '../hooks/useErrorMessage';
import { ErrorDiv } from '@/components/ErrorDiv';
import { SuccessDiv } from '@/components/SuccessDiv';

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
  const [editAuthorNames, setEditAuthorNames] = useState<string>('');
  const [editGenreNames, setEditGenreNames] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');

  const [extQuery, setExtQuery] = useState('');
  const [extLoading, setExtLoading] = useState(false);
  const [extResults, setExtResults] = useState<GoogleBook[]>([]);

  const { errorMsg, setError, clearError } = useErrorMessage();
  const [successMsg, setSuccessMsg] = useState('');

  const [debouncedQuery] = useDebounce(extQuery, 300);

  const loadBooks = async (params?: { searchQuery?: string; author?: string; genre?: string }) => {
    setLoading(true);
    clearError();

    try {
      if (params && (params.searchQuery || params.author || params.genre)) {
        const res = await booksApi.search({
          searchQuery: params.searchQuery,
          author: params.author,
          genre: params.genre,
        });
        setBooks(res.data.items ?? res.data);
      } else {
        const bookRes = (await booksApi.list()).data;
        setBooks(bookRes);
      }
    } catch (error) {
      console.error('Error loading books : ', error);
      setError(error, 'Erreur lors du chargement des livres');
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const debouncedQueryTRimed = debouncedQuery.trim();

    if (!debouncedQueryTRimed) {
      setExtResults([]);
      return;
    }

    setExtLoading(true);

    searchBooksByTitleGoogle(debouncedQueryTRimed, 8)
      .then(setExtResults)
      .catch(() => setExtResults([]))
      .finally(() => setExtLoading(false));
  }, [debouncedQuery]);

  const submitBook = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();

    try {
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
      setSuccessMsg('Livre créé avec succès.');
    } catch (error) {
      console.error('Error creating book : ', error);
      setError(error, 'Erreur lors de la création du livre');
    }
  };

  const startEdit = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditYear(book.year?.toString() ?? '');
    setEditAuthorNames(book.authors.map((author: Author) => author.name).join(', '));
    setEditGenreNames(book.genres.map((genre) => genre).join(', '));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditYear('');
    setEditAuthorNames('');
    setEditGenreNames('');
  };

  const saveEdit = async () => {
    if (!editId) return;
    clearError();

    try {
      await booksApi.update(editId, {
        title: editTitle,
        year: editYear === '' ? undefined : editYear,
        authorNames: editAuthorNames
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        genreNames: editGenreNames
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      cancelEdit();
      await loadBooks();
      setSuccessMsg('Livre mis à jour avec succès.');
    }
    catch (error) {
      console.error('Error updating book : ', error);
      setError(error, 'Erreur lors de la mise à jour du livre');
    }
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Supprimer ce livre ?')) return;
    clearError();

    try {
      await booksApi.remove(id);
      await loadBooks();
    } catch (error) {
      console.error('Error deleting book : ', error);
      setError(error, 'Erreur lors de la suppression du livre');
    }
  };

  const handleSearch = async () => {
    await loadBooks({ searchQuery, author, genre });
  };

  const importFromPublic = (book: GoogleBook) => {
    setTitle(book.title);
    setYear(book.year ? String(book.year) : '');
    setAuthorNames(book.authors.join(', '));
    setGenreNames(book.genres.join(', '));
  };

  const createFromPublic = async (book: GoogleBook) => {
    if (!confirm('Importer ce livre ?')) return;
    
    clearError();

    try {
      await booksApi.create({
        title: book.title,
        year: book.year ? String(book.year) : undefined,
        authorNames: book.authors,
        genreNames: book.genres,
      });
      await loadBooks();
      setSuccessMsg('Livre importé et créé avec succès.');
    } catch (error) {
      console.error('Error creating book : ', error);
      setError(error, 'Erreur lors de la création du livre');
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Les livres de notre bibliothèque :</h1>

      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: '1fr 1fr 1fr auto',
          maxWidth: 860,
          marginBottom: 16,
          marginTop: 8
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

      <section style={{ marginTop: 8, marginBottom: 24 }}>
        <h2>Importer depuis Google Books</h2>
        <div style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
          <input
            placeholder="Chercher par titre de livre (Google Books)"
            value={extQuery}
            onChange={(e) => setExtQuery(e.target.value)}
          />
          {extLoading && <p>Recherche…</p>}
          {!extLoading && extResults.length > 0 && (
            <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
              {extResults.map((bookResult) => (
                <li
                  key={bookResult.providerId}
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 8,
                    padding: 12,
                    display: 'grid',
                    gridTemplateColumns: '64px 1fr auto',
                    gap: 12,
                    alignItems: 'center',
                  }}
                >
                  {bookResult.thumbnail ? (
                    <img
                      src={bookResult.thumbnail}
                      alt=""
                      width={64}
                      height={96}
                      style={{ objectFit: 'cover', borderRadius: 4 }}
                    />
                  ) : (
                    <div style={{ width: 64, height: 96, background: '#f3f3f3' }} />
                  )}
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {bookResult.title}
                      {bookResult.year ? ` (${bookResult.year})` : ''}
                    </div>
                    <div style={{ fontSize: 13, color: '#555' }}>
                      {bookResult.authors.join(', ')}
                    </div>
                    {bookResult.genres.length > 0 && (
                      <div style={{ fontSize: 12, color: '#777' }}>
                        {bookResult.genres.join(' • ')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" onClick={() => importFromPublic(bookResult)}>
                      Pré-remplir
                    </button>
                    <button type="button" onClick={() => createFromPublic(bookResult)}>
                      Créer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {!extLoading && extQuery && extResults.length === 0 && (
            <p>
              Aucun résultat Google Books pour “{extQuery}”. Utilisez le formulaire ci-dessous pour
              créer manuellement.
            </p>
          )}
        </div>
      </section>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Ajouter un livre à la bibliothèque</h2>
        <form
          id="create-form"
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
        {errorMsg && (
          <ErrorDiv message={errorMsg} />
        )}
        {successMsg && (
          <SuccessDiv message={successMsg} />
        )}
      </section>

      <h2>Liste de nos livres disponibles</h2>
      {loading ? (
        <p>Chargement en cours…</p>
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
                  <input
                    value={editAuthorNames}
                    onChange={(e) => setEditAuthorNames(e.target.value)}
                    placeholder="Auteurs (séparés par des virgules)"
                  />
                  <input
                    value={editGenreNames}
                    onChange={(e) => setEditGenreNames(e.target.value)}
                    placeholder="Genres (séparés par des virgules)"
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
                  <div>Genres : {book.genres.map((genre) => genre).join(', ') || '—'}</div>
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
