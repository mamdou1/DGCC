// models/fonction.js
module.exports = (sequelize, DataTypes) => {
  const Fonction = sequelize.define(
    "Fonction",
    {
      libelle: { type: DataTypes.STRING, allowNull: false },
      entitee_un_id: { type: DataTypes.INTEGER, allowNull: true },
      entitee_deux_id: { type: DataTypes.INTEGER, allowNull: true },
      entitee_trois_id: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "Fonctions", underscored: true },
  );

  Fonction.associate = (models) => {
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

    // Fonction.belongsTo(models.EntiteeQuatre, {
    //   foreignKey: "entitee_quatre_id",
    //   as: "entitee_quatre",
    // });

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
