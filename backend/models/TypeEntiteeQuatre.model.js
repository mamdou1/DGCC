module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "TypeDocumentEntiteQuatre",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    },
    { tableName: "td_entitee_quatre", underscored: true },
  );
};
