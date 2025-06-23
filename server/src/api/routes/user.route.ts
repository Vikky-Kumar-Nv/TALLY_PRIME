import { Router } from "express";
import { UserController } from "../controllers";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const user = Router();

// 🔑 Authentication routes
user.post("/create", UserController.createUser); //🔓
user.get("/login", UserController.login); //🔐
user.get("/logout", UserController.logout); //🚪
// 🛡️ Apply authentication and admin role middleware for protected routes
user.use(authenticate, isAdmin);



export default user;
