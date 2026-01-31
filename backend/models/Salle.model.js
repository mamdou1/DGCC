module.exports = (sequelize, DataTypes) => {
  const Salle = sequelize.define(
    "Salle",
    {
      code_salle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "salle",
      timestamps: true,
      underscored: true,
    },
  );

  return Salle;
};
