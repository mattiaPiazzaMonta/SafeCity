// backend/safecity-backend/routes/emergencies.js

const express = require('express');
const router = express.Router();
const { emergencies, emergency_types } = require('../models');
const { Op } = require('sequelize'); 

// POST /api/emergencies
router.post('/', async (req, res) => {
  try {
    const { user_id, typeId, description, lat, lng } = req.body;
    if (!user_id || !typeId || !lat || !lng) {
      return res.status(400).json({ error: "Dati mancanti" });
    }
    const newEmergency = await emergencies.create({
      user_id,
      emergency_type_id: typeId,
      description,
      status: 'attiva',
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      created_at: new Date()
    });
    res.status(201).json(newEmergency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore durante la creazione della segnalazione' });
  }
});

// GET /api/emergencies
router.get('/', async (req, res) => {
  try {
    // tutte le emergenze, join con emergency_types
    const all = await emergencies.findAll({
      include: [{
        model: emergency_types,
        as: 'type',
        attributes: ['label', 'icon_path']
      }]
    });
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero emergenze' });
  }
});

// DELETE /api/emergencies/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await emergencies.destroy({ where: { id } });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Segnalazione non trovata' });
    }
    res.status(200).json({ message: 'Segnalazione cancellata' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella cancellazione della segnalazione' });
  }
});


// POST /api/emergencies/filter-emergencies per filtri
router.post('/filter-emergencies', async (req, res) => {
  try {
    const { selectedType } = req.body;  // Solo il tipo di emergenza

    console.log("Filtri ricevuti dal frontend:", { selectedType });

    // Filtra solo in base al tipo di emergenza
    const filteredEmergencies = await emergencies.findAll({
      where: {
        emergency_type_id: selectedType  // Filtro solo per tipo
      },
      include: [{
        model: emergency_types,
        as: 'type',
        attributes: ['label', 'icon_path']
      }]
    });

    res.json(filteredEmergencies); // Restituisce le emergenze filtrate
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero emergenze filtrate' });
  }
});

module.exports = router;

