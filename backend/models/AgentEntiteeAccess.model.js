module.exports = (sequelize, DataTypes) => {
  const AgentEntiteeAccess = sequelize.define(
    "AgentEntiteeAccess",
    {
      entitee_type: {
        type: DataTypes.ENUM("UN", "DEUX", "TROIS"),
        allowNull: false,
      },
      entitee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "agent_entitee_access",
      timestamps: true,
      underscored: true,
    },
  );

  AgentEntiteeAccess.associate = (models) => {
    AgentEntiteeAccess.belongsTo(models.Agent, { foreignKey: "agent_id" });
  };

  return AgentEntiteeAccess;
};
