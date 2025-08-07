// backend/safecity-backend/routes/comments.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { comments, User } = require('../models');

// Cartella dove salvare le immagini dei commenti
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'comment-photos');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // filename: comment-<timestamp>-<rand>.ext
    cb(null, `comment-${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`);
  }
});
const upload = multer({ storage });

// GET: tutti i commenti per una emergenza
router.get('/', async (req, res) => {
  const { emergency_id } = req.query;
  if (!emergency_id) return res.status(400).json({ error: "emergency_id richiesto" });
  try {
    const comms = await comments.findAll({
      where: { emergency_id },
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id','nome','cognome','username'] }]
    });
    
    const baseUrl = '/uploads/comment-photos/';
    const mapped = comms.map(c => {
      const obj = c.toJSON();
      obj.photos = Array.isArray(obj.photos)
        ? obj.photos.map(p => baseUrl + path.basename(p)) : [];
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Errore caricamento commenti', details: err.message });
  }
});

// POST: aggiungi nuovo commento (con supporto multi foto)
router.post('/', upload.array('photos', 8), async (req, res) => {
  const { emergency_id, user_id, text } = req.body;
  if (!emergency_id || !user_id || !text) {
    return res.status(400).json({ error: "Dati mancanti" });
  }
  try {
    // Costruisce array dei path delle immagini caricate
    const photoPaths = req.files ? req.files.map(f =>
      `/uploads/comment-photos/${f.filename}`) : [];
    const newComment = await comments.create({
      emergency_id,
      user_id,
      text,
      photos: photoPaths,
      created_at: new Date()
    });
    // Include user info per risposta immediata frontend
    const user = await User.findByPk(user_id);
    const obj = newComment.toJSON();
    obj.user = user ? { id: user.id, nome: user.nome, username: user.username } : {};
    res.status(201).json(obj);
  } catch (err) {
    res.status(500).json({ error: 'Errore creazione commento', details: err.message });
  }
});

module.exports = router;