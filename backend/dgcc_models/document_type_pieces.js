const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document_type_pieces', {
    document_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'typedocuments',
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
    }
  }, {
    sequelize,
    tableName: 'document_type_pieces',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "document_type_id" },
          { name: "piece_id" },
        ]
      },
      {
        name: "fk_dtp_piece",
        using: "BTREE",
        fields: [
          { name: "piece_id" },
        ]
      },
    ]
  });
};
