const { Trave, Box, Rayon } = require("../models");

// Créer une étagère
exports.create = async (req, res) => {
  try {
    const data = await Trave.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error("Erreur create Trave:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'étagère",
      error: error.message,
    });
  }
};

// Récupérer toutes les étagères
exports.findAll = async (req, res) => {
  try {
    const data = await Trave.findAll({
      include: [
        {
          model: Rayon,
          as: "rayon", // Vérifie que cet alias correspond à celui dans Rayon.associate
        },
      ],
    });
    res.json(data);
  } catch (error) {
    console.error("Erreur findAll Trave:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des étagères",
      error: error.message,
    });
  }
};

// Récupérer une étagère par ID
exports.findById = async (req, res) => {
  try {
    const data = await Trave.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Étagère non trouvée" });
    }
    res.json(data);
  } catch (error) {
    console.error("Erreur findById Trave:", error);
    res.status(500).json({
      message: "Erreur lors de la recherche de l'étagère",
      error: error.message,
    });
  }
};

// Mettre à jour une étagère
exports.update = async (req, res) => {
  try {
    const [updated] = await Trave.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated === 0) {
      return res.status(404).json({
        message: "Étagère non trouvée ou aucune modification effectuée",
      });
    }
    res.json({ success: true, message: "Étagère mise à jour" });
  } catch (error) {
    console.error("Erreur update Trave:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer une étagère
exports.delete = async (req, res) => {
  try {
    const deleted = await Trave.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ message: "Étagère non trouvée" });
    }
    res.json({ success: true, message: "Étagère supprimée" });
  } catch (error) {
    console.error("Erreur delete Trave:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Récupérer tous les cartons (boxes) d'une étagère spécifique
exports.getAllBoxByTrave = async (req, res) => {
  try {
    const data = await Box.findAll({
      where: { trave_id: req.params.id },
    });
    res.json(data);
  } catch (error) {
    console.error("Erreur getAllBoxByTrave:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des cartons",
      error: error.message,
    });
  }
};
