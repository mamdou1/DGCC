module.exports = (sequelize, DataTypes) => {
  const Etagere = sequelize.define(
    "Etagere",
    {
      code_etagere: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "etagere",
      timestamps: true,
      underscored: true,
    },
  );

  return Etagere;
};
