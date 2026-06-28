const express = require("express");
const { getCategories } = require("../controllers/category.controller");
const {
  authorizeRoles,
  requireAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, authorizeRoles("ADMIN", "CUSTOMER"), getCategories);

module.exports = router;

