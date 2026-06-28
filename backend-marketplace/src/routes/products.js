const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  authorizeRoles,
  requireAuth,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, authorizeRoles("ADMIN", "CUSTOMER"), getProducts);
router.get("/:id", requireAuth, authorizeRoles("ADMIN", "CUSTOMER"), getProductById);
router.post("/", requireAuth, authorizeRoles("ADMIN"), createProduct);
router.put("/:id", requireAuth, authorizeRoles("ADMIN"), updateProduct);
router.delete("/:id", requireAuth, authorizeRoles("ADMIN"), deleteProduct);

module.exports = router;
