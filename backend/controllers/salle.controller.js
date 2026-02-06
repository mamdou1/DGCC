const { Salle, Rayon, sequelize, Trave, Site, Box } = require("../models");

// exports.create = async (req, res) => {
//   const data = await Salle.create(req.body);
//   res.json(data);
// };

exports.create = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      site_id,
      code_salle,
      libelle,
      mb_rayons,
      mb_traves_par_rayon,
      nb_box,
      sigle_rayon,
      sigle_trave,
      sigle_box,
    } = req.body;

    //1. Créer la salle
    const salle = await Salle.create(
      {
        site_id,
        code_salle,
        libelle,
      },
      { transaction: t },
    );

    // 2. Générer les rayons
    for (let i = 1; i <= mb_rayons; i++) {
      const rayonsCode = `${sigle_rayon}${i}`;
      const rayon = await Rayon.create(
        {
          code: rayonsCode,
          salle_id: salle.id,
        },
        { transaction: t },
      );

      // 3. Générer les travées pour chaque Rayon
      for (let j = 1; j <= mb_traves_par_rayon; j++) {
        // CORRECTION 1 : Utiliser "j" pour le code de la travée, pas "i"
        const traveCode = `${sigle_trave}${j}`;

        const trave = await Trave.create(
          {
            code: traveCode,
            // CORRECTION 2 : Lier à rayon.id, pas salle.id (selon votre hiérarchie)
            rayon_id: rayon.id,
          },
          { transaction: t },
        );

        // 4. Générer les box pour chaque trave
        for (let k = 1; k <= nb_box; k++) {
          // CORRECTION 1 : Utiliser "k" pour le code de la box, pas "j"
          const boxCode = `${sigle_box}${k}`;

          await Box.create(
            {
              code: boxCode,
              // CORRECTION 2 : Lier à trave.id, pas ryon.id (selon votre hiérarchie)
              trave_id: trave.id,
            },
            { transaction: t },
          );
        }
      }
    }

    // Validation de tous les changements
    await t.commit();
    res.status(201).json(salle);
  } catch (err) {
    // Maintenant t.rollback() fonctionnera car t est bien la transaction
    if (t) await t.rollback();
    console.error(err);
    res.status(500).json({
      message: "Erreur serveur lors de la génération",
      error: err.message,
    });
  }
};

exports.findAll = async (req, res) => {
  const data = await Salle.findAll({
    include: [
      {
        model: Site,
        as: "site", // Vérifie que cet alias correspond à celui dans Rayon.associate
      },
    ],
  });
  res.json(data);
};

exports.findById = async (req, res) => {
  const data = await Salle.findByPk(req.params.id);
  res.json(data);
};

exports.update = async (req, res) => {
  await Salle.update(req.body, { where: { id: req.params.id } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  await Salle.destroy({ where: { id: req.params.id } });
  res.json({ success: true });
};

exports.getAllRayonBySalle = async (req, res) => {
  const data = await Rayon.findAll({
    where: { salle_id: req.params.id },
  });
  res.json(data);
};
