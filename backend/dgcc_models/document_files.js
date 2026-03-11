const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document_files', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mimetype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id'
      }
    },
    document_value_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentvalues',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'document_files',
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
        name: "document_files_ibfk_3",
        using: "BTREE",
        fields: [
          { name: "document_id" },
        ]
      },
      {
        name: "document_files_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "document_value_id" },
        ]
      },
    ]
  });
};
