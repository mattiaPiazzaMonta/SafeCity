// components/commentsform.jsx

import React, { useState, useEffect, useRef } from 'react';
import './CommentsForm.css';

function CommentsForm({ emergency, onClose, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fileInputRef = useRef();

  // Carica i commenti dal backend
  useEffect(() => {
    if (!emergency) return;
    setLoading(true);
    fetch(`/api/comments?emergency_id=${emergency.id}`)
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setErr('Errore caricamento commenti');
        setLoading(false);
      });
  }, [emergency]);

  // Preview immagini selezionate
  useEffect(() => {
    if (!photos.length) {
      setPreviewUrls([]);
      return;
    }
    const urls = [];
    for (let f of photos) urls.push(URL.createObjectURL(f));
    setPreviewUrls(urls);
    // Pulizia URL oggetti
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [photos]);

  // Invio nuovo commento
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const formData = new FormData();
      formData.append('emergency_id', emergency.id);
      formData.append('user_id', user?.id || 1); // se non loggato
      formData.append('text', text);
      for (let i = 0; i < photos.length; i++) {
        formData.append('photos', photos[i]);
      }
      const res = await fetch('/api/comments', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Errore nell\'invio commento');
      setText('');
      setPhotos([]);
      fileInputRef.current.value = ''; // reset file
      // Ricarica commenti
      const data = await res.json();
      setComments([data, ...comments]);
      setLoading(false);
    } catch (e) {
      setErr(e.message || 'Errore invio');
      setLoading(false);
    }
  }

  function handleFilesChange(e) {
    setPhotos(Array.from(e.target.files));
  }

  return (
    <div className="comments-modal">
      <h3>Commenti su: <span style={{color:'#1555a1'}}>{emergency.type?.label || "Emergenza"}</span></h3>
      <button onClick={onClose} style={{
        position: 'absolute', right: 24, top: 18, background: 'transparent',
        border: 'none', fontSize: 24, cursor: 'pointer'
      }}>&times;</button>
      {loading && <p>Caricamento...</p>}
      {err && <p style={{color:'red'}}>{err}</p>}

      <ul className="comments-list">
        {comments.length === 0 && !loading && <li>Nessun commento.</li>}
        {comments.map(c => (
          <li key={c.id} className="comment-item">
            <div>
              <span className="comment-author">{c.user?.nome || "Utente"}</span>
              <span className="comment-date">{c.created_at && new Date(c.created_at).toLocaleString()}</span>
            </div>
            <div>{c.text}</div>
            {Array.isArray(c.photos) && c.photos.length > 0 && (
              <div className="comment-photos">
                {c.photos.map((url, idx) => (
                  <img src={url} alt={`foto${idx+1}`} key={idx} className="comment-photo-thumb" />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      
      <form className="add-comment-form" onSubmit={handleSubmit}>
        <label>Lascia un commento:</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          required
          placeholder="Scrivi qui il tuo commento..."
        />
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFilesChange}
        />
        {previewUrls.length > 0 && (
          <div className="comment-photos">
            {previewUrls.map((url, idx) => (
              <img src={url} alt={`preview${idx+1}`} key={idx} className="comment-photo-thumb" />
            ))}
          </div>
        )}
        <button type="submit" disabled={loading || !text.trim()}>Invia</button>
      </form>
    </div>
  );
}

export default CommentsForm;