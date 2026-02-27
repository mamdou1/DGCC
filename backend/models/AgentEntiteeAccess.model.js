// models/agentEntiteeAccess.js
module.exports = (sequelize, DataTypes) => {
  const AgentEntiteeAccess = sequelize.define(
    "AgentEntiteeAccess",
    {
      // On garde les anciennes
      entitee_un_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      entitee_deux_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      entitee_trois_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
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

    // Anciennes associations
    AgentEntiteeAccess.belongsTo(models.EntiteeUn, {
      foreignKey: "entitee_un_id",
      as: "entitee_un",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.EntiteeDeux, {
      foreignKey: "entitee_deux_id",
      as: "entitee_deux",
      allowNull: true,
    });

    AgentEntiteeAccess.belongsTo(models.EntiteeTrois, {
      foreignKey: "entitee_trois_id",
      as: "entitee_trois",
      allowNull: true,
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
