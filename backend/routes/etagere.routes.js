const router = require("express").Router();
const ctrl = require("../controllers/etagere.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  authorizePermission("etagere", "create"),
  verifyToken,
  ctrl.create,
);
router.get(
  "/",
  verifyToken,
  authorizePermission("etagere", "read"),
  ctrl.findAll,
);
router.get(
  "/:id",
  verifyToken,
  authorizePermission("etagere", "read"),
  ctrl.findById,
);
router.put(
  "/:id",
  verifyToken,
  authorizePermission("etagere", "update"),
  ctrl.update,
);
router.delete(
  "/:id",
  verifyToken,
  authorizePermission("etagere", "delete"),
  ctrl.delete,
);

router.get(
  "/:id/box",
  verifyToken,
  authorizePermission("etagere", "read"),
  ctrl.getAllBoxByEtagere,
);

module.exports = router;
