const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "pieces_fichiers",
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
      new_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mode: {
        type: DataTypes.ENUM("INDIVIDUEL", "LOT_UNIQUE"),
        allowNull: false,
        defaultValue: "INDIVIDUEL",
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
      tableName: "pieces_fichiers",
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
          name: "fk_pieces_fichiers_document",
          using: "BTREE",
          fields: [{ name: "document_id" }],
        },
        {
          name: "fk_pieces_fichiers_piece",
          using: "BTREE",
          fields: [{ name: "piece_id" }],
        },
        {
          name: "fk_pieces_fichiers_piece_value",
          using: "BTREE",
          fields: [{ name: "piece_value_id" }],
        },
      ],
    },
  );
};
