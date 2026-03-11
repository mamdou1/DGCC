const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "typedocuments",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      nom: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      entitee_un_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "entitee_un",
          key: "id",
        },
      },
      entitee_deux_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "entitee_deux",
          key: "id",
        },
      },
      entitee_trois_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "entitee_trois",
          key: "id",
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
    },
    {
      sequelize,
      tableName: "typedocuments",
      timestamps: true,
      createdAt: "created_at", // ← AJOUTEZ CECI
      updatedAt: "updated_at",
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "entitee_un_id",
          using: "BTREE",
          fields: [{ name: "entitee_un_id" }],
        },
        {
          name: "entitee_deux_id",
          using: "BTREE",
          fields: [{ name: "entitee_deux_id" }],
        },
        {
          name: "entitee_trois_id",
          using: "BTREE",
          fields: [{ name: "entitee_trois_id" }],
        },
      ],
    },
  );
};
