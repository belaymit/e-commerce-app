import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";
import { addAddress, deleteAddress, listAddresses } from "../controllers/users";
import { errorHandler } from "../error-handler";

const usersRouter: Router = Router();
usersRouter.post("/address", [authMiddleware, adminMiddleware], errorHandler(addAddress));
usersRouter.delete("/address/:id", [authMiddleware, adminMiddleware], errorHandler(deleteAddress));
usersRouter.get("/address", [authMiddleware, adminMiddleware], errorHandler(listAddresses));

export default usersRouter;