const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "piece_values",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "documents",
          key: "id",
        },
      },
      piece_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "pieces",
          key: "id",
        },
      },
      piece_meta_field_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "piece_meta_fields",
          key: "id",
        },
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      row_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
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
      tableName: "piece_values",
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
          name: "unique_document_piece_meta_row",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "document_id" },
            { name: "piece_id" },
            { name: "piece_meta_field_id" },
            { name: "row_id" },
          ],
        },
        {
          name: "idx_piece_values_document_id",
          using: "BTREE",
          fields: [{ name: "document_id" }],
        },
        {
          name: "idx_piece_values_piece_id",
          using: "BTREE",
          fields: [{ name: "piece_id" }],
        },
        {
          name: "idx_piece_values_meta_field_id",
          using: "BTREE",
          fields: [{ name: "piece_meta_field_id" }],
        },
      ],
    },
  );
};
