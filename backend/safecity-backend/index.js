//backend/safecity-backend/index.js


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rotte utenti
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Rotte tipi emergenza
const emergencyTypesRoutes = require('./routes/emergencyTypesRoutes');
app.use('/api/emergency-types', emergencyTypesRoutes);

// Rotte segnalazioni emergenza
const emergenciesRoutes = require('./routes/emergencies');
app.use('/api/emergencies', emergenciesRoutes);
app.use('/api/comments', require('./routes/comments'));

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});



