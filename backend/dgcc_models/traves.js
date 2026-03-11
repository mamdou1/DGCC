const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traves', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rayon_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rayons',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'traves',
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
        name: "fk_trave_rayon",
        using: "BTREE",
        fields: [
          { name: "rayon_id" },
        ]
      },
    ]
  });
};
