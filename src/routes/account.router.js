import express from "express";

import * as accountController from "../controllers/account.controller.js";
import { authenticate, requireAdmin, requireSelfOrAdmin } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";

const router = express.Router();

router.post("/register", validate("register"), accountController.register);
router.post("/login", accountController.login);
router.get(
  "/user/:user",
  authenticate,
  validate("userParam", "params"),
  accountController.getUser,
);
router.patch(
  "/user/:user",
  authenticate,
  requireAdmin,
  validate("userParam", "params"),
  validate("updateUser"),
  accountController.updateUser,
);
router.delete(
  "/user/:user",
  authenticate,
  validate("userParam", "params"),
  requireSelfOrAdmin("user"),
  accountController.deleteUser,
);
router.patch(
  "/user/:user/role/:role",
  authenticate,
  requireAdmin,
  validate("userRoleParams", "params"),
  accountController.addRole,
);
router.delete(
  "/user/:user/role/:role",
  authenticate,
  requireAdmin,
  validate("userRoleParams", "params"),
  accountController.deleteRole,
);
router.patch(
  "/password",
  authenticate,
  validate("changePassword"),
  accountController.changePassword,
);

export default router;
