const { Rayon, Trave, Salle } = require("../models");

// Créer une étagère
exports.create = async (req, res) => {
  try {
    const data = await Rayon.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error("Erreur create Rayon:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'étagère",
      error: error.message,
    });
  }
};

// Récupérer toutes les étagères
exports.getRayons = async (req, res) => {
  try {
    const data = await Rayon.findAll({
      include: [
        {
          model: Salle,
          as: "salle", // Vérifie que cet alias correspond à celui dans Rayon.associate
        },
      ],
    });
    res.json(data);
  } catch (error) {
    console.error(error); // REGARDE TON TERMINAL (Console Node) pour voir l'erreur exacte
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une étagère par ID
exports.getRayonById = async (req, res) => {
  try {
    const data = await Rayon.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Étagère non trouvée" });
    }
    res.json(data);
  } catch (error) {
    console.error("Erreur findById Rayon:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche de l'étagère",
      error: error.message,
    });
  }
};

// Mettre à jour une étagère
exports.update = async (req, res) => {
  try {
    const [updated] = await Rayon.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated === 0) {
      return res.status(404).json({
        message: "Rayon non trouvée ou aucune modification effectuée",
      });
    }
    res.json({ success: true, message: "Étagère mise à jour" });
  } catch (error) {
    console.error("Erreur update Rayon:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer une étagère
exports.delete = async (req, res) => {
  try {
    const deleted = await Rayon.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ message: "Étagère non trouvée" });
    }
    res.json({ success: true, message: "Étagère supprimée" });
  } catch (error) {
    console.error("Erreur delete Rayon:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Récupérer tous les cartons (Travees) d'une étagère spécifique
exports.getAllTraveByRayon = async (req, res) => {
  try {
    const data = await Trave.findAll({
      where: { rayon_id: req.params.id },
    });
    res.json(data);
  } catch (error) {
    console.error("Erreur getAllTraveByRayon:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des cartons",
      error: error.message,
    });
  }
};
