module.exports = (sequelize, DataTypes) => {
  const SousDirection = sequelize.define(
    "SousDirection",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce code sous-direction existe déjà" },
        validate: {
          notNull: { msg: "Le code est requis" },
          notEmpty: { msg: "Le code ne peut pas être vide" },
          len: { args: [2, 20], msg: "Le code doit faire entre 2 et 20 caractères" },
          is: { args: /^SD-\d{3}$/i, msg: "Format attendu : SD-001" },
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
      direction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "La direction est requise" },
          isInt: { msg: "direction_id doit être un nombre entier" },
          async isValidDirection(value) {
            const direction = await sequelize.models.Direction.findByPk(value);
            if (!direction) throw new Error("La direction spécifiée n'existe pas");
          },
        },
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