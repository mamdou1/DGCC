const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('salles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code_salle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    site_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sites',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'salles',
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
        name: "site_id",
        using: "BTREE",
        fields: [
          { name: "site_id" },
        ]
      },
    ]
  });
};
