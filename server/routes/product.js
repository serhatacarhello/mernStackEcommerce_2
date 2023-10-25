import express from "express";

import {
  allProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
  adminProducts,
} from "../controllers/product.js";

const router = express.Router();

router.get("/products", allProducts);
router.delete("/admin/products", adminProducts);
router.get("/products/:id", detailProduct);
router.post("/product/new", createProduct);
router.post("/products/newReview", createReview);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
