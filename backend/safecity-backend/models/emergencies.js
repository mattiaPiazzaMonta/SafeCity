// backend/safecity-backend/models/emergencies.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const emergencies = sequelize.define('emergencies', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emergency_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'attiva'
    },
    location: {
      type: DataTypes.GEOGRAPHY('POINT', 4326),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'emergencies',
    timestamps: false 
  });

  emergencies.associate = function(models) {
    // Relazione con tipi di emergenza
    emergencies.belongsTo(models.emergency_types, { foreignKey: 'emergency_type_id', as: 'type' });
    // Relazione con utente
    emergencies.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return emergencies;
};
