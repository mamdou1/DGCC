// models/section.js
module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Section",
    {
      code_section: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      libelle: { type: DataTypes.STRING, allowNull: false },
      division_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "sections", underscored: true },
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
  };
  return Section;
};
