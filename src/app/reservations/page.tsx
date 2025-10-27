'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Book, Reservation } from '../lib/types';
import { booksApi, reservationsApi } from '../api/api';
import { useAuth } from '../hooks/useAuth';

function formatDateISO(d: string | Date) {
  try {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.toLocaleDateString('fr-FR');
  } catch {
    return String(d);
  }
}
export default function ReservationsPage() {
  const { user, token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [resaBookId, setResaBookId] = useState('');
  const [resaDueDate, setResaDueDate] = useState('');

  const [editId, setEditId] = useState<string | null>(null);
  const [editDueDate, setEditDueDate] = useState('');

  const [searchQueryBook, setSearchQueryBook] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAll = async () => {
    setLoading(true);

    try {
      const [booksData, reservationsData] = await Promise.all([
        booksApi.list(),
        reservationsApi.list(),
      ]);

      setBooks(booksData.data);
      setReservations(reservationsData.data);
      setLoading(false);

      console.log('user : ', user);
      console.log('token : ', token);
    } catch (error) {
      console.error('Error loading data : ', error);
      setErrorMsg('Erreur lors du chargement des données : ' + String(error));
      setLoading(false);
    }
  };

  const filteredReservations = useMemo(() => {
    const seacrhQuery = searchQueryBook.trim().toLowerCase();
    if (!seacrhQuery) return reservations;
    return reservations.filter(
      (resa) =>
        resa.book.title.toLowerCase().includes(seacrhQuery) ||
        resa.reservedBy?.name.toLowerCase().includes(seacrhQuery),
    );
  }, [searchQueryBook, reservations]);

  useEffect(() => {
    loadAll();
  }, []);

  const submitResa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await reservationsApi.create({
        bookId: resaBookId,
        dueDate: resaDueDate,
      });
      console.log('Reservation created : ', res);
      setSuccessMsg('Réservation créée avec succès.');
      setResaBookId('');
      setResaDueDate('');
    } catch (error) {
      console.error('Error creating reservation : ', error);
      setErrorMsg('Erreur lors de la création de la réservation : ' + String(error));
      return;
    }

    await loadAll();
  };

  const startEdit = (reservation: Reservation) => {
    setEditId(reservation.id);
    setEditDueDate(reservation.dueDate.slice(0, 10)); // 'YYYY-MM-DD'
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditDueDate('');
  };
  const saveEdit = async () => {
    if (!editId) return;
    try {
      await reservationsApi.update(editId, { dueDate: editDueDate });
      cancelEdit();
      await loadAll();
      setSuccessMsg('Réservation mise à jour avec succès.');
    } catch (error) {
      console.error('Error updating reservation : ', error);
      setErrorMsg('Erreur lors de la mise à jour de la réservation : ' + String(error));
    }
  };
  const deleteResa = async (id: string) => {
    if (!confirm('Êtes-vous certain de vouloir retourner ce livre ?')) return;

    try {
      await reservationsApi.remove(id);
      await loadAll();
      setSuccessMsg('Réservation supprimée avec succès.');
    } catch (error) {
      console.error('Error deleting reservation : ', error);
      setErrorMsg('Erreur lors de la suppression de la réservation : ' + String(error));
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
      <h1>Réservations</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 8,
          maxWidth: 480,
          marginBottom: 16,
        }}
      >
        <input
          placeholder="Rechercher par nom de livre ou emprunteur"
          value={searchQueryBook}
          onChange={(e) => setSearchQueryBook(e.target.value)}
        />
      </form>

      <section style={{ marginTop: 24, marginBottom: 32 }}>
        <h2>Faire une réservation de livre</h2>
        <form onSubmit={submitResa} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
            Livre :
          </label>
          <select
            name="book"
            id="book"
            value={resaBookId}
            onChange={(e) => setResaBookId(e.target.value)}
            required
          >
            <option value="" disabled>
              Choisir un livre parmis ceux disponibles
            </option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title}
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
            placeholder="Date de retour souhaitée"
            type="date"
            value={resaDueDate}
            onChange={(e) => setResaDueDate(e.target.value)}
          />
          <button type="submit">Réserver</button>
        </form>
        <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
          (La date d'emprunt sera automatiquement définie au jour de la réservation)
        </div>

      </section>

      <h2>Liste des réservations en cours</h2>
      {loading ? (
        <p>Chargement des réservations…</p>
      ) : (
        <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
          {filteredReservations.map((reservation) => (
            <li
              key={reservation.id}
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}
            >
              {editId === reservation.id ? (
                <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                  <label>Nouvelle date de retour</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
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
                  <div>Livre : {reservation.book.title}</div>
                  <div>Date d'emprunt : {formatDateISO(reservation.reservedAt)}</div>
                  <div>Date de retour : {formatDateISO(reservation.dueDate)}</div>
                  <div>Personne : {reservation.reservedBy?.name ?? '—'}</div>
                  {reservation.reservedBy?.id === user?.id && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" onClick={() => startEdit(reservation)}>
                        Changer la date de retour
                      </button>
                      <button type="button" onClick={() => deleteResa(reservation.id)}>
                        Retourner le livre
                      </button>
                    </div>
                  )}
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
