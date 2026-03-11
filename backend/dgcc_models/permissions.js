const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permissions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    resource: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'permissions',
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
        name: "unique_permission",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "resource" },
          { name: "action" },
        ]
      },
      {
        name: "permissions_resource_action",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "resource" },
          { name: "action" },
        ]
      },
    ]
  });
};
