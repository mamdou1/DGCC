module.exports = (sequelize, DataTypes) => {
  const TypeDocument = sequelize.define(
    "TypeDocument",
    {
      id: {
        // ✅ AJOUTEZ CETTE LIGNE - Définir une clé primaire
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: DataTypes.STRING,
      nom: DataTypes.STRING,

      direction_id: DataTypes.INTEGER,
      service_id: DataTypes.INTEGER,
      sous_direction_id: DataTypes.INTEGER,
      division_id: DataTypes.INTEGER,
      section_id: DataTypes.INTEGER,
    },
    {
      tableName: "typedocuments", // 👈 correspond exactement au nom réel de la table timestamps: false,
      timestamps: true,
      underscored: true,
    },
  );

  TypeDocument.associate = (models) => {
    TypeDocument.hasMany(models.MetaField, {
      foreignKey: "type_document_id",
      as: "metaFields",
    });
    TypeDocument.hasMany(models.Document, {
      foreignKey: "type_document_id",
      as: "documents",
    });

    TypeDocument.belongsToMany(models.Pieces, {
      through: models.TypeDocumentPieces,
      foreignKey: "document_type_id",
      otherKey: "piece_id",
      as: "pieces",
    });

    TypeDocument.belongsTo(models.Direction, {
      foreignKey: "direction_id",
      as: "direction",
    });
    TypeDocument.belongsTo(models.SousDirection, {
      foreignKey: "sous_direction_id",
      as: "sousDirection",
    });
    TypeDocument.belongsTo(models.Division, {
      foreignKey: "division_id",
      as: "division",
    });
    TypeDocument.belongsTo(models.Section, {
      foreignKey: "section_id",
      as: "section",
    });
    TypeDocument.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "service",
    });
  };

  return TypeDocument;
};
