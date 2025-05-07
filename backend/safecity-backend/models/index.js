const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config').development;

// Connessione corretta con i nomi GIUSTI
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

// Importa modello
const User = require('./User')(sequelize, DataTypes);

// Esporta tutto
module.exports = {
  sequelize,
  User
};

