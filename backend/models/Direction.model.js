module.exports = (sequelize, DataTypes) => {
  const Direction = sequelize.define(
    "Direction",
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
      tableName: "directions",
      underscored: true,
      timestamps: true,
    },
  );

  Direction.associate = (models) => {
    Direction.hasMany(models.SousDirection, {
      foreignKey: "direction_id",
      as: "sousDirections",
    });
    Direction.hasMany(models.Service, {
      foreignKey: "direction_id",
      as: "services",
    });
    Direction.hasMany(models.Fonction, {
      foreignKey: "direction_id",
      as: "fonctions",
    });
    Direction.hasMany(models.TypeDocument, {
      foreignKey: "direction_id",
      as: "typeDocuments",
    });
  };

  return Direction;
};
