// routes/entiteeQuatre.routes.js
const express = require("express");
const router = express.Router();
const entiteeQuatreController = require("../controllers/entiteeQuatre.controller");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("entiteeQuatre", "create"),
  entiteeQuatreController.createEntiteeQuatre,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("entiteeQuatre", "read"),
  entiteeQuatreController.getAllEntiteeQuatre,
);

router.get(
  "/titre",
  verifyToken,
  authorizePermission("entiteeQuatre", "read"),
  entiteeQuatreController.getEntiteeQuatreTitre,
);

router.put(
  "/titre",
  verifyToken,
  authorizePermission("entiteeQuatre", "update"),
  entiteeQuatreController.updateEntiteeQuatreTitre,
);

router.get(
  "/by-entiteeTrois/:entiteeTroisId",
  verifyToken,
  authorizePermission("entiteeQuatre", "read"),
  entiteeQuatreController.getEntiteeQuatreByEntiteeTrois,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("entiteeQuatre", "read"),
  entiteeQuatreController.getFunctionsByEntiteeQuatre,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("entiteeQuatre", "update"),
  entiteeQuatreController.updateEntiteeQuatre,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("entiteeQuatre", "delete"),
  entiteeQuatreController.deleteEntiteeQuatre,
);

module.exports = router;
