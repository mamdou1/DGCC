// dgcc_models/index.js
const initModels = require("./init-models");
const dgccSequelize = require("../config/dgcc.database");

// Initialiser tous les modèles avec la connexion
const models = initModels(dgccSequelize);

module.exports = models;
