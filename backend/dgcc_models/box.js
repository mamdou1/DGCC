const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('box', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type_document_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'typedocuments',
        key: 'id'
      }
    },
    code_box: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    libelle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    capacite_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 10
    },
    current_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    trave_id: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'box',
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
        name: "fk_box_entitee_un",
        using: "BTREE",
        fields: [
          { name: "entitee_un_id" },
        ]
      },
      {
        name: "fk_box_entitee_deux",
        using: "BTREE",
        fields: [
          { name: "entitee_deux_id" },
        ]
      },
      {
        name: "fk_box_entitee_trois",
        using: "BTREE",
        fields: [
          { name: "entitee_trois_id" },
        ]
      },
      {
        name: "box_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "type_document_id" },
        ]
      },
    ]
  });
};
