'use client';

import { useEffect, useState } from 'react';
import type { Book, Reservation } from '../lib/types';
import { booksApi, reservationsApi } from '../api/api';

function fmtDateISO(d: string | Date) {
    try {
        const dt = typeof d === 'string' ? new Date(d) : d;
        return dt.toLocaleDateString('fr-FR');
    } catch {
        return String(d);
    }
}

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // create
    const [resaBookId, setResaBookId] = useState('');
    const [resaDueDate, setResaDueDate] = useState('');

    // edit
    const [editId, setEditId] = useState<string | null>(null);
    const [editDueDate, setEditDueDate] = useState('');

    const loadAll = async () => {
        setLoading(true);
        const [b, r] = await Promise.all([booksApi.list(), reservationsApi.list()]);
        setBooks(b.data);
        setReservations(r.data);
        setLoading(false);
    };

    useEffect(() => {
        loadAll();
    }, []);

    const submitResa = async (e: React.FormEvent) => {
        e.preventDefault();
        await reservationsApi.create({
            bookId: resaBookId,
            dueDate: resaDueDate,
        });
        setResaBookId('');
        setResaDueDate('');
        await loadAll();
    };

    const startEdit = (r: Reservation) => {
        setEditId(r.id);
        setEditDueDate(r.dueDate.slice(0, 10)); // 'YYYY-MM-DD'
    };
    const cancelEdit = () => {
        setEditId(null);
        setEditDueDate('');
    };
    const saveEdit = async () => {
        if (!editId) return;
        await reservationsApi.update(editId, { dueDate: editDueDate });
        cancelEdit();
        await loadAll();
    };
    const deleteResa = async (id: string) => {
        if (!confirm('Annuler/supprimer cette réservation ?')) return;
        await reservationsApi.remove(id);
        await loadAll();
    };

    return (
        <main style={{ padding: 24, maxWidth: 860, margin: '0 auto' }}>
            <h1>Réservations</h1>

            <section style={{ marginTop: 24, marginBottom: 32 }}>
                <h2>Faire une réservation</h2>
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
                        <option value="" disabled>Choisir un livre</option>
                        {books.map((b) => (
                            <option key={b.id} value={b.id}>{b.title}</option>
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
                    <button type="submit">Créer</button>
                </form>
            </section>

            <h2>Liste</h2>
            {loading ? (
                <p>Chargement…</p>
            ) : (
                <ul style={{ display: 'grid', gap: 12, listStyle: 'none', padding: 0 }}>
                    {reservations.map((r) => (
                        <li key={r.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
                            {editId === r.id ? (
                                <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
                                    <label>Nouvelle date de retour</label>
                                    <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button type="button" onClick={saveEdit}>Enregistrer</button>
                                        <button type="button" onClick={cancelEdit}>Annuler</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>Livre : {r.book.title}</div>
                                    <div>Date d'emprunt : {fmtDateISO(r.reservedAt)}</div>
                                    <div>Date de retour : {fmtDateISO(r.dueDate)}</div>
                                    <div>Personne : {r.reservedBy?.name ?? '—'}</div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <button type="button" onClick={() => startEdit(r)}>Modifier</button>
                                        <button type="button" onClick={() => deleteResa(r.id)}>Supprimer</button>
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
