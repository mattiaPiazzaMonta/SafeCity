// backend/safecity-backend/routes/emergencyTypesRoutes.js

const express = require('express');
const router = express.Router();

const { emergency_types } = require('../models'); 

// GET /api/emergency-types
router.get('/', async (req, res) => {
  try {
    const types = await emergency_types.findAll({
      attributes: ['id', 'label', 'icon_path'],
      order: [['id', 'ASC']]
    });
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero tipi emergenza' });
  }
});

module.exports = router;
