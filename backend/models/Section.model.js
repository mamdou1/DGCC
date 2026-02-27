module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Section",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "sections",
      underscored: true,
      timestamps: true,
    },
  );

  Section.associate = (models) => {
    Section.belongsTo(models.Division, {
      foreignKey: "division_id",
      as: "division",
    });
    Section.hasMany(models.Fonction, {
      foreignKey: "section_id",
      as: "fonctions",
    });
    Section.hasMany(models.TypeDocument, {
      foreignKey: "section_id",
      as: "typeDocuments",
    });
  };

  return Section;
};
