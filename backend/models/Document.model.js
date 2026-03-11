module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define(
    "Document",
    {
      type_document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: "documents", timestamps: true, underscored: true },
  );

  Document.associate = (models) => {
    Document.belongsTo(models.TypeDocument, {
      foreignKey: "type_document_id",
      as: "typeDocument",
    });
    Document.hasMany(models.DocumentValue, {
      foreignKey: "document_id",
      as: "values",
    });

    Document.belongsToMany(models.Pieces, {
      through: models.DocumentPieces,
      foreignKey: "document_id",
      otherKey: "piece_id",
      as: "pieces",
    });

    Document.hasMany(models.DocumentFichier, {
      foreignKey: "document_id",
      as: "documentFichiers",
    });
  };

  return Document;
};
