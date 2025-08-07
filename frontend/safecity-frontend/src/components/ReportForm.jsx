// src/components/ReportForm.jsx

import React, { useState, useEffect } from 'react';

function ReportForm({ position, onClose }) {
  const [types, setTypes] = useState([]);
  const [typeId, setTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/emergency-types')
      .then(res => res.json())
      .then(data => {
        setTypes(data);
        setLoading(false);
      })
      .catch(() => {
        setErr('Errore nel caricamento tipi emergenza.');
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr('');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      setErr("Utente non autenticato.");
      setSubmitting(false);
      return;
    }
    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          typeId,
          description,
          lat: position[0],
          lng: position[1]
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore invio segnalazione');
      }
      onClose();
      alert("Segnalazione inviata!");
    } catch (error) {
      setErr(error.message);
    }
    setSubmitting(false);
  }

  if (loading) return <div className="report-form-modal"><p>Caricamento tipi emergenza...</p></div>;
  if (err) return <div className="report-form-modal"><p>{err}</p></div>;

  return (
    <div className="report-form-modal">
      <h3>Nuova segnalazione</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Tipo emergenza:
          <select value={typeId} onChange={e => setTypeId(e.target.value)} required>
            <option value="" disabled>Seleziona il tipo...</option>
            {types.map(t => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Descrizione:
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>
        <label>
          Coordinate:
          <input type="text" value={`${position[0]}, ${position[1]}`} readOnly />
        </label>
        <button type="submit" disabled={!typeId || submitting}>Invia</button>
        <button type="button" onClick={onClose}>Annulla</button>
        {submitting && <p>Invio in corso...</p>}
      </form>
    </div>
  );
}

export default ReportForm;

