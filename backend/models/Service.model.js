// models/Service.model.js
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "Service",
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
