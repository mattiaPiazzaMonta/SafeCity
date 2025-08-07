'use strict';
module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    emergency_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    text: { 
      type: DataTypes.TEXT,
      allowNull: false
    },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'comments',
    timestamps: false 
  });

  // Relazioni
  comments.associate = function(models) {
    comments.belongsTo(models.emergencies, { foreignKey: 'emergency_id', as: 'emergency' });
    comments.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return comments;
};
