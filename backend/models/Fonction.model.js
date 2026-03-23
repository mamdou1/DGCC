// models/fonction.js
module.exports = (sequelize, DataTypes) => {
  const Fonction = sequelize.define(
    "Fonction",
    {
      libelle: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "Fonctions", underscored: true },
  );

  Fonction.associate = (models) => {
    Fonction.hasMany(models.Agent, { foreignKey: "fonction_id", as: "agents" });
    Fonction.belongsTo(models.Direction, {
      foreignKey: "direction_id",
      as: "direction",
    });
    Fonction.belongsTo(models.SousDirection, {
      foreignKey: "sous_direction_id",
      as: "sousDirection",
    });
    Fonction.belongsTo(models.Division, {
      foreignKey: "division_id",
      as: "division",
    });
    Fonction.belongsTo(models.Section, {
      foreignKey: "section_id",
      as: "section",
    });
    Fonction.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "service",
    });
  };
  return Fonction;
};
