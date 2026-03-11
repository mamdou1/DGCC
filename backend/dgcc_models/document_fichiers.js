const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "document_fichiers",
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
        allowNull: true,
        references: {
          model: "pieces",
          key: "id",
        },
      },
      piece_value_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "piece_values",
          key: "id",
        },
      },
      fichier: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mode: {
        type: DataTypes.ENUM("INDIVIDUEL", "LOT_UNIQUE"),
        allowNull: false,
        defaultValue: "INDIVIDUEL",
      },
      new_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      document_value_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "documentvalues",
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
      tableName: "document_fichiers",
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
          name: "fk_df_document",
          using: "BTREE",
          fields: [{ name: "document_id" }],
        },
        {
          name: "fk_df_piece",
          using: "BTREE",
          fields: [{ name: "piece_id" }],
        },
        {
          name: "idx_document_fichiers_piece_value_id",
          using: "BTREE",
          fields: [{ name: "piece_value_id" }],
        },
        {
          name: "document_value_documentvalues",
          using: "BTREE",
          fields: [{ name: "document_value_id" }],
        },
      ],
    },
  );
};
