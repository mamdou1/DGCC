const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entitee_trois', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    titre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entitee_deux_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_deux',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'entitee_trois',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "entitee_deux_id",
        using: "BTREE",
        fields: [
          { name: "entitee_deux_id" },
        ]
      },
    ]
  });
};
