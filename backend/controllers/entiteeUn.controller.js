const { EntiteeUn, Fonction } = require("../models");

// exports.createEntiteeUn = async (req, res) => {
//   console.log("data reçu avant traitement : ", req.body);

//   try {
//     const entitee_un = await EntiteeUn.create(req.body);
//     res.status(201).json(entitee_un);
//     console.log("data après traitement : ", req.body);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Erreur création entitee_un", error: err.message });
//   }
// };

exports.createEntiteeUn = async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body reçu:", req.body);
  console.log("Type de body:", typeof req.body);

  try {
    console.log("Tentative de création...");

    // 1. Trouver le titre utilisé par les autres éléments
    const exemple = await EntiteeUn.findOne({ attributes: ["titre"] });
    const titreGlobal = exemple.titre;

    // 2. Créer l'élément avec le titre récupéré
    const entitee_un = await EntiteeUn.create({
      ...req.body,
      titre: titreGlobal,
    });
    console.log("Création réussie:", entitee_un);

    res.status(201).json(entitee_un);
  } catch (err) {
    console.error("Erreur détaillée:", err);
    res.status(500).json({
      message: "Erreur création entitee_un",
      error: err.message,
      stack: err.stack, // Pour plus de détails
    });
  }
};

// exports.createEntiteeUnTitre = async (req, res) => {
//   try {
//     const { titre } = req.body;

//     // Vérification basique
//     if (!titre) {
//       return res.status(400).json({ message: "le champs titre est requis" });
//     }

//     // Création
//     const titres = await EntiteeUn.create({
//       titre,
//     });

//     res.status(201).json(titres);
//   } catch (err) {
//     console.error("❌ Erreur création titre:", err);
//     res.status(500).json({
//       message: "Erreur lors de la création du titre",
//       error: err.message,
//     });
//   }
// };

exports.getAllEntiteeUn = async (req, res) => {
  try {
    const entitee_un = await EntiteeUn.findAll();
    res.json(entitee_un);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur récupération entitee_un", error: err.message });
  }
};

exports.getEntiteeUnTitre = async (req, res) => {
  try {
    const entitee = await EntiteeUn.findOne({
      attributes: ["titre"], // on récupère uniquement le titre
    });

    if (!entitee) {
      return res
        .status(404)
        .json({ message: "Aucun titre trouvé pour EntiteeUn" });
    }

    res.json({ titre: entitee.titre });
  } catch (err) {
    console.error("❌ Erreur getEntiteeUnTitre:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateEntiteeUnTitre = async (req, res) => {
  try {
    const { titre } = req.body;
    if (!titre) {
      return res.status(400).json({ message: "Le champ 'titre' est requis" });
    }

    // 1. Vérifier s'il y a au moins un enregistrement
    const count = await EntiteeUn.count();

    if (count === 0) {
      // SI vide : On crée une entrée "modèle" pour initialiser le titre
      // (Optionnel : vous pouvez aussi créer une entrée avec des champs vides)
      await EntiteeUn.create({
        titre: titre,
      });
      return res.json({ message: "Titre initial créé", titre });
    }

    // 2. SI la table n'est pas vide : On met à jour TOUTES les lignes d'un coup
    // .update({ champs }, { where: {} }) applique le changement à 100% de la table
    await EntiteeUn.update({ titre: titre }, { where: {} });

    res.json({ message: "Titre mis à jour pour tous les éléments", titre });
  } catch (err) {
    console.error("❌ Erreur updateEntiteeUnTitre:", err);
    res.status(500).json({ message: err.message });
  }
};

// Récupère les fonctions liées directement à ce EntiteeUn [cite: 3, 5]
exports.getFunctionsByEntiteeUn = async (req, res) => {
  try {
    const fonctions = await Fonction.findAll({
      where: { entitee_un_id: req.params.id },
    });
    res.json(fonctions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur récupération fonctions", error: err.message });
  }
};

exports.updateEntiteeUn = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const ent = await EntiteeUn.findByPk(id);
    if (!ent) return res.status(404).json({ message: "EntiteeUn non trouvé" });

    await ent.update(payload);
    res.status(200).json(ent);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur mise à jour EntiteeUn", error: err.message });
  }
};

exports.deleteEntiteeUn = async (req, res) => {
  try {
    const { id } = req.params;
    const ent = await EntiteeUn.findByPk(id);

    if (!ent) return res.status(404).json({ message: "EntiteeUn non trouvé" });

    await ent.destroy();
    res.status(200).json({ message: "EntiteeUn supprimé" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur suppresion EntiteeUn", error: err.message });
  }
};
