'use client';

import { useEffect, useState } from 'react';
import type { Book } from '../lib/types';
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

    const loadBooks = async () => {
        setLoading(true);
        const bookRes = (await booksApi.list()).data;
        setBooks(bookRes);
        setLoading(false);
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const submitBook = async (e: React.FormEvent) => {
        e.preventDefault();
        await booksApi.create({
            title,
            year: year === '' ? undefined : year,
            authorNames: authorNames.split(',').map((s) => s.trim()).filter(Boolean),
            genreNames: genreNames.split(',').map((s) => s.trim()).filter(Boolean),
        });
        setTitle('');
        setYear('');
        setAuthorNames('');
        setGenreNames('');
        await loadBooks();
    };

    const startEdit = (b: Book) => {
        setEditId(b.id);
        setEditTitle(b.title);
        setEditYear(b.year?.toString() ?? '');
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

    return (
        <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
            <h1>Livres</h1>

            <section style={{ marginTop: 24, marginBottom: 32 }}>
                <h2>Ajouter un livre</h2>
                <form onSubmit={submitBook} style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}>
                    <input placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <input placeholder="Année (optionnel)" value={year} onChange={(e) => setYear(e.target.value)} />
                    <input placeholder="Auteurs (séparés par des virgules)" value={authorNames} onChange={(e) => setAuthorNames(e.target.value)} required />
                    <input placeholder="Genres (séparés par des virgules)" value={genreNames} onChange={(e) => setGenreNames(e.target.value)} required />
                    <button type="submit">Créer</button>
                </form>
            </section>

            <h2>Liste</h2>
            {loading ? (
                <p>Chargement…</p>
            ) : (
                <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
                    {books.map((b) => (
                        <li key={b.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                            {editId === b.id ? (
                                <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                    <input value={editYear} onChange={(e) => setEditYear(e.target.value)} placeholder="Année" />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button type="button" onClick={saveEdit}>Enregistrer</button>
                                        <button type="button" onClick={cancelEdit}>Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontWeight: 600 }}>
                                        {b.title} {b.year ? `(${b.year})` : ''}
                                    </div>
                                    <div>Auteurs : {b.authors.map((a) => a.name).join(', ') || '—'}</div>
                                    <div>Genres : {b.genres.map((g) => g).join(', ') || '—'}</div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <button type="button" onClick={() => startEdit(b)}>Modifier</button>
                                        <button type="button" onClick={() => deleteBook(b.id)}>Supprimer</button>
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
