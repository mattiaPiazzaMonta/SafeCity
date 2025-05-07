// backend/safecity-backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body } = require('express-validator');

// POST /register
router.post(
  '/register',
  [
    body('nome').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  userController.register
);

// POST /login
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  userController.login
);

module.exports = router;
