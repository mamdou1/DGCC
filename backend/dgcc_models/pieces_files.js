const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pieces_files', {
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
      allowNull: false
    },
    pieces_value_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'piece_values',
        key: 'id'
      }
    },
    pieces_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pieces',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'pieces_files',
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
        name: "pieces_value_id",
        using: "BTREE",
        fields: [
          { name: "pieces_value_id" },
        ]
      },
      {
        name: "pieces_id",
        using: "BTREE",
        fields: [
          { name: "pieces_id" },
        ]
      },
    ]
  });
};
