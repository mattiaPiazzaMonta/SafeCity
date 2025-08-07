// backend/safecity-backend/models/emergency_types.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const emergency_types = sequelize.define('emergency_types', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon_path: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'emergency_types',
    timestamps: false
  });

  return emergency_types;
};
