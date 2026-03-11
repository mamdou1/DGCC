const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('metafields', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    field_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type_document_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'typedocuments',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'metafields',
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
        name: "type_document_id",
        using: "BTREE",
        fields: [
          { name: "type_document_id" },
        ]
      },
    ]
  });
};
