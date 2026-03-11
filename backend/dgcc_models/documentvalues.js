const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "documentvalues",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta_field_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "metafields",
          key: "id",
        },
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "documents",
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
      tableName: "documentvalues",
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
          name: "meta_field_id",
          using: "BTREE",
          fields: [{ name: "meta_field_id" }],
        },
        {
          name: "document_id",
          using: "BTREE",
          fields: [{ name: "document_id" }],
        },
      ],
    },
  );
};
