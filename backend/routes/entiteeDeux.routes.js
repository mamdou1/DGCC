const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");
const entiteeDeuxController = require("../controllers/entiteeDeux.controller");

router.post(
  "/",
  verifyToken,
  authorizePermission("division", "create"),
  entiteeDeuxController.createEntiteeDeux,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("division", "read"),
  entiteeDeuxController.getAllEntiteeDeux,
);
router.get(
  "/by-entiteeUn/:entiteeUnId",
  verifyToken,
  authorizePermission("division", "read"),
  entiteeDeuxController.getEntiteeDeuxByEntiteeUn,
);

// ✅ DÉPLACER ICI
router.get(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeDeuxController.getEntiteeDeuxTitre,
);
// router.post(
//   "/titre",
//   verifyToken,
//   authorizePermission("section", "create"),
//   entiteeDeuxController.createEntiteeDeuxTitre,
// );
router.put(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeDeuxController.updateEntiteeDeuxTitre,
);

// ❌ APRÈS
router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("division", "read"),
  entiteeDeuxController.getFunctionsByEntiteeDeux,
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("division", "update"),
  entiteeDeuxController.updateEntiteeDeux,
);
router.delete("/:id", verifyToken, entiteeDeuxController.deleteEntiteeDeux);

module.exports = router;
