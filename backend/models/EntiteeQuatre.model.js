// models/EntiteeQuatre.model.js
module.exports = (sequelize, DataTypes) => {
  const EntiteeQuatre = sequelize.define(
    "EntiteeQuatre",
    {
      titre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "entitee_quatre",
      underscored: true,
      timestamps: true,
    },
  );

  EntiteeQuatre.associate = (models) => {
    EntiteeQuatre.belongsTo(models.EntiteeTrois, {
      foreignKey: "entitee_trois_id",
      as: "entitee_trois",
    });

    EntiteeQuatre.hasMany(models.Fonction, {
      foreignKey: "entitee_quatre_id",
      as: "fonctions",
    });
  };

  return EntiteeQuatre;
};
