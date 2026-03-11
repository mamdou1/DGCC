const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('entitee_deux', {
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
    entitee_un_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_un',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'entitee_deux',
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
    ]
  });
};
