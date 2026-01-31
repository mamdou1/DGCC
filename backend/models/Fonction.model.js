// models/fonction.js
module.exports = (sequelize, DataTypes) => {
  const Fonction = sequelize.define(
    "Fonction",
    {
      libelle: { type: DataTypes.STRING, allowNull: false },
      service_id: { type: DataTypes.INTEGER, allowNull: true },
      division_id: { type: DataTypes.INTEGER, allowNull: true },
      section_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "Fonctions", underscored: true },
  );

  Fonction.associate = (models) => {
    Fonction.belongsTo(models.Service, { foreignKey: "service_id" });
    Fonction.belongsTo(models.Division, { foreignKey: "division_id" });
    Fonction.belongsTo(models.Section, { foreignKey: "section_id" });
    Fonction.hasMany(models.Agent, { foreignKey: "fonction_id", as: "agents" });
    Fonction.belongsTo(models.EntiteeUn, {
      foreignKey: "entitee_un_id",
      as: "entitee_un",
    });
    Fonction.belongsTo(models.EntiteeDeux, {
      foreignKey: "entitee_deux_id",
      as: "entitee_deux",
    });
    Fonction.belongsTo(models.EntiteeTrois, {
      foreignKey: "entitee_trois_id",
      as: "entitee_trois",
    });
  };
  return Fonction;
};
