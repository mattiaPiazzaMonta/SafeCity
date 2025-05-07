// backend/safecity-backend/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotte
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server attivo su http://localhost:${port}`);
});

