// models/ index.js

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config').development;

// Connessione
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

// Importa modelli
const User = require('./User')(sequelize, DataTypes);
const emergency_types = require('./emergency_types')(sequelize, DataTypes);
const emergencies = require('./emergencies')(sequelize, DataTypes);
const comments = require('./comments')(sequelize, DataTypes);


// Raccolta modelli in un oggetto db
const db = {
  sequelize,
  Sequelize,
  User,
  emergency_types,
  emergencies,
  comments
};


Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});


module.exports = db;
