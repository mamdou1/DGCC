const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "documents",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      type_document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "typedocuments",
          key: "id",
        },
      },
      box_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "box",
          key: "id",
        },
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
      tableName: "documents",
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
          name: "type_document_id",
          using: "BTREE",
          fields: [{ name: "type_document_id" }],
        },
        {
          name: "box_id",
          using: "BTREE",
          fields: [{ name: "box_id" }],
        },
      ],
    },
  );
};
