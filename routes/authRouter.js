import express from "express";
import {
  register,
  login,
  logout,
  currentUser,
  updateUserSubscription,
} from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSubscriptionSchema,
} from "../schemas/authSchemas.js";
import { auth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), register);
authRouter.post("/login", validateBody(loginUserSchema), login);
authRouter.get("/logout", auth, logout);
authRouter.get("/current", auth, currentUser);
authRouter.patch(
  "/",
  validateBody(updateUserSubscriptionSchema),
  auth,
  updateUserSubscription
);

export default authRouter;
