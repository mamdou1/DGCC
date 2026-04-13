module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce code service existe déjà" },
        validate: {
          notNull: { msg: "Le code est requis" },
          notEmpty: { msg: "Le code ne peut pas être vide" },
          len: { args: [2, 20], msg: "Le code doit faire entre 2 et 20 caractères" },
          is: { args: /^SERV-\d{3}$/i, msg: "Format attendu : SERV-001" },
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
      tableName: "services",
      underscored: true,
      timestamps: true,
    },
  );

  Service.associate = (models) => {
    Service.belongsTo(models.Direction, {
      foreignKey: "direction_id",
      as: "direction",
    });
    Service.hasMany(models.Fonction, {
      foreignKey: "service_id",
      as: "fonctions",
    });
    Service.hasMany(models.TypeDocument, {
      foreignKey: "service_id",
      as: "typeDocuments",
    });
  };

  return Service;
};