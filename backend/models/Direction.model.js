module.exports = (sequelize, DataTypes) => {
  const Direction = sequelize.define(
    "Direction",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce code direction existe déjà" },
        validate: {
          notNull: { msg: "Le code est requis" },
          notEmpty: { msg: "Le code ne peut pas être vide" },
          len: { args: [2, 20], msg: "Le code doit faire entre 2 et 20 caractères" },
          is: { args: /^[A-Z0-9-]+$/, msg: "Le code ne peut contenir que des lettres majuscules, chiffres et tirets" },
        },
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Le libellé est requis" },
          notEmpty: { msg: "Le libellé ne peut pas être vide" },
          len: { args: [3, 100], msg: "Le libellé doit faire entre 3 et 100 caractères" },
        },
      },
    },
    {
      tableName: "directions",
      underscored: true,
      timestamps: true,
    },
  );

  Direction.associate = (models) => {
    Direction.hasMany(models.SousDirection, { foreignKey: "direction_id", as: "sousDirections" });
    Direction.hasMany(models.Service, { foreignKey: "direction_id", as: "services" });
    Direction.hasMany(models.Fonction, { foreignKey: "direction_id", as: "fonctions" });
    Direction.hasMany(models.TypeDocument, { foreignKey: "direction_id", as: "typeDocuments" });
  };

  return Direction;
};