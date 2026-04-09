const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

//dotenv.config();
const envFile = process.env.NODE_ENV === "docker" ? ".env.docker" : ".env";

require("dotenv").config({
  path: envFile,
});

const sequelize = require("./config/database");
//const historiqueLogger = require("./middlewares/historiqueLogger.middleware");
const { updateActivity } = require("./middlewares/updateActivity.middleware");
const { verifyToken } = require("./middlewares/auth.middleware");

// ✅ ICI (avant authenticate / sync)
require("./models");

const app = express();

// ✅ CORS EN PREMIER
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-audit",
      "x-sidebar-navigation", // ← AJOUTÉ
    ],
  }),
);

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// historique (optionnel)
//app.use(historiqueLogger);

// ✅ routes publiques AVANT verifyToken
app.use("/api/auth", require("./routes/auth.routes"));

// ✅ middleware auth après auth routes
app.use(verifyToken);
app.use(updateActivity);

// ✅ routes protégées
app.use("/api/exercices", require("./routes/exercice.routes"));
app.use("/api/statistiques", require("./routes/statistiques.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/pieces", require("./routes/Pieces.routes"));

app.use("/api/permissions", require("./routes/permission.routes"));
app.use("/api/droits", require("./routes/droit.routes"));
app.use("/api/droitPermission", require("./routes/droitPermission.routes"));

app.use("/api/fonctions", require("./routes/fonction.routes"));
app.use("/api/historique", require("./routes/historique.routes"));

app.use("/api/types-documents", require("./routes/typeDocument.routes"));
app.use("/api/meta-fields", require("./routes/metafield.routes"));
app.use("/api/documents", require("./routes/document.routes"));

app.use("/api/directions", require("./routes/direction.routes"));
app.use("/api/sous-directions", require("./routes/sousDirection.routes"));
app.use("/api/divisions", require("./routes/division.routes"));
app.use("/api/sections", require("./routes/section.routes"));
app.use("/api/services", require("./routes/service.routes"));

app.use("/api/agent-access", require("./routes/agentAccess.routes"));

app.use("/api/dgcc", require("./routes/dgcc.routes"));
app.use("/api/import", require("./routes/import.routes"));

app.use("/api", require("./routes/pieceMetaField.routes"));
app.use("/api", require("./routes/pieceValue.routes"));

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Connexion MySQL + lancement serveur
// 2️⃣ Connexion + sync
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Connexion avec l base MySQL de DGCC réussie");

    // Vérifier que sync fonctionne
    //await sequelize.sync({ alter: true });
    await sequelize.sync();
    console.log("✅ Tables synchronisées avec succès");

    // Vérifier que les tables existent
    // const tables = await sequelize.query("SHOW TABLES");
    // console.log(
    //   "📋 Tables créées:",
    //   tables[0].map((t) => Object.values(t)[0]),
    // );

    // 3️⃣ SEEDER APRÈS sync
    await require("./seeders/001-permissions.seeder")();

    app.listen(process.env.PORT, '0.0.0.0',() => {
      console.log(`🚀 Serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur:", err);
  });
