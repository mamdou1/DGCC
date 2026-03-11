const express = require("express");
const router = express.Router();
// const { verifyToken } = require("../middlewares/auth.middleware");
// const {
//   authorizePermission,
// } = require("../middlewares/authorizePermission.middleware");

const {
  getDocumentFullByID,
  getAllDocumentsFull,
} = require("../controllers/dgcc.controller");

/*
=========================================
GET UN DOCUMENT COMPLET
=========================================
URL :
GET /api/dgcc/documents/:id/full
=========================================
*/

router.get(
  "/full",
  // verifyToken,
  // authorizePermission("document", "read"),
  getAllDocumentsFull,
);

// routes/dgcc.routes.js
router.get("/test-public", (req, res) => {
  res.json({ message: "Route publique OK", headers: req.headers });
});

router.get(
  "/:id/full",
  // verifyToken,
  // authorizePermission("document", "read"),
  getDocumentFullByID,
);
module.exports = router;
