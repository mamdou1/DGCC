const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "pieces",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      code_pieces: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "code_pieces",
      },
      libelle: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: "libelle",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      sequelize,
      tableName: "pieces",
      createdAt: "created_at", // ← AJOUTEZ CECI
      updatedAt: "updated_at",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "code_pieces",
          unique: true,
          using: "BTREE",
          fields: [{ name: "code_pieces" }],
        },
        {
          name: "libelle",
          unique: true,
          using: "BTREE",
          fields: [{ name: "libelle" }],
        },
      ],
    },
  );
};
