const express = require("express");
const router = express.Router();
const entiteeUnController = require("../controllers/entiteeUn.controller");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("service", "create"),
  entiteeUnController.createEntiteeUn,
);
router.get(
  "/",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeUnController.getAllEntiteeUn,
);

// ✅ DÉPLACER ICI (Avant les routes avec :id)
router.get(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeUnController.getEntiteeUnTitre,
);
// router.post(
//   "/titre",
//   verifyToken,
//   authorizePermission("section", "create"),
//   entiteeUnController.createEntiteeUnTitre,
// );
router.put(
  "/titre",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeUnController.updateEntiteeUnTitre,
);

// ❌ CES ROUTES DOIVENT ÊTRE APRÈS
router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("service", "read"),
  entiteeUnController.getFunctionsByEntiteeUn,
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("service", "update"),
  entiteeUnController.updateEntiteeUn,
);
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("service", "delete"),
  entiteeUnController.deleteEntiteeUn,
);

module.exports = router;
