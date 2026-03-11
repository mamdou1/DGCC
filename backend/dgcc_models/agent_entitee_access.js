const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent_entitee_access', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'agent',
        key: 'id'
      }
    },
    entitee_un_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_un',
        key: 'id'
      }
    },
    entitee_deux_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_deux',
        key: 'id'
      }
    },
    entitee_trois_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entitee_trois',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'agent_entitee_access',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_agent",
        using: "BTREE",
        fields: [
          { name: "agent_id" },
        ]
      },
      {
        name: "fk_agent_access_entitee_un",
        using: "BTREE",
        fields: [
          { name: "entitee_un_id" },
        ]
      },
      {
        name: "fk_agent_access_entitee_deux",
        using: "BTREE",
        fields: [
          { name: "entitee_deux_id" },
        ]
      },
      {
        name: "fk_agent_access_entitee_trois",
        using: "BTREE",
        fields: [
          { name: "entitee_trois_id" },
        ]
      },
    ]
  });
};
