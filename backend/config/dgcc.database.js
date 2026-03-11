// config/dgcc.database.js
const { Sequelize } = require("sequelize");

const dgccSequelize = new Sequelize(
  process.env.DGCC_DB_NAME,
  process.env.DGCC_DB_USER,
  process.env.DGCC_DB_PASSWORD,
  {
    host: process.env.DGCC_DB_HOST,
    dialect: "mysql",
    logging: console.log, // Activez les logs pour déboguer
  },
);

// Test de connexion
dgccSequelize
  .authenticate()
  .then(() => console.log("✅ Connexion à la base Document réussie"))
  .catch((err) => console.error("❌ Erreur connexion DGCC:", err));

module.exports = dgccSequelize;
