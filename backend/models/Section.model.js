module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define(
    "Section",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce code section existe déjà" },
        validate: {
          notNull: { msg: "Le code est requis" },
          notEmpty: { msg: "Le code ne peut pas être vide" },
          len: { args: [2, 20], msg: "Le code doit faire entre 2 et 20 caractères" },
          is: { args: /^SEC-\d{3}$/i, msg: "Format attendu : SEC-001" },
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
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "La division est requise" },
          isInt: { msg: "division_id doit être un nombre entier" },
          async isValidDivision(value) {
            const division = await sequelize.models.Division.findByPk(value);
            if (!division) throw new Error("La division spécifiée n'existe pas");
          },
        },
      },
    },
    {
      tableName: "sections",
      underscored: true,
      timestamps: true,
    },
  );

  Section.associate = (models) => {
    Section.belongsTo(models.Division, {
      foreignKey: "division_id",
      as: "division",
    });
    Section.hasMany(models.Fonction, {
      foreignKey: "section_id",
      as: "fonctions",
    });
    Section.hasMany(models.TypeDocument, {
      foreignKey: "section_id",
      as: "typeDocuments",
    });
  };

  return Section;
};