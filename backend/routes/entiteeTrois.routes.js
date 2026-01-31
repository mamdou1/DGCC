const express = require("express");
const router = express.Router();
const entiteeTroisController = require("../controllers/entiteeTrois.controller");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("section", "create"),
  entiteeTroisController.createEntiteeTrois,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("section", "read"),
  entiteeTroisController.getAllEntiteeTrois,
);

// ✅ DÉPLACER ICI
router.get(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeTroisController.getEntiteeTroisTitre,
);
// router.post(
//   "/titre",
//   verifyToken,
//   authorizePermission("section", "create"),
//   entiteeTroisController.createEntiteeTroisTitre,
// );
router.put(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeTroisController.updateEntiteeTroisTitre,
);

// ❌ APRÈS
router.get(
  "/by-entiteeTrois/:entiteeDeuxId",
  verifyToken,
  authorizePermission("section", "read"),
  entiteeTroisController.getEntiteeTroisByEntiteeDeux,
);
router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("section", "read"),
  entiteeTroisController.getFunctionsByEntiteeTrois,
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("section", "update"),
  entiteeTroisController.updateEntiteeTrois,
);
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("section", "delete"),
  entiteeTroisController.deleteEntiteeTrois,
);

module.exports = router;
