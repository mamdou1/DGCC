const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document_pieces', {
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'documents',
        key: 'id'
      }
    },
    piece_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'pieces',
        key: 'id'
      }
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'document_pieces',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "document_id" },
          { name: "piece_id" },
        ]
      },
      {
        name: "fk_dp_piece",
        using: "BTREE",
        fields: [
          { name: "piece_id" },
        ]
      },
    ]
  });
};
