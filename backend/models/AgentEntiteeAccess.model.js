// models/agentEntiteeAccess.js
module.exports = (sequelize, DataTypes) => {
  const AgentEntiteeAccess = sequelize.define(
    "AgentEntiteeAccess",
    {
      // ✅ AJOUTER LES NOUVELLES COLONNES
      direction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sous_direction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      division_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      section_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      service_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "agent_entitee_access",
      timestamps: true,
      underscored: true,
    },
  );

  AgentEntiteeAccess.associate = (models) => {
    AgentEntiteeAccess.belongsTo(models.Agent, {
      foreignKey: "agent_id",
      as: "agent",
    });

    // ✅ AJOUTER LES NOUVELLES ASSOCIATIONS
    AgentEntiteeAccess.belongsTo(models.Direction, {
      foreignKey: "direction_id",
      as: "direction",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.SousDirection, {
      foreignKey: "sous_direction_id",
      as: "sousDirection",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.Division, {
      foreignKey: "division_id",
      as: "division",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.Section, {
      foreignKey: "section_id",
      as: "section",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.Service, {
      foreignKey: "service_id",
      as: "service",
      allowNull: true,
    });
  };

  return AgentEntiteeAccess;
};
