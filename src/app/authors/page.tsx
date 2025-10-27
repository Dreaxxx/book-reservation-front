'use client';

import { useEffect, useState } from 'react';
import type { Author } from '../lib/types';
import { authorsApi } from '../api/api';
import { AxiosError } from 'axios';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const [authorName, setAuthorName] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAuthors = async () => {
    setLoading(true);

    try {
      const res = (await authorsApi.list()).data;
      setAuthors(res);
      setLoading(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.data) {
        setErrorMsg('Erreur lors du chargement des auteurs : ' + error.message);
      } else if (error instanceof Error) {
        setErrorMsg('Erreur lors du chargement des auteurs : ' + error.message);
      } else {
        setErrorMsg('Erreur lors du chargement des auteurs : ' + String(error));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const submitAuthor = async () => {
    if (!authorName.trim()) return;

    try {
      await authorsApi.create({ name: authorName });
      setAuthorName('');
      await loadAuthors();
      setSuccessMsg('Auteur créé avec succès.');
    } catch (error) {
      console.error('Error creating author : ', error);
      setErrorMsg('Erreur lors de la création de l\'auteur : ' + String(error));
    }
  }


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

    try {
      await authorsApi.update(editId, { name: editName });
      cancelEdit();
      await loadAuthors();
      setSuccessMsg('Auteur mis à jour avec succès.');
    } catch (error) {
      console.error('Error updating author : ', error);
      setErrorMsg('Erreur lors de la mise à jour de l\'auteur : ' + String(error));
    }
  };
  const deleteAuthor = async (id: string) => {
    if (!confirm('Supprimer cet auteur ?')) return;

    try {
      await authorsApi.remove(id);
      await loadAuthors();
      setSuccessMsg('Auteur supprimé avec succès.');
    } catch (error) {
      console.error('Error deleting author : ', error);
      setErrorMsg('Erreur lors de la suppression de l\'auteur : ' + String(error));
    }
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
      {errorMsg && (
        <div style={{ marginTop: 16, color: 'red' }}>
          <strong>Une erreur s'est produite :</strong> {errorMsg}
        </div>
      )}
      {successMsg && (
        <div style={{ marginTop: 16, color: 'green' }}>
          <strong>Succès :</strong> {successMsg}
        </div>
      )}
    </main>
  );
}
