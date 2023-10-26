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
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/products", allProducts);
router.delete(
  "/admin/products",
  auth.authenticationMid,
  auth.roleChecked("admin"),
  adminProducts
);
router.get("/products/:id", detailProduct);

router.post(
  "/product/new",
  auth.authenticationMid,
  auth.roleChecked("admin"),
  createProduct
);
router.post("/products/newReview", auth.authenticationMid, createReview);
router.put(
  "/products/:id",
  auth.authenticationMid,
  auth.roleChecked("admin"),
  updateProduct
);
router.delete(
  "/products/:id",
  auth.authenticationMid,
  auth.roleChecked("admin"),
  deleteProduct
);

export default router;
