'use client';

import { useEffect, useState } from 'react';
import type { Author } from '../lib/types';
import { authorsApi } from '../api/api';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorName, setAuthorName] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const loadAuthors = async () => {
    setLoading(true);
    const res = (await authorsApi.list()).data;
    setAuthors(res);
    setLoading(false);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const submitAuthor = async () => {
    await authorsApi.create({ name: authorName });
    setAuthorName('');
    await loadAuthors();
  };

  const startEdit = (author: Author) => {
    setEditId(author.id);
    setEditName(author.name);
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };
  const saveEdit = async () => {
    if (!editId) return;
    await authorsApi.update(editId, { name: editName });
    cancelEdit();
    await loadAuthors();
  };
  const deleteAuthor = async (id: string) => {
    if (!confirm('Supprimer cet auteur ?')) return;
    await authorsApi.remove(id);
    await loadAuthors();
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Auteurs</h1>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Ajouter un auteur</h2>
        <form
          onSubmit={submitAuthor}
          style={{ display: 'grid', gap: 12, maxWidth: 480, marginTop: 8 }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            Nom de l'auteur :
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

      <h2>Liste</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {authors.map((author: Author) => (
            <li key={author.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              {editId === author.id ? (
                <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} />
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
                  <div>Auteur : {author.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={() => startEdit(author)}>
                      Modifier
                    </button>
                    <button type="button" onClick={() => deleteAuthor(author.id)}>
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
