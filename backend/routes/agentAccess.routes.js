const router = require("express").Router();
const ctrl = require("../controllers/agentAccess.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  authorizePermission,
} = require("../middlewares/authorizePermission.middleware");

router.post(
  "/",
  verifyToken,
  authorizePermission("agent-access", "create"),
  ctrl.grant,
);
router.get(
  "/",
  verifyToken,
  authorizePermission("agent-access", "read"),
  ctrl.list,
);
///
router.post(
  "/grant-all-sub-entity",
  verifyToken,
  authorizePermission("agent-access", "create"),
  ctrl.grantAllSubEntity,
);

router.delete(
  "/revoke-all-sub-entity",
  verifyToken,
  authorizePermission("agent-access", "delete"),
  ctrl.revokeAllSubEntity,
);
///
router.get(
  "/:agentId",
  verifyToken,
  authorizePermission("agent-access", "read"),
  ctrl.agentAccesById,
);

router.delete(
  "/:id",
  verifyToken,
  authorizePermission("agent-access", "delete"),
  ctrl.revoke,
);

router.put(
  "/:id",
  verifyToken,
  authorizePermission("agent-access", "update"),
  ctrl.update,
);

module.exports = router;
