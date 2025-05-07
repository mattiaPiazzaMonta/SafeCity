// backend/safecity-backend/models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cognome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    punteggio: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    data_registrazione: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  return User;
};

