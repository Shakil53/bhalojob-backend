import express from "express";
import { registerUser } from "../controllers/user/registration.controller.js";
import { loginUser, logoutUser } from "../controllers/user/login.controller.js";


const router = express.Router();


const userRoute = router;


userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.post("/logout", logoutUser);

export default userRoute;
