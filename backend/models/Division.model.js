module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define(
    "Division",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce code division existe déjà" },
        validate: {
          notNull: { msg: "Le code est requis" },
          notEmpty: { msg: "Le code ne peut pas être vide" },
          len: { args: [2, 20], msg: "Le code doit faire entre 2 et 20 caractères" },
          is: { args: /^DIV-\d{3}$/i, msg: "Format attendu : DIV-001 (insensible à la casse)" },
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
      sous_direction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "La sous-direction est requise" },
          isInt: { msg: "sous_direction_id doit être un nombre entier" },
          async isValidSousDirection(value) {
            const sousDirection = await sequelize.models.SousDirection.findByPk(value);
            if (!sousDirection) throw new Error("La sous-direction spécifiée n'existe pas");
          },
        },
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