const router = require("express").Router();
const ctrl = require("../controllers/salle.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post("/", verifyToken, ctrl.create);
router.get("/", verifyToken, ctrl.findAll);
router.get("/:id", verifyToken, ctrl.findById);
router.put("/:id", verifyToken, ctrl.update);
router.delete("/:id", verifyToken, ctrl.delete);

router.get("/:id/etagere", verifyToken, ctrl.getAllEtagereBySalle);

module.exports = router;
