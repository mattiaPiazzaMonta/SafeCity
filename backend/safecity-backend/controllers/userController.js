// backend/safecity-backend/controllers/userController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { nome, cognome, username, email, password } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email già registrata' });

    const userExists = await User.findOne({ where: { username } });
    if (userExists) return res.status(400).json({ error: 'Username già in uso' });

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ nome, cognome, username, email, password_hash });
    return res.status(201).json({ message: 'Registrazione completata', user: newUser });
  } catch (err) {
    return res.status(500).json({ error: 'Errore server', details: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Credenziali errate' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Credenziali errate' });

    //Genera token JWT
    const token = jwt.sign(
      { userId: user.id, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    //Risposta al frontend
    return res.json({
      message: 'Login effettuato',
      token,
      username: user.nome
    });
  } catch (err) {
    return res.status(500).json({ error: 'Errore server', details: err.message });
  }
};
