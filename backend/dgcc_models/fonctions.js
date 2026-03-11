const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fonctions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    entitee_un_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_un',
        key: 'id'
      }
    },
    entitee_deux_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_deux',
        key: 'id'
      }
    },
    entitee_trois_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_trois',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'fonctions',
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
        name: "entitee_un_id",
        using: "BTREE",
        fields: [
          { name: "entitee_un_id" },
        ]
      },
      {
        name: "entitee_deux_id",
        using: "BTREE",
        fields: [
          { name: "entitee_deux_id" },
        ]
      },
      {
        name: "entitee_trois_id",
        using: "BTREE",
        fields: [
          { name: "entitee_trois_id" },
        ]
      },
    ]
  });
};
