module.exports = (sequelize, DataTypes) => {
  const Box = sequelize.define(
    "Box",
    {
      code_box: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      libelle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "box",
      timestamps: true,
      underscored: true,
    },
  );

  return Box;
};
