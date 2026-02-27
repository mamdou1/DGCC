const express = require("express");
const router = express.Router();
const directionController = require("../controllers/direction.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("direction", "create"),
  directionController.create,
);

router.get(
  "/",
  verifyToken,
  authorizePermission("direction", "read"),
  directionController.findAll,
);

router.get(
  "/:id",
  verifyToken,
  authorizePermission("direction", "read"),
  directionController.findOne,
);

router.get(
  "/:id/fonctions",
  verifyToken,
  authorizePermission("direction", "read"),
  directionController.getFunctionsByDirection,
);

router.get(
  "/:id/sous-directions",
  verifyToken,
  authorizePermission("direction", "read"),
  directionController.getSousDirections,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("direction", "update"),
  directionController.update,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("direction", "delete"),
  directionController.delete,
);

module.exports = router;
