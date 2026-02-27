module.exports = (sequelize, DataTypes) => {
  const SousDirection = sequelize.define(
    "SousDirection",
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
      tableName: "sous_directions",
      underscored: true,
      timestamps: true,
    },
  );

  SousDirection.associate = (models) => {
    SousDirection.belongsTo(models.Direction, {
      foreignKey: "direction_id",
      as: "direction",
    });
    SousDirection.hasMany(models.Division, {
      foreignKey: "sous_direction_id",
      as: "divisions",
    });
    SousDirection.hasMany(models.Fonction, {
      foreignKey: "sous_direction_id",
      as: "fonctions",
    });
    SousDirection.hasMany(models.TypeDocument, {
      foreignKey: "sous_direction_id",
      as: "typeDocuments",
    });
  };

  return SousDirection;
};
