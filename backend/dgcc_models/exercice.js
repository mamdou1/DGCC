const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exercice', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    annee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "annee_6"
    }
  }, {
    sequelize,
    tableName: 'exercice',
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
        name: "annee",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
      {
        name: "annee_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
      {
        name: "annee_3",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
      {
        name: "annee_4",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
      {
        name: "annee_5",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
      {
        name: "annee_6",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "annee" },
        ]
      },
    ]
  });
};
