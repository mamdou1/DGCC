const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    num_matricule: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "email_5"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "telephone_6"
    },
    code_verification: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_code_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_verified_for_reset: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    photo_profil: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    enregistrer_par: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'agent',
        key: 'id'
      }
    },
    droit_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'droit',
        key: 'id'
      }
    },
    fonction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fonctions',
        key: 'id'
      }
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "username_2"
    },
    is_on_line: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    last_activity: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agent',
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
        name: "telephone",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "telephone_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "email_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "telephone_3",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "email_3",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "telephone_4",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "email_4",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "telephone_5",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "username",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "email_5",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "telephone_6",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "telephone" },
        ]
      },
      {
        name: "username_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "username" },
        ]
      },
      {
        name: "enregistrer_par",
        using: "BTREE",
        fields: [
          { name: "enregistrer_par" },
        ]
      },
      {
        name: "fk_agent_droit",
        using: "BTREE",
        fields: [
          { name: "droit_id" },
        ]
      },
      {
        name: "fk_agent_fonction",
        using: "BTREE",
        fields: [
          { name: "fonction_id" },
        ]
      },
    ]
  });
};
