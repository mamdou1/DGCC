module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define(
    "Division",
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
      tableName: "divisions",
      underscored: true,
      timestamps: true,
    },
  );

  Division.associate = (models) => {
    Division.belongsTo(models.SousDirection, {
      foreignKey: "sous_direction_id",
      as: "sousDirection",
    });
    Division.hasMany(models.Section, {
      foreignKey: "division_id",
      as: "sections",
    });
    Division.hasMany(models.Fonction, {
      foreignKey: "division_id",
      as: "fonctions",
    });
    Division.hasMany(models.TypeDocument, {
      foreignKey: "division_id",
      as: "typeDocuments",
    });
  };

  return Division;
};
