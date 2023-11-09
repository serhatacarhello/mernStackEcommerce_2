import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:token", resetPassword);
router.get("/me", auth.authenticationMid, userDetail);

export default router;
